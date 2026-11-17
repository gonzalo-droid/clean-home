import type { Metadata } from "next";
import { Suspense } from "react";
import { PRODUCTS } from "@/data/products";
import { absoluteUrl } from "@/lib/site";
import CatalogClient from "./CatalogClient";

export const metadata: Metadata = {
  title: "Catálogo de productos de limpieza",
  description:
    "Explora todo el catálogo: detergentes, papel higiénico, papel toalla, servilletas, limpieza de baño y cocina, bolsas, accesorios y lavavajilla.",
};

export default function CatalogoPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: PRODUCTS.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        url: absoluteUrl(`/producto/${product.id}`),
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "PEN",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      {/* El sitio es estático: la categoría, el grupo y la búsqueda se leen de la URL en el navegador. */}
      <Suspense fallback={<CatalogFallback />}>
        <CatalogClient />
      </Suspense>
    </>
  );
}

function CatalogFallback() {
  return (
    <div className="container-page py-6 md:py-8" aria-busy="true">
      <p className="mb-2 text-[13px] text-gris">Inicio / Catálogo</p>
      <h1 className="font-display text-4xl font-extrabold text-marino sm:text-5xl">Catálogo</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-white" />
        ))}
      </div>
    </div>
  );
}
