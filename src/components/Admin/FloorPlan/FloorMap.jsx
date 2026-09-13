import React, { useState, useRef } from 'react';
import { useAdmin, isModularTable } from '../../../context/AdminContext';
import { TableDetailsPopover } from './TableDetailsPopover';
import { ReservationModal } from './ReservationModal';
import { AddTableModal } from './AddTableModal';
import { AddZoneModal } from './AddZoneModal';
import { AddStructureModal } from './AddStructureModal';
import { StructureInspectorPopover } from './StructureInspectorPopover';
import {
  RotateCcw,
  Move,
  Plus,
  Tag,
  Trash2,
  Sparkles,
  X,
  Layers,
  DoorOpen,
  Compass,
  Wrench,
  CheckCircle2,
  SlidersHorizontal,
  Save,
  Check,
  RotateCw,
} from 'lucide-react';
// Helper: Render individual wooden chair with optional seated guest face avatar
const renderChairItem = (key, x, y, width, height, chairIndex, resGuests, rotateAngle = 0, cx = 0, cy = 0) => {
  const isOccupied = chairIndex < resGuests;
  const chairCenterX = cx || (x + width / 2);
  const chairCenterY = cy || (y + height / 2);

  return (
    <g key={key}>
      {/* Wooden Chair Base */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="3.5"
        fill={isOccupied ? '#854d0e' : '#78350f'}
        stroke="#000000"
        strokeWidth="1.5"
        transform={rotateAngle ? `rotate(${rotateAngle} ${chairCenterX} ${chairCenterY})` : undefined}
      />
      {/* Seated Person Avatar (Friendly Face Circle) */}
      {isOccupied && (
        <g
          transform={`translate(${chairCenterX}, ${chairCenterY})`}
          pointerEvents="none"
        >
          {/* Subtle Outer Glow */}
          <circle r="6.2" fill="#f59e0b" opacity="0.4" />
          {/* Person Head / Face */}
          <circle r="5.2" fill="#fde047" stroke="#854d0e" strokeWidth="0.9" />
          {/* Eyes */}
          <circle cx="-1.7" cy="-1.1" r="0.75" fill="#451a03" />
          <circle cx="1.7" cy="-1.1" r="0.75" fill="#451a03" />
          {/* Cheeks */}
          <circle cx="-2.6" cy="0.9" r="0.75" fill="#f87171" opacity="0.7" />
          <circle cx="2.6" cy="0.9" r="0.75" fill="#f87171" opacity="0.7" />
          {/* Smile */}
          <path
            d="M -1.8 1.4 Q 0 2.9 1.8 1.4"
            fill="none"
            stroke="#451a03"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
};

export const FloorMap = () => {
  const {
    tables,
    zoneLabels,
    structure,
    selectedTable,
    setSelectedTable,
    isModalOpen,
    setIsModalOpen,
    isStructureEditMode,
    setIsStructureEditMode,
    selectedStructureItem,
    setSelectedStructureItem,
    saveSuccessMessage,
    saveLayout,
    saveReservation,
    clearTable,
    updateTablePosition,
    rotateTable,
    deleteTable,
    mergeTables,
    splitTable,
    updateZonePosition,
    deleteZoneLabel,
    // Structure actions
    updatePerimeter,
    addWall,
    updateWall,
    rotateWall,
    deleteWall,
    addDoor,
    updateDoor,
    rotateDoor,
    deleteDoor,
    addWindow,
    updateWindow,
    rotateWindow,
    deleteWindow,
    addFixture,
    updateFixture,
    rotateFixture,
    deleteFixture,
    clearAllLayout,
    resetTables,
  } = useAdmin();

  const svgRef = useRef(null);
  const [activePopoverTable, setActivePopoverTable] = useState(null);
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [dragType, setDragType] = useState(null); // 'table' | 'zone' | 'wall' | 'door' | 'window' | 'fixture'
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [isAddZoneOpen, setIsAddZoneOpen] = useState(false);
  const [isAddStructureOpen, setIsAddStructureOpen] = useState(false);
  const [mergeCandidate, setMergeCandidate] = useState(null);

  const dragData = useRef({ startX: 0, startY: 0, itemX: 0, itemY: 0, hasMoved: false });

  // Convert Pointer Event to SVG coordinates
  const getSVGCoordinates = (e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: svgP.x, y: svgP.y };
  };

  // Drag handler for Tables
  const handleTablePointerDown = (table, e) => {
    if (isStructureEditMode) return;
    if (e.button && e.button !== 0) return; // Only left click for drag
    e.stopPropagation();

    const svgCoords = getSVGCoordinates(e);
    dragData.current = {
      startX: svgCoords.x,
      startY: svgCoords.y,
      itemX: table.x,
      itemY: table.y,
      hasMoved: false,
    };
    setDraggedItemId(table.id);
    setDragType('table');
    setSelectedTable(table);
  };

  // Drag handler for Zone Labels
  const handleZonePointerDown = (zone, e) => {
    if (e.button && e.button !== 0) return;
    e.stopPropagation();

    const svgCoords = getSVGCoordinates(e);
    dragData.current = {
      startX: svgCoords.x,
      startY: svgCoords.y,
      itemX: zone.x,
      itemY: zone.y,
      hasMoved: false,
    };
    setDraggedItemId(zone.id);
    setDragType('zone');
  };

  // Drag handler for Structural Elements (Walls, Doors, Windows, Fixtures)
  const handleStructurePointerDown = (item, type, e) => {
    if (!isStructureEditMode) return;
    if (e.button && e.button !== 0) return;
    e.stopPropagation();

    const svgCoords = getSVGCoordinates(e);
    dragData.current = {
      startX: svgCoords.x,
      startY: svgCoords.y,
      itemX: item.x,
      itemY: item.y,
      hasMoved: false,
    };
    setDraggedItemId(item.id);
    setDragType(type);
    setSelectedStructureItem({ type, id: item.id, data: item });
  };

  const handlePointerMove = (e) => {
    if (!draggedItemId) return;

    const svgCoords = getSVGCoordinates(e);
    const dx = svgCoords.x - dragData.current.startX;
    const dy = svgCoords.y - dragData.current.startY;

    if (Math.hypot(dx, dy) > 4) {
      dragData.current.hasMoved = true;
      if (activePopoverTable) setActivePopoverTable(null);
    }

    if (dragData.current.hasMoved) {
      if (dragType === 'table') {
        const table = tables.find((t) => t.id === draggedItemId);
        if (!table) return;

        const pX = perimeter?.x || 60;
        const pY = perimeter?.y || 20;
        const pW = perimeter?.width || 880;
        const pH = perimeter?.height || 940;

        let newX, newY;
        if (table.type === 'round') {
          const r = table.radius || 30;
          const minX = pX + 5 + r;
          const maxX = pX + pW - 5 - r;
          const minY = pY + 5 + r;
          const maxY = pY + pH - 5 - r;
          newX = Math.round(Math.max(minX, Math.min(maxX, dragData.current.itemX + dx)));
          newY = Math.round(Math.max(minY, Math.min(maxY, dragData.current.itemY + dy)));
        } else {
          const w = table.width || 60;
          const h = table.height || 60;
          const rot = table.rotation || 0;
          const isRotated90 = Math.abs(rot % 180) === 90;
          const visualW = isRotated90 ? h : w;
          const visualH = isRotated90 ? w : h;
          const halfVisualW = visualW / 2;
          const halfVisualH = visualH / 2;

          const minCenterX = pX + 5 + halfVisualW;
          const maxCenterX = pX + pW - 5 - halfVisualW;
          const minCenterY = pY + 5 + halfVisualH;
          const maxCenterY = pY + pH - 5 - halfVisualH;

          const desiredCenterX = dragData.current.itemX + w / 2 + dx;
          const desiredCenterY = dragData.current.itemY + h / 2 + dy;

          const clampedCenterX = Math.max(minCenterX, Math.min(maxCenterX, desiredCenterX));
          const clampedCenterY = Math.max(minCenterY, Math.min(maxCenterY, desiredCenterY));

          newX = Math.round(clampedCenterX - w / 2);
          newY = Math.round(clampedCenterY - h / 2);
        }

        updateTablePosition(draggedItemId, newX, newY);

        // --- CHECK MERGE CANDIDATE ONLY WHEN DRAGGING DIRECTLY OVER ANOTHER MODULAR TABLE ---
        let candidate = null;
        if (isModularTable(table)) {
          const tableW = table.width || 44;
          const tableH = table.height || 44;
          const currentCenter = {
            x: newX + tableW / 2,
            y: newY + tableH / 2,
          };

          for (const other of tables) {
            if (other.id === draggedItemId) continue;
            if (!isModularTable(other)) continue; // Only modular tables can be merged!

            const otherW = other.width || 44;
            const otherH = other.height || 44;
            const otherCenter = {
              x: other.x + otherW / 2,
              y: other.y + otherH / 2,
            };

            const distance = Math.hypot(currentCenter.x - otherCenter.x, currentCenter.y - otherCenter.y);

            // Calculate precise bounding box intersection / overlap area
            const xOverlap = Math.max(0, Math.min(newX + tableW, other.x + otherW) - Math.max(newX, other.x));
            const yOverlap = Math.max(0, Math.min(newY + tableH, other.y + otherH) - Math.max(newY, other.y));
            const overlapArea = xOverlap * yOverlap;
            const minArea = Math.min(tableW * tableH, otherW * otherH);

            // Propose merging ONLY when brought directly over the other table (>30% area overlap or centers < 22px apart)
            const isDirectlyOver = (overlapArea > 0.3 * minArea) || (distance < 22);

            if (isDirectlyOver) {
              candidate = {
                sourceTable: { ...table, x: newX, y: newY },
                targetTable: other,
                midX: (currentCenter.x + otherCenter.x) / 2,
                midY: (currentCenter.y + otherCenter.y) / 2,
              };
              break;
            }
          }
        }
        setMergeCandidate(candidate);
      } else if (dragType === 'zone') {
        const newX = Math.round(Math.max(140, Math.min(960, dragData.current.itemX + dx)));
        const newY = Math.round(Math.max(100, Math.min(940, dragData.current.itemY + dy)));
        updateZonePosition(draggedItemId, newX, newY);
      } else if (dragType === 'wall') {
        const newX = Math.round(dragData.current.itemX + dx);
        const newY = Math.round(dragData.current.itemY + dy);
        updateWall(draggedItemId, { x: newX, y: newY });
      } else if (dragType === 'door') {
        const newX = Math.round(dragData.current.itemX + dx);
        const newY = Math.round(dragData.current.itemY + dy);
        updateDoor(draggedItemId, { x: newX, y: newY });
      } else if (dragType === 'window') {
        const newX = Math.round(dragData.current.itemX + dx);
        const newY = Math.round(dragData.current.itemY + dy);
        updateWindow(draggedItemId, { x: newX, y: newY });
      } else if (dragType === 'fixture') {
        const newX = Math.round(dragData.current.itemX + dx);
        const newY = Math.round(dragData.current.itemY + dy);
        updateFixture(draggedItemId, { x: newX, y: newY });
      }
    }
  };

  const handlePointerUp = () => {
    if (!draggedItemId) return;

    if (dragType === 'table') {
      if (mergeCandidate && dragData.current.hasMoved) {
        mergeTables(mergeCandidate.sourceTable.id, mergeCandidate.targetTable.id);
        setMergeCandidate(null);
        setDraggedItemId(null);
        setDragType(null);
        return;
      }
      setMergeCandidate(null);

      if (!dragData.current.hasMoved && !isStructureEditMode) {
        const table = tables.find((t) => t.id === draggedItemId);
        if (table) {
          if (table.reservation) {
            setActivePopoverTable(table);
          } else {
            setActivePopoverTable(null);
            setIsModalOpen(true);
          }
        }
      }
    }

    setDraggedItemId(null);
    setDragType(null);
  };

  const handleOpenEditModal = (table) => {
    setSelectedTable(table);
    setActivePopoverTable(null);
    setIsModalOpen(true);
  };

  const getTableFill = (table) => {
    if (table.colorOverride) return table.colorOverride;
    switch (table.status) {
      case 'occupato':
        return '#d2401e';
      case 'in_corso':
        return '#f59e0b';
      case 'confermato':
        return '#3b82f6';
      case 'disponibile':
      default:
        return '#10b981';
    }
  };

  const { perimeter, walls = [], doors = [], windows = [], fixtures = [] } = structure;

  return (
    <div className="relative w-full max-w-6xl mx-auto bg-[#181818] rounded-2xl shadow-2xl border border-white/10 overflow-hidden select-none font-sans">
      {/* ============================================================ */}
      {/* SUCCESS TOAST MESSAGE                                        */}
      {/* ============================================================ */}
      {saveSuccessMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#10b981] text-black font-oswald text-sm font-bold tracking-wider px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE SWITCHER & TOOLBAR CONTROLS                             */}
      {/* ============================================================ */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-[#141414] border-b border-white/10 gap-4">
        {/* Left: Mode Switcher */}
        <div className="flex items-center gap-3">
          <div className="inline-flex bg-[#0f0f0f] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setIsStructureEditMode(false);
                setSelectedStructureItem(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                !isStructureEditMode
                  ? 'bg-[#d2401e] text-white shadow-lg shadow-[#d2401e]/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Servizio & Prenotazioni</span>
            </button>
            <button
              onClick={() => {
                setIsStructureEditMode(true);
                setActivePopoverTable(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                isStructureEditMode
                  ? 'bg-[#ffa323] text-black shadow-lg shadow-[#ffa323]/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Edita Planimetria (Muri/Porte)</span>
            </button>
          </div>
        </div>

        {/* Right: Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Prominent Save Layout Button */}
          <button
            onClick={saveLayout}
            className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-black hover:text-white rounded-xl font-oswald text-xs font-black tracking-wider uppercase flex items-center gap-2 transition-all shadow-lg shadow-[#10b981]/30 cursor-pointer"
            title="Salva la configurazione attuale della piantina"
          >
            <Save className="w-4 h-4" />
            <span>Salva Layout</span>
          </button>

          {!isStructureEditMode ? (
            <>
              {/* Add Table Button */}
              <button
                onClick={() => setIsAddTableOpen(true)}
                className="px-3.5 py-2 bg-[#d2401e] hover:bg-[#b83314] text-white rounded-xl font-oswald text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-lg shadow-[#d2401e]/30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tavolo</span>
              </button>

              {/* Add Room Zone Label Button */}
              <button
                onClick={() => setIsAddZoneOpen(true)}
                className="px-3.5 py-2 bg-[#ffa323] hover:bg-[#e5921f] text-black rounded-xl font-oswald text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-lg shadow-[#ffa323]/20 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>+ Etichetta Sala</span>
              </button>

              {/* Reset to Default Image Template */}
              <button
                onClick={resetTables}
                className="px-3 py-2 text-xs font-oswald tracking-wider uppercase text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Ripristina il template di default"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#ffa323]" />
                <span className="hidden sm:inline">Ripristina Default</span>
              </button>
            </>
          ) : (
            <>
              {/* Architect Mode Actions */}
              <button
                onClick={() => setIsAddStructureOpen(true)}
                className="px-4 py-2 bg-[#ffa323] hover:bg-[#e5921f] text-black rounded-xl font-oswald text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-lg shadow-[#ffa323]/30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Elemento Struttura</span>
              </button>

              {/* Clear Architecture Button */}
              <button
                onClick={() => {
                  if (window.confirm('Vuoi cancellare tutte le pareti e porte per ripartire da zero?')) {
                    clearAllLayout(true);
                  }
                }}
                className="px-3 py-2 text-xs font-oswald tracking-wider uppercase text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Svuota Struttura</span>
              </button>

              {/* Reset Architecture Button */}
              <button
                onClick={resetTables}
                className="px-3 py-2 text-xs font-oswald tracking-wider uppercase text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#ffa323]" />
                <span>Ripristina Default</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sub-bar Quick Tip Indicator */}
      <div className="px-6 py-2 bg-[#101010] border-b border-white/5 flex flex-wrap items-center justify-between text-[11px] font-oswald uppercase tracking-widest text-white/60 gap-2">
        {!isStructureEditMode ? (
          <div className="flex items-center gap-3">
            <span className="text-[#10b981]">🟢 MODALITÀ PRENOTAZIONI ATTIVA</span>
            <span>• Clicca sui tavoli per prenotare | 💡 Passa il mouse su un tavolo o clicca col destro per ruotarlo di 90°</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-[#ffa323]">
            <span>📐 MODALITÀ ARCHITETTO ATTIVA</span>
            <span className="text-white/60">• Trascina, ruota o allunga muri, porte e strutture del perimetro</span>
          </div>
        )}
        <span className="text-white/40">Sapore Verace • Perimetro 880×880</span>
      </div>

      {/* ============================================================ */}
      {/* SVG INTERACTIVE BLUEPRINT CANVAS                             */}
      {/* ============================================================ */}
      <div
        className="relative p-2 sm:p-6 flex items-center justify-center bg-[#0d0d0d] overflow-x-auto min-h-[700px]"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <svg
          ref={svgRef}
          viewBox={`${(perimeter?.x || 60) - 20} ${(perimeter?.y || 20) - 15} ${(perimeter?.width || 880) + 40} ${(perimeter?.height || 940) + 30}`}
          className={`w-full max-w-[960px] h-auto drop-shadow-2xl font-sans ${
            draggedItemId ? 'cursor-grabbing' : isStructureEditMode ? 'cursor-crosshair' : 'cursor-default'
          }`}
          style={{ minWidth: '650px', touchAction: 'none' }}
        >
          {/* FLOOR PLAN BACKGROUND */}
          <rect
            x={perimeter?.x || 120}
            y={perimeter?.y || 80}
            width={perimeter?.width || 880}
            height={perimeter?.height || 880}
            fill={perimeter?.fill || '#151515'}
          />

          {/* Floor tile grid */}
          <defs>
            <pattern id="floorGrid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#202020" strokeWidth="1" />
            </pattern>
          </defs>
          <rect
            x={perimeter?.x || 120}
            y={perimeter?.y || 80}
            width={perimeter?.width || 880}
            height={perimeter?.height || 880}
            fill="url(#floorGrid)"
            opacity="0.75"
          />

          {/* ============================================================ */}
          {/* OUTER PERIMETER WALL                                         */}
          {/* ============================================================ */}
          <rect
            x={perimeter?.x || 120}
            y={perimeter?.y || 80}
            width={perimeter?.width || 880}
            height={perimeter?.height || 880}
            fill="none"
            stroke="#0a0a0a"
            strokeWidth={(perimeter?.strokeWidth || 9) + 4}
            strokeLinejoin="round"
          />
          <rect
            x={perimeter?.x || 120}
            y={perimeter?.y || 80}
            width={perimeter?.width || 880}
            height={perimeter?.height || 880}
            fill="none"
            stroke={perimeter?.borderColor || '#404040'}
            strokeWidth={perimeter?.strokeWidth || 9}
            strokeLinejoin="round"
          />

          {/* ============================================================ */}
          {/* TOP RIGHT PANORAMIC WINDOW (BLUE GLASS ACCORDING TO IMAGE)  */}
          {/* ============================================================ */}
          {windows.map((win) => {
            const isSelected = isStructureEditMode && selectedStructureItem?.id === win.id;
            return (
              <g
                key={win.id}
                onPointerDown={(e) => handleStructurePointerDown(win, 'window', e)}
                className={isStructureEditMode ? 'cursor-grab active:cursor-grabbing group' : ''}
                transform={`rotate(${win.rotation || 0} ${win.x + win.width / 2} ${win.y + (win.height || 12) / 2})`}
              >
                {isSelected && (
                  <rect
                    x={win.x - 4}
                    y={win.y - 4}
                    width={win.width + 8}
                    height={(win.height || 12) + 8}
                    fill="none"
                    stroke="#ffa323"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                )}
                <rect
                  x={win.x}
                  y={win.y}
                  width={win.width}
                  height={win.height || 12}
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  opacity="0.9"
                />
                <line
                  x1={win.x}
                  y1={win.y + (win.height || 12) / 2}
                  x2={win.x + win.width}
                  y2={win.y + (win.height || 12) / 2}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* FIXTURES (BAGNI, CASSA & RECEPTION, BANCONI, PASS, ETC.)     */}
          {/* ============================================================ */}
          {fixtures.map((fix) => {
            const isSelected = isStructureEditMode && selectedStructureItem?.id === fix.id;
            const isVertical = (fix.height || 40) > (fix.width || 40);

            return (
              <g
                key={fix.id}
                onPointerDown={(e) => handleStructurePointerDown(fix, 'fixture', e)}
                className={isStructureEditMode ? 'cursor-grab active:cursor-grabbing group' : ''}
                transform={`rotate(${fix.rotation || 0} ${fix.x + fix.width / 2} ${fix.y + fix.height / 2})`}
              >
                {/* Selection Box */}
                {isSelected && (
                  <rect
                    x={fix.x - 6}
                    y={fix.y - 6}
                    width={fix.width + 12}
                    height={fix.height + 12}
                    fill="none"
                    stroke="#ffa323"
                    strokeWidth="2.5"
                    strokeDasharray="6 3"
                    rx="6"
                  />
                )}

                {/* 1. RESTROOM SINGLE */}
                {(fix.type === 'restroom_single' || fix.type === 'restroom') && (
                  <g>
                    <rect
                      x={fix.x}
                      y={fix.y}
                      width={fix.width}
                      height={fix.height}
                      fill="#1e1e1e"
                      stroke="#444444"
                      strokeWidth="3"
                      rx="8"
                    />
                    {/* Inner Toilet Compartment with Blue Accent Outline */}
                    <rect
                      x={fix.x + 8}
                      y={fix.y + 8}
                      width={fix.width - 16}
                      height={fix.height - 16}
                      rx="6"
                      fill="#262626"
                      stroke="#38bdf8"
                      strokeWidth="1.8"
                    />
                    {/* WC Symbol Circle */}
                    <circle
                      cx={fix.x + fix.width / 2}
                      cy={fix.y + fix.height - 20}
                      r="9"
                      fill="#e2e8f0"
                      stroke="#64748b"
                      strokeWidth="1.5"
                    />
                    {/* Vertical Label */}
                    <text
                      x={fix.x + fix.width / 2}
                      y={fix.y + fix.height / 2 - 10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      opacity="0.8"
                      fontSize="11.5"
                      fontWeight="bold"
                      fontFamily="Oswald"
                      letterSpacing="1"
                      transform={`rotate(-90 ${fix.x + fix.width / 2} ${fix.y + fix.height / 2 - 10})`}
                    >
                      {fix.name || 'Bagno Singolo'}
                    </text>
                  </g>
                )}

                {/* 2. RESTROOMS DOUBLE */}
                {fix.type === 'restrooms_double' && (
                  <g>
                    <rect
                      x={fix.x}
                      y={fix.y}
                      width={fix.width}
                      height={fix.height}
                      fill="#1e1e1e"
                      stroke="#444444"
                      strokeWidth="3"
                      rx="4"
                    />
                    {/* Dividing wall */}
                    <line
                      x1={fix.x + fix.width / 2}
                      y1={fix.y}
                      x2={fix.x + fix.width / 2}
                      y2={fix.y + fix.height}
                      stroke="#444444"
                      strokeWidth="2.5"
                    />
                    {/* Left WC */}
                    <rect
                      x={fix.x + 8}
                      y={fix.y + 8}
                      width={fix.width / 2 - 16}
                      height={fix.height - 16}
                      rx="4"
                      fill="#262626"
                      stroke="#38bdf8"
                      strokeWidth="1.2"
                    />
                    {/* Right WC */}
                    <rect
                      x={fix.x + fix.width / 2 + 8}
                      y={fix.y + 8}
                      width={fix.width / 2 - 16}
                      height={fix.height - 16}
                      rx="4"
                      fill="#262626"
                      stroke="#ec4899"
                      strokeWidth="1.2"
                    />
                    <text
                      x={fix.x + fix.width / 4}
                      y={fix.y + fix.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#38bdf8"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="Oswald"
                    >
                      🚻 WC 1
                    </text>
                    <text
                      x={fix.x + (fix.width * 3) / 4}
                      y={fix.y + fix.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ec4899"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="Oswald"
                    >
                      🚻 WC 2
                    </text>
                  </g>
                )}

                {/* 3. CASSA & RECEPTION / COUNTER (Vertical & Horizontal) */}
                {(fix.type === 'counter' || fix.type === 'counter_vertical' || fix.type === 'cashier' || fix.type === 'reception') && (
                  <g>
                    <rect
                      x={fix.x}
                      y={fix.y}
                      width={fix.width}
                      height={fix.height}
                      fill="#92400e"
                      stroke="#000000"
                      strokeWidth="2.5"
                      rx="4"
                    />
                    {/* POS Terminal box */}
                    {isVertical ? (
                      <rect
                        x={fix.x + fix.width + 2}
                        y={fix.y + fix.height - Math.min(32, fix.height / 2)}
                        width={24}
                        height={24}
                        fill="#1e293b"
                        stroke="#ffa323"
                        strokeWidth="1.5"
                        rx="3"
                      />
                    ) : (
                      <rect
                        x={fix.x + fix.width - 26}
                        y={fix.y - 12}
                        width={22}
                        height={22}
                        fill="#1e293b"
                        stroke="#ffa323"
                        strokeWidth="1.5"
                        rx="3"
                      />
                    )}
                    {/* Text Label */}
                    <text
                      x={fix.x + fix.width / 2}
                      y={fix.y + fix.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffa323"
                      fontSize={isVertical ? '11' : '12'}
                      fontWeight="bold"
                      fontFamily="Oswald"
                      letterSpacing="1"
                      transform={isVertical ? `rotate(90 ${fix.x + fix.width / 2} ${fix.y + fix.height / 2})` : undefined}
                    >
                      {fix.name || 'CASSA & RECEPTION'}
                    </text>
                  </g>
                )}

                {/* 4. BAR / BANCONE */}
                {(fix.type === 'bar' || fix.type === 'bar_bottom') && (
                  <g>
                    <rect
                      x={fix.x}
                      y={fix.y}
                      width={fix.width}
                      height={fix.height}
                      fill="#92400e"
                      stroke="#000000"
                      strokeWidth="2.5"
                      rx="4"
                    />
                    <text
                      x={fix.x + fix.width / 2}
                      y={fix.y + fix.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      fontSize="12.5"
                      fontWeight="bold"
                      fontFamily="Oswald"
                      letterSpacing="1"
                    >
                      {fix.name || 'BANCONE BAR'}
                    </text>
                    {/* Dynamic Bar Stools */}
                    {Array.from({ length: Math.max(2, Math.floor(fix.width / 45)) }).map((_, idx, arr) => {
                      const stoolX = fix.x + (fix.width / (arr.length + 1)) * (idx + 1);
                      return (
                        <rect
                          key={idx}
                          x={stoolX - 10}
                          y={fix.y + fix.height + 3}
                          width="20"
                          height="16"
                          rx="4"
                          fill="#78350f"
                          stroke="#000000"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </g>
                )}

                {/* 5. PASS CUCINA */}
                {(fix.type === 'kitchen_pass' || fix.type === 'kitchen') && (
                  <g>
                    <rect
                      x={fix.x}
                      y={fix.y}
                      width={fix.width}
                      height={fix.height}
                      fill="#78350f"
                      stroke="#ffa323"
                      strokeWidth="2"
                      strokeDasharray="8 4"
                      rx="4"
                    />
                    <text
                      x={fix.x + fix.width / 2}
                      y={fix.y + fix.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffa323"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="Oswald"
                      letterSpacing="1.5"
                    >
                      🍕 {fix.name || 'PASS CUCINA'}
                    </text>
                  </g>
                )}

                {/* 6. SERVICE DESK / MOBILE SERVIZIO */}
                {fix.type === 'service_desk' && (
                  <g>
                    <rect
                      x={fix.x}
                      y={fix.y}
                      width={fix.width}
                      height={fix.height}
                      fill="#92400e"
                      stroke="#000000"
                      strokeWidth="2"
                      rx="3"
                    />
                    <text
                      x={fix.x + fix.width / 2}
                      y={fix.y + fix.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffa323"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="Oswald"
                      transform={isVertical ? `rotate(90 ${fix.x + fix.width / 2} ${fix.y + fix.height / 2})` : undefined}
                    >
                      {fix.name || 'POS / SERVICE'}
                    </text>
                  </g>
                )}

                {/* 7. FALLBACK / GENERIC FIXTURE */}
                {![
                  'restroom_single',
                  'restroom',
                  'restrooms_double',
                  'counter',
                  'counter_vertical',
                  'cashier',
                  'reception',
                  'bar',
                  'bar_bottom',
                  'kitchen_pass',
                  'kitchen',
                  'service_desk',
                ].includes(fix.type) && (
                  <g>
                    <rect
                      x={fix.x}
                      y={fix.y}
                      width={fix.width}
                      height={fix.height}
                      fill="#262626"
                      stroke="#ffa323"
                      strokeWidth="2"
                      rx="4"
                    />
                    <text
                      x={fix.x + fix.width / 2}
                      y={fix.y + fix.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="Oswald"
                      letterSpacing="1"
                    >
                      {fix.name || 'ELEMENTO'}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* WALLS & PARTITIONS                                           */}
          {/* ============================================================ */}
          {walls.map((wall) => {
            const isSelected = isStructureEditMode && selectedStructureItem?.id === wall.id;
            const isPartition = wall.type === 'partition';

            return (
              <g
                key={wall.id}
                onPointerDown={(e) => handleStructurePointerDown(wall, 'wall', e)}
                className={isStructureEditMode ? 'cursor-grab active:cursor-grabbing group' : ''}
                transform={`rotate(${wall.rotation || 0} ${wall.x + wall.width / 2} ${wall.y + wall.height / 2})`}
              >
                {isSelected && (
                  <rect
                    x={wall.x - 5}
                    y={wall.y - 5}
                    width={wall.width + 10}
                    height={wall.height + 10}
                    fill="none"
                    stroke="#ffa323"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                    rx="3"
                  />
                )}
                <rect
                  x={wall.x}
                  y={wall.y}
                  width={wall.width}
                  height={wall.height}
                  fill={isPartition ? '#78350f' : '#0a0a0a'}
                  stroke={isPartition ? '#92400e' : (wall.color || '#555555')}
                  strokeWidth={isPartition ? 2 : 2.5}
                  rx={isPartition ? 3 : 1}
                />
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* DOORS (WITH SWING ARCS MATCHING THE USER REFERENCE PHOTO)   */}
          {/* ============================================================ */}
          {doors.map((door) => {
            const isSelected = isStructureEditMode && selectedStructureItem?.id === door.id;
            const w = door.width || 65;

            return (
              <g
                key={door.id}
                onPointerDown={(e) => handleStructurePointerDown(door, 'door', e)}
                className={isStructureEditMode ? 'cursor-grab active:cursor-grabbing group' : ''}
                transform={`rotate(${door.rotation || 0} ${door.x} ${door.y})`}
              >
                {isSelected && (
                  <circle
                    cx={door.x}
                    cy={door.y}
                    r={w + 10}
                    fill="none"
                    stroke="#ffa323"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Left swing door arc pointing diagonally down-left as in photo */}
                <path
                  d={`M ${door.x} ${door.y} A ${w} ${w} 0 0 1 ${door.x - w * 0.72} ${door.y + w * 0.72}`}
                  stroke="#777777"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  fill="none"
                />
                <line
                  x1={door.x}
                  y1={door.y}
                  x2={door.x - w * 0.72}
                  y2={door.y + w * 0.72}
                  stroke="#ffa323"
                  strokeWidth="3"
                />
                {/* Hinge */}
                <circle cx={door.x} cy={door.y} r="4.5" fill="#ffa323" />
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* VISIBLE ROOM / ZONE LABELS (SALA SAPORE & SALA VERACE)       */}
          {/* ============================================================ */}
          {zoneLabels.map((zone) => {
            const isDragging = draggedItemId === zone.id;
            return (
              <g
                key={zone.id}
                onPointerDown={(e) => handleZonePointerDown(zone, e)}
                className="cursor-grab active:cursor-grabbing group"
                transform={`translate(${isDragging ? 0 : 0})`}
              >
                <rect
                  x={zone.x - 95}
                  y={zone.y - 22}
                  width="190"
                  height="44"
                  rx="10"
                  fill="#141414"
                  stroke={zone.color || '#ffa323'}
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  opacity="0.95"
                  className="group-hover:opacity-100 transition-opacity"
                />
                <text
                  x={zone.x}
                  y={zone.y - 4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={zone.color || '#ffa323'}
                  fontSize="14"
                  fontWeight="bold"
                  fontFamily="Oswald"
                  letterSpacing="1.5"
                >
                  {zone.name}
                </text>
                <text
                  x={zone.x}
                  y={zone.y + 12}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#ffffff"
                  opacity="0.6"
                  fontSize="9.5"
                  fontWeight="500"
                >
                  {zone.subtitle || 'Zona Riservata'}
                </text>
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* TABLES & CHAIRS (CLICKABLE, ROTATABLE & DRAGGABLE)           */}
          {/* ============================================================ */}
          {tables.map((table) => {
            const isDragging = draggedItemId === table.id && dragType === 'table';
            const isSelected = selectedTable?.id === table.id || isDragging;
            const fill = getTableFill(table);
            const isRound = table.type === 'round';
            const centerX = isRound ? table.x : table.x + (table.width || 60) / 2;
            const centerY = isRound ? table.y : table.y + (table.height || 60) / 2;
            const rotation = table.rotation || 0;
            const borderStroke = table.borderHighlight || (isSelected ? '#ffa323' : '#0a0a0a');
            const strokeW = table.borderHighlight || isSelected ? '3.5' : '2.5';
            const resGuests = table.reservation ? Number(table.reservation.guests) || 0 : 0;

            return (
              <g
                key={table.id}
                onPointerDown={(e) => handleTablePointerDown(table, e)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  rotateTable(table.id);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  rotateTable(table.id);
                }}
                className={
                  isStructureEditMode
                    ? 'opacity-40 pointer-events-none'
                    : 'cursor-grab active:cursor-grabbing group'
                }
                transform={`rotate(${rotation} ${centerX} ${centerY})`}
              >
                {/* Dragging Highlight Ring */}
                {isDragging && (
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r={isRound ? table.radius + 12 : (table.width || 42) + 8}
                    fill="none"
                    stroke="#ffa323"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                    opacity="0.85"
                  />
                )}

                {/* Subtle Table Glow on Hover */}
                {isRound ? (
                  <circle
                    cx={table.x}
                    cy={table.y}
                    r={table.radius + 7}
                    fill={fill}
                    opacity={isDragging ? 0.35 : 0.15}
                    className="group-hover:opacity-40 transition-opacity"
                  />
                ) : (
                  <rect
                    x={table.x - 6}
                    y={table.y - 6}
                    width={table.width + 12}
                    height={table.height + 12}
                    rx="12"
                    fill={fill}
                    opacity={isDragging ? 0.35 : 0.15}
                    className="group-hover:opacity-40 transition-opacity"
                  />
                )}

                {/* --- CHAIRS RENDERING (WITH SEATED GUEST FACE AVATARS) --- */}
                {isRound ? (
                  <>
                    {(() => {
                      const chairCount = Math.max(table.seats || 4, resGuests);
                      return Array.from({ length: chairCount }).map((_, idx) => {
                        const angle = (360 / chairCount) * idx;
                        const rad = (angle * Math.PI) / 180;
                        const cx = table.x + Math.cos(rad) * (table.radius + 10);
                        const cy = table.y + Math.sin(rad) * (table.radius + 10);
                        return renderChairItem(
                          `round-chair-${idx}`,
                          cx - 7,
                          cy - 7,
                          14,
                          14,
                          idx,
                          resGuests,
                          angle + 90,
                          cx,
                          cy
                        );
                      });
                    })()}
                  </>
                ) : table.type === 'square' && table.seats === 2 ? (
                  /* 2-Person Square Modular Table */
                  <>
                    {renderChairItem(
                      `sq2-top`,
                      table.x + table.width / 2 - 8,
                      table.y - 12,
                      16,
                      12,
                      0,
                      resGuests,
                      0,
                      table.x + table.width / 2,
                      table.y - 6
                    )}
                    {renderChairItem(
                      `sq2-bot`,
                      table.x + table.width / 2 - 8,
                      table.y + table.height,
                      16,
                      12,
                      1,
                      resGuests,
                      0,
                      table.x + table.width / 2,
                      table.y + table.height + 6
                    )}
                    {resGuests > 2 &&
                      renderChairItem(
                        `sq2-left`,
                        table.x - 12,
                        table.y + table.height / 2 - 8,
                        12,
                        16,
                        2,
                        resGuests,
                        0,
                        table.x - 6,
                        table.y + table.height / 2
                      )}
                    {resGuests > 3 &&
                      renderChairItem(
                        `sq2-right`,
                        table.x + table.width,
                        table.y + table.height / 2 - 8,
                        12,
                        16,
                        3,
                        resGuests,
                        0,
                        table.x + table.width + 6,
                        table.y + table.height / 2
                      )}
                  </>
                ) : table.type === 'square' ? (
                  /* 4-Person Square Table */
                  <>
                    {renderChairItem(
                      `sq4-top`,
                      table.x + table.width / 2 - 8,
                      table.y - 12,
                      16,
                      12,
                      0,
                      resGuests,
                      0,
                      table.x + table.width / 2,
                      table.y - 6
                    )}
                    {renderChairItem(
                      `sq4-bot`,
                      table.x + table.width / 2 - 8,
                      table.y + table.height,
                      16,
                      12,
                      1,
                      resGuests,
                      0,
                      table.x + table.width / 2,
                      table.y + table.height + 6
                    )}
                    {renderChairItem(
                      `sq4-left`,
                      table.x - 12,
                      table.y + table.height / 2 - 8,
                      12,
                      16,
                      2,
                      resGuests,
                      0,
                      table.x - 6,
                      table.y + table.height / 2
                    )}
                    {renderChairItem(
                      `sq4-right`,
                      table.x + table.width,
                      table.y + table.height / 2 - 8,
                      12,
                      16,
                      3,
                      resGuests,
                      0,
                      table.x + table.width + 6,
                      table.y + table.height / 2
                    )}
                  </>
                ) : (
                  /* Rectangular / Modular Combined Table (4, 6, 8, 10, 12... seats) */
                  <>
                    {table.width >= table.height ? (
                      /* Horizontal Table: Chairs on Top and Bottom */
                      (() => {
                        const totalChairs = Math.max(table.seats || 4, resGuests);
                        const pairs = Math.ceil(totalChairs / 2);
                        return Array.from({ length: pairs }).map((_, idx) => {
                          const cx = table.x + (table.width / (pairs + 1)) * (idx + 1);
                          const topIndex = idx * 2;
                          const botIndex = idx * 2 + 1;
                          return (
                            <React.Fragment key={`rect-pair-${idx}`}>
                              {renderChairItem(
                                `rect-top-${idx}`,
                                cx - 8,
                                table.y - 13,
                                16,
                                13,
                                topIndex,
                                resGuests,
                                0,
                                cx,
                                table.y - 6.5
                              )}
                              {renderChairItem(
                                `rect-bot-${idx}`,
                                cx - 8,
                                table.y + table.height,
                                16,
                                13,
                                botIndex,
                                resGuests,
                                0,
                                cx,
                                table.y + table.height + 6.5
                              )}
                            </React.Fragment>
                          );
                        });
                      })()
                    ) : (
                      /* Vertical Table: Chairs on Left and Right */
                      (() => {
                        const totalChairs = Math.max(table.seats || 4, resGuests);
                        const pairs = Math.ceil(totalChairs / 2);
                        return Array.from({ length: pairs }).map((_, idx) => {
                          const cy = table.y + (table.height / (pairs + 1)) * (idx + 1);
                          const leftIndex = idx * 2;
                          const rightIndex = idx * 2 + 1;
                          return (
                            <React.Fragment key={`rect-vert-pair-${idx}`}>
                              {renderChairItem(
                                `rect-left-${idx}`,
                                table.x - 13,
                                cy - 8,
                                13,
                                16,
                                leftIndex,
                                resGuests,
                                0,
                                table.x - 6.5,
                                cy
                              )}
                              {renderChairItem(
                                `rect-right-${idx}`,
                                table.x + table.width,
                                cy - 8,
                                13,
                                16,
                                rightIndex,
                                resGuests,
                                0,
                                table.x + table.width + 6.5,
                                cy
                              )}
                            </React.Fragment>
                          );
                        });
                      })()
                    )}
                  </>
                )}

                {/* --- TABLE SURFACE --- */}
                {isRound ? (
                  <circle
                    cx={table.x}
                    cy={table.y}
                    r={table.radius}
                    fill={fill}
                    stroke={borderStroke}
                    strokeWidth={strokeW}
                  />
                ) : (
                  <rect
                    x={table.x}
                    y={table.y}
                    width={table.width}
                    height={table.height}
                    rx="8"
                    fill={fill}
                    stroke={borderStroke}
                    strokeWidth={strokeW}
                  />
                )}

                {/* --- TABLE TEXT / RESERVATION INFO (ALWAYS UPRIGHT AND HORIZONTAL) --- */}
                {isRound ? (
                  <g
                    pointerEvents="none"
                    transform={rotation ? `rotate(${-rotation} ${table.x} ${table.y})` : undefined}
                  >
                    <text
                      x={table.x}
                      y={table.reservation ? table.y - 7 : table.y - 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      fontSize="11.5"
                      fontWeight="bold"
                      fontFamily="Oswald"
                    >
                      {table.name}
                    </text>
                    <text
                      x={table.x}
                      y={table.reservation ? table.y + 7 : table.y + 10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      fontSize={table.reservation ? '7.5' : '8.5'}
                      fontWeight={table.reservation ? 'bold' : '600'}
                    >
                      {table.reservation ? `Prenotato` : 'Disponibile'}
                    </text>
                    {table.reservation && (
                      <text
                        x={table.x}
                        y={table.y + 17}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#ffffff"
                        fontSize="7.5"
                        fontWeight="bold"
                      >
                        {`${table.reservation.clientName || table.reservation.name || 'Ospite'} (${table.reservation.guests}p)`}
                      </text>
                    )}
                  </g>
                ) : (
                  <g
                    pointerEvents="none"
                    transform={rotation ? `rotate(${-rotation} ${centerX} ${centerY})` : undefined}
                  >
                    <text
                      x={centerX}
                      y={table.reservation ? centerY - 11 : centerY - 5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="Oswald"
                    >
                      {table.name}
                    </text>
                    <text
                      x={centerX}
                      y={table.reservation ? centerY + 2 : centerY + 7}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      fontSize={table.reservation ? '8' : '9'}
                      fontWeight={table.reservation ? 'bold' : '600'}
                    >
                      {table.reservation ? 'Prenotato' : 'Disponibile'}
                    </text>
                    {table.reservation && (
                      <text
                        x={centerX}
                        y={centerY + 14}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#ffffff"
                        fontSize="8"
                        fontWeight="bold"
                      >
                        {`${table.reservation.clientName || table.reservation.name || 'Ospite'} (${table.reservation.guests}p)`}
                      </text>
                    )}
                  </g>
                )}

                {/* --- QUICK ROTATE BUTTON ON HOVER (1 CLICK TO ROTATE 90°) --- */}
                {!isStructureEditMode && !draggedItemId && (
                  <g
                    onClick={(e) => {
                      e.stopPropagation();
                      rotateTable(table.id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    transform={`${rotation ? `rotate(${-rotation} ${centerX} ${centerY}) ` : ''}translate(${
                      isRound ? table.x + table.radius - 2 : table.x + table.width - 2
                    }, ${isRound ? table.y - table.radius - 2 : table.y - 10})`}
                  >
                    <circle
                      r="11"
                      fill="#1e1e1e"
                      stroke="#ffa323"
                      strokeWidth="1.5"
                      className="hover:fill-[#ffa323] transition-colors"
                    />
                    <path
                      d="M -3.5 -1 A 4 4 0 1 1 -0.8 3.5 M -3.5 -1 L -3.5 -4 M -3.5 -1 L -0.8 -1"
                      fill="none"
                      stroke="#ffa323"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover:stroke-black"
                    />
                  </g>
                )}
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* TABLE MERGE PROXIMITY HINT & CONNECTOR                      */}
          {/* ============================================================ */}
          {mergeCandidate && (
            <g pointerEvents="none">
              {/* Target table pulsing snap ring */}
              <circle
                cx={
                  mergeCandidate.targetTable.type === 'round'
                    ? mergeCandidate.targetTable.x
                    : mergeCandidate.targetTable.x + (mergeCandidate.targetTable.width || 60) / 2
                }
                cy={
                  mergeCandidate.targetTable.type === 'round'
                    ? mergeCandidate.targetTable.y
                    : mergeCandidate.targetTable.y + (mergeCandidate.targetTable.height || 60) / 2
                }
                r={
                  mergeCandidate.targetTable.type === 'round'
                    ? mergeCandidate.targetTable.radius + 20
                    : (mergeCandidate.targetTable.width || 60) / 2 + 25
                }
                fill="rgba(16, 185, 129, 0.2)"
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray="6 4"
              />

              {/* Glowing Connection Line */}
              <line
                x1={
                  mergeCandidate.sourceTable.type === 'round'
                    ? mergeCandidate.sourceTable.x
                    : mergeCandidate.sourceTable.x + (mergeCandidate.sourceTable.width || 60) / 2
                }
                y1={
                  mergeCandidate.sourceTable.type === 'round'
                    ? mergeCandidate.sourceTable.y
                    : mergeCandidate.sourceTable.y + (mergeCandidate.sourceTable.height || 60) / 2
                }
                x2={
                  mergeCandidate.targetTable.type === 'round'
                    ? mergeCandidate.targetTable.x
                    : mergeCandidate.targetTable.x + (mergeCandidate.targetTable.width || 60) / 2
                }
                y2={
                  mergeCandidate.targetTable.type === 'round'
                    ? mergeCandidate.targetTable.y
                    : mergeCandidate.targetTable.y + (mergeCandidate.targetTable.height || 60) / 2
                }
                stroke="#10b981"
                strokeWidth="3.5"
                strokeDasharray="6 3"
              />

              {/* Floating Badge Tooltip: "UNISCI I TAVOLI" */}
              <g transform={`translate(${mergeCandidate.midX}, ${mergeCandidate.midY - 45})`}>
                <rect
                  x="-90"
                  y="-18"
                  width="180"
                  height="36"
                  rx="18"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#000000"
                  fontSize="12.5"
                  fontWeight="bold"
                  fontFamily="Oswald"
                  letterSpacing="1.2"
                >
                  🔗 UNISCI I TAVOLI
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* POPOVER CARD FOR TABLE (IN SERVICE MODE) */}
        {activePopoverTable && !draggedItemId && !isStructureEditMode && (
          <TableDetailsPopover
            table={activePopoverTable}
            onClose={() => setActivePopoverTable(null)}
            onEdit={handleOpenEditModal}
            onClear={(tId) => {
              clearTable(tId);
              setActivePopoverTable(null);
            }}
            onRotate={rotateTable}
            onDeleteTable={deleteTable}
            onSplit={splitTable}
          />
        )}

        {/* STRUCTURE INSPECTOR POPOVER (IN ARCHITECT MODE) */}
        {isStructureEditMode && selectedStructureItem && (
          <StructureInspectorPopover
            item={selectedStructureItem}
            onClose={() => setSelectedStructureItem(null)}
          />
        )}
      </div>

      {/* RESERVATION MODAL */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTable(null);
        }}
        table={selectedTable}
        onSave={saveReservation}
        onClear={clearTable}
        onRotate={rotateTable}
        onDelete={deleteTable}
      />

      {/* ADD TABLE MODAL (4 TYPES) */}
      <AddTableModal
        isOpen={isAddTableOpen}
        onClose={() => setIsAddTableOpen(false)}
      />

      {/* ADD ROOM ZONE MODAL */}
      <AddZoneModal
        isOpen={isAddZoneOpen}
        onClose={() => setIsAddZoneOpen(false)}
      />

      {/* ADD STRUCTURE MODAL */}
      <AddStructureModal
        isOpen={isAddStructureOpen}
        onClose={() => setIsAddStructureOpen(false)}
      />
    </div>
  );
};
