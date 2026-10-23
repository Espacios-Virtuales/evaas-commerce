# EVAAS Commerce · Registro de decisiones comerciales H03 v0.1

**Cápsula:** `EVW-EVCOM-H03-L02-C01`

**Fecha de consolidación:** 2026-10-22 (`America/Santiago`)

**Baseline:** `c2072941d987d4867dd12e9b6f09974154a37167`

**Estado documental:** `DECISION_RECORD_UPDATED_WITH_OWNER_APPROVAL`

**Gate comercial:** `OWNER_COMMERCIAL_MODEL_APPROVED`

**Fuente de decisión:** aprobación expresa del propietario de Espacios Virtuales / EVAAS Commerce en la conversación de la cápsula, fechada 2026-10-22.

## 1. Alcance y regla de autoridad

Este registro consolida los tres entregables H03-L01 sin sustituirlos ni convertirlos en autorización. Los documentos H03-L01 son borradores para revisión: no aprueban precios, periodicidades, descuentos, condiciones contractuales ni prestaciones operacionales.

Solo una decisión expresa del propietario, con responsable, fecha, evidencia reproducible y fecha efectiva, puede completar la columna «Valor aprobado». La aprobación del 2026-10-22 autoriza el modelo comercial, sus importes, el descuento anual y el copy neutral descritos en la sección 2.1. No demuestra prestaciones operativas ni reemplaza las revisiones jurídica, tributaria o técnica pendientes. La publicación existente conserva su vigencia v0.6 hasta que la nueva versión se publique mediante un release separado.

Estados usados:

- `PUBLIC_CURRENT`: hecho vigente y publicado en v0.6; no equivale a aprobación de la propuesta H03.
- `HYPOTHESIS_NOT_APPROVED`: escenario interno que no se puede publicar, cotizar ni cobrar.
- `PENDING_VERIFICATION`: falta responsable o evidencia operacional suficiente para prometer la prestación.
- `OWNER_DECISION_REQUIRED`: decisión pendiente del propietario.
- `APPROVED`: consentimiento expreso, fechado y trazable del propietario.

## 2. Hechos públicos que se preservan

La oferta pública v0.6 contiene exactamente tres productos: `landing`, `catalogo` y `corporativa`. Sus importes finales son, respectivamente, **$120.000, $160.000 y $180.000 CLP**. `/terminos` v0.6, actualizado el 6 de octubre de 2026, los describe como valores de una **contratación anual de doce meses**. También indica emisión de boleta o factura según corresponda, renovación anual opcional, promociones temporales no acumulables, dominio comprado y conservado por el cliente, publicación inicial en una cuenta o plan compatible y costos externos sujetos a información previa.

La expresión «activación actual» usada en el modelo financiero solo referenciaba esos importes para modelación y no los convirtió por sí sola en cobros iniciales únicos. Esa separación fue aprobada posteriormente por la decisión expresa del propietario del 2026-10-22, con vigencia condicionada a la publicación de términos H03 y sin efecto retroactivo.

### 2.1 Decisión del propietario del 2026-10-22

La decisión `OWNER_COMMERCIAL_MODEL_APPROVED` convierte en instrucciones de implementación para el piloto H03, sin efecto retroactivo ni despliegue automático:

| Producto | Activación inicial única, valor final CLP | Continuidad mensual, valor final CLP | Continuidad anual prepagada, valor final CLP |
| --- | ---: | ---: | ---: |
| `landing` | $120.000 | $19.900 | $214.920 |
| `catalogo` | $160.000 | $24.900 | $268.920 |
| `corporativa` | $180.000 | $29.900 | $322.920 |

- La continuidad es independiente, opcional y puede contratarse mensualmente o mediante prepago anual.
- El prepago anual equivale a doce mensualidades con 10 % de descuento, aplicado solo a continuidad. No se acumula automáticamente con promociones.
- Los perfiles editoriales, artísticos o sectoriales no crean productos ni alteran precios por sí solos.
- Ampliaciones, licencias, dominio, sobreconsumo y terceros se separan y cotizan según alcance.
- Los importes son valores finales en CLP, con boleta o factura según corresponda; el tratamiento tributario contractual permanece `PENDING_VALIDATION`.
- El cambio desde v0.6 entra en vigor solo al publicarse la nueva versión de términos. Los acuerdos anteriores conservan las condiciones aceptadas.
- Copy aprobado, variante `PUBLICATION_CONFIRMED_WITH_SCOPE_VERIFICATION`: «Publicación inicial y conexión de dominio según el alcance contratado.» Su uso requiere comprobar que la prestación puede cumplirse en el alcance concreto; de lo contrario se debe usar «Preparación para publicación según la cotización» y registrar la brecha.

## 3. Matriz de decisiones

