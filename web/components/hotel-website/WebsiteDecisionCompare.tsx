import { WEBSITE_DECISION_PATHS, WEBSITE_DECISION_VISUAL, websiteSampleLabel } from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";

function markLatin(text: string) {
  const parts = text.split(/(Booking Engine|CMS|SEO|UX|Technical SEO)/g);
  return parts.map((part, index) =>
    /^(Booking Engine|CMS|SEO|UX|Technical SEO)$/.test(part) ? (
      <span key={`${part}-${index}`} className="kpi-latin">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export type WebsiteDecisionPathView = {
  id?: string;
  title?: string;
  starting?: string[];
  advantages?: string;
  risks?: string;
  dependencies?: string;
  next?: string;
};

export function WebsiteDecisionCompare({ locale, paths }: { locale: Locale; paths?: WebsiteDecisionPathView[] }) {
  const thai = locale === "th";
  const fields = {
    starting: thai ? "จุดตั้งต้น" : "Starting condition",
    advantages: thai ? "ข้อดี" : "Advantages",
    risks: thai ? "ความเสี่ยง" : "Risks",
    dependencies: thai ? "สิ่งที่ขึ้นกับโรงแรม" : "Dependencies",
    next: thai ? "แนวทางถัดไปที่แนะนำ" : "Recommended next action",
  };

  return (
    <div className="web-decision-compare">
      <p className="web-decision-kicker">
        <span className="web-decision-badge">{websiteSampleLabel(locale)}</span>
        <span className="kpi-latin">{thai ? WEBSITE_DECISION_VISUAL.labelTh : WEBSITE_DECISION_VISUAL.labelEn}</span>
      </p>
      <div className="web-decision-grid">
        {(paths?.length ? paths : WEBSITE_DECISION_PATHS).map((path, index) => {
          const known = WEBSITE_DECISION_PATHS[index];
          const override = paths?.[index];
          const starting =
            override?.starting?.filter(Boolean).length
              ? override.starting
              : "startingTh" in path
                ? thai
                  ? path.startingTh
                  : path.startingEn
                : known
                  ? thai
                    ? known.startingTh
                    : known.startingEn
                  : [];
          const title =
            override?.title?.trim() ||
            ("titleTh" in path ? (thai ? path.titleTh : path.titleEn) : path.title) ||
            (thai ? known?.titleTh : known?.titleEn) ||
            "";
          return (
            <article key={override?.id || ("id" in path ? path.id : known?.id) || `path-${index}`} className="web-decision-card">
              <h3>{title}</h3>
              <dl>
                <div>
                  <dt>{fields.starting}</dt>
                  <dd>
                    <ul className="web-decision-points">
                      {starting.map((item) => (
                        <li key={item}>{markLatin(item)}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt>{fields.advantages}</dt>
                  <dd>{markLatin(override?.advantages?.trim() || ("advantagesTh" in path ? (thai ? path.advantagesTh : path.advantagesEn) : "") || (thai ? known?.advantagesTh : known?.advantagesEn) || "")}</dd>
                </div>
                <div>
                  <dt>{fields.risks}</dt>
                  <dd>{markLatin(override?.risks?.trim() || ("risksTh" in path ? (thai ? path.risksTh : path.risksEn) : "") || (thai ? known?.risksTh : known?.risksEn) || "")}</dd>
                </div>
                <div>
                  <dt>{fields.dependencies}</dt>
                  <dd>{markLatin(override?.dependencies?.trim() || ("dependenciesTh" in path ? (thai ? path.dependenciesTh : path.dependenciesEn) : "") || (thai ? known?.dependenciesTh : known?.dependenciesEn) || "")}</dd>
                </div>
                <div>
                  <dt>{fields.next}</dt>
                  <dd>{markLatin(override?.next?.trim() || ("nextTh" in path ? (thai ? path.nextTh : path.nextEn) : "") || (thai ? known?.nextTh : known?.nextEn) || "")}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </div>
  );
}
