import { intlLocale, type Lang } from './i18n';

export type CurrencyCode =
  | 'SAR'
  | 'AED'
  | 'KWD'
  | 'QAR'
  | 'BHD'
  | 'OMR'
  | 'EGP'
  | 'USD'
  | 'EUR'
  | 'GBP';

export type Currency = {
  code: CurrencyCode;
  name_ar: string;
  name_en: string;
  symbol_ar: string;
  symbol_en: string;
  /** How many units of this currency equal 1 SAR (the store's base currency). */
  rate: number;
  decimals: number;
};

/**
 * Base currency is SAR: every price in the database is stored in SAR and
 * converted at display time only. Rates are editable from the admin.
 */
export const BASE_CURRENCY: CurrencyCode = 'SAR';

export const CURRENCIES: Currency[] = [
  { code: 'SAR', name_ar: 'ريال سعودي', name_en: 'Saudi Riyal', symbol_ar: 'ر.س', symbol_en: 'SAR', rate: 1, decimals: 0 },
  { code: 'AED', name_ar: 'درهم إماراتي', name_en: 'UAE Dirham', symbol_ar: 'د.إ', symbol_en: 'AED', rate: 0.98, decimals: 0 },
  { code: 'KWD', name_ar: 'دينار كويتي', name_en: 'Kuwaiti Dinar', symbol_ar: 'د.ك', symbol_en: 'KWD', rate: 0.082, decimals: 2 },
  { code: 'QAR', name_ar: 'ريال قطري', name_en: 'Qatari Riyal', symbol_ar: 'ر.ق', symbol_en: 'QAR', rate: 0.97, decimals: 0 },
  { code: 'BHD', name_ar: 'دينار بحريني', name_en: 'Bahraini Dinar', symbol_ar: 'د.ب', symbol_en: 'BHD', rate: 0.1, decimals: 2 },
  { code: 'OMR', name_ar: 'ريال عماني', name_en: 'Omani Rial', symbol_ar: 'ر.ع', symbol_en: 'OMR', rate: 0.103, decimals: 2 },
  { code: 'EGP', name_ar: 'جنيه مصري', name_en: 'Egyptian Pound', symbol_ar: 'ج.م', symbol_en: 'EGP', rate: 13.2, decimals: 0 },
  { code: 'USD', name_ar: 'دولار أمريكي', name_en: 'US Dollar', symbol_ar: '$', symbol_en: '$', rate: 0.267, decimals: 2 },
  { code: 'EUR', name_ar: 'يورو', name_en: 'Euro', symbol_ar: '€', symbol_en: '€', rate: 0.246, decimals: 2 },
  { code: 'GBP', name_ar: 'جنيه إسترليني', name_en: 'Pound Sterling', symbol_ar: '£', symbol_en: '£', rate: 0.21, decimals: 2 },
];

const BY_CODE = new Map(CURRENCIES.map((c) => [c.code, c]));

export function currencyFor(code: string): Currency {
  return BY_CODE.get(code as CurrencyCode) || CURRENCIES[0];
}

/** Converts a SAR amount into the target currency. */
export function convert(amountSar: number, currency: Currency): number {
  return Number(amountSar || 0) * (Number(currency.rate) || 1);
}

/**
 * Formats a SAR amount for display. Latin digits are used in both languages so
 * prices stay instantly scannable, matching the existing design.
 */
export function formatMoney(
  amountSar: number,
  currency: Currency,
  lang: Lang,
  withSymbol = true
): string {
  const value = convert(amountSar, currency);
  const decimals = currency.decimals;
  // Latin digits everywhere so prices stay instantly scannable, but grouping
  // follows the active locale (en-GB, en-US or Arabic).
  const number = new Intl.NumberFormat(lang === 'ar' ? 'en-US' : intlLocale(lang), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  if (!withSymbol) return number;
  const symbol = lang === 'ar' ? currency.symbol_ar : currency.symbol_en;
  return lang === 'ar' ? `${number} ${symbol}` : `${symbol} ${number}`;
}

export const DEFAULT_ENABLED_CURRENCIES: CurrencyCode[] = ['SAR', 'AED', 'KWD', 'USD', 'EUR'];
