import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ShopProvider } from './contexts/ShopContext';
import { ToastProvider } from './contexts/ToastContext';
import { ConfirmProvider } from './contexts/ConfirmContext';
import { LocaleProvider } from './contexts/LocaleContext';
import ScrollToTop from './components/ScrollToTop';
import StoreLayout from './components/StoreLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { Monogram } from './components/Logo';

// The landing page stays in the main bundle so the first paint has no waterfall.
import Home from './pages/Home';

// Everything else is split out: storefront visitors never download the admin,
// and each route arrives only when it is actually opened.
const Catalog = lazy(() => import('./pages/Catalog'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Confirmation = lazy(() => import('./pages/Confirmation'));
const Story = lazy(() => import('./pages/Story'));
const Track = lazy(() => import('./pages/Track'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminDiscounts = lazy(() => import('./pages/admin/AdminDiscounts'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminAccount = lazy(() => import('./pages/admin/AdminAccount'));

function RouteFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center bg-cream">
      <Monogram size={46} className="float-soft text-gold" />
    </div>
  );
}

/**
 * Warm the chunks a shopper is most likely to open next, but only once the
 * browser is idle — navigation then feels instant without delaying first paint.
 */
function usePrefetchRoutes() {
  useEffect(() => {
    const warm = () => {
      import('./pages/Catalog');
      import('./pages/ProductPage');
      import('./pages/CartPage');
    };
    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    }).requestIdleCallback;
    if (ric) {
      const id = ric(warm, { timeout: 2500 });
      return () => (window as unknown as { cancelIdleCallback?: (h: number) => void })
        .cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(warm, 1800);
    return () => window.clearTimeout(t);
  }, []);
}

export default function App() {
  usePrefetchRoutes();

  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <LocaleProvider>
          <ToastProvider>
            <ConfirmProvider>
              <ShopProvider>
                <ScrollToTop />
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    <Route element={<StoreLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Catalog />} />
                      <Route path="/dessert/:slug" element={<ProductPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/confirmation/:code" element={<Confirmation />} />
                      <Route path="/story" element={<Story />} />
                      <Route path="/track" element={<Track />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>

                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute>
                          <AdminLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Dashboard />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="customers" element={<AdminCustomers />} />
                      <Route path="discounts" element={<AdminDiscounts />} />
                      <Route path="reviews" element={<AdminReviews />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="account" element={<AdminAccount />} />
                    </Route>
                  </Routes>
                </Suspense>
              </ShopProvider>
            </ConfirmProvider>
          </ToastProvider>
          </LocaleProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
