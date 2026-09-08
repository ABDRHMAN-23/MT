import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import Logo from './Logo';
import { useShop } from '../contexts/ShopContext';
import { useSettings } from '../contexts/SettingsContext';
import { platformFor, visibleSocials } from '../lib/social';
import { useLocale } from '../contexts/LocaleContext';
import LocaleSwitcher from './LocaleSwitcher';

const NAV = [
  { to: '/', key: 'nav.home' },
  { to: '/shop', key: 'nav.shop' },
  { to: '/shop?category=mousse', key: 'nav.mousse' },
  { to: '/shop?category=gifts', key: 'nav.gifts' },
  { to: '/shop?category=occasions', key: 'nav.occasions' },
  { to: '/story', key: 'nav.story' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState('');
  const { count, setCartOpen, favorites } = useShop();
  const { settings } = useSettings();
  const { t } = useLocale();
  const TICKER = settings.ticker?.length ? settings.ticker : ['حلويات فاخرة تُحضَّر يوميًا'];
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, searchOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
    setSearchOpen(false);
  };

  return (
    <>
      <div className="relative z-50 overflow-hidden bg-cocoa text-cream">
        <div className="marquee-track flex w-max items-center gap-10 py-2.5">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap text-[11.5px] text-cream/80">
              {t}
              <span className="text-gold-2">◆</span>
            </span>
          ))}
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-line/70 bg-cream/92 backdrop-blur-xl shadow-[0_10px_40px_-30px_rgba(42,26,18,0.7)]'
            : 'bg-cream/60 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-[84px] lg:px-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full text-cocoa transition hover:bg-cocoa/5 lg:hidden"
              aria-label={t('nav.menu')}
            >
              <Menu size={20} />
            </button>
            <Logo />
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname + location.search === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`relative rounded-full px-4 py-2 text-[13.5px] transition-colors duration-300 ${
                    active ? 'text-cocoa' : 'text-mocha hover:text-cocoa'
                  }`}
                >
                  {t(item.key)}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-4 -bottom-0.5 h-px bg-gold"
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <LocaleSwitcher />
            <button
              onClick={() => setSearchOpen(true)}
              aria-label={t('search.aria')}
              className="grid h-10 w-10 place-items-center rounded-full text-cocoa-2 transition hover:bg-cocoa/5"
            >
              <Search size={18} />
            </button>
            <Link
              to="/shop?fav=1"
              aria-label="مفضلتي"
              className="relative grid h-10 w-10 place-items-center rounded-full text-cocoa-2 transition hover:bg-cocoa/5"
            >
              <Heart size={18} />
              {favorites.length > 0 && (
                <span className="num absolute -top-0.5 left-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-berry px-1 text-[9px] text-ivory">
                  {favorites.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`صندوق الحلويات (${count})`}
              className="relative grid h-10 w-10 place-items-center rounded-full text-cocoa-2 transition hover:bg-cocoa/5"
            >
              <ShoppingBag size={18} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    className="num absolute -top-0.5 left-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] text-ivory"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------ mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] lg:hidden"
          >
            <div className="absolute inset-0 bg-cocoa/45 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 34 }}
              className="dust absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-cream"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-5">
                <Logo />
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="إغلاق"
                  className="grid h-10 w-10 place-items-center rounded-full text-cocoa transition hover:bg-cocoa/5"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-5 py-6">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i + 0.1 }}
                  >
                    <Link
                      to={item.to}
                      className="flex items-center justify-between border-b border-line/60 py-4 text-[17px] text-cocoa"
                    >
                      {t(item.key)}
                      <span className="text-gold">‹</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="border-t border-line px-5 py-5">
                <Link
                  to="/shop"
                  className="flex h-12 w-full items-center justify-center rounded-full bg-cocoa text-sm text-cream"
                >
                  {t('nav.shopCta')}
                </Link>
                <div className="mt-4 flex justify-center">
                  <LocaleSwitcher />
                </div>
                {visibleSocials(settings.social_links).length > 0 && (
                  <ul className="mt-5 flex flex-wrap justify-center gap-2">
                    {visibleSocials(settings.social_links).map((s) => {
                      const Icon = platformFor(s.key).icon;
                      return (
                        <li key={s.key}>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            title={s.label}
                            aria-label={s.label}
                            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-ivory text-mocha transition hover:border-gold hover:text-gold"
                          >
                            <Icon size={16} />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <p className="mt-4 text-center text-[11px] leading-relaxed text-mocha">
                  {settings.brand_name_ar} · حلويات فاخرة تُصنع بأيدي طهاتنا يوميًا
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------ search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-start justify-center px-4 pt-24 sm:pt-32"
          >
            <div className="absolute inset-0 bg-cocoa/55 backdrop-blur-md" onClick={() => setSearchOpen(false)} />
            <motion.form
              onSubmit={submitSearch}
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="relative w-full max-w-xl rounded-4xl border border-line bg-ivory p-2 shadow-[0_40px_100px_-40px_rgba(42,26,18,0.7)]"
            >
              <div className="flex items-center gap-3 px-4">
                <Search size={20} className="shrink-0 text-gold" />
                <input
                  autoFocus
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="h-14 flex-1 bg-transparent text-[15px] text-cocoa placeholder:text-mocha-2 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label={t('search.close')}
                  className="grid h-9 w-9 place-items-center rounded-full text-mocha transition hover:bg-cream"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-line/70 px-4 py-3.5">
                <span className="text-[11px] text-mocha-2">{t('search.suggestions')}</span>
                {['search.s1', 'search.s2', 'search.s3', 'search.s4', 'search.s5', 'search.s6'].map(
                  (k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => navigate(`/shop?q=${encodeURIComponent(t(k))}`)}
                      className="rounded-full border border-line px-3 py-1 text-[11.5px] text-cocoa-2 transition hover:border-gold hover:text-gold"
                    >
                      {t(k)}
                    </button>
                  )
                )}
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
