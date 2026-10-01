# EVCOM-H01-L07-C05 · Confianza, contenido y coherencia comercial

## Resultado

- Estado: `PASS`.
- Rama: `feature/evaas-commerce-v04`.
- Base validada: `7c824120940fc87b23d83a2d5a53671073e2c35c`.
- Ejecución en clone temporal limpio: `/tmp/evcom-h01-l07-c05`.
- El clone confirmó que `origin/feature/evaas-commerce-v04` apuntaba al `BASE_SHA` antes de iniciar.
- El worktree propietario no se modificó ni se usó para construir, validar o commitear.
- Track manual/deployment: `IN_PROGRESS`; SHA desplegado no informado; sin bloqueadores comunicados a C05.
- LinkedIn: URL exacta y render seguro `PASS`; apertura real `MANUAL_PENDING` para el Gate L07.

## Hallazgos y correcciones

Se corrigieron cuatro hallazgos de copy y nomenclatura dentro del alcance permitido:

1. `src/pages/terminos.astro` publicaba todavía `Versión 0.4`; ahora identifica la versión pública 0.5 y la fecha 1 de octubre de 2026.
2. `src/components/Footer.astro` explicita la jerarquía: EVAAS Commerce es la experiencia comercial de ESPACIOS VIRTUALES SpA y EVAAS Station reúne sus activaciones digitales.
3. `src/lib/whatsapp.ts` usa `Landing Comercial`, `Catálogo de Productos` y `Web Corporativa` en todos los mensajes donde se presenta el producto comercial.
4. `src/components/CommercialContextController.astro` usa los tres nombres contractuales completos en la recomendación asistida.

Commit funcional: `0e32cc30a05836b0585860212c6b5aff3fa5aa15` (`fix: close H01 trust and content findings`). No se agregó producto, función, integración, checkout, cupón, CRM ni diseño nuevo.

## Productos, precios y alcance

- Productos base: exactamente Landing Comercial, Catálogo de Productos y Web Corporativa. Ecommerce/pagos e integraciones aparecen solo como necesidades asistidas.
- Landing Comercial: neto `$99.000`, IVA `$18.810`, total `$117.810`; 1 página, hasta 6 secciones y 1 revisión consolidada. Excluye tienda/carrito, pasarela, agenda/integraciones y producción fotográfica.
- Catálogo de Productos: neto `$129.000`, IVA `$24.510`, total `$153.510`; 1 catálogo, hasta 12 ítems y 1 revisión consolidada, sin ecommerce. Excluye carrito/stock, pago en línea, carga masiva y ERP.
- Web Corporativa: neto `$149.000`, IVA `$28.310`, total `$177.310`; 4 áreas principales —Inicio, Empresa, Servicios y Contacto— y 1 revisión consolidada. Excluye ecommerce, área privada, redacción extensa e integraciones empresariales.
- IVA contractual: 19 %. Producto, activación, contexto comercial y mensajes de WhatsApp derivan el mismo precio contractual. No se encontraron valores públicos obsoletos o contradictorios.

## Identidad, legal y confianza

- Identidad pública: `ESPACIOS VIRTUALES SpA`, RUT `78.428.352-6`, `info@espaciosvirtuales.lat`.
- Dominio: el cliente lo compra y conserva; Espacios Virtuales ayuda a conectarlo. No se promete dominio incluido.
- Dominio, licencias, planes y servicios externos o capacidades adicionales se presentan como costos potenciales separados que se informan antes de contratar.
- No se encontraron SLA, garantía, reembolso, propiedad intelectual, soporte ilimitado o plazos inventados.
- Jerarquía pública validada: Espacios Virtuales como empresa responsable; EVAAS Commerce como experiencia comercial; EVAAS Station como familia/activación.
- `dark`, `light` y `cyan` son temas globales. `forest`, `garnet` y `ocean` solo cambian el contexto visual del proyecto; no alteran producto, precio o alcance.
- El dorado (`--color-commercial-action`) se usa en CTA, foco, enlace de precio/valor y fallback comercial. No se usa como tratamiento sistemático de títulos, párrafos o decoración general.

## Demos, conversión y privacidad

