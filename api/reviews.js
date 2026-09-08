import supabase from './db-client.js';

async function recompute(slug) {
  if (!slug) return;
  const { data: approved } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_slug', slug)
    .eq('status', 'approved');

  const rows = approved || [];
  const avg = rows.length ? rows.reduce((s, r) => s + Number(r.rating || 0), 0) / rows.length : 5;

  await supabase
    .from('products')
    .update({ rating: Math.round(avg * 10) / 10, reviews_count: rows.length })
    .eq('slug', slug);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { slug, status } = req.query;
      let q = supabase.from('reviews').select('*').order('id', { ascending: false });
      if (slug) q = q.eq('product_slug', slug);
      if (status && status !== 'all') q = q.eq('status', status);
      const { data, error } = await q;
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      if (!b.product_slug) return res.status(400).json({ error: 'الحلوى غير محددة' });
      if (!b.name || String(b.name).trim().length < 2) {
        return res.status(400).json({ error: 'اكتب اسمك من فضلك' });
      }
      if (!b.text_ar || String(b.text_ar).trim().length < 10) {
        return res.status(400).json({ error: 'اكتب رأيك في ١٠ أحرف على الأقل' });
      }

      const rating = Math.min(5, Math.max(1, Number(b.rating) || 5));
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_slug: b.product_slug,
          product_name_ar: b.product_name_ar || null,
          name: String(b.name).trim(),
          city: b.city ? String(b.city).trim() : null,
          rating,
          text_ar: String(b.text_ar).trim(),
          status: 'pending',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, status } = req.body || {};
      if (!id || !status) return res.status(400).json({ error: 'المعرّف والحالة مطلوبان' });
      const { data, error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      await recompute(data.product_slug);
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const id = req.body?.id || req.query?.id;
      if (!id) return res.status(400).json({ error: 'المعرّف مطلوب' });
      const { data: row } = await supabase.from('reviews').select('product_slug').eq('id', id).maybeSingle();
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      if (row) await recompute(row.product_slug);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'الطريقة غير مسموحة' });
  } catch (err) {
    console.error('reviews api error:', err);
    return res.status(500).json({ error: err.message });
  }
}
