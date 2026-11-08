import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { cpSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repository = resolve(new URL('..', import.meta.url).pathname);
const excluded = new Set(['.git', 'node_modules', 'dist', '.vercel', '.astro', '.env', '.agents', '.codex', '.aws']);

function createRuntimeRoot() {
  const runtimeRoot = mkdtempSync(join(tmpdir(), 'evaas-commerce-commercial-runtime-'));
  cpSync(repository, runtimeRoot, {
    recursive: true,
    filter: (path) => {
      const name = path.split('/').at(-1);
      return !excluded.has(name) && !name.startsWith('.env') && name !== 'copy.env';
    }
  });
  symlinkSync(join(repository, 'node_modules'), join(runtimeRoot, 'node_modules'), 'dir');
  return runtimeRoot;
}

const token = 'commercial-local-internal-runtime-test-token-2026';
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
  process.stdout.write(`Started isolated Astro PID=${server.pid} port=${port} runtime=${runtimeRoot}\n`);
  let output = '';
  server.stdout.on('data', (chunk) => { output += chunk.toString(); });
  server.stderr.on('data', (chunk) => { output += chunk.toString(); });
  let baseUrl = `http://127.0.0.1:${port}`;
  let ready = false;
  let lastStatus = 'no response';
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const managedUrl = output.match(/Dev server running at (https?:\/\/[^\s]+)/)?.[1];
    if (managedUrl) baseUrl = managedUrl;
    try {
      const response = await fetch(baseUrl);
      lastStatus = String(response.status);
      if (response.status === 200) { ready = true; break; }
    } catch {
      if (server.exitCode !== null && !managedUrl) {
        await stopServer(server, runtimeRoot);
        throw new Error(`Astro server exited early.\n${output}`);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  if (!ready) {
    await stopServer(server, runtimeRoot);
    throw new Error(`Astro server did not become ready (HTTP ${lastStatus}, exit ${server.exitCode}).\n${output}`);
  }
  return { server, baseUrl, runtimeRoot, getOutput: () => output };
}

async function stopServer(server, runtimeRoot) {
  if (server.exitCode === null) {
    server.kill('SIGTERM');
    const exited = await Promise.race([once(server, 'exit').then(() => true), new Promise((resolve) => setTimeout(() => resolve(false), 3000))]);
    if (!exited) {
      server.kill('SIGKILL');
      await once(server, 'exit');
    }
  }
  if (runtimeRoot) rmSync(runtimeRoot, { recursive: true, force: true });
  process.stdout.write(`Stopped isolated Astro PID=${server.pid}; removed temporary runtime${runtimeRoot ? `=${runtimeRoot}` : ''}\n`);
}

const enabled = await startServer({
  EVCOM_COMMERCIAL_REQUEST_V3_RUNTIME_ENABLED: 'true',
  EVCOM_COMMERCIAL_REQUEST_V3_RUNTIME_TOKEN: token,
  EVCOM_COMMERCIAL_PRICING_PREVIEW_ENABLED: 'true',
  EVCOM_COMMERCIAL_REQUEST_PREVIEW_ENABLED: 'true',
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
  await stopServer(enabled.server, enabled.runtimeRoot);
}

const disabled = await startServer({
  EVCOM_COMMERCIAL_REQUEST_V3_RUNTIME_ENABLED: 'true',
  EVCOM_COMMERCIAL_REQUEST_V3_RUNTIME_TOKEN: token,
  EVCOM_COMMERCIAL_PRICING_PREVIEW_ENABLED: 'true',
  EVCOM_COMMERCIAL_REQUEST_PREVIEW_ENABLED: 'false',
  PUBLIC_EV_WHATSAPP: '56912345678'
});
try {
  const preview = await fetch(`${disabled.baseUrl}/internal/commercial-preview`);
  assert.equal(preview.status, 200, 'commercial pricing preview remains available when only the commercial request gate is off');
  const html = await preview.text();
  assert.match(html, /El recorrido de solicitud asistida permanece deshabilitado/);
  assert.doesNotMatch(html, /<button[^>]*data-create-request/);
  const endpoint = await fetch(`${disabled.baseUrl}/api/internal/commercial-request-preview`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: disabled.baseUrl },
    body: JSON.stringify({ action: 'create' })
  });
  assert.equal(endpoint.status, 404, 'commercial request endpoint is unavailable with its server-side gate off');
  assert.equal(await endpoint.text(), '');
  const getEndpoint = await fetch(`${disabled.baseUrl}/api/internal/commercial-request-preview`);
  assert.equal(getEndpoint.status, 404, 'unsupported methods remain unavailable when commercial is disabled');
  assert.equal(await getEndpoint.text(), '');
} finally {
  await stopServer(disabled.server, disabled.runtimeRoot);
}

const closedGates = await startServer({
  EVCOM_COMMERCIAL_PRICING_PREVIEW_ENABLED: 'false',
  EVCOM_COMMERCIAL_REQUEST_PREVIEW_ENABLED: 'false',
  EVCOM_COMMERCIAL_REQUEST_V3_RUNTIME_ENABLED: 'false',
  EVCOM_COMMERCIAL_REQUEST_V3_RUNTIME_TOKEN: '',
  PUBLIC_EV_WHATSAPP: '56912345678'
});
try {
  const page = await fetch(`${closedGates.baseUrl}/internal/commercial-preview`);
  assert.equal(page.status, 404, 'pricing preview is unavailable when its server-side gate is off');
  const pageBody = await page.text();
  assert.doesNotMatch(pageBody, /data-commercial-preview|\$(?:19|24|29)\.900|\$(?:214|268|322)\.920|annual_prepay/);
  for (const [path, body] of [
    ['/api/commercial-pricing', { productSlug: 'landing', continuityMode: 'monthly' }],
    ['/api/internal/commercial-request-preview', { action: 'create', productSlug: 'landing' }],
    ['/api/internal/commercial-request-v3', { contractVersion: 3 }]
  ]) {
    const response = await fetch(`${closedGates.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: closedGates.baseUrl },
      body: JSON.stringify(body)
    });
    assert.equal(response.status, 404, `${path} stays unavailable when private gates are off`);
    assert.equal(await response.text(), '');
  }
} finally {
  await stopServer(closedGates.server, closedGates.runtimeRoot);
}

const noWhatsAppFallback = await startServer({
  EVCOM_COMMERCIAL_PRICING_PREVIEW_ENABLED: 'true',
  EVCOM_COMMERCIAL_REQUEST_PREVIEW_ENABLED: 'true',
  EVCOM_COMMERCIAL_REQUEST_V3_RUNTIME_ENABLED: 'false',
  PUBLIC_EV_WHATSAPP: ''
});
try {
  const requestApi = `${noWhatsAppFallback.baseUrl}/api/internal/commercial-request-preview`;
  const headers = { 'content-type': 'application/json', origin: noWhatsAppFallback.baseUrl };
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
  await stopServer(noWhatsAppFallback.server, noWhatsAppFallback.runtimeRoot);
}

process.stdout.write('V3 assisted-request and local commercial preview HTTP smoke: PASS (canonical rules, TTL/tampering, explicit WhatsApp preparation, unconfigured WhatsApp fallback, gate-off 404, and V2 regression).\n');
