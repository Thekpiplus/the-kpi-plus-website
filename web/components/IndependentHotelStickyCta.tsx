"use client";

import { StickyEnquiryCta } from "@/components/StickyEnquiryCta";

export function IndependentHotelStickyCta({ label }: { label: string }) {
  return (
    <StickyEnquiryCta
      formId="independent-hotel-enquiry"
      label={label}
      buttonClassName="kpi-button w-full"
      buttonStyle={{ background: "#a2dc25", color: "#0b1f33" }}
    />
  );
}
