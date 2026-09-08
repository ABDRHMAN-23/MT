import supabase from './db-client.js';

// Per-product payment restrictions live in a side table so the products table
// stays untouched. An empty/missing list means "all enabled methods allowed".
async function loadRules(ids) {
  if (!ids.length) return new Map();
  const { data } = await supabase
    .from('product_payment_rules')
    .select('product_id, methods')
    .in('product_id', ids);
  return new Map((data || []).map((r) => [r.product_id, Array.isArray(r.methods) ? r.methods : []]));
}

function attachRules(rows, rules) {
  return rows.map((p) => ({ ...p, payment_methods: rules.get(p.id) || [] }));
}

async function saveRule(productId, methods) {
  if (!productId || !Array.isArray(methods)) return;
  await supabase.from('product_payment_rules').upsert({
    product_id: productId,
    methods,
    updated_at: new Date().toISOString(),
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { slug, category, search, featured, best, fresh, seasonal, sort, limit, exclude } = req.query;

      if (slug) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'لم نعثر على هذه الحلوى' });
        const rules = await loadRules([data.id]);
        return res.status(200).json(attachRules([data], rules)[0]);
      }

      let q = supabase.from('products').select('*');

      if (category && category !== 'all') {
        if (category === 'bestsellers') q = q.eq('is_best_seller', true);
        else if (category === 'new') q = q.eq('is_new', true);
        else q = q.eq('category_slug', category);
      }

      if (search) {
        const term = String(search).replace(/[,()%*\\]/g, ' ').trim();
        if (term) {
          q = q.or(
            `name_ar.ilike.%${term}%,tagline_ar.ilike.%${term}%,description_ar.ilike.%${term}%,name_en.ilike.%${term}%`
          );
        }
      }

      if (featured === 'true') q = q.eq('is_featured', true);
      if (best === 'true') q = q.eq('is_best_seller', true);
      if (fresh === 'true') q = q.eq('is_new', true);
      if (seasonal === 'true') q = q.eq('is_seasonal', true);
      if (exclude) q = q.neq('slug', exclude);

      switch (sort) {
        case 'price_asc':
          q = q.order('price', { ascending: true });
          break;
        case 'price_desc':
          q = q.order('price', { ascending: false });
          break;
        case 'newest':
          q = q.order('id', { ascending: false });
          break;
        case 'rating':
          q = q.order('rating', { ascending: false });
          break;
        default:
          q = q.order('sort_order', { ascending: true });
      }

      if (limit) q = q.limit(Number(limit));

      const { data, error } = await q;
      if (error) throw error;
      const rules = await loadRules((data || []).map((p) => p.id));
      return res.status(200).json(attachRules(data || [], rules));
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const row = {
        slug: body.slug || `dessert-${Date.now().toString(36)}`,
        name_ar: body.name_ar,
        name_en: body.name_en || '',
        tagline_ar: body.tagline_ar || '',
        description_ar: body.description_ar || '',
        category_slug: body.category_slug || 'mousse',
        price: Number(body.price) || 0,
        compare_price: body.compare_price ? Number(body.compare_price) : null,
        image: body.image || '/img/p-chocolate.webp',
        gallery: body.gallery || [body.image || '/img/p-chocolate.webp', '/img/detail-section.webp'],
        ingredients_ar: body.ingredients_ar || [],
        allergens_ar: body.allergens_ar || [],
        serving_ar: body.serving_ar || 'يكفي من ٦ إلى ٨ أشخاص',
        storage_ar: body.storage_ar || 'يُحفظ مبرّدًا من ٢ إلى ٦ درجات مئوية',
        weight_ar: body.weight_ar || '١٢٠٠ غرام',
        in_stock: body.in_stock !== false,
        stock_qty: body.stock_qty != null ? Number(body.stock_qty) : 10,
        is_featured: !!body.is_featured,
        is_best_seller: !!body.is_best_seller,
        is_new: body.is_new !== false,
        is_seasonal: !!body.is_seasonal,
        rating: body.rating ? Number(body.rating) : 5,
        reviews_count: body.reviews_count ? Number(body.reviews_count) : 0,
        accent: body.accent || '#4B3325',
        sort_order: body.sort_order != null ? Number(body.sort_order) : 99,
      };
      if (!row.name_ar) return res.status(400).json({ error: 'اسم الحلوى مطلوب' });

      const { data, error } = await supabase.from('products').insert(row).select().single();
      if (error) throw error;
      if (Array.isArray(body.payment_methods)) await saveRule(data.id, body.payment_methods);
      return res.status(201).json({ ...data, payment_methods: body.payment_methods || [] });
    }

    if (req.method === 'PUT') {
      const { id, ...patch } = req.body || {};
      if (!id) return res.status(400).json({ error: 'المعرّف مطلوب' });
      const allowed = [
        'name_ar', 'name_en', 'tagline_ar', 'description_ar', 'category_slug', 'price',
        'compare_price', 'image', 'gallery', 'ingredients_ar', 'allergens_ar', 'serving_ar',
        'storage_ar', 'weight_ar', 'in_stock', 'stock_qty', 'is_featured', 'is_best_seller',
        'is_new', 'is_seasonal', 'rating', 'reviews_count', 'accent', 'sort_order',
      ];
      const update = {};
      for (const key of allowed) if (key in patch) update[key] = patch[key];
      if (update.price != null) update.price = Number(update.price);
      if (update.compare_price === '' || update.compare_price === 0) update.compare_price = null;
      if (update.compare_price != null) update.compare_price = Number(update.compare_price);
      if (update.stock_qty != null) {
        update.stock_qty = Number(update.stock_qty);
        update.in_stock = update.stock_qty > 0 ? (update.in_stock ?? true) : false;
      }

      if (Array.isArray(patch.payment_methods)) await saveRule(id, patch.payment_methods);

      // A payment-rules-only edit leaves nothing to update on the row itself.
      const query = Object.keys(update).length
        ? supabase.from('products').update(update).eq('id', id).select().single()
        : supabase.from('products').select('*').eq('id', id).single();

      const { data, error } = await query;
      if (error) throw error;
      const rules = await loadRules([id]);
      return res.status(200).json(attachRules([data], rules)[0]);
    }

    if (req.method === 'DELETE') {
      const id = req.body?.id || req.query?.id;
      if (!id) return res.status(400).json({ error: 'المعرّف مطلوب' });
      await supabase.from('product_payment_rules').delete().eq('product_id', id);
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'الطريقة غير مسموحة' });
  } catch (err) {
    console.error('products api error:', err);
    return res.status(500).json({ error: err.message });
  }
}
