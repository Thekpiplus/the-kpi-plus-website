"use client";

import { StickyEnquiryCta } from "@/components/StickyEnquiryCta";

export function GoogleAdsStickyCta({ label }: { label: string }) {
  return <StickyEnquiryCta formId="google-ads-enquiry" label={label} />;
}
