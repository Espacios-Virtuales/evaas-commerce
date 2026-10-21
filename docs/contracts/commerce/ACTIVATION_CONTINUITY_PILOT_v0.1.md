# EVAAS Commerce · Borrador de contrato piloto de activación y continuidad v0.1

**Estado:** `CONTRACT_DRAFT`

**Cápsula:** `EVW-EVCOM-H03-L01-C01`

**Baseline técnico y documental revisado:** `f0f4a0bedaac4948ed15a33258c7e2d7925928fb` (`origin/main` = `origin/develop`, observado el 21 de octubre de 2026)

**Uso:** conciliación interna; no constituye una oferta, tarifa ni modificación aprobada de las condiciones publicadas.

## 1. Autoridad, fuentes y reglas de lectura

Este borrador concilia el intake H03 aprobado, el informe de conciliación de productos del 9 de octubre de 2026, la adenda financiera del piloto y las siguientes fuentes versionadas:

- `src/data/products.ts`;
- `src/pages/terminos.astro`;
- `docs/traces/EVCOM_H02_L01.md`.

Las condiciones públicas observadas corresponden a la versión 0.6. Las hipótesis de la adenda financiera sirven solo para preparar decisiones: no autorizan precios de continuidad, descuentos, periodicidades, prestaciones ni compromisos operacionales. Ante una diferencia, este documento conserva la distinción entre lo publicado, lo demostrado y lo propuesto.

Etiquetas normativas usadas:

- `PUBLIC_BASELINE`: afirmación publicada o trazada en v0.6; no se redefine aquí.
- `PENDING_VERIFICATION`: prestación o condición que las fuentes revisadas no demuestran como compromiso operacional.
- `OWNER_DECISION_REQUIRED`: decisión comercial, jurídica u operacional que debe aprobar el responsable antes de publicar, cotizar o contratar.

## 2. Oferta conciliada: exactamente tres productos

La oferta mantiene exactamente los tres valores de `ProductSlug`. Un perfil editorial, artístico, sectorial o de otro tipo solo orienta la composición de contenido y diseño dentro del producto elegido. No crea un producto, plugin, plan, tarifa ni prestación adicional por cliente o perfil.

| `ProductSlug` | Producto | Alcance público v0.6 | Activación: línea de base pública actual |
| --- | --- | --- | ---: |
| `landing` | Landing Comercial | Una página, hasta seis secciones y una revisión consolidada. | $120.000 CLP, valor final |
| `catalogo` | Catálogo de Productos | Un catálogo, hasta doce ítems y una revisión consolidada; sin ecommerce. | $160.000 CLP, valor final |
| `corporativa` | Web Corporativa | Cuatro áreas: Inicio, Empresa, Servicios y Contacto; una revisión consolidada. | $180.000 CLP, valor final |

Los valores anteriores son el baseline público v0.6 observado. `/terminos` los describe actualmente como valores de una contratación anual. Interpretarlos en el futuro como un cobro inicial único de **activación** es una propuesta contractual de este piloto y **no** una modificación ya aprobada o aplicada a `/terminos` (`OWNER_DECISION_REQUIRED`). La boleta o factura se emite según corresponda, conforme al texto público vigente.

## 3. Separación económica propuesta

### 3.1 Activación, una sola vez

Propuesta: la activación remunera una entrega inicial acotada al producto seleccionado y se cobra una vez. Su alcance debe quedar fijado en la cotización canónica antes de contratar. Esta propuesta no agrega servicios a los que hoy enumeran las fuentes ni transforma por sí sola los valores v0.6 en tarifas de activación aprobadas (`OWNER_DECISION_REQUIRED`).

### 3.2 Continuidad

Propuesta: la continuidad es una contratación separada para prestaciones posteriores a la entrega. Podría contratarse mensualmente o mediante prepago anual **solo si se aprueban** modalidad, precio, alcance, nivel de servicio, fecha de inicio, renovación y término (`OWNER_DECISION_REQUIRED`).

