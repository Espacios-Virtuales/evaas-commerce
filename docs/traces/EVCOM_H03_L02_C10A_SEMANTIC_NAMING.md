# EVW-EVCOM-H03-L02-C10A · Normalización semántica

## Ejecución

- Rama: `feature/evcom-h03-l02-comercial`
- `BASE_SHA`: `a546b089a57cc24b2991fa3dbf5a86958ba688d1`
- `FINAL_SHA`: asociado al commit de esta cápsula; el hash completo se entrega en el reporte de cierre para evitar una referencia circular dentro de este archivo.
- Commit previsto: `refactor: use domain naming for commercial preview`
- Alcance: nombres de runtime, rutas internas, símbolos, configuración privada, pruebas y este registro. No se modifican precios ni prestaciones.

## Migraciones

| Nombre anterior | Nombre estable | Consumidores actualizados | Ruta/efecto | Prueba |
|---|---|---|---|---|
| `H03CommercialPreview.astro` | `CommercialSelectionPreview.astro` | Ruta interna, tipos del componente, scripts de navegador y pruebas de fuente | Sin ruta propia | Build y prueba de navegador |
| `/internal/h03-preview` | `/internal/commercial-preview` | `BaseLayout`, pruebas HTTP, artefacto y navegador | La ruta anterior deja de existir; sin alias o redirección | Prueba HTTP local y handler Vercel |
| `/api/internal/h03-preview-request` | `/api/internal/commercial-request-preview` | Componente, pruebas HTTP, artefacto y navegador | La ruta anterior deja de existir; sigue en loopback, DEV y same-origin | Prueba HTTP, manipulación, TTL y artefacto |
| `resolveH03Pricing` | `resolveCommercialRulesPricing` | API de precios, constructor V3 y pruebas | Sin cambio de cálculo | 9 combinaciones de precios, suite comercial y runtime |
| `EVCOM_H03_PRICING_API_ENABLED` | `EVCOM_COMMERCIAL_PRICING_PREVIEW_ENABLED` | Página y API local de precios, pruebas de navegador/runtime/artefacto | Switch de servidor; sin prefijo `PUBLIC_` | 404 en artefacto Vercel con el switch forzado |
| `EVCOM_H03_PREVIEW_REQUEST_ENABLED` | `EVCOM_COMMERCIAL_REQUEST_PREVIEW_ENABLED` | Página y API de solicitud de prueba, pruebas runtime/artefacto | Switch de servidor; ambos switches siguen siendo obligatorios para el borrador | Gate apagado 404; Vercel 404 con switches de preview forzados |
| `EVCOM_H03_V3_RUNTIME_ENABLED` | `EVCOM_COMMERCIAL_REQUEST_V3_RUNTIME_ENABLED` | API autenticada V3 y pruebas de runtime/artefacto | Gate del adaptador V3 sin cambio de comportamiento | Runtime HTTP con gate y credencial; artefacto con gate apagado 404 |
| `EVCOM_H03_V3_RUNTIME_TOKEN` | `EVCOM_COMMERCIAL_REQUEST_V3_RUNTIME_TOKEN` | API autenticada V3 y pruebas de runtime/artefacto | Secreto de servidor; no se expone en cliente | Autorización V3 y ausencia de credencial en artefacto |
| `EVCOM-H03-PILOT-2026-10-22` | `EVCOM-COMMERCIAL-PILOT-2026-10-22` | `commercialRulesVersion` emitido por el mismo cálculo canónico | El campo V3 permanece igual; cambió el identificador de reglas que contenía el ID del hito. No hay solicitudes persistidas. Borradores con versión anterior no se reutilizan | Pruebas de reglas, V3 y validación de borradores |
| Clases, IDs y atributo `h03-*` / `data-h03-preview` | `commercial-*` / `data-commercial-preview` | Componente y prueba de navegador | Solo selectores internos de la vista | Build y prueba de navegador |
| `tests/c10-preview-browser-smoke.mjs` | `tests/commercial-preview-browser-smoke.mjs` | `package.json` y comando npm | Archivo de prueba con nombre de responsabilidad | `npm run test:commercial:v3-browser` |
| `tests/c10-production-artifact-smoke.mjs` | `tests/commercial-preview-artifact-smoke.mjs` | `package.json` y comando npm | Archivo de prueba con nombre de responsabilidad | `npm run test:commercial:v3-artifact` |

