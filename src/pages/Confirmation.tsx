import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Copy, Gift, MapPin, MessageCircle, Phone, Truck } from 'lucide-react';
import { api } from '../lib/api';
import type { Order } from '../lib/types';
import { ORDER_STATUS } from '../lib/format';
import { useLocale } from '../contexts/LocaleContext';
import { whatsappUrl } from '../lib/whatsapp';
import { useSettings } from '../contexts/SettingsContext';
import { ButtonLink } from '../components/ui/Button';
import { Ornament } from '../components/ui/Bits';

export default function Confirmation() {
  const { code = '' } = useParams();
  const { settings } = useSettings();
  const { t, fmt, fmtDate } = useLocale();
  const location = useLocation();
  const passed = (location.state as { order?: Order } | null)?.order ?? null;

  const [order, setOrder] = useState<Order | null>(passed);
  const [loading, setLoading] = useState(!passed);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (passed) return;
    let cancelled = false;
    api
      .order(code)
      .then((o) => !cancelled && setOrder(o))
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : 'تعذّر جلب الطلب'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [code, passed]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24">
        <div className="skeleton h-96 rounded-5xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="rounded-5xl border border-line bg-ivory px-6 py-14">
          <h1 className="headline text-2xl text-cocoa">لم نعثر على هذا الطلب</h1>
          <p className="mt-3 text-sm leading-loose text-mocha">{error}</p>
          <ButtonLink to="/shop" className="mt-7">
            العودة إلى المتجر
          </ButtonLink>
        </div>
      </div>
    );
  }

  const status = ORDER_STATUS[order.status] ?? ORDER_STATUS.new;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(order.order_code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-sand/70 to-transparent" />
      <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        {/* ---------------------------------------------- box opening */}
        <div className="relative mx-auto mb-10 h-44 w-64 sm:h-52 sm:w-80">
          <motion.div
            initial={{ rotateX: 0, y: 0, opacity: 1 }}
            animate={{ rotateX: -118, y: -58, opacity: 0.96 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
            className="absolute inset-x-0 top-0 z-20 h-16 rounded-t-3xl border border-gold/30 bg-cocoa shadow-lg sm:h-20"
          >
            <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 bg-gold/50" />
            <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded bg-gold/60" />
          </motion.div>

          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-4 z-10 mx-auto grid h-24 w-24 place-items-center rounded-full bg-cream text-gold shadow-[0_20px_50px_-20px_rgba(169,124,63,0.9)] sm:h-28 sm:w-28"
          >
            <Check size={44} strokeWidth={1.6} />
          </motion.div>

          <div className="absolute inset-x-0 bottom-0 h-28 rounded-b-3xl border border-t-0 border-line bg-ivory sm:h-32">
            <div className="absolute inset-x-0 top-0 h-4 bg-[linear-gradient(-45deg,transparent_33.33%,var(--color-cream)_33.33%,var(--color-cream)_66.66%,transparent_66.66%)] bg-[length:16px_16px]" />
          </div>

          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], y: -90 - i * 12, scale: [0, 1, 0.6] }}
              transition={{ duration: 1.7, delay: 1 + i * 0.09, ease: 'easeOut' }}
              className="absolute left-1/2 top-8 h-1.5 w-1.5 rounded-full bg-gold"
              style={{ marginLeft: (i - 2.5) * 26 }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.15 }}
          className="text-center"
        >
          <p className="eyebrow text-[10px] text-gold">Merci infiniment</p>
          <h1 className="headline mt-4 text-3xl leading-relaxed text-cocoa sm:text-4xl">
            شكرًا {order.customer_name.split(' ')[0]}، طلبك في أيدٍ أمينة
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[14px] leading-loose text-mocha">
            وصلتنا تفاصيل صندوقك، وسيبدأ فريقنا بتحضيره طازجًا. أرسل لنا تفاصيل الطلب عبر
            واتساب لتأكيد الموعد مباشرة.
          </p>
          <Ornament className="mt-6" />

          <div className="mt-7 inline-flex items-center gap-3 rounded-full border-2 border-dashed border-gold/40 bg-ivory px-6 py-3">
            <span className="text-[12px] text-mocha">رقم الطلب</span>
            <span className="wordmark text-[15px] text-cocoa">{order.order_code}</span>
            <button
              onClick={copyCode}
              aria-label="نسخ رقم الطلب"
              className="text-gold transition hover:text-cocoa"
            >
              {copied ? <Check size={15} /> : <Copy size={14} />}
            </button>
          </div>
        </motion.div>

        {/* ---------------------------------------------- whatsapp CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="mt-10 overflow-hidden rounded-5xl border border-pistachio/30 bg-pistachio/8 p-6 text-center sm:p-8"
        >
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-pistachio text-ivory">
            <MessageCircle size={24} />
          </span>
          <h2 className="headline mt-5 text-xl text-cocoa">أرسل طلبك عبر واتساب</h2>
          <p className="mx-auto mt-3 max-w-sm text-[13px] leading-loose text-mocha">
            اضغط ليُفتح لديك ملخّص الطلب جاهزًا للإرسال إلى فريق موسيريا، وسنؤكد لك الموعد خلال دقائق.
          </p>
          <ButtonLink
            to={whatsappUrl(order, settings.whatsapp, `${settings.brand_name_ar} | ${settings.brand_name_en}`)}
            target="_blank"
            rel="noreferrer"
            size="lg"
            className="mt-6 bg-pistachio text-ivory hover:bg-[#5c6b45]"
          >
            <MessageCircle size={18} />
            إرسال الطلب عبر واتساب
          </ButtonLink>
        </motion.div>

        {/* ---------------------------------------------- details */}
        <div className="mt-6 overflow-hidden rounded-5xl border border-line bg-ivory">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5">
            <div>
              <p className="text-[12px] text-mocha">تاريخ الطلب</p>
              <p className="mt-1 text-[13.5px] text-cocoa">{fmtDate(order.created_at)}</p>
            </div>
            <span className={`rounded-full border px-3.5 py-1.5 text-[12px] ${status.tone}`}>
              {status.label}
            </span>
          </div>

          <ul className="divide-y divide-line/70">
            {order.items.map((it, i) => (
              <li key={i} className="flex items-center gap-4 px-6 py-4">
                <img src={it.image} alt={it.name_ar} className="h-16 w-14 shrink-0 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-cocoa">{it.name_ar}</p>
                  <p className="num mt-1 text-[12px] text-mocha">
                    {fmt(it.price)} × {it.qty}
                  </p>
                </div>
                <span className="num shrink-0 text-[14px] text-cocoa">{fmt(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-2.5 border-t border-line px-6 py-5 text-[13px]">
            <div className="flex justify-between text-mocha">
              <span>{t('cart.subtotalFull')}</span>
              <span className="num text-cocoa">{fmt(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-pistachio">
                <span>الخصم {order.discount_code ? `(${order.discount_code})` : ''}</span>
                <span className="num">−{fmt(order.discount)}</span>
              </div>
            )}
            {order.gift_wrap_fee > 0 && (
              <div className="flex justify-between text-mocha">
                <span>التغليف الفاخر</span>
                <span className="num text-cocoa">{fmt(order.gift_wrap_fee)}</span>
              </div>
            )}
            <div className="flex justify-between text-mocha">
              <span>{t('cart.delivery')}</span>
              <span className={order.delivery_fee === 0 ? 'text-pistachio' : 'num text-cocoa'}>
                {order.delivery_fee === 0 ? t('cart.free') : fmt(order.delivery_fee)}
              </span>
            </div>
            <div className="mt-3 rule-gold" />
            <div className="flex items-baseline justify-between pt-2">
              <span className="text-[14.5px] font-semibold text-cocoa">{t('cart.total')}</span>
              <span className="num text-2xl text-cocoa">{fmt(order.total)}</span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------- info cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <InfoCard icon={<MapPin size={16} />} title="عنوان التوصيل">
            <p>{order.customer_name}</p>
            <p dir="ltr" className="num text-start">
              {order.phone}
            </p>
            <p>
              {order.city}
              {order.district ? ` — ${order.district}` : ''}
            </p>
            {order.address && <p className="leading-relaxed">{order.address}</p>}
          </InfoCard>

          <InfoCard icon={<Truck size={16} />} title="موعد التوصيل">
            <p>{order.delivery_date ? fmtDate(order.delivery_date) : t('order.asap')}</p>
            {order.delivery_slot && <p>{order.delivery_slot}</p>}
            <p className="text-mocha-2">يصل مبرّدًا مع عبوة تبريد</p>
          </InfoCard>

          {order.is_gift && (
            <div className="sm:col-span-2">
              <div className="rounded-4xl border border-gold/30 bg-gold/6 p-6">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-ivory">
                    <Gift size={16} />
                  </span>
                  <h3 className="text-[14px] font-semibold text-cocoa">بطاقة الإهداء</h3>
                </div>
                {order.gift_recipient && (
                  <p className="mt-4 text-[13px] text-mocha">إلى: {order.gift_recipient}</p>
                )}
                {order.gift_message && (
                  <p className="headline mt-3 text-lg leading-loose text-cocoa">
                    «{order.gift_message}»
                  </p>
                )}
                {order.gift_wrap && (
                  <p className="mt-3 text-[12px] text-gold">✓ تغليف فاخر بشريط ساتان</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink to="/shop" variant="secondary" size="lg">
            مواصلة التسوّق
            <ArrowLeft size={17} />
          </ButtonLink>
          <Link
            to="/track"
            className="inline-flex h-14 items-center gap-2 rounded-full px-6 text-sm text-mocha transition hover:text-cocoa"
          >
            <Phone size={15} />
            تتبّع الطلب لاحقًا
          </Link>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-4xl border border-line bg-ivory p-6">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-cream text-gold">{icon}</span>
        <h3 className="text-[14px] font-semibold text-cocoa">{title}</h3>
      </div>
      <div className="mt-4 space-y-1.5 text-[13px] text-mocha">{children}</div>
    </div>
  );
}
