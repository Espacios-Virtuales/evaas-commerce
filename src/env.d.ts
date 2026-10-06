/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_EV_SITE_URL?: string;
  readonly PUBLIC_EV_LINKEDIN_URL?: string;
  readonly PUBLIC_EV_INSTAGRAM_URL?: string;
  readonly PUBLIC_EV_FACEBOOK_URL?: string;
  readonly PUBLIC_EV_YOUTUBE_CHANNEL_URL?: string;
  readonly PUBLIC_EV_LINKEDIN_ENABLED?: string;
  readonly PUBLIC_EV_INSTAGRAM_ENABLED?: string;
  readonly PUBLIC_EV_FACEBOOK_ENABLED?: string;
  readonly PUBLIC_EV_WHATSAPP?: string;
  readonly PUBLIC_EV_SALES_EMAIL?: string;
}

interface Window {
  dataLayer: Record<string, unknown>[];
  evaasAttribution: { source: string; campaign: string; medium: string };
  evaasTrack?: (name: string, detail?: Record<string, unknown>) => void;
  evaasCommercial?: {
    get: () => {
      version: 2;
      product: 'landing' | 'catalogo' | 'corporativa' | null;
      pricing: { currency: 'CLP'; basePrice: number; discountRate: number; discountAmount: number; total: number; campaignCode: string | null } | null;
      campaignCode: string | null;
      projectColor: 'forest' | 'garnet' | 'ocean' | null;
      coupon: null;
      reference: string | null;
      attribution: { source: string; medium: string; campaign: string };
    };
    setProduct: (product: 'landing' | 'catalogo' | 'corporativa' | null) => boolean;
    setProjectColor: (color: 'forest' | 'garnet' | 'ocean' | null) => boolean;
    setCampaignCode: (code: string | null) => boolean;
    setReference: (reference: string | null) => boolean;
    contextualizeUrl: (url: string) => string;
  };
  __evaasTrackQueue?: [string, Record<string, unknown>?][];
}

declare module 'aos' {
  interface AosOptions {
    once?: boolean;
    mirror?: boolean;
    offset?: number;
    duration?: number;
    easing?: string;
    disable?: boolean | (() => boolean);
  }

  const AOS: {
    init(options?: AosOptions): void;
    refreshHard(): void;
  };

  export default AOS;
}
