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
