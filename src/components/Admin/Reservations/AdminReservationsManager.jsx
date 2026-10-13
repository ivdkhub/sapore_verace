import React, { useState, useMemo, useEffect } from 'react';
import { useAdmin, getTodayDateString, PENDING_STATUS } from '../../../context/AdminContext';
import {
  Users,
  Clock,
  Phone,
  FileText,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  UserCheck,
  X,
  UtensilsCrossed,
  LayoutList,
  LayoutGrid,
} from 'lucide-react';

export const AdminReservationsManager = () => {
  const {
    tables,
    selectedDate,
    setSelectedDate,
    activeShift,
    setActiveShift,
    setIsCalendarOpen,
    saveReservation,
    clearTable,
    findBestFreeTable,
    coversCapacity,
    getMaxCovers,
    setMaxCoversForShift,
    setDefaultMaxCovers,
  } = useAdmin();

  // Coperti massimi del turno selezionato e valore predefinito (campi modificabili)
  const maxCovers = getMaxCovers(selectedDate, activeShift);
  const hasShiftOverride = coversCapacity?.overrides?.[`${selectedDate}_${activeShift}`] !== undefined;
  const [shiftCoversInput, setShiftCoversInput] = useState(String(maxCovers));
  const [defaultCoversInput, setDefaultCoversInput] = useState(String(coversCapacity?.default ?? ''));
  useEffect(() => setShiftCoversInput(String(maxCovers)), [maxCovers, selectedDate, activeShift]);
  useEffect(() => setDefaultCoversInput(String(coversCapacity?.default ?? '')), [coversCapacity?.default]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'In Attesa' | 'Seduti' | 'Confermata' | 'Completata'
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Modal State for New/Edit Reservation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null); // null if new, table obj if editing

  // Form Fields
  const [formData, setFormData] = useState({
    clientName: '',
    guests: 4,
    time: '20:00',
    phone: '',
    notes: '',
    status: 'In Attesa',
    tableId: '',
  });

  // Extract all currently reserved tables
  const reservedTables = useMemo(() => {
    return (tables || [])
      .filter((t) => t.reservation !== null)
      .map((t) => ({
        tableId: t.id,
        tableName: t.name,
        seats: t.seats || 4,
        room: t.room || 'main',
        ...t.reservation,
      }))
      .sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
  }, [tables]);

  // Free tables available for assignment
  const freeTables = useMemo(() => {
    return (tables || []).filter((t) => t.reservation === null);
  }, [tables]);

  // Filtered reservations based on search and status
  const filteredReservations = useMemo(() => {
    return reservedTables.filter((res) => {
      // Status filter
      if (statusFilter !== 'all') {
        const resStatus = res.status || 'Confermata';
        if (resStatus.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (res.clientName || res.name || '').toLowerCase().includes(q);
        const phoneMatch = (res.phone || '').toLowerCase().includes(q);
        const codeMatch = (res.code || '').toLowerCase().includes(q);
        const notesMatch = (res.notes || '').toLowerCase().includes(q);
        const tableMatch = (res.tableName || '').toLowerCase().includes(q);
        if (!nameMatch && !phoneMatch && !codeMatch && !notesMatch && !tableMatch) return false;
      }

      return true;
    });
  }, [reservedTables, statusFilter, searchQuery]);

  // Real-time quick stats
  const stats = useMemo(() => {
    const totalReservations = reservedTables.length;
    const isPending = (r) => r.status === PENDING_STATUS;
    // le richieste "Da Confermare" non occupano coperti finché lo staff non le conferma (come sul server)
    const totalGuests = reservedTables.filter((r) => !isPending(r)).reduce((sum, r) => sum + (Number(r.guests) || 0), 0);
    const pendingCount = reservedTables.filter(isPending).length;
    const pendingGuests = reservedTables.filter(isPending).reduce((sum, r) => sum + (Number(r.guests) || 0), 0);
    const waitingCount = reservedTables.filter((r) => (r.status || '').toLowerCase().includes('attesa')).length;
    const seatedCount = reservedTables.filter((r) => (r.status || '').toLowerCase().includes('sedut')).length;
    const availableTablesCount = freeTables.length;
    const totalTablesCount = (tables || []).length;

    return {
      totalReservations,
      totalGuests,
      pendingCount,
      pendingGuests,
      waitingCount,
      seatedCount,
      availableTablesCount,
      totalTablesCount,
    };
  }, [reservedTables, freeTables, tables]);

  // Filtro "Da Confermare" attivo ma nessuna richiesta rimasta (es. appena confermata): torna a "Tutti"
  useEffect(() => {
    if (statusFilter === PENDING_STATUS && stats.pendingCount === 0) setStatusFilter('all');
  }, [statusFilter, stats.pendingCount]);

  // Date stepper
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

  const handleSetQuickDate = (type) => {
    const today = new Date();
    if (type === 'today') {
      setSelectedDate(getTodayDateString());
    } else if (type === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const newY = tomorrow.getFullYear();
      const newM = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const newD = String(tomorrow.getDate()).padStart(2, '0');
      setSelectedDate(`${newY}-${newM}-${newD}`);
    }
  };

  // Helper date formatting
  const formatDateItalian = (dateStr) => {
    if (!dateStr) return { main: 'Seleziona Data', isToday: false, isTomorrow: false };
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
      'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];

    return {
      main: `${weekdays[dateObj.getDay()]} ${dateObj.getDate()} ${months[dateObj.getMonth()]} ${y}`,
      isToday,
      isTomorrow,
    };
  };

  const formattedDate = formatDateItalian(selectedDate);

  // Quick state toggle
  const handleUpdateStatus = (tableId, currentRes, newStatus) => {
    // Togli i campi del tavolo aggiunti per la lista: nella prenotazione restano solo i suoi dati
    // eslint-disable-next-line no-unused-vars
    const { tableId: _id, tableName, seats, room, ...reservation } = currentRes;
    saveReservation(tableId, { ...reservation, status: newStatus }, tableId);
  };

  // Open modal for NEW reservation
  const handleOpenNewModal = () => {
    const defaultTime = activeShift === 'pranzo' ? '13:00' : '20:30';
    const bestTable = findBestFreeTable ? findBestFreeTable(4, null, tables) : (freeTables[0] || null);

    setEditingTable(null);
    setFormData({
      clientName: '',
      guests: 4,
      time: defaultTime,
      phone: '',
      notes: '',
      status: 'In Attesa',
      tableId: bestTable ? bestTable.id : '',
    });
    setIsModalOpen(true);
  };

  // Open modal for EDITING reservation
  const handleOpenEditModal = (resItem) => {
    const matchingTable = (tables || []).find((t) => t.id === resItem.tableId);
    setEditingTable(matchingTable || null);
    setFormData({
      clientName: resItem.clientName || resItem.name || '',
      guests: resItem.guests || 4,
      time: resItem.time || '20:00',
      phone: resItem.phone || '',
      notes: resItem.notes || '',
      status: resItem.status || 'Confermata',
      tableId: resItem.tableId,
    });
    setIsModalOpen(true);
  };

  // Save Modal Submit
  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!formData.clientName.trim()) {
      alert('Inserisci il nome del cliente.');
      return;
    }

    // Determine target table
    let targetTableId = formData.tableId;
    if (!targetTableId) {
      const best = findBestFreeTable ? findBestFreeTable(Number(formData.guests), null, tables) : freeTables[0];
      if (best) {
        targetTableId = best.id;
      } else {
        alert('Tutti i tavoli sono al momento occupati per questo turno! Seleziona un tavolo o libera spazio.');
        return;
      }
    }

    const sourceTableId = editingTable ? editingTable.id : null;

    const saved = saveReservation(
      targetTableId,
      {
        // dati originali (email, origine online, data di creazione) mantenuti nella modifica
        ...(editingTable?.reservation || {}),
        clientName: formData.clientName.trim(),
        name: formData.clientName.trim(),
        guests: Number(formData.guests),
        time: formData.time,
        phone: formData.phone.trim(),
        notes: formData.notes.trim(),
        status: formData.status,
        code: editingTable?.reservation?.code || `SV-${Math.floor(1000 + Math.random() * 9000)}`,
      },
      sourceTableId
    );

    if (saved) setIsModalOpen(false);
  };

  // Cancel reservation
  const handleCancelReservation = (tableId, clientName) => {
    if (window.confirm(`Sei sicuro di voler cancellare la prenotazione per "${clientName || 'Cliente'}"? Il tavolo verrà liberato.`)) {
      clearTable(tableId);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ============================================================ */}
      {/* 1. TOP CONTROL BAR (Date, Shift, and New Reservation CTA)    */}
      {/* ============================================================ */}
      <div className="bg-[#181818] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[11px] font-oswald text-[#ffa323] tracking-[0.2em] uppercase font-bold">
              GESTIONE PRENOTAZIONI OPERATIVA
            </span>
          </div>
          <h2 className="font-oswald text-2xl sm:text-3xl font-black uppercase text-white tracking-wide flex items-center gap-2">
            <span>📅 Prenotazioni Sala</span>
            <span className="text-sm font-sans font-normal text-white/50">
              ({reservedTables.length} attive)
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Shift Switcher */}
          <div className="inline-flex bg-[#0f0f0f] p-1.5 rounded-2xl border border-white/10 shadow-inner">
            <button
              onClick={() => setActiveShift('pranzo')}
              className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeShift === 'pranzo'
                  ? 'bg-gradient-to-r from-[#ffa323] to-[#ffb84d] text-black shadow-lg shadow-[#ffa323]/30 scale-105'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>☀️ Turno Pranzo</span>
            </button>
            <button
              onClick={() => setActiveShift('cena')}
              className={`px-4 py-2 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeShift === 'cena'
                  ? 'bg-gradient-to-r from-[#d2401e] to-[#ff5722] text-white shadow-lg shadow-[#d2401e]/30 scale-105'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>🌙 Turno Cena</span>
            </button>
          </div>

          {/* Date Selector with Stepper */}
          <div className="flex items-center bg-[#0f0f0f] rounded-2xl border border-white/10 p-1 shadow-inner">
            <button
              onClick={() => handleStepDay(-1)}
              title="Giorno precedente"
              className="p-2 hover:bg-white/10 text-white/70 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsCalendarOpen(true)}
              className="px-3.5 py-1.5 flex items-center gap-2 hover:bg-white/5 rounded-xl transition-all cursor-pointer group"
              title="Apri calendario mensile"
            >
              <Calendar className="w-4 h-4 text-[#ffa323] group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="font-oswald text-xs sm:text-sm font-bold uppercase text-white tracking-wider block leading-none">
                  {formattedDate.main}
                </span>
                {formattedDate.isToday && (
                  <span className="text-[10px] font-oswald font-bold text-[#10b981] tracking-wider uppercase block mt-0.5">
                    ● OGGI
                  </span>
                )}
                {formattedDate.isTomorrow && (
                  <span className="text-[10px] font-oswald font-bold text-[#ffa323] tracking-wider uppercase block mt-0.5">
                    ● DOMANI
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => handleStepDay(1)}
              title="Giorno successivo"
              className="p-2 hover:bg-white/10 text-white/70 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Date Pills */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => handleSetQuickDate('today')}
              className={`px-3 py-1.5 rounded-xl font-oswald text-xs font-bold uppercase transition-all cursor-pointer border ${
                formattedDate.isToday
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              Oggi
            </button>
            <button
              onClick={() => handleSetQuickDate('tomorrow')}
              className={`px-3 py-1.5 rounded-xl font-oswald text-xs font-bold uppercase transition-all cursor-pointer border ${
                formattedDate.isTomorrow
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              Domani
            </button>
          </div>

          {/* CTA: NEW RESERVATION BUTTON */}
          <button
            onClick={handleOpenNewModal}
            className="px-5 py-2.5 bg-gradient-to-r from-[#d2401e] to-[#ffa323] hover:from-[#b83314] hover:to-[#e68e17] text-white font-oswald text-xs sm:text-sm font-black uppercase tracking-wider rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-[#d2401e]/30 cursor-pointer active:scale-95 hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nuova Prenotazione</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. REAL-TIME STATS CARDS                                     */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Reservations */}
        <div className="bg-[#181818] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs font-oswald text-white/50 uppercase tracking-widest block">
              Prenotazioni Turno
            </span>
            <h3 className="font-oswald text-3xl font-black text-white mt-1">
              {stats.totalReservations}
            </h3>
            <span className="text-[11px] text-[#ffa323] font-oswald">
              {stats.availableTablesCount} tavoli ancora liberi
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ffa323]">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Total Guests / Covers */}
        <div className="bg-[#181818] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs font-oswald text-[#d2401e] uppercase tracking-widest block">
              Coperti Prenotati
            </span>
            <h3 className="font-oswald text-3xl font-black text-[#d2401e] mt-1">
              {stats.totalGuests}
              <span className="text-base text-white/40 font-bold"> / {maxCovers}</span>
            </h3>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-1 mb-1">
              <div
                className={`h-full rounded-full ${stats.totalGuests >= maxCovers ? 'bg-rose-500' : stats.totalGuests >= maxCovers * 0.8 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, maxCovers > 0 ? (stats.totalGuests / maxCovers) * 100 : 100)}%` }}
              />
            </div>
            <span className={`text-[11px] font-oswald ${stats.totalGuests >= maxCovers ? 'text-rose-400 font-bold' : 'text-white/40'}`}>
              {stats.totalGuests >= maxCovers ? 'COMPLETO' : `${maxCovers - stats.totalGuests} coperti ancora liberi`}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#d2401e]/10 border border-[#d2401e]/30 flex items-center justify-center text-[#d2401e]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* In Attesa (Upcoming) */}
        <div className="bg-[#181818] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs font-oswald text-[#ffa323] uppercase tracking-widest block">
              In Attesa di Arrivo
            </span>
            <h3 className="font-oswald text-3xl font-black text-[#ffa323] mt-1">
              {stats.waitingCount}
            </h3>
            <span className="text-[11px] text-amber-400/70 font-oswald">
              clienti in arrivo
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#ffa323]/10 border border-[#ffa323]/30 flex items-center justify-center text-[#ffa323]">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Seated (In corso) */}
        <div className="bg-[#181818] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs font-oswald text-[#10b981] uppercase tracking-widest block">
              Al Tavolo / Seduti
            </span>
            <h3 className="font-oswald text-3xl font-black text-[#10b981] mt-1">
              {stats.seatedCount}
            </h3>
            <span className="text-[11px] text-emerald-400/70 font-oswald">
              servizio in corso
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-[#10b981]">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2b. COPERTI MASSIMI (limite oltre il quale le prenotazioni online restano "Da Confermare") */}
      {/* ============================================================ */}
      <div className="bg-[#181818] p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-8">
        <div className="flex-1 min-w-0">
          <span className="text-xs font-oswald text-[#ffa323] uppercase tracking-widest block font-bold">
            Coperti massimi · {activeShift === 'pranzo' ? 'pranzo' : 'cena'} del {formattedDate.main}
          </span>
          <p className="text-xs text-white/50 font-sans mt-1">
            Oltre questo numero le prenotazioni online arrivano come <strong className="text-purple-300">Da Confermare</strong> e il
            cliente viene avvisato che lo staff lo contatterà.{' '}
            {hasShiftOverride ? 'Valore impostato solo per questo turno.' : `Si usa il valore predefinito (${coversCapacity?.default}).`}
          </p>
          <form
            className="flex flex-wrap items-center gap-2 mt-3"
            onSubmit={(e) => {
              e.preventDefault();
              const n = parseInt(shiftCoversInput, 10);
              if (Number.isNaN(n) || n < 0 || n > 999) return alert('Inserisci un numero di coperti tra 0 e 999.');
              setMaxCoversForShift(selectedDate, activeShift, n);
            }}
          >
            <input
              type="number"
              min="0"
              max="999"
              value={shiftCoversInput}
              onChange={(e) => setShiftCoversInput(e.target.value)}
              aria-label="Coperti massimi per questo turno"
              className="w-24 bg-[#0f0f0f] border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-[#ffa323]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#ffa323] hover:bg-[#e68e17] text-black text-xs font-oswald font-bold uppercase rounded-xl cursor-pointer"
            >
              Salva per questo turno
            </button>
            {hasShiftOverride && (
              <button
                type="button"
                onClick={() => setMaxCoversForShift(selectedDate, activeShift, null)}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-oswald font-bold uppercase rounded-xl cursor-pointer"
              >
                Torna al predefinito
              </button>
            )}
          </form>
        </div>
        <form
          className="lg:border-l lg:border-white/10 lg:pl-8"
          onSubmit={(e) => {
            e.preventDefault();
            const n = parseInt(defaultCoversInput, 10);
            if (Number.isNaN(n) || n < 1 || n > 999) return alert('Inserisci un numero di coperti tra 1 e 999.');
            setDefaultMaxCovers(n);
          }}
        >
          <span className="text-xs font-oswald text-white/60 uppercase tracking-widest block font-bold mb-2">
            Predefinito (ogni pranzo e cena)
          </span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="999"
              value={defaultCoversInput}
              onChange={(e) => setDefaultCoversInput(e.target.value)}
              aria-label="Coperti massimi predefiniti"
              className="w-24 bg-[#0f0f0f] border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-[#ffa323]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-oswald font-bold uppercase rounded-xl cursor-pointer"
            >
              Salva predefinito
            </button>
          </div>
        </form>
      </div>

      {stats.pendingCount > 0 && (
        <div className="bg-purple-500/10 border border-purple-400/30 rounded-2xl p-4 text-sm text-purple-200 font-sans flex items-start gap-3">
          <Phone className="w-5 h-5 shrink-0 mt-0.5 text-purple-300" />
          <span>
            <strong>{stats.pendingCount} {stats.pendingCount === 1 ? 'prenotazione da confermare' : 'prenotazioni da confermare'}</strong>{' '}
            ({stats.pendingGuests} coperti) arrivate a sala piena: chiama il cliente, poi premi «Conferma» oppure cancellala.
          </span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. FILTER, SEARCH AND VIEW TOGGLE BAR                        */}
      {/* ============================================================ */}
      <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per nome, telefono, tavolo o note..."
            className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#ffa323] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-oswald text-white/40 uppercase mr-1 hidden sm:inline-block">
            Stato:
          </span>
          {[
            { id: 'all', label: 'Tutti', count: reservedTables.length },
            ...(stats.pendingCount > 0 ? [{ id: PENDING_STATUS, label: 'Da Confermare', count: stats.pendingCount }] : []),
            { id: 'In Attesa', label: 'In Attesa', count: stats.waitingCount },
            { id: 'Seduti', label: 'Seduti', count: stats.seatedCount },
            { id: 'Confermata', label: 'Confermate', count: reservedTables.filter((r) => (r.status || '').toLowerCase() === 'confermata').length },
            { id: 'Completata', label: 'Completate', count: reservedTables.filter((r) => (r.status || '').toLowerCase() === 'completata').length },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl font-oswald text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === f.id
                  ? 'bg-[#ffa323] text-black shadow-md shadow-[#ffa323]/20 font-black'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              <span>{f.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                statusFilter === f.id ? 'bg-black/20 text-black' : 'bg-white/10 text-white/60'
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="inline-flex bg-[#0f0f0f] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode('cards')}
            title="Vista Schede"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'cards' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            title="Vista Tabella"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'table' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            <LayoutList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. RESERVATIONS LIST / GRID VIEW                             */}
      {/* ============================================================ */}
      {filteredReservations.length === 0 ? (
        <div className="bg-[#181818] rounded-3xl border border-white/10 p-12 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/30 mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="font-oswald text-xl font-bold uppercase text-white mb-2">
            Nessuna prenotazione trovata
          </h3>
          <p className="text-sm text-stone-400 font-sans max-w-md mx-auto mb-6">
            {searchQuery
              ? 'Nessun risultato corrisponde alla ricerca inserita. Prova a modificare i filtri.'
              : `Non sono presenti prenotazioni per il turno di ${activeShift} del ${formattedDate.main}.`}
          </p>
          <button
            onClick={handleOpenNewModal}
            className="px-5 py-2.5 bg-[#d2401e] hover:bg-[#b83314] text-white font-oswald text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#d2401e]/30"
          >
            <Plus className="w-4 h-4" />
            <span>Aggiungi Prenotazione per questo Turno</span>
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* --- CARDS VIEW --- */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredReservations.map((res) => {
            const isWaiting = (res.status || '').toLowerCase().includes('attesa');
            const isSeated = (res.status || '').toLowerCase().includes('sedut');
            const isCompleted = (res.status || '').toLowerCase().includes('completat');
            const isPendingRes = res.status === PENDING_STATUS;

            return (
              <div
                key={res.tableId}
                className={`bg-[#181818] hover:bg-[#1d1d1d] border rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between gap-4 group ${
                  isPendingRes ? 'border-purple-400/50 hover:border-purple-400/70' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  {/* Card Header: Time, Table & Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="px-3 py-1 rounded-xl bg-gradient-to-tr from-[#d2401e] to-[#ffa323] text-white font-oswald text-base font-black tracking-wide flex items-center gap-1 shadow-md shadow-[#d2401e]/30">
                        <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{res.time}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-oswald text-xs font-bold uppercase tracking-wider">
                        Tavolo: <strong className="text-[#ffa323]">{res.tableName}</strong>
                      </span>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-oswald text-[11px] font-bold uppercase tracking-wider ${
                        isPendingRes
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                          : isSeated
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isWaiting
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : isCompleted
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-white/10 text-white/80 border border-white/15'
                      }`}
                    >
                      {res.status || 'Confermata'}
                    </span>
                  </div>

                  {/* Client Info */}
                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="font-oswald text-lg font-bold text-white uppercase tracking-wide truncate">
                        {res.clientName || res.name || 'Cliente'}
                      </h4>
                      <span className="font-oswald text-xs text-[#ffa323] font-bold shrink-0">
                        👥 {res.guests} Coperti
                      </span>
                    </div>

                    {/* Phone */}
                    {res.phone && (
                      <div className="flex items-center gap-2 text-xs text-white/60 font-sans">
                        <Phone className="w-3.5 h-3.5 text-white/40" />
                        <a
                          href={`tel:${res.phone}`}
                          className="hover:text-[#ffa323] hover:underline transition-colors font-medium"
                        >
                          {res.phone}
                        </a>
                      </div>
                    )}

                    {/* Code */}
                    {res.code && (
                      <span className="text-[10px] text-white/40 font-mono block">
                        Codice: #{res.code}
                      </span>
                    )}

                    {/* Notes Highlight */}
                    {res.notes && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-[#ffa323]/10 border border-[#ffa323]/25 text-xs text-[#ffa323] flex items-start gap-2">
                        <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span className="italic leading-relaxed">{res.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  {/* Quick Status Changers */}
                  <div className="flex items-center gap-1.5">
                    {isPendingRes && (
                      <button
                        onClick={() => handleUpdateStatus(res.tableId, res, 'Confermata')}
                        title="Cliente richiamato: conferma la prenotazione"
                        className="px-2.5 py-1.5 bg-purple-500/20 hover:bg-purple-500/35 text-purple-200 border border-purple-400/40 rounded-lg text-xs font-oswald font-bold uppercase transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Conferma</span>
                      </button>
                    )}
                    {!isSeated && !isPendingRes && (
                      <button
                        onClick={() => handleUpdateStatus(res.tableId, res, 'Seduti')}
                        title="Segna come Seduti al tavolo"
                        className="px-2.5 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-oswald font-bold uppercase transition-all cursor-pointer flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Fai Sedere</span>
                      </button>
                    )}
                    {isSeated && (
                      <button
                        onClick={() => handleUpdateStatus(res.tableId, res, 'Completata')}
                        title="Segna come Completata / Tavolo liberabile"
                        className="px-2.5 py-1.5 bg-blue-500/15 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-oswald font-bold uppercase transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Completata</span>
                      </button>
                    )}
                  </div>

                  {/* Edit and Delete Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(res)}
                      title="Modifica prenotazione"
                      className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCancelReservation(res.tableId, res.clientName || res.name)}
                      title="Cancella prenotazione e libera tavolo"
                      className="p-1.5 text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* --- TABLE VIEW --- */
        <div className="bg-[#181818] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white">
              <thead className="bg-[#121212] border-b border-white/10 font-oswald text-[11px] tracking-widest uppercase text-white/50">
                <tr>
                  <th className="py-3.5 px-4">Orario</th>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Persone</th>
                  <th className="py-3.5 px-4">Tavolo</th>
                  <th className="py-3.5 px-4">Telefono</th>
                  <th className="py-3.5 px-4">Stato</th>
                  <th className="py-3.5 px-4">Note</th>
                  <th className="py-3.5 px-4 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredReservations.map((res) => (
                  <tr key={res.tableId} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-oswald text-sm font-bold text-[#ffa323]">
                      {res.time}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {res.clientName || res.name}
                      {res.code && (
                        <span className="block text-[10px] text-white/40 font-mono">
                          #{res.code}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-oswald font-bold text-white/90">
                      👥 {res.guests}p
                    </td>
                    <td className="py-3.5 px-4 font-oswald font-bold text-[#ffa323]">
                      {res.tableName}
                    </td>
                    <td className="py-3.5 px-4 text-white/70">
                      {res.phone ? (
                        <a href={`tel:${res.phone}`} className="hover:underline hover:text-[#ffa323]">
                          {res.phone}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-oswald font-bold uppercase ${
                        res.status === PENDING_STATUS
                          ? 'bg-purple-500/20 text-purple-300'
                          : (res.status || '').toLowerCase().includes('sedut')
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : (res.status || '').toLowerCase().includes('attesa')
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-white/10 text-white/80'
                      }`}>
                        {res.status || 'Confermata'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-white/60 italic max-w-xs truncate">
                      {res.notes || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(res)}
                          title="Modifica"
                          className="p-1.5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCancelReservation(res.tableId, res.clientName || res.name)}
                          title="Cancella"
                          className="p-1.5 hover:bg-rose-500/10 text-rose-400/60 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. MODAL CREA / MODIFICA PRENOTAZIONE                         */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-[#181818] border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-7 relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
              <div>
                <span className="text-[11px] font-oswald text-[#ffa323] tracking-[0.2em] uppercase font-bold block">
                  {editingTable ? 'MODIFICA PRENOTAZIONE' : 'NUOVA PRENOTAZIONE MANUALE'}
                </span>
                <h3 className="font-oswald text-xl font-bold uppercase text-white mt-0.5">
                  {editingTable ? `Prenotazione: ${formData.clientName || 'Cliente'}` : 'Registra Cliente'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* Client Name */}
              <div>
                <label className="block text-xs font-oswald uppercase text-white/70 mb-1.5 font-bold tracking-wider">
                  Nome e Cognome Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="es. Marco Rossi"
                  className="w-full bg-[#0f0f0f] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#ffa323] transition-colors"
                />
              </div>

              {/* Number of Guests & Quick Buttons */}
              <div>
                <label className="block text-xs font-oswald uppercase text-white/70 mb-1.5 font-bold tracking-wider flex items-center justify-between">
                  <span>Numero di Ospiti (Coperti)</span>
                  <span className="text-[#ffa323] font-bold text-sm">{formData.guests} Persone</span>
                </label>
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, guests: num })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-oswald font-bold transition-all cursor-pointer ${
                        formData.guests === num
                          ? 'bg-[#ffa323] text-black shadow-md shadow-[#ffa323]/30 font-black'
                          : 'bg-white/5 hover:bg-white/10 text-white/70'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time & Shift */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-oswald uppercase text-white/70 mb-1.5 font-bold tracking-wider">
                    Orario di Arrivo
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#0f0f0f] border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ffa323]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-oswald uppercase text-white/70 mb-1.5 font-bold tracking-wider">
                    Stato Prenotazione
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#0f0f0f] border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ffa323]"
                  >
                    <option value={PENDING_STATUS}>Da Confermare (da richiamare)</option>
                    <option value="In Attesa">In Attesa</option>
                    <option value="Confermata">Confermata</option>
                    <option value="Seduti">Seduti al Tavolo</option>
                    <option value="Completata">Completata</option>
                  </select>
                </div>
              </div>

              {/* Table Assignment */}
              <div>
                <label className="block text-xs font-oswald uppercase text-white/70 mb-1.5 font-bold tracking-wider">
                  Assegnazione Tavolo
                </label>
                <select
                  value={formData.tableId}
                  onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                  className="w-full bg-[#0f0f0f] border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ffa323]"
                >
                  <option value="">⚡ Assegna Automaticamente il Miglior Tavolo Libero</option>
                  {(tables || []).map((t) => {
                    const isCurrent = editingTable && editingTable.id === t.id;
                    const isBusy = t.reservation !== null && !isCurrent;
                    return (
                      <option key={t.id} value={t.id} disabled={isBusy}>
                        {t.name} ({t.seats} posti) - {isCurrent ? 'Tavolo Attuale' : isBusy ? `Occupato da ${t.reservation.clientName || t.reservation.name || 'altro'}` : 'Disponibile'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-oswald uppercase text-white/70 mb-1.5 font-bold tracking-wider">
                  Telefono di Contatto (Opzionale)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+39 340 1234567"
                  className="w-full bg-[#0f0f0f] border border-white/15 rounded-xl px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#ffa323]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-oswald uppercase text-white/70 mb-1.5 font-bold tracking-wider">
                  Note Speciali / Richieste
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="es. Seggiolone, compleanno, 1 celiaco, tavolo appartato..."
                  className="w-full bg-[#0f0f0f] border border-white/15 rounded-xl px-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#ffa323] resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-oswald font-bold uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#d2401e] to-[#ffa323] hover:from-[#b83314] hover:to-[#e68e17] text-white text-xs font-oswald font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#d2401e]/30 cursor-pointer active:scale-95"
                >
                  {editingTable ? 'Salva Modifiche' : 'Conferma Prenotazione'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservationsManager;
