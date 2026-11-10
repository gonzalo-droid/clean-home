import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products";

const SITE_URL = "https://clean-home.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/catalogo", "/packs", "/mayoristas", "/nosotros", "/contacto"];
  const now = new Date();
  return [
    ...routes.map((route) => ({ url: `${SITE_URL}${route}`, lastModified: now })),
    ...PRODUCTS.map((p) => ({ url: `${SITE_URL}/producto/${p.id}`, lastModified: now })),
  ];
}
