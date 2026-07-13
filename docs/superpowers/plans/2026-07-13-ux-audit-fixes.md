# UX/UI Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the 8 findings from the UX/UI audit: fix the WhatsApp float button blocking "Agregar" buttons, reclaim mobile vertical space on the catalog, add product search and a quantity stepper, add a closing CTA to Nosotros, disclose business hours/no-physical-store, improve icon accessibility, and polish the empty-cart state.

**Architecture:** All changes are additive UI/interaction changes to existing components — no new routes, no backend, no new npm dependencies. The quantity stepper reuses `add(item, quantity)`, which already accepts a quantity parameter.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS (existing stack).

## Global Constraints

- No new npm dependencies.
- Business facts to use verbatim, do not paraphrase into different claims: **"Atención solo por WhatsApp y delivery — sin tienda física"** and **"Lunes a sábado, 9am – 7pm"**.
- The WhatsApp float button (`components/WhatsAppFloatButton.tsx`) is global (mounted in `app/layout.tsx`), so its scroll-hide behavior applies on every page, not just Catálogo.
- The quantity stepper must not allow quantity below 1.
- Decorative emoji icons get `aria-hidden="true"` — the adjacent visible label text is what screen readers should announce, not the emoji.
- All 18 previously-existing Vitest tests must keep passing (no new automated tests in this plan — see spec's Testing section). `npx tsc --noEmit` and `npm run lint` must stay clean throughout. (`npm run build` may fail in network-sandboxed environments only on the unrelated Google Fonts fetch in `app/layout.tsx` — use `npx tsc --noEmit` as the network-free equivalent when that happens.)

---

### Task 1: WhatsApp float button — auto-hide during scroll

**Files:**
- Modify: `components/WhatsAppFloatButton.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: no interface change — same component, no props, mounted the same way in `app/layout.tsx` (not touched by this task).

- [ ] **Step 1: Replace `components/WhatsAppFloatButton.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function WhatsAppFloatButton() {
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleScroll() {
      setVisible(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setVisible(true), 250);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Link
      href="https://wa.me/51976509570?text=Hola%2C%20quiero%20consultar%20sobre%20productos%20de%20limpieza"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className={`fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-all duration-300 hover:bg-emerald-600 ${
        visible ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7">
        <path d="M16.001 2.667c-7.364 0-13.334 5.97-13.334 13.334 0 2.353.617 4.647 1.789 6.667L2.667 29.333l6.83-1.79a13.27 13.27 0 006.504 1.657h.006c7.364 0 13.334-5.97 13.334-13.333S23.365 2.667 16.001 2.667zm0 24.4a11.03 11.03 0 01-5.62-1.54l-.403-.24-4.053 1.062 1.082-3.951-.263-.406a11.05 11.05 0 01-1.7-5.897c0-6.108 4.97-11.078 11.079-11.078 2.96 0 5.742 1.153 7.834 3.246a11 11 0 013.244 7.834c0 6.108-4.97 11.078-11.1 11.078v-.108z" />
        <path d="M22.324 18.61c-.339-.17-2.006-.99-2.317-1.104-.311-.113-.538-.17-.764.17-.226.34-.876 1.104-1.074 1.33-.198.226-.396.255-.735.085-.339-.17-1.432-.528-2.727-1.68-1.008-.9-1.689-2.011-1.887-2.35-.198-.34-.021-.523.149-.692.153-.153.34-.396.51-.594.17-.198.226-.34.34-.566.113-.226.056-.424-.028-.594-.085-.17-.764-1.842-1.047-2.523-.276-.663-.556-.573-.764-.583l-.652-.011a1.25 1.25 0 00-.905.424c-.311.34-1.187 1.161-1.187 2.833s1.215 3.286 1.384 3.512c.17.226 2.392 3.652 5.797 5.121.81.35 1.442.559 1.935.716.813.259 1.553.222 2.138.135.652-.097 2.006-.82 2.289-1.612.283-.792.283-1.472.198-1.612-.085-.14-.311-.226-.65-.396z" />
      </svg>
    </Link>
  );
}
```

(Only the top-level `"use client"` directive, the `useEffect`/`useState`/`useRef` scroll-hide logic, and the `className` template literal were added/changed — the `href`, `aria-label`, and both `<svg>` paths are unchanged.)

- [ ] **Step 2: Verify manually in the browser**

Run: `npx tsc --noEmit` (must pass), then `npm run dev` and open `/catalogo` on mobile width (375px). Scroll down through the product grid.
Expected: the WhatsApp button fades out and shrinks slightly while actively scrolling, then fades back in ~250ms after you stop. While it's hidden, clicking where it would normally be reaches whatever is underneath (e.g. a product's "Agregar" button) instead of navigating to WhatsApp — you can verify this by using the browser's element inspector to confirm the link has `pointer-events: none` applied via the `pointer-events-none` class while `visible` is `false` (inspect the class list while scrolling, or trust the code: `visible` flips to `false` synchronously on every scroll event).

- [ ] **Step 3: Commit**

```bash
git add components/WhatsAppFloatButton.tsx
git commit -m "fix: hide WhatsApp float button during active scroll so it stops blocking Agregar buttons"
```

---

### Task 2: Category chips — horizontal scroll on mobile + icon accessibility

**Files:**
- Modify: `components/CategoryFilter.tsx`

**Interfaces:**
- Consumes: nothing new (same props as before).
- Produces: no interface change — only markup/class changes.

- [ ] **Step 1: Replace `components/CategoryFilter.tsx`**

```tsx
"use client";

import { CATEGORIES, type Category } from "@/data/products";

export default function CategoryFilter({
  active,
  onChange,
}: {
  active: Category | "todas";
  onChange: (value: Category | "todas") => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
      <button
        type="button"
        onClick={() => onChange("todas")}
        className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
          active === "todas"
            ? "bg-sky-500 text-white shadow-[0_4px_10px_-2px_rgba(2,132,199,0.5)]"
            : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50"
        }`}
      >
        Todas
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            active === cat.id
              ? "bg-sky-500 text-white shadow-[0_4px_10px_-2px_rgba(2,132,199,0.5)]"
              : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50"
          }`}
        >
          <span className="mr-1" aria-hidden="true">
            {cat.icon}
          </span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}
```

(Wrapper `className` changed to add horizontal-scroll-on-mobile/wrap-on-`sm:`; both buttons gained `shrink-0` so they don't compress in the scroll container; the icon `<span>` gained `aria-hidden="true"`.)

- [ ] **Step 2: Verify manually in the browser**

Run: `npx tsc --noEmit` (must pass), then `npm run dev` and open `/catalogo` on mobile width (375px).
Expected: the category chips are now a single horizontally-scrollable row (swipe left/right to see all 9), and the first product row is visible much higher on the screen without scrolling past multiple lines of chips. On desktop width (1280px), chips still wrap onto 2 lines as before (no regression).

- [ ] **Step 3: Commit**

```bash
git add components/CategoryFilter.tsx
git commit -m "feat: scroll category chips horizontally on mobile, hide icons from screen readers"
```

---

### Task 3: Product search on the Catálogo page

**Files:**
- Modify: `app/catalogo/CatalogClient.tsx`

**Interfaces:**
- Consumes: `PRODUCTS` from `data/products.ts` (already imported).
- Produces: no interface change — internal component state only.

- [ ] **Step 1: Replace `app/catalogo/CatalogClient.tsx`**

```tsx
"use client";

import { useMemo, useState } from "react";
import { PRODUCTS, CATEGORIES, type Category } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";

function isCategory(value: string | undefined): value is Category {
  return CATEGORIES.some((c) => c.id === value);
}

export default function CatalogClient({ initialCategory }: { initialCategory?: string }) {
  const [active, setActive] = useState<Category | "todas">(
    isCategory(initialCategory) ? initialCategory : "todas"
  );
  const [query, setQuery] = useState("");

  const products = useMemo(() => {
    let result = active === "todas" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);
    const trimmedQuery = query.trim().toLowerCase();
    if (trimmedQuery) {
      result = result.filter((p) => p.name.toLowerCase().includes(trimmedQuery));
    }
    return result;
  }, [active, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-extrabold text-slate-800">Catálogo de productos</h1>
      <p className="mb-6 text-sm text-slate-600">
        Agrega los productos que necesitas y envía tu pedido por WhatsApp.
      </p>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar producto..."
        aria-label="Buscar producto"
        className="mb-4 w-full rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-800 transition-all duration-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 sm:max-w-xs"
      />

      <div className="mb-8">
        <CategoryFilter active={active} onChange={setActive} />
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-slate-500">No encontramos productos con ese nombre.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify manually in the browser**

Run: `npx tsc --noEmit` (must pass), then `npm run dev` and open `/catalogo`.
Expected: typing "orion" in the search box shows only Orion products; typing a category filter and then a search term combines both filters; typing something that matches nothing (e.g. "xyz123") shows "No encontramos productos con ese nombre." instead of a blank grid; clearing the search box restores the full filtered list.

- [ ] **Step 3: Commit**

```bash
git add app/catalogo/CatalogClient.tsx
git commit -m "feat: add product search to the catalog page"
```

---

### Task 4: Quantity stepper on ProductCard

**Files:**
- Modify: `components/ProductCard.tsx`

**Interfaces:**
- Consumes: `add(item, quantity?)` from `useCart()` (`lib/cart-context.tsx`, unchanged signature).
- Produces: no interface change — internal component state only.

- [ ] **Step 1: Replace `components/ProductCard.tsx`**

```tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { makeLineId } from "@/lib/cart";

export default function ProductCard({ product }: { product: Product }) {
  const { add, showToast } = useCart();
  const [variant, setVariant] = useState(product.variants?.[0]);
  const [quantity, setQuantity] = useState(1);

  function handleAdd() {
    add(
      {
        lineId: makeLineId(product.id, variant),
        productId: product.id,
        name: product.name,
        presentation: product.presentation,
        variant,
        price: product.price,
        image: product.image,
      },
      quantity
    );
    showToast("Agregado al carrito");
    setQuantity(1);
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_12px_-4px_rgba(2,132,199,0.15)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_30px_-10px_rgba(2,132,199,0.35)]">
      <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/60">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-3"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-slate-300">
            🧴
          </div>
        )}
      </div>

      <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-slate-800">{product.name}</p>
      <p className="text-xs text-slate-500">{product.presentation}</p>

      {product.variants && (
        <select
          value={variant}
          onChange={(e) => setVariant(e.target.value)}
          className="mt-2 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700"
        >
          {product.variants.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      )}

      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="h-6 w-6 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100"
          aria-label="Restar cantidad"
        >
          −
        </button>
        <span className="w-5 text-center text-xs font-semibold text-slate-700">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="h-6 w-6 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100"
          aria-label="Sumar cantidad"
        >
          +
        </button>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
        <span className="text-base font-bold text-sky-600">S/{product.price.toFixed(2)}</span>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-full bg-sky-500 px-3 py-1.5 text-xs font-bold text-white shadow-[0_4px_10px_-2px_rgba(2,132,199,0.5)] transition hover:bg-sky-600"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
```

(Added `quantity` state, the stepper `<div>` between the variant `<select>` and the price/button row, and `handleAdd` now passes `quantity` to `add()` and resets it to 1 afterward. Everything else — image, name, presentation, variant select, price/button row markup — is unchanged.)

- [ ] **Step 2: Verify manually in the browser**

Run: `npx tsc --noEmit` (must pass), then `npm run dev` and open `/catalogo`. On any product, click "+" three times (quantity shows 4), then "Agregar", then open the cart via the header icon.
Expected: the cart shows that product with quantity 4 (not 1). Add the same product again after the drawer closes — quantity stepper on the card is back to 1 (reset after adding). The "−" button never goes below 1. Cards in a mixed row (with/without variant select) still have aligned "Agregar" buttons (this must not regress from the earlier fix — the stepper row is present on every card unconditionally, so row heights stay consistent).

- [ ] **Step 3: Commit**

```bash
git add components/ProductCard.tsx
git commit -m "feat: add quantity stepper to product cards"
```

---

### Task 5: Nosotros — closing CTA + icon accessibility

**Files:**
- Modify: `app/nosotros/page.tsx`

**Interfaces:**
- Consumes: `Reveal` from `components/Reveal.tsx` (already imported in this file).
- Produces: no interface change.

- [ ] **Step 1: Replace `app/nosotros/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce Clean Home: venta de productos de limpieza con atención y pedidos por WhatsApp.",
};

const VALUES = [
  {
    title: "Calidad",
    icon: "✅",
    description: "Trabajamos con marcas reconocidas en cada categoría de producto.",
  },
  {
    title: "Confianza",
    icon: "🤝",
    description: "Precios claros y sin sorpresas, confirmados antes de cada pedido.",
  },
  {
    title: "Atención cercana",
    icon: "💬",
    description: "Coordinamos cada pedido directo por WhatsApp, de persona a persona.",
  },
  {
    title: "Cumplimiento",
    icon: "⏱️",
    description: "Entregas puntuales y compromiso con lo acordado.",
  },
];

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-4 text-2xl font-extrabold text-slate-800">Nosotros</h1>
      <Reveal>
        <p className="mb-10 text-slate-600">
          En Clean Home ofrecemos una amplia variedad de productos de limpieza para el hogar y
          negocios: detergentes, papel higiénico, papel toalla, bolsas, artículos de limpieza para
          baño y cocina, y mucho más. Aceptamos pagos por Yape, transferencia o efectivo.
        </p>
      </Reveal>

      <Reveal className="mb-10 rounded-3xl bg-sky-50 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-sky-600">Misión</h2>
            <p className="text-sm text-slate-600">
              Ofrecer productos de limpieza de calidad para el hogar y los negocios de nuestra
              comunidad, con una atención cercana y pedidos simples a través de WhatsApp.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-sky-600">Visión</h2>
            <p className="text-sm text-slate-600">
              Ser la opción de confianza en productos de limpieza del barrio, reconocidos por la
              calidad de nuestros productos y la rapidez en la atención.
            </p>
          </div>
        </div>
      </Reveal>

      <h2 className="mb-4 text-lg font-bold text-slate-800">Nuestros valores</h2>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value, index) => (
          <Reveal key={value.title} delayMs={index * 100}>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <span className="mb-2 block text-2xl" aria-hidden="true">
                {value.icon}
              </span>
              <h3 className="mb-1 text-sm font-bold text-sky-600">{value.title}</h3>
              <p className="text-xs text-slate-600">{value.description}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="rounded-3xl bg-sky-50 p-8 text-center">
        <h2 className="mb-2 text-lg font-bold text-slate-800">¿Listo para tu pedido?</h2>
        <p className="mb-4 text-sm text-slate-600">
          Explora el catálogo o escríbenos directo por WhatsApp.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/catalogo"
            className="rounded-full bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-[0_4px_10px_-2px_rgba(2,132,199,0.5)] transition hover:-translate-y-0.5 hover:bg-sky-600"
          >
            Ver catálogo
          </Link>
          <a
            href="https://wa.me/51976509570"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-emerald-500 px-6 py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-50"
          >
            Pedir por WhatsApp
          </a>
        </div>
      </Reveal>
    </div>
  );
}
```

(Added `Link` import, `aria-hidden="true"` on the Valores icon `<span>`, a `mb-10` on the Valores grid so it doesn't sit flush against the new closing section, and the entire new closing `<Reveal>` block at the end.)

- [ ] **Step 2: Verify manually in the browser**

Run: `npx tsc --noEmit` (must pass), then `npm run dev` and open `/nosotros`. Scroll to the bottom.
Expected: after the Valores cards, a new light-blue rounded section appears with "¿Listo para tu pedido?" and two buttons — "Ver catálogo" (navigates to `/catalogo`) and "Pedir por WhatsApp" (opens `wa.me` in a new tab) — both styled like the Home hero's buttons, and it fades in like the rest of the page's sections.

- [ ] **Step 3: Commit**

```bash
git add app/nosotros/page.tsx
git commit -m "feat: add closing CTA to Nosotros and hide value icons from screen readers"
```

---

### Task 6: Business hours and no-physical-store disclosure

**Files:**
- Modify: `app/contacto/page.tsx`
- Modify: `components/Footer.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: no interface change.

