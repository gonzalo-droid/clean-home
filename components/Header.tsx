"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import Logo from "./Logo";
import SearchBox from "./SearchBox";
import { CartIcon, CloseIcon, MenuIcon } from "./icons";

export const NAV_LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/packs", label: "Packs" },
  { href: "/mayoristas", label: "Mayoristas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-linea bg-white/95 backdrop-blur">
      <div className="container-page flex flex-wrap items-center gap-3 py-3 md:flex-nowrap md:gap-6">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          className="flex h-11 w-11 items-center justify-center rounded-full text-marino hover:bg-menta lg:hidden"
        >
          {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>

        <div className="flex-1 md:flex-none">
          <Logo />
        </div>

        <SearchBox className="order-last w-full md:order-none md:max-w-sm md:flex-1" />

        <nav aria-label="Principal" className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`text-[15px] font-medium transition hover:text-agua ${
                isActive(link.href) ? "font-bold text-agua" : "text-grafito"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/carrito"
          aria-label={`Ver mi pedido, ${count} productos`}
          aria-current={pathname === "/carrito" ? "page" : undefined}
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-linea bg-white text-marino transition hover:border-agua"
        >
          <CartIcon className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-limon px-1 text-xs font-bold text-marino">
              {count}
            </span>
          )}
        </Link>
      </div>

      {menuOpen && (
        <nav aria-label="Menú" className="border-t border-linea bg-white lg:hidden">
          <div className="container-page flex flex-col py-2">
            {[{ href: "/", label: "Inicio" }, ...NAV_LINKS].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[44px] items-center rounded-xl px-3 text-[15px] font-medium text-grafito hover:bg-menta"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
