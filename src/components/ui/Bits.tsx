import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '../../contexts/LocaleContext';

/* ------------------------------------------------------------------ Reveal */

export function Reveal({
  children,
  delay = 0,
  y = 22,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------- Ornament */

export function Ornament({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-2 sm:w-16" />
      <svg width="22" height="14" viewBox="0 0 22 14" fill="none" className="text-gold">
        <path
          d="M11 1c2.2 2.4 4.6 3.3 7.4 3.3-1.4 2-2.1 4-2.1 6.2-2.1-.9-3.9-.6-5.3 1-1.4-1.6-3.2-1.9-5.3-1 0-2.2-.7-4.2-2.1-6.2C6.4 4.3 8.8 3.4 11 1Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-2 sm:w-16" />
    </div>
  );
}

/* ------------------------------------------------------------- SectionHead */

export function SectionHead({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'start';
  action?: ReactNode;
}) {
  const isCenter = align === 'center';
  return (
    <div
      className={`flex flex-col gap-4 ${
        isCenter ? 'items-center text-center' : 'items-start text-start md:flex-row md:items-end md:justify-between'
      }`}
    >
      <div className={isCenter ? 'flex flex-col items-center' : ''}>
        {eyebrow && (
          <p className="eyebrow mb-3 text-[10px] text-gold sm:text-[11px]">{eyebrow}</p>
        )}
        <h2 className="headline text-2xl text-cocoa sm:text-3xl lg:text-[2.6rem]">{title}</h2>
        {subtitle && (
          <p
            className={`mt-3 max-w-xl text-sm leading-loose text-mocha sm:text-[15px] ${
              isCenter ? 'mx-auto' : ''
            }`}
          >
            {subtitle}
          </p>
        )}
        {isCenter && <Ornament className="mt-5" />}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ Badge */

export function Badge({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'gold' | 'berry' | 'pistachio' | 'cocoa' | 'raspberry';
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-sand text-cocoa-2 border-line',
    gold: 'bg-gold/12 text-gold border-gold/30',
    berry: 'bg-berry/10 text-berry border-berry/25',
    raspberry: 'bg-raspberry text-ivory border-raspberry',
    pistachio: 'bg-pistachio/15 text-pistachio border-pistachio/30',
    cocoa: 'bg-cocoa text-cream border-cocoa',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* --------------------------------------------------------------- Skeletons */

export function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-4xl border border-line/60 bg-ivory">
      <div className="skeleton aspect-[4/5] w-full" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-4 w-3/4 rounded-full" />
        <div className="skeleton h-3 w-1/2 rounded-full" />
        <div className="skeleton h-5 w-1/3 rounded-full" />
      </div>
    </div>
  );
}

export function LineSkeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-full ${className}`} />;
}

/* ------------------------------------------------------------- EmptyState */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-line bg-ivory/70 px-6 py-16 text-center">
      <div className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-cream text-gold">
        {icon ?? <PlateGlyph />}
      </div>
      <h3 className="headline text-xl text-cocoa">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-loose text-mocha">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function PlateGlyph({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <ellipse cx="24" cy="36" rx="17" ry="5" stroke="currentColor" strokeWidth="1.4" opacity=".5" />
      <path
        d="M13 33c0-7 5-12 11-12s11 5 11 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M18 21c1.6-2.5 3.6-3.8 6-3.8s4.4 1.3 6 3.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity=".7"
      />
      <path d="M24 17v-4M24 13c-2 0-3-1.2-3-2.6 0-1.6 1.6-2.4 3-4.4 1.4 2 3 2.8 3 4.4C27 11.8 26 13 24 13Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ Stars */

export function Stars({ value, size = 12 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-gold" aria-label={`التقييم ${value} من 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 1.6l2.4 5.1 5.6.8-4 3.9.9 5.6L10 14.4 5.1 17l.9-5.6-4-3.9 5.6-.8L10 1.6Z"
            fill={value >= i - 0.5 ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ Price */

export function Price({
  value,
  compare,
  size = 'md',
}: {
  value: number;
  compare?: number | null;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { lang, currency, fmtPlain } = useLocale();
  const sizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  };
  const symbol = lang === 'ar' ? currency.symbol_ar : currency.symbol_en;
  return (
    <span className="inline-flex items-baseline gap-2">
      {lang === 'en' && <span className="text-[11px] text-mocha">{symbol}</span>}
      <span className={`num text-cocoa ${sizes[size]}`}>{fmtPlain(value)}</span>
      {lang === 'ar' && <span className="text-[11px] text-mocha">{symbol}</span>}
      {compare && compare > value ? (
        <span className="num text-sm text-mocha-2 line-through decoration-raspberry/60">
          {fmtPlain(compare)}
        </span>
      ) : null}
    </span>
  );
}

/* ------------------------------------------------------------------ Field */

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-cocoa-2">
        {label}
        {required && <span className="text-raspberry">*</span>}
        {hint && <span className="text-[11px] font-normal text-mocha-2">({hint})</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-[12px] text-raspberry">{error}</span>}
    </label>
  );
}

export const inputClass =
  'w-full rounded-2xl border border-line bg-ivory px-4 py-3 text-sm text-cocoa placeholder:text-mocha-2/70 transition focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/10';
