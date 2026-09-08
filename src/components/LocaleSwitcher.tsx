import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { LANG_META } from '../lib/i18n';
import type { CurrencyCode } from '../lib/currency';

export default function LocaleSwitcher({ tone = 'cocoa' }: { tone?: 'cocoa' | 'cream' }) {
  const { lang, setLang, languages, currency, setCurrency, currencies, t } = useLocale();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Nothing to switch between — keep the header clean.
  if (languages.length < 2 && currencies.length < 2) return null;

  const text = tone === 'cream' ? 'text-cream/80 hover:text-cream' : 'text-cocoa-2 hover:text-cocoa';

  return (
    <div ref={boxRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t('switch.aria')}
        aria-expanded={open}
        className={`inline-flex h-10 items-center gap-1.5 rounded-full px-2.5 transition sm:px-3 ${text} hover:bg-cocoa/5`}
      >
        <Globe size={17} />
        <span className="hidden text-[12px] font-medium sm:inline">
          {LANG_META[lang].short} · {currency.code}
        </span>
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute end-0 top-12 z-50 w-64 overflow-hidden rounded-3xl border border-line bg-ivory shadow-[0_30px_70px_-30px_rgba(42,26,18,0.55)]"
          >
            {languages.length > 1 && (
              <div className="p-3">
                <p className="mb-2 px-2 text-[11px] font-semibold tracking-wide text-mocha">
                  {t('switch.language')}
                </p>
                <div className="space-y-1.5">
                  {languages.map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-2xl border px-3 py-2.5 text-start transition ${
                        lang === l
                          ? 'border-gold bg-gold/12 text-gold'
                          : 'border-line bg-cream/50 text-cocoa-2 hover:border-gold/50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="num w-7 text-[10.5px] opacity-70">{LANG_META[l].short}</span>
                        <span className="text-[12.5px]">{LANG_META[l].native}</span>
                      </span>
                      {lang === l && <Check size={13} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currencies.length > 1 && (
              <div className="border-t border-line p-3">
                <p className="mb-2 px-2 text-[11px] font-semibold tracking-wide text-mocha">
                  {t('switch.currency')}
                </p>
                <div className="thin-scroll max-h-52 space-y-1 overflow-y-auto">
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code as CurrencyCode);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2.5 text-start transition ${
                        currency.code === c.code ? 'bg-gold/12 text-gold' : 'text-cocoa-2 hover:bg-cream'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="num w-9 text-[11.5px] opacity-70">{c.code}</span>
                        <span className="text-[12.5px]">{lang === 'ar' ? c.name_ar : c.name_en}</span>
                      </span>
                      <span className="num text-[12px]">
                        {lang === 'ar' ? c.symbol_ar : c.symbol_en}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-2.5 px-2 text-[10.5px] leading-relaxed text-mocha-2">
                  {t('switch.note')}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
