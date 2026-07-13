"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { makeLineId } from "@/lib/cart";

export default function ProductCard({ product }: { product: Product }) {
  const { add, openCart } = useCart();
  const [variant, setVariant] = useState(product.variants?.[0]);

  function handleAdd() {
    add({
      lineId: makeLineId(product.id, variant),
      productId: product.id,
      name: product.name,
      presentation: product.presentation,
      variant,
      price: product.price,
      image: product.image,
    });
    openCart();
  }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_12px_-4px_rgba(2,132,199,0.15)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_30px_-10px_rgba(2,132,199,0.35)]">
      <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/60">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-3"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-slate-300">
            🧴
          </div>
        )}
      </div>

      <p className="text-sm font-semibold text-slate-800">{product.name}</p>
      <p className="text-xs text-slate-500">{product.presentation}</p>

      {product.variants && (
        <select
          value={variant}
          onChange={(e) => setVariant(e.target.value)}
          className="mt-2 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700"
        >
          {product.variants.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-base font-bold text-sky-600">S/{product.price.toFixed(2)}</span>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-full bg-sky-500 px-3 py-1.5 text-xs font-bold text-white shadow-[0_4px_10px_-2px_rgba(2,132,199,0.5)] transition hover:bg-sky-600"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
