import { Suspense } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  BadgePercent,
  Cake,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings2,
  Star,
  Store,
  UserCog,
  Users,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { Monogram } from '../../components/Logo';

const LINKS = [
  { to: '/admin', label: 'اللوحة', icon: <LayoutDashboard size={17} />, end: true },
  { to: '/admin/orders', label: 'الطلبات', icon: <Receipt size={17} /> },
  { to: '/admin/products', label: 'الحلويات', icon: <Cake size={17} /> },
  { to: '/admin/customers', label: 'العملاء', icon: <Users size={17} /> },
  { to: '/admin/discounts', label: 'الخصومات', icon: <BadgePercent size={17} /> },
  { to: '/admin/reviews', label: 'الآراء', icon: <Star size={17} /> },
  { to: '/admin/settings', label: 'الإعدادات', icon: <Settings2 size={17} /> },
  { to: '/admin/account', label: 'حسابي', icon: <UserCog size={17} /> },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-cream pb-20 lg:pb-0">
      <div className="lg:flex">
        <aside className="hidden w-64 shrink-0 border-e border-line bg-ivory lg:sticky lg:top-0 lg:block lg:h-screen">
          <div className="flex h-full flex-col p-5">
            <Link to="/admin" className="flex items-center gap-3 px-2 py-3">
              <Monogram size={34} className="text-gold" />
              <div>
                <p className="wordmark text-[12.5px] text-cocoa">{settings.brand_name_en}</p>
                <p className="mt-1 text-[10.5px] tracking-widest text-mocha">مركز التحكم</p>
              </div>
            </Link>

            <nav className="mt-8 space-y-1.5">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-[13.5px] transition ${
                      isActive ? 'bg-cocoa text-cream' : 'text-cocoa-2 hover:bg-cream-2'
                    }`
                  }
                >
                  {l.icon}
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto space-y-2 border-t border-line pt-5">
              <Link
                to="/"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-[13px] text-cocoa-2 transition hover:bg-cream-2"
              >
                <Store size={16} />
                عرض المتجر
              </Link>
              <div className="rounded-2xl bg-cream px-4 py-3">
                <Link
                  to="/admin/account"
                  className="block truncate text-[11.5px] text-mocha transition hover:text-gold"
                  dir="ltr"
                >
                  {user?.email}
                </Link>
                <button
                  onClick={signOut}
                  className="mt-2 inline-flex items-center gap-2 text-[12px] text-raspberry transition hover:text-berry"
                >
                  <LogOut size={14} />
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-cream/92 px-4 py-3.5 backdrop-blur-xl lg:hidden">
            <Link to="/admin" className="flex items-center gap-2.5">
              <Monogram size={28} className="text-gold" />
              <span className="wordmark text-[11.5px] text-cocoa">{settings.brand_name_en}</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                to="/admin/account"
                className="grid h-9 w-9 place-items-center rounded-full bg-ivory text-cocoa-2"
                aria-label="حسابي"
              >
                <UserCog size={16} />
              </Link>
              <Link
                to="/"
                className="grid h-9 w-9 place-items-center rounded-full bg-ivory text-cocoa-2"
                aria-label="عرض المتجر"
              >
                <Store size={16} />
              </Link>
              <button
                onClick={signOut}
                className="grid h-9 w-9 place-items-center rounded-full bg-ivory text-raspberry"
                aria-label="تسجيل الخروج"
              >
                <LogOut size={16} />
              </button>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            {/* Keeps the sidebar/nav mounted while a lazy admin page loads. */}
            <Suspense
              fallback={
                <div className="grid min-h-[50vh] place-items-center">
                  <Monogram size={40} className="float-soft text-gold" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/96 backdrop-blur-xl lg:hidden">
        <div className="no-scrollbar flex overflow-x-auto">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex min-w-[4.5rem] flex-1 shrink-0 flex-col items-center gap-1 py-2.5 text-[9.5px] transition ${
                  isActive ? 'text-gold' : 'text-mocha'
                }`
              }
            >
              {l.icon}
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
