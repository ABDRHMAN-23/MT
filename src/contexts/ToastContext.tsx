import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Heart, Info, TriangleAlert, X } from 'lucide-react';

type ToastTone = 'success' | 'error' | 'info' | 'love';

type Toast = {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastApi = {
  toast: (title: string, opts?: { description?: string; tone?: ToastTone }) => void;
};

const ToastContext = createContext<ToastApi>({ toast: () => {} });

const TONES: Record<ToastTone, { icon: ReactNode; ring: string; chip: string }> = {
  success: {
    icon: <Check size={15} strokeWidth={2.5} />,
    ring: 'border-pistachio/40',
    chip: 'bg-pistachio text-ivory',
  },
  error: {
    icon: <TriangleAlert size={15} strokeWidth={2.5} />,
    ring: 'border-raspberry/40',
    chip: 'bg-raspberry text-ivory',
  },
  info: {
    icon: <Info size={15} strokeWidth={2.5} />,
    ring: 'border-gold/40',
    chip: 'bg-gold text-ivory',
  },
  love: {
    icon: <Heart size={15} strokeWidth={2.5} fill="currentColor" />,
    ring: 'border-berry/40',
    chip: 'bg-berry text-ivory',
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback<ToastApi['toast']>(
    (title, opts) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [
        ...prev.slice(-2),
        { id, title, description: opts?.description, tone: opts?.tone ?? 'success' },
      ]);
      window.setTimeout(() => dismiss(id), 3800);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[120] flex flex-col items-center gap-2 px-4 sm:bottom-8">
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const tone = TONES[t.tone];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border ${tone.ring} bg-ivory/95 px-4 py-3 shadow-[0_18px_50px_-18px_rgba(42,26,18,0.45)] backdrop-blur`}
              >
                <span
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${tone.chip}`}
                >
                  {tone.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-cocoa">{t.title}</p>
                  {t.description && (
                    <p className="mt-0.5 text-xs leading-relaxed text-mocha">{t.description}</p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="إغلاق التنبيه"
                  className="-me-1 rounded-full p-1 text-mocha-2 transition hover:bg-cream hover:text-cocoa"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);
