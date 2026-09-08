import { DEFAULT_SOCIAL_LINKS, type SocialLink } from './social';

export type StatItem = { value: string; label: string };
export type CardItem = { title: string; text: string };
export type PaymentMethod = { value: string; label: string; hint: string; enabled: boolean };

export type Settings = {
  brand_name_ar: string;
  brand_name_en: string;
  brand_tagline: string;

  ticker: string[];

  hero_eyebrow: string;
  hero_title_line1: string;
  hero_title_line2: string;
  hero_subtitle: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  hero_image: string;
  hero_badge_text: string;
  hero_stats: StatItem[];

  trust_items: string[];

  categories_title: string;
  categories_subtitle: string;
  featured_title: string;
  featured_subtitle: string;
  best_title: string;
  best_subtitle: string;
  new_title: string;
  new_subtitle: string;

  seasonal_enabled: boolean;
  seasonal_eyebrow: string;
  seasonal_title: string;
  seasonal_highlight: string;
  seasonal_text: string;
  seasonal_image: string;
  seasonal_cta: string;

  promo_enabled: boolean;
  promo_badge: string;
  promo_title: string;
  promo_text: string;
  promo_code: string;
  promo_cta: string;
  promo_image: string;

  story_eyebrow: string;
  story_title: string;
  story_paragraphs: string[];
  story_image: string;
  story_detail_image: string;
  story_detail_caption: string;
  story_stats: StatItem[];

  testimonials_title: string;
  testimonials_subtitle: string;

  delivery_title: string;
  delivery_text: string;
  delivery_image: string;
  delivery_cards: CardItem[];

  final_cta_title1: string;
  final_cta_title2: string;
  final_cta_text: string;
  final_cta_image: string;

  phone: string;
  whatsapp: string;
  email: string;
  address_ar: string;
  hours_ar: string;
  instagram: string;
  tiktok: string;
  maps_url: string;
  social_title: string;
  social_show_footer: boolean;
  social_links: SocialLink[];
  footer_about: string;
  footer_note: string;

  logo_url: string;
  logo_enabled: boolean;
  logo_size: 'md' | 'lg' | 'xl';
  logo_placement: 'seal' | 'hero' | 'footer' | 'all';
  logo_caption_ar: string;
  logo_caption_en: string;
  logo_show_caption: boolean;

  brand_tagline_en: string;
  hero_eyebrow_en: string;
  hero_title_line1_en: string;
  hero_title_line2_en: string;
  hero_subtitle_en: string;
  hero_cta_primary_en: string;
  hero_cta_secondary_en: string;
  hero_badge_text_en: string;
  categories_title_en: string;
  categories_subtitle_en: string;
  featured_title_en: string;
  featured_subtitle_en: string;
  best_title_en: string;
  best_subtitle_en: string;
  new_title_en: string;
  new_subtitle_en: string;
  seasonal_title_en: string;
  seasonal_highlight_en: string;
  seasonal_text_en: string;
  seasonal_cta_en: string;
  promo_badge_en: string;
  promo_title_en: string;
  promo_text_en: string;
  promo_cta_en: string;
  story_title_en: string;
  testimonials_title_en: string;
  testimonials_subtitle_en: string;
  delivery_title_en: string;
  delivery_text_en: string;
  final_cta_title1_en: string;
  final_cta_title2_en: string;
  final_cta_text_en: string;
  footer_about_en: string;
  footer_note_en: string;
  social_title_en: string;

  languages: string[];
  default_language: string;
  currencies: string[];
  default_currency: string;
  currency_rates: Record<string, number>;

  delivery_fee: number;
  free_delivery_from: number;
  gift_wrap_fee: number;
  low_stock_threshold: number;
  gift_message_max: number;
  cities: string[];
  delivery_slots: string[];
  payment_methods: PaymentMethod[];
};

export const DEFAULT_SETTINGS: Settings = {
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
    'كل قطعة تُصنع في اليوم نفسه الذي تصلك فيه. لا مخزون، لا مواد حافظة، ولا حلٌّ وسط.',
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
    {
      title: 'توصيل مبرّد في نفس اليوم',
      text: 'داخل الرياض للطلبات قبل الساعة ٤ عصرًا، بسيارات مجهّزة بالتبريد.',
    },
    {
      title: 'سلسلة تبريد كاملة',
      text: 'من الثلاجة إلى يدك دون انقطاع، مع عبوة تبريد داخل كل صندوق.',
    },
    {
      title: 'تغليف هدايا يدوي',
      text: 'صندوق فاخر، شريط ساتان، وبطاقة إهداء بخط أنيق مع رسالتك.',
    },
    {
      title: 'حجز مسبق للمناسبات',
      text: 'كيكات المناسبات تُحجز قبل ٤٨ ساعة لضمان الإتقان.',
    },
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
  social_links: DEFAULT_SOCIAL_LINKS,
  footer_about:
    'منذ أول ملعقة، ونحن نؤمن أن الحلوى ليست تفصيلًا صغيرًا في اليوم، بل لحظة تستحقّ أن تُصنع بإتقان.',
  footer_note: 'صُنعت بشغف في الرياض',

  logo_url: '',
  logo_enabled: true,
  logo_size: 'lg',
  logo_placement: 'seal',
  logo_caption_ar: 'حلويات فاخرة · الرياض',
  logo_caption_en: 'Fine Patisserie · Riyadh',
  logo_show_caption: true,

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
  delivery_slots: [
    '١٢ ظهرًا – ٣ عصرًا',
    '٣ عصرًا – ٦ مساءً',
    '٦ مساءً – ٩ مساءً',
    '٩ مساءً – ١١ مساءً',
  ],
  payment_methods: [
    { value: 'cash', label: 'الدفع عند الاستلام', hint: 'نقدًا أو بالبطاقة عند التسليم', enabled: true },
    { value: 'transfer', label: 'تحويل بنكي', hint: 'نرسل تفاصيل التحويل عبر واتساب', enabled: true },
    { value: 'mada', label: 'مدى / Apple Pay', hint: 'رابط دفع آمن بعد التأكيد', enabled: true },
  ],
};

export const BUILTIN_IMAGES = [
  '/img/brand-logo.svg',
  '/img/p-chocolate.webp',
  '/img/p-mango.webp',
  '/img/p-pistachio.webp',
  '/img/p-raspberry.webp',
  '/img/p-caramel.webp',
  '/img/p-strawberry.webp',
  '/img/p-blueberry.webp',
  '/img/p-cheesecake.webp',
  '/img/p-coffee.webp',
  '/img/p-celebration.webp',
  '/img/p-giftbox.webp',
  '/img/p-coconut.webp',
  '/img/p-opera.webp',
  '/img/p-date.webp',
  '/img/p-rose.webp',
  '/img/p-hazelnut.webp',
  '/img/hero.webp',
  '/img/hero-2.webp',
  '/img/cat-mousse.webp',
  '/img/cat-chocolate.webp',
  '/img/cat-fruit.webp',
  '/img/cat-pistachio.webp',
  '/img/cat-occasion.webp',
  '/img/cat-gift.webp',
  '/img/story.webp',
  '/img/delivery.webp',
  '/img/detail-section.webp',
  '/img/seasonal.webp',
  '/img/wide-banner.webp',
  '/img/texture.webp',
];
