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
