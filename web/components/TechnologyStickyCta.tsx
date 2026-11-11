"use client";

import { StickyEnquiryCta } from "@/components/StickyEnquiryCta";

export function TechnologyStickyCta({ label }: { label: string }) {
  return (
    <StickyEnquiryCta
      formId="technology-enquiry"
      label={label}
      buttonClassName="kpi-button w-full bg-[#a2dc25] text-[#0b1f33]"
    />
  );
}