Los archivos de trazabilidad y decisiones anteriores conservan sus IDs para no reescribir el historial. Se eligió `resolveCommercialRulesPricing` porque `src/lib/commercial-context.ts` ya define `resolveCommercialPricing` para la oferta pública v0.6; mantenerlos diferenciados evita confundir las dos fuentes de precio. El comentario de la paleta ya no incorpora el marcador documental `L01-C04` dentro de código fuente.

## Protección y compatibilidad

| Superficie | Condición de acceso | Resultado fuera de condición |
|---|---|---|
| `/internal/commercial-preview` | `import.meta.env.DEV`, switch de precios interno y dirección loopback | 404 vacío, `no-store` |
| `POST /api/commercial-pricing` | DEV, switch de precios interno y loopback | 404 vacío, `no-store` |
| `POST /api/internal/commercial-request-preview` | DEV, ambos switches privados, loopback y mismo origen | 404 vacío; origen no permitido recibe 403 |
| `POST /api/internal/commercial-request-v3` | Gate de runtime existente y bearer token de servidor | Gate apagado: 404; credencial incorrecta: 401 |

El adaptador V3 conserva su ruta, versión de contrato, campos, validación de montos, TTL y canal WhatsApp `prepared-not-sent`. Las variables antiguas dejan de leerse. No se encontraron en `.env`, `.env.local` ni `.env.example`; si una configuración externa contiene esos nombres, deberá migrarla a los nombres nuevos antes de habilitar el runtime. Las páginas de preview siguen inaccesibles en producción aunque sus switches de preview se fuercen a `true`.

El artefacto Vercel comprobó 404 para la página y las API de preview con switches de preview forzados; los recursos estáticos públicos se inspeccionaron para precios/modalidades de continuidad, identificador de reglas, flags y campos internos. El adaptador V3 se comprobó en el artefacto con el gate apagado y sin secreto; su autenticación de servidor no se cambió.

## Contratos públicos y límites

- Los slugs continúan siendo `landing`, `catalogo` y `corporativa`.
- `commercialRulesVersion` conserva su campo V3 y ahora tiene un valor semántico. El cálculo server-side, importes, descuento anual, modalidades y `termsVersion` no cambian.
- `/api/activation`, Handoff V2, `/terminos` v0.6, precios públicos, portada, fichas y demos no tienen diferencias respecto de la base.
- No se agrega una ruta pública, alias, redirect, selector de producción ni flag del navegador.
- Las trazas C08/C10 con los nombres originales se conservan como historial. Esta tabla es la referencia de migración para el código actual.

## Pruebas realizadas

- `npm run test:commercial`: PASS, 15/15.
- `npm run test:commercial:v3-runtime`: PASS, 27/27; nueve combinaciones, tampering, TTL, entradas inválidas, WhatsApp preparado explícitamente, campañas y compatibilidad V2. El smoke usa puertos locales asignados dinámicamente y no detiene procesos externos.
- `npm run test:commercial:v3-artifact`: PASS; 28 recursos estáticos revisados y handler Vercel con rutas internas de preview 404.
- `npm run test:commercial:v3-browser`: PASS; 320, 500 y 1440 px sin overflow, contraste mínimo observado 6.43:1, teclado/radiogrupo/foco verificados y WhatsApp abierto solo tras activación explícita. Capturas: `/tmp/evcom-commercial-preview-{320,500,1440}.png` y `/tmp/evcom-commercial-request-{320,500,1440}.png`.
- `npm run build`: PASS; 49 archivos Astro, cero errores, advertencias o hints; salida Vercel compilada.
- Smoke HTTP público: inicio, 3 productos, 3 demos, 3 activaciones y `/terminos` v0.6; `/api/activation` V2 compatible.
- `git diff --check`: PASS antes del commit; se repetirá al cerrar.
- Auditoría final de `src`, `tests`, `package.json` y configuración: cero IDs `H03`, `L02`, `C10`, `C09` o `C04B`; cero nombres y rutas anteriores en pruebas activas.

## Pendientes

- Actualizar nombres de variables en cualquier entorno externo antes de habilitar la API V3; mantenerlo apagado hasta entonces.
- La autorización de release público, los términos H03 efectivos y la matriz operacional corresponden a C11 y siguen fuera de esta cápsula.
- No se hizo push, merge ni deploy.
