# EVCOM H03-L02 · Revisión técnica y gate de release

- **Cápsula:** `EVW-EVCOM-H03-L02-C11`
- **Fecha:** 2026-11-07 (`America/Santiago`)
- **Rama:** `feature/evcom-h03-l02-comercial`
- **BASE_SHA:** `d0fe74520695cc9f55f2382e61421e1f94f2e0d3`
- **FINAL_SHA:** se informa en el cierre Codex; no se inserta un hash autorreferencial en este commit.
- **Decisión económica:** `APPROVED_2026-10-22`; no se reabrieron los importes.
- **Oferta pública durante C11:** v0.6.

## Decisiones separadas

| Gate | Estado | Alcance |
|---|---|---|
| `H03_EXPERIENCE_GATE` | `PASS` | Las rutas, reglas, solicitud V3, protección, compatibilidad V2 y UX interna revisadas están listas para una revisión de release. La vista H03 sigue siendo interna. |
| `PUBLIC_RELEASE_GATE` | `BLOCKED` | No están acreditadas prestaciones de continuidad, revisiones jurídica/tributaria, aceptación contractual versionada, fecha efectiva ni el procedimiento final de migración y rollback. |

`L02: TECHNICALLY_READY_FOR_RELEASE_REVIEW`. `PUBLIC_OFFER: V0_6`. Este cierre no concluye H03 como oferta pública ni autoriza cambios en `develop`, `main` o producción.

Checklist futuro de gate y reversión: [EVCOM_H03_L02_RELEASE_CHECKLIST.md](EVCOM_H03_L02_RELEASE_CHECKLIST.md).

## Preflight y alcance

- Repositorio: `/home/adareloise/Documents/desarrollo/ev/interfaces/evaas-commerce`.
- Rama y árbol al inicio: `feature/evcom-h03-l02-comercial`, limpio.
- `HEAD` y último commit: `d0fe74520695cc9f55f2382e61421e1f94f2e0d3 refactor: use domain naming for commercial preview`; coincide con el SHA de referencia.
- Se revisaron las trazas C05, C06, C07, C08, C09, C10 y C10A, `EVCOM_H03_L02_RESUMPTION.md`, el registro de decisión comercial, el gate público C08, el borrador de términos v0.3 y la matriz operacional.
- Los únicos cambios de C11 son cuatro mejoras de cobertura/aislamiento de pruebas y esta revisión con su checklist. No se tocaron precios de producción, productos, páginas públicas, `/terminos`, `/api/activation` ni Handoff V2.

## Matriz transversal C01–C10A

