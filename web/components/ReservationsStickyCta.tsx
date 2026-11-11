"use client";

import { StickyEnquiryCta } from "@/components/StickyEnquiryCta";

export function ReservationsStickyCta({ label }: { label: string }) {
  return <StickyEnquiryCta formId="reservations-enquiry" label={label} />;
}
