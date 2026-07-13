import type { CartLine } from "./cart";

export const WHATSAPP_NUMBER = "51976509570";

export function buildWhatsAppOrderUrl(items: CartLine[]): string {
  const lines = items.map((item, index) => {
    const variant = item.variant ? ` (${item.variant})` : "";
    const subtotal = (item.price * item.quantity).toFixed(2);
    return `${index + 1}. ${item.name}${variant} - ${item.presentation} x${item.quantity} = S/${subtotal}`;
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const message = [
    "Hola, quiero hacer el siguiente pedido:",
    "",
    ...lines,
    "",
    `Total: S/${total}`,
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildContactMessageUrl(name: string, phone: string, message: string): string {
  const text = [`Hola, soy ${name} (tel: ${phone}).`, "", message].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
