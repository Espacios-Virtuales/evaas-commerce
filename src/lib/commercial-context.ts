import { productBySlug, type ProductSlug } from '../data/products';
import { PROJECT_COLOR_OPTIONS, type ProjectColor } from '../data/project-colors';
import { normalizeCampaignCode, resolvePromotionalPricing } from '../data/campaigns';

export const COMMERCIAL_CONTEXT_KEY = 'evaas_commercial_context_v2';
export const COMMERCIAL_CONTEXT_VERSION = 2 as const;

export type CommercialPricing = {
  currency: 'CLP';
  basePrice: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  campaignCode: string | null;
};

export type CommercialAttribution = {
  source: string;
  medium: string;
  campaign: string;
};

export type CommercialContextV2 = {
  version: typeof COMMERCIAL_CONTEXT_VERSION;
  product: ProductSlug | null;
  pricing: CommercialPricing | null;
  campaignCode: string | null;
  projectColor: ProjectColor | null;
  coupon: null;
  reference: string | null;
  attribution: CommercialAttribution;
};

export type PersistedCommercialContextV2 = Omit<CommercialContextV2, 'pricing'>;

const productSlugs = new Set(Object.keys(productBySlug));
const projectColors = new Set<string>(PROJECT_COLOR_OPTIONS.map((option) => option.id));
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isProductSlug(value: unknown): value is ProductSlug {
  return typeof value === 'string' && productSlugs.has(value);
}

export function isProjectColor(value: unknown): value is ProjectColor {
  return typeof value === 'string' && projectColors.has(value);
}

export function isCanonicalUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

export function sanitizeContextText(value: unknown, maxLength = 100): string {
  return typeof value === 'string'
    ? value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, maxLength)
    : '';
}

export function sanitizeAttribution(value: unknown): CommercialAttribution {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const safeValue = (input: unknown) => {
    const candidate = sanitizeContextText(input, 100);
    if (candidate.includes('@') || /(?:^|\D)\+?\d[\d ().-]{6,}\d(?:$|\D)/.test(candidate)) return '';
    return candidate;
  };
  return {
    source: safeValue(source.source) || 'direct',
    medium: safeValue(source.medium),
    campaign: safeValue(source.campaign)
  };
}

export function resolveCommercialPricing(product: ProductSlug, campaignCode?: unknown): CommercialPricing {
  return resolvePromotionalPricing(product, campaignCode);
}

export function createCommercialContext(input: {
  product?: unknown;
  projectColor?: unknown;
  campaignCode?: unknown;
  coupon?: unknown;
  reference?: unknown;
  attribution?: unknown;
} = {}): CommercialContextV2 {
  const product = isProductSlug(input.product) ? input.product : null;
  const campaignCode = normalizeCampaignCode(input.campaignCode);
  const pricing = product ? resolveCommercialPricing(product, campaignCode) : null;
  return {
    version: COMMERCIAL_CONTEXT_VERSION,
    product,
    pricing,
    campaignCode: pricing?.campaignCode ?? null,
    projectColor: isProjectColor(input.projectColor) ? input.projectColor : null,
    coupon: null,
    reference: isCanonicalUuid(input.reference) ? input.reference.toLowerCase() : null,
    attribution: sanitizeAttribution(input.attribution)
  };
}

export function sanitizeCommercialContext(value: unknown): CommercialContextV2 | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (input.version !== COMMERCIAL_CONTEXT_VERSION) return null;
  return createCommercialContext(input);
}

export function toPersistedCommercialContext(context: CommercialContextV2): PersistedCommercialContextV2 {
  return {
    version: COMMERCIAL_CONTEXT_VERSION,
    product: context.product,
    campaignCode: context.campaignCode,
    projectColor: context.projectColor,
    coupon: null,
    reference: context.reference,
    attribution: sanitizeAttribution(context.attribution)
  };
}
