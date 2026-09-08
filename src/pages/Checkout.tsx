import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Loader2, Lock, MapPin, MessageSquareHeart, Phone, Truck } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';
import { useToast } from '../contexts/ToastContext';
import { useSettings } from '../contexts/SettingsContext';
import { api } from '../lib/api';
import { validPhone } from '../lib/format';
import { useLocale } from '../contexts/LocaleContext';
import { Field, inputClass, Ornament } from '../components/ui/Bits';
import { Button } from '../components/ui/Button';
import DiscountBox from '../components/DiscountBox';

type Errors = Record<string, string>;

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, discount, discountAmount, deliveryFee, clear, giftWrapFee: wrapFee } = useShop();
  const { toast } = useToast();
  const { settings } = useSettings();
  const { t, fmt } = useLocale();

  const CITIES = settings.cities?.length ? settings.cities : ['الرياض'];
  const SLOTS = settings.delivery_slots?.length ? settings.delivery_slots : ['٣ عصرًا – ٦ مساءً'];
  // Each dessert may restrict payment methods; only methods allowed by *every*
  // item in the box can be offered.
  const enabledMethods = (settings.payment_methods || []).filter((p) => p.enabled);
  const restrictions = items.map((l) => l.payment_methods || []).filter((a) => a.length > 0);
  const allowedValues = restrictions.length
    ? restrictions.reduce((acc, list) => acc.filter((v) => list.includes(v)))
    : null;
  const restricted = allowedValues !== null;
  const filtered = restricted
    ? enabledMethods.filter((p) => allowedValues.includes(p.value))
    : enabledMethods;
  const PAYMENTS = filtered.length ? filtered : enabledMethods;
  const paymentLimited = restricted && filtered.length > 0 && filtered.length < enabledMethods.length;
  const giftMax = Number(settings.gift_message_max ?? 160);

  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    email: '',
    city: CITIES[0],
    district: '',
    address: '',
    delivery_date: '',
    delivery_slot: SLOTS[1] || SLOTS[0],
    notes: '',
    is_gift: false,
    gift_recipient: '',
    gift_message: '',
    gift_wrap: false,
    payment_method: 'cash',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const giftWrapFee = form.gift_wrap ? wrapFee : 0;
  const total = Math.max(0, subtotal - discountAmount) + deliveryFee + giftWrapFee;

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const availableValues = PAYMENTS.map((p) => p.value).join('|');
  useEffect(() => {
    const list = availableValues ? availableValues.split('|') : [];
    if (list.length && !list.includes(form.payment_method)) {
      setForm((f) => ({ ...f, payment_method: list[0] }));
    }
  }, [availableValues, form.payment_method]);

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const set = (key: keyof typeof form, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const validate = () => {
    const e: Errors = {};
    if (form.customer_name.trim().length < 3) e.customer_name = 'اكتب اسمك الكامل من فضلك';
    if (!validPhone(form.phone)) e.phone = 'رقم جوال سعودي غير صحيح (مثال: 0551234567)';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'بريد إلكتروني غير صحيح';
    if (!form.city) e.city = 'اختر المدينة';
    if (form.address.trim().length < 8) e.address = 'اكتب العنوان بالتفصيل ليصل المندوب بسهولة';
    if (form.is_gift && form.gift_message.length > giftMax) {
      e.gift_message = `الرسالة أطول من ${giftMax} حرفًا`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError(null);
    if (!validate()) {
      toast('راجع الحقول المطلوبة', { tone: 'error' });
      const firstError = document.querySelector('[data-error="true"]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitting(true);
    try {
      const order = await api.createOrder({
        ...form,
        discount_code: discount?.code ?? null,
        items: items.map((l) => ({
          id: l.id,
          slug: l.slug,
          name_ar: l.name_ar,
          image: l.image,
          price: l.price,
          qty: l.qty,
        })),
      });
      clear();
      toast('تم استلام طلبك بنجاح', { description: `رقم الطلب ${order.order_code}`, tone: 'success' });
      navigate(`/confirmation/${order.order_code}`, { state: { order } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'تعذّر إتمام الطلب';
      setServerError(msg);
      toast('تعذّر إتمام الطلب', { description: msg, tone: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
      <div className="mb-10 text-center">
        <p className="eyebrow text-[10px] text-gold">Finalisation</p>
        <h1 className="headline mt-3 text-3xl text-cocoa lg:text-[2.6rem]">إتمام الطلب</h1>
        <p className="mt-3 text-[13.5px] text-mocha">خطوة أخيرة تفصلك عن لحظة حلوة.</p>
        <Ornament className="mt-5" />
      </div>

      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:gap-10">
        <div className="space-y-5">
          {/* contact */}
          <FormCard icon={<Phone size={16} />} title="معلومات التواصل" step="١">
            <div className="grid gap-4 sm:grid-cols-2">
              <div data-error={!!errors.customer_name}>
                <Field label="الاسم الكامل" required error={errors.customer_name}>
                  <input
                    className={inputClass}
                    value={form.customer_name}
                    onChange={(e) => set('customer_name', e.target.value)}
                    placeholder="مثال: نورة العتيبي"
                  />
                </Field>
              </div>
              <div data-error={!!errors.phone}>
                <Field label="رقم الجوال" required error={errors.phone}>
                  <input
                    className={inputClass}
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="05XXXXXXXX"
                    inputMode="tel"
                    dir="ltr"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2" data-error={!!errors.email}>
                <Field label="البريد الإلكتروني" hint="اختياري" error={errors.email}>
                  <input
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                  />
                </Field>
              </div>
            </div>
          </FormCard>

          {/* delivery */}
          <FormCard icon={<MapPin size={16} />} title="عنوان التوصيل" step="٢">
            <div className="grid gap-4 sm:grid-cols-2">
              <div data-error={!!errors.city}>
                <Field label="المدينة" required error={errors.city}>
                  <select
                    className={inputClass}
                    value={form.city}
                    onChange={(e) => set('city', e.target.value)}
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="الحي" hint="اختياري">
                <input
                  className={inputClass}
                  value={form.district}
                  onChange={(e) => set('district', e.target.value)}
                  placeholder="مثال: حي الياسمين"
                />
              </Field>
              <div className="sm:col-span-2" data-error={!!errors.address}>
                <Field label="العنوان بالتفصيل" required error={errors.address}>
                  <textarea
                    className={`${inputClass} min-h-24 resize-none`}
                    value={form.address}
                    onChange={(e) => set('address', e.target.value)}
                    placeholder="اسم الشارع، رقم المبنى، أقرب معلم…"
                  />
                </Field>
              </div>
              <Field label="تاريخ التوصيل" hint="اختياري">
                <input
                  type="date"
                  min={today}
                  className={inputClass}
                  value={form.delivery_date}
                  onChange={(e) => set('delivery_date', e.target.value)}
                />
              </Field>
              <Field label="الفترة المفضّلة">
                <select
                  className={inputClass}
                  value={form.delivery_slot}
                  onChange={(e) => set('delivery_slot', e.target.value)}
                >
                  {SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {form.city !== 'الرياض' && (
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-gold/25 bg-gold/6 p-4">
                <Truck size={15} className="mt-0.5 shrink-0 text-gold" />
                <p className="text-[12.5px] leading-relaxed text-cocoa-2">
                  خارج الرياض نستخدم شحنًا مبرّدًا خاصًا، وقد يستغرق من ٢٤ إلى ٤٨ ساعة. سيتواصل
                  معك فريقنا لتأكيد الموعد.
                </p>
              </div>
            )}
          </FormCard>

          {/* gift */}
          <FormCard icon={<Gift size={16} />} title="هل هي هدية؟" step="٣">
            <button
              type="button"
              onClick={() => set('is_gift', !form.is_gift)}
              className={`flex w-full items-center gap-4 rounded-3xl border p-4 text-start transition ${
                form.is_gift ? 'border-gold bg-gold/8' : 'border-line bg-cream/50 hover:border-gold/50'
              }`}
            >
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition ${
                  form.is_gift ? 'bg-gold text-ivory' : 'bg-sand text-mocha'
                }`}
              >
                <Gift size={18} />
              </span>
              <span className="flex-1">
                <span className="block text-[14px] font-semibold text-cocoa">نعم، أرسلها كهدية</span>
                <span className="mt-0.5 block text-[12px] text-mocha">
                  نخفي الفاتورة ونضيف بطاقة إهداء بخط اليد
                </span>
              </span>
              <span
                className={`h-5 w-5 shrink-0 rounded-full border-2 transition ${
                  form.is_gift ? 'border-gold bg-gold' : 'border-sand-2'
                }`}
              />
            </button>

            {form.is_gift && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-hidden"
              >
                <div className="mt-5 space-y-4">
                  <Field label="اسم من ستصله الهدية" hint="اختياري">
                    <input
                      className={inputClass}
                      value={form.gift_recipient}
                      onChange={(e) => set('gift_recipient', e.target.value)}
                      placeholder="مثال: أمي الغالية"
                    />
                  </Field>

                  <div data-error={!!errors.gift_message}>
                    <Field label="رسالة الإهداء" error={errors.gift_message}>
                      <div className="relative">
                        <MessageSquareHeart
                          size={16}
                          className="pointer-events-none absolute right-4 top-4 text-gold"
                        />
                        <textarea
                          maxLength={giftMax}
                          className={`${inputClass} min-h-28 resize-none pe-11 leading-loose`}
                          value={form.gift_message}
                          onChange={(e) => set('gift_message', e.target.value)}
                          placeholder="كل عام وأنتِ أحلى من كل شيء… بحبك."
                        />
                      </div>
                    </Field>
                    <p className="num mt-1.5 text-end text-[11px] text-mocha-2">
                      {form.gift_message.length} / {giftMax}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => set('gift_wrap', !form.gift_wrap)}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-start transition ${
                      form.gift_wrap ? 'border-gold bg-gold/8' : 'border-line hover:border-gold/50'
                    }`}
                  >
                    <span>
                      <span className="block text-[13.5px] font-medium text-cocoa">
                        تغليف فاخر بشريط ساتان
                      </span>
                      <span className="mt-0.5 block text-[11.5px] text-mocha">
                        صندوق مقوّى، ورق حريري، وختم شمعي
                      </span>
                    </span>
                    <span className="num shrink-0 text-[13px] text-gold">+{fmt(wrapFee)}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </FormCard>

          {/* payment + notes */}
          <FormCard icon={<Lock size={16} />} title="طريقة الدفع" step="٤">
            <div className="grid gap-3 sm:grid-cols-3">
              {PAYMENTS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => set('payment_method', p.value)}
                  className={`rounded-3xl border p-4 text-start transition ${
                    form.payment_method === p.value
                      ? 'border-gold bg-gold/8'
                      : 'border-line bg-cream/40 hover:border-gold/50'
                  }`}
                >
                  <span
                    className={`mb-3 block h-4 w-4 rounded-full border-2 transition ${
                      form.payment_method === p.value ? 'border-gold bg-gold' : 'border-sand-2'
                    }`}
                  />
                  <span className="block text-[13.5px] font-medium text-cocoa">{p.label}</span>
                  <span className="mt-1 block text-[11.5px] leading-relaxed text-mocha">{p.hint}</span>
                </button>
              ))}
            </div>

            {paymentLimited && (
              <p className="mt-4 rounded-2xl border border-gold/25 bg-gold/6 px-4 py-3 text-[12.5px] leading-relaxed text-cocoa-2">
                بعض الحلويات في صندوقك تقبل طرق دفع محددة، لذلك عرضنا الطرق المشتركة فقط.
              </p>
            )}

            <div className="mt-5">
              <Field label="ملاحظات للمطبخ" hint="اختياري">
                <textarea
                  className={`${inputClass} min-h-20 resize-none`}
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="مثال: بدون مكسرات من فضلكم، أو اتصلوا قبل الوصول."
                />
              </Field>
            </div>
          </FormCard>
        </div>

        {/* -------------------------------------------------- summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-5xl border border-line bg-ivory p-6">
            <h2 className="headline text-xl text-cocoa">صندوقك</h2>
            <div className="my-5 rule-gold" />

            <ul className="thin-scroll max-h-72 space-y-3 overflow-y-auto pe-1">
              {items.map((l) => (
                <li key={l.id} className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img src={l.image} alt={l.name_ar} className="h-16 w-14 rounded-2xl object-cover" />
                    <span className="num absolute -left-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-cocoa px-1 text-[10px] text-cream">
                      {l.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-cocoa">{l.name_ar}</p>
                    <p className="num mt-0.5 text-[11.5px] text-mocha">{fmt(l.price)}</p>
                  </div>
                  <span className="num shrink-0 text-[13.5px] text-cocoa">{fmt(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="my-5 rule-gold" />
            <DiscountBox compact />

            <div className="mt-5 space-y-2.5 text-[13px]">
              <Row label={t('cart.subtotalFull')} value={fmt(subtotal)} />
              {discountAmount > 0 && (
                <Row label={t('cart.discount')} value={`−${fmt(discountAmount)}`} tone="pistachio" />
              )}
              {giftWrapFee > 0 && <Row label="التغليف الفاخر" value={fmt(giftWrapFee)} />}
              <Row
                label={t('cart.delivery')}
                value={deliveryFee === 0 ? t('cart.free') : fmt(deliveryFee)}
                tone={deliveryFee === 0 ? 'pistachio' : undefined}
              />
            </div>

            <div className="my-5 rule-gold" />
            <div className="flex items-baseline justify-between">
              <span className="text-[15px] font-semibold text-cocoa">الإجمالي</span>
              <span className="num text-3xl text-cocoa">
                {fmt(total)}
              </span>
            </div>

            {serverError && (
              <p className="mt-4 rounded-2xl border border-raspberry/30 bg-raspberry/8 px-4 py-3 text-[12.5px] text-raspberry">
                {serverError}
              </p>
            )}

            <Button type="submit" size="lg" full className="mt-6" disabled={submitting}>
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Gift size={18} />}
              {submitting ? 'نُغلّف صندوقك…' : 'تأكيد الطلب'}
            </Button>

            <p className="mt-4 text-center text-[11.5px] leading-relaxed text-mocha">
              بتأكيدك للطلب فأنت توافق على{' '}
              <Link to="/story" className="text-gold underline">
                سياسة التحضير والتوصيل
              </Link>{' '}
              الخاصة بموسيريا.
            </p>
            <div className="mt-4 flex justify-center">
              <Link to="/cart" className="inline-flex items-center gap-1.5 text-[12.5px] text-mocha hover:text-cocoa">
                <ArrowLeft size={13} className="rotate-180" />
                العودة إلى الصندوق
              </Link>
            </div>
          </div>
        </aside>
      </form>
    </section>
  );
}

function FormCard({
  icon,
  title,
  step,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  step: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-5xl border border-line bg-ivory p-5 sm:p-7"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream text-gold">
          {icon}
        </span>
        <h2 className="headline text-lg text-cocoa">{title}</h2>
        <span className="headline me-auto text-sm text-sand-2">{step}</span>
      </div>
      {children}
    </motion.section>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className={`flex justify-between ${tone === 'pistachio' ? 'text-pistachio' : 'text-mocha'}`}>
      <span>{label}</span>
      <span className={tone === 'pistachio' ? 'num' : 'num text-cocoa'}>{value}</span>
    </div>
  );
}
