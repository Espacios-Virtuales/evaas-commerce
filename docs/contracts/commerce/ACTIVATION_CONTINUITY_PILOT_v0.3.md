# EVAAS Commerce · Borrador de términos piloto H03 v0.3

**Estado:** `DRAFT_NOT_FOR_PUBLICATION` · `NO_CONTRATABLE`
**Cápsula:** `EVW-EVCOM-H03-L02-C08`
**Reglas comerciales:** `EVCOM-H03-PILOT-2026-10-22`
**Versión técnica de términos:** `1.0-draft` (coincide con `src/data/commercial-rules.ts`; no es versión pública efectiva)
**Fecha de aprobación del modelo comercial:** 2026-10-22 (solo aprobación económica)
**Fecha efectiva:** `PENDING_RELEASE_DECISION` · `NOT_SET`
**Revisión jurídica:** `PENDING`
**Revisión tributaria:** `PENDING`
**Evidencia operacional de continuidad:** ver `docs/contracts/commerce/CONTINUITY_OPERATIONAL_MATRIX_v0.1.md`; ningún paquete recurrente queda habilitado por este borrador.

> Documento de trabajo para evaluación y preparación de C09/C10. No es oferta vigente, no constituye contrato aceptable, no habilita cobro ni modifica `/terminos` v0.6. La decisión comercial del 22-10-2026 se respeta y no se solicita nuevamente; la preparación documental no acredita servicio, revisión jurídica/tributaria ni autorización de publicación.

## 1. Proveedor, alcance y productos

El proveedor identificado en las condiciones actuales es **ESPACIOS VIRTUALES SpA**, RUT **78.428.352-6**, contacto comercial **info@espaciosvirtuales.lat**. Antes de usar este texto se debe volver a comprobar que razón social, RUT, domicilio contractual, canales de notificación y representación sigan correctos. Esta comprobación no se realizó en C08.

La oferta contiene exactamente tres `ProductSlug`:

| `ProductSlug` | Producto | Alcance de activación base reflejado en el catálogo actual |
|---|---|---|
| `landing` | Landing Comercial | 1 página, hasta 6 secciones y 1 revisión consolidada. |
| `catalogo` | Catálogo de Productos | 1 catálogo, hasta 12 ítems y 1 revisión consolidada; vitrina no transaccional. |
| `corporativa` | Web Corporativa | 4 áreas base: Inicio, Empresa, Servicios y Contacto; 1 revisión consolidada. |

Un perfil editorial, artístico, sectorial o de composición describe el contenido o la experiencia dentro de uno de esos tres productos. No es un cuarto SKU, plugin, plan, tarifa ni servicio autónomo.

## 2. Estados comerciales, tecnológicos y contractuales

El modelo económico `COMMERCIAL_MODEL_APPROVED_2026-10-22` está aprobado. Esta aprobación no equivale a `OPERATIONAL_SCOPE_VERIFIED`, revisión legal/tributaria o publicación. `TERMS_DRAFT_READY` solo indica que existe un borrador para revisión. La matriz usa `VERIFIED` por evidencia y alcance concretos; `NOT_VERIFIED` no significa que un servicio no exista, pero no permite prometerlo ni incluirlo por inferencia.

La UI vigente mantiene solicitud asistida y el copy **“Preparación para publicación según la cotización”**. No se promete proveedor tecnológico, publicación operacional, conexión de dominio fuera de lo que indique la cotización ni gestión recurrente por usar Astro/Vercel en el showroom. La sección de publicación vigente de `/terminos` v0.6 se conserva para acuerdos y clientes que contrataron bajo esa versión.

## 3. Modelo económico aprobado para evaluación interna

Los importes siguientes son los valores comerciales finales en CLP aprobados el 2026-10-22. Su tratamiento tributario específico permanece `PENDING_TAX_REVIEW`; no se afirma aquí si una línea está afecta, exenta, incluye un impuesto determinado, cuándo se devenga ni qué documento tributario aplica más allá de la regla pública actual “boleta o factura según corresponda”.

