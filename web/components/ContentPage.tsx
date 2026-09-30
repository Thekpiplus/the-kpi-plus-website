import { HandoffArticle } from "@/components/HandoffArticle";
import { SiteShell } from "@/components/SiteShell";
import { loadHandoff } from "@/lib/handoff";
import { localeFromPath } from "@/lib/seo";

export function ContentPage({ route }: { route: string }) {
  const locale = localeFromPath(route);
  const blocks = loadHandoff(route);
  return (
    <SiteShell locale={locale} route={route}>
      <HandoffArticle blocks={blocks} locale={locale} />
    </SiteShell>
  );
}
