# EVCOM H03-L02 · Reanudación tras aprobación comercial

**Fecha:** 2026-10-22 (`America/Santiago`)

**Rama:** `feature/evcom-h03-l02-comercial`

**Aprobación comercial:** `OWNER_COMMERCIAL_MODEL_APPROVED`

**Producción:** `UNCHANGED`

## C01A · Decisión registrada

La aprobación expresa del propietario en la conversación del 2026-10-22 quedó incorporada al registro de decisiones. Comprende activación única, continuidad opcional mensual o anual prepagada, importes finales del piloto, 10 % de descuento solo sobre doce mensualidades, no acumulación automática y copy tecnológicamente neutral sujeto a verificación de alcance.

Commit: `ec68e9a` (`docs: record owner approval for H03 commercial model`).

No se registraron como aprobados servicios no especificados ni revisiones no ejecutadas. `LEGAL_TAX_REVIEW` permanece `PENDING_VALIDATION`.

## C02 · Neutralidad tecnológica

La inspección confirmó que Astro y Vercel corresponden a la arquitectura del showroom (`astro.config.mjs` y `package.json`), no a un requisito contractual de las entregas. Se eliminaron como promesa comercial sin alterar esa arquitectura.

La variante preferida `PUBLICATION_CONFIRMED` requería demostrar capacidad de publicación y conexión por producto. Al no existir en el repositorio un procedimiento de entrega, un responsable operacional ni una prueba de ejecución para sitios de clientes, se aplicó la alternativa autorizada:

> Preparación para publicación según la cotización.

La conexión del dominio y los costos externos quedan sujetos a la cotización. Esta redacción se usa en datos de producto, portada/comparador, tarjetas, fichas y activación; las demos heredan `product.includes`.

Commits: `a2d0536` eliminó la dependencia comercial del proveedor y `8b8a273` aplicó la variante conservadora después de verificar la brecha operacional.

### Validación C02

- `npm run build`: PASS; Astro verificó 36 archivos con 0 errores, 0 advertencias y 0 hints.
- Smoke HTTP: PASS (200) para `/`, tres productos, tres demos, tres activaciones, `/terminos` y `/confirmacion`.
- Copy renderizado: PASS; las superficies comerciales muestran «Preparación para publicación según la cotización» y no muestran «Publicación inicial en Vercel».
- Regresión de API: PASS para los tres productos; `total=1` fue ignorado y el servidor devolvió $120.000/$160.000/$180.000 con handoff V2.
- Campaña `CIBERDAY` vencida al 2026-10-22: 400, sin aplicación silenciosa.
- `/terminos` conserva v0.6 y su periodicidad anual; confirmación conserva «solicitud preparada».
- QA visual automatizada no disponible en este entorno; no se marca como ejecutada.

## Verificación operacional

`VERIFIED` significa que el repositorio contiene evidencia suficiente del compromiso descrito. Una mención comercial o la configuración técnica del showroom no demuestra capacidad operacional para clientes.

| Prestación | Resultado | Límite | Responsable | Prueba revisada |
| --- | --- | --- | --- | --- |
| Preparación para publicación | `VERIFIED` como alcance editorial/técnico acotado del producto | Solo según cotización; no implica publicar | Responsable de la activación por identificar en la cotización | Alcances de producto, build reproducible y copy acotado |
| Publicación inicial de sitio cliente | `NOT_VERIFIED` | No ofrecer por omisión | No identificado | Solo existe despliegue del showroom; no hay procedimiento o prueba de entrega a cliente |
| Conexión de dominio | `NOT_VERIFIED` como capacidad operacional | Solo si la cotización la confirma | No identificado; dominio a cargo del cliente | `/terminos` v0.6 la declara, pero no hay procedimiento, prueba ni asignación operacional |
| Hosting | `NOT_VERIFIED` | Fuera de continuidad base hasta definición | No identificado | Sin proveedor, cuenta, plan, costo o procedimiento |
| SSL | `NOT_VERIFIED` | Fuera de continuidad base hasta definición | No identificado | Sin emisión, renovación, monitoreo o prueba |
| Backups | `NOT_VERIFIED` | No incluidos | No identificado | Sin frecuencia, retención, ubicación o prueba |
| Restauración | `NOT_VERIFIED` | No incluida | No identificado | Sin RPO/RTO, procedimiento o prueba |
| Actualizaciones | `NOT_VERIFIED` | No incluidas | No identificado | Sin componentes, frecuencia o procedimiento |
| Soporte e incidencias | `NOT_VERIFIED` | No incluidos; canal comercial no es soporte | No identificado | Sin canal operativo, horario, cupo, severidades o SLA |
| Tráfico y sobreconsumo | `NOT_VERIFIED` | Se evalúa y cotiza antes de aplicar | No identificado | Sin umbral, medición, alertas o tarifa |
| Portabilidad/exportación | `NOT_VERIFIED` | No incluida | No identificado | Sin paquete, formato, plazo o procedimiento de salida |
| Dominio del cliente | `VERIFIED` como regla comercial vigente | Cliente compra y conserva el dominio | Cliente | `/terminos` v0.6 y decisión comercial; no acredita gestión delegada |
| Terceros, licencias y ampliaciones | `VERIFIED` como regla de exclusión | Se identifican y cotizan por separado | Cliente aprueba; operador por definir | `/terminos` v0.6 y aprobación comercial del 2026-10-22 |

