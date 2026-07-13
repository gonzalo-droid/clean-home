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

const TRUST_HIGHLIGHTS = [
  { icon: "😊", text: "+40 clientes satisfechos" },
  { icon: "📱", text: "Pedidos por WhatsApp" },
  { icon: "🚚", text: "Envíos a todo el Perú" },
  { icon: "📦", text: "Pedidos mayoristas" },
];

export default function HomePage() {
  const featured = PRODUCTS.filter((p) => FEATURED_IDS.includes(p.id));

  return (
    <div>
      <section className="bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center">
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-6xl">
            Limpieza <span className="text-sky-600">sin complicaciones</span>
          </h1>
          <p className="max-w-xl text-slate-600">
            Detergentes, papel higiénico, papel toalla, bolsas y accesorios. Arma tu pedido y
            coordínalo directo por WhatsApp.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/catalogo"
              className="rounded-full bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-[0_4px_10px_-2px_rgba(2,132,199,0.5)] transition hover:-translate-y-0.5 hover:bg-sky-600"
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

      <section className="bg-sky-600 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 text-center text-white sm:grid-cols-4">
          {TRUST_HIGHLIGHTS.map((item) => (
            <div key={item.text} className="flex flex-col items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                {item.icon}
              </span>
              <span className="text-sm font-semibold">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sky-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-6 text-xl font-bold text-slate-800">Categorías</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogo?categoria=${cat.id}`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center text-sm font-semibold text-slate-700 shadow-[0_4px_12px_-4px_rgba(2,132,199,0.15)] transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:text-sky-600 hover:shadow-[0_16px_30px_-10px_rgba(2,132,199,0.35)]"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-xl"
                  aria-hidden="true"
                >
                  {cat.icon}
                </span>
                {cat.label}
              </Link>
            ))}
          </div>
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

    </div>
  );
}
