"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { makeLineId } from "@/lib/cart";
import { buildWhatsAppTextUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format";
import QuantityStepper from "./QuantityStepper";
import { WhatsAppGlyph } from "./icons";

export default function ProductActions({ product }: { product: Product }) {
  const { add } = useCart();
  const [variant, setVariant] = useState(product.variants?.[0]);
  const [quantity, setQuantity] = useState(1);

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

  return (
    <div className="flex flex-col gap-5">
      {product.variants && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Aroma / variante</legend>
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
        </fieldset>
      )}

      {/* Escritorio: cantidad y agregar en línea */}
      <div className="hidden flex-wrap items-center gap-3 md:flex">
        <QuantityStepper value={quantity} onChange={setQuantity} label={product.name} />
        <button type="button" onClick={handleAdd} className="btn-primary min-h-[48px] flex-1 basis-48 text-base">
          Agregar al pedido
        </button>
      </div>

      {/* Móvil: barra fija para que «Agregar al pedido» esté siempre a la vista */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-linea bg-white px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 md:hidden">
        <QuantityStepper value={quantity} onChange={setQuantity} label={product.name} />
        <button type="button" onClick={handleAdd} className="btn-primary min-h-[48px] flex-1 text-base">
          Agregar · <span className="tabular-nums">{formatPrice(product.price * quantity)}</span>
        </button>
      </div>

      <a href={askUrl} target="_blank" rel="noopener noreferrer" className="btn self-start border-2 border-wa text-wa hover:bg-wa hover:text-white">
        <WhatsAppGlyph className="h-5 w-5" />
        Preguntar por WhatsApp
      </a>
    </div>
  );
}
