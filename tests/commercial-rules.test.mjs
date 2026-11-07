import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  COMMERCIAL_RULES_VERSION,
  CommercialRuleError,
  resolveCommercialRulesPricing
} from '../src/data/commercial-rules.ts';
import {
  buildCommercialRequestV3Message,
  createCommercialRequestV3,
  sanitizeCommercialRequestV3,
  isV3RuntimeEnabled
} from '../src/lib/commercial-request-v3.ts';
import { products, PUBLIC_PRICE_PERIOD } from '../src/data/products.ts';
import { isLocalInternalPreviewAllowed } from '../src/lib/internal-preview-access.ts';

const readSource = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('public catalog contains only the three canonical v0.6 products and prices', () => {
  assert.deepEqual(products.map(({ slug }) => slug), ['landing', 'catalogo', 'corporativa']);
  assert.deepEqual(products.map(({ finalPrice }) => finalPrice), [120_000, 160_000, 180_000]);
  assert.equal(PUBLIC_PRICE_PERIOD, 'Contratación anual · 12 meses');
  assert.ok(products.every(({ scope }) => scope.includes('1 revisión consolidada')));
  assert.ok(products.every(({ includes }) => includes.includes('Diseño responsive')));
  const exclusions = products.map(({ excludes }) => excludes.join(' ')).join(' ');
  for (const excludedFeature of ['Ecommerce', 'carrito', 'pasarela de pago', 'stock', 'integraciones', 'funciones avanzadas']) {
    assert.ok(exclusions.toLowerCase().includes(excludedFeature.toLowerCase()), `missing exclusion: ${excludedFeature}`);
  }
  assert.match(products.find(({ slug }) => slug === 'catalogo').purpose, /sin ecommerce/i);
});

test('public cards, comparison and selection explain scope and preserve the request flow', () => {
  const card = readSource('../src/components/ProductCard.astro');
  const home = readSource('../src/pages/index.astro');
  const selector = readSource('../src/components/ProductSelector.astro');
  const publicUi = `${card}\n${home}\n${selector}`;

  assert.match(card, /product\.bestFor/);
  assert.match(card, /product\.scope/);
  assert.match(card, /product\.includes\.map/);
  assert.match(card, /product\.excludes\.slice/);
  assert.match(card, /Preparar solicitud/);
  assert.match(card, /aria-label=\{`Preparar solicitud para \$\{product\.name\}`\}/);
  assert.match(home, /<table class="compare-grid">/);
  assert.match(home, /scope="col"/);
  assert.match(home, /aria-label=\{`Preparar solicitud para \$\{product\.name\}`\}/);
  assert.match(home, /scope="row"/);
  assert.match(home, /product\.excludes\.join/);
  assert.match(home, /Se evalúan y cotizan por separado/);
  assert.match(home, /cualquier costo externo se confirman en la cotización/);
  assert.match(home, /id="precios"/);
  assert.match(home, /id="comparar"/);
  assert.match(home, /id="elegir"/);
  assert.match(selector, /PUBLIC_PRICE_PERIOD/);
  assert.doesNotMatch(publicUi, /\$(?:19|24|29)\.900|\$(?:214|268|322)\.920/);
});

test('all public product routes label the vigente price as annual and request based', () => {
  const product = readSource('../src/pages/productos/[slug].astro');
  const demo = readSource('../src/pages/demos/[slug].astro');
  const activation = readSource('../src/pages/activar/[slug].astro');
  const publicUi = `${product}\n${demo}\n${activation}`;

  assert.match(publicUi, /PUBLIC_PRICE_PERIOD/);
  assert.match(publicUi, /Preparar solicitud/);
  assert.doesNotMatch(publicUi, /\$(?:19|24|29)\.900|\$(?:214|268|322)\.920/);
});

const expected = [
  ['landing', 120_000, 19_900, 214_920],
  ['catalogo', 160_000, 24_900, 268_920],
  ['corporativa', 180_000, 29_900, 322_920]
];

