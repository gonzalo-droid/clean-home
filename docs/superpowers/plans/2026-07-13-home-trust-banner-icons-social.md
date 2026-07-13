# Home Trust Banner, Icons, and Social Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the site feel more eye-catching and organized: a blue trust banner on Home, shared category icons across Home/Catálogo, icons on Nosotros' Valores, a social-links column in the footer, and removal of the Home page's "Métodos de pago" section.

**Architecture:** Icons are plain emoji strings (no icon library dependency) attached to existing data structures (`CATEGORIES` in `data/products.ts`, the `VALUES` array in `app/nosotros/page.tsx`) and rendered by the components that already consume them. The Home page gains one new section (trust banner) and reorders backgrounds for visual rhythm; no new routes, no new state, no new dependencies.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS (existing stack, no new dependencies), Vitest for the one new data-integrity assertion.

## Global Constraints

- No new npm dependencies — icons are emoji characters, social icons are inline SVG (same pattern already used in `components/WhatsAppFloatButton.tsx`).
- Color palette stays white / `sky-*` / `slate-*` — the "more eye-catching" effect comes from solid-color blocking (`bg-sky-600` trust banner) and icons, not new colors. `emerald-*` stays reserved for WhatsApp actions only.
- Social links (Facebook, Instagram) point to `#` — the user does not have the accounts created yet. Do not fabricate URLs.
- The Home page's "Métodos de pago" section is removed entirely (not hidden, not moved) — that information already lives on `/nosotros`, `/contacto`, and in the footer.
- All previously-existing 17 Vitest tests must keep passing alongside 1 new one (18 total). `npm run build`/`npx tsc --noEmit` and `npm run lint` must stay clean throughout. (`npm run build` may fail in network-sandboxed environments only on the unrelated Google Fonts fetch in `app/layout.tsx` — use `npx tsc --noEmit` as the network-free equivalent when that happens.)

---

### Task 1: Category icons in `data/products.ts`

