# EVW-EVCOM-H03-L02-C10 · Activación, confirmación y WhatsApp V3

Fecha de validación: 2026-11-04

Repositorio: `Espacios-Virtuales/evaas-commerce`

Rama: `feature/evcom-h03-l02-comercial`

BASE_SHA: `ab663129ae13a8321750bbf26b4e8d519d87de8d`

FINAL_SHA: HEAD del commit C10, informado literalmente en el cierre workbook. El hash de un commit no puede guardarse dentro de su propio árbol sin cambiar ese hash.

## Resultado y límites

**GATE: `ASSISTED_SELECTION_PASS`**, limitado al recorrido interno de desarrollo, con gate público `NOT_AUTHORIZED`. El flujo termina en un mensaje revisable de WhatsApp; no envía mensajes, no registra aceptación contractual y no crea órdenes, cotizaciones durables, pagos ni membresías.

`/terminos` v0.6 conserva la contratación anual y los valores públicos de $120.000 / $160.000 / $180.000 CLP. Los importes y modalidades H03 siguen ocultos en páginas y assets públicos. El borrador `1.0-draft` conserva `termsEffectiveDate: null`. No se modificó la aprobación comercial del 2026-10-22 ni se habilitó contratación pública.

## Superficies cambiadas

- `src/components/H03CommercialPreview.astro`: campos mínimos, resumen V3, vigencia, revisión del texto, validación explícita y enlace manual de WhatsApp; sin almacenamiento en `localStorage` o `sessionStorage`.
- `src/pages/internal/h03-preview.astro`: prop de UI habilitada solo por el gate privado C10, dentro de la guardia C09 existente.
- `src/pages/api/internal/h03-preview-request.ts`: adaptador dev-only para `create` y `validate`, en loopback y same-origin; usa creación/sanitización V3, el catálogo de productos, reglas canónicas y `buildWhatsAppUrl` existente.
- `src/lib/commercial-pricing-presentation.ts`: cálculo compartido de comparación a 12 meses, ahorro y continuidad listada.
- `src/pages/api/commercial-pricing.ts`: reutiliza ese cálculo compartido, conservando contrato y respuesta C09.
- `tests/commercial-rules.test.mjs`, `tests/v3-runtime-smoke.mjs`, `tests/c10-production-artifact-smoke.mjs`, `tests/c10-preview-browser-smoke.mjs` y scripts de prueba añadidos en `package.json`.
- Evidencia visual: [320 px](evidence/evcom-h03-c10/evcom-c10-request-320.png), [500 px](evidence/evcom-h03-c10/evcom-c10-request-500.png), [1440 px](evidence/evcom-h03-c10/evcom-c10-request-1440.png).

No se editaron `src/pages/terminos.astro`, `/api/activation`, `/confirmacion`, `/activar/[slug]`, `src/lib/activation-handoff.ts`, Handoff V2, WhatsApp público, páginas C05–C07 ni el contrato/modelo económico C08. C04B permanece con su endpoint bearer protegido sin cambios.

## Recorrido y autoridad

1. La persona selecciona uno de los tres productos y `none`, `monthly` o `annual_prepay` en `/internal/h03-preview`.
2. El navegador envía solo slug, modalidad, nombre del proyecto, estado del dominio y objetivo opcional. El endpoint rechaza claves extra, incluidos importes, referencias y aceptación.
3. El servidor crea el documento V3 mediante `createCommercialRequestV3`; el importe se resuelve en `src/data/commercial-rules.ts`. El documento lleva referencia temporal, versión de reglas/términos, `DRAFT_NOT_FOR_PUBLICATION` y TTL de una hora.
4. La pantalla muestra propósito, alcance, modalidad, activación, continuidad, ahorro cuando aplica y comparación estimada. La mensualidad se etiqueta por mes y se aclara que no implica cobro inicial ni doce meses obligatorios. El prepago anual aparece separado de la activación y sin declarar cobro o fecha de inicio.
5. La persona revisa el mensaje. Solo al pulsar “Validar vigencia y habilitar enlace”, el endpoint vuelve a ejecutar el sanitizer V3, valida precios y TTL y, si existe configuración WhatsApp, entrega una URL `wa.me` con el texto canónico. La UI nunca abre WhatsApp automáticamente. La persona todavía debe revisar el chat y pulsar Enviar.

