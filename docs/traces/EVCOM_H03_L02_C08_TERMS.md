# EVCOM H03-L02-C08 · Términos H03 versionados y matriz operacional

**Cápsula:** `EVW-EVCOM-H03-L02-C08`
**Gate documental:** `TERMS_DRAFT_PASS`
**Gate de publicación:** `PUBLIC_TERMS_GATE=PENDING`
**Rama:** `feature/evcom-h03-l02-comercial`
**BASE_SHA:** `c026aa955bbdaec8054b1d03db40245de742d9bb` (cierre C07)
**FINAL_SHA:** se informa en el reporte de gate que acompaña el commit; el commit que contiene esta traza no puede incluir su propio SHA en el árbol.

## Resultado

Se preservó el modelo económico aprobado el 2026-10-22 y se produjo un borrador contractual v0.3, una matriz de continuidad por servicio, un addendum al registro de decisiones y un gate de publicación separado. No se reabrió la aprobación de precios. La continuidad aprobada como modelo permanece sin oferta contractual concreta hasta verificar por servicio su contraprestación, responsable, costo, límites y evidencia.

`/terminos` v0.6 sigue vigente; `PUBLICATION_AUTHORIZED=NO`; `EFFECTIVE_DATE=NOT_SET`; revisiones jurídica y tributaria pendientes. La transición es prospectiva y no altera contratos anteriores. No se editó código, términos públicos, APIs, productos ni Handoff.

## Archivos creados/actualizados

1. `docs/contracts/commerce/ACTIVATION_CONTINUITY_PILOT_v0.3.md` — borrador interno `DRAFT_NOT_FOR_PUBLICATION`, versión técnica `1.0-draft`, fecha efectiva pendiente.
2. `docs/contracts/commerce/CONTINUITY_OPERATIONAL_MATRIX_v0.1.md` — evidencia, límites y decisión por serviceId; dos reglas v0.6 verificadas solo en su alcance de texto, servicios recurrentes candidatos `NOT_VERIFIED`.
3. `docs/decisions/EVCOM_H03_COMMERCIAL_DECISION_RECORD_v0.1.md` — addendum C08 al final del registro; preserva sin borrar o reemplazar las decisiones OD-01–OD-22.
4. `docs/decisions/EVCOM_H03_PUBLIC_TERMS_RELEASE_GATE_v0.1.md` — estados independientes y checklist v0.6 → H03; gate público continúa pendiente.
5. `docs/traces/EVCOM_H03_L02_C08_TERMS.md` — esta traza.

No existen archivos fuente faltantes entre los inspeccionados por el preflight: v0.1, v0.2, modelo financiero, copy contractual, decision record, reanudación, reglas comerciales, `/terminos` y contrato V3. Se preservaron las versiones de borrador previas v0.1/v0.2.

## Conciliación del modelo aprobado

La fuente canónica revisada fue `src/data/commercial-rules.ts` (`COMMERCIAL_RULES_VERSION=EVCOM-H03-PILOT-2026-10-22`, `TERMS_VERSION=1.0-draft`, `TERMS_EFFECTIVE_DATE=null`, `COMMERCIAL_RULES_PUBLIC=false`). Los tres productos y nueve resultados de modalidad se compararon contra la regla del servidor:

| Producto | Activación `one_time` | Mensual `monthly` | Prepago anual `annual_prepay` |
|---|---:|---:|---:|
| `landing` | $120.000 | $19.900/mes | $214.920 (12 × $19.900 − 10 %) |
| `catalogo` | $160.000 | $24.900/mes | $268.920 (12 × $24.900 − 10 %) |
| `corporativa` | $180.000 | $29.900/mes | $322.920 (12 × $29.900 − 10 %) |

El descuento se limita a doce mensualidades de continuidad; no rebaja activación. No acumulabilidad automática está en OD-04 y las reglas servidor rechazan campañas no compatibles. El borrador informa montos comerciales finales sin inferir IVA/exención, base o devengo; `TAX_REVIEW=PENDING`.

La tabla contractual es representación documental, no lógica ejecutable ni catálogo paralelo. `compositionProfile` sigue siendo descriptivo, no SKU. No se añadieron valores a `products.ts`, UI, JSON o CSS.

## Matriz de evidencia y límites

