import type { CartLine } from "./cart";

export const WHATSAPP_NUMBER = "51976509570";

export interface OrderCustomer {
  name?: string;
  district?: string;
}

export function buildWhatsAppOrderUrl(items: CartLine[], customer: OrderCustomer = {}): string {
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
    ...customerLines(customer),
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildContactMessageUrl(name: string, phone: string, message: string): string {
  const text = [`Hola, soy ${name} (tel: ${phone}).`, "", message].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function customerLines({ name, district }: OrderCustomer): string[] {
  const lines: string[] = [];
  if (name?.trim()) lines.push(`Nombre: ${name.trim()}`);
  if (district?.trim()) lines.push(`Distrito / ciudad: ${district.trim()}`);
  return lines.length ? ["", ...lines] : [];
}

export function buildWhatsAppTextUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