for (const [productSlug, activation, monthly, annual] of expected) {
  test(`${productSlug}: canonical rules resolve activation and both continuity cadences`, () => {
    const activationOnly = resolveCommercialRulesPricing({ productSlug, continuityMode: 'none' });
    assert.equal(activationOnly.activation.amount, activation);
    assert.equal(activationOnly.activation.cadence, 'one_time');
    assert.equal(activationOnly.continuity, null);

    const monthlyPrice = resolveCommercialRulesPricing({ productSlug, continuityMode: 'monthly' });
    assert.equal(monthlyPrice.continuity.amount, monthly);
    assert.equal(monthlyPrice.continuity.cadence, 'monthly');

    const annualPrice = resolveCommercialRulesPricing({ productSlug, continuityMode: 'annual_prepay' });
    assert.equal(annualPrice.continuity.amount, annual);
    assert.equal(annualPrice.continuity.listAmount, monthly * 12);
    assert.equal(annualPrice.continuity.discountAmount, monthly * 12 - annual);
    assert.equal(annualPrice.continuity.discountRate, 10);
  });
}

test('unsupported values and customer supplied totals cannot replace canonical prices', () => {
  const pricing = resolveCommercialRulesPricing({
    productSlug: 'landing',
    continuityMode: 'annual_prepay',
    activationAmount: 1,
    continuityAmount: 1,
    discountAmount: 999_999,
    annualDiscount: 999_999,
    total: 1
  });
  assert.equal(pricing.activation.amount, 120_000);
  assert.equal(pricing.continuity.amount, 214_920);
  assert.equal(pricing.continuity.discountAmount, 23_880);
  assert.equal(pricing.offerStatus, 'DRAFT_NOT_FOR_PUBLICATION');
  assert.equal(pricing.termsEffectiveDate, null);
});

test('unknown products and continuity modes fail explicitly', () => {
  assert.throws(() => resolveCommercialRulesPricing({ productSlug: 'unknown' }), (error) => {
    assert.ok(error instanceof CommercialRuleError);
    assert.equal(error.code, 'INVALID_PRODUCT');
    return true;
  });
  assert.throws(() => resolveCommercialRulesPricing({ productSlug: 'landing', continuityMode: 'lifetime' }), (error) => {
    assert.ok(error instanceof CommercialRuleError);
    assert.equal(error.code, 'INVALID_CONTINUITY_MODE');
    return true;
  });
});

test('campaigns are rejected when expired, unknown, or active because stacking is disabled', () => {
  assert.throws(() => resolveCommercialRulesPricing({ productSlug: 'landing', campaignCode: 'CIBERDAY', campaignStatus: 'expired' }), (error) => {
    assert.equal(error.code, 'EXPIRED_CAMPAIGN');
    return true;
  });
  assert.throws(() => resolveCommercialRulesPricing({ productSlug: 'landing', campaignCode: 'NOT-A-CODE', campaignStatus: 'unknown' }), (error) => {
    assert.equal(error.code, 'INVALID_CAMPAIGN');
    return true;
  });
  assert.throws(() => resolveCommercialRulesPricing({ productSlug: 'landing', campaignCode: 'CIBERDAY', campaignStatus: 'active' }), (error) => {
    assert.equal(error.code, 'CAMPAIGN_NOT_COMPATIBLE');
    return true;
  });
});

test('rules and terms are versioned as a non-public draft with no payment contract', () => {
  const pricing = resolveCommercialRulesPricing({ productSlug: 'corporativa', continuityMode: 'monthly' });
  assert.equal(pricing.commercialRulesVersion, COMMERCIAL_RULES_VERSION);
  assert.equal(pricing.commercialRulesVersion, 'EVCOM-COMMERCIAL-PILOT-2026-10-22');
  assert.equal(pricing.termsVersion, '1.0-draft');
  assert.equal(pricing.termsEffectiveDate, null);
  assert.equal(Object.hasOwn(pricing, 'requestId'), false);
  assert.equal(Object.hasOwn(pricing, 'orderId'), false);
  assert.equal(Object.hasOwn(pricing, 'paymentId'), false);
});

