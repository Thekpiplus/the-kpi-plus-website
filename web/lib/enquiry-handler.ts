import { NextResponse } from "next/server";
import { respondFromForm } from "@/lib/crm/from-form";
import { enquiryServiceByForm, enquiryServiceById, isEnquiryServiceId } from "@/lib/enquiry";

type Payload = {
  name?: string;
  businessName?: string;
  hotel?: string;
  contact?: string;
  phone?: string;
  email?: string;
  serviceInterest?: string;
  service?: string;
  form?: string;
  message?: string;
  details?: string;
  consent?: boolean;
  honeypot?: string;
  pageUrl?: string;
  utm?: Record<string, string>;
  locale?: string;
  /** Legacy fields — accepted and stored in raw payload, not required */
  [key: string]: unknown;
};

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function splitContact(value: string) {
  if (value.includes("@")) return { email: value, phone: "" };
  return { phone: value, email: "" };
}

function resolveService(body: Payload) {
  const byId = text(body.serviceInterest) || text(body.service);
  if (isEnquiryServiceId(byId)) return enquiryServiceById(byId);
  const byForm = text(body.form);
  if (byForm) return enquiryServiceByForm(byForm);
  return enquiryServiceById("general");
}

/**
 * Shared enquiry intake. Accepts the slim reusable form and older long payloads
 * so historical routes keep working while mapping into one lead structure.
 */
export async function handleEnquiry(body: Payload) {
  if (text(body.honeypot)) {
    return NextResponse.json({ ok: true });
  }

  const name = text(body.name);
  const businessName = text(body.businessName) || text(body.hotel) || text(body.organization) || text(body.business);
  const contact = text(body.contact) || text(body.phone) || text(body.email) || text(body.lineId);
  const message = text(body.message) || text(body.details);
  const service = resolveService(body);
  const split = splitContact(contact);
  const email = text(body.email) || split.email;
  const phone = text(body.phone) || split.phone;

  if (!name || !businessName || !contact || !service || !body.consent) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && contact.includes("@")) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const payload = {
    // Preserve any extra legacy fields in raw for historical continuity
    ...Object.fromEntries(
      Object.entries(body).filter(
        ([key]) =>
          ![
            "name",
            "businessName",
            "hotel",
            "organization",
            "business",
            "contact",
            "phone",
            "email",
            "serviceInterest",
            "service",
            "form",
            "message",
            "details",
            "consent",
            "honeypot",
            "pageUrl",
            "utm",
            "locale",
          ].includes(key),
      ),
    ),
    form: service.form,
    name,
    hotel: businessName,
    businessName,
    contact,
    phone,
    email,
    serviceInterest: service.id,
    serviceLabel: service.label[(text(body.locale) as "th" | "en" | "ru" | "zh") || "th"] || service.label.th,
    message,
    pageUrl: text(body.pageUrl),
    utm: body.utm ?? {},
    locale: text(body.locale) || "th",
    receivedAt: new Date().toISOString(),
  };

  return respondFromForm(payload);
}
