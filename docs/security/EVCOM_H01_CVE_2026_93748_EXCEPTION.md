# Excepción temporal upstream · CVE-2026-93748

- Fecha de evaluación: 2026-10-05
- Advisory: CVE-2026-93748 · GHSA-ch52-4w7c-c8xp
- Paquete instalado: `http-cache-semantics@4.2.0`
- Severidad upstream: HIGH
- Estado: `SECURITY_EXCEPTION=TEMPORARY_UPSTREAM_NO_PATCH`
- Clasificación para el alcance actual: `REACHABILITY=NO_REACHABLE_CURRENT_H01`

## Estado de parche

El advisory upstream afecta versiones hasta `4.2.0` y no lista una versión corregida. `npm view` informa `4.3.0` como versión estable más reciente, pero su fuente oficial conserva la rama afectada de `max-stale` y el tratamiento de respuestas con `Set-Cookie`; el cambio de publicación no corrige esa lógica. Por ello `4.3.0` no se considera un parche de esta vulnerabilidad. No se cambió el lockfile, no se usó Astro beta y no se redujo el nivel de auditoría.

El advisory reporta que una directiva `max-stale` suministrada a una `CachePolicy` en un shared cache puede permitir reutilizar respuestas con credenciales de sesión. Esta excepción no significa que la vulnerabilidad esté corregida. Las auditorías runtime y completas siguen reportando exactamente **1 HIGH**.

## Cadena de dependencia y uso

Cadena: `astro@7.3.5 → http-cache-semantics@4.2.0`.

En `node_modules/astro`, el nombre aparece en `package.json` como dependencia, pero no hay import, `require`, llamada a `CachePolicy` ni uso de `satisfiesWithoutRevalidation()` en el código ejecutable de Astro. La búsqueda completa de dependencias no encuentra consumidores del paquete fuera de sí mismo. `undici` contiene una implementación propia de cache-control/max-stale, pero no importa ni usa `http-cache-semantics`.

En EVAAS Commerce:

- No hay uso directo de `http-cache-semantics`, `CachePolicy`, `satisfiesWithoutRevalidation()` ni `max-stale` en `src`, `astro.config.mjs` o `public`.
- No se implementa un shared cache de respuestas.
- No existe un pipeline/end point de imágenes remotas: no hay uso de `astro:assets`, `getImage`, `<Image>`, `remotePatterns` o `domains`.
- `/api/activation` consume el `content-type` y el cuerpo del POST; no pasa headers de caché del cliente a una política de cache. Crea una respuesta de handoff y no comparte ni almacena respuestas HTTP.
- La compilación de aplicación (`dist` y `.vercel`) no incluye `http-cache-semantics`, `CachePolicy`, `satisfiesWithoutRevalidation` ni su rama `max-stale`.

Reachability:

| Condición | Evaluación |
|---|---|
| Aplicación implementa shared cache con el paquete | NO |
| Request externa de H01 entrega `max-stale` a `CachePolicy` | NO |
| H01 llama `satisfiesWithoutRevalidation()` con datos de usuario | NO |
| `/api/activation` expone esa ejecución | NO |
| Pipeline/configuración de imágenes remotas de la app | NO |
| Otro uso directo/transitivo alcanzable del paquete | NO |

Conclusión: `REACHABILITY=NO_REACHABLE_CURRENT_H01`. Esta conclusión está limitada al código y a los endpoints de H01 en el SHA revisado; no afirma que el paquete sea seguro en otros consumidores o arquitecturas.

## Condiciones compensatorias y alcance

La dependencia está instalada como dependencia transitiva de Astro, pero el código de H01 no la ejecuta y los bundles de runtime no la contienen. No existe un cache compartido que pueda exponer respuestas de usuarios. Las auditorías permanecen visibles como `npm audit high=1` y `KNOWN_UPSTREAM_ADVISORY=1`; no se modifica la política de auditoría.

La excepción cubre únicamente H01 en el commit de recuperación de L07. No autoriza introducir cache compartido, pasar headers `Cache-Control` del cliente a una `CachePolicy`, activar imágenes remotas o ampliar el alcance de los endpoints.

## Triggers de revisión

Reabrir esta evaluación cuando ocurra cualquiera de estos cambios:

- `http-cache-semantics` publique una versión estable con el arreglo verificable;
- Astro actualice o retire esta dependencia;
- EVAAS empiece a usar imágenes remotas de Astro;
- EVAAS implemente cache compartido o manejo de `Cache-Control` del cliente;
- H02 incorpore endpoints que usen esta política.

Seguimiento: el owner del proyecto y seguridad deben revisar la versión upstream antes de cada gate/release y reevaluar al publicarse un parche. Hasta entonces, no declarar la auditoría limpia ni extender esta excepción a otros productos.
