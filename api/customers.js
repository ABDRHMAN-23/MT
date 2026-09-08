import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { search } = req.query;
      let q = supabase.from('customers').select('*').order('total_spent', { ascending: false });
      if (search) {
        const term = String(search).replace(/[,()%*\\]/g, ' ').trim();
        if (term) q = q.or(`name.ilike.%${term}%,phone.ilike.%${term}%,city.ilike.%${term}%`);
      }
      const { data, error } = await q;
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const id = req.body?.id || req.query?.id;
      if (!id) return res.status(400).json({ error: 'المعرّف مطلوب' });
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'الطريقة غير مسموحة' });
  } catch (err) {
    console.error('customers api error:', err);
    return res.status(500).json({ error: err.message });
  }
}
