import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Lock, Mail } from 'lucide-react';
import supabase from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Monogram } from '../../components/Logo';
import { Field, inputClass, Ornament } from '../../components/ui/Bits';
import { Button } from '../../components/ui/Button';

export default function AdminLogin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && user) return <Navigate to={from} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || password.length < 6) {
      setError('أدخل بريدًا صحيحًا وكلمة مرور من ٦ أحرف على الأقل');
      return;
    }
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (err) throw err;
      navigate(from, { replace: true });
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'تعذّر تسجيل الدخول';
      setError(/invalid login/i.test(raw) ? 'بيانات الدخول غير صحيحة' : raw);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="dust relative grid min-h-screen place-items-center overflow-hidden bg-cream px-4 py-14">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-gold/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-berry/8 blur-[110px]" />

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Monogram size={52} className="mx-auto text-gold" />
          <p className="wordmark mt-4 text-[15px] text-cocoa">MOUSSERIE</p>
          <p className="mt-2 text-[12px] tracking-[0.2em] text-mocha">لوحة الإدارة</p>
          <Ornament className="mt-5" />
        </div>

        <div className="rounded-5xl border border-line bg-ivory p-7 shadow-[0_40px_90px_-50px_rgba(42,26,18,0.55)]">
          <h1 className="headline text-xl text-cocoa">أهلًا بعودتك إلى المطبخ</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-mocha">
            سجّل دخولك لإدارة المنتجات والطلبات ورموز الخصم.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="البريد الإلكتروني" required>
              <div className="relative">
                <Mail size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mocha-2" />
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputClass} pe-11 text-start`}
                  placeholder="name@mousserie.com"
                  autoComplete="email"
                />
              </div>
            </Field>
            <Field label="كلمة المرور" required>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mocha-2" />
                <input
                  type="password"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pe-11 text-start`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </Field>

            {error && (
              <p className="rounded-2xl border border-raspberry/30 bg-raspberry/8 px-4 py-3 text-[12.5px] text-raspberry">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" full disabled={busy}>
              {busy && <Loader2 size={17} className="animate-spin" />}
              تسجيل الدخول
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-[11.5px] leading-relaxed text-mocha">
          الدخول مخصص لفريق موسيريا فقط · اتصال مُشفّر
        </p>
      </motion.div>
    </div>
  );
}