test('V3 request contract resolves prices on creation and treats profile as descriptive only', () => {
  const request = createCommercialRequestV3({
    requestId: '123e4567-e89b-42d3-a456-426614174000',
    productSlug: 'catalogo',
    compositionProfile: 'Editorial / artístico',
    projectName: 'Proyecto de prueba',
    domainStatus: 'owned',
    projectObjective: 'Presentar el catálogo',
    continuityMode: 'annual_prepay',
    createdAt: '2026-10-22T12:00:00.000Z'
  });
  assert.equal(request.version, 3);
  assert.equal(request.productSlug, 'catalogo');
  assert.equal(request.compositionProfile, 'Editorial / artístico');
  assert.equal(request.pricing.activation.amount, 160_000);
  assert.equal(request.pricing.continuity.amount, 268_920);
  assert.equal(request.offerStatus, 'DRAFT_NOT_FOR_PUBLICATION');
  assert.equal(request.termsEffectiveDate, null);
});

test('V3 sanitizer rejects tampered server prices, unsupported modes, other products, and expired requests', () => {
  const request = createCommercialRequestV3({
    requestId: '123e4567-e89b-42d3-a456-426614174000',
    productSlug: 'landing', projectName: 'Proyecto', domainStatus: 'unsure',
    continuityMode: 'monthly', createdAt: '2026-10-22T12:00:00.000Z'
  });
  assert.equal(sanitizeCommercialRequestV3(request, Date.parse('2026-10-22T12:30:00.000Z'))?.pricing.continuity.amount, 19_900);
  assert.equal(sanitizeCommercialRequestV3({ ...request, pricing: { ...request.pricing, activation: { amount: 1, cadence: 'one_time' } } }), null);
  assert.equal(sanitizeCommercialRequestV3({ ...request, productSlug: 'corporativa' }), null);
  assert.equal(sanitizeCommercialRequestV3({ ...request, requestId: 'not-a-uuid' }), null);
  assert.equal(sanitizeCommercialRequestV3({ ...request, continuityMode: 'lifetime' }), null);
  assert.equal(sanitizeCommercialRequestV3(request, Date.parse('2026-10-22T13:00:01.000Z')), null);
});

test('V3 WhatsApp brief is prepared text, includes commercial references, and is not an order or payment', () => {
  const request = createCommercialRequestV3({
    requestId: '123e4567-e89b-42d3-a456-426614174000',
    productSlug: 'corporativa', projectName: 'Proyecto', domainStatus: 'needed',
    continuityMode: 'annual_prepay', createdAt: new Date().toISOString()
  });
  const message = buildCommercialRequestV3Message(request);
  assert.match(message, /Activación única \(borrador interno\): \$180\.000/);
  assert.match(message, /Continuidad anual prepagada \(borrador interno\): \$322\.920/);
  assert.match(message, /no constituye orden, pago ni aceptación contractual/);
  assert.equal(Object.hasOwn(request, 'orderId'), false);
  assert.equal(Object.hasOwn(request, 'paymentId'), false);
});

test('V3 runtime gate is closed unless explicitly enabled', () => {
  assert.equal(isV3RuntimeEnabled(undefined), false);
  assert.equal(isV3RuntimeEnabled('false'), false);
  assert.equal(isV3RuntimeEnabled('TRUE'), false);
  assert.equal(isV3RuntimeEnabled('true'), true);
});

