import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [checkoutId, setCheckoutId] = useState(
    localStorage.getItem('checkoutId') || null,
  );
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const saveCheckout = (id, lines) => {
    setCheckoutId(id);
    localStorage.setItem('checkoutId', id);
    setCartItems(lines);
    setCartCount(lines.reduce((acc, line) => acc + line.quantity, 0));
  };

  const clearCart = () => {
    setCheckoutId(null);
    setCartItems([]);
    setCartCount(0);
    localStorage.removeItem('checkoutId');
  };

  return (
    <CartContext.Provider
      value={{ checkoutId, cartItems, cartCount, saveCheckout, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
