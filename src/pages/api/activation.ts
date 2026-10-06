import type { APIRoute } from 'astro';
import { isProductSlug, isProjectColor } from '../../lib/commercial-context';
import { createActivationHandoff, sanitizeHandoffText, type ActivationDomainStatus } from '../../lib/activation-handoff';
import type { ProductSlug } from '../../data/products';
import type { ProjectColor } from '../../data/project-colors';
import { isProjectCategory } from '../../data/project-categories';
import { normalizeCampaignCode, resolveCampaign } from '../../data/campaigns';

export const prerender = false;

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
      const body = await request.json();
      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return errorResponse(mode, 'Formato de solicitud no válido.', 400);
      }
      input = body as Record<string, any>;
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

  const project = sanitizeHandoffText(input.project, 100);
  const domainStatus = typeof input.domainStatus === 'string' ? input.domainStatus : '';
  const context = sanitizeHandoffText(input.context, 600);
  const projectCategory = input.projectCategory;
  const submittedColor = input.projectColor == null ? '' : typeof input.projectColor === 'string' ? input.projectColor : '\0invalid';
  if (!isProductSlug(product) || !project || !isProjectCategory(projectCategory) || !['owned', 'needed', 'unsure'].includes(domainStatus) || input.consent !== 'on' || (submittedColor !== '' && !isProjectColor(submittedColor))) {
    return errorResponse(mode, 'Revisa los datos obligatorios antes de continuar.', 400, product);
  }

  const canonicalProduct = product as ProductSlug;
  const rawCampaignCode = input.campaignCode;
  const normalizedCampaignCode = normalizeCampaignCode(rawCampaignCode);
  const hasCampaignCode = typeof rawCampaignCode === 'string' && rawCampaignCode.trim().length > 0;
  if (rawCampaignCode != null && typeof rawCampaignCode !== 'string') {
    return errorResponse(mode, 'El código promocional no es válido.', 400, product);
  }
  const campaign = normalizedCampaignCode ? resolveCampaign(normalizedCampaignCode) : null;
  if (hasCampaignCode && !campaign) {
    const message = normalizedCampaignCode === 'CIBERDAY'
      ? 'El código promocional no está vigente.'
      : 'El código promocional no es válido.';
    return errorResponse(mode, message, 400, product);
  }
  const projectColor: ProjectColor | null = submittedColor ? submittedColor as ProjectColor : null;
  const requestId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const handoff = createActivationHandoff({
    reference: requestId,
    product: canonicalProduct,
    campaignCode: campaign?.code,
    projectColor,
    projectCategory,
    project,
    domainStatus: domainStatus as ActivationDomainStatus,
    context,
    createdAt
  });

  return mode === 'json'
    ? Response.json({ ok: true, requestId, handoff })
    : nativeSuccessResponse(request.url, canonicalProduct, requestId);
};
