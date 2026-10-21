# EVAAS Commerce · Alineación de copy y contrato v0.1

**Estado:** `COPY_DRAFT`

**Cápsula:** `EVW-EVCOM-H03-L01-C03`

**Base C02:** `2c88344a5433170ebd9122ad90bb5f7877e0806c`

**Trazabilidad preservada:** C01 `844ff25f539efea4cf09d0b0792ccb693e50cece`; C02 `2c88344a5433170ebd9122ad90bb5f7877e0806c`.

**Alcance:** propuesta documental para revisión del owner. No modifica copy público, términos, código, API, cobros, despliegue ni contratos de clientes.

## 1. Dos estados que no deben mezclarse

### Estado A — oferta pública v0.6 vigente

`PUBLIC_CURRENT`. Es el único estado publicado observado en el código y en `docs/traces/EVCOM_H02_L01.md`:

- EVAAS Commerce ofrece exactamente Landing Comercial (`landing`), Catálogo de Productos (`catalogo`) y Web Corporativa (`corporativa`).
- Los valores finales públicos son $120.000, $160.000 y $180.000 CLP.
- `src/pages/terminos.astro` los define como valores de una contratación anual, con fecha de inicio y término determinada al contratar y renovación opcional.
- El flujo actual prepara una solicitud y un mensaje de WhatsApp. La persona revisa el mensaje y pulsa Enviar; una referencia o confirmación no equivale a compra o pago.
- La API vigente valida la solicitud, resuelve el precio v0.6 y una campaña vigente desde fuentes internas, y devuelve un `requestId` y un handoff. No existe en esta revisión evidencia de una cotización durable, orden o pago.

Este documento no modifica ese estado.

### Estado B — borrador futuro H03

`PROPOSAL_NOT_APPROVED`. C01 y C02 exploran separar un cobro inicial de activación de una continuidad opcional mensual o con prepago anual, más ampliaciones independientes. Las mensualidades $19.900/$24.900/$29.900, el descuento anual de 10 %, los totales de primer año y la reinterpretación de los valores v0.6 como activación única son hipótesis pendientes. No son oferta pública, tarifa autorizada ni regla transaccional.

Ningún copy H03 debe publicarse hasta superar el gate de la sección 8.

## 2. Identidad comercial y taxonomía

- **Producto/experiencia:** EVAAS Commerce.
- **Proveedor:** ESPACIOS VIRTUALES SpA, RUT 78.428.352-6, según `/terminos` vigente.
- **Productos:** únicamente `landing`, `catalogo` y `corporativa`.
- **Perfiles:** editorial, artístico, sectorial u otro perfil de experiencia describen composición visual o de contenido dentro de un producto. No crean un cuarto producto, plugin, tarifa o entitlement.

Evidencia: `src/data/products.ts:1,19-64` cierra `ProductSlug` y la colección en tres; `src/pages/terminos.astro:13-21` identifica proveedor, oferta y valores; `src/components/Footer.astro:54-55` presenta EVAAS Commerce como experiencia comercial de ESPACIOS VIRTUALES SpA.

## 3. Matriz de alineación actual → propuesto

Toda propuesta de esta matriz está `OWNER_APPROVAL_REQUIRED`. “Mantener ahora” significa no editar la superficie en H03 documental.

