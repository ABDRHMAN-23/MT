import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  Gift,
  Leaf,
  MessageCircle,
  Snowflake,
  Sparkles,
  Truck,
  Clock,
} from 'lucide-react';
import { api } from '../lib/api';
import type { Category, Faq, Product, Testimonial } from '../lib/types';
import ProductCard from '../components/ProductCard';
import { Badge, Ornament, Price, ProductSkeleton, Reveal, SectionHead, Stars } from '../components/ui/Bits';
import { ButtonLink } from '../components/ui/Button';
import { whatsappSimple } from '../lib/whatsapp';
import { useLocale } from '../contexts/LocaleContext';
import { BrandSealBand, BrandSealMedallion } from '../components/BrandSeal';
import { useSettings } from '../contexts/SettingsContext';

type HomeData = {
  categories: Category[];
  featured: Product[];
  best: Product[];
  fresh: Product[];
  seasonal: Product[];
  testimonials: Testimonial[];
  faqs: Faq[];
};

const EMPTY: HomeData = {
  categories: [],
  featured: [],
  best: [],
  fresh: [],
  seasonal: [],
  testimonials: [],
  faqs: [],
};

export default function Home() {
  const [data, setData] = useState<HomeData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categories, featured, best, fresh, seasonal, content] = await Promise.all([
        api.categories(),
        api.products({ featured: 'true', limit: 4 }),
        api.products({ best: 'true', limit: 8 }),
        api.products({ fresh: 'true', limit: 4 }),
        api.products({ seasonal: 'true', limit: 3 }),
        api.content(),
      ]);
      setData({
        categories,
        featured,
        best,
        fresh,
        seasonal,
        testimonials: content.testimonials,
        faqs: content.faqs,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذّر تحميل المحتوى');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const heroProduct = data.featured[0] ?? data.best[0] ?? null;

  return (
    <>
      <Hero product={heroProduct} />
      <BrandSealBand />
      <TrustStrip />

      {error && (
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="rounded-4xl border border-raspberry/25 bg-raspberry/5 px-6 py-8 text-center">
            <p className="headline text-lg text-berry">تعذّر تحميل الحلويات</p>
            <p className="mt-2 text-sm text-mocha">{error}</p>
            <button
              onClick={load}
              className="mt-5 inline-flex h-11 items-center rounded-full bg-cocoa px-7 text-sm text-cream transition hover:bg-cocoa-2"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

      <Categories items={data.categories} loading={loading} />
      <Featured items={data.featured} loading={loading} />
      <BestSellers items={data.best} loading={loading} />
      <Seasonal items={data.seasonal} />
      <NewArrivals items={data.fresh} loading={loading} />

      <PromoBand />
      <Story />
      <Testimonials items={data.testimonials} />
      <Delivery />
      <FaqSection items={data.faqs} />
      <FinalCta />
    </>
  );
}

/* ------------------------------------------------------------------- Hero */

function Hero({ product }: { product: Product | null }) {
  const { settings } = useSettings();
  const { pick } = useLocale();
  return (
    <section className="dust relative overflow-hidden">
      <div className="pointer-events-none absolute -right-40 -top-32 h-[30rem] w-[30rem] rounded-full bg-gold/10 blur-[110px]" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-berry/8 blur-[110px]" />

      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-16">
        <div className="relative z-10 text-center lg:text-start">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow text-[10px] text-gold sm:text-[11px]"
          >
            {pick(settings.hero_eyebrow, settings.hero_eyebrow_en)}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="headline mt-5 text-[2.1rem] leading-[1.5] text-cocoa sm:text-5xl lg:text-[3.7rem] lg:leading-[1.42]"
          >
            {pick(settings.hero_title_line1, settings.hero_title_line1_en)}
            <br />
            <span className="relative inline-block text-gold">
              {pick(settings.hero_title_line2, settings.hero_title_line2_en)}
              <svg
                viewBox="0 0 300 12"
                className="absolute -bottom-2 right-0 h-3 w-full text-gold-2"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 8c48-6 98-6 148-3 48 3 98 3 148-3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-8 max-w-lg text-[14.5px] leading-loose text-mocha sm:text-base lg:mx-0"
          >
            {pick(settings.hero_subtitle, settings.hero_subtitle_en)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <ButtonLink to="/shop" size="lg" className="w-full sm:w-auto">
              {pick(settings.hero_cta_primary, settings.hero_cta_primary_en)}
              <ArrowLeft size={18} />
            </ButtonLink>
            <ButtonLink to="/shop?category=gifts" variant="secondary" size="lg" className="w-full sm:w-auto">
              <Gift size={17} />
              {pick(settings.hero_cta_secondary, settings.hero_cta_secondary_en)}
            </ButtonLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-line pt-7 lg:max-w-md"
          >
            {settings.hero_stats.map((s) => (
              <div key={s.label} className="text-center lg:text-start">
                <p className="headline text-2xl text-cocoa sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-mocha">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[30rem] lg:max-w-none"
        >
          <div className="relative overflow-hidden rounded-t-[999px] rounded-b-5xl border border-line bg-ivory shadow-[0_50px_110px_-50px_rgba(42,26,18,0.7)]">
            <img
              src={settings.hero_image}
              alt={`تشكيلة فاخرة من ${settings.brand_name_ar}`}
              width={1120}
              height={1400}
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cocoa/25 via-transparent to-transparent" />
          </div>

          <BrandSealMedallion />

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="absolute -bottom-6 right-0 w-[15.5rem] rounded-3xl border border-line bg-ivory/95 p-3.5 shadow-[0_28px_60px_-30px_rgba(42,26,18,0.6)] backdrop-blur sm:-right-6"
          >
            {product ? (
              <Link to={`/dessert/${product.slug}`} className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name_ar}
                  className="h-16 w-14 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0">
                  <p className="eyebrow text-[9px] text-gold">اختيار الشيف</p>
                  <p className="mt-1 truncate text-[13px] font-semibold text-cocoa">{product.name_ar}</p>
                  <div className="mt-1">
                    <Price value={product.price} size="sm" />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <div className="skeleton h-16 w-14 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3 w-full rounded-full" />
                  <div className="skeleton h-3 w-2/3 rounded-full" />
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="float-soft absolute -top-3 left-2 grid h-24 w-24 place-items-center rounded-full border border-gold/30 bg-cream/90 text-center backdrop-blur sm:-left-6 sm:h-28 sm:w-28"
          >
            <div>
              <Sparkles size={16} className="mx-auto text-gold" />
              <p className="mt-1.5 px-2 text-[10.5px] font-semibold leading-tight text-cocoa">
                {pick(settings.hero_badge_text, settings.hero_badge_text_en)}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ TrustStrip */

function TrustStrip() {
  const { settings } = useSettings();
  const icons = [
    <Leaf size={15} key="leaf" />,
    <Snowflake size={15} key="snow" />,
    <Sparkles size={15} key="spark" />,
    <Gift size={15} key="gift" />,
  ];
  const items = (settings.trust_items || []).map((t, i) => ({ t, icon: icons[i % icons.length] }));
  return (
    <div className="border-y border-line bg-ivory">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="grid divide-y divide-line/70 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-x-reverse lg:divide-line/70">
          {items.map((it) => (
            <div key={it.t} className="flex items-center gap-3 px-2 py-5 lg:justify-center lg:px-6">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream text-gold">
                {it.icon}
              </span>
              <p className="text-[12.5px] leading-relaxed text-cocoa-2">{it.t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Categories */

function Categories({ items, loading }: { items: Category[]; loading: boolean }) {
  const { settings } = useSettings();
  const { pick } = useLocale();
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <SectionHead
        eyebrow="Nos univers"
        title={pick(settings.categories_title, settings.categories_title_en)}
        subtitle={pick(settings.categories_subtitle, settings.categories_subtitle_en)}
      />

      <div className="mt-12 grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton aspect-square rounded-4xl" />
            ))
          : items.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.07 }}
              >
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="group relative block aspect-square overflow-hidden rounded-4xl border border-line/70"
                >
                  <img
                    src={cat.image}
                    alt={cat.name_ar}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cocoa/85 via-cocoa/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <p
                      className="eyebrow text-[8.5px] sm:text-[9.5px]"
                      style={{ color: cat.accent || '#D6B684' }}
                    >
                      {cat.name_en}
                    </p>
                    <h3 className="headline mt-1.5 text-base text-cream sm:text-lg">{cat.name_ar}</h3>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-cream/70 transition-all duration-300 group-hover:gap-2 group-hover:text-gold-2">
                      اكتشف
                      <ArrowLeft size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Featured */

function Featured({ items, loading }: { items: Product[]; loading: boolean }) {
  const { settings } = useSettings();
  const { pick } = useLocale();
  return (
    <section className="relative overflow-hidden bg-ivory py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] dust" />
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHead
          eyebrow="Sélection du chef"
          title={pick(settings.featured_title, settings.featured_title_en)}
          subtitle={pick(settings.featured_subtitle, settings.featured_subtitle_en)}
          align="start"
          action={
            <ButtonLink to="/shop" variant="secondary" size="md">
              كل المختارات
              <ArrowLeft size={16} />
            </ButtonLink>
          }
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            : items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- BestSellers */

function BestSellers({ items, loading }: { items: Product[]; loading: boolean }) {
  const { settings } = useSettings();
  const { pick } = useLocale();
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <SectionHead eyebrow="Les plus aimés" title={pick(settings.best_title, settings.best_title_en)} subtitle={pick(settings.best_subtitle, settings.best_subtitle_en)} />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          : items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
      <div className="mt-12 flex justify-center">
        <ButtonLink to="/shop?category=bestsellers" variant="secondary" size="lg">
          تصفّح كل الأكثر طلبًا
          <ArrowLeft size={17} />
        </ButtonLink>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Seasonal */

function Seasonal({ items }: { items: Product[] }) {
  const { settings } = useSettings();
  const { fmt, pick } = useLocale();
  if (!settings.seasonal_enabled) return null;
  return (
    <section className="relative overflow-hidden bg-cocoa py-20 text-cream lg:py-0">
      <div className="mx-auto grid max-w-[1400px] items-center lg:grid-cols-2">
        <div className="relative h-72 overflow-hidden lg:h-[38rem]">
          <img
            src={settings.seasonal_image}
            alt={pick(settings.seasonal_title, settings.seasonal_title_en)}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-cocoa/80 via-cocoa/10 to-transparent lg:from-cocoa lg:via-cocoa/30" />
        </div>
        <div className="px-4 py-12 sm:px-8 lg:px-16 lg:py-20">
          <p className="eyebrow text-[10px] text-gold-2">{settings.seasonal_eyebrow}</p>
          <h2 className="headline mt-4 text-3xl leading-relaxed text-cream lg:text-[2.7rem]">
            {pick(settings.seasonal_title, settings.seasonal_title_en)}
            <br />
            <span className="text-gold-2">{pick(settings.seasonal_highlight, settings.seasonal_highlight_en)}</span>
          </h2>
          <p className="mt-6 max-w-md text-[14.5px] leading-loose text-cream/70">
            {pick(settings.seasonal_text, settings.seasonal_text_en)}
          </p>

          <div className="mt-8 space-y-3">
            {items.length === 0
              ? Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-[74px] rounded-3xl border border-cream/10 bg-cream/5" />
                ))
              : items.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  >
                    <Link
                      to={`/dessert/${p.slug}`}
                      className="group flex items-center gap-4 rounded-3xl border border-cream/10 bg-cream/[0.04] p-3 transition-all duration-400 hover:border-gold-2/40 hover:bg-cream/[0.08]"
                    >
                      <img
                        src={p.image}
                        alt={p.name_ar}
                        className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-cream">
                          {pick(p.name_ar, p.name_en)}
                        </p>
                        <p className="mt-0.5 truncate text-[11.5px] text-cream/50">{p.tagline_ar}</p>
                      </div>
                      <span className="num shrink-0 text-[15px] text-gold-2">{fmt(p.price)}</span>
                    </Link>
                  </motion.div>
                ))}
          </div>

          <div className="mt-9">
            <ButtonLink to="/shop?category=new" variant="gold" size="lg">
              {pick(settings.seasonal_cta, settings.seasonal_cta_en)}
              <ArrowLeft size={17} />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- NewArrivals */

function NewArrivals({ items, loading }: { items: Product[]; loading: boolean }) {
  const { settings } = useSettings();
  const { pick } = useLocale();
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <SectionHead
        eyebrow="Nouveautés"
        title={pick(settings.new_title, settings.new_title_en)}
        subtitle={pick(settings.new_subtitle, settings.new_subtitle_en)}
        align="start"
        action={
          <ButtonLink to="/shop?category=new" variant="secondary" size="md">
            كل الجديد
            <ArrowLeft size={16} />
          </ButtonLink>
        }
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
          : items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- PromoBand */

function PromoBand() {
  const { settings } = useSettings();
  const { pick } = useLocale();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(settings.promo_code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  if (!settings.promo_enabled) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <Reveal>
        <div className="relative mx-auto grid max-w-[1400px] overflow-hidden rounded-5xl border border-gold/25 bg-gradient-to-l from-sand via-cream-2 to-sand lg:grid-cols-[1.1fr_1fr]">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-berry/10 blur-3xl" />

          <div className="relative px-6 py-12 text-center sm:px-12 lg:py-16 lg:text-start">
            <Badge tone="gold">
              <Gift size={12} />
              {pick(settings.promo_badge, settings.promo_badge_en)}
            </Badge>
            <h2 className="headline mt-5 text-2xl leading-relaxed text-cocoa sm:text-4xl">
              {pick(settings.promo_title, settings.promo_title_en)}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-loose text-mocha lg:mx-0">{pick(settings.promo_text, settings.promo_text_en)}</p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <button
                onClick={copy}
                className="group inline-flex h-14 items-center gap-3 rounded-full border-2 border-dashed border-gold/50 bg-ivory px-7 transition hover:border-gold"
                aria-label="نسخ رمز الخصم"
              >
                <span className="wordmark text-lg text-cocoa">{settings.promo_code}</span>
                <span className="text-gold">
                  {copied ? <Check size={17} /> : <Copy size={16} />}
                </span>
              </button>
              <ButtonLink to="/shop?category=gifts" size="lg">
                {pick(settings.promo_cta, settings.promo_cta_en)}
                <ArrowLeft size={17} />
              </ButtonLink>
            </div>
            {copied && <p className="mt-3 text-[12px] text-pistachio">تم نسخ الرمز ✓</p>}
          </div>

          <div className="relative min-h-56 lg:min-h-full">
            <img
              src={settings.promo_image}
              alt={pick(settings.promo_title, settings.promo_title_en)}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-cream-2/90 lg:to-sand" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ----------------------------------------------------------------- Story */

function Story() {
  const { settings } = useSettings();
  const { pick } = useLocale();
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative">
            <div className="overflow-hidden rounded-5xl border border-line">
              <img
                src={settings.story_image}
                alt={pick(settings.story_title, settings.story_title_en)}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-8 left-4 hidden w-52 overflow-hidden rounded-4xl border border-line bg-ivory p-4 shadow-[0_28px_60px_-30px_rgba(42,26,18,0.6)] sm:block lg:-left-10">
              <img
                src={settings.story_detail_image}
                alt={settings.story_detail_caption}
                className="aspect-square w-full rounded-3xl object-cover"
                loading="lazy"
                decoding="async"
              />
              <p className="mt-3 text-center text-[11.5px] leading-relaxed text-mocha">
                {settings.story_detail_caption}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="eyebrow text-[10px] text-gold">{settings.story_eyebrow}</p>
          <h2 className="headline mt-4 text-3xl leading-relaxed text-cocoa lg:text-[2.6rem]">
            {pick(settings.story_title, settings.story_title_en)}
          </h2>
          <Ornament className="mt-6 justify-start" />
          <div className="mt-6 space-y-5 text-[14.5px] leading-loose text-mocha">
            {settings.story_paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
            {settings.story_stats.map((s) => (
              <div key={s.label}>
                <p className="headline text-xl text-cocoa sm:text-2xl">{s.value}</p>
                <p className="mt-1 text-[11.5px] text-mocha">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-9">
            <ButtonLink to="/story" variant="secondary" size="md">
              اقرأ حكايتنا كاملة
              <ArrowLeft size={16} />
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- Testimonials */

function Testimonials({ items }: { items: Testimonial[] }) {
  const { settings } = useSettings();
  const { pick } = useLocale();
  return (
    <section className="relative overflow-hidden bg-ivory py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHead
          eyebrow="Ils en parlent"
          title={pick(settings.testimonials_title, settings.testimonials_title_en)}
          subtitle={pick(settings.testimonials_subtitle, settings.testimonials_subtitle_en)}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {(items.length ? items.slice(0, 6) : []).map((t, i) => (
            <motion.blockquote
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              className="flex h-full flex-col rounded-4xl border border-line/70 bg-cream p-6"
            >
              <span className="headline text-4xl leading-none text-gold-2">”</span>
              <Stars value={t.rating} size={13} />
              <p className="mt-4 flex-1 text-[13.5px] leading-loose text-cocoa-2">{t.text_ar}</p>
              <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cocoa text-[13px] text-cream">
                  {t.initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-cocoa">{t.name}</p>
                  <p className="truncate text-[11px] text-mocha">
                    {t.city} · {t.product_ar}
                  </p>
                </div>
              </div>
            </motion.blockquote>
          ))}
          {items.length === 0 &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-4xl" />
            ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Delivery */

function Delivery() {
  const { settings } = useSettings();
  const { pick } = useLocale();
  const icons = [
    <Truck size={18} key="t" />,
    <Snowflake size={18} key="s" />,
    <Gift size={18} key="g" />,
    <Clock size={18} key="c" />,
  ];
  const cards = (settings.delivery_cards || []).map((c, i) => ({
    icon: icons[i % icons.length],
    t: c.title,
    d: c.text,
  }));

  return (
    <section id="delivery" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
        <Reveal>
          <div className="overflow-hidden rounded-5xl border border-line">
            <img
              src={settings.delivery_image}
              alt={pick(settings.delivery_title, settings.delivery_title_en)}
              className="aspect-[3/2] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow text-[10px] text-gold">Livraison</p>
            <h2 className="headline mt-4 text-3xl leading-relaxed text-cocoa lg:text-[2.4rem]">
              {pick(settings.delivery_title, settings.delivery_title_en)}
            </h2>
            <p className="mt-4 max-w-lg text-[14.5px] leading-loose text-mocha">{pick(settings.delivery_text, settings.delivery_text_en)}</p>
          </Reveal>
          <div className="mt-9 grid gap-3.5 sm:grid-cols-2">
            {cards.map((c, i) => (
              <Reveal key={c.t} delay={i * 0.08}>
                <div className="h-full rounded-4xl border border-line/70 bg-ivory p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-cream text-gold">
                    {c.icon}
                  </span>
                  <h3 className="mt-4 text-[14px] font-semibold text-cocoa">{c.t}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-mocha">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- FAQ */

function FaqSection({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const list = useMemo(() => items, [items]);

  return (
    <section id="faq" className="relative scroll-mt-24 overflow-hidden bg-ivory py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHead eyebrow="Questions" title="أسئلة يتكرّر سؤالها" />
        <div className="mt-12 space-y-3">
          {list.length === 0 &&
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-3xl" />
            ))}
          {list.map((f, i) => {
            const isOpen = open === f.id;
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(i, 5) * 0.06 }}
                className={`overflow-hidden rounded-3xl border transition-colors duration-300 ${
                  isOpen ? 'border-gold/40 bg-cream' : 'border-line bg-cream/60'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : f.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-start sm:px-6"
                >
                  <span className="text-[14px] font-medium leading-relaxed text-cocoa sm:text-[15px]">
                    {f.q_ar}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                      isOpen ? 'bg-gold text-ivory' : 'bg-sand text-cocoa-2'
                    }`}
                  >
                    <ChevronDown size={15} />
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-[13.5px] leading-loose text-mocha sm:px-6">{f.a_ar}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- FinalCta */

function FinalCta() {
  const { settings } = useSettings();
  const { pick } = useLocale();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={settings.final_cta_image} alt="" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-cocoa/82" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:py-32">
        <Reveal>
          <p className="eyebrow text-[10px] text-gold-2">Une douceur vous attend</p>
          <h2 className="headline mt-5 text-3xl leading-relaxed text-cream sm:text-4xl lg:text-[3rem] lg:leading-[1.45]">
            {pick(settings.final_cta_title1, settings.final_cta_title1_en)}
            <br />
            <span className="text-gold-2">{pick(settings.final_cta_title2, settings.final_cta_title2_en)}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[14.5px] leading-loose text-cream/65">
            {pick(settings.final_cta_text, settings.final_cta_text_en)}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink to="/shop" variant="gold" size="lg" className="w-full sm:w-auto">
              ابدأ التسوّق
              <ArrowLeft size={18} />
            </ButtonLink>
            <ButtonLink
              to={whatsappSimple(
                `مرحبًا ${settings.brand_name_ar}، أرغب بالاستفسار عن طلب حلويات ✨`,
                settings.whatsapp
              )}
              size="lg"
              className="w-full border border-cream/25 bg-transparent text-cream hover:bg-cream/10 sm:w-auto"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} />
              اطلب عبر واتساب
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
