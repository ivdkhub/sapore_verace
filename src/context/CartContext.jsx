import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const CartContext = createContext();

// Deve corrispondere a 'orders.delivery_fee' in api/config.php (il server applica il suo valore)
export const DELIVERY_FEE = 2.5;

export const CartProvider = ({ children }) => {
  const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'pickup'
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const addToCart = (pizza, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === pizza.id);
      if (existing) {
        return prev.map((item) =>
          item.id === pizza.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      // Prezzo indicativo per il carrello: il totale definitivo viene ricalcolato dal server
      const numPrice =
        typeof pizza.numericPrice === 'number'
          ? pizza.numericPrice
          : parseFloat(String(pizza.price || '').replace(',', '.').replace(/[^0-9.]/g, ''));
      if (!Number.isFinite(numPrice) || numPrice <= 0) {
        console.warn('Prodotto senza prezzo valido, non aggiunto al carrello:', pizza?.name);
        return prev;
      }
      return [...prev, { ...pizza, numericPrice: numPrice, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (pizzaId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== pizzaId));
  };

  const updateQuantity = (pizzaId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(pizzaId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === pizzaId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.numericPrice * item.quantity,
    0
  );

  const deliveryFee = orderType === 'delivery' && subtotal > 0 ? DELIVERY_FEE : 0;
  const totalPrice = subtotal + deliveryFee;

  // Invia l'ordine al server: prezzi, orari e zona di consegna vengono verificati lì,
  // poi il ristorante riceve la notifica. In caso di problemi lancia un errore con il messaggio da mostrare.
  const placeOrder = async (customerDetails) => {
    const { order } = await api.post('orders.php', {
      items: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
      orderType,
      paymentMethod: customerDetails.paymentMethod || 'cash', // 'cash' | 'card'
      requestedTime: (orderType === 'delivery' ? customerDetails.deliveryTime : customerDetails.pickupTime) || 'asap',
      privacyAccepted: !!customerDetails.privacyAccepted,
      customer: {
        fullName: customerDetails.fullName,
        phone: customerDetails.phone,
        address: customerDetails.address,
        city: customerDetails.city,
        postalCode: customerDetails.postalCode,
        notes: customerDetails.notes,
      },
    });

    setActiveOrder(order);
    setConfirmedOrder(order);
    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    return order;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        orderType,
        setOrderType,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeOrder,
        setActiveOrder,
        confirmedOrder,
        setConfirmedOrder,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        deliveryFee,
        totalPrice,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
