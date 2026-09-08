import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, Phone, Clock, Mail } from 'lucide-react';
import { Monogram } from './Logo';
import { whatsappSimple } from '../lib/whatsapp';
import { useSettings } from '../contexts/SettingsContext';
import { platformFor, socialsByCategory } from '../lib/social';
import { useLocale } from '../contexts/LocaleContext';
import { BrandSealFooter } from './BrandSeal';

const COLUMNS = [
  {
    title: 'footer.collection',
    links: [
      { label: 'nav.mousse', to: '/shop?category=mousse' },
      { label: 'footer.chocolate', to: '/shop?category=chocolate' },
      { label: 'footer.fruits', to: '/shop?category=fruits' },
      { label: 'footer.pistachio', to: '/shop?category=pistachio' },
    ],
  },
  {
    title: 'footer.occasions',
    links: [
      { label: 'footer.occasionCakes', to: '/shop?category=occasions' },
      { label: 'footer.giftBoxes', to: '/shop?category=gifts' },
      { label: 'footer.bestsellers', to: '/shop?category=bestsellers' },
      { label: 'footer.new', to: '/shop?category=new' },
    ],
  },
  {
    title: 'footer.house',
    links: [
      { label: 'nav.story', to: '/story' },
      { label: 'nav.track', to: '/track' },
      { label: 'footer.faq', to: '/#faq' },
      { label: 'footer.delivery', to: '/#delivery' },
      { label: 'footer.admin', to: '/admin' },
    ],
  },
];

export default function Footer() {
  const { settings } = useSettings();
  const { t, pick } = useLocale();
  const show = settings.social_show_footer;
  const socials = show ? socialsByCategory(settings.social_links, 'social') : [];
  const delivery = show ? socialsByCategory(settings.social_links, 'delivery') : [];
  const direct = show ? socialsByCategory(settings.social_links, 'contact') : [];

  return (
    <footer className="relative mt-24 overflow-hidden bg-cocoa text-cream">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <img src="/img/wide-banner.webp" alt="" className="h-full w-full object-cover" />
      </div>
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-gold/12 blur-[120px]" />

      <div className="relative mx-auto max-w-[1400px] px-4 pb-10 pt-16 sm:px-6 lg:px-10 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <Monogram size={44} className="text-gold-2" />
              <div>
                <p className="wordmark text-lg text-cream">{settings.brand_name_en}</p>
                <p className="mt-1 text-[12px] tracking-[0.25em] text-cream/50">
                  {settings.brand_name_ar}
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-loose text-cream/65">
              {pick(settings.footer_about, settings.footer_about_en)}
            </p>

            <a
              href={whatsappSimple(
                `${pick(settings.brand_name_ar, settings.brand_name_en)} · ${t('footer.whatsappMsg')}`,
                settings.whatsapp
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex h-11 items-center gap-2 rounded-full border border-cream/20 px-5 text-[13px] text-cream transition hover:border-gold-2 hover:text-gold-2"
            >
              <MessageCircle size={16} />
              {t('footer.whatsapp')}
            </a>

            {(socials.length > 0 || direct.length > 0) && (
              <div className="mt-8">
                <p className="mb-3.5 text-[12px] tracking-wide text-gold-2">
                  {pick(settings.social_title, settings.social_title_en)}
                </p>
                <ul className="flex flex-wrap gap-2.5">
                  {[...socials, ...direct].map((s) => {
                    const Icon = platformFor(s.key).icon;
                    return (
                      <li key={s.key}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          title={s.label}
                          aria-label={s.label}
                          className="group grid h-11 w-11 place-items-center rounded-full border border-cream/15 text-cream/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-2 hover:bg-gold-2/10 hover:text-gold-2"
                        >
                          <Icon size={17} />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {delivery.length > 0 && (
              <div className="mt-7">
                <p className="mb-3 text-[12px] tracking-wide text-gold-2">{t('footer.orderVia')}</p>
                <ul className="flex flex-wrap gap-2">
                  {delivery.map((s) => {
                    const Icon = platformFor(s.key).icon;
                    return (
                      <li key={s.key}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-10 items-center gap-2 rounded-full border border-cream/15 px-4 text-[12.5px] text-cream/70 transition-all duration-300 hover:border-gold-2 hover:bg-gold-2/10 hover:text-gold-2"
                        >
                          <Icon size={14} />
                          {s.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="mb-5 text-[13px] font-semibold tracking-wide text-gold-2">
                  {t(col.title)}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-[13.5px] text-cream/65 transition-colors hover:text-cream"
                      >
                        {t(l.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-5 border-t border-cream/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <MapPin size={17} className="mt-0.5 shrink-0 text-gold-2" />
            {settings.maps_url ? (
              <a
                href={settings.maps_url}
                target="_blank"
                rel="noreferrer"
                className="text-[13px] leading-relaxed text-cream/65 transition hover:text-gold-2"
              >
                {settings.address_ar}
              </a>
            ) : (
              <p className="text-[13px] leading-relaxed text-cream/65">{settings.address_ar}</p>
            )}
          </div>
          <div className="flex items-start gap-3">
            <Phone size={17} className="mt-0.5 shrink-0 text-gold-2" />
            <a
              href={`tel:${settings.phone.replace(/\s/g, '')}`}
              className="num text-[14px] text-cream/65 transition hover:text-gold-2"
              dir="ltr"
            >
              {settings.phone}
            </a>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={17} className="mt-0.5 shrink-0 text-gold-2" />
            <a
              href={`mailto:${settings.email}`}
              className="text-[13px] text-cream/65 transition hover:text-gold-2"
              dir="ltr"
            >
              {settings.email}
            </a>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={17} className="mt-0.5 shrink-0 text-gold-2" />
            <p className="text-[13px] leading-relaxed text-cream/65">{settings.hours_ar}</p>
          </div>
        </div>

        <BrandSealFooter />

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 sm:flex-row">
          <p className="text-[11.5px] text-cream/40">
© 2026 {settings.brand_name_en} · {t('footer.rights')}
          </p>
          <p className="text-[11.5px] text-cream/40">
            {pick(settings.footer_note, settings.footer_note_en)}
          </p>
        </div>
      </div>
    </footer>
  );
}