En «Evidencia y fecha», «consulta 2026-10-22» identifica la fecha de esta revisión, no una fecha de aprobación. `—` en fecha efectiva significa que no puede aplicarse la propuesta.

| ID | Materia | Estado público | Valor propuesto | Valor aprobado | Evidencia y fecha | Fecha efectiva | Responsable | Impacto | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OD-01 | Activación y vigencia | v0.6: contratación anual de 12 meses; inicio y término se fijan al contratar | Tratar $120.000/$160.000/$180.000 como activación cobrada una sola vez | Aprobado para H03; sin retroactividad | Decisión expresa del propietario en esta conversación, 2026-10-22 | Al publicar términos H03 en release separado | Propietario comercial; revisión jurídica/tributaria pendiente antes de vigencia | Cambia naturaleza, período y comunicación del precio vigente | `APPROVED` |
| OD-02 | Mensualidades por producto | No hay mensualidades publicadas de continuidad | `landing` $19.900; `catalogo` $24.900; `corporativa` $29.900 CLP por mes | Aprobadas como valores finales del piloto | Decisión expresa del propietario en esta conversación, 2026-10-22 | Al publicar términos H03 en release separado | Propietario comercial; validación tributaria pendiente | Precio, cotización, facturación y contribución | `APPROVED` |
| OD-03 | Prepago anual y descuento | v0.6 publica una contratación anual; no publica prepago de continuidad | Continuidad prepaga anual con −10 %: $214.920/$268.920/$322.920 | Aprobado; descuento solo sobre 12 mensualidades de continuidad | Decisión expresa del propietario en esta conversación, 2026-10-22 | Al publicar términos H03 en release separado | Propietario comercial; revisión jurídica/tributaria pendiente | Cobro anticipado, baja, devolución y reconocimiento | `APPROVED` |
| OD-04 | Acumulación de promociones | v0.6: promociones temporales no acumulables y excluyen dominio, adicionales y terceros | Definir si el eventual −10 % de continuidad se combina con CiberDay u otras promociones | No acumulable automáticamente; toda compatibilidad requiere regla expresa posterior | Decisión expresa del propietario en esta conversación, 2026-10-22 | Al publicar términos H03 en release separado | Propietario comercial | Total cotizado y consistencia promocional | `APPROVED` |
| OD-05 | Continuidad obligatoria u opcional | v0.6 contempla renovación anual opcional; no existe continuidad H03 publicada | Continuidad separada y opcional; activación contratable sin ella | Aprobada como opcional, mensual o anual prepagada | Decisión expresa del propietario en esta conversación, 2026-10-22 | Al publicar términos H03 en release separado | Propietario comercial; revisión jurídica pendiente | Obligaciones posteriores a la entrega y elegibilidad de contratación | `APPROVED` |
| OD-06 | Hosting | Publicación inicial en cuenta o plan compatible; terceros pagados se informan antes | Incluirlo solo si se define proveedor, cuenta, plan, cobertura, costo, límites y salida | Ninguno; inclusión no autorizada | Contrato borrador C01 §5; copy borrador C03 §§4-5, consulta 2026-10-22 | — | Responsable operativo por designar y propietario | Publicación, disponibilidad, costo recurrente y salida | `PENDING_VERIFICATION` |
| OD-07 | SSL | No hay compromiso público específico de provisión, renovación o gestión de certificados | Incluirlo solo con proveedor, titular, emisión, renovación, monitoreo y salida definidos | Ninguno; inclusión no autorizada | Contrato borrador C01 §5, consulta 2026-10-22 | — | Responsable operativo por designar y propietario | Seguridad, disponibilidad y renovación | `PENDING_VERIFICATION` |
| OD-08 | Backups | No existe prestación pública demostrada | Definir cobertura, frecuencia, retención, ubicación, cifrado y pruebas | Ninguno | Contrato borrador C01 §5; copy borrador C03 §§5 y 8, consulta 2026-10-22 | — | Responsable operativo por designar y propietario | Recuperabilidad y costo operacional | `PENDING_VERIFICATION` |
| OD-09 | Restauración | No existe prestación pública demostrada | Definir eventos cubiertos, RPO/RTO, procedimiento, pruebas y restauraciones incluidas | Ninguno | Contrato borrador C01 §5, consulta 2026-10-22 | — | Responsable operativo por designar y propietario | Recuperación, SLA y riesgo de pérdida | `PENDING_VERIFICATION` |
| OD-10 | Actualizaciones | No existe mantenimiento recurrente publicado | Definir componentes, frecuencia, compatibilidad, exclusiones y responsable | Ninguno | Contrato borrador C01 §§5 y 6.10, consulta 2026-10-22 | — | Responsable operativo por designar y propietario | Seguridad, compatibilidad y esfuerzo recurrente | `PENDING_VERIFICATION` |
| OD-11 | Soporte, disponibilidad e incidencias | Hay canal comercial; no se demuestra mesa de soporte, SLA o gestión de incidentes | Definir canal, horario, cupo, severidades, respuesta, resolución, disponibilidad, exclusiones y exceso | Ninguno | Contrato borrador C01 §§5 y 6.9; modelo C02 §§6-7, consulta 2026-10-22 | — | Responsable operativo por designar y propietario | Capacidad, SLA, costo y promesas al cliente | `PENDING_VERIFICATION` |
| OD-12 | Límites de tráfico y capacidad | Alto tráfico puede requerir infraestructura y costo mensual separado, sujeto a aprobación previa | Definir umbral, medición, alertas, degradación, sobreconsumo y tarifa | Ninguno | `/terminos` v0.6; contrato borrador C01 §5, consulta 2026-10-22 | — | Responsable técnico/operativo por designar y propietario | Capacidad, continuidad y cargos adicionales | `PENDING_VERIFICATION` |
| OD-13 | Dominio, cuentas y terceros | Cliente compra y conserva dominio; conexión inicial incluida; planes externos se informan antes | Definir titular de hosting/DNS/cuentas, accesos, pagos, renovaciones, licencias, fallas y transferencia | No consta más allá del baseline público | `/terminos` v0.6; contrato borrador C01 §§5 y 6.8, consulta 2026-10-22 | — | Cliente para dominio; responsables operativo y comercial por designar para lo restante | Control de activos, costos, dependencia y salida | `OWNER_DECISION_REQUIRED` y `PENDING_VERIFICATION` |
| OD-14 | Propiedad intelectual | Cliente conserva dominio y materiales aportados; lo restante no está definido | Definir titularidad/licencia de diseño, código, reutilizables, fuentes, imágenes y momento de transferencia | Ninguno | Contrato borrador C01 §6.7; copy borrador C03 §5.15, consulta 2026-10-22 | — | Propietario y revisión jurídica | Uso, reutilización y entrega de activos | `OWNER_DECISION_REQUIRED` |
| OD-15 | Portabilidad y exportación | No existe procedimiento público demostrado | Definir paquete, formatos, datos, archivos, accesos, credenciales, plazo, costo, asistencia, conservación y eliminación | Ninguno | Contrato borrador C01 §§5, 6.6; copy borrador C03 §§5.10-5.11, consulta 2026-10-22 | — | Responsable operativo por designar; propietario y revisión jurídica | Recuperación de activos y término de la relación | `PENDING_VERIFICATION` |
| OD-16 | Cancelación, renovación y suspensión | v0.6: renovación anual opcional; no fija reglas H03 de cancelación o suspensión | Definir renovación expresa/automática, aviso, reajuste, causales, subsanación, pagos, devolución, reactivación y datos | Ninguno | `/terminos` v0.6; contrato borrador C01 §§6.4-6.5, consulta 2026-10-22 | — | Propietario y revisión jurídica/tributaria | Vigencia, cobro, acceso, datos y terminación | `OWNER_DECISION_REQUIRED` |
| OD-17 | Aceptación y revisiones | Una revisión consolidada por producto; la solicitud/WhatsApp no prueba compra ni pago | Definir vigencia de cotización, hitos, mecanismo de aceptación, plazo de observaciones, ronda y conformidad | No consta para H03 | `products.ts`; traza H02-L01; contrato borrador C01 §§6.1 y 6.3, consulta 2026-10-22 | — | Propietario y revisión jurídica/comercial | Formación del contrato, alcance y retrabajo | `OWNER_DECISION_REQUIRED` |
| OD-18 | Operación sin continuidad | v0.6 no separa activación y continuidad | Entrega autónoma con cuenta, dominio, DNS, credenciales, renovaciones, actualizaciones e incidentes asignados | Ninguno | Contrato borrador C01 §6.10; copy borrador C03 §5.12, consulta 2026-10-22 | — | Responsable operativo por designar; propietario | Autonomía del cliente y obligaciones sobrevivientes | `PENDING_VERIFICATION` |
| OD-19 | Copy neutral de publicación | `products.ts` dice «Publicación inicial en Vercel»; `/terminos` dice cuenta o plan compatible | Preferida: «Publicación inicial y conexión de dominio según el alcance contratado»; alternativa si no se demuestra: «Preparación para publicación según la cotización» | Variante preferida aprobada con verificación de alcance; alternativa obligatoria donde la capacidad no se acredite | Decisión expresa del propietario en esta conversación, 2026-10-22 | Al publicar el copy mediante release separado | Propietario; verificación operacional por producto/modalidad pendiente | Neutralidad tecnológica sin promesa engañosa | `APPROVED` con `SCOPE_VERIFICATION_REQUIRED` |
| OD-20 | Autoridad de cotización | API v0.6 resuelve precio de solicitud y campaña; `requestId`/WhatsApp no son cotización, orden ni pago | Cotización canónica versionada de servidor, con autoridad, vigencia, aceptación, privacidad y custodia | Ninguna | Traza H02-L01; contrato borrador C01 §7; copy borrador C03 §§3 y 6, consulta 2026-10-22 | — | Propietario de producto/comercial; revisión técnica, legal y privacidad | Integridad de precios y futuro diseño transaccional | `OWNER_DECISION_REQUIRED` |
| OD-21 | Impuestos; boleta o factura | Valores finales v0.6; se emite boleta o factura según corresponda | Confirmar IVA, base, facturación, reconocimiento, créditos fiscales y otros impuestos para H03 | Importes finales CLP y emisión de boleta/factura aprobados comercialmente; tratamiento tributario detallado pendiente | Decisión expresa del propietario en esta conversación, 2026-10-22; revisión tributaria aún no ejecutada | Al publicar términos H03, condicionado a validación tributaria | Propietario y asesoría tributaria/contable por identificar | Precio final, documento tributario, ingreso y contribución | `APPROVED_COMMERCIAL` / `PENDING_TAX_VALIDATION` |
| OD-22 | Transición de contratos y cotizaciones existentes | v0.6 continúa vigente; inicio/término anual se fija al contratar | Definir corte, contratos/cotizaciones afectados, respeto de condiciones aceptadas, comunicación y versión aplicable | H03 rige desde su publicación; acuerdos anteriores conservan sus condiciones y no se reinterpretan retroactivamente | Decisión expresa del propietario en esta conversación, 2026-10-22 | Al publicar términos H03 en release separado | Propietario; revisión jurídica del texto pendiente | Evita aplicación retroactiva y conflicto entre versiones | `APPROVED` con `PENDING_LEGAL_VALIDATION` |

