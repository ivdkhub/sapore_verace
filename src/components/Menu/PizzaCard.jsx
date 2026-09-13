import React from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const PizzaCard = ({ pizza, onQuickView, onAddToCart }) => {
  const { t } = useLanguage();
  const isAvailable = pizza.available !== false;

  return (
    <div className={`group relative flex flex-col items-center text-center py-6 px-2 ${
      !isAvailable ? 'opacity-85' : ''
    }`}>
      {/* BADGE (Sale, Sold, Chef, etc.) OR UNAVAILABLE BADGE */}
      {!isAvailable ? (
        <div className="absolute top-0 right-4 sm:right-8 z-20 px-3 py-1 text-[11px] font-oswald font-black tracking-widest uppercase rounded-sm shadow-md bg-rose-700 text-white animate-in zoom-in">
          {t.menu?.sold || 'ESAURITO'}
        </div>
      ) : pizza.badge ? (
        <div
          className={`absolute top-0 right-4 sm:right-8 z-20 px-3 py-1 text-[11px] font-oswald font-bold tracking-widest uppercase rounded-sm shadow-md ${
            pizza.badge === 'SOLD' || pizza.badge === 'ESAURITO' || pizza.badge === 'AUSVERKAUFT' || pizza.badge === 'E SHITUR'
              ? 'bg-[#333333] text-white/80'
              : 'bg-[#ffa323] text-black'
          }`}
        >
          {pizza.badge}
        </div>
      ) : null}

      {/* PIZZA / DISH IMAGE CONTAINER */}
      <div className="relative w-52 sm:w-60 md:w-68 lg:w-72 aspect-square mb-6 flex items-center justify-center">
        {/* Subtle glow behind item */}
        {isAvailable && (
          <div className="absolute inset-2 rounded-full bg-[#d2401e]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}

        {pizza.image && (pizza.image.endsWith('.jpg') || pizza.image.endsWith('.jpeg') || pizza.image.endsWith('.webp') || pizza.image.startsWith('data:')) ? (
          <div className={`w-48 sm:w-56 md:w-60 aspect-square rounded-full overflow-hidden border-2 border-white/10 shadow-2xl shadow-black/80 bg-black/40 ${
            !isAvailable ? 'grayscale opacity-60' : ''
          }`}>
            <img
              src={pizza.image}
              alt={pizza.name}
              className="w-full h-full object-cover transform transition-transform duration-500 ease-out group-hover:scale-110 select-none"
            />
          </div>
        ) : (
          <img
            src={pizza.image || '/images/menu_pizza_1.png'}
            alt={pizza.name}
            className={`w-full h-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.7)] transform transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 select-none ${
              !isAvailable ? 'grayscale opacity-60' : ''
            }`}
          />
        )}

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 z-10">
          {isAvailable ? (
            <button
              onClick={() => onAddToCart(pizza)}
              className="w-11 h-11 rounded-full bg-[#d2401e] hover:bg-[#b83314] text-white flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform duration-200"
              title={t.menu?.addToCart || 'Aggiungi al carrello'}
              aria-label={t.menu?.addToCart || 'Aggiungi al carrello'}
            >
              <ShoppingBag className="w-5 h-5" />
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
            onClick={() => onQuickView(pizza)}
            className="w-11 h-11 rounded-full bg-white hover:bg-white/90 text-black flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform duration-200"
            title={t.menu?.quickView || 'Visualizza'}
            aria-label={t.menu?.quickView || 'Visualizza'}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PIZZA TITLE */}
      <h3 className={`font-oswald text-xl sm:text-2xl font-bold uppercase tracking-wider mb-2 transition-colors ${
        !isAvailable ? 'text-white/70 line-through decoration-rose-500' : 'text-white group-hover:text-[#d2401e]'
      }`}>
        {pizza.name}
      </h3>

      {/* INGREDIENTS / DESCRIPTION */}
      <p className="text-xs sm:text-sm text-white/60 font-sans line-clamp-2 max-w-xs mb-4">
        {pizza.ingredients}
      </p>

      {/* PRICE */}
      <div className="flex items-center gap-2 font-oswald text-lg sm:text-xl font-bold">
        {pizza.oldPrice && (
          <span className="text-white/40 line-through text-sm font-normal">
            {pizza.oldPrice}
          </span>
        )}
        <span className={isAvailable ? 'text-[#d2401e]' : 'text-white/50'}>
          {pizza.price}
        </span>
      </div>
    </div>
  );
};
