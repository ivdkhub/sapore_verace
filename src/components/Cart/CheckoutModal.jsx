import React, { useState } from 'react';
import { X, MapPin, Phone, User, Store, Bike, Banknote, CreditCard, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { MoustacheIcon } from '../common/Icons';

export const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, totalPrice, orderType, setOrderType, placeOrder } = useCart();
  const { t } = useLanguage();

  const tc = t.checkout || {};

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: 'Via Borsano, ',
    city: 'Castellanza',
    postalCode: '21053',
    notes: '',
    pickupTime: '20:00',
    deliveryTime: 'asap',
    paymentMethod: 'cash',
  });

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert(tc.alertContact || 'Per favore compila il tuo nome e numero di telefono.');
      return;
    }
    if (orderType === 'delivery' && !formData.address) {
      alert(tc.alertAddress || "Per favore inserisci l'indirizzo di consegna.");
      return;
    }
    placeOrder({ ...formData, orderType });
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
                className="w-full px-4 py-3 bg-[#242424] text-white border border-white/15 rounded-lg text-sm font-sans focus:outline-none focus:border-[#d2401e] transition-colors"
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
                className="w-full px-4 py-3 bg-[#242424] text-white border border-white/15 rounded-lg text-sm font-sans focus:outline-none focus:border-[#d2401e] transition-colors"
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
                  className="w-full px-4 py-3 bg-[#242424] text-white border border-white/15 rounded-lg text-sm font-sans focus:outline-none focus:border-[#d2401e] transition-colors"
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
                    className="w-full px-4 py-3 bg-[#242424] text-white border border-white/15 rounded-lg text-sm font-sans focus:outline-none focus:border-[#d2401e] transition-colors"
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
                    className="w-full px-4 py-3 bg-[#242424] text-white border border-white/15 rounded-lg text-sm font-sans focus:outline-none focus:border-[#d2401e] transition-colors"
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
              className="w-full px-4 py-3 bg-[#242424] text-white border border-white/15 rounded-lg text-sm font-sans focus:outline-none focus:border-[#d2401e] transition-colors resize-none"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-oswald tracking-wider uppercase text-white/70 mb-2">
              {tc.paymentLabel || 'METODO DI PAGAMENTO'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'cash'
                    ? 'border-[#d2401e] bg-[#d2401e]/10 text-white'
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
                <Banknote className="w-5 h-5 text-[#ffa323]" />
                <span className="font-oswald text-xs tracking-wider uppercase font-bold">
                  {orderType === 'delivery' ? (tc.cashDelivery || 'CONTANTI AL RIDER') : (tc.cashPickup || 'CONTANTI ALLA CASSA')}
                </span>
              </label>

              <label
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'card'
                    ? 'border-[#d2401e] bg-[#d2401e]/10 text-white'
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
                <CreditCard className="w-5 h-5 text-[#d2401e]" />
                <span className="font-oswald text-xs tracking-wider uppercase font-bold">
                  {orderType === 'delivery' ? (tc.cardDelivery || 'POS / CARTA AL DOMICILIO') : (tc.cardPickup || 'CARTA / BANCOMAT IN CASSA')}
                </span>
              </label>
            </div>
          </div>

          {/* Total Bar & Submit Button */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-oswald text-white/50 tracking-wider uppercase">
                {orderType === 'delivery' ? (tc.subtotalDelivery || 'Subtotale + Consegna (€2.50)') : (tc.subtotalPickup || 'Subtotale (Ritiro Gratuito)')}
              </div>
              <span className="block text-xs font-oswald tracking-widest text-white/70 uppercase">
                {tc.totalToPay || 'TOTALE DA PAGARE:'}
              </span>
              <span className="text-2xl font-oswald font-black text-[#d2401e]">
                €{totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 bg-[#d2401e] hover:bg-[#b83314] text-white font-oswald text-sm tracking-[0.2em] font-bold uppercase transition-all duration-300 rounded-xl shadow-xl shadow-[#d2401e]/30 cursor-pointer flex items-center justify-center gap-2 hover:scale-105"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{orderType === 'delivery' ? (tc.confirmDeliveryBtn || 'CONFERMA E AVVIA TRACKING') : (tc.confirmPickupBtn || 'CONFERMA ORDINE RITIRO')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
