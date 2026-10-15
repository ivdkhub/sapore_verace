import React, { useMemo, useState } from 'react';
import { X, MapPin, Phone, User, Store, Bike, Banknote, CreditCard, ShieldCheck, Clock } from 'lucide-react';
import { useCart, DELIVERY_FEE } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAdmin, getTodayDateString } from '../../context/AdminContext';
import { timeToMinutes, minutesToTime } from '../../utils/schedule';
import { PrivacyConsent } from '../Legal/PrivacyConsent';
import { MoustacheIcon } from '../common/Icons';

const PREP_MINUTES = 20; // come 'orders.prep_minutes' in api/config.php

// Orari ordinabili per oggi, ogni 15 minuti, dalle fasce di apertura impostate in admin
const useTodayOrderTimes = (isOpenModal) => {
  const { isRestaurantOpenOnDate, openingHours, holidays } = useAdmin();
  return useMemo(() => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const times = [];
    let openNow = false;
    // Turni di oggi + quello di ieri sera se chiude dopo mezzanotte (minuti dalla mezzanotte di oggi)
    [[yesterday, -1440], [now, 0]].forEach(([day, offset]) => {
      ['pranzo', 'cena'].forEach((shift) => {
        const check = isRestaurantOpenOnDate(getTodayDateString(day), shift);
        if (!check.isOpen) return;
        let open = timeToMinutes(check.shiftHours?.open);
        let close = timeToMinutes(check.shiftHours?.close);
        if (open === null || close === null) return;
        if (close <= open) close += 24 * 60;
        open += offset;
        close += offset;
        if (close <= 0) return;
        if (nowMin >= open && nowMin <= close - 15) openNow = true;
        const start = Math.max(open, Math.ceil((nowMin + PREP_MINUTES) / 15) * 15);
        for (let m = start; m <= close; m += 15) {
          const label = minutesToTime(m);
          if (!times.includes(label)) times.push(label);
        }
      });
    });
    return { times, openNow };
    // ricalcolato a ogni apertura del checkout e quando cambiano orari/ferie
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenModal, openingHours, holidays]);
};

