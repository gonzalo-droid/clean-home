"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  type CartLine,
  addItem,
  removeItem,
  updateQuantity,
  cartTotal,
  cartCount,
} from "./cart";

const STORAGE_KEY = "clean-home-cart";
const TOAST_DURATION_MS = 2500;

interface CartContextValue {
  items: CartLine[];
  add: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  remove: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  total: number;
  count: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  toast: string | null;
  showToast: (message: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe localStorage hydration on mount, not a synchronization anti-pattern: localStorage doesn't exist during SSR, so it can't be read in a lazy useState initializer without crashing/hydration mismatch.
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage unavailable (e.g. private mode) — cart stays in-memory
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore persistence failure
    }
  }, [items, hydrated]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const value: CartContextValue = {
    items,
    add: (item, quantity = 1) => setItems((prev) => addItem(prev, item, quantity)),
    remove: (lineId) => setItems((prev) => removeItem(prev, lineId)),
    setQuantity: (lineId, quantity) => setItems((prev) => updateQuantity(prev, lineId, quantity)),
    clear: () => setItems([]),
    total: cartTotal(items),
    count: cartCount(items),
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    toggleCart: () => setIsOpen((v) => !v),
    toast,
    showToast: (message) => {
      setToast(message);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