## C03 · Bloqueos concretos

El modelo y los importes ya están aprobados; no se solicita una nueva aprobación genérica. `TERMS_AND_PRICING_PASS` no puede emitirse todavía por estas brechas específicas:

1. La continuidad tiene modalidades e importes aprobados, pero no tiene una prestación incluida verificable. Publicar mensualidad o prepago sin describir qué recibe el cliente produciría una oferta incompleta.
2. Renovación, cancelación, suspensión, reembolsos, propiedad intelectual, portabilidad y salida no cuentan con texto jurídicamente revisado.
3. El tratamiento tributario está expresamente `PENDING_VALIDATION`; no existe evidencia de revisión contable/tributaria H03.
4. La vigencia fue definida como «al publicarse», pero el release separado aún no tiene fecha efectiva. Activar reglas sin esa fecha impediría separar contratos v0.6 anteriores de H03.
5. No existe todavía un mecanismo versionado para registrar aceptación de términos H03; el consentimiento actual no conserva `termsVersion` ni `acceptedTermsAt` en un contrato durable.

### Solución recomendada

- Definir la contraprestación mínima de continuidad o declarar esas modalidades no disponibles hasta contar con servicios verificables.
- Someter el texto contractual H03 a revisión jurídica y tributaria y registrar su resultado.
- Fijar `termsVersion`, `commercialRulesVersion` y la fecha efectiva del release.
- Aprobar el mecanismo de aceptación versionada antes de exponer la modalidad en el formulario o API.

Hasta cerrar esos puntos no se publican precios ni se modifica `/terminos` v0.6 como oferta efectiva. La autorización comercial posterior del 2026-10-22 permite implementar y probar los precios aprobados en una fuente interna; no convierte las modalidades en oferta disponible.

### Implementación técnica C03 (continuación)

Estado: `IMPLEMENTED_AND_TESTED` para cálculo canónico en entorno de desarrollo; `PENDING_RELEASE_REVIEW` para publicación.

- `src/data/commercial-rules.ts` define `EVCOM-H03-PILOT-2026-10-22`, los tres importes aprobados, los modos `none`, `monthly` y `annual_prepay`, redondeo determinista a pesos enteros y descuento anual exclusivo de continuidad. Incluye `termsVersion: 1.0-draft`, fecha efectiva nula y estado `DRAFT_NOT_FOR_PUBLICATION`.
- `POST /api/commercial-pricing` recalcula en servidor y descarta importes enviados por el navegador. Rechaza productos, modalidades y códigos no válidos; no permite acumular campañas. Está cerrado con 404 salvo que `EVCOM_H03_PRICING_API_ENABLED=true` se establezca expresamente en un entorno de prueba/release.
- La respuesta es una vista previa desglosada, no crea `requestId`, cotización durable, orden ni pago. No modifica el API de activación ni el handoff V2.
- `tests/commercial-rules.test.mjs`: pruebas de reglas PASS, incluyendo las nueve combinaciones producto/modalidad, manipulación de importes, modalidad inválida y campaña activa/vencida/desconocida. Prueba HTTP opcional con `EVCOM_TEST_BASE_URL`.
- Verificación del gate por defecto: `POST /api/commercial-pricing` devuelve 404 sin la bandera. En instancia local de prueba con la bandera habilitada, las 7 pruebas de integración pasaron.
- Smoke de regresión `POST /api/activation`: PASS, conserva respuesta `handoff.version: 2` y precio legado del producto.
- `npm run build`: PASS, Astro comprobó 39 archivos con 0 errores, advertencias o hints.

### Términos H03 preparados

`docs/contracts/commerce/ACTIVATION_CONTINUITY_PILOT_v0.2.md` es un borrador interno `DRAFT_NOT_FOR_PUBLICATION`. `/terminos` público sigue en v0.6, con los importes anuales y su fecha vigentes. El borrador separa activación, continuidad y adicionales, declara expresamente que la continuidad aún no está disponible porque no hay contraprestación operacional demostrada y enumera los gates legal, tributario, operacional, de dominio, versión/fecha efectiva y aceptación.

La continuidad de $19.900/$24.900/$29.900 mensual y $214.920/$268.920/$322.920 anual está implementada como cálculo para pruebas internas. No se muestra en la oferta, no puede seleccionarse desde la interfaz pública y no se debe contratar hasta superar los gates documentados.

### Gates de publicación aún pendientes

