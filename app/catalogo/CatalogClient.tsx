"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BEST_SELLER_IDS,
  CATEGORIES,
  GROUPS,
  PRODUCTS,
  type Category,
  type GroupId,
} from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { SearchIcon, WhatsAppGlyph } from "@/components/icons";
import { WHATSAPP_URL } from "@/lib/whatsapp";

type Selection = { kind: "all" } | { kind: "group"; id: GroupId } | { kind: "category"; id: Category };
type Sort = "popular" | "price-asc" | "price-desc" | "name";
type PriceRange = "lt10" | "10to30" | "gt30";

const PRICE_RANGES: { id: PriceRange; label: string; test: (p: number) => boolean }[] = [
  { id: "lt10", label: "Hasta S/ 10", test: (p) => p <= 10 },
  { id: "10to30", label: "S/ 10 – S/ 30", test: (p) => p > 10 && p <= 30 },
  { id: "gt30", label: "Más de S/ 30", test: (p) => p > 30 },
];

function initialSelection(category?: string, group?: string): Selection {
  if (CATEGORIES.some((c) => c.id === category)) return { kind: "category", id: category as Category };
  if (GROUPS.some((g) => g.id === group)) return { kind: "group", id: group as GroupId };
  return { kind: "all" };
}

function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export default function CatalogClient({
  initialCategory,
  initialGroup,
  initialQuery,
}: {
  initialCategory?: string;
  initialGroup?: string;
  initialQuery?: string;
}) {
  const [selection, setSelection] = useState<Selection>(() => initialSelection(initialCategory, initialGroup));
  const [query, setQuery] = useState(initialQuery ?? "");
  const [sort, setSort] = useState<Sort>("popular");
  const [prices, setPrices] = useState<PriceRange[]>([]);

  const inSelection = useMemo(() => {
    if (selection.kind === "all") return PRODUCTS;
    if (selection.kind === "category") return PRODUCTS.filter((p) => p.category === selection.id);
    const group = GROUPS.find((g) => g.id === selection.id)!;
    return PRODUCTS.filter((p) => group.categories.includes(p.category));
  }, [selection]);

  const products = useMemo(() => {
    let result = inSelection;
    const q = normalize(query.trim());
    if (q) result = result.filter((p) => normalize(`${p.name} ${p.presentation}`).includes(q));
    if (prices.length) {
      const tests = PRICE_RANGES.filter((r) => prices.includes(r.id));
      result = result.filter((p) => tests.some((t) => t.test(p.price)));
    }
    const sorted = [...result];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
    if (sort === "popular") {
      const rank = (id: string) => {
        const i = BEST_SELLER_IDS.indexOf(id);
        return i === -1 ? Number.MAX_SAFE_INTEGER : i;
      };
      sorted.sort((a, b) => rank(a.id) - rank(b.id));
    }
    return sorted;
  }, [inSelection, query, prices, sort]);

  const title =
    selection.kind === "all"
      ? "Todo el catálogo"
      : selection.kind === "group"
        ? GROUPS.find((g) => g.id === selection.id)!.label
        : CATEGORIES.find((c) => c.id === selection.id)!.label;

  const isSel = (s: Selection) =>
    s.kind === selection.kind && ("id" in s ? "id" in selection && s.id === selection.id : true);

  const countFor = (cats: Category[]) => PRODUCTS.filter((p) => cats.includes(p.category)).length;

  const togglePrice = (id: PriceRange) =>
    setPrices((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const pill = (active: boolean) =>
    `flex min-h-[40px] w-full items-center justify-between rounded-xl px-3 text-left text-sm transition ${
      active ? "bg-menta font-bold text-marino" : "text-grafito hover:bg-espuma"
    }`;

  return (
    <div className="container-page py-8">
      <nav aria-label="Ruta" className="mb-2 text-[13px] text-gris">
        <Link href="/" className="hover:text-agua">Inicio</Link> / <span>Catálogo</span>
        {selection.kind !== "all" && <> / <span className="text-grafito">{title}</span></>}
      </nav>
      <h1 className="font-display text-3xl font-extrabold text-marino sm:text-4xl">{title}</h1>

      {/* Chips móviles */}
      <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
        <button type="button" onClick={() => setSelection({ kind: "all" })} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${selection.kind === "all" ? "bg-marino text-white" : "border border-linea bg-white"}`}>
          Todas
        </button>
        {GROUPS.map((g) => (
          <button key={g.id} type="button" onClick={() => setSelection({ kind: "group", id: g.id })} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${isSel({ kind: "group", id: g.id }) ? "bg-marino text-white" : "border border-linea bg-white"}`}>
            {g.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-start gap-6">
        <aside className="card hidden w-[270px] shrink-0 flex-col gap-5 p-5 lg:flex">
          <div className="flex flex-col gap-1">
            <p className="mb-1 font-display font-bold text-marino">Categorías</p>
            <button type="button" className={pill(selection.kind === "all")} onClick={() => setSelection({ kind: "all" })}>
              Todas <span className="text-gris">{PRODUCTS.length}</span>
            </button>
            {GROUPS.map((g) => (
              <div key={g.id} className="flex flex-col">
                <button type="button" className={pill(isSel({ kind: "group", id: g.id }))} onClick={() => setSelection({ kind: "group", id: g.id })}>
                  {g.label} <span className="text-gris">{countFor(g.categories)}</span>
                </button>
                {g.categories.length > 1 && (
                  <div className="ml-3 flex flex-col border-l border-linea pl-2">
                    {g.categories.map((cid) => (
                      <button key={cid} type="button" className={`${pill(isSel({ kind: "category", id: cid }))} min-h-[36px] text-[13px]`} onClick={() => setSelection({ kind: "category", id: cid })}>
                        {CATEGORIES.find((c) => c.id === cid)!.label}
                        <span className="text-gris">{countFor([cid])}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="h-px bg-linea" />
          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-2 font-display font-bold text-marino">Precio</legend>
            {PRICE_RANGES.map((r) => (
              <label key={r.id} className="flex min-h-[32px] items-center gap-2.5 text-sm">
                <input type="checkbox" checked={prices.includes(r.id)} onChange={() => togglePrice(r.id)} className="h-[18px] w-[18px] accent-agua" />
                {r.label}
              </label>
            ))}
          </fieldset>
          <div className="flex flex-col gap-2 rounded-2xl bg-marino p-4 text-white">
            <p className="font-display font-bold">¿No encuentras algo?</p>
            <p className="text-[13px] text-menta">Escríbenos y lo conseguimos.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-limon hover:underline">
              <WhatsAppGlyph className="h-4 w-4" /> Consultar por WhatsApp
            </a>
          </div>
        </aside>

        <section className="min-w-0 flex-1 basis-[560px]">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <label className="flex min-h-[44px] flex-1 basis-60 items-center gap-2 rounded-full border border-linea bg-white px-4 focus-within:border-agua focus-within:ring-2 focus-within:ring-agua/30">
              <SearchIcon className="h-[18px] w-[18px] text-gris" />
              <span className="sr-only">Filtrar productos</span>
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filtrar en esta lista…" className="min-w-0 flex-1 bg-transparent text-[15px] focus:outline-none" />
            </label>
            <label className="flex items-center gap-2 text-sm text-gris">
              Ordenar
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-[44px] rounded-xl border border-linea bg-white px-3 text-sm text-grafito">
                <option value="popular">Más pedidos</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
                <option value="name">Nombre A–Z</option>
              </select>
            </label>
          </div>
          <p className="mb-4 text-sm text-gris" aria-live="polite">
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </p>

          {products.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 p-10 text-center">
              <p className="font-display text-lg font-bold text-marino">No encontramos productos</p>
              <p className="text-sm text-gris">Prueba otra búsqueda o pregúntanos por WhatsApp.</p>
              <button type="button" onClick={() => { setQuery(""); setPrices([]); setSelection({ kind: "all" }); }} className="btn-outline">
                Ver todo el catálogo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  badge={BEST_SELLER_IDS.slice(0, 4).includes(product.id) ? "Más pedido" : undefined}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