- [ ] **Step 1: Add the hours/modality block to `app/contacto/page.tsx`**

In `app/contacto/page.tsx`, inside the WhatsApp card `<div>` (the one wrapped in the first `<Reveal>`), add a new block right after the "Escribir por WhatsApp" `<a>` and before the existing "Métodos de pago" block:

```tsx
            <div className="mt-6 border-t border-slate-100 pt-6 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Horario de atención</p>
              <p>Lunes a sábado, 9am – 7pm</p>
              <p className="mt-1 text-xs text-slate-500">
                Atención solo por WhatsApp y delivery — sin tienda física.
              </p>
            </div>
```

The full WhatsApp card `<div>` becomes:

```tsx
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">WhatsApp</p>
            <p className="mb-4 text-lg font-bold text-slate-800">976 509 570</p>

            <a
              href="https://wa.me/51976509570"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-600"
            >
              Escribir por WhatsApp
            </a>

            <div className="mt-6 border-t border-slate-100 pt-6 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Horario de atención</p>
              <p>Lunes a sábado, 9am – 7pm</p>
              <p className="mt-1 text-xs text-slate-500">
                Atención solo por WhatsApp y delivery — sin tienda física.
              </p>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Métodos de pago</p>
              <p>Yape · Transferencias · Efectivo</p>
            </div>
          </div>
```

