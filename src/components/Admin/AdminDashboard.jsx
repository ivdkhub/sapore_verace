import React from 'react';
import { useAdmin, getTodayDateString } from '../../context/AdminContext';
import { FloorMap } from './FloorPlan/FloorMap';
import { ReservationsSidebar } from './Reservations/ReservationsSidebar';
import { AdminCalendarModal } from './Calendar/AdminCalendarModal';
import { AdminMenuManager } from './Menu/AdminMenuManager';
import { AdminWeeklyProductsManager } from './Weekly/AdminWeeklyProductsManager';
import { Store, Calendar, Users, Layers, ShieldCheck, ArrowLeft, ChevronLeft, ChevronRight, UtensilsCrossed, LayoutDashboard, Flame, Star } from 'lucide-react';
import { MoustacheIcon } from '../common/Icons';

export const AdminDashboard = () => {
  const {
    setIsAdminView,
    activeTab,
    setActiveTab,
    activeShift,
    setActiveShift,
    selectedDate,
    setSelectedDate,
    isCalendarOpen,
    setIsCalendarOpen,
    stats,
    newReservationToast,
    setNewReservationToast,
    setSelectedTable,
  } = useAdmin();

  // Auto-dismiss real-time toast after 9 seconds
  React.useEffect(() => {
    if (!newReservationToast) return;
    const timer = setTimeout(() => {
      setNewReservationToast(null);
    }, 9000);
    return () => clearTimeout(timer);
  }, [newReservationToast]);

  const handleFocusToastReservation = () => {
    if (!newReservationToast) return;
    setActiveTab('tavoli');
    if (newReservationToast.date) setSelectedDate(newReservationToast.date);
    if (newReservationToast.shift) setActiveShift(newReservationToast.shift);
    if (newReservationToast.table) setSelectedTable(newReservationToast.table);
    setNewReservationToast(null);
  };

  // Helper per formattare la data selezionata in italiano per l'header
  const formatHeaderDate = (dateStr) => {
    if (!dateStr) return { main: 'Seleziona Data', isToday: false };
    const parts = dateStr.split('-');
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const d = Number(parts[2]);
    const dateObj = new Date(y, m - 1, d);

    const todayStr = getTodayDateString();
    const isToday = dateStr === todayStr;

    const weekdays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const months = [
      'Gen',
      'Feb',
      'Mar',
      'Apr',
      'Mag',
      'Giu',
      'Lug',
      'Ago',
      'Set',
      'Ott',
      'Nov',
      'Dic',
    ];

    const weekdayName = weekdays[dateObj.getDay()] || '';
    const dayNum = dateObj.getDate() || '';
    const monthName = months[dateObj.getMonth()] || '';

    return {
      main: `${weekdayName} ${dayNum} ${monthName} ${y}`,
      isToday,
    };
  };

  const handleStepDay = (delta) => {
    const currentDate = selectedDate || getTodayDateString();
    const parts = currentDate.split('-');
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    dateObj.setDate(dateObj.getDate() + delta);
    const newY = dateObj.getFullYear();
    const newM = String(dateObj.getMonth() + 1).padStart(2, '0');
    const newD = String(dateObj.getDate()).padStart(2, '0');
    setSelectedDate(`${newY}-${newM}-${newD}`);
  };

  const headerDate = formatHeaderDate(selectedDate);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col font-sans selection:bg-[#d2401e] selection:text-white">
      {/* ============================================================ */}
      {/* TOP HEADER BAR (Sapore Verace Dark Luxury Brand)             */}
      {/* ============================================================ */}
      <header className="bg-[#181818] border-b border-white/10 px-6 py-4 sticky top-0 z-30 shadow-2xl backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Brand & Title */}
          <div className="flex items-center gap-4">
            <img
              src="/images/logo4.png"
              alt="Sapore Verace"
              className="h-16 sm:h-20 w-auto object-contain filter drop-shadow-md"
            />
            <div className="border-l border-white/10 pl-4">
              <div className="flex items-center gap-2">
                <MoustacheIcon className="w-4 h-2 text-[#d2401e]" />
                <h1 className="font-oswald text-xl sm:text-2xl font-black uppercase tracking-wide text-white leading-none">
                  PANNELLO AMMINISTRAZIONE
                </h1>
              </div>
              <span className="text-[11px] font-oswald text-[#ffa323] tracking-[0.2em] uppercase font-semibold">
                Sapore Verace Management
              </span>
            </div>
          </div>

          {/* Center: Main Section Navigation Tabs */}
          <div className="inline-flex bg-[#0f0f0f] p-1.5 rounded-2xl border border-white/10 shadow-inner flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-gradient-to-r from-[#d2401e] to-[#ff5722] text-white shadow-lg shadow-[#d2401e]/30 scale-105'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>🍕 Gestione Menù</span>
            </button>

            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'weekly'
                  ? 'bg-gradient-to-r from-[#ffa323] to-[#ff5722] text-white shadow-lg shadow-[#ffa323]/30 scale-105'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Star className="w-4 h-4 fill-current text-[#ffa323]" />
              <span>🌟 Prodotti Settimana (Hero)</span>
            </button>

            <button
              onClick={() => setActiveTab('tavoli')}
              className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'tavoli'
                  ? 'bg-gradient-to-r from-[#ffa323] to-[#ffb84d] text-black shadow-lg shadow-[#ffa323]/30 scale-105'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>🪑 Tavoli & Prenotazioni</span>
            </button>
          </div>

          {/* Right: Return to Website */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminView(false)}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-oswald text-xs font-bold tracking-[0.15em] uppercase rounded-xl flex items-center gap-2 transition-all cursor-pointer border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#ffa323]" />
              <span>Torna al Sito Pubblico</span>
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MAIN CONTENT                                                 */}
      {/* ============================================================ */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* ========================================================== */}
        {/* TAB 1: MENU & PRODUCTS MANAGEMENT                         */}
        {/* ========================================================== */}
        {activeTab === 'menu' && (
          <AdminMenuManager />
        )}

        {/* ========================================================== */}
        {/* TAB 2: WEEKLY PRODUCTS (HERO SECTION SPOTLIGHT)           */}
        {/* ========================================================== */}
        {activeTab === 'weekly' && (
          <AdminWeeklyProductsManager />
        )}

        {/* ========================================================== */}
        {/* TAB 3: FLOOR PLAN & TABLE RESERVATIONS                     */}
        {/* ========================================================== */}
        {activeTab === 'tavoli' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Shift & Calendar Control Bar for Tables View */}
            <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div>
                <span className="text-[11px] font-oswald text-[#ffa323] tracking-[0.2em] uppercase font-bold block">
                  FILTRO SERVIZIO SALA
                </span>
                <h3 className="font-oswald text-lg font-bold text-white uppercase">
                  Data e Turno Operativo
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Shift Switcher */}
                <div className="inline-flex bg-[#222222] p-1 rounded-xl border border-white/10 font-oswald text-xs tracking-wider uppercase">
                  <button
                    onClick={() => setActiveShift('pranzo')}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      activeShift === 'pranzo'
                        ? 'bg-[#ffa323] text-black shadow-lg shadow-[#ffa323]/30'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    ☀️ Turno Pranzo
                  </button>
                  <button
                    onClick={() => setActiveShift('cena')}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      activeShift === 'cena'
                        ? 'bg-[#d2401e] text-white shadow-lg shadow-[#d2401e]/30'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    🌙 Turno Cena
                  </button>
                </div>

                {/* Calendar Stepper */}
                <div className="flex items-center bg-[#222222] rounded-xl border border-white/10 p-0.5 shadow-inner">
                  <button
                    onClick={() => handleStepDay(-1)}
                    title="Giorno precedente"
                    className="p-1.5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsCalendarOpen(true)}
                    className="px-3 py-1.5 flex items-center gap-2 hover:bg-white/5 rounded-lg transition-all cursor-pointer group"
                    title="Clicca per aprire il calendario completo a griglia mensile"
                  >
                    <Calendar className="w-4 h-4 text-[#ffa323] group-hover:scale-110 transition-transform" />
                    <span className="font-oswald text-xs font-bold uppercase text-white tracking-wider">
                      {headerDate.main}
                    </span>
                    {headerDate.isToday && (
                      <span className="text-[9px] font-oswald font-bold px-1.5 py-0.5 rounded bg-[#10b981] text-black uppercase">
                        Oggi
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleStepDay(1)}
                    title="Giorno successivo"
                    className="p-1.5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#181818] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-xs font-oswald text-white/50 uppercase tracking-widest">
                    Tavoli Totali
                  </span>
                  <h3 className="font-oswald text-3xl font-black text-white mt-1">
                    {stats.totalTables}
                  </h3>
                </div>
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
                  <Layers className="w-5 h-5 text-[#ffa323]" />
                </div>
              </div>

              <div className="bg-[#181818] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-xs font-oswald text-[#10b981] uppercase tracking-widest">
                    Tavoli Liberi
                  </span>
                  <h3 className="font-oswald text-3xl font-black text-[#10b981] mt-1">
                    {stats.availableTables}
                  </h3>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-[#10b981]">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                </div>
              </div>

              <div className="bg-[#181818] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-xs font-oswald text-[#ffa323] uppercase tracking-widest">
                    Tavoli Prenotati
                  </span>
                  <h3 className="font-oswald text-3xl font-black text-[#ffa323] mt-1">
                    {stats.occupiedTables}
                  </h3>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#ffa323]/10 border border-[#ffa323]/30 flex items-center justify-center text-[#ffa323]">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#ffa323] shadow-[0_0_8px_rgba(255,163,35,0.8)]" />
                </div>
              </div>

              <div className="bg-[#181818] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-xs font-oswald text-[#d2401e] uppercase tracking-widest">
                    Coperti Totali
                  </span>
                  <h3 className="font-oswald text-3xl font-black text-[#d2401e] mt-1">
                    {stats.totalGuests} <span className="text-sm font-sans font-normal text-white/50">/ {stats.totalCapacity}p</span>
                  </h3>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#d2401e]/10 border border-[#d2401e]/30 flex items-center justify-center text-[#d2401e]">
                  <Users className="w-5 h-5 text-[#d2401e]" />
                </div>
              </div>
            </div>

            {/* Main Dashboard Layout: Left Reservations List + Right Interactive Floor Map */}
            <div className="flex flex-col lg:flex-row items-start gap-6">
              {/* Left Column: Ordered Reservations List */}
              <ReservationsSidebar />

              {/* Right Column: Interactive Floor Map */}
              <div className="flex-1 w-full min-w-0">
                <FloorMap />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FULL MONTH CALENDAR & MULTI-DAY PLANNER MODAL */}
      <AdminCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />

      {/* ============================================================ */}
      {/* REAL-TIME INCOMING RESERVATION LIVE TOAST NOTIFICATION       */}
      {/* ============================================================ */}
      {newReservationToast && (
        <div className="fixed top-6 right-6 z-50 max-w-md w-full bg-[#1e1a14]/95 border-2 border-amber-500 rounded-3xl p-5 shadow-[0_15px_45px_rgba(245,158,11,0.35)] backdrop-blur-xl animate-in slide-in-from-top-6 duration-300">
          <div className="flex items-start gap-3.5">
            {/* Pulsing Bell Icon */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#d2401e] to-[#ffa323] flex items-center justify-center shrink-0 shadow-lg shadow-[#ffa323]/30 animate-bounce">
              <span className="text-xl">🔔</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-oswald tracking-[0.2em] text-[#ffa323] uppercase font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  NUOVA PRENOTAZIONE ONLINE!
                </span>
                <button
                  onClick={() => setNewReservationToast(null)}
                  className="text-white/40 hover:text-white p-1 cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              <h4 className="font-oswald text-base text-white font-bold uppercase mt-0.5 truncate">
                {newReservationToast.reservation.name} • {newReservationToast.reservation.guests} Persone
              </h4>

              <p className="text-xs text-stone-300 font-sans mt-0.5">
                📅 {newReservationToast.date} alle {newReservationToast.reservation.time} ({newReservationToast.shift === 'cena' ? 'Cena' : 'Pranzo'})
              </p>

              <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-white/10">
                <span className="text-xs font-oswald text-[#ffa323] font-semibold">
                  Tavolo: {newReservationToast.table?.name || 'Assegnato'} (#{newReservationToast.reservation.code || 'SV'})
                </span>

                <button
                  onClick={handleFocusToastReservation}
                  className="px-3.5 py-1.5 rounded-full bg-[#d2401e] hover:bg-[#b83314] text-white font-oswald text-xs tracking-wider uppercase font-bold transition-all shadow-md cursor-pointer hover:scale-105"
                >
                  Visualizza Tavolo →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
