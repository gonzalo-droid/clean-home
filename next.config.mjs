/**
 * Sitio 100 % estático para GitHub Pages: `next build` genera la carpeta `out/`.
 * En Pages el sitio vive en /clean-home, así que el workflow pasa ese prefijo en
 * PAGES_BASE_PATH. En local queda vacío y el sitio corre en la raíz.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";
// URL pública completa que informa GitHub Pages (incluye el dominio propio si lo hay).
const siteUrl = (process.env.PAGES_BASE_URL ?? "https://gonzalo-droid.github.io/clean-home").replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_SITE_URL: siteUrl },
};

export default nextConfig;
