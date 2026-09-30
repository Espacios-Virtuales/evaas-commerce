# EVCOM-H01-L07-C01 · Attempt 2 · Remediación técnica

- **Cápsula:** `EVCOM-H01-L07-C01-R01`
- **Rama:** `feature/evaas-commerce-v04`
- **Base:** `87169bf3659010db40fc9547f980b7607cbb021d`
- **Intento 1:** `87169bf3659010db40fc9547f980b7607cbb021d`, con estado FAIL por advisory alto en la dependencia de routing del adapter Vercel.
- **Decisión C01:** **PASS · ATTEMPT=2**. La dependencia afectada se fijó en una versión corregida, las auditorías high/critical quedaron en cero y los controles de build y output pasaron.

## Aislamiento y entorno

Se hizo `git fetch origin`. `origin/feature/evaas-commerce-v04` apuntaba al SHA base indicado. El worktree principal seguía en `d79d9300eb0d16f473991b16fcc683133968d12c`, detrás de la rama remota, con cambios externos sin stage en:

- `src/components/Footer.astro`
- `src/layouts/BaseLayout.astro`
- `src/pages/demos/[slug].astro`
- `src/pages/index.astro`

Esos cambios permanecieron intactos. La remediación y validación ocurrieron en el clon aislado `/tmp/evcom-h01-l07-c01-r01`, limpio al iniciar y en el commit base esperado.

| Dato | Resultado |
| --- | --- |
| Node | `v24.18.0` |
| npm | `11.16.0` |
| Astro | `7.3.5` |
| `npm ci` inicial | PASS: 349 paquetes instalados; árbol vulnerable reproducido. |
| `npm ci` posterior | PASS: 349 paquetes; npm informó 0 vulnerabilidades. |
| `npm ci` final de reproducibilidad | PASS; los SHA-256 de `package.json` y `package-lock.json` antes y después fueron idénticos. |
| Lockfile | Versión 3; reproducible desde `package.json` y lockfile. |
| `git diff --check` | PASS. |

## Advisory antes y resolución después

Antes de editar, `npm ls` reprodujo exactamente:

```text
@astrojs/vercel@11.0.11
└── @vercel/routing-utils@6.6.0
    └── path-to-regexp@6.1.0
```

El audit previo reportó **3 entradas high**, **0 critical**, todas pertenecientes a la misma cadena/advisory `GHSA-9wv6-86v2-598j` (npm source ID `1101846`, backtracking en expresiones regulares de `path-to-regexp`). `fixAvailable` de npm proponía `@astrojs/vercel@8.0.4`, un cambio major del adapter.

La remediación fue el override mínimo raíz aprobado. No se modificaron Astro ni el adapter, no se añadió dependencia directa, y el alias upstream `path-to-regexp-updated@npm:path-to-regexp@6.3.0` quedó intacto.

```text
@astrojs/vercel@11.0.11
└── @vercel/routing-utils@6.6.0
    └── path-to-regexp@6.3.0 overridden
```

`npm ls path-to-regexp --all` no mostró otra versión activa; `6.1.0` ya no aparece en la cadena afectada. `npm audit --omit=dev --audit-level=high` y `npm audit --audit-level=high` finalizaron con código 0 y reportaron 0 vulnerabilidades. El JSON posterior también indica 0 info, 0 low, 0 moderate, 0 high y 0 critical.

## Alcance del diff y commits

El único diff funcional fue `package.json` con el override y `package-lock.json` con la sustitución de la resolución de `path-to-regexp` de `6.1.0` a `6.3.0` (URL e integrity asociadas). No hubo churn de dependencias ajenas. No se modificaron `src/pages/`, `src/components/`, `src/lib/`, `src/data/` ni `src/styles/`; el comportamiento de aplicación H01 quedó sin cambios.

- **FIX_SHA:** `d4ac0df9d6a86a591b747a95d324c7a2d81398e0` (commit `fix: remediate Vercel routing dependency advisory`).
- El commit de fix contiene únicamente `package.json` y `package-lock.json`; `git diff --cached --check` pasó antes de crearlo.

## Build, routing y controles C01

| Control | Resultado |
| --- | --- |
| `npm run build` | PASS. Astro check: 0 errores, 0 warnings, 0 hints; 14 rutas prerenderizadas. |
| `.vercel/output/config.json` | JSON parseable; `VERCEL_CONFIG_JSON_PASS`; config version 3. |
| Routing Vercel | PASS. Config conserva filesystem, mapea `^/api/activation/?$` a `_render`, y no contiene redirects ni rewrites adicionales. |
| Smoke de artefactos | PASS para `/`, productos Landing/Catálogo/Corporativa, demos Landing/Catálogo/Corporativa, activar Landing/Catálogo/Corporativa, confirmación, términos, privacidad y handler `/api/activation`. Las páginas estáticas existen bajo `.vercel/output/static`; config y entry del handler contienen `/api/activation`. |
| `astro preview` | No quedó listo: el proceso salió con `Preview server process exited before becoming ready`. No hay CLI `vercel` ni harness smoke específico en el repositorio. Se usó el output/handler Vercel generado como fallback permitido; no se cambió el adapter. |
| Secret scan público | Sin secretos, claves privadas ni credenciales privadas de pago. |
| Placeholders productivos | Ninguno entre los patrones auditados. |
| `PENDING_OWNER_INPUT` público | Ninguno. |
| Precios obsoletos | Ninguna coincidencia. |
| Precios contractuales | PASS: Landing 99.000 / 117.810; Catálogo 129.000 / 153.510; Corporativa 149.000 / 177.310; IVA 19 %. Se mantuvo el modelo fuente de verdad existente. |
| Pagos, cupones y CRM/webhook | Sin implementación de pagos, motor de cupones o dependencias CRM/webhook activas. `coupon: null` sigue siendo solo un campo del schema. |
| Aplicación H01 | Sin cambios funcionales. |

Los scans repetidos no encontraron `PENDING_OWNER_INPUT`, precios antiguos, patrones de implementación de pago, motor de cupones, `ACTIVATION_WEBHOOK_URL` ni referencias operativas a HubSpot, Airtable, Supabase, Firebase o CRM lead.

## Alcance diferido

- Verificación manual de LinkedIn: `MANUAL_REQUIRED` para release posterior.
- Viewports reales 320/360/390: L07-C02; no se marcaron como validados en C01.
