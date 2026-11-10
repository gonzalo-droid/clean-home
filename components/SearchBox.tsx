"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SearchIcon } from "./icons";

export default function SearchBox({
  placeholder = "Busca detergente, papel, lejía…",
  className = "",
  defaultValue = "",
}: {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={className}>
      <label className="flex min-h-[44px] items-center gap-2 rounded-full border border-linea bg-espuma px-4 focus-within:border-agua focus-within:ring-2 focus-within:ring-agua/30">
        <SearchIcon className="h-[18px] w-[18px] shrink-0 text-gris" />
        <span className="sr-only">Buscar productos</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-grafito placeholder:text-gris focus:outline-none"
        />
      </label>
    </form>
  );
}