Nothing else in `app/contacto/page.tsx` changes.

- [ ] **Step 2: Add the hours line to `components/Footer.tsx`**

In `components/Footer.tsx`, inside the "Contacto" column, add one line after "Pedidos coordinados por WhatsApp":

```tsx
          <div>
            <p className="font-semibold text-slate-800">Contacto</p>
            <p className="mt-2">WhatsApp: 976 509 570</p>
            <p>Pedidos coordinados por WhatsApp</p>
            <p className="mt-2 text-xs text-slate-500">Lunes a sábado, 9am – 7pm</p>
          </div>
```

(This replaces the existing "Contacto" column `<div>` — the "Clean Home", "Métodos de pago", and "Síguenos" columns are unchanged.)

- [ ] **Step 3: Verify manually in the browser**

Run: `npx tsc --noEmit` (must pass), then `npm run dev` and open `/contacto`.
Expected: the WhatsApp card now shows "Horario de atención — Lunes a sábado, 9am – 7pm" and "Atención solo por WhatsApp y delivery — sin tienda física." between the WhatsApp button and the payment-methods block. The footer (visible on any page) shows "Lunes a sábado, 9am – 7pm" under the WhatsApp contact info.

- [ ] **Step 4: Commit**

```bash
git add app/contacto/page.tsx components/Footer.tsx
git commit -m "feat: disclose business hours and no-physical-store on Contacto and footer"
```

