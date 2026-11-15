"use client";

import Link from "next/link";
import { getProduct, type Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { makeLineId } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { WHATSAPP_URL } from "@/lib/whatsapp";
import ProductImage from "./ProductImage";
import { PlusIcon, WhatsAppGlyph } from "./icons";

/** Productos que se pueden agregar desde el hero (de los más pedidos). */
const QUICK_ADD_IDS = [
  "detergente-ariel-2kg",
  "lejia-clorox-4l",
  "papel-higienico-elite-classic-500x4",
  "papel-toalla-genio-500-hojas-unidad",
];

/** Pedido de ejemplo que muestra la boleta mientras el pedido real está vacío. */
const SAMPLE_ORDER = [
  { id: "detergente-ariel-2kg", quantity: 1 },
  { id: "lejia-clorox-4l", quantity: 2 },
];

const MAX_LINES = 4;

function isProduct(p: Product | undefined): p is Product {
  return p !== undefined;
}

/**
 * Hero del inicio: la boleta del pedido es la promesa. Los productos de la fila se agregan
 * al pedido real y la boleta lo refleja; con el pedido vacío muestra un ejemplo.
 */
export default function HeroOrder({ productCount }: { productCount: number }) {
  const { items, add, hydrated, total } = useCart();
  const quick = QUICK_ADD_IDS.map(getProduct).filter(isProduct);

  const showCart = hydrated && items.length > 0;
  const lines = showCart
    ? items.map((i) => ({ key: i.lineId, name: i.name, presentation: i.presentation, quantity: i.quantity, price: i.price }))
    : SAMPLE_ORDER.flatMap(({ id, quantity }) => {
        const p = getProduct(id);
        return p ? [{ key: p.id, name: p.name, presentation: p.presentation, quantity, price: p.price }] : [];
      });
  const shown = lines.slice(0, MAX_LINES);
  const hidden = lines.length - shown.length;
  const boletaTotal = showCart ? total : lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  function handleAdd(product: Product) {
    const variant = product.variants?.[0];
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
        },
      ],
      product.name
    );
  }

  const qtyInCart = (product: Product) =>
    items.find((i) => i.lineId === makeLineId(product.id, product.variants?.[0]))?.quantity ?? 0;

  return (
    <section className="container-page grid grid-cols-[minmax(0,1fr)] gap-x-16 gap-y-5 pt-5 sm:pt-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:items-center">
      <h1 className="font-display text-[2.85rem] font-extrabold leading-[0.92] text-marino sm:text-6xl lg:col-start-1 lg:text-[5.25rem]">
        Tu limpieza del mes, pedida por WhatsApp
      </h1>

      <p className="hidden max-w-[470px] text-lg leading-relaxed text-gris sm:block lg:col-start-1">
        Arma tu lista aquí con las marcas que ya conoces. Un botón la envía por WhatsApp y coordinamos contigo el pago y
        la entrega.
      </p>

      {/* La boleta: a la derecha en escritorio, justo debajo del título en móvil */}
      <figure
        aria-live="polite"
        className="boleta mx-auto w-full max-w-md lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:max-w-none lg:rotate-[1.2deg] lg:px-7 lg:pb-7 lg:pt-6"
      >
        <figcaption className="mb-1 text-[13px] text-gris">
          {showCart ? "Tu pedido hasta ahora:" : "Así llega tu pedido por WhatsApp (ejemplo):"}
        </figcaption>
        <p className="mb-1 hidden text-[15px] lg:block">Hola, quiero hacer el siguiente pedido:</p>
        <ul>
          {shown.map((l, i) => (
            <li key={l.key} className="boleta-fila lg:text-[15px]">
              <span className="min-w-0">
                {i + 1}. {l.name}{" "}
                <span className="text-gris">
                  {l.presentation} ×{l.quantity}
                </span>
              </span>
              <span className="shrink-0">{formatPrice(l.price * l.quantity)}</span>
            </li>
          ))}
          {hidden > 0 && (
            <li className="boleta-fila text-gris">
              y {hidden} {hidden === 1 ? "producto más" : "productos más"}
            </li>
          )}
        </ul>
        <p className="boleta-total">
          <span>Total</span>
          <b className="lg:text-[2.75rem] lg:leading-none">{formatPrice(boletaTotal)}</b>
        </p>
        {showCart && (
          <Link href="/carrito" className="link mt-4 inline-flex min-h-[44px] items-center text-sm">
            Ver pedido y enviarlo por WhatsApp
          </Link>
        )}
      </figure>

      {/* Agregar con un toque: suma al pedido real */}
      <div className="flex min-w-0 flex-col gap-2 lg:col-start-1">
        <p className="text-[13px] font-semibold text-gris sm:text-sm">
          {showCart ? "Sigue agregando con un toque" : "Prueba: toca un producto y mira cómo crece tu pedido"}
        </p>
        <ul className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          {quick.map((product) => {
            const qty = qtyInCart(product);
            return (
              <li key={product.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => handleAdd(product)}
                  aria-label={`Agregar ${product.name} ${product.presentation} al pedido${qty > 0 ? ` (tienes ${qty})` : ""}`}
                  className={`flex min-h-[52px] items-center gap-2 rounded-xl border bg-white py-1.5 pl-1.5 pr-3 text-left text-marino transition hover:border-marino ${
                    qty > 0 ? "border-marino" : "border-linea"
                  }`}
                >
                  <span className="relative h-10 w-10 shrink-0">
                    <ProductImage src={product.image} alt="" sizes="40px" padding="p-0.5" />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[13px] font-semibold sm:text-sm">{shortName(product)}</span>
                    <span className="font-display text-sm font-extrabold tabular-nums">{formatPrice(product.price)}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`ml-1 flex h-7 min-w-[28px] items-center justify-center rounded-full px-1.5 text-xs font-extrabold tabular-nums ${
                      qty > 0 ? "bg-limon text-marino" : "bg-marino text-white"
                    }`}
                  >
                    {qty > 0 ? `×${qty}` : <PlusIcon className="h-4 w-4" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="hidden flex-wrap items-center gap-x-6 gap-y-3 sm:flex lg:col-start-1">
        <Link href="/catalogo" className="btn-primary min-h-[52px] px-8 text-base">
          Ver los {productCount} productos
        </Link>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 font-bold text-wa hover:underline">
          <WhatsAppGlyph className="h-5 w-5" /> Escribir por WhatsApp
        </a>
      </div>
    </section>
  );
}

const SHORT_NAMES: Record<string, string> = {
  "detergente-ariel-2kg": "Ariel 2 KG",
  "lejia-clorox-4l": "Clorox 4 L",
  "papel-higienico-elite-classic-500x4": "Papel Elite",
  "papel-toalla-genio-500-hojas-unidad": "Toalla Genio",
};

function shortName(product: Product) {
  return SHORT_NAMES[product.id] ?? product.name;
}
