# EVAAS Commerce v0.4 — marca, contenido e insumos oficiales

Versión contractual: 0.4. Fecha: 2026-09-25. Estado de C04: **PASS**. Fuente interna para L03, L04 y L06. El gate L01 depende todavía del cierre de C01 y C02; este contrato no autoriza iniciar L03 por sí solo.

## Identidad y jerarquía

| Campo | Valor |
| --- | --- |
| `BRAND` | Espacios Virtuales |
| `PRODUCT` | EVAAS Commerce — showroom comercial |
| `PRODUCT_FAMILY` | EVAAS Station |
| `LEGAL_NAME` | ESPACIOS VIRTUALES SpA, confirmado en L01-C01 |

Landing, Catálogo y Web Corporativa son los tres productos de esta versión y sus arquetipos completos de layout. `dark`, `light` y `cyan` son temas globales de la misma aplicación; no son productos, arquetipos ni demos. El color del proyecto es una elección del cliente distinta de ambos.

## URL oficial y canales

| Campo | URL contractual | Estado de verificación |
| --- | --- | --- |
| `OFFICIAL_WEBSITE_URL` | `https://espaciosvirtuales.cl` | Confirmada expresamente por David. |
| `OFFICIAL_RSS` | `explicit-none` | David excluye RSS de EVAAS Commerce v0.4. |
| `OFFICIAL_LINKEDIN_URL` | `https://www.linkedin.com/company/evaas369/` | Confirmada expresamente por David. |
| `OFFICIAL_INSTAGRAM_URL` | `https://www.instagram.com/evaas963/` | Confirmada expresamente por David. |
| `OFFICIAL_FACEBOOK_URL` | `https://www.facebook.com/espaciosvirtuales963/` | Confirmada expresamente por David. |
| `OFFICIAL_YOUTUBE_CHANNEL_URL` | `https://www.youtube.com/@evaas963` | Confirmada expresamente por David para navegación/footer. |

Estas URLs son valores productivos confirmados por el propietario; no se infieren del correo ni se sustituyen por homepages de plataformas. El canal de YouTube acredita navegación/footer, no un video individual para el hero. La fuente contractual de oficialidad es la confirmación expresa de David. RSS no tiene icono, enlace ni placeholder en v0.4.

```text
PUBLIC_EV_YOUTUBE_CHANNEL_URL=https://www.youtube.com/@evaas963
```

## Contrato de configuración por ambiente

La configuración se divide en tres categorías:

| Categoría | Contenido y autoridad |
| --- | --- |
| `PUBLIC_CONFIGURATION` | Datos que pueden renderizarse: sitio, redes, correo comercial, WhatsApp, YouTube, poster y flags de visibilidad. Se resuelven durante build/deploy; un cambio requiere nuevo build y deploy. |
| `SERVER_AUTHORITATIVE_CONFIGURATION` | Precios, cupón, reglas comerciales y estados de órdenes y pagos. El servidor resuelve el precio y valida el cupón antes de autorizar un importe para la pasarela. Ningún valor enviado por el navegador prevalece. |
| `SECRETS` | API keys, secrets, tokens, credenciales, firmas y claves privadas de Webpay u otros proveedores. Permanecen en configuración privada del servidor y nunca llevan prefijo `PUBLIC_` ni valores en Git. |

Los slots públicos del contrato son los siguientes y figuran en `.env.example`. Los destinos sociales confirmados pueden habilitarse en producción; los recursos del hero aceptan contenido demostrativo autorizado:

