# EVCOM-H01-L07-C02 · Validación responsive, temas y demos

- **Cápsula:** `EVCOM-H01-L07-C02`
- **Rama:** `feature/evaas-commerce-v04`
- **Base validada:** `9ae9335a3149f90f311110a5e631e85d82424259`
- **Resultado:** **PASS**
- **C01:** PASS · Attempt 2; override `path-to-regexp@6.3.0` conservado.

## Aislamiento y entorno

Se validó en `/tmp/evcom-h01-l07-c02`, clon aislado de la rama remota, inicialmente limpio y exactamente en la base indicada. El worktree principal quedó en `d79d9300eb0d16f473991b16fcc683133968d12c`, detrás del remoto, y sus cambios locales permanecieron intactos:

- `src/components/Footer.astro`
- `src/components/Header.astro`
- `src/layouts/BaseLayout.astro`
- `src/pages/demos/[slug].astro`
- `src/pages/index.astro`

| Dato | Resultado |
| --- | --- |
| Node / npm / Astro | `v24.18.0` / `11.16.0` / `7.3.5` |
| Sistema | Linux `6.8.0-79-generic`, x86_64 |
| Navegador | Headless Chrome `137.0.7151.55` vía CDP |
| Servidor | `astro dev --host 127.0.0.1 --port 4323`, permitido como harness visual; `.env.example` cargado para los canales públicos. `astro preview` no es compatible con este adapter, según C01. |
| Emulación | CDP `Emulation.setDeviceMetricsOverride`, `deviceScaleFactor=1`, touch emulation; anchos verificados con `window.innerWidth`. Perfil Chrome separado en `/tmp`. |
| `npm ci` | PASS; 349 paquetes instalados desde el lockfile antes de validar. `package.json` y `package-lock.json` permanecen sin cambios. |
| Seguridad | `npm audit --omit=dev --audit-level=high` y `npm audit --audit-level=high`: ambos PASS, 0 vulnerabilidades. Árbol Vercel: `@astrojs/vercel@11.0.11 → @vercel/routing-utils@6.6.0 → path-to-regexp@6.3.0 overridden`. |

## Matrices y viewport real

La matriz contiene **306 filas**: 13 rutas UI × 3 temas × 6 viewports verticales/desktop (**234**) y 8 rutas críticas × 3 temas × 3 viewports landscape (**72**). Cada fila guarda viewport solicitado y medido, DPR, overflow, controles fuera de pantalla, errores JS/consola y fallos de assets.

| Solicitado | Medido (`window.innerWidth × innerHeight`) | DPR | Resultado |
| --- | --- | --- | --- |
| 320 × 568 | 320 × 568 | 1 | PASS |
| 360 × 800 | 360 × 800 | 1 | PASS |
| 390 × 844 | 390 × 844 | 1 | PASS |
| 768 × 1024 | 768 × 1024 | 1 | PASS |
| 1024 × 768 | 1024 × 768 | 1 | PASS |
| 1440 × 900 | 1440 × 900 | 1 | PASS |
| 568 × 320 | 568 × 320 | 1 | PASS · landscape |
| 800 × 360 | 800 × 360 | 1 | PASS · landscape |
| 844 × 390 | 844 × 390 | 1 | PASS · landscape |

Las 13 rutas UI incluidas fueron Home; tres productos; tres demos; tres activaciones; confirmación; términos y privacidad. `/api/activation` se excluyó de la matriz visual, como se pidió.

- Overflow horizontal de documento: **0/306**.
- Interactivos críticos fuera del viewport: **0/306**.
- Errores de página y `console.error`: **0**.
- Fallos de assets locales en la matriz final: **0**.
- Targets táctiles primarios menores de 44 px en móvil: **0**.
- Estructura completa de los tres demos, incluidos sus footers interiores: PASS.
- CTA flotante WhatsApp: barrido adicional de 195 muestras (13 rutas × 3 anchos × 5 posiciones de scroll), sin solapes visibles. Se ocultó en 12 posiciones donde intersectaba un control; reaparece al despejarse. Sigue oculto en activaciones y confirmación, conforme a la regla existente, y junto al footer.
- Comparativa Home: scroll horizontal contenido en el componente en 320/360/390; el documento no desborda y el contenido se puede desplazar.

