# EVCOM-H01-L04-C02 · Demo Catálogo completa

Fecha: 2026-09-26 · Rama: `feature/evaas-commerce-v04`

```text
BASE_SHA=7682a0595aca5e0e4924fe9d1f375e108fd2951a
ARCHETYPE=catalog
SECTOR=objetos de diseño y hogar
STATUS=PASS
```

## Recorrido implementado

La ruta existente `/demos/catalogo` muestra un sitio completo de referencia para Taller de Objetos, una marca ficticia. Incluye navegación con anchors, introducción, categorías contractuales Mesa y Textil, ocho piezas de ejemplo, filtro, detalles nativos por pieza, consulta ilustrativa y footer. Los nombres Fuente Sur, Manta Bruma, Vaso Piedra y Cojín Origen están incluidos según el contrato de contenido.

El filtro se activa con JavaScript y solo oculta fichas después de una elección. Las ocho piezas están en el HTML inicial; sin scripts, el control se oculta y las fichas, anchors, `<details>` y CTA EVAAS continúan disponibles. No hay formulario, servicio externo, precio, stock, carrito, checkout, pago ni buscador remoto.

El selector contractual `forest`, `garnet`, `ocean` cambia los acentos del sitio ficticio sin alterar su estructura o contenido. `dark`, `light`, `cyan` permanecen independientes. El botón comercial **Elegir Catálogo** dirige a `/activar/catalogo`; los retornos llevan a `/productos/catalogo` y `/#showroom`.

## Archivos propios de C02

- `src/components/CatalogArchetypeDemo.astro`: layout, contenido, controles de categoría, fichas, interacción y estilos responsive.
- `src/data/catalog-demo.ts`: ocho elementos ficticios tipados, separados de los productos comerciales EVAAS.
- `src/pages/demos/[slug].astro`: integración en la ruta dinámica, CTA, selector y enlace de regreso.
- `src/components/DemoPreview.astro` y `src/data/products.ts`: identidad y descripción del preview alineadas con la marca demostrativa.

## Validación

- Chromium: matriz `dark/light/cyan × forest/garnet/ocean`, **9/9** combinaciones; el cambio de tema conserva el color de proyecto y viceversa.
- Filtro: Mesa muestra 4 piezas, Textil 4, Todo 8; Space activa la categoría y actualiza `aria-pressed`. Las fichas usan `<details>` nativo.
- JavaScript deshabilitado: 8/8 fichas visibles; controles dinámicos ocultos; 4 anchors de navegación, detalles y CTA utilizables.
- Anchors internos: todos los destinos existen. CTA EVAAS `/activar/catalogo`; producto `/productos/catalogo`; showroom `/#showroom`.
- Responsive Chromium: 1440, 1024, 768, 390 y 360 px; ancho del documento no supera el viewport. Capturas revisadas a 1440, 1024, 390 y 360 px; grilla reorganizada y sin recorte horizontal.
- Teclado: filtros operables con Space; foco visible de 3 px; botones con altura mínima de 44 px.
- Movimiento reducido: AOS desactivado, contenido con `opacity: 1` y `transform: none`. La demo usa el inicializador AOS global existente.
- Regresión Landing: layout y anchors presentes, CTA `/activar/landing`, sin overflow a 390 px. HeroVideo y controlador global AOS no se modificaron; se conservan los cierres L03/C01.
- `npm run build`: PASS; Astro check con 0 errores, 0 avisos y 14 rutas generadas. `git diff --check`: PASS.

## Preservación y deuda

```text
PRESERVED_EXTERNAL_CHANGE=src/pages/index.astro
PRESERVED_EXTERNAL_CHANGE=src/components/Footer.astro
PREEXISTING_CONTENT_DEBT=59381, 95081, 142681, "precio final"
PREEXISTING_DEPENDENCY_DEBT=@vercel/routing-utils → path-to-regexp audit findings
```

Los dos cambios locales ajenos se conservaron sin modificar ni incluir. No se corrigió deuda de precios, etiquetas o dependencias, ni se inició C03.