export const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, totalPrice, orderType, setOrderType, placeOrder } = useCart();
  const { t } = useLanguage();
  const { times: orderTimes, openNow } = useTodayOrderTimes(isCheckoutOpen);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tc = t.checkout || {};

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Castellanza',
    postalCode: '21053',
    notes: '',
    pickupTime: 'asap',
    deliveryTime: 'asap',
    paymentMethod: 'cash',
    privacyAccepted: false,
  });

  if (!isCheckoutOpen) return null;

  const timeKey = orderType === 'delivery' ? 'deliveryTime' : 'pickupTime';
  // Se adesso siamo chiusi, "prima possibile" non vale: si usa il primo orario disponibile
  const selectedTime = !openNow && formData[timeKey] === 'asap' ? orderTimes[0] || 'asap' : formData[timeKey];
  const noTimesToday = !openNow && orderTimes.length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setErrorMessage(tc.alertContact || 'Per favore compila il tuo nome e numero di telefono.');
      return;
    }
    if (orderType === 'delivery' && !/[0-9]/.test(formData.address)) {
      setErrorMessage(tc.alertAddress || "Per favore inserisci l'indirizzo di consegna con il numero civico.");
      return;
    }
    if (!formData.privacyAccepted) {
      setErrorMessage(t.legal?.consentRequired || "Per continuare accetta l'informativa privacy.");
      return;
    }
    setIsSubmitting(true);
    try {
      await placeOrder({ ...formData, [timeKey]: selectedTime, orderType });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-10 my-8">
        {/* Close Button */}
        <button
          onClick={() => setIsCheckoutOpen(false)}
          className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors p-2 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <MoustacheIcon className="w-6 h-3 text-[#d2401e]" />
          </div>
          <h3 className="font-oswald text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
            {orderType === 'delivery' ? (tc.deliveryTitle || 'CONFERMA ORDINE A DOMICILIO') : (tc.pickupTitle || 'CONFERMA ORDINE DA ASPORTO')}
          </h3>
          <p className="text-xs text-[#ffa323] font-oswald tracking-widest uppercase mt-1 font-semibold">
            {orderType === 'delivery' ? (tc.deliverySubtitle || 'CONSEGNA ESPRESSA DA FORNO A LEGNA') : (tc.pickupSubtitle || 'RITIRO IN PIZZERIA SENZA ATTESE')}
          </p>
        </div>

        {/* Order Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#242424] rounded-xl border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => setOrderType('delivery')}
            className={`py-3 px-4 rounded-lg font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              orderType === 'delivery'
                ? 'bg-[#d2401e] text-white shadow-lg shadow-[#d2401e]/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>{tc.deliveryTab || 'A Domicilio (+€2.50)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setOrderType('pickup')}
            className={`py-3 px-4 rounded-lg font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              orderType === 'pickup'
                ? 'bg-[#ffa323] text-black font-extrabold shadow-lg shadow-[#ffa323]/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{tc.pickupTab || 'Ritiro in Sede (Gratis)'}</span>
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-oswald tracking-wider uppercase text-white/70 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#d2401e]" /> {tc.nameLabel || 'NOME E COGNOME *'}
              </label>
              <input
                type="text"
                required
                placeholder="Mario Rossi"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-[#242424] text-white border border-white/15 rounded-xl text-base sm:text-sm font-sans focus:outline-none focus:border-[#d2401e] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-oswald tracking-wider uppercase text-white/70 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#d2401e]" /> {tc.phoneLabel || 'TELEFONO DI CONTATTO *'}
              </label>
              <input
                type="tel"
                required
                placeholder="333 1234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-[#242424] text-white border border-white/15 rounded-xl text-base sm:text-sm font-sans focus:outline-none focus:border-[#d2401e] transition-colors"
              />
            </div>
          </div>

          {/* Conditional Delivery Address or Pickup Info */}
          {orderType === 'delivery' ? (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-oswald tracking-wider uppercase text-white/70 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#d2401e]" /> {tc.addressLabel || 'INDIRIZZO E CIVICO *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Via Borsano 44, Scala B, Int. 3"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-[#242424] text-white border border-white/15 rounded-xl text-base sm:text-sm font-sans focus:outline-none focus:border-[#d2401e] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-oswald tracking-wider uppercase text-white/70 mb-1.5">
                    {tc.cityLabel || 'CITTÀ'}
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 bg-[#242424] text-white border border-white/15 rounded-xl text-base sm:text-sm font-sans focus:outline-none focus:border-[#d2401e] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-oswald tracking-wider uppercase text-white/70 mb-1.5">
                    {tc.capLabel || 'CAP'}
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-3 bg-[#242424] text-white border border-white/15 rounded-xl text-base sm:text-sm font-sans focus:outline-none focus:border-[#d2401e] transition-colors"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#242424] border border-[#ffa323]/30 flex items-start gap-3.5 animate-in fade-in">
              <div className="w-9 h-9 rounded-lg bg-[#ffa323]/20 flex items-center justify-center text-[#ffa323] shrink-0 mt-0.5">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-oswald text-sm font-bold uppercase text-white tracking-wider">
                  {tc.pickupPointTitle || 'PUNTO DI RITIRO PIZZERIA'}
                </h4>
                <p className="text-xs text-white/70 font-sans mt-0.5 leading-relaxed">
                  {tc.pickupPointDesc || 'Sapore Verace Pizzeria — Via Borsano 44, 21053 Castellanza (VA). Il tuo ordine sarà preparato e pronto caldo e fragrante all’orario indicato.'}
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-oswald tracking-wider uppercase text-white/70 mb-1.5">
              {orderType === 'delivery'
                ? (tc.notesDeliveryLabel || 'NOTE PER LA CONSEGNA (CITOFONO, ALLERGIE, PIANO...)')
                : (tc.notesPickupLabel || 'NOTE O RICHIESTE SPECIALI (ORARIO RITIRO, ALLERGIE...)')}
            </label>
            <textarea
              rows="2"
              placeholder={
                orderType === 'delivery'
                  ? (tc.notesDeliveryPlaceholder || 'Es. Citofonare Rossi, secondo piano...')
                  : (tc.notesPickupPlaceholder || 'Es. Passo a ritirare alle 20:15, impasto ben cotto...')
              }
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-[#242424] text-white border border-white/15 rounded-xl text-base sm:text-sm font-sans focus:outline-none focus:border-[#d2401e] transition-colors resize-none"
            />
          </div>

          {/* Orario di consegna / ritiro (solo oggi, durante l'apertura) */}
          <div>
            <label htmlFor="order-time" className="block text-xs font-oswald tracking-wider uppercase text-white/70 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#d2401e]" />
              {orderType === 'delivery' ? (tc.deliveryTimeLabel || 'ORARIO DI CONSEGNA') : (tc.pickupTimeLabel || 'ORARIO DI RITIRO')}
            </label>
            {noTimesToday ? (
              <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3">
                {tc.closedToday || 'Per oggi gli ordini online sono chiusi. Puoi prenotare un tavolo o chiamarci.'}
              </p>
            ) : (
              <select
                id="order-time"
                value={selectedTime}
                onChange={(e) => setFormData({ ...formData, [timeKey]: e.target.value })}
                className="w-full px-4 py-3 bg-[#242424] text-white border border-white/15 rounded-xl text-base sm:text-sm focus:outline-none focus:border-[#d2401e]"
              >
                {openNow && <option value="asap">{tc.asap || 'Prima possibile'}</option>}
                {orderTimes.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            )}
          </div>

          {/* Payment Method - Only to Courier (Cash or Card) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-oswald tracking-wider uppercase text-white/90 font-bold">
                {tc.paymentLabel || 'PAGAMENTO ALLA CONSEGNA AL CORRIERE'}
              </label>
              <span className="text-[11px] font-oswald text-[#ffa323] uppercase font-semibold">
                ● Nessun anticipo online
              </span>
            </div>
            <p className="text-xs text-white/50 font-sans mb-3">
              {orderType === 'delivery'
                ? 'Pagherai comodamente al nostro corriere all’arrivo a domicilio. Scegli come preferisci pagare:'
                : 'Pagherai al momento del ritiro direttamente alla cassa della pizzeria:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'cash'
                    ? 'border-[#ffa323] bg-[#ffa323]/10 text-white shadow-md shadow-[#ffa323]/10'
                    : 'border-white/15 bg-[#242424] text-white/70 hover:border-white/30'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                  className="hidden"
                />
                <div className="w-8 h-8 rounded-lg bg-[#ffa323]/20 flex items-center justify-center text-[#ffa323] shrink-0 mt-0.5">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-oswald text-xs tracking-wider uppercase font-bold text-white block">
                    {orderType === 'delivery' ? 'Contanti al Corriere' : 'Contanti alla Cassa'}
                  </span>
                  <span className="text-[11px] text-white/50 font-sans block mt-0.5">
                    {orderType === 'delivery' ? 'Paga in contanti all’arrivo del rider' : 'Paga in contanti al ritiro'}
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'card'
                    ? 'border-[#d2401e] bg-[#d2401e]/10 text-white shadow-md shadow-[#d2401e]/10'
                    : 'border-white/15 bg-[#242424] text-white/70 hover:border-white/30'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className="hidden"
                />
                <div className="w-8 h-8 rounded-lg bg-[#d2401e]/20 flex items-center justify-center text-[#d2401e] shrink-0 mt-0.5">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-oswald text-xs tracking-wider uppercase font-bold text-white block">
                    {orderType === 'delivery' ? 'Carta / POS al Corriere' : 'Carta / POS in Cassa'}
                  </span>
                  <span className="text-[11px] text-white/50 font-sans block mt-0.5">
                    {orderType === 'delivery' ? 'Il rider ha con sé il POS portatile' : 'Bancomat, carte o contactless'}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <PrivacyConsent
            checked={formData.privacyAccepted}
            onChange={(v) => setFormData({ ...formData, privacyAccepted: v })}
          />

          {errorMessage && (
            <p role="alert" className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3">
              {errorMessage}
            </p>
          )}

          {/* Total Bar & Submit Button */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-oswald text-white/50 tracking-wider uppercase">
                {orderType === 'delivery' ? (tc.subtotalDelivery || `Subtotale + Consegna (€${DELIVERY_FEE.toFixed(2)})`) : (tc.subtotalPickup || 'Subtotale (Ritiro Gratuito)')}
              </div>
              <span className="block text-xs font-oswald tracking-widest text-white/70 uppercase">
                {tc.totalToPay || 'TOTALE DA PAGARE AL CORRIERE:'}
              </span>
              <span className="text-2xl font-oswald font-black text-[#d2401e]">
                €{totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || noTimesToday}
              className="disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#d2401e] to-[#ffa323] hover:from-[#b83314] hover:to-[#e68e17] text-white font-oswald text-sm tracking-[0.2em] font-black uppercase transition-all duration-300 rounded-xl shadow-xl shadow-[#d2401e]/30 cursor-pointer flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              <span>
                {isSubmitting
                  ? (tc.sending || 'INVIO IN CORSO...')
                  : orderType === 'delivery' ? (tc.submitDelivery || 'CONFERMA E INVIA ORDINE') : (tc.submitPickup || 'CONFERMA ORDINE RITIRO')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
