"use client";

import { packLines, type Pack } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { makeLineId } from "@/lib/cart";

export default function AddPackButton({ pack, className = "btn-primary w-full" }: { pack: Pack; className?: string }) {
  const { add, showToast } = useCart();

  function handleAdd() {
    for (const { product, quantity } of packLines(pack)) {
      const variant = product.variants?.[0];
      add(
        {
          lineId: makeLineId(product.id, variant),
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

  return (
    <button type="button" onClick={handleAdd} className={className}>
      Agregar pack al pedido
    </button>
  );
}
