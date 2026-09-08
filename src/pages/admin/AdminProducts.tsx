import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Boxes,
  Check,
  Copy,
  CreditCard,
  Eye,
  Layers,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import type { Category, Product } from '../../lib/types';
import { money } from '../../lib/format';
import { useToast } from '../../contexts/ToastContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useConfirm } from '../../contexts/ConfirmContext';
import ImageUploader from '../../components/ImageUploader';
import { AreaField, PanelCard, SwitchField, TagInput, TextField } from '../../components/admin/AdminBits';
import { EmptyState, inputClass } from '../../components/ui/Bits';
import { Button } from '../../components/ui/Button';

type Draft = {
  id?: number;
  slug: string;
  name_ar: string;
  name_en: string;
  tagline_ar: string;
  description_ar: string;
  category_slug: string;
  price: string;
  compare_price: string;
  image: string;
  gallery: string[];
  ingredients_ar: string[];
  allergens_ar: string[];
  serving_ar: string;
  storage_ar: string;
  weight_ar: string;
  stock_qty: string;
  in_stock: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new: boolean;
  is_seasonal: boolean;
  rating: string;
  reviews_count: string;
  accent: string;
  sort_order: string;
  payment_methods: string[];
};

const EMPTY_DRAFT: Draft = {
  slug: '',
  name_ar: '',
  name_en: '',
  tagline_ar: '',
  description_ar: '',
  category_slug: 'mousse',
  price: '',
  compare_price: '',
  image: '',
  gallery: [],
  ingredients_ar: [],
  allergens_ar: [],
  serving_ar: 'يكفي من ٦ إلى ٨ أشخاص',
  storage_ar: 'يُحفظ مبرّدًا من ٢ إلى ٦ درجات مئوية ويُتناول خلال ٤٨ ساعة.',
  weight_ar: '١٢٠٠ غرام',
  stock_qty: '10',
  in_stock: true,
  is_featured: false,
  is_best_seller: false,
  is_new: true,
  is_seasonal: false,
  rating: '5',
  reviews_count: '0',
  accent: '#4B3325',
  sort_order: '99',
  payment_methods: [],
};

function toDraft(p: Product): Draft {
  return {
    id: p.id,
    slug: p.slug,
    name_ar: p.name_ar,
    name_en: p.name_en || '',
    tagline_ar: p.tagline_ar || '',
    description_ar: p.description_ar || '',
    category_slug: p.category_slug,
    price: String(p.price),
    compare_price: p.compare_price ? String(p.compare_price) : '',
    image: p.image,
    gallery: p.gallery?.length ? p.gallery : [p.image],
    ingredients_ar: p.ingredients_ar || [],
    allergens_ar: p.allergens_ar || [],
    serving_ar: p.serving_ar || '',
    storage_ar: p.storage_ar || '',
    weight_ar: p.weight_ar || '',
    stock_qty: String(p.stock_qty),
    in_stock: p.in_stock,
    is_featured: p.is_featured,
    is_best_seller: p.is_best_seller,
    is_new: p.is_new,
    is_seasonal: p.is_seasonal,
    rating: String(p.rating),
    reviews_count: String(p.reviews_count),
    accent: p.accent || '#4B3325',
    sort_order: String(p.sort_order),
    payment_methods: p.payment_methods || [],
  };
}