| Archivo y fragmento | Copy/comportamiento actual | Propuesta futura | Por qué | Evidencia | Decisión trazable |
| --- | --- | --- | --- | --- | --- |
| `src/data/products.ts:1,19-64` — slugs, nombres y precios | Tres slugs; precios finales 120.000/160.000/180.000 | Mantener nombres, slugs y valores v0.6 mientras no se apruebe la transición. Un perfil de experiencia será metadato opcional, no producto. | Preservar identidad canónica y evitar elevar H03 a producción. | H02; C01 §2; C02 §2 | `OWNER_APPROVAL_REQUIRED`: transición económica y taxonomía de perfiles |
| `src/data/products.ts:29,44,59` — inclusiones | “Publicación inicial en Vercel” y “Conexión de dominio” | Solo si la capacidad de entrega se demuestra: “Publicación inicial y conexión de dominio según el alcance contratado”. Si no se demuestra, usar “Preparación para publicación según la cotización”. | El resultado contractual no debe depender del proveedor técnico del showroom ni prometer una capacidad no verificada. | `/terminos:28,38-39`; C01 §§5 y 8 | `OWNER_APPROVAL_REQUIRED`: evidencia operacional, titular de cuenta y copy final |
| `src/pages/terminos.astro:6,10,16-25` — versión y precio | v0.6; “Configuraciones y valores anuales”; tres valores finales; promociones no acumulables | Mantener v0.6 sin cambios. Tras aprobación integral, reemplazar en una cápsula separada por una versión H03 que distinga activación, continuidad y ampliaciones, con fecha efectiva y transición. | La interfaz muestra precios sin periodicidad en otras superficies; `/terminos` sigue siendo la autoridad pública anual observada. | Fuente vigente; C01 §3; C02 §§2-3 | `OWNER_APPROVAL_REQUIRED`: precios, vigencia, transición, impuestos y promociones |
| `src/pages/terminos.astro:27-49` — alcance/operación | Publicación inicial compatible, dominio del cliente, costos externos y alto tráfico; renovación anual opcional | Conservar los hechos demostrados. No añadir hosting, SSL, backups, restauración, actualizaciones, disponibilidad o soporte hasta definir cobertura y evidencia. Incorporar cancelación, salida y portabilidad aprobadas. | C01 marca estas prestaciones `PENDING_VERIFICATION`. | C01 §§5-6; C02 §§6-7 | `OWNER_APPROVAL_REQUIRED`: cobertura, SLA, salida y cláusulas legales |
| `src/components/ProductCard.astro:14-25` — tarjetas/comparador resumido | Importe “Valor final”; “Publicación y conexión de dominio”; CTA “Elegir” | En Estado A, aclarar “Valor final por 12 meses” solo tras validar consistencia editorial con `/terminos`. En Estado B aprobado, rotular “Activación inicial” y mostrar continuidad por separado; nunca sumar primer año como utilidad. Aplicar copy neutral de publicación sujeto al gate. | `/terminos:16-25`; C02 §2 | `OWNER_APPROVAL_REQUIRED`: etiqueta pública vigente o migración H03 |
| `src/pages/productos/[slug].astro:20,28-61` — detalle | Precio final, alcance/inclusiones, “Responsive y publicación inicial”, dominio del cliente y ampliaciones separadas | Estado A: conservar precio y alcance; evaluar etiqueta anual explícita. Estado B aprobado: bloque separado “Activación inicial”, “Continuidad opcional” y “Ampliaciones”; continuidad sin prestaciones implícitas. | Producto consume `products.ts`; C01 §§3-5 | `OWNER_APPROVAL_REQUIRED`: copy, cobertura y precios |
| `src/pages/demos/[slug].astro:31-69` — demo y cierre comercial | Repite valor final, materiales, ampliaciones separadas y CTA “Elegir”; consume `product.includes` | Conservar la demo como muestra. Si se aprueba H03, aplicar la misma etiqueta de precio/etapa y el copy neutral ya autorizado; no presentar el sector ficticio como perfil-producto. | Catálogo canónico y C01 §2 | `OWNER_APPROVAL_REQUIRED`: consistencia del recorrido y copy de demo |
| `src/pages/index.astro:17-35,83-125` — hero, tarjetas y comparador | “Activación Digital”; desde $120.000; “base profesional y lista para publicar”; fila “Vercel / Publicación inicial”; nota de cuenta compatible | Sustituir la fila de proveedor por “Publicación inicial / Según alcance contratado” solo con evidencia; mostrar periodicidad vigente o separación H03 según el estado autorizado. El showroom puede seguir desplegado en Vercel. | `/terminos:28,38-39`; C01 §8 | `OWNER_APPROVAL_REQUIRED`: capacidad de publicación, copy y estado económico |
| `src/pages/index.astro:129-153` — proceso/confianza | “Compras un resultado”, “dejamos la base operativa” y “presencia funcional, conectada” | Mientras el canal sea solicitud manual: “Eliges un resultado y preparas una solicitud”. Si se demuestra la entrega: “Publicamos y conectamos según la cotización”. Evitar “operativa” si puede sugerir continuidad o SLA. | API/WhatsApp no crean compra; C01 §§5 y 7 | `OWNER_APPROVAL_REQUIRED`: evidencia de entrega y criterio de aceptación |
| `src/components/ProductSelector.astro:1-54,88-131` — selector | Recomienda uno de tres productos; necesidades avanzadas van a evaluación asistida; resultado muestra precio final; WhatsApp abre conversación | Mantener tres productos y evaluación asistida. Añadir periodicidad/etapa al precio solo según Estado A o B aprobado. No convertir ecommerce/integración ni perfiles en productos. Mantener WhatsApp como conversación humana. | `ProductSlug`; builders actuales; C01 §§2 y 7 | `OWNER_APPROVAL_REQUIRED`: etiqueta de precio y copy del CTA |
| `src/pages/activar/[slug].astro:14-92` — resumen/formulario | “Publicación inicial en Vercel”; valor final/campaña; consentimiento para preparar solicitud y abrir WhatsApp; CTA “Preparar solicitud” | Aplicar copy neutral sujeto a evidencia; conservar “Preparar solicitud”. En un futuro flujo de cotización, mostrar `quoteVersion`/`termsVersion` y obtener aceptación antes de avanzar. No llamarlo compra o pago. | Líneas 36, 89 y 92 distinguen solicitud; C01 §7 | `OWNER_APPROVAL_REQUIRED`: términos, evidencia y diseño futuro de cotización |
| `src/pages/api/activation.ts:55-109` + `src/data/campaigns.ts:37-49` — autoridad vigente | Servidor valida producto/campaña, calcula precio desde datos canónicos, genera UUID y handoff | Mantener sin cambios en esta cápsula. Diseñar en un hito técnico posterior una autoridad de cotización versionada; no reutilizar `requestId` como orden ni afirmar que el endpoint actual cotiza o cobra. | H02; código revisado | `OWNER_APPROVAL_REQUIRED`: contrato de cotización y hito técnico separado |
| `src/lib/commercial-context.ts:8-32,72-96` + `src/lib/activation-handoff.ts:17-28,41-75` — contexto | Contexto/handoff v2 con producto, pricing v0.6, campaña, color, referencia y datos del brief; precio recalculado | Los nombres conceptuales H03 de la sección 6 no modifican estos tipos. Cualquier nueva versión requiere contrato, migración, caducidad, privacidad y pruebas en cápsula propia. | Recalculo en handoff y H02 | `OWNER_APPROVAL_REQUIRED`: arquitectura y versionado |
| `src/lib/whatsapp.ts:24-33,57-138` — builders | Mensajes de consulta/activación con producto, precio y referencia; `wa.me` solo precarga texto | Mantener envío humano. Futuro: incluir identificador y versión de cotización solo si el servidor los emite; WhatsApp seguirá siendo adaptador de conversión, no autoridad, orden, checkout o evidencia de pago. | `buildWhatsAppUrl`; confirmación; H02 | `OWNER_APPROVAL_REQUIRED`: copy del mensaje y contrato de cotización |
| `src/pages/confirmacion.astro:10-92` — confirmación | “Solicitud preparada”; instruye revisar y pulsar Enviar; declara que no se envía automáticamente | Mantener. Si existe cotización futura, decir “Cotización preparada” únicamente después de respuesta canónica; nunca “Compra confirmada” sin adaptador de orden/pago y verificación independientes. | Líneas 16, 19, 45-48 y 70-82 | `OWNER_APPROVAL_REQUIRED`: estado futuro y copy |
| `src/components/Footer.astro:54-55` y `/terminos:13-14` — identidad | EVAAS Commerce como experiencia; ESPACIOS VIRTUALES SpA como proveedor | Mantener la separación y repetirla en cotización y términos versionados. | Código vigente | `OWNER_APPROVAL_REQUIRED`: revisión legal de presentación, sin cambio de identidad |

