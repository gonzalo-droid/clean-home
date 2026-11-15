import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  BEST_SELLER_IDS,
  GROUPS,
  PACKS,
  PRODUCTS,
  getProduct,
  packTotal,
  productsInGroup,
} from "@/data/products";
import HeroOrder from "@/components/HeroOrder";
import ProductCard from "@/components/ProductCard";
import { formatPrice } from "@/lib/format";
import { ChatIcon, ClockIcon, TagIcon, TruckIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Clean Home | Productos de limpieza con pedidos por WhatsApp",
  description:
    "Detergentes, papel higiénico, papel toalla, lejía, bolsas y accesorios de limpieza. Arma tu pedido y recíbelo coordinando por WhatsApp. Envíos a todo el Perú.",
};

const FACTS = [
  { Icon: ClockIcon, text: "Lunes a sábado, 9am – 7pm" },
  { Icon: TagIcon, text: "Yape, transferencia o efectivo" },
  { Icon: TruckIcon, text: "Envíos a todo el Perú" },
  { Icon: ChatIcon, text: "Te atiende una persona, no un bot" },
];

const STEPS = [
  { title: "Elige tus productos", text: "Agrégalos con la cantidad y el aroma que quieras." },
  { title: "Envía la lista", text: "Un botón abre WhatsApp con tu pedido ya escrito." },
  { title: "Recibe en casa", text: "Coordinamos contigo el pago y la entrega." },
];

export default function HomePage() {
  const bestSellers = BEST_SELLER_IDS.map(getProduct).filter((p) => p !== undefined);

  return (
    <div>
      {/* Hero: la boleta del pedido, que crece al tocar un producto */}
      <HeroOrder productCount={PRODUCTS.length} />

      {/* Más pedidos: visible desde la primera pantalla en móvil */}
      <section className="container-page pt-8 sm:pt-14">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="section-title">Lo que más se pide</h2>
          <Link href="/catalogo" className="link text-[15px]">
            Ver los {PRODUCTS.length} productos
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Datos concretos en vez de frases de confianza */}
      <section className="container-page pt-10">
        <ul className="grid gap-x-6 gap-y-3 border-y border-linea py-5 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-[15px] font-semibold text-marino">
              <Icon className="h-5 w-5 shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </section>

      {/* Categorías */}
      <section className="container-page pt-10 sm:pt-14">
        <h2 className="section-title mb-4">Compra por categoría</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {GROUPS.map((group) => (
            <Link
              key={group.id}
              href={`/catalogo?grupo=${group.id}`}
              className="group flex min-h-[176px] flex-col justify-between gap-2 rounded-xl bg-white p-4 sm:p-5"
            >
              <div>
                <p className="font-display text-2xl font-extrabold leading-none text-marino group-hover:underline">{group.label}</p>
                <p className="mt-1.5 hidden text-[13px] text-gris sm:block">{group.description}</p>
                <p className="mt-1.5 text-xs font-bold tabular-nums text-gris">{productsInGroup(group.id).length} productos</p>
              </div>
              <div className="relative h-20 w-24 self-end sm:h-24 sm:w-28">
                <Image src={group.image} alt="" fill sizes="112px" className="object-contain" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Packs */}
      <section className="container-page pt-10 sm:pt-14">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h2 className="section-title">Packs armados</h2>
            <p className="mt-1 text-gris">Listas que se piden juntas. Agrégalas de una vez y ajusta cantidades en tu pedido.</p>
          </div>
          <Link href="/packs" className="link text-[15px]">
            Ver todos los packs
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {PACKS.slice(0, 3).map((pack) => (
            <Link key={pack.id} href={`/packs#${pack.id}`} className="group flex flex-col gap-1 rounded-xl bg-white p-4 sm:p-5">
              <p className="font-display text-xl font-extrabold text-marino group-hover:underline">{pack.name}</p>
              <p className="text-[13px] text-gris">
                {pack.items.length} productos. {pack.description}
              </p>
              <p className="mt-2 font-display text-2xl font-extrabold tabular-nums text-marino">{formatPrice(packTotal(pack))}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Cómo pedir: es una secuencia real, por eso va numerada */}
      <section className="container-page pt-10 sm:pt-14">
        <h2 className="section-title mb-4">Cómo pedir</h2>
        <ol className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="font-display text-4xl font-extrabold leading-none tabular-nums text-limon-dark">{i + 1}</span>
              <div>
                <p className="font-semibold text-marino">{step.title}</p>
                <p className="text-sm text-gris">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Mayoristas */}
      <section className="container-page pt-10 sm:pt-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-linea pt-8">
          <div className="flex max-w-xl flex-col gap-1">
            <h2 className="section-title">¿Tienes bodega, oficina o restaurante?</h2>
            <p className="text-gris">Precios por volumen y presentaciones grandes, con atención directa.</p>
          </div>
          <Link href="/mayoristas" className="btn-outline min-h-[48px] px-7">
            Cotizar como mayorista
          </Link>
        </div>
      </section>
    </div>
  );
}
