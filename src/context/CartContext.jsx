import React, { createContext, useContext, useState, useEffect } from 'react';
import { notifyNewOrder } from '../services/notificationService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'pickup'
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Load active order or cart from localStorage if exists
  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem('sapore_verace_active_order');
      if (savedOrder) {
        setActiveOrder(JSON.parse(savedOrder));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const addToCart = (pizza, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === pizza.id);
      if (existing) {
        return prev.map((item) =>
          item.id === pizza.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      // Parse numeric price
      const numPrice =
        typeof pizza.numericPrice === 'number'
          ? pizza.numericPrice
          : parseFloat(String(pizza.price || '').replace(',', '.').replace(/[^0-9.]/g, '')) || 9.0;
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

  const deliveryFee = orderType === 'delivery' && subtotal > 0 ? 2.5 : 0;
  const totalPrice = subtotal + deliveryFee;

  // Place order and show confirmation modal (payment only on delivery to courier)
  const placeOrder = (customerDetails) => {
    const newOrder = {
      orderId: 'SV-' + Math.floor(100000 + Math.random() * 900000),
      items: [...cartItems],
      subtotal,
      deliveryFee,
      totalPrice,
      orderType,
      customer: customerDetails,
      paymentMethod: customerDetails.paymentMethod || 'cash', // 'cash' | 'card'
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };

    setActiveOrder(newOrder);
    setConfirmedOrder(newOrder);
    localStorage.setItem('sapore_verace_active_order', JSON.stringify(newOrder));
    
    // Dispatch real-time notifications to configured channels (Email, Telegram, WhatsApp)
    try {
      notifyNewOrder(newOrder);
    } catch (notifErr) {
      console.warn('Failed to dispatch order notification:', notifErr);
    }

    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
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
