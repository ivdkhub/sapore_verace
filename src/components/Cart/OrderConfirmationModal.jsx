import React from 'react';
import { CheckCircle2, Banknote, CreditCard, Phone, MapPin, Clock, X, Store } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { BUSINESS } from '../../config/business';
import { MoustacheIcon } from '../common/Icons';

// Testi della conferma ordine nelle lingue del sito
const TEXTS = {
  it: {
    title: 'ORDINE RICEVUTO CON SUCCESSO!',
    intro: 'Grazie per aver scelto Sapore Verace! La cucina ha ricevuto il tuo ordine.',
    code: 'Codice ordine',
    payDelivery: 'PAGAMENTO ALLA CONSEGNA',
    payPickup: 'PAGAMENTO AL RITIRO IN PIZZERIA',
    amount: 'Importo da pagare:',
    method: 'Modalità:',
    cashDelivery: 'Contanti al rider: ti consigliamo di preparare l’importo esatto.',
    cardDelivery: 'Carta o bancomat al rider, che porta il POS portatile.',
    cashPickup: 'Contanti alla cassa al momento del ritiro.',
    cardPickup: 'Carta o bancomat alla cassa al momento del ritiro.',
    when: 'Orario',
    asapDelivery: 'Prima possibile (circa 30-45 minuti)',
    asapPickup: 'Prima possibile (circa 15-20 minuti)',
    scheduledDelivery: 'Consegna prevista alle',
    scheduledPickup: 'Ritiro previsto alle',
    destination: 'Indirizzo di consegna',
    pickupPoint: 'Punto di ritiro',
    customer: 'Cliente',
    summary: 'Riepilogo prodotti:',
    deliveryFee: 'Spese di consegna:',
    help: 'Vuoi modificare o aggiungere qualcosa? Chiama il',
    ok: 'PERFETTO, HO CAPITO!',
    close: 'Chiudi conferma ordine',
  },
  en: {
    title: 'ORDER RECEIVED!',
    intro: 'Thank you for choosing Sapore Verace! Our kitchen has received your order.',
    code: 'Order code',
    payDelivery: 'PAYMENT ON DELIVERY',
    payPickup: 'PAYMENT AT PICKUP',
    amount: 'Amount to pay:',
    method: 'Method:',
    cashDelivery: 'Cash to the rider: please have the exact amount ready.',
    cardDelivery: 'Card to the rider, who brings a portable POS.',
    cashPickup: 'Cash at the counter when you pick up.',
    cardPickup: 'Card at the counter when you pick up.',
    when: 'Time',
    asapDelivery: 'As soon as possible (about 30-45 minutes)',
    asapPickup: 'As soon as possible (about 15-20 minutes)',
    scheduledDelivery: 'Delivery expected at',
    scheduledPickup: 'Pickup expected at',
    destination: 'Delivery address',
    pickupPoint: 'Pickup point',
    customer: 'Customer',
    summary: 'Order summary:',
    deliveryFee: 'Delivery fee:',
    help: 'Need to change or add something? Call',
    ok: 'GOT IT, THANKS!',
    close: 'Close order confirmation',
  },
  de: {
    title: 'BESTELLUNG ERHALTEN!',
    intro: 'Danke, dass du Sapore Verace gewählt hast! Die Küche hat deine Bestellung erhalten.',
    code: 'Bestellcode',
    payDelivery: 'ZAHLUNG BEI LIEFERUNG',
    payPickup: 'ZAHLUNG BEI ABHOLUNG',
    amount: 'Zu zahlender Betrag:',
    method: 'Zahlungsart:',
    cashDelivery: 'Bar beim Fahrer: bitte den passenden Betrag bereithalten.',
    cardDelivery: 'Mit Karte beim Fahrer, der ein mobiles Kartenterminal dabei hat.',
    cashPickup: 'Bar an der Kasse bei der Abholung.',
    cardPickup: 'Mit Karte an der Kasse bei der Abholung.',
    when: 'Uhrzeit',
    asapDelivery: 'So schnell wie möglich (ca. 30-45 Minuten)',
    asapPickup: 'So schnell wie möglich (ca. 15-20 Minuten)',
    scheduledDelivery: 'Lieferung voraussichtlich um',
    scheduledPickup: 'Abholung voraussichtlich um',
    destination: 'Lieferadresse',
    pickupPoint: 'Abholort',
    customer: 'Kunde',
    summary: 'Bestellübersicht:',
    deliveryFee: 'Liefergebühr:',
    help: 'Möchtest du etwas ändern oder hinzufügen? Ruf an:',
    ok: 'ALLES KLAR, DANKE!',
    close: 'Bestellbestätigung schließen',
  },
  sq: {
    title: 'POROSIA U MOR ME SUKSES!',
    intro: 'Faleminderit që zgjodhët Sapore Verace! Kuzhina e ka marrë porosinë tuaj.',
    code: 'Kodi i porosisë',
    payDelivery: 'PAGESA NË DORËZIM',
    payPickup: 'PAGESA NË MARRJE',
    amount: 'Shuma për të paguar:',
    method: 'Mënyra:',
    cashDelivery: 'Para në dorë te korrieri: ju lutemi përgatitni shumën e saktë.',
    cardDelivery: 'Me kartë te korrieri, që sjell POS portativ.',
    cashPickup: 'Para në dorë në arkë kur e merrni.',
    cardPickup: 'Me kartë në arkë kur e merrni.',
    when: 'Ora',
    asapDelivery: 'Sa më shpejt (rreth 30-45 minuta)',
    asapPickup: 'Sa më shpejt (rreth 15-20 minuta)',
    scheduledDelivery: 'Dorëzimi i parashikuar në orën',
    scheduledPickup: 'Marrja e parashikuar në orën',
    destination: 'Adresa e dorëzimit',
    pickupPoint: 'Vendi i marrjes',
    customer: 'Klienti',
    summary: 'Përmbledhja e produkteve:',
    deliveryFee: 'Kosto e dorëzimit:',
    help: 'Doni të ndryshoni ose shtoni diçka? Telefononi',
    ok: 'NË RREGULL, FALEMINDERIT!',
    close: 'Mbyll konfirmimin e porosisë',
  },
};

