import React from 'react';
import { ArrowUp } from 'lucide-react';
import { MoustacheIcon, InstagramIcon, FacebookIcon } from '../common/Icons';
import { useLanguage } from '../../context/LanguageContext';
import { useAdmin } from '../../context/AdminContext';
import { BUSINESS } from '../../config/business';
import { openLegal } from '../Legal/legal';

const WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const Footer = () => {
  const { t, lang } = useLanguage();
  const { openingHours } = useAdmin();

  // Nome del giorno nella lingua del sito (2024-01-01 era un lunedì)
  const dayName = (idx) => {
    const name = new Date(2024, 0, 1 + idx).toLocaleDateString(lang, { weekday: 'long' });
    return name.charAt(0).toUpperCase() + name.slice(1);
  };
  const dayHours = (key) => {
    const d = openingHours?.[key];
    if (!d || d.closed) return null;
    return ['lunch', 'dinner']
      .filter((shift) => d[shift]?.enabled)
      .map((shift) => `${d[shift].open} – ${d[shift].close}`)
      .join(' / ');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0d0d0d] text-white/70 font-sans border-t border-white/10 pt-20 pb-12 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
        {/* 4 COLUMNS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/10">
          {/* Col 1 & 2: CONTATTI E SEDE */}
          <div className="lg:col-span-5">
            <h4 className="font-oswald text-xl text-white font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="text-[#d2401e]">●</span> {t.footer.whereTitle}
            </h4>

            <div className="space-y-6 text-xs sm:text-sm">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-white font-bold font-oswald text-base tracking-wider uppercase mb-1">
                  Sapore Verace - Castellanza
                </p>
                <a
                  href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x47868d7b2c4f9c87:0xe3eba684116a28ce"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-[#d2401e] transition-colors block leading-relaxed"
                >
                  Via Borsano, 44, 21053 Castellanza (VA)
                </a>
                <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-white/10">
                  <div>
                    <span className="text-white/50 text-[11px] block font-oswald uppercase">TELEFONO:</span>
                    <a
                      href="tel:03311081917"
                      className="text-[#d2401e] hover:underline font-bold font-oswald text-base tracking-wider block"
                    >
                      0331 108 1917
                    </a>
                  </div>
                  <div className="bg-[#ffa323]/10 border border-[#ffa323]/30 px-3 py-1 rounded-md">
                    <span className="text-[#ffa323] text-[11px] font-oswald tracking-wider uppercase block font-semibold">
                      ⏱ {t.footer.travelTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: WORKING HOURS */}
          <div className="lg:col-span-4">
            <h4 className="font-oswald text-xl text-white font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="text-[#d2401e]">●</span> {t.footer.hoursTitle}
            </h4>

            <ul className="space-y-3 text-xs sm:text-sm">
              {WEEK.map((key, idx) => {
                const hours = dayHours(key);
                return (
                  <li key={key} className="flex justify-between gap-4 border-b border-white/5 pb-2">
                    <span className="font-oswald uppercase text-white font-medium">{dayName(idx)}</span>
                    {hours ? (
                      <span className="text-white/80 font-oswald text-right">{hours}</span>
                    ) : (
                      <span className="text-[#d2401e] font-oswald uppercase tracking-wider font-semibold">{t.footer.closed}</span>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* SOCIAL LINKS */}
            <div className="mt-8 flex items-center gap-3">
              <span className="font-oswald text-xs uppercase tracking-widest text-white font-bold mr-2">
                {t.footer.followUs}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={BUSINESS.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram @sapore_verace"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#d2401e] text-white/80 hover:text-white flex items-center justify-center transition-colors"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                {BUSINESS.facebookUrl && (
                  <a
                    href={BUSINESS.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#d2401e] text-white/80 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
            <a
              href="https://www.instagram.com/sapore_verace/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-xs font-oswald text-[#ffa323] hover:underline tracking-widest uppercase"
            >
              @SAPORE_VERACE
            </a>
          </div>

          {/* Col 4: BRAND STORY */}
          <div className="lg:col-span-3">
            <h4 className="font-oswald text-xl text-white font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="text-[#d2401e]">●</span> {t.footer.crewTitle}
            </h4>

            <p className="text-sm text-white/70 leading-relaxed font-sans mb-6">
              {t.footer.crewDesc}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <MoustacheIcon className="w-6 h-3 text-[#d2401e]" />
              <span className="font-oswald text-xs tracking-widest text-white uppercase font-bold">
                EST. 2018
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-oswald tracking-widest text-white/50 uppercase">
          <div className="flex flex-col sm:items-start items-center gap-1.5 text-center sm:text-left">
            <span>© {new Date().getFullYear()} {BUSINESS.legalName || 'SAPORE VERACE'}. {t.footer.rights}</span>
            {BUSINESS.vatNumber && <span className="normal-case tracking-normal">P.IVA {BUSINESS.vatNumber}</span>}
            <span className="flex gap-3 normal-case tracking-normal">
              <button type="button" onClick={() => openLegal('privacy')} className="hover:text-white underline cursor-pointer">
                {t.legal?.privacyTitle || 'Privacy policy'}
              </button>
              <button type="button" onClick={() => openLegal('cookie')} className="hover:text-white underline cursor-pointer">
                {t.legal?.cookieLink || 'Cookie policy'}
              </button>
            </span>
          </div>

          {/* Center moustache */}
          <div className="flex items-center gap-2 text-[#d2401e]">
            <MoustacheIcon className="w-6 h-3" />
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white/70 hover:text-[#d2401e] transition-colors cursor-pointer"
          >
            <span>{t.footer.backToTop}</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
