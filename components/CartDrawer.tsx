"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";
import QuantityStepper from "./QuantityStepper";
import { CartIcon, CloseIcon, WhatsAppGlyph } from "./icons";

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, remove, total, count, clear } = useCart();
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const whatsappUrl = buildWhatsAppOrderUrl(items, { name, district });

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Cerrar carrito" onClick={closeCart} className="absolute inset-0 bg-marino/50" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="relative flex h-full w-full max-w-md flex-col bg-espuma shadow-xl"
      >
        <div className="flex items-center gap-2 border-b border-linea bg-white px-4 py-3">
          <h2 id="cart-title" className="font-display text-xl font-extrabold text-marino">
            Tu pedido
          </h2>
          <span className="text-sm text-gris">· {count} {count === 1 ? "producto" : "productos"}</span>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar"
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-full text-marino hover:bg-menta"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-menta text-agua">
                <CartIcon className="h-8 w-8" />
              </span>
              <p className="text-sm text-gris">Aún no agregaste productos.</p>
              <Link href="/catalogo" onClick={closeCart} className="btn-primary">
                Ver catálogo
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item.lineId} className="card flex gap-3 p-2.5">
                    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-espuma">
                      <ProductImage src={item.image} alt={item.name} sizes="72px" padding="p-1.5" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-snug">{item.name}</p>
                        <button
                          type="button"
                          onClick={() => remove(item.lineId)}
                          aria-label={`Quitar ${item.name}`}
                          className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gris hover:bg-espuma hover:text-marino"
                        >
                          <CloseIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gris">
                        {item.presentation}
                        {item.variant ? ` · ${item.variant}` : ""}
                      </p>
                      <div className="flex items-center justify-between">
                        <QuantityStepper
                          size="sm"
                          min={0}
                          value={item.quantity}
                          onChange={(q) => setQuantity(item.lineId, q)}
                          label={item.name}
                        />
                        <span className="font-bold text-marino">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                href="/packs"
                onClick={closeCart}
                className="rounded-2xl bg-menta px-4 py-3 text-[13px] text-marino hover:underline"
              >
                ¿Te falta algo? Mira nuestros <strong>packs armados</strong> →
              </Link>

              <div className="card flex flex-col gap-3 p-4">
                <label className="flex flex-col gap-1 text-[13px] font-semibold">
                  <span>Tu nombre <span className="font-normal text-gris">(opcional)</span></span>
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. María" autoComplete="name" />
                </label>
                <label className="flex flex-col gap-1 text-[13px] font-semibold">
                  <span>Distrito / ciudad <span className="font-normal text-gris">(opcional)</span></span>
                  <input className="input" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Ej. Chiclayo" autoComplete="address-level2" />
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-linea bg-white px-4 pb-[max(env(safe-area-inset-bottom),16px)] pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gris">Subtotal</span>
            <span className="font-display text-2xl font-extrabold text-marino">{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-gris">
            El envío y el pago se coordinan por WhatsApp. No se cobra nada en la web.
          </p>
          {items.length > 0 ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => clear()}
              className="btn-wa min-h-[52px] w-full text-base font-bold"
            >
              <WhatsAppGlyph className="h-5 w-5" />
              Enviar pedido por WhatsApp
            </a>
          ) : (
            <button type="button" disabled className="btn min-h-[52px] w-full cursor-not-allowed bg-linea text-gris">
              Agrega productos primero
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
