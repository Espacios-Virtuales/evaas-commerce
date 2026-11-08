# EVCOM H03 / L02 / C07 · Detalles de productos y demos consistentes

**Cápsula:** EVW-EVCOM-H03-L02-C07

**Gate:** `DETAIL_DEMO_PASS`

**Rama:** `feature/evcom-h03-l02-comercial`

**BASE_SHA:** `1b5599927418d9aa4f7ad4066376b3ce964f89b5` (cierre C06)

**FINAL_SHA:** se informa en el reporte de gate que acompaña el commit. El commit no puede contener su propio SHA dentro de este archivo.

## Resumen del cambio

Se alinearon las páginas de detalle y demos con el catálogo canónico de C06. Los detalles muestran propósito, público, alcance, materiales, límites, precio anual vigente y CTA de solicitud. Las demos se identifican como ejemplos ficticios y no contractuales; el selector de color sigue siendo una referencia visual para la solicitud. El Catálogo se explicita como vitrina no transaccional.

La portada y las tarjetas/comparador de C05/C06 permanecen intactos. No se modificaron el catálogo de productos, las reglas internas H03, los términos v0.6, las API de activación, Handoff V2/V3 ni sus rutas.

## Archivos C07

- `src/pages/productos/[slug].astro`: propósito y público, materiales deduplicados, materiales opcionales, exclusiones y aclaración de que solicitar no confirma compra o pago. El detalle del Catálogo identifica la vitrina como no transaccional.
- `src/pages/demos/[slug].astro`: descripción de ejemplo no contractual, público, materiales y exclusiones canónicas, CTA de solicitud; aclara que solicitar no confirma compra o pago. Los bloques Método/Casos de la demo corporativa se identifican como composición de ejemplo fuera de las cuatro áreas base.
- `src/components/CatalogArchetypeDemo.astro`: explicita que filtros y fichas ficticias no procesan ventas ni consultan inventario real. Se conserva el filtro local.
- `src/components/ProjectColorSelector.astro`: aclara que el color solo modifica la previsualización y queda como referencia; no confirma una identidad ni cambia el producto. La lógica existente no cambió.
- `docs/evidence/evcom-h03-l02-c07/`: capturas generadas en navegador para los viewports indicados abajo.
- `docs/traces/EVCOM_H03_L02_C07_DETAIL_DEMO.md`: esta traza.

## Matriz de productos

| Producto | Detalle y alcance base | Materiales del cliente | Exclusiones principales | Demo preservada |
|---|---|---|---|---|
| Landing Comercial (`landing`) | Una página, hasta 6 secciones y 1 revisión consolidada. Propuesta principal y acción clara para profesionales, emprendimientos o campañas. | Oferta, acción/CTA, contacto, identidad y textos disponibles; referencias visuales opcionales. | Ecommerce, carrito, pasarela, stock, agenda, automatizaciones, integraciones, producción fotográfica y redacción extensa. | Cafetería ficticia; los CTA ilustran navegación y no conectan una reserva real. |
| Catálogo de Productos (`catalogo`) | Una vitrina de hasta 12 ítems y 1 revisión consolidada para negocios que presentan una oferta y reciben consultas o cotizan. No es transaccional. | Lista, categorías, nombres/descripciones, imágenes disponibles y canal de consulta. | Pedidos, carrito, checkout, cobros/ventas en línea, stock, carga masiva, ERP, automatizaciones y funciones avanzadas. | Ocho fichas ficticias; filtro local por categoría, sin consulta a inventario ni disponibilidad real. No admite pedidos, checkout, cobros ni ventas. |
| Web Corporativa (`corporativa`) | Cuatro áreas base —Inicio, Empresa, Servicios y Contacto— y 1 revisión consolidada para pequeñas empresas y organizaciones. | Descripción de empresa, servicios, forma de trabajo, contacto y material institucional disponible. | Ecommerce, carrito, pagos, stock, agenda, automatizaciones, integraciones, áreas privadas, sistemas internos, redacción extensa y fotografía. | Marca y contenido ficticios. Método y Casos son bloques de composición de ejemplo; no se presentan como áreas base ni como trabajos reales. |

Las ampliaciones y los materiales que requieran desarrollo se evalúan, cotizan y aprueban por separado; no se describen como capacidades instaladas ni como prestación recurrente incluida.

## Precio público y separación de estados

Las páginas de producto y demo obtienen importes y periodicidad desde `src/data/products.ts`; no se añadió un segundo catálogo ni cálculo de precio.

| Slug | Precio público v0.6 | Periodicidad pública |
|---|---:|---|
| `landing` | $120.000 CLP | Contratación anual · 12 meses |
| `catalogo` | $160.000 CLP | Contratación anual · 12 meses |
| `corporativa` | $180.000 CLP | Contratación anual · 12 meses |