test('Commercial preview access is restricted to a local development server', () => {
  assert.equal(isLocalInternalPreviewAllowed(true, '127.0.0.1'), true);
  assert.equal(isLocalInternalPreviewAllowed(true, '::1'), true);
  assert.equal(isLocalInternalPreviewAllowed(true, '::ffff:127.0.0.1'), true);
  assert.equal(isLocalInternalPreviewAllowed(false, '127.0.0.1'), false);
  assert.equal(isLocalInternalPreviewAllowed(true, '192.168.1.10'), false);
  const route = readSource('../src/pages/internal/commercial-preview.astro');
  const api = readSource('../src/pages/api/commercial-pricing.ts');
  const requestApi = readSource('../src/pages/api/internal/commercial-request-preview.ts');
  const previewComponent = readSource('../src/components/CommercialSelectionPreview.astro');
  const layout = readSource('../src/layouts/BaseLayout.astro');
  assert.match(route, /!import\.meta\.env\.DEV \|\| import\.meta\.env\.EVCOM_COMMERCIAL_PRICING_PREVIEW_ENABLED !== 'true'/);
  assert.match(route, /isLocalInternalPreviewAllowed\(true, Astro\.clientAddress\)/);
  assert.match(route, /status: 404/);
  assert.match(api, /if \(!import\.meta\.env\.DEV\) return notAvailable\(\)/);
  assert.match(api, /isLocalInternalPreviewAllowed\(true, context\.clientAddress\)/);
  assert.match(api, /INVALID_SELECTION_FIELD/);
  assert.match(api, /resolveCommercialRulesPricing/);
  assert.match(requestApi, /EVCOM_COMMERCIAL_REQUEST_PREVIEW_ENABLED !== 'true'/);
  assert.match(requestApi, /isLocalInternalPreviewAllowed\(true, context\.clientAddress\)/);
  assert.match(requestApi, /isSameOrigin\(request\)/);
  assert.match(requestApi, /sanitizeCommercialRequestV3/);
  assert.match(requestApi, /REQUEST_EXPIRED/);
  assert.match(requestApi, /buildWhatsAppUrl/);
  assert.match(requestApi, /buildCommercialPricingComparison/);
  assert.match(previewComponent, /<script is:inline>/);
  assert.match(previewComponent, /Previsualización interna · solicitud comercial en borrador/);
  assert.match(previewComponent, /target="_blank" rel="noopener noreferrer" data-whatsapp-link/);
  assert.match(previewComponent, /aria-live="polite"/);
  assert.match(previewComponent, /data-create-request/);
  assert.doesNotMatch(previewComponent, /localStorage|sessionStorage/);
  assert.match(layout, /showWhatsAppConversion = pagePath !== '\/internal\/commercial-preview'/);
});

