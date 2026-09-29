# EVCOM-H01-L06-GATE-V05 — Gate de confianza, legal y footer

**Estado:** PASS
**Intento:** 1
**Base validada:** `cee8d0e7dc4654561c3c62453f288a4cfabc6c28`
**Rebaseline:** Launch MVP v0.5

## Integridad del gate

- Branch: `feature/evaas-commerce-v04`; HEAD coincidió con la base indicada y `origin` estaba sincronizado antes del commit de esta traza.
- L06-C01 (`959627b`), L06-C02 (`c67ac87`) y L06-C03 (`cee8d0e`) son ancestros: 3/3.
- C03 conserva `STATUS=PASS`, `DISPOSITION=OWNER_AMENDMENT`, `IMPLEMENTATION_REQUIRED=NO`. Producto significa arquetipo digital; sector solo describe el contexto ficticio de una demo.
- No se modificó funcionalidad durante el gate. La validación y compilación se hicieron desde una exportación limpia del HEAD en `/tmp/evcom-l06-gate-v05`, separada de los cambios locales.

## Legal, alcance y privacidad

- Términos publican versión 0.4, fecha 25 de septiembre de 2026, identidad ESPACIOS VIRTUALES SpA, RUT 78.428.352-6 y `info@espaciosvirtuales.lat`.
- Se mantienen los tres productos, precios contractuales con IVA, alcance y límites, insumos del cliente, una revisión consolidada, titularidad y compra del dominio por el cliente, conexión por Espacios Virtuales, compra del dominio excluida y costos externos informados antes. La continuidad posterior es optativa y las exclusiones corresponden al alcance contractual.
- Privacidad publica versión 0.4, actualizada el 29 de septiembre de 2026, y describe proyecto, dominio, contexto opcional, producto, color elegido, referencia temporal y datos de atribución del recorrido. No atribuye captura de nombre personal, correo, teléfono ni WhatsApp del cliente.
- El brief se mantiene temporalmente en la sesión del navegador y vence a los 60 minutos. El formulario prepara la solicitud; el envío comercial ocurre cuando la persona abre WhatsApp, revisa y envía el mensaje. Abandonar antes puede significar que Espacios Virtuales no recibió la solicitud. No se afirma persistencia CRM ni creación de cuenta u orden.
- El checkbox de activación es `required`, no está premarcado y enlaza a privacidad y términos. Su copy limita el consentimiento a preparar la solicitud y continuarla por WhatsApp; no autoriza marketing.
- Búsquedas en términos no hallaron reembolsos, garantías, SLA, soporte ilimitado, mantenimiento indefinido, propiedad del código ni resultados garantizados. No se alteraron contratos históricos.
- Smoke contractual: Landing $117.810, Catálogo $153.510 y Corporativa $177.310 IVA incluido.

## Diferidos y auditorías de contenido

- Webpay y PayPal permanecen diferidos a H02; automatización de cupón y CRM siguen diferidos por el propietario. La búsqueda de implementación encontró únicamente `coupon: null` en el schema; no encontró checkout, pasarela ni motor de cupones activo.
- La búsqueda de afirmaciones “solicitud registrada/recibida” y similares no encontró claims públicos contradictorios. Tampoco encontró placeholders (`href="#"`, `javascript:void`, dominios de ejemplo) ni copy de privacidad obsoleto.
- `ProductArchetypeIcon` expresa página, grilla e institución para Landing, Catálogo y Corporativa. La búsqueda sectorial encontró únicamente `demoCategory` y contenido de las demos ficticias de cafetería, diseño/hogar e ingeniería/servicios técnicos. No hay identidad de producto, navegación, filtro ni taxonomía por sector; no se añadió iconografía sectorial.
- Las demos etiquetan marcas y contenido como ficticios; la demo corporativa aclara que no acredita clientes ni trabajos de Espacios Virtuales y que sus relatos no atribuyen resultados reales.

## Canales y footer

- El build aislado, con la configuración productiva contractual cargada, renderizó sitio oficial, correo, WhatsApp genérico y LinkedIn, Instagram, Facebook y YouTube con las URL exactas de `brand-content.md`. También verificó el HTML prerenderizado con `PUBLIC_EV_YOUTUBE_VIDEO_ENABLED=false`: el canal YouTube sigue visible independientemente del HeroVideo.
- Los enlaces de producción incluyen `/terminos` y `/privacidad`; el footer conserva EVAAS Station, ESPACIOS VIRTUALES SpA, RUT y “Empieza y luego crece.” No publica RSS, pagos, cupón ni placeholders.
- Los casos de variables ausentes, URL inválida y flags sociales distintos de `true` ocultan los canales sin enlaces vacíos o inseguros, según la implementación centralizada y las pruebas registradas por C02. En el smoke actual sin variables de canal, no se renderizaron grupos vacíos.
- Destinos verificados en C02: sitio oficial HTTP 200 con redirección a `/ecosystem/`; Instagram, Facebook y YouTube HTTP 200. LinkedIn respondió HTTP 999 por bloqueo automatizado; la URL renderizada coincide con el contrato: `https://www.linkedin.com/company/evaas369/`. **MANUAL_VERIFICATION_REQUIRED**.
- C02 comprobó accesibilidad, foco, enlaces externos seguros y footer server-rendered. La navegación legal y los enlaces del footer son anchors HTML y no dependen de JavaScript.

## Temas, responsive y build

- Se reutiliza la matriz visual de C01: términos, privacidad y activación en dark/light/cyan a 500, 768 y 1440 CSS px, sin overflow; consentimiento obligatorio y desmarcado. C02 cubrió footer en dark/light/cyan a 500, 768, 1024 y 1440 CSS px sin overflow, con foco visible y targets de al menos 44 px.
- Smoke adicional del HEAD aislado: footer en las cuatro anchuras anteriores y tres temas, sin overflow; contraste medido entre 5.53:1 y 11.8:1 y foco visible. El servidor de esta comprobación no recibió canales configurados, por lo que la visibilidad de las redes se contrastó separadamente con el HTML de build productivo.
- La evidencia CSS real de 320/360/390 px se difiere a L07 (`REAL_NARROW_VIEWPORTS=DEFERRED_TO_L07`).
- `npm run build`: PASS; Astro check 0 errores/0 warnings; 14 rutas.
- `git diff --check`: PASS. No se cambió código funcional.

## Cambios locales preservados

Se mantuvieron fuera de la validación aislada y del staging los cambios locales preexistentes en `src/components/Footer.astro`, `src/layouts/BaseLayout.astro`, `src/pages/demos/[slug].astro` y `src/pages/index.astro`. El commit del gate contiene únicamente esta traza.

## Decisión

L06 queda cerrado como confianza contractual, privacidad coherente con v0.5 e identidad/canales oficiales. C03 se resuelve por `OWNER_AMENDMENT`; los sectores son contexto ficticio de demo. Webpay/PayPal, automatización de cupón y CRM no se reintroducen. No se hizo merge.
