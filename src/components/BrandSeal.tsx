import { motion } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';
import { useLocale } from '../contexts/LocaleContext';

/** Distinctive display sizes for the merchant-uploaded logo. */
const SEAL_SIZE = {
  md: 'h-20 sm:h-24 lg:h-28',
  lg: 'h-24 sm:h-32 lg:h-40',
  xl: 'h-32 sm:h-44 lg:h-56',
} as const;

const HERO_SIZE = {
  md: 'h-12 w-12 sm:h-14 sm:w-14',
  lg: 'h-16 w-16 sm:h-20 sm:w-20',
  xl: 'h-20 w-20 sm:h-24 sm:w-24',
} as const;

const FOOTER_SIZE = {
  md: 'h-14 sm:h-16',
  lg: 'h-20 sm:h-24',
  xl: 'h-24 sm:h-32',
} as const;

function useLogo() {
  const { settings } = useSettings();
  const { pick } = useLocale();
  const url = (settings.logo_url || '').trim();
  const size = (settings.logo_size || 'lg') as keyof typeof SEAL_SIZE;
  const placement = settings.logo_placement || 'seal';
  return {
    url,
    size,
    placement,
    enabled: settings.logo_enabled !== false && !!url,
    caption: settings.logo_show_caption
      ? pick(settings.logo_caption_ar, settings.logo_caption_en)
      : '',
    alt: pick(settings.brand_name_ar, settings.brand_name_en),
  };
}

function shows(placement: string, spot: 'seal' | 'hero' | 'footer') {
  return placement === 'all' || placement === spot;
}

/**
 * The signature placement: a standalone plaque directly beneath the hero, so
 * the uploaded logo gets its own stage instead of competing with the built-in
 * monogram that stays fixed in the header.
 */
export function BrandSealBand() {
  const { url, size, placement, enabled, caption, alt } = useLogo();
  if (!enabled || !shows(placement, 'seal')) return null;

  return (
    <section className="relative overflow-hidden border-y border-line bg-ivory">
      <div className="dust pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold-2 to-transparent" />

      <div className="relative mx-auto flex max-w-[1400px] flex-col items-center px-4 py-12 sm:px-6 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full flex-col items-center"
        >
          <div className="flex w-full items-center justify-center gap-5 sm:gap-8">
            <span className="h-px max-w-[7rem] flex-1 bg-gradient-to-l from-transparent to-gold-2/70" />

            <div className="relative shrink-0 px-2">
              <span className="pointer-events-none absolute -inset-x-6 -inset-y-4 rounded-[2.5rem] bg-gold/5 blur-2xl" />
              <img
                src={url}
                alt={alt}
                loading="lazy"
                decoding="async"
                className={`relative mx-auto w-auto max-w-[min(78vw,30rem)] object-contain ${SEAL_SIZE[size]}`}
              />
            </div>

            <span className="h-px max-w-[7rem] flex-1 bg-gradient-to-r from-transparent to-gold-2/70" />
          </div>

          {caption && (
            <p className="eyebrow mt-6 text-center text-[10px] text-gold sm:text-[11px]">{caption}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/** A gold-rimmed medallion resting on the hero photograph. */
export function BrandSealMedallion() {
  const { url, size, placement, enabled, alt } = useLogo();
  if (!enabled || !shows(placement, 'hero')) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="absolute -bottom-5 left-1/2 z-10 -translate-x-1/2"
    >
      <div className="grid place-items-center rounded-full border border-gold/35 bg-ivory/95 p-3 shadow-[0_24px_50px_-24px_rgba(42,26,18,0.6)] backdrop-blur sm:p-4">
        <img
          src={url}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`object-contain ${HERO_SIZE[size]}`}
        />
      </div>
    </motion.div>
  );
}

/** A restrained crest above the footer's closing line. */
export function BrandSealFooter() {
  const { url, size, placement, enabled, alt } = useLogo();
  if (!enabled || !shows(placement, 'footer')) return null;

  return (
    <div className="mt-12 flex flex-col items-center border-t border-cream/10 pt-10">
      <div className="flex w-full items-center justify-center gap-4">
        <span className="h-px max-w-[6rem] flex-1 bg-gradient-to-l from-transparent to-cream/20" />
        <img
          src={url}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`w-auto max-w-[min(70vw,22rem)] object-contain opacity-90 ${FOOTER_SIZE[size]}`}
        />
        <span className="h-px max-w-[6rem] flex-1 bg-gradient-to-r from-transparent to-cream/20" />
      </div>
    </div>
  );
}
