# EVCOM-H01-L04-C03 · Demo Web Corporativa completa

Fecha: 2026-09-26 · Rama: `feature/evaas-commerce-v04`

```text
BASE_SHA=cef223e8ca15384ca255bc72088811beb60b9162
ARCHETYPE=corporate-web
SECTOR=servicios técnicos e ingeniería
STATUS=PASS
```

## Recorrido implementado

La ruta existente `/demos/corporativa` presenta Arista Ingeniería como organización ficticia. La página de referencia distingue Inicio, Empresa, Servicios, Método, Casos y Contacto; describe diagnóstico, diseño, coordinación y acompañamiento, y usa una composición institucional propia. Los tres casos son relatos ficticios sin cifras, certificaciones, clientes ni obras atribuidas.

Cuatro servicios y tres casos permiten ampliar contexto con `<details>` nativo. El contacto es ilustrativo: no tiene formulario, no envía datos ni conecta servicios. No se añadieron sistemas privados, transaccionales ni empresariales.

El selector contractual `forest`, `garnet`, `ocean` modifica acentos sin cambiar estructura o copy; `dark`, `light`, `cyan` permanecen independientes. El CTA EVAAS **Elegir Web Corporativa** enlaza a `/activar/corporativa`; los retornos llevan a `/productos/corporativa` y `/#showroom`.

## Archivos propios de C03

- `src/components/CorporateArchetypeDemo.astro`: layout institucional, contenido ficticio, disclosures y estilos responsive.
- `src/pages/demos/[slug].astro`: integración en la ruta dinámica, selector de color, CTA y navegación EVAAS.

## Validación

- Contrato: sector y capacidades corresponden a `brand-content.md`; casos demostrativos sin nombres de clientes, métricas o certificaciones. No se encontró Lorem Ipsum ni alcance de software privado/transaccional/empresarial en la demo.
- Chromium: matriz `dark/light/cyan × forest/garnet/ocean`, **9/9** en Web Corporativa, Landing y Catálogo. El tema conserva `PROJECT_COLOR` y viceversa.
- Estructura: Empresa, Servicios (4), Método, Experiencia/casos (3), Contacto y cierre presentes. Los seis anchors de navegación resuelven a destinos existentes.
- Teclado: navegación y anchors operables; `<details>` abre/cierra con Enter y Space; foco visible. CTA EVAAS `/activar/corporativa`.
- JavaScript deshabilitado: áreas, anchors, disclosures y CTA presentes; ancho del documento igual al viewport móvil.
- Reduced motion: AOS no se habilita; contenido conserva `opacity: 1` y `transform: none`; CTA y navegación permanecen utilizables.
- Responsive Chromium: 1440, 1024, 768, 390 y 360 px; sin overflow de página ni de contenido; navegación de seis enlaces visible en móvil. Capturas revisadas a 1440, 1024, 390 y 360 px.
- Regresión Landing: layout y anchors presentes, CTA `/activar/landing`, matriz visual 9/9.
- Regresión Catálogo: filtro Mesa 4, Textil 4, Todo 8; CTA `/activar/catalogo`, matriz visual 9/9.
- L03: los controles globales de tema/color siguen independientes; HeroVideo conserva fallback sin video habilitado; AOS mantiene su único inicializador global.
- `npm run build`: PASS; Astro check con 0 errores, 0 avisos y 14 rutas. `git diff --check`: PASS.

## Preservación y deuda

```text
PRESERVED_EXTERNAL_CHANGE=src/pages/index.astro
PRESERVED_EXTERNAL_CHANGE=src/components/Footer.astro
PREEXISTING_CONTENT_DEBT=59381, 95081, 142681, "precio final"
PREEXISTING_DEPENDENCY_DEBT=@vercel/routing-utils → path-to-regexp audit findings
```

Los dos cambios locales ajenos se conservaron sin modificar ni incluir. No se corrigieron precios, etiquetas ni dependencias y no se inició C04.
