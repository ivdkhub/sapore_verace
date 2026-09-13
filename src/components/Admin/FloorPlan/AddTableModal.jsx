import React, { useState } from 'react';
import { X, Plus, Circle, Square, RectangleHorizontal, RectangleVertical, Users, GripHorizontal } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { useDraggableModal } from '../../../hooks/useDraggableModal';

export const AddTableModal = ({ isOpen, onClose }) => {
  const { tables, addTable } = useAdmin();
  const [selectedType, setSelectedType] = useState('round_4');
  const [name, setName] = useState(`T${tables.length + 1}`);
  const [seats, setSeats] = useState(4);
  const { position, isDragging, handleDragHeader } = useDraggableModal();

  if (!isOpen) return null;

  const TABLE_TYPES = [
    {
      id: 'single_2_modular',
      title: 'Tavolo Modulare Singolo',
      seatsLabel: '2 Persone (Unibile)',
      defaultSeats: 2,
      desc: 'Quadrato 2p unibile (2+2=4p, +2=6p, +2=8p...)',
      icon: (
        <div className="w-12 h-12 rounded-lg border-2 border-[#10b981] bg-[#10b981]/20 flex items-center justify-center font-bold text-xs text-[#10b981]">
          2p 🔗
        </div>
      ),
    },
    {
      id: 'round_4',
      title: 'Tavolo Rotondo',
      seatsLabel: '4 Persone (Fisso)',
      defaultSeats: 4,
      desc: 'Ideale per gruppi e famiglie (Diametro 80cm)',
      icon: (
        <div className="w-12 h-12 rounded-full border-2 border-[#ffa323] bg-[#ffa323]/20 flex items-center justify-center font-bold text-xs text-[#ffa323]">
          4p
        </div>
      ),
    },
    {
      id: 'double_4_6',
      title: 'Tavolo Rettangolare',
      seatsLabel: '4 / 6 Persone (Fisso)',
      defaultSeats: 6,
      desc: 'Tavolo rettangolare standard (120x65cm)',
      icon: (
        <div className="w-14 h-9 rounded-lg border-2 border-[#3b82f6] bg-[#3b82f6]/20 flex items-center justify-center font-bold text-xs text-[#3b82f6]">
          4-6p
        </div>
      ),
    },
    {
      id: 'large_8',
      title: 'Tavolo Grande / Banchetto',
      seatsLabel: '8 Persone (Fisso)',
      defaultSeats: 8,
      desc: 'Grande tavolo rettangolare per comitive (180x80cm)',
      icon: (
        <div className="w-16 h-8 rounded-lg border-2 border-[#d2401e] bg-[#d2401e]/20 flex items-center justify-center font-bold text-xs text-[#d2401e]">
          8p
        </div>
      ),
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    addTable({
      type: selectedType,
      name: name || `T${tables.length + 1}`,
      seats: Number(seats),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        className={`pointer-events-auto relative w-full max-w-xl bg-[#181818] text-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border overflow-hidden font-sans transition-shadow ${
          isDragging ? 'border-[#ffa323] shadow-[#ffa323]/25 ring-2 ring-[#ffa323]/60' : 'border-white/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Draggable Handle) */}
        <div
          onPointerDown={handleDragHeader}
          className="flex items-center justify-between px-6 py-4 bg-[#141414] border-b border-white/10 cursor-move select-none active:cursor-grabbing"
          title="Trascina per spostare la finestra"
        >
          <div className="flex items-center gap-2.5">
            <GripHorizontal className="w-4 h-4 text-[#ffa323] opacity-70" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-oswald text-xl font-extrabold uppercase tracking-wide text-white">
                  AGGIUNGI NUOVO TAVOLO
                </h3>
                <span className="hidden sm:inline-block text-[10px] font-oswald text-white/40 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                  Trascina
                </span>
              </div>
              <span className="text-xs text-[#ffa323] font-oswald tracking-widest uppercase block">
                Scegli la tipologia e le dimensioni del tavolo
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 4 Table Type Cards */}
          <div>
            <label className="block text-xs font-oswald font-bold text-white/80 uppercase tracking-widest mb-2.5">
              1. SELEZIONA FORMA E TIPOLOGIA TAVOLO
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TABLE_TYPES.map((type) => {
                const isSelected = selectedType === type.id;
                return (
                  <div
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type.id);
                      setSeats(type.defaultSeats);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-white/10 border-[#ffa323] shadow-lg shadow-[#ffa323]/10 ring-1 ring-[#ffa323]'
                        : 'bg-[#222222] border-white/5 hover:border-white/20 hover:bg-[#282828]'
                    }`}
                  >
                    <div className="shrink-0">{type.icon}</div>
                    <div>
                      <h4 className="font-oswald text-sm font-bold uppercase text-white leading-tight">
                        {type.title}
                      </h4>
                      <span className="block font-oswald text-xs font-semibold text-[#ffa323] mt-0.5">
                        {type.seatsLabel}
                      </span>
                      <p className="text-[10px] text-white/50 leading-tight mt-1">
                        {type.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nome / Numero Tavolo & Posti */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-oswald font-bold text-white/80 uppercase tracking-widest mb-1.5">
                SIGLA / NUMERO TAVOLO *
              </label>
              <input
                type="text"
                required
                placeholder="es. T21, 14, B1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#222222] border border-white/10 text-white font-oswald text-sm uppercase focus:outline-none focus:border-[#ffa323]"
              />
            </div>

            <div>
              <label className="block text-xs font-oswald font-bold text-white/80 uppercase tracking-widest mb-1.5">
                CAPIENZA MASSIMA (POSTI)
              </label>
              <div className="flex items-center bg-[#222222] border border-white/10 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors cursor-pointer"
                >
                  -
                </button>
                <div className="flex-1 text-center font-oswald font-bold text-white text-base flex items-center justify-center gap-1.5">
                  <Users className="w-4 h-4 text-[#ffa323]" />
                  <span>{seats} Posti</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSeats(Math.min(16, seats + 1))}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl font-oswald text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#d2401e] hover:bg-[#b83314] text-white rounded-xl font-oswald text-xs font-bold tracking-[0.15em] uppercase transition-all shadow-xl shadow-[#d2401e]/30 cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Inserisci sulla Mappa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