if (process.env.EVCOM_TEST_BASE_URL) {
  const api = `${process.env.EVCOM_TEST_BASE_URL}/api/commercial-pricing`;
  const requestApi = `${process.env.EVCOM_TEST_BASE_URL}/api/internal/commercial-request-preview`;
  const requestHeaders = {
    'content-type': 'application/json',
    origin: process.env.EVCOM_TEST_BASE_URL
  };
  test('public routes remain v0.6 and omit unpublished continuity amounts', async () => {
    const routes = [
      '/', '/productos/landing', '/productos/catalogo', '/productos/corporativa',
      '/demos/landing', '/demos/catalogo', '/demos/corporativa',
      '/activar/landing', '/activar/catalogo', '/activar/corporativa',
      '/confirmacion', '/terminos', '/privacidad'
    ];
    for (const route of routes) {
      const response = await fetch(`${process.env.EVCOM_TEST_BASE_URL}${route}`);
      const html = await response.text();
      assert.equal(response.status, 200, route);
      assert.doesNotMatch(html, /\$(?:19|24|29)\.900|\$(?:214|268|322)\.920|Continuidad mensual opcional|anual prepagad[ao]/i, route);
      assert.doesNotMatch(html, /Activación única · borrador interno/, route);
      if (route === '/terminos') {
        assert.match(html, /Versión 0\.6/);
        assert.match(html, /contratación anual/i);
        assert.match(html, /\$120\.000[\s\S]*\$160\.000[\s\S]*\$180\.000/);
      }
    }
  });

  test('local commercial preview page renders without embedding internal amounts in its HTML', async () => {
    const response = await fetch(`${process.env.EVCOM_TEST_BASE_URL}/internal/commercial-preview`);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(html, /Previsualización interna · precios y modalidades no disponibles para contratación pública/);
    assert.match(html, /name="continuityMode" value="none"/);
    assert.match(html, /name="continuityMode" value="monthly"/);
    assert.match(html, /name="continuityMode" value="annual_prepay"/);
    assert.match(html, /Datos mínimos para el borrador de prueba/);
    assert.match(html, /solicitud comercial en borrador/i);
    assert.doesNotMatch(html, /data-whatsapp-conversion/);
    assert.doesNotMatch(html, /\$(?:19|24|29)\.900|\$(?:214|268|322)\.920/);
  });

  test('enabled HTTP API rejects client supplied monetary amounts', async () => {
    const response = await fetch(api, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        productSlug: 'landing', continuityMode: 'annual_prepay',
        activationAmount: 1, continuityAmount: 1, discountAmount: 999_999, annualDiscount: 999_999, total: 1
      })
    });
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.code, 'INVALID_SELECTION_FIELD');
    assert.equal(Object.hasOwn(body, 'pricing'), false);
  });

  test('local preview endpoint serves all nine canonical product and continuity combinations', async () => {
    const expected = [
      ['landing', 'none', 120_000, null, 120_000, 0],
      ['landing', 'monthly', 120_000, 19_900, 358_800, 0],
      ['landing', 'annual_prepay', 120_000, 214_920, 334_920, 23_880],
      ['catalogo', 'none', 160_000, null, 160_000, 0],
      ['catalogo', 'monthly', 160_000, 24_900, 458_800, 0],
      ['catalogo', 'annual_prepay', 160_000, 268_920, 428_920, 29_880],
      ['corporativa', 'none', 180_000, null, 180_000, 0],
      ['corporativa', 'monthly', 180_000, 29_900, 538_800, 0],
      ['corporativa', 'annual_prepay', 180_000, 322_920, 502_920, 35_880]
    ];

    for (const [productSlug, continuityMode, activation, continuity, total, savings] of expected) {
      const response = await fetch(api, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ productSlug, continuityMode })
      });
      const body = await response.json();
      assert.equal(response.status, 200, `${productSlug}/${continuityMode}`);
      assert.equal(body.pricing.productSlug, productSlug);
      assert.equal(body.pricing.activation.amount, activation);
      assert.equal(body.pricing.continuity?.amount ?? null, continuity);
      assert.equal(body.comparison.estimatedTwelveMonthTotal, total);
      assert.equal(body.comparison.annualSavings, savings);
      assert.equal(Object.hasOwn(body, 'requestId'), false);
      assert.equal(Object.hasOwn(body, 'orderId'), false);
      assert.equal(Object.hasOwn(body, 'paymentId'), false);
      assert.equal(Object.hasOwn(body, 'acceptedTermsAt'), false);
    }
  });

  test('preview endpoint rejects invalid selection and client supplied amounts', async () => {
    const invalidInputs = [
      [{ productSlug: 'otro', continuityMode: 'none' }, 'INVALID_PRODUCT'],
      [{ productSlug: 'landing', continuityMode: 'lifetime' }, 'INVALID_CONTINUITY_MODE'],
      [{ productSlug: 'landing', continuityMode: 'monthly', activationAmount: 1 }, 'INVALID_SELECTION_FIELD'],
      [{ productSlug: 'landing', continuityMode: 'monthly', continuityAmount: 1 }, 'INVALID_SELECTION_FIELD'],
      [{ productSlug: 'landing', continuityMode: 'annual_prepay', annualDiscount: 999_999 }, 'INVALID_SELECTION_FIELD'],
      [{ productSlug: 'landing', continuityMode: 'annual_prepay', total: 1 }, 'INVALID_SELECTION_FIELD'],
      [{ productSlug: 'landing', continuityMode: 'none', acceptedTermsAt: new Date().toISOString() }, 'INVALID_SELECTION_FIELD'],
      [{ productSlug: 'landing', continuityMode: 'none', campaignCode: 'CIBERDAY' }, 'EXPIRED_CAMPAIGN']
    ];

    for (const [input, code] of invalidInputs) {
      const response = await fetch(api, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(input)
      });
      const body = await response.json();
      assert.equal(response.status, 400);
      assert.equal(body.code, code);
      assert.equal(Object.hasOwn(body, 'pricing'), false);
    }
  });

  test('V3 assisted request creates all nine canonical product and mode combinations', async () => {
    const expected = [
      ['landing', 'none', 120_000, null, 120_000, 0],
      ['landing', 'monthly', 120_000, 19_900, 358_800, 0],
      ['landing', 'annual_prepay', 120_000, 214_920, 334_920, 23_880],
      ['catalogo', 'none', 160_000, null, 160_000, 0],
      ['catalogo', 'monthly', 160_000, 24_900, 458_800, 0],
      ['catalogo', 'annual_prepay', 160_000, 268_920, 428_920, 29_880],
      ['corporativa', 'none', 180_000, null, 180_000, 0],
      ['corporativa', 'monthly', 180_000, 29_900, 538_800, 0],
      ['corporativa', 'annual_prepay', 180_000, 322_920, 502_920, 35_880]
    ];
    for (const [productSlug, continuityMode, activation, continuity, total, savings] of expected) {
      const response = await fetch(requestApi, {
        method: 'POST', headers: requestHeaders,
        body: JSON.stringify({
          action: 'create', productSlug, continuityMode,
          projectName: 'Proyecto de prueba', domainStatus: 'unsure', projectObjective: 'Revisar alcance'
        })
      });
      const body = await response.json();
      assert.equal(response.status, 200, `${productSlug}/${continuityMode}`);
      assert.equal(body.request.productSlug, productSlug);
      assert.equal(body.request.continuityMode, continuityMode);
      assert.match(body.request.requestId, /^[0-9a-f-]{36}$/i);
      assert.equal(body.request.pricing.activation.amount, activation);
      assert.equal(body.request.pricing.continuity?.amount ?? null, continuity);
      assert.equal(body.comparison.estimatedTwelveMonthTotal, total);
      assert.equal(body.comparison.annualSavings, savings);
      assert.equal(Date.parse(body.ttlExpiresAt) - Date.parse(body.request.createdAt), 60 * 60 * 1000);
      assert.equal(body.whatsappPreparedNotSent, true);
      assert.equal(body.request.termsEffectiveDate, null);
      assert.equal(Object.hasOwn(body.request, 'quoteId'), false);
      assert.equal(Object.hasOwn(body.request, 'orderId'), false);
      assert.equal(Object.hasOwn(body.request, 'paymentId'), false);
      assert.equal(Object.hasOwn(body.request, 'acceptedTermsAt'), false);
    }
  });

  test('V3 validation rechecks TTL and canonical values before returning an explicit WhatsApp link', async () => {
    const createResponse = await fetch(requestApi, {
      method: 'POST', headers: requestHeaders,
      body: JSON.stringify({
        action: 'create', productSlug: 'catalogo', continuityMode: 'annual_prepay',
        projectName: 'Proyecto de prueba', domainStatus: 'owned'
      })
    });
    const created = await createResponse.json();
    assert.equal(createResponse.status, 200);
    const response = await fetch(requestApi, {
      method: 'POST', headers: requestHeaders,
      body: JSON.stringify({ action: 'validate', request: created.request })
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.request.pricing.activation.amount, 160_000);
    assert.equal(body.request.pricing.continuity.amount, 268_920);
    assert.equal(body.whatsappAvailable, true);
    assert.match(body.whatsappUrl, /^https:\/\/wa\.me\/56912345678\?/);
    assert.match(body.whatsappDraft, /no constituye orden, pago ni aceptación contractual/);
    assert.equal(body.whatsappPreparedNotSent, true);
    assert.equal(Object.hasOwn(body, 'orderId'), false);
    assert.equal(Object.hasOwn(body, 'paymentId'), false);

    const tampered = { ...created.request, pricing: { ...created.request.pricing, activation: { amount: 1, cadence: 'one_time' } } };
    const tamperedResponse = await fetch(requestApi, {
      method: 'POST', headers: requestHeaders,
      body: JSON.stringify({ action: 'validate', request: tampered })
    });
    assert.equal(tamperedResponse.status, 400);
    assert.equal((await tamperedResponse.json()).code, 'INVALID_OR_TAMPERED_REQUEST');

    const expiredResponse = await fetch(requestApi, {
      method: 'POST', headers: requestHeaders,
      body: JSON.stringify({ action: 'validate', request: { ...created.request, createdAt: '2020-01-01T00:00:00.000Z' } })
    });
    assert.equal(expiredResponse.status, 410);
    assert.equal((await expiredResponse.json()).code, 'REQUEST_EXPIRED');

    const badReferenceResponse = await fetch(requestApi, {
      method: 'POST', headers: requestHeaders,
      body: JSON.stringify({ action: 'validate', request: { ...created.request, requestId: 'not-a-reference' } })
    });
    assert.equal(badReferenceResponse.status, 400);
    assert.equal((await badReferenceResponse.json()).code, 'INVALID_OR_TAMPERED_REQUEST');

    const badTimestampResponse = await fetch(requestApi, {
      method: 'POST', headers: requestHeaders,
      body: JSON.stringify({ action: 'validate', request: { ...created.request, createdAt: 'not-a-date' } })
    });
    assert.equal(badTimestampResponse.status, 400);
    assert.equal((await badTimestampResponse.json()).code, 'INVALID_REQUEST_TIME');

    const badVersionResponse = await fetch(requestApi, {
      method: 'POST', headers: requestHeaders,
      body: JSON.stringify({ action: 'validate', request: { ...created.request, version: 2 } })
    });
    assert.equal(badVersionResponse.status, 400);
    assert.equal((await badVersionResponse.json()).code, 'INVALID_OR_TAMPERED_REQUEST');
  });

  test('V3 request endpoint rejects invalid origin, field types, modes, and browser-supplied money', async () => {
    const cases = [
      [{ action: 'create', productSlug: 'unknown', continuityMode: 'none', projectName: 'X', domainStatus: 'unsure' }, 'INVALID_PRODUCT'],
      [{ action: 'create', productSlug: 'landing', continuityMode: 'lifetime', projectName: 'X', domainStatus: 'unsure' }, 'INVALID_CONTINUITY_MODE'],
      [{ action: 'create', productSlug: 'landing', continuityMode: 'none', projectName: 1, domainStatus: 'unsure' }, 'INVALID_PROJECT'],
      [{ action: 'create', productSlug: 'landing', continuityMode: 'none', projectName: 'X', domainStatus: 'unsure', projectObjective: 1 }, 'INVALID_OBJECTIVE'],
      [{ action: 'create', productSlug: 'landing', continuityMode: 'none', projectName: 'X', domainStatus: 'unknown' }, 'INVALID_DOMAIN_STATUS'],
      [{ action: 'create', productSlug: 'landing', continuityMode: 'none', projectName: 'X', domainStatus: 'unsure', total: 1 }, 'INVALID_REQUEST_FIELD'],
      [{ action: 'create', productSlug: 'landing', continuityMode: 'annual_prepay', projectName: 'X', domainStatus: 'unsure', annualDiscount: 999_999 }, 'INVALID_REQUEST_FIELD'],
      [{ action: 'create', productSlug: 'landing', continuityMode: 'none', projectName: 'X', domainStatus: 'unsure', acceptedTermsAt: new Date().toISOString() }, 'INVALID_REQUEST_FIELD']
    ];
    for (const [input, code] of cases) {
      const response = await fetch(requestApi, { method: 'POST', headers: requestHeaders, body: JSON.stringify(input) });
      assert.equal(response.status, 400);
      assert.equal((await response.json()).code, code);
    }
    const originResponse = await fetch(requestApi, {
      method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://untrusted.example' },
      body: JSON.stringify({ action: 'create' })
    });
    assert.equal(originResponse.status, 403);
    assert.equal((await originResponse.json()).code, 'INVALID_ORIGIN');
  });
}

