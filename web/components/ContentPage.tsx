import { notFound } from "next/navigation";
import { CmsDocumentView } from "@/components/CmsDocumentView";
import { HandoffArticle } from "@/components/HandoffArticle";
import { SiteShell } from "@/components/SiteShell";
import { isCmsPageLive, storedPageByPath } from "@/lib/cms/public";
import { loadHandoff } from "@/lib/handoff";
import { localeFromPath } from "@/lib/seo";

export async function ContentPage({ route }: { route: string }) {
  const stored = await storedPageByPath(route);
  if (stored) {
    if (isCmsPageLive(stored)) return <CmsDocumentView doc={stored} />;
    notFound();
  }

  const locale = localeFromPath(route);
  const blocks = loadHandoff(route);
  return (
    <SiteShell locale={locale} route={route}>
      <HandoffArticle blocks={blocks} locale={locale} />
    </SiteShell>
  );
}
