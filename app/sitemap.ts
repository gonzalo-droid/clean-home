import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/catalogo", "/packs", "/mayoristas", "/nosotros", "/contacto"];
  const now = new Date();
  return [
    ...routes.map((route) => ({ url: absoluteUrl(route), lastModified: now })),
    ...PRODUCTS.map((p) => ({ url: absoluteUrl(`/producto/${p.id}`), lastModified: now })),
  ];
}