---

### Task 7: Home page — hide decorative icons from screen readers

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: no interface change — only `aria-hidden` attributes added.

- [ ] **Step 1: Add `aria-hidden="true"` to the trust-banner icons**

In `app/page.tsx`, inside the trust-banner section's `TRUST_HIGHLIGHTS.map(...)`, change:

```tsx
              <span className="text-3xl">{item.icon}</span>
```

to:

```tsx
              <span className="text-3xl" aria-hidden="true">
                {item.icon}
              </span>
```

- [ ] **Step 2: Add `aria-hidden="true"` to the category tile icons**

In the same file, inside the "Categorías" section's `CATEGORIES.map(...)`, change:

```tsx
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-xl">
                  {cat.icon}
                </span>
```

to:

```tsx
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-xl"
                  aria-hidden="true"
                >
                  {cat.icon}
                </span>
```

Nothing else in `app/page.tsx` changes.

- [ ] **Step 3: Verify manually in the browser**

Run: `npx tsc --noEmit` (must pass), then `npm run dev` and open `/`. Inspect the DOM (browser dev tools) on both the trust-banner icons and the category tile icons.
Expected: both `<span>` elements carry `aria-hidden="true"`; the page still looks visually identical to before (the attribute has no visual effect).

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: hide decorative home page icons from screen readers"
```

---

### Task 8: Empty cart state icon

**Files:**
- Modify: `components/CartDrawer.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: no interface change.

