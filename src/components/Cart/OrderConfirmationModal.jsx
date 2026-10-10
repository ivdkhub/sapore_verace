import React from 'react';
import { CheckCircle2, Bike, Store, Banknote, CreditCard, Phone, MapPin, Clock, X, ChefHat } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { MoustacheIcon } from '../common/Icons';

export const OrderConfirmationModal = () => {
  const { confirmedOrder, setConfirmedOrder } = useCart();

  if (!confirmedOrder) return null;

  const isDelivery = confirmedOrder.orderType === 'delivery';
  const isCash = confirmedOrder.paymentMethod === 'cash';

  const handleClose = () => {
    setConfirmedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-xl bg-[#181818] border border-white/15 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-6 sm:p-8 my-8 text-white text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Chiudi conferma ordine"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Success Badge */}
        <div className="inline-flex flex-col items-center justify-center mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 animate-in zoom-in-75 duration-300 mb-3">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-2">
            <MoustacheIcon className="w-5 h-2.5 text-[#d2401e]" />
            <span className="text-[11px] font-oswald text-[#ffa323] tracking-[0.25em] uppercase font-bold">
              SAPORE VERACE • CASTELLANZA
            </span>
          </div>
        </div>

        {/* Grand Confirmation Title */}
        <h2 className="font-oswald text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
          ORDINE RICEVUTO CON SUCCESSO!
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans mt-1.5 max-w-md mx-auto leading-relaxed">
          Grazie per aver scelto Sapore Verace! La nostra cucina ha preso in carico la tua comanda ed è al lavoro sul forno a legna.
        </p>

        {/* Order Code Pill */}
        <div className="mt-3.5 inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 font-oswald text-xs tracking-widest uppercase text-white/80">
          Codice Ordine: <strong className="text-[#ffa323] font-mono text-sm ml-1">#{confirmedOrder.orderId}</strong>
        </div>

        {/* ============================================================ */}
        {/* PAYMENT HIGHLIGHT (Only to Courier: Cash or Card)            */}
        {/* ============================================================ */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#241d13] to-[#1c1611] border-2 border-[#ffa323]/50 text-left shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            {isCash ? (
              <Banknote className="w-5 h-5 text-[#ffa323]" />
            ) : (
              <CreditCard className="w-5 h-5 text-[#d2401e]" />
            )}
            <span className="font-oswald text-xs sm:text-sm font-black tracking-wider uppercase text-[#ffa323]">
              PAGAMENTO AL CORRIERE ALLA CONSEGNA
            </span>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-2 mb-2.5">
            <span className="text-xs font-oswald text-white/70 uppercase tracking-wider">
              Importo da corrispondere:
            </span>
            <span className="font-oswald text-2xl font-black text-white">
              €{confirmedOrder.totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="text-xs text-stone-300 font-sans leading-relaxed">
            {isCash ? (
              <p className="flex items-start gap-1.5">
                <span className="text-[#ffa323] font-bold">● Modalità:</span>
                <span>
                  <strong>Contanti al corriere</strong>. Ti consigliamo di preparare l'importo esatto all'arrivo del rider per facilitare la consegna.
                </span>
              </p>
            ) : (
              <p className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">● Modalità:</span>
                <span>
                  <strong>Carta / Bancomat al corriere</strong>. Il nostro rider porterà con sé il POS portatile per pagamenti con carta o smartphone.
                </span>
              </p>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* DELIVERY / PICKUP INFO & ESTIMATE                            */}
        {/* ============================================================ */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-xs font-oswald text-white/60 uppercase mb-1">
              <Clock className="w-3.5 h-3.5 text-[#ffa323]" />
              <span>Tempo Indicativo</span>
            </div>
            <p className="font-oswald text-sm font-bold text-white uppercase">
              {isDelivery ? '~30 - 45 Minuti' : '~15 - 20 Minuti'}
            </p>
            <span className="text-[11px] text-white/50 block font-sans mt-0.5">
              {isDelivery ? 'Cottura a 450°C e consegna espressa' : 'Pronto caldo da forno per il ritiro'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-xs font-oswald text-white/60 uppercase mb-1">
              {isDelivery ? (
                <MapPin className="w-3.5 h-3.5 text-[#d2401e]" />
              ) : (
                <Store className="w-3.5 h-3.5 text-[#ffa323]" />
              )}
              <span>{isDelivery ? 'Destinazione Consegna' : 'Punto di Ritiro'}</span>
            </div>
            <p className="font-oswald text-xs font-bold text-white truncate">
              {isDelivery
                ? `${confirmedOrder.customer?.address || ''}, ${confirmedOrder.customer?.city || 'Castellanza'}`
                : 'Via Borsano 44, Castellanza (VA)'}
            </p>
            <span className="text-[11px] text-white/50 block font-sans mt-0.5 truncate">
              Cliente: {confirmedOrder.customer?.fullName || ''} {confirmedOrder.customer?.phone ? `(${confirmedOrder.customer?.phone})` : ''}
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ORDER ITEMS SUMMARY                                          */}
        {/* ============================================================ */}
        <div className="mt-4 p-4 rounded-2xl bg-[#0f0f0f] border border-white/10 text-left">
          <span className="text-[11px] font-oswald text-white/50 uppercase tracking-wider block mb-2 font-bold">
            Riepilogo Prodotti Ordinati:
          </span>
          <div className="divide-y divide-white/5 max-h-40 overflow-y-auto pr-1">
            {confirmedOrder.items.map((item, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-5 h-5 rounded-md bg-white/10 text-[#ffa323] font-oswald font-bold flex items-center justify-center text-[11px] shrink-0">
                    {item.quantity}x
                  </span>
                  <span className="text-white font-medium truncate">{item.name}</span>
                </div>
                <span className="font-oswald text-white/80 shrink-0 font-bold">
                  €{((item.numericPrice || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {confirmedOrder.deliveryFee > 0 && (
            <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
              <span>Spese di consegna espressa:</span>
              <span className="font-oswald text-white">€{confirmedOrder.deliveryFee.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Need Assistance notice */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/50 font-sans">
          <Phone className="w-3.5 h-3.5 text-[#ffa323]" />
          <span>Hai bisogno di modificare o aggiungere qualcosa? Chiama al</span>
          <a href="tel:03311081917" className="text-[#ffa323] hover:underline font-bold">
            0331 108 1917
          </a>
        </div>

        {/* Primary CTA: Close and return to website */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <button
            onClick={handleClose}
            className="w-full py-4 bg-gradient-to-r from-[#d2401e] to-[#ffa323] hover:from-[#b83314] hover:to-[#e68e17] text-white font-oswald text-sm font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-[#d2401e]/30 cursor-pointer active:scale-95 hover:scale-[1.02]"
          >
            PERFETTO, HO CAPITO!
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
