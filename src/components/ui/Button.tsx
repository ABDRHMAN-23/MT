import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-cocoa text-cream hover:bg-cocoa-2 shadow-[0_12px_30px_-14px_rgba(42,26,18,0.8)] active:translate-y-px',
  secondary:
    'bg-transparent text-cocoa border border-cocoa/25 hover:border-cocoa/60 hover:bg-cocoa/5 active:translate-y-px',
  ghost: 'bg-transparent text-cocoa-2 hover:bg-cocoa/5',
  gold: 'bg-gold text-ivory hover:bg-[#96692f] shadow-[0_12px_30px_-14px_rgba(169,124,63,0.9)] active:translate-y-px',
  danger: 'bg-raspberry text-ivory hover:bg-berry active:translate-y-px',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px] gap-1.5 rounded-full',
  md: 'h-11 px-6 text-sm gap-2 rounded-full',
  lg: 'h-14 px-8 text-base gap-2.5 rounded-full',
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  full?: boolean;
};

function classes({ variant = 'primary', size = 'md', className = '', full }: BaseProps) {
  return [
    'inline-flex items-center justify-center font-medium transition-all duration-300 select-none',
    'disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none',
    VARIANTS[variant],
    SIZES[size],
    full ? 'w-full' : '',
    className,
  ].join(' ');
}

export function Button({
  variant,
  size,
  className,
  children,
  full,
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classes({ variant, size, className, children, full })} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  to,
  variant,
  size,
  className,
  children,
  full,
  ...rest
}: BaseProps & { to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const cls = classes({ variant, size, className, children, full });
  if (to.startsWith('http') || to.startsWith('#') || to.startsWith('tel:') || to.startsWith('mailto:')) {
    return (
      <a href={to} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  );
}
