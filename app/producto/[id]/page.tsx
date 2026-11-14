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
        <Link href="/" className="hover:text-agua">Inicio</Link> /{" "}
        <Link href="/catalogo" className="hover:text-agua">Catálogo</Link>
        {group && (
          <>
            {" "}/ <Link href={`/catalogo?grupo=${group.id}`} className="hover:text-agua">{group.label}</Link>
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
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <h2 className="section-title">También te puede servir</h2>
            {group && (
              <Link href={`/catalogo?grupo=${group.id}`} className="text-[15px] font-semibold text-agua hover:text-agua-dark">
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
        <section className="mt-12 rounded-[28px] bg-limon p-5 sm:p-8">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-marino">Packs armados</span>
          <h2 className="mb-5 font-display text-2xl font-extrabold text-marino sm:text-3xl">
            Llévalo en un pack
          </h2>
          <Carousel label="Packs con este producto">
            {packs.map((pack) => (
              <li key={pack.id} className="flex w-[78%] shrink-0 snap-start flex-col gap-3 rounded-[20px] bg-white p-4 sm:w-[300px]">
                <div className="flex -space-x-3" aria-hidden="true">
                  {packLines(pack).slice(0, 5).map(({ product: item }) => (
                    <div key={item.id} className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-espuma">
                      <ProductImage src={item.image} alt="" sizes="48px" padding="p-1" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-display font-bold text-marino">{pack.name}</p>
                  <p className="text-[13px] text-gris">{pack.items.length} productos · {pack.description}</p>
                </div>
                <p className="mt-auto font-display text-xl font-extrabold text-agua">{formatPrice(packTotal(pack))}</p>
                <AddPackButton pack={pack} className="btn-primary w-full" />
              </li>
            ))}
          </Carousel>
        </section>
      )}
    </div>
  );
}
