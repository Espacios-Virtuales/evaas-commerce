import type { APIRoute } from 'astro';
import {
  COMMERCIAL_RULES_VERSION,
  CommercialRuleError,
  TERMS_VERSION
} from '../../../data/commercial-rules';
import { productBySlug } from '../../../data/products';
import { buildCommercialPricingComparison } from '../../../lib/commercial-pricing-presentation';
import {
  buildCommercialRequestV3Message,
  COMMERCIAL_REQUEST_V3_TTL_MS,
  createCommercialRequestV3,
  sanitizeCommercialRequestV3
} from '../../../lib/commercial-request-v3';
import { isLocalInternalPreviewAllowed } from '../../../lib/internal-preview-access';
import { buildWhatsAppUrl, getWhatsAppConfig } from '../../../lib/whatsapp';

export const prerender = false;

const noStore = { 'Cache-Control': 'no-store' };
const unavailable = () => new Response(null, { status: 404, headers: noStore });
const error = (message: string, status: number, code: string) => Response.json(
  { ok: false, message, code },
  { status, headers: noStore }
);
const bodyLimit = 16_384;

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function validRequestShape(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const allowed = new Set([
    'version', 'requestId', 'productSlug', 'compositionProfile', 'projectName', 'domainStatus',
    'projectObjective', 'continuityMode', 'pricing', 'commercialRulesVersion', 'termsVersion',
    'termsEffectiveDate', 'offerStatus', 'createdAt'
  ]);
  return Object.keys(value).every((key) => allowed.has(key));
}

export const POST: APIRoute = async (context) => {
  // Both server-side switches, DEV mode, loopback access, and same-origin are required.
  if (!import.meta.env.DEV
      || import.meta.env.EVCOM_COMMERCIAL_PRICING_PREVIEW_ENABLED !== 'true'
      || import.meta.env.EVCOM_COMMERCIAL_REQUEST_PREVIEW_ENABLED !== 'true') return unavailable();
  if (!isLocalInternalPreviewAllowed(true, context.clientAddress)) return unavailable();

  const { request } = context;
  if (!isSameOrigin(request)) return error('Origen de solicitud no permitido.', 403, 'INVALID_ORIGIN');
  if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
    return error('Formato de solicitud no válido.', 415, 'INVALID_CONTENT_TYPE');
  }

  let input: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > bodyLimit) return error('La solicitud excede el tamaño permitido.', 413, 'PAYLOAD_TOO_LARGE');
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return error('Formato de solicitud no válido.', 400, 'INVALID_BODY');
    input = value as Record<string, unknown>;
  } catch {
    return error('No fue posible leer la solicitud.', 400, 'INVALID_BODY');
  }

  if (input.action === 'create') {
    const allowed = new Set(['action', 'productSlug', 'continuityMode', 'projectName', 'domainStatus', 'projectObjective']);
    if (Object.keys(input).some((key) => !allowed.has(key))) {
      return error('La solicitud contiene campos no permitidos.', 400, 'INVALID_REQUEST_FIELD');
    }
    if (typeof input.projectName !== 'string') return error('El nombre del proyecto debe ser texto.', 400, 'INVALID_PROJECT');
    if (input.projectObjective !== undefined && typeof input.projectObjective !== 'string') {
      return error('El objetivo debe ser texto.', 400, 'INVALID_OBJECTIVE');
    }
    if (typeof input.domainStatus !== 'string' || !['owned', 'needed', 'unsure'].includes(input.domainStatus)) {
      return error('El estado del dominio no es válido.', 400, 'INVALID_DOMAIN_STATUS');
    }

    const now = Date.now();
    try {
      const draft = createCommercialRequestV3({
        requestId: crypto.randomUUID(),
        productSlug: input.productSlug,
        projectName: input.projectName,
        domainStatus: input.domainStatus,
        projectObjective: input.projectObjective,
        continuityMode: input.continuityMode,
        createdAt: new Date(now).toISOString()
      });
      const whatsappDraft = buildCommercialRequestV3Message(draft);
      if (!whatsappDraft) return error('El brief excede el tamaño permitido o no es válido.', 400, 'INVALID_BRIEF');
      const product = productBySlug[draft.productSlug];
      return Response.json({
        ok: true,
        request: draft,
        product: { name: product.name, purpose: product.purpose, scope: product.scope },
        comparison: buildCommercialPricingComparison(draft.pricing),
        whatsappDraft,
        whatsappPreparedNotSent: true,
        ttlExpiresAt: new Date(now + COMMERCIAL_REQUEST_V3_TTL_MS).toISOString(),
        contractVersion: 3,
        commercialRulesVersion: COMMERCIAL_RULES_VERSION,
        termsVersion: TERMS_VERSION
      }, { headers: noStore });
    } catch (cause) {
      if (cause instanceof CommercialRuleError) return error(cause.message, 400, cause.code);
      return error('No fue posible preparar la solicitud interna.', 500, 'INTERNAL_ERROR');
    }
  }

  if (input.action === 'validate') {
    if (Object.keys(input).some((key) => !['action', 'request'].includes(key))) {
      return error('La solicitud contiene campos no permitidos.', 400, 'INVALID_REQUEST_FIELD');
    }
    if (!validRequestShape(input.request)) return error('El borrador no tiene un formato válido.', 400, 'INVALID_REQUEST');
    const createdAt = typeof input.request.createdAt === 'string' ? Date.parse(input.request.createdAt) : Number.NaN;
    const now = Date.now();
    if (!Number.isFinite(createdAt) || createdAt > now + 5 * 60 * 1000) {
      return error('La fecha del borrador no es válida.', 400, 'INVALID_REQUEST_TIME');
    }
    if (now - createdAt > COMMERCIAL_REQUEST_V3_TTL_MS) {
      return error('El borrador venció. Prepara una solicitud nueva para continuar.', 410, 'REQUEST_EXPIRED');
    }
    const canonical = sanitizeCommercialRequestV3(input.request, now);
    if (!canonical) return error('El borrador cambió o no coincide con las reglas vigentes.', 400, 'INVALID_OR_TAMPERED_REQUEST');
    const whatsappDraft = buildCommercialRequestV3Message(canonical);
    if (!whatsappDraft) return error('El brief excede el tamaño permitido o no es válido.', 400, 'INVALID_BRIEF');
    const config = getWhatsAppConfig();
    const whatsappUrl = config ? buildWhatsAppUrl(config.number, whatsappDraft) : null;
    return Response.json({
      ok: true,
      request: canonical,
      whatsappDraft,
      whatsappUrl,
      whatsappAvailable: Boolean(whatsappUrl),
      whatsappPreparedNotSent: true,
      ttlExpiresAt: new Date(createdAt + COMMERCIAL_REQUEST_V3_TTL_MS).toISOString(),
      contractVersion: 3,
      commercialRulesVersion: COMMERCIAL_RULES_VERSION,
      termsVersion: TERMS_VERSION
    }, { headers: noStore });
  }

  return error('La acción solicitada no está permitida.', 400, 'INVALID_ACTION');
};

export const ALL: APIRoute = async () => unavailable();
