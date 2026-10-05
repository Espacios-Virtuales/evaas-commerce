# EVCOM-H01-L08-C02-R01 · Promoción del release H01 a main

- Cápsula de recuperación: `EVCOM-H01-L08-C02-R01` (el intento anterior quedó `BLOCKED_DEPLOYMENT_CONTEXT` antes de modificar main).
- Rebaseline: `v0.5-launch-mvp`.
- Rama fuente: `develop` · SHA: `56f72eb10121d5730a580db45e9fce4dd4f3564f`.
- Rama destino: `main` · SHA previo: `f113fb06078dbc875b563bc263b52d6d9bce8361`.
- Relación previa: main era ancestro de develop; `main...develop` = 0/5.
- El workspace local estaba en `main` en el SHA base; el merge se realizó en el clon limpio `/tmp/evaas-l08-c02`.

## Contexto Vercel confirmado antes de promover

- Proveedor: Vercel. Proyecto existente `evaas-commerce`, ID `prj_g9P3dYb61ztlCFix0wM2olpxbY9J`.
- Team/display: `David's projects`; team/account ID (`accountId`): `team_m8yegrlgHJB5OUB4vvMHMNai`.
- Git conectado: GitHub `Espacios-Virtuales/evaas-commerce`.
- Production branch verificada mediante la API del proyecto: `main`.
- Framework Astro; Node.js `24.x`.
- Alias de producción: `https://evaas-commerce.vercel.app`.
- Deployment Protection: `ON` según contexto confirmado por el owner.
- El proyecto no se creó ni se cambió de configuración; no se modificó DNS.
- `vercel whoami`: `dutreras369-2699` (CLI 62.2.0); la consulta de proyecto/lista se hizo dentro del team confirmado.

## Tooling local y variables

- La instalación accidental de la CLI fue solo el delta de `package.json` (devDependency `vercel`) y su lockfile. Se restauraron ambos al baseline con `git restore -- package.json package-lock.json`; después no quedó diff en esos archivos.
- El cambio separado del owner a `.gitignore` se preservó. `.env.local`, `.vercel/project.json` y `.vercel/.env.production.local` están ignorados; no se imprimieron ni se staged secrets. No se añadió Vercel CLI a los manifiestos del producto.
- `vercel env ls` confirmó los once nombres públicos requeridos en Production. El provider clasifica los catorce valores de entorno como sensibles; `env pull` devolvió `[SENSITIVE]` para ellos. No se copiaron ni expusieron valores.
- `PUBLIC_EV_YOUTUBE_VIDEO_ENABLED`: presente; valor no comprobable en el pull porque Vercel lo redacted. El owner fue consultado para confirmar `false` o configuración `true` válida; no inferir el valor a partir de los placeholders.

## Deployments manuales anteriores

Ambos son `PRE_RELEASE_MANUAL`; no se usan como release final. Vercel los muestra `READY`, `target=production`, pero la inspección no contiene Git SHA/ref:

| URL | Deployment ID | Estado/entorno | Git SHA |
|---|---|---|---|
| `evaas-commerce-k33iat5ir-davids-projects-2b733fec.vercel.app` | `dpl_36AV9z3CcCm3RjumLcy1EUaFHiCa` | READY / production | no asociado |
| `evaas-commerce-98y6w492x-davids-projects-2b733fec.vercel.app` | `dpl_3PaXkeWiwPU3qhcoTyLorjf3KfwY` | READY / production | no asociado |

## Promoción, build y seguridad

- Se integró `origin/develop` en main con `git merge --no-ff`, mensaje `merge: promote EVAAS Commerce H01 v0.5`; conflictos: 0.
- `CODE_RELEASE_SHA=48fba82dd467a8ba5859323139c6138989dd2d70`. Padres: main previo `f113fb06078dbc875b563bc263b52d6d9bce8361` y develop `56f72eb10121d5730a580db45e9fce4dd4f3564f`.
- `npm ci`: PASS, 349 paquetes, 1 HIGH (sin los paquetes de Vercel CLI en el lockfile).
- `PUBLIC_EV_WHATSAPP=56979959180 npm run build`: PASS; Astro 0 errores, 0 warnings, 14 rutas.
- `git diff --check`: PASS; marcadores de conflicto: 0.
- `npm audit --omit=dev --audit-level=high`: 1 HIGH; `npm audit --audit-level=high`: 1 HIGH; CRITICAL: 0.
- El único HIGH es `CVE-2026-93748` / `GHSA-ch52-4w7c-c8xp`, `http-cache-semantics@4.2.0` vía `astro@7.3.5`; excepción upstream temporal retenida, `NO_REACHABLE_CURRENT_H01`. No se declaró audit limpio.
- `path-to-regexp@6.3.0`; `http-cache-semantics@4.2.0`.
- Smoke local acotado: `/`, ProductSelector standard/assisted ecommerce, `/productos/landing`, `/activar/landing`, `/confirmacion`, `/terminos`, `/privacidad`; 390×844 y 1440×900. PASS; 0 errores de runtime, overflow horizontal, helper WhatsApp compilado y footer/terms intactos. No es smoke productivo C03.

## Push y deployment Git del código

- Pre-push, `origin/main=f113fb06078dbc875b563bc263b52d6d9bce8361` y `origin/develop=56f72eb10121d5730a580db45e9fce4dd4f3564f`; ambas refs coincidían con lo esperado.
- Push normal `main`: PASS; sin force.
- Después del push: local main y `origin/main` = `48fba82dd467a8ba5859323139c6138989dd2d70`; `origin/develop` siguió en `56f72eb10121d5730a580db45e9fce4dd4f3564f`.
- Deployment Git asociado mediante `githubCommitSha=CODE_RELEASE_SHA`: ID `dpl_D7i1JeYW6Ms48AsdoU3Gh25g7cKL`; URL `https://evaas-commerce-4s68vbl4s-davids-projects-2b733fec.vercel.app`; `READY`, `production`, repo `Espacios-Virtuales/evaas-commerce`, branch `main`, SHA exacto `48fba82dd467a8ba5859323139c6138989dd2d70`.
- Vercel asignó el alias de producción `evaas-commerce.vercel.app` a este deployment.
- No se ejecutó `vercel --prod`; se esperó el deployment Git automático.

## Siguientes pasos

- La traza es un commit documental posterior al CODE_RELEASE_SHA. Al ser `main` la production branch, puede disparar un segundo deployment; se comprobará y esperará READY para el SHA de la traza antes de cerrar.
- Para L08-C03: smoke productivo sobre el SHA final de la traza; LinkedIn real-browser si sigue pendiente; revisión de la excepción upstream cuando haya parche.
- Pagos/checkout permanecen fuera de H01; automatización de cupones fuera de H01; orden durable/idempotencia pertenece a H02.
