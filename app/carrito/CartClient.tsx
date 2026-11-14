"use client";

import Link from "next/link";
import { useState } from "react";
import { PACKS, cartSuggestions, packLines, packTotal, type Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format";
import AddPackButton from "@/components/AddPackButton";
import Carousel from "@/components/Carousel";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import QuantityStepper from "@/components/QuantityStepper";
import { CartIcon, CheckIcon, CloseIcon, WhatsAppGlyph } from "@/components/icons";

export default function CartClient() {
  const { items, hydrated, setQuantity, remove, total, count, clear } = useCart();
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  // "confirm": se abrió WhatsApp; la lista se conserva hasta que el cliente confirme que la envió.
  const [step, setStep] = useState<"editing" | "confirm">("editing");

  // Las sugerencias se calculan una sola vez al abrir la página, para que las tarjetas
  // no se muevan ni desaparezcan mientras el cliente agrega productos.
  const [suggestions, setSuggestions] = useState<Product[] | null>(null);
  if (hydrated && suggestions === null) {
    setSuggestions(cartSuggestions(items.map((i) => i.productId), 10));
  }
  const whatsappUrl = buildWhatsAppOrderUrl(items, { name, district });

  function handleSend() {
    setStep("confirm");
    window.scrollTo({ top: 0 });
  }

  function handleConfirmSent() {
    clear();
    setStep("editing");
  }

  if (!hydrated) {
    return (
      <div className="container-page min-h-[60vh] py-8" aria-busy="true">
        <span className="sr-only">Cargando tu pedido…</span>
        <div className="mb-6 h-9 w-48 animate-pulse rounded-lg bg-linea" />
        <div className="flex flex-col gap-3">
          {[0, 1].map((i) => (
            <div key={i} className="card flex gap-4 p-4">
              <div className="h-20 w-20 animate-pulse rounded-2xl bg-linea" />
              <div className="flex flex-1 flex-col gap-2 pt-1">
                <div className="h-4 w-2/3 animate-pulse rounded bg-linea" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-linea" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const sendButton = (className: string) => (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={handleSend} className={className}>
      <WhatsAppGlyph className="h-5 w-5" />
      Enviar pedido por WhatsApp
    </a>
  );

  return (
    <div className={`container-page py-8 ${items.length > 0 && step === "editing" ? "pb-32 md:pb-8" : ""}`}>
      <nav aria-label="Ruta" className="mb-2 text-[13px] text-gris">
        <Link href="/" className="hover:text-agua">Inicio</Link> / <span>Tu pedido</span>
      </nav>
      <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="font-display text-3xl font-extrabold text-marino sm:text-4xl">Tu pedido</h1>
        {items.length > 0 && (
          <span className="text-gris">{count} {count === 1 ? "producto" : "productos"}</span>
        )}
      </div>

      {step === "confirm" && items.length > 0 ? (
        <div role="status" className="card mx-auto flex max-w-md flex-col gap-3 p-6 sm:p-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-menta text-agua">
            <WhatsAppGlyph className="h-7 w-7" />
          </span>
          <p className="font-display text-2xl font-extrabold text-marino">¿Se abrió WhatsApp con tu pedido?</p>
          <p className="text-sm text-gris">
            Tu lista sigue guardada hasta que confirmes que la enviaste. Después te respondemos para coordinar pago y entrega.
          </p>
          <button type="button" onClick={handleConfirmSent} className="btn-primary mt-2 min-h-[48px] text-base">
            <CheckIcon className="h-5 w-5" /> Sí, ya la envié
          </button>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-wa min-h-[48px] text-base">
            <WhatsAppGlyph className="h-5 w-5" /> Abrir WhatsApp otra vez
          </a>
          <button type="button" onClick={() => setStep("editing")} className="btn-outline min-h-[48px]">
            Seguir editando
          </button>
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
            {sendButton("btn-wa hidden min-h-[52px] w-full text-base font-bold md:inline-flex")}
          </aside>

          {/* En móvil el botón de enviar queda siempre a la vista, con el total. */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-linea bg-white px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 md:hidden">
            {sendButton("btn-wa min-h-[52px] w-full text-base font-bold")}
            <p className="mt-1.5 text-center text-xs text-gris">
              Total <span className="font-bold tabular-nums text-marino">{formatPrice(total)}</span> · pago y envío por WhatsApp
            </p>
          </div>
        </div>
      )}

      <section className="mt-12">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 className="section-title">{items.length > 0 ? "Completa tu pedido" : "Los más pedidos"}</h2>
          <Link href="/catalogo" className="text-[15px] font-semibold text-agua hover:text-agua-dark">Ver catálogo</Link>
        </div>
        <Carousel label="Productos sugeridos">
          {(suggestions ?? []).map((p) => (
            <li key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[220px]">
              <ProductCard product={p} />
            </li>
          ))}
        </Carousel>
      </section>

      <section className="mt-12 rounded-[28px] bg-limon p-5 sm:p-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-marino">Packs armados</span>
            <h2 className="font-display text-2xl font-extrabold text-marino sm:text-3xl">Agrega un combo de una vez</h2>
          </div>
          <Link href="/packs" className="text-[15px] font-semibold text-marino underline">Ver detalle de packs</Link>
        </div>
        <Carousel label="Packs armados">
          {PACKS.map((pack) => (
            <li key={pack.id} className="flex w-[78%] shrink-0 snap-start flex-col gap-3 rounded-[20px] bg-white p-4 sm:w-[260px]">
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
            </li>
          ))}
        </Carousel>
      </section>
    </div>
  );
}