| Producto | Activación inicial, una vez | Continuidad mensual opcional | Continuidad anual prepagada opcional |
|---|---:|---:|---:|
| Landing Comercial (`landing`) | $120.000 | $19.900 | $214.920 |
| Catálogo de Productos (`catalogo`) | $160.000 | $24.900 | $268.920 |
| Web Corporativa (`corporativa`) | $180.000 | $29.900 | $322.920 |

La activación se cobra una vez y no recibe el descuento de continuidad. El prepago anual representa doce mensualidades de continuidad menos el 10 %, aplicado solo a continuidad:

| Producto | 12 mensualidades listadas | Descuento (10 %) | Prepago anual |
|---|---:|---:|---:|
| `landing` | $238.800 | $23.880 | $214.920 |
| `catalogo` | $298.800 | $29.880 | $268.920 |
| `corporativa` | $358.800 | $35.880 | $322.920 |

Estos valores concilian con `src/data/commercial-rules.ts`: modos `none`, `monthly`, `annual_prepay`; activaciones y mensualidades canónicas en el servidor; prepago anual calculado como `round(mensualidad × 12 × 0,90)`. La tabla en este documento solo hace legible esa decisión; no es lógica ni fuente de cálculo adicional. Las promociones no se acumulan salvo política explícita, aprobada y versionada; la regla interna vigente rechaza su acumulación automática.

**Condición de disponibilidad:** las cifras de continuidad no constituyen una oferta independiente de servicios. Hoy no hay contraprestación recurrente documentada y verificada para seleccionar junto a ellas. No se puede contratar ni cobrar una modalidad de continuidad hasta que su cotización describa al menos un servicio concreto verificado, responsable, periodicidad, alcance, límites, exclusiones y costos, y exista gate de release autorizado. La existencia de precios aprobados no permite inferir hosting, soporte, mantenimiento, backups u otra prestación.

## 4. Activación inicial: alcance, materiales y aceptación

La activación se limita a un `ProductSlug` y al alcance enumerado en la cotización versionada. La cotización debe identificar la entrega revisable, contenido, criterios observables de conformidad, exclusiones, responsables y costo final. No se considera una suscripción ni agrega automáticamente cargos periódicos.

### 4.1 Entrega por producto

- **Landing Comercial:** composición de una página comercial, hasta seis secciones, una propuesta principal, CTA y contacto, diseño responsive y aplicación básica de la identidad que esté disponible.
- **Catálogo de Productos:** vitrina de hasta doce fichas/bloques, categorías simples, CTA y contacto; no gestiona pedidos, carrito, checkout, cobros, ventas, inventario o stock.
- **Web Corporativa:** cuatro áreas base —Inicio, Empresa, Servicios y Contacto—, navegación, CTA y contacto, diseño responsive y aplicación básica de identidad disponible.

La entrega se revisa frente a estos límites y los ítems enumerados por la cotización. “Preparación para publicación según la cotización” no garantiza publicación efectiva ni conexión de dominio. Si una cotización futura incorpora publicación o conexión, debe nombrar el producto, proveedor/cuenta, titular, responsable, permisos, costos externos, criterio de término, prueba y plan de salida; esa capacidad debe estar verificada antes de ofrecerla. No se promete WordPress, otra plataforma o proveedor específico.

### 4.2 Materiales del cliente

El cliente aporta oportunamente, cuando ya estén disponibles y sean aplicables: identidad/logo, textos e información del negocio, propuesta de valor existente, contactos, imágenes/material visual y dominio existente. Además:

- `landing`: oferta principal, acción/CTA y textos del alcance;
- `catalogo`: lista de ítems, categorías, nombres/descripciones, imágenes disponibles y canal de consulta;
- `corporativa`: descripción institucional, servicios, forma de trabajo, contactos y material institucional.

