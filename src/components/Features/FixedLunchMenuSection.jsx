import React, { useState } from 'react';
import { Utensils, Pizza, Coffee, Wine, CheckCircle2, Clock, Calendar, Sparkles, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { MoustacheIcon } from '../common/Icons';
import { useLanguage } from '../../context/LanguageContext';
import { useAdmin } from '../../context/AdminContext';

export const FixedLunchMenuSection = () => {
  const { t } = useLanguage();
  const { setActiveShift } = useAdmin();
  const [activeTab, setActiveTab] = useState('primi'); // 'primi' | 'pizze' | 'secondi' | 'bevande'

  const fl = t.fixedLunch || {};

  const MENU_TABS = [
    {
      id: 'primi',
      label: fl.tabPrimi || '1. Primi Piatti',
      icon: Utensils,
      items: [
        {
          name: fl.itemScialatielli || 'Scialatielli ai Frutti di Mare',
          desc: fl.descScialatielli || 'Pasta fresca con cozze, vongole veraci, gamberi e pomodorini del Vesuvio.',
          tag: 'MARE',
        },
        {
          name: fl.itemGnocchi || 'Gnocchi alla Sorrentina nel Coccio',
          desc: fl.descGnocchi || 'Gnocchi di patate con salsa San Marzano DOP, mozzarella filante e basilico fresco.',
          tag: 'TRADIZIONE',
        },
        {
          name: fl.itemPastaRagù || 'Mezze Maniche al Ragù Napoletano',
          desc: fl.descPastaRagù || 'Cottura lenta di 6 ore secondo l’antica ricetta napoletana con spolverata di pecorino.',
          tag: 'GOLOSO',
        },
      ],
    },
    {
      id: 'pizze',
      label: fl.tabPizze || 'Oppure Pizza a Scelta',
      icon: Pizza,
      items: [
        {
          name: fl.itemMargherita || 'Margherita Verace DOCG',
          desc: fl.descMargherita || 'Pomodoro San Marzano, fior di latte del Matese, basilico e olio EVO.',
          tag: 'CLASSICA',
        },
        {
          name: fl.itemDiavola || 'Diavola Piccante',
          desc: fl.descDiavola || 'Pomodoro, fior di latte, spianata calabrese piccante e basilico.',
          tag: 'PICCANTE',
        },
        {
          name: fl.itemCotto || 'Cotto & Funghi Champignon',
          desc: fl.descCotto || 'Pomodoro San Marzano, fior di latte, prosciutto cotto alta qualità e funghi.',
          tag: 'AMATA',
        },
        {
          name: fl.itemVegetariana || 'Ortolana / Vegetariana',
          desc: fl.descVegetariana || 'Fior di latte, melanzane, zucchine e peperoni grigliati al forno.',
          tag: 'VEGETARIANA',
        },
      ],
    },
    {
      id: 'secondi',
      label: fl.tabSecondi || '2. Secondi & Contorni',
      icon: CheckCircle2,
      items: [
        {
          name: fl.itemFrittura || 'Frittura di Calamari & Paranza',
          desc: fl.descFrittura || 'Pescato del giorno fritto ad arte, croccante e dorato con spicchio di limone.',
          tag: 'PESCE',
        },
        {
          name: fl.itemTagliata || 'Tagliata di Manzo con Rucola & Grana',
          desc: fl.descTagliata || 'Carne tenera scottata su piastra con pomodorini e scaglie di Parmigiano 24 mesi.',
          tag: 'CARNE',
        },
        {
          name: fl.itemInsalatona || 'Insalatona Verace con Bufala Campana',
          desc: fl.descInsalatona || 'Misticanza fresca, bocconcini di bufala DOP, datterini e olive taggiasche.',
          tag: 'LIGHT',
        },
        {
          name: fl.itemPatatine || 'Patatine Fritte o Verdure Grigliate',
          desc: fl.descPatatine || 'Contorno caldo e saporito preparato fresco sul momento.',
          tag: 'CONTORNO',
        },
      ],
    },
    {
      id: 'bevande',
      label: fl.tabBevande || '3. Bevanda, Caffè & Coperto',
      icon: Coffee,
      items: [
        {
          name: fl.itemAcqua || 'Acqua Minerale (50 cl) Naturale o Frizzante',
          desc: fl.descAcqua || 'Servita fredda al tavolo.',
          tag: 'INCLUSA',
        },
        {
          name: fl.itemVinoBibita || 'Calice di Vino della Casa o Bibita in Lattina',
          desc: fl.descVinoBibita || 'A scelta tra vino bianco, rosso campano o bibita (Coca-Cola, Fanta, Sprite).',
          tag: 'INCLUSO',
        },
        {
          name: fl.itemCaffe || 'Caffè Espresso Napoletano & Coperto',
          desc: fl.descCaffe || 'Autentico caffè espresso servito bollente e coperto sempre incluso a 0€.',
          tag: '0€ EXTRA',
        },
      ],
    },
  ];

  const currentTabObj = MENU_TABS.find((t) => t.id === activeTab) || MENU_TABS[0];

  return (
    <section id="menu-fisso" className="relative py-24 bg-[#141414] border-y border-white/10 overflow-hidden scroll-mt-20">
      {/* Dynamic Ambient Glow Backdrops */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-[#d2401e]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#ffa323]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-amber-500/20 mb-3 shadow-lg">
            <Clock className="w-4 h-4 text-[#ffa323]" />
            <span className="text-xs font-oswald tracking-[0.25em] text-[#ffa323] uppercase font-bold">
              {fl.tag || 'DAL LUNEDÌ AL VENERDÌ • ORE 12:00 – 14:30'}
            </span>
          </div>

          <h2 className="font-oswald text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-3">
            {fl.title || 'MENÙ FISSO'} <span className="text-[#d2401e]">|</span>{' '}
            <span className="bg-gradient-to-r from-[#ffa323] to-[#d2401e] bg-clip-text text-transparent">
              {fl.subtitle || 'PRANZO LAVORO'}
            </span>
          </h2>

          <div className="flex justify-center mb-4">
            <MoustacheIcon className="w-8 h-4 text-[#d2401e]" />
          </div>

          <p className="text-white/70 text-sm sm:text-base font-sans leading-relaxed max-w-2xl mx-auto">
            {fl.desc || 'La pausa pranzo perfetta a Castellanza: ingredienti freschissimi, rapidità di servizio e l’autentica qualità della tradizione napoletana a un prezzo imbattibile.'}
          </p>
        </div>

        {/* MAIN FEATURE CARD (GRID LAYOUT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-gradient-to-br from-[#1a1715] via-[#161413] to-[#121212] border-2 border-amber-500/30 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl shadow-black/80 relative overflow-hidden">
          
          {/* Top Decorative Ribbon */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-[#d2401e] to-[#ffa323] text-black font-oswald text-xs font-black tracking-widest uppercase py-1.5 px-8 rounded-bl-2xl shadow-md">
            {fl.ribbon || 'FORMULA BUSINESS LUNCH'}
          </div>

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
                  <span>14</span>
                  <span className="text-2xl text-[#ffa323] ml-1">,00 €</span>
                </div>
                <p className="text-xs text-stone-300 font-sans mt-2">
                  {fl.priceNote || 'Primo o Pizza + Secondo/Contorno + Bevanda + Caffè & Coperto'}
                </p>
              </div>

              {/* Guarantees List */}
              <div className="space-y-3.5 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#d2401e]/20 text-[#ffa323] flex items-center justify-center shrink-0 border border-[#d2401e]/40">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-oswald text-sm font-bold text-white uppercase">{fl.feat1_title || 'SERVIZIO RAPIDO (15 MIN)'}</h5>
                    <p className="text-xs text-white/60 font-sans">{fl.feat1_desc || 'Ideale per la pausa pranzo di lavoro.'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#d2401e]/20 text-[#ffa323] flex items-center justify-center shrink-0 border border-[#d2401e]/40">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-oswald text-sm font-bold text-white uppercase">{fl.feat2_title || 'INGREDIENTI FRESCHI DI GIORNATA'}</h5>
                    <p className="text-xs text-white/60 font-sans">{fl.feat2_desc || 'Pasta fresca fatta a mano e lievitazione 48h.'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#d2401e]/20 text-[#ffa323] flex items-center justify-center shrink-0 border border-[#d2401e]/40">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-oswald text-sm font-bold text-white uppercase">{fl.feat3_title || 'NESSUN COSTO NASCOSTO'}</h5>
                    <p className="text-xs text-white/60 font-sans">{fl.feat3_desc || 'Pane, coperto e caffè inclusi nei 14€.'}</p>
                  </div>
                </div>
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
                href="tel:03311081917"
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {MENU_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
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
                <span>🍽️ {fl.bottomNote1 || 'Formula valida solo a pranzo dal lunedì al venerdì (escluso festivi).'}</span>
                <span className="text-[#ffa323] font-oswald font-bold tracking-wider uppercase">
                  {fl.bottomNote2 || '14,00 € A PERSONA'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
