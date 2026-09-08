import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AtSign,
  Check,
  Fingerprint,
  KeyRound,
  Loader2,
  LogOut,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import supabase from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../contexts/ConfirmContext';
import { arDateTime } from '../../lib/format';
import { PanelCard, TextField } from '../../components/admin/AdminBits';
import { Button } from '../../components/ui/Button';

function strength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(4, score);
}

const LEVELS = [
  { label: 'ضعيفة جدًا', color: 'bg-raspberry', text: 'text-raspberry' },
  { label: 'ضعيفة', color: 'bg-raspberry', text: 'text-raspberry' },
  { label: 'متوسطة', color: 'bg-gold', text: 'text-gold' },
  { label: 'جيدة', color: 'bg-pistachio', text: 'text-pistachio' },
  { label: 'قوية جدًا', color: 'bg-pistachio', text: 'text-pistachio' },
];

export default function AdminAccount() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const confirm = useConfirm();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);

  const [signingOutAll, setSigningOutAll] = useState(false);

  useEffect(() => {
    if (!user) return;
    setEmail(user.email || '');
    setDisplayName((user.user_metadata?.full_name as string) || '');
  }, [user]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErr(null);
    setProfileMsg(null);

    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setProfileErr('البريد الإلكتروني غير صحيح');
      return;
    }

    setSavingProfile(true);
    try {
      const emailChanged = trimmed !== (user?.email || '');
      const { error } = await supabase.auth.updateUser({
        ...(emailChanged ? { email: trimmed } : {}),
        data: { full_name: displayName.trim() },
      });
      if (error) throw error;

      if (emailChanged) {
        setProfileMsg('تم حفظ الاسم. أُرسلت رسالة تأكيد إلى بريدك الجديد، ولن يتغير البريد قبل تأكيدها.');
      } else {
        setProfileMsg('تم حفظ بيانات الحساب بنجاح.');
      }
      toast('تم تحديث الحساب');
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'تعذّر الحفظ';
      setProfileErr(/already/i.test(raw) ? 'هذا البريد مستخدم بالفعل' : raw);
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwErr(null);
    setPwMsg(null);

    if (newPw.length < 8) return setPwErr('كلمة المرور الجديدة يجب أن تكون ٨ أحرف على الأقل');
    if (newPw !== confirmPw) return setPwErr('كلمتا المرور غير متطابقتين');
    if (newPw === currentPw) return setPwErr('اختر كلمة مرور مختلفة عن الحالية');

    setSavingPw(true);
    try {
      if (currentPw) {
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: user?.email || '',
          password: currentPw,
        });
        if (verifyError) throw new Error('كلمة المرور الحالية غير صحيحة');
      }

      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;

      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setPwMsg('تم تغيير كلمة المرور بنجاح.');
      toast('تم تغيير كلمة المرور', { description: 'استخدمها في تسجيل الدخول القادم' });
    } catch (err) {
      setPwErr(err instanceof Error ? err.message : 'تعذّر تغيير كلمة المرور');
    } finally {
      setSavingPw(false);
    }
  };

  const sendReset = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/admin/login`,
    });
    if (error) {
      toast('تعذّر إرسال الرابط', { description: error.message, tone: 'error' });
      return;
    }
    toast('أُرسل رابط إعادة التعيين', { description: user.email, tone: 'info' });
  };

  const signOutEverywhere = async () => {
    const ok = await confirm({
      title: 'تسجيل الخروج من جميع الأجهزة؟',
      description: 'ستُنهى جميع الجلسات النشطة، وستحتاج إلى تسجيل الدخول مجددًا.',
      confirmLabel: 'خروج من الكل',
      tone: 'neutral',
    });
    if (!ok) return;
    setSigningOutAll(true);
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch {
      await signOut();
    } finally {
      setSigningOutAll(false);
    }
  };

  const level = LEVELS[strength(newPw)];

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-[10px] text-gold">Mon compte</p>
        <h1 className="headline mt-2 text-2xl text-cocoa sm:text-3xl">إعدادات الحساب</h1>
        <p className="mt-1.5 text-[13px] text-mocha">غيّر بريدك وكلمة مرورك وأدر جلسات الدخول.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-4 rounded-4xl border border-line bg-ivory p-5"
      >
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-cocoa text-lg text-cream">
          {(displayName || user?.email || '?').charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-cocoa">
            {displayName || 'مدير موسيريا'}
          </p>
          <p className="truncate text-[12.5px] text-mocha" dir="ltr">
            {user?.email}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11.5px]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-pistachio/30 bg-pistachio/10 px-3 py-1.5 text-pistachio">
            <ShieldCheck size={13} />
            {user?.email_confirmed_at ? 'بريد موثّق' : 'بريد غير موثّق'}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5 text-mocha">
            <Fingerprint size={13} />
            آخر دخول: {arDateTime(user?.last_sign_in_at ?? null)}
          </span>
        </div>
      </motion.div>

      <div className="grid gap-5 xl:grid-cols-2">
        <PanelCard title="بيانات الحساب" description="الاسم المعروض والبريد المستخدم في تسجيل الدخول.">
          <form onSubmit={saveProfile} className="grid gap-4">
            <div className="relative">
              <TextField label="الاسم المعروض" value={displayName} onChange={setDisplayName} placeholder="مدير موسيريا" />
              <UserRound size={14} className="pointer-events-none absolute left-4 top-[42px] text-mocha-2" />
            </div>
            <div className="relative">
              <TextField label="البريد الإلكتروني" dir="ltr" value={email} onChange={setEmail} />
              <AtSign size={14} className="pointer-events-none absolute left-4 top-[42px] text-mocha-2" />
            </div>

            {profileErr && (
              <p className="rounded-2xl border border-raspberry/30 bg-raspberry/8 px-4 py-3 text-[12.5px] text-raspberry">
                {profileErr}
              </p>
            )}
            {profileMsg && (
              <p className="flex items-start gap-2 rounded-2xl border border-pistachio/30 bg-pistachio/10 px-4 py-3 text-[12.5px] text-pistachio">
                <Check size={14} className="mt-0.5 shrink-0" />
                {profileMsg}
              </p>
            )}

            <Button type="submit" disabled={savingProfile}>
              {savingProfile && <Loader2 size={15} className="animate-spin" />}
              حفظ بيانات الحساب
            </Button>
          </form>
        </PanelCard>

        <PanelCard title="تغيير كلمة المرور" description="نتحقق من كلمة المرور الحالية قبل التغيير.">
          <form onSubmit={savePassword} className="grid gap-4">
            <TextField
              label="كلمة المرور الحالية"
              type="password"
              dir="ltr"
              value={currentPw}
              onChange={setCurrentPw}
            />
            <TextField
              label="كلمة المرور الجديدة"
              type="password"
              dir="ltr"
              hint="٨ أحرف فأكثر"
              value={newPw}
              onChange={setNewPw}
            />

            {newPw && (
              <div>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i < strength(newPw) ? level.color : 'bg-sand-2'
                      }`}
                    />
                  ))}
                </div>
                <p className={`mt-1.5 text-[11.5px] ${level.text}`}>قوة كلمة المرور: {level.label}</p>
              </div>
            )}

            <TextField
              label="تأكيد كلمة المرور"
              type="password"
              dir="ltr"
              value={confirmPw}
              onChange={setConfirmPw}
            />

            {pwErr && (
              <p className="rounded-2xl border border-raspberry/30 bg-raspberry/8 px-4 py-3 text-[12.5px] text-raspberry">
                {pwErr}
              </p>
            )}
            {pwMsg && (
              <p className="flex items-start gap-2 rounded-2xl border border-pistachio/30 bg-pistachio/10 px-4 py-3 text-[12.5px] text-pistachio">
                <Check size={14} className="mt-0.5 shrink-0" />
                {pwMsg}
              </p>
            )}

            <Button type="submit" disabled={savingPw}>
              {savingPw ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
              تغيير كلمة المرور
            </Button>

            <button
              type="button"
              onClick={sendReset}
              className="text-center text-[12.5px] text-gold underline transition hover:text-cocoa"
            >
              نسيت كلمة المرور الحالية؟ أرسل رابط إعادة تعيين إلى بريدي
            </button>
          </form>
        </PanelCard>

        <div className="xl:col-span-2">
          <PanelCard title="الجلسات والأمان" description="إن شككت في دخول غير مصرّح، سجّل الخروج من جميع الأجهزة.">
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={signOut}>
                <LogOut size={15} />
                تسجيل الخروج من هذا الجهاز
              </Button>
              <Button variant="danger" onClick={signOutEverywhere} disabled={signingOutAll}>
                {signingOutAll && <Loader2 size={15} className="animate-spin" />}
                خروج من جميع الأجهزة
              </Button>
            </div>
          </PanelCard>
        </div>
      </div>
    </div>
  );
}
