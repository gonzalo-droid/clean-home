import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce Clean Home: venta de productos de limpieza con atención y pedidos por WhatsApp.",
};

const VALUES = [
  {
    title: "Calidad",
    icon: "✅",
    description: "Trabajamos con marcas reconocidas en cada categoría de producto.",
  },
  {
    title: "Confianza",
    icon: "🤝",
    description: "Precios claros y sin sorpresas, confirmados antes de cada pedido.",
  },
  {
    title: "Atención cercana",
    icon: "💬",
    description: "Coordinamos cada pedido directo por WhatsApp, de persona a persona.",
  },
  {
    title: "Cumplimiento",
    icon: "⏱️",
    description: "Entregas puntuales y compromiso con lo acordado.",
  },
];

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-4 text-2xl font-extrabold text-slate-800">Nosotros</h1>
      <Reveal>
        <p className="mb-10 text-slate-600">
          En Clean Home ofrecemos una amplia variedad de productos de limpieza para el hogar y
          negocios: detergentes, papel higiénico, papel toalla, bolsas, artículos de limpieza para
          baño y cocina, y mucho más. Aceptamos pagos por Yape, transferencia o efectivo.
        </p>
      </Reveal>

      <Reveal className="mb-10 rounded-3xl bg-sky-50 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-sky-600">Misión</h2>
            <p className="text-sm text-slate-600">
              Ofrecer productos de limpieza de calidad para el hogar y los negocios de nuestra
              comunidad, con una atención cercana y pedidos simples a través de WhatsApp.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-sky-600">Visión</h2>
            <p className="text-sm text-slate-600">
              Ser la opción de confianza en productos de limpieza del barrio, reconocidos por la
              calidad de nuestros productos y la rapidez en la atención.
            </p>
          </div>
        </div>
      </Reveal>

      <h2 className="mb-4 text-lg font-bold text-slate-800">Nuestros valores</h2>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value, index) => (
          <Reveal key={value.title} delayMs={index * 100}>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <span className="mb-2 block text-2xl" aria-hidden="true">
                {value.icon}
              </span>
              <h3 className="mb-1 text-sm font-bold text-sky-600">{value.title}</h3>
              <p className="text-xs text-slate-600">{value.description}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="rounded-3xl bg-sky-50 p-8 text-center">
        <h2 className="mb-2 text-lg font-bold text-slate-800">¿Listo para tu pedido?</h2>
        <p className="mb-4 text-sm text-slate-600">
          Explora el catálogo o escríbenos directo por WhatsApp.
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
      </Reveal>
    </div>
  );
}
