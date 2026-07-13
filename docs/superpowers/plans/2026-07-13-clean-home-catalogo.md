# Clean Home Catálogo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Clean Home Next.js catalog site — Home, Catálogo (with WhatsApp cart), Nosotros, Contacto — from the design spec.

**Architecture:** Next.js App Router + TypeScript + Tailwind CSS. Product catalog is static typed data (`data/products.ts`). Cart state lives in a React Context backed by `localStorage`. Checkout is a `wa.me` link built from the cart contents — no backend, no payment processing.

**Tech Stack:** Next.js (latest), React (latest), TypeScript, Tailwind CSS v3, Vitest (unit tests for pure logic only — UI is verified manually in the browser per project convention).

## Global Constraints

- No CMS/backend/database — catalog data lives in `data/products.ts`, hand-maintained.
- WhatsApp order number: `51976509570` (Peru country code 51 + 976509570), used in `wa.me` links.
- Cart persists via `localStorage` under key `clean-home-cart`; must not crash if `localStorage` is unavailable.
- Product images already prepared at `public/images/products/<slug>.webp` (38 files, extracted and optimized from the source PDF catalog — do not regenerate them). One product (`lavavajilla-liquida-orion-3l`) has no source photo; its `image` field must be `null` and the UI must render a fallback.
- Palette: sky blue (`sky-*`) as primary, emerald green (`emerald-*`) as accent, slate (`slate-*`) as neutral — Tailwind's default palette, no custom theme colors needed.
- Mobile-first layout; header must collapse to a hamburger menu below `md`.
- No automated component/UI tests — verify UI manually via `npm run dev` in the browser (golden path: browse catalog → filter category → add product with variant → adjust quantity → send via WhatsApp). Pure logic (`lib/cart.ts`, `lib/whatsapp.ts`, `data/products.ts` integrity) is unit-tested with Vitest.

---

### Task 1: Project scaffolding (Next.js + TypeScript + Tailwind + Vitest)

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `.eslintrc.json`
- Create: `.gitignore`
- Create: `vitest.config.ts`
- Create: `next-env.d.ts`
- Create: `app/globals.css`
- Create: `app/layout.tsx` (placeholder, replaced in Task 6)
- Create: `app/page.tsx` (placeholder, replaced in Task 10)

**Interfaces:**
- Produces: a working `npm run dev`, `npm run build`, `npm run lint`, and `npm test` pipeline that every later task relies on.

- [ ] **Step 1: Write minimal `package.json`**

```json
{
  "name": "clean-home",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  }
}
```

- [ ] **Step 2: Install framework dependencies**

Run:
```bash
npm install next@latest react@latest react-dom@latest
npm install -D typescript@latest @types/node@latest @types/react@latest @types/react-dom@latest "tailwindcss@^3" "postcss@^8" "autoprefixer@^10" eslint@latest eslint-config-next@latest vitest@latest
```
Expected: `package.json` now lists these under `dependencies`/`devDependencies`, `node_modules/` exists, no errors.

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Write `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

- [ ] **Step 5: Write `tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 6: Write `postcss.config.mjs`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 7: Write `.eslintrc.json`**

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 8: Write `.gitignore`**

```
node_modules
.next
out
.env*.local
*.tsbuildinfo
next-env.d.ts
.DS_Store
```

- [ ] **Step 9: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
```

- [ ] **Step 10: Write `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 11: Write placeholder `app/layout.tsx`**

```tsx
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 12: Write placeholder `app/page.tsx`**

```tsx
export default function HomePage() {
  return <p>Clean Home — en construcción</p>;
}
```

- [ ] **Step 13: Verify the build compiles**

Run: `npm run build`
Expected: `Compiled successfully`, no TypeScript/ESLint errors.

- [ ] **Step 14: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.mjs tailwind.config.ts postcss.config.mjs .eslintrc.json .gitignore vitest.config.ts app/
git commit -m "chore: scaffold Next.js + TypeScript + Tailwind + Vitest project"
```

---

### Task 2: Product catalog data model

**Files:**
- Create: `data/products.ts`
- Test: `tests/products.test.ts`

**Interfaces:**
- Consumes: image files at `public/images/products/*.webp` (already present, do not create).
- Produces: `export type Category`, `export interface Product { id, name, category, presentation, variants?, price, image }`, `export const CATEGORIES: { id: Category; label: string }[]`, `export const PRODUCTS: Product[]` — every later task that renders or filters products imports from here.

- [ ] **Step 1: Write the failing test**

Create `tests/products.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { PRODUCTS, CATEGORIES } from "../data/products";

describe("product catalog data", () => {
  it("has at least 40 products", () => {
    expect(PRODUCTS.length).toBeGreaterThanOrEqual(40);
  });

  it("has unique ids", () => {
    const ids = PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every product references a known category", () => {
    const categoryIds = CATEGORIES.map((c) => c.id);
    for (const product of PRODUCTS) {
      expect(categoryIds).toContain(product.category);
    }
  });

  it("every product has a positive price", () => {
    for (const product of PRODUCTS) {
      expect(product.price).toBeGreaterThan(0);
    }
  });

  it("every variant list, when present, is non-empty", () => {
    for (const product of PRODUCTS) {
      if (product.variants) {
        expect(product.variants.length).toBeGreaterThan(0);
      }
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '../data/products'`

- [ ] **Step 3: Write `data/products.ts`**

