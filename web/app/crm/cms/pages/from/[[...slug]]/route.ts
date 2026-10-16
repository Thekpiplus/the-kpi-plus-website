import { NextRequest, NextResponse } from "next/server";
import { ensurePageFromSite } from "@/lib/cms/actions";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  try {
    const { slug } = await params;
    const route = !slug?.length ? "/" : `/${slug.map(decodeURIComponent).join("/")}`;
    const id = await ensurePageFromSite(route);
    return NextResponse.redirect(new URL(`/crm/cms/pages/${id}`, request.url));
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      String((error as { digest: unknown }).digest).includes("NEXT_REDIRECT")
    ) {
      throw error;
    }
    console.error("ensurePageFromSite failed", error);
    return NextResponse.redirect(new URL("/crm/cms?error=import", request.url));
  }
}
