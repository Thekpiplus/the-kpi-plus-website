import { handleEnquiry } from "@/lib/enquiry-handler";

export async function POST(request: Request) {
  const body = ((await request.json().catch(() => null)) ?? {}) as Record<string, unknown>;
  return handleEnquiry({ ...body, form: body.form ?? "contact_enquiry", serviceInterest: body.serviceInterest ?? "general" });
}
