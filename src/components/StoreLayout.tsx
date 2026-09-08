import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import { Monogram } from './Logo';

/**
 * The Suspense boundary lives here (not around the whole router) so that a
 * lazy page swap never unmounts the header, footer or cart drawer.
 */
export default function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="grid min-h-[60vh] place-items-center">
              <Monogram size={44} className="float-soft text-gold" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
