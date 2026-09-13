import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { useDraggableModal } from '../../../hooks/useDraggableModal';
import { X, Layers, Compass, DoorOpen, LayoutGrid, Coffee, Sparkles, Check, GripHorizontal } from 'lucide-react';
import { MoustacheIcon } from '../../common/Icons';

export const AddStructureModal = ({ isOpen, onClose }) => {
  const { addWall, addDoor, addWindow, addFixture, updatePerimeter, structure } = useAdmin();
  const [activeTab, setActiveTab] = useState('walls'); // 'walls' | 'doors' | 'windows' | 'fixtures' | 'perimeter'
  const { position, isDragging, handleDragHeader } = useDraggableModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 font-sans">
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        className={`pointer-events-auto relative w-full max-w-2xl bg-[#181818] border rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden font-sans transition-shadow ${
          isDragging ? 'border-[#ffa323] shadow-[#ffa323]/25 ring-2 ring-[#ffa323]/60' : 'border-white/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (Draggable Handle) */}
        <div
          onPointerDown={handleDragHeader}
          className="flex items-center justify-between px-6 py-4 bg-[#141414] border-b border-white/10 cursor-move select-none active:cursor-grabbing"
          title="Trascina per spostare la finestra"
        >
          <div className="flex items-center gap-2.5">
            <GripHorizontal className="w-4 h-4 text-[#ffa323] opacity-70" />
            <MoustacheIcon className="w-4 h-2 text-[#ffa323]" />
            <h3 className="font-oswald text-xl font-bold uppercase text-white tracking-wide">
              AGGIUNGI ELEMENTO ARCHITETTONICO
            </h3>
            <span className="hidden sm:inline-block text-[10px] font-oswald text-white/40 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
              Trascina per spostare
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#121212] overflow-x-auto">
          <button
            onClick={() => setActiveTab('walls')}
            className={`px-5 py-3 font-oswald text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'walls'
                ? 'border-[#ffa323] text-[#ffa323] bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Pareti & Divisori</span>
          </button>
          <button
            onClick={() => setActiveTab('doors')}
            className={`px-5 py-3 font-oswald text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'doors'
                ? 'border-[#ffa323] text-[#ffa323] bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <DoorOpen className="w-4 h-4" />
            <span>Porte</span>
          </button>
          <button
            onClick={() => setActiveTab('windows')}
            className={`px-5 py-3 font-oswald text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'windows'
                ? 'border-[#ffa323] text-[#ffa323] bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Finestre & Vetrate</span>
          </button>
          <button
            onClick={() => setActiveTab('fixtures')}
            className={`px-5 py-3 font-oswald text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'fixtures'
                ? 'border-[#ffa323] text-[#ffa323] bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Bagni & Banconi</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* TAB 1: PARETI */}
          {activeTab === 'walls' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  addWall({
                    name: 'Muro Verticale',
                    type: 'wall',
                    orientation: 'vertical',
                    width: 10,
                    height: 220,
                  });
                  onClose();
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffa323] flex flex-col items-center text-center group cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="w-20 h-24 bg-[#111111] rounded-lg border border-white/10 flex items-center justify-center mb-3">
                  <div className="w-3 h-16 bg-[#555555] rounded-sm group-hover:bg-[#ffa323] transition-colors" />
                </div>
                <h4 className="font-oswald text-white font-bold text-sm tracking-wide uppercase">
                  Muro Divisorio Verticale
                </h4>
                <p className="text-xs text-white/50 mt-1">Spessore 10px • Altezza 220px</p>
              </button>

              <button
                onClick={() => {
                  addWall({
                    name: 'Muro Orizzontale',
                    type: 'wall',
                    orientation: 'horizontal',
                    width: 220,
                    height: 10,
                  });
                  onClose();
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffa323] flex flex-col items-center text-center group cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="w-20 h-24 bg-[#111111] rounded-lg border border-white/10 flex items-center justify-center mb-3">
                  <div className="w-16 h-3 bg-[#555555] rounded-sm group-hover:bg-[#ffa323] transition-colors" />
                </div>
                <h4 className="font-oswald text-white font-bold text-sm tracking-wide uppercase">
                  Muro Divisorio Orizzontale
                </h4>
                <p className="text-xs text-white/50 mt-1">Larghezza 220px • Spessore 10px</p>
              </button>

              <button
                onClick={() => {
                  addWall({
                    name: 'Divisorio Legno / Muretto',
                    type: 'partition',
                    orientation: 'vertical',
                    width: 25,
                    height: 160,
                  });
                  onClose();
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffa323] flex flex-col items-center text-center group cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="w-20 h-24 bg-[#111111] rounded-lg border border-white/10 flex items-center justify-center mb-3">
                  <div className="w-6 h-14 bg-[#78350f] rounded-sm border border-[#92400e] group-hover:border-[#ffa323] transition-colors" />
                </div>
                <h4 className="font-oswald text-white font-bold text-sm tracking-wide uppercase">
                  Divisorio Legno / Separé
                </h4>
                <p className="text-xs text-white/50 mt-1">Muretto d'arredo 25x160px</p>
              </button>

              <button
                onClick={() => {
                  addWall({
                    name: 'Muro Corto',
                    type: 'wall',
                    orientation: 'horizontal',
                    width: 100,
                    height: 10,
                  });
                  onClose();
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffa323] flex flex-col items-center text-center group cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="w-20 h-24 bg-[#111111] rounded-lg border border-white/10 flex items-center justify-center mb-3">
                  <div className="w-10 h-3 bg-[#555555] rounded-sm group-hover:bg-[#ffa323] transition-colors" />
                </div>
                <h4 className="font-oswald text-white font-bold text-sm tracking-wide uppercase">
                  Muro Breve / Spalla
                </h4>
                <p className="text-xs text-white/50 mt-1">Spessore 10px • Lunghezza 100px</p>
              </button>
            </div>
          )}

          {/* TAB 2: PORTE */}
          {activeTab === 'doors' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  addDoor({
                    name: 'Porta Battente Sinistra',
                    swing: 'left',
                    width: 55,
                    rotation: 0,
                  });
                  onClose();
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffa323] flex flex-col items-center text-center group cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="w-20 h-24 bg-[#111111] rounded-lg border border-white/10 flex items-center justify-center mb-3 relative">
                  <svg className="w-14 h-14" viewBox="0 0 60 60">
                    <path d="M 10 10 A 40 40 0 0 0 45 45" fill="none" stroke="#999" strokeDasharray="3 3" />
                    <line x1="10" y1="10" x2="45" y2="45" stroke="#ffa323" strokeWidth="2.5" />
                  </svg>
                </div>
                <h4 className="font-oswald text-white font-bold text-sm tracking-wide uppercase">
                  Porta Battente Sinistra
                </h4>
                <p className="text-xs text-white/50 mt-1">Apertura singola ad arco</p>
              </button>

              <button
                onClick={() => {
                  addDoor({
                    name: 'Porta Battente Destra',
                    swing: 'right',
                    width: 55,
                    rotation: 0,
                  });
                  onClose();
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffa323] flex flex-col items-center text-center group cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="w-20 h-24 bg-[#111111] rounded-lg border border-white/10 flex items-center justify-center mb-3 relative">
                  <svg className="w-14 h-14" viewBox="0 0 60 60">
                    <path d="M 50 10 A 40 40 0 0 1 15 45" fill="none" stroke="#999" strokeDasharray="3 3" />
                    <line x1="50" y1="10" x2="15" y2="45" stroke="#ffa323" strokeWidth="2.5" />
                  </svg>
                </div>
                <h4 className="font-oswald text-white font-bold text-sm tracking-wide uppercase">
                  Porta Battente Destra
                </h4>
                <p className="text-xs text-white/50 mt-1">Apertura singola opposta</p>
              </button>

              <button
                onClick={() => {
                  addDoor({
                    name: 'Porta Doppia / Ingresso',
                    swing: 'double',
                    width: 80,
                    rotation: 90,
                  });
                  onClose();
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffa323] flex flex-col items-center text-center group cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="w-20 h-24 bg-[#111111] rounded-lg border border-white/10 flex items-center justify-center mb-3 relative">
                  <svg className="w-16 h-12" viewBox="0 0 70 50">
                    <path d="M 10 40 A 25 25 0 0 1 35 15" fill="none" stroke="#999" strokeDasharray="2 2" />
                    <line x1="10" y1="40" x2="35" y2="15" stroke="#ffa323" strokeWidth="2" />
                    <path d="M 60 40 A 25 25 0 0 0 35 15" fill="none" stroke="#999" strokeDasharray="2 2" />
                    <line x1="60" y1="40" x2="35" y2="15" stroke="#ffa323" strokeWidth="2" />
                  </svg>
                </div>
                <h4 className="font-oswald text-white font-bold text-sm tracking-wide uppercase">
                  Porta Doppia Battente
                </h4>
                <p className="text-xs text-white/50 mt-1">Ideale per Ingresso o Sala Grande</p>
              </button>
            </div>
          )}

          {/* TAB 3: FINESTRE */}
          {activeTab === 'windows' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  addWindow({
                    name: 'Vetrata Panoramica',
                    width: 140,
                    height: 14,
                  });
                  onClose();
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffa323] flex flex-col items-center text-center group cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="w-24 h-24 bg-[#111111] rounded-lg border border-white/10 flex items-center justify-center mb-3">
                  <div className="w-18 h-3.5 bg-[#38bdf8]/30 border border-[#38bdf8] rounded-sm flex items-center justify-around px-1">
                    <div className="w-px h-full bg-[#38bdf8]" />
                    <div className="w-px h-full bg-[#38bdf8]" />
                  </div>
                </div>
                <h4 className="font-oswald text-white font-bold text-sm tracking-wide uppercase">
                  Grande Vetrata
                </h4>
                <p className="text-xs text-white/50 mt-1">Larghezza 140px • Luce naturale</p>
              </button>

              <button
                onClick={() => {
                  addWindow({
                    name: 'Finestra Standard',
                    width: 80,
                    height: 14,
                  });
                  onClose();
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffa323] flex flex-col items-center text-center group cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="w-24 h-24 bg-[#111111] rounded-lg border border-white/10 flex items-center justify-center mb-3">
                  <div className="w-12 h-3.5 bg-[#38bdf8]/30 border border-[#38bdf8] rounded-sm flex items-center justify-around px-1">
                    <div className="w-px h-full bg-[#38bdf8]" />
                  </div>
                </div>
                <h4 className="font-oswald text-white font-bold text-sm tracking-wide uppercase">
                  Finestra Standard
                </h4>
                <p className="text-xs text-white/50 mt-1">Larghezza 80px</p>
              </button>
            </div>
          )}

          {/* TAB 4: BAGNI & ARREDI STRUTTURALI */}
          {activeTab === 'fixtures' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  addFixture({
                    name: 'Bancone Bar con Sgabelli',
                    type: 'bar',
                    width: 170,
                    height: 40,
                  });
                  onClose();
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffa323] flex flex-col items-center text-center group cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="w-24 h-20 bg-[#111111] rounded-lg border border-white/10 flex flex-col items-center justify-center mb-3 p-1">
                  <div className="w-20 h-5 bg-[#92400e] border border-[#000000] rounded-sm flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white font-oswald">BAR</span>
                  </div>
                  <div className="flex gap-1.5 mt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#78350f]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#78350f]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#78350f]" />
                  </div>
                </div>
                <h4 className="font-oswald text-white font-bold text-sm tracking-wide uppercase">
                  Bancone Bar & Sgabelli
                </h4>
                <p className="text-xs text-white/50 mt-1">Banco bar attrezzato</p>
              </button>

              <button
                onClick={() => {
                  addFixture({
                    name: 'Cassa & Reception',
                    type: 'counter',
                    width: 125,
                    height: 40,
                  });
                  onClose();
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffa323] flex flex-col items-center text-center group cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="w-24 h-20 bg-[#111111] rounded-lg border border-white/10 flex items-center justify-center mb-3">
                  <div className="w-18 h-7 bg-[#92400e] border border-[#000000] rounded-sm flex items-center justify-center">
                    <span className="text-[8px] font-bold text-[#ffa323] font-oswald">CASSA</span>
                  </div>
                </div>
                <h4 className="font-oswald text-white font-bold text-sm tracking-wide uppercase">
                  Cassa & Accoglienza
                </h4>
                <p className="text-xs text-white/50 mt-1">Postazione POS / Counter</p>
              </button>

              <button
                onClick={() => {
                  addFixture({
                    name: 'Blocco Bagni Doppio',
                    type: 'restrooms_double',
                    width: 190,
                    height: 185,
                  });
                  onClose();
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffa323] flex flex-col items-center text-center group cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="w-24 h-20 bg-[#111111] rounded-lg border border-white/10 flex items-center justify-center mb-3">
                  <div className="w-20 h-14 bg-[#1f1f1f] border border-[#444444] rounded-sm flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white/80 font-oswald">🚻 BAGNI 2X</span>
                  </div>
                </div>
                <h4 className="font-oswald text-white font-bold text-sm tracking-wide uppercase">
                  Blocco Bagni Doppio
                </h4>
                <p className="text-xs text-white/50 mt-1">Due vani con sanitari e lavabi</p>
              </button>

              <button
                onClick={() => {
                  addFixture({
                    name: 'Bagno Singolo',
                    type: 'restroom_single',
                    width: 95,
                    height: 185,
                  });
                  onClose();
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffa323] flex flex-col items-center text-center group cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="w-24 h-20 bg-[#111111] rounded-lg border border-white/10 flex items-center justify-center mb-3">
                  <div className="w-12 h-14 bg-[#1f1f1f] border border-[#444444] rounded-sm flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white/80 font-oswald">🚻 BAGNO</span>
                  </div>
                </div>
                <h4 className="font-oswald text-white font-bold text-sm tracking-wide uppercase">
                  Bagno Singolo
                </h4>
                <p className="text-xs text-white/50 mt-1">Servizi per clienti o personale</p>
              </button>

              <button
                onClick={() => {
                  addFixture({
                    name: 'Pass Cucina',
                    type: 'kitchen_pass',
                    width: 300,
                    height: 35,
                  });
                  onClose();
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffa323] flex flex-col items-center text-center group cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="w-24 h-20 bg-[#111111] rounded-lg border border-white/10 flex items-center justify-center mb-3">
                  <div className="w-20 h-4 bg-[#78350f] border border-white/20 rounded-sm flex items-center justify-center">
                    <span className="text-[7px] font-bold text-white/80 font-oswald">PASS CUCINA</span>
                  </div>
                </div>
                <h4 className="font-oswald text-white font-bold text-sm tracking-wide uppercase">
                  Pass Cucina
                </h4>
                <p className="text-xs text-white/50 mt-1">Finestra ritiro pietanze e pizze</p>
              </button>

              <button
                onClick={() => {
                  addFixture({
                    name: 'Mobile Servizio / POS',
                    type: 'service_desk',
                    width: 32,
                    height: 185,
                  });
                  onClose();
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffa323] flex flex-col items-center text-center group cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="w-24 h-20 bg-[#111111] rounded-lg border border-white/10 flex items-center justify-center mb-3">
                  <div className="w-4 h-14 bg-[#92400e] border border-white/20 rounded-sm flex items-center justify-center" />
                </div>
                <h4 className="font-oswald text-white font-bold text-sm tracking-wide uppercase">
                  Mobile Servizio / POS
                </h4>
                <p className="text-xs text-white/50 mt-1">Mobile posate e stampante comande</p>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