1. `SERVICE_SCOPE`: definir contraprestación, responsable, límites, costos y pruebas de cada modalidad de continuidad.
2. `DOMAIN_DELIVERY`: evidencia de publicación/conexión cliente, responsable, cuenta, criterios y costo; por ahora se mantiene «Preparación para publicación según la cotización».
3. `LEGAL_REVIEW`: revisar cancelación, renovación, suspensión, devolución, propiedad intelectual, salida y aceptación.
4. `TAX_REVIEW`: confirmar tratamiento tributario y documento de venta.
5. `ACCEPTANCE_RECORD`: definir una aceptación versionada para una oferta futura; la solicitud y WhatsApp siguen siendo asistidos.
6. `RELEASE_REVIEW`: fijar fecha efectiva y comprobar las superficies públicas en una cápsula de release separada.

C03 queda técnicamente preparada para integración controlada. El gate `TERMS_AND_PRICING_PASS` para publicación permanece pendiente hasta completar estos puntos. C04 puede revisar integración de su solicitud/handoff solo manteniendo precios marcados como borrador y sin hacer disponibles las modalidades al público.

## C04 · Contrato interno compatible

Estado: `PARTIAL_INTERNAL_CONTRACT_ONLY`; no equivale a `ASSISTED_SELECTION_PASS` ni habilita selección pública de modalidades.

- Se añadió `src/lib/commercial-request-v3.ts` como contrato V3 aislado del Handoff V2. Incluye referencia `requestId`, producto canónico, perfil de composición descriptivo (no SKU), proyecto, dominio, objetivo, modalidad, desglose recalculado desde reglas H03, versiones y TTL de una hora.
- La sanitización vuelve a calcular el precio canónico y rechaza alteraciones, modalidad/producto inválidos, referencias inválidas, solicitudes expiradas y estados que no sean borrador. V2 guardado, vencido o de otro producto no se convierte ni se interpreta como V3; el código V2 permanece sin cambios.
- `buildCommercialRequestV3Message` solo prepara texto; identifica importes como borrador interno y aclara que no constituye orden, pago ni aceptación. No abre ni envía WhatsApp automáticamente.
- No se conectó V3 con `/api/activation`, el formulario, la confirmación ni el almacenamiento público. Las modalidades y precios H03 siguen fuera de la oferta; no se registra `acceptedTermsAt` porque los términos no tienen vigencia.
- No se crea cotización durable, orden, pago, checkout, suscripción ni cuenta. La compatibilidad runtime quedó aislada para C04B; el flujo de UI continúa pendiente y sujeto a revisión de release.

Validación C04 parcial: `npm run test:commercial` PASS (10/10; modalidades, tampering, rechazo de solicitudes expiradas y brief preparado); `npm run build` PASS (40 archivos, 0 errores/advertencias/hints). No se marca smoke de rutas ni `ASSISTED_SELECTION_PASS`, pues V3 no se encuentra conectado a una ruta pública.

## C04B · Integración runtime controlada

Estado: `V3_RUNTIME_PASS` para el endpoint interno; no equivale a `ASSISTED_SELECTION_PASS`.

- `POST /api/internal/commercial-request-v3` reutiliza el contrato V3 y el cálculo canónico existente. Genera `requestId` en servidor; solo recibe selección y datos mínimos, ignora cualquier importe enviado y devuelve el desglose resuelto más un borrador textual de WhatsApp.
- El endpoint devuelve 404 salvo `EVCOM_H03_V3_RUNTIME_ENABLED=true`; requiere además `EVCOM_H03_V3_RUNTIME_TOKEN` con al menos 32 caracteres y `Authorization: Bearer …`. Falta de secreto devuelve 503 y credencial ausente/incorrecta 401. Usa `Cache-Control: no-store`, limita el cuerpo a 16 KiB y no expone CORS.
- Valida versión de contrato 3, versión de reglas, versión de términos `1.0-draft`, producto, modalidad y campaña. No admite registrar `acceptedTermsAt` porque el borrador no tiene vigencia. Recalcula precios en servidor, no persiste la solicitud y no crea orden/pago/membresía.
- `/api/activation`, el flujo público y el Handoff V2 no cambiaron. Smoke local del V3: 401 sin credencial/credencial incorrecta; 200 con token, importes adulterados ignorados y texto `prepared-not-sent`; 400/409 para producto, modalidad, versiones, aceptación y campañas inválidas/vencidas. Regresión de `/api/activation`: `handoff.version: 2`, precio legado intacto.
- `isV3RuntimeEnabled`: pruebas unitarias confirman cerrado si falta la bandera o su valor no es exactamente `true`. El smoke HTTP se ejecutó con el endpoint habilitado y autenticación válida; no se marca como smoke HTTP separado el 404 por defecto.
- `npm run test:commercial:v3-runtime`: PASS (15/15 incluyendo unitarias y HTTP local); `npm run build`: PASS (41 archivos, 0 errores/advertencias/hints); `/terminos` permanece v0.6 y no muestra importes H03.

Pendiente para la UI C04 posterior: añadir selección solo cuando la publicación esté autorizada; propagar versiones vigentes y modalidad al endpoint sin precios client-side; guardar/leer V3 con TTL y rechazo explícito de V2 vencido u otro producto; abrir WhatsApp únicamente tras revisión/acción del usuario; validar teclado/móvil, fallos API/storage/WhatsApp y smoke de rutas. No afirmar `ASSISTED_SELECTION_PASS` hasta probar ese recorrido completo.
