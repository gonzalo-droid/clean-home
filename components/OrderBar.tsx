"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

/** Rutas donde la parte inferior ya la ocupa otra acción fija. */
export function hasOwnBottomBar(pathname: string) {
  return pathname === "/carrito" || pathname.startsWith("/producto/");
}

/**
 * Barra de pedido en móvil: reemplaza a la pestaña del carrito y al contador del header.
 * Solo aparece cuando hay productos en el pedido.
 */
export default function OrderBar() {
  const pathname = usePathname();
  const { count, total, hydrated } = useCart();

  if (!hydrated || count === 0 || hasOwnBottomBar(pathname)) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-2 md:hidden">
      <Link
        href="/carrito"
        aria-label={`Ver mi pedido: ${count} ${count === 1 ? "producto" : "productos"}, total ${formatPrice(total)}`}
        className="flex min-h-[56px] items-center justify-between gap-3 rounded-2xl bg-marino px-4 text-white shadow-card"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-limon px-1.5 text-xs font-extrabold tabular-nums text-marino">
            {count}
          </span>
          {count === 1 ? "producto" : "productos"}
        </span>
        <span className="font-display text-xl font-extrabold tabular-nums">{formatPrice(total)}</span>
        <span className="text-sm font-bold text-limon">Ver pedido</span>
      </Link>
    </div>
  );
}