No existe en este borrador precio autorizado de continuidad ni descuento autorizado por prepago anual. Tampoco se presume que hosting, SSL, backups, restauración, actualizaciones, soporte o gestión de incidentes estén incluidos: cada prestación requiere verificación y definición expresa en la matriz de la sección 5.

### 3.3 Ampliaciones independientes

Todo trabajo fuera del alcance acordado —incluidos pagos, agenda, analítica, integraciones, ecommerce, automatizaciones, áreas privadas, redacción extensa, producción fotográfica u otros desarrollos— se evalúa y cotiza por separado. Una ampliación no queda incluida automáticamente en la activación ni en la continuidad, y no altera estas últimas sin aceptación expresa.

Las promociones temporales documentadas en v0.6 no autorizan descuentos sobre continuidad, prepago o ampliaciones.

## 4. Alcance de la activación propuesta

La cotización debe escoger uno de los tres productos y reproducir sus límites. Según las fuentes v0.6, el alcance común considera aplicación básica de la identidad disponible, estructura correspondiente al producto, diseño responsive, llamado a la acción y contacto, publicación inicial en una cuenta o plan compatible, conexión del dominio del cliente y una revisión consolidada.

El cliente aporta textos, datos, identidad y materiales necesarios. La revisión consolidada reúne observaciones en una sola entrega. Lo que no esté identificado en la cotización canónica queda fuera y, si se solicita, se trata como ampliación independiente.

Este párrafo registra el contenido público observado; no prueba por sí mismo una obligación recurrente ni define cuentas, planes, ventanas de atención, tiempos de respuesta, políticas de respaldo o niveles de disponibilidad.

## 5. Matriz de prestaciones operacionales

`PENDING_VERIFICATION` significa que la prestación no puede prometerse ni incluirse en precio hasta aportar evidencia y obtener las decisiones indicadas. “Costo pendiente” no equivale a costo cero ni a incluido.

| Prestación | Estado | Responsable | Costo | Límite por definir | Evidencia disponible / faltante |
| --- | --- | --- | --- | --- | --- |
| Hosting y SSL | `PENDING_VERIFICATION` | `OWNER_DECISION_REQUIRED`: definir proveedor, titular de cuenta y operador | Pendiente; no autorizado como incluido | Plan, ambientes, almacenamiento, transferencia, certificados, renovación y salida | `/terminos` solo menciona publicación inicial en cuenta o plan compatible y costos externos informados antes de contratar; falta compromiso operacional |
| Backups y restauración | `PENDING_VERIFICATION` | `OWNER_DECISION_REQUIRED` | Pendiente | Cobertura, frecuencia, retención, ubicación, pruebas, RPO/RTO y restauraciones incluidas | Sin evidencia de una prestación contratada en las fuentes revisadas |
| Actualizaciones | `PENDING_VERIFICATION` | `OWNER_DECISION_REQUIRED` | Pendiente | Componentes cubiertos, frecuencia, compatibilidad, contenido y cambios excluidos | Sin evidencia de mantenimiento recurrente en las fuentes revisadas |
| Disponibilidad e incidencias | `PENDING_VERIFICATION` | `OWNER_DECISION_REQUIRED` | Pendiente | Disponibilidad objetivo, medición, severidades, horario, respuesta, resolución, exclusiones y compensaciones | Sin SLA ni procedimiento de incidentes demostrado en las fuentes revisadas |
| Soporte | `PENDING_VERIFICATION` | `OWNER_DECISION_REQUIRED` | Pendiente | Canal, horario, contactos autorizados, materias, cupo y tiempos de respuesta | Las fuentes muestran canal comercial; no demuestran una mesa de soporte recurrente |
| Exportación y portabilidad | `PENDING_VERIFICATION` | `OWNER_DECISION_REQUIRED` | Pendiente | Formatos, contenido exportable, plazo, asistencia, entrega de credenciales y exclusiones de terceros | Sin procedimiento o formato de salida demostrado en las fuentes revisadas |
| Dominio | `PUBLIC_BASELINE` para titularidad del cliente y conexión inicial; operación posterior `PENDING_VERIFICATION` | Cliente compra y conserva el dominio; `OWNER_DECISION_REQUIRED` para gestión delegada posterior | Compra y costos externos no incluidos; gestión posterior pendiente | Registrador, DNS, renovaciones, accesos, vencimiento, transferencia y asistencia | `/terminos` documenta compra/titularidad del cliente y conexión inicial; no acredita administración continua |
| Terceros | `PENDING_VERIFICATION` | Cliente aprueba costos y condiciones; `OWNER_DECISION_REQUIRED` para selección, contratación y operación | Pendiente; todo costo externo debe informarse antes | Proveedor, cuenta, licencias, disponibilidad, cambios, datos, soporte y terminación | `/terminos` reconoce planes o servicios externos, pero no prueba cuáles serán contratados ni incluidos |
| Tráfico y capacidad | `PENDING_VERIFICATION` | `OWNER_DECISION_REQUIRED`; cliente debe aprobar cualquier ampliación | Pendiente; sin tarifa autorizada | Umbrales, medición, alertas, recursos, degradación, sobreconsumo y aprobación previa | `/terminos` indica que alto tráfico puede exigir recursos y costo mensual separado; no fija umbral ni precio |

