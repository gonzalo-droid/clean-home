import Link from "next/link";
import { getProduct } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { WHATSAPP_URL } from "@/lib/whatsapp";
import { WhatsAppGlyph } from "./icons";

/**
 * Pedido de ejemplo de la boleta del hero. Es fijo y solo ilustra cómo llega el pedido
 * por WhatsApp: no se puede editar, para no confundirse con la sección de productos.
 */
const SAMPLE_ORDER = [
  { id: "detergente-ariel-2kg", quantity: 1 },
  { id: "lejia-clorox-4l", quantity: 2 },
  { id: "papel-higienico-elite-classic-500x4", quantity: 1 },
];

/** Hero del inicio: el titular y la boleta con un pedido de ejemplo. */
export default function HeroOrder({ productCount }: { productCount: number }) {
  const lines = SAMPLE_ORDER.flatMap(({ id, quantity }) => {
    const p = getProduct(id);
    return p ? [{ id: p.id, name: p.name, presentation: p.presentation, quantity, price: p.price }] : [];
  });
  const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

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
        aria-label="Ejemplo de pedido por WhatsApp"
        className="boleta mx-auto w-full max-w-md lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:max-w-none lg:rotate-[1.2deg] lg:px-7 lg:pb-7 lg:pt-6"
      >
        <figcaption className="mb-1 text-[13px] text-gris">Así llega tu pedido por WhatsApp (ejemplo):</figcaption>
        <p className="mb-1 hidden text-[15px] lg:block">Hola, quiero hacer el siguiente pedido:</p>
        <ul>
          {lines.map((l, i) => (
            <li key={l.id} className="boleta-fila lg:text-[15px]">
              <span className="min-w-0">
                {i + 1}. {l.name}{" "}
                <span className="text-gris">
                  {l.presentation} ×{l.quantity}
                </span>
              </span>
              <span className="shrink-0">{formatPrice(l.price * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="boleta-total">
          <span>Total</span>
          <b className="lg:text-[2.75rem] lg:leading-none">{formatPrice(total)}</b>
        </p>
      </figure>

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
