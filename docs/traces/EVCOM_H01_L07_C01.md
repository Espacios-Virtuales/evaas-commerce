# EVCOM-H01-L07-C01 · Build y controles técnicos · Launch MVP v0.5

- **Base:** `d79d9300eb0d16f473991b16fcc683133968d12c`
- **Rama:** `feature/evaas-commerce-v04`
- **Estado:** **FAIL**. Los controles solicitados de instalación, build, código público y limpieza pasan; `npm audit` detectó una vulnerabilidad alta en una dependencia de la integración de Vercel. La cápsula prohíbe actualizar dependencias, por lo que el hallazgo queda sin corrección y C02 no se habilita todavía.
- **Alcance:** validación técnica del HEAD aislado. Sin cambios funcionales ni ampliación de producto.

## Aislamiento y entorno

El worktree principal estaba en la rama y SHA esperados, con modificaciones externas sin stage en `src/components/Footer.astro`, `src/layouts/BaseLayout.astro`, `src/pages/demos/[slug].astro` y `src/pages/index.astro`. Permanecieron intactas. `git worktree add` fue impedido por la protección de escritura de `.git`; la validación autoritativa se hizo en un clon local limpio en `/tmp/evcom-h01-l07-c01` del mismo SHA.

| Control | Resultado |
| --- | --- |
| Node | `v24.18.0` |
| npm | `11.16.0` |
| Astro (`npx astro --version`) | `7.3.5` |
| Sistema | `Linux adareloise-ubuntu-PC02 6.8.0-79-generic #79-Ubuntu SMP PREEMPT_DYNAMIC Tue Aug 12 14:42:46 UTC 2025 x86_64 GNU/Linux` |
| Compatibilidad de engines | PASS para esta plataforma. Se comprobaron 231 restricciones Node/npm del lockfile; la única discrepancia es `@img/sharp-win32-ia32`, paquete opcional exclusivo de Windows x86. Astro 7.3.5 exige Node `>=22.12.0` y npm `>=9.6.5`. |
| `package-lock.json` | Presente, `lockfileVersion: 3` |
| `npm ci` | PASS: 349 paquetes instalados. El primer intento en sandbox falló con `EPERM` al ejecutar `esbuild`; la repetición autorizada fuera de esa restricción pasó. |
| `package.json` y `package-lock.json` | Sin diferencias antes ni después de `npm ci` y los builds. Sin upgrades ni paquetes agregados. |
| Scripts | `dev`, `build`, `preview`, `astro` presentes; `lint`, `test`, `typecheck` y `check` independientes: N/A. `build` ejecuta `astro check && astro build`. |

## Build y calidad pública

| Control | Resultado |
| --- | --- |
| `npm run build` sin variables públicas opcionales | PASS; Astro check: 0 errores, 0 warnings, 0 hints; 14 rutas prerenderizadas. |
| Build con configuración pública contractual de `.env.example` | PASS; 0 errores, 0 warnings, 0 hints; 14 rutas. No se cargaron secretos. |
| `git diff --check` | PASS antes de la traza. |
| Secret scan en `src/`, `public/`, `.env.example` | Sin claves privadas, tokens, passwords ni credenciales expuestas. La coincidencia de `url.password` en `public-channels.ts` es una comprobación que rechaza credenciales embebidas en URLs. |
| Placeholders productivos | Ninguno para `example.com`, `localhost`, `127.0.0.1` o `javascript:void`. |
| `PENDING_OWNER_INPUT` público | Ninguno. |
| `TODO/FIXME/XXX` | `NONE`. La única coincidencia textual es `MÉTODO` en contenido de una demo corporativa; no es una tarea pendiente. |
| Precios obsoletos | Ninguna coincidencia de `120000`, `160000`, `220000` ni de sus formatos CLP indicados. |
| Precios contractuales | PASS. `src/data/products.ts`: Landing 99.000 neto / 117.810 total; Catálogo 129.000 / 153.510; Corporativa 149.000 / 177.310. `commercial-context.ts` calcula y comprueba IVA de 19 %. Las vistas consumen el modelo de productos; no existen `PUBLIC_LANDING_PRICE`, `PUBLIC_CATALOG_PRICE` ni `PUBLIC_CORPORATE_PRICE`. |
| Pagos, cupones, CRM/webhook | Sin implementaciones activas ni referencias operativas a los patrones auditados. `coupon: null` en `CommercialContext` es parte del schema, no un motor de cupones. Las exclusiones editoriales de pasarelas de pago no constituyen implementación. |
| Canales oficiales | `.env.example` contiene `https://espaciosvirtuales.cl`, LinkedIn `evaas369`, Instagram `evaas963`, Facebook `espaciosvirtuales963`, YouTube `@evaas963`, `info@espaciosvirtuales.lat` y WhatsApp `56979959180`. |
| Archivos sensibles y artefactos | Ningún `.env` real trackeado; `.gitignore` cubre `.env`, `.env.*`, `dist`, `.vercel` y `node_modules`, con excepción explícita para `.env.example`. Sin logs, screenshots, coverage, tmp, credenciales o fixtures temporales versionados. Los outputs de build quedaron ignorados y no stageados. |
| Estado Git del clon tras validar | Limpio antes de crear esta traza; ningún artefacto de validación stageado. |

## Hallazgo técnico bloqueante

`npm ci` informó tres entradas de severidad alta. `npm audit --json` confirmó que son una sola cadena de advisory: `@astrojs/vercel@11.0.11` → `@vercel/routing-utils@6.6.0` → `path-to-regexp@6.1.0`, asociada a [GHSA-9wv6-86v2-598j](https://github.com/advisories/GHSA-9wv6-86v2-598j) (expresiones regulares con backtracking, CVSS 7.5). La función generada por la integración de Vercel importa `@vercel/routing-utils`; no se ha demostrado una ruta explotable en este proyecto, pero tampoco se puede descartar el riesgo desde esta validación. El primer `npm audit` falló por DNS del sandbox; la repetición autorizada respondió correctamente.

No se ejecutó `npm audit fix`, `npm install`, `npm update` ni se regeneró el lockfile. La corrección requiere una cápsula de dependencias que permita evaluar y validar versiones compatibles. **Corrección funcional requerida en C01: NO. Fix commit: N/A.** No se hizo una modificación técnica encubierta en el commit documental.

## Pendientes y alcance posterior

- Remediar o justificar formalmente la dependencia vulnerable y repetir C01 antes de habilitar `EVCOM-H01-L07-C02`.
- Verificación manual de LinkedIn por HTTP 999: `MANUAL_VERIFICATION_REQUIRED` para release posterior; no bloquea este control técnico.
- Viewports CSS reales 320/360/390: pertenecen a L07-C02; no se marcan como PASS aquí.
