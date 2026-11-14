"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { CheckIcon } from "./icons";

export default function Toast() {
  const { toast, dismissToast } = useCart();
  const pathname = usePathname();
  const onCartPage = pathname === "/carrito";

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 md:bottom-8">
      {toast && (
        <div
          key={toast.id}
          className="pointer-events-auto flex max-w-full items-center gap-2 rounded-full bg-marino py-1.5 pl-4 pr-1.5 text-sm font-semibold text-white shadow-card"
        >
          <CheckIcon className="h-4 w-4 shrink-0 text-limon" />
          <span className="line-clamp-1 min-w-0">{toast.message}</span>
          {toast.undo && (
            <button
              type="button"
              onClick={() => {
                toast.undo?.();
                dismissToast();
              }}
              className="min-h-[36px] shrink-0 rounded-full px-3 text-xs font-bold text-limon underline-offset-2 hover:underline"
            >
              Deshacer
            </button>
          )}
          {!onCartPage && (
            <Link
              href="/carrito"
              onClick={dismissToast}
              className="flex min-h-[36px] shrink-0 items-center rounded-full bg-limon px-4 text-xs font-bold text-marino hover:bg-limon-dark"
            >
              Ver pedido
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
