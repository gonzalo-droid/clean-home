import type { Metadata } from "next";
import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/whatsapp";
import { ChatIcon, ClockIcon, HeartIcon, ShieldIcon, WhatsAppGlyph } from "@/components/icons";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce Clean Home: venta de productos de limpieza con atención y pedidos por WhatsApp.",
};

const VALUES = [
  { title: "Calidad", Icon: ShieldIcon, description: "Trabajamos con marcas reconocidas en cada categoría de producto." },
  { title: "Confianza", Icon: HeartIcon, description: "Precios claros y sin sorpresas, confirmados antes de cada pedido." },
  { title: "Atención cercana", Icon: ChatIcon, description: "Coordinamos cada pedido directo por WhatsApp, de persona a persona." },
  { title: "Cumplimiento", Icon: ClockIcon, description: "Entregas puntuales y compromiso con lo acordado." },
];

export default function NosotrosPage() {
  return (
    <div className="container-page py-8">
      <div className="mb-12 flex max-w-2xl flex-col gap-4">
        <h1 className="font-display text-4xl font-extrabold leading-[0.95] text-marino sm:text-6xl">
          Limpieza simple, atención cercana
        </h1>
        <p className="text-lg text-grafito">
          En Clean Home vendemos productos de limpieza para el hogar y los negocios: detergentes, papel higiénico,
          papel toalla, bolsas, artículos para baño y cocina, y más. Atendemos solo por WhatsApp y delivery, sin
          tienda física. Aceptamos Yape, transferencia o efectivo.
        </p>
      </div>

      <div className="mb-12 grid gap-x-8 gap-y-8 md:grid-cols-2">
        <div className="flex flex-col gap-2 border-t-2 border-marino pt-3">
          <h2 className="font-display text-3xl font-extrabold text-marino">Misión</h2>
          <p className="text-gris">
            Ofrecer productos de limpieza de calidad para el hogar y los negocios de nuestra comunidad, con una
            atención cercana y pedidos simples a través de WhatsApp.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-t-2 border-marino pt-3">
          <h2 className="font-display text-3xl font-extrabold text-marino">Visión</h2>
          <p className="text-gris">
            Ser la opción de confianza en productos de limpieza del barrio, reconocidos por la calidad de nuestros
            productos y la rapidez en la atención.
          </p>
        </div>
      </div>

      <h2 className="section-title mb-5">Nuestros valores</h2>
      <ul className="mb-14 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map(({ title, Icon, description }) => (
          <li key={title} className="flex flex-col gap-1.5">
            <Icon className="h-6 w-6 text-marino" />
            <h3 className="font-display text-2xl font-extrabold text-marino">{title}</h3>
            <p className="text-sm text-gris">{description}</p>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-linea pt-8">
        <div>
          <h2 className="section-title">¿Listo para tu pedido?</h2>
          <p className="mt-1 text-gris">Arma tu lista en el catálogo o escríbenos directo por WhatsApp.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/catalogo" className="btn-primary min-h-[48px] px-7">Ver catálogo</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-wa min-h-[48px] px-7">
            <WhatsAppGlyph className="h-5 w-5" /> Escribir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
