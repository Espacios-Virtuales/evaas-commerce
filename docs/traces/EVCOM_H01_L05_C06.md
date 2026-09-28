# EVCOM-H01-L05-C06 · Brief comercial de activación para WhatsApp

```text
CAPSULE=EVCOM-H01-L05-C06
STATUS=PASS
BRANCH=feature/evaas-commerce-v04
BASE_SHA=cfe2ae50a57e40acec1befbebfa5526a982f826c
REBASELINE=v0.5-launch-mvp
```

## Modelo y aceptación

- `src/lib/activation-handoff.ts` define `ActivationHandoffV1`, con `version: 1`, UUID de referencia, producto, pricing, color, proyecto, estado de dominio, objetivo y timestamp. El contrato se mantiene separado de `CommercialContextV1`.
- La API acepta consentimiento antes de construirlo. Usa producto, pricing y `createdAt` resueltos en servidor; la referencia es el único `crypto.randomUUID()` de la solicitud. El brief solo se incluye tras el éxito del webhook (o la respuesta preview local de desarrollo).
- `sanitizeHandoffText()` elimina controles, reemplaza saltos por espacios, recorta y limita proyecto a 100 y contexto a 600 caracteres. El contexto vacío se permite. Se preservan tildes y emoji como texto.
- El handoff reconstruido contiene únicamente versión, referencia, producto, pricing, color, proyecto, estado de dominio, contexto y creación. No contiene nombre, correo, teléfono, consentimiento ni atribución. Analytics no recibe campos del brief.
- `sessionStorage` usa `evaas_activation_handoff_v1`, TTL de 60 minutos y no escribe a `localStorage`. Precio se vuelve a validar contra la tabla contractual; un dato inválido, vencido o no correlacionado se descarta de forma segura.

## Mensaje y confirmación

- `buildInquiryMessage()` y `buildPostFormMessage()` permanecen como consulta previa y fallback C02. `buildActivationHandoffMessage()` es el builder enriched separado; `buildWhatsAppUrl()` continúa siendo el único generador de URL.
- Labels de brief: Landing Comercial, Catálogo de Productos y Web Corporativa. El mensaje presenta el total como valor IVA incluido; colores y estados de dominio usan labels legibles. El objetivo se omite si está vacío.
- La activación almacena `result.handoff` solo después de `response.ok`, y exige que `handoff.reference === result.requestId`; luego adopta ese mismo UUID en CommercialContext y navega a confirmación. Fallo de storage conserva el fallback C02.
- Confirmación prefiere handoff solo si coinciden UUID y producto con los parámetros resueltos. Mismatch, corrupción o expiración eliminan el registro y usan C02 cuando CommercialContext coincide. El enlace requiere click y nunca envía el mensaje automáticamente.
- `WHATSAPP_INQUIRY_HAS_USER_DATA=false` y `WHATSAPP_POST_FORM_HANDOFF_HAS_USER_DATA=true` documentan correctamente la diferencia. El brief consentido no se duplica en analytics.

## Retiro del camino legacy de pago

- Se eliminaron `CHECKOUT_URL_LANDING`, `CHECKOUT_URL_CATALOGO`, `CHECKOUT_URL_CORPORATIVA` del ejemplo de entorno y de la API.
- La API JSON ya no devuelve `checkoutUrl`; el cliente siempre continúa a confirmación. La búsqueda solicitada en `src` y `.env.example` produjo cero coincidencias.
- No se añadieron pagos, órdenes, Webpay, PayPal ni estados de pago. Cupón continúa en null.

## Evidencia

- Builder/storage en Node: tres productos y sus totales contractuales; labels de color y dominio; proyecto/contexto; contexto vacío; encoding del UUID y acentos; eliminación de controles; allowlist de storage; rechazo de referencia/producto distintos, precio alterado, expiración y JSON corrupto: PASS.
- API Node con payload que envió `pricing.total=1`: respuesta handoff conservó el total contractual de los tres productos; `requestId === handoff.reference`; controles eliminados; consentimiento inválido devuelve 400. Native form mantiene 303 a confirmación con UUID: PASS.
- API con webhook simulado: exactamente un POST. Handoff solo llegó en respuesta tras HTTP 204; HTTP 500 devuelve 502 sin UUID ni handoff: PASS. No se llamó un webhook externo.
- Chrome headless: brief enriquecido de Landing, storage allowlist, CommercialContext sin datos de formulario, reload conserva handoff, un click/una analítica sin datos del brief, fallback C02 tras mismatch de referencia/producto, storage corrupto y expirado: PASS.
- Chrome headless confirmation + CTA a 320, 360, 390, 768, 1024 y 1440 solicitados: enlace visible dentro del viewport y `scrollWidth === clientWidth` en los seis casos. Chromium conserva un mínimo de 500 px CSS para las tres anchuras móviles solicitadas (client width 469 px); esas tres mediciones no se presentan como viewport CSS exacto de 320/360/390.
- Build con WhatsApp vacío y email válido: fallback `mailto:` presente, cero enlaces `wa.me` rotos. `npm run build`: Astro check 32 archivos sin diagnósticos, 14 rutas, PASS.
- El formulario nativo/API y el redirect 303 permanecen disponibles; evidencia no-JS de las tres rutas está registrada en `EVCOM_H01_L05_C01.md` (C07).
- `git diff --check`: PASS.

## Hunks locales preservados

- `src/components/Footer.astro`: edición editorial preservada.
- `src/layouts/BaseLayout.astro`: edición local de descripción preservada.
- `src/pages/index.astro`: ediciones editoriales preservadas.
- `src/pages/demos/[slug].astro`: edición editorial preservada.

## Resultado

```text
HANDOFF_TTL=60_MINUTES
SERVER_SOURCE=PASS
CONSENT_GATE=PASS
PRICING_AUTHORITY=PASS
CONTEXT_PRIVACY=PASS
CHECKOUT_URL_REMOVAL=PASS
NO_JAVASCRIPT_POST_303=PASS (prior C01/C07 evidence)
NEXT_ALLOWED=EVCOM-H01-L05-C05
```
