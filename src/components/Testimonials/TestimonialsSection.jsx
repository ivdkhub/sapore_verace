import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Flame, Utensils } from 'lucide-react';
import { MoustacheIcon } from '../common/Icons';
import { useLanguage } from '../../context/LanguageContext';

export const TestimonialsSection = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const ALL_QUOTES = [
    {
      id: 1,
      quote: t.testimonials.t1,
      author: t.testimonials.author1,
      role: t.testimonials.role1,
      tag: '48H LIEVITAZIONE NATURALE',
      icon: Flame,
    },
    {
      id: 2,
      quote: t.testimonials.t2,
      author: t.testimonials.author2,
      role: t.testimonials.role2,
      tag: 'ECCELLENZE CAMPANE DOP',
      icon: Utensils,
    },
    {
      id: 3,
      quote: t.testimonials.t3,
      author: t.testimonials.author3,
      role: t.testimonials.role3,
      tag: 'TRADIZIONE VERACE NAPOLETANA',
      icon: Flame,
    },
    {
      id: 4,
      quote: t.testimonials.t4,
      author: t.testimonials.author4,
      role: t.testimonials.role4,
      tag: 'CUCINA ARTIGIANALE & PASSIONE',
      icon: Utensils,
    },
  ];

  const activeIndex = currentIndex % ALL_QUOTES.length;
  const current = ALL_QUOTES[activeIndex] || ALL_QUOTES[0];

  const nextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % ALL_QUOTES.length);
  };

  const prevQuote = () => {
    setCurrentIndex((prev) => (prev - 1 + ALL_QUOTES.length) % ALL_QUOTES.length);
  };

  // Autoplay carousel (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ALL_QUOTES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused, t]);

  const CurrentIcon = current.icon;

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative py-24 sm:py-28 bg-[#121212] overflow-hidden bg-wood-pattern"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#d2401e]/15 to-[#ffa323]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        {/* Giant Glowing Quote Icon with Craft Tag */}
        <div className="relative inline-block mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#d2401e]/25 to-[#ffa323]/20 border border-[#d2401e]/40 flex items-center justify-center mx-auto text-[#d2401e] shadow-xl shadow-[#d2401e]/20 transition-transform duration-500 hover:scale-105">
            <Quote className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
          </div>
          {current.tag && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-0.5 rounded-full bg-[#181818] border border-white/15 text-[10px] font-oswald tracking-[0.2em] text-[#ffa323] uppercase font-bold shadow-md">
              {current.tag}
            </div>
          )}
        </div>

        {/* Main Quote Statement */}
        <div className="min-h-[160px] sm:min-h-[170px] flex items-center justify-center px-2">
          <blockquote
            key={current.id}
            className="font-oswald text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-wide leading-snug sm:leading-tight font-bold transition-all duration-500 animate-in fade-in zoom-in-95"
          >
            “{current.quote}”
          </blockquote>
        </div>

        {/* Master's Signature & Role */}
        <div
          key={`author-${current.id}`}
          className="mt-8 flex flex-col items-center justify-center gap-1.5 animate-in fade-in duration-300"
        >
          <div className="flex items-center gap-3">
            <MoustacheIcon className="w-5 h-2.5 text-[#d2401e]" />
            <div className="flex items-center gap-2">
              <CurrentIcon className="w-4 h-4 text-[#ffa323]" />
              <cite className="not-italic font-oswald text-base sm:text-lg tracking-[0.2em] text-white uppercase font-black">
                {current.author}
              </cite>
            </div>
            <MoustacheIcon className="w-5 h-2.5 text-[#d2401e]" />
          </div>

          <span className="text-xs sm:text-sm font-sans tracking-wide text-[#ffa323] font-semibold">
            {current.role}
          </span>
        </div>

        {/* Carousel Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prevQuote}
            className="w-11 h-11 rounded-full border border-white/20 text-white/70 hover:text-white hover:bg-[#d2401e] hover:border-[#d2401e] transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            aria-label="Citazione precedente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            {ALL_QUOTES.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 cursor-pointer ${
                  activeIndex === idx
                    ? 'w-7 h-2.5 bg-gradient-to-r from-[#d2401e] to-[#ffa323] rounded-full shadow-sm'
                    : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60 rounded-full'
                }`}
                aria-label={`Vai alla citazione ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextQuote}
            className="w-11 h-11 rounded-full border border-white/20 text-white/70 hover:text-white hover:bg-[#d2401e] hover:border-[#d2401e] transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            aria-label="Prossima citazione"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Counter Badge */}
        <div className="mt-4 text-[11px] font-mono text-white/40 tracking-widest uppercase">
          0{activeIndex + 1} / 0{ALL_QUOTES.length}
        </div>
      </div>
    </section>
  );
};