La matriz íntegra está en [`EVCOM_H01_L07_C02_MATRIX.csv`](evidence/EVCOM_H01_L07_C02_MATRIX.csv) y [`EVCOM_H01_L07_C02_MATRIX.json`](evidence/EVCOM_H01_L07_C02_MATRIX.json). El JSON conserva también las 54 filas de color de proyecto y los resultados programáticos completos.

## Temas, colores y estados sin JavaScript

- Dark, light y cyan producen sistemas visuales distintos en las rutas probadas.
- Se compararon **26 transiciones** de tema en las 13 rutas (dark→light y light→cyan): PASS. Ruta, estructura/texto, producto, precio, referencia y color de proyecto permanecieron iguales.
- Almacenamiento local: dark/light/cyan guardados se respetan; valor inválido y almacenamiento vacío resuelven a dark.
- Colores `forest`, `garnet` y `ocean`: **54/54** combinaciones de demo × tema × color × viewport 390/1440 PASS. El color solo actualiza la representación del proyecto; conserva tema global, header/footer globales, ruta, producto y precio.
- Sin JavaScript: PASS en `/`, `/productos/landing`, `/demos/catalogo`, `/activar/landing`, `/activar/corporativa`, `/terminos` y `/privacidad`. El formulario Landing muestra ambos pasos y todos sus controles requeridos, consentimiento y submit.
- Menú móvil: apertura/cierre PASS a 320 px, links dentro del viewport y estado de scroll/restauración intacto.
- Teclado/foco visible: PASS en Home, Producto Landing, Demo Catálogo, Activación Corporativa y Privacidad. Skip link y foco de 3 px observables.
- Wizard con JavaScript: step 1 → step 2 → volver a step 1, PASS sin desplazar ni comprimir el layout.
- Anclas `#showroom`, `#elegir`, `#precios`, `#comparar` y `#como-funciona`: PASS; quedan debajo de la cabecera sticky, con margen superior medido de 128 px.
- Canales del footer con configuración pública cargada: sitio oficial, email, WhatsApp, LinkedIn, Instagram, Facebook, YouTube y enlaces legales presentes. RSS ausente.

El barrido adicional reproducible está en [`EVCOM_H01_L07_C02_LAYOUT.json`](evidence/EVCOM_H01_L07_C02_LAYOUT.json): anclas, menú, comparación, aislamiento de tema, solapes del botón flotante y estructura de demos.

## Correcciones C02

Se encontraron y corrigieron únicamente defectos demostrados en la matriz:

1. Añadido `scroll-margin-top: 8rem` a secciones con ID para que las anclas no queden tapadas por el header sticky.
2. Ajustado el inset derecho móvil de WhatsApp y añadido comprobación geométrica al scroll/resize. Usa `document.documentElement.clientWidth` para el viewport de layout y oculta el CTA solo cuando se cruza con un control visible; conserva la supresión existente junto al footer y en rutas acordadas.
3. Aumentada la altura mínima del resumen “Ver ficha de ejemplo” en el demo Catálogo de `2.75rem` a `2.8rem`, superando el umbral táctil de 44 CSS px.

No se añadieron dependencias ni se modificaron precios, contratos, rutas, productos o datos de aplicación. No hubo expansión de alcance.

**Commit de correcciones:** `8f5063a062f1ec9eba4e97397961fb8d6cc76bad` (`fix: close H01 responsive and visual findings`).

Después de las correcciones: `npm run build` PASS (Astro check: 0 errores, 0 warnings, 0 hints; 14 rutas); ambas auditorías npm PASS; `git diff --check` PASS; `path-to-regexp@6.3.0` sigue resuelto.

## Capturas y diferimientos

Se generaron 23 capturas del plan representativo y 5 capturas adicionales en `/tmp/evcom-h01-l07-c02-evidence`. Son temporales y no se stagean. La lista de capturas está en el JSON de matriz/layout.

- LinkedIn browser verification: `MANUAL_REQUIRED` para release validation.
- Deep validation de motion/AOS/video: L07-C03.
- Conversion E2E: L07-C04.

La matriz responsive 320/360/390 queda cerrada en C02 con anchos CSS medidos exactamente.
