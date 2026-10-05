# EVCOM-H01-L07-GATE-R01 · Recuperación del Gate L07

- Cápsula: `EVCOM-H01-L07-GATE-R01`
- Rebaseline: `v0.5-launch-mvp`
- Rama: `feature/evaas-commerce-v04`
- BASE_SHA: `82d0f18b6272116bd58f8233b5b3546e32737e4d`
- Gate anterior: `EVCOM-H01-L07-GATE-V05` FAIL en `73f0f7bc085c096b110ede7288847530b44891cb` por una auditoría HIGH.
- Base remota aceptada: PASS; clon limpio, checkout de la rama y `pull --ff-only` terminaron exactamente en `82d0f18b6272116bd58f8233b5b3546e32737e4d`.
- Decisión de recuperación: **PASS_WITH_TEMPORARY_UPSTREAM_EXCEPTION**.

## Reconciliación del estado remoto

El commit remoto `82d0f18` fue preservado íntegramente como base; no se reseteó la rama a C05. `copy.env` se mantuvo sin cambios.

El escaneo inicial encontró 3 bloques de conflicto (9 líneas de marcadores) en Footer, ProductSelector y Términos. Se eliminaron los marcadores reteniendo el contenido validado por C05/C03A:

- Footer: EVAAS Commerce como experiencia comercial; ESPACIOS VIRTUALES SpA como empresa responsable; EVAAS Station como familia de activaciones.
- ProductSelector: “Evaluación asistida”, “Esta necesidad requiere una solución asistida”, arquetipo inferido y enlaces asistidos WhatsApp/correo; no se restauró el copy descartado ni se quitó el CTA.
- Términos: Versión 0.5 · Actualizado: 1 de octubre de 2026.

El escaneo global final de marcadores Git encontró 0 coincidencias. Reconciliación: `ebe5b4f4ee6c51a94418f39713123d0e37c3a37a` (`fix: reconcile H01 remote state after manual update`). Solo se incluyeron los tres paths conflictivos.

`copy.env` contiene únicamente variables públicas `PUBLIC_EV_*` conocidas: dominio, canales sociales, email, teléfono comercial y slots de video. No contiene valores `SECRET`, tokens, contraseñas, API keys, private keys ni credenciales de base de datos. `COPY_ENV_SECRETS=NONE`.

## Asesoría upstream CVE-2026-93748

- Advisory: `CVE-2026-93748` / `GHSA-ch52-4w7c-c8xp`, HIGH.
- Paquete instalado: `http-cache-semantics@4.2.0`.
- Cadena: `astro@7.3.5 → http-cache-semantics@4.2.0`.
- `npm view http-cache-semantics version`: `4.3.0`; `npm view astro version`: `7.3.5`.
- El advisory upstream declara afectados `<=4.2.0` y `Patched versions: None` al momento de esta evaluación.
- `4.3.0` es estable, pero no se aceptó como parche: su fuente oficial conserva la lógica vulnerable que permite satisfacer una respuesta stale mediante `max-stale` cuando `maxAge()` queda en cero por `Set-Cookie`. No se actualizó el lockfile ni se adoptó un paquete no verificado.
- `npm audit fix` sugiere una actualización, pero esa sugerencia no demuestra que la versión propuesta corrija esta lógica. Las auditorías siguen reportando exactamente 1 HIGH; no se bajó el audit-level ni se ocultó el resultado.

## Alcanzabilidad en H01

| Comprobación | Resultado | Evidencia |
|---|---|---|
| Uso directo de la app | NO | Sin `http-cache-semantics`, `CachePolicy`, `satisfiesWithoutRevalidation()` o `max-stale` en `src`, `astro.config.mjs` o `public`. |
| Uso ejecutable dentro de Astro | NO | En `node_modules/astro` el nombre aparece en `package.json`; el código ejecutable no lo importa ni lo llama. |
| Shared cache implementado por EVAAS | NO | No hay implementación ni almacenamiento compartido de respuestas HTTP. |
| `max-stale` externo llega a `CachePolicy` | NO | No hay consumidor de `CachePolicy`; el API solo lee content-type y cuerpo del POST. |
| `/api/activation` expone el camino | NO | No lee ni procesa `Cache-Control`; genera un handoff efímero y respuesta 303/JSON. |
| Remote-image pipeline | NO | Sin `astro:assets`, `getImage`, `<Image>`, `remotePatterns` o `domains` de imágenes. |
| Otro uso alcanzable directo/transitivo | NO | `npm ls` muestra solo la relación desde Astro; búsquedas de imports no hallan consumidores. Undici tiene una implementación propia de cache-control/max-stale, independiente de este paquete. |
| Símbolos en bundles producidos | NO | Búsqueda en `dist` y `.vercel` sin `http-cache-semantics`, `CachePolicy`, `satisfiesWithoutRevalidation` ni `max-stale`. |

