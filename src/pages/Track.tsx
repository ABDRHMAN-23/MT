import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, MessageCircle, PackageSearch, Truck } from 'lucide-react';
import { api } from '../lib/api';
import type { Order } from '../lib/types';
import { ORDER_STATUS } from '../lib/format';
import { useLocale } from '../contexts/LocaleContext';
import { Field, inputClass, Ornament } from '../components/ui/Bits';
import { Button, ButtonLink } from '../components/ui/Button';
import { whatsappUrl } from '../lib/whatsapp';
import { useSettings } from '../contexts/SettingsContext';

const STEPS = ['new', 'preparing', 'ready', 'delivering', 'delivered'];

export default function Track() {
  const { settings } = useSettings();
  const { t, fmt, fmtDate, fmtDateTime } = useLocale();
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOrder(null);
    if (!code.trim()) return setError('اكتب رقم الطلب الموجود في رسالة التأكيد');

    setBusy(true);
    try {
      const found = await api.order(code.trim().toUpperCase());
      const digits = phone.replace(/\D/g, '');
      if (digits && !found.phone.replace(/\D/g, '').endsWith(digits.slice(-9))) {
        setError('رقم الجوال لا يطابق هذا الطلب');
        return;
      }
      setOrder(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'لم نعثر على هذا الطلب');
    } finally {
      setBusy(false);
    }
  };

  const stepIndex = order ? STEPS.indexOf(order.status) : -1;
  const cancelled = order?.status === 'cancelled';

  return (
    <section className="dust relative overflow-hidden">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gold/10 blur-[110px]" />
      <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="text-center">
          <p className="eyebrow text-[10px] text-gold">Suivi de commande</p>
          <h1 className="headline mt-4 text-3xl text-cocoa sm:text-4xl">تتبّع طلبك</h1>
          <p className="mx-auto mt-4 max-w-md text-[14px] leading-loose text-mocha">
            أدخل رقم الطلب الذي وصلك عند التأكيد لتعرف أين وصل صندوقك في رحلته من المطبخ إليك.
          </p>
          <Ornament className="mt-6" />
        </div>

        <form onSubmit={search} className="mt-10 rounded-5xl border border-line bg-ivory p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="رقم الطلب" required>
              <input
                dir="ltr"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="MS-XXXXXXX"
                className={`${inputClass} wordmark text-start`}
              />
            </Field>
            <Field label="رقم الجوال" hint="للتأكيد">
              <input
                dir="ltr"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05XXXXXXXX"
                className={`${inputClass} text-start`}
              />
            </Field>
          </div>

          {error && (
            <p className="mt-4 rounded-2xl border border-raspberry/30 bg-raspberry/8 px-4 py-3 text-[12.5px] text-raspberry">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" full className="mt-5" disabled={busy}>
            {busy ? <Loader2 size={17} className="animate-spin" /> : <PackageSearch size={17} />}
            {busy ? 'نبحث عن طلبك…' : 'تتبّع الطلب'}
          </Button>
        </form>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 overflow-hidden rounded-5xl border border-line bg-ivory"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-cream/60 px-6 py-5">
              <div>
                <p className="wordmark text-[13px] text-cocoa">{order.order_code}</p>
                <p className="mt-1 text-[12px] text-mocha">{fmtDateTime(order.created_at)}</p>
              </div>
              <span
                className={`rounded-full border px-3.5 py-1.5 text-[12px] ${
                  (ORDER_STATUS[order.status] ?? ORDER_STATUS.new).tone
                }`}
              >
                {(ORDER_STATUS[order.status] ?? ORDER_STATUS.new).label}
              </span>
            </div>

            {!cancelled ? (
              <div className="px-6 py-7">
                <div className="relative flex justify-between">
                  <span className="absolute inset-x-4 top-4 h-0.5 bg-sand-2" />
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(Math.max(0, stepIndex) / (STEPS.length - 1)) * 100}%`,
                    }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute right-4 top-4 h-0.5 bg-gold"
                  />
                  {STEPS.map((s, i) => {
                    const done = i <= stepIndex;
                    return (
                      <div key={s} className="relative flex flex-1 flex-col items-center gap-2">
                        <span
                          className={`grid h-8 w-8 place-items-center rounded-full border-2 text-[11px] transition ${
                            done
                              ? 'border-gold bg-gold text-ivory'
                              : 'border-sand-2 bg-ivory text-mocha-2'
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span
                          className={`text-center text-[10.5px] leading-tight ${
                            done ? 'text-cocoa' : 'text-mocha-2'
                          }`}
                        >
                          {ORDER_STATUS[s].label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="px-6 py-6 text-center text-[13px] text-raspberry">
                تم إلغاء هذا الطلب. تواصل معنا إن كنت ترغب بإعادته.
              </p>
            )}

            <ul className="divide-y divide-line/70 border-t border-line">
              {order.items.map((it, i) => (
                <li key={i} className="flex items-center gap-4 px-6 py-4">
                  <img src={it.image} alt="" className="h-14 w-12 shrink-0 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-cocoa">{it.name_ar}</p>
                    <p className="num mt-0.5 text-[11.5px] text-mocha">
                      {fmt(it.price)} × {it.qty}
                    </p>
                  </div>
                  <span className="num text-[13px] text-cocoa">{fmt(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t border-line px-6 py-5 text-[13px]">
              <div className="flex items-center gap-2 text-mocha">
                <Truck size={14} className="text-gold" />
                {order.delivery_date ? fmtDate(order.delivery_date) : t('order.asap')}
                {order.delivery_slot ? ` · ${order.delivery_slot}` : ''}
              </div>
              <div className="flex items-baseline justify-between pt-2">
                <span className="font-semibold text-cocoa">{t('cart.total')}</span>
                <span className="num text-xl text-cocoa">{fmt(order.total)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-line bg-cream/50 px-6 py-5 sm:flex-row">
              <ButtonLink
                to={whatsappUrl(order, settings.whatsapp, `${settings.brand_name_ar} | ${settings.brand_name_en}`)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-pistachio text-ivory hover:bg-[#5c6b45]"
              >
                <MessageCircle size={16} />
                تواصل بشأن الطلب
              </ButtonLink>
              <Link
                to={`/confirmation/${order.order_code}`}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-cocoa/25 text-[13px] text-cocoa transition hover:border-cocoa/60"
              >
                تفاصيل الطلب الكاملة
                <ArrowLeft size={15} />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
