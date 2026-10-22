import { InsightMediaFrame } from "@/components/insights/InsightMediaFrame";
import { INSIGHT_MEDIA_SLOTS, existingPublicSrc } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const SLOT = INSIGHT_MEDIA_SLOTS["download-guide"];

export function InsightDownloadGuide({
  locale,
  src = "",
  alt,
}: {
  locale: Locale;
  src?: string;
  alt?: string;
}) {
  const resolved = existingPublicSrc(src) || existingPublicSrc(SLOT.reservedSrc);
  const copy = locale === "th" ? SLOT.label.th : SLOT.label.en;
  const resolvedAlt = alt?.trim() || (locale === "th" ? SLOT.defaultAlt.th : SLOT.defaultAlt.en);

  // TODO: Render this only when a real downloadable guide exists. Do not invent a PDF, hotel, or result.
  return (
    <InsightMediaFrame
      src={resolved}
      alt={resolvedAlt}
      label={copy}
      locale={locale}
      fit={SLOT.fit}
      status="placeholder"
      displayWidth={SLOT.displayWidth}
      displayHeight={SLOT.displayHeight}
      sourceWidth={SLOT.sourceWidth}
      sourceHeight={SLOT.sourceHeight}
      className="kpi-insight-guide-media"
    />
  );
}
