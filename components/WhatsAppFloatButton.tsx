"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function WhatsAppFloatButton() {
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

  return (
    <Link
      href="https://wa.me/51976509570?text=Hola%2C%20quiero%20consultar%20sobre%20productos%20de%20limpieza"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className={`fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-all duration-300 hover:bg-emerald-600 ${
        visible ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7">
        <path d="M16.001 2.667c-7.364 0-13.334 5.97-13.334 13.334 0 2.353.617 4.647 1.789 6.667L2.667 29.333l6.83-1.79a13.27 13.27 0 006.504 1.657h.006c7.364 0 13.334-5.97 13.334-13.333S23.365 2.667 16.001 2.667zm0 24.4a11.03 11.03 0 01-5.62-1.54l-.403-.24-4.053 1.062 1.082-3.951-.263-.406a11.05 11.05 0 01-1.7-5.897c0-6.108 4.97-11.078 11.079-11.078 2.96 0 5.742 1.153 7.834 3.246a11 11 0 013.244 7.834c0 6.108-4.97 11.078-11.1 11.078v-.108z" />
        <path d="M22.324 18.61c-.339-.17-2.006-.99-2.317-1.104-.311-.113-.538-.17-.764.17-.226.34-.876 1.104-1.074 1.33-.198.226-.396.255-.735.085-.339-.17-1.432-.528-2.727-1.68-1.008-.9-1.689-2.011-1.887-2.35-.198-.34-.021-.523.149-.692.153-.153.34-.396.51-.594.17-.198.226-.34.34-.566.113-.226.056-.424-.028-.594-.085-.17-.764-1.842-1.047-2.523-.276-.663-.556-.573-.764-.583l-.652-.011a1.25 1.25 0 00-.905.424c-.311.34-1.187 1.161-1.187 2.833s1.215 3.286 1.384 3.512c.17.226 2.392 3.652 5.797 5.121.81.35 1.442.559 1.935.716.813.259 1.553.222 2.138.135.652-.097 2.006-.82 2.289-1.612.283-.792.283-1.472.198-1.612-.085-.14-.311-.226-.65-.396z" />
      </svg>
    </Link>
  );
}
