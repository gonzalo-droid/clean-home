# Scroll-Reveal, Cart Toast, and Card Alignment Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Nosotros and Contacto feel dynamic via scroll-reveal animations, replace the cart's auto-open-on-add with a toast notification, and fix ProductCard so "Agregar" buttons align across a grid row regardless of whether a product has a variant selector.

**Architecture:** A single reusable `Reveal` client component (IntersectionObserver-based, CSS transition, no animation library) wraps existing content on Nosotros/Contacto. The cart's existing React Context gains `toast`/`showToast` alongside its existing `isOpen`/cart state — no new context, no new dependency. The ProductCard fix is pure Tailwind class changes (flex sizing, line-clamp, margin).

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS (existing stack, no new dependencies — no animation library, no toast library).

## Global Constraints

- No new npm dependencies. `Reveal` uses the browser's native `IntersectionObserver`; `Toast` is a plain conditional render.
- `Reveal` must respect `prefers-reduced-motion: reduce` — content shows immediately, no animation, for users with that OS setting.
- The cart drawer no longer opens automatically when a product is added — `ProductCard.handleAdd` calls `showToast(...)` instead of `openCart()`. The header cart icon still opens the drawer manually, unchanged.
- Only one toast is visible at a time — calling `showToast` again before the previous one expires resets its timer rather than stacking a second toast.
- Home and Catálogo are NOT touched by this plan — only `ProductCard` (shared by both, but only its internal layout/toast-trigger changes, not page structure), Nosotros, Contacto, `ContactForm`, `lib/cart-context.tsx`, and `app/layout.tsx`.
- All previously-existing 18 Vitest tests must keep passing (no new automated tests in this plan — see spec's Testing section). `npx tsc --noEmit` and `npm run lint` must stay clean throughout. (`npm run build` may fail in network-sandboxed environments only on the unrelated Google Fonts fetch in `app/layout.tsx` — use `npx tsc --noEmit` as the network-free equivalent when that happens.)

---

### Task 1: `Reveal` scroll-reveal component

**Files:**
- Create: `components/Reveal.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: `<Reveal delayMs={number} className={string}>{children}</Reveal>` — consumed by Task 4 (Nosotros) and Task 5 (Contacto). Both `delayMs` and `className` are optional.

- [ ] **Step 1: Write `components/Reveal.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function Reveal({
  children,
  delayMs = 0,
  className = "",
}: {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}
      className={`transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: no errors (this component isn't rendered by any page yet, but must compile standalone).

- [ ] **Step 3: Commit**

```bash
git add components/Reveal.tsx
git commit -m "feat: add reusable Reveal scroll-animation component"
```

---

### Task 2: ProductCard layout fix — align "Agregar" buttons across a grid row

**Files:**
- Modify: `components/ProductCard.tsx`

**Interfaces:**
- Consumes: nothing new (same `Product` prop as before).
- Produces: no interface change — only Tailwind class changes.

- [ ] **Step 1: Make the card fill its grid cell**

In `components/ProductCard.tsx`, change the root `<div>` className from:

```tsx
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_12px_-4px_rgba(2,132,199,0.15)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_30px_-10px_rgba(2,132,199,0.35)]">
```

to:

```tsx
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_12px_-4px_rgba(2,132,199,0.15)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_30px_-10px_rgba(2,132,199,0.35)]">
```

(Only `h-full` was added. CSS Grid already stretches row items to equal height by default, so `h-full` lets each card actually fill that height instead of shrinking to its content.)

- [ ] **Step 2: Clamp the product name to 2 lines**

Change the name `<p>` from:

```tsx
      <p className="text-sm font-semibold text-slate-800">{product.name}</p>
```

to:

```tsx
      <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-slate-800">{product.name}</p>
```

- [ ] **Step 3: Pin the price/button row to the bottom of the card**

Change the price/button row `<div>` from:

```tsx
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
```

to:

```tsx
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
```

- [ ] **Step 4: Verify manually in the browser**

Run: `npx tsc --noEmit` (must pass), then `npm run dev` and open `/catalogo`.
Expected: in any row of the product grid that mixes a product with a variant `<select>` (e.g. "Detergente Orion 15 KG") and one without (e.g. "Detergente Ariel en Polvo"), both cards are now the same height and their "Agregar" buttons line up horizontally. A product with a very long name wraps to at most 2 lines with "…" if it would overflow, instead of stretching the card taller than its neighbors. Check `/` (featured products) too, and check mobile (375px) — 2-column grid should show aligned buttons within each row.

- [ ] **Step 5: Commit**

```bash
git add components/ProductCard.tsx
git commit -m "fix: align Agregar button position across product card grid rows"
```

---

### Task 3: Add-to-cart toast (replaces auto-opening the cart)

**Files:**
- Modify: `lib/cart-context.tsx`
- Create: `components/Toast.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/ProductCard.tsx`

**Interfaces:**
- Consumes: nothing new for `lib/cart-context.tsx`.
- Produces: `useCart()` now also returns `toast: string | null` and `showToast: (message: string) => void` — consumed by `components/Toast.tsx` (reads `toast`) and `components/ProductCard.tsx` (calls `showToast`).

- [ ] **Step 1: Replace `lib/cart-context.tsx`**

```tsx
"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  type CartLine,
  addItem,
  removeItem,
  updateQuantity,
  cartTotal,
  cartCount,
} from "./cart";

