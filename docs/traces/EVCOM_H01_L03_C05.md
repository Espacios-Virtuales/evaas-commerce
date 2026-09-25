# EVCOM-H01-L03-C05 · AOS accesible y progresivo

Fecha: 2026-09-25
Rama: `feature/evaas-commerce-v04`
Base: `68469303e8b4da264dcd3bd621d145569f5e9411`

## Decisión

```text
AOS_REQUIRED_BY_OWNER=true
AOS_VERSION=2.3.4
AOS_PINNED=true
```

Se incorpora AOS porque el propietario lo exige explícitamente para EVAAS Commerce v0.4. Se utiliza la librería existente en lugar de crear un sistema propio; controla únicamente entradas secundarias de previews, no navegación, estado ni lógica comercial. La aplicación permanece operable sin JavaScript.

La dependencia está fijada exactamente como `aos@2.3.4`. Sus dependencias transitivas directas son `classlist-polyfill@1.2.0`, `lodash.debounce@4.0.8` y `lodash.throttle@4.1.1`; no se agregaron otros frameworks de movimiento. Los archivos distribuidos de AOS pesan 26.053 bytes de CSS y 14.690 bytes de JavaScript sin comprimir. El build produce un módulo de controlador de 15.439 bytes y la hoja global combinada de 64.351 bytes.

## Integración

- Único punto de inicialización: `src/components/AosController.astro`, incluido desde `BaseLayout.astro`.
- Configuración: `once=true`, `mirror=false`, `offset=16`, `duration=450 ms`, `easing=ease-out-cubic`.
- Único movimiento aplicado: `fade-up`, en la raíz de los previews de `DemoPreview.astro`; el desplazamiento visual se limita a 16 px.
- No se anima H1, hero CTA, HeroVideo, precios, condiciones, formularios, controles, navegación, ProjectColorSelector, estados de pago ni contenido legal.
- La guarda `html:not(.aos-enabled)` fuerza visibilidad y operabilidad hasta inicialización correcta. La inicialización no añade `aos-enabled` con `prefers-reduced-motion: reduce`; si la preferencia cambia, se retira esa clase y el override mantiene visibles los elementos.
- `pageshow` refresca posiciones para restauración del historial. Los anchors usan el listener de scroll propio de AOS; no se introdujo navegación cliente.
- AOS no lee ni modifica temas, colores de proyecto, dorado comercial o HeroVideo.

## Validación

| Control | Resultado | Evidencia |
| --- | --- | --- |
| `npm ls aos` y pin | PASS | `aos@2.3.4` exacto |
| Punto único de inicialización | PASS | Un `AOS.init` en `AosController.astro` |
| `npm run build` | PASS | Astro check: 0 errores/avisos; 14 rutas generadas |
| `git diff --check` | PASS | Sin errores |
| JavaScript deshabilitado | PASS | Chrome/CDP: clase `aos-enabled` ausente, previews con `opacity: 1` y `transform: none`; CTA presente |
| `prefers-reduced-motion` | PASS | Chrome/CDP: AOS no habilitado; previews visibles y sin transformaciones |
| Ancla `#showroom` | PASS | Chrome/CDP: desplazamiento al ancla y previews visibles al entrar en viewport |
| Historial atrás | PASS | Chrome/CDP: restauración de posición a inicio; previews que ya entraron permanecen visibles |
| Responsive | PASS | Chrome/CDP en 320, 375, 390, 768, 1024 y 1440 px; sin overflow horizontal |
| Video de hero | PASS | El build sin configuración conserva fallback CSS y no genera iframe; C04 no fue alterada |
| Temas, proyecto y dorado | PASS | Sin modificaciones de su estado/configuración; AOS solo anima previews |

`npm audit --omit=dev` informa tres vulnerabilidades altas para `path-to-regexp@6.1.0`, heredadas por `@vercel/routing-utils@6.6.0` / `@astrojs/vercel` y ya presentes en el lockfile base. AOS y sus tres dependencias transitivas no aparecen en esos hallazgos. No se actualizó el adaptador fuera del alcance de esta cápsula.

Al inicio existían cambios de copy ajenos a C05 en `src/pages/index.astro`. Se preservaron y se dejaron fuera del commit de esta cápsula.
