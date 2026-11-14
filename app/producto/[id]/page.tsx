import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PRODUCTS,
  getCategoryLabel,
  getGroupForCategory,
  getProduct,
  packLines,
  packTotal,
  packsWithProduct,
  productPageSuggestions,
} from "@/data/products";
import ProductActions from "@/components/ProductActions";
import AddPackButton from "@/components/AddPackButton";
import Carousel from "@/components/Carousel";
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
  const related = productPageSuggestions(product, 10);
  const packs = packsWithProduct(product.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image ?? undefined,
    description: `${product.name} - ${product.presentation}`,
    offers: { "@type": "Offer", price: product.price, priceCurrency: "PEN", availability: "https://schema.org/InStock" },
  };

  return (
    <div className="container-page pb-28 pt-6 md:py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Ruta" className="mb-4 text-[13px] text-gris">
        <Link href="/" className="hover:text-marino hover:underline">Inicio</Link> /{" "}
        <Link href="/catalogo" className="hover:text-marino hover:underline">Catálogo</Link>
        {group && (
          <>
            {" "}/ <Link href={`/catalogo?grupo=${group.id}`} className="hover:text-marino hover:underline">{group.label}</Link>
          </>
        )}
      </nav>

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-[4/3] max-h-[42vh] w-full overflow-hidden rounded-xl bg-white lg:aspect-square lg:max-h-none">
          <ProductImage src={product.image} alt={product.name} sizes="(max-width: 1024px) 100vw, 50vw" priority padding="p-6 lg:p-10" />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Link
              href={`/catalogo?categoria=${product.category}`}
              className="self-start text-[13px] font-semibold text-gris hover:text-marino hover:underline"
            >
              {getCategoryLabel(product.category)}
            </Link>
            <h1 className="font-display text-4xl font-extrabold leading-[0.95] text-marino sm:text-5xl">{product.name}</h1>
            <span className="self-start rounded-md bg-white px-2 py-0.5 text-sm font-bold text-marino">{product.presentation}</span>
          </div>
          <p className="font-display text-5xl font-extrabold tabular-nums text-marino">{formatPrice(product.price)}</p>

          <ProductActions product={product} />

          <ul className="grid gap-3 border-t border-linea pt-6 text-sm sm:grid-cols-3">
            <li className="flex items-center gap-2"><TruckIcon className="h-5 w-5 text-marino" /> Envíos a todo el Perú</li>
            <li className="flex items-center gap-2"><ChatIcon className="h-5 w-5 text-marino" /> Pedido por WhatsApp</li>
            <li className="flex items-center gap-2"><ShieldIcon className="h-5 w-5 text-marino" /> Marcas reconocidas</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <h2 className="section-title">También te puede servir</h2>
            {group && (
              <Link href={`/catalogo?grupo=${group.id}`} className="link text-[15px]">
                Ver más de {group.label}
              </Link>
            )}
          </div>
          <Carousel label="Productos relacionados">
            {related.map((p) => (
              <li key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[220px]">
                <ProductCard product={p} />
              </li>
            ))}
          </Carousel>
        </section>
      )}

      {packs.length > 0 && (
        <section className="mt-12">
          <h2 className="section-title">Llévalo en un pack</h2>
          <p className="mb-4 mt-1 text-gris">Listas que se piden juntas. Luego ajustas cantidades en tu pedido.</p>
          <Carousel label="Packs con este producto">
            {packs.map((pack) => (
              <li key={pack.id} className="flex w-[78%] shrink-0 snap-start flex-col gap-3 rounded-xl bg-white p-4 sm:w-[300px]">
                <div className="flex -space-x-3" aria-hidden="true">
                  {packLines(pack).slice(0, 5).map(({ product: item }) => (
                    <div key={item.id} className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-papel">
                      <ProductImage src={item.image} alt="" sizes="48px" padding="p-1" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-display text-xl font-extrabold text-marino">{pack.name}</p>
                  <p className="text-[13px] text-gris">{pack.items.length} productos. {pack.description}</p>
                </div>
                <p className="mt-auto font-display text-2xl font-extrabold tabular-nums text-marino">{formatPrice(packTotal(pack))}</p>
                <AddPackButton pack={pack} className="btn-primary w-full" />
              </li>
            ))}
          </Carousel>
        </section>
      )}
    </div>
  );
}
