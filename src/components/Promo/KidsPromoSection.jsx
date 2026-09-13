import React from 'react';
import { MoustacheIcon } from '../common/Icons';
import { useLanguage } from '../../context/LanguageContext';

export const KidsPromoSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-16 bg-[#181818] border-y border-white/5 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#1e1e1e] border border-white/10 rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          {/* Background Glow */}
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-[#d2401e]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column */}
          <div className="lg:col-span-8 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left z-10">
            {/* Price Stamp */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#d2401e] text-white flex flex-col items-center justify-center shrink-0 shadow-xl shadow-[#d2401e]/40 border-4 border-[#1e1e1e]">
              <span className="text-[10px] font-oswald tracking-widest uppercase font-bold text-[#ffa323]">
                {t.kidsPromo.special}
              </span>
              <div className="flex items-baseline font-oswald font-black leading-none my-0.5">
                <span className="text-sm align-top mr-0.5">$</span>
                <span className="text-3xl sm:text-4xl">7</span>
                <span className="text-sm">99</span>
              </div>
              <span className="text-[9px] font-oswald tracking-wider uppercase opacity-80">
                {t.kidsPromo.combo}
              </span>
            </div>

            {/* Text details */}
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <MoustacheIcon className="w-4 h-2 text-[#d2401e]" />
                <span className="text-xs font-oswald tracking-[0.25em] text-[#b7903c] uppercase font-semibold">
                  {t.kidsPromo.familyBadge}
                </span>
              </div>
              <h2 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-tight">
                {t.kidsPromo.title}
              </h2>
              <p className="text-white/70 text-sm sm:text-base font-sans mt-2 max-w-xl leading-relaxed">
                {t.kidsPromo.desc}
              </p>
            </div>
          </div>

          {/* Right Column: CTA */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end z-10">
            <a
              href="#menu"
              className="px-8 py-4 bg-[#b7903c] hover:bg-[#a37f30] text-black font-oswald text-sm tracking-[0.2em] font-bold uppercase transition-all duration-300 shadow-lg hover:-translate-y-0.5"
            >
              {t.kidsPromo.btn}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
