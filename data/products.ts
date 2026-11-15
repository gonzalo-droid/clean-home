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
  /** Variante que muestra la foto (aroma del empaque). Es también la variante elegida por defecto. */
  imageVariant?: string;
  /** Cuántas unidades trae la presentación, para mostrar el precio por unidad (solo si count > 1). */
  unit?: { count: number; label: string };
  price: number;
  image: string | null;
}

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

const img = (slug: string) => `/images/products/${slug}.webp`;

export const PRODUCTS: Product[] = [
  // Detergentes
  {
    id: "detergente-ariel-2kg",
    name: "Detergente Ariel en Polvo",
    category: "detergentes",
    presentation: "2 KG",
    unit: { count: 2, label: "kg" },
    price: 28.0,
    image: img("detergente-ariel-2kg"),
  },
  {
    id: "detergente-orion-15kg",
    name: "Detergente Orion",
    category: "detergentes",
    presentation: "15 KG",
    variants: ["Lavanda", "Floral", "Limón"],
    imageVariant: "Floral",
    unit: { count: 15, label: "kg" },
    price: 65.0,
    image: img("detergente-orion-15kg"),
  },
  {
    id: "detergente-sapolio-2kg",
    name: "Detergente Sapolio",
    category: "detergentes",
    presentation: "2 KG",
    unit: { count: 2, label: "kg" },
    price: 15.5,
    image: img("detergente-sapolio-2kg"),
  },
  {
    id: "detergente-orion-150gr",
    name: "Detergente Orion",
    category: "detergentes",
    presentation: "150 GR",
    variants: ["Rosas", "Limón", "Lavanda"],
    imageVariant: "Rosas",
    price: 1.0,
    image: img("detergente-orion-150gr"),
  },

  // Papel higiénico
  {
    id: "papel-higienico-jumbo-500x4",
    name: "Papel Higiénico Jumbo",
    category: "papel-higienico",
    presentation: "500M X 4",
    unit: { count: 4, label: "rollo" },
    price: 38.0,
    image: img("papel-higienico-jumbo-500x4"),
  },
  {
    id: "papel-higienico-elite-classic-500x4",
    name: "Papel Higiénico Elite Professional Classic",
    category: "papel-higienico",
    presentation: "500M X 4",
    unit: { count: 4, label: "rollo" },
    price: 48.0,
    image: img("papel-higienico-elite-classic-500x4"),
  },
  {
    id: "papel-higienico-rendipel-100mts-x6",
    name: "Papel Higiénico Elite Rendipel",
    category: "papel-higienico",
    presentation: "100MTS X 6 Rollos",
    unit: { count: 6, label: "rollo" },
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
    unit: { count: 2, label: "rollo" },
    price: 38.0,
    image: img("papel-toalla-ecologico-200m-x2"),
  },
  {
    id: "papel-toalla-elite-classic-200m-x2",
    name: "Papel Toalla Elite Classic",
    category: "papel-toalla",
    presentation: "200M X 2",
    unit: { count: 2, label: "rollo" },
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
    unit: { count: 12, label: "rollo" },
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
    unit: { count: 6, label: "unidad" },
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
    unit: { count: 18, label: "unidad" },
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
    unit: { count: 4, label: "litro" },
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
    unit: { count: 2, label: "unidad" },
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
    unit: { count: 12, label: "unidad" },
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
    unit: { count: 6, label: "unidad" },
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
    unit: { count: 3, label: "litro" },
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

export type GroupId = "lavanderia" | "papel" | "bano-cocina" | "accesorios";

export interface CategoryGroup {
  id: GroupId;
  label: string;
  description: string;
  categories: Category[];
  image: string;
}

export const GROUPS: CategoryGroup[] = [
  {
    id: "lavanderia",
    label: "Lavandería",
    description: "Detergentes en polvo para toda la ropa",
    categories: ["detergentes"],
    image: img("detergente-orion-15kg"),
  },
  {
    id: "papel",
    label: "Papel y desechables",
    description: "Higiénico, toalla, servilletas y bolsas",
    categories: ["papel-higienico", "papel-toalla", "servilletas-panuelos", "bolsas"],
    image: img("papel-toalla-genio-500-hojas"),
  },
  {
    id: "bano-cocina",
    label: "Baño y cocina",
    description: "Lejía, limpiatodo, desatoradores y lavavajilla",
    categories: ["limpieza-bano-cocina", "lavavajilla"],
    image: img("limpiatodo-sapolio"),
  },
  {
    id: "accesorios",
    label: "Accesorios y hogar",
    description: "Paños, trapeadores, guantes y esponjas",
    categories: ["accesorios-limpieza"],
    image: img("trapeador-microfibra"),
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getCategoryLabel(id: Category): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function getGroupForCategory(id: Category): CategoryGroup | undefined {
  return GROUPS.find((g) => g.categories.includes(id));
}

export function productsInGroup(groupId: GroupId): Product[] {
  const group = GROUPS.find((g) => g.id === groupId);
  if (!group) return [];
  return PRODUCTS.filter((p) => group.categories.includes(p.category));
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id);
  const group = getGroupForCategory(product.category);
  const sameGroup = group
    ? PRODUCTS.filter(
        (p) => group.categories.includes(p.category) && p.category !== product.category
      )
    : [];
  return [...sameCategory, ...sameGroup].slice(0, limit);
}

/** Productos más pedidos (selección manual). */
export const BEST_SELLER_IDS = [
  "detergente-ariel-2kg",
  "papel-higienico-elite-classic-500x4",
  "lejia-clorox-4l",
  "limpiatodo-sapolio",
  "papel-toalla-genio-500-hojas-unidad",
  "guantes-limpieza",
  "trapeador-microfibra",
  "lavavajilla-pasta-patito-1kg",
];

export interface Pack {
  id: string;
  name: string;
  description: string;
  items: { productId: string; quantity: number }[];
}

/** Combos armados. El precio es la suma de los productos (sin descuento inventado). */
export const PACKS: Pack[] = [
  {
    id: "pack-hogar",
    name: "Pack Hogar",
    description: "Lo básico del mes para la casa: ropa, pisos y papel.",
    items: [
      { productId: "detergente-ariel-2kg", quantity: 1 },
      { productId: "lejia-clorox-4l", quantity: 1 },
      { productId: "papel-higienico-classic-24x2-13mts", quantity: 1 },
      { productId: "limpiatodo-sapolio", quantity: 1 },
    ],
  },
  {
    id: "pack-bano",
    name: "Pack Baño",
    description: "Deja el baño impecable y con buen aroma.",
    items: [
      { productId: "acido-limpiador-sacasarro", quantity: 1 },
      { productId: "desatorador-banos", quantity: 1 },
      { productId: "pastillas-tanque-ebriel-x2", quantity: 1 },
      { productId: "aromatizante-bano-paquete", quantity: 1 },
      { productId: "guantes-limpieza", quantity: 1 },
    ],
  },
  {
    id: "pack-cocina",
    name: "Pack Cocina",
    description: "Platos, superficies y desagüe sin complicaciones.",
    items: [
      { productId: "lavavajilla-pasta-patito-1kg", quantity: 2 },
      { productId: "display-esponja-platos-2en1-7unid", quantity: 1 },
      { productId: "desatorador-cocinas", quantity: 1 },
      { productId: "panos-amarillos-virutex", quantity: 1 },
      { productId: "papel-toalla-genio-500-hojas-unidad", quantity: 1 },
    ],
  },
  {
    id: "pack-oficina",
    name: "Pack Oficina",
    description: "Para baños y cocinas de oficina o negocio.",
    items: [
      { productId: "papel-higienico-jumbo-500x4", quantity: 1 },
      { productId: "papel-toalla-elite-classic-200m-x2", quantity: 1 },
      { productId: "jabon-liquido-aval-400ml", quantity: 2 },
      { productId: "bolsas-negras-140lt", quantity: 1 },
    ],
  },
];

export function packLines(pack: Pack): { product: Product; quantity: number }[] {
  return pack.items.flatMap(({ productId, quantity }) => {
    const product = getProduct(productId);
    return product ? [{ product, quantity }] : [];
  });
}

export function packTotal(pack: Pack): number {
  return packLines(pack).reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
}

/** Productos sugeridos para un carrito: relacionados primero, luego los más pedidos. */
export function cartSuggestions(cartProductIds: string[], limit = 8): Product[] {
  const inCart = new Set(cartProductIds);
  const picked: Product[] = [];
  const push = (p: Product | undefined) => {
    if (p && !inCart.has(p.id) && !picked.some((x) => x.id === p.id)) picked.push(p);
  };
  for (const id of cartProductIds) {
    const product = getProduct(id);
    if (product) relatedProducts(product, 3).forEach(push);
  }
  BEST_SELLER_IDS.forEach((id) => push(getProduct(id)));
  return picked.slice(0, limit);
}

/** Sugerencias para la página de un producto: relacionados primero, luego los más pedidos. */
/** Variante elegida por defecto: la de la foto, para que lo que se ve coincida con lo que se pide. */
export function defaultVariant(product: Product): string | undefined {
  if (!product.variants) return undefined;
  return product.imageVariant && product.variants.includes(product.imageVariant)
    ? product.imageVariant
    : product.variants[0];
}

/** Precio por unidad de la presentación (p. ej. S/ 12.00 por rollo), o null si no aplica. */
export function unitPrice(product: Product): { amount: number; label: string } | null {
  if (!product.unit || product.unit.count <= 1) return null;
  return { amount: Math.round((product.price / product.unit.count) * 100) / 100, label: product.unit.label };
}

/**
 * «Se pide junto con»: productos de OTRO grupo. Primero los que comparten un pack con este
 * producto, luego los más pedidos.
 */
export function boughtTogether(product: Product, limit = 10): Product[] {
  const group = getGroupForCategory(product.category);
  const picked: Product[] = [];
  const push = (p: Product | undefined) => {
    if (!p || p.id === product.id || picked.some((x) => x.id === p.id)) return;
    if (group && group.categories.includes(p.category)) return;
    picked.push(p);
  };
  for (const pack of PACKS) {
    if (pack.items.some((i) => i.productId === product.id)) pack.items.forEach((i) => push(getProduct(i.productId)));
  }
  for (const id of BEST_SELLER_IDS) push(getProduct(id));
  return picked.slice(0, limit);
}

export function packsWithProduct(productId: string): Pack[] {
  return PACKS.filter((pack) => pack.items.some((i) => i.productId === productId));
}
