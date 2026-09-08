import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { api } from '../lib/api';
import type { Category, Product } from '../lib/types';
import ProductCard from '../components/ProductCard';
import { EmptyState, Ornament, ProductSkeleton } from '../components/ui/Bits';
import { Button, ButtonLink } from '../components/ui/Button';
import { useShop } from '../contexts/ShopContext';
import { useSettings } from '../contexts/SettingsContext';
import { whatsappSimple } from '../lib/whatsapp';
import { useLocale } from '../contexts/LocaleContext';

const SORTS = [
  { value: 'featured', label: 'catalog.sortDefault' },
  { value: 'price_asc', label: 'catalog.sortPriceAsc' },
  { value: 'price_desc', label: 'catalog.sortPriceDesc' },
  { value: 'rating', label: 'catalog.sortRating' },
  { value: 'newest', label: 'catalog.sortNewest' },
];

const MAX_PRICE = 350;

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const { favorites } = useShop();
  const { settings } = useSettings();
  const { t, fmt, pick, lang } = useLocale();

  const category = params.get('category') || 'all';
  const query = params.get('q') || '';
  const onlyFav = params.get('fav') === '1';

  const [term, setTerm] = useState(query);
  const [debounced, setDebounced] = useState(query);
  const [sort, setSort] = useState('featured');
  const [priceMax, setPriceMax] = useState(MAX_PRICE);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [dealsOnly, setDealsOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setTerm(query), [query]);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(term), 320);
    return () => window.clearTimeout(t);
  }, [term]);

  useEffect(() => {
    api.categories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await api.products({
        category: category !== 'all' ? category : undefined,
        search: debounced || undefined,
        sort,
      });
      setProducts(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذّر تحميل الحلويات');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, debounced, sort]);

  const visible = useMemo(() => {
    return products.filter((p) => {
      if (p.price > priceMax) return false;
      if (inStockOnly && (!p.in_stock || p.stock_qty <= 0)) return false;
      if (dealsOnly && !(p.compare_price && p.compare_price > p.price)) return false;
      if (onlyFav && !favorites.includes(p.id)) return false;
      return true;
    });
  }, [products, priceMax, inStockOnly, dealsOnly, onlyFav, favorites]);

  const activeCat = categories.find((c) => c.slug === category);
  const filtersActive =
    priceMax < MAX_PRICE || inStockOnly || dealsOnly || onlyFav || category !== 'all' || !!debounced;

  const setCategory = (slug: string) => {
    const next = new URLSearchParams(params);
    if (slug === 'all') next.delete('category');
    else next.set('category', slug);
    setParams(next, { replace: true });
  };

  const resetAll = () => {
    setTerm('');
    setPriceMax(MAX_PRICE);
    setInStockOnly(false);
    setDealsOnly(false);
    setSort('featured');
    setParams(new URLSearchParams(), { replace: true });
  };

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-[13px] font-semibold text-cocoa">{t('catalog.categories')}</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setCategory('all')}
              className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-[13px] transition ${
                category === 'all' ? 'bg-cocoa text-cream' : 'text-cocoa-2 hover:bg-cream-2'
              }`}
            >
              {t('catalog.allDesserts')}
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setCategory(c.slug)}
                className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-[13px] transition ${
                  category === c.slug ? 'bg-cocoa text-cream' : 'text-cocoa-2 hover:bg-cream-2'
                }`}
              >
                <span>{pick(c.name_ar, c.name_en)}</span>
                <span className="eyebrow text-[8px] opacity-60">{c.name_en}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line pt-7">
        <h3 className="mb-1 text-[13px] font-semibold text-cocoa">{t('catalog.maxPrice')}</h3>
        <p className="num mb-4 text-[13px] text-gold">
          {t('catalog.upTo')} {fmt(priceMax)}
        </p>
        <input
          type="range"
          min={50}
          max={MAX_PRICE}
          step={5}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full"
          aria-label={t('catalog.maxPrice')}
        />
        <div className="num mt-2 flex justify-between text-[11px] text-mocha-2">
          <span>50</span>
          <span>{MAX_PRICE}</span>
        </div>
      </div>

      <div className="border-t border-line pt-7">
        <h3 className="mb-4 text-[13px] font-semibold text-cocoa">{t('catalog.quickFilter')}</h3>
        <div className="space-y-2.5">
          <Toggle checked={inStockOnly} onChange={setInStockOnly} label={t('catalog.inStockOnly')} />
          <Toggle checked={dealsOnly} onChange={setDealsOnly} label={t('catalog.onSale')} />
          <Toggle
            checked={onlyFav}
            onChange={(v) => {
              const next = new URLSearchParams(params);
              if (v) next.set('fav', '1');
              else next.delete('fav');
              setParams(next, { replace: true });
            }}
            label={t('catalog.favOnly')}
          />
        </div>
      </div>

      {filtersActive && (
        <button
          onClick={resetAll}
          className="inline-flex items-center gap-2 text-[12.5px] text-raspberry transition hover:text-berry"
        >
          <RotateCcw size={13} />
          {t('catalog.reset')}
        </button>
      )}
    </div>
  );

  return (
    <>
      <section className="dust relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
        <div className="mx-auto max-w-[1400px] px-4 py-14 text-center sm:px-6 lg:px-10 lg:py-20">
          <p className="eyebrow text-[10px] text-gold">La collection</p>
          <h1 className="headline mt-4 text-3xl text-cocoa sm:text-4xl lg:text-[3rem] lg:leading-[1.45]">
            {onlyFav
              ? t('catalog.favorites')
              : activeCat
                ? pick(activeCat.name_ar, activeCat.name_en)
                : t('catalog.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-loose text-mocha">
            {onlyFav
              ? t('catalog.favIntro')
              : (lang === 'ar' && activeCat?.description_ar) || t('catalog.intro')}
          </p>
          <Ornament className="mt-6" />
        </div>
      </section>

      {/* category chips */}
      <div className="sticky top-[68px] z-30 border-b border-line bg-cream/92 backdrop-blur-xl lg:top-[84px]">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-3.5">
            <button
              onClick={() => setCategory('all')}
              className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] transition ${
                category === 'all'
                  ? 'border-cocoa bg-cocoa text-cream'
                  : 'border-line bg-ivory text-cocoa-2 hover:border-gold'
              }`}
            >
              {t('catalog.all')}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.slug)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] transition ${
                  category === c.slug
                    ? 'border-cocoa bg-cocoa text-cream'
                    : 'border-line bg-ivory text-cocoa-2 hover:border-gold'
                }`}
              >
                {pick(c.name_ar, c.name_en)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-40 rounded-4xl border border-line/70 bg-ivory p-6">{filterPanel}</div>
          </aside>

          <div>
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mocha-2"
                />
                <input
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder={t('search.short')}
                  aria-label={t('search.aria')}
                  className="h-12 w-full rounded-full border border-line bg-ivory pe-12 ps-5 text-[13.5px] text-cocoa placeholder:text-mocha-2/70 transition focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/10"
                />
                {term && (
                  <button
                    onClick={() => setTerm('')}
                    aria-label={t('search.clear')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-mocha-2 transition hover:text-cocoa"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-ivory px-5 text-[13px] text-cocoa-2 transition hover:border-gold lg:hidden"
                >
                  <SlidersHorizontal size={15} />
                  {t('catalog.filter')}
                </button>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label={t('catalog.sort')}
                  className="h-12 rounded-full border border-line bg-ivory px-5 text-[13px] text-cocoa-2 transition focus:border-gold focus:outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {t(s.label)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="mb-6 text-[12.5px] text-mocha">
              {loading ? (
                t('catalog.loading')
              ) : (
                <>
                  <span className="num text-cocoa">{visible.length}</span> {t('catalog.count')}
                  {debounced && (
                    <>
                      {' '}
                      {t('catalog.for')} «{debounced}»
                    </>
                  )}
                </>
              )}
            </p>

            {error ? (
              <div className="rounded-4xl border border-raspberry/25 bg-raspberry/5 px-6 py-14 text-center">
                <p className="headline text-lg text-berry">{t('catalog.loadError')}</p>
                <p className="mt-2 text-sm text-mocha">{error}</p>
                <Button className="mt-6" onClick={fetchProducts}>
                  {t('catalog.retry')}
                </Button>
              </div>
            ) : loading ? (
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : visible.length === 0 ? (
              <EmptyState
                icon={onlyFav ? <Heart size={34} /> : undefined}
                title={onlyFav ? t('catalog.emptyFav') : t('catalog.empty')}
                description={onlyFav ? t('catalog.emptyFavHint') : t('catalog.emptyHint')}
                action={
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button onClick={resetAll} variant="secondary">
                      {t('catalog.resetShort')}
                    </Button>
                    <ButtonLink to="/shop">{t('catalog.allDesserts')}</ButtonLink>
                  </div>
                }
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                {visible.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}

            {!loading && !error && visible.length > 0 && (
              <div className="mt-16 rounded-4xl border border-line bg-ivory px-6 py-10 text-center">
                <p className="headline text-xl text-cocoa">{t('catalog.customTitle')}</p>
                <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-loose text-mocha">
                  {t('catalog.customText')}
                </p>
                <div className="mt-6">
                  <ButtonLink
                    to={whatsappSimple(
                      `مرحبًا ${settings.brand_name_ar}، أرغب بطلب حلوى خاصة`,
                      settings.whatsapp
                    )}
                    target="_blank"
                    rel="noreferrer"
                    variant="secondary"
                  >
                    {t('catalog.talkChef')}
                  </ButtonLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* mobile filter sheet */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] lg:hidden"
          >
            <div className="absolute inset-0 bg-cocoa/50 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 34 }}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-5xl bg-cream px-5 pb-8 pt-4"
            >
              <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-sand-2" />
              <div className="mb-6 flex items-center justify-between">
                <h2 className="headline text-xl text-cocoa">{t('catalog.filterTitle')}</h2>
                <button
                  onClick={() => setFiltersOpen(false)}
                  aria-label={t('nav.close')}
                  className="grid h-10 w-10 place-items-center rounded-full bg-ivory text-cocoa"
                >
                  <X size={18} />
                </button>
              </div>
              {filterPanel}
              <button
                onClick={() => setFiltersOpen(false)}
                className="mt-8 h-13 w-full rounded-full bg-cocoa text-sm text-cream"
              >
                {t('catalog.show')} {visible.length}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className="flex w-full items-center gap-3 text-start"
    >
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ${
          checked ? 'bg-gold' : 'bg-sand-2'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-ivory shadow ${
            checked ? 'left-0.5' : 'right-0.5'
          }`}
        />
      </span>
      <span className="text-[13px] text-cocoa-2">{label}</span>
    </button>
  );
}
