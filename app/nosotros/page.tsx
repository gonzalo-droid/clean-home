import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce Clean Home: venta de productos de limpieza con atención y pedidos por WhatsApp.",
};

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-2xl font-extrabold text-slate-800">Nosotros</h1>
      <p className="mb-4 text-slate-600">
        En Clean Home ofrecemos una amplia variedad de productos de limpieza para el hogar y
        negocios: detergentes, papel higiénico, papel toalla, bolsas, artículos de limpieza para
        baño y cocina, y mucho más.
      </p>
      <p className="mb-4 text-slate-600">
        Trabajamos con marcas reconocidas y coordinamos cada pedido directamente por WhatsApp,
        para que elijas tus productos, confirmes cantidades y precios, y definas la entrega sin
        complicaciones.
      </p>
      <p className="text-slate-600">Aceptamos pagos por Yape, transferencia o efectivo.</p>
    </div>
  );
}
