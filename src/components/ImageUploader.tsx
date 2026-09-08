import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImagePlus, Loader2, Trash2, UploadCloud, X, Images } from 'lucide-react';
import { BUILTIN_IMAGES } from '../lib/settings';
import { useConfirm } from '../contexts/ConfirmContext';

type MediaFile = { name: string; url: string; size: number };

async function toBase64(file: File): Promise<{ base64: string; type: string; name: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      resolve({ base64: result.split(',')[1] || '', type: file.type, name: file.name });
    };
    reader.onerror = () => reject(new Error('تعذّر قراءة الملف'));
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(file: File): Promise<string> {
  if (file.size > 3 * 1024 * 1024) throw new Error('حجم الصورة أكبر من ٣ ميجابايت، اضغطها ثم أعد المحاولة');
  const { base64, type, name } = await toBase64(file);
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: name, fileBase64: base64, contentType: type }),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((payload as { error?: string }).error || 'تعذّر رفع الصورة');
  return (payload as { url: string }).url;
}

export default function ImageUploader({
  value,
  onChange,
  label,
  ratio = 'aspect-[4/5]',
  compact = false,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  ratio?: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذّر رفع الصورة');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      {label && <p className="mb-2 text-[13px] font-medium text-cocoa-2">{label}</p>}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`group relative overflow-hidden rounded-3xl border border-dashed border-line bg-cream/60 transition hover:border-gold ${
          compact ? 'aspect-square' : ratio
        }`}
      >
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-mocha-2">
            <ImagePlus size={compact ? 20 : 28} />
            <span className="px-3 text-center text-[11.5px] leading-relaxed">
              اسحب صورة هنا أو ارفع من جهازك
              <br />
              <span className="text-[10px] opacity-70">حتى ٣ ميجابايت</span>
            </span>
          </div>
        )}

        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-cream/80 backdrop-blur-sm">
            <Loader2 size={22} className="animate-spin text-gold" />
          </div>
        )}

        {value && !busy && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="إزالة الصورة"
            className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-ivory/90 text-raspberry opacity-0 transition group-hover:opacity-100"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-cocoa px-4 text-[12px] text-cream transition hover:bg-cocoa-2 disabled:opacity-50"
        >
          <UploadCloud size={14} />
          رفع صورة
        </button>
        <button
          type="button"
          onClick={() => setLibraryOpen(true)}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-ivory px-4 text-[12px] text-cocoa-2 transition hover:border-gold"
        >
          <Images size={14} />
          مكتبة الصور
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p className="mt-2 text-[11.5px] text-raspberry">{error}</p>}

      <MediaLibrary
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onPick={(url) => {
          onChange(url);
          setLibraryOpen(false);
        }}
      />
    </div>
  );
}

export function MediaLibrary({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (url: string) => void;
}) {
  const confirm = useConfirm();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/upload');
      const data = await res.json();
      setFiles(Array.isArray(data.files) ? data.files : []);
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const upload = async (file?: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      await uploadImage(file);
      await load();
    } catch {
      /* handled visually by empty state */
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeFile = async (name: string) => {
    const ok = await confirm({
      title: 'حذف هذه الصورة؟',
      description: 'ستُحذف من مكتبة الوسائط، وستختفي من أي منتج أو قسم يستخدمها.',
      confirmLabel: 'نعم، احذف الصورة',
    });
    if (!ok) return;
    await fetch('/api/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    load();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[130] flex items-end justify-center sm:items-center sm:p-6"
        >
          <div className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-5xl bg-cream sm:rounded-5xl"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div>
                <h2 className="headline text-lg text-cocoa">مكتبة الصور</h2>
                <p className="mt-1 text-[12px] text-mocha">ارفع صور علامتك أو اختر من صور موسيريا</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={busy}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-cocoa px-5 text-[12.5px] text-cream disabled:opacity-50"
                >
                  {busy ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                  رفع
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="إغلاق"
                  className="grid h-10 w-10 place-items-center rounded-full bg-ivory text-cocoa"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="thin-scroll flex-1 overflow-y-auto p-6">
              <p className="mb-3 text-[12px] font-semibold text-cocoa">صورك المرفوعة</p>
              {loading ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="skeleton aspect-square rounded-2xl" />
                  ))}
                </div>
              ) : files.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-line bg-ivory px-4 py-6 text-center text-[12.5px] text-mocha">
                  لم ترفع أي صورة بعد — ابدأ بزر «رفع».
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {files.map((f) => (
                    <div key={f.name} className="group relative">
                      <button
                        type="button"
                        onClick={() => onPick(f.url)}
                        className="block w-full overflow-hidden rounded-2xl border-2 border-transparent transition hover:border-gold"
                      >
                        <img src={f.url} alt="" className="aspect-square w-full object-cover" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFile(f.name)}
                        aria-label="حذف"
                        className="absolute left-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-ivory/90 text-raspberry opacity-0 transition group-hover:opacity-100"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="mb-3 mt-8 text-[12px] font-semibold text-cocoa">صور موسيريا الأصلية</p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {BUILTIN_IMAGES.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => onPick(img)}
                    className="overflow-hidden rounded-2xl border-2 border-transparent transition hover:border-gold"
                  >
                    <img src={img} alt="" loading="lazy" className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => upload(e.target.files?.[0])}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
