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
