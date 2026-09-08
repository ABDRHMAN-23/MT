import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, PenLine, Star } from 'lucide-react';
import { api } from '../lib/api';
import type { Review } from '../lib/types';
import { useLocale } from '../contexts/LocaleContext';
import { Field, inputClass, Stars } from './ui/Bits';
import { Button } from './ui/Button';
import { useToast } from '../contexts/ToastContext';

export default function ProductReviews({
  slug,
  productName,
}: {
  slug: string;
  productName: string;
}) {
  const { toast } = useToast();
  const { fmtDate } = useLocale();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', city: '', rating: 5, text_ar: '' });

  const load = async () => {
    setLoading(true);
    try {
      setReviews(await api.reviews({ slug, status: 'approved' }));
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    setSent(false);
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.name.trim().length < 2) return setError('اكتب اسمك من فضلك');
    if (form.text_ar.trim().length < 10) return setError('اكتب رأيك في ١٠ أحرف على الأقل');

    setBusy(true);
    try {
      await api.createReview({
        product_slug: slug,
        product_name_ar: productName,
        name: form.name.trim(),
        city: form.city.trim(),
        rating: form.rating,
        text_ar: form.text_ar.trim(),
      });
      setSent(true);
      setOpen(false);
      setForm({ name: '', city: '', rating: 5, text_ar: '' });
      toast('وصلنا رأيك، شكرًا لك', {
        description: 'سيظهر بعد مراجعته من فريق موسيريا',
        tone: 'love',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر إرسال الرأي');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="reviews" className="mt-12 scroll-mt-28 border-t border-line pt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow text-[10px] text-gold">Avis clients</p>
          <h2 className="headline mt-2 text-xl text-cocoa">
            آراء من تذوّقها
            {reviews.length > 0 && (
              <span className="num ms-2 text-[13px] text-mocha">({reviews.length})</span>
            )}
          </h2>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setOpen((v) => !v)}>
          <PenLine size={14} />
          {open ? 'إغلاق' : 'أضف رأيك'}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={submit}
            className="overflow-hidden"
          >
            <div className="mt-6 space-y-4 rounded-4xl border border-line bg-ivory p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="الاسم" required>
                  <input
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="مثال: نورة"
                  />
                </Field>
                <Field label="المدينة" hint="اختياري">
                  <input
                    className={inputClass}
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="الرياض"
                  />
                </Field>
              </div>

              <div>
                <span className="mb-2 block text-[13px] font-medium text-cocoa-2">تقييمك</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm({ ...form, rating: n })}
                      aria-label={`${n} من 5`}
                      className={`grid h-10 w-10 place-items-center rounded-full border transition ${
                        n <= form.rating
                          ? 'border-gold bg-gold/12 text-gold'
                          : 'border-line text-mocha-2 hover:border-gold/50'
                      }`}
                    >
                      <Star size={16} fill={n <= form.rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <Field label="رأيك" required>
                <textarea
                  className={`${inputClass} min-h-24 resize-none leading-loose`}
                  value={form.text_ar}
                  onChange={(e) => setForm({ ...form, text_ar: e.target.value })}
                  placeholder="كيف كان القوام والمذاق؟ وهل تنصح به؟"
                />
              </Field>

              {error && (
                <p className="rounded-2xl border border-raspberry/30 bg-raspberry/8 px-4 py-3 text-[12.5px] text-raspberry">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={busy} full>
                {busy && <Loader2 size={15} className="animate-spin" />}
                إرسال الرأي
              </Button>
              <p className="text-center text-[11.5px] text-mocha">
                تُراجَع كل الآراء يدويًا قبل نشرها للحفاظ على مصداقيتها.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {sent && (
        <div className="mt-6 flex items-center gap-2.5 rounded-3xl border border-pistachio/30 bg-pistachio/8 px-4 py-3.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-pistachio text-ivory">
            <Check size={14} />
          </span>
          <p className="text-[12.5px] text-cocoa-2">
            وصلنا رأيك وسيظهر هنا فور مراجعته. شكرًا لثقتك بموسيريا.
          </p>
        </div>
      )}

      <div className="mt-7">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="skeleton h-32 rounded-4xl" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-4xl border border-dashed border-line bg-ivory px-6 py-10 text-center">
            <p className="text-[13.5px] leading-loose text-mocha">
              لا توجد آراء منشورة لهذه الحلوى بعد — كن أول من يشاركنا انطباعه.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.map((r, i) => (
              <motion.blockquote
                key={r.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i, 4) * 0.06 }}
                className="rounded-4xl border border-line bg-ivory p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cocoa text-[12px] text-cream">
                      {r.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-cocoa">{r.name}</p>
                      <p className="truncate text-[11px] text-mocha">
                        {r.city ? `${r.city} · ` : ''}
                        {fmtDate(r.created_at)}
                      </p>
                    </div>
                  </div>
                  <Stars value={r.rating} size={12} />
                </div>
                <p className="mt-4 text-[13px] leading-loose text-cocoa-2">{r.text_ar}</p>
              </motion.blockquote>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
