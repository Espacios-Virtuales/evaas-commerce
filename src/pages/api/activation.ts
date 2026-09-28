import type { APIRoute } from 'astro';
import { isProductSlug, isProjectColor, resolveContractualPricing, sanitizeAttribution } from '../../lib/commercial-context';
import { createActivationHandoff, sanitizeHandoffText, type ActivationDomainStatus } from '../../lib/activation-handoff';
import type { ProductSlug } from '../../data/products';
import type { ProjectColor } from '../../data/project-colors';

export const prerender = false;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RequestMode = 'json' | 'form';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]!);
}

function errorResponse(mode: RequestMode, message: string, status: number, product = '') {
  if (mode === 'json') return Response.json({ message }, { status });
  const safeProduct = isProductSlug(product) ? product : '';
  const returnHref = safeProduct ? `/activar/${safeProduct}` : '/';
  return new Response(`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>No se pudo enviar la solicitud</title><main><h1>No se pudo enviar la solicitud</h1><p>${escapeHtml(message)}</p><p><a href="${returnHref}">Volver al formulario de activación</a></p></main></html>`, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function nativeSuccessResponse(requestUrl: string, product: string, requestId: string) {
  const query = requestId ? `&id=${encodeURIComponent(requestId)}` : '';
  const destination = product ? `/confirmacion?producto=${encodeURIComponent(product)}${query}` : '/';
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

  const product = typeof input.product === 'string' ? input.product : '';
  if (input.website) {
    return mode === 'json'
      ? Response.json({ ok: true, requestId: null, discarded: true })
      : nativeSuccessResponse(request.url, isProductSlug(product) ? product : '', '');
  }

  if (mode === 'json') {
    const elapsed = Date.now() - Number(input.formStartedAt || 0);
    if (!Number.isFinite(elapsed) || elapsed < 1200 || elapsed > 86_400_000) {
      return errorResponse(mode, 'La sesión expiró. Actualiza la página e intenta nuevamente.', 400);
    }
  }

  const name = String(input.name || '').trim().slice(0, 80);
  const email = String(input.email || '').trim().toLowerCase().slice(0, 160);
  const project = sanitizeHandoffText(input.project, 100);
  const domainStatus = String(input.domainStatus || '');
  const context = sanitizeHandoffText(input.context, 600);
  const submittedColor = input.projectColor == null ? '' : typeof input.projectColor === 'string' ? input.projectColor : '\0invalid';
  if (!isProductSlug(product) || !name || !project || !emailPattern.test(email) || !['owned', 'needed', 'unsure'].includes(domainStatus) || input.consent !== 'on' || (submittedColor !== '' && !isProjectColor(submittedColor))) {
    return errorResponse(mode, 'Revisa los datos obligatorios antes de continuar.', 400, product);
  }

  const canonicalProduct = product as ProductSlug;
  const projectColor: ProjectColor | null = submittedColor ? submittedColor as ProjectColor : null;
  const attribution = sanitizeAttribution(input.attribution);
  const requestId = crypto.randomUUID();
  const payload = {
    id: requestId,
    type: 'evaas_station_activation',
    createdAt: new Date().toISOString(),
    product: canonicalProduct,
    pricing: resolveContractualPricing(canonicalProduct),
    projectColor,
    name,
    email,
    project,
    domainStatus,
    whatsapp: String(input.whatsapp || '').trim().slice(0, 30),
    context,
    attribution
  };
  const handoff = createActivationHandoff({
    reference: requestId,
    product: canonicalProduct,
    projectColor,
    project,
    domainStatus: domainStatus as ActivationDomainStatus,
    context,
    createdAt: payload.createdAt
  });

  const webhookUrl = import.meta.env.ACTIVATION_WEBHOOK_URL;
  if (!webhookUrl) {
    if (import.meta.env.DEV) {
      return mode === 'json'
        ? Response.json({ ok: true, requestId, handoff, preview: true })
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

  return mode === 'json'
    ? Response.json({ ok: true, requestId, handoff })
    : nativeSuccessResponse(request.url, canonicalProduct, requestId);
};
