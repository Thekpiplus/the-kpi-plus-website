import { handleEnquiry } from "@/lib/enquiry-handler";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) ?? {};
  return handleEnquiry(body as Record<string, unknown>);
}
