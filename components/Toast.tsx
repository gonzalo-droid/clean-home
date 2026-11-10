"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { CheckIcon } from "./icons";

export default function Toast() {
  const { toast } = useCart();
  const pathname = usePathname();
  const onCartPage = pathname === "/carrito";

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 md:bottom-8">
      {toast && (
        <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-marino py-2 pl-5 pr-2 text-sm font-semibold text-white shadow-card">
          <CheckIcon className="h-4 w-4 shrink-0 text-limon" />
          <span className="line-clamp-1">{toast}</span>
          {onCartPage ? (
            <span className="pr-3" />
          ) : (
            <Link href="/carrito" className="shrink-0 rounded-full bg-limon px-4 py-2 text-xs font-bold text-marino hover:bg-limon-dark">
              Ver pedido
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
