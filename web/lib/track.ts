type TrackParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

import { hasAnalyticsConsent } from "@/lib/consent-client";

export function track(event: string, params: TrackParams = {}) {
  if (typeof window === "undefined") return;
  const clean = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...clean });
  if (hasAnalyticsConsent()) window.gtag?.("event", event, clean);
}
