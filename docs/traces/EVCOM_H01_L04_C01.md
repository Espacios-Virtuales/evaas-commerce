# EVCOM-H01-L04-C01 · Demo Landing completa

Fecha: 2026-09-26 · Rama: `feature/evaas-commerce-v04`

```text
BASE_SHA=2202b1c7613473f2bf039bddae77ba015bd9ff11
ARCHETYPE=landing
SECTOR=cafetería de especialidad
STATUS=PASS
```

## Recorrido implementado

La ruta dinámica existente `/demos/landing` ahora muestra el sitio completo de la marca ficticia Grano Claro, en vez de un preview enmarcado como dispositivo. Contiene navegación con anchors, hero, propuesta de valor, carta de ejemplo, proceso narrativo, CTA demostrativo, contacto ilustrativo y cierre. El alcance se agrupa en seis secciones de página más header y footer.

El contenido identifica que es demostrativo, no presenta métricas, clientes ni resultados reales y aclara que la estructura no promete una copia exacta. El preview antiguo ya no muestra una acción falsa de reserva. La interacción adicional es un disclosure nativo de detalles de la carta; no usa JavaScript ni conecta servicios. No se agregaron formularios, pagos, CRM, reservas ni integraciones externas.

El selector contractual `forest`, `garnet`, `ocean` modifica acentos del sitio ficticio. Chrome verificó las nueve combinaciones con `dark`, `light`, `cyan`; cambiar tema conserva el color del proyecto y cambiar color conserva el tema. La demo mantiene su estructura y contenido. El botón comercial **Elegir Landing** lleva a `/activar/landing`; también hay retornos a `/productos/landing` y `/#showroom`.

## Archivos propios de C01

- `src/components/LandingArchetypeDemo.astro`: layout, contenido, anchors, disclosure y estilos responsive del arquetipo.
- `src/pages/demos/[slug].astro`: integración en la ruta existente, selector, distinción entre CTA de demo y CTA EVAAS.
- `src/components/DemoPreview.astro` y `src/data/products.ts`: marca de ejemplo y descripción sin promesa de reserva.
- `src/styles/global.css`: escala del título móvil y estilo de enlaces de regreso.

## Validación

- Chrome/CDP: 1440, 1024, 768, 390 y 360 px; `documentElement.scrollWidth` coincide con el viewport en todos. Capturas revisadas a 1440, 1024, 390 y 360; sin overflow ni recorte de contenido.
- Navegación por teclado: Space cambia el tema; Enter activa anchors, detalles y el radio de color. El radio expone nombre, selección textual/marca y foco visible.
- JavaScript deshabilitado: captura Chrome; header, hero, contenido, anchors y sitio permanecen visibles. El selector opcional usa el fallback `<noscript>` existente.
- Movimiento reducido: AOS queda deshabilitado; seis elementos `data-aos` conservan `opacity: 1` y `transform: none`; el CTA sigue presente.
- AOS conserva su único punto de inicialización existente en `AosController.astro`; se anima solo contenido secundario.
- Auditoría del preview Landing: sin Lorem Ipsum, URLs externas, nombres de clientes o CTA de reserva. El componente nuevo no introduce dorado.
- `npm run build`: PASS; Astro check con 0 errores/avisos y 14 rutas generadas. `git diff --check`: PASS.

## Preservación y deuda

```text
PRESERVED_EXTERNAL_CHANGE=src/pages/index.astro
PRESERVED_EXTERNAL_CHANGE=src/components/Footer.astro
PREEXISTING_CONTENT_DEBT=59381, 95081, 142681, "precio final"
PREEXISTING_DEPENDENCY_DEBT=3 high severity findings via @vercel/routing-utils → path-to-regexp
```

Los cambios locales de `index.astro` y `Footer.astro` se dejaron intactos y fuera del staging. No se modificaron precios, etiquetas, el adaptador Vercel ni las demos Catálogo/Corporativa.
