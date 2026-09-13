import React, { useState, useEffect } from 'react';
import { X, Users, Clock, Phone, FileText, CheckCircle2, Trash2, GripHorizontal, Sparkles } from 'lucide-react';
import { useDraggableModal } from '../../../hooks/useDraggableModal';
import { useAdmin } from '../../../context/AdminContext';

export const ReservationModal = ({ isOpen, onClose, table, onSave, onClear, onDelete }) => {
  const { position, isDragging, handleDragHeader } = useDraggableModal();
  const { tables, findBestFreeTable } = useAdmin();

  const [currentTable, setCurrentTable] = useState(table);
  const [clientName, setClientName] = useState('');
  const [guests, setGuests] = useState(4);
  const [time, setTime] = useState('20:00');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Confermata');
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [isAutoAssigned, setIsAutoAssigned] = useState(false);

  useEffect(() => {
    if (table && table.reservation) {
      setCurrentTable(table);
      setClientName(table.reservation.clientName || '');
      setGuests(table.reservation.guests || 4);
      setTime(table.reservation.time || '20:00');
      setPhone(table.reservation.phone || '');
      setNotes(table.reservation.notes || '');
      setStatus(table.reservation.status || 'Confermata');
      setIsAutoAssigned(false);
    } else if (table) {
      const initialGuests = Math.min(table.seats || 4, 4);
      setClientName('');
      setGuests(initialGuests);
      setTime('20:00');
      setPhone('');
      setNotes('');
      setStatus('Confermata');

      // Auto-assign first free table fitting initialGuests
      if (findBestFreeTable) {
        const best = findBestFreeTable(initialGuests, table.id, tables);
        if (best) {
          setCurrentTable(best);
          setIsAutoAssigned(true);
        } else {
          setCurrentTable(table);
          setIsAutoAssigned(false);
        }
      } else {
        setCurrentTable(table);
        setIsAutoAssigned(false);
      }
    }
  }, [table, isOpen]);

  if (!isOpen || !table || !currentTable) return null;

  // Handle guest count change with automatic table capacity reassignment
  const handleGuestsChange = (newGuests) => {
    const validGuests = Math.max(1, Math.min(20, newGuests));
    setGuests(validGuests);

    // If new reservation, automatically find the best free table containing this capacity
    if (!table.reservation && findBestFreeTable) {
      const best = findBestFreeTable(validGuests, currentTable.id, tables);
      if (best && best.id !== currentTable.id) {
        setCurrentTable(best);
        setIsAutoAssigned(true);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert('Inserisci il nome del cliente');
      return;
    }

    const assignedTableId = currentTable.id;
    onSave(
      assignedTableId,
      {
        clientName,
        guests: Number(guests),
        maxSeats: currentTable.seats || 4,
        time,
        phone,
        notes,
        status,
      },
      table.id
    );
  };

  const TIME_SLOTS = [
    { label: 'Pranzo', icon: '☀️', slots: ['12:30', '13:00', '13:30', '14:00'] },
    { label: 'Cena 1° Turno', icon: '🍕', slots: ['19:00', '19:30', '20:00', '20:30'] },
    { label: 'Cena 2° Turno', icon: '🌙', slots: ['21:00', '21:30', '22:00'] },
  ];

  const QUICK_GUEST_COUNTS = [1, 2, 3, 4, 5, 6, 8, 10];

  // List of other free tables to allow manual override if needed
  const availableAlternativeTables = (tables || []).filter(
    (t) => t.id === currentTable.id || t.reservation === null
  );

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        className={`pointer-events-auto relative w-full max-w-lg bg-[#181818] text-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border overflow-hidden transition-shadow ${
          isDragging ? 'border-[#ffa323] shadow-[#ffa323]/25 ring-2 ring-[#ffa323]/60' : 'border-white/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (Draggable Handle) */}
        <div
          onPointerDown={handleDragHeader}
          className="flex items-center justify-between px-6 py-5 bg-[#141414] border-b border-white/10 cursor-move select-none active:cursor-grabbing"
          title="Trascina per spostare la finestra"
        >
          <div className="flex items-center gap-3">
            <GripHorizontal className="w-4 h-4 text-[#ffa323] opacity-70" />
            <span className="w-10 h-10 rounded-xl bg-[#d2401e] text-white flex items-center justify-center font-oswald font-black text-lg shadow-lg shadow-[#d2401e]/30">
              {currentTable.name}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-oswald text-xl font-extrabold uppercase tracking-wide text-white leading-none">
                  {table.reservation ? 'MODIFICA PRENOTAZIONE' : 'INSERISCI PRENOTAZIONE'}
                </h3>
                {isAutoAssigned && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-oswald text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                    <Sparkles className="w-3 h-3" /> Auto-Assegnato
                  </span>
                )}
              </div>
              <span className="text-xs text-[#ffa323] font-oswald tracking-widest uppercase mt-1 block font-semibold">
                Tavolo {currentTable.name} • {currentTable.seats || 4} Posti • Sala {currentTable.room === 'left' ? 'Sinistra' : 'Centrale'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Sei sicuro di voler eliminare il Tavolo ${currentTable.name}?`)) {
                    onDelete(currentTable.id);
                    onClose();
                  }
                }}
                className="p-2 bg-rose-500/10 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl transition-colors border border-rose-500/20 cursor-pointer"
                title="Elimina tavolo dalla piantina"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="text-white/50 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer ml-1"
              title="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 font-sans max-h-[80vh] overflow-y-auto">
          {/* Nome Cliente */}
          <div>
            <label className="block text-xs font-oswald font-bold text-white/80 uppercase tracking-widest mb-1.5">
              NOME & COGNOME CLIENTE *
            </label>
            <input
              type="text"
              required
              placeholder="es. Silvia Rossi"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#222222] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#ffa323] focus:ring-1 focus:ring-[#ffa323] text-sm font-medium"
            />
          </div>

          {/* ========================================================= */}
          {/* SELEZIONE NUMERO COPERTI (OSPITI) - CARINA & INTERATTIVA   */}
          {/* ========================================================= */}
          <div className="p-4 rounded-2xl bg-[#202020] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-oswald font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#ffa323]" />
                <span>NUMERO COPERTI (OSPITI)</span>
              </label>
              <div className="text-[11px] font-oswald text-[#ffa323] font-semibold uppercase tracking-wider">
                {guests > (currentTable.seats || 4) ? (
                  <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                    ⚠️ +{guests - (currentTable.seats || 4)} Extra Posti
                  </span>
                ) : (
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    ✓ Capienza Tavolo {currentTable.name}: {currentTable.seats || 4}p
                  </span>
                )}
              </div>
            </div>

            {/* Stepper + Big Number + Visual Guest Avatars */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#181818] border border-white/15 rounded-xl overflow-hidden shadow-inner shrink-0">
                <button
                  type="button"
                  onClick={() => handleGuestsChange(guests - 1)}
                  className="w-10 h-10 bg-white/5 hover:bg-white/15 text-white font-bold text-lg transition-colors flex items-center justify-center cursor-pointer select-none active:scale-95"
                >
                  -
                </button>
                <div className="w-14 text-center font-oswald font-black text-xl text-[#ffa323]">
                  {guests}
                </div>
                <button
                  type="button"
                  onClick={() => handleGuestsChange(guests + 1)}
                  className="w-10 h-10 bg-white/5 hover:bg-white/15 text-white font-bold text-lg transition-colors flex items-center justify-center cursor-pointer select-none active:scale-95"
                >
                  +
                </button>
              </div>

              {/* Visual Guest Avatars Pill Display */}
              <div className="flex-1 flex flex-wrap items-center gap-1.5 bg-[#181818] border border-white/10 rounded-xl p-2 min-h-[42px]">
                {Array.from({ length: Math.min(guests, 12) }).map((_, idx) => (
                  <span
                    key={idx}
                    className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#d2401e] to-[#ffa323] text-white text-[11px] font-bold flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200"
                    title={`Ospite ${idx + 1}`}
                  >
                    👤
                  </span>
                ))}
                {guests > 12 && (
                  <span className="text-xs font-oswald font-bold text-[#ffa323] px-1">
                    +{guests - 12}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Guest Count Selection Chips */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
              <span className="text-[10px] font-oswald text-white/40 uppercase tracking-wider mr-1">
                Rapido:
              </span>
              {QUICK_GUEST_COUNTS.map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => handleGuestsChange(cnt)}
                  className={`px-3 py-1 rounded-lg text-xs font-oswald font-bold transition-all cursor-pointer ${
                    guests === cnt
                      ? 'bg-[#ffa323] text-black shadow-md scale-105'
                      : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {cnt} {cnt === 1 ? 'Persona' : 'Posti'}
                </button>
              ))}
            </div>

            {/* Auto-Assigned Table Selector Info Card */}
            <div className="mt-2 p-2.5 bg-[#181818] rounded-xl border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#d2401e] text-white font-oswald font-bold flex items-center justify-center text-[11px]">
                  {currentTable.name}
                </span>
                <span className="text-white/80 font-oswald tracking-wide">
                  Tavolo assegnato: <strong className="text-[#ffa323]">{currentTable.name}</strong> ({currentTable.seats} posti - {currentTable.room === 'left' ? 'Sala Sinistra' : 'Sala Centrale'})
                </span>
              </div>

              {availableAlternativeTables.length > 1 && (
                <select
                  value={currentTable.id}
                  onChange={(e) => {
                    const chosen = tables.find((t) => t.id === e.target.value);
                    if (chosen) {
                      setCurrentTable(chosen);
                      setIsAutoAssigned(false);
                    }
                  }}
                  className="bg-[#242424] text-white/80 border border-white/10 rounded-lg px-2 py-1 text-[11px] font-oswald uppercase tracking-wider cursor-pointer"
                >
                  {availableAlternativeTables.map((t) => (
                    <option key={t.id} value={t.id}>
                      Tavolo {t.name} ({t.seats} posti)
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* SELEZIONE ORARIO PRENOTAZIONE - CARINA & ORGANIZZATA       */}
          {/* ========================================================= */}
          <div className="p-4 rounded-2xl bg-[#202020] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-oswald font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#ffa323]" />
                <span>ORARIO PRENOTAZIONE: <span className="text-[#ffa323] text-sm ml-1 font-bold">{time}</span></span>
              </label>

              <button
                type="button"
                onClick={() => setShowCustomTime(!showCustomTime)}
                className="text-[10px] font-oswald text-white/50 hover:text-[#ffa323] uppercase tracking-wider underline cursor-pointer"
              >
                {showCustomTime ? 'Nascondi Personalizzato' : 'Altro Orario'}
              </button>
            </div>

            {/* Turni Segmentati con Bottoni Slot */}
            <div className="space-y-2.5">
              {TIME_SLOTS.map((turn) => (
                <div key={turn.label} className="bg-[#181818] p-2.5 rounded-xl border border-white/5">
                  <div className="text-[11px] font-oswald font-semibold text-white/60 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <span>{turn.icon}</span>
                    <span>{turn.label}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {turn.slots.map((slot) => {
                      const isSelected = time === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          className={`py-2 px-2 rounded-lg font-oswald text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer text-center ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#d2401e] to-[#ffa323] text-white shadow-lg shadow-[#d2401e]/40 scale-[1.03] ring-2 ring-white/20'
                              : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Time Input Fallback */}
            {showCustomTime && (
              <div className="pt-2 animate-in fade-in">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-[#ffa323]/50 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ffa323]"
                />
              </div>
            )}
          </div>

          {/* Telefono */}
          <div>
            <label className="block text-xs font-oswald font-bold text-white/80 uppercase tracking-widest mb-1.5">
              NUMERO DI TELEFONO / CELLULARE
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
              <input
                type="tel"
                placeholder="es. 333 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#222222] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#ffa323] text-sm"
              />
            </div>
          </div>

          {/* Stato Tavolo */}
          <div>
            <label className="block text-xs font-oswald font-bold text-white/80 uppercase tracking-widest mb-1.5">
              STATO TAVOLO
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('In Arrivo')}
                className={`py-2.5 px-3 rounded-xl font-oswald text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  status === 'In Arrivo'
                    ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#fbbf24] ring-1 ring-[#f59e0b]'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                🟡 In Arrivo
              </button>
              <button
                type="button"
                onClick={() => setStatus('Seduti')}
                className={`py-2.5 px-3 rounded-xl font-oswald text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  status === 'Seduti'
                    ? 'bg-[#dc2626]/20 border-[#dc2626] text-[#f87171] ring-1 ring-[#dc2626]'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                🔴 Seduti
              </button>
              <button
                type="button"
                onClick={() => setStatus('Confermata')}
                className={`py-2.5 px-3 rounded-xl font-oswald text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  status === 'Confermata'
                    ? 'bg-[#3b82f6]/20 border-[#3b82f6] text-[#60a5fa] ring-1 ring-[#3b82f6]'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                🔵 Confermato
              </button>
            </div>
          </div>

          {/* Note & Allergie */}
          <div>
            <label className="block text-xs font-oswald font-bold text-white/80 uppercase tracking-widest mb-1.5">
              NOTE O RICHIESTE SPECIALI
            </label>
            <textarea
              rows={2}
              placeholder="es. Allergia al glutine, seggiolone bimbo, compleanno..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#222222] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#ffa323] text-sm"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {table.reservation ? (
              <button
                type="button"
                onClick={() => onClear(table.id)}
                className="px-4 py-3 bg-[#d2401e]/20 hover:bg-[#d2401e] text-[#ff8162] hover:text-white rounded-xl font-oswald text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer border border-[#d2401e]/30"
              >
                <Trash2 className="w-4 h-4" />
                <span>Libera Tavolo</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl font-oswald text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#d2401e] hover:bg-[#b83314] text-white rounded-xl font-oswald text-xs font-bold tracking-[0.15em] uppercase transition-all shadow-xl shadow-[#d2401e]/30 cursor-pointer hover:scale-105"
              >
                Salva Prenotazione
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
