import supabase from './db-client.js';

const TABLES = { testimonials: 'testimonials', faqs: 'faqs' };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const table = TABLES[(req.body?.type || req.query?.type || '').toString()];

  try {
    if (req.method === 'GET') {
      const [testimonials, faqs] = await Promise.all([
        supabase.from('testimonials').select('*').order('sort_order', { ascending: true }),
        supabase.from('faqs').select('*').order('sort_order', { ascending: true }),
      ]);
      if (testimonials.error) throw testimonials.error;
      if (faqs.error) throw faqs.error;
      return res.status(200).json({
        testimonials: testimonials.data || [],
        faqs: faqs.data || [],
      });
    }

    if (!table) return res.status(400).json({ error: 'نوع المحتوى غير صحيح' });

    if (req.method === 'POST') {
      const { type, ...row } = req.body || {};
      void type;
      const { data, error } = await supabase.from(table).insert(row).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { type, id, ...patch } = req.body || {};
      void type;
      if (!id) return res.status(400).json({ error: 'المعرّف مطلوب' });
      const { data, error } = await supabase.from(table).update(patch).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const id = req.body?.id || req.query?.id;
      if (!id) return res.status(400).json({ error: 'المعرّف مطلوب' });
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'الطريقة غير مسموحة' });
  } catch (err) {
    console.error('content api error:', err);
    return res.status(500).json({ error: err.message });
  }
}
