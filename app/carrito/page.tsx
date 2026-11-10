import type { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Tu pedido",
  description: "Revisa tu pedido de productos de limpieza y envíalo por WhatsApp.",
  robots: { index: false },
};

export default function CarritoPage() {
  return <CartClient />;
}
