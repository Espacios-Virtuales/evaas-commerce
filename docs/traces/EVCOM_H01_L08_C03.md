# EVCOM-H01-L08-C03 · Smoke productivo final y cierre H01

- Estado: `PASS`
- Producto: EVAAS Commerce · H01 Launch MVP v0.5
- Fecha: 2026-10-05
- Rama de esta traza: `develop`
- SHA productivo validado: `c4557ff32d05ca50f018c31665bf7af398ba420a`
- Deployment: `dpl_4u1UGJc2hJBLaWsvVy8jBLBk8o6M` (`READY`, `production`)
- URL del deployment: https://evaas-commerce-pide1e2n7-davids-projects-2b733fec.vercel.app
- Alias productivo: https://evaas-commerce.vercel.app
- Proyecto Vercel: `evaas-commerce` (`prj_g9P3dYb61ztlCFix0wM2olpxbY9J`), equipo `David's projects`
- Repositorio/rama/SHA reportados por deployment: `Espacios-Virtuales/evaas-commerce` / `main` / `c4557ff32d05ca50f018c31665bf7af398ba420a`
- Deployment Protection: ON

## Smoke productivo

Se consultó el deployment protegido por su URL exacta. Las rutas siguientes respondieron HTTP 200, con contenido no vacío y sin página de error Astro/Vercel:

`/`, `/productos/landing`, `/productos/catalogo`, `/productos/corporativa`, `/demos/landing`, `/demos/catalogo`, `/demos/corporativa`, `/activar/landing`, `/activar/catalogo`, `/activar/corporativa`, `/confirmacion`, `/terminos`, `/privacidad`.

Comprobaciones de contenido:

- Los tres productos y el cierre “Empieza y luego crece.” están presentes.
- Totales anuales con IVA incluido: Landing Comercial $117.810; Catálogo de Productos $153.510; Web Corporativa $177.310. Los netos son $99.000, $129.000 y $149.000; términos especifica IVA de 19 %. No aparecen los precios antiguos como precios base vigentes.
- El selector conserva la ruta estándar de tres productos y la evaluación asistida para ecommerce/pagos e integraciones; no ofrece un producto ecommerce base.
- Las tres páginas de activación incluyen categoría, estado de dominio, contexto opcional, consentimiento requerido y no preseleccionado, y honeypot.
- Términos muestra versión 0.5, actualización al 1 de octubre de 2026, identidad legal, precios anuales, política de dominio del cliente, evaluación mensual de alto tráfico y exclusiones de ecommerce/pagos/integraciones.
- Privacidad describe el handoff temporal por WhatsApp, el envío decidido por la persona y la ausencia de cuenta, orden o CRM permanente.
- Footer/canales: sitio, correo comercial, WhatsApp, LinkedIn exacto, Instagram, Facebook y YouTube presentes; RSS ausente.
- Confirmación comunica que la solicitud queda preparada, no que el mensaje haya sido enviado.

## Activación controlada

Se efectuó una sola solicitud técnica con datos sintéticos, sin representar a un cliente real y sin enviar un mensaje de WhatsApp. `/api/activation` respondió HTTP 200 con `ok=true`, `requestId` UUID y handoff. La respuesta mantuvo producto canónico `landing`, categoría `technology-digital` y precio autoritativo total de 117810 CLP. El contrato no devolvió `paid_verified` ni una orden durable. El mensaje preparado conserva la referencia UUID y los datos de producto/contexto; la acción final Enviar permanece bajo control de la persona.

## Logs, seguridad y alcance

- Consulta de logs Vercel para producción (`level=error`, últimos 30 minutos): no se observaron errores relevantes ni respuestas 5xx atribuibles al smoke.
- Se conserva la excepción `TEMPORARY_UPSTREAM_EXCEPTION` para `CVE-2026-93748` / `GHSA-ch52-4w7c-c8xp`, `http-cache-semantics@4.2.0`, con `REACHABILITY=NO_REACHABLE_CURRENT_H01`. Esto no significa que la vulnerabilidad esté corregida ni que la auditoría esté limpia.
- En el alcance H01 no hay pago/checkout, automatización de cupones, CRM/webhook de activación ni orden durable.
- No se realizaron cambios de DNS, proyecto Vercel ni configuración de protección. No se creó un deployment manual.

## LinkedIn y aceptación del pendiente

- El footer productivo apunta a la URL exacta `https://www.linkedin.com/company/evaas369/`.
- La verificación de que la cuenta correcta carga en navegador real permanece `LINKEDIN_REAL_BROWSER=MANUAL_PENDING` por limitación de verificación externa.
- El owner aceptó expresamente el 2026-10-05 mantener este pendiente manual y autorizó cerrar H01. Se registra como pendiente externo no bloqueante, no como validación completada.

## Cierre y referencias

- Antes del cierre: `origin/main=c4557ff32d05ca50f018c31665bf7af398ba420a`; `origin/develop=56f72eb10121d5730a580db45e9fce4dd4f3564f`.
- Tras confirmar el smoke y la aceptación del pendiente manual, `develop` avanzó por fast-forward a `c4557ff32d05ca50f018c31665bf7af398ba420a`. No se hizo ningún commit ni push a `main`.
- H01 Launch MVP v0.5: `CLOSED`.
- Pendientes posteriores: revisión de la excepción CVE cuando exista un parche upstream; LinkedIn real-browser si se desea completar el control; H02 durable order/idempotency. Pago/checkout y cupones quedan fuera de H01 salvo reapertura expresa de alcance.
