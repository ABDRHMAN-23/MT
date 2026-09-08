import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartLine, Product } from '../lib/types';
import { useSettings } from './SettingsContext';

export const DELIVERY_FEE = 25;
export const FREE_DELIVERY_FROM = 300;
export const GIFT_WRAP_FEE = 25;

type AppliedDiscount = { code: string; amount: number; label: string } | null;

type ShopApi = {
  items: CartLine[];
  count: number;
  subtotal: number;
  discount: AppliedDiscount;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  freeFrom: number;
  giftWrapFee: number;
  add: (product: Product, qty?: number) => boolean;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  applyDiscount: (d: AppliedDiscount) => void;
  favorites: number[];
  toggleFavorite: (id: number) => boolean;
  isFavorite: (id: number) => boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
};

const ShopContext = createContext<ShopApi | null>(null);

const CART_KEY = 'mousserie.cart.v1';
const FAV_KEY = 'mousserie.favorites.v1';

function readStore<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const [items, setItems] = useState<CartLine[]>(() => readStore<CartLine[]>(CART_KEY, []));
  const [favorites, setFavorites] = useState<number[]>(() => readStore<number[]>(FAV_KEY, []));
  const [discount, setDiscount] = useState<AppliedDiscount>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const baseFee = Number(settings.delivery_fee ?? DELIVERY_FEE);
  const freeFrom = Number(settings.free_delivery_from ?? FREE_DELIVERY_FROM);
  const giftWrapFee = Number(settings.gift_wrap_fee ?? GIFT_WRAP_FEE);

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    window.localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [cartOpen]);

  const add = useCallback((product: Product, qty = 1) => {
    if (!product.in_stock || product.stock_qty <= 0) return false;
    let ok = true;
    setItems((prev) => {
      const existing = prev.find((l) => l.id === product.id);
      const max = Math.max(1, product.stock_qty);
      if (existing) {
        const next = Math.min(max, existing.qty + qty);
        if (next === existing.qty) ok = false;
        return prev.map((l) => (l.id === product.id ? { ...l, qty: next } : l));
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name_ar: product.name_ar,
          image: product.image,
          price: product.price,
          compare_price: product.compare_price,
          qty: Math.min(max, qty),
          stock_qty: max,
          payment_methods: product.payment_methods || [],
        },
      ];
    });
    return ok;
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    setItems((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: Math.max(0, Math.min(l.stock_qty, qty)) } : l))
        .filter((l) => l.qty > 0)
    );
  }, []);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setDiscount(null);
  }, []);

  const toggleFavorite = useCallback(
    (id: number) => {
      let added = false;
      setFavorites((prev) => {
        if (prev.includes(id)) return prev.filter((f) => f !== id);
        added = true;
        return [...prev, id];
      });
      return !favorites.includes(id) || added;
    },
    [favorites]
  );

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

  const subtotal = useMemo(() => items.reduce((s, l) => s + l.price * l.qty, 0), [items]);

  const discountAmount = useMemo(() => {
    if (!discount) return 0;
    return Math.min(discount.amount, subtotal);
  }, [discount, subtotal]);

  const deliveryFee = useMemo(() => {
    if (!items.length) return 0;
    return subtotal - discountAmount >= freeFrom ? 0 : baseFee;
  }, [items.length, subtotal, discountAmount, freeFrom, baseFee]);

  const value = useMemo<ShopApi>(
    () => ({
      items,
      count: items.reduce((s, l) => s + l.qty, 0),
      subtotal,
      discount,
      discountAmount,
      deliveryFee,
      total: Math.max(0, subtotal - discountAmount) + deliveryFee,
      freeFrom,
      giftWrapFee,
      add,
      setQty,
      remove,
      clear,
      applyDiscount: setDiscount,
      favorites,
      toggleFavorite,
      isFavorite,
      cartOpen,
      setCartOpen,
    }),
    [
      items,
      subtotal,
      discount,
      discountAmount,
      deliveryFee,
      freeFrom,
      giftWrapFee,
      add,
      setQty,
      remove,
      clear,
      favorites,
      toggleFavorite,
      isFavorite,
      cartOpen,
    ]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside ShopProvider');
  return ctx;
}
