import { productBySlug, type ProductSlug } from '../data/products';
import { PROJECT_COLOR_OPTIONS, type ProjectColor } from '../data/project-colors';

export const COMMERCIAL_CONTEXT_KEY = 'evaas_commercial_context_v1';
export const COMMERCIAL_CONTEXT_VERSION = 1 as const;
export const CONTRACTUAL_VAT_RATE = 19 as const;

export type ContractualPricing = {
  currency: 'CLP';
  net: number;
  vatRate: typeof CONTRACTUAL_VAT_RATE;
  vat: number;
  total: number;
};

export type CommercialAttribution = {
  source: string;
  medium: string;
  campaign: string;
};

export type CommercialContextV1 = {
  version: typeof COMMERCIAL_CONTEXT_VERSION;
  product: ProductSlug | null;
  pricing: ContractualPricing | null;
  projectColor: ProjectColor | null;
  coupon: null;
  reference: string | null;
  attribution: CommercialAttribution;
};

export type PersistedCommercialContextV1 = Omit<CommercialContextV1, 'pricing'>;

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

export function resolveContractualPricing(product: ProductSlug): ContractualPricing {
  const configured = productBySlug[product];
  const net = configured.netPrice;
  const vat = Math.round(net * CONTRACTUAL_VAT_RATE / 100);
  const total = net + vat;
  if (total !== configured.finalPrice) throw new Error(`Contractual pricing mismatch for ${product}`);
  return { currency: 'CLP', net, vatRate: CONTRACTUAL_VAT_RATE, vat, total };
}

export function createCommercialContext(input: {
  product?: unknown;
  projectColor?: unknown;
  coupon?: unknown;
  reference?: unknown;
  attribution?: unknown;
} = {}): CommercialContextV1 {
  const product = isProductSlug(input.product) ? input.product : null;
  return {
    version: COMMERCIAL_CONTEXT_VERSION,
    product,
    pricing: product ? resolveContractualPricing(product) : null,
    projectColor: isProjectColor(input.projectColor) ? input.projectColor : null,
    coupon: null,
    reference: isCanonicalUuid(input.reference) ? input.reference.toLowerCase() : null,
    attribution: sanitizeAttribution(input.attribution)
  };
}

export function sanitizeCommercialContext(value: unknown): CommercialContextV1 | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (input.version !== COMMERCIAL_CONTEXT_VERSION) return null;
  return createCommercialContext(input);
}

export function toPersistedCommercialContext(context: CommercialContextV1): PersistedCommercialContextV1 {
  return {
    version: COMMERCIAL_CONTEXT_VERSION,
    product: context.product,
    projectColor: context.projectColor,
    coupon: null,
    reference: context.reference,
    attribution: sanitizeAttribution(context.attribution)
  };
}
