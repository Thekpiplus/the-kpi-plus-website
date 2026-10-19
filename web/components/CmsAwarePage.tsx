import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { cmsMetadata, isCmsPageLive, storedPageByPath } from "@/lib/cms/public";
import { metadataFor } from "@/lib/seo";

/**
 * Designed routes keep their React layout. A CMS row only gates publish/offline
 * and (via cmsAwareMetadata / SiteShell) SEO. Full CMS body rendering is for
 * catch-all pages and insights — not these branded views.
 */
export async function CmsAwarePage({
  route,
  children,
}: {
  route: string;
  children: ReactNode;
}) {
  const stored = await storedPageByPath(route);
  if (!stored) return children;
  if (!isCmsPageLive(stored)) notFound();
  return children;
}

export async function cmsAwareMetadata(route: string) {
  const stored = await storedPageByPath(route);
  if (stored && isCmsPageLive(stored)) return cmsMetadata(stored);
  return metadataFor(route);
}
