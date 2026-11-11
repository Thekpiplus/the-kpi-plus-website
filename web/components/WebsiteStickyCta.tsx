"use client";

import { StickyEnquiryCta } from "@/components/StickyEnquiryCta";

export function WebsiteStickyCta({ label }: { label: string }) {
  return <StickyEnquiryCta formId="website-enquiry" label={label} />;
}
