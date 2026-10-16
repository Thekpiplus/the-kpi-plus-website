import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { ensureInsightFromSite } from "@/lib/cms/actions";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = await ensureInsightFromSite(decodeURIComponent(slug));
  redirect(`/crm/cms/insights/${id}`);
}
