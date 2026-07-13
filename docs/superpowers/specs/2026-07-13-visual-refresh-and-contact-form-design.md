# Clean Home — Visual Refresh (Home/Catálogo) + Nosotros content + Contact Form — Design Spec

Fecha: 2026-07-13

## Contexto

El sitio "Clean Home" (Next.js) ya está construido y funcionando: Home, Catálogo, Nosotros, Contacto, carrito con checkout por WhatsApp. Ver spec original en [2026-07-13-clean-home-catalogo-design.md](2026-07-13-clean-home-catalogo-design.md).

El usuario pidió tres mejoras:
1. Contacto: agregar un formulario de contacto además del número de WhatsApp que ya existe.
2. Nosotros: agregar Visión, Misión y Valores (contenido estándar del rubro).
3. Home y Catálogo: mejorar el UI/UX de todo el flujo para que se vea más llamativo y minimalista, jugando con blanco y azul.

Las direcciones visuales para el punto 3 se validaron con mockups en el compañero visual de brainstorming: se eligió la opción **"Tipografía grande"** para el hero (fondo blanco puro, texto grande como protagonista, un solo acento azul) y la opción **"Flotante con sombra azulada"** para las cards de producto (fondo de imagen en degradado celeste, sombra con tinte azul, botón píldora azul con sombra propia). El usuario también pidió micro-animaciones sutiles (hover con leve elevación, transiciones suaves).

## Alcance

Este es un refresh visual + dos features de contenido sobre el sitio existente — no cambia el stack, el modelo de datos, ni el flujo del carrito. No requiere plan separado por subsistema: es un solo paquete de cambios de UI cohesivo.

**Fuera de alcance:** rediseño del Header/Footer/CartDrawer (se mantienen como están), nuevas categorías o productos, backend para el formulario de contacto.

## 1. Sistema visual (aplica a Home y Catálogo)

- **Hero (Home):** tipografía extra grande (`text-5xl`/`text-6xl` en desktop), fondo blanco puro (sin degradado), la palabra o frase clave del título en `text-sky-600`. CTA primario sólido azul, CTA secundario outline.
- **Cards de producto** (`components/ProductCard.tsx`, usado en Home destacados y en Catálogo): 
  - Fondo de la imagen en degradado celeste suave (`from-sky-50 to-sky-100/50` o similar) en vez de `bg-slate-50` plano.
  - Sombra de la card con tinte azul en vez de gris (`shadow-[0_10px_25px_-8px_rgba(2,132,199,0.25)]` o el equivalente más cercano disponible en Tailwind vía clases arbitrarias).
  - Botón "Agregar" (ya es píldora azul `rounded-full bg-sky-500` hoy): se le agrega una sombra azulada propia que hoy no tiene.
  - Hover: la card se eleva levemente (`hover:-translate-y-1`) y la sombra se intensifica; transición suave (`transition` + `duration-200`).
- **Category tiles (Home):** mismo tratamiento elevado/hover que las product cards, para que se sientan parte del mismo sistema (hoy son cards planas con borde).
- **Chips de categoría (Catálogo, `components/CategoryFilter.tsx`):** el estado inactivo pasa de fondo gris (`bg-slate-100`) a fondo blanco con borde sutil (`bg-white border border-slate-200`), manteniendo el estado activo en `bg-sky-500`. Esto refuerza la paleta blanco/azul en vez de blanco/gris/azul.
- **Animaciones:** solo CSS/Tailwind (`transition`, `hover:-translate-y-*`, `hover:shadow-*`) en cards, tiles y botones principales. Sin librerías de animación ni animaciones disparadas por scroll.

Estos cambios tocan: `app/page.tsx` (hero + category tiles), `components/ProductCard.tsx`, `components/CategoryFilter.tsx`. La página `/catalogo` hereda el cambio de `ProductCard`/`CategoryFilter` automáticamente sin tocar `app/catalogo/CatalogClient.tsx` ni `app/catalogo/page.tsx`.

## 2. Nosotros: Visión, Misión, Valores

Se reemplaza el bloque de texto genérico actual de `app/nosotros/page.tsx` por una estructura con:

