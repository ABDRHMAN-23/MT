import { useState, type ReactNode } from 'react';
import { Plus, X } from 'lucide-react';
import { inputClass } from '../ui/Bits';

export function PanelCard({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-4xl border border-line bg-ivory p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="headline text-[17px] text-cocoa">{title}</h3>
          {description && <p className="mt-1.5 text-[12.5px] leading-relaxed text-mocha">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  dir,
  type = 'text',
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  dir?: 'ltr' | 'rtl';
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1.5 text-[12.5px] font-medium text-cocoa-2">
        {label}
        {hint && <span className="text-[11px] font-normal text-mocha-2">({hint})</span>}
      </span>
      <input
        type={type}
        dir={dir}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} ${dir === 'ltr' ? 'text-start' : ''}`}
      />
    </label>
  );
}

export function AreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12.5px] font-medium text-cocoa-2">{label}</span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} resize-none leading-loose`}
      />
    </label>
  );
}

export function SwitchField({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-start transition ${
        checked ? 'border-gold bg-gold/8' : 'border-line bg-cream/40 hover:border-gold/50'
      }`}
    >
      <span>
        <span className="block text-[13px] font-medium text-cocoa">{label}</span>
        {hint && <span className="mt-0.5 block text-[11.5px] text-mocha">{hint}</span>}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-gold' : 'bg-sand-2'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-ivory shadow transition-all ${
            checked ? 'left-0.5' : 'right-0.5'
          }`}
        />
      </span>
    </button>
  );
}

export function TagInput({
  label,
  values,
  onChange,
  placeholder,
  tone = 'gold',
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  tone?: 'gold' | 'berry';
}) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const v = draft.trim();
    if (!v || values.includes(v)) return;
    onChange([...values, v]);
    setDraft('');
  };

  const toneClass =
    tone === 'berry'
      ? 'border-berry/25 bg-berry/8 text-berry'
      : 'border-gold/30 bg-gold/10 text-gold';

  return (
    <div>
      <span className="mb-2 block text-[12.5px] font-medium text-cocoa-2">{label}</span>
      <div className="flex gap-2">
        <input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          className={inputClass}
        />
        <button
          type="button"
          onClick={add}
          aria-label="إضافة"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cocoa text-cream transition hover:bg-cocoa-2"
        >
          <Plus size={16} />
        </button>
      </div>
      {values.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {values.map((v) => (
            <span
              key={v}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] ${toneClass}`}
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                aria-label={`حذف ${v}`}
                className="transition hover:text-raspberry"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function ListEditor<T>({
  items,
  onChange,
  create,
  render,
  addLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  addLabel: string;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-3xl border border-line bg-cream/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="num text-[11.5px] text-mocha-2">#{i + 1}</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => {
                  const next = [...items];
                  [next[i - 1], next[i]] = [next[i], next[i - 1]];
                  onChange(next);
                }}
                className="rounded-full px-2 py-1 text-[11px] text-mocha transition hover:text-cocoa disabled:opacity-30"
              >
                للأعلى
              </button>
              <button
                type="button"
                disabled={i === items.length - 1}
                onClick={() => {
                  const next = [...items];
                  [next[i + 1], next[i]] = [next[i], next[i + 1]];
                  onChange(next);
                }}
                className="rounded-full px-2 py-1 text-[11px] text-mocha transition hover:text-cocoa disabled:opacity-30"
              >
                للأسفل
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="rounded-full px-2 py-1 text-[11px] text-raspberry transition hover:underline"
              >
                حذف
              </button>
            </div>
          </div>
          {render(
            item,
            (patch) =>
              onChange(items.map((x, idx) => (idx === i ? { ...(x as object), ...patch } as T : x))),
            i
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, create()])}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-dashed border-line px-5 text-[12.5px] text-cocoa-2 transition hover:border-gold hover:text-gold"
      >
        <Plus size={14} />
        {addLabel}
      </button>
    </div>
  );
}
