import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { MenuProvider } from './context/MenuContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Header } from './components/Header/Header';
import { HeroSection } from './components/Hero/HeroSection';
import { MenuGrid } from './components/Menu/MenuGrid';
import { FixedLunchMenuSection } from './components/Features/FixedLunchMenuSection';
import { EventsSection } from './components/Events/EventsSection';
import { TestimonialsSection } from './components/Testimonials/TestimonialsSection';
import { InstagramGrid } from './components/Gallery/InstagramGrid';
import { FindUsSection } from './components/Location/FindUsSection';
import { Footer } from './components/Footer/Footer';
import { CartDrawer } from './components/Cart/CartDrawer';
import { CheckoutModal } from './components/Cart/CheckoutModal';
import { OrderTrackingModal } from './components/Cart/OrderTrackingModal';
import { ReservationSection } from './components/Reservation/ReservationSection';
import { ClientReservationModal } from './components/Reservation/ClientReservationModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AdminToggleFloating } from './components/Admin/AdminToggleFloating';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { ScrollToTop } from './components/common/ScrollToTop';

function MainAppContent() {
  const { isAdminView } = useAdmin();

  if (isAdminView) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col selection:bg-[#d2401e] selection:text-white pb-16 md:pb-0">
      {/* 1. STICKY DIVIDED HEADER */}
      <Header />

      {/* MAIN HOMEPAGE SECTIONS */}
      <main className="flex-1">
        {/* 2. HERO SLIDER SECTION */}
        <HeroSection />

        {/* 3. THE BEST PIZZA & CUCINA MENU */}
        <MenuGrid />

        {/* 4. ONLINE RESERVATION SECTION */}
        <ReservationSection />

        {/* 5. MENÙ FISSO | PRANZO LAVORO (14€) */}
        <FixedLunchMenuSection />

        {/* 6. EVENTI & SERATE A TEMA */}
        <EventsSection />

        {/* 7. TESTIMONIALS QUOTE CAROUSEL */}
        <TestimonialsSection />

        {/* 8. INSTAGRAM GALLERY GRID */}
        <InstagramGrid />

        {/* 9. COME TROVARCI / MAPPA & CONTATTI */}
        <FindUsSection />
      </main>

      {/* 9. MULTI-COLUMN FOOTER & BOTTOM BAR */}
      <Footer />

      {/* 10. MOBILE STICKY BOTTOM ACTION BAR (SMARTPHONES/TABLETS) */}
      <MobileBottomNav />

      {/* 11. MINIMAL FLOATING BACK TO TOP BUTTON */}
      <ScrollToTop />

      {/* SHOPPING CART, CHECKOUT, BOOKING & LIVE ORDER TRACKING MODALS */}
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <ClientReservationModal />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MenuProvider>
        <CartProvider>
          <AdminProvider>
            <MainAppContent />
          </AdminProvider>
        </CartProvider>
      </MenuProvider>
    </LanguageProvider>
  );
}
