import type { APIRoute } from 'astro';

export const prerender = false;

const allowedProducts = new Set(['landing', 'catalogo', 'corporativa']);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ message: 'Formato de solicitud no válido.' }, { status: 415 });
  }

  let input: Record<string, any>;
  try {
    input = await request.json();
  } catch {
    return Response.json({ message: 'No fue posible leer la solicitud.' }, { status: 400 });
  }

  if (input.website) return Response.json({ ok: true, requestId: crypto.randomUUID() });
  const elapsed = Date.now() - Number(input.formStartedAt || 0);
  if (!Number.isFinite(elapsed) || elapsed < 1200 || elapsed > 86_400_000) {
    return Response.json({ message: 'La sesión expiró. Actualiza la página e intenta nuevamente.' }, { status: 400 });
  }

  const product = String(input.product || '');
  const name = String(input.name || '').trim().slice(0, 80);
  const email = String(input.email || '').trim().toLowerCase().slice(0, 160);
  const project = String(input.project || '').trim().slice(0, 100);
  const domainStatus = String(input.domainStatus || '');
  if (!allowedProducts.has(product) || !name || !project || !emailPattern.test(email) || !['owned', 'needed', 'unsure'].includes(domainStatus) || input.consent !== 'on') {
    return Response.json({ message: 'Revisa los datos obligatorios antes de continuar.' }, { status: 400 });
  }

  const requestId = crypto.randomUUID();
  const payload = {
    id: requestId,
    type: 'evaas_station_activation',
    createdAt: new Date().toISOString(),
    product,
    name,
    email,
    project,
    domainStatus,
    whatsapp: String(input.whatsapp || '').trim().slice(0, 30),
    context: String(input.context || '').trim().slice(0, 600),
    attribution: {
      source: String(input.attribution?.source || 'direct').slice(0, 100),
      medium: String(input.attribution?.medium || '').slice(0, 100),
      campaign: String(input.attribution?.campaign || '').slice(0, 100)
    }
  };

  const webhookUrl = import.meta.env.ACTIVATION_WEBHOOK_URL;
  if (!webhookUrl) {
    if (import.meta.env.DEV) return Response.json({ ok: true, requestId, preview: true });
    return Response.json({ message: 'El canal de activación aún no está conectado. No se enviaron tus datos.' }, { status: 503 });
  }

  try {
    const forwarded = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-EVAAS-Request-ID': requestId },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000)
    });
    if (!forwarded.ok) throw new Error(`Webhook ${forwarded.status}`);
  } catch {
    return Response.json({ message: 'No pudimos registrar la solicitud. Tus datos no quedaron confirmados; intenta nuevamente.' }, { status: 502 });
  }

  const checkoutUrls: Record<string, string | undefined> = {
    landing: import.meta.env.CHECKOUT_URL_LANDING,
    catalogo: import.meta.env.CHECKOUT_URL_CATALOGO,
    corporativa: import.meta.env.CHECKOUT_URL_CORPORATIVA
  };
  return Response.json({ ok: true, requestId, checkoutUrl: checkoutUrls[product] || null });
};
