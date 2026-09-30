# EVCOM-H01-L07-C03 · Validación AOS, reduced motion y video

- **Cápsula:** `EVCOM-H01-L07-C03`
- **Rama destino:** `feature/evaas-commerce-v04`
- **Base:** `f5beb6d2a5deac7a6026b9cb8cb02552cb7b5647`
- **Rebaseline:** `v0.5-launch-mvp`
- **Resultado:** **PASS**
- **Precondiciones:** C01 PASS · Attempt 2; C02 PASS; responsive 320/360/390 cerrado.

## Aislamiento y estado Git

El worktree principal estaba en `d79d9300eb0d16f473991b16fcc683133968d12c`, cinco commits detrás de `origin/feature/evaas-commerce-v04`, y conservaba cambios locales. `git worktree add` no pudo escribir en `.git/worktrees` porque `.git` está montado como solo lectura; la validación se hizo en el clon temporal `/tmp/evcom-h01-l07-c03`, exactamente en la base indicada. No se actualizó ni modificó el worktree principal.

Lista real preservada en el principal:

- `src/components/Footer.astro`
- `src/components/Header.astro`
- `src/layouts/BaseLayout.astro`
- `src/pages/demos/[slug].astro`
- `src/pages/index.astro`

## Entorno y dependencias

| Dato | Resultado |
| --- | --- |
| Navegador | Google Chrome `137.0.7151.55`, headless |
| Harness | `astro dev --host 127.0.0.1 --port 4327` (default) y `:4328` (configuración temporal válida) |
| CDP | Chrome DevTools Protocol; `Emulation.setDeviceMetricsOverride`, `Emulation.setEmulatedMedia`, `Emulation.setScriptExecutionDisabled`; DPR 1 |
| CPU / red | `Emulation.setCPUThrottlingRate=4`; red emulada a 400 ms, 50.000 B/s down y 20.000 B/s up |
| `npm ci` | PASS, 349 paquetes instalados |
| Audit runtime / completo | PASS, 0 vulnerabilidades en ambos |
| `path-to-regexp` | PASS, `6.3.0` bajo `@vercel/routing-utils@6.6.0` |
| Build base | PASS; 0 errores, 0 warnings, 0 hints de Astro; 14 rutas |

Los dos servidores dev fueron harness visual porque el adapter Vercel genera salida serverless. Las configuraciones de video se pasaron solo al proceso/build temporal y no quedaron en archivos de entorno ni en código.

## Inventario de movimiento y conteo AOS

Clasificación encontrada:

- **AOS:** `AosController.astro`, import de `aos`, `data-aos="fade-up"` en demos y `aos-enabled` aplicado después de `AOS.init`/`refreshHard` exitoso.
- **CSS animation:** `reveal` en pasos/resultados del selector y formulario mejorado; duración reducida por media query.
- **CSS transitions:** enlaces, tarjetas, botones y controles; con reduced motion se limitan a `0.01ms`.
- **Smooth scroll:** `html { scroll-behavior: smooth }`; pasa a `auto` con reduced motion.
- **HeroVideo:** componente decorativo en Home. La imagen/video es capa absoluta y no participa en el flujo del documento.
- **Fallback:** `.hero-video-fallback`, gradientes de `.hero-video::after` y estado `data-video-state="fallback"`.
- **Reduced motion:** CSS global elimina las transiciones efectivas de AOS y oculta el frame de video; el controlador elimina `aos-enabled`, el script de video retira el iframe.

Conteo SSR real por ruta; las demás rutas del build no incluyen `data-aos`:

| Ruta | `[data-aos]` |
| --- | ---: |
| `/` | 0 |
| `/productos/landing` | 0 |
| `/demos/landing` | 6 |
| `/demos/catalogo` | 8 |
| `/demos/corporativa` | 11 |
| `/activar/landing` | 0 |
| `/confirmacion` | 0 |
| `/terminos` | 0 |
| `/privacidad` | 0 |

Las nueve rutas devolvieron HTTP 200 en el smoke.

## AOS, JavaScript y movimiento

