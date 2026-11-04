import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { cp, mkdtemp, readFile, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';

const pickPort = async () => {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const { port } = server.address();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
};

const repository = process.cwd();
const tempRuntime = await mkdtemp(join(tmpdir(), 'evcom-c10-runtime-browser-'));
const excluded = new Set(['.git', 'node_modules', 'dist', '.vercel', '.astro', '.env']);
await cp(repository, tempRuntime, {
  recursive: true,
  filter: (path) => !excluded.has(path.split('/').at(-1))
});
await symlink(join(repository, 'node_modules'), join(tempRuntime, 'node_modules'), 'dir');
const astroPort = await pickPort();
const astro = spawn(join(tempRuntime, 'node_modules/.bin/astro'), ['dev', '--host', '127.0.0.1', '--port', String(astroPort)], {
  env: {
    ...process.env,
    EVCOM_H03_PRICING_API_ENABLED: 'true',
    EVCOM_H03_PREVIEW_REQUEST_ENABLED: 'true',
    PUBLIC_EV_WHATSAPP: '56912345678'
  },
  cwd: tempRuntime,
  stdio: ['ignore', 'pipe', 'pipe']
});
let astroOutput = '';
astro.stdout.on('data', (chunk) => { astroOutput += chunk.toString(); });
astro.stderr.on('data', (chunk) => { astroOutput += chunk.toString(); });
let chrome;
let ws;
let tempProfile;

try {
  const baseUrl = `http://127.0.0.1:${astroPort}`;
  let ready = false;
  for (let i = 0; i < 60; i += 1) {
    try {
      if ((await fetch(baseUrl)).status === 200) { ready = true; break; }
    } catch {
      if (astro.exitCode !== null) throw new Error(`Astro exited early:\n${astroOutput}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  assert.ok(ready, `Astro did not become ready:\n${astroOutput}`);

  tempProfile = await mkdtemp(join(tmpdir(), 'evcom-c10-chrome-'));
  chrome = spawn('google-chrome', [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
    '--no-proxy-server', '--remote-debugging-port=0', `--user-data-dir=${tempProfile}`, 'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  let chromeErrors = '';
  chrome.stderr.on('data', (chunk) => { chromeErrors += chunk.toString(); });
  const activeFile = join(tempProfile, 'DevToolsActivePort');
  let activePort;
  for (let i = 0; i < 100; i += 1) {
    try {
      activePort = Number((await readFile(activeFile, 'utf8')).split('\n')[0]);
      if (activePort) break;
    } catch {}
    if (chrome.exitCode !== null) throw new Error(`Chrome exited early:\n${chromeErrors}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.ok(activePort, `Chrome remote debugging did not start:\n${chromeErrors}`);
  const version = await (await fetch(`http://127.0.0.1:${activePort}/json/version`)).json();
  ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });

  let nextId = 0;
  const pending = new Map();
  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    }
  });
  const browserCommand = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
  const { targetId } = await browserCommand('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await browserCommand('Target.attachToTarget', { targetId, flatten: true });
  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
  const evaluate = async (expression) => {
    const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };

  await command('Page.enable');
  await command('Runtime.enable');
  await command('Network.enable');
  await command('Page.navigate', { url: `${baseUrl}/internal/h03-preview` });
  const waitForReady = async () => {
    for (let i = 0; i < 100; i += 1) {
      const state = await evaluate(`(() => ({
        loaded: document.readyState === 'complete',
        done: document.querySelector('[data-summary]')?.getAttribute('aria-busy') === 'false',
        status: document.querySelector('[data-status]')?.textContent || ''
      }))()`);
      if (state.loaded && state.done && state.status.includes('reglas canónicas')) return state;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error(`H03 preview did not load canonical values: ${await evaluate('document.body.innerText')}`);
  };
  await waitForReady();

  const contrastExpression = `(() => {
    const parse = (s) => { const m = s.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/); return m ? [+m[1],+m[2],+m[3],m[4] === undefined ? 1 : +m[4]] : null; };
    const blend = (f,b) => f.slice(0,3).map((x,i)=>x*f[3]+b[i]*(1-f[3]));
    const bg = (el) => { let color=[11,11,12]; const chain=[]; for(let n=el;n;n=n.parentElement) chain.unshift(n); for(const n of chain){const c=parse(getComputedStyle(n).backgroundColor);if(c&&c[3]>0)color=blend(c,color);} return color; };
    const lum = (rgb) => { const a=rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4); return .2126*a[0]+.7152*a[1]+.0722*a[2]; };
    const ratio = (a,b) => { const x=lum(a),y=lum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
    return [...document.querySelectorAll('.h03-preview-header h1,.h03-preview-header > p:not(.h03-preview-badge),.h03-preview-badge,.h03-field,.h03-modes small,.h03-request-fields label,.h03-field-hint,.h03-request-note,.h03-third-party,.h03-status,.h03-not-contract,.h03-summary button,.h03-request-review > p,.h03-review-grid dt,.h03-review-grid dd,.h03-expiry,.h03-review-actions .button')].filter((el)=>el.getClientRects().length>0).map((el)=>{
      const style=getComputedStyle(el); const fg=parse(style.color); const background=bg(el); const effective=style.opacity==='1'?fg:blend([...fg.slice(0,3),+style.opacity],background);
      return {label:el.className||el.tagName,text:(el.textContent||'').trim().slice(0,48),ratio:+ratio(effective,background).toFixed(2),fontSize:style.fontSize,weight:style.fontWeight};
    });
  })()`;

  const reports = [];
  for (const width of [320, 500, 1440]) {
    await command('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    await command('Runtime.evaluate', { expression: 'new Promise(requestAnimationFrame)', awaitPromise: true });
    const report = await evaluate(`(() => {
      const root=document.querySelector('.h03-preview');
      const select=document.querySelector('#h03-product');
      const heading=document.querySelector('#h03-preview-title');
      return {
        width:innerWidth, clientWidth:document.documentElement.clientWidth, documentWidth:document.documentElement.scrollWidth, bodyWidth:document.body.scrollWidth,
        overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth || document.body.scrollWidth>document.documentElement.clientWidth,
        h03Width:Math.round(root.getBoundingClientRect().width), gridColumns:getComputedStyle(document.querySelector('.h03-preview-grid')).gridTemplateColumns,
        status:document.querySelector('[data-status]').textContent,
        labelCount:select.labels.length, productOptions:select.options.length,
        productNames:[...select.options].map(option=>option.textContent.trim()),
        modeRadios:document.querySelectorAll('input[name="continuityMode"]').length,
        internalRequestButton:!!document.querySelector('[data-create-request]'),
        whatsappConversion:!!document.querySelector('[data-whatsapp-conversion]'),
        badge:document.querySelector('.h03-preview-badge').textContent
      };
    })()`);
    assert.equal(report.overflow, false, `horizontal overflow at ${width}px: ${JSON.stringify(report)}`);
    assert.equal(report.productOptions, 3);
    assert.deepEqual(report.productNames, ['Landing Comercial', 'Catálogo de Productos', 'Web Corporativa']);
    assert.equal(report.modeRadios, 3);
    assert.equal(report.labelCount, 1);
    assert.equal(report.internalRequestButton, true);
    assert.equal(report.whatsappConversion, false);
    assert.ok(report.status.includes('reglas canónicas'));
    report.contrast = [];
    for (const theme of ['dark', 'light', 'cyan']) {
      await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(theme)}`);
      const themeContrast = await evaluate(contrastExpression);
      for (const item of themeContrast) {
        const large = parseFloat(item.fontSize) >= 24 || (parseFloat(item.fontSize) >= 18.66 && Number(item.weight) >= 700);
        assert.ok(item.ratio >= (large ? 3 : 4.5), `${theme} contrast failure at ${width}px: ${JSON.stringify(item)}`);
      }
      report.contrast.push({ theme, minimum: Math.min(...themeContrast.map((item) => item.ratio)) });
    }
    await evaluate(`document.documentElement.dataset.theme='dark'`);
    const screenshot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(`/tmp/evcom-c10-preview-${width}.png`, Buffer.from(screenshot.data, 'base64'));
    reports.push(report);
  }

  await evaluate(`document.querySelector('#h03-product').focus()`);
  const sendKey = async (key, code, virtualKey) => {
    await command('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: virtualKey });
    await command('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: virtualKey });
  };
  await sendKey('Tab', 'Tab', 9);
  const firstRadio = await evaluate(`document.activeElement.matches('input[name="continuityMode"]') && document.activeElement.value`);
  assert.equal(firstRadio, 'none');
  await sendKey('ArrowDown', 'ArrowDown', 40);
  const keyboardMode = await evaluate(`({mode:document.querySelector('input[name="continuityMode"]:checked').value,active:document.activeElement.value})`);
  assert.equal(keyboardMode.mode, 'monthly');
  await waitForReady();
  await sendKey('Tab', 'Tab', 9);
  const nextIsProjectName = await evaluate(`document.activeElement.matches('[data-project-name]')`);
  assert.equal(nextIsProjectName, true);
  const focusStyle = await evaluate(`(() => {const s=getComputedStyle(document.activeElement);return {style:s.outlineStyle,width:s.outlineWidth}})()`);
  assert.notEqual(focusStyle.style, 'none');
  assert.notEqual(focusStyle.width, '0px');

  const targetsBefore = (await browserCommand('Target.getTargets')).targetInfos.length;
  await evaluate(`(() => {
    const form=document.querySelector('[data-preview-form]');
    document.querySelector('#h03-product').value='catalogo';
    document.querySelector('#h03-product').dispatchEvent(new Event('change',{bubbles:true}));
    const mode=document.querySelector('input[name="continuityMode"][value="annual_prepay"]');
    mode.checked=true; mode.dispatchEvent(new Event('change',{bubbles:true}));
    document.querySelector('[data-project-name]').value='Proyecto de prueba C10';
    document.querySelector('[data-domain-status]').value='owned';
    document.querySelector('[data-project-objective]').value='Revisar una vitrina no transaccional';
    document.querySelector('[data-create-request]').click();
    return form.checkValidity();
  })()`);
  let requestState;
  for (let i = 0; i < 100; i += 1) {
    requestState = await evaluate(`({visible:!document.querySelector('[data-request-panel]').hidden,status:document.querySelector('[data-request-status]').textContent,linkHidden:document.querySelector('[data-whatsapp-link]').hidden,activation:document.querySelector('[data-request-activation]').textContent,continuity:document.querySelector('[data-request-continuity]').textContent,continuityNote:document.querySelector('[data-request-continuity-note]').textContent})`);
    if (requestState.visible) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.equal(requestState.visible, true);
  assert.match(requestState.status, /borrador interno preparado/i);
  assert.equal(requestState.linkHidden, true, 'creating a draft must not open or expose WhatsApp yet');
  assert.equal(requestState.activation, '$160.000');
  assert.match(requestState.continuity, /\$268\.920/);
  assert.match(requestState.continuityNote, /prepago de continuidad.*separado de la activación/i);
  assert.equal((await browserCommand('Target.getTargets')).targetInfos.length, targetsBefore, 'draft creation must not open a new browser target');

  await command('Network.setBlockedURLs', { urls: ['*h03-preview-request*'] });
  await evaluate(`document.querySelector('[data-validate-request]').click()`);
  let apiFailure;
  for (let i = 0; i < 100; i += 1) {
    apiFailure = await evaluate(`({status:document.querySelector('[data-review-status]').textContent,linkHidden:document.querySelector('[data-whatsapp-link]').hidden,message:document.querySelector('[data-whatsapp-draft]').value})`);
    if (apiFailure.status.includes('No se pudo validar')) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.match(apiFailure.status, /No se pudo validar el borrador/);
  assert.equal(apiFailure.linkHidden, true);
  assert.match(apiFailure.message, /no constituye orden, pago ni aceptación contractual/);
  await command('Network.setBlockedURLs', { urls: [] });
  await evaluate(`document.querySelector('[data-validate-request]').click()`);
  let validatedState;
  for (let i = 0; i < 100; i += 1) {
    validatedState = await evaluate(`({visible:!document.querySelector('[data-whatsapp-link]').hidden,href:document.querySelector('[data-whatsapp-link]').getAttribute('href'),message:document.querySelector('[data-whatsapp-draft]').value,status:document.querySelector('[data-review-status]').textContent})`);
    if (validatedState.visible || validatedState.status.includes('No se pudo')) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.equal(validatedState.visible, true);
  assert.match(validatedState.href, /^https:\/\/wa\.me\/56912345678\?/);
  assert.match(validatedState.message, /no constituye orden, pago ni aceptación contractual/);
  assert.match(validatedState.status, /El enlace quedó disponible/);
  assert.equal((await browserCommand('Target.getTargets')).targetInfos.length, targetsBefore, 'validating the draft must not open WhatsApp automatically');

  await evaluate(`(() => {window.__c10WhatsAppClick={fired:false,defaultPrevented:false,trusted:false};const link=document.querySelector('[data-whatsapp-link]');link.addEventListener('click',event=>{window.__c10WhatsAppClick={fired:true,defaultPrevented:event.defaultPrevented,trusted:event.isTrusted}},{once:true});link.focus()})()`);
  await command('Network.setBlockedURLs', { urls: ['*wa.me/*'] });
  await sendKey('Enter', 'Enter', 13);
  let openedWhatsApp;
  for (let i = 0; i < 50; i += 1) {
    const openedTargets = (await browserCommand('Target.getTargets')).targetInfos;
    openedWhatsApp = openedTargets.find((target) => target.url.startsWith('https://wa.me/56912345678?text='));
    if (openedWhatsApp) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const explicitClick = await evaluate(`window.__c10WhatsAppClick`);
  assert.equal(explicitClick.fired, true, 'the WhatsApp action was triggered by an explicit keyboard activation');
  assert.equal(explicitClick.trusted, true);
  assert.equal(explicitClick.defaultPrevented, false);
  const messageFallback = await evaluate(`({visible:document.querySelector('[data-whatsapp-draft]').getClientRects().length>0,text:document.querySelector('[data-whatsapp-draft]').value,copyButtonVisible:document.querySelector('[data-copy-message]').getClientRects().length>0})`);
  assert.equal(messageFallback.visible, true);
  assert.equal(messageFallback.copyButtonVisible, true);
  assert.match(messageFallback.text, /no constituye orden, pago ni aceptación contractual/);
  if (openedWhatsApp) {
    assert.match(openedWhatsApp.url, /no\+constituye\+orden%2C\+pago\+ni\+aceptaci%C3%B3n\+contractual/i);
    await browserCommand('Target.closeTarget', { targetId: openedWhatsApp.targetId });
  }

  const reviewReports = [];
  for (const width of [320, 500, 1440]) {
    await command('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    await evaluate(`document.querySelector('[data-request-panel]').scrollIntoView({behavior:'instant',block:'start'})`);
    await evaluate(`new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))`);
    const report = await evaluate(`(() => ({width:innerWidth,documentWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,reviewVisible:!document.querySelector('[data-request-panel]').hidden,reviewWidth:Math.round(document.querySelector('[data-request-panel]').getBoundingClientRect().width),reviewTop:Math.round(document.querySelector('[data-request-panel]').getBoundingClientRect().top),eyebrowTop:Math.round(document.querySelector('[data-request-panel] .eyebrow').getBoundingClientRect().top),headerBottom:Math.round(document.querySelector('.site-header').getBoundingClientRect().bottom),reviewHeadingVisible:document.querySelector('#h03-request-title').getBoundingClientRect().top>=document.querySelector('.site-header').getBoundingClientRect().bottom,projectLabels:document.querySelector('#h03-project-name').labels.length,liveStatus:document.querySelector('[data-review-status]').getAttribute('aria-live'),linkTarget:document.querySelector('[data-whatsapp-link]').target}))()`);
    assert.equal(report.overflow, false, `review overflow at ${width}px: ${JSON.stringify(report)}`);
    assert.equal(report.reviewVisible, true);
    assert.ok(report.eyebrowTop >= report.headerBottom, `review banner must clear sticky header at ${width}px: ${JSON.stringify(report)}`);
    assert.equal(report.projectLabels, 1);
    assert.equal(report.liveStatus, 'polite');
    assert.equal(report.linkTarget, '_blank');
    report.contrast = [];
    for (const theme of ['dark', 'light', 'cyan']) {
      await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(theme)}`);
      const reviewContrast = await evaluate(contrastExpression);
      for (const item of reviewContrast) {
        const large = parseFloat(item.fontSize) >= 24 || (parseFloat(item.fontSize) >= 18.66 && Number(item.weight) >= 700);
        assert.ok(item.ratio >= (large ? 3 : 4.5), `${theme} review contrast failure at ${width}px: ${JSON.stringify(item)}`);
      }
      report.contrast.push({ theme, minimum: Math.min(...reviewContrast.map((item) => item.ratio)) });
    }
    await evaluate(`document.documentElement.dataset.theme='dark'`);
    const screenshot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(`/tmp/evcom-c10-request-${width}.png`, Buffer.from(screenshot.data, 'base64'));
    reviewReports.push(report);
  }

  await command('Network.setBlockedURLs', { urls: ['*commercial-pricing*'] });
  const loading = await evaluate(`(() => {const select=document.querySelector('#h03-product');select.value='corporativa';select.dispatchEvent(new Event('change',{bubbles:true}));return {busy:document.querySelector('[data-summary]').getAttribute('aria-busy'),status:document.querySelector('[data-status]').textContent,role:document.querySelector('[data-status]').getAttribute('role')}})()`);
  assert.equal(loading.busy, 'true');
  assert.equal(loading.status, 'Consultando las reglas internas…');
  assert.equal(loading.role, 'status');
  let errorState;
  for (let i = 0; i < 50; i += 1) {
    errorState = await evaluate(`({busy:document.querySelector('[data-summary]').getAttribute('aria-busy'),status:document.querySelector('[data-status]').textContent,hasPrices:!document.querySelector('[data-breakdown]').hidden})`);
    if (errorState.busy === 'false') break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.equal(errorState.status, 'No fue posible acceder a las reglas internas. No se muestran precios alternativos.');
  assert.equal(errorState.hasPrices, false);

  process.stdout.write(JSON.stringify({ responsive: reports, reviewResponsive: reviewReports, request: requestState, apiFailure, validated: { href: validatedState.href, status: validatedState.status, targetCount: targetsBefore }, explicitWhatsAppClick: { fired: explicitClick.fired, openedComposer: Boolean(openedWhatsApp), messageFallbackVisible: messageFallback.visible, messageStillRequiresWhatsAppSend: true }, keyboard: { firstRadio, keyboardMode, nextIsProjectName, focusStyle }, loading, errorState, screenshots: '/tmp/evcom-c10-preview-{320,500,1440}.png and /tmp/evcom-c10-request-{320,500,1440}.png' }, null, 2) + '\n');
} finally {
  if (ws && ws.readyState === WebSocket.OPEN) ws.close();
  if (chrome?.exitCode === null) chrome.kill('SIGTERM');
  if (astro.exitCode === null) {
    astro.kill('SIGTERM');
    await Promise.race([once(astro, 'exit'), new Promise((resolve) => setTimeout(resolve, 2500))]);
  }
  if (tempProfile) await rm(tempProfile, { recursive: true, force: true }).catch(() => {});
  await rm(tempRuntime, { recursive: true, force: true }).catch(() => {});
}
