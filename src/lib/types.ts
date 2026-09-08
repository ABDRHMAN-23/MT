export type Product = {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string;
  tagline_ar: string;
  description_ar: string;
  category_slug: string;
  price: number;
  compare_price: number | null;
  image: string;
  gallery: string[];
  ingredients_ar: string[];
  allergens_ar: string[];
  serving_ar: string;
  storage_ar: string;
  weight_ar: string;
  in_stock: boolean;
  stock_qty: number;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new: boolean;
  is_seasonal: boolean;
  rating: number;
  reviews_count: number;
  accent: string;
  sort_order: number;
  /** Allowed payment method values. Empty = every enabled method is allowed. */
  payment_methods: string[];
};

export type Category = {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  image: string;
  accent: string;
  sort_order: number;
};

export type CartLine = {
  id: number;
  slug: string;
  name_ar: string;
  image: string;
  price: number;
  compare_price: number | null;
  qty: number;
  stock_qty: number;
  payment_methods: string[];
};

export type OrderItem = {
  id: number | null;
  slug: string;
  name_ar: string;
  image: string;
  price: number;
  qty: number;
};

export type Order = {
  id: number;
  order_code: string;
  customer_name: string;
  phone: string;
  email: string | null;
  city: string;
  district: string | null;
  address: string | null;
  notes: string | null;
  is_gift: boolean;
  gift_recipient: string | null;
  gift_message: string | null;
  gift_wrap: boolean;
  delivery_date: string | null;
  delivery_slot: string | null;
  payment_method: string;
  subtotal: number;
  discount: number;
  discount_code: string | null;
  delivery_fee: number;
  gift_wrap_fee: number;
  total: number;
  status: string;
  items: OrderItem[];
  created_at: string;
};

export type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  city: string;
  orders_count: number;
  total_spent: number;
  last_order_at: string | null;
  created_at: string;
};

export type DiscountCode = {
  id: number;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  min_order: number;
  max_uses: number | null;
  used_count: number;
  active: boolean;
  expires_at: string | null;
  description_ar: string;
};

export type Testimonial = {
  id: number;
  name: string;
  city: string;
  text_ar: string;
  rating: number;
  product_ar: string;
  initial: string;
  sort_order: number;
};

export type Review = {
  id: number;
  product_slug: string;
  product_name_ar: string | null;
  name: string;
  city: string | null;
  rating: number;
  text_ar: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export type Faq = {
  id: number;
  q_ar: string;
  a_ar: string;
  sort_order: number;
};

export type Stats = {
  range: number;
  revenue: number;
  periodRevenue: number;
  revenueTrend: number;
  ordersCount: number;
  periodOrders: number;
  ordersTrend: number;
  avgOrder: number;
  customersCount: number;
  repeatCustomers: number;
  productsCount: number;
  lowStock: number;
  outOfStock: number;
  lowStockItems: {
    id: number;
    name_ar: string;
    image: string;
    stock_qty: number;
    in_stock: boolean;
  }[];
  giftOrders: number;
  giftRate: number;
  deliveredCount: number;
  openOrders: number;
  openRevenue: number;
  fulfillmentRate: number;
  cancelRate: number;
  discountUsed: number;
  byStatus: Record<string, number>;
  days: { date: string; orders: number; revenue: number }[];
  topProducts: { slug: string; name_ar: string; image: string; qty: number; revenue: number }[];
  byCategory: { slug: string; name_ar: string; qty: number; revenue: number }[];
  byCity: { city: string; orders: number; revenue: number }[];
  topCustomers: {
    name: string;
    phone: string;
    city: string;
    orders_count: number;
    total_spent: number;
  }[];
  recentOrders: Order[];
};
