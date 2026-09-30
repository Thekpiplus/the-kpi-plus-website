import { SOURCES } from "./constants";

export const WEB_LEAD_SOURCES = ["website_form"] as const;
export const MANUAL_LEAD_SOURCES = SOURCES.filter((source) => source !== "website_form");

export const SOURCE_LABEL: Record<(typeof SOURCES)[number], string> = {
  website_form: "จากเว็บไซต์",
  phone: "โทรศัพท์",
  line: "LINE",
  whatsapp: "WhatsApp",
  referral: "คนรู้จักแนะนำ",
  partner_referral: "Partner Referral",
  event: "งานอีเวนต์",
  manual: "คีย์เอง",
};

export type LeadOrigin = "web" | "manual";

export function leadOrigin(source: string): LeadOrigin {
  return source === "website_form" ? "web" : "manual";
}

export function sourceLabel(source: string) {
  return SOURCE_LABEL[source as keyof typeof SOURCE_LABEL] ?? source;
}

export function originLabel(origin: LeadOrigin) {
  return origin === "web" ? "ลีดจากเว็บไซต์" : "ลีดที่คีย์เอง / แหล่งอื่น";
}