```ts
export type Category =
  | "detergentes"
  | "papel-higienico"
  | "papel-toalla"
  | "servilletas-panuelos"
  | "limpieza-bano-cocina"
  | "bolsas"
  | "accesorios-limpieza"
  | "lavavajilla";

export interface Product {
  id: string;
  name: string;
  category: Category;
  presentation: string;
  variants?: string[];
  price: number;
  image: string | null;
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "detergentes", label: "Detergentes" },
  { id: "papel-higienico", label: "Papel Higiénico" },
  { id: "papel-toalla", label: "Papel Toalla" },
  { id: "servilletas-panuelos", label: "Servilletas y Pañuelos" },
  { id: "limpieza-bano-cocina", label: "Limpieza de Baño y Cocina" },
  { id: "bolsas", label: "Bolsas" },
  { id: "accesorios-limpieza", label: "Accesorios de Limpieza" },
  { id: "lavavajilla", label: "Lavavajilla" },
];

const img = (slug: string) => `/images/products/${slug}.webp`;

export const PRODUCTS: Product[] = [
  // Detergentes
  {
    id: "detergente-ariel-2kg",
    name: "Detergente Ariel en Polvo",
    category: "detergentes",
    presentation: "2 KG",
    price: 28.0,
    image: img("detergente-ariel-2kg"),
  },
  {
    id: "detergente-orion-15kg",
    name: "Detergente Orion",
    category: "detergentes",
    presentation: "15 KG",
    variants: ["Lavanda", "Floral", "Limón"],
    price: 65.0,
    image: img("detergente-orion-15kg"),
  },
  {
    id: "detergente-sapolio-2kg",
    name: "Detergente Sapolio",
    category: "detergentes",
    presentation: "2 KG",
    price: 15.5,
    image: img("detergente-sapolio-2kg"),
  },
  {
    id: "detergente-orion-150gr",
    name: "Detergente Orion",
    category: "detergentes",
    presentation: "150 GR",
    variants: ["Rosas", "Limón", "Lavanda"],
    price: 1.0,
    image: img("detergente-orion-150gr"),
  },

  // Papel higiénico
  {
    id: "papel-higienico-jumbo-500x4",
    name: "Papel Higiénico Jumbo",
    category: "papel-higienico",
    presentation: "500M X 4",
    price: 38.0,
    image: img("papel-higienico-jumbo-500x4"),
  },
  {
    id: "papel-higienico-elite-classic-500x4",
    name: "Papel Higiénico Elite Professional Classic",
    category: "papel-higienico",
    presentation: "500M X 4",
    price: 48.0,
    image: img("papel-higienico-elite-classic-500x4"),
  },
  {
    id: "papel-higienico-rendipel-100mts-x6",
    name: "Papel Higiénico Elite Rendipel",
    category: "papel-higienico",
    presentation: "100MTS X 6 Rollos",
    price: 20.0,
    image: img("papel-higienico-rendipel-100mts-x6"),
  },
  {
    id: "papel-higienico-classic-24x2-13mts",
    name: "Papel Higiénico Classic",
    category: "papel-higienico",
    presentation: "24X2 13 MTS",
    price: 25.0,
    image: img("papel-higienico-classic-24x2-13mts"),
  },

  // Papel toalla
  {
    id: "papel-toalla-200m-x2gh",
    name: "Papel Toalla",
    category: "papel-toalla",
    presentation: "200M X 2GH",
    price: 39.0,
    image: img("papel-toalla-200m-x2gh"),
  },
  {
    id: "papel-toalla-ecologico-200m-x2",
    name: "Papel Toalla Ecológico",
    category: "papel-toalla",
    presentation: "200M X 2",
    price: 38.0,
    image: img("papel-toalla-ecologico-200m-x2"),
  },
  {
    id: "papel-toalla-elite-classic-200m-x2",
    name: "Papel Toalla Elite Classic",
    category: "papel-toalla",
    presentation: "200M X 2",
    price: 38.0,
    image: img("papel-toalla-elite-classic-200m-x2"),
  },
  {
    id: "papel-toalla-mega-rollo-unidad",
    name: "Papel Toalla Mega Rollo Super",
    category: "papel-toalla",
    presentation: "Unidad",
    price: 3.0,
    image: img("papel-toalla-mega-rollo"),
  },
  {
    id: "papel-toalla-mega-rollo-paquete-x12",
    name: "Papel Toalla Mega Rollo Super",
    category: "papel-toalla",
    presentation: "Paquete X 12",
    price: 30.0,
    image: img("papel-toalla-mega-rollo"),
  },
  {
    id: "papel-toalla-150-hojas-elite",
    name: "Papel Toalla 150 Hojas Elite",
    category: "papel-toalla",
    presentation: "150 Hojas",
    price: 4.5,
    image: img("papel-toalla-150-hojas-elite"),
  },
  {
    id: "papel-toalla-genio-500-hojas-unidad",
    name: "Papel Toalla Genio",
    category: "papel-toalla",
    presentation: "500 Hojas — Unidad",
    price: 10.0,
    image: img("papel-toalla-genio-500-hojas"),
  },
  {
    id: "papel-toalla-genio-500-hojas-paquete-x6",
    name: "Papel Toalla Genio",
    category: "papel-toalla",
    presentation: "500 Hojas — Paquete X 6",
    price: 58.0,
    image: img("papel-toalla-genio-500-hojas"),
  },

  // Servilletas y pañuelos
  {
    id: "panuelos-desechables-pack-x8",
    name: "Pañuelos Desechables",
    category: "servilletas-panuelos",
    presentation: "Pack de 8",
    price: 4.5,
    image: img("panuelos-desechables-pack-x8"),
  },
  {
    id: "servilleta-classic-300-unidad",
    name: "Servilleta Classic 300",
    category: "servilletas-panuelos",
    presentation: "Unidad",
    price: 2.0,
    image: img("servilleta-classic-300"),
  },
  {
    id: "servilleta-classic-300x18-paquete",
    name: "Servilleta Classic 300X18",
    category: "servilletas-panuelos",
    presentation: "Paquete",
    price: 32.0,
    image: img("servilleta-classic-300"),
  },
  {
    id: "servilleta-elite-dob-4-plus-unidad",
    name: "Servilleta Elite Dob en 4 Plus 100X24 30X30",
    category: "servilletas-panuelos",
    presentation: "Unidad",
    price: 3.5,
    image: img("servilleta-elite-dob-en-4-plus"),
  },
  {
    id: "servilleta-elite-dob-4-plus-paquete",
    name: "Servilleta Elite Dob en 4 Plus 100X24 30X30",
    category: "servilletas-panuelos",
    presentation: "Paquete",
    price: 75.0,
    image: img("servilleta-elite-dob-en-4-plus"),
  },

  // Limpieza de baño y cocina
  {
    id: "lejia-sapolio",
    name: "Lejía Sapolio",
    category: "limpieza-bano-cocina",
    presentation: "Botella",
    price: 10.0,
    image: img("lejia-sapolio"),
  },
  {
    id: "lejia-clorox-4l",
    name: "Lejía Clorox",
    category: "limpieza-bano-cocina",
    presentation: "4 L",
    price: 10.5,
    image: img("lejia-clorox-4l"),
  },
  {
    id: "limpiatodo-sapolio",
    name: "Limpiatodo Sapolio",
    category: "limpieza-bano-cocina",
    presentation: "Distintos aromas",
    price: 13.5,
    image: img("limpiatodo-sapolio"),
  },
  {
    id: "limpiatodo-virutex-900ml",
    name: "Limpiatodo Virutex",
    category: "limpieza-bano-cocina",
    presentation: "900 ML",
    price: 2.9,
    image: img("limpiatodo-virutex-900ml"),
  },
  {
    id: "acido-limpiador-sacasarro",
    name: "Ácido Limpiador Sacasarro",
    category: "limpieza-bano-cocina",
    presentation: "Botella",
    price: 12.5,
    image: img("acido-limpiador-sacasarro"),
  },
  {
    id: "jabon-liquido-aval-400ml",
    name: "Jabón Líquido Aval",
    category: "limpieza-bano-cocina",
    presentation: "400 ML",
    price: 7.0,
    image: img("jabon-liquido-aval-400ml"),
  },
  {
    id: "desatorador-cocinas",
    name: "Desatorador para Cocinas",
    category: "limpieza-bano-cocina",
    presentation: "Botella",
    price: 9.5,
    image: img("desatorador-cocinas"),
  },
  {
    id: "desatorador-banos",
    name: "Desatorador para Baños",
    category: "limpieza-bano-cocina",
    presentation: "Botella",
    price: 9.5,
    image: img("desatorador-banos"),
  },
  {
    id: "pastillas-tanque-ebriel-x2",
    name: "Pastillas para Tanque Ebriel Azul",
    category: "limpieza-bano-cocina",
    presentation: "X 2 Unid",
    price: 6.5,
    image: img("pastillas-tanque-ebriel"),
  },
  {
    id: "aromatizante-bano-unidad",
    name: "Aromatizante de Baño",
    category: "limpieza-bano-cocina",
    presentation: "Unidad",
    price: 2.0,
    image: img("aromatizante-bano"),
  },
  {
    id: "aromatizante-bano-paquete",
    name: "Aromatizante de Baño",
    category: "limpieza-bano-cocina",
    presentation: "Paquete",
    price: 5.0,
    image: img("aromatizante-bano"),
  },

  // Bolsas
  {
    id: "bolsas-negras-20x30",
    name: "Bolsas Negras",
    category: "bolsas",
    presentation: "20X30",
    price: 7.0,
    image: img("bolsas-negras"),
  },
  {
    id: "bolsas-negras-140lt",
    name: "Bolsas Negras",
    category: "bolsas",
    presentation: "140 LT",
    price: 18.0,
    image: img("bolsas-negras"),
  },

  // Accesorios de limpieza
  {
    id: "display-esponja-platos-2en1-7unid",
    name: 'Display de Esponja para Platos "2 en 1"',
    category: "accesorios-limpieza",
    presentation: "7 Unidades",
    price: 14.0,
    image: img("display-esponja-platos-2en1-7unid"),
  },
  {
    id: "display-esponja-cocina-12unid",
    name: "Display de Esponja para Cocina",
    category: "accesorios-limpieza",
    presentation: "12 Unidades",
    price: 20.0,
    image: img("display-esponja-cocina-12unid"),
  },
  {
    id: "panos-amarillos-virutex",
    name: "Paños Amarillos Virutex",
    category: "accesorios-limpieza",
    presentation: "Paquete",
    price: 14.5,
    image: img("panos-amarillos-virutex"),
  },
  {
    id: "guantes-limpieza",
    name: "Guantes de Limpieza",
    category: "accesorios-limpieza",
    presentation: "Par",
    price: 5.5,
    image: img("guantes-limpieza"),
  },
  {
    id: "pano-limpieza-multiuso-virutex",
    name: "Paño de Limpieza Multiuso Virutex",
    category: "accesorios-limpieza",
    presentation: "6 Unidades",
    price: 7.0,
    image: img("pano-limpieza-multiuso-virutex"),
  },
  {
    id: "trapeador-microfibra",
    name: "Trapeador Microfibra",
    category: "accesorios-limpieza",
    presentation: "Unidad",
    price: 6.5,
    image: img("trapeador-microfibra"),
  },
  {
    id: "pano-microfibra-grande",
    name: "Paño Microfibra Grande",
    category: "accesorios-limpieza",
    presentation: "Unidad",
    price: 5.5,
    image: img("pano-microfibra-grande"),
  },
  {
    id: "pano-microfibra-pequeno",
    name: "Paño Microfibra Pequeño",
    category: "accesorios-limpieza",
    presentation: "Unidad",
    price: 4.5,
    image: img("pano-microfibra-pequeno"),
  },
  {
    id: "recogedor",
    name: "Recogedor",
    category: "accesorios-limpieza",
    presentation: "Unidad",
    price: 7.5,
    image: img("recogedor"),
  },

  // Lavavajilla
  {
    id: "lavavajilla-liquida-orion-3l",
    name: "Lavavajilla Líquida Orion",
    category: "lavavajilla",
    presentation: "3 LT",
    price: 20.0,
    image: null,
  },
  {
    id: "lavavajilla-pasta-patito-1kg",
    name: "Lavavajilla en Pasta Patito",
    category: "lavavajilla",
    presentation: "1 KG",
    price: 5.0,
    image: img("lavavajilla-pasta-patito"),
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS — all 5 assertions in `tests/products.test.ts` green.

- [ ] **Step 5: Commit**

```bash
git add data/products.ts tests/products.test.ts
git commit -m "feat: add product catalog data model"
```

---

### Task 3: Cart pure logic

**Files:**
- Create: `lib/cart.ts`
- Test: `tests/cart.test.ts`

**Interfaces:**
- Consumes: nothing (pure module, no imports from other app code).
- Produces: `interface CartLine { lineId, productId, name, presentation, variant?, price, image, quantity }`, `makeLineId(productId, variant?)`, `addItem(items, newItem, quantity?)`, `removeItem(items, lineId)`, `updateQuantity(items, lineId, quantity)`, `cartTotal(items)`, `cartCount(items)` — consumed by Task 5 (`lib/cart-context.tsx`).

- [ ] **Step 1: Write the failing test**

Create `tests/cart.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { addItem, removeItem, updateQuantity, cartTotal, cartCount, makeLineId } from "../lib/cart";
import type { CartLine } from "../lib/cart";