Los tres importes coinciden en detalle, demo, tarjetas de la portada y `/terminos`. Un escaneo de todo el HTML público compilado no encontró precios H03 (`$19.900`, `$24.900`, `$29.900`, `$214.920`, `$268.920`, `$322.920`) ni las modalidades “Activación única”, “Continuidad mensual” o “Continuidad anual”. Las páginas de detalle y demo no mencionan Vercel como requisito. Se mantiene el copy neutral **“Preparación para publicación según la cotización”**.

## Recorrido, accesibilidad y capturas

- Inicio y tarjetas: `/`, `/#precios`, `/#comparar`, `/#elegir` (sin cambios de C06).
- Cada detalle `/productos/{slug}` enlaza a `/demos/{slug}` y `/activar/{slug}`.
- Cada demo enlaza de vuelta a `/productos/{slug}`, al showroom y a `/activar/{slug}`.
- Las seis rutas de detalle y demo, `/terminos` y las tres rutas `/activar/{slug}` respondieron HTTP 200 en el smoke sobre el artefacto compilado.
- Chrome/CDP verificó cada una de las seis rutas a 320, 500 y 1440 px. `documentElement.scrollWidth` fue igual al viewport a 320/500 px; a 1440 px fue 1425 px por el viewport útil con scrollbar, sin desbordamiento horizontal.
- El filtro de la demo Catálogo selecciona “Mesa”, actualiza `aria-pressed` y muestra 4 fichas ficticias. Las 8 fichas con `data-aos` quedaron visibles tras recorrerlas por scroll.
- El selector conservó sus 3 opciones. Cambiar y restaurar un color modificó/restauró el acento de la demo, mantuvo `catalogo` como producto y dejó conectado su texto descriptivo accesible.
- Navegación por Tab alcanzó el enlace “Preparar solicitud” y los radios; ambos mostraron `:focus-visible`. El swatch del radio mostró un anillo sólido de 3 px.
- Contraste calculado en la demo Catálogo para temas oscuro / claro / cian: texto descriptivo 9,50 / 6,43 / 10,49; precio 16,35 / 14,16 / 13,58; nota demo 8,67 / 6,01 / 6,27; CTA 9,45 / 7,99 / 10,70; panel de alcance 15,58 / 15,22 / 11,12; anillo de foco 12,97 / 5,49 / 12,53. Los pares evaluados superan 4,5:1 para texto y 3:1 para el indicador de foco.

Capturas de referencia (pantallas completas; la demo Catálogo se recorrió antes de capturar para activar sus fichas animadas):

- Landing, detalle: [320 px](../evidence/evcom-h03-l02-c07/productos-landing-320.jpg) · [500 px](../evidence/evcom-h03-l02-c07/productos-landing-500.jpg) · [1440 px](../evidence/evcom-h03-l02-c07/productos-landing-1440.jpg).
- Catálogo, detalle y demo a 320 px: [detalle](../evidence/evcom-h03-l02-c07/productos-catalogo-320.jpg) · [demo](../evidence/evcom-h03-l02-c07/demos-catalogo-320.jpg).
- Catálogo, demo: [500 px](../evidence/evcom-h03-l02-c07/demos-catalogo-500.jpg) · [1440 px](../evidence/evcom-h03-l02-c07/demos-catalogo-1440.jpg).
- Corporativa, detalle y demo a 320 px: [detalle](../evidence/evcom-h03-l02-c07/productos-corporativa-320.jpg) · [demo](../evidence/evcom-h03-l02-c07/demos-corporativa-320.jpg).
- Landing, demo a 320 px: [demo](../evidence/evcom-h03-l02-c07/demos-landing-320.jpg).

## Validaciones y pendientes

- `npm run build`: PASS; Astro check reportó 0 errores, 0 advertencias y 0 hints; build completado.
- `npm run test:commercial`: PASS, 14/14.
- Smoke HTTP de seis rutas de producto/demo, términos y activaciones: PASS, 200 en las diez rutas.
- Consistencia de los tres slugs, importes v0.6, anualidad, CTA y enlaces de retorno: PASS con inspección del HTML compilado.
- Fuga pública de precios/modalidades H03 y mención de Vercel en detalle/demo: no encontrada.
- C05: textos Claro · Simple · Evolutivo, Activa · Mantén · Amplía y fundamentos Control · Claridad · Entrega · Evolución presentes en el HTML de portada; sus archivos no se modificaron.
- `git diff --check`: PASS antes de commit; repetir al cerrar.
- Sin pendientes de C07. No se ejecutó `test:commercial:v3-runtime` ni el smoke HTTP de runtime V3; las superficies/rutas V3 no cambiaron y esa integración queda para su cápsula dueña.
- Términos, API de activación, reglas comerciales canónicas y Handoff permanecen sin cambios.
- La primera consulta CDP de prueba no devolvió métricas por una expresión inválida; se descartó y se repitió la medición con consultas corregidas, que cubrieron los seis recorridos y los tres anchos.

**Siguiente cápsula:** C08, no ejecutada.
