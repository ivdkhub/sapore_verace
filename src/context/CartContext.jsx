import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'pickup'
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

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

  // Place order and start live tracking simulator
  const placeOrder = (customerDetails) => {
    const newOrder = {
      orderId: 'SV-' + Math.floor(100000 + Math.random() * 900000),
      items: [...cartItems],
      subtotal,
      deliveryFee,
      totalPrice,
      orderType,
      customer: customerDetails,
      createdAt: new Date().toISOString(),
      status: 'received', // received -> preparing -> baking -> delivering -> delivered
      estimatedMinutes: orderType === 'delivery' ? 25 : 15,
      progress: 15,
    };

    setActiveOrder(newOrder);
    localStorage.setItem('sapore_verace_active_order', JSON.stringify(newOrder));
    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setIsTrackingOpen(true);
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
        isTrackingOpen,
        setIsTrackingOpen,
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