La matriz agrega servicios candidatos de alojamiento/infraestructura, SSL, dominio/DNS, backups, restauración probada, actualizaciones WordPress/plugin/theme, soporte, incidentes/disponibilidad, tráfico/almacenamiento, licencias/terceros, cuentas/accesos, exportación/portabilidad y derechos de activos. Cada fila registra responsable, costo/periodicidad, alcance, exclusiones, sistema/origen, decisión y tarea pendiente.

`VERIFIED` se usa solo para la regla de v0.6 que atribuye compra/titularidad del dominio al cliente y la regla de informar costos externos; no las convierte en servicios de continuidad. Hosting, administración DNS, SSL, respaldo, restauración, mantenimiento, soporte, SLA, capacidad, licencias administradas, ownership de cuentas, exportación y propiedad intelectual permanecen `NOT_VERIFIED` con fuentes inspeccionadas. Esto no afirma que no existan; la inclusión queda `PENDING_OPERATIONAL_EVIDENCE` y requiere evidencia específica.

La matriz registra una brecha de copy para release: v0.6 dice que Espacios Virtuales realiza conexión inicial y publicación en cuenta compatible; el copy público de UI de C05–C07 dice “Preparación para publicación según la cotización” porque no hay prueba de operación por cliente en la rama. C08 conserva ambos registros y remite su resolución prospectiva, sin modificar el texto público o acuerdos existentes, al gate de C11.

## Compatibilidad y transición

- C05–C07 mantienen la solicitud asistida, copy neutral y ausencia de checkout/pago/contrato automático. No se cambió ninguna de esas superficies.
- `src/lib/commercial-request-v3.ts`: contrato interno V3 versión 3, TTL de una hora, modos `none/monthly/annual_prepay`, `termsVersion=1.0-draft`, fecha nula y `DRAFT_NOT_FOR_PUBLICATION`; prepara texto solamente, no aceptación ni pago.
- Handoff V2 en `src/lib/activation-handoff.ts` y `/api/activation` se mantienen sin cambios. El V3 no sustituye V2.
- `/terminos` v0.6 mantiene contratación anual y precios $120.000/$160.000/$180.000 CLP; su archivo no cambió.
- El `PUBLIC_TERMS_GATE` requiere servicio verificable, revisión legal y tributaria, aceptación versionada, fecha efectiva/decisión de release y pruebas de UI/cotización/handoff; v0.6 se archiva en Git y debe existir rollback probado.

La matriz legal/tributaria enlaza fuentes oficiales para evaluación; C08 no las convierte en dictámenes. BCN señala que Ley 21.719 tiene vigencia diferida al 2026-12-01; asesoría debe confirmar su alcance en los flujos y fecha efectivos. SII y Ley Chile se citan como materiales de revisión, no como determinación tributaria o legal de los servicios.

## Validaciones

- `npm run test:commercial`: PASS, 14/14; reglas, tres productos y modalidades internas, rechazo de manipulación, versión no pública y gate runtime por defecto.
- `npm run build`: PASS; Astro check con 0 errores, 0 advertencias y 0 hints; build compilado y prerenderizado.
- Cálculo documental vs servidor: los importes y el descuento del borrador coinciden con la autoridad canónica para los tres slugs; cobertura del test comercial PASS.
- Inspección de `/terminos` público, `products.ts`, reglas, rutas API y Handoff: no presentan diff; condiciones públicas v0.6 conservadas.
- `git diff --check`: PASS después de incluir los cinco documentos C08.
- `npm run test:commercial:v3-runtime`: `NOT_RUN` en C08. La traza C05 documenta que una repetición anterior no completó por encontrar un proceso Astro existente en `localhost:4322`; no se declara nuevo resultado HTTP ni se termina ese proceso. C04B registra un PASS histórico separado. C11 debe repetir la prueba en puerto aislado, con autorización/credenciales y regresión V2; no inferir PASS actual a partir de C04B.
- No se ejecutó humo HTTP de runtime V3 ni prueba de aceptación durable/versionada en C08; el diseño de aceptación se documentó sin implementarlo.

## Próxima etapa

`NEXT: EVW-EVCOM-H03-L02-C09`. C09 puede preparar una previsualización interna bajo el estado no público. No publicar, no contratar continuidad aún y no ejecutar C11 desde C08.