## 4. Copy neutral de publicación

### Reemplazo preferido, sujeto a evidencia

> Publicación inicial y conexión de dominio según el alcance contratado.

Este texto describe un resultado observable sin imponer Vercel a la web del cliente. Solo debe usarse si antes se demuestra quién publica, en qué cuenta o plan, qué constituye publicación completada, qué acceso recibe el cliente y qué dependencias o costos de terceros aplican.

### Alternativa si la publicación completa aún no puede demostrarse

> Preparación para publicación según la cotización.

Esta alternativa evita prometer publicación o conexión antes de contar con capacidad y criterios de aceptación verificables.

El showroom EVAAS Commerce puede continuar en Astro/Vercel. No se propone migrarlo. La decisión técnica del showroom no es requisito contractual para las entregas a clientes, y ningún requisito comercial de este dossier obliga a utilizar Vercel.

Superficies futuras que deberán quedar consistentes si se aprueba el reemplazo: `products.ts`, tarjetas, detalle de producto, comparador, activación, demos que consumen `product.includes`, pasos de portada, `/terminos`, cotización y mensajes comerciales pertinentes.

## 5. Borrador integral propuesto para `/terminos`

> **DRAFT_ONLY — NO PUBLICAR.** Los corchetes son decisiones o campos que deben cerrarse antes de convertir este texto en términos aplicables. Este borrador no reemplaza `src/pages/terminos.astro` v0.6.