## 6. Cláusulas contractuales en borrador

Todas las cláusulas de esta sección son propuestas y requieren revisión jurídica y aprobación del responsable antes de usarse con clientes.

### 6.1 Alcance y aceptación

La contratación identifica un único `ProductSlug`, su alcance, límites, entregables, exclusiones y precio en una cotización canónica. Solo lo aceptado expresamente integra la entrega. Solicitudes posteriores o fuera de límite se cotizan como ampliaciones independientes. `OWNER_DECISION_REQUIRED`: definir mecanismo de aceptación, vigencia de la cotización, hitos y criterio de conformidad.

### 6.2 Materiales del cliente

El cliente entrega oportunamente textos, datos, identidad, imágenes y demás materiales necesarios, y declara contar con permisos para usarlos. Los plazos que dependan de esos materiales comienzan cuando la entrega esté completa. `OWNER_DECISION_REQUIRED`: definir tratamiento de atrasos, material ilícito o infractor y período de conservación.

### 6.3 Revisión

La activación contempla una revisión consolidada dentro de los límites del producto. Cambios de alcance, nuevas rondas o material reemplazado después de la revisión pueden cotizarse como ampliación. `OWNER_DECISION_REQUIRED`: definir plazo para observar, qué constituye una ronda y aceptación por silencio, si se adopta.

### 6.4 Continuidad, renovación y prepago

La continuidad no nace automáticamente de la activación. Si se aprueba y contrata, la orden debe identificar prestaciones, precio, periodicidad mensual o prepago anual, fecha de inicio, duración y mecanismo de renovación. No hay descuento anual autorizado. `OWNER_DECISION_REQUIRED`: aprobar precio, eventual descuento, renovación expresa o automática, aviso previo y tratamiento de saldos.

### 6.5 Suspensión y cancelación

Ninguna suspensión o cancelación se presume. Un contrato aprobado deberá señalar causas, avisos, plazos de subsanación, efectos sobre publicación y datos, pagos devengados, servicios de terceros y reactivación. `OWNER_DECISION_REQUIRED`: aprobar cada causal y evitar una baja que impida al cliente recuperar sus materiales o activos.

### 6.6 Portabilidad y salida

Al terminar activación o continuidad, el contrato debe indicar qué materiales, archivos, accesos y datos pueden entregarse, en qué formato, plazo y costo. Los activos de terceros están sujetos a sus capacidades y licencias. `OWNER_DECISION_REQUIRED`: definir paquete de salida, asistencia incluida, conservación y eliminación posterior.

