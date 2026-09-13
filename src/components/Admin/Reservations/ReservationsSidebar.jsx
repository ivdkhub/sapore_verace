import React from 'react';
import { useAdmin, getTodayDateString } from '../../../context/AdminContext';
import {
  Users,
  Clock,
  Phone,
  FileText,
  Plus,
  Trash2,
  Edit3,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { MoustacheIcon } from '../../common/Icons';

export const ReservationsSidebar = () => {
  const {
    tables,
    clearTable,
    setIsModalOpen,
    setSelectedTable,
    selectedTable,
    activeShift,
    setActiveShift,
    selectedDate,
    setSelectedDate,
    setIsCalendarOpen,
    findBestFreeTable,
  } = useAdmin();

  // Filter and sort reservations by arrival time
  const reservedTables = tables
    .filter((t) => t.reservation !== null)
    .sort((a, b) => {
      const timeA = a.reservation?.time || '00:00';
      const timeB = b.reservation?.time || '00:00';
      return timeA.localeCompare(timeB);
    });

  const freeTables = tables.filter((t) => t.reservation === null);
  const totalBookedGuests = reservedTables.reduce((sum, t) => sum + (t.reservation?.guests || 0), 0);

  const handleSelectReservation = (table) => {
    setSelectedTable(table);
  };

  // Helper to format date in Italian
  const formatDateItalian = (dateStr) => {
    if (!dateStr) return { label: 'Seleziona Data', sublabel: '', isToday: false };
    const parts = dateStr.split('-');
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const d = Number(parts[2]);
    const dateObj = new Date(y, m - 1, d);

    const todayStr = getTodayDateString();
    const isToday = dateStr === todayStr;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(
      tomorrow.getDate()
    ).padStart(2, '0')}`;
    const isTomorrow = dateStr === tomorrowStr;

    const weekdays = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const months = [
      'Gennaio',
      'Febbraio',
      'Marzo',
      'Aprile',
      'Maggio',
      'Giugno',
      'Luglio',
      'Agosto',
      'Settembre',
      'Ottobre',
      'Novembre',
      'Dicembre',
    ];

    const weekdayName = weekdays[dateObj.getDay()] || '';
    const dayNum = dateObj.getDate() || '';
    const monthName = months[dateObj.getMonth()] || '';
    const year = dateObj.getFullYear() || '';

    let tag = '';
    if (isToday) tag = 'Oggi • ';
    else if (isTomorrow) tag = 'Domani • ';

    return {
      label: `${tag}${weekdayName} ${dayNum} ${monthName}`,
      sublabel: `${year} • Clicca per cambiare`,
      isToday,
    };
  };

  const handleDayChange = (delta) => {
    const currentDate = selectedDate || getTodayDateString();
    const parts = currentDate.split('-');
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    dateObj.setDate(dateObj.getDate() + delta);
    const newY = dateObj.getFullYear();
    const newM = String(dateObj.getMonth() + 1).padStart(2, '0');
    const newD = String(dateObj.getDate()).padStart(2, '0');
    setSelectedDate(`${newY}-${newM}-${newD}`);
  };

  const formattedDate = formatDateItalian(selectedDate || getTodayDateString());

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Seduti':
        return {
          bg: 'bg-[#d2401e]/20',
          text: 'text-[#d2401e]',
          border: 'border-[#d2401e]/40',
          dot: 'bg-[#d2401e]',
        };
      case 'In Arrivo':
      case 'in_corso':
        return {
          bg: 'bg-[#f59e0b]/20',
          text: 'text-[#f59e0b]',
          border: 'border-[#f59e0b]/40',
          dot: 'bg-[#f59e0b]',
        };
      case 'Confermata':
      case 'confermato':
      default:
        return {
          bg: 'bg-[#3b82f6]/20',
          text: 'text-[#3b82f6]',
          border: 'border-[#3b82f6]/40',
          dot: 'bg-[#3b82f6]',
        };
    }
  };

  return (
    <aside className="w-full lg:w-[340px] xl:w-[380px] shrink-0 bg-[#181818] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden font-sans">
      {/* Sidebar Header */}
      <div className="p-5 bg-[#141414] border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MoustacheIcon className="w-4 h-2 text-[#d2401e]" />
            <h3 className="font-oswald text-lg font-black uppercase text-white tracking-wide">
              ELENCO PRENOTATI
            </h3>
          </div>
          <span className="text-[11px] font-oswald text-[#ffa323] uppercase tracking-widest block mt-0.5 font-semibold">
            In Ordine di Arrivo • {activeShift === 'cena' ? '🌙 Cena' : '☀️ Pranzo'}
          </span>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-xl">
          <span className="font-oswald text-sm font-bold text-white">
            {reservedTables.length}
          </span>
          <span className="text-[10px] text-white/50 font-oswald uppercase">
            ({totalBookedGuests}p)
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CALENDAR & DATE SELECTOR (BEFORE RESERVATIONS LIST)          */}
      {/* ============================================================ */}
      <div className="p-3.5 bg-[#121212] border-b border-white/10 space-y-3">
        {/* Date Selector Header / Quick Navigation */}
        <div className="flex items-center justify-between gap-2 bg-[#1b1b1b] p-2 rounded-xl border border-white/10 shadow-inner">
          {/* Previous Day Button */}
          <button
            onClick={() => handleDayChange(-1)}
            title="Giorno precedente"
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-white/5"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Central Interactive Date Picker trigger */}
          <div className="relative flex-1 flex items-center justify-center min-w-0">
            <button
              type="button"
              onClick={() => setIsCalendarOpen(true)}
              className="flex items-center gap-2 cursor-pointer w-full justify-center px-1.5 py-1 rounded-lg hover:bg-white/5 transition-colors group"
              title="Apri calendario mensile a caselle"
            >
              <Calendar className="w-4 h-4 text-[#ffa323] shrink-0 group-hover:scale-110 transition-transform" />
              <div className="text-center truncate">
                <span className="block font-oswald text-xs font-bold text-white tracking-wide uppercase leading-tight truncate">
                  {formattedDate.label}
                </span>
                <span className="block text-[10px] text-[#ffa323] font-oswald tracking-widest uppercase leading-none mt-0.5 font-semibold">
                  {formattedDate.sublabel}
                </span>
              </div>
            </button>
          </div>

          {/* Next Day Button */}
          <button
            onClick={() => handleDayChange(1)}
            title="Giorno successivo"
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-white/5"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Shift and Quick "Oggi" Bar */}
        <div className="flex items-center gap-2">
          {/* Shift Toggle (Pranzo / Cena) */}
          <div className="flex-1 grid grid-cols-2 bg-[#1b1b1b] p-1 rounded-xl border border-white/10 font-oswald text-[11px] tracking-wider uppercase">
            <button
              onClick={() => setActiveShift('pranzo')}
              className={`py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeShift === 'pranzo'
                  ? 'bg-[#ffa323] text-black shadow-md shadow-[#ffa323]/20'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>☀️ Pranzo</span>
            </button>
            <button
              onClick={() => setActiveShift('cena')}
              className={`py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeShift === 'cena'
                  ? 'bg-[#d2401e] text-white shadow-md shadow-[#d2401e]/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>🌙 Cena</span>
            </button>
          </div>

          {/* Quick "Oggi" button if not today */}
          {!formattedDate.isToday && (
            <button
              onClick={() => setSelectedDate(getTodayDateString())}
              className="px-2.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl font-oswald text-[11px] font-bold tracking-wider uppercase transition-colors shrink-0 cursor-pointer"
              title="Torna alla data di oggi"
            >
              Oggi
            </button>
          )}
        </div>

        {/* Quick Add Reservation Button */}
        <button
          onClick={() => {
            const best = findBestFreeTable ? findBestFreeTable(4, null, tables) : (freeTables[0] || null);
            if (best) {
              setSelectedTable(best);
              setIsModalOpen(true);
            } else {
              alert('Tutti i tavoli sono attualmente occupati!');
            }
          }}
          className="w-full py-2.5 px-4 bg-[#d2401e] hover:bg-[#b83314] text-white rounded-xl font-oswald text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#d2401e]/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuova Prenotazione</span>
        </button>
      </div>

      {/* Booked List (Scrollable) */}
      <div className="flex-1 p-3.5 space-y-3 overflow-y-auto max-h-[640px] divide-y divide-white/5">
        {reservedTables.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-white/40">
              <Users className="w-6 h-6 text-[#ffa323]" />
            </div>
            <h4 className="font-oswald text-sm font-bold text-white uppercase tracking-wider">
              Nessuna Prenotazione
            </h4>
            <p className="text-xs text-white/50 mt-1 max-w-[220px] mx-auto leading-relaxed">
              Tutti i tavoli sono liberi per questo turno. Clicca su un tavolo nella mappa per assegnare una prenotazione.
            </p>
          </div>
        ) : (
          reservedTables.map((t, idx) => {
            const res = t.reservation;
            const isSelected = selectedTable?.id === t.id;
            const badge = getStatusBadge(res.status);

            return (
              <div
                key={t.id}
                onClick={() => handleSelectReservation(t)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-white/10 border-[#ffa323] shadow-lg shadow-[#ffa323]/10 ring-1 ring-[#ffa323]'
                    : 'bg-[#151515] border-white/5 hover:border-white/20 hover:bg-[#1c1c1c]'
                }`}
              >
                {/* Top Row: Time, Order & Table Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#ffa323]/20 border border-[#ffa323]/40 text-[#ffa323] font-oswald text-[11px] font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-oswald text-xs font-bold text-white">
                      <Clock className="w-3.5 h-3.5 text-[#d2401e]" />
                      <span>{res.time || '19:30'}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/15 font-oswald text-xs font-black tracking-wider uppercase text-[#ffa323]">
                    Tavolo {t.name}
                  </span>
                </div>

                {/* Client Name & Guests */}
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-oswald text-base font-bold text-white uppercase tracking-wide group-hover:text-[#ffa323] transition-colors truncate max-w-[180px]">
                    {res.clientName}
                  </h4>
                  <div className="flex items-center gap-1 text-xs font-oswald font-semibold text-white/80">
                    <Users className="w-3.5 h-3.5 text-[#ffa323]" />
                    <span>{res.guests} Coperti</span>
                  </div>
                </div>

                {/* Status Pill & Contact Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5 text-xs text-white/60">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                    <span className={`text-[10px] font-oswald font-bold uppercase ${badge.text}`}>
                      {res.status || 'Confermato'}
                    </span>
                  </div>

                  {res.phone && (
                    <span className="text-[11px] text-white/60 font-medium">
                      📞 {res.phone}
                    </span>
                  )}
                </div>

                {/* Notes if present */}
                {res.notes && (
                  <p className="text-[11px] text-white/50 italic mt-2 bg-black/30 p-1.5 rounded-lg border border-white/5 truncate">
                    💬 {res.notes}
                  </p>
                )}

                {/* Actions row on hover / selection */}
                <div className="flex items-center justify-end gap-1.5 mt-2.5 pt-2 border-t border-white/5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTable(t);
                      setIsModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white font-oswald text-[11px] uppercase font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-[#ffa323]" />
                    <span>Modifica</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearTable(t.id);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 font-oswald text-[11px] uppercase font-bold flex items-center gap-1 transition-colors cursor-pointer border border-rose-500/20"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Libera</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info: Available tables count */}
      <div className="p-3 bg-[#141414] border-t border-white/10 flex items-center justify-between text-xs font-oswald text-white/60">
        <span className="text-[#10b981] font-bold uppercase">
          🟢 {freeTables.length} Tavoli Liberi
        </span>
        <span className="text-white/40 uppercase">
          Capienza: {tables.reduce((acc, t) => acc + (t.seats || 4), 0)}p
        </span>
      </div>
    </aside>
  );
};
