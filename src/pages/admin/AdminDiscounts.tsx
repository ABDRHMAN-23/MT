import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';
import { api } from '../../lib/api';
import type { DiscountCode } from '../../lib/types';
import { arDate, money } from '../../lib/format';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../contexts/ConfirmContext';
import { EmptyState, Field, inputClass } from '../../components/ui/Bits';
import { Button } from '../../components/ui/Button';

export default function AdminDiscounts() {
  const { toast } = useToast();
  const confirm = useConfirm();
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    code: '',
    type: 'percent' as 'percent' | 'fixed',
    value: '10',
    min_order: '0',
    max_uses: '',
    expires_at: '',
    description_ar: '',
  });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setCodes(await api.discounts());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذّر تحميل الرموز');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.code.trim().length < 3) {
      setFormError('الرمز قصير جدًا');
      return;
    }
    if (!Number(draft.value) || Number(draft.value) <= 0) {
      setFormError('أدخل قيمة خصم صحيحة');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await api.createDiscount({
        code: draft.code.trim().toUpperCase(),
        type: draft.type,
        value: Number(draft.value),
        min_order: Number(draft.min_order) || 0,
        max_uses: draft.max_uses ? Number(draft.max_uses) : null,
        expires_at: draft.expires_at || null,
        description_ar: draft.description_ar,
        active: true,
      });
      toast('تم إنشاء رمز الخصم');
      setOpen(false);
      setDraft({
        code: '',
        type: 'percent',
        value: '10',
        min_order: '0',
        max_uses: '',
        expires_at: '',
        description_ar: '',
      });
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'تعذّر الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (c: DiscountCode) => {
    try {
      await api.updateDiscount({ id: c.id, active: !c.active });
      load();
    } catch {
      toast('تعذّر التحديث', { tone: 'error' });
    }
  };

  const remove = async (c: DiscountCode) => {
    const ok = await confirm({
      title: `حذف الرمز ${c.code}؟`,
      description: 'لن يتمكّن العملاء من استخدام هذا الرمز بعد الحذف. يمكنك إيقافه مؤقتًا بدلًا من ذلك.',
      confirmLabel: 'نعم، احذف الرمز',
    });
    if (!ok) return;
    try {
      await api.deleteDiscount(c.id);
      toast('تم الحذف', { tone: 'info' });
      load();
    } catch {
      toast('تعذّر الحذف', { tone: 'error' });
    }
  };

  const isExpired = (c: DiscountCode) => !!c.expires_at && new Date(c.expires_at) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-[10px] text-gold">Codes promo</p>
          <h1 className="headline mt-2 text-2xl text-cocoa sm:text-3xl">رموز الخصم</h1>
          <p className="mt-1.5 text-[13px] text-mocha">أنشئ عروضًا موسمية وتابع استخدامها.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} />
          رمز جديد
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-44 rounded-4xl" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-4xl border border-raspberry/25 bg-raspberry/5 px-6 py-12 text-center">
          <p className="text-sm text-berry">{error}</p>
          <button onClick={load} className="mt-5 rounded-full bg-cocoa px-6 py-2.5 text-[13px] text-cream">
            إعادة المحاولة
          </button>
        </div>
      ) : codes.length === 0 ? (
        <EmptyState title="لا توجد رموز خصم" description="أنشئ رمزًا لتشجيع عملائك على تجربة المزيد." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {codes.map((c) => {
            const expired = isExpired(c);
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative overflow-hidden rounded-4xl border p-5 ${
                  c.active && !expired ? 'border-gold/35 bg-ivory' : 'border-line bg-cream/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="wordmark text-[15px] text-cocoa">{c.code}</p>
                    <p className="num mt-2 text-2xl text-gold">
                      {c.type === 'percent' ? `${c.value}%` : `${money(c.value)} ر.س`}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(c)}
                    aria-label="حذف"
                    className="grid h-9 w-9 place-items-center rounded-full bg-raspberry/10 text-raspberry transition hover:bg-raspberry hover:text-ivory"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {c.description_ar && (
                  <p className="mt-3 text-[12.5px] leading-relaxed text-mocha">{c.description_ar}</p>
                )}

                <dl className="mt-4 space-y-1.5 text-[12px] text-mocha">
                  <div className="flex justify-between">
                    <dt>الحد الأدنى</dt>
                    <dd className="num text-cocoa-2">
                      {c.min_order ? `${money(c.min_order)} ر.س` : 'لا يوجد'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>مرات الاستخدام</dt>
                    <dd className="num text-cocoa-2">
                      {c.used_count}
                      {c.max_uses ? ` / ${c.max_uses}` : ''}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>تنتهي في</dt>
                    <dd className="text-cocoa-2">{c.expires_at ? arDate(c.expires_at) : 'بلا تاريخ'}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] ${
                      expired
                        ? 'bg-raspberry/10 text-raspberry'
                        : c.active
                          ? 'bg-pistachio/15 text-pistachio'
                          : 'bg-sand text-mocha'
                    }`}
                  >
                    {expired ? 'منتهٍ' : c.active ? 'مفعّل' : 'موقوف'}
                  </span>
                  <button
                    onClick={() => toggle(c)}
                    className="text-[12px] text-cocoa-2 underline transition hover:text-gold"
                  >
                    {c.active ? 'إيقاف' : 'تفعيل'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-end justify-center overflow-y-auto sm:items-center sm:p-6"
          >
            <div className="absolute inset-0 bg-cocoa/55 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.form
              onSubmit={create}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative my-auto max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-5xl bg-cream p-6 sm:rounded-5xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="headline text-xl text-cocoa">رمز خصم جديد</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="إغلاق"
                  className="grid h-10 w-10 place-items-center rounded-full bg-ivory text-cocoa"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <Field label="الرمز" required>
                  <input
                    dir="ltr"
                    className={`${inputClass} wordmark text-start`}
                    value={draft.code}
                    onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })}
                    placeholder="MOUSSE15"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="نوع الخصم">
                    <select
                      className={inputClass}
                      value={draft.type}
                      onChange={(e) =>
                        setDraft({ ...draft, type: e.target.value as 'percent' | 'fixed' })
                      }
                    >
                      <option value="percent">نسبة مئوية %</option>
                      <option value="fixed">مبلغ ثابت ر.س</option>
                    </select>
                  </Field>
                  <Field label="القيمة" required>
                    <input
                      type="number"
                      min={1}
                      className={inputClass}
                      value={draft.value}
                      onChange={(e) => setDraft({ ...draft, value: e.target.value })}
                    />
                  </Field>
                  <Field label="الحد الأدنى للطلب">
                    <input
                      type="number"
                      min={0}
                      className={inputClass}
                      value={draft.min_order}
                      onChange={(e) => setDraft({ ...draft, min_order: e.target.value })}
                    />
                  </Field>
                  <Field label="أقصى عدد استخدام" hint="اختياري">
                    <input
                      type="number"
                      min={1}
                      className={inputClass}
                      value={draft.max_uses}
                      onChange={(e) => setDraft({ ...draft, max_uses: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label="تاريخ الانتهاء" hint="اختياري">
                  <input
                    type="date"
                    className={inputClass}
                    value={draft.expires_at}
                    onChange={(e) => setDraft({ ...draft, expires_at: e.target.value })}
                  />
                </Field>
                <Field label="وصف مختصر">
                  <input
                    className={inputClass}
                    value={draft.description_ar}
                    onChange={(e) => setDraft({ ...draft, description_ar: e.target.value })}
                    placeholder="خصم على صناديق الهدايا"
                  />
                </Field>
              </div>

              {formError && (
                <p className="mt-5 rounded-2xl border border-raspberry/30 bg-raspberry/8 px-4 py-3 text-[12.5px] text-raspberry">
                  {formError}
                </p>
              )}

              <div className="mt-7 flex gap-3">
                <Button type="submit" size="lg" full disabled={saving}>
                  {saving ? 'جارٍ الحفظ…' : 'إنشاء الرمز'}
                </Button>
                <Button type="button" variant="secondary" size="lg" onClick={() => setOpen(false)}>
                  إلغاء
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
