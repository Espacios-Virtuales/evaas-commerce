# EVCOM-H01-L04-C04 · Normalizar responsive e interacción de demos

## Alcance

Auditoría conjunta de Landing, Catálogo y Web Corporativa en `/demos/[slug]`. Se conservaron sus sectores y recorridos: cafetería de especialidad orientada a una acción; objetos de diseño y hogar para explorar y consultar; servicios técnicos e ingeniería con profundidad institucional.

## Shell y ajustes

- Las tres rutas comparten identificación EVAAS, aviso exterior de contenido demostrativo, selector `forest / garnet / ocean`, superficie de sitio completo y bloque EVAAS de elección/retorno.
- Las etiquetas interiores ahora usan la convención común `Contenido demostrativo · estructura de referencia`. Los nombres, densidad, navegación, secciones y detalles sectoriales permanecen propios.
- Se ajustaron los enlaces de navegación y cierre de los tres sitios a un área mínima de toque de 44 px; los resúmenes nativos `<details>` y filtros conservan sus targets de 44 px.
- El selector mantiene el microcopy contractual `Este color orienta tu proyecto; no cambia el producto elegido.`
- Los CTA EVAAS verifican las rutas existentes: Landing `/activar/landing`, Catálogo `/activar/catalogo`, Web Corporativa `/activar/corporativa`. Los CTA internos siguen perteneciendo a las marcas ficticias.
- No hay marco de dispositivo en las tres demos completas. No existe control fullscreen (`N/A`).

## Comparación estructural

| Revisión | Landing | Catálogo | Web Corporativa |
| --- | --- | --- | --- |
| Estructura completa visible | PASS | PASS | PASS |
| Identidad/aviso demostrativo | PASS | PASS | PASS |
| Color del proyecto y temas | PASS | PASS | PASS |
| Móvil, teclado, anchors | PASS | PASS | PASS |
| Sin JavaScript / movimiento reducido | PASS | PASS | PASS |
| CTA EVAAS | `/activar/landing` | `/activar/catalogo` | `/activar/corporativa` |

La diferencia funcional se conserva: recorrido concentrado; filtro y consulta de 8 piezas sin ecommerce; áreas públicas Empresa, Servicios, Método, Casos y Contacto. El selector, los temas y la shell no alteran esa arquitectura.

## Validación

- Temas y colores: 27/27 combinaciones verificadas en navegador (3 arquetipos × `dark/light/cyan` × `forest/garnet/ocean`). Cambiar color conserva tema; cambiar tema conserva color. Persistencia local del tema confirmada entre rutas.
- Responsive: 27/27 estados sin overflow ni anchors rotos en 320, 360, 390, 768, 1024 y 1440 px, además de 667×375, 844×390 y 1024×768. CTA accesible, navegación visible, sin elementos internos sticky/fijos ni dependencia de altura de viewport.
- Teclado: navegación por anchors; selección por flechas del color; filtro del Catálogo por Space (Mesa muestra 4 elementos); ficha `<details>` por Enter; foco visible. Targets de navegación internos y detalles ≥44 px.
- Sin JS: tema dark; contenido y anchors visibles; CTA EVAAS visible; selector/filtro dinámicos inactivos. Catálogo conserva sus 8 fichas accesibles.
- `prefers-reduced-motion`: bloques AOS visibles, transform desactivado, anchors y CTA disponibles.
- AOS: `aos@2.3.4`, una sola inicialización en `AosController.astro`; solo cards y bloques secundarios llevan `data-aos`. Se recorrieron las páginas antes de capturar para comprobar su revelado.
- Dorado: única coincidencia de color en el alcance auditado es la definición semántica `--color-commercial-action` en `global.css`; no se detectó dorado editorial en las demos.
- HeroVideo conserva el fallback progresivo. Catálogo no incorpora carrito, checkout, stock ni pagos; Corporativa no incorpora área privada, intranet, dashboard ni integraciones.
- Capturas completas revisadas en escritorio 1440 y móvil 390, para los tres arquetipos. Evidencia temporal, no versionada: `/tmp/evaas-c04-{landing|catalogo|corporativa}-{desktop|mobile}-review.png`.
- `npm run build`: PASS; Astro check 27 archivos, 0 errores/avisos, 14 rutas. `git diff --check`: PASS.

## Preservación y deuda

Se preservan fuera de C04 y del commit:

- `src/pages/index.astro`
- `src/components/Footer.astro`

Deuda preexistente mantenida: etiquetas/precios comerciales heredados (`59381`, `95081`, `142681`, `"precio final"`) y hallazgos `@vercel/routing-utils → path-to-regexp`. No se inició L05.
