import { enquiryPayload, handleEnquiry } from "@/lib/enquiry-handler";

export async function POST(request: Request) {
  const body = ((await request.json().catch(() => null)) ?? {}) as Record<string, unknown>;
  return handleEnquiry(enquiryPayload(body, { form: "google_ads_enquiry", serviceInterest: "google_ads" }));
}
