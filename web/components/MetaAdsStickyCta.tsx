"use client";

import { StickyEnquiryCta } from "@/components/StickyEnquiryCta";

export function MetaAdsStickyCta({ label }: { label: string }) {
  return <StickyEnquiryCta formId="meta-ads-enquiry" label={label} />;
}