- **Intro breve** (1-2 líneas, se conserva el tono del texto actual sobre qué vende Clean Home).
- **Visión** y **Misión** como dos bloques/cards lado a lado en desktop (apilados en mobile).
- **Valores**: grilla de 4 tarjetas cortas.

Contenido (redactado para este negocio, editable después en el código):

> **Misión:** Ofrecer productos de limpieza de calidad para el hogar y los negocios de nuestra comunidad, con una atención cercana y pedidos simples a través de WhatsApp.
>
> **Visión:** Ser la opción de confianza en productos de limpieza del barrio, reconocidos por la calidad de nuestros productos y la rapidez en la atención.
>
> **Valores:**
> - **Calidad** — Trabajamos con marcas reconocidas en cada categoría de producto.
> - **Confianza** — Precios claros y sin sorpresas, confirmados antes de cada pedido.
> - **Atención cercana** — Coordinamos cada pedido directo por WhatsApp, de persona a persona.
> - **Cumplimiento** — Entregas puntuales y compromiso con lo acordado.

El resto de la página (mención a métodos de pago) se conserva.

## 3. Formulario de contacto

**Ubicación:** `app/contacto/page.tsx`, junto a la tarjeta de WhatsApp/métodos de pago que ya existe — dos columnas en desktop (tarjeta de contacto a la izquierda, formulario a la derecha), apiladas en mobile.

**Campos** (los 3 obligatorios — sin backend, así que no hay a quién notificar si el mensaje queda incompleto):
- Nombre (texto, requerido)
- Teléfono (texto/tel, requerido)
- Mensaje (textarea, requerido)

**Comportamiento al enviar:** sin backend. El formulario arma un mensaje de texto con esos tres datos y abre WhatsApp (`wa.me/51976509570`) con el mensaje precargado, en una pestaña nueva — mismo patrón que ya usa el carrito (`lib/whatsapp.ts` → `buildWhatsAppOrderUrl`). Formato del mensaje:

```
Hola, soy {nombre} (tel: {telefono}).

{mensaje}
```

**Componentes/archivos nuevos:**
- `components/ContactForm.tsx` — client component con estado controlado para los 3 campos, validación HTML5 nativa (`required`), `onSubmit` que previene el default, construye la URL vía la nueva función de `lib/whatsapp.ts`, y abre `window.open(url, "_blank", "noopener,noreferrer")`.
- `lib/whatsapp.ts` — se agrega `buildContactMessageUrl(name: string, phone: string, message: string): string`, junto a la función existente `buildWhatsAppOrderUrl`, reutilizando `WHATSAPP_NUMBER`.

**Estilo:** inputs con el mismo lenguaje visual (bordes sutiles, focus en azul `focus:border-sky-400 focus:ring-sky-400`), botón de envío en el mismo estilo píldora azul que "Agregar" en las product cards.

## Manejo de errores / casos borde

- Los 3 campos del formulario son `required` a nivel HTML — el navegador bloquea el envío si falta alguno, sin necesidad de validación JS adicional.
- Si `window.open` es bloqueado por el navegador (bloqueador de pop-ups), el formulario no falla ni pierde los datos ingresados — el usuario puede reintentar el envío. No se agrega manejo especial para este caso (mismo comportamiento que ya acepta el checkout del carrito).
- El formulario no limpia sus campos automáticamente después de enviar (a diferencia del carrito, que si vacía su estado) — así el usuario puede reintentar el envío por WhatsApp sin volver a escribir todo si el pop-up fue bloqueado.

## Testing

- `buildContactMessageUrl` se cubre con Vitest siguiendo el mismo patrón que `tests/whatsapp.test.ts` (URL-encoding correcto, incluye nombre/teléfono/mensaje, apunta al número correcto).
- El resto de los cambios son visuales/de contenido — se verifican manualmente en el navegador (desktop y mobile 375px): hero, hover de cards en Home y Catálogo, chips de categoría, secciones de Nosotros, y el flujo completo del formulario de contacto (llenar campos → enviar → confirmar que abre WhatsApp con el mensaje correcto).
