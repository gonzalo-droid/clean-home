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
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { formatPrice } from "@/lib/format";
import { WHATSAPP_URL } from "@/lib/whatsapp";
import { ArrowRightIcon, BoxIcon, ChatIcon, SmileIcon, TruckIcon, WhatsAppGlyph } from "@/components/icons";

export const metadata: Metadata = {
  title: "Clean Home | Productos de limpieza con pedidos por WhatsApp",
  description:
    "Detergentes, papel higiénico, papel toalla, lejía, bolsas y accesorios de limpieza. Arma tu pedido y recíbelo coordinando por WhatsApp. Envíos a todo el Perú.",
};

const TRUST = [
  { Icon: SmileIcon, text: "+40 clientes satisfechos" },
  { Icon: ChatIcon, text: "Pedidos por WhatsApp" },
  { Icon: TruckIcon, text: "Envíos a todo el Perú" },
  { Icon: BoxIcon, text: "Precios mayoristas" },
];

const STEPS = [
  { title: "Elige tus productos", text: "Agrégalos al carrito con la cantidad y el aroma que quieras." },
  { title: "Envía tu pedido", text: "Un botón abre WhatsApp con tu lista ya escrita." },
  { title: "Recibe en casa", text: "Coordinamos contigo el pago (Yape, transferencia o efectivo) y la entrega." },
];

const HERO_IMAGES = [
  { id: "detergente-ariel-2kg", bg: "bg-menta", offset: "" },
  { id: "lejia-clorox-4l", bg: "bg-white", offset: "mt-8" },
  { id: "papel-higienico-elite-classic-500x4", bg: "bg-white", offset: "" },
  { id: "limpiatodo-sapolio", bg: "bg-menta", offset: "mt-8" },
];

export default function HomePage() {
  const bestSellers = BEST_SELLER_IDS.map(getProduct).filter((p) => p !== undefined);

  return (
    <div>
      {/* Hero */}
      <section className="container-page pt-4 sm:pt-8">
        <div className="grid items-center gap-8 overflow-hidden rounded-[28px] bg-marino p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
          <div className="flex flex-col gap-5">
            <span className="self-start rounded-full bg-limon px-3.5 py-1.5 text-xs font-bold text-marino sm:text-[13px]">
              Envíos a todo el Perú
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-[56px]">
              Tu casa limpia, sin salir de casa
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-menta sm:text-lg">
              Detergentes, papel, lejía y accesorios de las marcas que ya conoces. Arma tu pedido y lo
              coordinamos por WhatsApp.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/catalogo" className="btn-lemon min-h-[48px] px-7 text-base">
                Ver catálogo
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn min-h-[48px] border-2 border-white px-7 text-base text-white hover:bg-white hover:text-marino"
              >
                <WhatsAppGlyph className="h-5 w-5" />
                Pedir por WhatsApp
              </a>
            </div>
          </div>
          <div className="hidden grid-cols-2 gap-4 sm:grid" aria-hidden="true">
            {HERO_IMAGES.map(({ id, bg, offset }, i) => {
              const p = getProduct(id);
              if (!p?.image) return null;
              return (
                <div key={id} className={`relative h-44 rounded-[20px] lg:h-52 ${bg} ${offset}`}>
                  <Image src={p.image} alt="" fill priority={i < 2} sizes="(max-width: 1024px) 40vw, 25vw" className="object-contain p-5" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Confianza */}
      <section className="container-page py-6">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {TRUST.map(({ Icon, text }) => (
            <li key={text} className="card flex items-center gap-3 p-3 sm:p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-menta text-agua">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[13px] font-semibold sm:text-sm">{text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Categorías */}
      <section className="container-page py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 className="section-title">Compra por categoría</h2>
          <Link href="/catalogo" className="text-[15px] font-semibold text-agua hover:text-agua-dark">
            Ver todo ({PRODUCTS.length})
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {GROUPS.map((group, i) => (
            <Reveal key={group.id} delayMs={i * 80}>
              <Link
                href={`/catalogo?grupo=${group.id}`}
                className={`group flex h-48 flex-col justify-between rounded-3xl p-4 transition hover:-translate-y-1 hover:shadow-card sm:h-56 sm:p-5 ${
                  i % 3 === 0 ? "bg-menta" : "border border-linea bg-white"
                }`}
              >
                <div>
                  <p className="font-display text-lg font-bold leading-tight text-marino sm:text-xl">{group.label}</p>
                  <p className="mt-1 hidden text-[13px] text-gris sm:block">{group.description}</p>
                  <p className="mt-1 text-xs font-semibold text-agua">{productsInGroup(group.id).length} productos</p>
                </div>
                <div className="relative h-20 w-24 self-end sm:h-28 sm:w-32">
                  <Image src={group.image} alt="" fill sizes="128px" className="object-contain transition group-hover:scale-105" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Más pedidos */}
      <section className="container-page py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 className="section-title">Los más pedidos</h2>
          <Link href="/catalogo" className="text-[15px] font-semibold text-agua hover:text-agua-dark">
            Ver catálogo
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Packs */}
      <section className="container-page py-8">
        <div className="grid items-center gap-6 rounded-[28px] bg-limon p-6 sm:p-10 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-marino">Packs armados</span>
            <h2 className="font-display text-3xl font-extrabold leading-tight text-marino sm:text-4xl">
              Todo lo del mes en un solo clic
            </h2>
            <p className="text-marino">Combos para casa, baño, cocina u oficina.</p>
            <Link href="/packs" className="btn mt-1 self-start bg-marino text-white hover:bg-grafito">
              Ver todos los packs <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {PACKS.slice(0, 3).map((pack) => (
              <Link key={pack.id} href={`/packs#${pack.id}`} className="flex flex-col gap-1 rounded-[18px] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-card">
                <p className="font-display font-bold text-marino">{pack.name}</p>
                <p className="text-[13px] text-gris">{pack.items.length} productos · {pack.description}</p>
                <p className="mt-2 font-display text-lg font-extrabold text-agua">{formatPrice(packTotal(pack))}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo pedir */}
      <section className="container-page py-8">
        <h2 className="section-title mb-5">Así de fácil es pedir</h2>
        <ol className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {STEPS.map((step, i) => (
              <li key={step.title} className="card flex h-full flex-col gap-2.5 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-marino font-display font-extrabold text-white">
                  {i + 1}
                </span>
                <p className="font-display text-lg font-bold text-marino">{step.title}</p>
                <p className="text-sm text-gris">{step.text}</p>
              </li>
          ))}
        </ol>
      </section>

      {/* Mayoristas */}
      <section className="container-page py-8">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[28px] bg-menta p-6 sm:p-10">
          <div className="flex max-w-xl flex-col gap-2">
            <h2 className="font-display text-2xl font-extrabold text-marino sm:text-3xl">
              ¿Tienes bodega, oficina o restaurante?
            </h2>
            <p className="text-grafito">Precios especiales por volumen y atención directa.</p>
          </div>
          <Link href="/mayoristas" className="btn min-h-[48px] bg-marino px-7 text-white hover:bg-grafito">
            Cotizar como mayorista
          </Link>
        </div>
      </section>
    </div>
  );
}
