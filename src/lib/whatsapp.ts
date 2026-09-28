import type { CommercialContextV1 } from './commercial-context';
import { isCanonicalUuid, isProductSlug, isProjectColor } from './commercial-context';
import { sanitizeActivationHandoff } from './activation-handoff';

const PRODUCT_LABELS = {
  landing: 'Landing',
  catalogo: 'Catálogo',
  corporativa: 'Web Corporativa'
} as const;

const HANDOFF_PRODUCT_LABELS = {
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
const validContext = (context: unknown): CommercialContextV1 | null => {
  if (!context || typeof context !== 'object') return null;
  const value = context as Partial<CommercialContextV1>;
  if (value.version !== 1 || !isProductSlug(value.product)) return null;
  const pricing = value.pricing;
  if (!pricing || pricing.currency !== 'CLP' || !Number.isSafeInteger(pricing.net)
      || !Number.isSafeInteger(pricing.vat) || !Number.isSafeInteger(pricing.total)
      || pricing.vatRate !== 19 || pricing.net < 0 || pricing.vat < 0
      || pricing.total !== pricing.net + pricing.vat) return null;
  return value as CommercialContextV1;
};

export function buildInquiryMessage(context?: unknown): string {
  const lines = ['Hola, quiero información sobre EVAAS Station.'];
  const safe = validContext(context);
  if (!safe) return lines[0];
  lines.push(
    '',
    `Producto de interés: ${PRODUCT_LABELS[safe.product!]}`,
    `Precio neto: ${clp(safe.pricing!.net)}`,
    `IVA: ${clp(safe.pricing!.vat)}`,
    `Total: ${clp(safe.pricing!.total)}`,
    `Color del proyecto: ${safe.projectColor && isProjectColor(safe.projectColor) ? COLOR_LABELS[safe.projectColor] : 'Por definir'}`
  );
  return lines.join('\n');
}

export function buildPostFormMessage(context?: unknown): string | null {
  const safe = validContext(context);
  if (!safe || !isCanonicalUuid(safe.reference)) return null;
  return [
    'Hola, quiero solicitar una activación de EVAAS Station.',
    '',
    `Producto: ${PRODUCT_LABELS[safe.product!]}`,
    `Precio neto: ${clp(safe.pricing!.net)}`,
    `IVA: ${clp(safe.pricing!.vat)}`,
    `Total: ${clp(safe.pricing!.total)}`,
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
    'Hola, quiero continuar con mi activación EVAAS Station.',
    '',
    `Producto: ${HANDOFF_PRODUCT_LABELS[handoff.product]}`,
    `Valor: ${clp(handoff.pricing.total)} IVA incluido`,
    `Color del proyecto: ${handoff.projectColor ? COLOR_LABELS[handoff.projectColor] : 'Por definir'}`,
    `Proyecto: ${handoff.project}`,
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
