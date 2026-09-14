import React from 'react';
import { X, Phone, MapPin, Clock } from 'lucide-react';
import { InstagramIcon, FacebookIcon, TwitterIcon } from '../common/Icons';
import { useLanguage } from '../../context/LanguageContext';
import { useAdmin } from '../../context/AdminContext';
import { LanguageSwitcher } from '../common/Flags';
import { AnimatedLogoSvg } from '../common/AnimatedLogoSvg';

export const SideDrawer = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { setIsAdminView, setIsBookingModalOpen } = useAdmin();

  const handleOpenReservation = () => {
    onClose();
    setIsBookingModalOpen(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#181818] border-l border-white/10 shadow-2xl p-8 md:p-12 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Top bar with Language Selector and Close Button */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
          <div>
            <span className="block text-[11px] font-oswald text-white/50 uppercase tracking-[0.2em] mb-1.5">
              LINGUA / LANGUAGE
            </span>
            <LanguageSwitcher />
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <AnimatedLogoSvg
            className="h-36 sm:h-44 w-auto object-contain mb-3"
            strokeWidth={2.5}
          />
          <p className="text-xs text-[#ffa323] font-oswald tracking-[0.2em] uppercase">
            Pizzeria Napoletana con Piccola Cucina
          </p>
        </div>

        {/* About snippet */}
        <div className="text-center mb-6">
          <p className="text-sm text-white/70 leading-relaxed font-sans mb-5">
            {t.footer?.crewDesc}
          </p>

          <button
            type="button"
            onClick={handleOpenReservation}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#b84a28] hover:bg-[#a33e1e] text-white font-oswald text-xs sm:text-sm tracking-[0.2em] font-bold uppercase transition-all duration-300 shadow-lg shadow-[#b84a28]/25 border border-white/10 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>{t.drawer?.bookTableBtn || 'PRENOTA UN TAVOLO'}</span>
          </button>
        </div>

        {/* Info list */}
        <div className="space-y-6 mb-10 border-y border-white/10 py-8">
          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 text-[#d2401e] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-oswald text-xs uppercase tracking-wider text-white">{t.drawer?.mainLoc || 'Indirizzo Sede'}</h4>
              <a
                href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x47868d7b2c4f9c87:0xe3eba684116a28ce"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/80 hover:text-[#d2401e] transition-colors mt-0.5 block leading-relaxed"
              >
                Via Borsano, 44, 21053 Castellanza (VA)
              </a>
              <span className="text-[11px] text-[#ffa323] font-oswald tracking-wider uppercase mt-1 block">
                ⏱ {t.footer?.travelTime || 'Tempo di percorrenza: 19 min'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="w-5 h-5 text-[#d2401e] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-oswald text-xs uppercase tracking-wider text-white">{t.drawer?.directOrder || 'Telefono / Ordini'}</h4>
              <a href="tel:03311081917" className="text-sm text-[#d2401e] hover:underline font-bold font-oswald tracking-wider mt-0.5 block">
                0331 108 1917
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="w-5 h-5 text-[#d2401e] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-oswald text-xs uppercase tracking-wider text-white">{t.drawer?.hours || 'Orari di Apertura'}</h4>
              <p className="text-xs text-white/70 mt-0.5">Mar - Dom: 12:00 - 14:30 / 19:00 - 23:00</p>
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="text-center">
          <h5 className="font-oswald text-xs uppercase tracking-widest text-white/60 mb-4">
            {t.footer?.followUs || 'SEGUICI:'}
          </h5>
          <div className="flex justify-center items-center gap-4">
            <a
              href="https://www.instagram.com/sapore_verace/"
              target="_blank"
              rel="noopener noreferrer"
              title="Seguici su Instagram @sapore_verace"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-[#d2401e] hover:border-[#d2401e] transition-all duration-300"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-[#d2401e] hover:border-[#d2401e] transition-all duration-300"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-[#d2401e] hover:border-[#d2401e] transition-all duration-300"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
          </div>
          <a
            href="https://www.instagram.com/sapore_verace/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-xs font-oswald text-[#ffa323] hover:underline tracking-widest uppercase"
          >
            @SAPORE_VERACE
          </a>
        </div>

        {/* Admin Area Shortcut */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <button
            onClick={() => {
              onClose();
              setIsAdminView(true);
            }}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 font-oswald text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{t.drawer?.adminBtn || 'DASHBOARD AMMINISTRATORE TAVOLI'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
