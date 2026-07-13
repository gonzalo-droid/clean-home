import Link from "next/link";
import type { Metadata } from "next";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Clean Home | Productos de limpieza con pedidos por WhatsApp",
  description:
    "Detergentes, papel higiénico, papel toalla, bolsas y accesorios de limpieza. Arma tu pedido y recíbelo coordinando por WhatsApp.",
};

const FEATURED_IDS = [
  "detergente-ariel-2kg",
  "papel-higienico-elite-classic-500x4",
  "lejia-clorox-4l",
  "guantes-limpieza",
];

export default function HomePage() {
  const featured = PRODUCTS.filter((p) => FEATURED_IDS.includes(p.id));

  return (
    <div>
      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center">
          <h1 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
            Productos de limpieza para tu hogar y negocio
          </h1>
          <p className="max-w-xl text-slate-600">
            Detergentes, papel higiénico, papel toalla, bolsas y accesorios. Arma tu pedido y
            coordínalo directo por WhatsApp.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/catalogo"
              className="rounded-full bg-sky-500 px-6 py-3 text-sm font-bold text-white hover:bg-sky-600"
            >
              Ver catálogo
            </Link>
            <a
              href="https://wa.me/51976509570"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-emerald-500 px-6 py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-50"
            >
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-xl font-bold text-slate-800">Categorías</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogo?categoria=${cat.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-center text-sm font-semibold text-slate-700 shadow-sm hover:border-sky-300 hover:text-sky-600"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-xl font-bold text-slate-800">Productos destacados</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-2xl bg-slate-50 p-8 text-center">
          <h2 className="text-lg font-bold text-slate-800">Métodos de pago</h2>
          <p className="mt-2 text-sm text-slate-600">Aceptamos Yape, transferencias y efectivo.</p>
        </div>
      </section>
    </div>
  );
}
