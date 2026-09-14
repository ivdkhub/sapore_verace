import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PizzaCard } from './PizzaCard';
import ParallaxCard from '../common/ParallaxCard';
import { X, Check, ShoppingCart, Flame, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useMenu } from '../../context/MenuContext';
import { getLocalizedItem, getLocalizedCategories } from '../../data/menuTranslations';

export const MenuGrid = () => {
  const { t, lang } = useLanguage();
  const { addToCart } = useCart();
  const { menuItems, categories } = useMenu();
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'classiche' | 'gourmet' | 'ripieni' | 'cucina' | 'bevande'
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [cartAlert, setCartAlert] = useState(null);

  const catalogRef = useRef(null);
  const pillsContainerRef = useRef(null);

  // Localize all menu items dynamically according to active language
  const localizedMenuItems = useMemo(() => {
    return menuItems.map((item) => getLocalizedItem(item, lang));
  }, [menuItems, lang]);

  // Localize categories list
  const localizedCategories = useMemo(() => {
    return getLocalizedCategories(categories, lang);
  }, [categories, lang]);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return localizedMenuItems;
    return localizedMenuItems.filter((item) => item.category === selectedCategory);
  }, [localizedMenuItems, selectedCategory]);

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      const headerOffset = 90;
      const elementPosition = catalogRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleSelectPizzeria = () => {
    setSelectedCategory('classiche');
    scrollToCatalog();
  };

  const handleSelectCucina = () => {
    setSelectedCategory('cucina');
    scrollToCatalog();
  };

  const isInitialMount = useRef(true);

  // Keep active category pill in view inside mobile horizontal scroll container without scrolling the whole page
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (pillsContainerRef.current) {
      const activeBtn = pillsContainerRef.current.querySelector(`[data-category="${selectedCategory}"]`);
      if (activeBtn) {
        const container = pillsContainerRef.current;
        const scrollTarget = activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2;
        container.scrollTo({
          left: Math.max(0, scrollTarget),
          behavior: 'smooth',
        });
      }
    }
  }, [selectedCategory]);

  const handleAddToCart = (item) => {
    if (item.available === false) return;
    addToCart(item, 1);
    setCartAlert(item.name);
    setTimeout(() => {
      setCartAlert(null);
    }, 3000);
  };

  return (
    <section id="menu" className="relative py-16 sm:py-24 bg-[#121212] overflow-hidden scroll-mt-20">
      {/* Toast Alert (Mobile-friendly centered bottom toast) */}
      {cartAlert && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-50 flex items-center gap-3 bg-[#d2401e] text-white px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 font-oswald tracking-wider uppercase text-xs sm:text-sm border border-white/20 whitespace-nowrap">
          <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          <span>{cartAlert} {t.menu?.addedToast || 'AGGIUNTO AL TUO ORDINE!'}</span>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative z-10">
        {/* Main Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="text-xs font-oswald tracking-[0.25em] text-[#ffa323] uppercase font-semibold">
              {t.menu?.tag || 'SCEGLI IL TUO GUSTO'}
            </span>
          </div>

          <h2 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-tight mb-4">
            {t.menu?.title || 'IL NOSTRO MENÙ'}
          </h2>

          <p className="text-white/70 text-sm sm:text-base font-sans leading-relaxed">
            {t.menu?.desc || 'Scegli tra le autentiche pizze cotte a legna o i sapori tradizionali della nostra piccola cucina napoletana.'}
          </p>
        </div>

        {/* ========================================================= */}
        {/* SPLIT 2-COLUMN HUB (PIZZERIA vs PICCOLA CUCINA & SFIZI)    */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {/* LEFT SPLIT CARD: PIZZERIA */}
          <ParallaxCard
            delay={0.1}
            duration={1.2}
            maxTiltDeg={7}
            maxTranslatePx={6}
            onClick={handleSelectPizzeria}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer p-8 sm:p-10 border-2 ${
              ['classiche', 'gourmet', 'ripieni'].includes(selectedCategory)
                ? 'bg-gradient-to-br from-[#1f1612] via-[#1a1412] to-[#121212] border-[#d2401e] shadow-[0_0_40px_rgba(210,64,30,0.35)]'
                : 'bg-[#181818] border-white/10 hover:border-white/30 hover:bg-[#1f1f1f] opacity-85 hover:opacity-100'
            }`}
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#d2401e]/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-oswald font-bold tracking-widest uppercase ${
                    ['classiche', 'gourmet', 'ripieni'].includes(selectedCategory)
                      ? 'bg-[#d2401e] text-white'
                      : 'bg-white/10 text-white/70'
                  }`}>
                    <Flame className="w-3.5 h-3.5" />
                    {t.menu?.split?.pizzaBadge || 'FORNO A LEGNA'}
                  </span>

                  {['classiche', 'gourmet', 'ripieni'].includes(selectedCategory) && (
                    <span className="flex items-center gap-1 text-xs font-oswald text-[#ffa323] tracking-widest uppercase font-bold">
                      <Check className="w-4 h-4 text-[#ffa323]" /> {t.menu?.selected || 'SELEZIONATO'}
                    </span>
                  )}
                </div>

                <h3 className="font-oswald text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white uppercase tracking-tight mb-2 group-hover:text-[#ffa323] transition-colors">
                  {t.menu?.split?.pizzaTitle || 'PIZZERIA NAPOLETANA'}
                </h3>
                <p className="text-xs sm:text-sm font-oswald tracking-widest text-[#ffa323] uppercase font-semibold mb-3">
                  {t.menu?.split?.pizzaSubtitle || 'Classiche, Gourmet & Ripieni'}
                </p>
                <p className="text-white/70 text-xs sm:text-sm font-sans leading-relaxed mb-6 max-w-sm">
                  {t.menu?.split?.pizzaDesc || "Pizze stese a mano con pomodoro San Marzano dell'Agro Sarnese Nocerino e fior di latte del Matese."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/menu_pizza_1.png"
                    alt="Pizza Preview"
                    className="w-14 h-14 object-contain filter drop-shadow-md group-hover:rotate-12 transition-transform duration-500"
                  />
                  <span className="text-xs font-oswald text-white/60 tracking-wider font-bold">
                    {t.menu?.split?.pizzaCount || '37 SPECIALITÀ'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPizzeria();
                  }}
                  className={`px-5 py-2.5 rounded-lg font-oswald text-xs font-bold tracking-[0.15em] uppercase flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                    ['classiche', 'gourmet', 'ripieni'].includes(selectedCategory)
                      ? 'bg-[#d2401e] text-white shadow-lg shadow-[#d2401e]/30'
                      : 'bg-white/10 text-white group-hover:bg-white/20'
                  }`}
                >
                  <span>{t.menu?.split?.pizzaBtn || 'ESPLORA LE PIZZE'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ParallaxCard>

          {/* RIGHT SPLIT CARD: PICCOLA CUCINA & SFIZI */}
          <ParallaxCard
            delay={0.25}
            duration={1.2}
            maxTiltDeg={7}
            maxTranslatePx={6}
            onClick={handleSelectCucina}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer p-8 sm:p-10 border-2 ${
              ['cucina', 'bevande'].includes(selectedCategory)
                ? 'bg-gradient-to-br from-[#1a1714] via-[#171412] to-[#121212] border-[#ffa323] shadow-[0_0_40px_rgba(255,163,35,0.35)]'
                : 'bg-[#181818] border-white/10 hover:border-white/30 hover:bg-[#1f1f1f] opacity-85 hover:opacity-100'
            }`}
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#ffa323]/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-oswald font-bold tracking-widest uppercase ${
                    ['cucina', 'bevande'].includes(selectedCategory)
                      ? 'bg-[#ffa323] text-black'
                      : 'bg-white/10 text-white/70'
                  }`}>
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    {t.menu?.split?.cucinaBadge || 'TRADIZIONE VERACE'}
                  </span>

                  {['cucina', 'bevande'].includes(selectedCategory) && (
                    <span className="flex items-center gap-1 text-xs font-oswald text-[#ffa323] tracking-widest uppercase font-bold">
                      <Check className="w-4 h-4 text-[#ffa323]" /> {t.menu?.selected || 'SELEZIONATO'}
                    </span>
                  )}
                </div>

                <h3 className="font-oswald text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white uppercase tracking-tight mb-2 group-hover:text-[#ffa323] transition-colors">
                  {t.menu?.split?.cucinaTitle || 'DALLA CUCINA & SFIZI'}
                </h3>
                <p className="text-xs sm:text-sm font-oswald tracking-widest text-[#ffa323] uppercase font-semibold mb-3">
                  {t.menu?.split?.cucinaSubtitle || 'Fritti, Taglieri & Bevande'}
                </p>
                <p className="text-white/70 text-xs sm:text-sm font-sans leading-relaxed mb-6 max-w-sm">
                  {t.menu?.split?.cucinaDesc || 'Fritture croccanti, taglieri con crudo di Parma e burrata, oltre a bibite e birra fresca.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/cucina_frittura.jpg"
                    alt="Cucina Preview"
                    className="w-14 h-14 object-cover rounded-full border border-white/20 shadow-md group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="text-xs font-oswald text-white/60 tracking-wider font-bold">
                    {t.menu?.split?.cucinaCount || '11 PRODOTTI'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCucina();
                  }}
                  className={`px-5 py-2.5 rounded-lg font-oswald text-xs font-bold tracking-[0.15em] uppercase flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                    ['cucina', 'bevande'].includes(selectedCategory)
                      ? 'bg-[#ffa323] text-black shadow-lg shadow-[#ffa323]/30'
                      : 'bg-white/10 text-white group-hover:bg-white/20'
                  }`}
                >
                  <span>{t.menu?.split?.cucinaBtn || 'ESPLORA LA CUCINA'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ParallaxCard>
        </div>

        {/* ========================================================= */}
        {/* INTERACTIVE CATEGORY FILTER PILLS (HORIZONTAL SCROLL ON MOBILE) */}
        {/* ========================================================= */}
        <div ref={catalogRef} id="menu-catalog" className="relative mb-10 scroll-mt-28">
          <div ref={pillsContainerRef} className="flex items-center sm:justify-center overflow-x-auto no-scrollbar scroll-smooth gap-2 sm:gap-3 py-2 px-1 -mx-4 sm:mx-0 px-4 sm:px-0">
            {localizedCategories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  data-category={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-oswald text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#d2401e] text-white shadow-lg shadow-[#d2401e]/30 scale-105'
                      : 'bg-[#1e1e1e] text-white/70 hover:text-white hover:bg-[#282828] border border-white/5 active:scale-95'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-sans font-bold ${
                      isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-Header with active category name and item count */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d2401e] animate-ping" />
            <h4 className="font-oswald text-lg sm:text-2xl font-bold text-white uppercase tracking-wider">
              {localizedCategories.find((c) => c.id === selectedCategory)?.name || t.nav?.menu || 'Menù'}
            </h4>
          </div>

          <div className="text-[11px] sm:text-xs font-oswald text-white/50 tracking-widest uppercase">
            {filteredItems.length} {t.menu?.availableProducts || 'PRODOTTI'}
          </div>
        </div>

        {/* 3xN Dynamic Floating Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 animate-in fade-in duration-300">
          {filteredItems.map((item) => (
            <PizzaCard
              key={item.id}
              pizza={item}
              onQuickView={(p) => setSelectedPizza(p)}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      {/* QUICK VIEW MODAL (MOBILE RESPONSIVE FULLSCREEN/BOTTOM-SHEET READY) */}
      {selectedPizza && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#1e1e1e] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPizza(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-center pt-2 sm:pt-0">
              <div className="flex items-center justify-center">
                {selectedPizza.image?.endsWith('.jpg') || selectedPizza.image?.endsWith('.jpeg') ? (
                  <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl shadow-black/80">
                    <img
                      src={selectedPizza.image}
                      alt={selectedPizza.name}
                      className="w-full h-full object-cover animate-float"
                    />
                  </div>
                ) : (
                  <img
                    src={selectedPizza.image || '/images/menu_pizza_1.png'}
                    alt={selectedPizza.name}
                    className="w-44 h-44 sm:w-56 sm:h-56 object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)] animate-float"
                  />
                )}
              </div>

              <div>
                {selectedPizza.available === false ? (
                  <span className="inline-block px-3 py-1 bg-rose-700 text-white text-[11px] font-oswald font-black tracking-widest uppercase mb-2 rounded-sm shadow">
                    {t.menu?.sold || 'ESAURITO'}
                  </span>
                ) : selectedPizza.badge ? (
                  <span className="inline-block px-3 py-1 bg-[#ffa323] text-black text-[11px] font-oswald font-bold tracking-widest uppercase mb-2 rounded-sm">
                    {selectedPizza.badge}
                  </span>
                ) : null}

                <h3 className={`font-oswald text-2xl sm:text-3xl font-extrabold uppercase tracking-wider mb-2 ${
                  selectedPizza.available === false ? 'text-white/80 line-through decoration-rose-500' : 'text-white'
                }`}>
                  {selectedPizza.name}
                </h3>
                <div className="font-oswald text-xl sm:text-2xl font-bold text-[#d2401e] mb-3">
                  {selectedPizza.price}
                </div>
                <p className="text-white/70 text-xs sm:text-sm font-sans leading-relaxed mb-6">
                  {selectedPizza.ingredients}
                </p>

                {selectedPizza.available === false ? (
                  <div className="w-full py-3 bg-rose-950/70 border border-rose-500/40 text-rose-200 font-oswald text-xs tracking-[0.2em] font-bold uppercase rounded-xl flex items-center justify-center gap-2 select-none">
                    <span>{t.menu?.sold || 'PRODOTTO ESAURITO'}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      handleAddToCart(selectedPizza);
                      setSelectedPizza(null);
                    }}
                    className="w-full py-3.5 sm:py-4 bg-[#d2401e] hover:bg-[#b83314] active:scale-[0.98] text-white font-oswald text-xs sm:text-sm tracking-[0.2em] font-bold uppercase transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-[#d2401e]/30 rounded-xl"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{t.menu?.addToCart || 'AGGIUNGI AL CARRELLO'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