### 6.7 Titularidad y licencias

El cliente conserva la titularidad de su dominio y de los materiales que aporta. La titularidad o licencia de diseño, código, componentes reutilizables, fuentes, imágenes y demás entregables debe definirse expresamente, incluyendo el momento en que opera y cualquier condición de pago. `OWNER_DECISION_REQUIRED`: aprobar régimen de propiedad intelectual y licencias; este borrador no lo presume.

### 6.8 Proveedores terceros

Toda dependencia de hosting, registrador, certificados, fuentes, analítica u otro tercero debe identificarse antes de contratar cuando sea conocida. La cotización debe distinguir titular de la cuenta, contraparte de pago, periodicidad, condiciones externas y efecto de cambios o indisponibilidad. Ningún costo de tercero se considera incluido por omisión.

### 6.9 Soporte

Solo existe soporte recurrente si una continuidad aprobada lo describe. El contrato deberá fijar canal, horario, alcance, exclusiones, cupo y objetivos de respuesta; no se prometerá resolución o disponibilidad sin capacidad y evidencia. `OWNER_DECISION_REQUIRED`: completar estos parámetros.

### 6.10 Operación sin continuidad

El cliente puede contratar la activación sin continuidad. Antes de la entrega se debe acordar quién mantendrá la cuenta de publicación, dominio, DNS, credenciales, renovaciones, actualizaciones e incidentes. Sin continuidad, EVAAS no asume prestaciones recurrentes no contratadas; ello no elimina obligaciones expresamente aceptadas para la entrega, salida o garantías legales aplicables. `OWNER_DECISION_REQUIRED`: definir modalidad de entrega autónoma, instrucciones mínimas y responsabilidades que sobreviven al cierre.

## 7. Recorrido comercial y canal

La separación propuesta es:

`producto` → `selección` → `cotización canónica` → `canal`

- **Producto:** uno de los tres `ProductSlug`; su perfil visual/editorial es composición.
- **Selección:** preferencia o solicitud del cliente; todavía no es compra, orden ni pago.
- **Cotización canónica:** documento controlado que fija producto, alcance, exclusiones, precio aplicable, vigencia y, si corresponde, continuidad o ampliaciones separadas. `OWNER_DECISION_REQUIRED`: definir autoridad, identificador, aceptación y custodia.
- **Canal actual:** WhatsApp manual. El sistema puede preparar o abrir un mensaje, pero no lo envía; la persona lo revisa y decide si pulsa Enviar. La conversación no demuestra por sí sola contratación ni pago.

En el futuro este recorrido podría incorporar conceptos de `quote`, `order` y `payment`, sujetos a contratos y autorización propios. Este documento no crea tablas, endpoints, estados, identificadores, persistencia, reglas de transición, pasarela ni reglas transaccionales.

## 8. Showroom, tecnología y entrega

Astro y Vercel describen la implementación o el despliegue observado del showroom; no definen por sí solos la tecnología, proveedor, cuenta o modalidad de cada entrega a cliente. La entrega contractual debe expresarse como resultado y responsabilidad acordados, y la cotización debe identificar cualquier dependencia técnica necesaria.

En `src/data/products.ts`, los tres productos incluyen la frase **“Publicación inicial en Vercel”**. Se propone reemplazarla, en una cápsula de implementación posterior y solo tras aprobación, por:

> Publicación inicial en una cuenta o plan compatible, según la cotización.

Razón: evita convertir el proveedor actual del showroom en una promesa contractual universal y se alinea con el lenguaje ya publicado en `/terminos`. Este documento no modifica `src/data/products.ts`.

`OWNER_DECISION_REQUIRED`: aprobar el copy final y decidir si la cuenta será del cliente, de EVAAS o de un tercero en cada modalidad.

## 9. Borrador propuesto para `/terminos`

