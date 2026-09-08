import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({
  value,
  onChange,
  max = 99,
  min = 1,
  size = 'md',
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  min?: number;
  size?: 'sm' | 'md';
}) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const wrap = size === 'sm' ? 'h-8' : 'h-10';
  return (
    <div className={`inline-flex ${wrap} items-center rounded-full border border-line bg-ivory`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="إنقاص الكمية"
        className={`${box} grid place-items-center rounded-full text-cocoa-2 transition hover:bg-cream disabled:opacity-30`}
      >
        <Minus size={14} />
      </button>
      <span className="num min-w-8 text-center text-sm text-cocoa">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="زيادة الكمية"
        className={`${box} grid place-items-center rounded-full text-cocoa-2 transition hover:bg-cream disabled:opacity-30`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
