/**
 * Sitio 100 % estático para GitHub Pages: `next build` genera la carpeta `out/`.
 * En Pages el sitio vive en /clean-home, así que el workflow pasa ese prefijo en
 * PAGES_BASE_PATH. En local queda vacío y el sitio corre en la raíz.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