- **Movimiento normal:** `html.aos-enabled` apareció tras iniciar AOS en `/demos/landing`; no había excepción de AOS. Un elemento comenzó con `aos-init` fuera del viewport y `opacity:0`; al desplazarlo recibió `aos-animate`, con `pointer-events:auto`. `offsetTop` documental permaneció en `2286px` antes/después; el cambio fue transform visual y no alteró el flujo.
- **Pre-init / JavaScript off:** con scripts deshabilitados, `html.aos-enabled` estuvo ausente. En catálogo los ocho `[data-aos]` computaron `opacity:1`, `visibility:visible`, `display:block`, `pointer-events:auto`, `transform:none`.
- **Fallo controlado / fallback:** con el marcador de inicialización ausente, la regla `html:not(.aos-enabled) [data-aos]` computó `opacity:1`, `transform:none`, `pointer-events:auto`; CTA y enlaces permanecieron presentes y operables. No se cambió el source productivo.
- **No-JS:** Home, producto Landing, demo Catálogo, activación Landing, Términos y Privacidad cargaron su estructura SSR. Tema base dark, enlaces/CTA/footer visibles; el formulario mantiene su baseline visible (C02 también verificó ambos pasos y consentimiento).
- **Reduced motion:** Home, las tres demos y Activación Landing computaron `scroll-behavior:auto`; contenido AOS visible, sin transform residual ni pérdida de pointer events. Animaciones/transiciones quedaron reducidas a `0.01ms`.
- **Cambio dinámico:** normal → reduce quitó `aos-enabled`, quitó iframe y dejó `videoState=fallback`; reduce → normal reactivó AOS y volvió a evaluar el video sin errores ni corrupción visual.
- **`pageshow`:** evento sintético de pageshow mantuvo el estado AOS normal; con reduce el controlador deja el marcador ausente.
- **Consola/página:** 0 errores de aplicación en escenarios normales, no-JS, reduced, AOS y video.

## Anclas, foco y estabilidad AOS

Con smooth scroll asentado, `/#showroom`, `/#elegir`, `/#precios`, `/#comparar` y `/#como-funciona` terminaron en `top=128px`; el borde inferior del header sticky fue `75px`, dejando 53–54px de separación. El destino quedó visible debajo del header. Las transforms AOS no cambian DOM ni orden semántico; el iframe decorativo usa `tabindex=-1`. C02 ya dejó PASS en navegación por teclado/foco visible. No aparecieron errores de página.

`PerformanceObserver` de `layout-shift` estuvo disponible y registró `[]` en las capturas/muestras de Home normal, reduced, video deshabilitado y móvil. En la muestra AOS, `offsetTop` documental no cambió al entrar en viewport.

## HeroVideo por configuración

### Default y configuraciones inválidas

- `.env.example`: ID, URL y poster vacíos; `PUBLIC_EV_YOUTUBE_VIDEO_ENABLED=false`.
- Home default: `data-video-enabled=false`, sin iframe y sin petición YouTube; fallback CSS presente, copy/precio/CTA visibles.
- Tres builds temporales confirmaron `configuredVideo=false`, iframe ausente y fallback SSR presente para: ID inválido; URL `example.com`; ID/URL válidos pero distintos.
- Configuración sintácticamente válida aceptada solo en el harness: `ENABLED=true`, ID `AAAAAAAAAAA`, URL de YouTube con el mismo ID. Es un identificador de prueba, no un video atribuido como real/oficial. La creación/contrato del iframe se probó con respuesta HTML vacía interceptada por CDP.

### Contrato del iframe

PASS: `https://www.youtube-nocookie.com/embed/`; parámetros `autoplay=1`, `mute=1`, `playsinline=1`, `controls=0`, `loop=1`, `playlist=AAAAAAAAAAA`; título presente; `tabindex=-1`; `loading=lazy`; atributo HTML `referrerpolicy="strict-origin-when-cross-origin"`; `allow="autoplay; encrypted-media"`; `pointer-events:none`. Autoplay se solicita silenciado. El getter JS `iframe.referrerPolicy` de Chrome 137 devolvió cadena vacía, pero el atributo DOM y el HTML del iframe contienen el valor contractual correcto.

