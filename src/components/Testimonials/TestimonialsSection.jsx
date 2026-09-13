import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { MoustacheIcon } from '../common/Icons';
import { useLanguage } from '../../context/LanguageContext';

export const TestimonialsSection = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const TESTIMONIALS = [
    {
      id: 1,
      quote: t.testimonials.t1,
      author: 'WASHINGTON POST',
      year: '2018',
    },
    {
      id: 2,
      quote: t.testimonials.t2,
      author: 'CORRIERE DELLA SERA',
      year: '2021',
    },
    {
      id: 3,
      quote: t.testimonials.t3,
      author: 'MICHELIN GUIDE STREET',
      year: '2023',
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextTestimonial();
    }, 6500);
    return () => clearInterval(timer);
  }, [t]);

  const current = TESTIMONIALS[currentIndex] || TESTIMONIALS[0];

  return (
    <section className="relative py-28 bg-[#121212] overflow-hidden bg-wood-pattern">
      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d2401e]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        {/* Giant Quote Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#d2401e]/20 border border-[#d2401e]/40 flex items-center justify-center mx-auto mb-8 text-[#d2401e]">
          <Quote className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
        </div>

        {/* Quote Text */}
        <div className="min-h-[160px] flex items-center justify-center">
          <blockquote className="font-oswald text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-wide leading-snug font-bold transition-all duration-500">
            “{current.quote}”
          </blockquote>
        </div>

        {/* Author / Publication Tag */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <MoustacheIcon className="w-5 h-2.5 text-[#d2401e]" />
          <cite className="not-italic font-oswald text-sm sm:text-base tracking-[0.25em] text-[#ffa323] uppercase font-semibold">
            {current.author} {current.year}
          </cite>
          <MoustacheIcon className="w-5 h-2.5 text-[#d2401e]" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prevTestimonial}
            className="w-10 h-10 rounded-full border border-white/20 text-white/70 hover:text-white hover:bg-[#d2401e] hover:border-[#d2401e] transition-all duration-300 flex items-center justify-center cursor-pointer"
            aria-label="Previous quote"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((testItem, idx) => (
              <button
                key={testItem.id}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? 'w-8 h-2 bg-[#d2401e] rounded-full'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/60 rounded-full'
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="w-10 h-10 rounded-full border border-white/20 text-white/70 hover:text-white hover:bg-[#d2401e] hover:border-[#d2401e] transition-all duration-300 flex items-center justify-center cursor-pointer"
            aria-label="Next quote"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
