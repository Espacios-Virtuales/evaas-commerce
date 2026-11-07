import {
  CommercialRuleError,
  COMMERCIAL_RULES,
  resolveCommercialRulesPricing,
  type CommercialPriceBreakdown,
  type ContinuityMode
} from '../data/commercial-rules.ts';
import type { ProductSlug } from '../data/products';

export const COMMERCIAL_REQUEST_V3_TTL_MS = 60 * 60 * 1000;
export const COMMERCIAL_REQUEST_V3_VERSION = 3 as const;
export const COMMERCIAL_REQUEST_V3_STATUS = 'DRAFT_NOT_FOR_PUBLICATION' as const;

export function isV3RuntimeEnabled(value: unknown): boolean {
  return value === 'true';
}

export type RequestDomainStatus = 'owned' | 'needed' | 'unsure';

/** Internal request contract. It is intentionally separate from the public V2 handoff. */
export type CommercialRequestV3 = {
  version: typeof COMMERCIAL_REQUEST_V3_VERSION;
  requestId: string;
  productSlug: ProductSlug;
  compositionProfile: string | null;
  projectName: string;
  domainStatus: RequestDomainStatus;
  projectObjective: string;
  continuityMode: ContinuityMode;
  pricing: CommercialPriceBreakdown;
  commercialRulesVersion: string;
  termsVersion: string;
  termsEffectiveDate: null;
  offerStatus: typeof COMMERCIAL_REQUEST_V3_STATUS;
  createdAt: string;
};

const domainStatuses = new Set<RequestDomainStatus>(['owned', 'needed', 'unsure']);
const productSlugs = new Set<string>(Object.keys(COMMERCIAL_RULES));
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isCanonicalUuid = (value: unknown): value is string => typeof value === 'string' && uuidPattern.test(value);
const isProductSlug = (value: unknown): value is ProductSlug => typeof value === 'string' && productSlugs.has(value);

export function sanitizeRequestText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, maxLength);
}

export function createCommercialRequestV3(input: {
  requestId: unknown;
  productSlug: unknown;
  compositionProfile?: unknown;
  projectName: unknown;
  domainStatus: unknown;
  projectObjective?: unknown;
  continuityMode?: unknown;
  campaignCode?: unknown;
  campaignStatus?: 'active' | 'expired' | 'unknown';
  createdAt?: string;
}): CommercialRequestV3 {
  if (!isCanonicalUuid(input.requestId)) throw new CommercialRuleError('INVALID_REQUEST_ID', 'La referencia de solicitud no es válida.');
  if (!isProductSlug(input.productSlug)) throw new CommercialRuleError('INVALID_PRODUCT', 'El producto no es válido.');
  if (typeof input.domainStatus !== 'string' || !domainStatuses.has(input.domainStatus as RequestDomainStatus)) {
    throw new CommercialRuleError('INVALID_DOMAIN_STATUS', 'El estado del dominio no es válido.');
  }

  const projectName = sanitizeRequestText(input.projectName, 100);
  if (!projectName) throw new CommercialRuleError('INVALID_PROJECT', 'El nombre del proyecto es obligatorio.');
  const createdAt = input.createdAt ?? new Date().toISOString();
  const createdAtMs = Date.parse(createdAt);
  if (!Number.isFinite(createdAtMs)) throw new CommercialRuleError('INVALID_CREATED_AT', 'La fecha de solicitud no es válida.');

  const pricing = resolveCommercialRulesPricing({
    productSlug: input.productSlug,
    continuityMode: input.continuityMode,
    campaignCode: input.campaignCode,
    campaignStatus: input.campaignStatus
  });

  return {
    version: COMMERCIAL_REQUEST_V3_VERSION,
    requestId: input.requestId.toLowerCase(),
    productSlug: input.productSlug,
    compositionProfile: sanitizeRequestText(input.compositionProfile, 80) || null,
    projectName,
    domainStatus: input.domainStatus as RequestDomainStatus,
    projectObjective: sanitizeRequestText(input.projectObjective, 600),
    continuityMode: input.continuityMode === undefined ? 'none' : input.continuityMode as ContinuityMode,
    pricing,
    commercialRulesVersion: pricing.commercialRulesVersion,
    termsVersion: pricing.termsVersion,
    termsEffectiveDate: null,
    offerStatus: COMMERCIAL_REQUEST_V3_STATUS,
    createdAt: new Date(createdAtMs).toISOString()
  };
}

