# Clean Home — Trust Banner, Category/Value Icons, Social Footer — Design Spec

Fecha: 2026-07-13

## Contexto

Tras el refresh visual anterior (ver [2026-07-13-visual-refresh-and-contact-form-design.md](2026-07-13-visual-refresh-and-contact-form-design.md)), el usuario sintió el sitio "muy simple" y pidió que se vea más **llamativo, accesible (fácil de entender) y organizado**, señalando específicamente: faltan iconos, falta más color/contraste, falta jerarquía/separación entre secciones, y falta contenido. También pidió agregar acceso a redes sociales en el footer y quitar la sección "Métodos de pago" del Home.

La dirección visual se validó con mockups en el compañero visual: se eligió la opción **"Secciones alternadas"** — el fondo alterna blanco / azul sólido / celeste suave entre secciones del Home, con una franja de confianza en azul sólido justo bajo el hero, e iconos en cada categoría. El usuario confirmó el contenido de la franja de confianza y que el cambio de iconos/color aplica a **todo el sitio** (Home, Catálogo, Nosotros), no solo al Home.

## Alcance

Cambios de contenido/estructura + iconografía sobre el sitio existente, sin nuevas dependencias (los iconos son emoji, no una librería de iconos) ni cambios de paleta (se mantiene blanco/azul; el efecto "llamativo" viene de bloques de color sólido y iconos, no de colores nuevos).

**Fuera de alcance:** rediseño del Header/CartDrawer/ProductCard (ya tienen su propio lenguaje visual del refresh anterior y no cambian aquí), cambios al Contacto más allá de lo que ya tiene, accesibilidad técnica WCAG (el usuario aclaró que "accesible" se refiere a facilidad de uso, no a auditoría de a11y).

## 1. Iconos por categoría (dato compartido)

Se agrega un campo `icon` (emoji) a cada entrada de `CATEGORIES` en `data/products.ts`, para reutilizarlo en Home, Catálogo y donde haga falta:

| Categoría | Icono |
|---|---|
| Detergentes | 🧴 |
| Papel Higiénico | 🧻 |
| Papel Toalla | 🧺 |
| Servilletas y Pañuelos | 🍽️ |
| Limpieza de Baño y Cocina | 🚿 |
| Bolsas | 🛍️ |
| Accesorios de Limpieza | 🧽 |
| Lavavajilla | 🫧 |

## 2. Home — franja de confianza + secciones alternadas + tiles con icono

Nuevo orden de secciones y fondos:

1. **Hero** (`bg-white`) — sin cambios respecto al refresh anterior.
2. **Franja de confianza** (nueva, `bg-sky-600`, texto blanco): grilla de 4 items, cada uno con un emoji grande arriba y un texto corto debajo:
   - 😊 "+40 clientes satisfechos"
   - 📱 "Pedidos por WhatsApp"
   - 🚚 "Envíos a todo el Perú"
   - 📦 "Pedidos mayoristas"
3. **Categorías** (`bg-sky-50`): mismo grid de tiles de antes, pero cada tile ahora tiene un círculo con el ícono de la categoría arriba del texto.
4. **Productos destacados** (blanco, fondo de página) — sin cambios.
5. **Se elimina** la sección "Métodos de pago" del final del Home (esa información ya está en Nosotros, Contacto, y en el footer).

## 3. Catálogo — chips con icono

Los chips de categoría (`components/CategoryFilter.tsx`) muestran el emoji de la categoría antes del label, tanto en estado activo como inactivo. El chip "Todas" no lleva icono (no representa una categoría específica).

## 4. Nosotros — iconos en Valores

Cada una de las 4 tarjetas de Valores lleva un emoji arriba del título:
- Calidad → ✅
- Confianza → 🤝
- Atención cercana → 💬
- Cumplimiento → ⏱️

## 5. Footer — redes sociales

Se agrega una cuarta columna "Síguenos" al footer, con íconos (SVG inline, sin librería nueva) de Facebook e Instagram enlazando a `#` — el usuario no tiene las cuentas creadas todavía, así que quedan como placeholder para reemplazar por la URL real más adelante. El grid del footer pasa de 3 a 4 columnas (`sm:grid-cols-2 lg:grid-cols-4` para que se acomode bien en tablet).

## Manejo de errores / casos borde

- Los links de redes sociales en `#` no rompen nada (es un ancla válida); se marcan con `aria-label` para que el ícono sea identificable aunque no tenga texto visible.
- Ningún dato de la franja de confianza es verificable automáticamente (son afirmaciones de marketing del negocio, confirmadas por el usuario) — no requieren fuente de datos ni test.

## Testing

- El campo `icon` agregado a `CATEGORIES` no rompe los tests existentes de `tests/products.test.ts` (son adiciones, no cambian `id`/`category`/`price`).
- El resto de los cambios son visuales/de contenido — se verifican manualmente en el navegador (desktop y mobile 375px): franja de confianza, iconos en categorías del Home y chips del Catálogo, iconos en Valores de Nosotros, e íconos de redes sociales en el footer con su `aria-label`.
