"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

/**
 * Carrusel horizontal con scroll nativo (deslizable con el dedo) y flechas en escritorio.
 * Cada hijo debe ser un <li> con ancho fijo.
 */
export default function Carousel({ label, children }: { label: string; children: ReactNode }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  const scrollBy = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrow =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-linea bg-white text-marino shadow-card transition hover:border-marino disabled:pointer-events-none disabled:opacity-0 md:flex";

  return (
    <section aria-roledescription="carrusel" aria-label={label} className="relative">
      <button type="button" onClick={() => scrollBy(-1)} disabled={!canPrev} aria-label="Ver anteriores" className={`${arrow} -left-4`}>
        <ArrowLeftIcon className="h-5 w-5" />
      </button>
      <ul
        ref={trackRef}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
      <button type="button" onClick={() => scrollBy(1)} disabled={!canNext} aria-label="Ver siguientes" className={`${arrow} -right-4`}>
        <ArrowRightIcon className="h-5 w-5" />
      </button>
    </section>
  );
}
