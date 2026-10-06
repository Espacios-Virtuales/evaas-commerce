# EVCOM-H02-L01 · Pricing v0.6 y CiberDay

## Cápsulas

- C01 actualizó el pricing público a valores finales de $120.000, $160.000 y $180.000, sin desglose de IVA.
- C02 incorporó la única regla puntual `CIBERDAY`: 15 % de descuento, vigente del 6 al 8 de octubre de 2026 (America/Santiago), con popup accesible y persistencia de cierre por sesión.
- C03 (`c8616f9`) hizo que `POST /api/activation` sea la autoridad del precio y migró el handoff a V2.

## Autoridad de precios

- La API toma únicamente `product` y el `campaignCode` opcional para resolver el precio. Los campos de precio recibidos desde cliente (`price`, `basePrice`, `discountRate`, `discountAmount` y `total`) no participan en el cálculo.
- Sin campaña: Landing $120.000, Catálogo $160.000 y Corporativa $180.000; descuento 0 y `campaignCode=null`.
- Con `CIBERDAY` (también normalizado desde `ciberday` o `CiberDay`): Landing $102.000, Catálogo $136.000 y Corporativa $153.000; descuento 15 % y `campaignCode=CIBERDAY`.
- `CYBERDAY` devuelve 400 con código no válido. `CIBERDAY` fuera de vigencia o desactivado devuelve 400 con código no vigente.

## Handoff y WhatsApp

- El handoff usa `version: 2` y `evaas_activation_handoff_v2`.
- Su pricing se vuelve a calcular desde la fuente canónica usando producto, código y momento de creación; valores manipulados no se aceptan.
- El brief normal incluye producto, valor final, documento, color, proyecto, categoría, dominio, objetivo cuando exista y referencia.
- El brief CiberDay agrega valor normal, “Descuento CiberDay: 15%”, código y valor final.
- El sistema solo prepara o abre WhatsApp. No hay envío automático: la persona usuaria revisa el texto y pulsa Enviar.

## Validación C03

- Matriz SSR de API: tres productos normales y tres CiberDay, UUID y handoff V2: PASS.
- Manipulación `total=1`: el servidor devolvió el total canónico: PASS.
- Código inválido y campaña desactivada: 400 explícito: PASS.
- Builders de WhatsApp normal y CiberDay: PASS.
- Smoke de artefacto compilado: `/`, tres productos, tres activaciones, términos y confirmación: 200 tras redirección canónica. La activación CiberDay mostró `$102.000` y el código aplicado.
- `npm ci`, `npm run build` (0 errores, 0 advertencias) y `git diff --check`: PASS.

## Exclusiones

- Sin checkout, pagos, CRM, órdenes durables, motor genérico de cupones ni promoción a `main`.
- Las trazas H01, la excepción CVE y la arquitectura de pagos no fueron modificadas.
