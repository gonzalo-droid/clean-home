"use client";

import { useCart } from "@/lib/cart-context";

export default function Toast() {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300">
      ✅ {toast}
    </div>
  );
}
