# Clean Home — Catálogo Web — Design Spec

Fecha: 2026-07-13

## Contexto

El usuario tiene un negocio de venta de productos de limpieza (Perú, pedidos actuales por WhatsApp al 976509570) cuyo catálogo hasta ahora es un PDF (presentación Canva de 14 páginas) con ~40 productos y precios en soles. Se requiere una web tipo catálogo para reemplazar/complementar el PDF, que permita a los clientes ver los productos y armar un pedido para enviarlo por WhatsApp.

Fuente de datos: `CATALOGO DE PRODUCTOS DE LIMPIEZA.pdf` (Downloads del usuario). Se extrajo el texto y las imágenes de cada producto para usarlos en la web.

## Objetivo

Sitio web "Clean Home": Home, Catálogo, Nosotros, Contacto, con carrito simple que arma y envía un pedido por WhatsApp. Next.js + React, con buen SEO.

## Alcance (fuera de alcance)

- Sin backend/CMS ni base de datos: catálogo como datos estáticos en el código.
- Sin pagos online (el pago se coordina por WhatsApp, como hoy: Yape, transferencia, efectivo).
- Sin autenticación de usuarios ni panel de administración.
- Sin despliegue a producción en este trabajo (queda listo para correr en local / desplegar después).

## Stack técnico

- **Next.js (App Router) + React + TypeScript**
- **Tailwind CSS** para estilos (rapidez y consistencia responsive)
- Datos del catálogo en `data/products.ts`, tipados, sin CMS — el catálogo es pequeño y lo mantiene el propio usuario editando código.
- Carrito con **React Context + localStorage** (persiste entre páginas sin backend).
- Imágenes de producto: extraídas del PDF, optimizadas (WebP) y servidas con `next/image`.
- SEO: `generateMetadata` por página, Open Graph, `sitemap.ts`, `robots.ts`, JSON-LD (`Store`/`Product`) en catálogo.

## Estructura de páginas

- `/` — Home: hero con CTA, categorías destacadas, algunos productos destacados, sección de métodos de pago aceptados (Yape, transferencia, efectivo), botón flotante de WhatsApp.
- `/catalogo` — grilla de todos los productos con filtro por categoría (chips/tabs). Cada card: imagen, nombre, presentación/variantes si aplica, precio, botón "Agregar".
- `/nosotros` — texto sobre el negocio (breve, genérico ya que el PDF no trae historia — el usuario puede editarlo luego), qué garantiza (calidad, atención por WhatsApp), zona de atención.
- `/contacto` — teléfono/WhatsApp, horario de atención, botón directo a WhatsApp, métodos de pago.
- Carrito: drawer/panel accesible desde el header en cualquier página (ícono con contador), no es una ruta propia.

## Modelo de datos

```ts
type Category =
  | "detergentes"
  | "papel-higienico"
  | "papel-toalla"
  | "servilletas-panuelos"
  | "limpieza-bano-cocina"
  | "bolsas"
  | "accesorios-limpieza"
  | "lavavajilla";

interface Product {
  id: string;
  name: string;
  category: Category;
  presentation: string; // ej. "2 KG", "500M X 4"
  variants?: string[]; // ej. aromas: ["Lavanda", "Floral", "Limón"]
  price: number; // soles
  priceUnit?: string; // ej. "unidad", "paquete" cuando el mismo producto tiene 2 precios
  image: string; // ruta en /public
}
```

Catálogo completo a cargar (extraído del PDF, agrupado por categoría):

**Detergentes**: Ariel en polvo 2kg (S/28.00), Orion 15kg — aroma Lavanda/Floral/Limón (S/65.00), Sapolio 2kg (S/15.50), Orion 150gr — aroma Rosas/Limón/Lavanda (S/1.00)

**Papel higiénico**: Jumbo 500m x4 (S/38.00), Elite Professional Classic 500m x4 (S/48.00), Elite Rendipel x100mts x6 rollos (S/20.00), Classic 24x2 13mts (S/25.00)

**Papel toalla**: 200m x2 GH (S/39.00), Ecológico 200m x2 (S/38.00), Elite Classic 200m x2 (S/38.00), Mega Rollo Super unidad (S/3.00), Mega Rollo Super paquete x12 (S/30.00), 150 hojas Elite (S/4.50), Genio 500 hojas unidad (S/10.00), Genio 500 hojas paquete x6 (S/58.00)

