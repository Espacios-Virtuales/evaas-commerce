# EVCOM-H01-L03-GATE · Cierre de experiencia global

Fecha: 2026-09-26
Rama: `feature/evaas-commerce-v04`
Base validada: `f7a7afac31f8bd040722df122792772005148487`

## Resultado

```text
L03=PASS
PRESERVED_EXTERNAL_CHANGE=src/pages/index.astro
```

El cambio local de copy en `src/pages/index.astro` se inspeccionó antes de cualquier operación, se preservó intacto y quedó fuera de la evidencia y del commit. El `HEAD` verificado fue `f7a7afac31f8bd040722df122792772005148487`; la rama inicial estaba sincronizada con `origin/feature/evaas-commerce-v04`.

## Cápsulas incluidas

```text
L03-C01
commit=8462768092ad30badc348b298020675547f3d36b
status=PASS

L03-C02
commit=db27f99b27ea9fd1ea4719365374f5e5e578c619
status=PASS

L03-C03
commit=a29ad42587422ac02f6c15be2df4f60979ca0994
status=PASS

L03-C04
commit=68469303e8b4da264dcd3bd621d145569f5e9411
status=PASS

L03-C05
commit=f7a7afac31f8bd040722df122792772005148487
status=PASS
```

Los cinco commits se verificaron como ancestros del `HEAD` (códigos de salida `0`).

## Validación consolidada

```text
GLOBAL_THEME=PASS
PROJECT_COLOR=PASS
GOLD_SEMANTICS=PASS
HERO_VIDEO=PASS
AOS=PASS
PROGRESSIVE_ENHANCEMENT=PASS
REDUCED_MOTION=PASS
RESPONSIVE=PASS
ACCESSIBILITY=PASS
BUILD=PASS
```

- **Temas globales:** `dark`, `light` y `cyan` están definidos en los tokens globales; dark es el atributo inicial y el fallback. El selector usa botones nativos con `aria-pressed`; el tema persiste en `localStorage`, y valores guardados inválidos o no disponibles conservan dark. C05 documenta navegación por teclado, foco visible y la comprobación con JavaScript deshabilitado.
- **Color de proyecto:** las únicas opciones son forest, garnet y ocean. El selector nativo de radios tiene leyenda, etiquetas, indicador de selección y foco visible. Modifica variables del preview únicamente; no escribe en storage ni cambia el tema global. C02 define la matriz de los tres colores frente a los tres temas para demos existentes.
- **Dorado:** las apariciones activas se limitan al token semántico y al recuadro “Base incluida”, que comunica un valor incluido. No se usa en encabezados editoriales ni decoración pasiva.
- **Hero audiovisual:** sin configuración, el fallback y el contenido permanecen en el HTML/CSS. El camino habilitado valida ID y URL, crea un iframe con `autoplay`, `mute`, `playsinline`, controles no dominantes, nombre accesible y timeout de fallback. Pantalla pequeña, ahorro de datos y movimiento reducido seleccionan fallback. El ID de prueba no se guardó ni versionó. C04 registra PASS para los caminos habilitado y fallback.
- **AOS:** `npm ls aos --depth=0` informa `aos@2.3.4`; la dependencia está fijada exactamente y hay un único `AOS.init` en `AosController.astro`. Solo reciben `data-aos` los previews secundarios. CSS mantiene contenido visible sin inicialización y con movimiento reducido; se usan opacity y transform.
- **Mejora progresiva e historial:** la traza C05 registra Chrome/CDP para JavaScript deshabilitado, movimiento reducido, ancla `#showroom`, atrás y restauración de posición. El layout y el CTA no dependen de AOS ni del video.
- **Responsive:** la traza C05 registra Chrome/CDP a 320, 375, 390, 768, 1024 y 1440 px sin overflow horizontal.
- **Accesibilidad y estabilidad:** controles nativos con nombres y estado anunciado, foco visible, selección del color con marca además del color, iframe con `title`; temas y color de proyecto solo cambian tokens/variables, el video es una capa absoluta y AOS no altera el flujo del documento.
- **Build aislado:** `npm ci`, `npm ls aos` y `npm run build` se ejecutaron en un clon local temporal fijado al `HEAD` validado, porque el sandbox impidió crear metadata de `git worktree` dentro de `.git`. `astro check`: 0 errores, 0 avisos; build: PASS; 14 rutas generadas. `git diff --check` sobre el commit validado: PASS.

## Deuda preexistente

```text
PREEXISTING_CONTENT_DEBT=59381, 95081, 142681, "precio final"
PREEXISTING_DEPENDENCY_DEBT=3 high severity findings via @vercel/routing-utils → path-to-regexp
```

La auditoría previa de C05 determina que AOS no está implicado. Esta cápsula no modifica precios, etiquetas ni el adaptador Vercel.

## Decisiones

```text
GLOBAL_THEME y PROJECT_COLOR permanecen independientes.
Dorado queda reservado para acción o valor comercial.
Movimiento y video son mejoras progresivas.
El contenido informativo y comercial permanece accesible sin JavaScript y con movimiento reducido.
No se inició L04 ni se añadieron demos o secciones.
Los cambios locales ajenos fueron preservados.
```

```text
L03=PASS
NEXT_ALLOWED_CAPSULE=EVCOM-H01-L04-C01
```
