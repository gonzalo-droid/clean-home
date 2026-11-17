/** URL pública del sitio (sin barra final). En el build de Pages la toma de configure-pages. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gonzalo-droid.github.io/clean-home";

/** Prefijo de rutas del sitio ("/clean-home" en Pages, "" en local). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Ruta de un archivo de /public con el prefijo del sitio, para usarla en <img> o next/image. */
export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}

/** URL absoluta de una ruta del sitio, para metadatos, sitemap y JSON-LD. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
