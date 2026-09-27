# EVCOM-H01-L04-GATE · Cierre de arquetipos y presentación comercial

Fecha: 2026-09-27 · Rama: `feature/evaas-commerce-v04`

```text
CAPSULE=EVCOM-H01-L04-GATE
ATTEMPT=1
BASE_SHA=cdf6b490b9541790d36315c3d58dd4e324215208
STATUS=FAIL
REASON=activation no-JS unusable; activation responsive matrix incomplete
PRESERVED_EXTERNAL_CHANGES=true
```

## Historia y árbol validados en intento 1

HEAD fue `cdf6b490b9541790d36315c3d58dd4e324215208` en `feature/evaas-commerce-v04`, alineado con `origin/feature/evaas-commerce-v04`. C01–C06 se verificaron como ancestros de HEAD (los seis comandos `git merge-base --is-ancestor` devolvieron 0). C05 y C06 son enmiendas autorizadas del propietario incorporadas antes del gate: encuadre comercial y eliminación de previews engañosas.

El build se ejecutó desde un árbol temporal limpio creado con `git archive` de BASE_SHA, sin usar los diffs locales como evidencia. Astro check pasó con 0 errores, 0 warnings y 0 hints; el build terminó correctamente y prerenderizó las 14 rutas reportadas por Astro.

Se preservan sin stagear estos cambios locales ajenos al gate:

- `src/components/Footer.astro`
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/pages/demos/[slug].astro`

## Evidencia aprobada en intento 1

- Los tres arquetipos completos están integrados en `/demos/landing`, `/demos/catalogo` y `/demos/corporativa`, con navegación, contenido de escenario, selector de color de proyecto y CTA EVAAS.
- Los arquetipos se diferencian en estructura: Landing concentra una propuesta/acción; Catálogo organiza categorías, fichas, exploración y consulta sin ecommerce; Corporativa recorre empresa, servicios, metodología, evidencia y contacto.
- Home muestra como productos Landing Comercial, Catálogo de Productos y Web Corporativa. El hero enlaza a `#precios`; las tarjetas showroom llevan icono decorativo accesible, propósito y “Explorar demo”. Las marcas ficticias solo aparecen en componentes de demos completas. C06 registra ausencia de previews en Home y la matriz 27/27; C05/C06 registran validación de temas y colores.
- `/productos/{slug}` presenta propósito, alcance, precio, materiales, exclusiones, CTA de activación y enlace secundario a demo. `/demos/{slug}` contiene el render demostrativo completo y vínculos a producto/activación. `/activar/{slug}` presenta la selección y el inicio del flujo.
- Precios en `src/data/products.ts`: Landing $99.000 neto + $18.810 IVA = $117.810; Catálogo $129.000 + $24.510 = $153.510; Corporativa $149.000 + $28.310 = $177.310. Las superficies públicas revisadas rotulan el total “IVA incluido”.
- Preparación del cliente enumera identidad/logo disponibles, textos e información, propuesta de valor si existe, datos de contacto, imágenes/material visual, dominio si existe y entradas específicas por producto. Branding, logo, propuesta de valor desde cero y producción visual se distinguen de la base y se cotizan/aprueban aparte, sin precio inventado.
- Catálogo declara y materializa filtro progresivo; sus fichas están en el HTML inicial, se ocultan solo tras seleccionar filtro y controles se ocultan sin JS. C02 documenta ausencia de carrito, checkout, stock, pagos y búsqueda remota. Web Corporativa excluye área privada, intranet, dashboard, ecommerce e integración empresarial; Landing conserva un único recorrido comercial.
- Temas dark/light/cyan y colores forest/garnet/ocean permanecen separados. AOS continúa en 2.3.4 con un punto de inicialización y contenido visible cuando no está habilitado; reglas de movimiento reducido siguen presentes. HeroVideo conserva fallback y guards de pantalla/reduced-motion.
- `rg -n "DemoPreview" src` no encontró resultados y `src/components/DemoPreview.astro` no existe. La búsqueda de precios heredados en `src` no encontró coincidencias.
- C05/C06 documentan responsive sin overflow en Home, productos y demos en 320/360/390/768/1024/1440, navegación de teclado/foco visible del CTA, anclas, controles táctiles y 27/27 temas × colores. No se repitió esa matriz durante este gate.
- Deuda preexistente mantenida sin actualizar dependencias: `@vercel/routing-utils` → `path-to-regexp` (hallazgos de auditoría).

## Incumplimiento registrado en intento 1 (resuelto por C07)

