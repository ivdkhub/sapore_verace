import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles, Users, ArrowRight, X, Flame, Check, Music, Wine, PartyPopper, Utensils } from 'lucide-react';
import { MoustacheIcon } from '../common/Icons';
import ParallaxCard from '../common/ParallaxCard';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { PrivacyConsent } from '../Legal/PrivacyConsent';

export const EVENTS_DATA = [
  {
    id: 'ev-1',
    title: 'Serata Pizza Gourmet & Vini del Vesuvio',
    category: 'degustazioni',
    categoryLabel: 'Degustazione & Gourmet',
    date: 'Tutti i Mercoledì',
    time: '20:30',
    price: '28 € a persona',
    image: '/images/ev1.jpg',
    shortDesc: 'Degustazione di 4 impasti speciali napoletani a lunga lievitazione abbinati a vini selezionati delle pendici del Vesuvio con sommelier in sala.',
    fullDesc: 'Un viaggio sensoriale attraverso l\'eccellenza partenopea. Il nostro Mastro Pizzaiolo presenterà 4 creazioni gourmet esclusive fuori menù, accompagnate da un calice di vino campano DOP selezionato per esaltare i sapori di ogni morso.',
    highlights: ['4 Tranci Gourmet esclusivi', 'Abbinamento 3 Vini DOP Campani', 'Dolce tipico napoletano & Caffè', 'Coperto & Acqua inclusi']
  },
  {
    id: 'ev-2',
    title: 'Live Music & Canzoni Tradizionali Napoletane',
    category: 'musica',
    categoryLabel: 'Musica & Spettacolo',
    date: 'Venerdì Sera',
    time: '21:00',
    price: 'Menù alla carta',
    image: '/images/ev2.jpg',
    shortDesc: 'Atmosfera calda e coinvolgente con chitarra, mandolino e i più celebri classici della tradizione musicale napoletana e d\'autore.',
    fullDesc: 'Goditi una serata indimenticabile al calore del nostro forno a legna. I maestri della canzone napoletana vi accompagneranno durante la cena con melodie intramontabili da "O Sole Mio" a "Torna a Surriento" fino ai classici di Pino Daniele.',
    highlights: ['Musica dal vivo in sala', 'Atmosfera intima e suggestiva', 'Menù alla carta senza supplementi', 'Prenotazione consigliata']
  },
  {
    id: 'ev-3',
    title: 'Pizza & Bollicine d\'Autore',
    category: 'degustazioni',
    categoryLabel: 'Degustazione & Gourmet',
    date: 'Sabato a Pranzo & Cena',
    time: '12:30 / 20:00',
    price: 'Menù alla carta',
    image: '/images/ev3.jpg',
    shortDesc: 'L\'incontro raffinato tra la veracità della pizza cotta a legna e le migliori bollicine italiane, dal Franciacorta al Prosecco di Valdobbiadene.',
    fullDesc: 'Scopri come il perlage fine ed elegante delle bollicine metodo classico sgrassa il palato e sublima la morbidezza del fiordilatte di Agerola e della mozzarella di bufala campana DOP.',
    highlights: ['Carta bollicine al calice e bottiglia', 'Pizze con ingredienti presidio Slow Food', 'Consulenza abbinamento in sala', 'Disponibile sia a pranzo che a cena']
  },
  {
    id: 'ev-4',
    title: 'Feste di Compleanno & Ricorrenze Private',
    category: 'feste',
    categoryLabel: 'Feste & Ricorrenze',
    date: 'Su Prenotazione',
    time: 'Personalizzabile',
    price: 'Menù personalizzati da 20 €',
    image: '/images/ev4.jpg',
    shortDesc: 'Festeggia il tuo compleanno o anniversario nella nostra sala riservata con menù pizza illimitato, sfizi fritti e torta personalizzata.',
    fullDesc: 'Mettiamo a tua disposizione spazi accoglienti, allestimenti dedicati e pacchetti menù completi (giro pizza, fritti della tradizione, bevande e dolce) per rendere la tua festa impeccabile e spensierata.',
    highlights: ['Sala o area riservata', 'Giro pizza + Fritti napoletani', 'Torta e spumante su richiesta', 'Assistenza dedicata']
  },
  {
    id: 'ev-5',
    title: 'Masterclass: Pizzaiolo per un Giorno',
    category: 'degustazioni',
    categoryLabel: 'Laboratorio & Corsi',
    date: 'Domenica Pomeriggio',
    time: '16:00 - 18:30',
    price: '35 € (con cena inclusa)',
    image: '/images/ev5.jpg',
    shortDesc: 'Impara tutti i segreti della pizza napoletana: idratazione, lievitazione a 48 ore, stesura a schiaffo e cottura nel forno a legna.',
    fullDesc: 'Un laboratorio pratico e divertente guidato dal nostro primo pizzaiolo. Riceverai il tuo grembiule personalizzato, imparerai le tecniche di impasto a mano e infornerai la tua creazione che gusterai a cena insieme!',
    highlights: ['Grembiule e ricettario in omaggio', 'Preparazione del proprio panetto', 'Cottura nel forno a legna', 'Cena degustazione + bibita inclusa']
  },
  {
    id: 'ev-6',
    title: 'Cene Aziendali & Team Building Gastronomico',
    category: 'feste',
    categoryLabel: 'Feste & Ricorrenze',
    date: 'Dal Lunedì al Giovedì',
    time: '20:00',
    price: 'Menù fisso concordato',
    image: '/images/ev6.jpg',
    shortDesc: 'Spazi accoglienti e soluzioni chiavi in mano per cene aziendali, auguri natalizi e meeting con la genuinità dei sapori campani.',
    fullDesc: 'Coniuga la convivialità della vera tavola italiana con l\'organizzazione professionale del tuo evento aziendale. Fatturazione elettronica rapida e possibilità di menù per celiaci, vegetariani e intolleranti.',
    highlights: ['Fatturazione aziendale immediata', 'Menù completi flessibili', 'Opzioni vegetariane e senza glutine', 'Possibilità di sala esclusiva']
  },
  {
    id: 'ev-7',
    title: 'Giro Pizza No Stop del Giovedì',
    category: 'degustazioni',
    categoryLabel: 'Degustazione & Gourmet',
    date: 'Tutti i Giovedì Sera',
    time: 'Dalle 19:30',
    price: '16 € a persona',
    image: '/images/ev7.jpg',
    shortDesc: 'Giro pizza no stop a spicchi: prova tutte le nostre specialità classiche e gourmet sfornate calde di continuo fino a quando non dici basta!',
    fullDesc: 'Il format ideale per compagnie di amici e famiglie. Al centro tavola arriveranno a ripetizione vassoi di pizze fumanti dalle margherite alle creazioni più ricche con bufala, tartufo, salsiccia e friarielli, con dolce alla Nutella finale.',
    highlights: ['Pizza a volontà a spicchi', 'Bibita media o birra inclusa', 'Fritturina mista di benvenuto', 'Pizza dolce alla Nutella di chiusura']
  },
  {
    id: 'ev-8',
    title: 'Notte dei Sapori d\'Autunno & Castagnata',
    category: 'degustazioni',
    categoryLabel: 'Degustazione & Gourmet',
    date: 'Eventi Stagionali',
    time: '20:00',
    price: 'Menù speciale 25 €',
    image: '/images/ev8.jpg',
    shortDesc: 'Serata a tema autunnale con pizze ai porcini freschi, zucca campana, caldarroste fumanti e vino novello da cantine locali.',
    fullDesc: 'Celebriamo i profumi del bosco e dell\'autunno con ricette esclusive a base di funghi porcini, vellutata di zucca mantovana, lardo di Colonnata e provola affumicata campana.',
    highlights: ['Pizze gourmet ai funghi e zucca', 'Vino novello illimitato ai pasti', 'Caldarroste calde al forno', 'Dessert autunnale dello chef']
  },
  {
    id: 'ev-9',
    title: 'Battesimi, Comunioni & Piccoli Ricevimenti',
    category: 'feste',
    categoryLabel: 'Feste & Ricorrenze',
    date: 'Weekend a Pranzo',
    time: '12:30',
    price: 'Menù cerimonia personalizzato',
    image: '/images/ev9.jpg',
    shortDesc: 'L\'ospitalità verace e calorosa per condividere i momenti più importanti con la tua famiglia in totale relax e allegria.',
    fullDesc: 'Dagli antipasti ricchi di mare e di terra ai primi della tradizione partenopea (come gli scialatielli e gli gnocchi alla sorrentina), fino alle nostre iconiche pizze e al servizio torta cerimonia.',
    highlights: ['Allestimento floreale su richiesta', 'Menù ricchi con primi e pizze', 'Servizio taglio torta e brindisi', 'Parcheggio comodo per tutti gli ospiti']
  }
];

