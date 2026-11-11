"use client";

import { StickyEnquiryCta } from "@/components/StickyEnquiryCta";

export function TrainingStickyCta({ label }: { label: string }) {
  return (
    <StickyEnquiryCta
      formId="training-enquiry"
      label={label}
      buttonClassName="kpi-button w-full bg-[#a2dc25] text-[#0b1f33]"
    />
  );
}
