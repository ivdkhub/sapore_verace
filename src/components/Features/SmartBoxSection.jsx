import React from 'react';
import { Box, Smartphone, Maximize2, Coffee } from 'lucide-react';
import { MoustacheIcon } from '../common/Icons';
import { useLanguage } from '../../context/LanguageContext';

export const SmartBoxSection = () => {
  const { t } = useLanguage();

  const FEATURES = [
    {
      icon: Smartphone,
      title: t.smartBox.f1_title,
      desc: t.smartBox.f1_desc,
    },
    {
      icon: Maximize2,
      title: t.smartBox.f2_title,
      desc: t.smartBox.f2_desc,
    },
    {
      icon: Box,
      title: t.smartBox.f3_title,
      desc: t.smartBox.f3_desc,
    },
    {
      icon: Coffee,
      title: t.smartBox.f4_title,
      desc: t.smartBox.f4_desc,
    },
  ];

  return (
    <section id="features" className="relative py-24 bg-[#181818] border-y border-white/5 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#d2401e]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Features & Text */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 mb-3">
              <MoustacheIcon className="w-5 h-2.5 text-[#d2401e]" />
              <span className="text-xs font-oswald tracking-[0.25em] text-[#ffa323] uppercase font-semibold">
                {t.smartBox.tag}
              </span>
            </div>

            <h2 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-tight mb-6 leading-tight">
              {t.smartBox.title}
            </h2>

            <p className="text-white/70 text-sm sm:text-base font-sans leading-relaxed mb-10 max-w-xl">
              {t.smartBox.desc}
            </p>

            {/* 4 Feature Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#222222] border border-white/10 flex items-center justify-center text-[#d2401e] shrink-0 shadow-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-oswald text-base font-bold text-white uppercase tracking-wider mb-1">
                        {f.title}
                      </h4>
                      <p className="text-xs text-white/60 font-sans leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Box & Pizza Presentation */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
              {/* Rotating Outer Ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-spin-slow pointer-events-none" />

              {/* Central Visual Graphic */}
              <div className="relative z-10 w-4/5 aspect-square flex items-center justify-center">
                <img
                  src="/images/hero_section_2.png"
                  alt="Smart Pizza Slice Box"
                  className="w-full h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] animate-float"
                />
              </div>

              {/* Floating Badge 1 */}
              <div className="absolute top-6 left-2 sm:left-6 px-4 py-2 bg-[#222222] border border-[#ffa323] text-white rounded-lg shadow-2xl animate-float [animation-delay:1s]">
                <span className="font-oswald text-xs tracking-widest text-[#ffa323] uppercase block font-bold">
                  100% RECYCLABLE
                </span>
                <span className="text-[10px] text-white/70">ECO DESIGN</span>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute bottom-8 right-2 sm:right-6 px-4 py-2 bg-[#d2401e] text-white rounded-lg shadow-2xl animate-float [animation-delay:2.5s]">
                <span className="font-oswald text-xs tracking-widest uppercase block font-black">
                  HOT & CRISP
                </span>
                <span className="text-[10px] opacity-80">STEAM VENTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
