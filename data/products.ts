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
