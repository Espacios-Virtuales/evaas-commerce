# EVCOM-H01-L06-C03 — Revisión de iconografía de arquetipo/sectores

**Estado:** PASS
**Disposición:** OWNER_AMENDMENT
**Base:** `c67ac87e016ac53fb9dd19834f44c397f67ca99f`
**Rebaseline:** Launch MVP v0.5

## Enmienda del propietario

La intención v0.4 de agregar iconografía para cafetería, comercio, construcción/oficios, comunidad y energía/servicios técnicos queda reemplazada por la decisión v0.5: los sectores describen únicamente el contexto ficticio de una demo. La identidad comercial se organiza por Landing Comercial, Catálogo de Productos y Web Corporativa.

## Auditoría del arquetipo

`src/components/ProductArchetypeIcon.astro` recibe el `ProductSlug` y representa:

- `landing`: una página con bandas de contenido.
- `catalogo`: una grilla de cuatro fichas.
- `corporativa`: una estructura institucional con áreas y acceso central.

No incluye nombres, símbolos ni ramas para sectores comerciales. No hace falta añadir otra iconografía: los símbolos existentes explican la estructura del producto.

## Auditoría de identidad y recorrido

- Home presenta los tres nombres de producto en hero, showroom, comparativa y tarjetas. Sus ejemplos sectoriales aparecen solo al explorar demos.
- Las páginas `/productos/*` describen propósito, alcance, profundidad y estructura usando `product.name`, `purpose` y `scope`; no segmentan por rubro.
- `ProductCard` presenta el nombre y propósito del producto. `ProductSelector` pregunta qué contenido mostrar, cuánta profundidad requiere y si necesita cobrar en línea; no pregunta el sector.
- Activación presenta `product.name` y campos de proyecto, dominio, contexto y consentimiento. No incorpora rubro.
- Header y footer no crean categorías o navegación sectorial.
- No se modificaron nombres, `demoCategory`, precios, conversión, handoff, WhatsApp ni páginas legales/footer.

## Auditoría de demos y clasificación sectorial

Resultado de `rg -ni "cafeter|comercio local|construcci|oficio|comunidad|energía|ingeniería|servicios técnicos|diseño y hogar" src`:

| Resultado | Clasificación | Evidencia de que es contexto de demo |
| --- | --- | --- |
| `src/data/products.ts`: “Cafetería de especialidad” | DEMO_CONTEXT | Campo `demoCategory` de Landing. |
| `src/data/products.ts`: “Diseño y hogar” | DEMO_CONTEXT | Campo `demoCategory` de Catálogo. |
| `src/data/products.ts`: “Servicios técnicos e ingeniería” | DEMO_CONTEXT | Campo `demoCategory` de Corporativa. |
| `src/data/catalog-demo.ts`: comentario sobre objetos de diseño y hogar | DEMO_CONTEXT | Fuente del contenido ficticio de la demo de catálogo. |
| `src/components/LandingArchetypeDemo.astro:11,55,70`: cafetería/Grano Claro/café | DEMO_CONTEXT | Contenido demostrativo, marca ficticia y referencias a ejemplo. |
| `src/components/CatalogArchetypeDemo.astro:21,53` y `src/data/catalog-demo.ts:12`: Taller de Objetos/oficio/diseño y hogar | DEMO_CONTEXT | La marca, contenido y piezas se declaran ficticios; el catálogo niega stock y ventas reales. |
| `src/components/CorporateArchetypeDemo.astro:29,33,35,37,52,53,77,80,143`: Arista Ingeniería/servicios técnicos | DEMO_CONTEXT | La marca y relatos se declaran ficticios; se aclara que no acredita clientes ni trabajos de Espacios Virtuales. |

No hubo resultados de identidad sectorial en Home, páginas de producto, selector, activación, header o footer. Tampoco se halló taxonomía sectorial de producto, filtros o navegación comercial. `demoCategory` se mantiene como descriptor de ejemplo y no como categoría de producto.

Las demos explicitan marca/contenido ficticios y no presentan clientes reales, casos de éxito ni métricas de Espacios Virtuales.

## Implementación

- `IMPLEMENTATION_REQUIRED=NO`.
- No se añadieron iconos, dependencias, filtros o taxonomías sectoriales.
- Los únicos cambios de esta cápsula son esta traza.

## Build y cambios locales preservados

- `npm run build`: PASS, 14 rutas, 0 errores, 0 warnings.
- `git diff --check`: PASS.
- Se preservaron los cambios locales externos en `src/components/Footer.astro`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro` y `src/pages/demos/[slug].astro`.

## Decisión

Los sectores son contextos ficticios de demo; el producto es un arquetipo digital. `ProductArchetypeIcon` continúa siendo el lenguaje visual del producto. H01 no incorpora plantillas verticales ni navegación por sector; no se requiere iconografía sectorial para Launch MVP v0.5.
