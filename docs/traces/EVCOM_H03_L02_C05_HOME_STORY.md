# EVCOM H03-L02-C05 · Narrativa comercial de inicio

**Fecha:** 2026-10-31 (`America/Santiago`)

**Rama:** `feature/evcom-h03-l02-comercial`

**BASE_SHA:** `c8f8b18d3c0d2fa2b9691b85d2b2eef4bd4b7874`

**C04B:** `V3_RUNTIME_PASS` en la base; el endpoint interno continúa cerrado por defecto y no está conectado al recorrido público.

## Trazabilidad de copy

| sección | copy previo | copy nuevo | fuente/justificación | público hoy o gated | prueba |
| --- | --- | --- | --- | --- | --- |
| Hero · propuesta | «Activación Digital»; «Presencia digital profesional desde el primer día»; «Elige una base, visualiza y activa fácil». | «Una presencia digital que puede crecer contigo»; presenta tres formas de mostrar el proyecto y una solicitud asistida. Atributos: «Claro · Simple · Evolutivo». | Objetivo C05; decisión comercial C01A y neutralidad C02. Distingue producto, proveedor y tecnología. | Público hoy; no implica compra ni prestación automática. | Build; copy presente en HTML prerenderizado; capturas desktop 1440×1000 y móvil 500×844. |
| Hero · CTA | «Ver ejemplos» y «Encontrar mi opción». | «Explorar productos» lleva a `#precios`; «Encontrar mi opción» conserva `#elegir`. El panel sigue enlazando a productos y precios. | Recorrido actual de selección; no se añadió un checkout ni un nuevo destino. | Público hoy. | IDs y hrefs presentes; fichas de activación y rutas actuales responden 200 tras redirección canónica. |
| Hero · repetición de importe | «Desde $120.000 · Valor final · boleta o factura» y nota de costos externos junto al panel que ya lista los productos. | Se retiró la fila repetida del hero. El importe que deriva del catálogo canónico permanece en el panel de productos y en las superficies existentes. | Revisión visual móvil: la nota repetida quedaba debajo del área del botón flotante; consolidar el importe reduce ruido y evita superposición. No se cambió ningún valor, período, SKU ni términos. | Público hoy; economía v0.6 sin cambios. | Capturas responsive; `src/data/products.ts` y `/terminos` sin cambios. |
| Recorrido · Activa | «Compras un resultado»; cinco pasos de selección, materiales, construcción, revisión y preparación. | «Elige Landing, Catálogo o Web Corporativa y revisa su alcance. Hoy puedes preparar una solicitud asistida; enviarla no confirma una compra ni un pago». | Flujo existente de `/activar/[slug]`: prepara una solicitud y WhatsApp revisable; no hay compra ni pago directo en C05. | Público hoy. | Rutas de activación 200; cambios no incluyen API, WhatsApp ni handoff. |
| Recorrido · Mantén | No había una etapa de continuidad. | «El período contratado y sus condiciones siguen los términos vigentes. La renovación anual es opcional y se informa antes del siguiente período». | `/terminos` v0.6, «Renovación anual y capacidades posteriores». Usa la condición anual vigente sin anunciar modalidades mensuales ni el prepago anual H03. | Público hoy, limitado a v0.6. | HTML de `/terminos` conserva versión 0.6, período de doce meses y valores actuales. |
| Recorrido · Amplía | «Agenda, pagos, analítica o nuevas capacidades se evalúan solo cuando exista una necesidad real». | «Nuevas funciones, integraciones y otros alcances se evalúan y cotizan por separado; no se incluyen por defecto». | Alcance y exclusiones vigentes en `/terminos` v0.6; evita presentar capacidades futuras como incluidas. | Público hoy. | Copy visible en HTML; términos v0.6 sin cambios. |
| Fundamento · Control | «El dominio lo compras y conservas tú»; conexión sujeta a cotización. | Sin cambio sustantivo. Se conserva la titularidad del dominio del cliente y la conexión solo si la cotización la incluye. | `/terminos` v0.6 y contrato de copy vigente. | Público hoy. | La tarjeta continúa en la portada; términos v0.6 sin cambios. |
| Fundamento · Claridad | Alcance, límite de contenido, revisión, exclusiones y posibles costos externos antes de activar. | Sin cambio sustantivo. | `/terminos` v0.6; conservar la transparencia existente. | Público hoy. | La tarjeta continúa en la portada. |
| Fundamento · Entrega | «Recibes una base responsive»; publicación y conexión sujetas a cotización. | «Conoces el resultado acordado»; entrega, aceptación y preparación para publicación dependen del alcance confirmado. | C02: no hay evidencia operacional suficiente para prometer publicación de sitios de clientes; se conserva la redacción neutral «Preparación para publicación según la cotización». | Público hoy. | Búsqueda en la portada prerenderizada: sin proveedor tecnológico ni promesas de publicación no verificadas; conserva solo la preparación según cotización. |
| Fundamento · Evolución | Agenda, pagos, analítica u otras capacidades se evalúan cuando exista necesidad real. | Funciones e integraciones se evalúan y cotizan aparte; no se incluyen automáticamente. | `/terminos` v0.6 y límite de alcance aprobado para C05. | Público hoy. | Tarjeta presente; no se agregó producto ni SKU. |
| Fundamentos · jerarquía | Cuatro tarjetas con h3 sin título de sección propio. | Las mismas cuatro tarjetas quedan bajo un h2 accesible no visual. | Mantiene una jerarquía h1 → h2 → h3 sin sumar una segunda cuadrícula ni otra cabecera visual. | Público hoy. | HTML prerenderizado: un h1 principal y estructura de secciones; enlaces con destino. |
| CTA final | «Empieza y luego crece»; «Elegir mi opción». | Se conserva el lema; el texto indica que la solicitud se revisa antes de enviarla y el CTA lleva a `#precios`. | Aclara el paso actual y conduce a productos existentes. | Público hoy. | `#precios` existe; CTA y rutas de activación disponibles. |
| Estructura preparada para H03 | Sin secuencia «Activa · Mantén · Amplía». | La secuencia coloca el punto de entrada, continuidad y ampliaciones en posiciones estables. El copy público de «Mantén» describe solo la renovación anual de v0.6; no expone montos ni cobertura H03. | Preparación narrativa para C05 sin crear un mecanismo de publicación ni usar textos ocultos. Los términos H03 mantienen `DRAFT_NOT_FOR_PUBLICATION`. | Estructura visible hoy; cualquier copy económico H03 permanece gated hasta el release de términos aplicable. | Búsqueda en `.vercel/output/static`: sin $19.900, $24.900, $29.900 ni sus importes anuales; `/terminos` público sigue en v0.6. |

