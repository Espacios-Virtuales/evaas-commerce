import type { APIRoute } from 'astro';

export const prerender = false;

const allowedProducts = new Set(['landing', 'catalogo', 'corporativa']);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RequestMode = 'json' | 'form';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]!);
}

function errorResponse(mode: RequestMode, message: string, status: number, product = '') {
  if (mode === 'json') return Response.json({ message }, { status });
  const safeProduct = allowedProducts.has(product) ? product : '';
  const returnHref = safeProduct ? `/activar/${safeProduct}` : '/';
  return new Response(`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>No se pudo enviar la solicitud</title><main><h1>No se pudo enviar la solicitud</h1><p>${escapeHtml(message)}</p><p><a href="${returnHref}">Volver al formulario de activación</a></p></main></html>`, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function nativeSuccessResponse(requestUrl: string, product: string, requestId: string, checkoutUrl: string | null = null) {
  const destination = checkoutUrl || `/confirmacion?producto=${encodeURIComponent(product)}&id=${encodeURIComponent(requestId)}`;
  return new Response(null, { status: 303, headers: { Location: new URL(destination, requestUrl).toString() } });
}

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() || '';
  const mode: RequestMode = contentType === 'application/json' ? 'json' : 'form';
  let input: Record<string, any>;
  try {
    if (contentType === 'application/json') {
      input = await request.json();
    } else if (contentType === 'application/x-www-form-urlencoded' || contentType === 'multipart/form-data') {
      input = Object.fromEntries(await request.formData());
    } else {
      return errorResponse(mode, 'Formato de solicitud no válido.', 415);
    }
  } catch {
    return errorResponse(mode, 'No fue posible leer la solicitud.', 400);
  }

  const product = String(input.product || '');
  if (input.website) {
    const requestId = crypto.randomUUID();
    return mode === 'json' ? Response.json({ ok: true, requestId }) : nativeSuccessResponse(request.url, product, requestId);
  }

  if (mode === 'json') {
    const elapsed = Date.now() - Number(input.formStartedAt || 0);
    if (!Number.isFinite(elapsed) || elapsed < 1200 || elapsed > 86_400_000) {
      return errorResponse(mode, 'La sesión expiró. Actualiza la página e intenta nuevamente.', 400);
    }
  }

  const name = String(input.name || '').trim().slice(0, 80);
  const email = String(input.email || '').trim().toLowerCase().slice(0, 160);
  const project = String(input.project || '').trim().slice(0, 100);
  const domainStatus = String(input.domainStatus || '');
  if (!allowedProducts.has(product) || !name || !project || !emailPattern.test(email) || !['owned', 'needed', 'unsure'].includes(domainStatus) || input.consent !== 'on') {
    return errorResponse(mode, 'Revisa los datos obligatorios antes de continuar.', 400, product);
  }

  const requestId = crypto.randomUUID();
  const payload = {
    id: requestId,
    type: 'evaas_station_activation',
    createdAt: new Date().toISOString(),
    product,
    name,
    email,
    project,
    domainStatus,
    whatsapp: String(input.whatsapp || '').trim().slice(0, 30),
    context: String(input.context || '').trim().slice(0, 600),
    attribution: {
      source: String(input.attribution?.source || 'direct').slice(0, 100),
      medium: String(input.attribution?.medium || '').slice(0, 100),
      campaign: String(input.attribution?.campaign || '').slice(0, 100)
    }
  };

  const webhookUrl = import.meta.env.ACTIVATION_WEBHOOK_URL;
  if (!webhookUrl) {
    if (import.meta.env.DEV) {
      return mode === 'json'
        ? Response.json({ ok: true, requestId, preview: true })
        : nativeSuccessResponse(request.url, product, requestId);
    }
    return errorResponse(mode, 'El canal de activación aún no está conectado. No se enviaron tus datos.', 503, product);
  }

  try {
    const forwarded = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-EVAAS-Request-ID': requestId },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000)
    });
    if (!forwarded.ok) throw new Error(`Webhook ${forwarded.status}`);
  } catch {
    return errorResponse(mode, 'No pudimos registrar la solicitud. Tus datos no quedaron confirmados; intenta nuevamente.', 502, product);
  }

  const checkoutUrls: Record<string, string | undefined> = {
    landing: import.meta.env.CHECKOUT_URL_LANDING,
    catalogo: import.meta.env.CHECKOUT_URL_CATALOGO,
    corporativa: import.meta.env.CHECKOUT_URL_CORPORATIVA
  };
  const checkoutUrl = checkoutUrls[product] || null;
  return mode === 'json'
    ? Response.json({ ok: true, requestId, checkoutUrl })
    : nativeSuccessResponse(request.url, product, requestId, checkoutUrl);
};
