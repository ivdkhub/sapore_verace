import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CalendarOff,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Sun,
  Moon,
  Info,
  ShieldCheck,
  RefreshCw,
  Bell,
  Eye,
  Save,
  Sliders,
  Check,
  X,
  Megaphone,
} from 'lucide-react';
import { useAdmin, getTodayDateString, DEFAULT_OPENING_HOURS } from '../../../context/AdminContext';
import { MoustacheIcon } from '../../common/Icons';

export const AdminHoursHolidaysManager = () => {
  const {
    openingHours,
    holidays,
    updateDayHours,
    updateAllOpeningHours,
    resetOpeningHours,
    addHoliday,
    updateHoliday,
    deleteHoliday,
    toggleHolidayBanner,
    isDateInHoliday,
    saveSuccessMessage,
  } = useAdmin();

  // Active view tab: 'weekly' (orari settimanali) or 'holidays' (ferie e chiusure) or 'preview'
  const [subTab, setSubTab] = useState('weekly');

  // Local draft of weekly hours for bulk editing before commit (or instant sync)
  const [localHours, setLocalHours] = useState(openingHours);

  // Modal for adding / editing holidays
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [editingHolidayId, setEditingHolidayId] = useState(null);
  const [holidayFormData, setHolidayFormData] = useState({
    name: '',
    type: 'ferie',
    startDate: getTodayDateString(),
    endDate: getTodayDateString(),
    notes: '',
    bannerActive: true,
  });

  // Keep localHours synced if openingHours from context changes
  React.useEffect(() => {
    setLocalHours(openingHours);
  }, [openingHours]);

  // Day keys ordered Monday through Sunday
  const DAY_KEYS = [
    { key: 'monday', label: 'Lunedì', short: 'Lun' },
    { key: 'tuesday', label: 'Martedì', short: 'Mar' },
    { key: 'wednesday', label: 'Mercoledì', short: 'Mer' },
    { key: 'thursday', label: 'Giovedì', short: 'Gio' },
    { key: 'friday', label: 'Venerdì', short: 'Ven' },
    { key: 'saturday', label: 'Sabato', short: 'Sab' },
    { key: 'sunday', label: 'Domenica', short: 'Dom' },
  ];

  // Helper: Handle change in single day's local hours
  const handleDayFieldChange = (dayKey, field, value) => {
    const updated = {
      ...localHours,
      [dayKey]: {
        ...localHours[dayKey],
        [field]: value,
      },
    };
    setLocalHours(updated);
    updateDayHours(dayKey, { [field]: value });
  };

  const handleShiftTimeChange = (dayKey, shift, timeField, timeVal) => {
    const currentShift = localHours[dayKey]?.[shift] || {};
    const updatedShift = {
      ...currentShift,
      [timeField]: timeVal,
    };
    const updated = {
      ...localHours,
      [dayKey]: {
        ...localHours[dayKey],
        [shift]: updatedShift,
      },
    };
    setLocalHours(updated);
    updateDayHours(dayKey, { [shift]: updatedShift });
  };

  const handleShiftToggle = (dayKey, shift, enabled) => {
    const currentShift = localHours[dayKey]?.[shift] || {};
    const updatedShift = {
      ...currentShift,
      enabled,
    };
    const updated = {
      ...localHours,
      [dayKey]: {
        ...localHours[dayKey],
        [shift]: updatedShift,
      },
    };
    setLocalHours(updated);
    updateDayHours(dayKey, { [shift]: updatedShift });
  };

  // Quick Presets
  const applyStandardWeekdays = () => {
    const updated = { ...localHours };
    ['tuesday', 'wednesday', 'thursday', 'friday'].forEach((k) => {
      updated[k] = {
        ...updated[k],
        closed: false,
        lunch: { open: '12:00', close: '14:30', enabled: true },
        dinner: { open: '19:00', close: '23:30', enabled: true },
      };
    });
    setLocalHours(updated);
    updateAllOpeningHours(updated);
  };

  const applyWeekendExtended = () => {
    const updated = { ...localHours };
    updated.saturday = {
      ...updated.saturday,
      closed: false,
      lunch: { open: '12:00', close: '15:00', enabled: true },
      dinner: { open: '19:00', close: '00:30', enabled: true },
    };
    updated.sunday = {
      ...updated.sunday,
      closed: false,
      lunch: { open: '12:00', close: '15:00', enabled: true },
      dinner: { open: '19:00', close: '23:30', enabled: true },
    };
    setLocalHours(updated);
    updateAllOpeningHours(updated);
  };

  // Holiday Modal Handlers
  const handleOpenAddHoliday = () => {
    setEditingHolidayId(null);
    setHolidayFormData({
      name: '',
      type: 'ferie',
      startDate: getTodayDateString(),
      endDate: getTodayDateString(),
      notes: 'Ci prendiamo una breve pausa! Riapriremo regolarmente con il consueto menù.',
      bannerActive: true,
    });
    setIsHolidayModalOpen(true);
  };

  const handleOpenEditHoliday = (hol) => {
    setEditingHolidayId(hol.id);
    setHolidayFormData({
      name: hol.name,
      type: hol.type || 'ferie',
      startDate: hol.startDate,
      endDate: hol.endDate,
      notes: hol.notes || '',
      bannerActive: hol.bannerActive !== undefined ? hol.bannerActive : true,
    });
    setIsHolidayModalOpen(true);
  };

  const handleSaveHolidaySubmit = (e) => {
    e.preventDefault();
    if (!holidayFormData.name.trim()) return;

    if (editingHolidayId) {
      updateHoliday(editingHolidayId, holidayFormData);
    } else {
      addHoliday(holidayFormData);
    }
    setIsHolidayModalOpen(false);
  };

  // Helper: Format date strings for display (e.g. 2026-08-10 -> 10 Ago 2026)
  const formatHolidayDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length < 3) return dateStr;
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    const d = Number(parts[2]);
    const m = months[Number(parts[1]) - 1] || '';
    const y = parts[0];
    return `${d} ${m} ${y}`;
  };

  // Helper: Calculate holiday status and duration
  const getHolidayStatus = (startDate, endDate) => {
    const today = getTodayDateString();
    if (today >= startDate && today <= endDate) {
      return {
        label: 'In Corso Ora',
        badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse',
        isCurrent: true,
      };
    } else if (today < startDate) {
      // Days remaining
      const tDate = new Date(today);
      const sDate = new Date(startDate);
      const diffTime = Math.abs(sDate - tDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        label: `In Arrivo (tra ${diffDays} gg)`,
        badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        isUpcoming: true,
      };
    } else {
      return {
        label: 'Concluso',
        badgeClass: 'bg-white/10 text-white/40 border-white/10',
        isPast: true,
      };
    }
  };

  const calculateDaysCount = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    const diffTime = d2 - d1;
    const days = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : 1;
  };

  // Count stats
  const activeHolidaysCount = holidays.filter((h) => {
    const status = getHolidayStatus(h.startDate, h.endDate);
    return !status.isPast;
  }).length;

  const currentOngoingHoliday = holidays.find((h) => {
    const status = getHolidayStatus(h.startDate, h.endDate);
    return status.isCurrent;
  });

  const closedDaysCount = DAY_KEYS.filter((d) => localHours[d.key]?.closed).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ============================================================ */}
      {/* TOP HERO & SUMMARY BAR                                       */}
      {/* ============================================================ */}
      <div className="bg-[#181818] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#ffa323]/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MoustacheIcon className="w-5 h-2.5 text-[#d2401e]" />
              <span className="text-xs font-oswald text-[#ffa323] tracking-[0.25em] uppercase font-bold">
                ORARI & CHIUSURE AZIENDALI
              </span>
            </div>
            <h2 className="font-oswald text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
              GESTIONE ORARI DI APERTURA & FERIE
            </h2>
            <p className="text-white/70 text-xs sm:text-sm font-sans mt-1 max-w-2xl">
              Configura i turni di servizio settimanali (pranzo e cena), i giorni di riposo, e programma i periodi di ferie o chiusure speciali con avviso automatico per i clienti.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#121212] border border-white/10 rounded-2xl px-4 py-3 min-w-[130px]">
              <span className="text-[10px] font-oswald text-white/50 uppercase tracking-wider block">
                Giorni Chiusura
              </span>
              <span className="font-oswald text-xl font-black text-amber-400">
                {closedDaysCount === 0 ? 'Sempre Aperto' : `${closedDaysCount} Giorno/Sett.`}
              </span>
            </div>

            <div className="bg-[#121212] border border-white/10 rounded-2xl px-4 py-3 min-w-[130px]">
              <span className="text-[10px] font-oswald text-white/50 uppercase tracking-wider block">
                Ferie Programmate
              </span>
              <span className="font-oswald text-xl font-black text-[#ffa323]">
                {activeHolidaysCount} {activeHolidaysCount === 1 ? 'Periodo' : 'Periodi'}
              </span>
            </div>

            {currentOngoingHoliday ? (
              <div className="bg-rose-500/15 border border-rose-500/40 rounded-2xl px-4 py-3 min-w-[150px] animate-pulse">
                <span className="text-[10px] font-oswald text-rose-300 uppercase tracking-wider block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Stato Attuale
                </span>
                <span className="font-oswald text-sm font-bold text-rose-200">
                  CHIUSO PER FERIE
                </span>
              </div>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-4 py-3 min-w-[140px]">
                <span className="text-[10px] font-oswald text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                  Stato Locale
                </span>
                <span className="font-oswald text-base font-bold text-emerald-300">
                  Aperto Regolarmente
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex bg-[#121212] p-1.5 rounded-2xl border border-white/10 gap-1.5">
            <button
              onClick={() => setSubTab('weekly')}
              className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                subTab === 'weekly'
                  ? 'bg-gradient-to-r from-[#ffa323] to-[#ffb84d] text-black shadow-lg shadow-[#ffa323]/30 scale-105'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>🕒 Orari Settimanali Standard</span>
            </button>

            <button
              onClick={() => setSubTab('holidays')}
              className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                subTab === 'holidays'
                  ? 'bg-gradient-to-r from-[#d2401e] to-[#ff5722] text-white shadow-lg shadow-[#d2401e]/30 scale-105'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <CalendarOff className="w-4 h-4" />
              <span>🏖️ Ferie & Chiusure Straordinarie ({holidays.length})</span>
            </button>

            <button
              onClick={() => setSubTab('preview')}
              className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                subTab === 'preview'
                  ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg shadow-[#10b981]/30 scale-105'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>📢 Anteprima Avviso Clienti</span>
            </button>
          </div>

          {/* Quick Action Presets on Weekly tab */}
          {subTab === 'weekly' && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={applyStandardWeekdays}
                title="Imposta Mar-Ven con orari standard (12:00-14:30 / 19:00-23:30)"
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 rounded-xl font-oswald text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Applica Standard Mar-Ven
              </button>
              <button
                onClick={applyWeekendExtended}
                title="Imposta Sabato e Domenica con orari weekend prolungati"
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 rounded-xl font-oswald text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Prolunga Weekend
              </button>
              <button
                onClick={resetOpeningHours}
                title="Ripristina la configurazione orari originale di default"
                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl font-oswald text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Default</span>
              </button>
            </div>
          )}

          {/* New Holiday button on Holidays tab */}
          {subTab === 'holidays' && (
            <button
              onClick={handleOpenAddHoliday}
              className="px-5 py-2.5 bg-gradient-to-r from-[#d2401e] to-[#ffa323] hover:from-[#b83314] hover:to-[#d2401e] text-white font-oswald text-xs font-bold tracking-[0.15em] uppercase rounded-xl transition-all shadow-lg shadow-[#d2401e]/30 flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>+ Aggiungi Ferie / Chiusura</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: WEEKLY OPERATING SCHEDULE (ORARI SETTIMANALI)        */}
      {/* ============================================================ */}
      {subTab === 'weekly' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {DAY_KEYS.map(({ key, label }) => {
              const dayData = localHours[key] || {
                closed: false,
                lunch: { open: '12:00', close: '14:30', enabled: true },
                dinner: { open: '19:00', close: '23:30', enabled: true },
              };
              const isClosed = dayData.closed;

              return (
                <div
                  key={key}
                  className={`bg-[#181818] border rounded-2xl p-5 transition-all shadow-xl ${
                    isClosed
                      ? 'border-rose-500/20 bg-[#161313]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left: Day Label & Master Closed Switch */}
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-oswald text-base font-black ${
                          isClosed
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-[#ffa323]/20 text-[#ffa323] border border-[#ffa323]/30'
                        }`}
                      >
                        {label.substring(0, 3).toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-oswald text-lg font-bold text-white uppercase tracking-wide">
                          {label}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!isClosed}
                              onChange={(e) =>
                                handleDayFieldChange(key, 'closed', !e.target.checked)
                              }
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                          </label>
                          <span
                            className={`text-xs font-oswald uppercase tracking-wider font-semibold ${
                              isClosed ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {isClosed ? 'Chiuso tutto il giorno' : 'Aperto'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Shifts Controls (Lunch & Dinner) */}
                    {!isClosed ? (
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* PRANZO (LUNCH) */}
                        <div
                          className={`p-4 rounded-xl border transition-all ${
                            dayData.lunch?.enabled
                              ? 'bg-[#202020] border-amber-500/30'
                              : 'bg-[#151515] border-white/5 opacity-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-amber-400 font-oswald text-xs font-bold uppercase tracking-wider">
                              <Sun className="w-4 h-4" />
                              <span>☀️ Turno Pranzo</span>
                            </div>
                            <label className="flex items-center gap-1.5 text-xs text-white/70 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!dayData.lunch?.enabled}
                                onChange={(e) =>
                                  handleShiftToggle(key, 'lunch', e.target.checked)
                                }
                                className="rounded accent-[#ffa323]"
                              />
                              <span className="font-oswald text-[11px] uppercase">
                                {dayData.lunch?.enabled ? 'Attivo' : 'Disabilitato'}
                              </span>
                            </label>
                          </div>

                          {dayData.lunch?.enabled ? (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-oswald text-white/50 uppercase mb-1">
                                  Apertura
                                </label>
                                <input
                                  type="time"
                                  value={dayData.lunch?.open || '12:00'}
                                  onChange={(e) =>
                                    handleShiftTimeChange(
                                      key,
                                      'lunch',
                                      'open',
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-1.5 bg-[#121212] border border-white/15 rounded-lg text-xs font-mono text-white focus:border-[#ffa323] focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-oswald text-white/50 uppercase mb-1">
                                  Chiusura
                                </label>
                                <input
                                  type="time"
                                  value={dayData.lunch?.close || '14:30'}
                                  onChange={(e) =>
                                    handleShiftTimeChange(
                                      key,
                                      'lunch',
                                      'close',
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-1.5 bg-[#121212] border border-white/15 rounded-lg text-xs font-mono text-white focus:border-[#ffa323] focus:outline-none"
                                />
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-white/40 italic py-1">
                              Servizio pranzo non attivo
                            </p>
                          )}
                        </div>

                        {/* CENA (DINNER) */}
                        <div
                          className={`p-4 rounded-xl border transition-all ${
                            dayData.dinner?.enabled
                              ? 'bg-[#202020] border-[#d2401e]/40'
                              : 'bg-[#151515] border-white/5 opacity-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-[#ff5722] font-oswald text-xs font-bold uppercase tracking-wider">
                              <Moon className="w-4 h-4" />
                              <span>🌙 Turno Cena</span>
                            </div>
                            <label className="flex items-center gap-1.5 text-xs text-white/70 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!dayData.dinner?.enabled}
                                onChange={(e) =>
                                  handleShiftToggle(key, 'dinner', e.target.checked)
                                }
                                className="rounded accent-[#d2401e]"
                              />
                              <span className="font-oswald text-[11px] uppercase">
                                {dayData.dinner?.enabled ? 'Attivo' : 'Disabilitato'}
                              </span>
                            </label>
                          </div>

                          {dayData.dinner?.enabled ? (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-oswald text-white/50 uppercase mb-1">
                                  Apertura
                                </label>
                                <input
                                  type="time"
                                  value={dayData.dinner?.open || '19:00'}
                                  onChange={(e) =>
                                    handleShiftTimeChange(
                                      key,
                                      'dinner',
                                      'open',
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-1.5 bg-[#121212] border border-white/15 rounded-lg text-xs font-mono text-white focus:border-[#ffa323] focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-oswald text-white/50 uppercase mb-1">
                                  Chiusura
                                </label>
                                <input
                                  type="time"
                                  value={dayData.dinner?.close || '23:30'}
                                  onChange={(e) =>
                                    handleShiftTimeChange(
                                      key,
                                      'dinner',
                                      'close',
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-1.5 bg-[#121212] border border-white/15 rounded-lg text-xs font-mono text-white focus:border-[#ffa323] focus:outline-none"
                                />
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-white/40 italic py-1">
                              Servizio cena non attivo
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CalendarOff className="w-5 h-5 text-rose-400" />
                          <div>
                            <span className="font-oswald text-xs font-bold text-rose-300 uppercase tracking-wider block">
                              Giorno di Riposo Settimanale
                            </span>
                            <span className="text-xs text-white/60 font-sans">
                              Nessuna prenotazione accettata per {label.toLowerCase()}.
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDayFieldChange(key, 'closed', false)}
                          className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-oswald uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Riapri Giorno
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: HOLIDAYS & SPECIAL CLOSURES (FERIE & CHIUSURE)         */}
      {/* ============================================================ */}
      {subTab === 'holidays' && (
        <div className="space-y-6">
          {holidays.length === 0 ? (
            <div className="bg-[#181818] border border-dashed border-white/15 rounded-3xl p-12 text-center">
              <CalendarOff className="w-12 h-12 text-[#ffa323] mx-auto mb-4 opacity-70" />
              <h3 className="font-oswald text-xl font-bold uppercase text-white mb-2">
                Nessun Periodo di Ferie o Chiusura Programmato
              </h3>
              <p className="text-sm text-white/60 font-sans max-w-md mx-auto mb-6">
                Aggiungi le ferie aziendali estive, le festività invernali o chiusure per ristrutturazione per bloccare automaticamente le prenotazioni e avvisare i clienti.
              </p>
              <button
                onClick={handleOpenAddHoliday}
                className="px-6 py-3 bg-[#d2401e] hover:bg-[#b83314] text-white font-oswald text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow-lg cursor-pointer"
              >
                + Aggiungi Primo Periodo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {holidays.map((hol) => {
                const status = getHolidayStatus(hol.startDate, hol.endDate);
                const totalDays = calculateDaysCount(hol.startDate, hol.endDate);

                return (
                  <div
                    key={hol.id}
                    className={`bg-[#181818] border rounded-3xl p-6 transition-all shadow-xl relative overflow-hidden flex flex-col justify-between gap-4 ${
                      status.isCurrent
                        ? 'border-rose-500/50 bg-[#1d1414] shadow-rose-900/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      {/* Card Header: Type Badge & Status */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[10px] font-oswald uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg border ${
                            hol.type === 'ferie'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : hol.type === 'festivita'
                              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {hol.type === 'ferie'
                            ? '🏖️ Ferie Aziendali'
                            : hol.type === 'festivita'
                            ? '🎄 Festività'
                            : '🚧 Chiusura Straordinaria'}
                        </span>

                        <span
                          className={`text-[10px] font-oswald uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg border ${status.badgeClass}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-oswald text-xl font-bold text-white uppercase tracking-wide mb-1">
                        {hol.name}
                      </h3>

                      {/* Date Range & Total Days */}
                      <div className="flex items-center gap-2 text-xs font-mono text-[#ffa323] mb-3">
                        <Calendar className="w-3.5 h-3.5 text-white/50" />
                        <span>
                          {formatHolidayDate(hol.startDate)} → {formatHolidayDate(hol.endDate)}
                        </span>
                        <span className="text-[11px] font-sans font-normal text-white/40">
                          ({totalDays} {totalDays === 1 ? 'giorno' : 'giorni'})
                        </span>
                      </div>

                      {/* Client Note / Message */}
                      {hol.notes && (
                        <p className="text-xs text-white/70 font-sans bg-black/30 p-3 rounded-xl border border-white/5 leading-relaxed">
                          💬 "{hol.notes}"
                        </p>
                      )}
                    </div>

                    {/* Footer Actions: Banner toggle + Edit & Delete */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      <label className="flex items-center gap-2 text-xs cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={hol.bannerActive}
                          onChange={() => toggleHolidayBanner(hol.id)}
                          className="rounded accent-emerald-500 cursor-pointer"
                        />
                        <span
                          className={`font-oswald text-[11px] uppercase tracking-wider ${
                            hol.bannerActive
                              ? 'text-emerald-400 font-bold'
                              : 'text-white/40 group-hover:text-white/70'
                          }`}
                        >
                          {hol.bannerActive ? '📢 Banner Attivo sul Sito' : 'Banner Disattivato'}
                        </span>
                      </label>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditHoliday(hol)}
                          className="p-2 hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Modifica periodo"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Sei sicuro di voler rimuovere "${hol.name}"?`)) {
                              deleteHoliday(hol.id);
                            }
                          }}
                          className="p-2 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg transition-colors cursor-pointer"
                          title="Elimina periodo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: CUSTOMER BANNER & RESERVATION ALERT PREVIEW            */}
      {/* ============================================================ */}
      {subTab === 'preview' && (
        <div className="space-y-6">
          <div className="bg-[#181818] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Megaphone className="w-5 h-5 text-emerald-400" />
                <h3 className="font-oswald text-xl font-bold uppercase text-white">
                  Anteprima Live: Avvisi & Banner Pubblici per i Clienti
                </h3>
              </div>
              <p className="text-xs text-white/60 font-sans max-w-2xl">
                Ecco come i tuoi clienti visualizzeranno le comunicazioni sulle ferie aziendali e i giorni di chiusura sia nella homepage del sito che all'interno del modulo di prenotazione tavoli.
              </p>
            </div>

            {/* Banner 1: Header / Top Announcement Banner */}
            <div className="space-y-2">
              <span className="text-[11px] font-oswald text-[#ffa323] uppercase tracking-wider font-bold">
                1. Banner Notifiche in Cima al Sito Web (Top Announcement)
              </span>
              <div className="bg-gradient-to-r from-amber-600/90 via-[#d2401e]/90 to-amber-700/90 border border-amber-400/40 rounded-2xl p-4 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <span className="text-lg">🏖️</span>
                  </div>
                  <div>
                    <h4 className="font-oswald text-sm font-bold uppercase tracking-wider">
                      {holidays[0]?.name || 'AVVISO FERIE ESTIVE SAPORE VERACE'}
                    </h4>
                    <p className="text-xs text-white/90 font-sans">
                      {holidays[0]?.notes ||
                        'Saremo chiusi per ferie dal 10 al 24 Agosto. Riapertura regolare Martedì 25 Agosto.'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-oswald font-bold uppercase px-3 py-1 rounded-full bg-black/30 border border-white/20 shrink-0">
                  {holidays[0] ? `${formatHolidayDate(holidays[0].startDate)} - ${formatHolidayDate(holidays[0].endDate)}` : 'Periodo Attivo'}
                </span>
              </div>
            </div>

            {/* Banner 2: Alert within Booking Widget */}
            <div className="space-y-2">
              <span className="text-[11px] font-oswald text-[#ffa323] uppercase tracking-wider font-bold">
                2. Notifica Istantanea nel Modulo Prenotazione Tavoli
              </span>
              <div className="bg-[#121212] border border-rose-500/40 rounded-2xl p-5 text-white max-w-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-oswald text-sm font-bold text-rose-400 uppercase tracking-wide">
                      Data Non Disponibile per Prenotazioni
                    </h5>
                    <p className="text-xs text-white/80 font-sans mt-1 leading-relaxed">
                      Siamo spiacenti, in questa data il ristorante è chiuso per <strong>{holidays[0]?.name || 'Ferie Aziendali'}</strong> ({holidays[0]?.notes || 'Chiusura programmata'}). Ti invitiamo a selezionare un'altra data disponibile.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT HOLIDAY                                    */}
      {/* ============================================================ */}
      {isHolidayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#181818] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#d2401e] to-[#ffa323] flex items-center justify-center text-white shadow-lg">
                  <CalendarOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-oswald text-lg sm:text-xl font-bold uppercase text-white">
                    {editingHolidayId ? 'Modifica Chiusura / Ferie' : 'Nuovo Periodo di Ferie / Chiusura'}
                  </h3>
                  <span className="text-[11px] font-oswald text-[#ffa323] uppercase tracking-wider font-semibold">
                    Configurazione Date & Notifiche
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsHolidayModalOpen(false)}
                className="p-1.5 text-white/50 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveHolidaySubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-oswald text-white/70 uppercase tracking-wider mb-1">
                  Titolo / Motivo Chiusura *
                </label>
                <input
                  type="text"
                  required
                  value={holidayFormData.name}
                  onChange={(e) =>
                    setHolidayFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="es. Ferie Estive di Ferragosto"
                  className="w-full px-4 py-2.5 bg-[#121212] border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#ffa323] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-oswald text-white/70 uppercase tracking-wider mb-1">
                  Tipologia
                </label>
                <select
                  value={holidayFormData.type}
                  onChange={(e) =>
                    setHolidayFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-[#121212] border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:border-[#ffa323] focus:outline-none cursor-pointer"
                >
                  <option value="ferie">🏖️ Ferie Aziendali (Vacation)</option>
                  <option value="festivita">🎄 Festività (Natale, Capodanno, Pasqua)</option>
                  <option value="straordinaria">🚧 Chiusura Straordinaria / Lavori</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-oswald text-white/70 uppercase tracking-wider mb-1">
                    Data Inizio *
                  </label>
                  <input
                    type="date"
                    required
                    value={holidayFormData.startDate}
                    onChange={(e) =>
                      setHolidayFormData((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/15 rounded-xl text-xs sm:text-sm font-mono text-white focus:border-[#ffa323] focus:outline-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-oswald text-white/70 uppercase tracking-wider mb-1">
                    Data Fine *
                  </label>
                  <input
                    type="date"
                    required
                    value={holidayFormData.endDate}
                    onChange={(e) =>
                      setHolidayFormData((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/15 rounded-xl text-xs sm:text-sm font-mono text-white focus:border-[#ffa323] focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-oswald text-white/70 uppercase tracking-wider mb-1">
                  Messaggio Pubblico per i Clienti
                </label>
                <textarea
                  rows={3}
                  value={holidayFormData.notes}
                  onChange={(e) =>
                    setHolidayFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="es. Ci prendiamo una breve pausa! Riapriremo regolarmente con il consueto menù estivo."
                  className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:border-[#ffa323] focus:outline-none resize-none"
                />
              </div>

              <div className="bg-[#121212] p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-oswald text-xs uppercase font-bold text-white block">
                    Mostra Banner Avviso sul Sito
                  </span>
                  <span className="text-[11px] text-white/50 font-sans">
                    Attiva la fascia di avviso in evidenza sulla homepage
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={holidayFormData.bannerActive}
                  onChange={(e) =>
                    setHolidayFormData((prev) => ({ ...prev, bannerActive: e.target.checked }))
                  }
                  className="w-5 h-5 rounded accent-[#10b981] cursor-pointer"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsHolidayModalOpen(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-oswald text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#d2401e] to-[#ffa323] hover:from-[#b83314] hover:to-[#d2401e] text-white font-oswald text-xs font-bold tracking-[0.15em] uppercase rounded-xl transition-all shadow-md cursor-pointer hover:scale-105"
                >
                  {editingHolidayId ? 'Salva Modifiche' : 'Crea Periodo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