const STORAGE_KEY = "clean-home-cart";
const TOAST_DURATION_MS = 2500;

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
  toast: string | null;
  showToast: (message: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe localStorage hydration on mount, not a synchronization anti-pattern: localStorage doesn't exist during SSR, so it can't be read in a lazy useState initializer without crashing/hydration mismatch.
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

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

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
    toast,
    showToast: (message) => {
      setToast(message);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
```

- [ ] **Step 2: Write `components/Toast.tsx`**

```tsx
"use client";

import { useCart } from "@/lib/cart-context";

export default function Toast() {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300">
      ✅ {toast}
    </div>
  );
}
```

- [ ] **Step 3: Mount `Toast` in `app/layout.tsx`**

Add the import:

```tsx
import Toast from "@/components/Toast";
```

And render it after `<WhatsAppFloatButton />`, still inside `<CartProvider>`:

```tsx
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFloatButton />
          <Toast />
        </CartProvider>
```

- [ ] **Step 4: Wire `ProductCard` to show the toast instead of opening the cart**

In `components/ProductCard.tsx`, change:

```tsx
  const { add, openCart } = useCart();
```

to:

```tsx
  const { add, showToast } = useCart();
```

And inside `handleAdd`, change:

```tsx
    openCart();
```

to:

```tsx
    showToast("Agregado al carrito");
```

- [ ] **Step 5: Verify manually in the browser**

Run: `npx tsc --noEmit` (must pass), then `npm run dev` and open `/catalogo`. Click "Agregar" on any product.
Expected: the cart drawer does NOT open automatically. A dark pill-shaped toast reading "✅ Agregado al carrito" appears near the bottom of the screen (above the WhatsApp float button, not overlapping it) and disappears on its own after ~2.5 seconds. Click "Agregar" on a second product before the toast disappears — the toast stays showing (message unchanged, timer resets) rather than showing two toasts. The header cart icon still opens the drawer when clicked manually, and the drawer still shows the added items with correct quantities.

- [ ] **Step 6: Commit**

```bash
git add lib/cart-context.tsx components/Toast.tsx app/layout.tsx components/ProductCard.tsx
git commit -m "feat: add add-to-cart toast, stop auto-opening cart drawer"
```

---

### Task 4: Nosotros — alternating background + cascading reveal

**Files:**
- Modify: `app/nosotros/page.tsx`

**Interfaces:**
- Consumes: `Reveal` from `components/Reveal.tsx` (Task 1).
- Produces: the updated `/nosotros` route.

- [ ] **Step 1: Replace `app/nosotros/page.tsx`**

```tsx
import type { Metadata } from "next";
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value, index) => (
          <Reveal key={value.title} delayMs={index * 100}>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <span className="mb-2 block text-2xl">{value.icon}</span>
              <h3 className="mb-1 text-sm font-bold text-sky-600">{value.title}</h3>
              <p className="text-xs text-slate-600">{value.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify manually in the browser**

Run: `npx tsc --noEmit` (must pass), then `npm run dev` and open `/nosotros`. Scroll down slowly from the top.
Expected: the intro paragraph fades/slides into view first, then the Misión/Visión block (now inside a rounded light-blue container, visually separated from the intro) fades in, then the 4 Valores cards fade in one after another in a quick cascade (not all at once) as they enter the viewport. Reload and immediately scroll to the bottom without pausing — content should still end up fully visible (no permanently-stuck-invisible elements).

- [ ] **Step 3: Commit**

```bash
git add app/nosotros/page.tsx
git commit -m "feat: add scroll-reveal and section separation to Nosotros"
```

---

### Task 5: Contacto — reveal + more visible form focus states

**Files:**
- Modify: `app/contacto/page.tsx`
- Modify: `components/ContactForm.tsx`

**Interfaces:**
- Consumes: `Reveal` from `components/Reveal.tsx` (Task 1).
- Produces: the updated `/contacto` route.

- [ ] **Step 1: Replace `app/contacto/page.tsx`**

```tsx
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";

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
        <Reveal>
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
        </Reveal>

        <Reveal delayMs={150}>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Enhance focus states in `components/ContactForm.tsx`**

Replace the `className` on all three fields (the `Nombre` `<input>`, the `Teléfono` `<input>`, and the `Mensaje` `<textarea>` — all three currently share the exact same className string) from:

```tsx
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
```

to:

```tsx
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 transition-all duration-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
```

(This is the same change applied 3 times — once per field. Nothing else about the form changes.)

- [ ] **Step 3: Verify manually in the browser**

Run: `npx tsc --noEmit` (must pass), then `npm run dev` and open `/contacto`. Scroll down slowly from the top, then click into each form field.
Expected: the WhatsApp card fades in first, the contact form fades in slightly after it. Clicking into Nombre/Teléfono/Mensaje shows a visibly animated focus ring (smooth transition, more prominent glow than before) rather than an instant flat outline. The form still submits correctly (fill all 3 fields, submit, confirm a WhatsApp tab opens with the message) — this must keep working exactly as before.

- [ ] **Step 4: Commit**

```bash
git add app/contacto/page.tsx components/ContactForm.tsx
git commit -m "feat: add scroll-reveal and animated focus states to Contacto"
```

---

### Task 6: Final verification pass

**Files:** none (verification only).

**Interfaces:** none.

- [ ] **Step 1: Run the full automated test suite**

Run: `npm test`
Expected: all suites pass — 18/18 (no new automated tests in this plan; confirms nothing regressed).

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
1. `/catalogo` — find a grid row with a mixed set of products (some with a variant dropdown, some without) and confirm every "Agregar" button in that row is at the same height. Add a product to the cart — confirm the drawer does NOT open automatically, a toast "✅ Agregado al carrito" appears and disappears on its own after ~2.5s, and the header cart badge count increases. Open the drawer manually via the header cart icon and confirm the item is there with the right quantity/variant.
2. `/nosotros` — scroll from top to bottom slowly; confirm the intro, the Misión/Visión block (now visually separated with a light-blue background), and the 4 Valores cards (cascading, not all at once) each animate into view once, and nothing stays permanently invisible.
3. `/contacto` — scroll down; confirm both the WhatsApp card and the form animate in. Click into each form field and confirm a clearly animated focus ring appears. Fill and submit the form — confirm it still opens WhatsApp with the correct message (this must not have regressed from the previous plan).
4. If your browser/OS lets you emulate `prefers-reduced-motion: reduce` (e.g. Chrome DevTools → Rendering tab → "Emulate CSS media feature prefers-reduced-motion"), reload `/nosotros` with it enabled and confirm all content is visible immediately with no fade/slide animation.
5. Confirm nothing from earlier plans regressed: Home hero/trust banner/categories, catalog category chip icons, and the cart's WhatsApp checkout flow all still work.

Expected: every step behaves as described, no console errors, no visual overlap or overflow on mobile.

- [ ] **Step 5: Final commit (if any fixes were made during verification)**

```bash
git add -A
git commit -m "chore: final verification fixes for scroll-reveal, toast, and card alignment"
```

(Skip this step if verification found nothing to fix.)
