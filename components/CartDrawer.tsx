"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, remove, total, clear } = useCart();

  if (!isOpen) return null;

  const whatsappUrl = buildWhatsAppOrderUrl(items);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={closeCart}
        className="absolute inset-0 bg-slate-900/40"
      />
      <aside className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <h2 className="text-lg font-bold text-slate-800">Tu pedido</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar"
            className="text-slate-500 hover:text-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">Aún no agregaste productos.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.lineId} className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        🧴
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.presentation}
                      {item.variant ? ` · ${item.variant}` : ""}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.lineId, item.quantity - 1)}
                        className="h-6 w-6 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100"
                        aria-label="Quitar uno"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.lineId, item.quantity + 1)}
                        className="h-6 w-6 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100"
                        aria-label="Agregar uno"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item.lineId)}
                        className="ml-2 text-xs text-red-500 hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    S/{(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-slate-200 px-4 py-4">
          <div className="mb-3 flex items-center justify-between text-base font-bold text-slate-800">
            <span>Total</span>
            <span>S/{total.toFixed(2)}</span>
          </div>
          <p className="mb-3 text-xs text-slate-500">
            El pedido se confirma por WhatsApp, no se procesa pago en la web.
          </p>
          {items.length > 0 ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => clear()}
              className="block w-full rounded-full bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-white hover:bg-emerald-600"
            >
              Enviar pedido por WhatsApp
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="block w-full cursor-not-allowed rounded-full bg-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-400"
            >
              Agrega productos primero
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
