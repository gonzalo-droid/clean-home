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

  const products = useMemo(
    () => (active === "todas" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-extrabold text-slate-800">Catálogo de productos</h1>
      <p className="mb-6 text-sm text-slate-600">
        Agrega los productos que necesitas y envía tu pedido por WhatsApp.
      </p>

      <div className="mb-8">
        <CategoryFilter active={active} onChange={setActive} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
