import React from 'react';
import { useAdmin, getTodayDateString } from '../../context/AdminContext';
import { AdminCalendarModal } from './Calendar/AdminCalendarModal';
import { AdminMenuManager } from './Menu/AdminMenuManager';
import { AdminWeeklyProductsManager } from './Weekly/AdminWeeklyProductsManager';
import { AdminHoursHolidaysManager } from './Hours/AdminHoursHolidaysManager';
import { AdminReservationsManager } from './Reservations/AdminReservationsManager';
import { AdminNotificationSettings } from './Notifications/AdminNotificationSettings';
import { AdminOrdersManager } from './Orders/AdminOrdersManager';
import { Calendar, Users, ArrowLeft, ChevronLeft, ChevronRight, UtensilsCrossed, LayoutDashboard, Flame, Star, Clock, Bell, ShoppingBag, LogOut } from 'lucide-react';
import { MoustacheIcon } from '../common/Icons';

export const AdminDashboard = () => {
  const {
    setIsAdminView,
    logout,
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
              <Calendar className="w-4 h-4" />
              <span>📅 Gestione Prenotazioni</span>
            </button>

            <button
              onClick={() => setActiveTab('orari')}
              className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'orari'
                  ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg shadow-[#10b981]/30 scale-105'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>⏰ Orari & Ferie</span>
            </button>

            <button
              onClick={() => setActiveTab('ordini')}
              className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'ordini'
                  ? 'bg-gradient-to-r from-[#ffa323] to-[#ffb84d] text-black shadow-lg shadow-[#ffa323]/30 scale-105'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>🛒 Ordini & Eventi</span>
            </button>

            <button
              onClick={() => setActiveTab('notifiche')}
              className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'notifiche'
                  ? 'bg-gradient-to-r from-[#d2401e] to-[#ffa323] text-white shadow-lg shadow-[#d2401e]/30 scale-105'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>🔔 Notifiche</span>
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
            <button
              onClick={logout}
              className="px-4 py-2.5 bg-white/5 hover:bg-rose-500/20 text-white/80 hover:text-white font-oswald text-xs font-bold tracking-[0.15em] uppercase rounded-xl flex items-center gap-2 transition-all cursor-pointer border border-white/10"
              title="Esci dall'area admin"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Esci</span>
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
        {/* TAB 3: OPENING HOURS & HOLIDAYS MANAGEMENT                 */}
        {/* ========================================================== */}
        {activeTab === 'orari' && (
          <AdminHoursHolidaysManager />
        )}

        {/* ========================================================== */}
        {/* TAB 4: RESERVATIONS MANAGEMENT (NO FLOOR PLAN)             */}
        {/* ========================================================== */}
        {activeTab === 'tavoli' && (
          <AdminReservationsManager />
        )}

        {/* ========================================================== */}
        {/* TAB 5: NOTIFICATIONS CONFIGURATION (EMAIL, TG, WHATSAPP)   */}
        {/* ========================================================== */}
        {activeTab === 'notifiche' && (
          <AdminNotificationSettings />
        )}

        {/* Ordini sempre montati (nascosti) così il segnale dei nuovi ordini suona da qualsiasi scheda */}
        <div hidden={activeTab !== 'ordini'}>
          <AdminOrdersManager />
        </div>
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
                  Visualizza Prenotazione →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