Conclusión: `REACHABILITY=NO_REACHABLE_CURRENT_H01`. Es una clasificación de alcance para H01 en este SHA, no una declaración de que el paquete esté corregido o sea seguro en otros consumidores.

La excepción documentada está en `docs/security/EVCOM_H01_CVE_2026_93748_EXCEPTION.md`, commit `e0b29ba` (`docs: document H01 upstream security exception`). Triggers: versión upstream corregida; actualización/retiro de Astro; uso de imágenes remotas; implementación de cache compartido o manejo de `Cache-Control` del cliente; o endpoints H02 que usen esta política. Owner y seguridad revisarán el advisory antes de cada gate/release y al publicarse un parche.

## Build y smoke de regresión acotado

Después de resolver conflictos se ejecutó `npm ci` (349 paquetes; npm indicó 1 HIGH) y `npm run build`, también con los canales públicos de prueba de `copy.env` disponibles para compilar la rama WhatsApp. Resultado: Astro 0 errores, 0 warnings, 14 rutas. La compilación confirmó que el helper asistido de WhatsApp se incluye correctamente.

Smoke en Chrome headless sobre el artefacto estático a 390×844 y 1440×900:

- `/`: carga y footer con jerarquía C05 correcta.
- ProductSelector estándar: produce Landing Comercial.
- ProductSelector ecommerce: produce “Esta necesidad requiere una solución asistida” y “Punto de partida identificado: Catálogo de Productos”.
- `/terminos`: versión 0.5 y fecha 1 de octubre de 2026 presentes.
- `/activar/landing`: carga con H1 Landing Comercial.
- `/confirmacion`: carga con H1 “Tu punto de partida está listo”.
- Sin overflow horizontal de documento y 0 excepciones/errores de runtime reportados por el navegador.
- Los checks completos de C02/C04 no se repitieron.

## Seguridad actual y estado de L07

| Check | Resultado |
|---|---|
| `npm ci` | PASS · 349 paquetes; 1 HIGH reportado |
| `npm run build` | PASS · 0 errores, 0 warnings, 14 rutas |
| `npm audit --omit=dev --audit-level=high` | HIGH=1 · `http-cache-semantics@4.2.0` |
| `npm audit --audit-level=high` | HIGH=1 · `http-cache-semantics@4.2.0` |
| `npm ls path-to-regexp --all` | PASS · `path-to-regexp@6.3.0` |
| `npm ls http-cache-semantics --all` | `astro@7.3.5 → http-cache-semantics@4.2.0` |
| `git diff --check` | PASS |
| marcadores de conflicto restantes | 0 |
| auditoría reportada como limpia | NO · `npm audit high=1`, `KNOWN_UPSTREAM_ADVISORY=1` |

Ancestros del BASE_SHA confirmados: C01 attempt 2 `9ae9335a3149f90f311110a5e631e85d82424259`; C02 `f5beb6d2a5deac7a6026b9cb8cb02552cb7b5647`; C03 `588b2c27e1003345a868bfebc35d81d75f1601a1`; C03A `43cb949b21be8136ef7640f2cda4af8dc60acda6`; C04 `7c824120940fc87b23d83a2d5a53671073e2c35c`; C05 `73f0f7bc085c096b110ede7288847530b44891cb`.

## Tracks paralelos y pendientes

- Validación manual: `IN_PROGRESS` según C05.
- Deployment/Vercel: `IN_PROGRESS`; SHA desplegado no informado (`N/A`). Revalidación sobre el SHA recuperado: `YES` para footer, `/terminos`, etiquetas comerciales de WhatsApp y recomendación asistida.
- LinkedIn: URL exacta/render seguro `PASS`; navegador real `MANUAL_PENDING`.
- Pagos/checkout siguen fuera de H01; automatización de cupones fuera de H01; orden durable/idempotencia H02.
- La excepción debe revisarse al publicarse un parche upstream y no se extiende automáticamente a otros alcances.

## Decisión

- `STATUS=PASS_WITH_TEMPORARY_UPSTREAM_EXCEPTION`.
- La divergencia remota quedó reconciliada sin descartar el commit manual.
- Marcadores de conflicto: 0.
- Semántica C03A/C04/C05 preservada; build y smoke mínimo limpios.
- Hallazgo upstream HIGH conservado y reportado con exactitud; no hay parche verificable y el camino vulnerable no es alcanzable desde H01.
- Cambios funcionales nuevos: ninguno.
- Alcance expandido: NO.
