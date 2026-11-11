"use client";

import { StickyEnquiryCta } from "@/components/StickyEnquiryCta";

export function SeoLocalStickyCta({ label }: { label: string }) {
  return <StickyEnquiryCta formId="search-enquiry" label={label} />;
}
