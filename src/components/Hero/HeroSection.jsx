import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Flame, ShoppingCart, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useMenu } from '../../context/MenuContext';
import { useCart } from '../../context/CartContext';
import { AnimatedLogoSvg } from '../common/AnimatedLogoSvg';

export const HeroSection = () => {
  const { t } = useLanguage();
  const { weeklyProducts, isMenuLoaded } = useMenu();
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [addedToast, setAddedToast] = useState(null);

  // Normalize weekly products list (ensure at least 1 fallback)
  const slides = (weeklyProducts && weeklyProducts.length > 0) ? weeklyProducts.slice(0, 3) : [
    {
      id: 'weekly_default_1',
      badge: 'PRODOTTO DELLA SETTIMANA',
      subtitle: 'PIZZERIA NAPOLETANA & PICCOLA CUCINA',
      titlePrefix: "L'ARTE DELLA",
      titleHighlight: 'VERA PIZZA',
      name: "L'Arte della Vera Pizza",
      desc: 'Impasto ad alta idratazione con lievitazione naturale di 48 ore, pomodoro San Marzano DOP, mozzarella di bufala campana e cottura rapida a 450°C.',
      price: '11,50 €',
      oldPrice: '13,50 €',
      numericPrice: 11.5,
      primaryBtn: 'ORDINA ORA',
      secondaryBtn: 'PRENOTA UN TAVOLO',
      image: '/images/hero_section_1.png',
      floatingImage: '/images/hero_section_2.png',
    }
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Keep index within bounds if weeklyProducts array changes
  useEffect(() => {
    if (currentSlide >= totalSlides) {
      setCurrentSlide(0);
    }
  }, [totalSlides, currentSlide]);

  // Auto-play timer (paused when user hovers over the hero)
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [totalSlides, isPaused, currentSlide]);

  const slide = slides[currentSlide] || slides[0];
  const prevSlideIndex = (currentSlide - 1 + totalSlides) % totalSlides;
  const previousProduct = slides[prevSlideIndex] || slides[0];

  const handleOrderWeeklyItem = () => {
    addToCart({
      id: slide.id,
      name: slide.name || `${slide.titlePrefix} ${slide.titleHighlight}`.trim(),
      price: slide.price,
      numericPrice: slide.numericPrice,
      image: slide.image,
      ingredients: slide.desc,
    }, 1);

    setAddedToast(slide.name || 'Prodotto della Settimana');
    setTimeout(() => {
      setAddedToast(null);
    }, 3200);
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-[#0d0d0d] pt-24 sm:pt-32 lg:pt-48 pb-16 lg:pb-24 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Toast Alert for Direct Order from Hero (Mobile friendly) */}
      {addedToast && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-50 flex items-center gap-3 bg-[#d2401e] text-white px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 font-oswald tracking-wider uppercase text-xs sm:text-sm border border-white/20 whitespace-nowrap">
          <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          <span>{addedToast} {t.reservation?.addedToCart || 'Aggiunto al carrello!'}</span>
        </div>
      )}

      {/* Dynamic Warm Ambient Glow Background */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] bg-[#d2401e]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/4 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-[#ffa323]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

      {/* Subtle vignette border gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/80 via-transparent to-[#0d0d0d] pointer-events-none" />

      {/* Main Content Container (compare quando arrivano i prodotti veri dal server) */}
      <div
        className={`max-w-[1440px] w-full mx-auto px-5 sm:px-12 relative z-10 transition-opacity duration-500 ${
          isMenuLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        aria-busy={!isMenuLoaded}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-h-[520px] sm:min-h-[580px]">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: BRAND STORY, HEADLINE & CTAS                */}
          {/* ======================================================== */}
          <div
            key={`hero-text-block-${slide.id || currentSlide}`}
            className="lg:col-span-7 text-center lg:text-left pt-2 lg:pt-0"
          >
            {/* MOBILE ONLY: PROMINENT LARGE ANIMATED SVG LOGO */}
            <div className="flex lg:hidden items-center justify-center mb-6 sm:mb-8 w-full">
              <AnimatedLogoSvg
                className="h-48 sm:h-64 md:h-72 w-auto max-w-[90vw] sm:max-w-[480px]"
                strokeWidth={3}
              />
            </div>

            {/* Subtitle / Category */}
            <div
              style={{ animationDelay: '140ms' }}
              className="animate-hero-text flex items-center justify-center lg:justify-start gap-2 mb-2 sm:mb-3"
            >
              <span className="h-px w-4 sm:w-6 bg-[#d2401e]/60 hidden sm:inline-block" />
              <h4 className="text-[11px] sm:text-sm font-oswald tracking-[0.25em] sm:tracking-[0.3em] text-white/80 uppercase font-medium">
                {slide.subtitle || 'PIZZERIA NAPOLETANA & PICCOLA CUCINA'}
              </h4>
              <span className="h-px w-4 sm:w-6 bg-[#d2401e]/60 hidden sm:inline-block" />
            </div>

            {/* Grand Headline with Warm Italian Gradient Accent */}
            <h1
              style={{ animationDelay: '220ms' }}
              className="animate-hero-text font-oswald text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white uppercase tracking-tight leading-[1.02] sm:leading-[0.98] mb-3 sm:mb-4 drop-shadow-2xl"
            >
              {slide.titlePrefix && <span>{slide.titlePrefix} </span>}
              <span className="bg-gradient-to-r from-[#ff7a45] via-[#ffa323] to-[#d2401e] bg-clip-text text-transparent">
                {slide.titleHighlight}
              </span>
            </h1>

            {/* Special Price Tag */}
            <div
              style={{ animationDelay: '300ms' }}
              className="animate-hero-text inline-flex items-center gap-2.5 sm:gap-3 bg-[#181818]/90 border border-white/10 rounded-2xl px-3.5 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-5 backdrop-blur-md shadow-lg"
            >
              <span className="text-[11px] sm:text-xs font-oswald text-white/50 tracking-wider uppercase">
                Prezzo Speciale:
              </span>
              <span className="font-oswald text-xl sm:text-2xl font-black text-[#d2401e]">
                {slide.price}
              </span>
              {slide.oldPrice && (
                <span className="font-oswald text-xs sm:text-sm text-white/40 line-through">
                  {slide.oldPrice}
                </span>
              )}
            </div>

            {/* Atmospheric Description */}
            <p
              style={{ animationDelay: '380ms' }}
              className="animate-hero-text text-xs sm:text-base md:text-lg text-stone-300/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-light mb-6 sm:mb-8 px-2 sm:px-0"
            >
              {slide.desc}
            </p>

            {/* Action Buttons styled like the Price Card Control */}
            <div
              style={{ animationDelay: '460ms' }}
              className="animate-hero-text flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0"
            >
              {/* Order Now (Direct Cart Action) */}
              <button
                onClick={handleOrderWeeklyItem}
                className="group relative inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-[#181818]/90 hover:bg-[#d2401e] border border-[#d2401e]/60 hover:border-[#d2401e] text-white font-oswald text-xs sm:text-sm tracking-[0.16em] font-bold uppercase backdrop-blur-md shadow-lg shadow-black/50 hover:shadow-[#d2401e]/30 transition-all duration-300 active:scale-[0.98] cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-[#d2401e] group-hover:text-white transition-colors" />
                <span>{slide.primaryBtn || 'ORDINA ORA'}</span>
                <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              {/* Reserve Table */}
              <a
                href="#reservation"
                className="group inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-[#181818]/90 hover:bg-[#202020] hover:border-[#ffa323] border border-white/15 text-white font-oswald text-xs sm:text-sm tracking-[0.16em] font-bold uppercase backdrop-blur-md shadow-lg shadow-black/50 hover:shadow-[#ffa323]/20 transition-all duration-300 active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-[#ffa323] transition-transform duration-300 group-hover:scale-110" />
                <span>{slide.secondaryBtn || 'PRENOTA UN TAVOLO'}</span>
              </a>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: FLOATING FOOD SHOWCASE (WITH EXACT EFFECT) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 relative flex items-center justify-center w-full my-2 lg:my-0">
            <div className="relative w-full max-w-[340px] sm:max-w-[440px] lg:max-w-[460px] xl:max-w-[560px] aspect-square flex items-center justify-center mx-auto">
              
              {/* Radial back glow */}
              <div className="absolute inset-4 rounded-full bg-[#d2401e]/20 blur-3xl pointer-events-none" />

              {/* Main Product Showcase Image with signature Floating & 3D Drop Shadow Effect */}
              {slide.image && (slide.image.endsWith('.jpg') || slide.image.endsWith('.jpeg') || slide.image.endsWith('.webp')) ? (
                <div className="w-64 sm:w-80 md:w-96 aspect-square rounded-full overflow-hidden border-4 border-white/10 shadow-[0_30px_50px_rgba(0,0,0,0.95)] animate-float transition-all duration-700 hover:scale-105 select-none relative z-10 bg-black/40 mx-auto">
                  <img
                    key={`main-${slide.id}-${slide.image}`}
                    src={slide.image}
                    alt={slide.name || 'Prodotto della settimana'}
                    className="w-full h-full object-cover select-none"
                  />
                </div>
              ) : (
                // foto ritagliate (PNG), di solito più larghe che alte: riquadro rettangolare e più ampio
                <div className="w-[330px] sm:w-[440px] lg:w-[440px] xl:w-[560px] aspect-[16/11] flex items-center justify-center mx-auto relative z-10">
                  <img
                    key={`main-${slide.id}-${slide.image}`}
                    src={slide.image || '/images/hero_section_1.png'}
                    alt={slide.name || 'Prodotto della settimana'}
                    className="w-full h-full object-contain filter drop-shadow-[0_30px_45px_rgba(0,0,0,0.95)] animate-float transition-all duration-700 hover:scale-105 select-none"
                  />
                </div>
              )}

              {/* Floating Previous Product in Small (Always animated with the previous product) */}
              {totalSlides > 1 && previousProduct && (
                <div
                  onClick={prevSlide}
                  className="absolute -bottom-2 sm:-bottom-6 left-0 sm:-left-6 md:-left-10 w-24 sm:w-36 md:w-44 aspect-square animate-float [animation-delay:2s] z-20 cursor-pointer group/prev transition-all duration-300 hover:scale-110"
                  title={`Prodotto precedente: ${previousProduct.name || 'Speciale'}`}
                >
                  {previousProduct.image && (previousProduct.image.endsWith('.jpg') || previousProduct.image.endsWith('.jpeg') || previousProduct.image.endsWith('.webp')) ? (
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/20 shadow-[0_20px_35px_rgba(0,0,0,0.9)] bg-black/50">
                      <img
                        key={`prev-${previousProduct.id}-${previousProduct.image}`}
                        src={previousProduct.image}
                        alt={previousProduct.name || 'Prodotto precedente'}
                        className="w-full h-full object-cover select-none"
                      />
                    </div>
                  ) : (
                    <img
                      key={`prev-${previousProduct.id}-${previousProduct.image}`}
                      src={previousProduct.image || '/images/hero_section_1.png'}
                      alt={previousProduct.name || 'Prodotto precedente'}
                      className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] select-none"
                    />
                  )}

                  {/* Previous indicator pill */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/85 text-[#ffa323] text-[9px] font-oswald uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/15 shadow-md flex items-center gap-1 opacity-0 group-hover/prev:opacity-100 transition-opacity whitespace-nowrap">
                    <span>‹ Precedente</span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* ========================================================== */}
        {/* SLIDER CONTROLS & UP TO 3 WEEKLY PRODUCT SELECTOR CARDS   */}
        {/* ========================================================== */}
        {totalSlides > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 sm:mt-12 pt-6 border-t border-white/10">
            
            {/* 3 Weekly Product Selector Chips (Hidden on Mobile) */}
            <div className="hidden md:flex items-center flex-wrap sm:flex-nowrap gap-2.5 sm:gap-3 py-1">
              {slides.map((s, idx) => {
                const isActive = currentSlide === idx;
                const displayName = s.titleHighlight || s.name || `Prodotto ${idx + 1}`;
                return (
                  <button
                    key={s.id || idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer border shrink-0 ${
                      isActive
                        ? 'bg-white/15 border-[#ffa323] shadow-lg shadow-[#ffa323]/25 text-white'
                        : 'bg-[#181818]/90 border-white/10 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 transition-all ${
                        isActive ? 'bg-[#ffa323] shadow-[0_0_8px_#ffa323]' : 'bg-white/30'
                      }`}
                    />
                    <span className="font-oswald text-xs tracking-wider uppercase font-bold text-white whitespace-nowrap">
                      0{idx + 1} • {displayName}
                    </span>
                    <span className="font-oswald text-xs font-bold text-[#ffa323] ml-1 whitespace-nowrap">
                      {s.price}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Prev / Next Glass Arrow Buttons */}
            <div className="flex items-center justify-center md:justify-end gap-2 shrink-0 w-full md:w-auto">
              <button
                onClick={prevSlide}
                className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-[#d2401e] hover:border-[#d2401e] flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[#d2401e]/30 active:scale-95"
                aria-label="Previous weekly product"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-[#d2401e] hover:border-[#d2401e] flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[#d2401e]/30 active:scale-95"
                aria-label="Next weekly product"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
