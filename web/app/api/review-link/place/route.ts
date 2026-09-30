import { NextResponse } from "next/server";
import { placeReviewLink } from "@/lib/google-places";
import { clientKey, rateLimit } from "@/lib/review-link";

export async function POST(request: Request) {
  if (!rateLimit(`place:${clientKey(request)}`)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const body = ((await request.json().catch(() => null)) ?? {}) as { placeId?: string };
  const result = await placeReviewLink(typeof body.placeId === "string" ? body.placeId : "");
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error, place: "place" in result ? result.place : undefined },
      { status: statusFor(result.error) },
    );
  }
  return NextResponse.json({ place: result.place });
}

function statusFor(error: string) {
  if (error === "not_configured") return 503;
  if (error === "no_review_link") return 422;
  if (error === "quota") return 429;
  if (error === "forbidden") return 403;
  if (error === "unavailable") return 502;
  if (error === "not_found") return 404;
  return 400;
}
