"use client";

import { StickyEnquiryCta } from "@/components/StickyEnquiryCta";

export function RevenueStickyCta({ label }: { label: string }) {
  return <StickyEnquiryCta formId="revenue-enquiry" label={label} className="kpi-revenue-sticky" />;
}