La ruta de activación no es usable sin JavaScript. En `src/styles/global.css`, `.form-step { display: none; }` y solo `.form-step.active` queda visible. En `src/pages/activar/[slug].astro`, “Continuar” y “Revisar solicitud” son botones `type="button"` cuyo avance depende de listeners JavaScript; no hay fallback `<noscript>` ni mecanismo HTML nativo. Sin JS solo se ve el paso inicial y el usuario no puede continuar.

Esto hace fallar `NO_JS` y el recorrido completo Home → Producto → Demo → Activación. Además, no hay evidencia heredada de prueba responsive a 320/360/390/768/1024/1440 para las tres rutas de activación (C05/C06 solo registran Home, páginas de producto y demos), por lo que la matriz responsive solicitada no puede declararse PASS completa.

No se modificó el flujo de activación ni se implementó conversión en este gate. No se stageó, commiteó ni publicó esta traza porque el criterio para cerrar L04 no se cumple.

## Resultado del intento 1

```text
LANDING_ARCHETYPE=PASS
CATALOG_ARCHETYPE=PASS
CORPORATE_ARCHETYPE=PASS
PRODUCT_FRAMING=PASS
DEMO_ISOLATION=PASS
PRODUCT_DEMO_ACTIVATION_SEPARATION=FAIL
CONTRACTUAL_PRICING=PASS
CLIENT_INPUTS=PASS
ADDITIONAL_SCOPE=PASS
RESPONSIVE=FAIL (activation routes not validated)
ACCESSIBILITY=PASS (evidence inherited from C05/C06 for reviewed controls)
NO_JS=FAIL (activation wizard cannot advance)
REDUCED_MOTION=PASS
L04=FAIL
NEXT_ALLOWED_CAPSULE=NOT_AUTHORIZED
```

---

## Retry del gate · Attempt 2

```text
CAPSULE=EVCOM-H01-L04-GATE
ATTEMPT=2
BRANCH=feature/evaas-commerce-v04
BASE_SHA=73a396124e12a52204fbab447c735fef9f6b42be
STATUS=PASS
L04=PASS
```

### Auditoría del intento anterior y remediación

```text
ATTEMPT_1:
  BASE_SHA=cdf6b490b9541790d36315c3d58dd4e324215208
  STATUS=FAIL
  REASON=activation no-JS unusable; activation responsive matrix incomplete

REMEDIATION:
  CAPSULE=EVCOM-H01-L04-C07
  COMMIT=73a396124e12a52204fbab447c735fef9f6b42be
  STATUS=PASS

ATTEMPT_2:
  STATUS=PASS
```

### Historia efectiva

Los siete cierres son ancestros de HEAD; cada comprobación `git merge-base --is-ancestor` devolvió 0:

```text
C01=7682a0595aca5e0e4924fe9d1f375e108fd2951a
C02=cef223e8ca15384ca255bc72088811beb60b9162
C03=44c00447b5cae6102a27cf570e32178ec4a3f269
C04=4ac6d8a9bf0db0bdfc0e020e7e6f0ce0f943d743
C05=db547d7da5ec5e386b3f583fe44a9cb0c44a98fa
C06=cdf6b490b9541790d36315c3d58dd4e324215208
C07=73a396124e12a52204fbab447c735fef9f6b42be
```

El build y las validaciones principales del retry se ejecutaron en `/tmp/evaas-l04-attempt2`, creado con `git archive` de `73a396124e12a52204fbab447c735fef9f6b42be`; no incluyó los cambios locales preservados.

### Arquetipos y experiencia comercial

- Landing Comercial, Catálogo de Productos y Web Corporativa pasan. Se distinguen por recorrido: una propuesta y acción concentradas; categorías, fichas y consulta; empresa, servicios, metodología, evidencia y contacto.
- Home presenta productos comerciales; `/productos/{slug}` presenta qué se compra, alcance, precio, aportes del cliente, exclusiones y CTA de activación, con demo secundaria; `/demos/{slug}` presenta el ejemplo ficticio completo; `/activar/{slug}` permite comenzar. Las vistas renderizadas de Home y productos no contienen Grano Claro, Taller de Objetos, Arista Ingeniería ni Lumen.
- `DemoPreview` no aparece en `src` y `src/components/DemoPreview.astro` está ausente. Los tres HTML completos de demos, productos y activación están presentes. Los nombres de escenarios ficticios quedan dentro de las rutas demo.
- Precios contractuales: Landing $99.000 neto + $18.810 IVA = $117.810; Catálogo $129.000 + $24.510 = $153.510; Corporativa $149.000 + $28.310 = $177.310. Los totales públicos se rotulan IVA incluido. La búsqueda de importes heredados no encontró coincidencias en `src`.
- Productos explican identidad/logo disponibles, textos, propuesta de valor si existe, datos de contacto, material visual, dominio si existe y entradas específicas. Aplicar identidad existente pertenece a la base; crear branding, logo, propuesta de valor desde cero y producción visual se trata como adicional por cotizar y aprobar, sin precio inventado.
- Catálogo organiza categorías, fichas, exploración y consulta sin carrito, checkout, stock, pago, búsqueda remota o carga masiva. Corporativa no simula área privada, intranet, dashboard, ecommerce ni integración empresarial. Landing conserva el recorrido comercial concentrado.

