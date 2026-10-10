import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Car,
  Compass,
  Send,
  ExternalLink,
  CheckCircle2,
  Share2,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { MoustacheIcon } from '../common/Icons';
import { useLanguage } from '../../context/LanguageContext';
import { useAdmin } from '../../context/AdminContext';
import { api } from '../../services/api';
import { summarizeOpeningHours } from '../../utils/schedule';
import { PrivacyConsent } from '../Legal/PrivacyConsent';
import { hasMapsConsent, setMapsConsent, openLegal } from '../Legal/legal';

export const FindUsSection = () => {
  const { t, lang } = useLanguage();
  const { openingHours } = useAdmin();
  const hoursSummary = summarizeOpeningHours(openingHours, lang);
  const [showMap, setShowMap] = useState(hasMapsConsent);
  const [geoError, setGeoError] = useState('');
  const [contactPrivacy, setContactPrivacy] = useState(false);
  const [contactError, setContactError] = useState('');
  const [isSendingContact, setIsSendingContact] = useState(false);

  const [originInput, setOriginInput] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactContact, setContactContact] = useState('');
  const [contactSubject, setContactSubject] = useState('Informazioni Generali');
  const [contactMessage, setContactMessage] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Quick preset origins
  const PRESET_ORIGINS = [
    { label: 'Legnano (5 min)', query: 'Legnano, MI' },
    { label: 'Busto Arsizio (8 min)', query: 'Busto Arsizio, VA' },
    { label: 'Milano A8 (20 min)', query: 'Milano' },
    { label: 'LIUC Univ. (1 min a piedi)', query: 'Universita LIUC Castellanza' },
    { label: 'Saronno (12 min)', query: 'Saronno, VA' },
    { label: 'Gallarate (15 min)', query: 'Gallarate, VA' },
  ];

  // Geolocation trigger
  const handleUseCurrentLocation = () => {
    setGeoError('');
    if (!navigator.geolocation) {
      setGeoError(t.findUs?.geoUnsupported || 'La geolocalizzazione non è supportata dal tuo browser: inserisci la partenza a mano.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=Via+Borsano+44+Castellanza+VA`;
        window.open(url, '_blank', 'noopener,noreferrer');
      },
      (err) => {
        setIsLocating(false);
        // Fallback to generic navigation
        window.open('https://www.google.com/maps/dir/?api=1&destination=Via+Borsano+44+Castellanza+VA', '_blank', 'noopener,noreferrer');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Launch Google Maps navigation
  const handleLaunchNavigation = (e) => {
    e?.preventDefault();
    const destination = encodeURIComponent('Via Borsano 44 21053 Castellanza VA');
    let url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    if (originInput.trim()) {
      url += `&origin=${encodeURIComponent(originInput.trim())}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Handle Contact Form Submit
  // Il messaggio viene salvato sul server e notificato al ristorante (come le richieste eventi)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setContactError('');
    if (!contactName.trim() || !contactContact.trim()) return;
    if (!contactPrivacy) {
      setContactError(t.legal?.consentRequired || "Per continuare accetta l'informativa privacy.");
      return;
    }
    const isEmail = contactContact.includes('@');
    setIsSendingContact(true);
    try {
      await api.post('inquiries.php', {
        name: contactName,
        phone: isEmail ? '' : contactContact,
        email: isEmail ? contactContact.trim() : '',
        eventType: `Messaggio dal sito: ${contactSubject}`,
        notes: contactMessage,
        privacyAccepted: true,
      });
    } catch (err) {
      setContactError(err.message);
      return;
    } finally {
      setIsSendingContact(false);
    }
    setIsFormSubmitted(true);
    setContactName('');
    setContactContact('');
    setContactMessage('');
    setContactPrivacy(false);
    setTimeout(() => setIsFormSubmitted(false), 6000);
  };

  return (
    <section
      id="come-trovarci"
      className="relative py-20 sm:py-28 bg-[#141414] border-t border-white/10 overflow-hidden"
    >
      {/* Background ambient radial gradients */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-[#d2401e]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 rounded-full bg-[#ffa323]/10 blur-[120px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">
        {/* ======================================================== */}
        {/* SECTION HEADER                                           */}
        {/* ======================================================== */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <MoustacheIcon className="w-6 h-3 text-[#d2401e]" />
            <span className="text-xs font-oswald tracking-[0.25em] text-[#ffa323] uppercase font-semibold">
              {t.findUs?.badge || 'POSIZIONE & CONTATTI'}
            </span>
            <MoustacheIcon className="w-6 h-3 text-[#d2401e]" />
          </div>

          <h2 className="font-oswald text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white mb-4">
            {t.findUs?.title || 'COME TROVARCI'}
          </h2>

          <p className="text-white/70 text-sm sm:text-base font-sans max-w-2xl leading-relaxed">
            {t.findUs?.subtitle ||
              'Nel cuore di Castellanza (VA) - Di fronte all’Università LIUC, con comodi parcheggi gratuiti a pochi passi.'}
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d2401e] to-transparent mt-6" />
        </div>

        {/* ======================================================== */}
        {/* MAIN 2-COLUMN GRID (MAP & DIRECTIONS vs INFO & FORM)      */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ------------------------------------------------------ */}
          {/* LEFT: INTERACTIVE MAP & ROUTE PLANNER (7 cols)         */}
          {/* ------------------------------------------------------ */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Embedded Google Map Frame */}
            <div className="relative bg-[#181818] border border-white/15 rounded-3xl overflow-hidden shadow-2xl group">
              {/* Map Header bar */}
              <div className="bg-[#1e1e1e] border-b border-white/10 px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                  <span className="font-oswald text-xs uppercase tracking-wider text-white font-bold">
                    {t.findUs?.mapTitle || 'Mappa Interattiva & Sede Ufficiale'}
                  </span>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Via+Borsano+44+Castellanza+VA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-oswald text-[#ffa323] hover:text-white uppercase tracking-wider transition-colors"
                >
                  <span>{t.findUs?.openGoogleMaps || 'Apri Mappa'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Google Maps iFrame */}
              <div className="relative w-full h-[320px] sm:h-[380px] bg-[#121212]">
                {showMap ? (
                  <iframe
                    title="Mappa Sapore Verace Castellanza"
                    src="https://maps.google.com/maps?q=Via%20Borsano%2044,%2021053%20Castellanza%20VA&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0 filter contrast-[1.05] brightness-[0.95]"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  // Google Maps imposta cookie di terze parti: la mappa si carica solo su richiesta
                  <div className="w-full h-full flex flex-col items-center justify-start pt-16 sm:pt-20 text-center px-6 gap-3 bg-[radial-gradient(circle_at_center,#2a2a2a,#121212)]">
                    <MapPin className="w-8 h-8 text-[#d2401e]" />
                    <p className="text-xs text-white/70 max-w-sm">
                      {t.findUs?.mapConsentText || 'La mappa è fornita da Google Maps, che può impostare cookie di terze parti.'}{' '}
                      <button type="button" onClick={() => openLegal('cookie')} className="underline text-[#ffa323] cursor-pointer">
                        {t.legal?.cookieLink || 'Cookie policy'}
                      </button>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setMapsConsent(true);
                        setShowMap(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#d2401e] hover:bg-[#b83314] text-white font-oswald text-xs font-bold tracking-widest uppercase cursor-pointer"
                    >
                      {t.findUs?.mapConsentBtn || 'Mostra mappa'}
                    </button>
                  </div>
                )}

                {/* Floating location card overlay */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-[#181818]/95 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#d2401e] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#d2401e]/40">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-oswald text-sm font-bold text-white uppercase leading-none mb-1">
                        Sapore Verace
                      </h4>
                      <p className="text-[11px] text-white/70 font-sans leading-tight">
                        Via Borsano, 44 - Castellanza (VA)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Route Planner & GPS Navigator Card */}
            <div className="bg-[#181818] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#ffa323]/20 flex items-center justify-center text-[#ffa323]">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-oswald text-xl font-bold uppercase tracking-wider text-white">
                    {t.findUs?.directionsTitle || 'OTTIENI INDICAZIONI STRADALI'}
                  </h3>
                  <p className="text-xs text-white/60 font-sans">
                    Calcola il percorso in tempo reale e avvia il navigatore sul tuo smartphone
                  </p>
                </div>
              </div>

              {/* Quick Preset Origins */}
              <div className="mb-4">
                <span className="block text-[11px] font-oswald text-[#ffa323] uppercase font-bold tracking-wider mb-2">
                  {t.findUs?.quickOrigins || 'Partenze Rapide:'}
                </span>
                {geoError && (
                  <p role="alert" className="text-xs text-rose-300 mb-2">
                    {geoError}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="px-3 py-1.5 rounded-lg bg-[#d2401e] hover:bg-[#b83314] text-white text-xs font-oswald uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-[#d2401e]/30 cursor-pointer hover:scale-105"
                  >
                    <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{isLocating ? 'Ricerca GPS...' : t.findUs?.useMyLocBtn || '📍 Mia Posizione Attuale'}</span>
                  </button>

                  {PRESET_ORIGINS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setOriginInput(p.query);
                        const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(p.query)}&destination=Via+Borsano+44+Castellanza+VA`;
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 text-xs font-oswald uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input Form */}
              <form onSubmit={handleLaunchNavigation} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <MapPin className="w-4 h-4 text-[#ffa323]" />
                  </div>
                  <input
                    type="text"
                    value={originInput}
                    onChange={(e) => setOriginInput(e.target.value)}
                    placeholder={t.findUs?.fromPlaceholder || 'Inserisci il tuo indirizzo di partenza...'}
                    className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-white/15 rounded-xl text-xs sm:text-sm text-white font-sans placeholder-white/40 focus:border-[#ffa323] focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#d2401e] to-[#ffa323] hover:from-[#b83314] hover:to-[#d2401e] text-white font-oswald text-xs sm:text-sm font-bold tracking-[0.15em] uppercase rounded-xl transition-all shadow-lg shadow-[#d2401e]/30 flex items-center justify-center gap-2 cursor-pointer shrink-0 hover:scale-105"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{t.findUs?.startGpsBtn || 'AVVIA NAVIGATORE'}</span>
                </button>
              </form>

              {/* Direct Alternative App Buttons */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-white/50 font-oswald uppercase tracking-wider">
                  Apri con la tua app preferita:
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Via+Borsano+44+Castellanza+VA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white rounded-md font-oswald uppercase tracking-wider transition-colors"
                  >
                    Google Maps
                  </a>
                  <a
                    href="https://waze.com/ul?q=Via%20Borsano%2044%20Castellanza"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white rounded-md font-oswald uppercase tracking-wider transition-colors"
                  >
                    Waze
                  </a>
                  <a
                    href="https://maps.apple.com/?daddr=Via+Borsano+44+Castellanza+VA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white rounded-md font-oswald uppercase tracking-wider transition-colors"
                  >
                    Apple Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* RIGHT: CONTACT & PRACTICAL INFO CARDS (5 cols)         */}
          {/* ------------------------------------------------------ */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* 4 Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Indirizzo */}
              <div className="bg-[#181818] border border-white/10 rounded-2xl p-4.5 hover:border-white/25 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#d2401e]/20 text-[#d2401e] flex items-center justify-center mb-2.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="font-oswald text-xs uppercase tracking-wider text-[#ffa323] font-bold mb-1">
                  {t.findUs?.infoAddressTitle || 'INDIRIZZO'}
                </h4>
                <p className="text-xs text-white/80 font-sans leading-relaxed">
                  {t.findUs?.infoAddressVal || 'Via Borsano, 44 - 21053 Castellanza (VA)'}
                </p>
                <span className="text-[10px] text-white/40 block mt-1">
                  Di fronte all’Università LIUC
                </span>
              </div>

              {/* 2. Telefono & WhatsApp */}
              <div className="bg-[#181818] border border-white/10 rounded-2xl p-4.5 hover:border-white/25 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2.5">
                  <Phone className="w-4 h-4" />
                </div>
                <h4 className="font-oswald text-xs uppercase tracking-wider text-emerald-400 font-bold mb-1">
                  {t.findUs?.infoPhoneTitle || 'TELEFONO / WHATSAPP'}
                </h4>
                <a
                  href="tel:03311081917"
                  className="text-sm font-oswald font-bold text-white hover:text-[#ffa323] transition-colors block"
                >
                  0331 108 1917
                </a>
                <a
                  href="https://wa.me/3903311081917"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-emerald-400 hover:underline block mt-1 font-bold"
                >
                  💬 Chat WhatsApp Diretta
                </a>
              </div>

              {/* 3. Orari di Apertura */}
              <div className="bg-[#181818] border border-white/10 rounded-2xl p-4.5 hover:border-white/25 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#ffa323]/20 text-[#ffa323] flex items-center justify-center mb-2.5">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-oswald text-xs uppercase tracking-wider text-[#ffa323] font-bold mb-1">
                  {t.findUs?.infoHoursTitle || 'ORARI DI APERTURA'}
                </h4>
                <div className="text-[11px] text-white/80 font-sans space-y-0.5">
                  {/* Orari letti dalla configurazione admin (sempre coerenti con le prenotazioni) */}
                  {hoursSummary.lunch.map((g) => (
                    <p key={`l-${g.range}`}>{t.findUs?.lunchLabel || 'Pranzo'}: {g.range} ({g.days})</p>
                  ))}
                  {hoursSummary.dinner.map((g) => (
                    <p key={`d-${g.range}`}>{t.findUs?.dinnerLabel || 'Cena'}: {g.range} ({g.days})</p>
                  ))}
                  {hoursSummary.closedDays.length > 0 && (
                    <p className="text-rose-400 font-semibold">
                      {hoursSummary.closedDays.join(', ')}: {t.findUs?.closedLabel || 'Chiuso'}
                    </p>
                  )}
                </div>
              </div>

              {/* 4. Parcheggio */}
              <div className="bg-[#181818] border border-white/10 rounded-2xl p-4.5 hover:border-white/25 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center mb-2.5">
                  <Car className="w-4 h-4" />
                </div>
                <h4 className="font-oswald text-xs uppercase tracking-wider text-sky-400 font-bold mb-1">
                  {t.findUs?.infoParkingTitle || 'PARCHEGGIO'}
                </h4>
                <p className="text-[11px] text-white/80 font-sans leading-relaxed">
                  {t.findUs?.infoParkingVal ||
                    'Parcheggio pubblico gratuito su Via Borsano e piazza adiacente.'}
                </p>
                <span className="text-[10px] text-sky-300 font-bold block mt-1">
                  ✓ Posti sempre disponibili
                </span>
              </div>
            </div>

            {/* Interactive Contact / Message Form */}
            <div className="bg-[#181818] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl">
              <div className="flex items-center gap-2.5 mb-1">
                <MessageSquare className="w-5 h-5 text-[#ffa323]" />
                <h3 className="font-oswald text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                  {t.findUs?.formTitle || 'SCRIVICI UN MESSAGGIO'}
                </h3>
              </div>
              <p className="text-xs text-white/60 font-sans mb-5">
                {t.findUs?.formSubtitle ||
                  'Per richieste speciali, catering, eventi privati o info generali.'}
              </p>

              {isFormSubmitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center animate-in zoom-in">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <h4 className="font-oswald text-base uppercase font-bold text-white mb-1">
                    Grazie per averci contattato!
                  </h4>
                  <p className="text-xs text-emerald-300 font-sans">
                    {t.findUs?.formSuccess || 'Messaggio inviato con successo! Ti risponderemo a breve.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-oswald text-white/60 uppercase tracking-wider mb-1">
                        {t.findUs?.formName || 'Il tuo Nome'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="es. Marco Rossi"
                        className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:border-[#ffa323] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-oswald text-white/60 uppercase tracking-wider mb-1">
                        {t.findUs?.formEmailPhone || 'Telefono o Email'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactContact}
                        onChange={(e) => setContactContact(e.target.value)}
                        placeholder="es. 333 1234567 o email"
                        className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:border-[#ffa323] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-oswald text-white/60 uppercase tracking-wider mb-1">
                      {t.findUs?.formSubject || 'Oggetto della richiesta'}
                    </label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/15 rounded-xl text-xs text-white focus:border-[#ffa323] focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="Informazioni Generali">Informazioni Generali</option>
                      <option value="Catering & Grandi Ordini">Catering & Grandi Ordini</option>
                      <option value="Feste Private / Compleanni">Feste Private / Compleanni</option>
                      <option value="Allergie & Intolleranze">Allergie & Intolleranze</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-oswald text-white/60 uppercase tracking-wider mb-1">
                      {t.findUs?.formMsg || 'Il tuo messaggio'}
                    </label>
                    <textarea
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Scrivi qui eventuali richieste speciali o domande..."
                      className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:border-[#ffa323] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <PrivacyConsent id="contact-privacy" checked={contactPrivacy} onChange={setContactPrivacy} />

                  {contactError && (
                    <p role="alert" className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">
                      {contactError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingContact}
                    className="disabled:opacity-50 w-full py-3 bg-[#d2401e] hover:bg-[#b83314] text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase rounded-xl transition-all shadow-md shadow-[#d2401e]/30 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.findUs?.formSubmit || 'INVIA MESSAGGIO'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
