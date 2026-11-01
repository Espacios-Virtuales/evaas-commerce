# EVCOM H03-L02-C06 · Catálogo, tarjetas y comparador

**Capsule:** `EVW-EVCOM-H03-L02-C06`

**Gate:** `PRODUCT_COMPARISON_PASS`

**Branch:** `feature/evcom-h03-l02-comercial`

**Base SHA:** `2db7eae6288627d82f05aa6a9e7d260a5146e530`

**Final SHA:** se informa en el gate de cierre de esta cápsula.

**Fecha:** 2026-11-01 (`America/Santiago`)

## Precheck y cápsulas anteriores

- La rama activa era `feature/evcom-h03-l02-comercial`; el árbol estaba limpio y `HEAD` coincidía con el `BASE_SHA` esperado.
- C05 corresponde al commit `2db7eae` (`feat: align Commerce home narrative for H03`). Se conservaron el hero, `Claro · Simple · Evolutivo`, las etapas `Activa → Mantén → Amplía` y los cuatro fundamentos.
- C03 mantiene sus reglas H03 internas en `f1a7ffa` (`feat: add gated H03 commercial pricing rules`). C04B mantiene su runtime V3 interno y autenticado en `c8f8b18` (`feat: add authenticated internal V3 request runtime`). Ninguno se sobrescribió ni se conectó a la oferta pública.

## Autoridad de precios y límite de publicación

- La oferta pública v0.6 muestra `products[].finalPrice` desde `src/data/products.ts`: `$120.000`, `$160.000` y `$180.000 CLP`; los tres valores corresponden a contratación anual de doce meses. Las superficies comerciales ahora muestran explícitamente esa periodicidad.
- H03 permanece en `src/data/commercial-rules.ts`, con cálculo canónico y estado `DRAFT_NOT_FOR_PUBLICATION`; el runtime vuelve a calcular en servidor. C06 no importó esas reglas en la interfaz, no creó una segunda tabla de precios y no añadió flags del navegador ni rutas de vista previa.
- Se verificó el artefacto público `.vercel/output/static`: no aparecen los seis importes mensuales/anuales H03. La oferta tampoco etiqueta los importes v0.6 como activación única. `/terminos` conserva v0.6 sin cambios.
- La publicación se describe en tarjetas, catálogo, selector, fichas y demos como **“Preparación para publicación según la cotización”**. No se reintrodujo Vercel, hosting, respaldos, SLA o soporte como prestación comercial.

## Comparación de productos

| Slug | Finalidad y público | Estructura y revisión | Precio público vigente | Límites principales |
| --- | --- | --- | --- | --- |
| `landing` | Presentar una oferta principal con una acción clara; profesionales, emprendimientos y campañas. | 1 página, hasta 6 secciones; 1 revisión consolidada. | $120.000 CLP · contratación anual, 12 meses. | Ecommerce/carrito, pasarela, stock, agenda, automatizaciones/integraciones, fotografía y redacción extensa. |
| `catalogo` | Vitrina no transaccional para presentar productos/servicios y recibir consultas; negocios que venden por contacto o cotización. | 1 catálogo, hasta 12 ítems; 1 revisión consolidada. | $160.000 CLP · contratación anual, 12 meses. | Ecommerce/carrito, pasarela/stock, carga masiva, ERP, automatizaciones y funciones avanzadas. |
| `corporativa` | Dar contexto institucional a empresas y organizaciones. | 4 áreas: Inicio, Empresa, Servicios y Contacto; 1 revisión consolidada. | $180.000 CLP · contratación anual, 12 meses. | Ecommerce/carrito/pasarela/stock, agenda, integraciones, áreas privadas, sistemas internos, redacción extensa y fotografía. |

Las tres opciones comparan aplicación básica de la identidad disponible y diseño responsive. La preparación para publicación depende de la cotización; el cliente compra y conserva el dominio, y su conexión/costos externos se confirman antes de contratar. Las ampliaciones se evalúan y cotizan por separado; la tabla no las presenta como capacidades instaladas.

## Diferencias antes y después

| Superficie | Antes de C06 | Resultado C06 |
| --- | --- | --- |
| Tarjetas | Precio como “valor final” sin periodicidad visible; propósito, lista resumida y CTA “Elegir”. | Propósito y público por producto, precio anual v0.6, alcance/revisión, inclusiones reales, exclusiones principales y CTA “Preparar solicitud”. El catálogo se identifica como vitrina sin ecommerce. |
| Comparador | Cuadrícula visual con pocas filas, sin límites detallados ni links a producto/solicitud. | Tabla HTML semántica de los tres `ProductSlug`, alimentada por `products.ts`: finalidad, estructura, diseño/identidad, revisión, preparación para publicación, dominio/costos, exclusiones y ampliaciones. Incluye enlaces con nombres accesibles por producto. |
| Recorrido de precios | Periodicidad anual no aparecía junto a todos los precios visibles. | Un único texto de periodicidad (`PUBLIC_PRICE_PERIOD`) se reutiliza en portada, tarjetas, selector, fichas, demos, activación y comparador. |
| Lectura móvil | Comparador horizontal en una cuadrícula sin semántica de tabla. | Región enfocable con tabla semántica y scroll horizontal contenido; la página no gana desbordamiento horizontal. |

## Archivos de C06

- `src/data/products.ts`: periodicidad pública y exclusiones del catálogo; añade diseño responsive a Catálogo y Web Corporativa. Los tres slugs y precios v0.6 se conservaron.
- `src/components/ProductCard.astro` y `src/pages/index.astro`: tarjetas, anclas y comparador.
- `src/styles/global.css`: distribución de tarjetas, tabla, scroll y foco.
- `src/components/ProductSelector.astro`, `src/pages/productos/[slug].astro`, `src/pages/demos/[slug].astro`, `src/pages/activar/[slug].astro`: periodicidad anual y CTA de solicitud coherentes en el recorrido existente.
- `tests/commercial-rules.test.mjs`: integridad del catálogo público, periodicidad, exclusiones, estructura/semántica del comparador y ausencia de valores H03 en superficies de UI.
- `docs/traces/EVCOM_H03_L02_C06_PRODUCT_COMPARISON.md` y seis capturas de evidencia.