| Área | Evidencia revisada en C11 | Resultado y límite |
|---|---|---|
| C01/C01A · modelo y autoridad económica | Contrato C01 v0.1, modelo financiero C02, registro OD-01–OD-05 y traza de reanudación | Los borradores iniciales se mantienen como historial. La aprobación expresa del propietario de 2026-10-22 es la autoridad vigente y no se reabre. Activación, mensualidad y prepago anual conservan los importes aprobados; el 10% aplica a doce mensualidades de continuidad, no a activación. |
| C02–C04B · neutralidad, copy y reglas | Copy C03, fuente canónica `commercial-rules.ts`, runtime V3 autenticado, campañas y fuente pública `products.ts` | Se conserva el copy neutral sujeto a cotización. El servidor calcula los nueve escenarios. Importes, descuento, versiones y campañas inválidas/vencidas tienen cobertura unitaria y HTTP. `requestId` identifica una solicitud; no crea quote, orden, pago ni aceptación. Preparación para publicación solo acredita alcance técnico/editorial sujeto a cotización. |
| C05 · inicio | Traza C05, prueba comercial y smoke de portada | Claro · Simple · Evolutivo, Activa → Mantén → Amplía, cuatro fundamentos y CTA de solicitud preservados. La oferta pública sigue siendo la anual v0.6. |
| C06 · catálogo/comparador | Traza C06, catálogo canónico, prueba comercial y smoke HTTP | Solo `landing`, `catalogo` y `corporativa`; precios públicos $120.000/$160.000/$180.000 por contratación anual. Exclusiones y Catálogo no transaccional preservados. |
| C07 · detalles/demos | Traza C07 y smoke HTTP actual | Las seis rutas de producto/demo responden 200; el smoke incluye CTA/rutas existentes y ausencia de montos/modalidades internas. Las capturas y verificaciones visuales C07 se conservan como evidencia histórica. |
| C08 · términos/operación | Términos v0.3, matriz operacional y gate público | Borrador `1.0-draft`, sin vigencia. `/terminos` permanece v0.6. Evidencia operacional solo es `VERIFIED` para dos reglas de texto v0.6; el resto de servicios candidatos sigue pendiente. |
| C09 · selector | Smoke HTTP, artefacto Vercel y navegador | Nueve combinaciones coherentes en el servidor; estados de carga/error cubiertos. Página y APIs internas no publican datos en el artefacto. |
| C10 · solicitud/WhatsApp | Runtime V3 y browser smoke | Selección → borrador V3 → revisión → validación explícita → enlace. Sin persistencia, orden, pago, aceptación ni envío automático. WhatsApp solo se abre con activación humana; la prueba bloquea navegación externa y no afirma entrega. |
| C10A · nomenclatura | Búsqueda de fuente, pruebas, nombres y config | Cero identificadores H03/C10/C09/L02 en `src`, pruebas, scripts activos o config auditada. Las rutas estables y V2/V3 se conservan. Las trazas históricas retienen sus identificadores para auditoría. |
| V2 y campañas | Smoke de activación y pruebas HTTP | `/api/activation` conserva `handoff.version: 2` y el precio público de landing. Las campañas vencidas y referencias/versiones inválidas se rechazan. |

## Precios aprobados y condición de disponibilidad

Importes comerciales aprobados por el propietario (CLP):

| Producto | Activación única | Continuidad mensual | Prepago anual de continuidad |
|---|---:|---:|---:|
| `landing` | $120.000 | $19.900 | $214.920 |
| `catalogo` | $160.000 | $24.900 | $268.920 |
| `corporativa` | $180.000 | $29.900 | $322.920 |

El descuento de 10% se aplica solo sobre doce mensualidades de continuidad: $23.880, $29.880 y $35.880 respectivamente. Los nueve resultados se recalculan desde la fuente canónica; campos `total`, `activationAmount`, `continuityAmount`, `discountAmount`, `annualDiscount` y relacionados no sustituyen los precios del servidor.

La aprobación económica se mantiene `APPROVED_2026-10-22`. Estos importes no se presentan como oferta pública mientras no exista una contraprestación de continuidad verificable y los demás gates de publicación estén completos.

## Registro del gate público

