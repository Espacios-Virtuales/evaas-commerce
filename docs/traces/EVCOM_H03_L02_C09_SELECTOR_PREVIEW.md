# EVCOM H03 · L02 · C09 — Selector y previsualización protegida

- **Cápsula:** `EVW-EVCOM-H03-L02-C09`
- **Rama:** `feature/evcom-h03-l02-comercial`
- **BASE_SHA:** `b14856ece0e5f5d3a8d023cd0f5d449f15f72253` (cierre C08)
- **FINAL_SHA:** se informa en el reporte Codex del commit que contiene esta traza; no se inserta un SHA autorreferencial en el propio commit.
- **Commit previo:** `b14856e` — `docs: prepare H03 terms and continuity evidence (C08)`
- **Fecha de ejecución:** 2026-11-02
- **Gate técnico:** `SELECTOR_PREVIEW_PASS`
- **Gate público:** `NOT_AUTHORIZED` · `PUBLIC_TERMS_GATE=PENDING`

## Resultado

Se añadió `/internal/h03-preview`, una vista de desarrollo local que requiere simultáneamente `import.meta.env.DEV`, `EVCOM_H03_PRICING_API_ENABLED=true` y una dirección loopback. Usa el `POST /api/commercial-pricing` existente, que ahora además exige loopback y modo desarrollo, conserva la bandera server-side desactivada por defecto y rechaza propiedades ajenas a la selección. En el build Vercel la guardia `DEV` queda compilada como `false`; la página y el endpoint de precios responden 404 incluso al probar con la variable de habilitación presente.

La UI envía únicamente `productSlug` y `continuityMode`; no contiene una tabla de precios. El servidor resuelve importes mediante `resolveH03Pricing` y agrega una proyección derivada para comparar doce meses. El preview no prepara solicitudes V3, no abre WhatsApp y no registra aceptación, cotización durable, orden, pago o reserva. El CTA H03 permanece deshabilitado.

## Superficies y archivos

| Archivo | Cambio |
|---|---|
| `src/components/H03CommercialPreview.astro` | Selector accesible de producto/modalidad, desglose, estados y proyección recibidos del servidor; script inline solo para la página protegida. |
| `src/pages/internal/h03-preview.astro` | Ruta server-rendered con gate dev, variable privada y loopback; devuelve 404 antes del render si no cumple. |
| `src/pages/api/commercial-pricing.ts` | Mantiene la respuesta `pricing`, agrega comparación calculada en servidor y limita uso a dev local con gate explícito; rechaza montos y otros campos enviados. |
| `src/lib/internal-preview-access.ts` | Permite solo loopback en desarrollo (`127.0.0.1`, `::1`, `::ffff:127.0.0.1`). |
| `src/layouts/BaseLayout.astro` | Omite popup promocional y widget WhatsApp exclusivamente en la ruta interna. El resto de superficies sigue igual. |
| `tests/commercial-rules.test.mjs` | Verifica guardias, 3×3 runtime, tampering, campaña vencida, rutas públicas y compatibilidad v0.6. |
| `tests/v3-runtime-smoke.mjs` | Ejecuta juntos los tests HTTP de preview, V3 protegido y regresión V2 en puerto efímero. |
| `docs/traces/EVCOM_H03_L02_C09_SELECTOR_PREVIEW.md` | Evidencia de la cápsula. |

Sin cambios en `src/data/commercial-rules.ts`, `src/data/products.ts`, `src/components/ProductSelector.astro`, portada/productos/demos, `src/pages/terminos.astro`, `src/pages/api/activation.ts`, Handoff V2, `src/lib/commercial-request-v3.ts` o las rutas de C10. La prueba exige el contrato real `none | monthly | annual_prepay`; “anual” es solo la etiqueta legible del selector.

## Acceso y protección probados