if (process.env.EVCOM_TEST_V3_BASE_URL) {
  const api = `${process.env.EVCOM_TEST_V3_BASE_URL}/api/internal/commercial-request-v3`;
  const token = process.env.EVCOM_TEST_V3_TOKEN || '';
  const payload = {
    contractVersion: 3,
    commercialRulesVersion: COMMERCIAL_RULES_VERSION,
    termsVersion: '1.0-draft',
    productSlug: 'catalogo',
    continuityMode: 'annual_prepay',
    compositionProfile: 'Editorial',
    projectName: 'Proyecto interno',
    domainStatus: 'owned',
    projectObjective: 'Presentar el catálogo'
  };

  test('V3 runtime rejects missing and incorrect bearer credentials', async () => {
    for (const authorization of ['', 'Bearer incorrect-token']) {
      const response = await fetch(api, {
        method: 'POST', headers: { 'content-type': 'application/json', ...(authorization ? { authorization } : {}) },
        body: JSON.stringify(payload)
      });
      assert.equal(response.status, 401);
      assert.equal((await response.json()).code, 'UNAUTHORIZED');
    }
    const unsupported = await fetch(api);
    assert.equal(unsupported.status, 404, 'unsupported methods stay unavailable');
    assert.doesNotMatch(await unsupported.text(), /\$(?:19|24|29)\.900|\$(?:214|268|322)\.920/);
  });

  test('authenticated V3 runtime ignores submitted amounts and returns a draft-only request', async () => {
    const response = await fetch(api, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...payload, activationAmount: 1, continuityAmount: 1, discountAmount: 0, annualDiscount: 999_999, total: 1 })
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.request.version, 3);
    assert.match(body.request.requestId, /^[0-9a-f-]{36}$/i);
    assert.equal(body.request.pricing.activation.amount, 160_000);
    assert.equal(body.request.pricing.continuity.amount, 268_920);
    assert.equal(body.request.offerStatus, 'DRAFT_NOT_FOR_PUBLICATION');
    assert.equal(body.request.termsEffectiveDate, null);
    assert.equal(body.whatsappPreparedNotSent, true);
    assert.match(body.whatsappDraft, /no constituye orden, pago ni aceptación contractual/);
    assert.match(body.whatsappDraft, /Referencia de solicitud:/);
    assert.doesNotMatch(body.whatsappDraft, /Referencia de cotización:/i);
    assert.equal(Object.hasOwn(body.request, 'quoteId'), false);
    assert.equal(Object.hasOwn(body.request, 'orderId'), false);
    assert.equal(Object.hasOwn(body.request, 'paymentId'), false);
  });

  test('authenticated V3 runtime rejects invalid product, mode, versions, acceptance, and campaign', async () => {
    const cases = [
      [{ productSlug: 'unknown' }, 400, 'INVALID_PRODUCT'],
      [{ continuityMode: 'lifetime' }, 400, 'INVALID_CONTINUITY_MODE'],
      [{ contractVersion: 2 }, 409, 'CONTRACT_VERSION_MISMATCH'],
      [{ commercialRulesVersion: 'stale' }, 409, 'RULES_VERSION_MISMATCH'],
      [{ termsVersion: '0.6' }, 409, 'TERMS_VERSION_MISMATCH'],
      [{ acceptedTermsAt: new Date().toISOString() }, 409, 'TERMS_NOT_EFFECTIVE'],
      [{ campaignCode: 'CIBERDAY' }, 400, 'EXPIRED_CAMPAIGN'],
      [{ campaignCode: 'NO-EXISTE' }, 400, 'INVALID_CAMPAIGN']
    ];
    for (const [overrides, status, code] of cases) {
      const response = await fetch(api, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...payload, ...overrides })
      });
      assert.equal(response.status, status);
      assert.equal((await response.json()).code, code);
    }
  });

  test('existing public activation endpoint remains V2-compatible', async () => {
    const response = await fetch(`${process.env.EVCOM_TEST_V3_BASE_URL}/api/activation`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        product: 'landing', project: 'Prueba compatibilidad', projectCategory: 'other',
        domainStatus: 'owned', context: '', consent: 'on', formStartedAt: Date.now() - 5_000
      })
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.handoff.version, 2);
    assert.equal(body.handoff.pricing.total, 120_000);
    assert.equal(Object.hasOwn(body.handoff, 'continuityMode'), false);
  });
}
