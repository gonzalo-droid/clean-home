"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BEST_SELLER_IDS,
  CATEGORIES,
  GROUPS,
  PRODUCTS,
  type Category,
  type GroupId,
} from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { CloseIcon, WhatsAppGlyph } from "@/components/icons";
import { WHATSAPP_URL } from "@/lib/whatsapp";

type Selection = { kind: "all" } | { kind: "group"; id: GroupId } | { kind: "category"; id: Category };
type Sort = "popular" | "price-asc" | "price-desc" | "name";
type PriceRange = "lt10" | "10to30" | "gt30";

const PRICE_RANGES: { id: PriceRange; label: string; test: (p: number) => boolean }[] = [
  { id: "lt10", label: "Hasta S/ 10", test: (p) => p <= 10 },
  { id: "10to30", label: "S/ 10 – S/ 30", test: (p) => p > 10 && p <= 30 },
  { id: "gt30", label: "Más de S/ 30", test: (p) => p > 30 },
];

const SORTS: { id: Sort; label: string }[] = [
  { id: "popular", label: "Más pedidos" },
  { id: "price-asc", label: "Menor precio" },
  { id: "price-desc", label: "Mayor precio" },
  { id: "name", label: "Nombre A–Z" },
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
}: {
  initialCategory?: string;
  initialGroup?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // La búsqueda la escribe el buscador del header, que actualiza ?q=.
  const query = searchParams.get("q") ?? "";

  const [selection, setSelection] = useState<Selection>(() => initialSelection(initialCategory, initialGroup));
  const [sort, setSort] = useState<Sort>("popular");
  const [prices, setPrices] = useState<PriceRange[]>([]);
  const sheetRef = useRef<HTMLDialogElement>(null);

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

  // Filtros que viven en la hoja móvil: subcategoría, precio y orden distinto al predeterminado.
  const sheetFilterCount = (selection.kind === "category" ? 1 : 0) + prices.length + (sort !== "popular" ? 1 : 0);

  function resetAll() {
    setPrices([]);
    setSelection({ kind: "all" });
    setSort("popular");
    router.replace("/catalogo", { scroll: false });
  }

  const pill = (active: boolean) =>
    `flex min-h-[40px] w-full items-center justify-between rounded-lg px-3 text-left text-sm transition ${
      active ? "bg-marino font-bold text-white" : "text-grafito hover:bg-papel"
    }`;

  const chip = (active: boolean) =>
    `flex min-h-[40px] shrink-0 items-center rounded-full px-4 text-sm font-semibold ${
      active ? "bg-marino text-white" : "border border-linea bg-white text-grafito"
    }`;

  const categoryList = (
    <div className="flex flex-col gap-1">
      <button type="button" className={pill(selection.kind === "all")} onClick={() => setSelection({ kind: "all" })}>
        Todas <span className="tabular-nums opacity-70">{PRODUCTS.length}</span>
      </button>
      {GROUPS.map((g) => (
        <div key={g.id} className="flex flex-col gap-1">
          <button type="button" className={pill(isSel({ kind: "group", id: g.id }))} onClick={() => setSelection({ kind: "group", id: g.id })}>
            {g.label} <span className="tabular-nums opacity-70">{countFor(g.categories)}</span>
          </button>
          {g.categories.length > 1 && (
            <div className="ml-3 flex flex-col gap-1 border-l border-linea pl-2">
              {g.categories.map((cid) => (
                <button key={cid} type="button" className={`${pill(isSel({ kind: "category", id: cid }))} min-h-[36px] text-[13px]`} onClick={() => setSelection({ kind: "category", id: cid })}>
                  {CATEGORIES.find((c) => c.id === cid)!.label}
                  <span className="tabular-nums opacity-70">{countFor([cid])}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const priceFieldset = (idPrefix: string) => (
    <fieldset className="flex flex-col gap-1">
      <legend className="mb-2 font-display text-lg font-extrabold text-marino">Precio</legend>
      {PRICE_RANGES.map((r) => (
        <label key={r.id} htmlFor={`${idPrefix}-${r.id}`} className="flex min-h-[40px] items-center gap-2.5 text-sm">
          <input id={`${idPrefix}-${r.id}`} type="checkbox" checked={prices.includes(r.id)} onChange={() => togglePrice(r.id)} className="h-[18px] w-[18px] accent-marino" />
          {r.label}
        </label>
      ))}
    </fieldset>
  );

  return (
    <div className="container-page py-6 md:py-8">
      <nav aria-label="Ruta" className="mb-2 text-[13px] text-gris">
        <Link href="/" className="hover:text-marino hover:underline">Inicio</Link> / <span>Catálogo</span>
        {selection.kind !== "all" && <> / <span className="text-grafito">{title}</span></>}
      </nav>
      <h1 className="font-display text-4xl font-extrabold text-marino sm:text-5xl">{title}</h1>

      {/* Móvil: categorías en chips + hoja de filtros */}
      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => sheetRef.current?.showModal()}
          aria-haspopup="dialog"
          className={`${chip(sheetFilterCount > 0)} gap-1.5`}
        >
          Filtros{sheetFilterCount > 0 && <span className="tabular-nums">({sheetFilterCount})</span>}
        </button>
        <button type="button" onClick={() => setSelection({ kind: "all" })} className={chip(selection.kind === "all")}>
          Todas
        </button>
        {GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setSelection({ kind: "group", id: g.id })}
            className={chip(isSel({ kind: "group", id: g.id }) || (selection.kind === "category" && g.categories.includes(selection.id)))}
          >
            {g.label}
          </button>
        ))}
      </div>

      <dialog
        ref={sheetRef}
        aria-labelledby="filtros-titulo"
        onClick={(e) => {
          if (e.target === sheetRef.current) sheetRef.current?.close();
        }}
        className="m-0 mt-auto max-h-[85vh] w-full max-w-none rounded-t-2xl bg-white p-0 text-grafito backdrop:bg-marino/40 lg:hidden"
      >
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-center justify-between border-b border-linea px-4 py-3">
            <h2 id="filtros-titulo" className="font-display text-2xl font-extrabold text-marino">Filtros</h2>
            <button type="button" onClick={() => sheetRef.current?.close()} aria-label="Cerrar filtros" className="flex h-11 w-11 items-center justify-center rounded-full text-marino hover:bg-papel">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col gap-6 overflow-y-auto px-4 py-4">
            <div>
              <p className="mb-2 font-display text-lg font-extrabold text-marino">Categorías</p>
              {categoryList}
            </div>
            {priceFieldset("sheet-price")}
            <fieldset className="flex flex-col gap-1">
              <legend className="mb-2 font-display text-lg font-extrabold text-marino">Ordenar por</legend>
              {SORTS.map((s) => (
                <label key={s.id} htmlFor={`sheet-sort-${s.id}`} className="flex min-h-[40px] items-center gap-2.5 text-sm">
                  <input id={`sheet-sort-${s.id}`} type="radio" name="sheet-sort" checked={sort === s.id} onChange={() => setSort(s.id)} className="h-[18px] w-[18px] accent-marino" />
                  {s.label}
                </label>
              ))}
            </fieldset>
          </div>
          <div className="flex gap-3 border-t border-linea px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
            <button type="button" onClick={() => { setPrices([]); setSort("popular"); setSelection({ kind: "all" }); }} className="btn-outline flex-1">
              Limpiar
            </button>
            <button type="button" onClick={() => sheetRef.current?.close()} className="btn-primary flex-[2]">
              Ver {products.length} {products.length === 1 ? "producto" : "productos"}
            </button>
          </div>
        </div>
      </dialog>

      <div className="mt-6 flex flex-wrap items-start gap-8">
        <aside className="hidden w-[250px] shrink-0 flex-col gap-6 lg:sticky lg:top-24 lg:flex">
          <div>
            <p className="mb-2 font-display text-lg font-extrabold text-marino">Categorías</p>
            {categoryList}
          </div>
          {priceFieldset("aside-price")}
          <div className="flex flex-col gap-1.5 border-t border-linea pt-5">
            <p className="font-semibold text-marino">¿No encuentras algo?</p>
            <p className="text-[13px] text-gris">Escríbenos y lo conseguimos.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-2 text-sm font-bold text-wa hover:underline">
              <WhatsAppGlyph className="h-4 w-4" /> Consultar por WhatsApp
            </a>
          </div>
        </aside>

        <section className="min-w-0 flex-1 basis-[560px]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gris" aria-live="polite">
              <span className="tabular-nums">{products.length}</span> {products.length === 1 ? "producto" : "productos"}
              {query.trim() && <> para «{query.trim()}»</>}
            </p>
            <label htmlFor="catalog-sort" className="hidden items-center gap-2 text-sm text-gris lg:flex">
              Ordenar
              <select id="catalog-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-[44px] rounded-lg border border-linea bg-white px-3 text-sm text-grafito">
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-xl bg-white p-8">
              <p className="font-display text-2xl font-extrabold text-marino">No hay productos con esos filtros</p>
              <p className="text-sm text-gris">Quita algún filtro o búscalo con otra palabra. Si no lo tenemos, pregúntanos por WhatsApp y lo conseguimos.</p>
              <div className="mt-1 flex flex-wrap gap-3">
                <button type="button" onClick={resetAll} className="btn-primary">Ver todo el catálogo</button>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-wa">
                  <WhatsAppGlyph className="h-5 w-5" /> Preguntar por WhatsApp
                </a>
              </div>
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
