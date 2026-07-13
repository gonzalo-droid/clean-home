import type { Metadata } from "next";
import { PRODUCTS } from "@/data/products";
import CatalogClient from "./CatalogClient";

export const metadata: Metadata = {
  title: "Catálogo de productos de limpieza",
  description:
    "Explora todo el catálogo: detergentes, papel higiénico, papel toalla, servilletas, limpieza de baño y cocina, bolsas, accesorios y lavavajilla.",
};

export default function CatalogoPage({
  searchParams,
}: {
  searchParams: { categoria?: string };
}) {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: PRODUCTS.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <CatalogClient initialCategory={searchParams.categoria} />
    </>
  );
}