### Alcance y condiciones de EVAAS Commerce — versión [TERMS_VERSION]

**Vigencia:** [OWNER_APPROVAL_REQUIRED: fecha efectiva y tratamiento de solicitudes/cotizaciones anteriores].

#### 1. Identificación

EVAAS Commerce es una experiencia comercial ofrecida por **ESPACIOS VIRTUALES SpA**, RUT **78.428.352-6**. Las consultas comerciales se reciben en **info@espaciosvirtuales.lat**. EVAAS Commerce identifica la oferta; ESPACIOS VIRTUALES SpA es el proveedor.

#### 2. Productos

La oferta comprende únicamente Landing Comercial, Catálogo de Productos y Web Corporativa. Los perfiles visuales, editoriales, artísticos o sectoriales son formas de composición dentro del producto elegido y no constituyen productos, plugins o servicios separados.

La cotización identifica el producto, objetivo, alcance, límites, materiales, revisión, exclusiones, precio, vigencia y versiones aplicables. Solo lo aceptado expresamente integra la contratación.

#### 3. Activación inicial

La activación corresponde a la preparación y entrega inicial del producto cotizado. Se cobra una sola vez si el modelo H03 es aprobado.

**[OWNER_APPROVAL_REQUIRED antes de publicar: confirmar si los valores finales $120.000, $160.000 y $180.000 CLP pasan desde la contratación anual v0.6 a activación inicial; definir impuestos, fecha efectiva y transición.]**

La activación no incluye prestaciones recurrentes por silencio. El criterio de entrega y aceptación, la cuenta de publicación, el dominio, los accesos y las dependencias externas se indican en la cotización.

#### 4. Alcance, materiales y revisión

La Landing contempla una página de hasta seis secciones; el Catálogo, hasta doce ítems y sin ecommerce; la Web Corporativa, cuatro áreas principales: Inicio, Empresa, Servicios y Contacto. Cada producto contempla una revisión consolidada, salvo que la cotización aprobada indique otra cosa.

El cliente aporta textos, datos, identidad, imágenes, permisos y demás materiales necesarios. **[OWNER_APPROVAL_REQUIRED: plazos, efecto de materiales incompletos, definición de revisión, aceptación y retrabajo.]** Los cambios fuera de alcance se tratan como ampliaciones.

#### 5. Publicación, dominio y terceros

La publicación o preparación para publicación y la conexión de dominio se ejecutan solo en la medida indicada en la cotización. El cliente compra y conserva su dominio. **[OWNER_APPROVAL_REQUIRED: titular de cuenta, DNS, credenciales, criterio de publicación y entrega autónoma.]**

Planes, licencias, infraestructura, registrador, tráfico y demás servicios de terceros no se consideran incluidos por omisión. Su proveedor, titular, costo, periodicidad, límites y condiciones se informan para aprobación antes de contratar o aplicar. El showroom puede usar una tecnología o proveedor diferente de la entrega.

#### 6. Continuidad opcional

