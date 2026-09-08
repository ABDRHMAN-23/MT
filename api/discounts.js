import supabase from './db-client.js';

function evaluate(code, subtotal) {
  const now = new Date();
  if (!code) return { valid: false, reason: 'رمز الخصم غير صحيح' };
  if (!code.active) return { valid: false, reason: 'هذا الرمز لم يعد مفعّلًا' };
  if (code.expires_at && new Date(code.expires_at) < now) {
    return { valid: false, reason: 'انتهت صلاحية هذا الرمز' };
  }
  if (code.max_uses && code.used_count >= code.max_uses) {
    return { valid: false, reason: 'تم استخدام هذا الرمز بالكامل' };
  }
  if (code.min_order && subtotal < Number(code.min_order)) {
    return {
      valid: false,
      reason: `الرمز يسري على الطلبات من ${Number(code.min_order)} ر.س فأكثر`,
    };
  }
  const amount =
    code.type === 'percent'
      ? Math.round((subtotal * Number(code.value)) / 100)
      : Math.min(Number(code.value), subtotal);
  return { valid: true, amount, code: code.code, type: code.type, value: Number(code.value), description_ar: code.description_ar };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const body = req.body || {};

      if (body.action === 'validate') {
        const raw = String(body.code || '').trim().toUpperCase();
        const subtotal = Number(body.subtotal) || 0;
        if (!raw) return res.status(200).json({ valid: false, reason: 'اكتب رمز الخصم أولًا' });

        const { data, error } = await supabase
          .from('discount_codes')
          .select('*')
          .eq('code', raw)
          .maybeSingle();
        if (error) throw error;
        if (!data) return res.status(200).json({ valid: false, reason: 'رمز الخصم غير موجود' });
        return res.status(200).json(evaluate(data, subtotal));
      }

      const row = {
        code: String(body.code || '').trim().toUpperCase(),
        type: body.type === 'fixed' ? 'fixed' : 'percent',
        value: Number(body.value) || 0,
        min_order: Number(body.min_order) || 0,
        max_uses: body.max_uses ? Number(body.max_uses) : null,
        used_count: 0,
        active: body.active !== false,
        expires_at: body.expires_at || null,
        description_ar: body.description_ar || '',
      };
      if (!row.code) return res.status(400).json({ error: 'رمز الخصم مطلوب' });
      const { data, error } = await supabase.from('discount_codes').insert(row).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, ...patch } = req.body || {};
      if (!id) return res.status(400).json({ error: 'المعرّف مطلوب' });
      const { data, error } = await supabase
        .from('discount_codes')
        .update(patch)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const id = req.body?.id || req.query?.id;
      if (!id) return res.status(400).json({ error: 'المعرّف مطلوب' });
      const { error } = await supabase.from('discount_codes').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'الطريقة غير مسموحة' });
  } catch (err) {
    console.error('discounts api error:', err);
    return res.status(500).json({ error: err.message });
  }
}
