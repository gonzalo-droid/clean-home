"use client";

import { useCart } from "@/lib/cart-context";
import { CheckIcon } from "./icons";

export default function Toast() {
  const { toast, isOpen } = useCart();

  return (
    <div aria-live="polite" className={`pointer-events-none fixed inset-x-0 z-[60] flex justify-center ${isOpen ? "top-20" : "bottom-28 md:bottom-8"}`}>
      {toast && (
        <div className="flex items-center gap-2 rounded-full bg-marino px-5 py-3 text-sm font-semibold text-white shadow-card">
          <CheckIcon className="h-4 w-4 text-limon" />
          {toast}
        </div>
      )}
    </div>
  );
}
