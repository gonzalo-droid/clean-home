import type { Metadata } from "next";
import WholesaleForm from "./WholesaleForm";
import { BoxIcon, ChatIcon, TagIcon, TruckIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Mayoristas",
  description: "Productos de limpieza al por mayor para bodegas, oficinas, restaurantes y negocios. Cotiza por WhatsApp.",
};

const BENEFITS = [
  { Icon: TagIcon, title: "Precios por volumen", text: "Precios especiales para pedidos grandes." },
  { Icon: BoxIcon, title: "Presentaciones grandes", text: "Detergente de 15 kg, papel jumbo, paquetes x6 y x12." },
  { Icon: TruckIcon, title: "Envíos a todo el Perú", text: "Coordinamos la entrega según tu zona." },
  { Icon: ChatIcon, title: "Atención directa", text: "Una persona te atiende por WhatsApp, sin intermediarios." },
];

export default function MayoristasPage() {
  return (
    <div className="container-page py-8">
      <div className="mb-10 flex max-w-2xl flex-col gap-3">
        <h1 className="font-display text-4xl font-extrabold leading-[0.95] text-marino sm:text-6xl">
          Limpieza para tu negocio, al por mayor
        </h1>
        <p className="text-lg text-gris">
          Bodegas, oficinas, restaurantes, hoteles y colegios. Cuéntanos qué necesitas y te enviamos una cotización.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_440px]">
        <div className="flex flex-col gap-6">
          <h2 className="section-title">¿Por qué comprar con nosotros?</h2>
          <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
            {BENEFITS.map(({ Icon, title, text }) => (
              <li key={title} className="flex flex-col gap-1.5 border-t-2 border-marino pt-3">
                <Icon className="h-6 w-6 text-marino" />
                <p className="font-display text-2xl font-extrabold text-marino">{title}</p>
                <p className="text-sm text-gris">{text}</p>
              </li>
            ))}
          </ul>
        </div>
        <WholesaleForm />
      </div>
    </div>
  );
}
