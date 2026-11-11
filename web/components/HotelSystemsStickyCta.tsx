"use client";

import { StickyEnquiryCta } from "@/components/StickyEnquiryCta";

export function HotelSystemsStickyCta({ label }: { label: string }) {
  return (
    <StickyEnquiryCta
      formId="hotel-systems-enquiry"
      label={label}
      buttonClassName="kpi-button w-full bg-[#a2dc25] text-[#0b1f33]"
    />
  );
}
