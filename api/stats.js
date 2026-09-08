import supabase from './db-client.js';
import { readSettings } from './settings.js';

const TZ = 'Asia/Riyadh';

// en-CA formats as YYYY-MM-DD, so this yields the calendar day in store time.
const dayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function dayKey(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return dayFormatter.format(d);
}

function sum(rows, key) {
  return rows.reduce((s, r) => s + Number(r[key] || 0), 0);
}

function trend(current, previous) {
  if (!previous) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'الطريقة غير مسموحة' });

    const range = Math.min(90, Math.max(7, Number(req.query.days) || 14));

    const [ordersRes, productsRes, customersRes, itemsRes, categoriesRes, settings] = await Promise.all([
      supabase.from('orders').select('*').order('id', { ascending: false }),
      supabase.from('products').select('*'),
      supabase.from('customers').select('*'),
      supabase.from('order_items').select('*'),
      supabase.from('categories').select('*'),
      readSettings().catch(() => ({ low_stock_threshold: 3 })),
    ]);

    if (ordersRes.error) throw ordersRes.error;
    if (productsRes.error) throw productsRes.error;

    const orders = ordersRes.data || [];
    const products = productsRes.data || [];
    const customers = customersRes.data || [];
    const items = itemsRes.data || [];
    const categories = categoriesRes.data || [];
    const lowStockThreshold = Number(settings.low_stock_threshold ?? 3);

    const live = orders.filter((o) => o.status !== 'cancelled');
    const revenue = sum(live, 'total');

    const statuses = ['new', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'];
    const byStatus = Object.fromEntries(
      statuses.map((s) => [s, orders.filter((o) => o.status === s).length])
    );

    // Bucket every order by its calendar day in store time (Riyadh), so a late
    // evening order is never counted on the following UTC day.
    const byDay = new Map();
    for (const o of orders) {
      const key = dayKey(o.created_at);
      if (!key) continue;
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key).push(o);
    }

    const keyForOffset = (offset) => dayKey(new Date(Date.now() - offset * 86400000));

    const days = [];
    for (let i = range - 1; i >= 0; i--) {
      const key = keyForOffset(i);
      const dayOrders = byDay.get(key) || [];
      days.push({
        date: key,
        orders: dayOrders.length,
        revenue: sum(
          dayOrders.filter((o) => o.status !== 'cancelled'),
          'total'
        ),
      });
    }

    const currentKeys = new Set(days.map((d) => d.date));
    const previousKeys = new Set();
    for (let i = range * 2 - 1; i >= range; i--) previousKeys.add(keyForOffset(i));

    const currentOrders = live.filter((o) => currentKeys.has(dayKey(o.created_at)));
    const previousOrders = live.filter((o) => previousKeys.has(dayKey(o.created_at)));

    const periodRevenue = sum(currentOrders, 'total');
    const prevRevenue = sum(previousOrders, 'total');

    const productTotals = new Map();
    for (const it of items) {
      const key = it.product_slug || it.name_ar || 'أخرى';
      const prev = productTotals.get(key) || {
        slug: it.product_slug,
        name_ar: it.name_ar,
        image: it.image,
        qty: 0,
        revenue: 0,
      };
      prev.qty += Number(it.qty || 0);
      prev.revenue += Number(it.line_total || 0);
      productTotals.set(key, prev);
    }
    const topProducts = [...productTotals.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 6);

    const productCategory = new Map(products.map((p) => [p.slug, p.category_slug]));
    const categoryName = new Map(categories.map((c) => [c.slug, c.name_ar]));
    const catTotals = new Map();
    for (const it of items) {
      const slug = productCategory.get(it.product_slug) || 'other';
      const prev = catTotals.get(slug) || {
        slug,
        name_ar: categoryName.get(slug) || 'أخرى',
        qty: 0,
        revenue: 0,
      };
      prev.qty += Number(it.qty || 0);
      prev.revenue += Number(it.line_total || 0);
      catTotals.set(slug, prev);
    }
    const byCategory = [...catTotals.values()].sort((a, b) => b.revenue - a.revenue);

    const cityTotals = new Map();
    for (const o of live) {
      const key = o.city || 'غير محدد';
      const prev = cityTotals.get(key) || { city: key, orders: 0, revenue: 0 };
      prev.orders += 1;
      prev.revenue += Number(o.total || 0);
      cityTotals.set(key, prev);
    }
    const byCity = [...cityTotals.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 6);

    const topCustomers = [...customers]
      .sort((a, b) => Number(b.total_spent || 0) - Number(a.total_spent || 0))
      .slice(0, 5)
      .map((c) => ({
        name: c.name,
        phone: c.phone,
        city: c.city,
        orders_count: c.orders_count,
        total_spent: Number(c.total_spent || 0),
      }));

    const giftOrders = orders.filter((o) => o.is_gift).length;
    const deliveredCount = byStatus.delivered || 0;
    const openOrders = orders.filter((o) =>
      ['new', 'preparing', 'ready', 'delivering'].includes(o.status)
    );

    const discountUsed = sum(live, 'discount');

    return res.status(200).json({
      range,
      revenue,
      periodRevenue,
      revenueTrend: trend(periodRevenue, prevRevenue),
      ordersCount: orders.length,
      periodOrders: currentOrders.length,
      ordersTrend: trend(currentOrders.length, previousOrders.length),
      avgOrder: live.length ? Math.round(revenue / live.length) : 0,
      customersCount: customers.length,
      repeatCustomers: customers.filter((c) => Number(c.orders_count || 0) > 1).length,
      productsCount: products.length,
      lowStock: products.filter(
        (p) => Number(p.stock_qty || 0) > 0 && Number(p.stock_qty || 0) <= lowStockThreshold
      ).length,
      outOfStock: products.filter((p) => !p.in_stock || Number(p.stock_qty || 0) <= 0).length,
      lowStockItems: products
        .filter((p) => Number(p.stock_qty || 0) <= lowStockThreshold)
        .sort((a, b) => Number(a.stock_qty || 0) - Number(b.stock_qty || 0))
        .slice(0, 6)
        .map((p) => ({ id: p.id, name_ar: p.name_ar, image: p.image, stock_qty: Number(p.stock_qty || 0), in_stock: p.in_stock })),
      giftOrders,
      giftRate: orders.length ? Math.round((giftOrders / orders.length) * 100) : 0,
      deliveredCount,
      openOrders: openOrders.length,
      openRevenue: sum(openOrders, 'total'),
      fulfillmentRate: orders.length ? Math.round((deliveredCount / orders.length) * 100) : 0,
      cancelRate: orders.length
        ? Math.round(((byStatus.cancelled || 0) / orders.length) * 100)
        : 0,
      discountUsed,
      byStatus,
      days,
      topProducts,
      byCategory,
      byCity,
      topCustomers,
      recentOrders: orders.slice(0, 8),
    });
  } catch (err) {
    console.error('stats api error:', err);
    return res.status(500).json({ error: err.message });
  }
}
