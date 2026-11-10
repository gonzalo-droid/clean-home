import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { WHATSAPP_URL } from "@/lib/whatsapp";
import { WhatsAppGlyph } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos por WhatsApp al 976 509 570 para coordinar tu pedido de productos de limpieza.",
};

const FAQ = [
  {
    q: "¿Cómo hago un pedido?",
    a: "Agrega los productos al carrito y toca “Enviar pedido por WhatsApp”. Se abrirá un chat con tu lista ya escrita y ahí coordinamos todo.",
  },
  { q: "¿Qué métodos de pago aceptan?", a: "Yape, transferencia bancaria o efectivo." },
  { q: "¿Hacen envíos?", a: "Sí, hacemos envíos a todo el Perú. El costo y el tiempo de entrega se coordinan por WhatsApp según tu zona." },
  { q: "¿Tienen tienda física?", a: "No. Atendemos solo por WhatsApp y delivery." },
  { q: "¿Venden al por mayor?", a: "Sí. Visita la sección Mayoristas o escríbenos con los productos y cantidades que necesitas." },
  { q: "¿Cuál es el horario de atención?", a: "Lunes a sábado, de 9am a 7pm." },
];

export default function ContactoPage() {
  return (
    <div className="container-page py-8">
      <h1 className="font-display text-3xl font-extrabold text-marino sm:text-4xl">Contacto</h1>
      <p className="mb-8 mt-2 text-gris">Escríbenos por WhatsApp para consultas o para coordinar tu pedido.</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-6 rounded-[20px] bg-marino p-6 text-white">
          <div>
            <p className="text-sm text-menta">WhatsApp</p>
            <p className="font-display text-3xl font-extrabold">976 509 570</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-wa self-start min-h-[48px]">
            <WhatsAppGlyph className="h-5 w-5" /> Escribir por WhatsApp
          </a>
          <div className="border-t border-white/15 pt-5 text-sm">
            <p className="font-semibold">Horario de atención</p>
            <p className="text-menta">Lunes a sábado, 9am – 7pm</p>
            <p className="mt-1 text-xs text-menta/80">Atención solo por WhatsApp y delivery — sin tienda física.</p>
          </div>
          <div className="border-t border-white/15 pt-5 text-sm">
            <p className="font-semibold">Métodos de pago</p>
            <p className="text-menta">Yape · Transferencia · Efectivo</p>
          </div>
        </div>
        <ContactForm />
      </div>

      <section id="preguntas" className="mt-14 scroll-mt-24">
        <h2 className="section-title mb-5">Preguntas frecuentes</h2>
        <div className="flex flex-col gap-3">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="card group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-bold text-marino">
                {q}
                <span aria-hidden="true" className="text-xl text-agua transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-gris">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