| Variable | Uso | Valor productivo |
| --- | --- | --- |
| `PUBLIC_EV_SITE_URL` | Sitio oficial | `https://espaciosvirtuales.cl` |
| `PUBLIC_EV_LINKEDIN_URL` | Perfil LinkedIn | `https://www.linkedin.com/company/evaas369/` |
| `PUBLIC_EV_INSTAGRAM_URL` | Perfil Instagram | `https://www.instagram.com/evaas963/` |
| `PUBLIC_EV_FACEBOOK_URL` | Perfil Facebook | `https://www.facebook.com/espaciosvirtuales963/` |
| `PUBLIC_EV_SALES_EMAIL` | Correo comercial público | `info@espaciosvirtuales.lat`, confirmado por David |
| `PUBLIC_EV_WHATSAPP` | Dígitos para construir `wa.me` | `56979959180`, confirmado por David |
| `PUBLIC_EV_YOUTUBE_CHANNEL_URL` | Canal oficial para navegación/footer | `https://www.youtube.com/@evaas963` |
| `PUBLIC_EV_YOUTUBE_VIDEO_ID` | ID de un video individual configurado | Vacío hasta seleccionar contenido de prueba u oficial |
| `PUBLIC_EV_YOUTUBE_VIDEO_URL` | URL del mismo video individual | Vacía hasta seleccionar contenido de prueba u oficial |
| `PUBLIC_EV_YOUTUBE_VIDEO_POSTER` | Poster/fallback local configurable | Vacío hasta crear el asset de prueba en L03/L04 |
| `PUBLIC_EV_LINKEDIN_ENABLED` | Visibilidad de LinkedIn | `true`, con URL oficial confirmada |
| `PUBLIC_EV_INSTAGRAM_ENABLED` | Visibilidad de Instagram | `true`, con URL oficial confirmada |
| `PUBLIC_EV_FACEBOOK_ENABLED` | Visibilidad de Facebook | `true`, con URL oficial confirmada |
| `PUBLIC_EV_YOUTUBE_VIDEO_ENABLED` | Visibilidad del video individual | `false` por defecto hasta configurar URL e ID coherentes |

El teléfono contractual canónico sigue siendo E.164 `+56979959180` en L01-C02. `PUBLIC_EV_WHATSAPP=56979959180` solo contiene los dígitos de la URL derivada `https://wa.me/56979959180`; no sustituye el dato canónico.

En desarrollo e integración se permiten URLs de prueba configuradas por ambiente, por ejemplo `https://example.com`, sin promoverlas como oficiales. En producción, `CONFIGURATION_SLOT_DEFINED=true` y `TEST_VALUE_ALLOWED=true` no implican `PRODUCTION_VALUE_CONFIRMED=true`. Para cada canal, su URL productiva debe estar confirmada antes de habilitarlo. Una URL ausente o un flag deshabilitado oculta el canal; nunca se renderiza `href="#"`, `javascript:void(0)` ni una homepage genérica de red social. El sitio sin flag solo se enlaza si tiene URL productiva confirmada.

`PUBLIC_EV_YOUTUBE_CHANNEL_URL` puede alimentar el enlace de navegación/footer sin habilitar el hero. `PUBLIC_EV_YOUTUBE_VIDEO_ENABLED=true` requiere ID y URL coherentes de un video individual configurado; de lo contrario no se renderiza el embed. El video de prueba debe identificarse como demostrativo y no como video oficial EVAAS. El poster se usa solo si apunta a un recurso local autorizado y disponible. El fallback CSS estático mantiene hero, texto y CTA aunque falten video y poster. El embed sigue sujeto a autoplay silencioso, `playsinline` y movimiento reducido.

No se crean `PUBLIC_LANDING_PRICE`, `PUBLIC_CATALOG_PRICE`, `PUBLIC_CORPORATE_PRICE`, `PUBLIC_COUPON_VALUE`, `PUBLIC_PAYMENT_STATUS` ni variables públicas que contengan credenciales Webpay. El flujo futuro será: cliente envía selección; servidor resuelve precio, valida cupón y determina importe; pasarela recibe ese importe autorizado; servidor verifica el pago. C04 define los slots; L03/L06 implementarán su consumo después del gate. No se construye CMS, endpoint de configuración, panel ni base de datos para enlaces en v0.4.

## Medio del hero

