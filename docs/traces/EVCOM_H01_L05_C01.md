# EVCOM-H01-L05-C01 · Contexto comercial de selección

```text
CAPSULE=EVCOM-H01-L05-C01
STATUS=PASS
BRANCH=feature/evaas-commerce-v04
BASE_SHA=efa53956a48d34d8fef3bf522a5181fe89724fc2
```

## Modelo y autoridad

- `src/lib/commercial-context.ts` define `CommercialContextV1` y su variante persistida. El esquema valida producto, color, UUID y atribución; `coupon` se fija en `null`.
- `pricing` se deriva con `resolveContractualPricing()` desde `productBySlug` y la tasa contractual de 19 %. No se serializa en `sessionStorage`.
- `src/components/CommercialContextController.astro` es el único controlador global. Se monta desde `BaseLayout`, migra las claves antiguas una vez, consolida UTM, sincroniza selección/color, contextualiza enlaces del recorrido comercial, conserva el tracking permitido y ofrece `window.evaasCommercial` sin mutación de precio.
- La selección del producto sigue la ruta comercial válida. El color solo se adopta desde URL/contexto o cambio explícito; el forest visual inicial no se convierte en elección.
- La atribución queda limitada a `source`, `medium` y `campaign`, hasta 100 caracteres, y descarta valores con apariencia de email/teléfono. No se guardan campos del formulario.
- `GLOBAL_THEME` continúa en `localStorage` bajo `evaas-commerce-theme`; la selección queda en `sessionStorage` bajo `evaas_commercial_context_v1`.

## Activación y referencia

- La activación sincroniza el slug de su ruta, muestra el color elegido o “Por definir” y envía `projectColor` solo si es válido. En native no-JS puede permanecer vacío.
- `/api/activation` usa la misma validación para JSON y form POST. Solo acepta colores permitidos o vacío, sanea la atribución y resuelve precio en servidor; no usa campos `price`, `total` o `pricing` recibidos.
- El webhook recibe `pricing` contractual, color canónico y `id` generado con `crypto.randomUUID()` en servidor. No se crea UUID en Home, Producto, Demo ni al seleccionar color.
- El camino enhanced adopta el `requestId` devuelto antes de navegar a confirmación; el formulario nativo recibe el mismo UUID en su redirect 303. Confirmación solo hidrata/reporta UUID canónicos. No se agrega una segunda referencia.
- Las claves `evaas_selected_product`, `evaas_source`, `evaas_medium` y `evaas_campaign` se leen para compatibilidad inicial y se eliminan al consolidar. No quedan como stores de escritura activos.

## Evidencia

- Chrome headless: Home con atribución UTM, rutas de producto/demo/activación, selección explícita de forest/garnet/ocean, color inválido, restauración tras reload, cambio de producto, tema independiente, storage corrupto/vacío, migración legacy, PII de formulario ausente, y recorrido browser back/forward: PASS.
- La demo inicia con preview forest y contexto comercial `projectColor=null`: PASS. Color garnet rehidrata el preview, selector, URL contextual y resumen de activación: PASS.
- Activación enhanced de tres pasos → JSON → confirmación; el UUID de respuesta coincide con `commercialContext.reference`: PASS.
- Prueba con webhook HTTP local ficticio: se enviaron `price=1`, `total=1` y `pricing.total=1`. El payload recibido resolvió Landing a neto 99.000/total 117.810 y el ID de respuesta/webhook coincidió. El form POST falsificado resolvió Catálogo a total 153.510 y el mismo ID llegó al redirect 303: PASS.
- Color `gold` no válido fue rechazado con HTTP 400 antes de alcanzar el webhook: PASS.
- Regresión C07 en Chrome headless: wizard y validación JSON, no-JS en las tres activaciones, envío nativo y confirmación 303, teclado/foco, reduced motion y matriz responsive de 18 casos: PASS. No hubo overflow horizontal del viewport. La evidencia responsive es de las seis anchuras `320/360/390/768/1024/1440`; no-JS comprobado a 360 y 1440 en Landing y a 360 en Catálogo/Corporativa.
- `npm run build`: Astro check 29 archivos, 0 errores/advertencias/indicaciones; 14 rutas; build PASS. `git diff --check`: PASS.

## Alcance preservado

Se conservaron hunks locales externos preexistentes en `Footer.astro`, `BaseLayout.astro` (descripción), `index.astro` y `demos/[slug].astro`. El cambio C01 en `BaseLayout.astro` se limita al montaje del controlador y el shim de tracking; el hunk editorial local queda fuera del commit. No se modificaron contratos. No se inició WhatsApp, Webpay ni cupón; el slot continúa en `null`.

## Resultado

```text
CONTEXT_SCHEMA=PASS
SESSION_STORAGE_NO_PII=PASS
PRODUCT_ROUTE_PRECEDENCE=PASS
PROJECT_COLOR=PASS
ATTRIBUTION=PASS
DERIVED_PRICING=PASS
SERVER_PRICE_AUTHORITY=PASS
CANONICAL_REFERENCE=PASS
ACTIVATION_JS=PASS
ACTIVATION_NO_JS=PASS
RESPONSIVE=PASS
L05_C01=PASS
NEXT_ALLOWED=EVCOM-H01-L05-C02
```
