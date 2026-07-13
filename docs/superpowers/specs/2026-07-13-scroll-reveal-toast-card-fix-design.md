# Clean Home — Scroll-Reveal Interactivity, Add-to-Cart Toast, Card Alignment Fix — Design Spec

Fecha: 2026-07-13

## Contexto

Tras dos rondas de refresh visual, el usuario sigue sin sentir el sitio "dinámico, interactivo y limpio", y señaló 3 problemas concretos:
1. Las cards de producto no alinean su botón "Agregar" — las que tienen selector de aroma son más altas, así que el botón queda en distinta posición según la fila.
2. Al agregar un producto no hay confirmación clara más allá de que se abre el carrito (lo cual además interrumpe la navegación si el usuario quiere seguir agregando productos).
3. Nosotros y Contacto se sienten "muy simples" — piden separar mejor las secciones y mejorar la interacción.

Se exploraron 3 direcciones para el punto 3 con el compañero visual (tabs, acordeón, aparición al hacer scroll) y el usuario eligió **"aparición al hacer scroll"**, pidiendo que se adapte con criterio de diseño. Esta spec formaliza esa adaptación.

## Alcance

- Un componente reutilizable de scroll-reveal, aplicado a Nosotros y Contacto (no a Home ni Catálogo en esta ronda — ya tienen su propio lenguaje visual del refresh anterior y no fueron mencionados).
- Un sistema de notificación toast para "Agregado al carrito", reemplazando la apertura automática del carrito al agregar un producto.
- Un fix de layout en `ProductCard` para que el botón "Agregar" quede siempre alineado en la misma posición dentro de una fila de la grilla.
- Mejora de los estados de foco en `ContactForm` para que se sientan más "vivos" al interactuar.

**Fuera de alcance:** Home y Catálogo (sin cambios en esta ronda), animaciones basadas en librerías externas (todo se resuelve con CSS transitions + Intersection Observer nativo, sin dependencias nuevas).

## 1. Componente `Reveal` (scroll-reveal reutilizable)

Nuevo `components/Reveal.tsx`, client component genérico: envuelve cualquier contenido, empieza en `opacity-0` + `translate-y-6`, y al entrar en el viewport (vía `IntersectionObserver`, disparado una sola vez) transiciona a `opacity-100` + `translate-y-0` con `transition-all duration-700`. Acepta una prop opcional `delayMs` (para escalonar varios elementos en cascada, ej. las 4 tarjetas de Valores).

**Accesibilidad:** si el sistema del usuario tiene `prefers-reduced-motion: reduce` activado, el componente se muestra directamente visible sin animar (se detecta con `window.matchMedia`, sin necesidad de flags nuevos en Tailwind).

## 2. Nosotros — secciones alternadas + reveal en cascada

Estructura actualizada:
- Intro (fondo blanco) — con `Reveal`.
- Misión/Visión (fondo `bg-sky-50`, para separación visual clara respecto a la intro) — con `Reveal`.
- Valores (fondo blanco) — cada una de las 4 tarjetas envuelta en su propio `Reveal` con `delayMs` creciente (0, 100, 200, 300ms aprox.) para que aparezcan en cascada, no todas a la vez.

## 3. Contacto — reveal + foco más marcado

- La tarjeta de WhatsApp y el `ContactForm` (los dos elementos del grid de 2 columnas) se envuelven cada uno en su propio `Reveal`, con un pequeño `delayMs` en el segundo para que no aparezcan exactamente al mismo tiempo.
- Los inputs/textarea de `ContactForm` cambian su estado de foco de un anillo fino estático a una transición visible: borde y sombra animados (`transition-shadow`/`transition-colors` con una sombra celeste más presente al enfocar), para que se sienta una respuesta más clara al tocar/hacer clic.

## 4. Fix de alineación en `ProductCard`

- La card raíz pasa a ocupar toda la altura de su celda de grilla (`h-full flex flex-col`) — como CSS grid ya estira las celdas de una fila a la misma altura por defecto, esto hace que todas las cards de una fila midan lo mismo.
- El nombre del producto se limita a 2 líneas (`line-clamp-2`) con una altura mínima reservada, para que nombres muy largos no desbalanceen la grilla más de lo necesario.
- La fila de precio + botón "Agregar" se ancla al final de la card (`mt-auto`), así el botón siempre queda en la misma posición vertical sin importar si la card tiene selector de aroma o no.

## 5. Toast "Agregado al carrito"

- `lib/cart-context.tsx` agrega al contexto: `toast: string | null` y `showToast(message: string): void`. `showToast` reemplaza el mensaje actual y programa su limpieza automática (`toast = null`) a los 2.5 segundos; si se llama de nuevo antes de que expire, reinicia el temporizador (no se acumulan toasts, solo se reemplaza el mensaje visible).
- Nuevo `components/Toast.tsx`: lee `toast` del contexto, y cuando no es `null` muestra una notificación fija (`fixed bottom-24 left-1/2 -translate-x-1/2`, por encima del botón flotante de WhatsApp pero sin taparlo) con transición de aparición/desaparición. Se monta en `app/layout.tsx` junto a `CartDrawer` y `WhatsAppFloatButton`.
- `ProductCard.handleAdd`: ya no llama a `openCart()` — en su lugar llama a `showToast("Agregado al carrito")`. El carrito ya no se abre automáticamente al agregar; el usuario lo abre manualmente con el ícono del header cuando quiera revisarlo.

## Manejo de errores / casos borde

- Si el navegador no soporta `IntersectionObserver` (extremadamente raro hoy), `Reveal` debe mostrar el contenido visible por defecto en vez de quedar oculto para siempre — se verifica la existencia de `window.IntersectionObserver` antes de usarlo.
- Agregar varios productos seguidos solo reinicia el temporizador del toast existente, nunca apila mensajes ni crea múltiples notificaciones simultáneas.
- El fix de alineación de `ProductCard` no cambia ningún dato ni comportamiento de agregar al carrito, solo el layout visual.

## Testing

- Todos estos cambios son de interacción/visual — se verifican manualmente en el navegador (desktop y mobile 375px): scroll-reveal en Nosotros y Contacto (incluyendo con "reducir movimiento" activado en el sistema operativo si es posible probarlo), alineación de botones "Agregar" en una fila con cards mixtas (con y sin selector de aroma), y el toast apareciendo y desapareciendo solo al agregar productos, sin que el carrito se abra automáticamente.
- No se requieren tests automatizados nuevos: no hay lógica de negocio nueva más allá de un temporizador simple (`showToast`), que es UI efímera, no un cálculo verificable como `buildWhatsAppOrderUrl`.
