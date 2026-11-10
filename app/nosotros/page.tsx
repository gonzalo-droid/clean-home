import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
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
      <div className="mb-10 rounded-[28px] bg-menta p-6 sm:p-10">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-agua">Nosotros</span>
        <h1 className="mt-2 max-w-2xl font-display text-3xl font-extrabold leading-tight text-marino sm:text-5xl">
          Limpieza simple, atención cercana
        </h1>
        <p className="mt-4 max-w-2xl text-grafito">
          En Clean Home ofrecemos una amplia variedad de productos de limpieza para el hogar y negocios:
          detergentes, papel higiénico, papel toalla, bolsas, artículos para baño y cocina, y mucho más.
          Atendemos solo por WhatsApp y delivery — no tenemos tienda física. Aceptamos Yape, transferencia o efectivo.
        </p>
      </div>

      <div className="mb-10 grid gap-4 md:grid-cols-2">
        <Reveal className="card p-6">
          <h2 className="mb-2 font-display text-xl font-bold text-marino">Misión</h2>
          <p className="text-gris">
            Ofrecer productos de limpieza de calidad para el hogar y los negocios de nuestra comunidad, con una
            atención cercana y pedidos simples a través de WhatsApp.
          </p>
        </Reveal>
        <Reveal delayMs={100} className="card p-6">
          <h2 className="mb-2 font-display text-xl font-bold text-marino">Visión</h2>
          <p className="text-gris">
            Ser la opción de confianza en productos de limpieza del barrio, reconocidos por la calidad de nuestros
            productos y la rapidez en la atención.
          </p>
        </Reveal>
      </div>

      <h2 className="section-title mb-5">Nuestros valores</h2>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map(({ title, Icon, description }, index) => (
          <Reveal key={title} delayMs={index * 100} className="card flex flex-col gap-2 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-menta text-agua">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="font-display text-lg font-bold text-marino">{title}</h3>
            <p className="text-sm text-gris">{description}</p>
          </Reveal>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 rounded-[28px] bg-marino p-8 text-center sm:p-10">
        <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">¿Listo para tu pedido?</h2>
        <p className="text-menta">Explora el catálogo o escríbenos directo por WhatsApp.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/catalogo" className="btn-lemon min-h-[48px] px-7">Ver catálogo</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn min-h-[48px] border-2 border-white px-7 text-white hover:bg-white hover:text-marino">
            <WhatsAppGlyph className="h-5 w-5" /> Pedir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