No se exige correo, teléfono, cuenta, organización o login. Nombre, dominio y objetivo se mantienen en memoria de página y en la respuesta de la petición; no se persisten ni se registran en logs. El servidor no acepta ni guarda `acceptedTermsAt`. La ficha informa que dominio, hosting/alojamiento, SSL, respaldos, soporte y otros costos externos no se incluyen por defecto ni tienen valor asignado.

## Protección observada

| Superficie | Dev local C09 + C10 habilitado | C09 habilitado, C10 apagado | Vercel build/runtime |
|---|---|---|---|
| `/internal/h03-preview` | 200 solo en loopback | C09 pricing continúa; formulario V3 no se renderiza | 404 |
| `POST /api/commercial-pricing` | 200 en loopback según reglas | Mantiene su gate C09 | 404 |
| `POST /api/internal/h03-preview-request` | 200 con same-origin y loopback | 404 | 404 |
| `POST /api/internal/commercial-request-v3` C04B | Requiere bearer server-side | Sin cambio | Sin cambio; gate runtime apagado |

El nuevo endpoint exige `import.meta.env.DEV`, `EVCOM_H03_PRICING_API_ENABLED=true`, `EVCOM_H03_PREVIEW_REQUEST_ENABLED=true`, dirección loopback y `Origin` igual al origen de la solicitud. Un origen distinto recibe 403. El preview público o requests desde direcciones no loopback reciben 404. No se usan `PUBLIC_*`, query tokens ni estado del navegador para autorizar.

Para una revisión local autorizada, ambas variables privadas deben estar activas al iniciar Astro en loopback: `EVCOM_H03_PRICING_API_ENABLED=true EVCOM_H03_PREVIEW_REQUEST_ENABLED=true npm run dev -- --host 127.0.0.1`. Sin el segundo flag, C09 mantiene su vista de precios y el recorrido de solicitud C10 desaparece; los métodos no admitidos del endpoint C10 responden 404.

`tests/c10-production-artifact-smoke.mjs` invocó el handler compilado de `@astrojs/vercel` con switches privados activados en runtime: la constante de build `DEV=false` mantuvo 404 en página, precios, adaptador C10 y endpoint V3 runtime deshabilitado. También inspeccionó 28 archivos estáticos; no encontró importes, modos ni marca H03. El bundle server-side conserva la implementación detrás de guardias; no hay datos H03 en HTML/JS/CSS públicos.

## Matriz canónica 3 × 3

Importes en CLP. La comparación a 12 meses es un cálculo de lectura del modelo interno; no es un importe cobrado ni un compromiso de permanencia. El 10% se aplica solo a continuidad anual prepagada.

| Producto | Sin continuidad | Mensual + comparación estimada | Prepago anual + ahorro + comparación |
|---|---:|---:|---:|
| `landing` | Activación $120.000 | $19.900/mes · 12 meses estimados $358.800 | $214.920 · ahorro $23.880 · estimado $334.920 |
| `catalogo` | Activación $160.000 | $24.900/mes · 12 meses estimados $458.800 | $268.920 · ahorro $29.880 · estimado $428.920 |
| `corporativa` | Activación $180.000 | $29.900/mes · 12 meses estimados $538.800 | $322.920 · ahorro $35.880 · estimado $502.920 |

Los nueve escenarios se solicitaron por HTTP al adaptador V3 local. Las activaciones y continuidades coincidieron con `commercial-rules.ts`; `monthly` conserva cadencia mensual y `annual_prepay` registra el descuento únicamente en continuidad. No hay cálculo autoritativo ni catálogo H03 en el navegador.

## Casos y evidencia

