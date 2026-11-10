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
      <div className="mb-10 rounded-[28px] bg-marino p-6 text-white sm:p-10">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-limon">Mayoristas</span>
        <h1 className="mt-2 max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-5xl">
          Limpieza para tu negocio, al por mayor
        </h1>
        <p className="mt-3 max-w-xl text-menta">
          Bodegas, oficinas, restaurantes, hoteles y colegios. Cuéntanos qué necesitas y te enviamos una cotización.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_440px]">
        <div className="flex flex-col gap-6">
          <h2 className="section-title">¿Por qué comprar con nosotros?</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {BENEFITS.map(({ Icon, title, text }) => (
              <li key={title} className="card flex flex-col gap-2 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-menta text-agua">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="font-display text-lg font-bold text-marino">{title}</p>
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
