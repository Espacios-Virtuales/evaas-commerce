import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const repository = resolve(new URL('..', import.meta.url).pathname);
const renderFunction = join(repository, '.vercel/output/functions/_render.func/dist/server/entry.mjs');
assert.ok(statSync(renderFunction).isFile(), 'Vercel production render function must exist; run npm run build first.');

// Force private server flags on at runtime to prove that the compiled production DEV guard wins.
process.env.EVCOM_COMMERCIAL_PRICING_PREVIEW_ENABLED = 'true';
process.env.EVCOM_COMMERCIAL_REQUEST_PREVIEW_ENABLED = 'true';
process.env.EVCOM_COMMERCIAL_REQUEST_V3_RUNTIME_ENABLED = 'false';
Reflect.deleteProperty(process.env, 'EVCOM_COMMERCIAL_REQUEST_V3_RUNTIME_TOKEN');

const { default: handler } = await import(pathToFileURL(renderFunction).href);
assert.equal(typeof handler.fetch, 'function', 'Vercel adapter exposes a Fetch runtime handler');

async function request(path, method = 'GET', body) {
  return handler.fetch(new Request(`https://commerce.example${path}`, {
    method,
    headers: {
      'x-forwarded-for': '127.0.0.1',
      ...(body === undefined ? {} : {
        'content-type': 'application/json',
        origin: 'https://commerce.example'
      })
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  }));
}

for (const [path, method, body] of [
  ['/internal/commercial-preview', 'GET'],
  ['/api/commercial-pricing', 'POST', { productSlug: 'landing', continuityMode: 'monthly' }],
  ['/api/internal/commercial-request-preview', 'POST', { action: 'create', productSlug: 'landing' }],
  ['/api/internal/commercial-request-preview', 'GET'],
  ['/api/internal/commercial-request-v3', 'POST', { productSlug: 'landing' }]
]) {
  const response = await request(path, method, body);
  assert.equal(response.status, 404, `${path} must be unavailable in the compiled production artifact`);
  assert.equal(await response.text(), '', `${path} must not return internal pricing detail`);
}

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const staticRoot = join(repository, '.vercel/output/static');
const publicFiles = walk(staticRoot).filter((path) => /\.(?:html|js|css|json)$/.test(path));
const commercialLeak = /\$(?:19|24|29)\.900|\$(?:214|268|322)\.920|(?:19|24|29)900|(?:214|268|322)920|EVCOM_COMMERCIAL_REQUEST_PREVIEW_ENABLED|EVCOM-COMMERCIAL-PILOT-2026-10-22|commercialRulesVersion|DRAFT_NOT_FOR_PUBLICATION|annual_prepay/;
for (const path of publicFiles) {
  assert.doesNotMatch(readFileSync(path, 'utf8'), commercialLeak, `internal commercial data must not appear in public asset ${path}`);
}

process.stdout.write(`Vercel production artifact guard: PASS (${publicFiles.length} static assets checked; internal preview and APIs returned 404).\n`);
