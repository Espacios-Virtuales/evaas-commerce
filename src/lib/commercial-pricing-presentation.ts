import type { CommercialPriceBreakdown } from '../data/commercial-rules';

/** Derived display values shared by the internal pricing and request previews. */
export function buildCommercialPricingComparison(pricing: CommercialPriceBreakdown) {
  const twelveMonthContinuity = pricing.continuity?.cadence === 'monthly'
    ? pricing.continuity.amount * 12
    : pricing.continuity?.amount ?? 0;
  const continuityListAmount = pricing.continuity?.cadence === 'monthly'
    ? twelveMonthContinuity
    : pricing.continuity?.listAmount ?? 0;

  return {
    continuityListAmount,
    annualSavings: pricing.continuity?.discountAmount ?? 0,
    estimatedTwelveMonthTotal: pricing.activation.amount + twelveMonthContinuity
  };
}
