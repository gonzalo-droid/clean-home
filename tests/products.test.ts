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
