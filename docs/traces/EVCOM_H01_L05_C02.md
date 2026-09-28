# EVCOM-H01-L05-C02 · Conversión contextual por WhatsApp

```text
CAPSULE=EVCOM-H01-L05-C02
STATUS=PASS
BRANCH=feature/evaas-commerce-v04
BASE_SHA=9cf51ff75a2debb3375b52448301dcbf65fd82f7
```

## Configuración y builders

- `PUBLIC_EV_WHATSAPP` es la única entrada del destino. `normalizeWhatsAppNumber()` acepta dígitos o un `+` inicial, limita a 15 dígitos y rechaza URL, espacios, guiones, paréntesis y otros caracteres. El `wa.me` se genera solo como `https://wa.me/<digits>`.
- `PUBLIC_EV_SALES_EMAIL` se valida antes de producir `mailto:`. Con ambos canales ausentes/inválidos no se renderiza un ancla WhatsApp ni contacto inventado.
- `src/lib/whatsapp.ts` concentra labels, sanitización, precios CLP, mensajes y URL. Los labels contractuales son Landing, Catálogo y Web Corporativa; colores `forest/garnet/ocean` se presentan como Verde bosque/Granate/Azul profundo. El color null se muestra como Por definir.
- El builder recibe `CommercialContextV1`; no consulta DOM, formulario ni precios enviados por cliente. No replica nombre, email, teléfono, proyecto, texto libre, UTM ni campos del formulario. `WHATSAPP_MESSAGE_PII=false`.
- `buildInquiryMessage()` no incluye referencia y devuelve solo la consulta genérica cuando no hay producto. `buildPostFormMessage()` exige contexto con pricing y UUID canónico, y reutiliza la referencia recibida; no crea otro UUID.

## Integración y comportamiento

- El enlace flotante se monta desde `BaseLayout`, actualiza su `href` ante cambios de contexto, usa enlace nativo, `target="_blank"`, `rel="noopener noreferrer"`, label accesible y foco visible. Se oculta en activación y confirmación; se oculta al intersectar el footer. La consulta ignora referencias históricas.
- `/confirmacion` conserva “Solicitud registrada” y “Volver al showroom”. “Continuar por WhatsApp” solo se revela con producto, pricing y UUID canónico coincidente con `id`; el destino reutiliza la referencia completa. Sin WhatsApp se ofrece email válido o texto neutro.
- El CTA de confirmación no tiene `href` mientras está oculto. No abre ventanas sin click ni altera `POST /api/activation`.
- El tracker allowlistea `whatsapp_opened` y `whatsapp_post_form_opened`. Solo se adjunta `product` (si existe), sin atribución ni UUID. Un único listener `data-track` procesa cada click.
- El campo WhatsApp del formulario no se usa como destino. WhatsApp no representa compra, pago ni activación confirmada. No se añadió Webpay, checkout ni cupón.

## Evidencia

- `npm run build` con número/email de prueba: Astro check sin diagnósticos, 14 rutas, build PASS.
- Builder verificado para los tres precios contractuales, cuatro estados de color, Home sin producto, referencia ausente, número E.164/dígitos y rechazo de entradas inválidas. `URLSearchParams` round-trip preserva Catálogo, IVA, `$`, espacios, saltos de línea y UUID completo: PASS.
- Chrome headless: Home genérico; selección Catálogo + ocean; demo Catálogo; ruta Corporativa + garnet; cambio de producto; CTA flotante ausente en activación; confirmación con mismo UUID; mensaje post-form Catálogo con total $153.510/color Azul profundo; URL `https://wa.me/56979959180`: PASS.
- Chrome headless: 1 click produce 1 evento para ambos orígenes y el payload no contiene PII, UUID ni atribución: PASS.
- Build con `PUBLIC_EV_WHATSAPP=` y email válido: no hay href `wa.me`, aparece fallback `mailto:info@espaciosvirtuales.lat`: PASS. Build con ambos canales ausentes: texto neutro y sin href WhatsApp: PASS.
- Capturas headless generadas a 320, 360, 390, 768, 1024 y 1440 px solicitados; CTA visible en Home de escritorio y contenido activación no es cubierto por CTA flotante, que está suprimido por ruta. El harness headless reportó viewport CSS mínimo de 500 px para las tres anchuras móviles solicitadas; no se usa ese dato como medición de layout CSS a 320/360/390.
- La forma nativa `POST /api/activation`, redirect 303 y no-JS permanecen sin cambios; regresión funcional C07/C01 existente registrada en `EVCOM_H01_L05_C01.md`.
- `git diff --check`: PASS.

## Hunks locales preservados

- `src/components/Footer.astro`: cambios editoriales preexistentes preservados.
- `src/layouts/BaseLayout.astro`: descripción editorial preexistente preservada fuera del staging; los cambios staged son solo import/montaje del CTA.
- `src/pages/index.astro`: cambios editoriales preexistentes preservados.
- `src/pages/demos/[slug].astro`: cambio editorial preexistente preservado.

## Resultado

```text
CONFIG_VALIDATION=PASS
INQUIRY_MODE=PASS
POST_FORM_MODE=PASS
REFERENCE_REUSE=PASS
PII_GUARD=PASS
TRACKING=PASS
NO_WA_FALLBACK=PASS
ACTIVATION_NO_JS_REGRESSION=PASS (C01/C07 evidence)
NEXT_ALLOWED=EVCOM-H01-L05-C03
```
