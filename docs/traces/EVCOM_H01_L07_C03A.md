# EVCOM-H01-L07-C03A · Afinación de conversión asistida

## Disposición

- Owner amendment: `OWNER_AMENDMENT`.
- Base: `588b2c27e1003345a868bfebc35d81d75f1601a1` en `feature/evaas-commerce-v04`.
- Implementación y validación en clone temporal limpio `/tmp/evcom-h01-l07-c03a-work`; el worktree principal no fue modificado.
- Alcance funcional: selector asistido, categoría del proyecto, API/handoff, apertura de WhatsApp, confirmación, privacidad y consentimiento.
- No se agregaron productos, precios, dependencias, persistencia durable ni envío automático.

## Selector

- Se mantienen tres preguntas. La tercera pregunta pide la función conectada y ofrece `none`, `ecommerce` e `integration`.
- `none` conserva la recomendación contractual desde las dos primeras respuestas: Landing Comercial ($117.810 IVA incluido), Catálogo de Productos ($153.510) y Web Corporativa ($177.310), con su CTA de activación.
- Resultado asistido probado con Catálogo + ecommerce y Corporativa + integración. Ambos muestran el copy de evaluación, el arquetipo inferido y una acción explícita para conversar. El reset devuelve a la primera pregunta.
- Los mensajes centrales `buildAdvancedNeedMessage()` y `buildWhatsAppUrl()` generan el brief sin referencia, datos personales, categoría, orden ni pago. El resultado solo registra `selector_completed` con `ecommerce_assisted` o `integration_assisted`.
- Con WhatsApp no configurado, el resultado ofrece el correo comercial configurado; no muestra un enlace WhatsApp roto.

## Categoría, API y handoff

- Fuente única tipada: `src/data/project-categories.ts`; enum de siete categorías con etiquetas humanas y `isProjectCategory()`.
- El select requerido se muestra en el paso 1 de las tres activaciones entre nombre y dominio. La revisión presenta la etiqueta humana. El consentimiento sigue requerido y desmarcado inicialmente.
- API: categoría ausente o fuera del enum devuelve 400; categoría válida devuelve 200 y un handoff V1 con el slug canónico.
- Compatibilidad V1: handoff antiguo sin propiedad `projectCategory` se acepta y normaliza a `null`; categoría válida se acepta; categoría presente inválida se rechaza. Las solicitudes nuevas exigen una categoría válida.
- `buildActivationHandoffMessage()` incluye etiqueta de categoría, producto, precio IVA incluido, color, proyecto, dominio, objetivo cuando exista y referencia UUID completa.
- Los eventos de analítica solo reciben campos permitidos (`product`, `outcome`, `request_id`, `mode`, entre otros ya existentes); categoría, proyecto, contexto, dominio y brief quedan excluidos.

## Apertura automática y fallos

- Con WhatsApp configurado, el submit válido abre `about:blank` de forma síncrona antes del primer `await`. Tras API PASS valida UUID y handoff devueltos por servidor, guarda el handoff de sesión y construye la URL mediante `getWhatsAppConfig()`, `buildActivationHandoffMessage()` y `buildWhatsAppUrl()`.
- Chrome verificó la navegación de la ventana secundaria a WhatsApp y la navegación de la pestaña EVAAS a `/confirmacion?producto=landing&id=<uuid>&wa=opened`. El brief incluyó categoría y UUID completo; no se ejecutó ni simuló el botón Enviar. La confirmación conserva referencia corta y CTA de reapertura.
- Popup bloqueado: simulación de `window.open() => null`; API PASS conservó referencia, navegó a confirmación `wa=blocked` y mostró el CTA manual.
- API 500 simulada: el formulario permaneció abierto, el botón volvió a habilitarse y se mostró el error. La pestaña preabierta se cierra desde el manejador de error. El único error de consola fue el 500 deliberado del harness (`EXPECTED_EXTERNAL_TEST_FAILURE`); sin `pageerror`.
- WhatsApp sin configurar: API PASS llevó a confirmación `wa=unavailable`, presentó email y no mostró botón WhatsApp. Conteo de pestañas CDP: 2 antes / 2 después; no se abrió pestaña vacía.
- Si el popup está bloqueado, la API igualmente puede completar la preparación. Un problema al formar el canal conserva la referencia y deriva a estado recuperable.
- No hay API de envío, auto-click, simulación de teclado ni envío en segundo plano. El usuario revisa y pulsa Enviar.
- Sin JavaScript, el formulario nativo mantiene POST y respuesta 303 a confirmación con referencia; el CTA manual es la alternativa aceptada.

## Privacidad, consentimiento y analítica

- `/privacidad` informa la categoría, el intento de apertura automática en pestaña/ventana separada, el envío manual por el usuario, la alternativa si el navegador bloquea popups y que ver la confirmación no implica envío.
- Copy de consentimiento alineado con preparar la solicitud y abrir WhatsApp para que el usuario decida enviar; requerido, sin marcar por defecto y sin finalidad de marketing.
- `activation_submitted` significa formulario validado y handoff preparado; `activation_completed` significa confirmación vista. `whatsapp_post_form_opened` permite `mode=automatic|fallback` y producto solamente.

## Validaciones ejecutadas

- Harness: `astro dev` en `http://127.0.0.1:4329` con WhatsApp de prueba configurado y `http://127.0.0.1:4330` sin WhatsApp; Chrome headless 137.0.7151.55 mediante CDP (`9222`). Se usó el harness existente y sin instalar dependencias.
- API JSON: categoría ausente 400, categoría manipulada 400, categoría válida 200.
- Selector: estándar Landing, Catálogo y Corporativa; asistido ecommerce e integración; arquetipo contextual correcto, sin referencia en brief.
- Handoff: compatibilidad V1 antigua/nueva e inválida comprobada; mensaje de activación comprobado con categoría humana y UUID completo.
- Responsive: Home, las tres activaciones, confirmación y privacidad en 320×568, 390×844 y 1440×900 (18 combinaciones); `scrollWidth == clientWidth` en todas, sin overflow horizontal. El select queda visible y requerido en las tres activaciones.
- Sin JS + reduced motion: `/activar/landing` a 320×568 conservó categoría visible/requerida, POST nativo, formulario y `scroll-behavior:auto`, sin overflow.
- `npm ci`: PASS.
- `npm run build`: PASS; Astro 0 errores, 0 warnings, 14 rutas.
- `npm audit --omit=dev --audit-level=high`: PASS, 0 vulnerabilidades.
- `npm audit --audit-level=high`: PASS, 0 vulnerabilidades.
- `npm ls path-to-regexp --all`: resuelve `6.3.0` (marcado overridden en el árbol existente; no se modificó override ni dependencia).
- `git diff --check`: PASS.
- Errores de aplicación: 0; error intencional del API 500 aislado como se describe arriba.

## Preservación

El worktree principal permaneció en `d79d9300eb0d16f473991b16fcc683133968d12c` y no fue actualizado. Se registraron y preservaron estos cinco cambios externos locales conocidos:

- `src/components/Footer.astro`
- `src/components/Header.astro`
- `src/layouts/BaseLayout.astro`
- `src/pages/demos/[slug].astro`
- `src/pages/index.astro`

Los scripts `.c03a-*.mjs`, `.env` de harness y demás evidencia temporal permanecen fuera del staging y no forman parte de los commits.

## Pendiente

- Verificación del navegador LinkedIn: `MANUAL_REQUIRED`.
- Conversión E2E definitiva: EVCOM-H01-L07-C04.
