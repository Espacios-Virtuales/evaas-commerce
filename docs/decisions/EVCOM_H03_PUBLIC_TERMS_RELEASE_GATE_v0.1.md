# EVCOM H03 · Gate separado de publicación de términos v0.1

**Fecha de evaluación documental:** 2026-11-01
**Cápsula:** `EVW-EVCOM-H03-L02-C08`
**Rama de preparación:** `feature/evcom-h03-l02-comercial`
**Decisión económica:** `COMMERCIAL_MODEL_APPROVED_2026-10-22`
**Gate documental C08:** `TERMS_DRAFT_READY`
**Gate de publicación:** `PUBLIC_TERMS_GATE=PENDING`
**Autorización de publicación:** `PUBLICATION_AUTHORIZED=NO`

## Estado independiente de cada decisión

| Campo de gate | Estado a C08 | Evidencia/alcance |
|---|---|---|
| `COMMERCIAL_MODEL_APPROVED_2026-10-22` | `TRUE / APPROVED` | Registro OD-01 a OD-05, conservado en `docs/decisions/EVCOM_H03_COMMERCIAL_DECISION_RECORD_v0.1.md`. C08 no reabre importes, modalidades ni descuento. |
| `TERMS_DRAFT_READY` | `TRUE` | Borrador revisado `docs/contracts/commerce/ACTIVATION_CONTINUITY_PILOT_v0.3.md`; listo para evaluación jurídica/tributaria y posterior preparación, no para aceptar. |
| `OPERATIONAL_SCOPE_VERIFIED` | `BY_SERVICE_ONLY / NOT_GLOBAL` | La matriz `docs/contracts/commerce/CONTINUITY_OPERATIONAL_MATRIX_v0.1.md` etiqueta cada servicio y su fuente/alcance. No se infiere verificación global de continuidad. |
| `LEGAL_REVIEW` | `PENDING` | No hay dictamen/revisión externa registrada para el texto H03. |
| `TAX_REVIEW` | `PENDING` | No hay clasificación tributaria documentada por línea ni revisión contable del prepago. |
| `TERMS_VERSION` | `1.0-draft` | Identificador técnico en `src/data/commercial-rules.ts`; la revisión documental es v0.3. No es versión efectiva pública. |
| `EFFECTIVE_DATE` | `NOT_SET` | `TERMS_EFFECTIVE_DATE=null`; debe proceder de decisión de release posterior. |
| `PUBLICATION_AUTHORIZED` | `NO` | Requiere autorización explícita posterior, checklist completo y pruebas de aceptación. |
| `PUBLIC_TERMS_GATE` | `PENDING` | Falta servicio de continuidad verificable, revisión jurídica/tributaria y decisión de fecha efectiva. |

## Evidencia operacional y regla del gate

La regla pública v0.6 identifica la titularidad del dominio del cliente y la información/aprobación de costos externos. El texto v0.6 también describe publicación inicial en cuenta compatible, conexión del dominio y posible costo adicional por alto tráfico. Eso prueba el texto público de v0.6, no por sí solo una matriz operacional H03 con responsable, capacidad, proveedor, límites, procedimiento y salida.

La matriz C08 marca cada servicio candidato `VERIFIED` o `NOT_VERIFIED` para su alcance exacto. Las candidatas recurrentes de hosting, SSL, DNS, backup/restauración, actualizaciones, soporte, incidentes, capacidad, licencias administradas, cuentas y portabilidad permanecen `NOT_VERIFIED` con las fuentes inspeccionadas. Ese estado no declara que no existan; determina que no se incluirán ni prometerán por inferencia. La regla pública de dominio/terceros se conserva con alcance limitado, separada de los servicios recurrentes.

`TERMS_DRAFT_READY` puede avanzar al trabajo documental y a una previsualización interna de C09. No puede promover por sí mismo `PUBLIC_TERMS_GATE` a `READY`, habilitar modalidades en una interfaz pública ni autorizar una contratación indefinida cuyo servicio no esté descrito.

## Checklist de transición v0.6 → H03

### Condiciones del borrador y de la operación

- [ ] Para cada modalidad que se pretenda ofrecer, completar la contraprestación y la ficha del servicio, fuente fechada, operador y responsable, proveedor/cuenta, costo/periodicidad, límites, exclusiones, dependencias y salida.
- [ ] Mantener separados `APPROVED` del modelo económico y `VERIFIED` de la prestación. No ofrecer mensualidad/prepago solo porque el motor interno pueda calcularlo.
- [ ] Conciliar prospectivamente el texto de `/terminos` v0.6 sobre publicación/conexión del dominio con el copy neutral de productos C05–C07. No alterar contratos anteriores ni debilitar promesas aceptadas retroactivamente.
- [ ] Confirmar titularidad de cuentas, licencias, materiales, código/diseño, dominio, credenciales, datos, exportación, conservación y eliminación.
- [ ] Cerrar renovación y aviso, suspensión, cancelación, reembolso/prepago, incidentes, responsabilidades y solución de controversias con evidencia y revisión apropiada. No inventar plazos, métricas o sanciones.