La continuidad es independiente de la activación y solo existe si una cotización aprobada describe sus prestaciones, límites, período y precio. No se presume que incluya hosting, SSL, backups, restauración, actualizaciones, disponibilidad, gestión de incidencias, soporte o portabilidad.

**[HYPOTHESIS_NOT_APPROVED: escenarios internos mensuales de $19.900 Landing, $24.900 Catálogo y $29.900 Corporativa. No publicar ni cobrar hasta aprobación.]**

La modalidad puede ser mensual o prepago anual únicamente tras aprobación. **[HYPOTHESIS_NOT_APPROVED: descuento anual de 10 %.]** La cotización debe indicar fecha de inicio, facturación, renovación, reajuste, cancelación y efectos de la baja.

#### 7. Cobertura y soporte

**[OWNER_APPROVAL_REQUIRED: anexar matriz de cobertura verificada con hosting/SSL, backups/restauración, actualizaciones, disponibilidad/incidencias, soporte, exportación/portabilidad, terceros y tráfico.]**

Si se ofrece soporte, deben indicarse canal, horario, contactos, materias cubiertas, cupo o minutos, prioridades, objetivos de respuesta, exclusiones y costo de exceso. No se promete resolución, disponibilidad o restauración sin capacidad y evidencia aprobadas.

#### 8. Promociones y descuentos

Las promociones solo operan durante su vigencia y bajo sus condiciones. El descuento por prepago anual, si se aprueba, aplica únicamente a continuidad. **[OWNER_APPROVAL_REQUIRED: autorizar regla de no acumulabilidad con CiberDay u otras promociones.]** Hasta entonces no se combina descuento alguno.

#### 9. Renovación

La activación no se renueva. La continuidad se renueva solo conforme al mecanismo expresamente aceptado. **[OWNER_APPROVAL_REQUIRED: renovación expresa o automática, aviso previo, reajustes, medio de comunicación y rechazo.]** Los servicios de terceros pueden tener períodos y condiciones propios que deben informarse.

#### 10. Suspensión y cancelación

**[OWNER_APPROVAL_REQUIRED: causales, avisos, subsanación, fecha efectiva, pagos devengados, reactivación, datos y efecto sobre publicación.]** Ninguna suspensión debe impedir injustificadamente que el cliente recupere materiales, activos o accesos que le correspondan. Las reglas de devolución para prepago deben aprobarse antes de ofrecerlo.

#### 11. Salida y portabilidad

Al finalizar activación o continuidad, la cotización debe indicar qué materiales, archivos, datos, accesos y credenciales se entregan, formato, plazo, asistencia, costo y exclusiones de terceros. **[OWNER_APPROVAL_REQUIRED: paquete de salida, conservación y eliminación.]** La portabilidad depende de las capacidades y licencias aplicables, que deben explicitarse.

#### 12. Operación sin continuidad

El cliente puede contratar activación sin continuidad. Antes de la entrega se acuerda quién mantendrá publicación, cuenta, dominio, DNS, credenciales, renovaciones, actualizaciones e incidentes. Sin continuidad, ESPACIOS VIRTUALES SpA no asume prestaciones recurrentes no contratadas; se mantienen las obligaciones expresamente aceptadas y las que resulten aplicables.

#### 13. Ampliaciones

Ecommerce, carrito, pagos, agenda, analítica, automatizaciones, integraciones, áreas privadas, sistemas internos, producción fotográfica, redacción extensa y demás necesidades fuera del producto se evalúan y cotizan de manera independiente. Una ampliación no se incorpora a activación o continuidad sin aceptación expresa.

#### 14. Cotización, canal y aceptación

La cotización canónica versionada debe proceder de la autoridad definida por ESPACIOS VIRTUALES SpA. La selección en la interfaz y una conversación de WhatsApp son solicitudes o antecedentes, no una orden ni prueba de pago. WhatsApp puede presentar un mensaje preparado; la persona decide si lo envía.

**[OWNER_APPROVAL_REQUIRED: mecanismo de aceptación, vigencia, `quoteVersion`, `termsVersion`, comprobante, privacidad y custodia.]** Una compra o pago futuro requerirá contratos y adaptadores independientes, además de verificación de servidor.

