import { WEBSITE_FRAMEWORK_STAGES } from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";
import { WebsiteFrameworkBoundary } from "./WebsiteFrameworkBoundary";
import { WebsiteFrameworkMatrix, type WebsiteFrameworkStepView } from "./WebsiteFrameworkMatrix";
import { WebsiteFrameworkVisual } from "./WebsiteFrameworkVisual";

export function WebsiteFramework({
  locale,
  src,
  steps,
}: {
  locale: Locale;
  src?: string;
  steps?: WebsiteFrameworkStepView[];
}) {
  const thai = locale === "th";
  return (
    <div className="web-framework">
      <WebsiteFrameworkVisual locale={locale} src={src} />
      <ol className="web-framework-path" aria-label={thai ? "เส้นทางกรอบบริการ" : "Service framework path"}>
        {WEBSITE_FRAMEWORK_STAGES.map((stage, index) => (
          <li key={stage.id}>
            <span className="kpi-latin web-framework-path-num">{String(index + 1).padStart(2, "0")}</span>
            <span className="kpi-latin web-framework-path-label">{thai ? stage.th : stage.en}</span>
          </li>
        ))}
      </ol>
      <WebsiteFrameworkMatrix locale={locale} steps={steps} />
      <WebsiteFrameworkBoundary locale={locale} />
    </div>
  );
}