## 4. Evidencia operacional mínima

Ningún servicio recurrente podrá pasar de `PENDING_VERIFICATION` a incluido solo mediante copy o inferencia. Para cada prestación se requiere, como mínimo:

1. responsable nominal de aprobación y responsable nominal de operación;
2. proveedor, titular de cuenta y contraparte de pago cuando exista un tercero;
3. procedimiento ejecutable y evidencia fechada de capacidad o prueba;
4. cobertura, exclusiones, límites, horario y criterio de cumplimiento;
5. costo y tratamiento de consumo extraordinario;
6. dependencias, renovación, terminación y procedimiento de salida;
7. aprobación expresa del propietario con fecha efectiva.

Esto aplica separadamente a hosting, SSL, backups, restauración, actualizaciones, soporte, disponibilidad/incidencias, tráfico, administración de dominio/cuentas y portabilidad/exportación. La evidencia de una prestación no aprueba las demás.

## 5. Resultado del gate actualizado

La decisión del propietario del 2026-10-22 deja aprobados el modelo de activación única más continuidad opcional, los importes del piloto, el descuento anual, su regla de no acumulación automática, la transición no retroactiva y el copy neutral condicionado a verificación de alcance.

El resultado es **`OWNER_COMMERCIAL_MODEL_APPROVED`** y **`IMPLEMENTATION_AUTHORIZED_ON_FEATURE_BRANCH`**. Esto habilita C02 y la implementación técnica de C03/C04, pero no constituye despliegue ni acredita por sí solo servicios recurrentes, capacidad operacional, revisión jurídica o revisión tributaria.