No se modificaron `src/pages/terminos.astro`, `src/pages/api/activation.ts`, `src/lib/activation-handoff.ts`, el runtime C04B ni `src/data/commercial-rules.ts`.

## URLs del recorrido y capturas

- Portada: `/` · anclas conservadas `#precios`, `#comparar` y `#elegir`.
- Productos: `/productos/landing`, `/productos/catalogo`, `/productos/corporativa`.
- Demos: `/demos/landing`, `/demos/catalogo`, `/demos/corporativa`.
- Solicitud: `/activar/landing`, `/activar/catalogo`, `/activar/corporativa`.
- Términos vigentes: `/terminos`.

Capturas del build inspeccionado (viewports 320, 500 y 1440 CSS px):

- Tarjetas: [320 px](evidence/EVCOM_H03_L02_C06/cards-320.png), [500 px](evidence/EVCOM_H03_L02_C06/cards-500.png), [1440 px](evidence/EVCOM_H03_L02_C06/cards-1440.png).
- Comparador: [320 px](evidence/EVCOM_H03_L02_C06/comparator-320.png), [500 px](evidence/EVCOM_H03_L02_C06/comparator-500.png), [1440 px](evidence/EVCOM_H03_L02_C06/comparator-1440.png).

## Validaciones

- `npm run build`: **PASS**, 42 archivos Astro; 0 errores, 0 advertencias y 0 hints.
- `npm run test:commercial`: **PASS**, 14/14.
- Smoke del artefacto estático, aislado en `127.0.0.1:4324`: **PASS**, HTTP 200 para portada, 3 productos, 3 demos, 3 activaciones y `/terminos`. No se detuvo ni alteró ningún proceso en 4322.
- Catálogo/pricing: **PASS**, solo `landing`, `catalogo`, `corporativa`; precios públicos `$120.000/$160.000/$180.000`; periodicidad anual/12 meses. Búsqueda exacta de `$19.900/$24.900/$29.900/$214.920/$268.920/$322.920` en el artefacto estático: sin coincidencias.
- Responsive: **PASS**. A 320 px, tarjeta 288 px y contenedor comparador 286 px; a 500 px, tarjeta 453 px y comparador 451 px; a 1440 px, tres tarjetas de 403 px y tabla completa de 1238 px. La tabla mide 1184 px y usa scroll interno en móvil; el ancho del documento no supera el viewport.
- Anclas y C05: **PASS** en los tres viewports. Se verificaron `#precios`, `#comparar`, `#elegir`, el hero, el atributo Claro/Simple/Evolutivo, las tres etapas y cuatro fundamentos.
- Teclado/foco: **PASS**. Tab alcanza la región del comparador, muestra contorno sólido de 3 px y el siguiente Tab llega al enlace “Ver alcance”.
- Contraste calculado desde colores computados del navegador: **PASS** en temas dark/light/cyan. Encabezado 10.07–13.21:1; rótulo/nota 5.94–6.91:1; contorno de foco 5.90–6.83:1.
- `git diff --check`: **PASS**.
- Neutralidad de publicación: búsqueda en superficies modificadas sin Vercel, hosting, respaldos, SLA ni afirmaciones de publicación inicial; se conserva el texto sujeto a cotización.
- Restricciones: términos v0.6, API de activación y handoff V2 **sin cambios**. No se ejecutó el runtime HTTP C04B ni C07.

## Errores y pendientes

- La primera ejecución de pruebas detectó que `catalogo` y `corporativa` no declaraban diseño responsive en `products.ts`; se añadieron al modelo canónico y la suite final pasó 14/14.
- `astro preview` terminó antes de quedar listo con el adaptador Vercel. El smoke se realizó contra el artefacto estático en el puerto aislado 4324. No afecta el resultado del smoke ni requirió detener servicios ajenos.
- El modelo H03 y sus modos siguen internos y no disponibles para publicación. Las condiciones/fechas H03 continúan sujetas a los gates C08–C11.
- C07 no se ejecutó en esta cápsula.

## Gate de cierre

```text
CAPSULE: EVW-EVCOM-H03-L02-C06
GATE: PRODUCT_COMPARISON_PASS
BRANCH: feature/evcom-h03-l02-comercial
BASE_SHA: 2db7eae6288627d82f05aa6a9e7d260a5146e530
FINAL_SHA: reportado en el gate de cierre tras crear el commit C06
PRODUCTS: LANDING_CATALOGO_CORPORATIVA_ONLY
CARDS: PASS
COMPARATOR: PASS
PUBLIC_V0_6_PRICING: PRESERVED
H03_PRICES_AND_MODES_PUBLIC: NO
NEUTRAL_PUBLICATION_COPY: PRESERVED
HOME_C05: PRESERVED
CTA: REQUEST_NOT_PURCHASE
TERMS_V0_6: UNCHANGED
API_AND_HANDOFF: UNCHANGED
BUILD: PASS
TEST_COMMERCIAL: PASS_14_OF_14
SMOKE: PASS_11_ROUTES_HTTP_200
MOBILE_320_500: PASS
KEYBOARD_AND_CONTRAST: PASS
DIFF_CHECK: PASS
TREE: CLEAN_AFTER_COMMIT
PUSH_MERGE_DEPLOY: NONE
NEXT: C07_NOT_EXECUTED
```
