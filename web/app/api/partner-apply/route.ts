import { NextResponse } from "next/server";
import { isFourDigitPin } from "@/lib/crm/security";
import { crmEnabled } from "@/lib/crm/db";
import { savePublicPartnerApplication } from "@/lib/partners/apply-public";

function text(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  if (!crmEnabled()) {
    return NextResponse.redirect(new URL("/partner?error=unavailable#apply", request.url), 303);
  }

  const form = await request.formData();
  if (text(form.get("company_website"))) {
    return NextResponse.redirect(new URL("/partner?sent=1#apply", request.url), 303);
  }

  const fullName = text(form.get("fullName"));
  const email = text(form.get("email")).toLowerCase();
  const phone = text(form.get("phone"));
  const territory = text(form.get("territory"));
  const businessType = text(form.get("businessType"));
  const accuracy = form.get("accuracy") === "1";
  const terms = form.get("terms") === "1";

  const pin = text(form.get("pin"));
  if (!fullName || !email.includes("@") || !phone || !territory || !businessType || !accuracy || !terms) {
    return NextResponse.redirect(new URL("/partner?error=invalid#apply", request.url), 303);
  }
  if (!isFourDigitPin(pin)) {
    return NextResponse.redirect(new URL("/partner?error=pin#apply", request.url), 303);
  }

  await savePublicPartnerApplication({
    fullName,
    email,
    phone,
    territory,
    company: text(form.get("company")),
    jobTitle: text(form.get("jobTitle")),
    website: text(form.get("website")),
    businessType,
    experience: text(form.get("experience")),
    intro: text(form.get("intro")),
    interest: text(form.get("interest")),
    segments: form.getAll("segments").map(String).filter(Boolean),
    pin,
    pageUrl: "/partner",
  });

  return NextResponse.redirect(new URL("/partner?sent=1#apply", request.url), 303);
}
