"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { WhatsAppGlyph } from "./icons";

export default function WhatsAppFloatButton() {
  const pathname = usePathname();
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

  // En el carrito ya hay un botón para enviar el pedido por WhatsApp.
  if (pathname === "/carrito") return null;

  return (
    <Link
      href="https://wa.me/51976509570?text=Hola%2C%20quiero%20consultar%20sobre%20productos%20de%20limpieza"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className={`fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-wa text-white shadow-card transition-all duration-300 hover:bg-wa-dark md:bottom-6 md:right-6 ${
        visible ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"
      }`}
    >
      <WhatsAppGlyph className="h-7 w-7" />
    </Link>
  );
}