- Las tres demos incluyen identificación de contenido, marca o casos ficticios/demostrativos.
- Catálogo declara que no representa productos, stock ni ventas reales y no ofrece carrito, checkout o pago.
- Landing declara que su acción no conecta una reserva real.
- Corporativa declara que no acredita clientes, trabajos, certificaciones ni proyectos ejecutados.
- No se encontraron promesas garantizadas de ventas, ROI, crecimiento o escalabilidad.
- Formulario y confirmación mantienen `solicitud`, `brief`, `Solicitud preparada` y `Tu punto de partida está listo.`. La confirmación no equivale a envío.
- WhatsApp se intenta abrir con el brief preparado; el usuario debe revisarlo y pulsar Enviar. No se declara mensaje enviado o solicitud recibida.
- Cierre exacto: `Empieza y luego crece.` en Home, confirmación y footer; no se encontraron variantes obsoletas.
- Privacidad cubre categoría general, almacenamiento temporal en sesión, TTL de 60 minutos, apertura automática, acción Enviar del usuario, confirmación distinta de envío, y ausencia de cuenta, orden y CRM permanente.
- Consentimiento: checkbox `required`, sin `checked`, informado y sin finalidad implícita de marketing.

## Canales y exclusiones v0.5

- Sitio: `https://espaciosvirtuales.cl`.
- LinkedIn: `https://www.linkedin.com/company/evaas369/` con `target="_blank"` y `rel="noopener noreferrer"`; navegador externo `MANUAL_PENDING`.
- Instagram: `https://www.instagram.com/evaas963/`.
- Facebook: `https://www.facebook.com/espaciosvirtuales963/`.
- YouTube: `https://www.youtube.com/@evaas963`.
- Correo: `info@espaciosvirtuales.lat`.
- WhatsApp: `https://wa.me/56979959180`.
- RSS: ausente. No se renderizan placeholders.
- Implementación activa de Webpay, PayPal, checkout, PaymentIntent, PaymentTransaction o `paid_verified`: `NONE_ACTIVE`.
- Automatización pública de cupón/EVAAS10: `NONE_ACTIVE`.
- CRM operacional, webhook o dependencia de webhook en activación: `NONE_ACTIVE`.
- Las menciones a CRM y checkout encontradas en `src` son negativas o descriptivas: exclusión, privacidad o necesidad asistida.

## Copy review

Se revisaron Home, los tres productos, las tres demos, selector, las tres activaciones, confirmación, términos, privacidad y footer. Después de los fixes no quedaron errores ortográficos demostrados, nombres comerciales abreviados al presentar un producto, contradicciones de precio/alcance ni copy técnico innecesario.

## Smoke visual

- Navegador: Google Chrome headless `137.0.7151.55`.
- Build servido localmente con la configuración pública de `.env.example`; no se contactó ni modificó Vercel.
- Rutas: Home; tres productos; tres demos; `activar/landing`; confirmación; términos; privacidad.
- Viewports: `390 × 844` y `1440 × 900`.
- Resultado: 22/22 combinaciones renderizadas; 0 con overflow horizontal; 0 solapamientos críticos observados; copy legible y CTA principales visibles según el estado de cada flujo.
- Comprobaciones DOM: disclaimer ficticio 3/3, URLs oficiales exactas renderizadas y cierre exacto en Home/confirmación.
- Capturas y harness permanecieron en `/tmp`; no se stagearon.

## Build y seguridad

- `npm ci`: PASS, 349 paquetes, 0 vulnerabilidades.
- `npm run build`: PASS.
- Astro: 0 errores, 0 warnings, 0 hints.
- Rutas: 14.
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilidades (high/critical: 0).
- `npm audit --audit-level=high`: 0 vulnerabilidades (high/critical: 0).
- `npm ls path-to-regexp --all`: `path-to-regexp@6.3.0` mediante override.
- `git diff --check`: PASS.

## Preservación y track paralelo

El snapshot de solo lectura del worktree propietario al comenzar mostró estos nueve cambios externos, todos preservados:

- `public/favicon.svg`
- `src/components/Footer.astro`
- `src/components/Header.astro`
- `src/components/ProductSelector.astro`
- `src/layouts/BaseLayout.astro`
- `src/pages/demos/[slug].astro`
- `src/pages/index.astro`
- `src/pages/terminos.astro`
- `src/styles/global.css`

La validación manual y el deployment continúan de forma independiente. Como C05 produjo un fix de contenido, el track manual debe registrar su SHA desplegado y revalidar sobre el nuevo SHA las rutas afectadas: footer en la experiencia pública, `/terminos`, mensajes comerciales de WhatsApp y recomendación asistida. Esto no impide el `PASS` de C05; el Gate L07 consolida ambos tracks.

## Cierre

- Corrección funcional/contenido requerida: `YES`.
- Expansión de alcance: `NO`.
- LinkedIn browser: `MANUAL_PENDING`.
- Deployment/manual validation: `IN_PROGRESS`; deployed SHA: `N/A`; blockers: `NONE`.
- Próxima cápsula permitida después de publicar esta traza: `EVCOM-H01-L07-GATE-V05`.
