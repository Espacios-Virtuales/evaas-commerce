/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_EV_WHATSAPP?: string;
  readonly PUBLIC_EV_SALES_EMAIL?: string;
}

interface Window {
  dataLayer: Record<string, unknown>[];
  evaasAttribution: { source: string; campaign: string; medium: string };
  evaasTrack?: (name: string, detail?: Record<string, unknown>) => void;
  evaasCommercial?: {
    get: () => {
      version: 1;
      product: 'landing' | 'catalogo' | 'corporativa' | null;
      pricing: { currency: 'CLP'; net: number; vatRate: 19; vat: number; total: number } | null;
      projectColor: 'forest' | 'garnet' | 'ocean' | null;
      coupon: null;
      reference: string | null;
      attribution: { source: string; medium: string; campaign: string };
    };
    setProduct: (product: 'landing' | 'catalogo' | 'corporativa' | null) => boolean;
    setProjectColor: (color: 'forest' | 'garnet' | 'ocean' | null) => boolean;
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
