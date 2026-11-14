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
const TOAST_DURATION_MS = 5000;

export interface ToastState {
  id: number;
  message: string;
  undo?: () => void;
}

type NewLine = Omit<CartLine, "quantity">;

interface CartContextValue {
  items: CartLine[];
  /** Agrega una o varias líneas y muestra un aviso con "Deshacer". */
  add: (entries: { item: NewLine; quantity?: number }[], label: string) => void;
  /** Quita la línea y muestra un aviso con "Deshacer". */
  remove: (lineId: string) => void;
  /** Cambia la cantidad; en 0 se comporta como `remove`. */
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  total: number;
  count: number;
  /** true once the saved cart was read from localStorage */
  hydrated: boolean;
  toast: ToastState | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastIdRef = useRef(0);

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

  function dismissToast() {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast(null);
  }

  function showToast(message: string, undo?: () => void) {
    toastIdRef.current += 1;
    setToast({ id: toastIdRef.current, message, undo });
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }

  function add(entries: { item: NewLine; quantity?: number }[], label: string) {
    setItems((prev) => entries.reduce((acc, { item, quantity = 1 }) => addItem(acc, item, quantity), prev));
    showToast(`Agregaste ${label}`, () => {
      setItems((prev) =>
        entries.reduce((acc, { item, quantity = 1 }) => {
          const current = acc.find((l) => l.lineId === item.lineId)?.quantity ?? 0;
          return updateQuantity(acc, item.lineId, current - quantity);
        }, prev)
      );
    });
  }

  function remove(lineId: string) {
    const index = items.findIndex((i) => i.lineId === lineId);
    if (index === -1) return;
    const line = items[index];
    setItems((prev) => removeItem(prev, lineId));
    showToast(`Quitaste ${line.name}`, () => {
      setItems((prev) =>
        prev.some((l) => l.lineId === lineId) ? prev : [...prev.slice(0, index), line, ...prev.slice(index)]
      );
    });
  }

  const value: CartContextValue = {
    items,
    add,
    remove,
    setQuantity: (lineId, quantity) => {
      if (quantity <= 0) return remove(lineId);
      setItems((prev) => updateQuantity(prev, lineId, quantity));
    },
    clear: () => setItems([]),
    total: cartTotal(items),
    count: cartCount(items),
    hydrated,
    toast,
    dismissToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