const baseItem: Omit<CartLine, "quantity"> = {
  lineId: makeLineId("soap", undefined),
  productId: "soap",
  name: "Jabón",
  presentation: "1 unidad",
  price: 5,
  image: null,
};

describe("cart logic", () => {
  it("adds a new line with the given quantity", () => {
    const items = addItem([], baseItem, 2);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it("merges quantities when the same lineId is added again", () => {
    let items = addItem([], baseItem, 1);
    items = addItem(items, baseItem, 3);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(4);
  });

  it("treats different variants as separate lines", () => {
    const withVariant = { ...baseItem, lineId: makeLineId("soap", "Lavanda"), variant: "Lavanda" };
    let items = addItem([], baseItem, 1);
    items = addItem(items, withVariant, 1);
    expect(items).toHaveLength(2);
  });

  it("removes a line by lineId", () => {
    let items = addItem([], baseItem, 1);
    items = removeItem(items, baseItem.lineId);
    expect(items).toHaveLength(0);
  });

  it("updateQuantity clamps to removal at zero or below", () => {
    let items = addItem([], baseItem, 2);
    items = updateQuantity(items, baseItem.lineId, 0);
    expect(items).toHaveLength(0);
  });

  it("cartTotal sums price times quantity across lines", () => {
    let items = addItem([], baseItem, 2); // 5 * 2 = 10
    const other = { ...baseItem, lineId: "other", price: 3 };
    items = addItem(items, other, 1); // + 3
    expect(cartTotal(items)).toBe(13);
  });

  it("cartCount sums quantities across lines", () => {
    let items = addItem([], baseItem, 2);
    const other = { ...baseItem, lineId: "other", price: 3 };
    items = addItem(items, other, 3);
    expect(cartCount(items)).toBe(5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '../lib/cart'`

- [ ] **Step 3: Write `lib/cart.ts`**

```ts
export interface CartLine {
  lineId: string;
  productId: string;
  name: string;
  presentation: string;
  variant?: string;
  price: number;
  image: string | null;
  quantity: number;
}

export function makeLineId(productId: string, variant?: string): string {
  return `${productId}::${variant ?? "default"}`;
}

export function addItem(
  items: CartLine[],
  newItem: Omit<CartLine, "quantity">,
  quantity = 1
): CartLine[] {
  const existing = items.find((i) => i.lineId === newItem.lineId);
  if (existing) {
    return items.map((i) =>
      i.lineId === newItem.lineId ? { ...i, quantity: i.quantity + quantity } : i
    );
  }
  return [...items, { ...newItem, quantity }];
}

export function removeItem(items: CartLine[], lineId: string): CartLine[] {
  return items.filter((i) => i.lineId !== lineId);
}

export function updateQuantity(items: CartLine[], lineId: string, quantity: number): CartLine[] {
  if (quantity <= 0) return removeItem(items, lineId);
  return items.map((i) => (i.lineId === lineId ? { ...i, quantity } : i));
}

export function cartTotal(items: CartLine[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartCount(items: CartLine[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS — all 7 assertions in `tests/cart.test.ts` green.

- [ ] **Step 5: Commit**

```bash
git add lib/cart.ts tests/cart.test.ts
git commit -m "feat: add pure cart logic"
```

---

### Task 4: WhatsApp order message builder

**Files:**
- Create: `lib/whatsapp.ts`
- Test: `tests/whatsapp.test.ts`

**Interfaces:**
- Consumes: `CartLine` from `lib/cart.ts` (Task 3).
- Produces: `WHATSAPP_NUMBER: string`, `buildWhatsAppOrderUrl(items: CartLine[]): string` — consumed by Task 7 (`CartDrawer`) and Task 10/11 (direct WhatsApp links).

- [ ] **Step 1: Write the failing test**

Create `tests/whatsapp.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildWhatsAppOrderUrl, WHATSAPP_NUMBER } from "../lib/whatsapp";
import type { CartLine } from "../lib/cart";

const items: CartLine[] = [
  {
    lineId: "a::default",
    productId: "a",
    name: "Detergente Ariel",
    presentation: "2 KG",
    price: 28,
    image: null,
    quantity: 2,
  },
  {
    lineId: "b::Lavanda",
    productId: "b",
    name: "Detergente Orion",
    presentation: "15 KG",
    variant: "Lavanda",
    price: 65,
    image: null,
    quantity: 1,
  },
];

describe("buildWhatsAppOrderUrl", () => {
  it("targets the configured WhatsApp number", () => {
    expect(WHATSAPP_NUMBER).toBe("51976509570");
    expect(buildWhatsAppOrderUrl(items)).toContain(`https://wa.me/${WHATSAPP_NUMBER}?text=`);
  });

  it("url-encodes the message and includes product names and quantities", () => {
    const url = buildWhatsAppOrderUrl(items);
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    expect(decoded).toContain("Detergente Ariel");
    expect(decoded).toContain("x2");
    expect(decoded).toContain("Lavanda");
  });

  it("includes the computed total", () => {
    const url = buildWhatsAppOrderUrl(items);
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    // 28 * 2 + 65 * 1 = 121
    expect(decoded).toContain("121.00");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '../lib/whatsapp'`

- [ ] **Step 3: Write `lib/whatsapp.ts`**

```ts
import type { CartLine } from "./cart";

export const WHATSAPP_NUMBER = "51976509570";

export function buildWhatsAppOrderUrl(items: CartLine[]): string {
  const lines = items.map((item, index) => {
    const variant = item.variant ? ` (${item.variant})` : "";
    const subtotal = (item.price * item.quantity).toFixed(2);
    return `${index + 1}. ${item.name}${variant} - ${item.presentation} x${item.quantity} = S/${subtotal}`;
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const message = [
    "Hola, quiero hacer el siguiente pedido:",
    "",
    ...lines,
    "",
    `Total: S/${total}`,
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS — all 3 assertions in `tests/whatsapp.test.ts` green.

- [ ] **Step 5: Commit**

```bash
git add lib/whatsapp.ts tests/whatsapp.test.ts
git commit -m "feat: add WhatsApp order message builder"
```

---

### Task 5: Cart Context with localStorage persistence

**Files:**
- Create: `lib/cart-context.tsx`

**Interfaces:**
- Consumes: `CartLine, addItem, removeItem, updateQuantity, cartTotal, cartCount` from `lib/cart.ts` (Task 3).
- Produces: `CartProvider` (wraps the app), `useCart()` hook returning `{ items, add(item, quantity?), remove(lineId), setQuantity(lineId, quantity), clear(), total, count, isOpen, openCart(), closeCart(), toggleCart() }` — consumed by Task 6 (layout), Task 7 (CartDrawer), Task 8 (ProductCard), Task 9 (Header/CategoryFilter via ProductCard).

- [ ] **Step 1: Write `lib/cart-context.tsx`**

```tsx
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  type CartLine,
  addItem,
  removeItem,
  updateQuantity,
  cartTotal,
  cartCount,
} from "./cart";

const STORAGE_KEY = "clean-home-cart";

interface CartContextValue {
  items: CartLine[];
  add: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  remove: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  total: number;
  count: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage unavailable (e.g. private mode) — cart stays in-memory
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore persistence failure
    }
  }, [items, hydrated]);

  const value: CartContextValue = {
    items,
    add: (item, quantity = 1) => setItems((prev) => addItem(prev, item, quantity)),
    remove: (lineId) => setItems((prev) => removeItem(prev, lineId)),
    setQuantity: (lineId, quantity) => setItems((prev) => updateQuantity(prev, lineId, quantity)),
    clear: () => setItems([]),
    total: cartTotal(items),
    count: cartCount(items),
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    toggleCart: () => setIsOpen((v) => !v),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: no errors (this file isn't wired into the app yet, but must compile standalone).

- [ ] **Step 3: Commit**

```bash
git add lib/cart-context.tsx
git commit -m "feat: add cart context with localStorage persistence"
```

---

### Task 6: Root layout, Header, Footer

**Files:**
- Create: `components/Header.tsx`
- Create: `components/Footer.tsx`
- Modify: `app/layout.tsx` (replace Task 1 placeholder)

**Interfaces:**
- Consumes: `useCart()` from `lib/cart-context.tsx` (Task 5).
- Produces: the app shell every page renders inside (`Header`, `Footer`, `CartProvider`, JSON-LD `Store` block). Task 7's `CartDrawer` and Task 12's `WhatsAppFloatButton` will be added into this same `RootLayout` body.

- [ ] **Step 1: Write `components/Header.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const { count, toggleCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-sky-600">
          Clean Home
        </Link>

        <nav className="hidden gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-sky-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleCart}
            aria-label="Abrir carrito de pedido"
            className="relative rounded-full p-2 text-slate-700 hover:bg-sky-50"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
            className="rounded-full p-2 text-slate-700 hover:bg-sky-50 md:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded px-2 py-2 text-sm font-medium text-slate-600 hover:bg-sky-50 hover:text-sky-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.693 2.602-7.163.087-.352-.184-.687-.547-.687H5.106M7.5 14.25L5.106 5.25M7.5 14.25L5.25 3M9.75 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
    </svg>
  );
}
```

- [ ] **Step 2: Write `components/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600">
        <div className="grid gap-8 sm:grid-cols-3">
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
        </div>
        <p className="mt-8 text-xs text-slate-400">
          © {new Date().getFullYear()} Clean Home. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://clean-home.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Clean Home | Productos de limpieza",
    template: "%s | Clean Home",
  },
  description:
    "Catálogo de productos de limpieza: detergentes, papel higiénico, papel toalla, bolsas y accesorios. Pedidos por WhatsApp.",
  openGraph: {
    title: "Clean Home | Productos de limpieza",
    description: "Catálogo de productos de limpieza con pedidos por WhatsApp.",
    url: SITE_URL,
    siteName: "Clean Home",
    locale: "es_PE",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-white text-slate-800 antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Clean Home",
              description: "Venta de productos de limpieza con pedidos por WhatsApp.",
              telephone: "+51976509570",
              priceRange: "S/",
              areaServed: "PE",
            }),
          }}
        />
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify manually in the browser**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: header with "Clean Home" logo, nav links, cart icon (no badge), footer with WhatsApp number and payment methods. Resize to a mobile width — nav collapses behind a hamburger button that toggles a dropdown menu.

- [ ] **Step 5: Commit**

```bash
git add components/Header.tsx components/Footer.tsx app/layout.tsx
git commit -m "feat: add app shell with header, footer, and cart provider"
```

---

### Task 7: Cart drawer with WhatsApp checkout

**Files:**
- Create: `components/CartDrawer.tsx`
- Modify: `app/layout.tsx:1-45` (mount `<CartDrawer />` inside `<CartProvider>`, after `<Footer />`)

**Interfaces:**
- Consumes: `useCart()` from `lib/cart-context.tsx` (Task 5), `buildWhatsAppOrderUrl` from `lib/whatsapp.ts` (Task 4).
- Produces: the cart drawer UI, opened via the header cart button (Task 6) and via `openCart()` called from `ProductCard` (Task 8).

- [ ] **Step 1: Write `components/CartDrawer.tsx`**

```tsx
"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, remove, total, clear } = useCart();

  if (!isOpen) return null;

  const whatsappUrl = buildWhatsAppOrderUrl(items);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={closeCart}
        className="absolute inset-0 bg-slate-900/40"
      />
      <aside className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <h2 className="text-lg font-bold text-slate-800">Tu pedido</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar"
            className="text-slate-500 hover:text-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">Aún no agregaste productos.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.lineId} className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        🧴
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.presentation}
                      {item.variant ? ` · ${item.variant}` : ""}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.lineId, item.quantity - 1)}
                        className="h-6 w-6 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100"
                        aria-label="Quitar uno"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.lineId, item.quantity + 1)}
                        className="h-6 w-6 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100"
                        aria-label="Agregar uno"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item.lineId)}
                        className="ml-2 text-xs text-red-500 hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    S/{(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-slate-200 px-4 py-4">
          <div className="mb-3 flex items-center justify-between text-base font-bold text-slate-800">
            <span>Total</span>
            <span>S/{total.toFixed(2)}</span>
          </div>
          <p className="mb-3 text-xs text-slate-500">
            El pedido se confirma por WhatsApp, no se procesa pago en la web.
          </p>
          {items.length > 0 ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => clear()}
              className="block w-full rounded-full bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-white hover:bg-emerald-600"
            >
              Enviar pedido por WhatsApp
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="block w-full cursor-not-allowed rounded-full bg-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-400"
            >
              Agrega productos primero
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
```

- [ ] **Step 2: Mount it in `app/layout.tsx`**

In `app/layout.tsx`, add the import and render `<CartDrawer />` after `<Footer />`, still inside `<CartProvider>`:

```tsx
import CartDrawer from "@/components/CartDrawer";
```

```tsx
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
```

- [ ] **Step 3: Verify manually in the browser**

Run: `npm run dev`, click the header cart icon.
Expected: drawer slides in from the right showing "Aún no agregaste productos.", total S/0.00, and a disabled "Agrega productos primero" button. Clicking the backdrop or the ✕ closes it.

- [ ] **Step 4: Commit**

```bash
git add components/CartDrawer.tsx app/layout.tsx
git commit -m "feat: add cart drawer with WhatsApp checkout"
```

---

### Task 8: ProductCard and CategoryFilter components

**Files:**
- Create: `components/ProductCard.tsx`
- Create: `components/CategoryFilter.tsx`

**Interfaces:**
- Consumes: `Product` type and `CATEGORIES` from `data/products.ts` (Task 2), `useCart()` from `lib/cart-context.tsx` (Task 5), `makeLineId` from `lib/cart.ts` (Task 3).
- Produces: `<ProductCard product={Product} />` and `<CategoryFilter active={Category | "todas"} onChange={(v) => void} />` — consumed by Task 9 (catalog page) and Task 10 (home page).

- [ ] **Step 1: Write `components/ProductCard.tsx`**

```tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { makeLineId } from "@/lib/cart";

export default function ProductCard({ product }: { product: Product }) {
  const { add, openCart } = useCart();
  const [variant, setVariant] = useState(product.variants?.[0]);

  function handleAdd() {
    add({
      lineId: makeLineId(product.id, variant),
      productId: product.id,
      name: product.name,
      presentation: product.presentation,
      variant,
      price: product.price,
      image: product.image,
    });
    openCart();
  }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl bg-slate-50">
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

      <p className="text-sm font-semibold text-slate-800">{product.name}</p>
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

      <div className="mt-3 flex items-center justify-between">
        <span className="text-base font-bold text-sky-600">S/{product.price.toFixed(2)}</span>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-full bg-sky-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-600"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `components/CategoryFilter.tsx`**

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
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("todas")}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
          active === "todas" ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-sky-50"
        }`}
      >
        Todas
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            active === cat.id ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-sky-50"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: no errors (components aren't rendered by any page yet, but must compile standalone).

- [ ] **Step 4: Commit**

```bash
git add components/ProductCard.tsx components/CategoryFilter.tsx
git commit -m "feat: add ProductCard and CategoryFilter components"
```

---

### Task 9: Catalog page with category filter

**Files:**
- Create: `app/catalogo/page.tsx`
- Create: `app/catalogo/CatalogClient.tsx`

**Interfaces:**
- Consumes: `PRODUCTS, CATEGORIES, type Category` from `data/products.ts` (Task 2), `ProductCard` (Task 8), `CategoryFilter` (Task 8).
- Produces: the `/catalogo` route, linked from Task 6's header nav and Task 10's home page category tiles (`/catalogo?categoria=<id>`).

- [ ] **Step 1: Write `app/catalogo/CatalogClient.tsx`**

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

  const products = useMemo(
    () => (active === "todas" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-extrabold text-slate-800">Catálogo de productos</h1>
      <p className="mb-6 text-sm text-slate-600">
        Agrega los productos que necesitas y envía tu pedido por WhatsApp.
      </p>

      <div className="mb-8">
        <CategoryFilter active={active} onChange={setActive} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `app/catalogo/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PRODUCTS } from "@/data/products";
import CatalogClient from "./CatalogClient";

export const metadata: Metadata = {
  title: "Catálogo de productos de limpieza",
  description:
    "Explora todo el catálogo: detergentes, papel higiénico, papel toalla, servilletas, limpieza de baño y cocina, bolsas, accesorios y lavavajilla.",
};

export default function CatalogoPage({
  searchParams,
}: {
  searchParams: { categoria?: string };
}) {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: PRODUCTS.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <CatalogClient initialCategory={searchParams.categoria} />
    </>
  );
}
```

- [ ] **Step 3: Verify manually in the browser**

Run: `npm run dev`, open `http://localhost:3000/catalogo`.
Expected: all ~45 products render as cards with image, name, presentation, price, and an "Agregar" button. Clicking a category chip filters the grid. Clicking "Agregar" on a product with variants (e.g. Detergente Orion 15KG) respects the selected aroma, adds it to the cart, and opens the drawer. Navigate to `/catalogo?categoria=detergentes` directly — the Detergentes chip is pre-selected.

- [ ] **Step 4: Commit**

```bash
git add app/catalogo/
git commit -m "feat: add catalog page with category filter"
```

---

### Task 10: Home page

**Files:**
- Modify: `app/page.tsx` (replace Task 1 placeholder)

**Interfaces:**
- Consumes: `PRODUCTS, CATEGORIES` from `data/products.ts` (Task 2), `ProductCard` from `components/ProductCard.tsx` (Task 8).
- Produces: the `/` route.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import Link from "next/link";
import type { Metadata } from "next";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Clean Home | Productos de limpieza con pedidos por WhatsApp",
  description:
    "Detergentes, papel higiénico, papel toalla, bolsas y accesorios de limpieza. Arma tu pedido y recíbelo coordinando por WhatsApp.",
};

const FEATURED_IDS = [
  "detergente-ariel-2kg",
  "papel-higienico-elite-classic-500x4",
  "lejia-clorox-4l",
  "guantes-limpieza",
];

export default function HomePage() {
  const featured = PRODUCTS.filter((p) => FEATURED_IDS.includes(p.id));

  return (
    <div>
      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center">
          <h1 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
            Productos de limpieza para tu hogar y negocio
          </h1>
          <p className="max-w-xl text-slate-600">
            Detergentes, papel higiénico, papel toalla, bolsas y accesorios. Arma tu pedido y
            coordínalo directo por WhatsApp.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/catalogo"
              className="rounded-full bg-sky-500 px-6 py-3 text-sm font-bold text-white hover:bg-sky-600"
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

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-xl font-bold text-slate-800">Categorías</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogo?categoria=${cat.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-center text-sm font-semibold text-slate-700 shadow-sm hover:border-sky-300 hover:text-sky-600"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-xl font-bold text-slate-800">Productos destacados</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-2xl bg-slate-50 p-8 text-center">
          <h2 className="text-lg font-bold text-slate-800">Métodos de pago</h2>
          <p className="mt-2 text-sm text-slate-600">Aceptamos Yape, transferencias y efectivo.</p>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify manually in the browser**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: hero with heading and two CTAs ("Ver catálogo" → `/catalogo`, "Pedir por WhatsApp" → opens `wa.me`), a grid of 8 category tiles linking to filtered catalog views, 4 featured product cards that can be added to the cart, and a payment-methods section.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: build home page with hero, categories, and featured products"
```

---

### Task 11: Nosotros and Contacto pages

**Files:**
- Create: `app/nosotros/page.tsx`
- Create: `app/contacto/page.tsx`

**Interfaces:**
- Consumes: nothing beyond Next.js metadata API — static content pages.
- Produces: the `/nosotros` and `/contacto` routes, linked from Task 6's header nav.

- [ ] **Step 1: Write `app/nosotros/page.tsx`**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce Clean Home: venta de productos de limpieza con atención y pedidos por WhatsApp.",
};

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-2xl font-extrabold text-slate-800">Nosotros</h1>
      <p className="mb-4 text-slate-600">
        En Clean Home ofrecemos una amplia variedad de productos de limpieza para el hogar y
        negocios: detergentes, papel higiénico, papel toalla, bolsas, artículos de limpieza para
        baño y cocina, y mucho más.
      </p>
      <p className="mb-4 text-slate-600">
        Trabajamos con marcas reconocidas y coordinamos cada pedido directamente por WhatsApp,
        para que elijas tus productos, confirmes cantidades y precios, y definas la entrega sin
        complicaciones.
      </p>
      <p className="text-slate-600">Aceptamos pagos por Yape, transferencia o efectivo.</p>
    </div>
  );
}
```

- [ ] **Step 2: Write `app/contacto/page.tsx`**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos por WhatsApp al 976 509 570 para coordinar tu pedido de productos de limpieza.",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-2xl font-extrabold text-slate-800">Contacto</h1>
      <p className="mb-6 text-slate-600">
        Escríbenos por WhatsApp para consultas o para coordinar tu pedido.
      </p>

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
    </div>
  );
}
```

- [ ] **Step 3: Verify manually in the browser**

Run: `npm run dev`, open `/nosotros` and `/contacto` from the header nav.
Expected: both pages render with correct copy; the "Escribir por WhatsApp" button on `/contacto` opens `https://wa.me/51976509570`.

- [ ] **Step 4: Commit**

```bash
git add app/nosotros/ app/contacto/
git commit -m "feat: add nosotros and contacto pages"
```

---

### Task 12: SEO (sitemap, robots) and WhatsApp float button

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Create: `components/WhatsAppFloatButton.tsx`
- Modify: `app/layout.tsx:1-50` (mount `<WhatsAppFloatButton />` inside `<CartProvider>`, after `<CartDrawer />`)

**Interfaces:**
- Consumes: nothing new.
- Produces: `/sitemap.xml`, `/robots.txt`, and a floating WhatsApp button visible on every page.

- [ ] **Step 1: Write `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";

const SITE_URL = "https://clean-home.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/catalogo", "/nosotros", "/contacto"];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
```

- [ ] **Step 2: Write `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";

const SITE_URL = "https://clean-home.example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Write `components/WhatsAppFloatButton.tsx`**

```tsx
import Link from "next/link";

export default function WhatsAppFloatButton() {
  return (
    <Link
      href="https://wa.me/51976509570?text=Hola%2C%20quiero%20consultar%20sobre%20productos%20de%20limpieza"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7">
        <path d="M16.001 2.667c-7.364 0-13.334 5.97-13.334 13.334 0 2.353.617 4.647 1.789 6.667L2.667 29.333l6.83-1.79a13.27 13.27 0 006.504 1.657h.006c7.364 0 13.334-5.97 13.334-13.333S23.365 2.667 16.001 2.667zm0 24.4a11.03 11.03 0 01-5.62-1.54l-.403-.24-4.053 1.062 1.082-3.951-.263-.406a11.05 11.05 0 01-1.7-5.897c0-6.108 4.97-11.078 11.079-11.078 2.96 0 5.742 1.153 7.834 3.246a11 11 0 013.244 7.834c0 6.108-4.97 11.078-11.1 11.078v-.108z" />
        <path d="M22.324 18.61c-.339-.17-2.006-.99-2.317-1.104-.311-.113-.538-.17-.764.17-.226.34-.876 1.104-1.074 1.33-.198.226-.396.255-.735.085-.339-.17-1.432-.528-2.727-1.68-1.008-.9-1.689-2.011-1.887-2.35-.198-.34-.021-.523.149-.692.153-.153.34-.396.51-.594.17-.198.226-.34.34-.566.113-.226.056-.424-.028-.594-.085-.17-.764-1.842-1.047-2.523-.276-.663-.556-.573-.764-.583l-.652-.011a1.25 1.25 0 00-.905.424c-.311.34-1.187 1.161-1.187 2.833s1.215 3.286 1.384 3.512c.17.226 2.392 3.652 5.797 5.121.81.35 1.442.559 1.935.716.813.259 1.553.222 2.138.135.652-.097 2.006-.82 2.289-1.612.283-.792.283-1.472.198-1.612-.085-.14-.311-.226-.65-.396z" />
      </svg>
    </Link>
  );
}
```

- [ ] **Step 4: Mount the button in `app/layout.tsx`**

Add the import and render `<WhatsAppFloatButton />` after `<CartDrawer />`, still inside `<CartProvider>`:

```tsx
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
```

```tsx
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFloatButton />
        </CartProvider>
```

- [ ] **Step 5: Verify manually**

Run: `npm run build && npm run start`, then in the browser:
- Open `http://localhost:3000/sitemap.xml` — expect XML listing `/`, `/catalogo`, `/nosotros`, `/contacto`.
- Open `http://localhost:3000/robots.txt` — expect `Allow: /` and a `Sitemap:` line.
- On any page, a green circular WhatsApp button is fixed to the bottom-right corner and opens `wa.me` in a new tab.

- [ ] **Step 6: Commit**

```bash
git add app/sitemap.ts app/robots.ts components/WhatsAppFloatButton.tsx app/layout.tsx
git commit -m "feat: add sitemap, robots, and WhatsApp float button"
```

---

### Task 13: Final verification pass

**Files:** none (verification only).

**Interfaces:** none.

- [ ] **Step 1: Run the full automated test suite**

Run: `npm test`
Expected: all suites (`products`, `cart`, `whatsapp`) pass.

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: `Compiled successfully`, all routes listed (`/`, `/catalogo`, `/nosotros`, `/contacto`, `/sitemap.xml`, `/robots.txt`) with no type or lint errors.

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual end-to-end walkthrough in the browser**

Run: `npm run dev`. In the browser:
1. Home (`/`) → click a category tile → lands on `/catalogo` pre-filtered to that category.
2. `/catalogo` → switch categories via chips → grid updates.
3. Add a product without variants, then a product with variants (confirm the selected aroma shows up in the drawer) → cart badge count updates.
4. Open the cart drawer → adjust quantity with +/− → confirm the line total and cart total update; reduce a line to 0 → line disappears.
5. Reload the page → cart contents persist (localStorage).
6. Click "Enviar pedido por WhatsApp" → a new tab opens to `https://wa.me/51976509570?text=...` with a readable itemized message and correct total; the cart empties after clicking.
7. Resize to a mobile viewport (375px) → header collapses to hamburger menu, product grid becomes 2 columns, cart drawer still usable.
8. Visit `/nosotros` and `/contacto` → content renders, WhatsApp links work.

Expected: every step behaves as described, no console errors.

- [ ] **Step 5: Final commit (if any fixes were made during verification)**

```bash
git add -A
git commit -m "chore: final verification fixes"
```

(Skip this step if verification found nothing to fix.)