- **Manipulación de cifras y campos:** `total=1`, `activationAmount`, `acceptedTermsAt` y campos extra se rechazan con `INVALID_REQUEST_FIELD`; un borrador con pricing alterado se rechaza con `INVALID_OR_TAMPERED_REQUEST` y no recibe URL.
- **Entradas inválidas:** producto (`INVALID_PRODUCT`), modalidad (`INVALID_CONTINUITY_MODE`), tipo/nombre de proyecto (`INVALID_PROJECT`), dominio (`INVALID_DOMAIN_STATUS`), origen (`INVALID_ORIGIN`) y referencia V3 inválida (rechazo de sanitizer). El modo mensual/anual y slug siempre se recalculan en servidor.
- **TTL:** una solicitud vencida responde HTTP 410 `REQUEST_EXPIRED`; la UI informa vencimiento, quita el enlace y el texto copiable, y permite preparar un borrador nuevo.
- **Error de API:** prueba de navegador bloqueó por separado el endpoint de precio y el de validación; la UI anunció el error, no mostró fallback de precios ni habilitó enlace. El texto seguía visible para revisión mientras el borrador no había vencido.
- **WhatsApp sin configuración:** prueba runtime con `PUBLIC_EV_WHATSAPP` vacío devolvió `whatsappAvailable=false` y `whatsappUrl=null`; la pantalla conserva texto/copia como alternativa.
- **Acción manual:** el browser test creó un borrador sin abrir targets, validó el enlace sin abrir WhatsApp y luego hizo una activación de teclado Enter sobre el enlace usando un número de prueba. El test bloqueó navegación `wa.me`, comprobó el enlace al composer y que el mensaje seguía disponible para revisión/copia. No se autenticó una cuenta WhatsApp y no se envió ningún mensaje.
- **V2:** el smoke HTTP verificó que `/api/activation` mantiene respuesta Handoff V2 y precio vigente, y que CiberDay expirado sigue siendo rechazado en los contratos que lo admiten.
- **Público:** smoke de home, tres detalles, tres demos, tres activaciones y `/terminos`; valores públicos v0.6 anuales presentes y sin mensualidades/importes H03. El endpoint C09 existente continúa aislado en dev.
- **Build:** `npm run build` pasó con Astro check en 49 archivos: 0 errores, 0 warnings y 0 hints; Vercel adapter completó el build.
- **Pruebas:** `npm run test:commercial` 15/15; `npm run test:commercial:v3-runtime` 27/27 más gate-off y fallback WhatsApp HTTP; `npm run test:commercial:v3-artifact` PASS sobre 28 assets.
- **Responsive/teclado:** Chrome verificó el selector y revisión a 320, 500 y 1440 px; `documentWidth === clientWidth`, sin overflow, y el encabezado de revisión despejado del header sticky. Tab y flechas cambiaron la modalidad; foco visible medido con outline sólido de 3 px. Labels y `role=status`/`aria-live=polite` presentes.
- **Contraste:** contraste calculado en los temas dark/light/cyan; mínimo medido 6.43:1 (supera 4.5:1 en el contenido evaluado).
- **Capturas:** las tres imágenes enlazadas arriba muestran el resumen interno de revisión a cada ancho. La prueba de navegador también capturó la vista selector previa en `/tmp/evcom-c10-preview-{320,500,1440}.png`.

Las primeras pruebas de loopback encontraron la restricción de socket del sandbox y una instancia Astro existente en el puerto 4321. Se ejecutaron luego en copias temporales bajo `/tmp`, con puertos efímeros; no se detuvo ni reutilizó ningún proceso ajeno.

## Pendientes de C11

- Mantener `PUBLICATION_AUTHORIZED=NO` y `PUBLIC_TERMS_GATE=PENDING` mientras la continuidad tenga contraprestación operativa no verificada, revisión jurídica/tributaria pendiente y `EFFECTIVE_DATE=NOT_SET`.
- Resolver la matriz de continuidad servicio por servicio; decidir términos prospectivos, consentimiento versionado, fecha efectiva, tratamiento de clientes v0.6 y rollback.
- Solo tras autorización explícita, C11 puede conectar la solicitud V3 al recorrido público, actualizar los términos y activar la experiencia comercial. Esta cápsula no modifica esas superficies.

## Cierre Git

- Rama y BASE_SHA confirmados antes de editar; no se sobrescribió trabajo previo.
- `git diff --check`: PASS.
- Se prepara un commit exclusivo `feat: connect protected H03 assisted request and WhatsApp V3`.
- Sin push, merge, PR ni deploy; C11 no ejecutado.
