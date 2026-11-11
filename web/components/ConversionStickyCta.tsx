"use client";

import { StickyEnquiryCta } from "@/components/StickyEnquiryCta";

export function ConversionStickyCta({ label }: { label: string }) {
  return <StickyEnquiryCta formId="conversion-enquiry" label={label} />;
}
