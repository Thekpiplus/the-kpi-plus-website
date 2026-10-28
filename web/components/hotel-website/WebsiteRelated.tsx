import type { Locale } from "@/lib/seo";
import { WebsiteRelatedCards } from "./WebsiteRelatedCards";
import { WebsiteRelatedVisual } from "./WebsiteRelatedVisual";

export function WebsiteRelated({
  locale,
  src,
  alt,
  status,
  overrides,
}: {
  locale: Locale;
  src?: string;
  alt?: string;
  status?: string;
  overrides?: Array<{ id?: string; title?: string; body?: string; href?: string; cta?: string; featured?: boolean }>;
}) {
  return (
    <div className="web-related">
      <WebsiteRelatedVisual locale={locale} src={src} alt={alt} status={status} />
      <WebsiteRelatedCards locale={locale} overrides={overrides} />
    </div>
  );
}
