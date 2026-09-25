# EVAAS Commerce · EVAAS Station

Showroom comercial construido en Astro para presentar, comparar y solicitar una Activación Digital.

## Desarrollo

```bash
npm install
npm run dev
```

## Validación

```bash
npm run build
```

## Integración de activaciones

La interfaz envía un `POST` JSON a `/api/activation`. El endpoint valida la solicitud y la reenvía a `ACTIVATION_WEBHOOK_URL`. En producción, si la variable no existe, el formulario informa que el canal no está conectado y no confirma el envío.

Variables opcionales `CHECKOUT_URL_LANDING`, `CHECKOUT_URL_CATALOGO` y `CHECKOUT_URL_CORPORATIVA` permiten continuar a un checkout externo después de registrar la solicitud. Copiar `.env.example` como `.env` para desarrollo local.

Antes de producción se recomienda añadir protección antiabuso en el formulario y conectar el webhook con el CRM, sistema de órdenes o automatización operativa elegida.

## Medición

Los eventos se envían a `window.dataLayer` y también se publican como `evaas:track`:

- `product_viewed`
- `demo_opened`
- `demo_completed`
- `plan_compared`
- `product_selected`
- `activation_started`
- `activation_submitted`
- `activation_completed`
- `activation_error`
- `selector_completed`

No se incorporan datos personales a los eventos de analítica.