| Campo | Valor |
| --- | --- |
| `HERO_VIDEO_CONTENT` | `test-content-authorized`; no se exige video oficial individual en v0.4 |
| `HERO_POSTER_MODE` | `local-test-asset`; L03/L04 podrán crear el recurso, C04 no lo crea |
| `PUBLIC_EV_YOUTUBE_VIDEO_ID` | Vacío por defecto; ID del video individual seleccionado, derivado de su URL |
| `PUBLIC_EV_YOUTUBE_VIDEO_URL` | Vacía por defecto; URL individual de prueba u oficial, nunca la URL del canal |
| `PUBLIC_EV_YOUTUBE_VIDEO_POSTER` | Vacío por defecto; ruta del fallback local cuando L03/L04 lo creen |
| `PUBLIC_EV_YOUTUBE_VIDEO_ENABLED` | `false` por defecto |
| `VIDEO_DESKTOP_BEHAVIOR` | Embed de YouTube como pieza visual del hero, con área de proporción reservada; `autoplay=true`, `muted=true`, `playsinline=true` y `loop` solo cuando el embed y el ID lo permitan. Copy y CTA siempre legibles. |
| `VIDEO_MOBILE_BEHAVIOR` | Priorizar poster estático y mensaje/CTA; no exigir descarga ni reproducción automática del video. |
| `VIDEO_REDUCED_MOTION_BEHAVIOR` | Mostrar poster estático; no iniciar autoplay ni animación decorativa. |
| `VIDEO_FAILURE_FALLBACK` | Mostrar poster autorizado; si tampoco carga, conservar un fondo CSS estático con copy y CTA utilizables. |

Con video configurado y habilitado se podrá renderizar el embed. Con video deshabilitado, ausente o fallido se mostrará el poster local de prueba; si aún no existe el archivo o también falla, se conserva el fondo CSS estático. No habrá audio automático ni controles de YouTube dominantes. El video jamás será necesario para comprender la oferta. `public/assets/evaas-symbol.webp` es un símbolo local, no el poster del hero. Un video oficial futuro podrá reemplazar al de prueba por configuración sin cambiar la arquitectura.

El contenido visual y multimedia de prueba puede servir para hero, poster, imágenes, textos, cards y logos ficticios de demos. Debe identificarse como demostrativo, no presentar terceros como clientes ni inventar métricas o resultados. No interviene en precio, cupón, pago ni identidad legal. Su sustitución se hará mediante configuración o assets de las cápsulas de implementación.

## Temas globales

```text
GLOBAL_THEMES=dark,light,cyan
DEFAULT_THEME=dark
THEME_PERSISTENCE=local
NO_JS_THEME=dark
```

`dark` es la experiencia sobria principal de alto contraste; `light` es la versión luminosa de la misma arquitectura; `cyan` es la interpretación más tecnológica y energética. El tema elegido se conserva en almacenamiento local. Si no hay JavaScript, no hay preferencia guardada o el valor guardado es inválido, se presenta `dark`.

Cambiar tema altera coherentemente fondo, superficies, texto, bordes, navegación, tarjetas, botones, demos, footer y estados interactivos. No altera producto, precio, estructura funcional, contenido contractual, referencia ni color del proyecto. Los tres temas deben conservar contraste de texto esencial y foco visible; la verificación visual final corresponde a L03/L07.

## Color del proyecto

`PROJECT_COLOR` contextualiza la futura activación del cliente y viaja después en el contexto comercial. No es `GLOBAL_THEME`, no cambia el tema de EVAAS Commerce ni altera el precio o el producto. La paleta contractual es cerrada:

| Valor semántico | CSS | Texto sobre la muestra |
| --- | --- | --- |
| `forest` — verde bosque | `#224A36` | `#FFFFFF` |
| `garnet` — granate | `#722F37` | `#FFFFFF` |
| `ocean` — azul profundo | `#003E6B` | `#FFFFFF` |

Estas opciones toman colores ya presentes en el estilo de las demos y la identidad visual actual. En una muestra sólida con texto blanco, los contrastes calculados son aproximadamente 10,00:1, 9,65:1 y 11,04:1 respectivamente. El control de selección debe mostrar nombre y estado además del color, y permanecer legible en `dark`, `light` y `cyan`. No se admite un selector hexadecimal libre.

## Dorado EVAAS

El dorado existente `#D4AF37` señala valor o acción comercial; no es un color editorial general. Solo se autoriza en CTA principal, promoción/cupón, selección comercial activa, avance confirmado o una señal puntual de valor. Nunca será el único indicador de estado: texto, forma o icono acompañarán la señal. No se usará de forma sistemática en títulos, subtítulos, eyebrows, separadores decorativos ni texto corriente.

