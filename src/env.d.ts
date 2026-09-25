/// <reference types="astro/client" />

interface Window {
  dataLayer: Record<string, unknown>[];
  evaasAttribution: { source: string; campaign: string; medium: string };
  evaasTrack?: (name: string, detail?: Record<string, unknown>) => void;
}