#### 15. Titularidad y licencias

El cliente conserva su dominio y los materiales que aporta. **[OWNER_APPROVAL_REQUIRED: titularidad o licencia de diseño, código, componentes reutilizables, fuentes, imágenes y demás entregables, además del momento en que opera.]** Nada se presume transferido o licenciado fuera de lo expresamente acordado.

#### 16. Contacto y cambios

Las consultas se dirigen a info@espaciosvirtuales.lat. Toda nueva versión debe indicar identificador, fecha efectiva y tratamiento de cotizaciones ya aceptadas. Un cambio de copy público no modifica por sí solo un contrato vigente.

> **Fin del borrador integral.** La revisión jurídica, tributaria, comercial y operacional es obligatoria antes de publicación.

## 6. Contexto conceptual para escala

Los siguientes nombres son no vinculantes y no constituyen un esquema, endpoint o migración:

| Contexto conceptual | Sentido | Autoridad propuesta | Restricción |
| --- | --- | --- | --- |
| `product` | Uno de `landing`, `catalogo`, `corporativa` | Catálogo canónico del servidor | Requerido; no acepta productos inventados por cliente |
| `experienceProfile?` | Composición editorial, artística o sectorial | Selección validada contra opciones aprobadas | Opcional; nunca producto, plugin o precio autónomo |
| `activationPrice` | Snapshot de precio inicial aplicable | Cotización canónica del servidor | No confiar en importe enviado por navegador o WhatsApp |
| `continuityPlan?` | Plan opcional con cobertura aprobada | Cotización canónica del servidor | Ausencia significa sin continuidad; no inferir servicios |
| `billingCadence?` | Mensual o prepago anual | Cotización canónica del servidor | Solo valores y reglas aprobados |
| `annualDiscount?` | Descuento exclusivo de continuidad | Política versionada del servidor | Opcional; acumulabilidad explícita |
| `quoteVersion?` | Versión de contenido y reglas de cotización | Servidor | No equivale a orden ni pago |
| `termsVersion?` | Versión de términos presentada/aceptada | Servidor y evidencia de aceptación | Debe ser reproducible y fechada |
| `customerSelection?` | Preferencias y materiales seleccionados | Cliente, luego validados | Entrada no autoritativa para precio o cobertura |
| `requestId` | Correlación de solicitud | Servidor | No reutilizar como `orderId`, recibo o evidencia de pago |

Flujo conceptual:

`producto/selección` → `servidor: cotización canónica versionada` → `WhatsApp: adaptador de conversión actual` → `[futuro: adaptador de orden]` → `[futuro: adaptador de pago + verificación]`

- El servidor será la autoridad de una cotización futura, incluidos producto, precios, descuento, cobertura y versiones.
- WhatsApp conserva el envío humano y transporta una conversación; no autoriza importes ni demuestra aceptación, orden o pago.
- Compra y pago son adaptadores futuros separados. Este documento no define API, tablas, estados, transiciones, persistencia, pasarela o schema real.
- El endpoint `/api/activation` y los contextos v2 vigentes no se renombran ni amplían en esta cápsula.

## 7. Pruebas documentales requeridas antes de publicar

Un cambio futuro deberá comprobar, como mínimo:

1. las tres superficies de producto y las rutas dinámicas conservan exactamente tres `ProductSlug`;
2. todos los precios indican sin ambigüedad si pertenecen al Estado A o al H03 aprobado;
3. activación, continuidad y ampliaciones aparecen separadas y los totales de primer año no se presentan como utilidad;
4. descuentos de continuidad no afectan activación y respetan la acumulabilidad aprobada;
5. ningún copy atribuye hosting, SSL, backups, soporte, disponibilidad o portabilidad sin cobertura demostrada;
6. el copy neutral de publicación coincide en datos, portada, comparador, producto, demo, activación y términos;
7. dominio, terceros, cancelación y salida coinciden con los términos versionados;
8. selección manipulada en cliente no altera una cotización canónica del servidor;
9. `requestId`, cotización, orden y pago permanecen conceptos distintos;
10. WhatsApp abre un mensaje revisable y nunca lo envía automáticamente;
11. confirmación de solicitud no se presenta como compra o pago;
12. pruebas de accesibilidad, no-JS, responsive, regresión de campañas y build pasan en la cápsula técnica autorizada.