## Evidencia del gate

```text
CAPSULE: EVW-EVCOM-H03-L02-C05
GATE: HOME_STORY_PASS
HERO: COHERENT
ATTRIBUTES: CLARO_SIMPLE_EVOLUTIVO
JOURNEY: ACTIVA_MANTEN_AMPLIA
FOUNDATIONS: CONTROL_CLARIDAD_ENTREGA_EVOLUCION
PRODUCTS: LANDING_CATALOGO_CORPORATIVA_ONLY
CTA: PREPARE_REQUEST_NOT_PURCHASE
PUBLIC_TERMS: V0_6_UNCHANGED
H03_ECONOMIC_COPY: NOT_PUBLIC_UNTIL_RELEASE_GATE
PUBLICATION_PROVIDER: NEUTRAL
API_AND_HANDOFF: UNCHANGED
BUILD: PASS
SMOKE: PASS
OWNER_PUBLICATION_GATE: NOT_BYPASSED
```

- `npm run build`: PASS; 42 archivos Astro, 0 errores, 0 advertencias y 0 hints.
- `npm run test:commercial`: PASS (11/11; reglas, contratos V3, solicitud WhatsApp preparada y gate cerrado por defecto).
- `npm run test:commercial:v3-runtime`: no completó. La ejecución sandbox recibió `EPERM` al abrir un socket local; el reintento autorizado detectó un servidor Astro ya presente en `localhost:4322` y salió antes de iniciar el smoke. No se declara un resultado HTTP nuevo de C04B.
- Smoke HTTP del build estático: PASS (200 tras redirección canónica) para `/`, las tres rutas `/activar`, las tres `/productos`, las tres `/demos`, `/terminos`, `/confirmacion` y `/privacidad`.
- Anclas: `#precios`, `#comparar`, `#elegir` y `#showroom` tienen destino en la portada; los CTAs a selección conservan las rutas existentes.
- Familias: la portada prerenderizada muestra únicamente `landing`, `catalogo` y `corporativa`. `src/data/products.ts` no se modificó.
- Contrato público: `/terminos` prerenderizado conserva v0.6, contratación anual de doce meses y $120.000/$160.000/$180.000. No hay copy H03 mensual o de activación única en el HTML público.
- Responsive: revisión visual desktop 1440×1000 y móvil 500×844; la portada no muestra desbordamiento horizontal ni superposición del CTA flotante en esas vistas. El navegador headless del entorno tiene un viewport efectivo mínimo de 500 CSS px; no se declara verificación a 320 CSS px.
- Accesibilidad: revisión estática de jerarquía, orden semántico, destinos de enlaces y estilos `:focus-visible`; prueba de tabulación real y medición numérica de contraste no ejecutadas en este entorno.
- Proveedor: búsqueda en el HTML público de la portada sin «Vercel», hosting ni afirmaciones de publicación no verificadas. La frase neutral de preparación según cotización permanece.
- API y handoff: los cambios se limitan a la portada y estilos; no se modificaron `/api/activation`, el runtime V3, WhatsApp ni sus contratos.
- `git diff --check`: PASS antes del commit.

## Pendientes para C06–C11

- **C06:** etiquetas de tarifas, tarjetas y comparador para hacer explícita la lectura económica sin alterar los términos v0.6 hasta la transición aprobada.
- **C07:** alcance detallado e inclusiones/exclusiones en fichas y demos, si corresponde a su cápsula.
- **C08:** términos públicos H03, fecha efectiva, condiciones de continuidad y revisión legal/tributaria antes de publicación.
- **C09–C10:** selector y handoff solo dentro del recorrido y release autorizados; no conectar el runtime V3 interno en C05.
- **C11:** transición y publicación H03 sujeta al gate del owner; no se bypassó ni se creó una previsualización alternativa.

`HOME_STORY_PASS` certifica la narrativa de inicio y su compatibilidad con la oferta pública v0.6 en esta cápsula. No habilita la publicación integral de H03.
