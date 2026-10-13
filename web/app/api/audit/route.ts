import { handleEnquiry } from "@/lib/enquiry-handler";

/**
 * Detailed hotel performance assessment — kept as a longer journey on the homepage.
 * Submissions still map into the shared lead structure used by Lead Management.
 */
export async function POST(request: Request) {
  const body = ((await request.json().catch(() => null)) ?? {}) as Record<string, unknown>;
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const lineId = typeof body.lineId === "string" ? body.lineId.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const contact = phone || lineId || email || (typeof body.contact === "string" ? body.contact : "");

  const businessName =
    typeof body.hotel === "string"
      ? body.hotel
      : typeof body.businessName === "string"
        ? body.businessName
        : undefined;
  const message =
    typeof body.details === "string"
      ? body.details
      : typeof body.message === "string"
        ? body.message
        : undefined;

  return handleEnquiry({
    ...body,
    form: "hotel_performance_audit",
    serviceInterest: "revenue",
    businessName,
    contact,
    phone: phone || undefined,
    email: email || undefined,
    message,
  });
}
