import React from 'react';
import { Users, Clock, Phone, FileText, CheckCircle2, X, Trash2, Edit3, UserCheck, GripHorizontal } from 'lucide-react';
import { useDraggableModal } from '../../../hooks/useDraggableModal';

export const TableDetailsPopover = ({ table, onClose, onEdit, onClear, onRotate, onDeleteTable, onSplit }) => {
  const { position, isDragging, handleDragHeader } = useDraggableModal();

  if (!table) return null;

  const res = table.reservation;
  const clientName = res?.clientName || 'Nessuna Prenotazione';
  const guests = res?.guests || table.seats || 4;
  const seatedGuests = res?.seatedGuests || guests;
  const time = res?.time || '19:30';
  const phone = res?.phone;
  const notes = res?.notes;

  return (
    <div
      className={`absolute z-50 bg-[#1e1e1e] text-white rounded-2xl shadow-2xl border p-5 w-72 sm:w-80 animate-in fade-in zoom-in-95 pointer-events-auto backdrop-blur-md transition-shadow ${
        isDragging ? 'border-[#ffa323] shadow-[#ffa323]/20 ring-1 ring-[#ffa323]/50' : 'border-white/15'
      }`}
      style={{
        top: Math.max(20, table.y - 130 + position.y),
        left: Math.min(window.innerWidth > 900 ? 560 : 200, table.x + 40 + position.x),
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Header Card Info (Draggable Handle) */}
      <div
        onPointerDown={handleDragHeader}
        className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 cursor-move select-none active:cursor-grabbing"
        title="Trascina per spostare il pannello"
      >
        <div className="flex items-center gap-2.5 font-oswald text-xs tracking-wider text-white/80">
          <GripHorizontal className="w-3.5 h-3.5 text-[#ffa323] opacity-70" />
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#ffa323]" />
            <span>{table.seats || 4}p max</span>
          </div>
          {res && (
            <>
              <div className="flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-[#ffa323]" />
                <span>{seatedGuests} seduti</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#d2401e]" />
                <span>{time}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-black" />
          </span>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Customer & Reservation Details */}
      <div className="space-y-2.5 text-xs font-sans">
        <div className="flex items-baseline justify-between">
          <h4 className="font-oswald text-lg font-bold text-white uppercase tracking-wider">
            {res ? clientName : 'Tavolo Libero'}
          </h4>
          <span className="px-2.5 py-0.5 rounded-full bg-[#ffa323]/20 text-[#ffa323] font-oswald font-bold text-[11px] tracking-wider uppercase border border-[#ffa323]/30">
            Tavolo {table.name}
          </span>
        </div>

        {res ? (
          <>
            <div className="flex items-center gap-2 text-white/80 pt-1">
              <Clock className="w-3.5 h-3.5 text-[#d2401e] shrink-0" />
              <span><strong className="text-white">Ora:</strong> {time}</span>
            </div>

            {phone && (
              <div className="flex items-center gap-2 text-white/80">
                <Phone className="w-3.5 h-3.5 text-[#ffa323] shrink-0" />
                <span><strong className="text-white">Cell:</strong> {phone}</span>
              </div>
            )}

            {notes && (
              <div className="flex items-start gap-2 text-white/70 bg-white/5 p-2.5 rounded-lg border border-white/5">
                <FileText className="w-3.5 h-3.5 text-[#ffa323] shrink-0 mt-0.5" />
                <span><strong className="text-white">Note:</strong> {notes}</span>
              </div>
            )}
          </>
        ) : (
          <p className="text-white/50 text-xs py-1">Nessuna prenotazione attiva. Clicca su Modifica per assegnare una prenotazione.</p>
        )}

        {table.mergedFrom && (
          <div className="bg-[#10b981]/15 border border-[#10b981]/30 p-2 rounded-lg text-[11px] text-[#10b981] font-semibold flex items-center justify-between">
            <span>🔗 Tavolo Unito da {table.mergedFrom.map((m) => m.name).join(' + ')}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10">
        <button
          onClick={() => onEdit(table)}
          className="py-2 px-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-oswald text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{res ? 'Modifica' : 'Prenota'}</span>
        </button>

        {res && (
          <button
            onClick={() => onClear(table.id)}
            className="py-2 px-2.5 bg-amber-500/20 hover:bg-amber-500 text-[#ffa323] hover:text-black rounded-lg font-oswald text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-amber-500/30"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Libera</span>
          </button>
        )}

        {table.mergedFrom && onSplit && (
          <button
            onClick={() => {
              onSplit(table.id);
              onClose();
            }}
            className="py-2 px-2.5 bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-black rounded-lg font-oswald text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-sky-500/30 col-span-2"
          >
            <span>✂️ Separa Tavoli</span>
          </button>
        )}

        {onRotate && (
          <button
            onClick={() => onRotate(table.id)}
            className="py-2 px-2.5 bg-white/5 hover:bg-white/15 text-white/90 rounded-lg font-oswald text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            title="Ruota tavolo di 90 gradi"
          >
            <span>🔄 Ruota 90°</span>
          </button>
        )}

        {onDeleteTable && (
          <button
            onClick={() => {
              if (window.confirm(`Sei sicuro di voler eliminare il Tavolo ${table.name}?`)) {
                onDeleteTable(table.id);
                onClose();
              }
            }}
            className="py-2 px-2.5 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg font-oswald text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-rose-500/30"
            title="Rimuovi tavolo dalla planimetria"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Elimina</span>
          </button>
        )}
      </div>
    </div>
  );
};
