import {
  isCanonicalUuid,
  isProductSlug,
  isProjectColor,
  type CommercialPricing
} from './commercial-context';
import { resolvePromotionalPricing } from '../data/campaigns';
import type { ProductSlug } from '../data/products';
import type { ProjectColor } from '../data/project-colors';
import { getProjectCategoryLabel, isProjectCategory, type ProjectCategory } from '../data/project-categories';

export const ACTIVATION_HANDOFF_KEY = 'evaas_activation_handoff_v2';
export const ACTIVATION_HANDOFF_TTL_MS = 60 * 60 * 1000;

export type ActivationDomainStatus = 'owned' | 'needed' | 'unsure';

export type ActivationHandoffV2 = {
  version: 2;
  reference: string;
  product: ProductSlug;
  pricing: CommercialPricing;
  projectColor: ProjectColor | null;
  projectCategory: ProjectCategory | null;
  project: string;
  domainStatus: ActivationDomainStatus;
  context: string;
  createdAt: string;
};

const domainStatuses = new Set<ActivationDomainStatus>(['owned', 'needed', 'unsure']);

export function sanitizeHandoffText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function copyPricing(product: ProductSlug, campaignCode?: unknown, now?: number): CommercialPricing {
  const pricing = resolvePromotionalPricing(product, campaignCode, now);
  return {
    currency: pricing.currency,
    basePrice: pricing.basePrice,
    discountRate: pricing.discountRate,
    discountAmount: pricing.discountAmount,
    total: pricing.total,
    campaignCode: pricing.campaignCode
  };
}

export function createActivationHandoff(input: {
  reference: string;
  product: ProductSlug;
  campaignCode?: unknown;
  projectColor: ProjectColor | null;
  projectCategory: ProjectCategory;
  project: string;
  domainStatus: ActivationDomainStatus;
  context: string;
  createdAt: string;
}): ActivationHandoffV2 {
  return {
    version: 2,
    reference: input.reference.toLowerCase(),
    product: input.product,
    pricing: copyPricing(input.product, input.campaignCode),
    projectColor: input.projectColor,
    projectCategory: input.projectCategory,
    project: sanitizeHandoffText(input.project, 100),
    domainStatus: input.domainStatus,
    context: sanitizeHandoffText(input.context, 600),
    createdAt: input.createdAt
  };
}

export function sanitizeActivationHandoff(value: unknown, now = Date.now()): ActivationHandoffV2 | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const hasProjectCategory = Object.hasOwn(input, 'projectCategory');
  if (hasProjectCategory && !isProjectCategory(input.projectCategory)) return null;
  if (input.version !== 2 || !isCanonicalUuid(input.reference) || !isProductSlug(input.product)
      || (input.projectColor !== null && !isProjectColor(input.projectColor))
      || typeof input.project !== 'string' || typeof input.context !== 'string'
      || typeof input.createdAt !== 'string' || !domainStatuses.has(input.domainStatus as ActivationDomainStatus)) return null;

  const createdAtMs = Date.parse(input.createdAt);
  if (!Number.isFinite(createdAtMs) || createdAtMs > now + 5 * 60 * 1000
      || now - createdAtMs > ACTIVATION_HANDOFF_TTL_MS) return null;

  const product = input.product;
  const pricing = input.pricing;
  if (!pricing || typeof pricing !== 'object') return null;
  const candidate = pricing as Record<string, unknown>;
  const expectedPricing = copyPricing(product, candidate.campaignCode, createdAtMs);
  if (candidate.currency !== expectedPricing.currency || candidate.basePrice !== expectedPricing.basePrice
      || candidate.discountRate !== expectedPricing.discountRate || candidate.discountAmount !== expectedPricing.discountAmount
      || candidate.total !== expectedPricing.total || candidate.campaignCode !== expectedPricing.campaignCode) return null;

  const project = sanitizeHandoffText(input.project, 100);
  if (!project) return null;
  return {
    version: 2,
    reference: input.reference.toLowerCase(),
    product,
    pricing: expectedPricing,
    projectColor: input.projectColor as ProjectColor | null,
    projectCategory: hasProjectCategory ? input.projectCategory as ProjectCategory : null,
    project,
    domainStatus: input.domainStatus as ActivationDomainStatus,
    context: sanitizeHandoffText(input.context, 600),
    createdAt: new Date(createdAtMs).toISOString()
  };
}

export { getProjectCategoryLabel };

export function storeActivationHandoff(value: unknown, requestId: unknown): boolean {
  if (!isCanonicalUuid(requestId)) return false;
  const handoff = sanitizeActivationHandoff(value);
  if (!handoff || handoff.reference !== requestId.toLowerCase()) return false;
  try {
    sessionStorage.setItem(ACTIVATION_HANDOFF_KEY, JSON.stringify(handoff));
    return true;
  } catch {
    return false;
  }
}

export function readActivationHandoff(reference: unknown, product: unknown, now = Date.now()): ActivationHandoffV2 | null {
  if (!isCanonicalUuid(reference) || !isProductSlug(product)) return null;
  let raw: string | null;
  try {
    raw = sessionStorage.getItem(ACTIVATION_HANDOFF_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const handoff = sanitizeActivationHandoff(parsed, now);
    if (handoff && handoff.reference === reference.toLowerCase() && handoff.product === product) return handoff;
  } catch { /* Corrupt session data is discarded below. */ }

  try { sessionStorage.removeItem(ACTIVATION_HANDOFF_KEY); } catch { /* Storage may be disabled. */ }
  return null;
}
