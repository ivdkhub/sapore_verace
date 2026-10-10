import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Share2,
  RefreshCw,
} from 'lucide-react';
import { useAdmin, getTodayDateString } from '../../context/AdminContext';
import { useLanguage } from '../../context/LanguageContext';
import { PrivacyConsent } from '../Legal/PrivacyConsent';
import { timeToMinutes } from '../../utils/schedule';

export const ReservationSection = ({ isModal = false }) => {
  const { createClientReservation, isRestaurantOpenOnDate, holidays, getBookingSlots } = useAdmin();
  const { t, lang } = useLanguage();

  const tr = t.reservation || {};

  // Booking Form State
  const [date, setDate] = useState(() => getTodayDateString());
  const [shift, setShift] = useState('pranzo');
  const [time, setTime] = useState('12:30');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Fasce orarie dagli orari impostati in admin; per oggi solo quelle tra almeno 30 minuti
  const slotsForShift = (shiftKey) => {
    const all = getBookingSlots(date, shiftKey);
    if (date !== getTodayDateString()) return all;
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    return all.filter((slot) => timeToMinutes(slot) > nowMin + 30);
  };
  const currentSlots = slotsForShift(shift);

  // Orari reali del turno da mostrare sui pulsanti (es. "12:00 - 14:30")
  const shiftHoursLabel = (shiftKey) => {
    const check = isRestaurantOpenOnDate(date, shiftKey);
    return check.isOpen && check.shiftHours ? `${check.shiftHours.open} - ${check.shiftHours.close}` : (tr.closedShort || 'chiuso');
  };
  const shiftName = (label, fallback) => (label ? label.replace(/[☀️🌙]/g, '').replace(/\s*\(.*\)\s*$/, '').trim() : fallback);

  // Keep time aligned with selected shift and date
  useEffect(() => {
    if (currentSlots.length > 0 && !currentSlots.includes(time)) {
      const preferred = shift === 'cena' ? '20:00' : '12:30';
      setTime(currentSlots.includes(preferred) ? preferred : currentSlots[0]);
    }
  }, [shift, date, currentSlots.join(',')]);

  // Weekdays & Months localizations
  const WEEKDAYS_MAP = {
    it: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    sq: ['Die', 'Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht'],
  };

  const MONTHS_MAP = {
    it: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    sq: ['Jan', 'Shk', 'Mar', 'Pri', 'Maj', 'Qer', 'Kor', 'Gus', 'Sht', 'Tet', 'Nën', 'Dhj'],
  };

  // Generate 7 consecutive days starting from today for quick chips
  const getUpcomingDays = () => {
    const days = [];
    const weekdays = WEEKDAYS_MAP[lang] || WEEKDAYS_MAP.it;
    const months = MONTHS_MAP[lang] || MONTHS_MAP.it;

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;

      let label = i === 0 ? (tr.today || 'Oggi') : i === 1 ? (tr.tomorrow || 'Domani') : weekdays[d.getDay()];
      days.push({
        dateStr,
        dayNum: d.getDate(),
        month: months[d.getMonth()],
        label,
        weekday: weekdays[d.getDay()],
      });
    }
    return days;
  };

  const upcomingDays = getUpcomingDays();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (isRestaurantOpenOnDate) {
      const openCheck = isRestaurantOpenOnDate(date, shift);
      if (!openCheck.isOpen) {
        setErrorMessage(openCheck.reason || 'Siamo spiacenti, il ristorante è chiuso per la data o turno selezionato.');
        return;
      }
    }

    if (!name.trim()) {
      setErrorMessage(tr.errorName || 'Inserisci il tuo nome e cognome.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 6) {
      setErrorMessage(tr.errorPhone || 'Inserisci un numero di telefono valido.');
      return;
    }
    if (!currentSlots.includes(time)) {
      setErrorMessage(tr.errorSlot || 'Scegli uno degli orari disponibili.');
      return;
    }
    if (!privacyAccepted) {
      setErrorMessage(t.legal?.consentRequired || "Per continuare accetta l'informativa privacy.");
      return;
    }

    setIsSubmitting(true);
    const result = await createClientReservation({
      name,
      phone,
      email,
      date,
      time,
      guests: Number(guests),
      notes,
      shift,
      privacyAccepted,
    });
    setIsSubmitting(false);

    if (result && result.success) {
      setConfirmedBooking(result);
    } else {
      setErrorMessage(
        result?.message || tr.errorNoTable || 'Nessun tavolo disponibile per la data e orario selezionati. Prova un altro orario.'
      );
    }
  };

  const handleResetBooking = () => {
    setConfirmedBooking(null);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setPrivacyAccepted(false);
    setErrorMessage('');
  };

  // Format date for display
  const formatDisplayDate = (dStr) => {
    if (!dStr) return '';
    const parts = dStr.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const currentOpenCheck = isRestaurantOpenOnDate ? isRestaurantOpenOnDate(date, shift) : { isOpen: true };
  const activeHolidayBanner = holidays?.find((h) => h.bannerActive);

  const mainContent = (
    <div className={isModal ? "max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 relative z-10" : "max-w-[1240px] mx-auto px-4 sm:px-8 relative z-10"}>
      {/* Section Header */}
      <div className={`flex flex-col items-center text-center ${isModal ? 'mb-6 sm:mb-8 pt-2 pr-8 sm:pr-0' : 'mb-14 sm:mb-16'}`}>
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <span className="text-xs font-oswald tracking-[0.25em] text-[#ffa323] uppercase font-semibold">
            {tr.badge || 'PRENOTA IL TUO TAVOLO'}
          </span>
        </div>

        <h2 className={`font-oswald ${isModal ? 'text-2xl sm:text-4xl' : 'text-3xl sm:text-5xl lg:text-6xl'} font-extrabold uppercase tracking-tight text-white mb-2 sm:mb-4`}>
          {tr.title || 'RISERVA IL TUO POSTO DA SAPORE VERACE'}
        </h2>

        <p className="text-white/70 text-xs sm:text-base font-sans max-w-2xl leading-relaxed">
          {tr.subtitle ||
            'Scegli data, orario e numero di ospiti. La conferma è immediata con assegnazione del tavolo in tempo reale.'}
        </p>

        {!isModal && <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d2401e] to-transparent mt-6" />}
      </div>

        {/* Public Holiday Banner Announcement if active */}
        {activeHolidayBanner && (
          <div className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-amber-600/90 via-[#d2401e]/90 to-amber-700/90 border border-amber-400/40 rounded-3xl p-5 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-md">
                <span className="text-xl">🏖️</span>
              </div>
              <div>
                <span className="text-[10px] font-oswald tracking-widest text-amber-200 uppercase font-bold block">
                  COMUNICAZIONE UFFICIALE CHIUSURE
                </span>
                <h4 className="font-oswald text-base font-bold uppercase tracking-wide">
                  {activeHolidayBanner.name}
                </h4>
                {activeHolidayBanner.notes && (
                  <p className="text-xs text-white/90 font-sans mt-0.5">
                    {activeHolidayBanner.notes}
                  </p>
                )}
              </div>
            </div>
            <span className="text-xs font-mono font-bold uppercase px-3.5 py-1.5 rounded-full bg-black/40 border border-white/20 shrink-0">
              {formatDisplayDate(activeHolidayBanner.startDate)} → {formatDisplayDate(activeHolidayBanner.endDate)}
            </span>
          </div>
        )}

        {/* ============================================================ */}
        {/* SUCCESS CONFIRMATION RECEIPT CARD                            */}
        {/* ============================================================ */}
        {confirmedBooking ? (
          <div className="max-w-2xl mx-auto bg-[#181818] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-oswald text-emerald-400 tracking-[0.2em] uppercase font-bold block mb-1">
              {tr.successBadge || 'PRENOTAZIONE CONFERMATA CON SUCCESSO!'}
            </span>

            <h3 className="font-oswald text-2xl sm:text-3xl font-bold uppercase text-white mb-2">
              {tr.welcomeGreeting || 'Ti aspettiamo'}, {confirmedBooking.reservation.name}!
            </h3>

            <p className="text-xs text-white/60 mt-1 font-sans">
              {tr.successDesc || 'La tua prenotazione è stata registrata istantaneamente nella planimetria della sala.'}
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 mb-8 mt-6 space-y-4 font-sans text-sm text-left">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-white/60">{tr.bookingCode || 'Codice Prenotazione:'}</span>
                <span className="font-oswald text-base text-[#ffa323] font-bold tracking-wider">
                  #{confirmedBooking.bookingCode}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-white/50 block">{tr.dateLabel || 'Data'}</span>
                  <span className="font-oswald text-base text-white font-bold">
                    {formatDisplayDate(confirmedBooking.date)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-white/50 block">{tr.timeShiftLabel || 'Orario & Turno'}</span>
                  <span className="font-oswald text-base text-white font-bold">
                    {confirmedBooking.time} ({confirmedBooking.shift === 'cena' ? (tr.dinnerShift?.replace(/[☀️🌙]/g, '').trim().split(' ')[1] || 'Cena') : (tr.lunchShift?.replace(/[☀️🌙]/g, '').trim().split(' ')[1] || 'Pranzo')})
                  </span>
                </div>
                <div>
                  <span className="text-xs text-white/50 block">{tr.guestsLabel || 'Numero di Persone'}</span>
                  <span className="font-oswald text-base text-white font-bold flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#d2401e]" />
                    {confirmedBooking.reservation.guests} {tr.seatsWord || 'Coperti'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-white/50 block">{tr.tableLabel || 'Tavolo Assegnato'}</span>
                  <span className="font-oswald text-base text-[#ffa323] font-bold">
                    {confirmedBooking.table?.name || tr.reservedTable || 'Tavolo Riservato'}
                  </span>
                </div>
              </div>

              {confirmedBooking.reservation.notes && (
                <div className="pt-3 border-t border-white/10 text-xs text-stone-300">
                  <span className="text-white/50 block mb-0.5">{tr.notesLabelShort || 'Note:'}</span>
                  {confirmedBooking.reservation.notes}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Sapore Verace - ${tr.bookingCode || 'Prenotazione'} #${confirmedBooking.bookingCode}: ${formatDisplayDate(
                    confirmedBooking.date
                  )} @ ${confirmedBooking.time} (${confirmedBooking.reservation.guests} ${tr.personPlural || 'persone'})`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-oswald text-xs tracking-wider uppercase font-semibold flex items-center gap-2 transition-all shadow-lg"
              >
                <Share2 className="w-4 h-4" />
                <span>{tr.shareWhatsApp || 'Condividi su WhatsApp'}</span>
              </a>

              <button
                onClick={handleResetBooking}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-oswald text-xs tracking-wider uppercase font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{tr.newBookingBtn || 'Nuova Prenotazione'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* INTERACTIVE CLIENT BOOKING FORM                             */
          /* ============================================================ */
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto bg-[#181818] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/70"
          >
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/40 text-red-200 text-sm flex items-center gap-3 animate-in shake">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {!currentOpenCheck.isOpen && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-white flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-oswald text-sm font-bold text-rose-300 uppercase tracking-wide">
                    Servizio non disponibile per questa data o turno
                  </h4>
                  <p className="text-xs text-white/80 font-sans mt-0.5">
                    {currentOpenCheck.reason}
                  </p>
                </div>
              </div>
            )}

            {/* STEP 1: DATE SELECTION */}
            <div className="mb-8">
              <label className="block text-xs font-oswald tracking-[0.2em] text-white/70 uppercase font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#ffa323]" />
                {tr.step1 || '1. Scegli il Giorno'}
              </label>

              {/* 7 Quick Days Pills (Responsive Grid with touch-friendly pills) */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-2.5 mb-3">
                {upcomingDays.map((item) => {
                  const isSelected = date === item.dateStr;
                  return (
                    <button
                      key={item.dateStr}
                      type="button"
                      onClick={() => setDate(item.dateStr)}
                      className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center active:scale-95 ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#d2401e] to-[#b83314] border-[#d2401e] text-white shadow-lg shadow-[#d2401e]/40 scale-105'
                          : 'bg-[#121212] border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] sm:text-[11px] uppercase font-oswald tracking-wider block opacity-80">
                        {item.label}
                      </span>
                      <span className="text-lg sm:text-xl font-oswald font-black leading-tight">
                        {item.dayNum}
                      </span>
                      <span className="text-[9px] sm:text-[10px] uppercase font-sans text-white/60">
                        {item.month}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Date Input for Future Dates */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-2 text-xs text-white/60 font-sans mt-2">
                <span>{tr.customDateText || 'Oppure seleziona una data specifica:'}</span>
                <input
                  type="date"
                  min={getTodayDateString()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-[#121212] border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-sans focus:border-[#ffa323] outline-none"
                />
              </div>
            </div>

            {/* STEP 2: SHIFT & TIME SLOTS */}
            <div className="mb-8">
              <label className="block text-xs font-oswald tracking-[0.2em] text-white/70 uppercase font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ffa323]" />
                {tr.step2 || '2. Seleziona Turno e Orario'}
              </label>

              {/* Shift Switcher */}
              <div className="grid grid-cols-2 sm:inline-flex bg-[#202020] p-1.5 rounded-2xl border border-white/20 mb-4 font-oswald text-xs sm:text-sm tracking-wider uppercase w-full sm:w-auto gap-1.5 shadow-inner">
                <button
                  type="button"
                  onClick={() => setShift('pranzo')}
                  className={`py-3 px-4 sm:px-6 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center text-center ${
                    shift === 'pranzo'
                      ? 'bg-[#ffa323] text-black shadow-lg shadow-[#ffa323]/30 border border-[#ffa323] font-extrabold'
                      : 'bg-[#2a2a2a] text-white hover:bg-[#353535] border border-white/10 hover:border-white/25'
                  }`}
                >
                  <span>{shiftName(tr.lunchShift, 'Turno Pranzo')} ({shiftHoursLabel('pranzo')})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShift('cena')}
                  className={`py-3 px-4 sm:px-6 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center text-center ${
                    shift === 'cena'
                      ? 'bg-[#d2401e] text-white shadow-lg shadow-[#d2401e]/30 border border-[#d2401e] font-extrabold'
                      : 'bg-[#2a2a2a] text-white hover:bg-[#353535] border border-white/10 hover:border-white/25'
                  }`}
                >
                  <span>{shiftName(tr.dinnerShift, 'Turno Cena')} ({shiftHoursLabel('cena')})</span>
                </button>
              </div>

              {/* Time Slot Pills */}
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {currentSlots.length === 0 && (
                  <p className="text-xs text-white/60">{tr.noSlots || 'Nessun orario prenotabile per questo turno: scegli un altro giorno o turno.'}</p>
                )}
                {currentSlots.map((slot) => {
                  const isSelected = time === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-oswald text-xs sm:text-sm font-semibold tracking-wider transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-[#ffa323] text-black border border-[#ffa323] shadow-md shadow-[#ffa323]/30 scale-105 font-bold'
                          : 'bg-[#242424] border border-white/15 text-white hover:border-white/40 hover:bg-[#303030]'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: NUMBER OF GUESTS (COPERTI) */}
            <div className="mb-8">
              <label className="block text-xs font-oswald tracking-[0.2em] text-white/70 uppercase font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#ffa323]" />
                {tr.step3 || '3. Numero di Persone (Coperti)'}
              </label>

              {/* Guest count selector pills with avatars */}
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => {
                  const isSelected = guests === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 active:scale-95 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#d2401e] to-[#ff5722] border-[#d2401e] text-white shadow-lg shadow-[#d2401e]/30 scale-105 font-bold'
                          : 'bg-[#121212] border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <span className="font-oswald text-sm sm:text-base">{num}</span>
                      <span className="text-[10px] sm:text-[11px] font-sans text-white/60">
                        {num === 1 ? (tr.personSingle || 'persona') : (tr.personPlural || 'persone')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: CONTACT DETAILS */}
            <div className="mb-8 pt-6 border-t border-white/10">
              <label className="block text-xs font-oswald tracking-[0.2em] text-white/70 uppercase font-semibold mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#ffa323]" />
                {tr.step4 || '4. I Tuoi Recapiti per la Conferma'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Name */}
                <div>
                  <label className="block text-[11px] text-white/60 font-sans mb-1.5">
                    {tr.nameLabel || 'Nome e Cognome'} <span className="text-[#d2401e]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder={tr.namePlaceholder || 'es. Marco Rossi'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#121212] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-base sm:text-sm text-white font-sans placeholder-white/30 focus:border-[#ffa323] outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[11px] text-white/60 font-sans mb-1.5">
                    {tr.phoneLabel || 'Telefono / WhatsApp'} <span className="text-[#d2401e]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder={tr.phonePlaceholder || 'es. 333 1234567'}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#121212] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-base sm:text-sm text-white font-sans placeholder-white/30 focus:border-[#ffa323] outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-white/60 font-sans mb-1.5">
                    {tr.emailLabel || 'Email (per ricevuta e promemoria)'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      placeholder={tr.emailPlaceholder || 'es. marco.rossi@email.it'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#121212] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-base sm:text-sm text-white font-sans placeholder-white/30 focus:border-[#ffa323] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-white/60 font-sans mb-1.5">
                    {tr.notesLabel || 'Note speciali / Allergie / Seggiolone'}
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={tr.notesPlaceholder || 'es. 1 seggiolone bimbo, compleanno...'}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-[#121212] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-base sm:text-sm text-white font-sans placeholder-white/30 focus:border-[#ffa323] outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <PrivacyConsent id="reservation-privacy" checked={privacyAccepted} onChange={setPrivacyAccepted} />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-stone-400 font-sans">
                <ShieldCheck className="w-4 h-4 text-[#ffa323] shrink-0" />
                <span>{tr.noPrepayment || 'Nessun pagamento anticipato richiesto • Conferma immediata'}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#d2401e] via-[#e64a19] to-[#ff5722] hover:from-[#b83314] hover:to-[#d2401e] text-white font-oswald text-sm tracking-[0.2em] font-semibold uppercase shadow-xl shadow-[#d2401e]/40 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <span>{tr.submittingBtn || 'Elaborazione in corso...'}</span>
                ) : (
                  <>
                    <span>{tr.submitBtn || 'CONFERMA PRENOTAZIONE'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
    </div>
  );

  if (isModal) {
    return (
      <div className="relative w-full">
        {mainContent}
      </div>
    );
  }

  return (
    <section id="reservation" className="relative py-16 sm:py-24 bg-[#111111] overflow-hidden border-t border-white/10 scroll-mt-20">
      {/* Warm Ambient Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#d2401e]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#ffa323]/8 rounded-full blur-[140px] pointer-events-none" />
      {mainContent}
    </section>
  );
};
