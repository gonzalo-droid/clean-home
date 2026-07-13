# Visual Refresh, Nosotros Content, and Contact Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the Home/Catálogo visual language to a minimalist white-and-blue style with subtle hover animations, add Visión/Misión/Valores content to Nosotros, and add a no-backend contact form to Contacto.

**Architecture:** Pure CSS/Tailwind visual changes to existing components (`ProductCard`, `CategoryFilter`, home hero/category tiles) plus one new pure function (`buildContactMessageUrl` in `lib/whatsapp.ts`) and one new client component (`ContactForm`) that reuses the existing `wa.me` link pattern already used by the cart checkout.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS (existing stack, no new dependencies), Vitest for the new pure function.

## Global Constraints

- WhatsApp order number is `51976509570`, already exported as `WHATSAPP_NUMBER` from `lib/whatsapp.ts` — reuse it, never hardcode the digits again.
- Contact form has exactly 3 fields (Nombre, Teléfono, Mensaje), all HTML5 `required`, no backend. On submit it builds a `wa.me` URL and opens it via `window.open(url, "_blank", "noopener,noreferrer")`. It does **not** clear its fields after submit (unlike the cart, which does clear) — this lets the user retry if the WhatsApp tab was popup-blocked.
- Visual palette stays within white / `sky-*` / `slate-*`. `emerald-*` is reserved for WhatsApp-specific actions (existing site-wide convention in `Footer`, `CartDrawer`, `WhatsAppFloatButton`) — do not introduce emerald in new elements, and do not remove it from existing WhatsApp buttons.
- Animations are CSS/Tailwind only: `transition`, `hover:-translate-y-*`, `hover:shadow-*`. No animation libraries, no scroll-triggered effects.
- Out of scope: `components/Header.tsx`, `components/Footer.tsx`, `components/CartDrawer.tsx`, `data/products.ts`, `lib/cart.ts`, `lib/cart-context.tsx` — none of these are touched by this plan.
- All 15 existing Vitest tests must keep passing. `npm run build` and `npm run lint` must stay clean (0 errors) throughout.

---

### Task 1: `buildContactMessageUrl` in `lib/whatsapp.ts`

**Files:**
- Modify: `lib/whatsapp.ts`
- Modify: `tests/whatsapp.test.ts`

**Interfaces:**
- Consumes: `WHATSAPP_NUMBER` (already exported in this same file).
- Produces: `buildContactMessageUrl(name: string, phone: string, message: string): string` — consumed by Task 2 (`components/ContactForm.tsx`).

- [ ] **Step 1: Write the failing test**

Add this `describe` block to the end of `tests/whatsapp.test.ts` (keep the existing `buildWhatsAppOrderUrl` describe block above it untouched), and add `buildContactMessageUrl` to the existing import line at the top of the file:

```ts
import { buildWhatsAppOrderUrl, buildContactMessageUrl, WHATSAPP_NUMBER } from "../lib/whatsapp";
```

