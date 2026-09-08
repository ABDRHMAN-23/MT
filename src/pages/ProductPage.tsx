import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ChevronLeft,
  Heart,
  MessageCircle,
  Package,
  Share2,
  ShoppingBag,
  Snowflake,
  Truck,
  Users,
} from 'lucide-react';
import { api } from '../lib/api';
import type { Product } from '../lib/types';
import { useShop } from '../contexts/ShopContext';
import { useToast } from '../contexts/ToastContext';
import QuantityStepper from '../components/QuantityStepper';
import ProductCard from '../components/ProductCard';
import ProductReviews from '../components/ProductReviews';
import { Badge, Ornament, Price, ProductSkeleton, Stars } from '../components/ui/Bits';
import { Button, ButtonLink } from '../components/ui/Button';
import { discountPercent } from '../lib/format';
import { useLocale } from '../contexts/LocaleContext';
import { whatsappSimple } from '../lib/whatsapp';
import { useSettings } from '../contexts/SettingsContext';

const TABS = [
  { key: 'ingredients', label: 'product.ingredients' },
  { key: 'allergens', label: 'product.allergens' },
  { key: 'care', label: 'product.care' },
] as const;

export default function ProductPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const { add, toggleFavorite, isFavorite, setCartOpen } = useShop();
  const { toast } = useToast();
  const { settings } = useSettings();
  const { t, fmt, pick } = useLocale();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('ingredients');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      setQty(1);
      setActiveImg(0);
      try {
        const p = await api.product(slug);
        if (cancelled) return;
        setProduct(p);
        const rel = await api.products({ category: p.category_slug, exclude: p.slug, limit: 4 });
        if (!cancelled) setRelated(rel);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'تعذّر تحميل الحلوى');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="skeleton aspect-[4/5] rounded-5xl" />
          <div className="space-y-5 py-6">
            <div className="skeleton h-4 w-24 rounded-full" />
            <div className="skeleton h-9 w-3/4 rounded-full" />
            <div className="skeleton h-4 w-1/2 rounded-full" />
            <div className="skeleton h-24 w-full rounded-3xl" />
            <div className="skeleton h-14 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="rounded-5xl border border-line bg-ivory px-6 py-14">
          <AlertCircle size={36} className="mx-auto text-raspberry" />
          <h1 className="headline mt-5 text-2xl text-cocoa">لم نعثر على هذه الحلوى</h1>
          <p className="mt-3 text-sm leading-loose text-mocha">{error}</p>
          <div className="mt-7 flex justify-center gap-3">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              العودة
            </Button>
            <ButtonLink to="/shop">تصفّح المجموعة</ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const off = discountPercent(product.price, product.compare_price);
  const soldOut = !product.in_stock || product.stock_qty <= 0;
  const fav = isFavorite(product.id);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name_ar, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast('تم نسخ الرابط', { tone: 'info' });
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-10">
        <nav className="flex items-center gap-1.5 text-[12px] text-mocha" aria-label="مسار التصفح">
          <Link to="/" className="transition hover:text-cocoa">
            الرئيسية
          </Link>
          <ChevronLeft size={13} />
          <Link to="/shop" className="transition hover:text-cocoa">
            الحلويات
          </Link>
          <ChevronLeft size={13} />
          <span className="truncate text-cocoa">{product.name_ar}</span>
        </nav>
      </div>

      <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* -------------------------------------------------- gallery */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-5xl border border-line bg-ivory">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={gallery[activeImg]}
                  alt={product.name_ar}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={`aspect-[4/5] w-full object-cover ${soldOut ? 'saturate-50' : ''}`}
                />
              </AnimatePresence>

              <div className="absolute right-4 top-4 flex flex-col gap-2">
                {off && (
                  <span className="rounded-full bg-berry px-3 py-1.5 text-[11.5px] font-semibold text-ivory">
                    خصم {off}%
                  </span>
                )}
                {product.is_new && (
                  <span className="rounded-full bg-ivory/92 px-3 py-1.5 text-[11.5px] font-semibold text-gold backdrop-blur">
                    وصل حديثًا
                  </span>
                )}
              </div>

              <div className="absolute left-4 top-4 flex gap-2">
                <button
                  onClick={() => {
                    toggleFavorite(product.id);
                    toast(fav ? 'أُزيلت من مفضلتك' : 'أُضيفت إلى مفضلتك', {
                      description: product.name_ar,
                      tone: fav ? 'info' : 'love',
                    });
                  }}
                  aria-label="إضافة إلى المفضلة"
                  className={`grid h-10 w-10 place-items-center rounded-full border backdrop-blur transition ${
                    fav ? 'border-berry bg-berry text-ivory' : 'border-line bg-ivory/90 text-mocha hover:text-berry'
                  }`}
                >
                  <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={share}
                  aria-label="مشاركة"
                  className="grid h-10 w-10 place-items-center rounded-full border border-line bg-ivory/90 text-mocha backdrop-blur transition hover:text-cocoa"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {gallery.length > 1 && (
              <div className="mt-4 flex gap-3">
                {gallery.map((g, i) => (
                  <button
                    key={g + i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`عرض الصورة ${i + 1}`}
                    className={`overflow-hidden rounded-3xl border-2 transition ${
                      activeImg === i ? 'border-gold' : 'border-transparent opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img src={g} alt="" className="h-20 w-20 object-cover sm:h-24 sm:w-24" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* -------------------------------------------------- details */}
          <div>
            <p className="eyebrow text-[10px] text-gold">{product.name_en}</p>
            <h1 className="headline mt-3 text-3xl leading-relaxed text-cocoa lg:text-[2.7rem]">
              {pick(product.name_ar, product.name_en)}
            </h1>
            <p className="mt-3 text-[14.5px] leading-loose text-mocha">{product.tagline_ar}</p>

            <div className="mt-5 flex items-center gap-3">
              <Stars value={product.rating} size={15} />
              <a href="#reviews" className="num text-[12.5px] text-mocha transition hover:text-gold">
                {product.rating.toFixed(1)} · {product.reviews_count} {t('product.reviews')}
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Price value={product.price} compare={product.compare_price} size="lg" />
              {soldOut ? (
                <Badge tone="raspberry">{t('product.soldOutShort')}</Badge>
              ) : product.stock_qty <= 3 ? (
                <Badge tone="berry">{t('product.leftShort', { n: product.stock_qty })}</Badge>
              ) : (
                <Badge tone="pistachio">{t('product.inStock')}</Badge>
              )}
            </div>

            <div className="my-7 rule-gold" />

            <p className="text-[14px] leading-loose text-cocoa-2">{product.description_ar}</p>

            <div className="mt-7 grid grid-cols-3 gap-3">
              {[
                { icon: <Package size={15} />, label: t('product.weight'), value: product.weight_ar },
                { icon: <Users size={15} />, label: t('product.serves'), value: product.serving_ar },
                { icon: <Snowflake size={15} />, label: t('product.storage'), value: t('product.chilled') },
              ].map((c) => (
                <div key={c.label} className="rounded-3xl border border-line/70 bg-ivory p-3.5 text-center">
                  <span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-cream text-gold">
                    {c.icon}
                  </span>
                  <p className="mt-2.5 text-[10.5px] text-mocha">{c.label}</p>
                  <p className="mt-1 text-[11.5px] font-medium leading-snug text-cocoa">{c.value}</p>
                </div>
              ))}
            </div>

            {/* add to cart */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-mocha">{t('product.quantity')}</span>
                <QuantityStepper
                  value={qty}
                  onChange={setQty}
                  max={Math.max(1, product.stock_qty)}
                />
              </div>
              <Button
                size="lg"
                className="flex-1"
                disabled={soldOut}
                onClick={() => {
                  const ok = add(product, qty);
                  if (ok) {
                    toast('أُضيفت إلى صندوقك', {
                      description: `${product.name_ar} × ${qty}`,
                      tone: 'success',
                    });
                    setCartOpen(true);
                  } else {
                    toast('لا توجد كمية إضافية', { tone: 'error' });
                  }
                }}
              >
                <ShoppingBag size={18} />
                {soldOut
                  ? t('product.unavailable')
                  : `${t('product.addToBox')} · ${fmt(product.price * qty)}`}
              </Button>
            </div>

            {soldOut && (
              <div className="mt-4 flex items-start gap-2.5 rounded-3xl border border-berry/25 bg-berry/5 p-4">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-berry" />
                <p className="text-[12.5px] leading-relaxed text-cocoa-2">
                  نفدت كمية اليوم من هذه الحلوى. تواصل معنا عبر واتساب لحجزها في دفعة الغد.{' '}
                  <a
                    href={whatsappSimple(
                      `مرحبًا، أرغب بحجز «${product.name_ar}» عند توفرها`,
                      settings.whatsapp
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-berry underline"
                  >
                    احجز نسختك
                  </a>
                </p>
              </div>
            )}

            <div className="mt-5 flex items-center gap-2.5 rounded-3xl border border-line/70 bg-ivory px-4 py-3.5">
              <Truck size={16} className="shrink-0 text-gold" />
              <p className="text-[12.5px] leading-relaxed text-mocha">
                {t('product.deliveryNote')}{' '}
                <span className="num">{fmt(settings.free_delivery_from)}</span>
              </p>
            </div>

            {/* tabs */}
            <div className="mt-9">
              <div className="flex gap-1.5 border-b border-line">
                {TABS.map((tb) => (
                  <button
                    key={tb.key}
                    onClick={() => setTab(tb.key)}
                    className={`relative px-4 py-3 text-[13px] transition-colors ${
                      tab === tb.key ? 'text-cocoa' : 'text-mocha hover:text-cocoa-2'
                    }`}
                  >
                    {t(tb.label)}
                    {tab === tb.key && (
                      <motion.span layoutId="tab-line" className="absolute inset-x-3 -bottom-px h-0.5 bg-gold" />
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28 }}
                  >
                    {tab === 'ingredients' && (
                      <ul className="grid gap-2.5 sm:grid-cols-2">
                        {product.ingredients_ar.map((ing) => (
                          <li
                            key={ing}
                            className="flex items-center gap-2.5 rounded-2xl bg-ivory px-4 py-3 text-[13px] text-cocoa-2"
                          >
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                            {ing}
                          </li>
                        ))}
                      </ul>
                    )}
                    {tab === 'allergens' && (
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {product.allergens_ar.map((a) => (
                            <span
                              key={a}
                              className="rounded-full border border-berry/25 bg-berry/8 px-3.5 py-1.5 text-[12.5px] text-berry"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                        <p className="mt-5 text-[12.5px] leading-loose text-mocha">
                          تُحضَّر جميع حلوياتنا في مطبخ واحد قد يحتوي على المكسرات والحليب والغلوتين.
                          إن كان لديك حساسية شديدة، تواصل معنا قبل الطلب.
                        </p>
                      </div>
                    )}
                    {tab === 'care' && (
                      <dl className="space-y-4">
                        <div className="rounded-3xl bg-ivory p-4">
                          <dt className="text-[12px] text-gold">التقديم</dt>
                          <dd className="mt-1.5 text-[13.5px] leading-loose text-cocoa-2">
                            {product.serving_ar} — يُفضّل إخراجها من الثلاجة قبل ١٠ دقائق من التقديم
                            ليعود القوام إلى نعومته الكاملة.
                          </dd>
                        </div>
                        <div className="rounded-3xl bg-ivory p-4">
                          <dt className="text-[12px] text-gold">الحفظ</dt>
                          <dd className="mt-1.5 text-[13.5px] leading-loose text-cocoa-2">
                            {product.storage_ar}
                          </dd>
                        </div>
                      </dl>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <a
              href={whatsappSimple(
                `مرحبًا ${settings.brand_name_ar}، لدي سؤال حول «${product.name_ar}»`,
                settings.whatsapp
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-2 text-[13px] text-mocha transition hover:text-gold"
            >
              <MessageCircle size={15} />
              لديك سؤال عن هذه الحلوى؟ تحدّث معنا
            </a>
          </div>
        </div>

        <ProductReviews slug={product.slug} productName={product.name_ar} />
      </section>

      {/* related */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="text-center">
          <p className="eyebrow text-[10px] text-gold">Vous aimerez aussi</p>
          <h2 className="headline mt-3 text-2xl text-cocoa sm:text-3xl">حلويات تليق بذوقك</h2>
          <Ornament className="mt-5" />
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {related.length === 0
            ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            : related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>
    </>
  );
}
