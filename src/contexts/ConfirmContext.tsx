import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'neutral';
};

type ConfirmApi = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmApi>(async () => false);

/**
 * Native window.confirm() is blocked inside sandboxed preview iframes (it
 * silently resolves to false), which made every destructive admin action look
 * broken. This provider renders a real in-app dialog instead.
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmApi>((opts) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = useCallback((result: boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setOptions(null);
  }, []);

  const value = useMemo(() => confirm, [confirm]);
  const danger = options?.tone !== 'neutral';

  return (
    <ConfirmContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {options && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[140] flex items-end justify-center p-0 sm:items-center sm:p-6"
            role="alertdialog"
            aria-modal="true"
          >
            <div className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm" onClick={() => close(false)} />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="relative w-full max-w-md overflow-hidden rounded-t-5xl bg-cream p-6 shadow-[0_40px_100px_-40px_rgba(42,26,18,0.75)] sm:rounded-5xl"
            >
              <button
                onClick={() => close(false)}
                aria-label="إغلاق"
                className="absolute left-5 top-5 grid h-9 w-9 place-items-center rounded-full text-mocha transition hover:bg-ivory hover:text-cocoa"
              >
                <X size={17} />
              </button>

              <span
                className={`grid h-14 w-14 place-items-center rounded-full ${
                  danger ? 'bg-raspberry/10 text-raspberry' : 'bg-gold/12 text-gold'
                }`}
              >
                {danger ? <Trash2 size={22} /> : <AlertTriangle size={22} />}
              </span>

              <h2 className="headline mt-5 text-xl leading-relaxed text-cocoa">{options.title}</h2>
              {options.description && (
                <p className="mt-3 text-[13.5px] leading-loose text-mocha">{options.description}</p>
              )}

              <div className="mt-7 flex flex-col-reverse gap-2.5 sm:flex-row">
                <button
                  onClick={() => close(false)}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-cocoa/25 text-[13.5px] text-cocoa transition hover:border-cocoa/60"
                >
                  {options.cancelLabel || 'إلغاء'}
                </button>
                <button
                  autoFocus
                  onClick={() => close(true)}
                  className={`inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-[13.5px] text-ivory transition ${
                    danger ? 'bg-raspberry hover:bg-berry' : 'bg-cocoa hover:bg-cocoa-2'
                  }`}
                >
                  {options.confirmLabel || 'تأكيد الحذف'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useConfirm = () => useContext(ConfirmContext);
