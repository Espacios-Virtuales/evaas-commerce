import {
  isCanonicalUuid,
  isProductSlug,
  isProjectColor,
  resolveContractualPricing,
  type ContractualPricing
} from './commercial-context';
import type { ProductSlug } from '../data/products';
import type { ProjectColor } from '../data/project-colors';

export const ACTIVATION_HANDOFF_KEY = 'evaas_activation_handoff_v1';
export const ACTIVATION_HANDOFF_TTL_MS = 60 * 60 * 1000;

export type ActivationDomainStatus = 'owned' | 'needed' | 'unsure';

export type ActivationHandoffV1 = {
  version: 1;
  reference: string;
  product: ProductSlug;
  pricing: ContractualPricing;
  projectColor: ProjectColor | null;
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

function copyPricing(product: ProductSlug): ContractualPricing {
  const pricing = resolveContractualPricing(product);
  return { currency: pricing.currency, net: pricing.net, vatRate: pricing.vatRate, vat: pricing.vat, total: pricing.total };
}

export function createActivationHandoff(input: {
  reference: string;
  product: ProductSlug;
  projectColor: ProjectColor | null;
  project: string;
  domainStatus: ActivationDomainStatus;
  context: string;
  createdAt: string;
}): ActivationHandoffV1 {
  return {
    version: 1,
    reference: input.reference.toLowerCase(),
    product: input.product,
    pricing: copyPricing(input.product),
    projectColor: input.projectColor,
    project: sanitizeHandoffText(input.project, 100),
    domainStatus: input.domainStatus,
    context: sanitizeHandoffText(input.context, 600),
    createdAt: input.createdAt
  };
}

export function sanitizeActivationHandoff(value: unknown, now = Date.now()): ActivationHandoffV1 | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (input.version !== 1 || !isCanonicalUuid(input.reference) || !isProductSlug(input.product)
      || (input.projectColor !== null && !isProjectColor(input.projectColor))
      || typeof input.project !== 'string' || typeof input.context !== 'string'
      || typeof input.createdAt !== 'string' || !domainStatuses.has(input.domainStatus as ActivationDomainStatus)) return null;

  const createdAtMs = Date.parse(input.createdAt);
  if (!Number.isFinite(createdAtMs) || createdAtMs > now + 5 * 60 * 1000
      || now - createdAtMs > ACTIVATION_HANDOFF_TTL_MS) return null;

  const product = input.product;
  const expectedPricing = copyPricing(product);
  const pricing = input.pricing;
  if (!pricing || typeof pricing !== 'object') return null;
  const candidate = pricing as Record<string, unknown>;
  if (candidate.currency !== expectedPricing.currency || candidate.net !== expectedPricing.net
      || candidate.vatRate !== expectedPricing.vatRate || candidate.vat !== expectedPricing.vat
      || candidate.total !== expectedPricing.total) return null;

  const project = sanitizeHandoffText(input.project, 100);
  if (!project) return null;
  return {
    version: 1,
    reference: input.reference.toLowerCase(),
    product,
    pricing: expectedPricing,
    projectColor: input.projectColor as ProjectColor | null,
    project,
    domainStatus: input.domainStatus as ActivationDomainStatus,
    context: sanitizeHandoffText(input.context, 600),
    createdAt: new Date(createdAtMs).toISOString()
  };
}

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

export function readActivationHandoff(reference: unknown, product: unknown, now = Date.now()): ActivationHandoffV1 | null {
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
