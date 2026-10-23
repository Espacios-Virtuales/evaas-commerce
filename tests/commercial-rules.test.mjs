import assert from 'node:assert/strict';
import test from 'node:test';
import {
  COMMERCIAL_RULES_VERSION,
  CommercialRuleError,
  resolveH03Pricing
} from '../src/data/commercial-rules.ts';

const expected = [
  ['landing', 120_000, 19_900, 214_920],
  ['catalogo', 160_000, 24_900, 268_920],
  ['corporativa', 180_000, 29_900, 322_920]
];

for (const [productSlug, activation, monthly, annual] of expected) {
  test(`${productSlug}: canonical rules resolve activation and both continuity cadences`, () => {
    const activationOnly = resolveH03Pricing({ productSlug, continuityMode: 'none' });
    assert.equal(activationOnly.activation.amount, activation);
    assert.equal(activationOnly.activation.cadence, 'one_time');
    assert.equal(activationOnly.continuity, null);

    const monthlyPrice = resolveH03Pricing({ productSlug, continuityMode: 'monthly' });
    assert.equal(monthlyPrice.continuity.amount, monthly);
    assert.equal(monthlyPrice.continuity.cadence, 'monthly');

    const annualPrice = resolveH03Pricing({ productSlug, continuityMode: 'annual_prepay' });
    assert.equal(annualPrice.continuity.amount, annual);
    assert.equal(annualPrice.continuity.listAmount, monthly * 12);
    assert.equal(annualPrice.continuity.discountAmount, monthly * 12 - annual);
    assert.equal(annualPrice.continuity.discountRate, 10);
  });
}

test('unsupported values and customer supplied totals cannot replace canonical prices', () => {
  const pricing = resolveH03Pricing({
    productSlug: 'landing',
    continuityMode: 'annual_prepay',
    activationAmount: 1,
    continuityAmount: 1,
    discountAmount: 999_999,
    total: 1
  });
  assert.equal(pricing.activation.amount, 120_000);
  assert.equal(pricing.continuity.amount, 214_920);
  assert.equal(pricing.continuity.discountAmount, 23_880);
  assert.equal(pricing.offerStatus, 'DRAFT_NOT_FOR_PUBLICATION');
  assert.equal(pricing.termsEffectiveDate, null);
});

test('unknown products and continuity modes fail explicitly', () => {
  assert.throws(() => resolveH03Pricing({ productSlug: 'unknown' }), (error) => {
    assert.ok(error instanceof CommercialRuleError);
    assert.equal(error.code, 'INVALID_PRODUCT');
    return true;
  });
  assert.throws(() => resolveH03Pricing({ productSlug: 'landing', continuityMode: 'lifetime' }), (error) => {
    assert.ok(error instanceof CommercialRuleError);
    assert.equal(error.code, 'INVALID_CONTINUITY_MODE');
    return true;
  });
});

test('campaigns are rejected when expired, unknown, or active because stacking is disabled', () => {
  assert.throws(() => resolveH03Pricing({ productSlug: 'landing', campaignCode: 'CIBERDAY', campaignStatus: 'expired' }), (error) => {
    assert.equal(error.code, 'EXPIRED_CAMPAIGN');
    return true;
  });
  assert.throws(() => resolveH03Pricing({ productSlug: 'landing', campaignCode: 'NOT-A-CODE', campaignStatus: 'unknown' }), (error) => {
    assert.equal(error.code, 'INVALID_CAMPAIGN');
    return true;
  });
  assert.throws(() => resolveH03Pricing({ productSlug: 'landing', campaignCode: 'CIBERDAY', campaignStatus: 'active' }), (error) => {
    assert.equal(error.code, 'CAMPAIGN_NOT_COMPATIBLE');
    return true;
  });
});

test('rules and terms are versioned as a non-public draft with no payment contract', () => {
  const pricing = resolveH03Pricing({ productSlug: 'corporativa', continuityMode: 'monthly' });
  assert.equal(pricing.commercialRulesVersion, COMMERCIAL_RULES_VERSION);
  assert.equal(pricing.commercialRulesVersion, 'EVCOM-H03-PILOT-2026-10-22');
  assert.equal(pricing.termsVersion, '1.0-draft');
  assert.equal(pricing.termsEffectiveDate, null);
  assert.equal(Object.hasOwn(pricing, 'requestId'), false);
  assert.equal(Object.hasOwn(pricing, 'orderId'), false);
  assert.equal(Object.hasOwn(pricing, 'paymentId'), false);
});

if (process.env.EVCOM_TEST_BASE_URL) {
  const api = `${process.env.EVCOM_TEST_BASE_URL}/api/commercial-pricing`;
  test('enabled HTTP API recalculates client tampering and returns component breakdown', async () => {
    const response = await fetch(api, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        productSlug: 'landing', continuityMode: 'annual_prepay',
        activationAmount: 1, continuityAmount: 1, discountAmount: 999_999, total: 1
      })
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.pricing.activation.amount, 120_000);
    assert.equal(body.pricing.continuity.amount, 214_920);
    assert.equal(body.pricing.discountAmount, undefined);
    assert.equal(body.pricing.offerStatus, 'DRAFT_NOT_FOR_PUBLICATION');
  });
}