Permanecen abiertos:

- OD-06 a OD-12, OD-15 y OD-18, hasta verificar prestación, responsable, límites y prueba;
- OD-13 en cuanto a cuentas, terceros y operación posterior;
- OD-14, OD-16, OD-17 y OD-20 para revisión jurídica/técnica detallada;
- OD-21 y OD-22 hasta completar la validación tributaria/jurídica previa a la entrada en vigor.

Se preparó `docs/contracts/commerce/ACTIVATION_CONTINUITY_PILOT_v0.2.md` como borrador interno `DRAFT_NOT_FOR_PUBLICATION`; no es texto contractual efectivo. La fuente canónica y la API de cálculo H03 pueden implementarse y probarse en la rama, con la API apagada por defecto. La oferta pública v0.6 y producción permanecen sin cambios hasta completar los gates y un release separado.

## 6. Fuentes leídas, no reemplazadas

- `docs/contracts/commerce/ACTIVATION_CONTINUITY_PILOT_v0.1.md`
- `docs/finance/EVCOM_PILOT_PRICING_MODEL_v0.1.md`
- `docs/commercial/EVCOM_COPY_CONTRACT_ALIGNMENT_v0.1.md`
- `src/data/products.ts`
- `src/pages/terminos.astro`
- `docs/traces/EVCOM_H02_L01.md`

Este registro no modifica frontend, producción, precios activos, API, handoff, campañas ni `/terminos`.
