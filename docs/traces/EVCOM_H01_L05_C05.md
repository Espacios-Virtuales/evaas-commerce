# EVCOM-H01-L05-C05 · Cierre del recorrido

## Alcance

- Base: `e2e38bfd998c7d510dea3d6868c82e30c5be932b` en `feature/evaas-commerce-v04`.
- Frase contractual aplicada literalmente: **Empieza y luego crece.**
- Home termina con el eyebrow existente, la frase y el CTA `Elegir mi opción`; se retiró el párrafo explicativo del cierre.
- Confirmación conserva `Solicitud registrada`, explicación, WhatsApp, referencia y acciones; la frase se añadió al final de la tarjeta operativa, sin sustituir el estado ni agregar explicación.
- Footer tenía dos líneas de cierre. Se consolidaron en la frase contractual. La edición local externa del pie `Claro · Seguro · Evolutivo` se preserva.

## Auditoría de copy y estilo

- `rg -n "Empieza con lo necesario|Hazlo crecer cuando lo necesites" src`: cero coincidencias.
- `rg -n "Empieza y luego crece\\." src`: presente en Home, confirmación y Footer.
- Los cierres usan tipografía y color ordinarios del contexto; no se usaron `commercial-value`, `color-commercial-action`, `gold` ni dorado.
- Sin subtítulo extenso en Home o confirmación.

## Evidencia visual y responsive

- Home cierre + Footer, con CSS compilado: capturas configuradas a dark/360, light/768 y cyan/1440. La frase y CTA caben en el bloque aislado. La captura 360 no cuenta como viewport CSS real por la limitación headless descrita abajo.
- Confirmación renderizada: dark revisado a 768 y 1440 px; orden operativo conservado y cierre visible tras `Volver al showroom`.
- No se declara una validación real a 360 CSS px para las páginas completas: Chromium headless mantuvo la limitación de viewport mínimo efectivo observada en C06; la matriz narrow real sigue pendiente de L07-C02 / L07-C04.
- Las capturas temporales y fixtures de revisión se generaron bajo `dist/` y `/tmp`; no forman parte del cambio.

## Integridad y regresiones

- `npm run build`: PASS; Astro check con 0 errores, 0 warnings y 0 hints; 14 rutas prerenderizadas.
- `git diff --check`: PASS.
- C01 CommercialContext, C02 WhatsApp y C06 handoff: sin cambios funcionales; build correcto.
- Activación no-JS, pagos y cupón: sin cambios en esta cápsula. Webpay/PayPal y cupón siguen diferidos.
- Hunk editorial de Footer preservado: `Claro · Seguro · Evolutivo`. Se preservan también las ediciones locales ajenas de `BaseLayout.astro`, `index.astro` y `demos/[slug].astro`; solo se prepara para commit el hunk del cierre en Home y Footer.
