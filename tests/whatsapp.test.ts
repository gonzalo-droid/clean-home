import { describe, it, expect } from "vitest";
import { buildWhatsAppOrderUrl, buildContactMessageUrl, WHATSAPP_NUMBER } from "../lib/whatsapp";
import type { CartLine } from "../lib/cart";

const items: CartLine[] = [
  {
    lineId: "a::default",
    productId: "a",
    name: "Detergente Ariel",
    presentation: "2 KG",
    price: 28,
    image: null,
    quantity: 2,
  },
  {
    lineId: "b::Lavanda",
    productId: "b",
    name: "Detergente Orion",
    presentation: "15 KG",
    variant: "Lavanda",
    price: 65,
    image: null,
    quantity: 1,
  },
];

describe("buildWhatsAppOrderUrl", () => {
  it("targets the configured WhatsApp number", () => {
    expect(WHATSAPP_NUMBER).toBe("51976509570");
    expect(buildWhatsAppOrderUrl(items)).toContain(`https://wa.me/${WHATSAPP_NUMBER}?text=`);
  });

  it("url-encodes the message and includes product names and quantities", () => {
    const url = buildWhatsAppOrderUrl(items);
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    expect(decoded).toContain("Detergente Ariel");
    expect(decoded).toContain("x2");
    expect(decoded).toContain("Lavanda");
  });

  it("includes the computed total", () => {
    const url = buildWhatsAppOrderUrl(items);
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    // 28 * 2 + 65 * 1 = 121
    expect(decoded).toContain("121.00");
  });
});

describe("buildContactMessageUrl", () => {
  it("targets the configured WhatsApp number", () => {
    const url = buildContactMessageUrl("Ana", "999888777", "Quisiera cotizar un pedido grande");
    expect(url).toContain(`https://wa.me/${WHATSAPP_NUMBER}?text=`);
  });

  it("url-encodes the message and includes name, phone, and message", () => {
    const url = buildContactMessageUrl("Ana", "999888777", "Quisiera cotizar un pedido grande");
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    expect(decoded).toContain("Ana");
    expect(decoded).toContain("999888777");
    expect(decoded).toContain("Quisiera cotizar un pedido grande");
  });
});
