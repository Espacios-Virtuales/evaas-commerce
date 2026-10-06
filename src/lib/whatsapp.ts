import type { CommercialContextV2, CommercialPricing } from './commercial-context';
import { isCanonicalUuid, isProductSlug, isProjectColor } from './commercial-context';
import { sanitizeActivationHandoff } from './activation-handoff';
import { resolvePromotionalPricing } from '../data/campaigns';
import { getProjectCategoryLabel } from '../data/project-categories';

const PRODUCT_LABELS = {
  landing: 'Landing Comercial',
  catalogo: 'Catálogo de Productos',
  corporativa: 'Web Corporativa'
} as const;

const COLOR_LABELS = {
  forest: 'Verde bosque',
  garnet: 'Granate',
  ocean: 'Azul profundo'
} as const;

export const WHATSAPP_INQUIRY_HAS_USER_DATA = false as const;
export const WHATSAPP_POST_FORM_HANDOFF_HAS_USER_DATA = true as const;

export type AdvancedProjectNeed = 'ecommerce' | 'integration';

export function buildAdvancedNeedMessage(need: AdvancedProjectNeed, product: 'landing' | 'catalogo' | 'corporativa'): string {
  const needLabel = need === 'ecommerce' ? 'Ecommerce / pagos' : 'Integración';
  return [
    'Hola, quiero evaluar una solución con EVAAS Commerce.',
    '',
    `Necesidad: ${needLabel}`,
    `Punto de partida identificado: ${PRODUCT_LABELS[product]}`,
    '',
    'Necesito revisar el alcance antes de activar.'
  ].join('\n');
}

export function normalizeWhatsAppNumber(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (value.length > 16) return null;
  const trimmed = value;
  const digits = trimmed.startsWith('+') ? trimmed.slice(1) : trimmed;
  return /^[1-9][0-9]{1,14}$/.test(digits) ? digits : null;
}

export function getWhatsAppConfig(value: unknown = import.meta.env.PUBLIC_EV_WHATSAPP) {
  const number = normalizeWhatsAppNumber(value);
  return number ? { number, baseUrl: `https://wa.me/${number}` } : null;
}

export function getSalesEmail(value: unknown = import.meta.env.PUBLIC_EV_SALES_EMAIL): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().slice(0, 254);
  return /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i.test(email)
    ? email
    : null;
}

const clp = (value: number) => `$${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(value)}`;
const pricingMessageLines = (pricing: CommercialPricing) => pricing.campaignCode === 'CIBERDAY'
  ? [
    `Valor normal: ${clp(pricing.basePrice)}`,
    'Descuento CiberDay: 15%',
    'Código: CIBERDAY',
    `Valor final: ${clp(pricing.total)}`
  ]
  : [`Valor final: ${clp(pricing.total)}`];
const validContext = (context: unknown): CommercialContextV2 | null => {
  if (!context || typeof context !== 'object') return null;
  const value = context as Partial<CommercialContextV2>;
  if (value.version !== 2 || !isProductSlug(value.product)) return null;
  const pricing = value.pricing;
  if (!pricing || pricing.currency !== 'CLP') return null;
  const expectedPricing = resolvePromotionalPricing(value.product, pricing.campaignCode);
  if (pricing.basePrice !== expectedPricing.basePrice || pricing.discountRate !== expectedPricing.discountRate
      || pricing.discountAmount !== expectedPricing.discountAmount || pricing.total !== expectedPricing.total
      || pricing.campaignCode !== expectedPricing.campaignCode || value.campaignCode !== expectedPricing.campaignCode) return null;
  return value as CommercialContextV2;
};

export function buildInquiryMessage(context?: unknown): string {
  const lines = ['Hola, quiero información sobre EVAAS Commerce.'];
  const safe = validContext(context);
  if (!safe) return lines[0];
  lines.push(
    '',
    `Producto: ${PRODUCT_LABELS[safe.product!]}`,
    ...pricingMessageLines(safe.pricing!),
    'Documento: boleta o factura',
    `Color del proyecto: ${safe.projectColor && isProjectColor(safe.projectColor) ? COLOR_LABELS[safe.projectColor] : 'Por definir'}`
  );
  return lines.join('\n');
}

export function buildPostFormMessage(context?: unknown): string | null {
  const safe = validContext(context);
  if (!safe || !isCanonicalUuid(safe.reference)) return null;
  return [
    'Hola, quiero solicitar una activación de EVAAS Commerce.',
    '',
    `Producto: ${PRODUCT_LABELS[safe.product!]}`,
    ...pricingMessageLines(safe.pricing!),
    'Documento: boleta o factura',
    `Color del proyecto: ${safe.projectColor && isProjectColor(safe.projectColor) ? COLOR_LABELS[safe.projectColor] : 'Por definir'}`,
    `Referencia: ${safe.reference}`
  ].join('\n');
}

const DOMAIN_LABELS = {
  owned: 'Ya tengo dominio',
  needed: 'Necesito comprar dominio',
  unsure: 'Necesito orientación'
} as const;

export function buildActivationHandoffMessage(value: unknown): string | null {
  const handoff = sanitizeActivationHandoff(value);
  if (!handoff) return null;
  const lines = [
    'Hola, quiero continuar con mi activación EVAAS Commerce.',
    '',
    `Producto: ${PRODUCT_LABELS[handoff.product]}`,
    ...pricingMessageLines(handoff.pricing),
    'Documento: boleta o factura',
    `Color del proyecto: ${handoff.projectColor ? COLOR_LABELS[handoff.projectColor] : 'Por definir'}`,
    `Proyecto: ${handoff.project}`,
    ...(handoff.projectCategory ? [`Categoría: ${getProjectCategoryLabel(handoff.projectCategory)}`] : []),
    `Dominio: ${DOMAIN_LABELS[handoff.domainStatus]}`
  ];
  if (handoff.context) lines.push(`Objetivo: ${handoff.context}`);
  lines.push('', `Referencia: ${handoff.reference}`, '', 'Ya completé el formulario de activación.');
  return lines.join('\n');
}

export function buildWhatsAppUrl(number: unknown, message: string): string | null {
  const digits = normalizeWhatsAppNumber(number);
  if (!digits || typeof message !== 'string' || message.length > 1200) return null;
  const url = new URL(`https://wa.me/${digits}`);
  url.searchParams.set('text', message);
  return url.toString();
}
