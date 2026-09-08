import supabase from './db-client.js';
import { readSettings } from './settings.js';

function makeCode() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  const rand = Math.floor(Math.random() * 900 + 100);
  return `MS-${stamp}${rand}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { code, status, limit } = req.query;

      if (code) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('order_code', code)
          .maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'لم نعثر على هذا الطلب' });
        return res.status(200).json(data);
      }

      let q = supabase.from('orders').select('*').order('id', { ascending: false });
      if (status && status !== 'all') q = q.eq('status', status);
      if (limit) q = q.limit(Number(limit));
      const { data, error } = await q;
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      const items = Array.isArray(b.items) ? b.items : [];
      if (!items.length) return res.status(400).json({ error: 'صندوق الحلويات فارغ' });
      if (!b.customer_name || !b.phone) {
        return res.status(400).json({ error: 'الاسم ورقم الجوال مطلوبان' });
      }

      const settings = await readSettings().catch(() => ({
        delivery_fee: 25,
        free_delivery_from: 300,
        gift_wrap_fee: 25,
      }));

      // Enforce per-product payment restrictions server-side too.
      const requested = b.payment_method || 'cash';
      const productIds = items.map((it) => Number(it.id)).filter(Boolean);
      if (productIds.length) {
        const { data: rules } = await supabase
          .from('product_payment_rules')
          .select('product_id, methods')
          .in('product_id', productIds);
        const lists = (rules || [])
          .map((r) => (Array.isArray(r.methods) ? r.methods : []))
          .filter((l) => l.length > 0);
        if (lists.length) {
          const allowed = lists.reduce((acc, list) => acc.filter((v) => list.includes(v)));
          if (allowed.length && !allowed.includes(requested)) {
            return res
              .status(400)
              .json({ error: 'طريقة الدفع المختارة غير متاحة لإحدى الحلويات في صندوقك' });
          }
        }
      }

      const subtotal = items.reduce((s, it) => s + Number(it.price) * Number(it.qty), 0);
      let discount = 0;
      let discountCode = null;

      if (b.discount_code) {
        const raw = String(b.discount_code).trim().toUpperCase();
        const { data: dc } = await supabase
          .from('discount_codes')
          .select('*')
          .eq('code', raw)
          .maybeSingle();
        if (dc && dc.active && (!dc.max_uses || dc.used_count < dc.max_uses)) {
          const notExpired = !dc.expires_at || new Date(dc.expires_at) >= new Date();
          const meetsMin = !dc.min_order || subtotal >= Number(dc.min_order);
          if (notExpired && meetsMin) {
            discount =
              dc.type === 'percent'
                ? Math.round((subtotal * Number(dc.value)) / 100)
                : Math.min(Number(dc.value), subtotal);
            discountCode = dc.code;
            await supabase
              .from('discount_codes')
              .update({ used_count: (dc.used_count || 0) + 1 })
              .eq('id', dc.id);
          }
        }
      }

      const giftWrapFee = b.gift_wrap ? Number(settings.gift_wrap_fee ?? 25) : 0;
      const deliveryFee =
        subtotal - discount >= Number(settings.free_delivery_from ?? 300)
          ? 0
          : Number(settings.delivery_fee ?? 25);
      const total = Math.max(0, subtotal - discount) + deliveryFee + giftWrapFee;

      const row = {
        order_code: makeCode(),
        customer_name: b.customer_name,
        phone: b.phone,
        email: b.email || null,
        city: b.city || 'الرياض',
        district: b.district || null,
        address: b.address || null,
        notes: b.notes || null,
        is_gift: !!b.is_gift,
        gift_recipient: b.gift_recipient || null,
        gift_message: b.gift_message || null,
        gift_wrap: !!b.gift_wrap,
        delivery_date: b.delivery_date || null,
        delivery_slot: b.delivery_slot || null,
        payment_method: b.payment_method || 'cash',
        subtotal,
        discount,
        discount_code: discountCode,
        delivery_fee: deliveryFee,
        gift_wrap_fee: giftWrapFee,
        total,
        status: 'new',
        items,
        created_at: new Date().toISOString(),
      };

      const { data: order, error } = await supabase.from('orders').insert(row).select().single();
      if (error) throw error;

      const lineRows = items.map((it) => ({
        order_id: order.id,
        order_code: order.order_code,
        product_id: it.id ? Number(it.id) : null,
        product_slug: it.slug || null,
        name_ar: it.name_ar,
        image: it.image || null,
        price: Number(it.price),
        qty: Number(it.qty),
        line_total: Number(it.price) * Number(it.qty),
      }));
      if (lineRows.length) await supabase.from('order_items').insert(lineRows);

      for (const it of items) {
        if (!it.id) continue;
        const { data: p } = await supabase
          .from('products')
          .select('id, stock_qty')
          .eq('id', it.id)
          .maybeSingle();
        if (p) {
          const next = Math.max(0, Number(p.stock_qty || 0) - Number(it.qty));
          await supabase
            .from('products')
            .update({ stock_qty: next, in_stock: next > 0 })
            .eq('id', p.id);
        }
      }

      const { data: existing } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', row.phone)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('customers')
          .update({
            name: row.customer_name,
            city: row.city,
            email: row.email || existing.email,
            orders_count: (existing.orders_count || 0) + 1,
            total_spent: Number(existing.total_spent || 0) + total,
            last_order_at: row.created_at,
          })
          .eq('id', existing.id);
      } else {
        await supabase.from('customers').insert({
          name: row.customer_name,
          phone: row.phone,
          email: row.email,
          city: row.city,
          orders_count: 1,
          total_spent: total,
          last_order_at: row.created_at,
          created_at: row.created_at,
        });
      }

      return res.status(201).json(order);
    }

    if (req.method === 'PUT') {
      const { id, status } = req.body || {};
      if (!id || !status) return res.status(400).json({ error: 'المعرّف والحالة مطلوبان' });
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const id = req.body?.id || req.query?.id;
      if (!id) return res.status(400).json({ error: 'المعرّف مطلوب' });
      await supabase.from('order_items').delete().eq('order_id', id);
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'الطريقة غير مسموحة' });
  } catch (err) {
    console.error('orders api error:', err);
    return res.status(500).json({ error: err.message });
  }
}