| Superficie | Condición | Resultado HTTP / evidencia |
|---|---|---|
| `/internal/h03-preview` | Astro dev, loopback, `EVCOM_H03_PRICING_API_ENABLED=true` | `200`; badge H03, tres productos y tres modalidades; HTML inicial sin importes H03. |
| `POST /api/commercial-pricing` | Astro dev, loopback, gate activo | `200`; desglose y proyección derivados del motor canónico. |
| Página y API de preview | Astro dev sin la variable de gate | Ambas `404`; cuerpo sin copy o cifras H03. Smoke HTTP en puerto efímero. |
| Página y API de preview | Función Vercel compilada; incluso con `EVCOM_H03_PRICING_API_ENABLED=true` en el proceso de prueba | Página `404` (respuesta genérica sin contenido H03); API `404` sin cuerpo. Se invocó por HTTP la función `_render.func/dist/server/entry.mjs` generada por el build. |
| Bundle estático público | Escaneo recursivo de `.vercel/output/static` | Cero coincidencias para importes de continuidad H03 y `annual_prepay`. El script del preview no genera un bundle JS estático público. |
| `/api/internal/commercial-request-v3` | Sin bearer / bearer de prueba válido | `401` / `200`; no se conecta al selector. La respuesta válida sigue siendo borrador `DRAFT_NOT_FOR_PUBLICATION` y WhatsApp prepared-not-sent. |

Las pruebas unitarias también rechazan el modo local cuando `DEV=false` o el cliente no es loopback. El gate por URL/query/localStorage no existe. No se expone un flag `PUBLIC_*`.

## Autoridad y matriz 3×3 observada por HTTP

Fuente única de valores: `src/data/commercial-rules.ts` y `resolveH03Pricing`. El navegador no envía importes ni porcentaje; el servidor entrega `pricing` y `comparison`. Las estimaciones siguientes son comparaciones, no cobros ni obligaciones contractuales.

| `ProductSlug` | Activación única | Continuidad mensual | Continuidad anual prepago | Proyección 12 meses con mensualidad (incluye activación) | Proyección 12 meses anual (incluye activación) | Ahorro solo continuidad |
|---|---:|---:|---:|---:|---:|---:|
| `landing` | $120.000 | $19.900/mes | $214.920 | $358.800 | $334.920 | $23.880 |
| `catalogo` | $160.000 | $24.900/mes | $268.920 | $458.800 | $428.920 | $29.880 |
| `corporativa` | $180.000 | $29.900/mes | $322.920 | $538.800 | $502.920 | $35.880 |

`none` devuelve solo activación y continuidad nula. `monthly` entrega mensualidad, más la comparación condicional a mantener doce meses. `annual_prepay` usa `listAmount`, `discountAmount` y `discountRate` de la regla canónica; la interfaz no recalcula el 10%. La activación no recibe descuento. El API rechaza campos `activationAmount`, `continuityAmount`, `discountAmount`, `total` y `acceptedTermsAt` con `400 INVALID_SELECTION_FIELD`, sin devolver desglose. Producto/modo no permitidos responden `400`; `CIBERDAY` vencido responde `400 EXPIRED_CAMPAIGN`. No hay `requestId`, aceptación, orden o pago en la respuesta de precios.

La UI informa que gastos de dominio, alojamiento, SSL, backups, soporte y terceros no se agregan y quedan sujetos a evidencia/cotización. No afirma que estén incluidos. La proyección no dice “a pagar hoy”, no fija fecha de inicio/cobro y el CTA dice “Solicitud H03 pendiente de habilitación”.

## Oferta pública v0.6 y recorrido

El smoke HTTP obtuvo `200` en `/`, los tres `/productos/{slug}`, los tres `/demos/{slug}`, los tres `/activar/{slug}` y `/terminos`. No encontró importes de continuidad H03, modalidad H03 ni el rótulo de activación única H03 en esas superficies. `/terminos` conserva versión 0.6, periodicidad anual de doce meses y $120.000 / $160.000 / $180.000 CLP. La activación pública conserva la respuesta V2 con precio público vigente, sin `continuityMode`.