## 8. OWNER DECISION GATE

Todos los ítems están `PENDING`. No implementar ni publicar mientras alguno que afecte la superficie permanezca abierto.

| Gate | Autorización requerida | Evidencia/artefacto previo | Bloquea |
| --- | --- | --- | --- |
| OD-01 · Modelo económico | Conversión de v0.6 anual a activación única, fecha y transición | C01, C02 y tratamiento de cotizaciones/contratos existentes | Todo copy H03 |
| OD-02 · Precios | Precio de activación y mensualidades por producto | Datos de 3–5 pilotos, contribución revisada y aprobación tributaria | Publicación y cotización |
| OD-03 · Descuento anual | Porcentaje, elegibilidad, reconocimiento, baja/devolución y acumulabilidad | Simulación financiera y cláusula aprobada | Prepago anual y promociones |
| OD-04 · Cobertura | Prestaciones incluidas, responsables, costos y límites | Matriz C01 completada con evidencia operacional | Continuidad |
| OD-05 · Soporte/SLA | Canal, horario, cupo, respuesta, incidentes, backups y disponibilidad | Capacidad operativa y procedimiento probado | Promesas operacionales |
| OD-06 · Terceros y dominio | Titular de cuentas, contratación, tráfico, renovaciones y accesos | Inventario de proveedores y proceso de entrega/salida | Copy de publicación |
| OD-07 · Legal/tributario | Términos, cancelación, portabilidad, propiedad intelectual, IVA y facturación | Revisión jurídica y tributaria del borrador integral | `/terminos` y oferta |
| OD-08 · Copy publicado | Matriz de reemplazos y lenguaje neutral final | Revisión conjunta comercial, legal y operacional | Edición de superficies |
| OD-09 · Cotización canónica | Autoridad, versiones, aceptación, privacidad y retención | Contrato conceptual aprobado; threat/privacy review | Diseño técnico quote/order/payment |
| OD-10 · Pruebas | Matriz de aceptación de la sección 7 | Plan QA y ambientes autorizados | Merge/despliegue futuro |
| OD-11 · Hito siguiente | Alcance de una cápsula técnica separada | Dossier C01+C02+C03 aprobado y SHA fijados | Cualquier implementación |

Resultado actual del gate: **`OWNER_APPROVAL: PENDING`**.

## 9. Lista mínima y ordenada de cambios futuros — no ejecutados

1. Cerrar OD-01 a OD-11 y versionar el dossier aprobado con precios, cobertura, términos y matriz de copy definitivos.
2. Abrir una cápsula técnica separada; revalidar baseline, árbol y contratos antes de editar código.
3. Centralizar las etiquetas aprobadas de etapa/periodicidad y el copy neutral, conservando los tres productos y la fuente de precios autorizada.
4. Alinear, en orden, `products.ts`, portada/comparador, tarjetas, producto, demos consumidoras, selector, activación, confirmación, WhatsApp y `/terminos`.
5. Si se autoriza cotización canónica, diseñar y revisar su contrato de servidor y versionado antes de implementar; mantener separados `requestId`, cotización, orden y pago.
6. Adaptar WhatsApp para transportar únicamente datos canónicos aprobados y conservar el envío humano.
7. Ejecutar las pruebas de la sección 7, revisión jurídica/comercial del resultado y `git diff --check`.
8. Solo con gate técnico y autorización separados, decidir merge y despliegue. El cierre documental H03 no los ejecuta.

## 10. Cierre del dossier documental

C01 propone el contrato y registra prestaciones pendientes; C02 modela escenarios económicos sin aprobarlos; C03 alinea superficies, términos y gate. El dossier queda listo para revisión del owner, no para publicación.

- `TERMS: DRAFT_ONLY`
- `VERCEL_COMMERCIAL_COPY: PROPOSAL_ONLY`
- `QUOTE_ORDER_PAYMENT: CONCEPTUAL_ONLY`
- `WHATSAPP: UNCHANGED`
- `OWNER_APPROVAL: PENDING`
- `PRODUCTION: UNCHANGED`
