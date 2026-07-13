# Clean Home — UX/UI Audit Fixes — Design Spec

Fecha: 2026-07-13

## Contexto

Se hizo una auditoría UX/UI del sitio ya construido (Home, Catálogo, Nosotros, Contacto, carrito). Se identificaron 8 hallazgos, de mayor a menor impacto en conversión/usabilidad, y el usuario aprobó aplicarlos todos. Dos datos reales del negocio se confirmaron con el usuario para esta ronda: **sin tienda física, atención solo por WhatsApp y delivery**, horario **lunes a sábado, 9am–7pm**.

## Alcance

Ocho mejoras puntuales sobre el sitio existente, sin nuevas dependencias ni cambios de arquitectura. No se rediseña nada visualmente más allá de lo descrito aquí.

## A. Botón flotante de WhatsApp — ocultar durante scroll activo

**Problema:** en mobile, el botón fijo (`WhatsAppFloatButton`) puede quedar visualmente sobre el botón "Agregar" de un producto en la columna derecha de la grilla del catálogo, bloqueando el clic en esa posición exacta de scroll.

**Solución:** el botón se oculta (`opacity-0` + `pointer-events-none`, con transición suave) mientras el usuario hace scroll activo, y reaparece automáticamente ~250ms después de que el scroll se detiene. Esto es crítico: no basta con ocultarlo visualmente, debe dejar de capturar clics (`pointer-events-none`) exactamente cuando podría estar tapando un botón real — que es justo durante el scroll.

## B. Chips de categoría — scroll horizontal en mobile

**Problema:** en mobile, los 9 chips de categoría envuelven en varias líneas y ocupan casi toda la pantalla antes de mostrar el primer producto.

**Solución:** los chips pasan a una sola fila con scroll horizontal en mobile (patrón estándar de apps de e-commerce), y vuelven a su comportamiento actual (envolver en varias líneas) en pantallas `sm:` en adelante, donde ya hay espacio horizontal suficiente.

## C. Buscador de productos en el Catálogo

**Problema:** con ~45 productos en 8 categorías, no hay forma de buscar por nombre — solo filtrar por categoría y escanear visualmente.

**Solución:** input de búsqueda de texto libre en `/catalogo`, sobre la grilla, que filtra `PRODUCTS` por nombre (client-side, sin backend) en tiempo real, combinado con el filtro de categoría activo. Si la combinación de búsqueda + categoría no devuelve resultados, se muestra un mensaje ("No encontramos productos con ese nombre.") en vez de una grilla vacía sin explicación.

## D. Selector de cantidad en la card de producto

**Problema:** el sitio promociona "Pedidos mayoristas" en la franja de confianza del Home, pero pedir 10 unidades de un producto requiere tocar "Agregar" 10 veces.

**Solución:** cada `ProductCard` gana un stepper de cantidad (−, número, +) antes del botón "Agregar", con valor inicial 1. Al agregar, se usa esa cantidad (la función `add()` del carrito ya acepta un segundo parámetro `quantity`, no requiere cambios en `lib/cart.ts` ni `lib/cart-context.tsx`). Después de agregar, la cantidad vuelve a 1 para el siguiente pedido.

## E. CTA de cierre en Nosotros

**Problema:** la página termina después de los Valores sin ninguna acción — el usuario que terminó de leer, convencido, tiene que buscar por su cuenta cómo pedir.

**Solución:** nueva sección al final de `/nosotros`, con el mismo lenguaje visual del hero del Home ("¿Listo para tu pedido?" + botones "Ver catálogo" / "Pedir por WhatsApp"), envuelta en `Reveal` para mantener la consistencia de animación de la página.

## F. Horario y modalidad de atención

**Problema:** ninguna página indica horario de atención ni si hay tienda física.

**Solución:** se agrega, en Contacto (junto a la tarjeta de WhatsApp) y en el Footer (columna Contacto), el texto: **"Atención solo por WhatsApp y delivery — sin tienda física"** y **"Lunes a sábado, 9am – 7pm"**.

## G. Accesibilidad — íconos decorativos

**Problema:** los emojis usados como íconos (categorías, franja de confianza, valores) no tienen `aria-hidden`, así que un lector de pantalla los anuncia como palabras sueltas junto al texto real (ej. "botella de loción Detergentes").

**Solución:** se agrega `aria-hidden="true"` a los `<span>` que contienen únicamente el emoji decorativo, en: chips de categoría (Catálogo), íconos de categoría y de la franja de confianza (Home), íconos de Valores (Nosotros). El texto/label adyacente ya es suficiente para el lector de pantalla — no se pierde información.

## H. Estado vacío del carrito

**Problema:** el carrito vacío solo muestra el texto "Aún no agregaste productos.", sin ningún elemento visual.

**Solución:** se agrega un ícono (🛒, `aria-hidden`) centrado arriba del texto existente en el estado vacío de `CartDrawer`.

## Manejo de errores / casos borde

- El buscador de productos (C) es case-insensitive y no distingue tildes especialmente (búsqueda simple por `includes()`), suficiente para el volumen de catálogo actual — no se justifica una librería de búsqueda difusa.
- El auto-ocultado del botón de WhatsApp (A) debe funcionar igual en todas las páginas (no solo Catálogo), ya que el componente es global (vive en `app/layout.tsx`).
- El stepper de cantidad (D) no permite bajar de 1 (no tiene sentido "agregar 0").

## Testing

Todos los cambios son de interacción/contenido — se verifican manualmente en el navegador (desktop y mobile 375px):
- El botón de WhatsApp se oculta durante scroll activo y no bloquea ningún "Agregar" en ninguna posición de scroll del catálogo.
- Los chips de categoría scrollean horizontalmente en mobile sin ocupar toda la pantalla.
- El buscador filtra correctamente combinado con categoría, y muestra el mensaje de "sin resultados" cuando corresponde.
- El stepper de cantidad agrega la cantidad correcta al carrito (verificar en el drawer).
- El CTA de cierre de Nosotros lleva a Catálogo y WhatsApp correctamente.
- El horario aparece en Contacto y Footer.
- Los emojis decorativos no aparecen como texto leído por separado (verificable inspeccionando el DOM: `aria-hidden="true"` presente).
- El carrito vacío muestra el ícono.

No se agregan tests automatizados nuevos: son cambios de UI/contenido sin lógica de negocio nueva verificable más allá de lo que ya cubre `lib/cart.ts` (el stepper solo reutiliza `add(item, quantity)`, ya testeado).
