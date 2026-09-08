import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Trash2, X, Truck, Gift } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';
import QuantityStepper from './QuantityStepper';
import { useLocale } from '../contexts/LocaleContext';
import { PlateGlyph } from './ui/Bits';

export default function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    items,
    setQty,
    remove,
    subtotal,
    discountAmount,
    deliveryFee,
    total,
    count,
    freeFrom,
  } = useShop();
  const { t, fmt } = useLocale();

  const remaining = Math.max(0, freeFrom - (subtotal - discountAmount));
  const progress = Math.min(100, ((subtotal - discountAmount) / Math.max(1, freeFrom)) * 100);

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[105]"
        >
          <div className="absolute inset-0 bg-cocoa/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />

          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 34 }}
            className="absolute inset-y-0 left-0 flex w-full max-w-md flex-col bg-cream shadow-2xl"
            role="dialog"
            aria-label="صندوق الحلويات"
          >
            {/* lid */}
            <div className="relative shrink-0 overflow-hidden bg-cocoa px-5 pb-5 pt-6 text-cream">
              <div className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-gold/15 blur-3xl" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="eyebrow text-[10px] text-gold-2">votre boîte</p>
                  <h2 className="headline mt-1.5 text-xl text-cream">{t('cart.title')}</h2>
                  <p className="mt-1 text-[12px] text-cream/55">
                    {count > 0 ? `${count} ${t('cart.items')}` : t('cart.emptyYet')}
                  </p>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  aria-label={t('cart.close')}
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream transition hover:bg-cream/10"
                >
                  <X size={18} />
                </button>
              </div>

              {items.length > 0 && (
                <div className="relative mt-5">
                  <div className="mb-2 flex items-center gap-2 text-[11.5px] text-cream/70">
                    <Truck size={13} className="text-gold-2" />
                    {remaining > 0 ? (
                      <span>
                        {t('cart.freeDeliveryShort', { amount: fmt(remaining) })}
                      </span>
                    ) : (
                      <span className="text-gold-2">{t('cart.freeDeliveryWon')}</span>
                    )}
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-cream/15">
                    <motion.div
                      className="h-full rounded-full bg-gold-2"
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* tissue paper edge */}
            <div className="h-3 shrink-0 bg-[linear-gradient(-45deg,transparent_33.33%,var(--color-cream)_33.33%,var(--color-cream)_66.66%,transparent_66.66%)] bg-[length:16px_16px] bg-cocoa" />

            <div className="thin-scroll flex-1 overflow-y-auto px-5 py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                  <div className="mb-6 grid h-24 w-24 place-items-center rounded-full bg-ivory text-gold">
                    <PlateGlyph size={48} />
                  </div>
                  <h3 className="headline text-lg text-cocoa">{t('cart.empty')}</h3>
                  <p className="mt-2 max-w-[16rem] text-[13px] leading-loose text-mocha">
                    {t('cart.emptyHint')}
                  </p>
                  <Link
                    to="/shop"
                    onClick={() => setCartOpen(false)}
                    className="mt-7 inline-flex h-11 items-center rounded-full bg-cocoa px-7 text-sm text-cream transition hover:bg-cocoa-2"
                  >
                    {t('cart.browse')}
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((line) => (
                      <motion.li
                        key={line.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.32 }}
                        className="flex gap-3.5 rounded-3xl border border-line/70 bg-ivory p-3"
                      >
                        <Link to={`/dessert/${line.slug}`} onClick={() => setCartOpen(false)} className="shrink-0">
                          <img
                            src={line.image}
                            alt={line.name_ar}
                            className="h-24 w-20 rounded-2xl object-cover"
                          />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/dessert/${line.slug}`}
                              onClick={() => setCartOpen(false)}
                              className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-cocoa hover:text-gold"
                            >
                              {line.name_ar}
                            </Link>
                            <button
                              onClick={() => remove(line.id)}
                              aria-label={t('cart.remove')}
                              className="shrink-0 rounded-full p-1.5 text-mocha-2 transition hover:bg-raspberry/10 hover:text-raspberry"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                            <QuantityStepper
                              size="sm"
                              value={line.qty}
                              max={line.stock_qty}
                              onChange={(v) => setQty(line.id, v)}
                            />
                            <span className="num text-[15px] text-cocoa">
                              {fmt(line.price * line.qty)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="shrink-0 border-t border-line bg-ivory px-5 py-5">
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between text-mocha">
                    <span>{t('cart.subtotal')}</span>
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
                    <span className={deliveryFee === 0 ? 'text-pistachio' : 'num text-cocoa'}>
                      {deliveryFee === 0 ? t('cart.free') : fmt(deliveryFee)}
                    </span>
                  </div>
                </div>
                <div className="my-4 rule-gold" />
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-cocoa">{t('cart.total')}</span>
                  <span className="num text-2xl text-cocoa">{fmt(total)}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <Link
                    to="/cart"
                    onClick={() => setCartOpen(false)}
                    className="flex h-12 items-center justify-center rounded-full border border-cocoa/25 text-[13px] text-cocoa transition hover:border-cocoa/60"
                  >
                    {t('cart.review')}
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="flex h-12 items-center justify-center gap-2 rounded-full bg-cocoa text-[13px] text-cream transition hover:bg-gold"
                  >
                    <Gift size={15} />
                    {t('cart.checkout')}
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