La vista no está enlazada desde el showroom. Los enlaces globales públicos permanecen; en la ruta interna se ocultan el popup promocional y la conversión flotante de WhatsApp para que el selector no salte al flujo actual. El link a `/#precios` solo permite volver a revisar la oferta pública v0.6. La selección interna no llega a V3 ni modifica WhatsApp prepared-not-sent.

## Antes / después

- **Antes:** existía el resolver canónico y el endpoint de precio cerrado por bandera, pero no había una vista interna de selector/desglose. El endpoint ignoraba campos monetarios sobrantes y volvía a calcular.
- **Después:** se agregó vista local server-gated, tabla comparativa calculada en servidor y rechazo explícito de campos fuera de la selección. La forma `pricing` de la respuesta existente se conserva y se añade el objeto `comparison`.
- **Oferta pública:** sin cambio de contenido/precios/periodicidad v0.6; H03 permanece no contratable y ausente de HTML público y assets estáticos.

## Validaciones ejecutadas

| Validación | Resultado |
|---|---|
| `npm run test:commercial` | PASS · 15/15, sin fallos. |
| `npm run test:commercial:v3-runtime` | PASS · 24/24: 9 precios por HTTP, producto/modo inválido, montos manipulados, campaña vencida, V3 bearer, rutas públicas y POST V2. Ejecutado en copia temporal y puerto loopback efímero. |
| `npm run build` | PASS · `astro check` 45 archivos, 0 errores, 0 advertencias, 0 hints; build Vercel completado. |
| Smoke función Vercel compilada | PASS · preview página 404, API precios 404, V3 sin bearer 401/con bearer 200; 0 tokens H03 en assets estáticos. |
| Gate local apagado | PASS · página/API `404`, sin filtración en cuerpo. |
| Chrome responsivo | PASS · viewports CSS 320, 500 y 1440 px; `scrollWidth <= clientWidth`, sin overflow horizontal. Capturas guardadas temporalmente en `/tmp/evcom-c09-preview-{320,500,1440}.png`. |
| Teclado y accesibilidad | PASS · selector con label, tres radios agrupados, Tab llega a “Sin continuidad”, flecha cambia a mensual y Tab llega al botón; foco visible de 3 px; estados `role=status`, `aria-live` y `aria-busy`; CTA H03 disabled. |
| Contraste calculado en Chrome | PASS · mínimos medidos dark 9,05:1; light 6,43:1; cyan 8,58:1 para textos muestreados; umbral aplicado 4,5:1 (3:1 para texto grande). |
| Loading/error | PASS · estado de carga `aria-busy=true`; API bloqueada produce error accesible y no conserva ni muestra precios alternativos. |
| `git diff --check` | PASS, tras revisar diff y añadir esta traza. |

La primera ejecución del smoke intentó iniciar Astro en el repo compartido y el CLI detectó un proceso ya activo en `localhost:4321`; no se detuvo ni reutilizó. Las ejecuciones completas se aislaron en copias temporales. La primera expectativa HTTP antigua permitía ignorar importes manipulados; se ajustó al contrato C09 que los rechaza, y la repetición completa terminó en 24/24.

## Pendientes

- **C10:** conectar selección a solicitud asistida V3 solo cuando corresponda; mantener bearer/flags server-side, confirmar vigencia/TTL y no registrar aceptación ni crear orden/pago.
- **C11:** decidir fecha efectiva, revisar términos e integración/release/rollback; probar destino real y confirmar `PUBLIC_TERMS_GATE` separado.
- **PUBLIC_TERMS_GATE:** continúa `PENDING` por evidencia operacional incompleta, revisión legal/tributaria pendiente y fecha efectiva no definida (C08). C09 no altera esa decisión.

**Siguiente cápsula:** `EVW-EVCOM-H03-L02-C10` · no ejecutada.
