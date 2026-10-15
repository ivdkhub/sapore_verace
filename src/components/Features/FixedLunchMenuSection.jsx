import React, { useState } from 'react';
import { Utensils, Pizza, Coffee, Wine, CheckCircle2, Clock, Calendar, Sparkles, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { MoustacheIcon } from '../common/Icons';
import { useLanguage } from '../../context/LanguageContext';
import { BUSINESS } from '../../config/business';
import { useAdmin } from '../../context/AdminContext';
import { useMenu } from '../../context/MenuContext';
import { fixedMenuFromTranslations } from '../../data/fixedMenuData';

const SECTION_ICONS = { utensils: Utensils, pizza: Pizza, check: CheckCircle2, coffee: Coffee, wine: Wine, sparkles: Sparkles };
const FEATURE_ICONS = [Clock, Sparkles, ShieldCheck];

// 14 -> ['14', ',00 €']; 12.5 -> ['12', ',50 €']
const splitPrice = (price) => {
  const [int, dec] = (Number(price) || 0).toFixed(2).split('.');
  return [int, `,${dec} €`];
};

export const FixedLunchMenuSection = () => {
  const { t } = useLanguage();
  const { setActiveShift } = useAdmin();
  const { fixedMenu, isMenuLoaded } = useMenu();
  const [activeTab, setActiveTab] = useState(0);

  const fl = t.fixedLunch || {};
  // Contenuti salvati dall'admin, altrimenti quelli originali tradotti nella lingua scelta
  const menu = fixedMenu || fixedMenuFromTranslations(fl);
  if (menu.active === false) return null;

  const [priceInt, priceDec] = splitPrice(menu.price);
  // "A PERSONA" nella lingua scelta, ricavato dal testo tradotto "14,00 € A PERSONA" (il prezzo ora è dinamico)
  const perPersonText = (fl.bottomNote2 || '14,00 € A PERSONA').replace(/€?\s*14[.,]00\s*€?/, '').trim();
  const MENU_TABS = (menu.sections || []).map((s) => ({ ...s, icon: SECTION_ICONS[s.icon] || Utensils, items: s.items || [] }));
  const currentTabObj = MENU_TABS[activeTab] || MENU_TABS[0] || { label: '', items: [] };

  return (
    <section
      id="menu-fisso"
      // come banner e menu: invisibile finché i dati veri arrivano dal server (niente contenuti che cambiano sotto gli occhi)
      className={`relative py-24 bg-[#141414] border-y border-white/10 overflow-hidden scroll-mt-20 transition-opacity duration-500 ${isMenuLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Dynamic Ambient Glow Backdrops */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-[#d2401e]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#ffa323]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative z-10">

        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          {menu.tag && (
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-amber-500/20 mb-3 shadow-lg">
              <Clock className="w-4 h-4 text-[#ffa323]" />
              <span className="text-xs font-oswald tracking-[0.25em] text-[#ffa323] uppercase font-bold">
                {menu.tag}
              </span>
            </div>
          )}

          <h2 className="font-oswald text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-3">
            {menu.title}
            {menu.subtitle && (
              <>
                {' '}<span className="text-[#d2401e]">|</span>{' '}
                <span className="bg-gradient-to-r from-[#ffa323] to-[#d2401e] bg-clip-text text-transparent">
                  {menu.subtitle}
                </span>
              </>
            )}
          </h2>

          <div className="flex justify-center mb-4">
            <MoustacheIcon className="w-8 h-4 text-[#d2401e]" />
          </div>

          <p className="text-white/70 text-sm sm:text-base font-sans leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
            {menu.desc}
          </p>
        </div>

        {/* MAIN FEATURE CARD (GRID LAYOUT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-gradient-to-br from-[#1a1715] via-[#161413] to-[#121212] border-2 border-amber-500/30 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl shadow-black/80 relative overflow-hidden">

          {/* Top Decorative Ribbon */}
          {menu.ribbon && (
            <div className="absolute top-0 right-0 bg-gradient-to-l from-[#d2401e] to-[#ffa323] text-black font-oswald text-xs font-black tracking-widest uppercase py-1.5 px-8 rounded-bl-2xl shadow-md">
              {menu.ribbon}
            </div>
          )}

          {/* LEFT SIDE: PRICE STAMP & QUICK PROMISES */}
          <div className="lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-8">
            <div>
              {/* Grand Price Tag */}
              <div className="bg-[#1e1a17] border border-amber-500/30 rounded-2xl p-6 mb-6 text-center relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffa323]/10 rounded-full blur-2xl pointer-events-none" />
                <span className="text-xs font-oswald tracking-[0.2em] text-[#ffa323] uppercase font-bold block mb-1">
                  {fl.priceHeader || 'PREZZO TUTTO COMPRESO'}
                </span>
                <div className="flex items-baseline justify-center font-oswald font-black text-5xl sm:text-6xl text-white tracking-tight my-1">
                  <span>{priceInt}</span>
                  <span className="text-2xl text-[#ffa323] ml-1">{priceDec}</span>
                </div>
                {menu.priceNote && <p className="text-xs text-stone-300 font-sans mt-2">{menu.priceNote}</p>}
              </div>

              {/* Guarantees List */}
              <div className="space-y-3.5 mb-8">
                {(menu.features || []).filter((f) => f.title || f.desc).map((f, i) => {
                  const FeatIcon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#d2401e]/20 text-[#ffa323] flex items-center justify-center shrink-0 border border-[#d2401e]/40">
                        <FeatIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-oswald text-sm font-bold text-white uppercase">{f.title}</h5>
                        <p className="text-xs text-white/60 font-sans">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <a
                href="#reservation"
                onClick={() => {
                  if (setActiveShift) setActiveShift('pranzo');
                }}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#d2401e] to-[#ffa323] hover:from-[#b83314] hover:to-[#d2401e] text-white font-oswald text-xs sm:text-sm tracking-[0.15em] font-bold uppercase transition-all shadow-xl shadow-[#d2401e]/30 flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Calendar className="w-4 h-4" />
                <span>{fl.bookLunchBtn || 'PRENOTA TAVOLO PER PRANZO'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={BUSINESS.phoneHref}
                className="w-full py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-oswald text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#ffa323]" />
                <span>{fl.takeoutCall || 'ASPORTO PRANZO: 0331 108 1917'}</span>
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: INTERACTIVE DISH CATEGORY TABS & DETAILED MENU BREAKDOWN */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {/* Category Navigation Pills */}
            <div className={`grid grid-cols-2 gap-2 mb-6 ${MENU_TABS.length >= 4 ? 'sm:grid-cols-4' : MENU_TABS.length === 3 ? 'sm:grid-cols-3' : ''}`}>
              {MENU_TABS.map((tab, i) => {
                const isActive = (MENU_TABS[activeTab] ? activeTab : 0) === i;
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id || i}
                    onClick={() => setActiveTab(i)}
                    className={`py-3 px-3 rounded-xl font-oswald text-xs font-bold uppercase tracking-wider transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer text-center ${
                      isActive
                        ? 'bg-[#d2401e] text-white shadow-lg shadow-[#d2401e]/30 scale-[1.02]'
                        : 'bg-[#1e1e1e] border border-white/10 text-white/70 hover:text-white hover:bg-[#252525]'
                    }`}
                  >
                    <TabIcon className="w-4 h-4 shrink-0 text-[#ffa323]" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Tab Dishes Card */}
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8 flex-1 flex flex-col justify-between shadow-inner">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="font-oswald text-lg sm:text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffa323] animate-pulse" />
                    {currentTabObj.label}
                  </h4>
                  <span className="text-[11px] font-oswald text-[#ffa323] uppercase tracking-widest font-bold">
                    {fl.choiceLabel || 'SCEGLI LA TUA COMBINAZIONE'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentTabObj.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#181818] border border-white/5 hover:border-amber-500/40 p-4 rounded-xl transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h5 className="font-oswald text-sm sm:text-base font-bold text-white uppercase group-hover:text-[#ffa323] transition-colors leading-snug">
                          {item.name}
                        </h5>
                        {item.tag && (
                          <span className="text-[9px] font-oswald font-black px-2 py-0.5 rounded bg-white/10 text-white/80 shrink-0 uppercase tracking-widest">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/60 font-sans leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formula banner bottom note */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50 font-sans">
                {menu.bottomNote ? <span>🍽️ {menu.bottomNote}</span> : <span />}
                <span className="text-[#ffa323] font-oswald font-bold tracking-wider uppercase">
                  {priceInt}{priceDec} {perPersonText}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