```ts
describe("buildContactMessageUrl", () => {
  it("targets the configured WhatsApp number", () => {
    const url = buildContactMessageUrl("Ana", "999888777", "Quisiera cotizar un pedido grande");
    expect(url).toContain(`https://wa.me/${WHATSAPP_NUMBER}?text=`);
  });

  it("url-encodes the message and includes name, phone, and message", () => {
    const url = buildContactMessageUrl("Ana", "999888777", "Quisiera cotizar un pedido grande");
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    expect(decoded).toContain("Ana");
    expect(decoded).toContain("999888777");
    expect(decoded).toContain("Quisiera cotizar un pedido grande");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `buildContactMessageUrl` is not exported from `../lib/whatsapp`.

- [ ] **Step 3: Add `buildContactMessageUrl` to `lib/whatsapp.ts`**

Append this function to the end of `lib/whatsapp.ts` (after the existing `buildWhatsAppOrderUrl` function, keep everything else in the file unchanged):

```ts
export function buildContactMessageUrl(name: string, phone: string, message: string): string {
  const text = [`Hola, soy ${name} (tel: ${phone}).`, "", message].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS — all whatsapp tests green (5 total: 3 existing `buildWhatsAppOrderUrl` + 2 new `buildContactMessageUrl`), 17/17 across the whole suite.

- [ ] **Step 5: Commit**

```bash
git add lib/whatsapp.ts tests/whatsapp.test.ts
git commit -m "feat: add buildContactMessageUrl for the contact form"
```

---

### Task 2: `ContactForm` component

**Files:**
- Create: `components/ContactForm.tsx`

**Interfaces:**
- Consumes: `buildContactMessageUrl` from `lib/whatsapp.ts` (Task 1).
- Produces: `<ContactForm />` — a self-contained client component with no props, consumed by Task 3 (`app/contacto/page.tsx`).

- [ ] **Step 1: Write `components/ContactForm.tsx`**

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { buildContactMessageUrl } from "@/lib/whatsapp";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = buildContactMessageUrl(name, phone, message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-semibold text-slate-700">
          Nombre
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
        />
      </div>

      <div>
        <label htmlFor="contact-phone" className="mb-1 block text-sm font-semibold text-slate-700">
          Teléfono
        </label>
        <input
          id="contact-phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-semibold text-slate-700">
          Mensaje
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-[0_4px_10px_-2px_rgba(2,132,199,0.5)] transition hover:-translate-y-0.5 hover:bg-sky-600"
      >
        Enviar por WhatsApp
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: no errors (this component isn't rendered by any page yet, but must compile standalone).

- [ ] **Step 3: Commit**

```bash
git add components/ContactForm.tsx
git commit -m "feat: add ContactForm component"
```

---

### Task 3: Wire `ContactForm` into the Contacto page

**Files:**
- Modify: `app/contacto/page.tsx` (full rewrite of the body, `metadata` export unchanged)

**Interfaces:**
- Consumes: `ContactForm` from `components/ContactForm.tsx` (Task 2).
- Produces: the updated `/contacto` route.

- [ ] **Step 1: Replace `app/contacto/page.tsx`**

```tsx
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos por WhatsApp al 976 509 570 para coordinar tu pedido de productos de limpieza.",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-4 text-2xl font-extrabold text-slate-800">Contacto</h1>
      <p className="mb-8 text-slate-600">
        Escríbenos por WhatsApp para consultas o para coordinar tu pedido.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
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
            <p className="font-semibold text-slate-800">Métodos de pago</p>
            <p>Yape · Transferencias · Efectivo</p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify manually in the browser**

Run: `npm run build` (must succeed), then `npm run dev` and open `/contacto`.
Expected: two columns on desktop (WhatsApp card left, form right), stacked on mobile (375px). Fill Nombre/Teléfono/Mensaje and submit — a new tab opens to `https://wa.me/51976509570?text=...` containing the name, phone, and message. Submitting with any field empty is blocked by the browser (native `required` validation), no page crash. Fields are NOT cleared after a successful submit.

- [ ] **Step 3: Commit**

```bash
git add app/contacto/page.tsx
git commit -m "feat: add contact form to Contacto page"
```

---

### Task 4: Nosotros — Visión, Misión, Valores

**Files:**
- Modify: `app/nosotros/page.tsx` (full rewrite of the body, `metadata` export unchanged)

**Interfaces:**
- Consumes: nothing new.
- Produces: the updated `/nosotros` route.

- [ ] **Step 1: Replace `app/nosotros/page.tsx`**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce Clean Home: venta de productos de limpieza con atención y pedidos por WhatsApp.",
};

const VALUES = [
  {
    title: "Calidad",
    description: "Trabajamos con marcas reconocidas en cada categoría de producto.",
  },
  {
    title: "Confianza",
    description: "Precios claros y sin sorpresas, confirmados antes de cada pedido.",
  },
  {
    title: "Atención cercana",
    description: "Coordinamos cada pedido directo por WhatsApp, de persona a persona.",
  },
  {
    title: "Cumplimiento",
    description: "Entregas puntuales y compromiso con lo acordado.",
  },
];

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-4 text-2xl font-extrabold text-slate-800">Nosotros</h1>
      <p className="mb-10 text-slate-600">
        En Clean Home ofrecemos una amplia variedad de productos de limpieza para el hogar y
        negocios: detergentes, papel higiénico, papel toalla, bolsas, artículos de limpieza para
        baño y cocina, y mucho más. Aceptamos pagos por Yape, transferencia o efectivo.
      </p>

      <div className="mb-10 grid gap-4 sm:grid-cols-2">
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

      <h2 className="mb-4 text-lg font-bold text-slate-800">Nuestros valores</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value) => (
          <div
            key={value.title}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="mb-1 text-sm font-bold text-sky-600">{value.title}</h3>
            <p className="text-xs text-slate-600">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify manually in the browser**

Run: `npm run build` (must succeed), then `npm run dev` and open `/nosotros`.
Expected: intro paragraph, Misión/Visión as two side-by-side cards on desktop (stacked on mobile), 4 Valores cards in a row on desktop (2 columns on mobile) that lift slightly on hover.

- [ ] **Step 3: Commit**

```bash
git add app/nosotros/page.tsx
git commit -m "feat: add Visión, Misión, and Valores to Nosotros page"
```

---

### Task 5: ProductCard visual refresh — elevated blue-shadow style

**Files:**
- Modify: `components/ProductCard.tsx`

**Interfaces:**
- Consumes: nothing new (same `Product` prop as before).
- Produces: no interface change — only Tailwind class changes. Rendered by both `/catalogo` (via `CatalogClient.tsx`) and `/` (via `app/page.tsx`'s featured section), so this one change updates both pages.

- [ ] **Step 1: Update the card wrapper and image container classes**

In `components/ProductCard.tsx`, replace the outer `<div>` and the image container `<div>`:

```tsx
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_12px_-4px_rgba(2,132,199,0.15)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_30px_-10px_rgba(2,132,199,0.35)]">
      <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/60">
```

(Only these two `className` values change — everything else in the file, including the `Image`/fallback JSX inside this div, the `<select>`, and the price/button row, stays exactly as it is.)

- [ ] **Step 2: Update the "Agregar" button to add a blue shadow**

Replace the button's `className`:

```tsx
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-full bg-sky-500 px-3 py-1.5 text-xs font-bold text-white shadow-[0_4px_10px_-2px_rgba(2,132,199,0.5)] transition hover:bg-sky-600"
        >
          Agregar
        </button>
```

- [ ] **Step 3: Verify manually in the browser**

Run: `npm run build` (must succeed), then `npm run dev` and open `/` and `/catalogo`.
Expected: product cards have a pale blue gradient behind the image, a soft blue-tinted shadow, lift slightly with a stronger shadow on hover, and the "Agregar" button has its own blue shadow. Check on mobile (375px) too — cards must not overflow or overlap (this is the same card that was fixed for mobile overlap in the previous plan; confirm that fix still holds with the new shadow classes).

- [ ] **Step 4: Commit**

```bash
git add components/ProductCard.tsx
git commit -m "style: refresh ProductCard with elevated blue-shadow visual style"
```

---

### Task 6: CategoryFilter chip restyle — white/blue instead of gray/blue

**Files:**
- Modify: `components/CategoryFilter.tsx`

**Interfaces:**
- Consumes: nothing new (same props as before).
- Produces: no interface change — only Tailwind class changes. Rendered by `/catalogo` via `CatalogClient.tsx`.

- [ ] **Step 1: Update the "Todas" button classes**

In `components/CategoryFilter.tsx`, replace the "Todas" button's `className`:

```tsx
      <button
        type="button"
        onClick={() => onChange("todas")}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
          active === "todas"
            ? "bg-sky-500 text-white shadow-[0_4px_10px_-2px_rgba(2,132,199,0.5)]"
            : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50"
        }`}
      >
        Todas
      </button>
```

- [ ] **Step 2: Update the category buttons classes**

Replace the mapped category button's `className`:

```tsx
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            active === cat.id
              ? "bg-sky-500 text-white shadow-[0_4px_10px_-2px_rgba(2,132,199,0.5)]"
              : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50"
          }`}
        >
          {cat.label}
        </button>
```

