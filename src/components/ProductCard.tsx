import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';
import type { Product } from '../lib/types';
import { useShop } from '../contexts/ShopContext';
import { useToast } from '../contexts/ToastContext';
import { discountPercent } from '../lib/format';
import { useLocale } from '../contexts/LocaleContext';
import { Price, Stars } from './ui/Bits';

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add, toggleFavorite, isFavorite } = useShop();
  const { toast } = useToast();
  const { t, pick } = useLocale();
  const fav = isFavorite(product.id);
  const off = discountPercent(product.price, product.compare_price);
  const soldOut = !product.in_stock || product.stock_qty <= 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: Math.min(index, 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-4xl border border-line/70 bg-ivory transition-all duration-500 hover:border-gold/45 hover:shadow-[0_28px_60px_-32px_rgba(42,26,18,0.55)]"
    >
      <Link to={`/dessert/${product.slug}`} className="relative block overflow-hidden">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream-2">
          <img
            src={product.image}
            alt={product.name_ar}
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06] ${
              soldOut ? 'opacity-60 saturate-50' : ''
            }`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cocoa/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {soldOut && (
            <div className="absolute inset-0 grid place-items-center bg-cream/55 backdrop-blur-[2px]">
              <span className="rounded-full border border-cocoa/25 bg-ivory/90 px-4 py-2 text-xs font-semibold text-cocoa">
                {t('product.soldOut')}
              </span>
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
          <div className="flex flex-col items-start gap-1.5">
            {off && (
              <span className="rounded-full bg-berry px-2.5 py-1 text-[11px] font-semibold text-ivory shadow-sm">
                {t('product.off')} {off}%
              </span>
            )}
            {product.is_new && !off && (
              <span className="rounded-full bg-ivory/92 px-2.5 py-1 text-[11px] font-semibold text-gold shadow-sm backdrop-blur">
                {t('product.new')}
              </span>
            )}
            {product.is_best_seller && !off && !product.is_new && (
              <span className="rounded-full bg-ivory/92 px-2.5 py-1 text-[11px] font-semibold text-cocoa shadow-sm backdrop-blur">
                {t('product.best')}
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => {
          toggleFavorite(product.id);
          toast(fav ? t('product.removedFav') : t('product.addedFav'), {
            description: pick(product.name_ar, product.name_en),
            tone: fav ? 'info' : 'love',
          });
        }}
        aria-label={fav ? t('product.unfavorite') : t('product.favorite')}
        aria-pressed={fav}
        className={`absolute top-3.5 left-3.5 grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition-all duration-300 ${
          fav
            ? 'border-berry/40 bg-berry text-ivory'
            : 'border-line bg-ivory/90 text-mocha hover:text-berry'
        }`}
      >
        <Heart size={15} fill={fav ? 'currentColor' : 'none'} />
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <Stars value={product.rating} />
          <span className="num text-[11px] text-mocha-2">({product.reviews_count})</span>
        </div>

        <Link to={`/dessert/${product.slug}`} className="block">
          <h3 className="text-[15px] font-semibold leading-snug text-cocoa transition-colors group-hover:text-gold sm:text-base">
            {pick(product.name_ar, product.name_en)}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-mocha">
          {product.tagline_ar}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <Price value={product.price} compare={product.compare_price} />
          <button
            type="button"
            disabled={soldOut}
            onClick={() => {
              const ok = add(product);
              toast(ok ? t('product.added') : t('product.limit'), {
                description: ok
                  ? pick(product.name_ar, product.name_en)
                  : t('product.limitHint'),
                tone: ok ? 'success' : 'error',
              });
            }}
            aria-label={`${t('product.addToBox')}: ${pick(product.name_ar, product.name_en)}`}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cocoa text-cream transition-all duration-300 hover:bg-gold disabled:cursor-not-allowed disabled:bg-sand-2 disabled:text-mocha-2"
          >
            <Plus size={17} />
          </button>
        </div>

        {!soldOut && product.stock_qty <= 3 && (
          <p className="mt-3 text-[11.5px] text-raspberry">
            {t('product.left', { n: product.stock_qty })}
          </p>
        )}
      </div>
    </motion.article>
  );
}
