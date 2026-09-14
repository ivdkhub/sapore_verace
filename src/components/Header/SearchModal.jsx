import React, { useState, useMemo } from 'react';
import { Search, X, ShoppingCart } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedItem } from '../../data/menuTranslations';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { menuItems } = useMenu();
  const { addToCart } = useCart();
  const { lang, t } = useLanguage();

  const localizedMenuItems = useMemo(() => {
    return menuItems.map((item) => getLocalizedItem(item, lang));
  }, [menuItems, lang]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return localizedMenuItems
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.ingredients && item.ingredients.toLowerCase().includes(q)) ||
          (item.badge && item.badge.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [query, localizedMenuItems]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200 p-4">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 cursor-pointer"
        aria-label="Chiudi ricerca"
      >
        <X className="w-8 h-8" />
      </button>

      <div className="w-full max-w-2xl px-4 sm:px-6">
        <div className="relative border-b-2 border-[#d2401e] pb-2 mb-6">
          <input
            type="text"
            placeholder={
              lang === 'en'
                ? 'SEARCH A DISH OR DRINK...'
                : lang === 'de'
                ? 'GERICHT ODER GETRÄNK SUCHEN...'
                : lang === 'sq'
                ? 'KËRKO NJË USHQIM OSE PIJE...'
                : 'CERCA UN PIATTO O BEVANDA...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-white font-oswald text-2xl md:text-3xl placeholder-white/40 focus:outline-none tracking-wider pr-12 uppercase"
          />
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[#d2401e] hover:text-white transition-colors cursor-pointer"
            aria-label="Submit search"
          >
            <Search className="w-7 h-7" />
          </button>
        </div>

        {/* Live Search Results */}
        {results.length > 0 ? (
          <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
            {results.map((item) => (
              <div
                key={item.id}
                className="bg-[#181818] border border-white/10 hover:border-white/30 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/50 border border-white/10 shrink-0 flex items-center justify-center">
                    <img
                      src={item.image || '/images/menu_pizza_1.png'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-oswald text-base text-white font-bold uppercase truncate group-hover:text-[#ffa323] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-white/50 font-sans truncate max-w-xs">
                      {item.ingredients}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-oswald text-base font-bold text-[#d2401e]">
                    {item.price}
                  </span>
                  <button
                    onClick={() => {
                      addToCart(item, 1);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-[#d2401e] hover:bg-[#b83314] text-white transition-all shadow-md cursor-pointer"
                    title={t.menu?.addToCart || 'Aggiungi al carrello'}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : query.trim() ? (
          <p className="text-center text-sm font-oswald text-white/50 uppercase tracking-wider py-4">
            {lang === 'en'
              ? `No results found for "${query}"`
              : lang === 'de'
              ? `Keine Ergebnisse gefunden für "${query}"`
              : lang === 'sq'
              ? `Nuk u gjet asnjë rezultat për "${query}"`
              : `Nessun risultato trovato per "${query}"`}
          </p>
        ) : (
          <p className="mt-4 text-xs font-oswald tracking-widest text-white/50 text-center uppercase">
            {lang === 'en'
              ? 'Type to search pizzas, kitchen dishes and drinks • Press ESC to exit'
              : lang === 'de'
              ? 'Tippen, um Pizzen, Gerichte und Getränke zu suchen • ESC zum Beenden'
              : lang === 'sq'
              ? 'Shkruani për të kërkuar pica, ushqime dhe pije • Shtypni ESC për dalje'
              : 'Digita per cercare tra le pizze cotte a legna, cucina e bevande • Premi ESC per uscire'}
          </p>
        )}
      </div>
    </div>
  );
};