export default function AdminProducts() {
  const { toast } = useToast();
  const { settings } = useSettings();
  const confirm = useConfirm();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [term, setTerm] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, c] = await Promise.all([api.products({}), api.categories()]);
      setProducts(p);
      setCategories(c.filter((x) => !['bestsellers', 'new'].includes(x.slug)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذّر تحميل الحلويات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const threshold = Number(settings.low_stock_threshold ?? 3);
  const enabledMethods = useMemo(
    () => (settings.payment_methods || []).filter((m) => m.enabled),
    [settings.payment_methods]
  );

  const visible = useMemo(() => {
    return products.filter((p) => {
      if (term.trim()) {
        const t = term.trim().toLowerCase();
        if (!p.name_ar.includes(term.trim()) && !p.name_en.toLowerCase().includes(t)) return false;
      }
      if (catFilter !== 'all' && p.category_slug !== catFilter) return false;
      if (stockFilter === 'out' && p.in_stock && p.stock_qty > 0) return false;
      if (stockFilter === 'low' && !(p.stock_qty > 0 && p.stock_qty <= threshold)) return false;
      return true;
    });
  }, [products, term, catFilter, stockFilter, threshold]);

  const kpis = useMemo(() => {
    const inventoryValue = products.reduce((s, p) => s + p.price * p.stock_qty, 0);
    return {
      total: products.length,
      out: products.filter((p) => !p.in_stock || p.stock_qty <= 0).length,
      low: products.filter((p) => p.stock_qty > 0 && p.stock_qty <= threshold).length,
      inventoryValue,
      avgPrice: products.length
        ? Math.round(products.reduce((s, p) => s + p.price, 0) / products.length)
        : 0,
    };
  }, [products, threshold]);

  const openNew = () => {
    setFormError(null);
    setDraft({ ...EMPTY_DRAFT, sort_order: String(products.length + 1) });
  };

  const duplicate = (p: Product) => {
    setFormError(null);
    setDraft({ ...toDraft(p), id: undefined, slug: '', name_ar: `${p.name_ar} (نسخة)` });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    if (draft.name_ar.trim().length < 3) {
      setFormError('اسم الحلوى مطلوب (٣ أحرف على الأقل)');
      return;
    }
    if (!Number(draft.price) || Number(draft.price) <= 0) {
      setFormError('أدخل سعرًا صحيحًا أكبر من صفر');
      return;
    }
    if (draft.compare_price && Number(draft.compare_price) <= Number(draft.price)) {
      setFormError('السعر قبل الخصم يجب أن يكون أعلى من السعر الحالي');
      return;
    }
    if (!draft.image) {
      setFormError('اختر أو ارفع صورة رئيسية للحلوى');
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      const gallery = [draft.image, ...draft.gallery.filter((g) => g && g !== draft.image)];
      const payload = {
        name_ar: draft.name_ar.trim(),
        name_en: draft.name_en.trim(),
        tagline_ar: draft.tagline_ar.trim(),
        description_ar: draft.description_ar.trim(),
        category_slug: draft.category_slug,
        price: Number(draft.price),
        compare_price: draft.compare_price ? Number(draft.compare_price) : null,
        image: draft.image,
        gallery,
        ingredients_ar: draft.ingredients_ar,
        allergens_ar: draft.allergens_ar,
        serving_ar: draft.serving_ar,
        storage_ar: draft.storage_ar,
        weight_ar: draft.weight_ar,
        stock_qty: Number(draft.stock_qty) || 0,
        in_stock: draft.in_stock && Number(draft.stock_qty) > 0,
        is_featured: draft.is_featured,
        is_best_seller: draft.is_best_seller,
        is_new: draft.is_new,
        is_seasonal: draft.is_seasonal,
        rating: Number(draft.rating) || 5,
        reviews_count: Number(draft.reviews_count) || 0,
        accent: draft.accent,
        sort_order: Number(draft.sort_order) || 99,
        payment_methods: draft.payment_methods,
      };

      if (draft.id) {
        await api.updateProduct({ id: draft.id, ...payload } as never);
        toast('تم حفظ التعديلات', { description: payload.name_ar });
      } else {
        await api.createProduct({
          ...payload,
          slug: draft.slug.trim() || `dessert-${Date.now().toString(36)}`,
        } as never);
        toast('تمت إضافة الحلوى', { description: payload.name_ar });
      }
      setDraft(null);
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'تعذّر الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: Product) => {
    const ok = await confirm({
      title: `حذف «${p.name_ar}»؟`,
      description:
        'ستُزال هذه الحلوى من المتجر نهائيًا ولن تظهر للعملاء. لن تتأثر الطلبات السابقة التي تحتويها.',
      confirmLabel: 'نعم، احذفها',
    });
    if (!ok) return;
    try {
      await api.deleteProduct(p.id);
      toast('تم حذف الحلوى', { description: p.name_ar, tone: 'info' });
      load();
    } catch (e) {
      toast('تعذّر الحذف', { description: e instanceof Error ? e.message : undefined, tone: 'error' });
    }
  };

  const quickStock = async (p: Product, next: number) => {
    setProducts((rows) =>
      rows.map((r) => (r.id === p.id ? { ...r, stock_qty: next, in_stock: next > 0 } : r))
    );
    try {
      await api.updateProduct({ id: p.id, stock_qty: next, in_stock: next > 0 } as never);
    } catch {
      toast('تعذّر تحديث المخزون', { tone: 'error' });
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-[10px] text-gold">Catalogue</p>
          <h1 className="headline mt-2 text-2xl text-cocoa sm:text-3xl">إدارة الحلويات</h1>
          <p className="mt-1.5 text-[13px] text-mocha">
            أضف الصور والمكوّنات والأسعار والمخزون لكل قطعة في المجموعة.
          </p>
        </div>
        <Button onClick={openNew} size="md">
          <Plus size={16} />
          إضافة حلوى
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniKpi icon={<Layers size={16} />} label="عدد الحلويات" value={String(kpis.total)} />
        <MiniKpi
          icon={<Boxes size={16} />}
          label="قيمة المخزون"
          value={`${money(kpis.inventoryValue)} ر.س`}
        />
        <MiniKpi
          icon={<AlertTriangle size={16} />}
          label="قاربت على النفاد"
          value={String(kpis.low)}
          tone={kpis.low ? 'warn' : undefined}
        />
        <MiniKpi
          icon={<Package size={16} />}
          label="غير متوفرة"
          value={String(kpis.out)}
          tone={kpis.out ? 'danger' : undefined}
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mocha-2" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="بحث باسم الحلوى…"
            className="h-12 w-full rounded-full border border-line bg-ivory pe-12 ps-5 text-[13px] text-cocoa placeholder:text-mocha-2/70 focus:border-gold focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            aria-label="تصفية حسب الصنف"
            className="h-12 rounded-full border border-line bg-ivory px-5 text-[12.5px] text-cocoa-2 focus:border-gold focus:outline-none"
          >
            <option value="all">كل الأصناف</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name_ar}
              </option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as 'all' | 'low' | 'out')}
            aria-label="تصفية حسب المخزون"
            className="h-12 rounded-full border border-line bg-ivory px-5 text-[12.5px] text-cocoa-2 focus:border-gold focus:outline-none"
          >
            <option value="all">كل المخزون</option>
            <option value="low">قاربت على النفاد</option>
            <option value="out">غير متوفرة</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-4xl" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-4xl border border-raspberry/25 bg-raspberry/5 px-6 py-12 text-center">
          <p className="text-sm text-berry">{error}</p>
          <button onClick={load} className="mt-5 rounded-full bg-cocoa px-6 py-2.5 text-[13px] text-cream">
            إعادة المحاولة
          </button>
        </div>
      ) : visible.length === 0 ? (
        <EmptyState title="لا توجد حلويات مطابقة" description="جرّب تعديل البحث أو التصفية، أو أضف حلوى جديدة." />
      ) : (
        <div className="space-y-3">
          {visible.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-4 rounded-4xl border border-line bg-ivory p-4"
            >
              <img src={p.image} alt="" className="h-20 w-16 shrink-0 rounded-2xl object-cover" />

              <div className="min-w-[180px] flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="text-[14px] font-semibold text-cocoa">{p.name_ar}</p>
                  {p.is_featured && <Tag tone="gold">مختارات</Tag>}
                  {p.is_best_seller && <Tag tone="berry">الأكثر طلبًا</Tag>}
                  {p.is_new && <Tag tone="pistachio">جديد</Tag>}
                  {p.is_seasonal && <Tag tone="gold">موسمي</Tag>}
                </div>
                <p className="mt-1 line-clamp-1 text-[12px] text-mocha">{p.tagline_ar}</p>
                <p className="mt-1 text-[11px] text-mocha-2">
                  {categories.find((c) => c.slug === p.category_slug)?.name_ar || p.category_slug} ·{' '}
                  <span className="wordmark">{p.slug}</span>
                </p>
              </div>

              <div className="text-end">
                <p className="num text-[15px] text-cocoa">{money(p.price)} ر.س</p>
                {p.compare_price && (
                  <p className="num text-[11.5px] text-mocha-2 line-through">{money(p.compare_price)}</p>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => quickStock(p, Math.max(0, p.stock_qty - 1))}
                  className="grid h-8 w-8 place-items-center rounded-full bg-cream text-cocoa-2 transition hover:bg-sand"
                  aria-label="إنقاص المخزون"
                >
                  −
                </button>
                <span
                  className={`num min-w-14 rounded-full px-2 py-1.5 text-center text-[12px] ${
                    p.stock_qty <= 0
                      ? 'bg-raspberry/10 text-raspberry'
                      : p.stock_qty <= threshold
                        ? 'bg-gold/12 text-gold'
                        : 'bg-pistachio/12 text-pistachio'
                  }`}
                >
                  {p.stock_qty}
                </span>
                <button
                  onClick={() => quickStock(p, p.stock_qty + 1)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-cream text-cocoa-2 transition hover:bg-sand"
                  aria-label="زيادة المخزون"
                >
                  +
                </button>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/dessert/${p.slug}`}
                  target="_blank"
                  aria-label="معاينة"
                  className="grid h-9 w-9 place-items-center rounded-full bg-cream text-cocoa-2 transition hover:bg-cocoa hover:text-cream"
                >
                  <Eye size={15} />
                </Link>
                <button
                  onClick={() => duplicate(p)}
                  aria-label="نسخ"
                  className="grid h-9 w-9 place-items-center rounded-full bg-cream text-cocoa-2 transition hover:bg-cocoa hover:text-cream"
                >
                  <Copy size={15} />
                </button>
                <button
                  onClick={() => {
                    setFormError(null);
                    setDraft(toDraft(p));
                  }}
                  aria-label="تعديل"
                  className="grid h-9 w-9 place-items-center rounded-full bg-gold/12 text-gold transition hover:bg-gold hover:text-ivory"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => remove(p)}
                  aria-label="حذف"
                  className="grid h-9 w-9 place-items-center rounded-full bg-raspberry/10 text-raspberry transition hover:bg-raspberry hover:text-ivory"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------ editor */}
      <AnimatePresence>
        {draft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-end justify-center overflow-y-auto sm:items-center sm:p-6"
          >
            <div className="absolute inset-0 bg-cocoa/55 backdrop-blur-sm" onClick={() => setDraft(null)} />
            <motion.form
              onSubmit={save}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-5xl bg-cream sm:rounded-5xl"
            >
              <div className="flex items-center justify-between border-b border-line bg-ivory px-6 py-5">
                <div>
                  <h2 className="headline text-xl text-cocoa">
                    {draft.id ? 'تعديل الحلوى' : 'حلوى جديدة'}
                  </h2>
                  <p className="mt-1 text-[12px] text-mocha">
                    كل الحقول تظهر مباشرة في صفحة المنتج داخل المتجر.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDraft(null)}
                  aria-label="إغلاق"
                  className="grid h-10 w-10 place-items-center rounded-full bg-cream text-cocoa"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="thin-scroll flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
                <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
                  <div className="space-y-4">
                    <ImageUploader
                      value={draft.image}
                      onChange={(v) => setDraft({ ...draft, image: v })}
                      label="الصورة الرئيسية"
                    />
                    <div>
                      <p className="mb-2 text-[12.5px] font-medium text-cocoa-2">صور إضافية للمعرض</p>
                      <div className="grid grid-cols-2 gap-3">
                        {draft.gallery.map((g, i) => (
                          <ImageUploader
                            key={i}
                            value={g}
                            compact
                            onChange={(v) =>
                              setDraft({
                                ...draft,
                                gallery: v
                                  ? draft.gallery.map((x, idx) => (idx === i ? v : x))
                                  : draft.gallery.filter((_, idx) => idx !== i),
                              })
                            }
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setDraft({ ...draft, gallery: [...draft.gallery, ''] })}
                        className="mt-3 inline-flex h-9 items-center gap-2 rounded-full border border-dashed border-line px-4 text-[12px] text-cocoa-2 transition hover:border-gold hover:text-gold"
                      >
                        <Plus size={13} />
                        إضافة صورة
                      </button>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <PanelCard title="المعلومات الأساسية">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <TextField
                          label="الاسم بالعربية"
                          value={draft.name_ar}
                          onChange={(v) => setDraft({ ...draft, name_ar: v })}
                          placeholder="موس الشوكولاتة البلجيكية"
                        />
                        <TextField
                          label="الاسم باللاتينية"
                          dir="ltr"
                          value={draft.name_en}
                          onChange={(v) => setDraft({ ...draft, name_en: v })}
                          placeholder="Mousse au Chocolat"
                        />
                        <div className="sm:col-span-2">
                          <TextField
                            label="وصف مختصر"
                            value={draft.tagline_ar}
                            onChange={(v) => setDraft({ ...draft, tagline_ar: v })}
                            placeholder="طبقات حريرية من الكاكاو ٦٤٪"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <AreaField
                            label="الوصف الكامل"
                            rows={4}
                            value={draft.description_ar}
                            onChange={(v) => setDraft({ ...draft, description_ar: v })}
                          />
                        </div>
                        <label className="block">
                          <span className="mb-2 block text-[12.5px] font-medium text-cocoa-2">الصنف</span>
                          <select
                            className={inputClass}
                            value={draft.category_slug}
                            onChange={(e) => setDraft({ ...draft, category_slug: e.target.value })}
                          >
                            {categories.map((c) => (
                              <option key={c.slug} value={c.slug}>
                                {c.name_ar}
                              </option>
                            ))}
                          </select>
                        </label>
                        <TextField
                          label="المعرّف في الرابط"
                          dir="ltr"
                          hint="اختياري"
                          value={draft.slug}
                          onChange={(v) => setDraft({ ...draft, slug: v })}
                          placeholder="mousse-chocolat"
                        />
                      </div>
                    </PanelCard>

                    <PanelCard title="التسعير والمخزون">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <TextField
                          label="السعر (ر.س)"
                          type="number"
                          value={draft.price}
                          onChange={(v) => setDraft({ ...draft, price: v })}
                        />
                        <TextField
                          label="قبل الخصم"
                          type="number"
                          hint="اختياري"
                          value={draft.compare_price}
                          onChange={(v) => setDraft({ ...draft, compare_price: v })}
                        />
                        <TextField
                          label="الكمية المتاحة"
                          type="number"
                          value={draft.stock_qty}
                          onChange={(v) => setDraft({ ...draft, stock_qty: v })}
                        />
                      </div>
                      <div className="mt-4">
                        <SwitchField
                          label="متاح للبيع الآن"
                          hint="عند الإيقاف تظهر الحلوى كـ «نفدت الكمية»"
                          checked={draft.in_stock}
                          onChange={(v) => setDraft({ ...draft, in_stock: v })}
                        />
                      </div>
                    </PanelCard>

                    <PanelCard title="التفاصيل والمكوّنات" description="تظهر في تبويبات صفحة المنتج.">
                      <div className="grid gap-4">
                        <TagInput
                          label="المكوّنات"
                          values={draft.ingredients_ar}
                          onChange={(v) => setDraft({ ...draft, ingredients_ar: v })}
                          placeholder="شوكولاتة بلجيكية ٦٤٪ ثم Enter"
                        />
                        <TagInput
                          label="مسبّبات الحساسية"
                          tone="berry"
                          values={draft.allergens_ar}
                          onChange={(v) => setDraft({ ...draft, allergens_ar: v })}
                          placeholder="حليب، مكسرات…"
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <TextField
                            label="الوزن"
                            value={draft.weight_ar}
                            onChange={(v) => setDraft({ ...draft, weight_ar: v })}
                          />
                          <TextField
                            label="عدد الأشخاص"
                            value={draft.serving_ar}
                            onChange={(v) => setDraft({ ...draft, serving_ar: v })}
                          />
                        </div>
                        <AreaField
                          label="طريقة الحفظ"
                          rows={2}
                          value={draft.storage_ar}
                          onChange={(v) => setDraft({ ...draft, storage_ar: v })}
                        />
                      </div>
                    </PanelCard>

                    <PanelCard
                      title="طرق الدفع المسموحة"
                      description="حدّد كيف يستطيع العميل الدفع مقابل هذه الحلوى تحديدًا."
                      action={
                        draft.payment_methods.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setDraft({ ...draft, payment_methods: [] })}
                            className="text-[12px] text-gold underline transition hover:text-cocoa"
                          >
                            السماح بالكل
                          </button>
                        )
                      }
                    >
                      {enabledMethods.length === 0 ? (
                        <p className="rounded-2xl border border-dashed border-line bg-cream/50 px-4 py-4 text-[12.5px] leading-relaxed text-mocha">
                          لا توجد طرق دفع مفعّلة حاليًا — فعّلها أولًا من{' '}
                          <Link to="/admin/settings" className="text-gold underline">
                            الإعدادات ← الأسعار والشحن
                          </Link>
                          .
                        </p>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setDraft({ ...draft, payment_methods: [] })}
                            className={`mb-3 flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-start transition ${
                              draft.payment_methods.length === 0
                                ? 'border-gold bg-gold/8'
                                : 'border-line bg-cream/40 hover:border-gold/50'
                            }`}
                          >
                            <span>
                              <span className="block text-[13px] font-medium text-cocoa">
                                كل طرق الدفع المفعّلة
                              </span>
                              <span className="mt-0.5 block text-[11.5px] text-mocha">
                                الخيار الموصى به — يتبع إعدادات المتجر تلقائيًا
                              </span>
                            </span>
                            <span
                              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                                draft.payment_methods.length === 0
                                  ? 'border-gold bg-gold text-ivory'
                                  : 'border-sand-2'
                              }`}
                            >
                              {draft.payment_methods.length === 0 && <Check size={11} />}
                            </span>
                          </button>

                          <p className="mb-2.5 text-[12px] text-mocha">أو اقصرها على طرق محددة:</p>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {enabledMethods.map((m) => {
                              const active = draft.payment_methods.includes(m.value);
                              return (
                                <button
                                  key={m.value}
                                  type="button"
                                  onClick={() =>
                                    setDraft({
                                      ...draft,
                                      payment_methods: active
                                        ? draft.payment_methods.filter((v) => v !== m.value)
                                        : [...draft.payment_methods, m.value],
                                    })
                                  }
                                  className={`flex items-center gap-3 rounded-2xl border p-3.5 text-start transition ${
                                    active
                                      ? 'border-gold bg-gold/10'
                                      : 'border-line bg-cream/40 hover:border-gold/50'
                                  }`}
                                >
                                  <span
                                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition ${
                                      active ? 'bg-gold text-ivory' : 'bg-sand text-mocha'
                                    }`}
                                  >
                                    <CreditCard size={15} />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[12.5px] font-medium text-cocoa">
                                      {m.label}
                                    </span>
                                    <span className="mt-0.5 block truncate text-[11px] text-mocha">
                                      {m.hint}
                                    </span>
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          <p
                            className={`mt-3 rounded-2xl px-4 py-2.5 text-[11.5px] leading-relaxed ${
                              draft.payment_methods.length === 0
                                ? 'bg-cream text-mocha'
                                : 'bg-gold/8 text-cocoa-2'
                            }`}
                          >
                            {draft.payment_methods.length === 0
                              ? 'النتيجة: العميل يرى جميع طرق الدفع المفعّلة في المتجر.'
                              : `النتيجة: العميل يرى ${draft.payment_methods.length} طريقة فقط عند شراء هذه الحلوى.`}
                          </p>
                        </>
                      )}
                    </PanelCard>

                    <PanelCard title="الظهور في المتجر">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <SwitchField
                          label="مختارات الشيف"
                          checked={draft.is_featured}
                          onChange={(v) => setDraft({ ...draft, is_featured: v })}
                        />
                        <SwitchField
                          label="الأكثر طلبًا"
                          checked={draft.is_best_seller}
                          onChange={(v) => setDraft({ ...draft, is_best_seller: v })}
                        />
                        <SwitchField
                          label="وصل حديثًا"
                          checked={draft.is_new}
                          onChange={(v) => setDraft({ ...draft, is_new: v })}
                        />
                        <SwitchField
                          label="ضمن المجموعة الموسمية"
                          checked={draft.is_seasonal}
                          onChange={(v) => setDraft({ ...draft, is_seasonal: v })}
                        />
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-4">
                        <TextField
                          label="التقييم"
                          type="number"
                          value={draft.rating}
                          onChange={(v) => setDraft({ ...draft, rating: v })}
                        />
                        <TextField
                          label="عدد التقييمات"
                          type="number"
                          value={draft.reviews_count}
                          onChange={(v) => setDraft({ ...draft, reviews_count: v })}
                        />
                        <TextField
                          label="الترتيب"
                          type="number"
                          value={draft.sort_order}
                          onChange={(v) => setDraft({ ...draft, sort_order: v })}
                        />
                        <label className="block">
                          <span className="mb-2 block text-[12.5px] font-medium text-cocoa-2">لون الحلوى</span>
                          <input
                            type="color"
                            value={draft.accent}
                            onChange={(e) => setDraft({ ...draft, accent: e.target.value })}
                            className="h-12 w-full cursor-pointer rounded-2xl border border-line bg-ivory p-1"
                          />
                        </label>
                      </div>
                    </PanelCard>
                  </div>
                </div>

                {formError && (
                  <p className="rounded-2xl border border-raspberry/30 bg-raspberry/8 px-4 py-3 text-[12.5px] text-raspberry">
                    {formError}
                  </p>
                )}
              </div>

              <div className="flex gap-3 border-t border-line bg-ivory px-6 py-4">
                <Button type="submit" size="lg" full disabled={saving}>
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? 'جارٍ الحفظ…' : draft.id ? 'حفظ التعديلات' : 'إضافة الحلوى'}
                </Button>
                <Button type="button" variant="secondary" size="lg" onClick={() => setDraft(null)}>
                  إلغاء
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniKpi({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: 'warn' | 'danger';
}) {
  const toneClass =
    tone === 'danger'
      ? 'bg-raspberry/10 text-raspberry'
      : tone === 'warn'
        ? 'bg-gold/12 text-gold'
        : 'bg-cream text-cocoa-2';
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-line bg-ivory p-4">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${toneClass}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[11.5px] text-mocha">{label}</p>
        <p className="num mt-0.5 truncate text-lg text-cocoa">{value}</p>
      </div>
    </div>
  );
}

function Tag({ children, tone }: { children: React.ReactNode; tone: 'gold' | 'berry' | 'pistachio' }) {
  const tones = {
    gold: 'bg-gold/12 text-gold border-gold/25',
    berry: 'bg-berry/10 text-berry border-berry/25',
    pistachio: 'bg-pistachio/12 text-pistachio border-pistachio/25',
  };
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] ${tones[tone]}`}>{children}</span>
  );
}
