# EVCOM-H01-L04-C06 · Eliminar previews ficticias y simplificar presentación comercial

## Alcance

- Refinación del propietario antes de `GATE_L04`, en `feature/evaas-commerce-v04`, sobre `db547d7da5ec5e386b3f583fe44a9cb0c44a98fa`.
- Home Showroom presenta icono, identificación EVAAS, nombre comercial, propósito y enlace a demo. Reutiliza `product.purpose` como copy único y no muestra miniaturas.
- El CTA del hero enumera los tres productos, el valor inicial IVA incluido y conduce a `#precios`; ya no contiene el mockup de Lumen ni una ventana de navegador.
- `/demos/[slug]` solo dispone de los tres renderizados completos. Se quitó el fallback que usaba el mini preview.
- Eliminados `DemoPreview.astro`, sus datos exclusivos `demoName` y `demoDescription`, y los estilos de preview/frame ya sin consumidores. `demoCategory` permanece porque da contexto en las páginas demo.
- Las demos completas `LandingArchetypeDemo.astro`, `CatalogArchetypeDemo.astro` y `CorporateArchetypeDemo.astro` no se modificaron y conservan las marcas ficticias.
- Placeholder de activación usa `Ej. Mi negocio`.

## Validación

- `npm run build`: PASS; Astro check de 27 archivos sin diagnósticos y 14 rutas.
- `git diff --check`: PASS.
- `DemoPreview` restante en `src`: 0 referencias.
- Clases de preview mini, marco falso del hero y fallback de dispositivo: 0 reglas/usos restantes.
- Los nombres y frases ficticias buscados solo aparecen en los componentes de demos completas.
- Browser responsive: Home, tres páginas de producto y tres demos a 320, 360, 390, 768, 1024 y 1440 px (42 estados), sin overflow.
- Tarjetas showroom: títulos comerciales correctos, previews ausentes, nombres ficticios ausentes y altura equilibrada de 330 px.
- CTA del hero: `href="#precios"`, nombre accesible correcto, Tab/foco visible/Enter comprobados; altura de panel 345 px en móvil.
- Tres demos: rutas, título comercial, valor IVA incluido, requisitos y CTA de activación comprobados.
- Combinaciones de tema/color: `dark/light/cyan` × `forest/garnet/ocean`, 27/27 PASS.
- HeroVideo, AOS single init, tokens de tema/acción comercial y reglas reduced-motion se mantienen; los componentes de demos completas no cambiaron. Build y regresiones de las rutas PASS.
- Capturas temporales finales: `/tmp/evaas-c06-home-390.png` y `/tmp/evaas-c06-home-1440.png`.

## Cambios locales preservados

- `src/components/Footer.astro` permanece sin incluir.
- Se preserva sin stagear la modificación local de `src/layouts/BaseLayout.astro`.
- En `src/pages/index.astro` se conservan sin stagear los hunks editoriales locales de hero, título del showroom/precios, comparación y pasos del proceso. La explicación del showroom sí se actualiza en esta cápsula para dejar claro que la demo es una estructura posible.
- Se preserva sin stagear el salto de línea local en el CTA final de `src/pages/demos/[slug].astro`.
