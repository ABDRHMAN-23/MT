import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

export function Monogram({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5.5 30.5C5.5 22.2 11.9 15.5 20 15.5s14.5 6.7 14.5 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.5 30.5c0-5.5 4.2-10 9.5-10s9.5 4.5 9.5 10"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity=".45"
      />
      <path
        d="M20 15.6c0-3.1-3.5-2.7-3.5-5.6C16.5 7.7 18.5 7 20 4.8c1.5 2.2 3.5 2.9 3.5 5.2 0 2.9-3.5 2.5-3.5 5.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M2.5 31.4h35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7.5 35h25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".4" />
    </svg>
  );
}

export default function Logo({
  tone = 'cocoa',
  compact = false,
}: {
  tone?: 'cocoa' | 'cream';
  compact?: boolean;
}) {
  const { settings } = useSettings();
  const color = tone === 'cream' ? 'text-cream' : 'text-cocoa';
  const sub = tone === 'cream' ? 'text-cream/60' : 'text-mocha';
  return (
    <Link
      to="/"
      className={`group flex items-center gap-2.5 ${color}`}
      aria-label={`${settings.brand_name_ar} — الصفحة الرئيسية`}
    >
      <Monogram size={compact ? 30 : 38} className="text-gold transition-transform duration-500 group-hover:-translate-y-0.5" />
      <span className="flex flex-col leading-none">
        <span className={`wordmark text-[13px] sm:text-[15px] ${color}`}>{settings.brand_name_en}</span>
        {!compact && (
          <span className={`mt-1 text-[11px] tracking-[0.2em] ${sub}`}>{settings.brand_name_ar}</span>
        )}
      </span>
    </Link>
  );
}