El cliente manifiesta que puede autorizar los materiales que proporciona; el texto de esa declaración debe ser confirmado por asesoría jurídica. Redacción extensa, producción fotográfica, creación/reformulación de branding, logo o propuesta de valor no quedan incluidos por defecto; cualquier desarrollo adicional requiere cotización y aceptación separadas.

### 4.3 Revisión y aceptación

La activación incluye **una revisión consolidada**: el cliente reúne observaciones relacionadas con el alcance contratado en una entrega coordinada, y EVAAS atiende las que correspondan a los criterios pactados. Cambios de producto, nuevas funcionalidades, material adicional y rondas fuera de ese límite se evalúan y cotizan aparte. La cotización debe identificar la revisión y los criterios aplicables; no se fija en este borrador un plazo de observación, aceptación por silencio, garantía, devolución ni sanción.

**Marcadores obligatorios antes de contratar:** `[PENDING_LEGAL_REVIEW: mecanismo y evidencia de aceptación, canal, plazos aplicables y tratamiento de controversias]`; `[PENDING_RELEASE_DECISION: formato/medio de entrega y criterio de conformidad de la cotización]`. La entrega no trae hosting, administración de cuenta, renovación de servicios, soporte, mantenimiento ni respaldo por silencio.

## 5. Continuidad opcional y contraprestación

La continuidad es separada y opcional respecto de la activación. El modo técnico `none` significa que no se seleccionó continuidad; `monthly` y `annual_prepay` son modalidades candidatas del motor interno, no habilitación pública. La continuidad se podrá aceptar solo mediante una orden/anexo de servicio que contenga:

1. servicio(s) concretos de la matriz con estado `VERIFIED`, fuente de evidencia y alcance probado;
2. qué tarea/resultado recibe el cliente, su frecuencia o período de prestación y qué requiere de éste;
3. responsable operativo y proveedor, cuenta/titularidad y dependencias de terceros;
4. importe aplicable, período, inicio y término expresados como fecha en la cotización, costos externos y límite/condición de consumo;
5. exclusiones, mecanismo de aviso, término/suspensión, tratamiento de prepagos, datos, accesos y salida revisados legalmente.

El modo mensual se cotizaría por ciclo mensual, sin presumir renovación automática. El modo anual corresponde al prepago de doce mensualidades de continuidad, a precio con 10 % de descuento exclusivamente sobre esas mensualidades. Inicio, término y eventual renovación requieren aceptación explícita y deben quedar documentados; no se fija un plazo de aviso, sanción, reajuste o derecho de devolución en este borrador. El descuento no alcanza la activación. No se acumula con promociones, salvo regla expresamente aprobada y versionada.

Mientras falte esa ficha de contraprestación verificada, **no hay un paquete recurrente que ofrecer ni una línea de continuidad que se pueda contratar**, incluso si el sistema interno puede calcular el precio. El contrato no transforma una posibilidad futura en capacidad disponible.

## 6. Terceros, dominio, activos y accesos

El dominio adquirido y conservado por el cliente es el baseline público actual. La compra del dominio y todo costo de terceros se separan del valor del producto y se informan para aprobación antes de contratar/aplicar. La conexión inicial mencionada en `/terminos` v0.6 se conserva en contratos vigentes; este borrador no la revoca retroactivamente. La verificación operacional para una futura cotización de publicación/DNS no está completa y debe resolver la diferencia con el copy neutral actual.

Antes de una nueva contratación, la cotización debe indicar quién contrata, paga y posee cada cuenta; cómo se otorgan/revocan accesos; quién renueva planes/licencias; qué consumos pueden generar costos; cómo el cliente accede a sus activos y cómo se entrega la salida. No activar un servicio externo o sobreconsumo sin información y aprobación requeridas. El límite de tráfico/almacenamiento no tiene valores documentados.

El cliente conserva los materiales que aporta. La titularidad/licencia de diseño, código, componentes reutilizables, fuentes, imágenes, software y otros activos no está resuelta por las fuentes H03 revisadas. No se presume cesión, exclusividad, licencia perpetua, derecho de sublicencia, disponibilidad de fuente editable ni permiso de terceros. **`[PENDING_LEGAL_REVIEW: definir por categoría los derechos otorgados, el momento en que nacen y los activos excluidos.]`**

