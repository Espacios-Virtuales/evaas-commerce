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

Hasta cerrar esos puntos no se programan importes hipotéticos, no se modifica `/terminos` v0.6 y no se crea una ruta de contratación H03 parcialmente válida.

## C04 · Dependencia

C04 permanece `BLOCKED_BY_C03`. El handoff V2 sigue vigente y no se modifica. No se crean `quote`, orden, pago, checkout, suscripción ni cuenta de usuario.
