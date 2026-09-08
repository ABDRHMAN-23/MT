import {
  AtSign,
  Bike,
  ChefHat,
  Dribbble,
  Facebook,
  Ghost,
  Gift,
  Globe,
  Instagram,
  Link2,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Navigation,
  Phone,
  Pin,
  Send,
  ShoppingBag,
  Soup,
  Star,
  Store,
  Truck,
  Twitch,
  Twitter,
  UtensilsCrossed,
  Youtube,
  type LucideIcon,
} from 'lucide-react';

export type SocialCategory = 'social' | 'delivery' | 'contact';

export type SocialLink = {
  key: string;
  label: string;
  url: string;
  enabled: boolean;
};

type Platform = {
  key: string;
  label: string;
  icon: LucideIcon;
  placeholder: string;
  category: SocialCategory;
};

export const CATEGORY_META: Record<SocialCategory, { label: string; hint: string }> = {
  social: {
    label: 'منصات التواصل الاجتماعي',
    hint: 'حسابات موسيريا التي يتابعها عملاؤك.',
  },
  delivery: {
    label: 'تطبيقات الطلب والتوصيل',
    hint: 'روابط متجرك على تطبيقات التوصيل، تظهر في صف مستقل باسم «اطلب عبر».',
  },
  contact: {
    label: 'روابط مباشرة',
    hint: 'الاتصال والبريد والموقع على الخرائط وأي رابط آخر.',
  },
};

export const SOCIAL_PLATFORMS: Platform[] = [
  /* ------------------------------------------------------------- social */
  { key: 'instagram', label: 'إنستغرام', icon: Instagram, category: 'social', placeholder: 'https://instagram.com/mousserie' },
  { key: 'tiktok', label: 'تيك توك', icon: Music2, category: 'social', placeholder: 'https://tiktok.com/@mousserie' },
  { key: 'snapchat', label: 'سناب شات', icon: Ghost, category: 'social', placeholder: 'https://snapchat.com/add/mousserie' },
  { key: 'x', label: 'إكس (تويتر)', icon: Twitter, category: 'social', placeholder: 'https://x.com/mousserie' },
  { key: 'facebook', label: 'فيسبوك', icon: Facebook, category: 'social', placeholder: 'https://facebook.com/mousserie' },
  { key: 'youtube', label: 'يوتيوب', icon: Youtube, category: 'social', placeholder: 'https://youtube.com/@mousserie' },
  { key: 'threads', label: 'ثريدز', icon: AtSign, category: 'social', placeholder: 'https://threads.net/@mousserie' },
  { key: 'pinterest', label: 'بينتريست', icon: Pin, category: 'social', placeholder: 'https://pinterest.com/mousserie' },
  { key: 'telegram', label: 'تيليجرام', icon: Send, category: 'social', placeholder: 'https://t.me/mousserie' },
  { key: 'linkedin', label: 'لينكدإن', icon: Linkedin, category: 'social', placeholder: 'https://linkedin.com/company/mousserie' },
  { key: 'twitch', label: 'تويتش', icon: Twitch, category: 'social', placeholder: 'https://twitch.tv/mousserie' },
  { key: 'behance', label: 'بيهانس', icon: Dribbble, category: 'social', placeholder: 'https://behance.net/mousserie' },

  /* ----------------------------------------------------------- delivery */
  { key: 'hungerstation', label: 'هنقرستيشن', icon: Bike, category: 'delivery', placeholder: 'https://hungerstation.com/…' },
  { key: 'jahez', label: 'جاهز', icon: ShoppingBag, category: 'delivery', placeholder: 'https://jahez.net/…' },
  { key: 'keeta', label: 'كيتا', icon: Truck, category: 'delivery', placeholder: 'https://keeta.com/…' },
  { key: 'ninja', label: 'نينجا', icon: Soup, category: 'delivery', placeholder: 'https://ninja.sa/…' },
  { key: 'thechefz', label: 'ذا شفز', icon: ChefHat, category: 'delivery', placeholder: 'https://thechefz.co/…' },
  { key: 'marsool', label: 'مرسول', icon: Store, category: 'delivery', placeholder: 'https://marsool.com.sa/…' },
  { key: 'talabat', label: 'طلبات', icon: UtensilsCrossed, category: 'delivery', placeholder: 'https://talabat.com/…' },

  /* ------------------------------------------------------------ contact */
  { key: 'whatsapp', label: 'واتساب', icon: MessageCircle, category: 'contact', placeholder: 'https://wa.me/966551234567' },
  { key: 'phone', label: 'اتصال هاتفي', icon: Phone, category: 'contact', placeholder: 'tel:+966551234567' },
  { key: 'email', label: 'البريد الإلكتروني', icon: Mail, category: 'contact', placeholder: 'mailto:hello@mousserie.com' },
  { key: 'maps', label: 'خرائط جوجل', icon: MapPin, category: 'contact', placeholder: 'https://maps.app.goo.gl/…' },
  { key: 'reviews', label: 'تقييمات جوجل', icon: Star, category: 'contact', placeholder: 'https://g.page/r/…/review' },
  { key: 'apple_maps', label: 'خرائط آبل', icon: Navigation, category: 'contact', placeholder: 'https://maps.apple.com/?q=…' },
  { key: 'linktree', label: 'لينك تري', icon: Link2, category: 'contact', placeholder: 'https://linktr.ee/mousserie' },
  { key: 'giftcards', label: 'بطاقات الإهداء', icon: Gift, category: 'contact', placeholder: 'https://mousserie.com/gift' },
  { key: 'website', label: 'الموقع الإلكتروني', icon: Globe, category: 'contact', placeholder: 'https://mousserie.com' },
];

const BY_KEY = new Map(SOCIAL_PLATFORMS.map((p) => [p.key, p]));

export function platformFor(key: string): Platform {
  return (
    BY_KEY.get(key) || {
      key,
      label: key,
      icon: Globe,
      placeholder: 'https://',
      category: 'contact',
    }
  );
}

/**
 * Normalises user input into an openable URL. `tel:` and `mailto:` are kept
 * as-is; a bare phone/email is upgraded to the right scheme.
 */
export function normalizeUrl(raw: string): string {
  const value = (raw || '').trim();
  if (!value) return '';
  if (/^(https?:|tel:|mailto:)/i.test(value)) return value;
  if (value.startsWith('//')) return `https:${value}`;
  if (/^[+\d][\d\s()-]{6,}$/.test(value)) return `tel:${value.replace(/[\s()-]/g, '')}`;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return `mailto:${value}`;
  return `https://${value.replace(/^\/+/, '')}`;
}

/** Only links that are both switched on and actually have a destination. */
export function visibleSocials(links: SocialLink[] | undefined): SocialLink[] {
  return (links || [])
    .filter((l) => l && l.enabled && (l.url || '').trim())
    .map((l) => ({ ...l, url: normalizeUrl(l.url) }));
}

/** Visible links belonging to one category, preserving the admin's order. */
export function socialsByCategory(
  links: SocialLink[] | undefined,
  category: SocialCategory
): SocialLink[] {
  return visibleSocials(links).filter((l) => platformFor(l.key).category === category);
}

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = SOCIAL_PLATFORMS.map((p) => ({
  key: p.key,
  label: p.label,
  url: '',
  enabled: false,
}));