La búsqueda inicial detectó dorado en `src/styles/global.css` para índices de confianza, avisos y otras marcas pasivas, además de `public/favicon.svg`. Son usos actuales que L03-C03 deberá revisar; C04 no modifica esos archivos.

## Demos de arquetipos completos

Los sectores ya representados en `src/data/products.ts` y `src/components/DemoPreview.astro` son suficientes para diferenciar los tres arquetipos. El contenido siguiente es **demostrativo y ficticio**: no acredita clientes reales, reservas, stock, métricas, proyectos ejecutados ni resultados. La versión pública debe identificarlo como ejemplo. Los nombres de muestra actuales (`Lumen Café`, `Noma Objetos`, `Arista Ingeniería`) son etiquetas heredadas y no se presentan como clientes de Espacios Virtuales; si coinciden con marcas reales, deberán sustituirse antes de publicar las demos completas.

| Producto / sector | Recorrido estructural mínimo | Contenido demostrativo suficiente |
| --- | --- | --- |
| Landing / cafetería de especialidad | Header, hero, propuesta de valor, beneficios o servicios, respaldo descriptivo, sección visual, CTA y footer. | Mensaje actual «Café lento. Ideas despiertas.»; origen y carta, propuesta de pausa y café, selección ilustrativa de bebidas, proceso de preparación, visita/contacto. El CTA es una interacción de muestra, no una reserva operativa. |
| Catálogo / objetos de diseño y hogar | Header, hero, categorías o filtros visuales, grilla/listado, fichas, detalle contextual, CTA y footer. | Categorías Mesa y Textil; piezas de muestra como Fuente Sur, Manta Bruma, Vaso Piedra y Cojín Origen; material, descripción breve y consulta. Sin carrito, stock ni checkout. |
| Web Corporativa / servicios técnicos e ingeniería | Header, hero, Empresa, capacidades o Servicios, proyectos o experiencia descriptivos, confianza, Contacto/CTA y footer. | Mensaje actual «Ingeniería que sostiene decisiones.»; diagnóstico, diseño, coordinación y forma de trabajo; casos narrativos expresamente ficticios sin cifras, certificaciones ni clientes atribuidos. Sin intranet ni integraciones. |

Las demos muestran primero el layout completo y después permiten explorar detalles. El color del proyecto cambia acentos de la representación, no la estructura ni el arquetipo. Las interacciones visuales no deben aparentar funciones de pago, reserva o consulta realmente conectadas.

## Movimiento

L03/L04 podrán usar AOS o una utilidad de animación ligera aprobada para el hito; esta cápsula no instala biblioteca. Las entradas breves pueden reforzar jerarquía y recorrido, sin movimiento constante ni cadenas largas. Precios, condiciones, controles, formularios y contenido esencial permanecen visibles y operables sin JavaScript. Con `prefers-reduced-motion: reduce`, las animaciones se eliminan o reducen sin ocultar contenido ni bloquear interacción.

## Fallbacks obligatorios

| Condición | Comportamiento |
| --- | --- |
| Video indisponible | Poster autorizado; si falla, fondo CSS estático con copy y CTA. |
| JavaScript ausente | Tema `dark`; contenido, demos y navegación comprensibles. |
| Almacenamiento de tema vacío o inválido | Tema `dark`. |
| URL social ausente | No publicar el enlace. |
| RSS | Fuera del alcance de v0.4; no publicar icono, enlace ni placeholder. |
| Medio de demo ausente | Composición visual local que conserva estructura y texto. |
| Movimiento reducido | Suprimir o reducir animaciones y autoplay decorativo. |

No se publicarán enlaces vacíos, `#` ni URLs de prueba como si fueran canales oficiales. La experiencia pública sigue sin cambios en C04; la implementación corresponde a L03/L04/L06 tras el gate L01.

## Cierre de L01-C04

Los canales oficiales requeridos para v0.4 están confirmados y RSS se excluyó expresamente. David autorizó video y poster de prueba sustituibles. La selección de un video individual, su proporción y la creación del asset local se hacen en L03/L04, sin declararlos oficiales. C04 queda cerrada como contrato; el gate L01 aún depende de C01 y C02.
