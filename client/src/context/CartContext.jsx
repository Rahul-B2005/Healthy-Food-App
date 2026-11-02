import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);
const DELIVERY_FEE = 20.00;

export function CartProvider({ children }) {
  const [items, setItems] = useState({}); // menuItemId -> { item, qty }

  const add = (menuItem) =>
    setItems((prev) => {
      const existing = prev[menuItem._id];
      return {
        ...prev,
        [menuItem._id]: { item: menuItem, qty: (existing?.qty || 0) + 1 },
      };
    });

  const remove = (menuItemId) =>
    setItems((prev) => {
      const existing = prev[menuItemId];
      if (!existing) return prev;
      const qty = existing.qty - 1;
      const next = { ...prev };
      if (qty <= 0) delete next[menuItemId];
      else next[menuItemId] = { ...existing, qty };
      return next;
    });

  const clear = () => setItems({});

  const cartItems = useMemo(() => Object.values(items), [items]);
  const count = useMemo(() => cartItems.reduce((s, i) => s + i.qty, 0), [cartItems]);
  const subtotal = useMemo(
    () => cartItems.reduce((s, i) => s + i.item.price * i.qty, 0),
    [cartItems]
  );
  const deliveryFee = cartItems.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{ items, cartItems, count, subtotal, deliveryFee, total, add, remove, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
