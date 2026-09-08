import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Gift, ShieldCheck, Snowflake, Trash2, Truck } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';
import QuantityStepper from '../components/QuantityStepper';
import DiscountBox from '../components/DiscountBox';
import { useLocale } from '../contexts/LocaleContext';
import { ButtonLink } from '../components/ui/Button';
import { Ornament, PlateGlyph } from '../components/ui/Bits';
import { useToast } from '../contexts/ToastContext';

export default function CartPage() {
  const { items, setQty, remove, subtotal, discountAmount, deliveryFee, total, count, clear, freeFrom } =
    useShop();
  const { toast } = useToast();
  const { t, fmt } = useLocale();

  const remaining = Math.max(0, freeFrom - (subtotal - discountAmount));

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="relative overflow-hidden rounded-5xl border border-line bg-ivory px-6 py-16 text-center">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cream to-transparent" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto grid h-28 w-28 place-items-center rounded-full bg-cream text-gold"
          >
            <PlateGlyph size={58} />
          </motion.div>
          <h1 className="headline relative mt-8 text-2xl text-cocoa sm:text-3xl">
            {t('cart.emptyTitle')}
          </h1>
          <p className="relative mx-auto mt-4 max-w-sm text-[14px] leading-loose text-mocha">
            {t('cart.emptyLong')}
          </p>
          <Ornament className="relative mt-7" />
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to="/shop" size="lg">
              {t('cart.browse')}
              <ArrowLeft size={17} />
            </ButtonLink>
            <ButtonLink to="/shop?category=gifts" variant="secondary" size="lg">
              <Gift size={16} />
              {t('cart.giftBoxes')}
            </ButtonLink>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
      <div className="mb-10 text-center lg:text-start">
        <p className="eyebrow text-[10px] text-gold">Votre boîte</p>
        <h1 className="headline mt-3 text-3xl text-cocoa lg:text-[2.6rem]">{t('cart.title')}</h1>
        <p className="mt-3 text-[14px] text-mocha">
          <span className="num">{count}</span> {t('cart.items')} — {t('cart.reviewTitle')}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
        {/* -------------------------------------------------- the box */}
        <div className="overflow-hidden rounded-5xl border border-line bg-ivory">
          <div className="relative overflow-hidden bg-cocoa px-6 py-5 text-cream">
            <div className="pointer-events-none absolute inset-x-0 -top-20 h-32 bg-gold/15 blur-3xl" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 text-gold-2">
                  <Gift size={17} />
                </span>
                <div>
                  <p className="text-[13.5px] font-semibold">{t('cart.boxName')}</p>
                  <p className="text-[11px] text-cream/55">{t('cart.boxNote')}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  clear();
                  toast(t('cart.cleared'), { tone: 'info' });
                }}
                className="text-[11.5px] text-cream/50 transition hover:text-raspberry"
              >
                {t('cart.clear')}
              </button>
            </div>
          </div>
          <div className="h-3 bg-cocoa bg-[linear-gradient(-45deg,transparent_33.33%,var(--color-ivory)_33.33%,var(--color-ivory)_66.66%,transparent_66.66%)] bg-[length:18px_18px]" />

          <ul className="divide-y divide-line/70">
            <AnimatePresence initial={false}>
              {items.map((line) => (
                <motion.li
                  key={line.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-4 p-4 sm:gap-5 sm:p-6"
                >
                  <Link to={`/dessert/${line.slug}`} className="shrink-0">
                    <img
                      src={line.image}
                      alt={line.name_ar}
                      className="h-28 w-24 rounded-3xl object-cover sm:h-32 sm:w-28"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/dessert/${line.slug}`}
                          className="text-[14.5px] font-semibold leading-snug text-cocoa transition hover:text-gold sm:text-base"
                        >
                          {line.name_ar}
                        </Link>
                        <p className="num mt-1.5 text-[12.5px] text-mocha">
                          {fmt(line.price)} / {t('cart.perPiece')}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          remove(line.id);
                          toast(t('cart.removed'), { description: line.name_ar, tone: 'info' });
                        }}
                        aria-label={t('cart.remove')}
                        className="shrink-0 rounded-full p-2 text-mocha-2 transition hover:bg-raspberry/10 hover:text-raspberry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                      <QuantityStepper
                        value={line.qty}
                        max={line.stock_qty}
                        onChange={(v) => setQty(line.id, v)}
                      />
                      <span className="num text-lg text-cocoa">
                        {fmt(line.price * line.qty)}
                      </span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="border-t border-line bg-cream/60 px-6 py-5">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-[13px] text-cocoa-2 transition hover:text-gold"
            >
              <ArrowLeft size={15} className="rotate-180" />
              {t('cart.addMore')}
            </Link>
          </div>
        </div>

        {/* -------------------------------------------------- summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-5xl border border-line bg-ivory p-6">
            <h2 className="headline text-xl text-cocoa">{t('cart.summary')}</h2>
            <div className="my-5 rule-gold" />

            <DiscountBox />

            <div className="mt-6 space-y-3 text-[13.5px]">
              <div className="flex justify-between text-mocha">
                <span>{t('cart.subtotalFull')}</span>
                <span className="num text-cocoa">{fmt(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-pistachio">
                  <span>{t('cart.discount')}</span>
                  <span className="num">−{fmt(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-mocha">
                <span>{t('cart.delivery')}</span>
                <span className={deliveryFee === 0 ? 'font-medium text-pistachio' : 'num text-cocoa'}>
                  {deliveryFee === 0 ? t('cart.free') : fmt(deliveryFee)}
                </span>
              </div>
            </div>

            {remaining > 0 && (
              <div className="mt-5 rounded-2xl border border-gold/25 bg-gold/6 px-4 py-3 text-[12px] leading-relaxed text-cocoa-2">
                {t('cart.freeDeliveryIn', { amount: fmt(remaining) })}
              </div>
            )}

            <div className="my-5 rule-gold" />
            <div className="flex items-baseline justify-between">
              <span className="text-[15px] font-semibold text-cocoa">{t('cart.total')}</span>
              <span className="num text-3xl text-cocoa">
                {fmt(total)}
              </span>
            </div>

            <ButtonLink to="/checkout" size="lg" full className="mt-6">
              {t('cart.continue')}
              <ArrowLeft size={17} />
            </ButtonLink>

            <ul className="mt-6 space-y-3">
              {[
                { icon: <Snowflake size={14} />, t: t('cart.perk1') },
                { icon: <Truck size={14} />, t: t('cart.perk2') },
                { icon: <ShieldCheck size={14} />, t: t('cart.perk3') },
              ].map((f) => (
                <li key={f.t} className="flex items-center gap-2.5 text-[12px] text-mocha">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cream text-gold">
                    {f.icon}
                  </span>
                  {f.t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
