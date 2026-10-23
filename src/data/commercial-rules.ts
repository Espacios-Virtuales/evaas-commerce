import type { ProductSlug } from './products';

export const COMMERCIAL_RULES_VERSION = 'EVCOM-H03-PILOT-2026-10-22' as const;
export const TERMS_VERSION = '1.0-draft' as const;
export const TERMS_EFFECTIVE_DATE = null;
export const COMMERCIAL_RULES_PUBLIC = false as const;
export const ANNUAL_CONTINUITY_DISCOUNT_RATE = 10 as const;

export type ContinuityMode = 'none' | 'monthly' | 'annual_prepay';

export const COMMERCIAL_RULES: Record<ProductSlug, {
  activationAmount: number;
  monthlyContinuityAmount: number;
}> = {
  landing: { activationAmount: 120_000, monthlyContinuityAmount: 19_900 },
  catalogo: { activationAmount: 160_000, monthlyContinuityAmount: 24_900 },
  corporativa: { activationAmount: 180_000, monthlyContinuityAmount: 29_900 }
};

const PRODUCT_SLUGS = new Set<string>(Object.keys(COMMERCIAL_RULES));

function isCommercialProductSlug(value: unknown): value is ProductSlug {
  return typeof value === 'string' && PRODUCT_SLUGS.has(value);
}

export type CommercialPriceBreakdown = {
  currency: 'CLP';
  productSlug: ProductSlug;
  activation: { amount: number; cadence: 'one_time' };
  continuity: null | {
    mode: Exclude<ContinuityMode, 'none'>;
    amount: number;
    cadence: 'monthly' | 'annual_prepay';
    listAmount?: number;
    discountRate: number;
    discountAmount: number;
  };
  commercialRulesVersion: typeof COMMERCIAL_RULES_VERSION;
  termsVersion: typeof TERMS_VERSION;
  termsEffectiveDate: null;
  offerStatus: 'DRAFT_NOT_FOR_PUBLICATION';
  campaignCode: null;
};

export class CommercialRuleError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'CommercialRuleError';
  }
}

export function resolveH03Pricing(input: {
  productSlug: unknown;
  continuityMode?: unknown;
  campaignCode?: unknown;
  campaignStatus?: 'active' | 'expired' | 'unknown';
}): CommercialPriceBreakdown {
  if (!isCommercialProductSlug(input.productSlug)) {
    throw new CommercialRuleError('INVALID_PRODUCT', 'El producto no es válido.');
  }
  const productSlug = input.productSlug;
  const continuityMode = input.continuityMode === undefined ? 'none' : input.continuityMode;
  if (continuityMode !== 'none' && continuityMode !== 'monthly' && continuityMode !== 'annual_prepay') {
    throw new CommercialRuleError('INVALID_CONTINUITY_MODE', 'La modalidad de continuidad no es válida.');
  }

  const rawCampaignCode = input.campaignCode;
  if (rawCampaignCode != null && typeof rawCampaignCode !== 'string') {
    throw new CommercialRuleError('INVALID_CAMPAIGN', 'El código promocional no es válido.');
  }
  const normalizedCampaignCode = typeof rawCampaignCode === 'string' ? rawCampaignCode.trim().toUpperCase() || null : null;
  if (normalizedCampaignCode) {
    if (input.campaignStatus === 'expired') {
      throw new CommercialRuleError(
        'EXPIRED_CAMPAIGN',
        'El código promocional no está vigente.'
      );
    }
    if (input.campaignStatus !== 'active') {
      throw new CommercialRuleError('INVALID_CAMPAIGN', 'El código promocional no es válido.');
    }
    throw new CommercialRuleError('CAMPAIGN_NOT_COMPATIBLE', 'Las promociones no se acumulan con las reglas comerciales H03.');
  }

  const productRules = COMMERCIAL_RULES[productSlug];
  let continuity: CommercialPriceBreakdown['continuity'] = null;
  if (continuityMode === 'monthly') {
    continuity = {
      mode: continuityMode,
      amount: productRules.monthlyContinuityAmount,
      cadence: 'monthly',
      discountRate: 0,
      discountAmount: 0
    };
  } else if (continuityMode === 'annual_prepay') {
    const listAmount = productRules.monthlyContinuityAmount * 12;
    const amount = Math.round(listAmount * (1 - ANNUAL_CONTINUITY_DISCOUNT_RATE / 100));
    continuity = {
      mode: continuityMode,
      amount,
      cadence: 'annual_prepay',
      listAmount,
      discountRate: ANNUAL_CONTINUITY_DISCOUNT_RATE,
      discountAmount: listAmount - amount
    };
  }

  return {
    currency: 'CLP',
    productSlug,
    activation: { amount: productRules.activationAmount, cadence: 'one_time' },
    continuity,
    commercialRulesVersion: COMMERCIAL_RULES_VERSION,
    termsVersion: TERMS_VERSION,
    termsEffectiveDate: TERMS_EFFECTIVE_DATE,
    offerStatus: 'DRAFT_NOT_FOR_PUBLICATION',
    campaignCode: null
  };
}
