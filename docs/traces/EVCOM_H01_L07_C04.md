# EVCOM-H01-L07-C04 · E2E de conversión asistida

## Resultado

- Estado: `PASS` en la base `43cb949b21be8136ef7640f2cda4af8dc60acda6`, rama `feature/evaas-commerce-v04`.
- Validación y fixes en clone temporal limpio `/tmp/evcom-h01-l07-c04-work`. El worktree principal no se tocó.
- Browser/harness: Chrome headless `137.0.7151.55`, CDP `9222`; Astro dev `127.0.0.1:4331` con `PUBLIC_EV_WHATSAPP=56979959180` (solo harness) y `127.0.0.1:4332` sin WhatsApp, con email comercial configurado.
- No se envió ningún mensaje. Las ventanas abrieron la interfaz externa de WhatsApp; el usuario conserva la acción de revisar y pulsar Enviar.

## Recorridos de los tres productos

- Landing: `/` → `/productos/landing` → click a `/demos/landing` → color Granate → click a `/activar/landing` → categoría Servicios profesionales → API PASS → popup WhatsApp → confirmación. Viewport 320×568.
- Catálogo: `/` → `/productos/catalogo` → click a `/demos/catalogo` → color Azul profundo → click a `/activar/catalogo` → categoría Comercio / productos → API PASS → popup WhatsApp → confirmación. Viewport 390×844 con `prefers-reduced-motion: reduce`.
- Corporativa: `/` → `/productos/corporativa` → click a `/demos/corporativa` → color Azul profundo → click a `/activar/corporativa` → categoría Tecnología / servicios digitales → API PASS → popup WhatsApp → confirmación. Viewport 1440×900.
- La ruta de producto se cargó desde la sesión iniciada en Home; en cada página de producto se usaron sus enlaces reales a demo y activación. Se conservaron producto y color a través de demo y formulario. H1, categoría, dominio, contexto y consentimiento estuvieron presentes en los tres formularios.
- Precios contractuales comprobados en las tres respuestas del servidor y los briefs: Landing `$117.810` (neto 99.000, IVA 18.810); Catálogo `$153.510` (neto 129.000, IVA 24.510); Corporativa `$177.310` (neto 149.000, IVA 28.310). IVA 19%.
- El handoff y el mensaje automático incluyeron el producto contractual, el valor IVA incluido, color, proyecto de prueba, categoría con etiqueta humana, dominio, objetivo opcional y UUID completo. El CTA manual tuvo exactamente el mismo texto que el popup automático en los tres productos. La confirmación mostró los primeros ocho caracteres en mayúsculas y conservó Volver al showroom.
- La URL de WhatsApp se construyó con el helper desde `https://wa.me/56979959180`; Chrome siguió la redirección externa a `api.whatsapp.com/send`. Esto no envió el mensaje.

## Orden de submit, popups y fallos

- Instrumentación CDP dentro del gesto real de submit observó `window.open('about:blank')` → fetch `/api/activation` → respuesta 200. Después, el target secundario navegó a WhatsApp y la pestaña EVAAS llegó a `/confirmacion?producto=<slug>&id=<uuid>&wa=opened`.
- La pestaña EVAAS quedó abierta. El brief no se envió automáticamente; la interfaz conserva la revisión y el botón Enviar bajo control del usuario.
- Popup bloqueado (`window.open = () => null`): API PASS, sin target nuevo, referencia corta preservada, `wa=blocked` y CTA manual con brief completo.
- Sin WhatsApp (servidor `4332`): API PASS, confirmación `wa=unavailable`, email comercial y ningún target nuevo. El selector también ofrece mailto en vez de un enlace wa.me.
- Configuración WhatsApp inválida: `getWhatsAppConfig()` devolvió `null` para cadena incorrecta, URL y valor vacío.
- API 500 y fetch rechazado: ambos dejaron el formulario en su ruta, conservaron proyecto/contexto, reactivaron el botón, cerraron el popup y mostraron error. `activation_error` solo incluyó producto y metadatos permitidos; el nombre y contexto ficticios no aparecieron en analytics.
- API 400 por validación/timing: el API respondió sin `requestId` ni handoff; el manejador cliente trata toda respuesta no-OK por la misma rama de recuperación de formulario.
- Respuesta simulada 200 con handoff inválido: conserva referencia, navega a confirmación `wa=invalid`, oculta el CTA WhatsApp, muestra contacto por correo y no reconstruye un brief desde el contexto del cliente.
- Fallo de `sessionStorage`: escritura/lectura del helper falló sin excepción visible. En recorrido E2E, el handoff canónico retornado por el servidor aún abrió WhatsApp con proyecto y categoría; EVAAS llegó a confirmación con referencia.

## API, validación y sanitización

- Para los tres productos, el API retornó UUID canónico y pricing contractual derivado del slug de producto.
- DOM y body manipulados con `pricing`/`finalPrice` cliente no cambiaron el pricing del handoff.
- Product inválido, color inválido, categoría ausente, categoría inválida, dominio inválido, consentimiento ausente y proyecto vacío dieron 400 sin `requestId` ni handoff. Color vacío fue válido y quedó como `null` / “Por definir”.
- Categorías variadas: `professional-services`, `commerce-products`, `technology-digital`. La revisión y los tres briefs mostraron sus etiquetas humanas.
- Proyecto con espacios repetidos y control interno se normalizó a `Proyecto de Prueba Sur`; proyecto fue requerido y el máximo server-side fue 100 caracteres. Contexto cercano a 650 caracteres quedó limitado a 600. Contexto vacío no añadió línea `Objetivo`.
- Timing JSON: menos de 1200 ms y más de 24 h dieron 400; timing normal dio 200.
- JSON válido soportado; JSON malformado dio 400; contenido no soportado dio 415. URL-encoded y multipart nativos tuvieron 303.
- Honeypot JSON respondió `discarded=true`, `requestId=null`, sin handoff. Honeypot nativo redirigió a `/confirmacion?producto=landing` sin id; no creó una referencia.
- POST nativo sin JS probado en Landing, Catálogo y Corporativa con JavaScript de página deshabilitado: categoría visible/requerida, ambos pasos visibles, form `method=post`, validación nativa y 303 a confirmación con UUID.