| Tema | Estado acreditado | Pendiente para publicar |
|---|---|---|
| Capacidad operacional | `BASE-DOM-OWNERSHIP` está verificado solo como regla v0.6 de titularidad del dominio del cliente. `BASE-EXT-COST-DISCLOSURE` está verificado solo como obligación de informar costos externos. | Hosting, SSL, DNS/conexión como operación H03, backups, restauración, actualizaciones, soporte, incidentes/SLA, capacidad/límites, licencias/cuentas y portabilidad/exportación permanecen `NOT_VERIFIED`. No hay ficha con responsable, proveedor/cuenta, procedimiento probado, cobertura, límites, costo y salida para esos servicios. Terceros concretos tampoco están acreditados. |
| Condiciones | El borrador v0.3 enumera alcance y pendientes; contratos aceptados bajo v0.6 deben conservar su versión y condiciones. | Titularidad y acceso a cuentas, IP/licencias, portabilidad, cancelación, renovación, reembolso/prepago, aceptación y confirmación versionadas, retención/eliminación y tratamiento de solicitudes/cotizaciones existentes requieren definición y revisión. La transición debe ser prospectiva. |
| Revisión jurídica | `LEGAL_REVIEW=PENDING` en el gate C08 y el borrador v0.3. | No hay persona revisora, fecha, versión revisada ni dictamen registrados. Obtener revisión real y registrar alcance, documento y resultado. |
| Revisión tributaria | `TAX_REVIEW=PENDING` en el gate C08 y el borrador v0.3. | No hay persona revisora, fecha ni clasificación por activación, mensualidad, prepago, terceros o ampliaciones. No se infiere IVA, exención, devengo ni documento tributario. |
| Términos/fecha | Documento v0.3 y versión técnica `1.0-draft`; `TERMS_EFFECTIVE_DATE=null`, `EFFECTIVE_DATE=NOT_SET`. | Aprobar texto público versionado y fecha efectiva mediante decisión separada. Resolver prospectivamente la diferencia entre la declaración de publicación/conexión de `/terminos` v0.6 y el copy UI sujeto a cotización, sin modificar acuerdos antiguos. |
| Aceptación y transición | La solicitud V3 es temporal, `DRAFT_NOT_FOR_PUBLICATION`, TTL de una hora y WhatsApp `prepared-not-sent`. | Diseñar y revisar aceptación versionada, custodia/privacidad y constancia de confirmación. Una solicitud o WhatsApp no forma contrato. Identificar contratos v0.6 que continúan bajo sus condiciones. |
| Rollback | No se desplegó ni cambió producción durante C11. `/terminos` y API V2 no tienen diff. | La lista operativa previa de deployment, SHA/artefacto V0_6, comprobaciones post-rollback y responsable de ejecución debe completarse antes de un release autorizado. Ver el [checklist de release y rollback](EVCOM_H03_L02_RELEASE_CHECKLIST.md). |

No hay evidencia en esta revisión de dictamen legal, revisión tributaria o aprobación para publicar. La aprobación económica no se vuelve a solicitar ni se usa como sustituto de esos gates.

## Pruebas, comandos y observabilidad

| Comando | Resultado C11 |
|---|---|
| `npm run test:commercial` | PASS, 15/15. Incluye precios canónicos, las nueve modalidades, manipulación de importes/descuento anual, tres productos, campañas, V3 y gate local. |
| `npm run test:commercial:v3-runtime` | PASS, 27/27. Smoke HTTP adicional: rutas públicas, nueve escenarios, TTL, tampering, errores, campañas, métodos, request vs quote/order/payment, gate-off de todas las APIs internas, fallback WhatsApp y regresión V2. |
| `npm run build` | PASS; Astro check sobre 49 archivos, 0 errores, 0 advertencias, 0 hints; adaptador Vercel compilado. |
| `npm run test:commercial:v3-artifact` | PASS; 28 recursos estáticos inspeccionados y handler compilado devuelve 404 a preview/APIs internas en producción, incluso con switches de preview forzados. El escaneo también busca precios/modos, flags y rutas internas. |
| `npm run test:commercial:v3-browser` | PASS; 320/500/1440 px, dark/light/cyan; sin overflow, contraste mínimo medido 6.43:1, foco visible de 3 px, teclado y `aria-live`; el enlace no se abre al crear/validar y requiere acción humana. El test bloquea `wa.me`. |
| Smoke HTTP público integrado en runtime | PASS para 13 rutas: portada, 3 productos, 3 demos, 3 activaciones, confirmación, términos y privacidad. `/terminos` mantiene versión 0.6 y los valores anuales actuales. `/api/activation` conserva V2. |
| `rg` de proveedor en assets públicos | Cero coincidencias de “Vercel” en `.vercel/output/static`; no se presenta como condición del producto. |
| Auditoría de nombres activos | Cero coincidencias H03/H-03/C10/C09/L02 en `src`, `tests`, `package.json`, `astro.config.mjs` y `.env.example`; cero nombres de archivos H03 en `src`/`tests`. |
| `git diff --check HEAD` | PASS. |

