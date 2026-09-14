import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ChefHat,
  Flame,
  Bike,
  Smile,
  Clock,
  MapPin,
  FastForward,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

const STEP_DEFINITIONS = [
  { id: 'received', icon: CheckCircle2, progress: 15 },
  { id: 'preparing', icon: ChefHat, progress: 40 },
  { id: 'baking', icon: Flame, progress: 65 },
  { id: 'delivering', icon: Bike, progress: 90 },
  { id: 'delivered', icon: Smile, progress: 100 },
];

export const OrderTrackingModal = () => {
  const { activeOrder, isTrackingOpen, setIsTrackingOpen } = useCart();
  const { t } = useLanguage();

  const trk = t.tracking || {};
  const stepsTr = trk.steps || {};

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(1380); // ~23 mins
  const [simulationSpeed, setSimulationSpeed] = useState(1);

  useEffect(() => {
    if (!activeOrder || !isTrackingOpen) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [activeOrder, isTrackingOpen, simulationSpeed]);

  // Step automatic progression simulator
  useEffect(() => {
    if (!activeOrder || !isTrackingOpen) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEP_DEFINITIONS.length - 1) {
          const next = prev + 1;
          const updated = {
            ...activeOrder,
            status: STEP_DEFINITIONS[next].id,
            progress: STEP_DEFINITIONS[next].progress,
          };
          localStorage.setItem('sapore_verace_active_order', JSON.stringify(updated));
          return next;
        }
        return prev;
      });
    }, 9000 / simulationSpeed);

    return () => clearInterval(timer);
  }, [activeOrder, isTrackingOpen, simulationSpeed]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsTrackingOpen(false);
      }
    };
    if (isTrackingOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTrackingOpen, setIsTrackingOpen]);

  if (!isTrackingOpen || !activeOrder) return null;

  const currentDef = STEP_DEFINITIONS[currentStepIndex] || STEP_DEFINITIONS[0];
  const currentStepTr = stepsTr[currentDef.id] || {
    title: currentDef.id.toUpperCase(),
    desc: '',
  };
  const progressPercent = currentDef.progress;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const advanceStep = () => {
    if (currentStepIndex < STEP_DEFINITIONS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={() => setIsTrackingOpen(false)}
    >
      <div
        className="relative w-full max-w-3xl bg-[#181818] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-10 my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#d2401e]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsTrackingOpen(false);
          }}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all cursor-pointer z-50 shadow-md active:scale-95"
          aria-label="Close tracking"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10 relative z-10 pr-10 sm:pr-0">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="text-xs font-oswald tracking-[0.25em] text-[#ffa323] uppercase font-bold">
                {trk.tag || 'LIVE ORDER TRACKING'}
              </span>
            </div>
            <h2 className="font-oswald text-2xl sm:text-3xl font-black text-white tracking-wide">
              {trk.orderTitle || 'ORDINE'} #{activeOrder.orderId}
            </h2>
          </div>

          {/* Countdown & ETA Stamp */}
          <div className="bg-[#242424] border border-white/15 px-5 py-2.5 rounded-xl flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#d2401e] animate-pulse" />
            <div>
              <span className="text-[10px] font-oswald text-white/50 tracking-widest uppercase block">
                {trk.etaTitle || 'TEMPO STIMATO'}
              </span>
              <span className="font-oswald text-xl font-bold text-white tracking-wider leading-none">
                {currentStepIndex === 4 ? (trk.arrived || 'ARRIVATO!') : `~ ${timeDisplay} MIN`}
              </span>
            </div>
          </div>
        </div>

        {/* LIVE SIMULATOR MAP ROUTE */}
        <div className="relative bg-[#121212] border border-white/10 rounded-xl p-6 mb-8 overflow-hidden">
          {/* Animated Route Line */}
          <div className="relative h-3 bg-[#242424] rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-[#ffa323] to-[#d2401e] transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 5 Milestone Badges */}
          <div className="grid grid-cols-5 gap-2 text-center">
            {STEP_DEFINITIONS.map((step, idx) => {
              const StepIcon = step.icon;
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const sTitle = stepsTr[step.id]?.title || step.id.toUpperCase();

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      isCurrent
                        ? 'bg-[#d2401e] text-white ring-4 ring-[#d2401e]/30 scale-110 shadow-lg'
                        : isPast
                        ? 'bg-[#ffa323] text-black'
                        : 'bg-[#242424] text-white/30 border border-white/10'
                    }`}
                  >
                    <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span
                    className={`text-[9px] sm:text-[11px] font-oswald tracking-wider uppercase line-clamp-1 ${
                      isCurrent
                        ? 'text-white font-bold'
                        : isPast
                        ? 'text-[#ffa323]'
                        : 'text-white/40'
                    }`}
                  >
                    {sTitle.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CURRENT STATUS HIGHLIGHT */}
        <div className="bg-[#202020] border border-[#d2401e]/30 rounded-xl p-5 mb-8 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#d2401e] text-white flex items-center justify-center shrink-0 shadow-lg">
            {React.createElement(currentDef.icon, { className: 'w-6 h-6' })}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d2401e] animate-ping" />
              <h4 className="font-oswald text-lg font-bold text-white uppercase tracking-wider">
                {currentStepTr.title}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-white/70 font-sans mt-1 leading-relaxed">
              {currentStepTr.desc}
            </p>
          </div>
        </div>

        {/* CUSTOMER & ORDER SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10 text-xs sm:text-sm">
          {/* Destination */}
          <div className="space-y-1.5">
            <h5 className="font-oswald text-xs uppercase tracking-widest text-white/50 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#d2401e]" /> {trk.deliveryAddressTitle || 'INDIRIZZO DI CONSEGNA'}
            </h5>
            <p className="text-white font-bold">{activeOrder.customer.fullName}</p>
            <p className="text-white/80">{activeOrder.customer.address}</p>
            <p className="text-white/60">
              {activeOrder.customer.city} ({activeOrder.customer.postalCode})
            </p>
          </div>

          {/* Order items mini list */}
          <div>
            <h5 className="font-oswald text-xs uppercase tracking-widest text-white/50 mb-2">
              {trk.summaryTitle || 'RIEPILOGO PIZZE'}
            </h5>
            <ul className="space-y-1 text-white/80">
              {activeOrder.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-oswald font-bold text-[#d2401e]">
                    €{(item.numericPrice * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-oswald text-sm font-bold text-white pt-2 mt-2 border-t border-white/10">
              <span>{trk.totalWithDelivery || 'TOTALE (incl. consegna):'}</span>
              <span className="text-[#ffa323]">€{activeOrder.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* SIMULATOR CONTROLS */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-oswald text-white/50 uppercase tracking-wider">
              {trk.simulationLabel || 'SIMULAZIONE:'}
            </span>
            <button
              onClick={() => setSimulationSpeed((prev) => (prev === 1 ? 4 : 1))}
              className={`px-3 py-1.5 rounded-md font-oswald text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                simulationSpeed > 1
                  ? 'bg-[#ffa323] text-black font-bold'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>{simulationSpeed > 1 ? (trk.speedFast || 'VELOCE (4x)') : (trk.speedNormal || 'VELOCE (OFF)')}</span>
            </button>
          </div>

          {currentStepIndex < STEP_DEFINITIONS.length - 1 && (
            <button
              onClick={advanceStep}
              className="px-5 py-2 bg-[#d2401e] hover:bg-[#b83314] text-white font-oswald text-xs tracking-widest uppercase font-bold rounded-lg transition-colors cursor-pointer"
            >
              {trk.advanceStepBtn || 'AVANZA STATO ORDINE →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