### C07 · activación JavaScript y baseline HTML

- Las tres rutas activan el wizard de tres pasos, validan los pasos, navegan siguiente/anterior, presentan review y mantienen submit JSON.
- Sin JS las tres rutas muestran los campos de los tres grupos, ocultan progreso y botones de navegación del wizard, conservan validación nativa, consentimiento y submit. El envío no depende de la inicialización de JavaScript.
- API acepta JSON, urlencoded y multipart; normaliza los datos y aplica una validación compartida. Un envío nativo válido sin timestamp recibió HTTP 303 hacia confirmación. La respuesta JSON enhanced se conserva. En árbol aislado, 12/12 casos inválidos (producto, proyecto, email, dominio, consentimiento y nombre, en JSON y form) fueron rechazados con 400; multipart y el honeypot conservaron el camino de respuesta 303. `formStartedAt` solo es obligatorio para JSON.
- Chrome DevTools validó las tres rutas a 320, 360, 390, 768, 1024 y 1440 px: **18/18 PASS**, sin overflow. En Landing sin JS, 360 y 1440 px pasan; las otras dos rutas sin JS también se revisaron a 360 px.
- Teclado enhanced: Tab, Shift+Tab y Enter; foco visible; ambos avances y review. Sin JS: Tab recorre proyecto, dominio, contacto, email, consentimiento y submit; Space opera el radio. Validación nativa de required, radio y email inválido: PASS.
- Temas dark/light/cyan y reduced-motion se verificaron en activación. El wizard permanece usable con movimiento reducido. Botones de 3.4rem y radios de 6rem proporcionan áreas táctiles amplias.

### Evidencia heredada vigente y auditoría técnica

- C05/C06 documentan responsive de Home, productos y demos en los seis anchos y ausencia de overflow; C06 documenta las 27 combinaciones dark/light/cyan × forest/garnet/ocean. C07 solo modifica activación y reglas de estilos de activación; dichas demos no cambiaron.
- `GLOBAL_THEME` conserva dark/light/cyan; `PROJECT_COLOR` conserva forest/garnet/ocean. Dorado permanece asociado al token de acción/valor comercial, no a decoración editorial.
- AOS permanece fijado en 2.3.4 con un único inicializador; el CSS deja visible el contenido si no inicializa y respeta reduced-motion. HeroVideo conserva fallback, ruta configurada protegida y preferencia de movimiento reducido. No se modificaron sus archivos en C07.
- `npm run build` en árbol limpio del HEAD: PASS; Astro check 0 errores, warnings ni hints; 14 rutas. `git diff --check` y el `git diff --cached --check` de la traza final: PASS.
- Deuda preexistente mantenida sin actualización: `@vercel/routing-utils` → `path-to-regexp` → hallazgos npm audit.

### Estado consolidado del intento 2

```text
LANDING_ARCHETYPE=PASS
CATALOG_ARCHETYPE=PASS
CORPORATE_ARCHETYPE=PASS
PRODUCT_FRAMING=PASS
DEMO_ISOLATION=PASS
PRODUCT_DEMO_ACTIVATION_SEPARATION=PASS
CONTRACTUAL_PRICING=PASS
CLIENT_INPUTS=PASS
ADDITIONAL_SCOPE=PASS
ACTIVATION_JS=PASS
ACTIVATION_NO_JS=PASS
RESPONSIVE=PASS (18/18 activation cases; six-width Home/products/demos evidence inherited from C05/C06)
ACCESSIBILITY=PASS
PROGRESSIVE_ENHANCEMENT=PASS
REDUCED_MOTION=PASS
L04=PASS
NEXT_ALLOWED=EVCOM-H01-L05-C01
```

### Cambios preservados y decisión

Se mantuvieron sin stagear los cambios locales ajenos al gate:

- `src/components/Footer.astro`
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/pages/demos/[slug].astro`

L04 queda cerrado con siete cápsulas efectivas. El intento 1 permanece documentado como FAIL y el intento 2 registra la remediación C07 como PASS. No se implementó L05 ni se integró a `develop` o `main`.
