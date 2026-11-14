import type { Metadata } from "next";
import Link from "next/link";
import { PACKS, packLines, packTotal } from "@/data/products";
import AddPackButton from "@/components/AddPackButton";
import ProductImage from "@/components/ProductImage";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Packs de limpieza",
  description: "Combos armados de productos de limpieza para casa, baño, cocina y oficina. Agrégalos con un clic y pide por WhatsApp.",
};

export default function PacksPage() {
  return (
    <div className="container-page py-8">
      <div className="mb-8 flex max-w-2xl flex-col gap-3">
        <h1 className="font-display text-4xl font-extrabold leading-[0.95] text-marino sm:text-6xl">Packs armados</h1>
        <p className="text-lg text-gris">
          Los productos que más se piden juntos, en una sola lista. Agrega el pack y luego ajusta cantidades en tu pedido.
          El precio es la suma de sus productos.
        </p>
      </div>

      <div className="grid gap-x-6 gap-y-10 md:grid-cols-2">
        {PACKS.map((pack) => {
          const lines = packLines(pack);
          return (
            <article key={pack.id} id={pack.id} className="boleta flex scroll-mt-24 flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl font-extrabold leading-none text-marino">{pack.name}</h2>
                  <p className="mt-1 text-sm text-gris">{pack.description}</p>
                </div>
                <p className="shrink-0 font-display text-3xl font-extrabold text-marino">{formatPrice(packTotal(pack))}</p>
              </div>
              <ul className="flex flex-col divide-y divide-dashed divide-linea">
                {lines.map(({ product, quantity }) => (
                  <li key={product.id} className="flex items-center gap-3 py-2.5">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <ProductImage src={product.image} alt="" sizes="48px" padding="p-1" />
                    </div>
                    <Link href={`/producto/${product.id}`} className="min-w-0 flex-1 text-sm hover:text-marino hover:underline">
                      <span className="font-semibold">{product.name}</span>{" "}
                      <span className="text-gris">{product.presentation}</span>
                    </Link>
                    <span className="text-sm font-bold tabular-nums text-marino">×{quantity}</span>
                  </li>
                ))}
              </ul>
              <AddPackButton pack={pack} className="btn-primary mt-auto min-h-[48px] w-full text-base" />
            </article>
          );
        })}
      </div>
    </div>
  );
}
