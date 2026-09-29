# EVCOM-H01-L05-GATE-V05 · Gate Conversión Asistida · Launch MVP v0.5

```text
CAPSULE=EVCOM-H01-L05-GATE-V05
ATTEMPT=1
STATUS=PASS
BRANCH=feature/evaas-commerce-v04
BASE_SHA=81578c0b6ed0626ba43cd36d64816de34839a1c4
REBASELINE=v0.5-launch-mvp
```

## Rebaseline y método

L05 cierra como conversión asistida: producto y contexto preparan un brief y una referencia efímera; la conversación se entrega cuando la persona pulsa **Enviar** en WhatsApp. No se interpreta el formulario como almacenamiento comercial durable, orden, pago o venta.

Las pruebas autoritativas se ejecutaron sobre una copia limpia del commit base creada con `git archive HEAD` en `/tmp/evaas-l05-gate-v05`. Los cuatro hunks locales externos no entraron a esa copia. No se modificó funcionalidad durante el gate.

## Historia y alcance

Todos los commits indicados son ancestros del HEAD:

| Cápsula | Commit | Ancestry |
| --- | --- | --- |
| L05-C01 | `9cf51ff75a2debb3375b52448301dcbf65fd82f7` | PASS |
| L05-C02 | `cfe2ae50a57e40acec1befbebfa5526a982f826c` | PASS |
| L05-C05 | `b4bf0cdc8579754c36b3f8510ff764af36e1832b` | PASS |
| L05-C06 | `e2e38bfd998c7d510dea3d6868c82e30c5be932b` | PASS |
| L05-C07 | `81578c0b6ed0626ba43cd36d64816de34839a1c4` | PASS |

Según la decisión de propietario incluida en la cápsula del gate, L05-C03 Webpay integrado y L05-C04 automatización de cupón permanecen `DEFERRED_BY_OWNER`. Se trataron como exclusiones acordadas, no como fallos ni trabajo faltante. No se añadió Webpay, PayPal, Orders, PaymentIntent, PaymentTransaction, CommercialState, CRM, webhook, cupón ni persistencia nueva.

## Productos, precio y referencia

El handler del bundle Vercel de producción se ejecutó sin `ACTIVATION_WEBHOOK_URL` para Landing, Catálogo y Corporativa:

| Producto | Neto | IVA | Total IVA incluido | JSON | POST nativo |
| --- | ---: | ---: | ---: | --- | --- |
| Landing Comercial | 99.000 | 18.810 | 117.810 | HTTP 200 PASS | HTTP 303 PASS |
| Catálogo de Productos | 129.000 | 24.510 | 153.510 | HTTP 200 PASS | HTTP 303 PASS |
| Web Corporativa | 149.000 | 28.310 | 177.310 | HTTP 200 PASS | HTTP 303 PASS |

Para cada producto, JSON devolvió solo `ok`, `requestId` y `handoff`, con UUID v4. El brief usó nombre comercial, precio total IVA incluido y referencia completa. Se enviaron `price=1`, `amount=1`, `total=1` y pricing cliente manipulado; el servidor ignoró esos valores y generó el precio contractual. Landing también pasó el ejemplo `Taller Aurora`, `garnet`, `owned` y objetivo indicado.

`requestId`, `handoff.reference`, el contexto comercial persistido y la línea `Referencia` de WhatsApp coincidieron. El servidor es la única fuente de la referencia nueva mediante `crypto.randomUUID()`. Es una referencia efímera de continuidad, no un Order ID, Payment ID, CRM ID ni transaction ID.

## Contexto, selección y formulario

- El `CommercialContext` contiene `product`, pricing contractual, `projectColor`, `coupon=null`, `reference` y `attribution`. La variante persistida omite pricing para derivarlo de nuevo. Ninguna variante incluye proyecto, dominio, contexto ni contacto.
- `GLOBAL_THEME` no forma parte del contexto. El smoke real clickeó dark, light y cyan en Home, Activación y Confirmación: los tokens visuales cambiaron y `CommercialContext` permaneció idéntico.
- Forest, garnet, ocean y null se validaron como colores comerciales. Forest es solo el preview inicial: contexto e input hidden permanecen null/vacío hasta una elección.
- Formulario: `project`, `domainStatus`, contexto opcional, consentimiento desmarcado; controles técnicos `product`, `projectColor`, `formStartedAt` y honeypot `website`. Nombre, email y WhatsApp no están presentes.
- El wizard tiene proyecto/dominio/objetivo en el paso 1 y revisión/consentimiento en el paso 2; la barra tiene dos segmentos. Se conserva el copy de envío C07 “Preparar solicitud”.
- En los tres HTML no-JS se verificaron proyecto, radio de dominio y checkbox como `required`, checkbox no marcado, contexto opcional, submit visible, enlaces legales y ausencia de campos de contacto. La CSS compilada deja `.form-step` visible por defecto; el JavaScript solo aplica ocultamiento después de inicializar el wizard.
- La validación del endpoint rechazó producto, proyecto, dominio, color y consentimiento inválidos. También rechazó JSON nulo/malformado. JSON enhanced rechazó timing insuficiente; el POST nativo válido pasó sin `formStartedAt`.

