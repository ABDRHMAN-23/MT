import supabase from './db-client.js';

export const DEFAULTS = {
  brand_name_ar: 'موسيريا',
  brand_name_en: 'MOUSSERIE',
  brand_tagline: 'Maison de Mousse · Riyadh',

  ticker: [
    'توصيل مبرّد في نفس اليوم داخل الرياض',
    'تُحضّر يوميًا بكريمة طازجة',
    'شوكولاتة بلجيكية أصلية',
    'تغليف هدايا فاخر مع بطاقة إهداء',
  ],

  hero_eyebrow: 'Maison de Mousse · Riyadh',
  hero_title_line1: 'لحظة حلوة…',
  hero_title_line2: 'تستحق أن تُتذوق',
  hero_subtitle:
    'موس حريري، شوكولاتة بلجيكية، وفواكه تُقطف في ذروتها. نصنع في موسيريا حلوياتٍ تُحضَّر يوميًا بأيدي طهاتنا، وتصل إليك مبرّدة كما غادرت المطبخ تمامًا.',
  hero_cta_primary: 'تسوّق الحلويات',
  hero_cta_secondary: 'صناديق الإهداء',
  hero_image: '/img/hero-2.webp',
  hero_badge_text: 'تُحضّر اليوم',
  hero_stats: [
    { value: '١٤', label: 'حلوى في المجموعة' },
    { value: '٤.٩', label: 'تقييم عملائنا' },
    { value: '٢س', label: 'متوسط التوصيل' },
  ],

  trust_items: [
    'مكوّنات طبيعية بلا مواد حافظة',
    'سلسلة تبريد كاملة حتى بابك',
    'شوكولاتة بلجيكية وفستق حلبي',
    'تغليف هدايا يدوي مع بطاقة إهداء',
  ],

  categories_title: 'عوالمنا الحلوة',
  categories_subtitle: 'من الموس الحريري إلى صناديق الإهداء، كل عالمٍ له نكهته وحكايته.',
  featured_title: 'مختارات الشيف',
  featured_subtitle: 'أربع قطع نفخر بها: توازن دقيق بين القوام والحلاوة والعطر.',
  best_title: 'الأكثر طلبًا',
  best_subtitle: 'ما يعود إليه عملاؤنا مرّة بعد مرّة.',
  new_title: 'وصل حديثًا',
  new_subtitle: 'تجارب جديدة من مختبر النكهات لدينا، بكميات محدودة.',

  seasonal_enabled: true,
  seasonal_eyebrow: 'Collection saisonnière',
  seasonal_title: 'مجموعة الموسم',
  seasonal_highlight: 'تين، كراميل، وقهوة عربية',
  seasonal_text:
    'حين يهدأ الحرّ ويصير المساء أطول، نُدخل إلى المطبخ نكهاتٍ أدفأ: تينٌ ناضج، كراميل مطبوخ ببطء، وقهوة عربية بالهيل. مجموعة محدودة تُصنع بكميات صغيرة كل أسبوع.',
  seasonal_image: '/img/seasonal.webp',
  seasonal_cta: 'اكتشف المجموعة الموسمية',

  promo_enabled: true,
  promo_badge: 'عرض الإهداء',
  promo_title: 'خصم ١٥٪ على صناديق الهدايا',
  promo_text:
    'لأن الهدية الحلوة تُقال بلا كلمات. استخدم الرمز عند إتمام الطلب على أي صندوق إهداء أو كيكة مناسبة.',
  promo_code: 'MOUSSE15',
  promo_cta: 'تسوّق الهدايا',
  promo_image: '/img/hero.webp',

  story_eyebrow: 'Notre histoire',
  story_title: 'بدأنا بملعقة واحدة',
  story_paragraphs: [
    'في مطبخٍ صغير بالرياض، وُلدت موسيريا من سؤال بسيط: لماذا تكون الحلوى مجرّد نهاية للوجبة، ولا تكون هي المناسبة نفسها؟',
    'نختار الشوكولاتة من بلجيكا، والفستق من حلب، والفانيليا من مدغشقر. ثم نتركها بين أيدٍ صبورة تُخفق وتُطبّق وتُبرّد على مهل — لأن الموس لا يُستعجل.',
    'كل قطعة تُصنع في اليوم نفسه الذي تصلك فيه. لا مخزون، لا مواد حافظة، ولا حلّ وسط.',
  ],
  story_image: '/img/story.webp',
  story_detail_image: '/img/detail-section.webp',
  story_detail_caption: 'سبع طبقات في كل قطعة',
  story_stats: [
    { value: '٢٠١٩', label: 'بداية الحكاية' },
    { value: '+١٢ك', label: 'صندوق سعادة' },
    { value: '٤.٩/٥', label: 'رضا عملائنا' },
  ],

  testimonials_title: 'ماذا قالوا عنّا',
  testimonials_subtitle: 'آراء وصلتنا بعد أول ملعقة.',

  delivery_title: 'تصل كما غادرت المطبخ',
  delivery_text:
    'الموس كائن حسّاس: يكره الحرارة ويحب الهدوء. لذلك بنينا نظام توصيل خاصًا يحافظ على قوامه الحريري حتى لحظة فتح الصندوق.',
  delivery_image: '/img/delivery.webp',
  delivery_cards: [
    { title: 'توصيل مبرّد في نفس اليوم', text: 'داخل الرياض للطلبات قبل الساعة ٤ عصرًا، بسيارات مجهّزة بالتبريد.' },
    { title: 'سلسلة تبريد كاملة', text: 'من الثلاجة إلى يدك دون انقطاع، مع عبوة تبريد داخل كل صندوق.' },
    { title: 'تغليف هدايا يدوي', text: 'صندوق فاخر، شريط ساتان، وبطاقة إهداء بخط أنيق مع رسالتك.' },
    { title: 'حجز مسبق للمناسبات', text: 'كيكات المناسبات تُحجز قبل ٤٨ ساعة لضمان الإتقان.' },
  ],

  final_cta_title1: 'لحظة حلوة…',
  final_cta_title2: 'تستحق أن تُتذوق',
  final_cta_text: 'اطلب اليوم قبل الساعة ٤ عصرًا واستمتع بالتوصيل المبرّد في نفس اليوم داخل الرياض.',
  final_cta_image: '/img/wide-banner.webp',

  phone: '+966 55 123 4567',
  whatsapp: '966551234567',
  email: 'hello@mousserie.com',
  address_ar: 'الرياض — حي الياسمين، طريق الأمير محمد بن سلمان',
  hours_ar: 'يوميًا من ١٠ صباحًا حتى ١١ مساءً',
  instagram: 'https://instagram.com',
  tiktok: '',
  maps_url: '',
  social_title: 'تابعنا',
  social_show_footer: true,
  // Full roster. Keep in sync with src/lib/social.ts (SOCIAL_PLATFORMS).
  social_links: [
    { key: 'instagram', label: 'إنستغرام', url: 'https://instagram.com/mousserie', enabled: true },
    { key: 'tiktok', label: 'تيك توك', url: 'https://tiktok.com/@mousserie', enabled: true },
    { key: 'snapchat', label: 'سناب شات', url: 'https://snapchat.com/add/mousserie', enabled: true },
    { key: 'x', label: 'إكس (تويتر)', url: 'https://x.com/mousserie', enabled: true },
    { key: 'facebook', label: 'فيسبوك', url: '', enabled: false },
    { key: 'youtube', label: 'يوتيوب', url: '', enabled: false },
    { key: 'threads', label: 'ثريدز', url: '', enabled: false },
    { key: 'pinterest', label: 'بينتريست', url: 'https://pinterest.com/mousserie', enabled: true },
    { key: 'telegram', label: 'تيليجرام', url: '', enabled: false },
    { key: 'linkedin', label: 'لينكدإن', url: '', enabled: false },
    { key: 'twitch', label: 'تويتش', url: '', enabled: false },
    { key: 'behance', label: 'بيهانس', url: '', enabled: false },

    { key: 'hungerstation', label: 'هنقرستيشن', url: '', enabled: false },
    { key: 'jahez', label: 'جاهز', url: '', enabled: false },
    { key: 'keeta', label: 'كيتا', url: '', enabled: false },
    { key: 'ninja', label: 'نينجا', url: '', enabled: false },
    { key: 'thechefz', label: 'ذا شفز', url: '', enabled: false },
    { key: 'marsool', label: 'مرسول', url: '', enabled: false },
    { key: 'talabat', label: 'طلبات', url: '', enabled: false },

    { key: 'whatsapp', label: 'واتساب', url: 'https://wa.me/966551234567', enabled: true },
    { key: 'phone', label: 'اتصال هاتفي', url: '', enabled: false },
    { key: 'email', label: 'البريد الإلكتروني', url: '', enabled: false },
    { key: 'maps', label: 'خرائط جوجل', url: '', enabled: false },
    { key: 'reviews', label: 'تقييمات جوجل', url: '', enabled: false },
    { key: 'apple_maps', label: 'خرائط آبل', url: '', enabled: false },
    { key: 'linktree', label: 'لينك تري', url: '', enabled: false },
    { key: 'giftcards', label: 'بطاقات الإهداء', url: '', enabled: false },
    { key: 'website', label: 'الموقع الإلكتروني', url: '', enabled: false },
  ],
  footer_about:
    'منذ أول ملعقة، ونحن نؤمن أن الحلوى ليست تفصيلًا صغيرًا في اليوم، بل لحظة تستحقّ أن تُصنع بإتقان.',
  footer_note: 'صُنعت بشغف في الرياض',

  // Optional uploaded brand logo. The built-in monogram in the header is never
  // replaced; this logo is presented on its own in a distinctive spot.
  logo_url: '',
  logo_enabled: true,
  logo_size: 'lg', // md | lg | xl
  logo_placement: 'seal', // seal | hero | footer | all
  logo_caption_ar: 'حلويات فاخرة · الرياض',
  logo_caption_en: 'Fine Patisserie · Riyadh',
  logo_show_caption: true,

  // English counterparts for merchant-authored copy. Blank falls back to Arabic.
  brand_tagline_en: 'Maison de Mousse · Riyadh',
  hero_eyebrow_en: 'Maison de Mousse · Riyadh',
  hero_title_line1_en: 'A sweet moment…',
  hero_title_line2_en: 'deserves to be tasted',
  hero_subtitle_en:
    'Silken mousse, Belgian chocolate and fruit picked at its peak. At MOUSSERIE every dessert is made by hand each morning and reaches you as chilled as the moment it left our kitchen.',
  hero_cta_primary_en: 'Shop desserts',
  hero_cta_secondary_en: 'Gift boxes',
  hero_badge_text_en: 'Made today',
  categories_title_en: 'Our Sweet Worlds',
  categories_subtitle_en:
    'From silken mousse to gift boxes, every world has its own flavour and story.',
  featured_title_en: 'The Chef’s Selection',
  featured_subtitle_en:
    'Four pieces we are proud of: a precise balance of texture, sweetness and aroma.',
  best_title_en: 'Best Sellers',
  best_subtitle_en: 'What our guests come back for, time after time.',
  new_title_en: 'New Arrivals',
  new_subtitle_en: 'Fresh experiments from our flavour lab, in limited batches.',
  seasonal_title_en: 'The Seasonal Collection',
  seasonal_highlight_en: 'Fig, caramel and Arabic coffee',
  seasonal_text_en:
    'As the heat softens and evenings grow longer, warmer flavours enter our kitchen: ripe figs, slow-cooked caramel and cardamom Arabic coffee. A limited collection made in small batches each week.',
  seasonal_cta_en: 'Discover the seasonal collection',
  promo_badge_en: 'Gifting offer',
  promo_title_en: '15% off gift boxes',
  promo_text_en:
    'Because a sweet gift needs no words. Use the code at checkout on any gift box or celebration cake.',
  promo_cta_en: 'Shop gifting',
  story_title_en: 'It started with a single spoon',
  testimonials_title_en: 'What They Say',
  testimonials_subtitle_en: 'Notes that reached us after the first spoonful.',
  delivery_title_en: 'It arrives as it left the kitchen',
  delivery_text_en:
    'Mousse is a delicate thing: it hates heat and loves calm. So we built a delivery system that protects its silken texture right up to the moment you open the box.',
  final_cta_title1_en: 'A sweet moment…',
  final_cta_title2_en: 'deserves to be tasted',
  final_cta_text_en:
    'Order before 4 PM today and enjoy same-day chilled delivery across Riyadh.',
  footer_about_en:
    'Since the very first spoon we have believed that dessert is not a small detail in the day — it is a moment worth crafting properly.',
  footer_note_en: 'Made with passion in Riyadh',
  social_title_en: 'Follow us',

  // Localisation. Base currency is always SAR; rates are per 1 SAR.
  languages: ['ar', 'en', 'en-GB'],
  default_language: 'ar',
  currencies: ['SAR', 'AED', 'KWD', 'USD', 'EUR'],
  default_currency: 'SAR',
  currency_rates: {
    SAR: 1,
    AED: 0.98,
    KWD: 0.082,
    QAR: 0.97,
    BHD: 0.1,
    OMR: 0.103,
    EGP: 13.2,
    USD: 0.267,
    EUR: 0.246,
    GBP: 0.21,
  },

  delivery_fee: 25,
  free_delivery_from: 300,
  gift_wrap_fee: 25,
  low_stock_threshold: 3,
  gift_message_max: 160,
  cities: ['الرياض', 'جدة', 'الدمام', 'الخبر', 'مكة المكرمة', 'المدينة المنورة', 'أبها', 'القصيم'],
  delivery_slots: ['١٢ ظهرًا – ٣ عصرًا', '٣ عصرًا – ٦ مساءً', '٦ مساءً – ٩ مساءً', '٩ مساءً – ١١ مساءً'],
  payment_methods: [
    { value: 'cash', label: 'الدفع عند الاستلام', hint: 'نقدًا أو بالبطاقة عند التسليم', enabled: true },
    { value: 'transfer', label: 'تحويل بنكي', hint: 'نرسل تفاصيل التحويل عبر واتساب', enabled: true },
    { value: 'mada', label: 'مدى / Apple Pay', hint: 'رابط دفع آمن بعد التأكيد', enabled: true },
  ],
};

