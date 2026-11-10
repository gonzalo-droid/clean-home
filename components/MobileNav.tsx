"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { BoxIcon, CartIcon, GridIcon, HomeIcon } from "./icons";

const ITEMS = [
  { href: "/", label: "Inicio", Icon: HomeIcon },
  { href: "/catalogo", label: "Catálogo", Icon: GridIcon },
  { href: "/packs", label: "Packs", Icon: BoxIcon },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav
      aria-label="Navegación inferior"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-linea bg-white px-1 pb-[max(env(safe-area-inset-bottom),8px)] pt-1 md:hidden"
    >
      {ITEMS.map(({ href, label, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 text-[11px] ${
              active ? "font-bold text-agua" : "font-medium text-gris"
            }`}
          >
            <Icon className="h-[22px] w-[22px]" />
            {label}
          </Link>
        );
      })}
      <Link
        href="/carrito"
        aria-current={pathname === "/carrito" ? "page" : undefined}
        className={`relative flex min-h-[52px] flex-col items-center justify-center gap-0.5 text-[11px] ${
          pathname === "/carrito" ? "font-bold text-agua" : "font-medium text-gris"
        }`}
      >
        <CartIcon className="h-[22px] w-[22px]" />
        Pedido
        {count > 0 && (
          <span className="absolute right-[calc(50%-20px)] top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-limon px-1 text-[11px] font-bold text-marino">
            {count}
          </span>
        )}
      </Link>
    </nav>
  );
}
