"use client";

import { useMemo, useState } from "react";
import { PRODUCTS, CATEGORIES, type Category } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";

function isCategory(value: string | undefined): value is Category {
  return CATEGORIES.some((c) => c.id === value);
}

export default function CatalogClient({ initialCategory }: { initialCategory?: string }) {
  const [active, setActive] = useState<Category | "todas">(
    isCategory(initialCategory) ? initialCategory : "todas"
  );
  const [query, setQuery] = useState("");

  const products = useMemo(() => {
    let result = active === "todas" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);
    const trimmedQuery = query.trim().toLowerCase();
    if (trimmedQuery) {
      result = result.filter((p) => p.name.toLowerCase().includes(trimmedQuery));
    }
    return result;
  }, [active, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-extrabold text-slate-800">Catálogo de productos</h1>
      <p className="mb-6 text-sm text-slate-600">
        Agrega los productos que necesitas y envía tu pedido por WhatsApp.
      </p>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar producto..."
        aria-label="Buscar producto"
        className="mb-4 w-full rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-800 transition-all duration-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 sm:max-w-xs"
      />

      <div className="mb-8">
        <CategoryFilter active={active} onChange={setActive} />
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-slate-500">No encontramos productos con ese nombre.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