### Revisión jurídica, tributaria y de datos

- [ ] Registrar quién revisó, fecha, versión exacta/documento, decisiones y cambios. Si hay cambios materiales, versionar un nuevo borrador.
- [ ] Obtener `LEGAL_REVIEW=COMPLETE` respaldado por revisión real de alcance, formación/confirmación de contratos electrónicos, información al cliente, condiciones de renovación/retracto/salida, propiedad intelectual/licencias, cuentas/terceros y tratamiento de datos. La aplicación concreta es decisión de asesoría.
- [ ] Obtener `TAX_REVIEW=COMPLETE` por cada componente: activación, mensualidad, prepago anual, ampliaciones y servicios de terceros; validar tratamiento de importes finales, documento tributario y reconocimiento temporal. No inferir IVA o exención desde la etiqueta “valor final”.
- [ ] Confirmar con asesoría la transición de datos aplicable y fecha de vigencia de Ley 21.719 antes de fijar release; BCN señala 2026-12-01. Revisar Aviso de Privacidad y roles según flujos reales.

### Integración, aceptación versionada y pruebas

- [ ] Confirmar alineación de precio/modalidad con `src/data/commercial-rules.ts`: tres `ProductSlug`, `none`, `monthly`, `annual_prepay`; prepago es doce mensualidades con 10 % exclusivo de continuidad y no rebaja activación; promociones solo según regla aprobada/versionada.
- [ ] Mantener `TERMS_VERSION`, `COMMERCIAL_RULES_VERSION`, cotización y versión de texto concordantes entre vista interna, selector C09, mensaje/hand-off C10 y endpoint. Las rutas públicas siguen sin modalidad H03 antes del release.
- [ ] Definir aceptación activa y versionada separada de solicitud/WhatsApp: contenido presentado, versión/identificador/hash, producto, modalidad, valores, fecha/hora y confirmación entregada; completar privacidad, custodia y retención. Una `requestId` o el mensaje preparado no equivale a contrato.
- [ ] Verificar que una solicitud sin continuidad conserva `none`; probar ambos modos y los tres productos en el cálculo servidor sin recibir/importar totales del navegador.
- [ ] Probar el runtime V3 en un puerto aislado, con autenticación y errores de versión, TTL, modalidad, producto, campaña y V2; verificar regresión del Handoff V2. No reutilizar ni terminar un proceso ajeno del puerto 4322.
- [ ] Ejecutar `npm run test:commercial`, `npm run test:commercial:v3-runtime` en entorno aislado cuando corresponda, `npm run build`, pruebas de UI/teclado y smoke de seis productos/demos, términos, activaciones y API según los cambios.
- [ ] Comparar HTML público compilado para ausencia de términos/precios H03 antes del release, tras liberar y al hacer rollback. La prueba pública final pertenece a la cápsula de release C11.

### Versionado, fecha y rollback

- [ ] Conservar archivos anteriores: `ACTIVATION_CONTINUITY_PILOT_v0.1.md`, `ACTIVATION_CONTINUITY_PILOT_v0.2.md` y `/terminos` v0.6 en su historial; no sobrescribir versiones aprobadas/anteriores.
- [ ] Aprobar y registrar el texto final con identificador público definitivo, `TERMS_EFFECTIVE_DATE` no nula y fecha efectiva explícita distinta de la fecha de aprobación comercial. No fijar fecha en C08.
- [ ] Preparar release separado con fuente versionada, registro de aprobación, pruebas/reporte y destino inequívoco. La migración debe operar prospectivamente; listar qué solicitudes/cotizaciones/contratos conserva v0.6.
- [ ] Preparar rollback probado a la versión pública v0.6, con comprobación de precios/período, términos, tarjetas, selector, mensaje, rutas y endpoint; no dejar UI/endpoint en una modalidad diferente de los términos efectivos.

## Fuentes oficiales para las revisiones, no dictámenes

- [Ley 19.496, texto actualizado en Ley Chile/BCN](https://nuevo.leychile.cl/navegar?idNorma=61438): verificar con asesoría los requisitos aplicables a contratación e información electrónica.
- [SERNAC, orientación sobre retracto](https://www.sernac.cl/portal/607/w3-propertyvalue-15024.html): referencia de revisión; no decide la aplicación a la oferta concreta.
- [SII, tratamiento de IVA para servicios/desarrollo de software](https://www.sii.cl/preguntas_frecuentes/impuestos_mensuales/001_130_2449.htm) y [SII, IVA digital](https://www.sii.cl/vat/faq1_esp.html): revisar clasificación y documentación tributaria con asesoría.
- [Ley 21.719, Ley Chile/BCN](https://www.bcn.cl/leychile/Navegar/imprimir?idNorma=1209272): BCN informa vigencia diferida al 1 de diciembre de 2026; confirmar alcance y transición para los flujos reales.

**Resultado:** `PUBLIC_TERMS_GATE=PENDING`. La autorización económica no sustituye estos ítems. Ninguna persona debe ejecutar C11 ni publicar como consecuencia de C08.
