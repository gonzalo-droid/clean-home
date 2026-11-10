"use client";

import { packLines, type Pack } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { makeLineId } from "@/lib/cart";
import { CheckIcon } from "./icons";

export default function AddPackButton({ pack, className = "btn-primary w-full" }: { pack: Pack; className?: string }) {
  const { items, add, showToast } = useCart();

  const lines = packLines(pack).map(({ product, quantity }) => ({
    product,
    quantity,
    variant: product.variants?.[0],
    lineId: makeLineId(product.id, product.variants?.[0]),
  }));
  const inCart = lines.every((l) => items.some((i) => i.lineId === l.lineId));

  function handleAdd() {
    for (const { product, quantity, variant, lineId } of lines) {
      add(
        {
          lineId,
          productId: product.id,
          name: product.name,
          presentation: product.presentation,
          variant,
          price: product.price,
          image: product.image,
        },
        quantity
      );
    }
    showToast(`${pack.name} agregado`);
  }

  if (inCart) {
    return (
      <p
        role="status"
        className="btn w-full bg-menta font-bold text-marino"
        aria-label={`${pack.name}: todos sus productos ya están en tu pedido`}
      >
        <CheckIcon className="h-4 w-4" /> Pack en tu pedido
      </p>
    );
  }

  return (
    <button type="button" onClick={handleAdd} className={className}>
      Agregar pack al pedido
    </button>
  );
}
