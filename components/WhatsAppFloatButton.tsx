"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { buildWhatsAppTextUrl } from "@/lib/whatsapp";
import { WhatsAppGlyph } from "./icons";

// Solo en páginas informativas: en inicio, catálogo, producto, packs y pedido tapaba los
// botones de agregar y las barras fijas, y ahí ya hay acciones de WhatsApp propias.
const SHOWN_ON = ["/nosotros", "/mayoristas", "/contacto"];

export default function WhatsAppFloatButton() {
  const pathname = usePathname();
  const { count, hydrated } = useCart();
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleScroll() {
      setVisible(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setVisible(true), 250);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!SHOWN_ON.includes(pathname)) return null;

  const aboveOrderBar = hydrated && count > 0;

  return (
    <a
      href={buildWhatsAppTextUrl("Hola, quiero consultar sobre productos de limpieza")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className={`fixed right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-wa text-white shadow-card transition-all duration-300 hover:bg-wa-dark md:bottom-6 md:right-6 ${
        aboveOrderBar ? "bottom-24" : "bottom-5"
      } ${visible ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"}`}
    >
      <WhatsAppGlyph className="h-7 w-7" />
    </a>
  );
}
