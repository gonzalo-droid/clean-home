"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import Logo from "./Logo";
import SearchBox, { SearchBoxFallback } from "./SearchBox";
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
  const [tucked, setTucked] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();

  // En móvil el header se esconde al bajar y vuelve al subir, para dejar más espacio a los productos.
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        setTucked(delta > 0 && y > 140);
        lastY.current = y;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const hide = tucked && !menuOpen;

  return (
    <header
      className={`sticky top-0 z-40 border-b border-linea bg-white/95 backdrop-blur transition-transform duration-200 motion-reduce:transition-none md:translate-y-0 ${
        hide ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container-page flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5 md:flex-nowrap md:gap-6 md:py-3">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full text-marino hover:bg-papel lg:hidden"
        >
          {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>

        <div className="flex-1 md:flex-none">
          <Logo />
        </div>

        <Suspense fallback={<SearchBoxFallback className="order-last w-full md:order-none md:max-w-sm md:flex-1" />}>
          <SearchBox className="order-last w-full md:order-none md:max-w-sm md:flex-1" />
        </Suspense>

        <nav aria-label="Principal" className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`text-[15px] underline-offset-[6px] transition hover:underline ${
                isActive(link.href) ? "font-bold text-marino underline decoration-limon decoration-2" : "font-medium text-grafito"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* En móvil el pedido vive en la barra inferior; aquí solo en tablet y escritorio. */}
        <Link
          href="/carrito"
          aria-label={`Ver mi pedido, ${count} productos`}
          aria-current={pathname === "/carrito" ? "page" : undefined}
          className="relative hidden h-11 w-11 items-center justify-center rounded-full border border-linea bg-white text-marino transition hover:border-marino md:flex"
        >
          <CartIcon className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-limon px-1 text-xs font-bold tabular-nums text-marino">
              {count}
            </span>
          )}
        </Link>
      </div>

      {menuOpen && (
        <nav aria-label="Menú" className="border-t border-linea bg-white lg:hidden">
          <div className="container-page flex flex-col py-2">
            {[{ href: "/", label: "Inicio" }, ...NAV_LINKS, { href: "/carrito", label: count > 0 ? `Tu pedido (${count})` : "Tu pedido" }].map(
              (link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className="flex min-h-[44px] items-center rounded-xl px-3 text-[15px] font-medium text-grafito hover:bg-papel"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