- [ ] **Step 3: Verify manually in the browser**

Run: `npm run build` (must succeed), then `npm run dev` and open `/catalogo`.
Expected: inactive category chips are white with a thin border (not gray-filled), active chip stays solid blue with a blue shadow, hover on inactive chips shows a light blue border/background.

- [ ] **Step 4: Commit**

```bash
git add components/CategoryFilter.tsx
git commit -m "style: restyle category chips to white/blue instead of gray/blue"
```

---

### Task 7: Home page — bold-typography hero and elevated category tiles

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: the updated `/` route.

- [ ] **Step 1: Replace the hero section**

In `app/page.tsx`, replace the entire hero `<section>` (the first one, currently `className="bg-gradient-to-b from-sky-50 to-white"`):

```tsx
      <section className="bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center">
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-6xl">
            Limpieza <span className="text-sky-600">sin complicaciones</span>
          </h1>
          <p className="max-w-xl text-slate-600">
            Detergentes, papel higiénico, papel toalla, bolsas y accesorios. Arma tu pedido y
            coordínalo directo por WhatsApp.
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
        </div>
      </section>
```

- [ ] **Step 2: Update the category tiles to the elevated hover style**

In the "Categorías" section, replace the `<Link>` inside the `CATEGORIES.map(...)`:

