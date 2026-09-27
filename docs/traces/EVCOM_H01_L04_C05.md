# EVCOM-H01-L04-C05 · Refinar encuadre comercial y preparación del cliente

## Autorización y alcance

- Enmienda del propietario entre L04-C04 y `GATE_L04`; no altera C01–C04.
- Se actualizó Home, la fuente de productos, las tarjetas, el selector, `/productos/[slug]`, `/demos/[slug]` y la ruta de activación para reflejar la nomenclatura y los valores contractuales de L01.
- El producto es la unidad principal. Los negocios ficticios y sus sectores se conservan dentro de los renders de demo.
- No se inició L05 ni se implementó checkout, precio de transacción servidor, UUID, cupón, WhatsApp, Webpay ni estados de compra.

## Producto y precio

| Slug | Nombre comercial | Neto | IVA | Total |
| --- | --- | ---: | ---: | ---: |
| `landing` | Landing Comercial | $99.000 | $18.810 | $117.810 |
| `catalogo` | Catálogo de Productos | $129.000 | $24.510 | $153.510 |
| `corporativa` | Web Corporativa | $149.000 | $28.310 | $177.310 |

`products.ts` conserva un solo origen para precios, nombre, propósito, alcance, inclusiones, exclusiones y materiales del cliente. Los importes visibles señalan IVA incluido; cuando se presenta el neto se identifica como neto + IVA.

## Experiencia comercial

- El objeto visual del hero es un enlace semántico con nombre accesible “Ver productos y precios”, va a `#precios`, muestra “Ver precios →” y conserva HeroVideo como elemento separado.
- Showroom y tarjetas presentan primero Landing Comercial, Catálogo de Productos y Web Corporativa. Cada tarjeta tiene un icono SVG inline decorativo de arquetipo y enlaza a la demo. No se instalaron dependencias.
- `/productos/{slug}` se centra en propósito, alcance, precio, materiales, exclusiones y activación; el enlace a demo es secundario.
- `/demos/{slug}` pone nombre, definición, precio y activación de producto en su cabecera. El render interior conserva marca y escenario ficticios. La sección final explica materiales comunes y específicos, y aclara que desarrollar branding, logo, propuesta de valor, textos desde cero o producción fotográfica no se incluye automáticamente y requiere cotización/aprobación separada cuando corresponda.
- La frase incluida “Aplicación básica de tu identidad disponible” reemplaza la ambigua “Branding básico”.

## Validación

- `npm run build`: PASS; Astro check con 0 errores, avisos ni hints; 14 rutas prerenderizadas.
- `git diff --check`: PASS.
- Precios heredados: sin coincidencias en `src` para los importes anteriores.
- 27 combinaciones tema `dark/light/cyan` × color `forest/garnet/ocean` sobre las tres demos: PASS, sin overflow en la comprobación de viewport de escritorio.
- Home, las 3 rutas de producto y las 3 demos en 320, 360, 390, 768, 1024 y 1440 px: PASS (42 estados), sin overflow horizontal.
- Demos: título exterior del producto, precio IVA incluido, CTA a `/activar/{slug}` y requisitos visibles: PASS.
- Home hero: `href="#precios"` y `aria-label="Ver productos y precios"`: PASS. HeroVideo se conserva en su slot independiente.
- Teclado del hero: Tab alcanza el enlace, `:focus-visible` es verdadero y Enter navega a `#precios`: PASS. Iconos con `aria-hidden="true"` y `focusable="false"`.
- Contraste de cada tema no fue auditado con una herramienta de contraste.
- Regresión L03: la cápsula no modifica HeroVideo, AOS, temas, colores, semántica de dorado ni CSS de movimiento reducido. Build PASS; revalidación visual específica de L03 fuera del alcance de esta ejecución.

## Cambios locales preservados

- `src/components/Footer.astro` continúa sin stagear ni incluirse.
- `src/pages/index.astro` ya contenía copy editorial local en hero, showroom y comparación antes de C05. Se preserva; los cambios de encuadre/precio/producto que comparten esos bloques se incorporan deliberadamente con los nuevos ajustes de C05.
