"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: string;
  type: "Cup" | "Cone";
  flavourId?: string;
  flavour: string;
  quantity: number;
  size: string;
  servingId?: string;
  scoopCount?: number;
  unitPrice?: number;
  originalPrice?: number;
  saving?: number;
  image: string;
  color: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  addManyToCart: (items: Omit<CartItem, "id">[]) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount (hydration safe)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("conejoys_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("conejoys_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart, isHydrated]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  }, []);

  const addToCart = useCallback(
    (item: Omit<CartItem, "id">) => {
      setCart((prevCart) => {
        const existingIdx = prevCart.findIndex(
          (c) =>
            c.type === item.type &&
            (item.flavourId ? c.flavourId === item.flavourId : c.flavour === item.flavour) &&
            (item.servingId ? c.servingId === item.servingId : c.size === item.size)
        );
        if (existingIdx > -1) {
          const updated = [...prevCart];
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + item.quantity,
          };
          return updated;
        } else {
          const flavourKey = item.flavourId ?? item.flavour.toLowerCase().replace(/\s+/g, "-");
          const servingKey = item.servingId ?? item.size.toLowerCase().replace(/\s+/g, "-");
          const id = `${item.type.toLowerCase()}-${flavourKey}-${servingKey}`;
          return [...prevCart, { ...item, id }];
        }
      });

      const itemUnit = item.quantity === 1 ? item.type.toLowerCase() : `${item.type.toLowerCase()}s`;
      showToast(`${item.quantity} ${item.flavour} ${itemUnit} added to cart.`);
    },
    [showToast]
  );

  const addManyToCart = useCallback(
    (items: Omit<CartItem, "id">[]) => {
      if (items.length === 0) return;

      setCart((previousCart) => {
        const nextCart = [...previousCart];

        items.forEach((item) => {
          const existingIdx = nextCart.findIndex(
            (current) =>
              current.type === item.type &&
              (item.flavourId ? current.flavourId === item.flavourId : current.flavour === item.flavour) &&
              (item.servingId ? current.servingId === item.servingId : current.size === item.size)
          );

          if (existingIdx >= 0) {
            nextCart[existingIdx] = {
              ...nextCart[existingIdx],
              ...item,
              quantity: nextCart[existingIdx].quantity + item.quantity,
            };
          } else {
            const flavourKey = item.flavourId ?? item.flavour.toLowerCase().replace(/\s+/g, "-");
            const servingKey = item.servingId ?? item.size.toLowerCase().replace(/\s+/g, "-");
            const id = `${item.type.toLowerCase()}-${flavourKey}-${servingKey}`;
            nextCart.push({ ...item, id });
          }
        });

        return nextCart;
      });

      const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
      showToast(`${totalQuantity} cup serving${totalQuantity === 1 ? "" : "s"} added to cart.`);
    },
    [showToast]
  );

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addManyToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        isCartOpen,
        setIsCartOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
