import { NextResponse } from "next/server";
import { searchPlaces } from "@/lib/google-places";
import { clientKey, rateLimit } from "@/lib/review-link";

export async function POST(request: Request) {
  if (!rateLimit(`search:${clientKey(request)}`)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const body = ((await request.json().catch(() => null)) ?? {}) as { name?: string };
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const result = await searchPlaces(name);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: statusFor(result.error) });
  }
  return NextResponse.json({ places: result.places });
}

function statusFor(error: string) {
  if (error === "not_configured") return 503;
  if (error === "empty") return 404;
  if (error === "quota") return 429;
  if (error === "forbidden") return 403;
  if (error === "unavailable") return 502;
  return 400;
}
