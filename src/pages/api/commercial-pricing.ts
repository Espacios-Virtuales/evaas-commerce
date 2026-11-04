import type { APIRoute } from 'astro';
import { CommercialRuleError, resolveH03Pricing } from '../../data/commercial-rules';
import { normalizeCampaignCode, resolveCampaign } from '../../data/campaigns';
import { isLocalInternalPreviewAllowed } from '../../lib/internal-preview-access';
import { buildCommercialPricingComparison } from '../../lib/commercial-pricing-presentation';

export const prerender = false;

const notAvailable = () => new Response(null, {
  status: 404,
  headers: { 'Cache-Control': 'no-store' }
});

export const POST: APIRoute = async (context) => {
  // This endpoint is a local development preview, never a public pricing API.
  if (!import.meta.env.DEV) return notAvailable();
  if (!isLocalInternalPreviewAllowed(true, context.clientAddress)) return notAvailable();
  const { request } = context;
  if (import.meta.env.EVCOM_H03_PRICING_API_ENABLED !== 'true') return notAvailable();
  if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
    return Response.json({ message: 'Formato de solicitud no válido.' }, { status: 415, headers: { 'Cache-Control': 'no-store' } });
  }

  let input: Record<string, unknown>;
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return Response.json({ message: 'Formato de solicitud no válido.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    input = body as Record<string, unknown>;
  } catch {
    return Response.json({ message: 'No fue posible leer la solicitud.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const allowedFields = new Set(['productSlug', 'continuityMode', 'campaignCode']);
    if (Object.keys(input).some((key) => !allowedFields.has(key))) {
      throw new CommercialRuleError('INVALID_SELECTION_FIELD', 'La selección contiene campos no permitidos.');
    }
    if (input.campaignCode != null && typeof input.campaignCode !== 'string') {
      throw new CommercialRuleError('INVALID_CAMPAIGN', 'El código promocional no es válido.');
    }
    const campaignCode = normalizeCampaignCode(input.campaignCode);
    const campaignStatus = campaignCode
      ? resolveCampaign(campaignCode) ? 'active' as const : campaignCode === 'CIBERDAY' ? 'expired' as const : 'unknown' as const
      : undefined;
    const pricing = resolveH03Pricing({
      productSlug: input.productSlug,
      continuityMode: input.continuityMode,
      campaignCode,
      campaignStatus
    });
    return Response.json({
      ok: true,
      pricing,
      comparison: buildCommercialPricingComparison(pricing)
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof CommercialRuleError) {
      return Response.json({ message: error.message, code: error.code }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    return Response.json({ message: 'No fue posible calcular las condiciones comerciales.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
};
