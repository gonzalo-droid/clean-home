"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { makeLineId } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";
import { PlusIcon } from "./icons";

export default function ProductCard({ product, badge }: { product: Product; badge?: string }) {
  const { add, showToast } = useCart();
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
    showToast(`${product.name} agregado`);
  }

  const href = `/producto/${product.id}`;

  return (
    <article className="card group flex h-full flex-col gap-3 p-3 transition duration-200 hover:-translate-y-1 hover:shadow-card sm:p-4">
      <Link
        href={href}
        className="relative block aspect-square w-full overflow-hidden rounded-2xl bg-espuma"
        aria-label={`Ver ${product.name}`}
      >
        {badge && (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-limon px-2.5 py-1 text-xs font-bold text-marino">
            {badge}
          </span>
        )}
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>

      <div className="flex min-h-[3.5rem] flex-col gap-0.5">
        <Link href={href} className="line-clamp-2 text-[15px] font-semibold leading-snug text-grafito hover:text-agua">
          {product.name}
        </Link>
        <p className="text-xs text-gris sm:text-[13px]">{product.presentation}</p>
      </div>

      {product.variants && (
        <label className="text-xs text-gris">
          <span className="sr-only">Variante de {product.name}</span>
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            className="min-h-[36px] w-full rounded-xl border border-linea bg-white px-2 text-xs text-grafito"
          >
            {product.variants.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="whitespace-nowrap font-display text-lg font-extrabold text-marino">{formatPrice(product.price)}</span>
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Agregar ${product.name} al pedido`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-agua text-white transition hover:bg-agua-dark"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}
