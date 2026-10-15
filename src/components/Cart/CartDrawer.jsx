import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export const CartDrawer = () => {
  const {
    cartItems,
    orderType,
    setOrderType,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryFee,
    totalPrice,
    setIsCheckoutOpen,
  } = useCart();

  const { t } = useLanguage();

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Panel with smooth fluid cubic-bezier slide */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#181818] border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-[#141414]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d2401e] flex items-center justify-center text-white shadow-lg shadow-[#d2401e]/30">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-oswald text-xl font-bold tracking-wider text-white uppercase">
                  {t.cart?.title || 'IL TUO CARRELLO'}
                </h3>
                <span className="text-xs text-[#ffa323] font-oswald tracking-widest uppercase font-semibold">
                  {orderType === 'delivery' ? (t.cart?.delivery || 'CONSEGNA A DOMICILIO') : (t.cart?.pickup || 'RITIRO IN PIZZERIA')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Delivery Mode Toggle: A Domicilio vs Ritiro */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#1e1e1e] rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setOrderType('delivery')}
              className={`py-2 px-3 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                orderType === 'delivery'
                  ? 'bg-[#d2401e] text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>{t.cart?.deliveryTab || '🛵 A Domicilio'}</span>
            </button>
            <button
              type="button"
              onClick={() => setOrderType('pickup')}
              className={`py-2 px-3 rounded-lg font-oswald text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                orderType === 'pickup'
                  ? 'bg-[#ffa323] text-black font-extrabold shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>{t.cart?.pickupTab || '🛍️ Ritiro (Gratis)'}</span>
            </button>
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/40 mb-4">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h4 className="font-oswald text-xl text-white font-bold tracking-wider uppercase mb-2">
                {t.cart?.emptyTitle || 'IL CARRELLO È VUOTO'}
              </h4>
              <p className="text-sm text-white/60 font-sans max-w-xs mb-6">
                {t.cart?.emptyDesc || 'Scegli le tue pizze preferite dal nostro menu artigianale cotto nel forno a legna.'}
              </p>
              <a
                href="#menu"
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-3 bg-[#d2401e] hover:bg-[#b83314] text-white font-oswald text-xs tracking-widest font-bold uppercase transition-all rounded-md shadow-lg shadow-[#d2401e]/20"
              >
                {t.cart?.exploreMenu || 'ESPLORA IL MENU'}
              </a>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-[#202020] border border-white/5 p-4 rounded-xl shadow-md hover:border-white/10 transition-colors"
              >
                {item.image?.endsWith('.jpg') || item.image?.endsWith('.jpeg') ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-md">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain shrink-0 filter drop-shadow-md"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="font-oswald text-base font-bold text-white tracking-wide truncate">
                    {item.name}
                  </h4>
                  <div className="text-sm font-oswald font-bold text-[#ffa323] mt-0.5">
                    €{(item.numericPrice * item.quantity).toFixed(2)}
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-oswald text-sm font-bold text-white px-2">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-white/40 hover:text-[#d2401e] p-2 transition-colors cursor-pointer"
                  title="Rimuovi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary & Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-[#141414] border-t border-white/10 space-y-4">
            <div className="space-y-2 text-xs font-oswald tracking-wider uppercase text-white/70">
              <div className="flex justify-between">
                <span>{t.cart?.subtotal || 'Subtotale:'}</span>
                <span className="text-white font-bold">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{orderType === 'delivery' ? (t.cart?.deliveryFee || 'Costo Consegna:') : (t.cart?.pickupFee || 'Ritiro in Sede:')}</span>
                <span className={orderType === 'delivery' ? 'text-white font-bold' : 'text-emerald-400 font-bold'}>
                  {orderType === 'delivery' ? `€${deliveryFee.toFixed(2)}` : (t.cart?.free || 'GRATIS')}
                </span>
              </div>
              <div className="flex justify-between text-base text-white pt-2 border-t border-white/10 font-bold">
                <span className="text-white">{t.cart?.total || 'TOTALE:'}</span>
                <span className="text-xl text-[#d2401e]">€{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-4 bg-[#d2401e] hover:bg-[#b83314] text-white font-oswald text-sm tracking-[0.2em] font-bold uppercase transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-[#d2401e]/30 hover:scale-[1.02]"
            >
              <span>{orderType === 'delivery' ? (t.cart?.orderDelivery || 'ORDINA A DOMICILIO') : (t.cart?.orderPickup || 'ORDINA PER IL RITIRO')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