Al finalizar navegación de prueba, el estado cambió a `loaded` y el iframe tomó su opacidad CSS configurada; fallback permaneció detrás, no bloqueante.

### Fallbacks

- **Móvil 320/360/390/600:** sin iframe, `videoState=fallback`, frame `display:none`; gradiente/fallback, copy y CTA presentes.
- **601/768/1440:** iframe se intentó con movimiento normal y sin saveData.
- **Reduced motion desktop y móvil:** sin iframe/autoplay; `videoState=fallback`, frame oculto y `scroll-behavior:auto`.
- **Save-Data:** emulado de forma reproducible exponiendo `navigator.connection.saveData=true` antes de cargar; sin iframe y `videoState=fallback`.
- **Timeout:** Fetch pausó la solicitud del iframe sin resolverla. La medición inicial fue `loading` con iframe; tras 10,1 s fue `fallback`, iframe retirado, copy/CTA preservados.
- **Solicitud bloqueada:** Chrome dispara `load` también al fallar una navegación bloqueada; por ello el caso de timeout se midió con Fetch pausado, no `Network.setBlockedURLs`. El fallback base siguió visible en ambos casos.
- **No-JS:** con configuración válida, el HTML SSR incluyó fallback y copy; no se creó iframe.
- **Sin poster:** `POSTER_ASSET_CONFIGURED=NO`; ausencia segura y no bloqueante. El sanitizer existente aceptó `/assets/hero.webp` y rechazó vacío, path inválido, `/assets/../hero.webp`, URL remota y extensión `.gif`. No se utilizó `evaas-symbol.webp` como poster.
- **CSS estático:** `.hero-video`, `.hero-video-fallback` y `.hero-video::after` visibles sin poster.

## Geometría y accesibilidad del video

En 1440×900, disabled/loading/loaded/fallback conservaron las mismas cajas: video `1425×802` en `top=75`; hero `1425×1203`; hero-grid `1240×1043` en `top=155`; main `1425×7267`; copy `627×1043`; primer CTA `172×54` en `top=1068`. Inserción y retiro del iframe no cambiaron dimensiones ni posición: **sin salto estructural atribuible al video**. La capa externa lleva `aria-hidden="true"`; el iframe no entra al orden de teclado. Texto, precio y CTA están fuera del medio decorativo.

Con 4× CPU y red emulada (400 ms, 50 kB/s down, 20 kB/s up), el H1 computó opacity 1 y el CTA estuvo presente con `pointer-events:auto`; el fallo/retraso externo del iframe no condicionó comprensión ni conversión. `PerformanceObserver` no detectó layout shift en las muestras registradas.

## Capturas temporales

Generadas bajo `/tmp`; no se stagean:

- `home-normal-motion-1440.png`
- `home-reduced-motion-1440.png`
- `home-no-js-1440.png`
- `home-video-disabled-1440.png`
- `home-video-configured-loading-1440.png`
- `home-video-timeout-fallback-1440.png`
- `home-video-mobile-fallback-390.png`
- `home-reduced-motion-mobile-390.png`

## Correcciones, regresiones y cierre

No se encontró un defecto de producto directamente atribuible a AOS, reduced motion, HeroVideo, fallback, foco/anclas o layout. No hubo fix funcional ni expansión de alcance. No se añadieron dependencias ni se modificaron overrides.

Tras las pruebas de configuración temporal se restauró el build sin variables de video: `npm run build` PASS, 0 errores/0 warnings/0 hints y 14 rutas. Ambos `npm audit` volvieron a PASS con 0 vulnerabilidades; `path-to-regexp` sigue en `6.3.0`. No hubo corrección que exigiera una matriz responsive posterior; se conservaron las medidas de C02 y se ejercitaron además los fallbacks de video en 320/360/390/600 y desktop 1440.

- **Fix funcional requerido:** NO
- **Commit funcional:** N/A
- **Commit de traza:** `docs: record H01 motion and video validation`
- **LinkedIn browser verification:** `MANUAL_REQUIRED`
- **Conversión E2E:** L07-C04
- **Siguiente cápsula:** `EVCOM-H01-L07-C04`
