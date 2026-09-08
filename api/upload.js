import supabase from './db-client.js';

const BUCKET = 'media';

export const config = {
  api: { bodyParser: { sizeLimit: '8mb' } },
};

function safeName(name = 'image') {
  const clean = String(name)
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/-+/g, '-')
    .slice(0, 48) || 'image';
  return clean;
}

function extFor(type = '', original = '') {
  const fromName = (original.match(/\.([a-z0-9]+)$/i) || [])[1];
  if (fromName) return fromName.toLowerCase();
  if (type.includes('png')) return 'png';
  if (type.includes('webp')) return 'webp';
  if (type.includes('avif')) return 'avif';
  if (type.includes('svg')) return 'svg';
  if (type.includes('gif')) return 'gif';
  return 'jpg';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.storage.from(BUCKET).list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (error) throw error;
      const files = (data || [])
        .filter((f) => f.name && !f.name.startsWith('.'))
        .map((f) => ({
          name: f.name,
          size: f.metadata?.size ?? 0,
          createdAt: f.created_at ?? null,
          url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
        }));
      return res.status(200).json({ files });
    }

    if (req.method === 'POST') {
      const { fileName, fileBase64, contentType } = req.body || {};
      if (!fileBase64) return res.status(400).json({ error: 'لم يتم استلام أي ملف' });

      const buffer = Buffer.from(fileBase64, 'base64');
      if (buffer.length > 4 * 1024 * 1024) {
        return res.status(400).json({ error: 'حجم الصورة أكبر من الحد المسموح' });
      }

      const ext = extFor(contentType, fileName);
      const path = `${safeName(fileName)}-${Date.now().toString(36)}.${ext}`;

      const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
        contentType: contentType || 'image/jpeg',
        upsert: true,
        cacheControl: '31536000',
      });
      if (error) throw error;

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return res.status(201).json({ url: urlData.publicUrl, name: path });
    }

    if (req.method === 'DELETE') {
      const name = req.body?.name || req.query?.name;
      if (!name) return res.status(400).json({ error: 'اسم الملف مطلوب' });
      const { error } = await supabase.storage.from(BUCKET).remove([name]);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'الطريقة غير مسموحة' });
  } catch (err) {
    console.error('upload api error:', err);
    return res.status(500).json({ error: err.message });
  }
}
