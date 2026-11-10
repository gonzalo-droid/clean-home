"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PACKS, cartSuggestions, packLines, packTotal } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format";
import AddPackButton from "@/components/AddPackButton";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import QuantityStepper from "@/components/QuantityStepper";
import { CartIcon, CheckIcon, CloseIcon, WhatsAppGlyph } from "@/components/icons";

export default function CartClient() {
  const { items, hydrated, setQuantity, remove, total, count, clear } = useCart();
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [sent, setSent] = useState(false);

  const productIds = useMemo(() => items.map((i) => i.productId), [items]);
  const suggestions = useMemo(() => cartSuggestions(productIds, 8), [productIds]);
  const whatsappUrl = buildWhatsAppOrderUrl(items, { name, district });

  function handleSend() {
    clear();
    setSent(true);
  }

  if (!hydrated) {
    return <div className="container-page min-h-[60vh] py-8" aria-busy="true" />;
  }

  return (
    <div className="container-page py-8">
      <nav aria-label="Ruta" className="mb-2 text-[13px] text-gris">
        <Link href="/" className="hover:text-agua">Inicio</Link> / <span>Tu pedido</span>
      </nav>
      <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="font-display text-3xl font-extrabold text-marino sm:text-4xl">Tu pedido</h1>
        {items.length > 0 && (
          <span className="text-gris">{count} {count === 1 ? "producto" : "productos"}</span>
        )}
      </div>

      {sent ? (
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-menta text-agua">
            <CheckIcon className="h-8 w-8" />
          </span>
          <p className="font-display text-xl font-extrabold text-marino">¡Pedido enviado a WhatsApp!</p>
          <p className="max-w-md text-sm text-gris">
            Termina de enviar el mensaje en WhatsApp y te responderemos para coordinar pago y entrega.
          </p>
          <Link href="/catalogo" className="btn-primary mt-2">Seguir comprando</Link>
        </div>
      ) : items.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-menta text-agua">
            <CartIcon className="h-8 w-8" />
          </span>
          <p className="font-display text-xl font-extrabold text-marino">Tu pedido está vacío</p>
          <p className="text-sm text-gris">Agrega productos desde aquí abajo o explora el catálogo.</p>
          <Link href="/catalogo" className="btn-primary mt-2">Ver catálogo</Link>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.lineId} className="card flex gap-3 p-3 sm:gap-4 sm:p-4">
                <Link
                  href={`/producto/${item.productId}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-espuma sm:h-24 sm:w-24"
                  aria-label={`Ver ${item.name}`}
                >
                  <ProductImage src={item.image} alt={item.name} sizes="96px" padding="p-2" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/producto/${item.productId}`} className="font-semibold leading-snug hover:text-agua">
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(item.lineId)}
                      aria-label={`Quitar ${item.name}`}
                      className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gris hover:bg-espuma hover:text-marino"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[13px] text-gris">
                    {item.presentation}
                    {item.variant ? ` · ${item.variant}` : ""} · {formatPrice(item.price)} c/u
                  </p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
                    <QuantityStepper
                      size="sm"
                      min={0}
                      value={item.quantity}
                      onChange={(q) => setQuantity(item.lineId, q)}
                      label={item.name}
                    />
                    <span className="font-display text-lg font-extrabold text-marino">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
            <li>
              <Link href="/catalogo" className="text-sm font-semibold text-agua hover:text-agua-dark">
                ← Seguir comprando
              </Link>
            </li>
          </ul>

          <aside className="card flex flex-col gap-4 p-5 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-extrabold text-marino">Resumen</h2>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-[13px] font-semibold">
                <span>Tu nombre <span className="font-normal text-gris">(opcional)</span></span>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. María" autoComplete="name" />
              </label>
              <label className="flex flex-col gap-1 text-[13px] font-semibold">
                <span>Distrito / ciudad <span className="font-normal text-gris">(opcional)</span></span>
                <input className="input" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Ej. Chiclayo" autoComplete="address-level2" />
              </label>
            </div>
            <div className="flex items-baseline justify-between border-t border-linea pt-4">
              <span className="text-sm text-gris">Subtotal</span>
              <span className="font-display text-2xl font-extrabold text-marino">{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-gris">El envío y el pago se coordinan por WhatsApp. No se cobra nada en la web.</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleSend}
              className="btn-wa min-h-[52px] w-full text-base font-bold"
            >
              <WhatsAppGlyph className="h-5 w-5" />
              Enviar pedido por WhatsApp
            </a>
          </aside>
        </div>
      )}

      <section className="mt-12">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 className="section-title">{items.length > 0 ? "Completa tu pedido" : "Los más pedidos"}</h2>
          <Link href="/catalogo" className="text-[15px] font-semibold text-agua hover:text-agua-dark">Ver catálogo</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {suggestions.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-[28px] bg-limon p-5 sm:p-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-marino">Packs armados</span>
            <h2 className="font-display text-2xl font-extrabold text-marino sm:text-3xl">Agrega un combo de una vez</h2>
          </div>
          <Link href="/packs" className="text-[15px] font-semibold text-marino underline">Ver detalle de packs</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PACKS.map((pack) => (
            <div key={pack.id} className="flex flex-col gap-3 rounded-[20px] bg-white p-4">
              <div className="flex -space-x-3" aria-hidden="true">
                {packLines(pack).slice(0, 4).map(({ product }) => (
                  <div key={product.id} className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-espuma">
                    <ProductImage src={product.image} alt="" sizes="48px" padding="p-1" />
                  </div>
                ))}
              </div>
              <div>
                <p className="font-display font-bold text-marino">{pack.name}</p>
                <p className="text-[13px] text-gris">{pack.items.length} productos · {pack.description}</p>
              </div>
              <p className="mt-auto font-display text-xl font-extrabold text-agua">{formatPrice(packTotal(pack))}</p>
              <AddPackButton pack={pack} className="btn-primary w-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
