# EVCOM-H01-L08-C01 · Integración H01 en develop

- Cápsula: `EVCOM-H01-L08-C01`
- Rebaseline: `v0.5-launch-mvp`
- Rama fuente: `feature/evaas-commerce-v04`
- SHA fuente validado: `c9039f5665520a4785a029eb35c64a0c4639a911`
- Rama destino: `develop`
- SHA develop previo: `f113fb06078dbc875b563bc263b52d6d9bce8361`
- SHA main antes y después de integrar: `f113fb06078dbc875b563bc263b52d6d9bce8361`
- Estado inicial: `develop...feature` divergido; merge base `82d0f18b6272116bd58f8233b5b3546e32737e4d`; feature 3 commits adelante y develop 2 commits adelante.
- Commits exclusivos de develop preservados: `a0ab0b82ae26afdf1f135e89547e0095e0fb4738 repair` y `f113fb06078dbc875b563bc263b52d6d9bce8361 repair`.

## Integración e historia

- Escaneo anterior al merge: 3 líneas de marcadores (un bloque) en `src/components/ProductSelector.astro` de develop.
- El primer intento de reconciliación fue el merge Git; no se editaron archivos antes de integrarlo.
- Conflictos reportados por Git: 0. El merge ort resolvió el bloque preexistente con el ProductSelector validado del feature.
- Escaneo global posterior: 0 marcadores (`<<<<<<<`, `=======`, `>>>>>>>`).
- Merge no-ff: `6d3f5f0a2b75693b72e4e540e93082745abe6c77`, mensaje `merge: integrate EVAAS Commerce showroom v0.5`.
- Padres: develop previo `f113fb06078dbc875b563bc263b52d6d9bce8361` y feature `c9039f5665520a4785a029eb35c64a0c4639a911`.
- Ambos padres y ambos commits `repair` son ancestros del merge. Sin squash ni rebase.

## Semántica v0.5 y alcance

- ProductSelector conserva “Evaluación asistida”, el mensaje “Esta necesidad requiere una solución asistida”, el arquetipo inferido y CTA a WhatsApp/correo. Ecommerce/integraciones se derivan a evaluación humana; no se presenta un producto ecommerce ni se restaura el copy descartado.
- Footer conserva EVAAS Commerce como experiencia comercial, ESPACIOS VIRTUALES SpA como empresa responsable y EVAAS Station como familia de activaciones.
- Términos conservan Versión 0.5 · Actualizado: 1 de octubre de 2026, precios anuales y evaluación del alto tráfico como costo mensual separado.
- Continúan fuera de H01: pagos/checkout activos, Webpay, PayPal, `paid_verified`, automatización de cupones, CRM, webhook de activación y orden durable. Menciones de alcance/documentación no implementan esas capacidades.
- Se preservan `docs/security/EVCOM_H01_CVE_2026_93748_EXCEPTION.md` y `docs/traces/EVCOM_H01_L07_VALIDATION.md`.

## Build y seguridad post-merge

- `npm ci`: PASS; instaló 349 paquetes y reportó 1 HIGH.
- `PUBLIC_EV_WHATSAPP=56979959180 npm run build`: PASS; Astro 0 errores, 0 warnings, 14 rutas.
- `git diff --check`: PASS.
- `npm audit --omit=dev --audit-level=high`: 1 HIGH.
- `npm audit --audit-level=high`: 1 HIGH.
- Único advisory en ambas auditorías: `CVE-2026-93748` / `GHSA-ch52-4w7c-c8xp`, `http-cache-semantics@4.2.0` vía `astro@7.3.5`.
- `path-to-regexp`: `6.3.0`; `http-cache-semantics`: `4.2.0`.
- No se declara audit limpio. Se mantiene la excepción upstream temporal `NO_REACHABLE_CURRENT_H01`, documentada en el feature validado. Sin advisory nuevo.

## Smoke mínimo

- Chrome headless, 390×844 y 1440×900: `/`, ProductSelector estándar y asistido, `/productos/landing`, `/demos/landing`, `/activar/landing`, `/confirmacion`, `/terminos`, `/privacidad` y footer: PASS.
- Selector estándar resuelve Landing Comercial; ecommerce asistido muestra el arquetipo Catálogo de Productos y prepara el enlace `wa.me` de prueba.
- Sin overflow horizontal del documento en las rutas comprobadas; errores/excepciones de runtime: 0.
- Smoke directo del handler `/api/activation`: POST válido respondió 200 con `requestId` y handoff V1 consistente. El helper generó la URL `wa.me` con el número de prueba `56979959180`; no se envió ningún mensaje real. La ruta de confirmación cargó correctamente.
- Este smoke acotado no repite las matrices C02/C04.

## Tracks paralelos, main y decisión

- Validación manual: `IN_PROGRESS`.
- Deployment/Vercel: `IN_PROGRESS`; SHA desplegado no informado (`N/A`). Revalidar sobre el nuevo SHA de develop: `YES`.
- LinkedIn: URL exacta y render seguro `PASS`; navegador real `MANUAL_PENDING`.
- `main` permanece en `f113fb06078dbc875b563bc263b52d6d9bce8361`; no se modificó ni se desplegó.
- Rama feature preservada en `c9039f5665520a4785a029eb35c64a0c4639a911`.
- SHA develop resultante del merge: `6d3f5f0a2b75693b72e4e540e93082745abe6c77`.
- Decisión: `STATUS=PASS`; historia de develop y feature preservada, sin blockers funcionales nuevos. HIGH upstream declarado explícitamente, no ocultado.
- Pendiente para release: smoke manual/Vercel sobre el SHA final; LinkedIn en navegador real si sigue pendiente; revisar excepción cuando Astro o el paquete upstream publiquen una corrección; pagos/checkout fuera de H01, cupones fuera de H01 y orden durable/idempotencia H02.
