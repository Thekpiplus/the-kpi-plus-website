import { NextResponse } from "next/server";
import { placeReviewLink } from "@/lib/google-places";
import { clientKey, isGoogleHost, parseGoogleUrl, rateLimit } from "@/lib/review-link";

const SHORT_HOSTS = new Set(["maps.app.goo.gl", "goo.gl", "g.page"]);

async function resolveGoogleUrl(url: URL) {
  if (!SHORT_HOSTS.has(url.hostname.toLowerCase()) && !url.hostname.endsWith(".g.page")) {
    return url;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "TheKPIPlus-ReviewLink/1.0" },
    });
    const finalUrl = new URL(response.url);
    if (finalUrl.protocol !== "https:" || !isGoogleHost(finalUrl.hostname)) return url;
    return finalUrl;
  } catch {
    return url;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request) {
  if (!rateLimit(`import:${clientKey(request)}`)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const body = ((await request.json().catch(() => null)) ?? {}) as { url?: string };
  const parsed = parseGoogleUrl(typeof body.url === "string" ? body.url : "");
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const resolved = await resolveGoogleUrl(parsed.url);
  const again = parseGoogleUrl(resolved.toString());
  if ("error" in again) {
    return NextResponse.json({ error: again.error }, { status: 400 });
  }

  if (again.placeId) {
    const result = await placeReviewLink(again.placeId);
    if ("place" in result && result.place && "reviewUri" in result.place) {
      return NextResponse.json({ place: result.place });
    }
    if (again.isReview) {
      return NextResponse.json({
        place: {
          placeId: again.placeId,
          name: "",
          address: "",
          type: "",
          reviewUri: again.url.toString(),
        },
      });
    }
    return NextResponse.json(
      { error: "error" in result ? result.error : "no_review_link" },
      { status: 422 },
    );
  }

  if (again.isReview) {
    return NextResponse.json({
      place: {
        placeId: "",
        name: "",
        address: "",
        type: "",
        reviewUri: again.url.toString(),
      },
    });
  }

  return NextResponse.json({ error: "invalid_link" }, { status: 400 });
}