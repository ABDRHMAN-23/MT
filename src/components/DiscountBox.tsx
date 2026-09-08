import { useState } from 'react';
import { BadgePercent, Check, Loader2, X } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';
import { useToast } from '../contexts/ToastContext';
import { api } from '../lib/api';
import { useLocale } from '../contexts/LocaleContext';

export default function DiscountBox({ compact = false }: { compact?: boolean }) {
  const { subtotal, discount, applyDiscount } = useShop();
  const { toast } = useToast();
  const { t, fmt } = useLocale();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = code.trim();
    if (!value) {
      setError(t('discount.enter'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await api.validateDiscount(value, subtotal);
      if (res.valid && res.amount != null) {
        applyDiscount({
          code: res.code || value.toUpperCase(),
          amount: res.amount,
          label:
            res.type === 'percent'
              ? t('discount.percentOff', { v: res.value ?? 0 })
              : t('discount.amountOff', { v: fmt(res.value ?? 0) }),
        });
        setCode('');
        toast(t('discount.applied'), {
          description: t('discount.saved', { amount: fmt(res.amount) }),
          tone: 'success',
        });
      } else {
        setError(res.reason || t('discount.invalid'));
        toast(t('discount.invalidTitle'), { description: res.reason, tone: 'error' });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('discount.failed');
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  if (discount) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-pistachio/35 bg-pistachio/8 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-pistachio text-ivory">
            <Check size={14} />
          </span>
          <div className="min-w-0">
            <p className="wordmark truncate text-[12px] text-cocoa">{discount.code}</p>
            <p className="text-[11px] text-pistachio">
              {discount.label} · −{fmt(discount.amount)}
            </p>
          </div>
        </div>
        <button
          onClick={() => applyDiscount(null)}
          aria-label={t('discount.remove')}
          className="shrink-0 rounded-full p-1.5 text-mocha transition hover:bg-cream hover:text-raspberry"
        >
          <X size={15} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      {!compact && (
        <p className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-cocoa-2">
          <BadgePercent size={14} className="text-gold" />
          {t('discount.q')}
        </p>
      )}
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError(null);
          }}
          placeholder="MOUSSE15"
          dir="ltr"
          aria-label={t('discount.aria')}
          className={`wordmark h-12 flex-1 rounded-2xl border bg-ivory px-4 text-[13px] text-cocoa placeholder:text-mocha-2/60 transition focus:outline-none focus:ring-4 focus:ring-gold/10 ${
            error ? 'border-raspberry' : 'border-line focus:border-gold'
          }`}
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-cocoa px-5 text-[13px] text-cream transition hover:bg-cocoa-2 disabled:opacity-50"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : null}
          {t('discount.apply')}
        </button>
      </div>
      {error && <p className="mt-2 text-[12px] text-raspberry">{error}</p>}
    </form>
  );
}
