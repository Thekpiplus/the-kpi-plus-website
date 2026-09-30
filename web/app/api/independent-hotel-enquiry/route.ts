import { handleEnquiry } from "@/lib/enquiry-handler";

export async function POST(request: Request) {
  const body = ((await request.json().catch(() => null)) ?? {}) as Record<string, unknown>;
  return handleEnquiry({
    ...body,
    form: body.form ?? "independent_hotel_enquiry",
    serviceInterest: body.serviceInterest ?? "independent_hotel",
  });
}