export function sanitizeCommercialRequestV3(value: unknown, now = Date.now()): CommercialRequestV3 | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (input.version !== COMMERCIAL_REQUEST_V3_VERSION || !isCanonicalUuid(input.requestId)
      || !isProductSlug(input.productSlug) || typeof input.createdAt !== 'string') return null;
  const createdAtMs = Date.parse(input.createdAt);
  if (!Number.isFinite(createdAtMs) || createdAtMs > now + 5 * 60 * 1000 || now - createdAtMs > COMMERCIAL_REQUEST_V3_TTL_MS) return null;

  try {
    const canonical = createCommercialRequestV3({
      requestId: input.requestId,
      productSlug: input.productSlug,
      compositionProfile: input.compositionProfile,
      projectName: input.projectName,
      domainStatus: input.domainStatus,
      projectObjective: input.projectObjective,
      continuityMode: input.continuityMode,
      campaignCode: input.pricing && typeof input.pricing === 'object'
        ? (input.pricing as Record<string, unknown>).campaignCode
        : undefined,
      createdAt: input.createdAt
    });
    if (input.offerStatus !== COMMERCIAL_REQUEST_V3_STATUS
        || input.commercialRulesVersion !== canonical.commercialRulesVersion
        || input.termsVersion !== canonical.termsVersion || input.termsEffectiveDate !== null
        || JSON.stringify(input.pricing) !== JSON.stringify(canonical.pricing)) return null;
    return canonical;
  } catch {
    return null;
  }
}

const productLabels: Record<ProductSlug, string> = {
  landing: 'Landing Comercial',
  catalogo: 'Catálogo de Productos',
  corporativa: 'Web Corporativa'
};
const domainLabels: Record<RequestDomainStatus, string> = {
  owned: 'Ya tengo dominio',
  needed: 'Necesito comprar dominio',
  unsure: 'Necesito orientación'
};
const clp = (value: number) => `$${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(value)}`;

/** Produces text only; the person must review and explicitly send it in WhatsApp. */
export function buildCommercialRequestV3Message(value: unknown): string | null {
  const request = sanitizeCommercialRequestV3(value);
  if (!request) return null;
  const lines = [
    'Hola, quiero revisar una solicitud de EVAAS Commerce.',
    '',
    `Producto: ${productLabels[request.productSlug]}`,
    ...(request.compositionProfile ? [`Perfil de composición: ${request.compositionProfile}`] : []),
    `Proyecto: ${request.projectName}`,
    `Dominio: ${domainLabels[request.domainStatus]}`,
    ...(request.projectObjective ? [`Objetivo: ${request.projectObjective}`] : []),
    `Activación única (borrador interno): ${clp(request.pricing.activation.amount)}`,
    ...(request.pricing.continuity ? [
      `Continuidad ${request.pricing.continuity.cadence === 'monthly' ? 'mensual' : 'anual prepagada'} (borrador interno): ${clp(request.pricing.continuity.amount)}`,
      ...(request.pricing.continuity.discountAmount ? [`Descuento anual sobre continuidad: ${clp(request.pricing.continuity.discountAmount)}`] : [])
    ] : ['Continuidad: no seleccionada']),
    `Reglas comerciales: ${request.commercialRulesVersion}`,
    `Términos: ${request.termsVersion} (sin vigencia; borrador no contratable)`,
    `Referencia de solicitud: ${request.requestId}`,
    '',
    'Selección preparada para revisión; no constituye orden, pago ni aceptación contractual.'
  ];
  const message = lines.join('\n');
  return message.length <= 1200 ? message : null;
}