export const OrderConfirmationModal = () => {
  const { confirmedOrder, setConfirmedOrder } = useCart();
  const { lang } = useLanguage();
  const tx = TEXTS[lang] || TEXTS.it;

  if (!confirmedOrder) return null;

  const isDelivery = confirmedOrder.orderType === 'delivery';
  const isCash = confirmedOrder.paymentMethod === 'cash';
  const isAsap = !confirmedOrder.requestedTime || confirmedOrder.requestedTime === 'asap';
  const { address: addr } = BUSINESS;

  const paymentText = isDelivery
    ? isCash ? tx.cashDelivery : tx.cardDelivery
    : isCash ? tx.cashPickup : tx.cardPickup;
  const whenText = isAsap
    ? isDelivery ? tx.asapDelivery : tx.asapPickup
    : `${isDelivery ? tx.scheduledDelivery : tx.scheduledPickup} ${confirmedOrder.requestedTime}`;

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
          aria-label={tx.close}
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
              SAPORE VERACE • {addr.city.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Grand Confirmation Title */}
        <h2 className="font-oswald text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
          {tx.title}
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans mt-1.5 max-w-md mx-auto leading-relaxed">
          {tx.intro}
        </p>

        {/* Order Code Pill */}
        <div className="mt-3.5 inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 font-oswald text-xs tracking-widest uppercase text-white/80">
          {tx.code}: <strong className="text-[#ffa323] font-mono text-sm ml-1">#{confirmedOrder.orderId}</strong>
        </div>

        {/* Pagamento (alla consegna o al ritiro) */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#241d13] to-[#1c1611] border-2 border-[#ffa323]/50 text-left shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            {isCash ? (
              <Banknote className="w-5 h-5 text-[#ffa323]" />
            ) : (
              <CreditCard className="w-5 h-5 text-[#d2401e]" />
            )}
            <span className="font-oswald text-xs sm:text-sm font-black tracking-wider uppercase text-[#ffa323]">
              {isDelivery ? tx.payDelivery : tx.payPickup}
            </span>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-2 mb-2.5">
            <span className="text-xs font-oswald text-white/70 uppercase tracking-wider">{tx.amount}</span>
            <span className="font-oswald text-2xl font-black text-white">
              €{Number(confirmedOrder.totalPrice || 0).toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-stone-300 font-sans leading-relaxed flex items-start gap-1.5">
            <span className={`${isCash ? 'text-[#ffa323]' : 'text-emerald-400'} font-bold`}>● {tx.method}</span>
            <span>{paymentText}</span>
          </p>
        </div>

        {/* Orario e indirizzo */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-xs font-oswald text-white/60 uppercase mb-1">
              <Clock className="w-3.5 h-3.5 text-[#ffa323]" />
              <span>{tx.when}</span>
            </div>
            <p className="font-oswald text-sm font-bold text-white uppercase">{whenText}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-xs font-oswald text-white/60 uppercase mb-1">
              {isDelivery ? (
                <MapPin className="w-3.5 h-3.5 text-[#d2401e]" />
              ) : (
                <Store className="w-3.5 h-3.5 text-[#ffa323]" />
              )}
              <span>{isDelivery ? tx.destination : tx.pickupPoint}</span>
            </div>
            <p className="font-oswald text-xs font-bold text-white truncate">
              {isDelivery
                ? `${confirmedOrder.customer?.address || ''}, ${confirmedOrder.customer?.city || addr.city}`
                : `${addr.street}, ${addr.city} (${addr.province})`}
            </p>
            <span className="text-[11px] text-white/50 block font-sans mt-0.5 truncate">
              {tx.customer}: {confirmedOrder.customer?.fullName || ''} {confirmedOrder.customer?.phone ? `(${confirmedOrder.customer?.phone})` : ''}
            </span>
          </div>
        </div>

        {/* Riepilogo prodotti */}
        <div className="mt-4 p-4 rounded-2xl bg-[#0f0f0f] border border-white/10 text-left">
          <span className="text-[11px] font-oswald text-white/50 uppercase tracking-wider block mb-2 font-bold">
            {tx.summary}
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
              <span>{tx.deliveryFee}</span>
              <span className="font-oswald text-white">€{Number(confirmedOrder.deliveryFee).toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Assistenza */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-white/50 font-sans">
          <Phone className="w-3.5 h-3.5 text-[#ffa323]" />
          <span>{tx.help}</span>
          <a href={BUSINESS.phoneHref} className="text-[#ffa323] hover:underline font-bold">
            {BUSINESS.phone}
          </a>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <button
            onClick={handleClose}
            className="w-full py-4 bg-gradient-to-r from-[#d2401e] to-[#ffa323] hover:from-[#b83314] hover:to-[#e68e17] text-white font-oswald text-sm font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-[#d2401e]/30 cursor-pointer active:scale-95 hover:scale-[1.02]"
          >
            {tx.ok}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
