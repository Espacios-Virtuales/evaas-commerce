# EVCOM-H01-L04-C07 · Activación progresiva sin JavaScript

Fecha: 2026-09-27 · Rama: `feature/evaas-commerce-v04`

```text
CAPSULE=EVCOM-H01-L04-C07
BASE_SHA=cdf6b490b9541790d36315c3d58dd4e324215208
STATUS=PASS
SCOPE=activation progressive enhancement and responsive validation only
```

## Causa raíz y corrección

El formulario dependía de JavaScript para revelar los pasos siguientes y no tenía método/acción HTML. Además, `/api/activation` rechazaba los POST de formulario y exigía `formStartedAt`, que solo poblaba JavaScript.

El formulario ahora declara `method="post"` y `action="/api/activation"`, sin `novalidate`. Sus tres secciones tienen encabezados y permanecen visibles por defecto. Solo después de resolver referencias, registrar listeners de navegación y submit y preparar las funciones, el controlador añade `.is-enhanced`; ese estado muestra un paso a la vez, el progreso y los botones siguiente/anterior. Si no se inicializa JavaScript, esos controles permanecen ocultos y el submit real sigue disponible. La caja de revisión se oculta inicialmente y solo se muestra al generarse su contenido.

El endpoint normaliza `application/json`, `application/x-www-form-urlencoded` y `multipart/form-data` a una misma estructura y ejecuta una sola validación comercial para producto, proyecto, dominio, nombre, email y consentimiento. El honeypot `website` continúa activo. La comprobación de `formStartedAt` sigue aplicándose a JSON/enhanced, pero no bloquea el formulario nativo; no se inventa un timestamp. El baseline usa atribución directa. Errores JSON conservan su respuesta JSON; errores de formulario reciben HTML breve con un enlace de retorno. El éxito nativo responde `303` a confirmación (o respeta el checkout configurado existente), mientras que JSON conserva el formato y comportamiento del fetch actual.

## Validación

- `npm run build`: PASS; Astro check con 0 errores, warnings ni hints; 14 rutas prerenderizadas. `git diff --check`: PASS.
- Chrome DevTools: 18/18 combinaciones de las rutas `/activar/landing`, `/activar/catalogo`, `/activar/corporativa` con anchos 320, 360, 390, 768, 1024 y 1440 px. `documentElement.scrollWidth` y `body.scrollWidth` no superaron el viewport; resumen, formulario y submit quedaron dentro del viewport. Se corrigió el mínimo intrínseco de los paneles y se apilaron las opciones de dominio en móvil.
- Sin JavaScript: las tres rutas mostraron sus tres secciones y submit a 360 px; Landing también se comprobó a 1440 px. No apareció overflow horizontal. Constraint Validation se mantuvo activa (`novalidate=false`): campos requeridos, email inválido y radio requerido produjeron el estado inválido nativo.
- Teclado con JavaScript: Tab llegó al control del wizard y mostró `:focus-visible`; Shift+Tab regresó al textarea; Enter avanzó ambos pasos y generó el review. Sin JavaScript, Tab recorrió los campos de proyecto, dominio, contacto, email, consentimiento y submit; Space seleccionó el radio nativo.
- Envío de QA sin JavaScript desde el navegador, con valores ficticios: el formulario completó POST nativo, recibió 303, llegó a `/confirmacion?producto=landing&id=…` y mostró la confirmación. El servidor local estaba en desarrollo sin webhook; la respuesta preview no persistió ni envió datos externos.
- API local: JSON válido devolvió 200 con `ok`, `requestId` y `preview` de desarrollo; `application/x-www-form-urlencoded` válido sin timestamp devolvió 303; payload inválido devolvió 400; JSON sin `formStartedAt` devolvió 400, confirmando que el control temporal enhanced se conserva. Las rutas multipart y sus errores nativos están implementados por `request.formData()` y `errorResponse()`.
- Temas dark/light/cyan se probaron en las tres rutas sin overflow. Con `prefers-reduced-motion: reduce`, el wizard continuó funcionando y la duración se redujo a 0.01 ms. Botones de al menos 3.4rem y tarjetas de radio de 6rem conservan áreas táctiles amplias.
- La regresión general de Home, productos y demos no requirió repetición: C07 solo tocó activación y estilos globales acotados a controles de activación. HeroVideo, AOS y componentes de demo no se modificaron.

## Preservación y alcance

Cambios de implementación de C07: `src/pages/activar/[slug].astro`, `src/pages/api/activation.ts` y reglas de activación en `src/styles/global.css`. No se modificaron contratos, precios ni el comportamiento comercial de validación. No se añadieron SelectionContext, cupón, WhatsApp, Webpay, checkout nuevo ni UUID comercial persistente; el identificador de solicitud transitorio existente se conserva.

Se preservan fuera del stage y del commit:

- `docs/traces/EVCOM_H01_L04_GATE.md` (traza FAIL anterior, pendiente de re-ejecución del gate)
- `src/components/Footer.astro`
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/pages/demos/[slug].astro`

```text
NEXT_ALLOWED=RETRY_GATE_L04
L05=NOT_STARTED
```