**Files:**
- Modify: `data/products.ts`
- Modify: `tests/products.test.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `CATEGORIES` entries now have an `icon: string` field in addition to the existing `id`/`label` — consumed by Task 2 (`CategoryFilter`) and Task 3 (Home page).

- [ ] **Step 1: Write the failing test**

Add this test to the end of the existing `describe("product catalog data", ...)` block in `tests/products.test.ts` (after the last `it(...)`, before the closing `});`):

```ts
  it("every category has a non-empty icon", () => {
    for (const category of CATEGORIES) {
      expect(category.icon.length).toBeGreaterThan(0);
    }
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `category.icon` is `undefined`, `.length` throws or the assertion fails.

- [ ] **Step 3: Add the `icon` field to `CATEGORIES` in `data/products.ts`**

Replace the existing `CATEGORIES` export (keep everything else in the file — the `Product` interface, `PRODUCTS` array, `img` helper — completely unchanged):

```ts
export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "detergentes", label: "Detergentes", icon: "🧴" },
  { id: "papel-higienico", label: "Papel Higiénico", icon: "🧻" },
  { id: "papel-toalla", label: "Papel Toalla", icon: "🧺" },
  { id: "servilletas-panuelos", label: "Servilletas y Pañuelos", icon: "🍽️" },
  { id: "limpieza-bano-cocina", label: "Limpieza de Baño y Cocina", icon: "🚿" },
  { id: "bolsas", label: "Bolsas", icon: "🛍️" },
  { id: "accesorios-limpieza", label: "Accesorios de Limpieza", icon: "🧽" },
  { id: "lavavajilla", label: "Lavavajilla", icon: "🫧" },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS — 18/18 across the whole suite (6 products + 7 cart + 5 whatsapp).

- [ ] **Step 5: Commit**

```bash
git add data/products.ts tests/products.test.ts
git commit -m "feat: add icon field to product categories"
```

---

### Task 2: Category icons in the Catálogo filter chips

**Files:**
- Modify: `components/CategoryFilter.tsx`

**Interfaces:**
- Consumes: `CATEGORIES` (now with `icon`) from `data/products.ts` (Task 1).
- Produces: no interface change — same props, only rendered output changes.

- [ ] **Step 1: Add the icon to the mapped category button**

In `components/CategoryFilter.tsx`, replace the `{cat.label}` inside the `CATEGORIES.map(...)` button with:

```tsx
          <span className="mr-1">{cat.icon}</span>
          {cat.label}
```

So the full button becomes:

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
          <span className="mr-1">{cat.icon}</span>
          {cat.label}
        </button>
```

(The "Todas" button above it is unchanged — it has no associated category, so no icon.)

- [ ] **Step 2: Verify manually in the browser**

Run: `npx tsc --noEmit` (must pass), then `npm run dev` and open `/catalogo`.
Expected: every category chip (inactive and active) shows its emoji before the label; "Todas" has no icon.

- [ ] **Step 3: Commit**

```bash
git add components/CategoryFilter.tsx
git commit -m "feat: show category icon on catalog filter chips"
```

---

### Task 3: Home page — trust banner, category tile icons, alternating sections, remove payment section

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `CATEGORIES` (now with `icon`) from `data/products.ts` (Task 1).
- Produces: the updated `/` route.

- [ ] **Step 1: Add the `TRUST_HIGHLIGHTS` constant**

In `app/page.tsx`, add this constant after the existing `FEATURED_IDS` array (keep `FEATURED_IDS` exactly as it is):

```ts
const TRUST_HIGHLIGHTS = [
  { icon: "😊", text: "+40 clientes satisfechos" },
  { icon: "📱", text: "Pedidos por WhatsApp" },
  { icon: "🚚", text: "Envíos a todo el Perú" },
  { icon: "📦", text: "Pedidos mayoristas" },
];
```

- [ ] **Step 2: Insert the trust banner section right after the hero**

In `app/page.tsx`, insert this new `<section>` immediately after the closing `</section>` of the hero and before the "Categorías" `<section>`:

```tsx
      <section className="bg-sky-600 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 text-center text-white sm:grid-cols-4">
          {TRUST_HIGHLIGHTS.map((item) => (
            <div key={item.text} className="flex flex-col items-center gap-2">
              <span className="text-3xl">{item.icon}</span>
              <span className="text-sm font-semibold">{item.text}</span>
            </div>
          ))}
        </div>
      </section>
```

- [ ] **Step 3: Give the "Categorías" section a light-blue background and icon badges on each tile**

Replace the "Categorías" `<section>` entirely:

```tsx
      <section className="bg-sky-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-6 text-xl font-bold text-slate-800">Categorías</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogo?categoria=${cat.id}`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center text-sm font-semibold text-slate-700 shadow-[0_4px_12px_-4px_rgba(2,132,199,0.15)] transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:text-sky-600 hover:shadow-[0_16px_30px_-10px_rgba(2,132,199,0.35)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-xl">
                  {cat.icon}
                </span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
```

- [ ] **Step 4: Remove the "Métodos de pago" section**

Delete this entire `<section>` from the end of the file (it's the last section, right before the closing `</div>` of the component's return):

```tsx
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-2xl bg-slate-50 p-8 text-center">
          <h2 className="text-lg font-bold text-slate-800">Métodos de pago</h2>
          <p className="mt-2 text-sm text-slate-600">Aceptamos Yape, transferencias y efectivo.</p>
        </div>
      </section>
```

After deletion, the "Productos destacados" section is the last section in the file, immediately followed by the closing `</div>` and `);`/`}`.

- [ ] **Step 5: Verify manually in the browser**

Run: `npx tsc --noEmit` (must pass), then `npm run dev` and open `/`.
Expected: hero (white) → trust banner (solid blue, 4 items with icon + text, 2 columns on mobile / 4 on desktop) → categories (light blue background, each tile has an icon circle above the label) → featured products (white) → footer. No "Métodos de pago" section anywhere on the page. Check mobile (375px): trust banner items don't overlap, category tiles still 2-column.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add trust banner and category icons to home, remove payment methods section"
```

---

### Task 4: Nosotros — icons on Valores cards

**Files:**
- Modify: `app/nosotros/page.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: no interface change — only the `VALUES` data and its rendering change.

- [ ] **Step 1: Add `icon` to each `VALUES` entry**

Replace the `VALUES` constant in `app/nosotros/page.tsx`:

```ts
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
```

- [ ] **Step 2: Render the icon in each Valores card**

Replace the card body inside the `VALUES.map(...)`:

```tsx
          <div
            key={value.title}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <span className="mb-2 block text-2xl">{value.icon}</span>
            <h3 className="mb-1 text-sm font-bold text-sky-600">{value.title}</h3>
            <p className="text-xs text-slate-600">{value.description}</p>
          </div>
```

- [ ] **Step 3: Verify manually in the browser**

Run: `npx tsc --noEmit` (must pass), then `npm run dev` and open `/nosotros`.
Expected: each of the 4 Valores cards shows its emoji above the title.

- [ ] **Step 4: Commit**

```bash
git add app/nosotros/page.tsx
git commit -m "feat: add icons to Nosotros Valores cards"
```

---

### Task 5: Footer — social links column

**Files:**
- Modify: `components/Footer.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: no interface change — `Footer` still takes no props.

- [ ] **Step 1: Replace `components/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-sky-600">Clean Home</p>
            <p className="mt-2">Productos de limpieza para tu hogar y negocio.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Contacto</p>
            <p className="mt-2">WhatsApp: 976 509 570</p>
            <p>Pedidos coordinados por WhatsApp</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Métodos de pago</p>
            <p className="mt-2">Yape · Transferencia · Efectivo</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Síguenos</p>
            <div className="mt-2 flex gap-3">
              <a href="#" aria-label="Facebook" className="text-slate-400 transition hover:text-sky-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-slate-400 transition hover:text-sky-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <p className="mt-8 text-xs text-slate-400">
          © {new Date().getFullYear()} Clean Home. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify manually in the browser**

Run: `npx tsc --noEmit` (must pass), then `npm run dev` and open any page (footer is site-wide).
Expected: footer now has 4 columns on desktop (Clean Home / Contacto / Métodos de pago / Síguenos) — 2 columns on mobile. "Síguenos" shows two icon links (Facebook, Instagram) that turn blue on hover; both point to `#`. Inspect the DOM (or hover) to confirm `aria-label="Facebook"` / `aria-label="Instagram"` are present.

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: add social links column to footer"
```

---

### Task 6: Final verification pass

**Files:** none (verification only).

**Interfaces:** none.

- [ ] **Step 1: Run the full automated test suite**

Run: `npm test`
Expected: all suites pass — 18/18 (6 products + 7 cart + 5 whatsapp).

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
1. `/` — hero (white) → trust banner (solid blue, 4 icon+text items, readable and not overlapping on mobile) → categories (light blue background, icon circle on each tile) → featured products (white). No "Métodos de pago" section anywhere on this page.
2. `/catalogo` — every category chip shows its icon before the label; "Todas" has no icon; filtering still works.
3. `/nosotros` — each of the 4 Valores cards shows its icon above the title.
4. Any page — footer shows 4 columns (2 on mobile) including "Síguenos" with Facebook/Instagram icons that link to `#` and have proper `aria-label`s.
5. Confirm nothing from the previous plan regressed: cart add/remove/checkout via WhatsApp on `/catalogo`, and the contact form on `/contacto`, still work.

Expected: every step behaves as described, no console errors, no visual overlap or overflow on mobile.

- [ ] **Step 5: Final commit (if any fixes were made during verification)**

```bash
git add -A
git commit -m "chore: final verification fixes for trust banner and icons"
```

(Skip this step if verification found nothing to fix.)
