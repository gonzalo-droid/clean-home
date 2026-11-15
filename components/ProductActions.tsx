"use client";

import Link from "next/link";
import { useState } from "react";
import { defaultVariant, type Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { makeLineId } from "@/lib/cart";
import { buildWhatsAppTextUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format";
import QuantityStepper from "./QuantityStepper";
import { CheckIcon, WhatsAppGlyph } from "./icons";

export default function ProductActions({ product }: { product: Product }) {
  const { add, items, hydrated } = useCart();
  const [variant, setVariant] = useState(defaultVariant(product));
  const [quantity, setQuantity] = useState(1);

  // Lo que ya está en el pedido de este producto (todas sus variantes).
  const inCart = hydrated ? items.filter((i) => i.productId === product.id) : [];
  const inCartQty = inCart.reduce((sum, i) => sum + i.quantity, 0);
  const inCartDetail =
    product.variants && inCart.length > 0 ? inCart.map((i) => `${i.quantity} ${i.variant}`).join(", ") : "";

  function handleAdd() {
    add(
      [
        {
          item: {
            lineId: makeLineId(product.id, variant),
            productId: product.id,
            name: product.name,
            presentation: product.presentation,
            variant,
            price: product.price,
            image: product.image,
          },
          quantity,
        },
      ],
      product.name
    );
    setQuantity(1);
  }

  const askUrl = buildWhatsAppTextUrl(
    `Hola, tengo una consulta sobre: ${product.name} (${product.presentation}${variant ? `, ${variant}` : ""}).`
  );

  const photoDiffers = Boolean(product.imageVariant && variant && variant !== product.imageVariant);

  const inCartNote = inCartQty > 0 && (
    <p role="status" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-marino">
      <CheckIcon className="h-4 w-4 shrink-0" />
      <span>
        Ya tienes <b className="tabular-nums">{inCartQty}</b> en tu pedido
        {inCartDetail && <span className="text-gris"> ({inCartDetail})</span>}
      </span>
      <Link href="/carrito" className="link">
        Ver pedido
      </Link>
    </p>
  );

  return (
    <div className="flex flex-col gap-5">
      {product.variants && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Aroma</legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={variant === v}
                onClick={() => setVariant(v)}
                className={`min-h-[44px] rounded-full px-4 text-sm font-semibold transition ${
                  variant === v ? "bg-marino text-white" : "border border-linea bg-white text-grafito hover:border-marino"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          {photoDiffers && (
            <p className="mt-2 text-[13px] text-gris">
              La foto muestra el empaque {product.imageVariant}. Recibes el aroma que elijas: {variant}.
            </p>
          )}
        </fieldset>
      )}

      {inCartNote}

      {/* Escritorio: cantidad y agregar en línea */}
      <div className="hidden flex-wrap items-center gap-3 md:flex">
        <QuantityStepper value={quantity} onChange={setQuantity} label={product.name} />
        <button type="button" onClick={handleAdd} className="btn-primary min-h-[48px] flex-1 basis-48 text-base">
          Agregar al pedido
        </button>
      </div>

      {/* Móvil: barra fija para que «Agregar al pedido» esté siempre a la vista */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col gap-2 border-t border-linea bg-white px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 md:hidden">
        {inCartQty > 0 && (
          <Link href="/carrito" className="flex items-center justify-between text-[13px] text-marino">
            <span className="flex items-center gap-1.5">
              <CheckIcon className="h-4 w-4" /> Ya tienes <b className="tabular-nums">{inCartQty}</b> en tu pedido
            </span>
            <span className="font-bold underline decoration-limon decoration-2 underline-offset-4">Ver pedido</span>
          </Link>
        )}
        <div className="flex items-center gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} label={product.name} />
          <button type="button" onClick={handleAdd} className="btn-primary min-h-[48px] flex-1 text-base">
            Agregar · <span className="tabular-nums">{formatPrice(product.price * quantity)}</span>
          </button>
        </div>
      </div>

      <a href={askUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 self-start text-sm font-bold text-wa hover:underline">
        <WhatsAppGlyph className="h-5 w-5" />
        ¿Dudas sobre este producto? Pregúntanos por WhatsApp
      </a>
    </div>
  );
}