## 7. Operación, soporte y seguridad

La matriz operacional es específica por servicio. Con la evidencia inspeccionada para C08, alojamiento, SSL, DNS recurrente, backups, restauración probada, actualizaciones, soporte, incidentes/disponibilidad, capacidad, licencias administradas y portabilidad permanecen `NOT_VERIFIED` como prestación recurrente H03. Este estado no afirma que la prestación no exista; registra que aún no hay evidencia suficiente para comprometerla.

Por lo tanto, ninguna se describe aquí como incluida. No se fijan SLA, RPO/RTO, disponibilidad, horario, tiempo de respuesta/resolución, frecuencia de respaldo, almacenamiento, minutos de soporte, monitoreo, restauración, actualización o compensación. Un servicio podría agregarse solo en una versión revisada, con prueba y responsable, límites, costos, exclusiones y decisión registrada.

## 8. Renovación, suspensión, término, reembolso y salida

Esta versión no propone renovación automática. La cotización debe indicar las fechas de inicio y término de cada período. Si se propone renovación, sus mecanismo, período y avisos se deben definir expresamente y revisar antes de ofrecerlos; no se inventa aquí un plazo de aviso. Tampoco se fijan causas/plazos de suspensión, subsanación, penalidades, reactivación o garantía.

El tratamiento de término y reembolsos, incluidas reglas aplicables al prepago anual y trabajo ya prestado, queda **`PENDING_LEGAL_REVIEW`**. El contrato no puede limitar derechos que resulten aplicables. Antes de salida se deben definir archivos, datos, accesos, cuentas, licencias de terceros, formatos, asistencia, costo, período de conservación y eliminación; hasta entonces portabilidad y restauración quedan `NOT_VERIFIED` y no se prometen.

**`[PENDING_LEGAL_REVIEW: completar condiciones de renovación, aviso, cancelación, suspensión, subsanación, reembolso, término, conservación de datos y salida.]`**

## 9. Cambios y clientes de v0.6

La contratación anual de v0.6 con sus valores públicos $120.000 / $160.000 / $180.000 CLP permanece vigente hasta un release separado autorizado. Ningún cliente, solicitud, cotización aceptada o contrato de v0.6 se migra por este borrador. Los acuerdos existentes conservan las condiciones aceptadas; no se reinterpretan retroactivamente ni se promete migración tácita a activación única o continuidad.

La eventual versión H03 será prospectiva desde una fecha efectiva publicada. Debe especificar tratamiento de solicitudes y cotizaciones no aceptadas, contratos existentes, cuenta/plataforma, contenido de publicación y costos externos; resolver la diferencia entre el texto público v0.6 sobre publicación/conexión y el copy neutral de C05–C07 antes de emitir cualquier comunicación de cambio.

## 10. Solicitud, consentimiento y aceptación versionada

Las superficies actuales preparan una solicitud asistida. Una selección, un envío de formulario o un mensaje preparado/abierto en WhatsApp no constituyen por sí solos aceptación contractual, cotización aceptada, pago, orden ni activación de continuidad. La persona revisa el texto y decide si lo envía.

Antes de una futura contratación, el flujo debe presentar términos y cotización que se puedan revisar y conservar antes de aceptar, y distinguir esa acción explícita de la solicitud/WhatsApp. El registro de aceptación debe poder reconstruir al menos: `termsVersion`, `commercialRulesVersion`, versión/identificador de cotización, `ProductSlug`, modalidad, precio/desglose aplicable, texto/artefacto aceptado o su hash, fecha-hora, identidad/autoridad del aceptante y constancia de confirmación enviada. La retención, datos mínimos, acceso y eliminación requieren revisión de privacidad/jurídica. C08 solo define el diseño documental; no implementa persistencia ni aceptación.

