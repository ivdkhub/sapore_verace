import React from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { useDraggableModal } from '../../../hooks/useDraggableModal';
import { RotateCw, Trash2, Plus, Minus, X, Maximize2, Move, ArrowLeftRight, GripHorizontal } from 'lucide-react';

export const StructureInspectorPopover = ({ item, onClose }) => {
  const {
    updateWall,
    rotateWall,
    deleteWall,
    updateDoor,
    rotateDoor,
    deleteDoor,
    updateWindow,
    rotateWindow,
    deleteWindow,
    updateFixture,
    rotateFixture,
    deleteFixture,
  } = useAdmin();

  const { position, isDragging, handleDragHeader } = useDraggableModal();

  if (!item || !item.data) return null;

  const { type, id, data } = item;

  // Handler for rotating
  const handleRotate = () => {
    if (type === 'wall') rotateWall(id);
    else if (type === 'door') rotateDoor(id);
    else if (type === 'window') rotateWindow(id);
    else if (type === 'fixture') rotateFixture(id);
  };

  // Handler for resizing length
  const handleResize = (delta) => {
    if (type === 'wall') {
      if (data.width > data.height) {
        updateWall(id, { width: Math.max(30, data.width + delta) });
      } else {
        updateWall(id, { height: Math.max(30, data.height + delta) });
      }
    } else if (type === 'door') {
      updateDoor(id, { width: Math.max(35, data.width + delta) });
    } else if (type === 'window') {
      if (data.width > data.height) {
        updateWindow(id, { width: Math.max(40, data.width + delta) });
      } else {
        updateWindow(id, { height: Math.max(40, data.height + delta) });
      }
    } else if (type === 'fixture') {
      updateFixture(id, {
        width: Math.max(30, data.width + delta),
      });
    }
  };

  // Handler for deleting
  const handleDelete = () => {
    if (window.confirm(`Vuoi eliminare ${data.name || 'questo elemento'}?`)) {
      if (type === 'wall') deleteWall(id);
      else if (type === 'door') deleteDoor(id);
      else if (type === 'window') deleteWindow(id);
      else if (type === 'fixture') deleteFixture(id);
      onClose();
    }
  };

  // Handler for toggle door swing direction
  const handleToggleSwing = () => {
    if (type === 'door') {
      const swings = ['left', 'right', 'double'];
      const nextSwing = swings[(swings.indexOf(data.swing || 'left') + 1) % swings.length];
      updateDoor(id, { swing: nextSwing });
    }
  };

  return (
    <div
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      className={`absolute top-20 right-6 z-40 bg-[#161616]/95 backdrop-blur-md border rounded-2xl p-4 shadow-2xl w-72 text-white font-sans animate-in fade-in slide-in-from-top-2 duration-200 transition-shadow ${
        isDragging ? 'border-[#ffa323] shadow-[#ffa323]/20 ring-1 ring-[#ffa323]/50' : 'border-[#ffa323]/40'
      }`}
    >
      {/* Header (Draggable Handle) */}
      <div
        onPointerDown={handleDragHeader}
        className="flex items-center justify-between pb-3 border-b border-white/10 cursor-move select-none active:cursor-grabbing"
        title="Trascina per spostare il pannello"
      >
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-4 h-4 text-[#ffa323] opacity-70" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-oswald uppercase tracking-widest text-[#ffa323] font-bold">
                ARCHITETTURA • {type.toUpperCase()}
              </span>
              <span className="text-[9px] font-oswald text-white/40 uppercase tracking-widest bg-white/5 px-1 rounded">
                Trascina
              </span>
            </div>
            <h4 className="font-oswald text-base font-bold text-white uppercase tracking-wide truncate max-w-[170px]">
              {data.name || 'Elemento Selezionato'}
            </h4>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white cursor-pointer transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Item Position / Info */}
      <div className="py-2.5 grid grid-cols-2 gap-2 text-xs text-white/70">
        <div className="bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
          <span className="text-white/40 block text-[10px] uppercase font-oswald">Posizione</span>
          <span>X: {Math.round(data.x)} | Y: {Math.round(data.y)}</span>
        </div>
        <div className="bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
          <span className="text-white/40 block text-[10px] uppercase font-oswald">Dimensione</span>
          <span>
            {type === 'door' ? `L: ${data.width}px` : `${data.width} × ${data.height}px`}
          </span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="space-y-2 mt-2">
        {/* Resize Buttons */}
        <div className="flex items-center justify-between bg-white/5 p-1.5 rounded-xl border border-white/5">
          <span className="text-xs font-oswald text-white/70 uppercase pl-2">Lunghezza:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleResize(-20)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              title="Accorcia (-20px)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleResize(20)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              title="Allunga (+20px)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Rotate Button */}
        <button
          onClick={handleRotate}
          className="w-full py-2 bg-white/10 hover:bg-[#ffa323] hover:text-black text-white rounded-xl font-oswald text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Ruota 90°</span>
        </button>

        {/* Door Swing Toggle (if door) */}
        {type === 'door' && (
          <button
            onClick={handleToggleSwing}
            className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-oswald text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#ffa323]" />
            <span>Verso Apertura ({data.swing || 'left'})</span>
          </button>
        )}

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="w-full py-2 bg-rose-500/10 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl font-oswald text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-rose-500/20"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Elimina Elemento</span>
        </button>
      </div>
    </div>
  );
};
