# EVCOM-H01-L05-C07 · Simplificar activación asistida sin CRM

## Resultado

`STATUS=PASS` · Rama `feature/evaas-commerce-v04` · Baseline `b4bf0cdc8579754c36b3f8510ff764af36e1832b`.

La rebaseline v0.5 hace que el formulario prepare una referencia efímera y un brief de continuidad. El envío comercial sucede cuando la persona abre WhatsApp y pulsa **Enviar**. No se afirma persistencia durable ni recepción antes de esa acción.

## Cambios

- Retirada la dependencia de `ACTIVATION_WEBHOOK_URL`; `.env.example` ya no la declara y el endpoint no llama a servicios externos.
- Quitados nombre, correo y teléfono del formulario, la validación, el payload y la revisión. H01 ya no solicita datos personales de contacto que no utiliza.
- Formulario v0.5: producto y color desde el contexto; proyecto obligatorio sanitizado a 100 caracteres; dominio obligatorio (`owned`, `needed`, `unsure`); contexto opcional sanitizado a 600 caracteres; consentimiento desmarcado; honeypot `website`.
- Wizard mejorado de dos pasos: proyecto; revisión y consentimiento. Sin JavaScript se muestran todos los campos y el submit nativo.
- El endpoint valida producto, proyecto, dominio, color y consentimiento en servidor; resuelve el precio contractual por producto; genera UUID con `crypto.randomUUID()` y entrega `{ ok, requestId, handoff }`. No devuelve preview, checkout ni estado de pago.
- La referencia es efímera: no identifica una fila de base de datos, un lead CRM, una orden ni un intento de pago. El handoff C06 sigue usando `evaas_activation_handoff_v1`, `sessionStorage` y TTL de 60 minutos, sin contacto personal.
- `activation_submitted` significa formulario validado y handoff preparado; no significa lead almacenado. Analítica sigue sin incluir proyecto, contexto, dominio ni mensaje.
- Confirmación usa “Solicitud preparada” y explica que se debe continuar por WhatsApp para enviar el brief. El CTA abre `wa.me` solo tras un clic; la persona revisa y envía el mensaje. Si WhatsApp no está configurado, se ofrece correo sin afirmar que la solicitud fue recibida.
- Se conserva “Empieza y luego crece.”, el fallback C02 cuando el contexto comercial sigue válido y el brief enriquecido C06.

## Validación

- Producción sin webhook: `astro preview` no pudo iniciar con el adaptador Vercel en este entorno. Se invocó el handler compilado de `.vercel/output` (bundle de producción, con `ACTIVATION_WEBHOOK_URL` removida del entorno) para JSON válido de Landing, Catálogo y Corporativa; todos devuelven HTTP 200, `ok=true`, UUID v4 válido y handoff con pricing contractual.
- Landing `Taller Aurora`, dominio `owned`, objetivo indicado y color `garnet`: validado con total `117810` CLP IVA incluido.
- Formulario nativo sin webhook: los tres productos devuelven HTTP 303 hacia `/confirmacion?producto=…&id=<UUID>`.
- Honeypot no genera UUID/handoff válido. El timing se exige solo en JSON enhanced; el POST nativo no depende de `formStartedAt`.
- UUID de respuesta, handoff y referencia del brief WhatsApp coinciden. WhatsApp se limita a construir un enlace con `wa.me`; no hay autoapertura ni autoenvío.
- Verificados los tres formularios sin captura de nombre/correo/teléfono, el wizard de dos pasos, los campos no-JS, el fallback de correo y el copy de confirmación.
- `ACTIVATION_WEBHOOK_URL` y campos de contacto del formulario: cero referencias activas en los paths revisados.
- `npm run build`: PASS; rutas: 14. `git diff --check`: PASS.
- Responsive revisado visualmente con Chrome headless en viewport real (500 px), 768 px y 1440 px; no se aprecia overflow horizontal. La validación real de 320/360/390 px permanece explícitamente diferida a L07.

## Alcance excluido y regresiones

- Webpay/PayPal, Orders/PaymentIntent/PaymentTransaction, automatización de cupones y CRM siguen diferidos.
- C01 contexto, C02 WhatsApp, C05 cierre y C06 handoff permanecen compatibles; CommercialContext no cambia su schema.
- Los cambios locales preexistentes en `Footer.astro`, `BaseLayout.astro`, `index.astro` y `demos/[slug].astro` se preservan fuera del commit.

## Tracking semantics

`activation_submitted` registra el formulario validado y el handoff preparado. `activation_completed` registra la llegada a confirmación; ninguno implica persistencia o entrega comercial. La entrega ocurre cuando la persona envía el mensaje por WhatsApp.
