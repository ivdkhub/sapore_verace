import React from 'react';
import { Utensils, Calendar, ShoppingCart, Phone } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAdmin } from '../../context/AdminContext';
import { useLanguage } from '../../context/LanguageContext';
import { BUSINESS } from '../../config/business';

export const MobileBottomNav = () => {
  const { totalItemsCount, totalPrice, setIsCartOpen } = useCart();
  const { setIsBookingModalOpen } = useAdmin();
  const { t } = useLanguage();

  const handleScrollToMenu = (e) => {
    e.preventDefault();
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      aria-label="Navigazione rapida mobile"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#161616]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.85)] px-2 py-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 sm:grid-cols-4 items-center gap-1">
        
        {/* 1. VAI AL MENÙ */}
        <button
          onClick={handleScrollToMenu}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-white/70 hover:text-white active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center mb-0.5 text-[#ffa323]">
            <Utensils className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-oswald uppercase tracking-wider font-semibold text-white/80">
            {t.nav?.menu || 'Menù'}
          </span>
        </button>

        {/* 2. PRENOTA TAVOLO */}
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-white/70 hover:text-white active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#d2401e] to-[#ffa323] flex items-center justify-center mb-0.5 text-white shadow-md shadow-[#d2401e]/30">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-oswald uppercase tracking-wider font-semibold text-white">
            {t.bookNow || 'Prenota'}
          </span>
        </button>

        {/* 3. CARRELLO / ORDINA (con contatore dinamico) */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-1 rounded-xl text-white/70 hover:text-white active:scale-95 transition-all cursor-pointer"
        >
          <div className="relative w-9 h-9 rounded-full bg-white/5 flex items-center justify-center mb-0.5 text-[#d2401e]">
            <ShoppingCart className="w-4 h-4" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#d2401e] text-white text-[10px] font-oswald font-black rounded-full flex items-center justify-center border-2 border-[#161616] animate-in zoom-in">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-oswald uppercase tracking-wider font-semibold text-white/90">
            {totalItemsCount > 0 ? `€${totalPrice.toFixed(2)}` : (t.cart?.title || 'Carrello')}
          </span>
        </button>

        {/* 4. CONTATTI / CHIAMA SUBITO */}
        <a
          href={BUSINESS.phoneHref}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-white/70 hover:text-white active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center mb-0.5 text-emerald-400">
            <Phone className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-oswald uppercase tracking-wider font-semibold text-white/80">
            {t.call || 'Chiama'}
          </span>
        </a>

      </div>
    </nav>
  );
};
