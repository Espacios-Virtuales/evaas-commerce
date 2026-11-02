import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';

const token = 'c04b-local-internal-runtime-test-token-2026';
const portServer = createServer();
portServer.listen(0, '127.0.0.1');
await once(portServer, 'listening');
const { port } = portServer.address();
await new Promise((resolve, reject) => portServer.close((error) => error ? reject(error) : resolve()));

const server = spawn('./node_modules/.bin/astro', ['dev', '--host', '127.0.0.1', '--port', String(port)], {
  env: {
    ...process.env,
    EVCOM_H03_V3_RUNTIME_ENABLED: 'true',
    EVCOM_H03_V3_RUNTIME_TOKEN: token,
    EVCOM_H03_PRICING_API_ENABLED: 'true'
  },
  stdio: ['ignore', 'pipe', 'pipe']
});
let serverOutput = '';
server.stdout.on('data', (chunk) => { serverOutput += chunk.toString(); });
server.stderr.on('data', (chunk) => { serverOutput += chunk.toString(); });

try {
  let baseUrl = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const managedUrl = serverOutput.match(/Dev server running at (https?:\/\/[^\s]+)/)?.[1];
    if (managedUrl) baseUrl = managedUrl;
    try {
      const response = await fetch(baseUrl);
      if (response.status === 200) { ready = true; break; }
    } catch {
      if (server.exitCode !== null && !managedUrl) throw new Error(`Astro server exited early.\n${serverOutput}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  assert.ok(ready, `Astro server did not become ready.\n${serverOutput}`);

  const tests = spawn(process.execPath, [
    '--experimental-strip-types', '--test', 'tests/commercial-rules.test.mjs'
  ], {
    env: {
      ...process.env,
      EVCOM_TEST_BASE_URL: baseUrl,
      EVCOM_TEST_V3_BASE_URL: baseUrl,
      EVCOM_TEST_V3_TOKEN: token
    },
    stdio: 'inherit'
  });
  const [code] = await once(tests, 'exit');
  if (code !== 0) throw new Error(`V3 runtime integration tests failed with exit code ${code}.`);
} finally {
  if (server.exitCode === null) {
    server.kill('SIGTERM');
    await Promise.race([once(server, 'exit'), new Promise((resolve) => setTimeout(resolve, 3000))]);
  }
}

process.stdout.write('V3 and local H03 preview runtime smoke: PASS (authenticated V3, canonical pricing, dev-only preview, and V2 regression).\n');
