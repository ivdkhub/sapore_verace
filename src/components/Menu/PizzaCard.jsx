import React from 'react';
import { ShoppingCart, Eye, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const PizzaCard = ({ pizza, onQuickView, onAddToCart }) => {
  const { t } = useLanguage();
  const isAvailable = pizza.available !== false;

  return (
    <div className={`group relative flex flex-col items-center text-center py-5 sm:py-6 px-2 sm:px-4 rounded-2xl bg-white/[0.02] sm:bg-transparent border border-white/5 sm:border-transparent transition-all ${
      !isAvailable ? 'opacity-85' : 'hover:bg-white/[0.03]'
    }`}>
      {/* BADGE (Sale, Sold, Chef, etc.) OR UNAVAILABLE BADGE */}
      {!isAvailable ? (
        <div className="absolute top-2 right-3 sm:top-0 sm:right-8 z-20 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-oswald font-black tracking-widest uppercase rounded-sm shadow-md bg-rose-700 text-white animate-in zoom-in">
          {t.menu?.sold || 'ESAURITO'}
        </div>
      ) : pizza.badge ? (
        <div
          className={`absolute top-2 right-3 sm:top-0 sm:right-8 z-20 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-oswald font-bold tracking-widest uppercase rounded-sm shadow-md ${
            pizza.badge === 'SOLD' || pizza.badge === 'ESAURITO' || pizza.badge === 'AUSVERKAUFT' || pizza.badge === 'E SHITUR'
              ? 'bg-[#333333] text-white/80'
              : 'bg-[#ffa323] text-black'
          }`}
        >
          {pizza.badge}
        </div>
      ) : null}

      {/* PIZZA / DISH IMAGE CONTAINER (Clickable on Mobile & Desktop) */}
      <div
        onClick={() => onQuickView(pizza)}
        className="relative w-44 sm:w-60 md:w-68 lg:w-72 aspect-square mb-4 sm:mb-6 flex items-center justify-center cursor-pointer group/img"
        title="Tocca per vedere i dettagli"
      >
        {/* Subtle glow behind item */}
        {isAvailable && (
          <div className="absolute inset-2 rounded-full bg-[#d2401e]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}

        {pizza.image && (pizza.image.endsWith('.jpg') || pizza.image.endsWith('.jpeg') || pizza.image.endsWith('.webp') || pizza.image.startsWith('data:')) ? (
          <div className={`w-40 sm:w-56 md:w-60 aspect-square rounded-full overflow-hidden border-2 border-white/10 shadow-2xl shadow-black/80 bg-black/40 ${
            !isAvailable ? 'grayscale opacity-60' : ''
          }`}>
            <img
              loading="lazy"
              decoding="async"
              src={pizza.image}
              alt={pizza.name}
              className="w-full h-full object-cover transform transition-transform duration-500 ease-out group-hover:scale-110 select-none"
            />
          </div>
        ) : (
          <img
            loading="lazy"
            decoding="async"
            src={pizza.image || '/images/menu_pizza_1.png'}
            alt={pizza.name}
            className={`w-full h-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.7)] transform transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 select-none ${
              !isAvailable ? 'grayscale opacity-60' : ''
            }`}
          />
        )}

        {/* Desktop Hover Quick Action Buttons */}
        <div className="hidden md:flex absolute inset-0 items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 z-10">
          {isAvailable ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(pizza);
              }}
              className="w-11 h-11 rounded-full bg-[#d2401e] hover:bg-[#b83314] text-white flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200"
              title={t.menu?.addToCart || 'Aggiungi al carrello'}
              aria-label={t.menu?.addToCart || 'Aggiungi al carrello'}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          ) : (
            <div
              className="px-3.5 py-1.5 rounded-full bg-rose-900/90 text-white font-oswald text-[11px] tracking-wider uppercase border border-rose-500/50 shadow-xl cursor-not-allowed select-none"
              title="Prodotto attualmente non disponibile"
            >
              {t.menu?.sold || 'ESAURITO'}
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(pizza);
            }}
            className="w-11 h-11 rounded-full bg-white hover:bg-white/90 text-black flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200"
            title={t.menu?.quickView || 'Visualizza'}
            aria-label={t.menu?.quickView || 'Visualizza'}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PIZZA TITLE */}
      <h3
        onClick={() => onQuickView(pizza)}
        className={`font-oswald text-lg sm:text-2xl font-bold uppercase tracking-wider mb-1.5 transition-colors cursor-pointer ${
          !isAvailable ? 'text-white/70 line-through decoration-rose-500' : 'text-white group-hover:text-[#d2401e]'
        }`}
      >
        {pizza.name}
      </h3>

      {/* INGREDIENTS / DESCRIPTION */}
      <p className="text-xs sm:text-sm text-white/60 font-sans line-clamp-2 max-w-xs mb-3 sm:mb-4 px-1">
        {pizza.ingredients}
      </p>

      {/* PRICE & DIRECT MOBILE ACTION */}
      <div className="flex items-center gap-2 font-oswald text-base sm:text-xl font-bold mb-3 sm:mb-0">
        {pizza.oldPrice && (
          <span className="text-white/40 line-through text-xs sm:text-sm font-normal">
            {pizza.oldPrice}
          </span>
        )}
        <span className={isAvailable ? 'text-[#d2401e]' : 'text-white/50'}>
          {pizza.price}
        </span>
      </div>

      {/* MOBILE DIRECT ACTION BUTTON (VISIBLE ON MOBILE/TABLET) */}
      <div className="flex md:hidden items-center justify-center gap-2 w-full max-w-[220px] mt-1">
        {isAvailable ? (
          <button
            type="button"
            onClick={() => onAddToCart(pizza)}
            className="flex-1 py-2 px-3.5 bg-gradient-to-r from-[#d2401e] to-[#ff5722] active:from-[#b83314] text-white font-oswald text-xs tracking-wider uppercase font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>{t.menu?.addToCartShort || 'Aggiungi'}</span>
          </button>
        ) : (
          <span className="flex-1 py-2 px-3.5 bg-rose-950/60 border border-rose-500/40 text-rose-300 font-oswald text-xs tracking-wider uppercase font-semibold rounded-xl text-center">
            {t.menu?.sold || 'Esaurito'}
          </span>
        )}

        <button
          type="button"
          onClick={() => onQuickView(pizza)}
          className="w-8 h-8 rounded-xl bg-white/10 active:bg-white/20 text-white flex items-center justify-center active:scale-95 transition-transform cursor-pointer shrink-0"
          title="Dettagli"
          aria-label="Dettagli"
        >
          <Eye className="w-4 h-4 text-white/80" />
        </button>
      </div>
    </div>
  );
};
