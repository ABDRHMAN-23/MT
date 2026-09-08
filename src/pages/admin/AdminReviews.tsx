import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Eye, Trash2, X } from 'lucide-react';
import { api } from '../../lib/api';
import type { Review } from '../../lib/types';
import { arDateTime } from '../../lib/format';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../contexts/ConfirmContext';
import { EmptyState, Stars } from '../../components/ui/Bits';

const FILTERS = [
  { value: 'pending', label: 'بانتظار المراجعة' },
  { value: 'approved', label: 'منشورة' },
  { value: 'rejected', label: 'مرفوضة' },
  { value: 'all', label: 'الكل' },
];

const STATUS_TONE: Record<string, string> = {
  pending: 'border-gold/30 bg-gold/12 text-gold',
  approved: 'border-pistachio/30 bg-pistachio/12 text-pistachio',
  rejected: 'border-raspberry/25 bg-raspberry/10 text-raspberry',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'بانتظار المراجعة',
  approved: 'منشور',
  rejected: 'مرفوض',
};

export default function AdminReviews() {
  const { toast } = useToast();
  const confirm = useConfirm();
  const [rows, setRows] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('pending');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await api.reviews({ status: 'all' }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذّر تحميل الآراء');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter]
  );

  const counts = useMemo(
    () => ({
      pending: rows.filter((r) => r.status === 'pending').length,
      approved: rows.filter((r) => r.status === 'approved').length,
      rejected: rows.filter((r) => r.status === 'rejected').length,
      all: rows.length,
    }),
    [rows]
  );

  const setStatus = async (r: Review, status: string) => {
    try {
      await api.updateReview(r.id, status);
      toast(status === 'approved' ? 'تم نشر الرأي' : 'تم رفض الرأي', {
        description: `${r.name} · ${r.product_name_ar || r.product_slug}`,
        tone: status === 'approved' ? 'success' : 'info',
      });
      load();
    } catch (e) {
      toast('تعذّر التحديث', { description: e instanceof Error ? e.message : undefined, tone: 'error' });
    }
  };

  const remove = async (r: Review) => {
    const ok = await confirm({
      title: 'حذف هذا الرأي؟',
      description: `رأي «${r.name}» سيُحذف نهائيًا، وسيُعاد احتساب تقييم الحلوى تلقائيًا.`,
      confirmLabel: 'نعم، احذف الرأي',
    });
    if (!ok) return;
    await api.deleteReview(r.id);
    toast('تم الحذف', { tone: 'info' });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-[10px] text-gold">Avis</p>
        <h1 className="headline mt-2 text-2xl text-cocoa sm:text-3xl">آراء المنتجات</h1>
        <p className="mt-1.5 text-[13px] text-mocha">
          راجع الآراء قبل نشرها — تقييم كل حلوى يُحسب تلقائيًا من الآراء المنشورة.
        </p>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[12.5px] transition ${
              filter === f.value
                ? 'border-cocoa bg-cocoa text-cream'
                : 'border-line bg-ivory text-cocoa-2 hover:border-gold'
            }`}
          >
            {f.label}
            <span className="num opacity-70">{counts[f.value as keyof typeof counts]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-4xl" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-4xl border border-raspberry/25 bg-raspberry/5 px-6 py-12 text-center">
          <p className="text-sm text-berry">{error}</p>
          <button onClick={load} className="mt-5 rounded-full bg-cocoa px-6 py-2.5 text-[13px] text-cream">
            إعادة المحاولة
          </button>
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          title="لا توجد آراء هنا"
          description="عندما يرسل عميل رأيًا من صفحة المنتج سيظهر في هذه القائمة لمراجعته."
        />
      ) : (
        <div className="space-y-3">
          {visible.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.04 }}
              className="rounded-4xl border border-line bg-ivory p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cocoa text-[13px] text-cream">
                    {r.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-cocoa">{r.name}</p>
                    <p className="text-[11.5px] text-mocha">
                      {r.city ? `${r.city} · ` : ''}
                      {arDateTime(r.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Stars value={r.rating} size={13} />
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] ${STATUS_TONE[r.status]}`}>
                    {STATUS_LABEL[r.status]}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-[13.5px] leading-loose text-cocoa-2">{r.text_ar}</p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <Link
                  to={`/dessert/${r.product_slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-[12.5px] text-gold hover:underline"
                >
                  <Eye size={13} />
                  {r.product_name_ar || r.product_slug}
                </Link>
                <div className="flex gap-2">
                  {r.status !== 'approved' && (
                    <button
                      onClick={() => setStatus(r, 'approved')}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-pistachio px-4 text-[12px] text-ivory transition hover:bg-[#5c6b45]"
                    >
                      <Check size={14} />
                      نشر
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button
                      onClick={() => setStatus(r, 'rejected')}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-[12px] text-cocoa-2 transition hover:border-raspberry hover:text-raspberry"
                    >
                      <X size={14} />
                      رفض
                    </button>
                  )}
                  <button
                    onClick={() => remove(r)}
                    aria-label="حذف"
                    className="grid h-9 w-9 place-items-center rounded-full bg-raspberry/10 text-raspberry transition hover:bg-raspberry hover:text-ivory"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
