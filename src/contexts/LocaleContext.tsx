import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { intlLocale, LANG_META, translate, type Lang } from '../lib/i18n';
import {
  CURRENCIES,
  currencyFor,
  formatMoney,
  type Currency,
  type CurrencyCode,
} from '../lib/currency';
import { useSettings } from './SettingsContext';

type LocaleApi = {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** Picks the Arabic or English variant of a merchant-authored field. */
  pick: (ar: string | null | undefined, en: string | null | undefined) => string;
  currency: Currency;
  setCurrency: (code: CurrencyCode) => void;
  /** Formats a SAR amount into the active currency, symbol included. */
  fmt: (amountSar: number) => string;
  /** Same, without the currency symbol. */
  fmtPlain: (amountSar: number) => string;
  /** Locale-aware date (British English uses 8 September 2026). */
  fmtDate: (value: string | null | undefined) => string;
  fmtDateTime: (value: string | null | undefined) => string;
  languages: Lang[];
  currencies: Currency[];
};

const AR_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

function formatDate(value: string | null | undefined, lang: Lang, withTime: boolean): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);

  if (lang === 'ar') {
    const base = `${d.getDate()} ${AR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    if (!withTime) return base;
    const h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${base} · ${h12}:${m} ${h >= 12 ? 'م' : 'ص'}`;
  }

  const date = new Intl.DateTimeFormat(intlLocale(lang), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
  if (!withTime) return date;

  // en-GB reads best on a 24-hour clock; en-US keeps AM/PM.
  const time = new Intl.DateTimeFormat(intlLocale(lang), {
    hour: '2-digit',
    minute: '2-digit',
    hour12: lang !== 'en-GB',
  }).format(d);
  return `${date} · ${time}`;
}

const LANG_KEY = 'mousserie.lang.v1';
const CUR_KEY = 'mousserie.currency.v1';

const LocaleContext = createContext<LocaleApi | null>(null);

function readStored(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();

  // `null` means the visitor has not chosen yet, so the merchant's default wins.
  const [lang, setLangState] = useState<Lang | null>(() => {
    const stored = readStored(LANG_KEY);
    return stored === 'en' || stored === 'ar' || stored === 'en-GB' ? stored : null;
  });
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode | null>(
    () => (readStored(CUR_KEY) as CurrencyCode) || null
  );

  // Which options the merchant switched on in the admin.
  const languages = useMemo<Lang[]>(() => {
    const list = (settings.languages || ['ar', 'en']).filter(
      (l): l is Lang => l === 'ar' || l === 'en' || l === 'en-GB'
    );
    return list.length ? list : ['ar'];
  }, [settings.languages]);

  const currencies = useMemo<Currency[]>(() => {
    const enabled = settings.currencies || [];
    const rates = settings.currency_rates || {};
    const list = CURRENCIES.filter((c) => enabled.includes(c.code)).map((c) => ({
      ...c,
      rate: Number(rates[c.code] ?? c.rate) || c.rate,
    }));
    return list.length ? list : [CURRENCIES[0]];
  }, [settings.currencies, settings.currency_rates]);

  // Fall back gracefully if the merchant disables the stored preference.
  const preferredLang = (lang || settings.default_language || 'ar') as Lang;
  const activeLang: Lang = languages.includes(preferredLang) ? preferredLang : languages[0];

  const currency = useMemo(() => {
    // A visitor who picked British English but never chose a currency is shown
    // sterling when it is enabled; an explicit choice always wins.
    const implied =
      !currencyCode && activeLang === 'en-GB' && currencies.some((c) => c.code === 'GBP')
        ? 'GBP'
        : null;
    const wanted = currencyCode || implied || settings.default_currency || 'SAR';
    return currencies.find((c) => c.code === wanted) || currencies[0];
  }, [currencies, currencyCode, settings.default_currency, activeLang]);

  const dir = LANG_META[activeLang].dir;

  useEffect(() => {
    const html = document.documentElement;
    html.lang = activeLang;
    html.dir = dir;
  }, [activeLang, dir]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyCode(code);
    try {
      window.localStorage.setItem(CUR_KEY, code);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo<LocaleApi>(
    () => ({
      lang: activeLang,
      dir,
      setLang,
      t: (key, vars) => translate(key, activeLang, vars),
      pick: (ar, en) => {
        const arabic = (ar || '').trim();
        const english = (en || '').trim();
        if (activeLang === 'en') return english || arabic;
        return arabic || english;
      },
      currency: currency || currencyFor('SAR'),
      setCurrency,
      fmt: (amount) => formatMoney(amount, currency || currencyFor('SAR'), activeLang),
      fmtPlain: (amount) => formatMoney(amount, currency || currencyFor('SAR'), activeLang, false),
      fmtDate: (value) => formatDate(value, activeLang, false),
      fmtDateTime: (value) => formatDate(value, activeLang, true),
      languages,
      currencies,
    }),
    [activeLang, dir, setLang, currency, setCurrency, languages, currencies]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider');
  return ctx;
}
