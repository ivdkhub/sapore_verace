import React, { useState } from 'react';
import { X, Tag, Plus, Check, GripHorizontal } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { useDraggableModal } from '../../../hooks/useDraggableModal';

export const AddZoneModal = ({ isOpen, onClose }) => {
  const { addZoneLabel } = useAdmin();
  const [name, setName] = useState('SALA PRIVATA');
  const [subtitle, setSubtitle] = useState('Zona Riservata');
  const [color, setColor] = useState('#ffa323');
  const { position, isDragging, handleDragHeader } = useDraggableModal();

  if (!isOpen) return null;

  const COLOR_OPTIONS = [
    { label: 'Oro Pizzeria', value: '#ffa323' },
    { label: 'Rosso Verace', value: '#d2401e' },
    { label: 'Verde Smeraldo', value: '#10b981' },
    { label: 'Blu Cobalto', value: '#3b82f6' },
    { label: 'Viola Privé', value: '#a855f7' },
  ];

  const PRESET_ZONES = [
    { name: 'SALA VESUVIO', subtitle: 'Sala Principale' },
    { name: 'DEHORS ESTIVO', subtitle: 'Veranda Esterna' },
    { name: 'ZONA FORNO A LEGNA', subtitle: 'Fronte Forno' },
    { name: 'SALA PRIVATA', subtitle: 'Area Eventi & Privé' },
    { name: 'ZONA BAR & APERITIVI', subtitle: 'Ingresso' },
    { name: 'TERRAZZA PANORAMICA', subtitle: 'Tavoli all’Aperto' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addZoneLabel({
      name: name.toUpperCase(),
      subtitle,
      color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 font-sans">
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        className={`pointer-events-auto relative w-full max-w-lg bg-[#181818] text-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border overflow-hidden transition-shadow ${
          isDragging ? 'border-[#ffa323] shadow-[#ffa323]/25 ring-2 ring-[#ffa323]/60' : 'border-white/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Draggable Handle) */}
        <div
          onPointerDown={handleDragHeader}
          className="flex items-center justify-between px-6 py-5 bg-[#141414] border-b border-white/10 cursor-move select-none active:cursor-grabbing"
          title="Trascina per spostare la finestra"
        >
          <div className="flex items-center gap-3">
            <GripHorizontal className="w-4 h-4 text-[#ffa323] opacity-70" />
            <div className="w-10 h-10 rounded-xl bg-[#ffa323]/20 border border-[#ffa323]/40 text-[#ffa323] flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-oswald text-xl font-extrabold uppercase tracking-wide text-white leading-none">
                  AGGIUNGI ETICHETTA SALA
                </h3>
                <span className="hidden sm:inline-block text-[10px] font-oswald text-white/40 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                  Trascina
                </span>
              </div>
              <span className="text-xs text-[#ffa323] font-oswald tracking-widest uppercase mt-0.5 block">
                Dividi e identifica visibilmente le sale del locale
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Presets */}
          <div>
            <label className="block text-xs font-oswald font-bold text-white/80 uppercase tracking-widest mb-2">
              SUGGERIMENTI RAPIDI:
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_ZONES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setName(preset.name);
                    setSubtitle(preset.subtitle);
                  }}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg text-xs font-oswald tracking-wider uppercase text-white/80 hover:text-white transition-all cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Nome Sala */}
          <div>
            <label className="block text-xs font-oswald font-bold text-white/80 uppercase tracking-widest mb-1.5">
              NOME SALA / AREA *
            </label>
            <input
              type="text"
              required
              placeholder="es. SALA VESUVIO, DEHORS, PRIVÉ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#222222] border border-white/10 text-white font-oswald uppercase text-sm focus:outline-none focus:border-[#ffa323]"
            />
          </div>

          {/* Sottotitolo / Descrizione */}
          <div>
            <label className="block text-xs font-oswald font-bold text-white/80 uppercase tracking-widest mb-1.5">
              SOTTOTITOLO (OPZIONALE)
            </label>
            <input
              type="text"
              placeholder="es. Tavoli Esterni, Sala Sinistra"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#222222] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ffa323]"
            />
          </div>

          {/* Colore */}
          <div>
            <label className="block text-xs font-oswald font-bold text-white/80 uppercase tracking-widest mb-2">
              COLORE DISTINTIVO
            </label>
            <div className="flex items-center gap-3">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-9 h-9 rounded-full transition-all flex items-center justify-center cursor-pointer border-2 ${
                    color === c.value
                      ? 'scale-110 border-white shadow-lg'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                >
                  {color === c.value && <Check className="w-4 h-4 text-white drop-shadow" />}
                </button>
              ))}
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
              className="px-6 py-2.5 bg-[#ffa323] hover:bg-[#e5921f] text-black font-oswald text-xs font-bold tracking-[0.15em] uppercase rounded-xl transition-all shadow-xl shadow-[#ffa323]/20 cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Crea Etichetta Sala</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
