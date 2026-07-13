import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos por WhatsApp al 976 509 570 para coordinar tu pedido de productos de limpieza.",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-2xl font-extrabold text-slate-800">Contacto</h1>
      <p className="mb-6 text-slate-600">
        Escríbenos por WhatsApp para consultas o para coordinar tu pedido.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">WhatsApp</p>
        <p className="mb-4 text-lg font-bold text-slate-800">976 509 570</p>

        <a
          href="https://wa.me/51976509570"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-600"
        >
          Escribir por WhatsApp
        </a>

        <div className="mt-6 border-t border-slate-100 pt-6 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Métodos de pago</p>
          <p>Yape · Transferencias · Efectivo</p>
        </div>
      </div>
    </div>
  );
}
