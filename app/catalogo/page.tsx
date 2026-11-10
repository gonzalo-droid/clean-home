import type { Metadata } from "next";
import { PRODUCTS } from "@/data/products";
import CatalogClient from "./CatalogClient";

export const metadata: Metadata = {
  title: "Catálogo de productos de limpieza",
  description:
    "Explora todo el catálogo: detergentes, papel higiénico, papel toalla, servilletas, limpieza de baño y cocina, bolsas, accesorios y lavavajilla.",
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; grupo?: string; q?: string }>;
}) {
  const { categoria, grupo, q } = await searchParams;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: PRODUCTS.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        url: `/producto/${product.id}`,
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
      <CatalogClient
        key={`${categoria ?? ""}|${grupo ?? ""}|${q ?? ""}`}
        initialCategory={categoria}
        initialGroup={grupo}
        initialQuery={q}
      />
    </>
  );
}
