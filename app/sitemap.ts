import type { MetadataRoute } from "next";

const SITE_URL = "https://clean-home.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/catalogo", "/nosotros", "/contacto"];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
