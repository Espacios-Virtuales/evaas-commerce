import { getSalesEmail, getWhatsAppConfig } from './whatsapp';

export type PublicChannel = {
  id: string;
  label: string;
  href: string;
  external: boolean;
};

function getHttpsUrl(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim() === '') return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return null;
    return value.trim();
  } catch {
    return null;
  }
}

function getSocialChannel(
  id: string,
  label: string,
  url: unknown,
  enabled: unknown
): PublicChannel | null {
  if (enabled !== 'true') return null;
  const href = getHttpsUrl(url);
  return href ? { id, label, href, external: true } : null;
}

export function getOfficialSite(): PublicChannel | null {
  const href = getHttpsUrl(import.meta.env.PUBLIC_EV_SITE_URL);
  return href ? { id: 'site', label: 'Sitio oficial', href, external: true } : null;
}

export function getOfficialSocialChannels(): PublicChannel[] {
  const channels = [
    getSocialChannel('linkedin', 'LinkedIn', import.meta.env.PUBLIC_EV_LINKEDIN_URL, import.meta.env.PUBLIC_EV_LINKEDIN_ENABLED),
    getSocialChannel('instagram', 'Instagram', import.meta.env.PUBLIC_EV_INSTAGRAM_URL, import.meta.env.PUBLIC_EV_INSTAGRAM_ENABLED),
    getSocialChannel('facebook', 'Facebook', import.meta.env.PUBLIC_EV_FACEBOOK_URL, import.meta.env.PUBLIC_EV_FACEBOOK_ENABLED),
    getSocialChannel('youtube', 'YouTube', import.meta.env.PUBLIC_EV_YOUTUBE_CHANNEL_URL, 'true')
  ];
  return channels.filter((channel): channel is PublicChannel => channel !== null);
}

export function getCommercialEmail() {
  const email = getSalesEmail();
  return email ? { address: email, href: `mailto:${email}` } : null;
}

export function getCommercialWhatsApp() {
  const config = getWhatsAppConfig();
  return config ? { href: config.baseUrl } : null;
}