## Handoff, confirmación y WhatsApp

- El `ActivationHandoff` conserva el schema C06 (`reference`, `product`, `pricing`, `projectColor`, `project`, `domainStatus`, `context`, `createdAt`), sin contacto, teléfono, WhatsApp ni attribution. La llave es `evaas_activation_handoff_v1`, en `sessionStorage`, TTL 60 minutos.
- Se verificaron handoff válido, expiración a 61 minutos, JSON corrupto, pricing inválido, UUID inválido, referencia que no coincide y producto que no coincide. Los inválidos se descartaron sin crash.
- Confirmación dice “Solicitud preparada”, pide continuar por WhatsApp y no afirma recepción. El abandono en esa página no deja claim de caso recibido. `activation_submitted` significa formulario validado/handoff preparado; `activation_completed` significa llegada a confirmación. Ninguno significa lead almacenado, mensaje enviado o venta.
- Los briefs probaron los tres productos, los tres labels de dominio y omisión de la línea Objetivo cuando context está vacío. Inquiry previa genérica no incluye UUID; inquiry contextual deriva producto/precio/color sin referencia.
- La confirmación mostró el CTA solo con referencia/contexto correlacionados. En viewport test se validó `wa.me`, proyecto y UUID completo; el enlace tiene `target=_blank`. No hay autoapertura, `window.open`, envío por servidor ni API de WhatsApp.
- Con `PUBLIC_EV_WHATSAPP` vacío se compiló otra vez: Home y Confirmación mostraron fallback de email y no dejaron enlaces `wa.me` rotos. Con destino configurado, el CTA post-form quedó disponible.
- Tracking usa un allowlist de producto, demo, método, outcome y UUID; no acepta proyecto, contexto, dominio, mensaje, nombre, email, teléfono ni URL WhatsApp. El código no transmite esos campos al dataLayer.

## Seguridad, privacidad y ausencia de pagos

- El honeypot JSON produjo respuesta inocua sin UUID ni handoff; el honeypot nativo redirigió sin `id`.
- Búsquedas en `src`, `.env.example` y dependencias no encontraron webhook, CRM, SMTP, persistencia externa, Webpay, PayPal, checkout, Orders, PaymentIntent, PaymentTransaction, `paid_verified`, EVAAS10 ni motor de cupón.
- CommercialContext conserva `coupon=null`. La captura innecesaria de contacto sigue eliminada.

## Regresiones y visual

- C01: producto/ruta y pricing derivados, persistencia de contexto y color, attribution, UUID; inicialización lee sessionStorage y `popstate` restaura producto/color. PASS por bundle/source audit.
- C02: inquiry genérica y contextual, destino desde `PUBLIC_EV_WHATSAPP`, fallback email y tracking; sin UUID falso antes del formulario. PASS.
- C05: “Empieza y luego crece.” permanece exacto en Home, Confirmación y Footer; las variantes anteriores no aparecen. El color editorial de esa frase no usa el token dorado de CTA. PASS.
- C06/C07: schema, TTL, brief, referencia común, formulario mínimo, POST nativo y confirmación honesta. PASS.
- Themes: dark/light/cyan probados con clic real en Home, Activación y Confirmación; sin cambio del contexto. PASS.
- AOS/HeroVideo: build preserva contenido AOS con fallback visible antes de inicializar; HeroVideo conserva fallback y no genera embed al estar deshabilitado. PASS.
- Chrome midió `document.clientWidth == scrollWidth` y `overflow=false` en Activación y Confirmación con CTA enriquecido visible a 500, 768 y 1440 CSS px. No se encontró overflow crítico.
- Evidencia real de 320/360/390 CSS px queda `CARRIED_TO_L07=true` y es obligatoria antes del release.
- Accesibilidad auditada por HTML/CSS compilados: radios asociados a labels, checkbox requerido sin premarcar, submit y enlace WhatsApp nativos; foco visible general, en radios, selector de color y WhatsApp. No se abren canales automáticamente.

## Build, cambios preservados y cierre

- `npm run build`: PASS con WhatsApp configurado y ausente; 32 archivos Astro sin diagnósticos; 14 rutas.
- `git diff --check HEAD^ HEAD`: PASS.
- La única diferencia local del workspace al iniciar el gate estaba en `Footer.astro`, `BaseLayout.astro`, `index.astro` y `demos/[slug].astro`. Se preservaron sin staging; no forman parte de esta traza ni del archive probado.
- No se realizó merge a develop ni main.

## Decisiones

- L05 cierra como conversión asistida, no como infraestructura de pago.
- WhatsApp es el handoff comercial; la persona revisa y envía el brief.
- `requestId` es una referencia efímera de continuidad, sin persistencia durable.
- C03 Webpay y C04 cupón siguen `DEFERRED_BY_OWNER`.
- H01 no requiere CRM, webhook, pasarela de pago ni sistema de órdenes.
- Validación CSS real a 320/360/390 px sigue obligatoria en L07.