El smoke runtime usó procesos Astro propios en puertos efímeros `44605`, `41687`, `42575` y `36359` (PIDs `899546`, `899884`, `900181`, `900458`); todos se detuvieron y sus copias temporales se eliminaron. El browser smoke usó Astro PID `894497` en `35391` y Chrome PID `894673` en el puerto de depuración `35649`; test PID `894486`. Chrome, Astro, perfil y copia temporal quedaron limpios. Se verificó que esos PIDs ya no seguían activos.

Dos primeras aserciones de smoke se ajustaron al comportamiento real de Astro: una ruta de página cerrada puede renderizar la página genérica 404 y un método sin handler puede devolverla. La prueba final exige 404 y ausencia de contenido/precios internos; el runtime final pasa 27/27. La medición de navegador también se estabilizó posicionando la sección de revisión después de reiniciar el scroll en cada ancho; la ejecución final pasa.

No se inició un servidor persistente ni se hizo request a un deployment de producción. No se autenticó WhatsApp ni se envió ningún mensaje. No se realizó revisión legal/tributaria ni prueba operacional de terceros; constan como bloqueos, no como validaciones omitidas por inferencia.

El browser smoke C11 cubrió la previsualización protegida; no se repitió una sesión interactiva de navegador para las seis páginas públicas de producto/demo. Se conservaron los resultados visuales y de accesibilidad de C06/C07, y C11 revalidó las trece rutas por HTTP, contenido y build porque no hubo cambios de C11 en esas superficies públicas.

## Archivos cambiados en C11

- `tests/commercial-rules.test.mjs`
- `tests/v3-runtime-smoke.mjs`
- `tests/commercial-preview-artifact-smoke.mjs`
- `tests/commercial-preview-browser-smoke.mjs`
- `docs/traces/EVCOM_H03_L02_RELEASE_REVIEW.md`
- `docs/traces/EVCOM_H03_L02_RELEASE_CHECKLIST.md`

No se cambiaron `src/pages/terminos.astro`, `/api/activation`, Handoff V2, precios públicos ni el modelo económico aprobado.

## Reporte de cierre

```text
CAPSULE: EVW-EVCOM-H03-L02-C11
BRANCH: feature/evcom-h03-l02-comercial
BASE_SHA: d0fe74520695cc9f55f2382e61421e1f94f2e0d3
FINAL_SHA: informado en el cierre Codex
H03_EXPERIENCE_GATE: PASS
PUBLIC_RELEASE_GATE: BLOCKED
PUBLIC_TERMS: V0_6_UNCHANGED
COMMERCIAL_APPROVAL: APPROVED_2026-10-22
V2_COMPATIBILITY: PASS
V3_RUNTIME: PASS
PREVIEW_FAIL_CLOSED: PASS
PUBLIC_STATIC_ASSET_LEAK: NONE
PRODUCTS: LANDING_CATALOGO_CORPORATIVA_ONLY
TERMS_LEGAL_TAX_STATUS: LEGAL_REVIEW=PENDING; TAX_REVIEW=PENDING; TERMS_VERSION=1.0-draft; EFFECTIVE_DATE=NOT_SET
OPERATIONAL_EVIDENCE: dos reglas textuales v0.6 VERIFIED; servicios recurrentes/cuentas/terceros NOT_VERIFIED
BUILD: PASS
TEST_COMMERCIAL: PASS_15_OF_15
SMOKE_UI_API_WHATSAPP: PASS; no hubo envío
ACCESSIBILITY_RESPONSIVE: PASS; 320/500/1440, dark/light/cyan, teclado/foco/contraste
DIFF_CHECK: PASS
TREE: CLEAN_AFTER_COMMIT
PUSH_MERGE_DEPLOY: NONE
NEXT: cerrar evidencia operacional, revisión legal/tributaria, aceptación versionada, términos/fecha efectiva y autorización manual antes de cualquier release público
```