El contrato requiere `TERMS_VERSION=1.0-draft` únicamente como versión técnica no efectiva. `/api/internal/commercial-request-v3` crea un borrador versionado, con `TERMS_EFFECTIVE_DATE=null`, `offerStatus=DRAFT_NOT_FOR_PUBLICATION` y TTL de una hora; no registra aceptación contractual, pago u orden. El Handoff V2 y su contrato vigente no cambian ni se reinterpretan como aceptación H03.

## 11. Impuestos y revisión jurídica

`TAX_REVIEW=PENDING`. Antes del release, un asesor tributario/contable debe clasificar cada contraprestación separadamente (activación, cada servicio mensual, prepago anual, terceros y ampliaciones), revisar base imponible/exenciones aplicables, expresión “valor final”, boleta/factura, momento de emisión/devengo y reconocimiento del prepago anual. Los importes aprobados no autorizan inferir tratamiento tributario ni cambiar su cuantía.

`LEGAL_REVIEW=PENDING`. La revisión debe determinar el régimen de clientes y contratación aplicable y validar, entre otros, formación y confirmación del contrato electrónico, información previa y precio, términos de renovación/salida, retracto y reembolso, suspensión, responsabilidad, derechos de autor/licencias, tratamiento y transferencia de datos, conservación/eliminación, reclamaciones, proveedores terceros, cláusulas de adhesión y la coherencia con la comunicación de v0.6. Esta lista no es una opinión legal ni concluye que una norma aplique o no aplique a una modalidad concreta.

La revisión debe considerar la fecha efectiva de la Ley 21.719 indicada por BCN para el 1 de diciembre de 2026 y establecer qué obligaciones/transición aplican al producto, al cliente y al tratamiento real de datos; C08 no determina ese alcance. Referencias oficiales para el revisor:

- [Ley 19.496, texto en Ley Chile (BCN)](https://nuevo.leychile.cl/navegar?idNorma=61438), incluidas las reglas sobre contratos electrónicos y artículos cuya aplicación debe evaluar asesoría.
- [SERNAC: información sobre derecho a retracto](https://www.sernac.cl/portal/607/w3-propertyvalue-15024.html); usar para identificar la revisión, no para concluir por este borrador si corresponde a cada cliente/servicio.
- [SII: tratamiento de IVA de servicios / desarrollo de software](https://www.sii.cl/preguntas_frecuentes/impuestos_mensuales/001_130_2449.htm) y [SII: IVA digital](https://www.sii.cl/vat/faq1_esp.html); la clasificación de cada línea H03 debe obtenerse del asesor, no extrapolarse desde esta FAQ.
- [Ley 21.719, Ley Chile (BCN)](https://www.bcn.cl/leychile/Navegar/imprimir?idNorma=1209272), que BCN identifica con vigencia diferida al 1 de diciembre de 2026; revisar su interacción con la transición de datos.

## 12. Versionado, fecha efectiva y publicación

`ACTIVATION_CONTINUITY_PILOT_v0.3.md` es la revisión documental interna. El identificador técnico `1.0-draft` no es términos efectivos ni autorización pública. `EFFECTIVE_DATE=NOT_SET`; la fecha efectiva queda `PENDING_RELEASE_DECISION` y no usa la fecha de aprobación económica.

No editar ni reemplazar `src/pages/terminos.astro` en C08. Publicar H03 requerirá gate y autorización explícitos, nueva versión pública, fecha efectiva, hash/registro de versión, aceptación versionada, coherencia de UI/selector/handoff, pruebas y plan de rollback a v0.6. Hasta entonces `PUBLICATION_AUTHORIZED=NO` y `PUBLIC_TERMS_GATE=PENDING`.

**Fin del borrador.** Pendientes obligatorios: contraprestación de continuidad por servicio, responsables/evidencia/costos/límites, revisión jurídica, revisión tributaria, decisión de release/fecha, aceptación versionada y resolución prospectiva de copy. La aprobación económica del 22-10-2026 se preserva sin reabrirla.
