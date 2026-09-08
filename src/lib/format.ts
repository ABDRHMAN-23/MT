export const CURRENCY = 'ر.س';
export const BRAND_PHONE = '966551234567';

export function money(value: number | string | null | undefined): string {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(n));
}

export function discountPercent(price: number, comparePrice: number | null): number | null {
  if (!comparePrice || comparePrice <= price) return null;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

const AR_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

export function arDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${d.getDate()} ${AR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function arDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const period = h >= 12 ? 'م' : 'ص';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${arDate(value)} · ${h12}:${m} ${period}`;
}

export const ORDER_STATUS: Record<string, { label: string; tone: string; dot: string }> = {
  new: { label: 'طلب جديد', tone: 'bg-gold/12 text-gold border-gold/30', dot: '#A97C3F' },
  preparing: { label: 'قيد التحضير', tone: 'bg-berry/10 text-berry border-berry/25', dot: '#7A2A3D' },
  ready: { label: 'جاهز للتغليف', tone: 'bg-pistachio/15 text-pistachio border-pistachio/30', dot: '#77875A' },
  delivering: { label: 'في الطريق', tone: 'bg-cocoa/10 text-cocoa-2 border-cocoa/20', dot: '#4B3325' },
  delivered: { label: 'تم التسليم', tone: 'bg-pistachio/20 text-pistachio border-pistachio/40', dot: '#5F7040' },
  cancelled: { label: 'ملغي', tone: 'bg-raspberry/10 text-raspberry border-raspberry/25', dot: '#A5384F' },
};

export function validPhone(phone: string): boolean {
  const clean = phone.replace(/[\s-]/g, '');
  return /^(?:\+?966|0)?5\d{8}$/.test(clean);
}

export function normalizePhone(phone: string): string {
  const clean = phone.replace(/[\s-+]/g, '');
  if (clean.startsWith('966')) return clean;
  if (clean.startsWith('0')) return `966${clean.slice(1)}`;
  return `966${clean}`;
}
