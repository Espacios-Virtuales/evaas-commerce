import { productBySlug, type ProductSlug } from './products';

export type Campaign = {
  code: 'CIBERDAY';
  discountRate: 15;
  enabled: boolean;
  startsAt: string;
  endsAt: string;
};

export const CIBERDAY_CAMPAIGN: Campaign = {
  code: 'CIBERDAY',
  discountRate: 15,
  enabled: true,
  startsAt: '2026-10-06T00:00:00-03:00',
  endsAt: '2026-10-08T23:59:59-03:00'
};

const campaigns = [CIBERDAY_CAMPAIGN] as const;

export function normalizeCampaignCode(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const code = value.trim().toUpperCase();
  return code || null;
}

export function resolveCampaign(value: unknown, now = Date.now()): Campaign | null {
  const code = normalizeCampaignCode(value);
  const campaign = campaigns.find((item) => item.code === code);
  if (!campaign || !campaign.enabled) return null;
  const startsAt = Date.parse(campaign.startsAt);
  const endsAt = Date.parse(campaign.endsAt);
  if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt) || now < startsAt || now > endsAt) return null;
  return campaign;
}

export function resolvePromotionalPricing(product: ProductSlug, campaignCode?: unknown, now = Date.now()) {
  const basePrice = productBySlug[product].finalPrice;
  const campaign = resolveCampaign(campaignCode, now);
  const discountRate = campaign?.discountRate ?? 0;
  const discountAmount = Math.round(basePrice * discountRate / 100);
  return {
    currency: 'CLP' as const,
    basePrice,
    discountRate,
    discountAmount,
    total: basePrice - discountAmount,
    campaignCode: campaign?.code ?? null
  };
}