El siguiente texto es una propuesta editorial para revisión. No reemplaza ni modifica `src/pages/terminos.astro` y no debe publicarse hasta resolver todas las decisiones marcadas.

### Activación, continuidad y ampliaciones

> EVAAS Commerce ofrece tres productos: Landing Comercial, Catálogo de Productos y Web Corporativa. La activación corresponde a la preparación y entrega inicial del producto indicado en la cotización, dentro de su alcance y límites. Su cobro se realiza una sola vez. **[OWNER_DECISION_REQUIRED: confirmar que los valores finales publicados de $120.000, $160.000 y $180.000 CLP pasan a ser precios de activación y fijar su fecha de vigencia.]**
>
> La continuidad es opcional y se contrata por separado. Solo comprende las prestaciones, límites y período indicados en su cotización. **[OWNER_DECISION_REQUIRED: completar prestaciones verificadas, precio, modalidad mensual o prepago anual, eventual descuento, renovación y término.]** Si no se contrata continuidad, antes de la entrega se informará cómo quedan la publicación, las cuentas, el dominio, los accesos y las responsabilidades operacionales.
>
> Las ampliaciones y los servicios fuera del alcance se evalúan y cotizan de forma independiente. No quedan incluidos en la activación o continuidad salvo aceptación expresa.

### Publicación, dominio y terceros

> La publicación inicial se realiza en una cuenta o plan compatible definido en la cotización. El cliente compra y conserva su dominio; EVAAS realiza la conexión inicial cuando esté incluida. Todo plan pagado, licencia, consumo extraordinario o servicio de terceros se identifica y somete a aprobación antes de contratarlo o aplicarlo. **[OWNER_DECISION_REQUIRED: definir titularidad de cuentas, gestión posterior, portabilidad y tratamiento de alto tráfico.]**

### Materiales, revisión y salida

> El cliente aporta los materiales y permisos necesarios. La activación contempla una revisión consolidada dentro del alcance elegido. **[OWNER_DECISION_REQUIRED: completar plazos de entrega, observaciones y aceptación.]** Al finalizar la relación, la entrega de archivos, datos, accesos o asistencia de portabilidad se rige por lo indicado en la cotización y por las capacidades y licencias de terceros. **[OWNER_DECISION_REQUIRED: definir paquete, formato, plazo, costo, conservación y eliminación.]**

## 10. Decisiones abiertas para aprobación

1. Confirmar si los valores públicos v0.6 pasan de “contratación anual” a cobro único de activación, su fecha de vigencia y transición para cotizaciones existentes.
2. Aprobar el alcance exacto y responsable de cada prestación de continuidad después de aportar evidencia operacional.
3. Definir precio de continuidad, modalidad mensual y/o prepago anual y si existirá descuento; actualmente ninguno está autorizado.
4. Aprobar titularidad y operación de cuentas de hosting, SSL, dominio, DNS y demás terceros, además de límites de tráfico.
5. Definir SLA o excluirlo expresamente: disponibilidad, incidencias, soporte, backups, restauración y actualizaciones.
6. Aprobar renovación, suspensión, cancelación, reactivación y tratamiento de pagos o saldos.
7. Definir portabilidad, paquete de salida, formatos, plazos, costos, conservación y eliminación.
8. Aprobar titularidad y licencias de diseño, código, componentes y activos de terceros.
9. Aprobar aceptación de alcance, materiales, hitos, revisión consolidada y conformidad.
10. Definir cómo opera y qué recibe el cliente que no contrata continuidad.
11. Aprobar el reemplazo de “Publicación inicial en Vercel” por copy neutral y decidir la titularidad de la cuenta de publicación.
12. Definir autoridad y mecanismo de la cotización canónica sin anticipar el modelo transaccional futuro.

Hasta que estas decisiones se cierren, este documento permanece como borrador de conciliación y no autoriza cambios en `/terminos`, precios nuevos, descuentos, prestaciones operacionales, envíos por WhatsApp ni implementación transaccional.
