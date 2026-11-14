"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PRODUCTS } from "@/data/products";
import { SearchIcon } from "./icons";

/**
 * Buscador único del sitio. En /catalogo filtra en el lugar mientras se escribe
 * (actualiza ?q=); en el resto de páginas lleva al catálogo al enviar.
 */
export default function SearchBox({ className = "" }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onCatalog = pathname === "/catalogo";
  const urlQuery = onCatalog ? (searchParams.get("q") ?? "") : "";

  const [query, setQuery] = useState(urlQuery);
  // Si la URL cambia desde afuera (p. ej. «Ver todo el catálogo»), el campo la sigue.
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setQuery(urlQuery);
  }

  function catalogUrl(q: string) {
    const params = new URLSearchParams(onCatalog ? searchParams.toString() : "");
    if (q) params.set("q", q);
    else params.delete("q");
    const qs = params.toString();
    return qs ? `/catalogo?${qs}` : "/catalogo";
  }

  function handleChange(value: string) {
    setQuery(value);
    if (onCatalog) {
      setSyncedQuery(value.trim());
      router.replace(catalogUrl(value.trim()), { scroll: false });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = catalogUrl(query.trim());
    if (onCatalog) {
      router.replace(url, { scroll: false });
      (document.activeElement as HTMLElement | null)?.blur();
    } else {
      router.push(url);
    }
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={className}>
      <label className="flex min-h-[44px] items-center gap-2 rounded-full border border-linea bg-papel px-4 focus-within:border-marino focus-within:ring-2 focus-within:ring-marino/20">
        <SearchIcon className="h-[18px] w-[18px] shrink-0 text-gris" />
        <span className="sr-only">Buscar productos</span>
        <input
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={onCatalog ? `Busca en ${PRODUCTS.length} productos…` : "Busca detergente, papel, lejía…"}
          enterKeyHint="search"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-grafito placeholder:text-gris focus:outline-none"
        />
      </label>
    </form>
  );
}

/** Mismo aspecto mientras carga el buscador (necesario por useSearchParams). */
export function SearchBoxFallback({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="flex min-h-[44px] items-center gap-2 rounded-full border border-linea bg-papel px-4 text-[15px] text-gris">
        <SearchIcon className="h-[18px] w-[18px] shrink-0" />
        Busca detergente, papel, lejía…
      </div>
    </div>
  );
}