export const EventsSection = () => {
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: 'Compleanno / Festa Privata',
    date: '',
    guests: '20',
    notes: '',
    privacyAccepted: false
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryError, setInquiryError] = useState('');
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);

  const filteredEvents = selectedFilter === 'all'
    ? EVENTS_DATA
    : EVENTS_DATA.filter(ev => ev.category === selectedFilter);

  // La richiesta viene salvata sul server e notificata al ristorante
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryError('');
    if (!inquiryForm.name.trim() || !inquiryForm.phone.trim()) {
      setInquiryError(t.events?.errorContact || 'Per favore compila il tuo nome e recapito telefonico.');
      return;
    }
    if (!inquiryForm.privacyAccepted) {
      setInquiryError(t.legal?.consentRequired || "Per continuare accetta l'informativa privacy.");
      return;
    }
    setIsSendingInquiry(true);
    try {
      await api.post('inquiries.php', inquiryForm);
    } catch (err) {
      setInquiryError(err.message);
      return;
    } finally {
      setIsSendingInquiry(false);
    }
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryForm({
        name: '',
        phone: '',
        email: '',
        eventType: 'Compleanno / Festa Privata',
        date: '',
        guests: '20',
        notes: '',
        privacyAccepted: false
      });
    }, 4500);
  };

  return (
    <section id="event" className="relative py-20 sm:py-28 bg-[#0d0d0d] overflow-hidden select-none border-t border-white/10">
      {/* Dynamic Warm Ambient Glow Background */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#d2401e]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-[#ffa323]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative z-10">
        
        {/* ========================================================= */}
        {/* HEADER SECTION                                            */}
        {/* ========================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d2401e]/15 border border-[#d2401e]/30 text-[#d2401e] text-xs font-oswald tracking-[0.2em] uppercase font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#ffa323]" />
            <span>SERATE SPECIALI & TRADIZIONE</span>
            <Flame className="w-3.5 h-3.5 text-[#ffa323]" />
          </div>

          <h2 className="font-oswald text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.05] mb-4">
            I NOSTRI <span className="bg-gradient-to-r from-[#ff7a45] via-[#ffa323] to-[#d2401e] bg-clip-text text-transparent">EVENTI</span> & SERATE A TEMA
          </h2>

          <div className="flex justify-center mb-4">
            <MoustacheIcon className="w-8 h-4 text-[#d2401e]" />
          </div>

          <p className="text-white/70 text-sm sm:text-base font-sans leading-relaxed">
            Musica dal vivo, degustazioni di vini campani, masterclass per imparare a fare la pizza, cene aziendali e feste private. Scopri il nostro calendario o richiedi il tuo evento su misura!
          </p>
        </div>

        {/* ========================================================= */}
        {/* CATEGORY FILTER PILLS                                     */}
        {/* ========================================================= */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-14">
          {[
            { id: 'all', label: 'Tutti gli Eventi', icon: Sparkles, count: EVENTS_DATA.length },
            { id: 'degustazioni', label: 'Degustazioni & Gourmet', icon: Wine, count: EVENTS_DATA.filter(e => e.category === 'degustazioni').length },
            { id: 'musica', label: 'Musica & Spettacolo', icon: Music, count: EVENTS_DATA.filter(e => e.category === 'musica').length },
            { id: 'feste', label: 'Feste & Ricevimenti', icon: PartyPopper, count: EVENTS_DATA.filter(e => e.category === 'feste').length },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`px-5 py-2.5 rounded-full font-oswald text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#d2401e] text-white shadow-lg shadow-[#d2401e]/30 scale-105'
                    : 'bg-[#1e1e1e] text-white/70 hover:text-white hover:bg-[#282828] border border-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#ffa323]'}`} />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold ${
                  isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-white/50'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 3x3 PARALLAX EVENTS GRID                                  */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredEvents.map((ev, idx) => (
            <ParallaxCard
              key={ev.id}
              delay={0.08 * (idx % 3)}
              duration={1.1}
              maxTiltDeg={8}
              maxTranslatePx={7}
              onClick={() => setActiveModalEvent(ev)}
              className="group relative flex flex-col justify-between bg-[#181818] border border-white/10 hover:border-[#ffa323]/50 rounded-2xl overflow-hidden cursor-pointer shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#d2401e]/20"
            >
              {/* Event Image Container with overlay */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/40" />

                {/* Top Badge: Category */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#ffa323] border border-[#ffa323]/40 text-[10px] sm:text-xs font-oswald uppercase tracking-wider font-bold">
                    <Sparkles className="w-3 h-3 text-[#ffa323]" />
                    {ev.categoryLabel}
                  </span>
                </div>

                {/* Top Right Price Tag */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#d2401e] text-white text-[11px] font-oswald font-black uppercase tracking-wider shadow-lg">
                    {ev.price}
                  </span>
                </div>

                {/* Bottom Schedule Pill on Image */}
                <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-xs text-white/90 font-oswald tracking-wider uppercase">
                  <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                    <Calendar className="w-3.5 h-3.5 text-[#ffa323]" />
                    {ev.date}
                  </span>
                  <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-[#ffa323]" />
                    {ev.time}
                  </span>
                </div>
              </div>

              {/* Event Text & Highlights */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-oswald text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-[#ffa323] transition-colors leading-tight">
                    {ev.title}
                  </h3>

                  <p className="text-stone-300 text-xs sm:text-sm font-sans leading-relaxed mb-5 line-clamp-3">
                    {ev.shortDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-oswald text-[#ffa323] tracking-wider uppercase font-bold group-hover:underline flex items-center gap-1">
                    Scopri Dettagli & Menù <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>

                  <button
                    type="button"
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white group-hover:bg-[#d2401e] group-hover:border-[#d2401e] transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </ParallaxCard>
          ))}
        </div>

        {/* ========================================================= */}
        {/* BANNER / REQUEST CUSTOM PRIVATE EVENT                     */}
        {/* ========================================================= */}
        <div className="mt-20 bg-gradient-to-br from-[#1e1512] via-[#1a1412] to-[#121212] border border-[#d2401e]/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#d2401e]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ffa323]/20 border border-[#ffa323]/40 text-[#ffa323] text-xs font-oswald tracking-widest uppercase font-bold mb-4">
                <PartyPopper className="w-3.5 h-3.5" />
                <span>ORGANIZZA IL TUO EVENTO PRIVATO</span>
              </div>

              <h3 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-tight mb-4">
                VUOI RISERVARE LA SALA PER UN <span className="text-[#ffa323]">EVENTO ESCLUSIVO</span>?
              </h3>

              <p className="text-stone-300 text-sm sm:text-base font-sans leading-relaxed mb-6">
                Compleanni, lauree, cene aziendali, battesimi o serate a tema con amici: creiamo insieme a te il menù perfetto con pizze a forno a legna, fritti napoletani e allestimento personalizzato.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm font-oswald text-white/80 tracking-wider uppercase">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10b981]" /> Fino a 100+ Coperti
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10b981]" /> Menù Personalizzati
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10b981]" /> Parcheggio Riservato
                </div>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="lg:col-span-6 bg-[#161616]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
              {inquirySubmitted ? (
                <div className="py-10 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Check className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <h4 className="font-oswald text-2xl font-bold text-white uppercase tracking-wider">
                    Richiesta Inviata con Successo!
                  </h4>
                  <p className="text-white/70 text-xs sm:text-sm font-sans max-w-md">
                    Grazie per averci contattato. Il nostro responsabile eventi ti richiamerà entro 24 ore per definire insieme tutti i dettagli.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <h4 className="font-oswald text-xl font-bold text-white uppercase tracking-wider mb-2">
                    Richiedi Preventivo / Info Evento
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-oswald text-white/60 tracking-wider uppercase mb-1">Nome e Cognome *</label>
                      <input
                        type="text"
                        required
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                        placeholder="es. Mario Rossi"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#222] border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:border-[#ffa323] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-oswald text-white/60 tracking-wider uppercase mb-1">Telefono / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        placeholder="es. 333 1234567"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#222] border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:border-[#ffa323] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-oswald text-white/60 tracking-wider uppercase mb-1">Tipo Evento</label>
                      <select
                        value={inquiryForm.eventType}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, eventType: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#222] border border-white/10 text-white text-xs sm:text-sm focus:border-[#ffa323] outline-none cursor-pointer"
                      >
                        <option>Compleanno / Festa</option>
                        <option>Cena Aziendale</option>
                        <option>Battesimo / Comunione</option>
                        <option>Giro Pizza di Gruppo</option>
                        <option>Altro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-oswald text-white/60 tracking-wider uppercase mb-1">Data Indicativa</label>
                      <input
                        type="date"
                        value={inquiryForm.date}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, date: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#222] border border-white/10 text-white text-xs sm:text-sm focus:border-[#ffa323] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-oswald text-white/60 tracking-wider uppercase mb-1">Numero Ospiti</label>
                      <input
                        type="number"
                        min="5"
                        max="150"
                        value={inquiryForm.guests}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, guests: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#222] border border-white/10 text-white text-xs sm:text-sm focus:border-[#ffa323] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-oswald text-white/60 tracking-wider uppercase mb-1">Dettagli o Richieste Speciali</label>
                    <textarea
                      rows="2"
                      value={inquiryForm.notes}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, notes: e.target.value })}
                      placeholder="es. Preferenza sala riservata, opzioni per intolleranti, orario..."
                      className="w-full px-4 py-2 rounded-xl bg-[#222] border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:border-[#ffa323] outline-none resize-none"
                    />
                  </div>

                  <PrivacyConsent
                    id="inquiry-privacy"
                    checked={inquiryForm.privacyAccepted}
                    onChange={(v) => setInquiryForm({ ...inquiryForm, privacyAccepted: v })}
                  />

                  {inquiryError && (
                    <p role="alert" className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">
                      {inquiryError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingInquiry}
                    className="disabled:opacity-50 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d2401e] to-[#ff5722] hover:from-[#b83314] hover:to-[#e64a19] text-white font-oswald text-sm font-bold tracking-[0.18em] uppercase transition-all duration-300 shadow-lg shadow-[#d2401e]/30 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{isSendingInquiry ? (t.events?.sending || 'INVIO IN CORSO...') : (t.events?.submitInquiry || 'INVIA RICHIESTA PREVENTIVO')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* DETAILED EVENT POPUP MODAL                                */}
      {/* ========================================================= */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#1a1a1a] border border-white/15 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <button
              onClick={() => setActiveModalEvent(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#d2401e] text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Hero Image */}
            <div className="relative aspect-[16/9] w-full bg-black">
              <img
                src={activeModalEvent.image}
                alt={activeModalEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-black/50" />
              <div className="absolute bottom-4 left-6 right-6">
                <span className="inline-block px-3 py-1 rounded-full bg-[#ffa323] text-black text-[10px] sm:text-xs font-oswald uppercase tracking-wider font-extrabold mb-2">
                  {activeModalEvent.categoryLabel}
                </span>
                <h3 className="font-oswald text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  {activeModalEvent.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-oswald tracking-wider uppercase">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white">
                  <Calendar className="w-4 h-4 text-[#ffa323]" />
                  {activeModalEvent.date}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white">
                  <Clock className="w-4 h-4 text-[#ffa323]" />
                  {activeModalEvent.time}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d2401e]/20 border border-[#d2401e]/40 text-[#ff7a45] font-bold">
                  💰 {activeModalEvent.price}
                </span>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-oswald text-white/50 tracking-wider uppercase mb-2">Descrizione Serata</h4>
                <p className="text-stone-300 text-sm font-sans leading-relaxed">
                  {activeModalEvent.fullDesc}
                </p>
              </div>

              {/* Highlights List */}
              {activeModalEvent.highlights && (
                <div>
                  <h4 className="text-xs font-oswald text-white/50 tracking-wider uppercase mb-3">Cosa Include l'Evento</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeModalEvent.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-white/90 font-sans bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal CTAs */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href="#reservation"
                  onClick={() => setActiveModalEvent(null)}
                  className="w-full sm:flex-1 py-3.5 rounded-full bg-gradient-to-r from-[#d2401e] to-[#ff5722] hover:from-[#b83314] hover:to-[#e64a19] text-white font-oswald text-xs sm:text-sm font-bold tracking-[0.18em] uppercase transition-all text-center shadow-lg shadow-[#d2401e]/30 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>PRENOTA UN TAVOLO PER QUESTO EVENTO</span>
                </a>
                <a
                  href="tel:03311081917"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-oswald text-xs sm:text-sm font-medium tracking-wider uppercase transition-all text-center"
                >
                  📞 Chiamaci
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