- [ ] **Step 1: Update the empty-cart branch in `components/CartDrawer.tsx`**

Change:

```tsx
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">Aún no agregaste productos.</p>
          ) : (
```

to:

```tsx
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className="mb-3 text-4xl" aria-hidden="true">
                🛒
              </span>
              <p className="text-sm text-slate-500">Aún no agregaste productos.</p>
            </div>
          ) : (
```

Nothing else in `components/CartDrawer.tsx` changes.

- [ ] **Step 2: Verify manually in the browser**

Run: `npx tsc --noEmit` (must pass), then `npm run dev`, open any page, and click the header cart icon with an empty cart (clear `localStorage` or use a private window if the cart already has items from earlier testing).
Expected: the empty state now shows a 🛒 icon above "Aún no agregaste productos.", centered.

- [ ] **Step 3: Commit**

```bash
git add components/CartDrawer.tsx
git commit -m "feat: add icon to empty cart state"
```

---

### Task 9: Final verification pass

**Files:** none (verification only).

**Interfaces:** none.

- [ ] **Step 1: Run the full automated test suite**

Run: `npm test`
Expected: all suites pass — 18/18 (no new tests in this plan; confirms nothing regressed, especially `lib/cart.ts`'s `addItem` which the quantity stepper now calls with `quantity > 1`).

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: 0 errors (the pre-existing `postcss.config.mjs` anonymous-default-export warning is expected).

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: `Compiled successfully`, all routes listed, `/catalogo` still dynamic (`ƒ`), everything else static (`○`). (If this fails only on a Google Fonts network fetch in `app/layout.tsx`, that's a known sandbox limitation — rely on Step 2's `tsc --noEmit` instead and note it in the report.)

- [ ] **Step 4: Manual end-to-end walkthrough in the browser**

Run: `npm run dev`. In the browser (desktop 1280px, then mobile 375px):
1. `/catalogo` — scroll through the grid on mobile; confirm the WhatsApp float button fades out during scroll and never blocks an "Agregar" tap; confirm category chips scroll horizontally on mobile without pushing products far down; type in the search box and confirm it filters (combined with a category filter too); confirm the "sin resultados" message appears for a nonsense query.
2. On any product with a variant, use the quantity stepper to set 3, add it, and confirm the cart drawer shows quantity 3 for that line (not 1) with the correct variant.
3. `/nosotros` — scroll to the bottom; confirm the new "¿Listo para tu pedido?" section appears and both buttons work.
4. `/contacto` — confirm the hours/no-physical-store text appears in the WhatsApp card. Check the footer on any page for the hours line.
5. Empty the cart (remove all items) and open the drawer — confirm the 🛒 icon appears in the empty state.
6. Confirm nothing from earlier plans regressed: hero/trust banner/category icons on Home, scroll-reveal animations on Nosotros/Contacto, the add-to-cart toast, and the WhatsApp checkout message format.

Expected: every step behaves as described, no console errors, no visual overlap or overflow on mobile.

- [ ] **Step 5: Final commit (if any fixes were made during verification)**

```bash
git add -A
git commit -m "chore: final verification fixes for UX audit changes"
```

(Skip this step if verification found nothing to fix.)
