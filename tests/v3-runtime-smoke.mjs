import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { cpSync, mkdtempSync, symlinkSync } from 'node:fs';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repository = resolve(new URL('..', import.meta.url).pathname);
const excluded = new Set(['.git', 'node_modules', 'dist', '.vercel', '.astro', '.env']);

function createRuntimeRoot() {
  const runtimeRoot = mkdtempSync(join(tmpdir(), 'evaas-commerce-c10-runtime-'));
  cpSync(repository, runtimeRoot, {
    recursive: true,
    filter: (path) => !excluded.has(path.split('/').at(-1))
  });
  symlinkSync(join(repository, 'node_modules'), join(runtimeRoot, 'node_modules'), 'dir');
  return runtimeRoot;
}

const token = 'c04b-local-internal-runtime-test-token-2026';
async function startServer(env) {
  const runtimeRoot = createRuntimeRoot();
  const portServer = createServer();
  portServer.listen(0, '127.0.0.1');
  await once(portServer, 'listening');
  const { port } = portServer.address();
  await new Promise((resolve, reject) => portServer.close((error) => error ? reject(error) : resolve()));
  const server = spawn(join(runtimeRoot, 'node_modules/.bin/astro'), ['dev', '--host', '127.0.0.1', '--port', String(port)], {
    env: { ...process.env, ...env },
    cwd: runtimeRoot,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let output = '';
  server.stdout.on('data', (chunk) => { output += chunk.toString(); });
  server.stderr.on('data', (chunk) => { output += chunk.toString(); });
  let baseUrl = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const managedUrl = output.match(/Dev server running at (https?:\/\/[^\s]+)/)?.[1];
    if (managedUrl) baseUrl = managedUrl;
    try {
      const response = await fetch(baseUrl);
      if (response.status === 200) { ready = true; break; }
    } catch {
      if (server.exitCode !== null && !managedUrl) throw new Error(`Astro server exited early.\n${output}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  assert.ok(ready, `Astro server did not become ready.\n${output}`);
  return { server, baseUrl, runtimeRoot, getOutput: () => output };
}

async function stopServer(server) {
  if (server.exitCode === null) {
    server.kill('SIGTERM');
    await Promise.race([once(server, 'exit'), new Promise((resolve) => setTimeout(resolve, 3000))]);
  }
}

const enabled = await startServer({
  EVCOM_H03_V3_RUNTIME_ENABLED: 'true',
  EVCOM_H03_V3_RUNTIME_TOKEN: token,
  EVCOM_H03_PRICING_API_ENABLED: 'true',
  EVCOM_H03_PREVIEW_REQUEST_ENABLED: 'true',
  PUBLIC_EV_WHATSAPP: '56912345678'
});

try {

  const tests = spawn(process.execPath, [
    '--experimental-strip-types', '--test', 'tests/commercial-rules.test.mjs'
  ], {
    env: {
      ...process.env,
      EVCOM_TEST_BASE_URL: enabled.baseUrl,
      EVCOM_TEST_V3_BASE_URL: enabled.baseUrl,
      EVCOM_TEST_V3_TOKEN: token
    },
    cwd: enabled.runtimeRoot,
    stdio: 'inherit'
  });
  const [code] = await once(tests, 'exit');
  if (code !== 0) throw new Error(`V3 runtime integration tests failed with exit code ${code}.`);
} finally {
  await stopServer(enabled.server);
}

const disabled = await startServer({
  EVCOM_H03_V3_RUNTIME_ENABLED: 'true',
  EVCOM_H03_V3_RUNTIME_TOKEN: token,
  EVCOM_H03_PRICING_API_ENABLED: 'true',
  EVCOM_H03_PREVIEW_REQUEST_ENABLED: 'false',
  PUBLIC_EV_WHATSAPP: '56912345678'
});
try {
  const preview = await fetch(`${disabled.baseUrl}/internal/h03-preview`);
  assert.equal(preview.status, 200, 'C09 pricing preview remains available when only the C10 request gate is off');
  const html = await preview.text();
  assert.match(html, /El recorrido de solicitud H03 permanece deshabilitado/);
  assert.doesNotMatch(html, /<button[^>]*data-create-request/);
  const endpoint = await fetch(`${disabled.baseUrl}/api/internal/h03-preview-request`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: disabled.baseUrl },
    body: JSON.stringify({ action: 'create' })
  });
  assert.equal(endpoint.status, 404, 'C10 request endpoint is unavailable with its server-side gate off');
  assert.equal(await endpoint.text(), '');
  const getEndpoint = await fetch(`${disabled.baseUrl}/api/internal/h03-preview-request`);
  assert.equal(getEndpoint.status, 404, 'unsupported methods remain unavailable when C10 is disabled');
  assert.equal(await getEndpoint.text(), '');
} finally {
  await stopServer(disabled.server);
}

const noWhatsApp = await startServer({
  EVCOM_H03_PRICING_API_ENABLED: 'true',
  EVCOM_H03_PREVIEW_REQUEST_ENABLED: 'true',
  EVCOM_H03_V3_RUNTIME_ENABLED: 'false',
  PUBLIC_EV_WHATSAPP: ''
});
try {
  const requestApi = `${noWhatsApp.baseUrl}/api/internal/h03-preview-request`;
  const headers = { 'content-type': 'application/json', origin: noWhatsApp.baseUrl };
  const createdResponse = await fetch(requestApi, {
    method: 'POST', headers,
    body: JSON.stringify({ action: 'create', productSlug: 'landing', continuityMode: 'none', projectName: 'Proyecto de fallback', domainStatus: 'unsure' })
  });
  const created = await createdResponse.json();
  assert.equal(createdResponse.status, 200);
  const validatedResponse = await fetch(requestApi, {
    method: 'POST', headers,
    body: JSON.stringify({ action: 'validate', request: created.request })
  });
  const validated = await validatedResponse.json();
  assert.equal(validatedResponse.status, 200);
  assert.equal(validated.whatsappAvailable, false);
  assert.equal(validated.whatsappUrl, null);
  assert.equal(validated.whatsappPreparedNotSent, true);
} finally {
  await stopServer(noWhatsApp.server);
}

process.stdout.write('V3, C10 assisted-request, and local H03 preview HTTP smoke: PASS (canonical rules, TTL/tampering, explicit WhatsApp preparation, unconfigured WhatsApp fallback, gate-off 404, and V2 regression).\n');
