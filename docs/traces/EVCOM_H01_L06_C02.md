# EVCOM-H01-L06-C02 — Enlaces oficiales y footer

**Estado:** PASS
**Base:** `959627bb934d0e4b490cb60fcc310b3757e25d66`
**Rebaseline:** Launch MVP v0.5

## Fuente y configuración

Se usó `docs/contracts/commerce-v04/brand-content.md`. `.env.example` ya contenía los destinos oficiales, email, WhatsApp y flags contractuales, por lo que no se cambió. La aplicación lee la configuración al render/build; `.env.example` no configura por sí solo el entorno productivo.

Se centralizó el consumo en `src/lib/public-channels.ts`:

- Las URLs web deben parsearse como HTTPS y no pueden contener credenciales. Se conserva la URL configurada al renderizar.
- LinkedIn, Instagram y Facebook requieren URL HTTPS válida y flag exactamente igual a `true`.
- YouTube usa la URL del canal, no requiere ni depende del flag del video del Hero.
- Email reutiliza `getSalesEmail`; WhatsApp reutiliza `getWhatsAppConfig` de `src/lib/whatsapp.ts`. El contacto del footer usa el `baseUrl` genérico, sin crear mensaje, referencia ni handoff.
- Los campos públicos se tiparon en `src/env.d.ts`. No se agregaron secretos ni variables de pagos/precios.

## Footer

- Identifica EVAAS Station como una activación digital de ESPACIOS VIRTUALES SpA, RUT 78.428.352-6.
- Incluye el sitio oficial, correo comercial, WhatsApp genérico, LinkedIn, Instagram, Facebook, YouTube y navegación legal cuando su configuración es válida.
- Cada enlace social tiene icono SVG local decorativo y etiqueta visible. Enlaces externos abren de forma segura con `rel="noopener noreferrer"`; correo y páginas legales mantienen su navegación apropiada.
- Los links tienen altura mínima de 44 px y foco visible. La raíz `.site-footer` se mantiene, por lo que sigue funcionando el `IntersectionObserver` del CTA flotante y `.is-footer-adjacent`.
- Se conservó exactamente “Empieza y luego crece.” No se añadieron RSS, canales adicionales, precios, promoción, pagos ni SDKs.

## Casos de configuración

- Configuración productiva cargada explícitamente desde los valores contractuales: sitio, correo, WhatsApp y las cuatro redes aparecen en el HTML renderizado con destinos exactos.
- Configuración parcial: sitio/email/WhatsApp ausentes, LinkedIn habilitado, Instagram deshabilitado, Facebook sin URL y YouTube de canal válido con `PUBLIC_EV_YOUTUBE_VIDEO_ENABLED=false`. Solo LinkedIn y YouTube aparecen; el canal no depende del video del Hero.
- Configuración inválida: sitio `javascript:`, Instagram `javascript:`, Facebook `#`, YouTube `http:`, email inválido y WhatsApp inválido no producen enlaces. LinkedIn válido con flag `false` permanece oculto.
- Build sin variables públicas: los contactos/sociedades no configurados quedan ocultos, no hay grupos vacíos de contacto ni errores; identidad y enlaces legales permanecen.
- Búsquedas de placeholders, RSS y usos dispersos de variables sociales no encontraron implementación adicional. No existe una segunda construcción de `wa.me` en el footer.

## Verificación de destinos oficiales

Se comprobó la respuesta HTTP con redirects:

- `https://espaciosvirtuales.cl` → HTTP 200, redirige a `/ecosystem/`.
- Instagram, Facebook y YouTube → HTTP 200.
- LinkedIn → HTTP 999; el destino coincide exactamente con el contrato, pero el endpoint requiere verificación manual por el bloqueo de solicitudes automatizadas.

## Accesibilidad y responsive

Chromium headless verificó el footer bajo temas dark, light y cyan en viewports CSS de 500, 768, 1024 y 1440 px. No hubo overflow. La grilla pasa a una columna en 500 px, dos en 768 px y cuatro en 1024/1440 px. Los enlaces externos tienen `target="_blank"` junto con `rel="noopener noreferrer"`; los enlaces del footer se renderizan en HTML sin JavaScript. Las reglas globales de foco visible siguen aplicando.

La comprobación real de 320/360/390 px permanece para L07.

## Build y cambios locales preservados

- `npm run build`: PASS, 14 rutas, 0 errores, 0 warnings. Se verificó tanto sin configuración como con valores productivos explícitos.
- `git diff --check`: PASS.
- Se preservaron los hunks locales previos en `src/layouts/BaseLayout.astro`, `src/pages/demos/[slug].astro`, `src/pages/index.astro` y el descriptor “Claro · Seguro · Evolutivo” de `src/components/Footer.astro`. Solo los cambios C02 del footer se stagean.

## Decisión

Los canales públicos dependen de configuración válida al build/deploy y los destinos ausentes o inválidos no se publican. RSS queda explícitamente fuera. El canal YouTube del footer es independiente del video del Hero. El contacto WhatsApp es genérico y no cambia el handoff manual de L05.
