# EVCOM-H01-L06-C01 — Integrar confianza y condiciones

**Estado:** PASS
**Base:** `e3c2137ce3887ea04c098ee2fda55e31d31789ef`
**Rebaseline:** Launch MVP v0.5

## Fuentes contractuales

Se usaron `docs/contracts/commerce-v04/pricing-legal.md`, `brand-content.md` y `README.md`, junto con el flujo v0.5 documentado en H01. No se redefinieron condiciones ni se atribuyó una revisión legal externa.

## Términos y alcance comercial

- Se hizo visible la versión 0.4 y la fecha contractual 25 de septiembre de 2026.
- Se publicó la identidad autorizada: ESPACIOS VIRTUALES SpA, RUT 78.428.352-6 y `info@espaciosvirtuales.lat`.
- Se alinearon los nombres de Landing Comercial, Catálogo de Productos y Web Corporativa; los valores publicados muestran neto, IVA 19 % y total IVA incluido: $117.810, $153.510 y $177.310, respectivamente. Los valores de `src/data/products.ts` ya coincidían y no se modificaron.
- Se documentaron branding básico, estructura por producto, diseño responsive, CTA/contacto, publicación inicial en cuenta o plan compatible, conexión del dominio y una revisión consolidada.
- Se especificaron los límites contractuales: Landing de una página y hasta seis secciones; Catálogo de hasta doce ítems; Corporativa con Inicio, Empresa, Servicios y Contacto.
- Se mantuvo que el cliente entrega textos, datos, identidad disponible y materiales necesarios. El dominio lo compra y conserva el cliente; Espacios Virtuales realiza la conexión y la compra no está incluida.
- Se aclaró que un plan pagado u otro costo externo necesario se informa antes de contratarlo. Se conservaron las exclusiones y la evaluación/cotización separada de capacidades posteriores; la continuidad no es obligatoria.
- Se eliminó la referencia a una confirmación de compra. No se agregaron reglas de renovación, transferencia, propiedad intelectual, reembolsos, garantías, SLA, plazos, soporte ni resultados.

## Privacidad y consentimiento v0.5

- Se eliminó la descripción obsoleta de nombre de contacto, correo y teléfono. La página describe proyecto/negocio, estado del dominio, contexto opcional, producto, color si fue elegido y referencia temporal.
- Se explicó que producto, precio contractual, color y referencia preparan el contexto para WhatsApp; la atribución de origen, medio y campaña sirve para medir el recorrido, sin afirmar identificación personal.
- La explicación de analítica excluye proyecto, contexto, dominio, mensaje WhatsApp, nombre, correo y teléfono. El código limita los eventos a dimensiones permitidas y no toma campos del formulario para esos eventos.
- Se explicó el uso temporal en la sesión del navegador, el vencimiento del brief a los 60 minutos y que el formulario no crea cuenta, orden ni registro CRM permanente.
- Se aclaró que el envío comercial ocurre cuando la persona revisa y envía el mensaje en WhatsApp; abandonar antes puede significar que Espacios Virtuales no recibió la solicitud. WhatsApp se identifica como canal externo y no se hacen afirmaciones sobre sus políticas internas.
- Se publicó versión 0.4 de esta página con fecha de actualización 29 de septiembre de 2026, distinta de la fecha contractual de los términos.
- El consentimiento ahora nombra WhatsApp, conserva ambos enlaces legales y sigue `required` y sin marcar por defecto. No autoriza marketing.

## Confianza, diferidos y navegación

- Se reemplazó en Home “Sin costos escondidos en la activación” por “Los costos externos, si corresponden, se informan antes”, sin convertir la Home en documento legal.
- Las páginas de producto ya mostraban precio IVA incluido, alcance, dominio, revisión y costos externos; no fue necesario duplicar secciones ni cambiar precios.
- Términos y privacidad tienen enlaces recíprocos y retorno al showroom. No se añadió una condición activa de cupón ni se mostró `EVAAS10`.
- Webpay, PayPal y checkout continúan diferidos a H02; automatización de cupón continúa diferida por el propietario. No se añadió pago, CRM, RSS ni canales sociales del footer.
- La frase exacta “Empieza y luego crece.” se conserva en Home, confirmación y footer. No se modificó el uso editorial del dorado.

## Verificación

- Búsquedas de los claims de privacidad obsoletos, persistencia falsa y términos prohibidos: sin coincidencias en las páginas activas revisadas.
- La revisión del tracking confirmó que no se envían campos del brief en eventos; WhatsApp tampoco lleva atribución. Se documentan las dimensiones permitidas del recorrido, no como registro de lead.
- Chromium headless verificó términos, privacidad y activación en viewports CSS de 500, 768 y 1440 px con temas dark, light y cyan. `scrollWidth` no superó `innerWidth` en ninguna combinación. Los enlaces legales de retorno aparecen en ambas páginas legales; el checkbox se encontró requerido y sin marcar.
- La lectura visual confirmó texto legible y wrapping correcto en 500, 768 y 1440 px. Evidencia real de 320/360/390 px queda expresamente para L07.
- `npm run build`: PASS, 14 rutas, 0 errores, 0 warnings.
- `git diff --check`: PASS.

## Cambios locales preexistentes preservados

Se mantuvieron fuera del alcance y del staging los hunks locales previos en `src/components/Footer.astro`, `src/layouts/BaseLayout.astro`, `src/pages/demos/[slug].astro` y los cambios editoriales preexistentes en `src/pages/index.astro`. En Home solo se incorpora además el hunk contractual descrito arriba sobre costos externos.

## Decisión

L06-C01 consume los contratos cerrados de Commerce v0.4. La privacidad se alinea al formulario mínimo de v0.5; el formulario prepara la solicitud y WhatsApp realiza el handoff. Cupón automatizado y pagos siguen diferidos. No se inventan políticas comerciales o legales.
