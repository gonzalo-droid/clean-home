import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PRODUCTS,
  getCategoryLabel,
  getGroupForCategory,
  getProduct,
  relatedProducts,
} from "@/data/products";
import ProductActions from "@/components/ProductActions";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import { formatPrice } from "@/lib/format";
import { ChatIcon, ShieldIcon, TruckIcon } from "@/components/icons";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return {};
  return {
    title: `${product.name} ${product.presentation}`,
    description: `${product.name} (${product.presentation}) a ${formatPrice(product.price)}. Pídelo por WhatsApp con envío a todo el Perú.`,
    openGraph: product.image ? { images: [product.image] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const group = getGroupForCategory(product.category);
  const related = relatedProducts(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image ?? undefined,
    description: `${product.name} - ${product.presentation}`,
    offers: { "@type": "Offer", price: product.price, priceCurrency: "PEN", availability: "https://schema.org/InStock" },
  };

  return (
    <div className="container-page py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Ruta" className="mb-5 text-[13px] text-gris">
        <Link href="/" className="hover:text-agua">Inicio</Link> /{" "}
        <Link href="/catalogo" className="hover:text-agua">Catálogo</Link>
        {group && (
          <>
            {" "}/ <Link href={`/catalogo?grupo=${group.id}`} className="hover:text-agua">{group.label}</Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square w-full overflow-hidden rounded-[28px] bg-white">
          <ProductImage src={product.image} alt={product.name} sizes="(max-width: 1024px) 100vw, 50vw" priority padding="p-10" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Link
              href={`/catalogo?categoria=${product.category}`}
              className="self-start rounded-full bg-menta px-3 py-1 text-xs font-semibold text-marino hover:underline"
            >
              {getCategoryLabel(product.category)}
            </Link>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-marino sm:text-4xl">{product.name}</h1>
            <p className="text-gris">{product.presentation}</p>
          </div>
          <p className="font-display text-4xl font-extrabold text-marino">{formatPrice(product.price)}</p>

          <ProductActions product={product} />

          <ul className="grid gap-3 border-t border-linea pt-6 text-sm sm:grid-cols-3">
            <li className="flex items-center gap-2"><TruckIcon className="h-5 w-5 text-agua" /> Envíos a todo el Perú</li>
            <li className="flex items-center gap-2"><ChatIcon className="h-5 w-5 text-agua" /> Pedido por WhatsApp</li>
            <li className="flex items-center gap-2"><ShieldIcon className="h-5 w-5 text-agua" /> Marcas reconocidas</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="section-title mb-5">También te puede servir</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