## Handoff

- Lectura válida antes de 60 minutos: PASS. Más de 60 minutos y fecha futura fuera de tolerancia de cinco minutos: rechazadas.
- JSON corrupto, referencia distinta, producto distinto, pricing alterado, categoría inválida y color inválido: rechazados; el corrupto se descarta de sesión.
- Almacenamiento deshabilitado o con excepción: helper devuelve fallo controlado, sin crash. El recorrido automático usa el handoff validado de la respuesta API.
- `SERVER_DURABLE_IDEMPOTENCY=N/A_H01`; el sistema no declara idempotencia durable.

## Doble submit

- Antes del fix, dos `requestSubmit()` simultáneos enviaron dos fetches aunque luego el botón quedara disabled.
- Se añadió un estado `submitting` sincrónico antes del primer `await`; el manejador de error lo libera junto con el botón.
- Repetición de la misma carrera: un fetch, un flujo de popup y una navegación; `1 requestId` potencial porque solo una respuesta puede completar. No se añadió persistencia ni idempotencia de servidor.

## Selector asistido y analytics

- Ecommerce/pagos produjo brief `Necesidad: Ecommerce / pagos` y punto de partida Catálogo de Productos. Integración produjo `Necesidad: Integración` y punto de partida Web Corporativa.
- Responder la tercera pregunta no abrió ventanas; el conteo CDP se mantuvo. El CTA requiere click explícito y no incluye referencia, proyecto, categoría ni datos personales. Reset vuelve a la pregunta uno.
- Selector sin WhatsApp ofreció email; se comprobó el fallback. Resultado estándar conserva tres productos y sus precios de contrato.
- En el recorrido estándar se observaron `demo_opened`, `activation_started`, `whatsapp_post_form_opened` (`mode=automatic`), `activation_submitted` y `activation_completed`; el selector emitió `selector_completed` con resultado permitido. La reapertura manual registró `mode=fallback`.
- Eventos excluyeron proyecto, categoría, dominio, contexto, mensaje, URL `wa.me?text=`, correo, teléfono y nombre. `request_id` solo aparece en los eventos permitidos de activación.
- No se generaron eventos `message_sent`, `lead_received`, `order_created`, `paid` ni `paid_verified`.

## Privacidad, layout y exclusiones v0.5

- `/privacidad` cubre categoría, sesión temporal y TTL 60 minutos, apertura automática, envío manual, recuperación ante popup bloqueado y que ver confirmación no significa mensaje enviado. También declara que no crea cuenta, orden ni registro CRM permanente.
- Consentimiento en los tres formularios es required, inicialmente unchecked, con enlaces a privacidad y términos; no contiene finalidad de marketing.
- Smoke responsive Home, las tres activaciones, confirmación y privacidad a 320×568, 390×844 y 1440×900: 18/18 sin overflow horizontal; categoría visible/requerida en activaciones y confirmación renderizada. Los tres recorridos completos cubrieron 320, 390 y 1440; el de 390 usó reduced motion.
- `rg` sin coincidencias activas para checkout/payment providers/transactions/`paid_verified`, motor de cupón, webhooks o dependencias HubSpot/Airtable/Supabase/Firebase/CRM en `src` y `.env.example`.
- No se añadió producto, precio, pago, cupón, CRM, webhook, almacenamiento durable ni dependencia.

## Hallazgos y correcciones

- `src/pages/activar/[slug].astro`: se impide que dos eventos submit simultáneos creen requests/popup duplicados; solo un handoff validado produce `activation_submitted`.
- `src/pages/activar/[slug].astro` y `src/pages/confirmacion.astro`: handoff inválido conserva referencia y muestra fallback de correo; la confirmación no construye un WhatsApp parcial con datos del cliente.
- Reruns después de los fixes: carrera de submit, handoff inválido, los tres happy paths, popup bloqueado, API 500/network, sin WhatsApp, no-JS 3/3 y build/auditorías.

## Build, seguridad y preservación

- `npm ci`: PASS (349 paquetes instalados; sin nuevas dependencias).
- Build final: `npm run build` PASS, Astro 0 errores, 0 warnings, 14 rutas.
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilidades; auditoría completa: 0.
- `npm ls path-to-regexp --all`: `6.3.0` (override ya existente, sin cambios).
- `git diff --check`: PASS.
- Fix funcional: commit `fix: close H01 assisted conversion E2E findings`.
- Sin capturas temporales stageadas. Los `.c04-*.mjs` son harness temporal, no parte del diff.
- Worktree principal preservado en `d79d9300eb0d16f473991b16fcc683133968d12c`. Cambios externos locales observados y preservados:
  - `src/components/Footer.astro`
  - `src/components/Header.astro`
  - `src/components/ProductSelector.astro`
  - `src/layouts/BaseLayout.astro`
  - `src/pages/demos/[slug].astro`
  - `src/pages/index.astro`
  - `src/styles/global.css`

## Pendiente

- Verificación del navegador LinkedIn: `MANUAL_REQUIRED`.
- Pago/checkout: fuera de H01.
- Automatización de cupón: fuera de H01.
- Orden e idempotencia durable: H02.
