import { respondWithWebsiteLead } from "./deliver";
import { summarizeFormPayload } from "./form-details";

type FormPayload = {
  form: string;
  name: string;
  hotel?: string;
  organization?: string;
  business?: string;
  phone?: string;
  email?: string;
  province?: string;
  location?: string;
  website?: string;
  link?: string;
  details?: string;
  message?: string;
  concerns?: string[];
  type?: string;
  pageUrl?: string;
  locale?: string;
  utm?: Record<string, string>;
  [key: string]: unknown;
};

export function respondFromForm(payload: FormPayload) {
  const raw = payload as Record<string, unknown>;
  return respondWithWebsiteLead({
    form: payload.form,
    name: payload.name,
    businessName:
      payload.hotel ||
      payload.organization ||
      payload.business ||
      (typeof payload.businessName === "string" ? payload.businessName : "") ||
      "",
    businessType: payload.type ?? "",
    phone: payload.phone,
    email: payload.email,
    location: payload.province ?? payload.location ?? "",
    website: payload.website ?? payload.link ?? "",
    message: summarizeFormPayload(raw),
    pageUrl: payload.pageUrl,
    locale: payload.locale,
    utm: payload.utm,
    raw,
  });
}