**Servilletas y pañuelos**: Pañuelos desechables pack x8 (S/4.50), Servilleta Classic 300 unidad (S/2.00), Servilleta Classic 300x18 paquete (S/32.00), Servilleta Elite Dob en 4 Plus 100x24 30x30 unidad (S/3.50), Servilleta Elite Dob en 4 Plus 100x24 30x30 paquete (S/75.00)

**Limpieza baño/cocina**: Lejía Sapolio (S/10.00), Lejía Clorox 4L (S/10.50), Limpiatodo Sapolio distintos aromas (S/13.50), Limpiatodo Virutex 900ml (S/2.90), Ácido limpiador sacasarro (S/12.50), Jabón líquido Aval 400ml (S/7.00), Desatorador para cocinas (S/9.50), Desatorador para baños (S/9.50), Pastillas para tanque Ebriel azul x2 unid (S/6.50), Aromatizante de baño unidad (S/2.00) / paquete (S/5.00)

**Bolsas**: Bolsas negras 20x30 (S/7.00), Bolsas negras 140lt (S/18.00)

**Accesorios de limpieza**: Display esponja para platos "2 en 1" 7 unidades (S/14.00), Display esponja cocina 12 unidades (S/20.00), Paños amarillos Virutex (S/14.50), Guantes de limpieza (S/5.50), Paño de limpieza multiuso 6 unid Virutex (S/7.00), Trapeador microfibra (S/6.50), Paño microfibra grande (S/5.50), Paño microfibra pequeño (S/4.50), Recogedor (S/7.50)

**Lavavajilla**: Lavavajilla líquida 3L Orion (S/20.00), Lavavajilla en pasta 1kg Patito (S/5.00)

Total aprox. 40 productos / variantes de precio.

## Carrito y flujo de pedido por WhatsApp

- Botón "Agregar" en cada card de producto (con selector de variante si tiene aromas, y selector de cantidad).
- Ícono de carrito en el header con contador de ítems; abre un drawer lateral con la lista, cantidades editables, opción de quitar, y total estimado en soles.
- Botón "Enviar pedido por WhatsApp" arma un mensaje de texto pre-formateado (nombre de producto, variante, cantidad, precio, total) y abre `https://wa.me/51976509570?text=...` (URL-encoded) en nueva pestaña/app.
- El carrito persiste en `localStorage` para no perderse al navegar entre páginas.
- Aclaración visible: "El pedido se confirma por WhatsApp, no se procesa pago en la web."

## SEO

- Metadata específica por página (title, description) enfocada en "productos de limpieza al por mayor/menor" + ubicación si se define.
- Open Graph con imagen representativa.
- `sitemap.xml` y `robots.txt` generados.
- JSON-LD `Store` en layout raíz y `Product` en cada card del catálogo (nombre, precio, moneda PEN, disponibilidad).
- HTML semántico, `alt` descriptivo en todas las imágenes de producto.

## Diseño visual

- Paleta "fresco/clean": celeste, blanco, acentos verde menta; tipografía sans-serif limpia (ej. Inter o similar vía `next/font`).
- Mobile-first: la mayoría de clientes pedirá desde el celular. Header con menú hamburguesa en mobile, carrito accesible con un toque.
- Cards de producto con imagen real (fondo neutro, recortadas/optimizadas), precio destacado, badge de categoría.

## Manejo de errores / casos borde

- Producto sin imagen disponible: fallback a un ícono genérico de categoría (no debería ocurrir si todas las imágenes se extraen bien, pero se cubre por robustez).
- Carrito vacío: el botón de WhatsApp está deshabilitado o muestra mensaje "agrega productos primero".
- `localStorage` no disponible (SSR/modo privado): el carrito funciona en memoria para esa sesión sin persistir, sin romper la página.

## Testing

- Verificación manual en navegador (mobile y desktop) del flujo completo: navegar catálogo → filtrar categoría → agregar productos con variantes → editar cantidades → enviar por WhatsApp (verificar que la URL `wa.me` se arma correctamente).
- Chequeo de build de Next.js sin errores y `next lint` limpio.
- No se plantean tests automatizados (unitarios/e2e) dado el alcance y tipo de proyecto; se prioriza verificación manual end-to-end.
