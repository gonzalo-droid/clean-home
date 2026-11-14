"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { makeLineId } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";
import QuantityStepper from "./QuantityStepper";
import { CheckIcon, PlusIcon } from "./icons";

export default function ProductCard({ product, badge }: { product: Product; badge?: string }) {
  const { items, add, setQuantity } = useCart();
  const [variant, setVariant] = useState(product.variants?.[0]);

  const lineId = makeLineId(product.id, variant);
  const inCartQty = items.find((i) => i.lineId === lineId)?.quantity ?? 0;

  function handleAdd() {
    add(
      [
        {
          item: {
            lineId,
            productId: product.id,
            name: product.name,
            presentation: product.presentation,
            variant,
            price: product.price,
            image: product.image,
          },
        },
      ],
      product.name
    );
  }

  const href = `/producto/${product.id}`;

  return (
    <article
      className={`flex h-full flex-col gap-2.5 rounded-xl bg-white p-2.5 sm:p-3 ${
        inCartQty > 0 ? "ring-2 ring-marino" : ""
      }`}
    >
      <Link
        href={href}
        className="relative block aspect-square w-full overflow-hidden rounded-lg"
        aria-label={`Ver ${product.name}`}
      >
        {inCartQty > 0 ? (
          <span className="absolute left-1.5 top-1.5 z-10 flex items-center gap-1 rounded-md bg-marino px-2 py-0.5 text-xs font-bold text-white">
            <CheckIcon className="h-3.5 w-3.5" /> En tu pedido
          </span>
        ) : (
          badge && (
            <span className="absolute left-1.5 top-1.5 z-10 rounded-md bg-limon px-2 py-0.5 text-xs font-bold text-marino">
              {badge}
            </span>
          )
        )}
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>

      <div className="flex flex-col items-start gap-1.5">
        <Link href={href} className="line-clamp-3 text-[15px] font-semibold leading-snug text-grafito hover:underline">
          {product.name}
        </Link>
        <span className="rounded-md bg-papel px-1.5 py-0.5 text-xs font-bold text-marino">{product.presentation}</span>
      </div>

      {product.variants && (
        <label className="text-xs text-gris">
          <span className="sr-only">Variante de {product.name}</span>
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            className="min-h-[40px] w-full rounded-lg border border-linea bg-white px-2 text-[13px] text-grafito"
          >
            {product.variants.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className={`mt-auto flex gap-2 ${inCartQty > 0 ? "flex-col items-start" : "items-center justify-between"}`}>
        <span className="whitespace-nowrap font-display text-2xl font-extrabold tabular-nums text-marino">{formatPrice(product.price)}</span>
        {inCartQty > 0 ? (
          <QuantityStepper
            size="sm"
            min={0}
            value={inCartQty}
            onChange={(q) => setQuantity(lineId, q)}
            label={product.name}
          />
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Agregar ${product.name} al pedido`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-marino text-white transition hover:bg-grafito"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </article>
  );
}
