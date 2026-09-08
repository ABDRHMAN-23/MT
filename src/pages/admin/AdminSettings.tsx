import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Check,
  Contact,
  Grid3x3,
  HelpCircle,
  Layers,
  Loader2,
  MessageSquareQuote,
  BadgeCheck,
  Languages,
  Palette,
  Plus,
  RotateCcw,
  Share2,
  Save,
  Trash2,
  Truck,
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../contexts/ConfirmContext';
import type { Settings } from '../../lib/settings';
import { api } from '../../lib/api';
import type { Category, Faq, Testimonial } from '../../lib/types';
import {
  CATEGORY_META,
  SOCIAL_PLATFORMS,
  platformFor,
  socialsByCategory,
  visibleSocials,
  type SocialCategory,
  type SocialLink,
} from '../../lib/social';
import ImageUploader from '../../components/ImageUploader';
import {
  AreaField,
  ListEditor,
  PanelCard,
  SwitchField,
  TagInput,
  TextField,
} from '../../components/admin/AdminBits';
import { inputClass } from '../../components/ui/Bits';
import { CURRENCIES } from '../../lib/currency';
import { LANG_META, type Lang } from '../../lib/i18n';

const TABS = [
  { key: 'brand', label: 'الهوية', icon: <Palette size={16} /> },
  { key: 'logo', label: 'الشعار', icon: <BadgeCheck size={16} /> },
  { key: 'home', label: 'الصفحة الرئيسية', icon: <Layers size={16} /> },
  { key: 'story', label: 'الحكاية والتوصيل', icon: <BookOpen size={16} /> },
  { key: 'commerce', label: 'الأسعار والشحن', icon: <Truck size={16} /> },
  { key: 'contact', label: 'التواصل', icon: <Contact size={16} /> },
  { key: 'social', label: 'التواصل الاجتماعي', icon: <Share2 size={16} /> },
  { key: 'locale', label: 'اللغات والعملات', icon: <Languages size={16} /> },
  { key: 'categories', label: 'الأصناف', icon: <Grid3x3 size={16} /> },
  { key: 'testimonials', label: 'آراء العملاء', icon: <MessageSquareQuote size={16} /> },
  { key: 'faqs', label: 'الأسئلة', icon: <HelpCircle size={16} /> },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function AdminSettings() {
  const { settings, save, loading } = useSettings();
  const { toast } = useToast();
  const [tab, setTab] = useState<TabKey>('brand');
  const [draft, setDraft] = useState<Settings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) setDraft(settings);
  }, [settings, loading]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(settings), [draft, settings]);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const persist = async () => {
    setSaving(true);
    try {
      await save(draft);
      toast('تم حفظ الإعدادات', { description: 'تم تحديث الموقع مباشرة' });
    } catch (e) {
      toast('تعذّر الحفظ', {
        description: e instanceof Error ? e.message : undefined,
        tone: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const resetSection = () => {
    setDraft(settings);
    toast('تم التراجع عن التعديلات', { tone: 'info' });
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-[10px] text-gold">Paramètres</p>
          <h1 className="headline mt-2 text-2xl text-cocoa sm:text-3xl">إعدادات الموقع</h1>
          <p className="mt-1.5 text-[13px] text-mocha">
            تحكّم كامل في النصوص والصور والأسعار والمحتوى دون الحاجة لمبرمج.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-ivory px-5 text-[13px] text-cocoa-2 transition hover:border-gold"
        >
          معاينة المتجر
        </a>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[12.5px] transition ${
              tab === t.key
                ? 'border-cocoa bg-cocoa text-cream'
                : 'border-line bg-ivory text-cocoa-2 hover:border-gold'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'brand' && <BrandTab draft={draft} set={set} />}
      {tab === 'logo' && <LogoTab draft={draft} set={set} />}
      {tab === 'home' && <HomeTab draft={draft} set={set} />}
      {tab === 'story' && <StoryTab draft={draft} set={set} />}
      {tab === 'commerce' && <CommerceTab draft={draft} set={set} />}
      {tab === 'contact' && <ContactTab draft={draft} set={set} />}
      {tab === 'social' && <SocialTab draft={draft} set={set} />}
      {tab === 'locale' && <LocaleTab draft={draft} set={set} />}
      {tab === 'categories' && <CategoriesTab />}
      {tab === 'testimonials' && <TestimonialsTab />}
      {tab === 'faqs' && <FaqsTab />}

      {['brand', 'logo', 'home', 'story', 'commerce', 'contact', 'social', 'locale'].includes(
        tab
      ) && (
        <motion.div
          initial={{ y: 60 }}
          animate={{ y: 0 }}
          className="fixed inset-x-0 bottom-16 z-40 border-t border-line bg-ivory/96 px-4 py-3 backdrop-blur-xl lg:bottom-0 lg:ps-64"
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <p className="text-[12px] text-mocha">
              {dirty ? 'لديك تعديلات غير محفوظة' : 'كل التغييرات محفوظة ✓'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={resetSection}
                disabled={!dirty}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-[12.5px] text-cocoa-2 transition hover:border-gold disabled:opacity-40"
              >
                <RotateCcw size={14} />
                تراجع
              </button>
              <button
                onClick={persist}
                disabled={!dirty || saving}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-cocoa px-6 text-[13px] text-cream transition hover:bg-cocoa-2 disabled:opacity-40"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                حفظ التغييرات
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

type TabProps = {
  draft: Settings;
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
};

/* ------------------------------------------------------------------ brand */

function BrandTab({ draft, set }: TabProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <PanelCard title="هوية العلامة" description="الاسم الذي يظهر في الهيدر والفوتر ورسائل الواتساب.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="الاسم بالعربية" value={draft.brand_name_ar} onChange={(v) => set('brand_name_ar', v)} />
          <TextField
            label="الاسم باللاتينية"
            dir="ltr"
            value={draft.brand_name_en}
            onChange={(v) => set('brand_name_en', v)}
          />
          <div className="sm:col-span-2">
            <TextField
              label="الوصف القصير (Eyebrow)"
              dir="ltr"
              value={draft.brand_tagline}
              onChange={(v) => set('brand_tagline', v)}
            />
          </div>
        </div>
      </PanelCard>

      <PanelCard title="الشريط العلوي" description="العبارات المتحركة أعلى الموقع.">
        <TagInput
          label="عبارات الشريط"
          values={draft.ticker}
          onChange={(v) => set('ticker', v)}
          placeholder="اكتب عبارة ثم Enter"
        />
      </PanelCard>

      <PanelCard title="شريط الثقة" description="المزايا الأربع أسفل الواجهة.">
        <TagInput
          label="المزايا"
          values={draft.trust_items}
          onChange={(v) => set('trust_items', v)}
          placeholder="مثال: مكوّنات طبيعية"
        />
      </PanelCard>

      <PanelCard title="عناوين الأقسام" description="عناوين وأوصاف أقسام الصفحة الرئيسية.">
        <div className="grid gap-4">
          <TextField label="عنوان الأصناف" value={draft.categories_title} onChange={(v) => set('categories_title', v)} />
          <TextField label="عنوان مختارات الشيف" value={draft.featured_title} onChange={(v) => set('featured_title', v)} />
          <TextField label="عنوان الأكثر طلبًا" value={draft.best_title} onChange={(v) => set('best_title', v)} />
          <TextField label="عنوان وصل حديثًا" value={draft.new_title} onChange={(v) => set('new_title', v)} />
          <TextField
            label="عنوان آراء العملاء"
            value={draft.testimonials_title}
            onChange={(v) => set('testimonials_title', v)}
          />
        </div>
      </PanelCard>
    </div>
  );
}

/* ------------------------------------------------------------------- home */

function HomeTab({ draft, set }: TabProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <PanelCard title="الواجهة الرئيسية" description="أول ما يراه العميل عند دخول الموقع.">
        <div className="grid gap-4">
          <TextField label="السطر العلوي" dir="ltr" value={draft.hero_eyebrow} onChange={(v) => set('hero_eyebrow', v)} />
          <TextField label="العنوان — السطر الأول" value={draft.hero_title_line1} onChange={(v) => set('hero_title_line1', v)} />
          <TextField label="العنوان — السطر المميّز" value={draft.hero_title_line2} onChange={(v) => set('hero_title_line2', v)} />
          <AreaField label="النص التعريفي" value={draft.hero_subtitle} onChange={(v) => set('hero_subtitle', v)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="زر رئيسي" value={draft.hero_cta_primary} onChange={(v) => set('hero_cta_primary', v)} />
            <TextField label="زر ثانوي" value={draft.hero_cta_secondary} onChange={(v) => set('hero_cta_secondary', v)} />
          </div>
          <TextField label="نص الختم الدائري" value={draft.hero_badge_text} onChange={(v) => set('hero_badge_text', v)} />
        </div>
      </PanelCard>

      <PanelCard title="صورة الواجهة والأرقام" description="ارفع صورة عمودية عالية الجودة.">
        <div className="grid gap-5 sm:grid-cols-[200px_1fr]">
          <ImageUploader value={draft.hero_image} onChange={(v) => set('hero_image', v)} label="صورة الواجهة" />
          <div>
            <ListEditor
              items={draft.hero_stats}
              onChange={(v) => set('hero_stats', v)}
              create={() => ({ value: '', label: '' })}
              addLabel="إضافة رقم"
              render={(item, update) => (
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField label="الرقم" value={item.value} onChange={(v) => update({ value: v })} />
                  <TextField label="الوصف" value={item.label} onChange={(v) => update({ label: v })} />
                </div>
              )}
            />
          </div>
        </div>
      </PanelCard>

      <PanelCard title="المجموعة الموسمية" description="قسم داكن يعرض مجموعتك المحدودة.">
        <div className="grid gap-4">
          <SwitchField
            label="إظهار القسم"
            hint="أوقفه مؤقتًا خارج المواسم"
            checked={draft.seasonal_enabled}
            onChange={(v) => set('seasonal_enabled', v)}
          />
          <TextField label="العنوان" value={draft.seasonal_title} onChange={(v) => set('seasonal_title', v)} />
          <TextField label="السطر الذهبي" value={draft.seasonal_highlight} onChange={(v) => set('seasonal_highlight', v)} />
          <AreaField label="النص" value={draft.seasonal_text} onChange={(v) => set('seasonal_text', v)} />
          <TextField label="نص الزر" value={draft.seasonal_cta} onChange={(v) => set('seasonal_cta', v)} />
          <ImageUploader
            value={draft.seasonal_image}
            onChange={(v) => set('seasonal_image', v)}
            label="صورة القسم"
            ratio="aspect-[3/2]"
          />
        </div>
      </PanelCard>

      <PanelCard title="الشريط الترويجي" description="عرض الخصم الظاهر في الصفحة الرئيسية.">
        <div className="grid gap-4">
          <SwitchField
            label="إظهار العرض"
            checked={draft.promo_enabled}
            onChange={(v) => set('promo_enabled', v)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="الشارة" value={draft.promo_badge} onChange={(v) => set('promo_badge', v)} />
            <TextField label="رمز الخصم" dir="ltr" value={draft.promo_code} onChange={(v) => set('promo_code', v.toUpperCase())} />
          </div>
          <TextField label="العنوان" value={draft.promo_title} onChange={(v) => set('promo_title', v)} />
          <AreaField label="النص" rows={3} value={draft.promo_text} onChange={(v) => set('promo_text', v)} />
          <TextField label="نص الزر" value={draft.promo_cta} onChange={(v) => set('promo_cta', v)} />
          <ImageUploader
            value={draft.promo_image}
            onChange={(v) => set('promo_image', v)}
            label="صورة العرض"
            ratio="aspect-[3/2]"
          />
        </div>
      </PanelCard>

      <div className="xl:col-span-2">
        <PanelCard
          title="النسخة الإنجليزية من الواجهة"
          description="يظهر هذا النص عند تبديل الزائر إلى الإنجليزية. إن تركته فارغًا سيُعرض النص العربي."
        >
          <div className="grid gap-4" dir="ltr">
            <TextField label="Hero — line 1" dir="ltr" value={draft.hero_title_line1_en} onChange={(v) => set('hero_title_line1_en', v)} />
            <TextField label="Hero — highlighted line" dir="ltr" value={draft.hero_title_line2_en} onChange={(v) => set('hero_title_line2_en', v)} />
            <AreaField label="Hero — intro" value={draft.hero_subtitle_en} onChange={(v) => set('hero_subtitle_en', v)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Primary button" dir="ltr" value={draft.hero_cta_primary_en} onChange={(v) => set('hero_cta_primary_en', v)} />
              <TextField label="Secondary button" dir="ltr" value={draft.hero_cta_secondary_en} onChange={(v) => set('hero_cta_secondary_en', v)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Categories title" dir="ltr" value={draft.categories_title_en} onChange={(v) => set('categories_title_en', v)} />
              <TextField label="Chef selection title" dir="ltr" value={draft.featured_title_en} onChange={(v) => set('featured_title_en', v)} />
              <TextField label="Best sellers title" dir="ltr" value={draft.best_title_en} onChange={(v) => set('best_title_en', v)} />
              <TextField label="New arrivals title" dir="ltr" value={draft.new_title_en} onChange={(v) => set('new_title_en', v)} />
              <TextField label="Seasonal title" dir="ltr" value={draft.seasonal_title_en} onChange={(v) => set('seasonal_title_en', v)} />
              <TextField label="Promo title" dir="ltr" value={draft.promo_title_en} onChange={(v) => set('promo_title_en', v)} />
              <TextField label="Story title" dir="ltr" value={draft.story_title_en} onChange={(v) => set('story_title_en', v)} />
              <TextField label="Delivery title" dir="ltr" value={draft.delivery_title_en} onChange={(v) => set('delivery_title_en', v)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Final CTA — line 1" dir="ltr" value={draft.final_cta_title1_en} onChange={(v) => set('final_cta_title1_en', v)} />
              <TextField label="Final CTA — highlighted" dir="ltr" value={draft.final_cta_title2_en} onChange={(v) => set('final_cta_title2_en', v)} />
            </div>
            <AreaField label="Final CTA — text" rows={3} value={draft.final_cta_text_en} onChange={(v) => set('final_cta_text_en', v)} />
            <AreaField label="Footer about" rows={3} value={draft.footer_about_en} onChange={(v) => set('footer_about_en', v)} />
          </div>
        </PanelCard>
      </div>

      <div className="xl:col-span-2">
        <PanelCard title="الدعوة الأخيرة" description="القسم الختامي قبل الفوتر.">
          <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="السطر الأول" value={draft.final_cta_title1} onChange={(v) => set('final_cta_title1', v)} />
                <TextField label="السطر الذهبي" value={draft.final_cta_title2} onChange={(v) => set('final_cta_title2', v)} />
              </div>
              <AreaField label="النص" rows={3} value={draft.final_cta_text} onChange={(v) => set('final_cta_text', v)} />
            </div>
            <ImageUploader
              value={draft.final_cta_image}
              onChange={(v) => set('final_cta_image', v)}
              label="خلفية القسم"
              ratio="aspect-[3/2]"
            />
          </div>
        </PanelCard>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ story */

function StoryTab({ draft, set }: TabProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <PanelCard title="حكاية العلامة" description="النص الذي يظهر في الصفحة الرئيسية.">
        <div className="grid gap-4">
          <TextField label="العنوان" value={draft.story_title} onChange={(v) => set('story_title', v)} />
          <ListEditor
            items={draft.story_paragraphs.map((text) => ({ text }))}
            onChange={(v) => set('story_paragraphs', v.map((x) => x.text))}
            create={() => ({ text: '' })}
            addLabel="إضافة فقرة"
            render={(item, update) => (
              <AreaField label="الفقرة" rows={3} value={item.text} onChange={(v) => update({ text: v })} />
            )}
          />
          <TextField label="تعليق الصورة الصغيرة" value={draft.story_detail_caption} onChange={(v) => set('story_detail_caption', v)} />
        </div>
      </PanelCard>

      <PanelCard title="صور الحكاية وأرقامها">
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUploader value={draft.story_image} onChange={(v) => set('story_image', v)} label="الصورة الرئيسية" ratio="aspect-[4/3]" />
          <ImageUploader
            value={draft.story_detail_image}
            onChange={(v) => set('story_detail_image', v)}
            label="صورة التفاصيل"
            ratio="aspect-square"
          />
        </div>
        <div className="mt-5">
          <ListEditor
            items={draft.story_stats}
            onChange={(v) => set('story_stats', v)}
            create={() => ({ value: '', label: '' })}
            addLabel="إضافة رقم"
            render={(item, update) => (
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="الرقم" value={item.value} onChange={(v) => update({ value: v })} />
                <TextField label="الوصف" value={item.label} onChange={(v) => update({ label: v })} />
              </div>
            )}
          />
        </div>
      </PanelCard>

      <div className="xl:col-span-2">
        <PanelCard title="قسم التوصيل" description="الوعود الأربعة التي تظهر للعميل.">
          <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
            <div className="grid gap-4">
              <ImageUploader
                value={draft.delivery_image}
                onChange={(v) => set('delivery_image', v)}
                label="صورة القسم"
                ratio="aspect-[3/2]"
              />
              <TextField label="العنوان" value={draft.delivery_title} onChange={(v) => set('delivery_title', v)} />
              <AreaField label="النص" rows={4} value={draft.delivery_text} onChange={(v) => set('delivery_text', v)} />
            </div>
            <ListEditor
              items={draft.delivery_cards}
              onChange={(v) => set('delivery_cards', v)}
              create={() => ({ title: '', text: '' })}
              addLabel="إضافة ميزة"
              render={(item, update) => (
                <div className="grid gap-3">
                  <TextField label="العنوان" value={item.title} onChange={(v) => update({ title: v })} />
                  <AreaField label="الوصف" rows={2} value={item.text} onChange={(v) => update({ text: v })} />
                </div>
              )}
            />
          </div>
        </PanelCard>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- commerce */

function CommerceTab({ draft, set }: TabProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <PanelCard title="الرسوم والتوصيل" description="تنطبق فورًا على السلة وإتمام الطلب.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="رسوم التوصيل (ر.س)"
            type="number"
            value={draft.delivery_fee}
            onChange={(v) => set('delivery_fee', Number(v) || 0)}
          />
          <TextField
            label="التوصيل مجاني من (ر.س)"
            type="number"
            value={draft.free_delivery_from}
            onChange={(v) => set('free_delivery_from', Number(v) || 0)}
          />
          <TextField
            label="رسوم التغليف الفاخر (ر.س)"
            type="number"
            value={draft.gift_wrap_fee}
            onChange={(v) => set('gift_wrap_fee', Number(v) || 0)}
          />
          <TextField
            label="حد تنبيه المخزون"
            type="number"
            value={draft.low_stock_threshold}
            onChange={(v) => set('low_stock_threshold', Number(v) || 0)}
          />
          <div className="sm:col-span-2">
            <TextField
              label="أقصى طول لرسالة الإهداء"
              type="number"
              value={draft.gift_message_max}
              onChange={(v) => set('gift_message_max', Number(v) || 160)}
            />
          </div>
        </div>
      </PanelCard>

      <PanelCard title="المدن والفترات" description="تظهر كخيارات في صفحة إتمام الطلب.">
        <div className="grid gap-5">
          <TagInput label="مدن التوصيل" values={draft.cities} onChange={(v) => set('cities', v)} placeholder="الرياض" />
          <TagInput
            label="فترات التوصيل"
            values={draft.delivery_slots}
            onChange={(v) => set('delivery_slots', v)}
            placeholder="٣ عصرًا – ٦ مساءً"
          />
        </div>
      </PanelCard>

      <div className="xl:col-span-2">
        <PanelCard title="طرق الدفع" description="فعّل أو عطّل الطرق المتاحة للعميل.">
          <ListEditor
            items={draft.payment_methods}
            onChange={(v) => set('payment_methods', v)}
            create={() => ({ value: `method-${Date.now()}`, label: '', hint: '', enabled: true })}
            addLabel="إضافة طريقة دفع"
            render={(item, update) => (
              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_200px]">
                <TextField label="الاسم" value={item.label} onChange={(v) => update({ label: v })} />
                <TextField label="الوصف" value={item.hint} onChange={(v) => update({ hint: v })} />
                <div className="self-end">
                  <SwitchField
                    label={item.enabled ? 'مفعّلة' : 'معطّلة'}
                    checked={item.enabled}
                    onChange={(v) => update({ enabled: v })}
                  />
                </div>
              </div>
            )}
          />
        </PanelCard>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- contact */

function ContactTab({ draft, set }: TabProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <PanelCard title="بيانات التواصل" description="تظهر في الفوتر وتُستخدم في طلبات الواتساب.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="رقم الجوال للعرض" dir="ltr" value={draft.phone} onChange={(v) => set('phone', v)} />
          <TextField
            label="رقم الواتساب"
            dir="ltr"
            hint="بصيغة 966XXXXXXXXX"
            value={draft.whatsapp}
            onChange={(v) => set('whatsapp', v)}
          />
          <TextField label="البريد الإلكتروني" dir="ltr" value={draft.email} onChange={(v) => set('email', v)} />
          <TextField label="ساعات العمل" value={draft.hours_ar} onChange={(v) => set('hours_ar', v)} />
          <div className="sm:col-span-2">
            <AreaField label="العنوان" rows={2} value={draft.address_ar} onChange={(v) => set('address_ar', v)} />
          </div>
        </div>
      </PanelCard>

      <PanelCard title="الروابط والفوتر">
        <div className="grid gap-4">
          <TextField label="رابط الموقع على الخرائط" dir="ltr" value={draft.maps_url} onChange={(v) => set('maps_url', v)} />
          <p className="rounded-2xl border border-dashed border-gold/35 bg-gold/6 px-4 py-3 text-[12px] leading-relaxed text-cocoa-2">
            روابط إنستغرام وتيك توك وبقية المنصات تُدار الآن من تبويب «التواصل الاجتماعي».
          </p>
          <AreaField label="نبذة الفوتر" rows={3} value={draft.footer_about} onChange={(v) => set('footer_about', v)} />
          <TextField label="سطر التذييل" value={draft.footer_note} onChange={(v) => set('footer_note', v)} />
        </div>
      </PanelCard>
    </div>
  );
}

/* ------------------------------------------------------------------- logo */

const LOGO_SIZES = [
  { value: 'md', label: 'متوسط', hint: 'حتى ١١٢ بكسل' },
  { value: 'lg', label: 'كبير', hint: 'حتى ١٦٠ بكسل · موصى به' },
  { value: 'xl', label: 'مميز جدًا', hint: 'حتى ٢٢٤ بكسل' },
] as const;

const LOGO_PLACES = [
  {
    value: 'seal',
    label: 'لوحة الشعار تحت الواجهة',
    hint: 'مكان مميز مستقل بخطوط ذهبية — الأكثر فخامة',
  },
  {
    value: 'hero',
    label: 'ميدالية على صورة الواجهة',
    hint: 'دائرة عاجية مطوقة بالذهب',
  },
  { value: 'footer', label: 'شعار الفوتر', hint: 'ختم هادئ أسفل الموقع' },
  { value: 'all', label: 'في كل المواقع المميزة', hint: 'اللوحة والميدالية والفوتر' },
] as const;

const PREVIEW_H: Record<string, string> = { md: 'h-16', lg: 'h-24', xl: 'h-32' };

function LogoTab({ draft, set }: TabProps) {
  const hasLogo = !!(draft.logo_url || '').trim();

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <PanelCard
        title="شعار العلامة"
        description="ارفع شعارك (PNG بخلفية شفافة هو الأفضل). شعار موسيريا الأصلي في الهيدر يبقى ثابتًا كما هو."
        action={
          hasLogo && (
            <button
              type="button"
              onClick={() => set('logo_url', '')}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-raspberry/10 px-4 text-[12px] text-raspberry transition hover:bg-raspberry hover:text-ivory"
            >
              <Trash2 size={13} />
              حذف الشعار
            </button>
          )
        }
      >
        <ImageUploader
          value={draft.logo_url}
          onChange={(v) => set('logo_url', v)}
          ratio="aspect-[16/9]"
        />

        <div className="mt-5">
          <SwitchField
            label="إظهار الشعار في الموقع"
            hint="أوقفه مؤقتًا دون حذف الصورة"
            checked={draft.logo_enabled}
            onChange={(v) => set('logo_enabled', v)}
          />
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-gold/35 bg-gold/6 px-4 py-3 text-[12px] leading-relaxed text-cocoa-2">
          الشعار المرفوع يُعرض في مكان خاص به ولا يستبدل المونوجرام الأصلي في الهيدر أو الفوتر.
        </div>
      </PanelCard>

      <PanelCard title="الحجم والموقع" description="اختر حجمًا مميزًا ومكانًا يليق بالعلامة.">
        <div>
          <p className="mb-2.5 text-[12.5px] font-medium text-cocoa-2">حجم الشعار</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {LOGO_SIZES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => set('logo_size', s.value)}
                className={`rounded-2xl border p-3.5 text-start transition ${
                  draft.logo_size === s.value
                    ? 'border-gold bg-gold/10'
                    : 'border-line bg-cream/40 hover:border-gold/50'
                }`}
              >
                <span className="block text-[13px] font-medium text-cocoa">{s.label}</span>
                <span className="mt-0.5 block text-[11px] text-mocha">{s.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2.5 text-[12.5px] font-medium text-cocoa-2">مكان العرض</p>
          <div className="space-y-2">
            {LOGO_PLACES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => set('logo_placement', p.value)}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3.5 text-start transition ${
                  draft.logo_placement === p.value
                    ? 'border-gold bg-gold/10'
                    : 'border-line bg-cream/40 hover:border-gold/50'
                }`}
              >
                <span>
                  <span className="block text-[13px] font-medium text-cocoa">{p.label}</span>
                  <span className="mt-0.5 block text-[11px] text-mocha">{p.hint}</span>
                </span>
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                    draft.logo_placement === p.value ? 'border-gold bg-gold text-ivory' : 'border-sand-2'
                  }`}
                >
                  {draft.logo_placement === p.value && <Check size={11} />}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <SwitchField
            label="إظهار سطر تحت الشعار"
            checked={draft.logo_show_caption}
            onChange={(v) => set('logo_show_caption', v)}
          />
          <TextField
            label="السطر بالعربية"
            value={draft.logo_caption_ar}
            onChange={(v) => set('logo_caption_ar', v)}
            placeholder="حلويات فاخرة · الرياض"
          />
          <TextField
            label="السطر بالإنجليزية"
            dir="ltr"
            value={draft.logo_caption_en}
            onChange={(v) => set('logo_caption_en', v)}
            placeholder="Fine Patisserie · Riyadh"
          />
        </div>
      </PanelCard>

      <div className="xl:col-span-2">
        <PanelCard title="معاينة حيّة" description="هكذا تظهر لوحة الشعار للعميل.">
          {!hasLogo ? (
            <p className="rounded-3xl border border-dashed border-line bg-cream/50 px-6 py-10 text-center text-[13px] text-mocha">
              ارفع شعارًا لتظهر المعاينة هنا.
            </p>
          ) : (
            <div className="relative overflow-hidden rounded-4xl border border-line bg-ivory">
              <div className="dust pointer-events-none absolute inset-0 opacity-70" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold-2 to-transparent" />
              <div className="relative flex flex-col items-center px-6 py-12">
                <div className="flex w-full items-center justify-center gap-6">
                  <span className="h-px max-w-[6rem] flex-1 bg-gradient-to-l from-transparent to-gold-2/70" />
                  <img
                    src={draft.logo_url}
                    alt="معاينة الشعار"
                    className={`w-auto max-w-[60%] object-contain ${
                      PREVIEW_H[draft.logo_size] || 'h-24'
                    } ${draft.logo_enabled ? '' : 'opacity-30 grayscale'}`}
                  />
                  <span className="h-px max-w-[6rem] flex-1 bg-gradient-to-r from-transparent to-gold-2/70" />
                </div>
                {draft.logo_show_caption && draft.logo_caption_ar && (
                  <p className="eyebrow mt-6 text-[10px] text-gold">{draft.logo_caption_ar}</p>
                )}
                {!draft.logo_enabled && (
                  <p className="mt-5 text-[12px] text-raspberry">الشعار مخفي حاليًا عن الموقع</p>
                )}
              </div>
            </div>
          )}
        </PanelCard>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- locale */

function LocaleTab({ draft, set }: TabProps) {
  const languages = draft.languages || ['ar'];
  const currencies = draft.currencies || ['SAR'];
  const rates = draft.currency_rates || {};

  const toggleLang = (code: string) => {
    const next = languages.includes(code)
      ? languages.filter((l) => l !== code)
      : [...languages, code];
    // Arabic is the brand's native language and stays available.
    set('languages', next.length ? next : ['ar']);
  };

  const toggleCurrency = (code: string) => {
    if (code === 'SAR') return;
    const next = currencies.includes(code)
      ? currencies.filter((c) => c !== code)
      : [...currencies, code];
    set('currencies', next.includes('SAR') ? next : ['SAR', ...next]);
  };

  const LANGS = (['ar', 'en', 'en-GB'] as Lang[]).map((code) => ({
    code,
    native: LANG_META[code].native,
    latin: LANG_META[code].latin,
    dir: LANG_META[code].dir.toUpperCase(),
  }));

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <PanelCard
        title="لغات المتجر"
        description="اختر اللغات المتاحة للعملاء. يتبدل اتجاه الموقع وتنسيق التواريخ تلقائيًا مع كل لغة."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {LANGS.map((l) => {
            const on = languages.includes(l.code);
            const gb = l.code === 'en-GB';
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => toggleLang(l.code)}
                className={`flex items-center justify-between gap-3 rounded-3xl border p-4 text-start transition ${
                  on ? 'border-gold bg-gold/8' : 'border-line bg-cream/40 hover:border-gold/50'
                }`}
              >
                <span>
                  <span className="block text-[14px] font-semibold text-cocoa">{l.native}</span>
                  <span className="mt-0.5 block text-[11.5px] text-mocha">
                    {l.latin} · {l.dir}
                    {gb ? ' · تواريخ وساعة بريطانية' : ''}
                  </span>
                </span>
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
                    on ? 'border-gold bg-gold text-ivory' : 'border-sand-2'
                  }`}
                >
                  {on && <Check size={12} />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          <label className="block">
            <span className="mb-2 block text-[12.5px] font-medium text-cocoa-2">
              اللغة الافتراضية للزائر الجديد
            </span>
            <select
              className={inputClass}
              value={draft.default_language}
              onChange={(e) => set('default_language', e.target.value)}
            >
              {LANGS.filter((l) => languages.includes(l.code)).map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native}
                </option>
              ))}
            </select>
          </label>
        </div>
      </PanelCard>

      <PanelCard
        title="العملات المتاحة"
        description="الريال السعودي هو عملة الأساس ولا يمكن إيقافه، وبقية العملات تُعرض للعميل تقديريًا."
        action={
          <span className="num rounded-full bg-cream px-3 py-1.5 text-[11.5px] text-gold">
            {currencies.length}
          </span>
        }
      >
        <div className="space-y-2.5">
          {CURRENCIES.map((c) => {
            const on = currencies.includes(c.code);
            const base = c.code === 'SAR';
            return (
              <div
                key={c.code}
                className={`flex flex-wrap items-center gap-3 rounded-3xl border p-3.5 transition ${
                  on ? 'border-gold/35 bg-gold/5' : 'border-line bg-cream/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleCurrency(c.code)}
                  disabled={base}
                  aria-pressed={on}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
                    on ? 'bg-gold' : 'bg-sand-2'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-ivory shadow transition-all ${
                      on ? 'left-0.5' : 'right-0.5'
                    }`}
                  />
                </button>

                <div className="min-w-[7rem] flex-1">
                  <p className="text-[13.5px] font-semibold text-cocoa">
                    <span className="num me-1.5 text-[11.5px] text-mocha">{c.code}</span>
                    {c.name_ar}
                  </p>
                  <p className="text-[11px] text-mocha">
                    {base ? 'عملة الأساس — تُحصّل بها الطلبات' : `الرمز: ${c.symbol_ar}`}
                  </p>
                </div>

                <label className="flex items-center gap-2">
                  <span className="text-[11px] text-mocha">لكل ١ ر.س</span>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    disabled={base}
                    value={rates[c.code] ?? c.rate}
                    onChange={(e) =>
                      set('currency_rates', {
                        ...rates,
                        [c.code]: Number(e.target.value) || 0,
                      })
                    }
                    dir="ltr"
                    className="num h-10 w-28 rounded-2xl border border-line bg-ivory px-3 text-start text-[12.5px] text-cocoa focus:border-gold focus:outline-none disabled:opacity-60"
                  />
                </label>

                <span className="num shrink-0 rounded-full bg-cream px-3 py-1.5 text-[11.5px] text-cocoa-2">
                  100 ر.س = {(100 * Number(rates[c.code] ?? c.rate)).toLocaleString('en-US', {
                    maximumFractionDigits: c.decimals,
                    minimumFractionDigits: c.decimals,
                  })}{' '}
                  {c.symbol_ar}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-5">
          <label className="block">
            <span className="mb-2 block text-[12.5px] font-medium text-cocoa-2">
              العملة الافتراضية
            </span>
            <select
              className={inputClass}
              value={draft.default_currency}
              onChange={(e) => set('default_currency', e.target.value)}
            >
              {CURRENCIES.filter((c) => currencies.includes(c.code)).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name_ar} ({c.code})
                </option>
              ))}
            </select>
          </label>
        </div>
      </PanelCard>
    </div>
  );
}

/* ----------------------------------------------------------------- social */

function SocialTab({ draft, set }: TabProps) {
  const links = draft.social_links || [];
  const active = visibleSocials(links);

  const update = (key: string, patch: Partial<SocialLink>) =>
    set(
      'social_links',
      links.map((l) => (l.key === key ? { ...l, ...patch } : l))
    );

  const missing = SOCIAL_PLATFORMS.filter((p) => !links.some((l) => l.key === p.key));

  const addPlatform = (key: string) => {
    const p = platformFor(key);
    set('social_links', [...links, { key: p.key, label: p.label, url: '', enabled: true }]);
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...links];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    set('social_links', next);
  };

  const groups: SocialCategory[] = ['social', 'delivery', 'contact'];

  return (
    <div className="grid gap-5">
      <PanelCard
        title="منصات التواصل الاجتماعي"
        description="فعّل المنصة وأضف رابطها ليظهر أيقونتها في الفوتر وقائمة الجوال. المنصة بلا رابط لا تظهر للعملاء."
        action={
          <span className="num rounded-full bg-cream px-3.5 py-1.5 text-[12px] text-gold">
            {active.length} ظاهرة
          </span>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="عنوان القسم في الفوتر"
            value={draft.social_title}
            onChange={(v) => set('social_title', v)}
            placeholder="تابعنا"
          />
          <div className="self-end">
            <SwitchField
              label="إظهار المنصات في الفوتر"
              hint="أوقفه لإخفاء القسم كاملًا من الموقع"
              checked={draft.social_show_footer}
              onChange={(v) => set('social_show_footer', v)}
            />
          </div>
        </div>

        {active.length > 0 && (
          <div className="mt-5 rounded-3xl border border-line bg-cream/50 p-4">
            <p className="mb-3 text-[12px] text-mocha">معاينة كما تظهر للعميل:</p>
            <div className="flex flex-wrap gap-2.5 rounded-2xl bg-cocoa p-4">
              {active.map((s) => {
                const Icon = platformFor(s.key).icon;
                return (
                  <span
                    key={s.key}
                    title={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/70"
                  >
                    <Icon size={16} />
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </PanelCard>

      {groups.map((group) => {
        const meta = CATEGORY_META[group];
        const rows = links
          .map((link, index) => ({ link, index }))
          .filter(({ link }) => platformFor(link.key).category === group);
        if (!rows.length) return null;
        const liveCount = socialsByCategory(links, group).length;

        return (
          <PanelCard
            key={group}
            title={meta.label}
            description={meta.hint}
            action={
              <span className="num rounded-full bg-cream px-3 py-1.5 text-[11.5px] text-gold">
                {liveCount}/{rows.length}
              </span>
            }
          >
            <div className="space-y-3">
              {rows.map(({ link, index: i }) => {
                const p = platformFor(link.key);
                const Icon = p.icon;
                const live = link.enabled && (link.url || '').trim();
                return (
                  <div
                    key={link.key}
                    className={`rounded-3xl border p-4 transition ${
                      live ? 'border-gold/35 bg-gold/5' : 'border-line bg-cream/40'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition ${
                          live ? 'bg-gold text-ivory' : 'bg-sand text-mocha'
                        }`}
                      >
                        <Icon size={18} />
                      </span>

                      <div className="min-w-[8rem] flex-1">
                        <p className="text-[13.5px] font-semibold text-cocoa">
                          {link.label || p.label}
                        </p>
                        <p className="text-[11px] text-mocha">
                          {live
                            ? 'ظاهرة للعملاء'
                            : link.enabled
                              ? 'مفعّلة بلا رابط — لن تظهر'
                              : 'مخفية'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => move(i, -1)}
                          disabled={i === 0}
                          className="rounded-full px-2 py-1 text-[11px] text-mocha transition hover:text-cocoa disabled:opacity-30"
                        >
                          للأعلى
                        </button>
                        <button
                          type="button"
                          onClick={() => move(i, 1)}
                          disabled={i === links.length - 1}
                          className="rounded-full px-2 py-1 text-[11px] text-mocha transition hover:text-cocoa disabled:opacity-30"
                        >
                          للأسفل
                        </button>
                        <button
                          type="button"
                          onClick={() => update(link.key, { enabled: !link.enabled })}
                          aria-pressed={link.enabled}
                          aria-label={`إظهار ${link.label}`}
                          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                            link.enabled ? 'bg-gold' : 'bg-sand-2'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-ivory shadow transition-all ${
                              link.enabled ? 'left-0.5' : 'right-0.5'
                            }`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            set('social_links', links.filter((l) => l.key !== link.key))
                          }
                          aria-label="إزالة المنصة"
                          className="grid h-9 w-9 place-items-center rounded-full bg-raspberry/10 text-raspberry transition hover:bg-raspberry hover:text-ivory"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1.6fr]">
                      <TextField
                        label="الاسم المعروض"
                        value={link.label}
                        onChange={(v) => update(link.key, { label: v })}
                        placeholder={p.label}
                      />
                      <TextField
                        label="الرابط"
                        dir="ltr"
                        value={link.url}
                        onChange={(v) => update(link.key, { url: v })}
                        placeholder={p.placeholder}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </PanelCard>
        );
      })}

      <PanelCard
        title="إضافة منصة"
        description="اختر منصة جديدة لتظهر في القوائم أعلاه، ثم أضف رابطها."
      >
        {missing.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-cream/50 px-4 py-4 text-[12.5px] text-mocha">
            كل المنصات المتاحة مضافة بالفعل.
          </p>
        ) : (
          <div>
            {groups.map((group) => {
              const options = missing.filter((p) => p.category === group);
              if (!options.length) return null;
              return (
                <div key={group} className="mb-5 last:mb-0">
                  <p className="mb-2.5 text-[12px] font-medium text-mocha">
                    {CATEGORY_META[group].label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {options.map((p) => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.key}
                          type="button"
                          onClick={() => addPlatform(p.key)}
                          className="inline-flex items-center gap-2 rounded-full border border-dashed border-line px-4 py-2.5 text-[12.5px] text-cocoa-2 transition hover:border-gold hover:text-gold"
                        >
                          <Plus size={13} />
                          <Icon size={14} />
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PanelCard>
    </div>
  );
}

/* ------------------------------------------------------------- categories */

function CategoriesTab() {
  const { toast } = useToast();
  const confirm = useConfirm();
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | 'new' | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setRows(await api.categories());
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = (id: number, patch: Partial<Category>) =>
    setRows((r) => r.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const persist = async (row: Category) => {
    setBusy(row.id);
    try {
      await api.updateCategory({
        id: row.id,
        name_ar: row.name_ar,
        name_en: row.name_en,
        description_ar: row.description_ar,
        image: row.image,
        accent: row.accent,
        sort_order: Number(row.sort_order) || 0,
      });
      toast('تم حفظ الصنف', { description: row.name_ar });
    } catch (e) {
      toast('تعذّر الحفظ', { description: e instanceof Error ? e.message : undefined, tone: 'error' });
    } finally {
      setBusy(null);
    }
  };

  const create = async () => {
    setBusy('new');
    try {
      await api.createCategory({
        slug: `cat-${Date.now().toString(36)}`,
        name_ar: 'صنف جديد',
        name_en: 'Nouvelle',
        description_ar: '',
        image: '/img/cat-mousse.webp',
        accent: '#D6B684',
        sort_order: rows.length + 1,
      });
      toast('تمت إضافة صنف جديد');
      load();
    } catch (e) {
      toast('تعذّر الإنشاء', { description: e instanceof Error ? e.message : undefined, tone: 'error' });
    } finally {
      setBusy(null);
    }
  };

  const remove = async (row: Category) => {
    const ok = await confirm({
      title: `حذف الصنف «${row.name_ar}»؟`,
      description: 'لن تُحذف الحلويات التابعة له، لكنها لن تظهر ضمن هذا الصنف في المتجر.',
      confirmLabel: 'نعم، احذف الصنف',
    });
    if (!ok) return;
    await api.deleteCategory(row.id);
    toast('تم حذف الصنف', { tone: 'info' });
    load();
  };

  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-56 rounded-4xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          onClick={create}
          disabled={busy === 'new'}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-cocoa px-5 text-[13px] text-cream disabled:opacity-50"
        >
          <Plus size={15} />
          صنف جديد
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((c) => (
          <div key={c.id} className="rounded-4xl border border-line bg-ivory p-5">
            <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
              <ImageUploader
                value={c.image}
                onChange={(v) => update(c.id, { image: v })}
                ratio="aspect-square"
              />
              <div className="grid gap-3">
                <TextField label="الاسم بالعربية" value={c.name_ar} onChange={(v) => update(c.id, { name_ar: v })} />
                <TextField
                  label="الاسم باللاتينية"
                  dir="ltr"
                  value={c.name_en}
                  onChange={(v) => update(c.id, { name_en: v })}
                />
                <AreaField
                  label="الوصف"
                  rows={2}
                  value={c.description_ar || ''}
                  onChange={(v) => update(c.id, { description_ar: v })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-2 block text-[12.5px] font-medium text-cocoa-2">لون الإبراز</span>
                    <input
                      type="color"
                      value={c.accent || '#D6B684'}
                      onChange={(e) => update(c.id, { accent: e.target.value })}
                      className="h-12 w-full cursor-pointer rounded-2xl border border-line bg-ivory p-1"
                    />
                  </label>
                  <TextField
                    label="الترتيب"
                    type="number"
                    value={c.sort_order}
                    onChange={(v) => update(c.id, { sort_order: Number(v) || 0 })}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
              <span className="wordmark text-[11px] text-mocha-2">{c.slug}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => remove(c)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-raspberry/10 text-raspberry transition hover:bg-raspberry hover:text-ivory"
                  aria-label="حذف"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  onClick={() => persist(c)}
                  disabled={busy === c.id}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-cocoa px-5 text-[12.5px] text-cream disabled:opacity-50"
                >
                  {busy === c.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  حفظ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- testimonials */

function TestimonialsTab() {
  const { toast } = useToast();
  const confirm = useConfirm();
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.content();
      setRows(data.testimonials);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = (id: number, patch: Partial<Testimonial>) =>
    setRows((r) => r.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const save = async (row: Testimonial) => {
    await api.updateContent<Testimonial>('testimonials', {
      id: row.id,
      name: row.name,
      city: row.city,
      text_ar: row.text_ar,
      rating: Number(row.rating) || 5,
      product_ar: row.product_ar,
      initial: row.name?.charAt(0) || row.initial,
      sort_order: Number(row.sort_order) || 0,
    });
    toast('تم حفظ الرأي');
  };

  const create = async () => {
    await api.createContent<Testimonial>('testimonials', {
      name: 'عميل جديد',
      city: 'الرياض',
      text_ar: '',
      rating: 5,
      product_ar: '',
      initial: 'ع',
      sort_order: rows.length + 1,
    });
    toast('تمت إضافة رأي جديد');
    load();
  };

  const remove = async (row: Testimonial) => {
    const ok = await confirm({
      title: 'حذف هذا الرأي؟',
      description: `سيُزال رأي «${row.name}» من الصفحة الرئيسية نهائيًا.`,
      confirmLabel: 'نعم، احذف',
    });
    if (!ok) return;
    await api.deleteContent('testimonials', row.id);
    toast('تم الحذف', { tone: 'info' });
    load();
  };

  if (loading) return <div className="skeleton h-64 rounded-4xl" />;

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={create} className="inline-flex h-11 items-center gap-2 rounded-full bg-cocoa px-5 text-[13px] text-cream">
          <Plus size={15} />
          رأي جديد
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((t) => (
          <div key={t.id} className="rounded-4xl border border-line bg-ivory p-5">
            <div className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="الاسم" value={t.name} onChange={(v) => update(t.id, { name: v })} />
                <TextField label="المدينة" value={t.city} onChange={(v) => update(t.id, { city: v })} />
              </div>
              <AreaField label="الرأي" rows={3} value={t.text_ar} onChange={(v) => update(t.id, { text_ar: v })} />
              <div className="grid gap-3 sm:grid-cols-3">
                <TextField label="المنتج" value={t.product_ar} onChange={(v) => update(t.id, { product_ar: v })} />
                <label className="block">
                  <span className="mb-2 block text-[12.5px] font-medium text-cocoa-2">التقييم</span>
                  <select
                    value={t.rating}
                    onChange={(e) => update(t.id, { rating: Number(e.target.value) })}
                    className={inputClass}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} ★
                      </option>
                    ))}
                  </select>
                </label>
                <TextField
                  label="الترتيب"
                  type="number"
                  value={t.sort_order}
                  onChange={(v) => update(t.id, { sort_order: Number(v) || 0 })}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2 border-t border-line pt-4">
              <button
                onClick={() => remove(t)}
                className="grid h-10 w-10 place-items-center rounded-full bg-raspberry/10 text-raspberry transition hover:bg-raspberry hover:text-ivory"
                aria-label="حذف"
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={() => save(t)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-cocoa px-5 text-[12.5px] text-cream"
              >
                <Check size={14} />
                حفظ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- faqs */

function FaqsTab() {
  const { toast } = useToast();
  const confirm = useConfirm();
  const [rows, setRows] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.content();
      setRows(data.faqs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = (id: number, patch: Partial<Faq>) =>
    setRows((r) => r.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  const save = async (row: Faq) => {
    await api.updateContent<Faq>('faqs', {
      id: row.id,
      q_ar: row.q_ar,
      a_ar: row.a_ar,
      sort_order: Number(row.sort_order) || 0,
    });
    toast('تم حفظ السؤال');
  };

  const create = async () => {
    await api.createContent<Faq>('faqs', { q_ar: 'سؤال جديد؟', a_ar: '', sort_order: rows.length + 1 });
    toast('تمت الإضافة');
    load();
  };

  const remove = async (row: Faq) => {
    const ok = await confirm({
      title: 'حذف هذا السؤال؟',
      description: 'سيُزال من قسم الأسئلة الشائعة في الموقع.',
      confirmLabel: 'نعم، احذف',
    });
    if (!ok) return;
    await api.deleteContent('faqs', row.id);
    toast('تم الحذف', { tone: 'info' });
    load();
  };

  if (loading) return <div className="skeleton h-64 rounded-4xl" />;

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={create} className="inline-flex h-11 items-center gap-2 rounded-full bg-cocoa px-5 text-[13px] text-cream">
          <Plus size={15} />
          سؤال جديد
        </button>
      </div>
      <div className="space-y-4">
        {rows.map((f) => (
          <div key={f.id} className="rounded-4xl border border-line bg-ivory p-5">
            <div className="grid gap-3">
              <TextField label="السؤال" value={f.q_ar} onChange={(v) => update(f.id, { q_ar: v })} />
              <AreaField label="الإجابة" rows={3} value={f.a_ar} onChange={(v) => update(f.id, { a_ar: v })} />
              <div className="max-w-[160px]">
                <TextField
                  label="الترتيب"
                  type="number"
                  value={f.sort_order}
                  onChange={(v) => update(f.id, { sort_order: Number(v) || 0 })}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2 border-t border-line pt-4">
              <button
                onClick={() => remove(f)}
                className="grid h-10 w-10 place-items-center rounded-full bg-raspberry/10 text-raspberry transition hover:bg-raspberry hover:text-ivory"
                aria-label="حذف"
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={() => save(f)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-cocoa px-5 text-[12.5px] text-cream"
              >
                <Check size={14} />
                حفظ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
