/// <reference types="astro/client" />

interface Window {
  dataLayer: Record<string, unknown>[];
  evaasAttribution: { source: string; campaign: string; medium: string };
  evaasTrack?: (name: string, detail?: Record<string, unknown>) => void;
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
