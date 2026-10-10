import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  GripHorizontal,
  Copy,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAdmin, getTodayDateString } from '../../../context/AdminContext';
import { useDraggableModal } from '../../../hooks/useDraggableModal';
import { MoustacheIcon } from '../../common/Icons';

export const AdminCalendarModal = ({ isOpen, onClose }) => {
  const {
    selectedDate,
    setSelectedDate,
    activeShift,
    setActiveShift,
    dailyConfigs,
    getSummaryForDate,
  } = useAdmin();

  const { position, isDragging, handleDragHeader } = useDraggableModal();

  // Current viewed month in the calendar (defaults to selectedDate's month or current month)
  const [viewDate, setViewDate] = useState(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-');
      return new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
    }
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  if (!isOpen) return null;

  const todayStr = getTodayDateString();

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth(); // 0-11

  const MONTH_NAMES = [
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

  const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDay = (dateStr) => {
    setSelectedDate(dateStr);
  };

  // Generate Month Grid Days
  const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Quick navigation helpers
  const handleJumpDays = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const dateStr = getTodayDateString(d);
    setSelectedDate(dateStr);
    setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 font-sans">
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        className={`pointer-events-auto relative w-full max-w-2xl bg-[#181818] text-white rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] border overflow-hidden transition-shadow ${
          isDragging ? 'border-[#ffa323] shadow-[#ffa323]/25 ring-2 ring-[#ffa323]/60' : 'border-white/15'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================ */}
        {/* MODAL HEADER (DRAGGABLE HANDLE)                              */}
        {/* ============================================================ */}
        <div
          onPointerDown={handleDragHeader}
          className="flex items-center justify-between px-6 py-4 bg-[#141414] border-b border-white/10 cursor-move select-none active:cursor-grabbing"
          title="Trascina per spostare il calendario"
        >
          <div className="flex items-center gap-3">
            <GripHorizontal className="w-4 h-4 text-[#ffa323] opacity-70" />
            <div className="w-9 h-9 rounded-xl bg-[#ffa323]/10 border border-[#ffa323]/30 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-[#ffa323]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-oswald text-xl font-black uppercase text-white tracking-wide">
                  CALENDARIO PIANIFICAZIONE SERATE
                </h3>
                <span className="text-[10px] font-oswald text-white/40 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                  7 Giorni Storico
                </span>
              </div>
              <span className="text-xs text-[#ffa323] font-oswald tracking-widest uppercase block mt-0.5 font-semibold">
                Configurazioni Tavoli & Prenotazioni Indipendenti per Data
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Chiudi calendario"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* QUICK SHORTCUTS & SHIFT BAR                                  */}
        {/* ============================================================ */}
        <div className="px-6 py-3 bg-[#121212] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          {/* Quick Date Jumps */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-oswald text-white/50 uppercase tracking-wider mr-1">
              Salta a:
            </span>
            <button
              onClick={() => handleJumpDays(0)}
              className={`px-3 py-1 rounded-lg font-oswald text-xs font-bold uppercase transition-all cursor-pointer ${
                selectedDate === todayStr
                  ? 'bg-[#10b981] text-black shadow-md shadow-[#10b981]/20'
                  : 'bg-white/5 hover:bg-white/15 text-white/80'
              }`}
            >
              Oggi
            </button>
            <button
              onClick={() => handleJumpDays(1)}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 font-oswald text-xs font-bold uppercase transition-all cursor-pointer"
            >
              Domani
            </button>
            <button
              onClick={() => handleJumpDays(7)}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[#ffa323] font-oswald text-xs font-bold uppercase transition-all cursor-pointer border border-[#ffa323]/20"
            >
              +7 Giorni
            </button>
            <button
              onClick={() => handleJumpDays(14)}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 font-oswald text-xs font-bold uppercase transition-all cursor-pointer"
            >
              +14 Giorni
            </button>
          </div>

          {/* Shift selector (Pranzo / Cena) */}
          <div className="flex items-center bg-[#1e1e1e] p-1 rounded-xl border border-white/10 font-oswald text-xs font-bold uppercase">
            <button
              onClick={() => setActiveShift('pranzo')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                activeShift === 'pranzo'
                  ? 'bg-[#ffa323] text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>☀️ Pranzo</span>
            </button>
            <button
              onClick={() => setActiveShift('cena')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                activeShift === 'cena'
                  ? 'bg-[#d2401e] text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>🌙 Cena</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MONTH CONTROLS (‹ Settembre 2026 ›)                         */}
        {/* ============================================================ */}
        <div className="px-6 pt-4 pb-2 flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white flex items-center gap-1.5 font-oswald text-xs font-bold uppercase transition-colors cursor-pointer border border-white/10"
          >
            <ChevronLeft className="w-4 h-4 text-[#ffa323]" />
            <span>Mese Prec.</span>
          </button>

          <h4 className="font-oswald text-xl font-black uppercase text-white tracking-widest flex items-center gap-2">
            <span>{MONTH_NAMES[currentMonth]}</span>
            <span className="text-[#ffa323]">{currentYear}</span>
          </h4>

          <button
            onClick={handleNextMonth}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white flex items-center gap-1.5 font-oswald text-xs font-bold uppercase transition-colors cursor-pointer border border-white/10"
          >
            <span>Mese Succ.</span>
            <ChevronRight className="w-4 h-4 text-[#ffa323]" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* MONTH CALENDAR GRID                                          */}
        {/* ============================================================ */}
        <div className="p-6 pt-2">
          {/* Weekdays Row Header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center">
            {WEEKDAYS.map((w, idx) => (
              <div
                key={w}
                className={`font-oswald text-xs font-bold uppercase tracking-wider py-1 ${
                  idx >= 5 ? 'text-[#ffa323]' : 'text-white/40'
                }`}
              >
                {w}
              </div>
            ))}
          </div>

          {/* Days Grid Cells */}
          <div className="grid grid-cols-7 gap-2">
            {/* Previous month leading days */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => {
              const prevDayNum = daysInPrevMonth - firstDayIndex + idx + 1;
              return (
                <div
                  key={`prev-${idx}`}
                  className="h-16 rounded-xl bg-white/[0.02] border border-white/5 p-1.5 opacity-30 select-none flex flex-col justify-between"
                >
                  <span className="font-oswald text-xs text-white/40">{prevDayNum}</span>
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(
                dayNum
              ).padStart(2, '0')}`;

              const isSelected = selectedDate === dateStr;
              const isToday = todayStr === dateStr;

              // Check summary for this date and active shift
              const summary = getSummaryForDate(dateStr, activeShift);
              const hasConfig = summary.hasCustomLayout;
              const resCount = summary.totalReservations || 0;
              const guestsCount = summary.totalGuests || 0;

              // Past calculation (> 7 days ago)
              const dateObj = new Date(currentYear, currentMonth, dayNum);
              dateObj.setHours(0, 0, 0, 0);
              const todayObj = new Date();
              todayObj.setHours(0, 0, 0, 0);
              const diffDays = Math.round((dateObj - todayObj) / (1000 * 60 * 60 * 24));
              const isExpired = diffDays < -7;

              return (
                <button
                  key={dateStr}
                  onClick={() => handleSelectDay(dateStr)}
                  className={`h-16 rounded-xl p-2 flex flex-col justify-between text-left transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-[#d2401e]/30 border-2 border-[#ffa323] shadow-lg shadow-[#ffa323]/20 ring-2 ring-[#ffa323]/40'
                      : isToday
                      ? 'bg-white/10 border-2 border-[#10b981] hover:bg-white/15'
                      : 'bg-[#1e1e1e] border border-white/10 hover:border-white/30 hover:bg-white/10'
                  } ${isExpired ? 'opacity-40' : ''}`}
                >
                  {/* Top Bar inside cell: Day Number & Badges */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`font-oswald text-sm font-bold ${
                        isSelected
                          ? 'text-[#ffa323]'
                          : isToday
                          ? 'text-[#10b981]'
                          : 'text-white group-hover:text-white'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {isToday && (
                      <span className="text-[9px] font-oswald font-black uppercase px-1.5 py-0.5 rounded bg-[#10b981] text-black">
                        Oggi
                      </span>
                    )}

                    {!isToday && isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#ffa323] animate-pulse" />
                    )}
                  </div>

                  {/* Bottom info inside cell: Reservations & Layout indicator */}
                  <div className="space-y-0.5">
                    {resCount > 0 ? (
                      <div className="flex items-center gap-1 text-[10px] font-oswald text-white font-bold bg-[#d2401e] px-1 py-0.5 rounded leading-none">
                        <Users className="w-2.5 h-2.5 shrink-0" />
                        <span>{resCount}p ({guestsCount})</span>
                      </div>
                    ) : hasConfig ? (
                      <div className="text-[9px] font-oswald text-[#ffa323] font-semibold flex items-center gap-0.5 truncate">
                        <Layers className="w-2.5 h-2.5 shrink-0" />
                        <span>Layout</span>
                      </div>
                    ) : (
                      <span className="text-[9px] font-oswald text-white/30 block">
                        {isToday ? 'Disponibile' : 'Default'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* SELECTED DATE DETAILS & COPY LAYOUT TOOLBAR                  */}
        {/* ============================================================ */}
        <div className="px-6 py-4 bg-[#141414] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-oswald text-[#ffa323] uppercase tracking-widest font-semibold block">
              Data Selezionata Attiva:
            </span>
            <h5 className="font-oswald text-lg font-bold text-white uppercase mt-0.5">
              {selectedDate} • {activeShift === 'cena' ? '🌙 Turno Cena' : '☀️ Turno Pranzo'}
            </h5>
            <p className="text-xs text-white/50">
              Ogni modifica a tavoli, disposizioni e prenotazioni viene salvata per questa specifica serata.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#ffa323] hover:bg-[#ffb347] text-black font-oswald text-xs font-bold tracking-wider uppercase rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Conferma & Visualizza Prenotazioni</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
