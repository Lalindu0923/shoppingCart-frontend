import React, { createContext, useState } from "react";

// Create Context
export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Example state for cart
  const [cart, setCart] = useState([]);

  // Example helper functions
  const getTotalCartItems = () => cart.length;
  const getTotalCartAmount = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const clearCart = () => setCart([]);

  return (
    <ShopContext.Provider
      value={{ cart, setCart, getTotalCartItems, getTotalCartAmount, clearCart }}
    >
      {children}
    </ShopContext.Provider>
  );
};
