import type { APIRoute } from 'astro';
import {
  COMMERCIAL_RULES_VERSION,
  CommercialRuleError,
  TERMS_VERSION
} from '../../../data/commercial-rules';
import { normalizeCampaignCode, resolveCampaign } from '../../../data/campaigns';
import {
  buildCommercialRequestV3Message,
  createCommercialRequestV3,
  isV3RuntimeEnabled
} from '../../../lib/commercial-request-v3';

export const prerender = false;

declare const process: { env: Record<string, string | undefined> };

const noStore = { 'Cache-Control': 'no-store' };
const unavailable = () => new Response(null, { status: 404, headers: noStore });
const error = (message: string, status: number, code?: string) => Response.json(
  { ok: false, message, ...(code ? { code } : {}) },
  { status, headers: noStore }
);

function authorized(request: Request, token: string): boolean {
  const authorization = request.headers.get('authorization') || '';
  const match = /^Bearer ([\x21-\x7e]{16,256})$/.exec(authorization);
  if (!match) return false;
  const supplied = new TextEncoder().encode(match[1]);
  const expected = new TextEncoder().encode(token);
  if (supplied.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) difference |= supplied[index] ^ expected[index];
  return difference === 0;
}

export const POST: APIRoute = async ({ request }) => {
  // Keep the route invisible unless both an explicit runtime switch and server secret exist.
  if (!isV3RuntimeEnabled(process.env.EVCOM_H03_V3_RUNTIME_ENABLED)) return unavailable();
  const token = process.env.EVCOM_H03_V3_RUNTIME_TOKEN || '';
  if (token.length < 32) return error('El runtime interno no está configurado.', 503, 'RUNTIME_NOT_CONFIGURED');
  if (!authorized(request, token)) return error('Acceso no autorizado.', 401, 'UNAUTHORIZED');
  if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
    return error('Formato de solicitud no válido.', 415, 'INVALID_CONTENT_TYPE');
  }

  let input: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > 16_384) return error('La solicitud excede el tamaño permitido.', 413, 'PAYLOAD_TOO_LARGE');
    const body: unknown = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) return error('Formato de solicitud no válido.', 400, 'INVALID_BODY');
    input = body as Record<string, unknown>;
  } catch {
    return error('No fue posible leer la solicitud.', 400, 'INVALID_BODY');
  }

  if (input.contractVersion !== 3) return error('La versión de contrato no es compatible.', 409, 'CONTRACT_VERSION_MISMATCH');
  if (input.commercialRulesVersion !== COMMERCIAL_RULES_VERSION) return error('Las reglas comerciales cambiaron; actualiza la solicitud.', 409, 'RULES_VERSION_MISMATCH');
  if (input.termsVersion !== TERMS_VERSION) return error('La versión de términos cambió; actualiza la solicitud.', 409, 'TERMS_VERSION_MISMATCH');
  if (Object.hasOwn(input, 'acceptedTermsAt')) return error('No se puede registrar aceptación mientras los términos no tengan vigencia.', 409, 'TERMS_NOT_EFFECTIVE');

  if (input.campaignCode != null && typeof input.campaignCode !== 'string') {
    return error('El código promocional no es válido.', 400, 'INVALID_CAMPAIGN');
  }
  const campaignCode = normalizeCampaignCode(input.campaignCode);
  const now = Date.now();
  const campaignStatus = campaignCode
    ? resolveCampaign(campaignCode, now) ? 'active' as const : campaignCode === 'CIBERDAY' ? 'expired' as const : 'unknown' as const
    : undefined;

  try {
    const selection = createCommercialRequestV3({
      requestId: crypto.randomUUID(),
      productSlug: input.productSlug,
      compositionProfile: input.compositionProfile,
      projectName: input.projectName,
      domainStatus: input.domainStatus,
      projectObjective: input.projectObjective,
      continuityMode: input.continuityMode,
      campaignCode,
      campaignStatus,
      createdAt: new Date(now).toISOString()
    });
    const whatsappDraft = buildCommercialRequestV3Message(selection);
    if (!whatsappDraft) return error('El brief excede el tamaño permitido o no es válido.', 400, 'INVALID_BRIEF');
    return Response.json({
      ok: true,
      request: selection,
      whatsappDraft,
      whatsappPreparedNotSent: true
    }, { headers: noStore });
  } catch (cause) {
    if (cause instanceof CommercialRuleError) return error(cause.message, 400, cause.code);
    return error('No fue posible preparar la solicitud interna.', 500, 'INTERNAL_ERROR');
  }
};
