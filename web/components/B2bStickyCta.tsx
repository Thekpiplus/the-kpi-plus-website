"use client";

import { StickyEnquiryCta } from "@/components/StickyEnquiryCta";

export function B2bStickyCta({ label }: { label: string }) {
  return <StickyEnquiryCta formId="b2b-enquiry" label={label} />;
}