```tsx
            <Link
              key={cat.id}
              href={`/catalogo?categoria=${cat.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-center text-sm font-semibold text-slate-700 shadow-[0_4px_12px_-4px_rgba(2,132,199,0.15)] transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:text-sky-600 hover:shadow-[0_16px_30px_-10px_rgba(2,132,199,0.35)]"
            >
              {cat.label}
            </Link>
```

- [ ] **Step 3: Verify manually in the browser**

Run: `npm run build` (must succeed), then `npm run dev` and open `/`.
Expected: hero is on a plain white background with large bold text, "sin complicaciones" in blue; the "Ver catálogo" button lifts slightly on hover with a blue shadow; the WhatsApp button stays emerald/outline as before; category tiles lift and get a stronger blue shadow on hover, matching the product cards below them. Check mobile (375px): hero text wraps cleanly, category tiles stay in a 2-column grid.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "style: refresh home hero to bold typography and elevate category tiles"
```

---

### Task 8: Final verification pass

**Files:** none (verification only).

**Interfaces:** none.

- [ ] **Step 1: Run the full automated test suite**

Run: `npm test`
Expected: all suites pass — `products` (5), `cart` (7), `whatsapp` (5, including the 2 new `buildContactMessageUrl` tests) = 17/17.

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: `Compiled successfully`, all routes listed (`/`, `/catalogo`, `/nosotros`, `/contacto`, `/sitemap.xml`, `/robots.txt`), `/catalogo` still dynamic (`ƒ`), everything else static (`○`), no type or lint errors.

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: 0 errors (the pre-existing `postcss.config.mjs` anonymous-default-export warning is expected and fine).

- [ ] **Step 4: Manual end-to-end walkthrough in the browser**

Run: `npm run dev`. In the browser (desktop, then resize to 375px mobile):
1. `/` — hero reads "Limpieza sin complicaciones" with "sin complicaciones" in blue, on a white background. Category tiles and featured product cards lift on hover with a blue-tinted shadow.
2. `/catalogo` — category chips are white/bordered when inactive, solid blue when active. Product cards match the Home style (blue gradient image background, blue shadow, hover lift). Add a product to the cart, confirm the existing cart flow (from the previous plan) still works unchanged.
3. `/nosotros` — intro paragraph, Misión/Visión side-by-side cards, 4 Valores cards below, all readable and correctly laid out on mobile too.
4. `/contacto` — WhatsApp card and contact form side-by-side on desktop, stacked on mobile. Fill Nombre/Teléfono/Mensaje and submit — confirm a new tab opens to a `wa.me` link with all three values readable in the message, and the form fields remain filled in (not cleared) after submitting.

Expected: every step behaves as described, no console errors, no visual overlap or overflow on mobile.

- [ ] **Step 5: Final commit (if any fixes were made during verification)**

```bash
git add -A
git commit -m "chore: final verification fixes for visual refresh"
```

(Skip this step if verification found nothing to fix.)
