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

  it("every category has a non-empty icon", () => {
    for (const category of CATEGORIES) {
      expect(category.icon.length).toBeGreaterThan(0);
    }
  });
});

import { GROUPS, PACKS, packLines, packTotal, relatedProducts, PRODUCTS as ALL } from "../data/products";

describe("groups and packs", () => {
  it("every category belongs to exactly one group", () => {
    for (const category of CATEGORIES) {
      const owners = GROUPS.filter((g) => g.categories.includes(category.id));
      expect(owners.length).toBe(1);
    }
  });

  it("every pack item points to an existing product", () => {
    for (const pack of PACKS) {
      expect(packLines(pack).length).toBe(pack.items.length);
      expect(packTotal(pack)).toBeGreaterThan(0);
    }
  });

  it("related products never include the product itself", () => {
    const product = ALL[0];
    expect(relatedProducts(product).map((p) => p.id)).not.toContain(product.id);
  });
});

import { cartSuggestions } from "../data/products";

describe("cartSuggestions", () => {
  it("never suggests products already in the cart", () => {
    const ids = ["lejia-clorox-4l", "guantes-limpieza"];
    const suggested = cartSuggestions(ids).map((p) => p.id);
    for (const id of ids) expect(suggested).not.toContain(id);
  });

  it("returns best sellers for an empty cart, without duplicates", () => {
    const suggested = cartSuggestions([], 6).map((p) => p.id);
    expect(suggested.length).toBe(6);
    expect(new Set(suggested).size).toBe(6);
  });

  it("puts related products first", () => {
    const [first] = cartSuggestions(["detergente-ariel-2kg"]);
    expect(first.category).toBe("detergentes");
  });
});

import { boughtTogether, defaultVariant, getGroupForCategory, packsWithProduct, unitPrice } from "../data/products";

describe("boughtTogether", () => {
  it("only suggests products from other groups, without the product itself or duplicates", () => {
    const product = ALL.find((p) => p.id === "detergente-ariel-2kg")!;
    const group = getGroupForCategory(product.category)!;
    const suggested = boughtTogether(product, 10);
    const ids = suggested.map((p) => p.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(ids).not.toContain(product.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of suggested) expect(group.categories).not.toContain(p.category);
  });

  it("puts products that share a pack first", () => {
    const product = ALL.find((p) => p.id === "detergente-ariel-2kg")!;
    const [first] = boughtTogether(product, 10);
    const sharedPack = packsWithProduct(product.id).flatMap((pack) => pack.items.map((i) => i.productId));
    expect(sharedPack).toContain(first.id);
  });

  it("finds packs that include a product", () => {
    expect(packsWithProduct("guantes-limpieza").map((p) => p.id)).toContain("pack-bano");
  });
});

describe("defaultVariant", () => {
  it("picks the variant shown in the photo", () => {
    expect(defaultVariant(ALL.find((p) => p.id === "detergente-orion-15kg")!)).toBe("Floral");
  });

  it("is undefined for products without variants", () => {
    expect(defaultVariant(ALL.find((p) => p.id === "lejia-clorox-4l")!)).toBeUndefined();
  });

  it("every imageVariant is one of the product's variants", () => {
    for (const p of ALL) if (p.imageVariant) expect(p.variants).toContain(p.imageVariant);
  });
});

describe("unitPrice", () => {
  it("divides the price by the units in the presentation", () => {
    expect(unitPrice(ALL.find((p) => p.id === "papel-higienico-elite-classic-500x4")!)).toEqual({ amount: 12, label: "rollo" });
    expect(unitPrice(ALL.find((p) => p.id === "detergente-orion-15kg")!)).toEqual({ amount: 4.33, label: "kg" });
  });

  it("is null when the presentation has no unit count", () => {
    expect(unitPrice(ALL.find((p) => p.id === "guantes-limpieza")!)).toBeNull();
  });
});