// Reconciles saved social links with the current platform roster:
//  - very old settings (flat instagram/tiktok fields) are migrated,
//  - saved links keep their order, URLs and on/off state,
//  - platforms added in a later release are appended as available-but-off,
// so newly shipped platforms always show up in the admin.
function withSocialFallback(merged, stored) {
  const saved = Array.isArray(stored?.social_links) ? stored.social_links : null;

  if (!saved) {
    const legacy = {
      instagram: stored?.instagram ?? DEFAULTS.instagram,
      tiktok: stored?.tiktok ?? DEFAULTS.tiktok,
    };
    merged.social_links = DEFAULTS.social_links.map((item) => {
      if (!(item.key in legacy)) return { ...item };
      const url = (legacy[item.key] || '').trim();
      return { ...item, url, enabled: !!url };
    });
    return merged;
  }

  const seen = new Set(saved.map((l) => l && l.key));
  merged.social_links = [
    ...saved,
    ...DEFAULTS.social_links
      .filter((d) => !seen.has(d.key))
      .map((d) => ({ ...d, url: '', enabled: false })),
  ];
  return merged;
}

export async function readSettings() {
  const { data, error } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  const stored = data?.data || null;
  const merged = { ...DEFAULTS, ...(stored || {}) };
  return withSocialFallback(merged, stored);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const merged = await readSettings();
      return res.status(200).json(merged);
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const patch = req.body || {};
      if (patch.action === 'reset') {
        await supabase.from('settings').upsert({ id: 1, data: {}, updated_at: new Date().toISOString() });
        return res.status(200).json({ ...DEFAULTS });
      }

      const { data: current } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
      const nextData = { ...(current?.data || {}), ...patch };
      delete nextData.action;

      if ('logo_size' in nextData) {
        const sizes = ['md', 'lg', 'xl'];
        if (!sizes.includes(nextData.logo_size)) nextData.logo_size = 'lg';
      }

      if ('logo_placement' in nextData) {
        const places = ['seal', 'hero', 'footer', 'all'];
        if (!places.includes(nextData.logo_placement)) nextData.logo_placement = 'seal';
      }

      if ('logo_url' in nextData) {
        nextData.logo_url = String(nextData.logo_url || '').trim();
      }

      if (Array.isArray(nextData.languages)) {
        const allowedLangs = ['ar', 'en', 'en-GB'];
        nextData.languages = nextData.languages.filter((l) => allowedLangs.includes(l));
        if (!nextData.languages.length) nextData.languages = ['ar'];
        if (!nextData.languages.includes(nextData.default_language)) {
          nextData.default_language = nextData.languages[0];
        }
      }

      if (Array.isArray(nextData.currencies)) {
        const allowed = Object.keys(DEFAULTS.currency_rates);
        nextData.currencies = nextData.currencies.filter((c) => allowed.includes(c));
        if (!nextData.currencies.length) nextData.currencies = ['SAR'];
        // The base currency can never be switched off.
        if (!nextData.currencies.includes('SAR')) nextData.currencies.unshift('SAR');
      }

      if (nextData.currency_rates && typeof nextData.currency_rates === 'object') {
        const clean = { ...DEFAULTS.currency_rates };
        for (const [code, rate] of Object.entries(nextData.currency_rates)) {
          const n = Number(rate);
          if (code in clean && Number.isFinite(n) && n > 0) clean[code] = n;
        }
        clean.SAR = 1;
        nextData.currency_rates = clean;
      }

      if (Array.isArray(nextData.social_links)) {
        nextData.social_links = nextData.social_links
          .filter((l) => l && typeof l.key === 'string' && l.key.trim())
          .map((l) => ({
            key: l.key.trim(),
            label: String(l.label || l.key).trim(),
            url: String(l.url || '').trim(),
            enabled: !!l.enabled,
          }));

        // Keep the legacy fields in sync for anything still reading them.
        const find = (k) => nextData.social_links.find((l) => l.key === k);
        nextData.instagram = find('instagram')?.url || '';
        nextData.tiktok = find('tiktok')?.url || '';
      }

      const { error } = await supabase
        .from('settings')
        .upsert({ id: 1, data: nextData, updated_at: new Date().toISOString() });
      if (error) throw error;

      return res.status(200).json(withSocialFallback({ ...DEFAULTS, ...nextData }, nextData));
    }

    return res.status(405).json({ error: 'الطريقة غير مسموحة' });
  } catch (err) {
    console.error('settings api error:', err);
    return res.status(500).json({ error: err.message });
  }
}
