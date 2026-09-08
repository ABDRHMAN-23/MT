import type {
  Product,
  Category,
  Order,
  Customer,
  DiscountCode,
  Testimonial,
  Faq,
  Stats,
  Review,
} from './types';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  const text = await res.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    throw new Error('تعذّر الاتصال بالمطبخ الرقمي، حاول مرة أخرى');
  }
  if (!res.ok) {
    const msg = (payload as { error?: string })?.error || 'حدث خطأ غير متوقع';
    throw new Error(msg);
  }
  return payload as T;
}

const json = (body: unknown, method: string): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

function num(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function arr(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function normalizeProduct(raw: Record<string, unknown>): Product {
  return {
    ...(raw as unknown as Product),
    price: num(raw.price),
    compare_price: raw.compare_price == null ? null : num(raw.compare_price),
    rating: num(raw.rating, 5),
    reviews_count: num(raw.reviews_count),
    stock_qty: num(raw.stock_qty),
    sort_order: num(raw.sort_order),
    gallery: arr(raw.gallery),
    ingredients_ar: arr(raw.ingredients_ar),
    allergens_ar: arr(raw.allergens_ar),
    payment_methods: arr(raw.payment_methods),
  };
}

function normalizeOrder(raw: Record<string, unknown>): Order {
  const items = Array.isArray(raw.items)
    ? (raw.items as Order['items'])
    : typeof raw.items === 'string'
      ? (JSON.parse(raw.items as string) as Order['items'])
      : [];
  return {
    ...(raw as unknown as Order),
    items,
    subtotal: num(raw.subtotal),
    discount: num(raw.discount),
    delivery_fee: num(raw.delivery_fee),
    gift_wrap_fee: num(raw.gift_wrap_fee),
    total: num(raw.total),
  };
}

export const api = {
  products: async (params: Record<string, string | number | undefined> = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) qs.set(k, String(v));
    });
    const rows = await request<Record<string, unknown>[]>(`/api/products?${qs.toString()}`);
    return rows.map(normalizeProduct);
  },
  product: async (slug: string) => {
    const row = await request<Record<string, unknown>>(`/api/products?slug=${encodeURIComponent(slug)}`);
    return normalizeProduct(row);
  },
  createProduct: (body: Partial<Product>) => request<Product>('/api/products', json(body, 'POST')),
  updateProduct: (body: Partial<Product> & { id: number }) =>
    request<Product>('/api/products', json(body, 'PUT')),
  deleteProduct: (id: number) => request<{ ok: boolean }>('/api/products', json({ id }, 'DELETE')),

  categories: () => request<Category[]>('/api/categories'),
  createCategory: (body: Partial<Category>) => request<Category>('/api/categories', json(body, 'POST')),
  updateCategory: (body: Partial<Category> & { id: number }) =>
    request<Category>('/api/categories', json(body, 'PUT')),
  deleteCategory: (id: number) => request<{ ok: boolean }>('/api/categories', json({ id }, 'DELETE')),

  content: () => request<{ testimonials: Testimonial[]; faqs: Faq[] }>('/api/content'),
  createContent: <T>(type: 'testimonials' | 'faqs', body: Record<string, unknown>) =>
    request<T>('/api/content', json({ type, ...body }, 'POST')),
  updateContent: <T>(type: 'testimonials' | 'faqs', body: Record<string, unknown> & { id: number }) =>
    request<T>('/api/content', json({ type, ...body }, 'PUT')),
  deleteContent: (type: 'testimonials' | 'faqs', id: number) =>
    request<{ ok: boolean }>('/api/content', json({ type, id }, 'DELETE')),

  orders: async (params: Record<string, string | number | undefined> = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) qs.set(k, String(v));
    });
    const rows = await request<Record<string, unknown>[]>(`/api/orders?${qs.toString()}`);
    return rows.map(normalizeOrder);
  },
  order: async (code: string) => {
    const row = await request<Record<string, unknown>>(`/api/orders?code=${encodeURIComponent(code)}`);
    return normalizeOrder(row);
  },
  createOrder: async (body: unknown) => {
    const row = await request<Record<string, unknown>>('/api/orders', json(body, 'POST'));
    return normalizeOrder(row);
  },
  updateOrderStatus: (id: number, status: string) =>
    request<Order>('/api/orders', json({ id, status }, 'PUT')),
  deleteOrder: (id: number) => request<{ ok: boolean }>('/api/orders', json({ id }, 'DELETE')),

  customers: (search?: string) =>
    request<Customer[]>(`/api/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  deleteCustomer: (id: number) => request<{ ok: boolean }>('/api/customers', json({ id }, 'DELETE')),

  reviews: (params: { slug?: string; status?: string } = {}) => {
    const qs = new URLSearchParams();
    if (params.slug) qs.set('slug', params.slug);
    if (params.status) qs.set('status', params.status);
    return request<Review[]>(`/api/reviews?${qs.toString()}`);
  },
  createReview: (body: {
    product_slug: string;
    product_name_ar?: string;
    name: string;
    city?: string;
    rating: number;
    text_ar: string;
  }) => request<Review>('/api/reviews', json(body, 'POST')),
  updateReview: (id: number, status: string) =>
    request<Review>('/api/reviews', json({ id, status }, 'PUT')),
  deleteReview: (id: number) => request<{ ok: boolean }>('/api/reviews', json({ id }, 'DELETE')),

  discounts: () => request<DiscountCode[]>('/api/discounts'),
  validateDiscount: (code: string, subtotal: number) =>
    request<{ valid: boolean; amount?: number; reason?: string; code?: string; type?: string; value?: number }>(
      '/api/discounts',
      json({ action: 'validate', code, subtotal }, 'POST')
    ),
  createDiscount: (body: Partial<DiscountCode>) =>
    request<DiscountCode>('/api/discounts', json(body, 'POST')),
  updateDiscount: (body: Partial<DiscountCode> & { id: number }) =>
    request<DiscountCode>('/api/discounts', json(body, 'PUT')),
  deleteDiscount: (id: number) => request<{ ok: boolean }>('/api/discounts', json({ id }, 'DELETE')),

  stats: (days = 14) => request<Stats>(`/api/stats?days=${days}`),
};
