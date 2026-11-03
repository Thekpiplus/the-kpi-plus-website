import {
  HOTEL_TRAINING_OUTCOME_FIELDS,
  HOTEL_TRAINING_OUTCOME_LEVELS,
  HOTEL_TRAINING_OUTCOME_VISUAL,
  hotelTrainingSampleLabel,
} from "@/lib/hotel-training";
import type { Locale } from "@/lib/seo";

export type HotelTrainingOutcomeRow = {
  id: string;
  level: string;
  metricTh: string;
  metricEn: string;
  beforeTh: string;
  beforeEn: string;
  afterTh: string;
  afterEn: string;
  followTh: string;
  followEn: string;
  definitionTh: string;
  definitionEn: string;
  methodTh: string;
  methodEn: string;
  reviewerTh: string;
  reviewerEn: string;
  periodTh?: string;
  periodEn?: string;
  sourceTh?: string;
  sourceEn?: string;
  ownerTh?: string;
  ownerEn?: string;
  reviewStatus?: string;
  sample?: boolean;
};

function pickLocale(thai: boolean, th: string, en: string) {
  return (thai ? th : en).trim();
}

function OutcomeValue({
  value,
  sampleLabel,
  empty,
  sample,
}: {
  value: string;
  sampleLabel: string;
  empty: string;
  sample?: boolean;
}) {
  const next = value.trim();
  return (
    <>
      {sample ? <span className="ht-status is-yellow">{sampleLabel}</span> : null} {next || empty}
    </>
  );
}

export function HotelTrainingOutcomes({
  locale,
  title,
  lead,
  note,
  caption,
  empty,
  items,
}: {
  locale: Locale;
  title: string;
  lead: string;
  note?: string;
  caption: string;
  empty: string;
  items: readonly HotelTrainingOutcomeRow[];
}) {
  const thai = locale === "th";
  const sample = hotelTrainingSampleLabel(locale);
  const fields = HOTEL_TRAINING_OUTCOME_FIELDS;
  const label = thai ? HOTEL_TRAINING_OUTCOME_VISUAL.labelTh : HOTEL_TRAINING_OUTCOME_VISUAL.labelEn;
  const visible = items.filter((item) => pickLocale(thai, item.metricTh, item.metricEn));
  const grouped: Array<{
    level: { id: string; titleTh: string; titleEn: string; bodyTh: string; bodyEn: string };
    items: HotelTrainingOutcomeRow[];
  }> = HOTEL_TRAINING_OUTCOME_LEVELS.map((level) => ({
    level,
    items: visible.filter((item) => item.level === level.id),
  })).filter((group) => group.items.length);
  const leftover = visible.filter((item) => !HOTEL_TRAINING_OUTCOME_LEVELS.some((level) => level.id === item.level));
  if (leftover.length) {
    grouped.push({
      level: {
        id: "other",
        titleTh: thai ? fields.metric.th : fields.metric.en,
        titleEn: thai ? fields.metric.th : fields.metric.en,
        bodyTh: "",
        bodyEn: "",
      },
      items: leftover,
    });
  }

  return (
    <section id="training-outcomes" className="kpi-train-formats border-y border-[#E3E8EB] bg-white" aria-labelledby="training-outcomes-title">
      <div className="kpi-section">
        <h2 id="training-outcomes-title" className="kpi-h2">
          {title}
        </h2>
        <p className="kpi-train-problems-lead">{lead}</p>
        {note ? <p className="ht-gallery-note">{note}</p> : null}
        <p className="ht-status is-yellow">{sample}</p>
        <ol className="ht-outcome-levels">
          {HOTEL_TRAINING_OUTCOME_LEVELS.map((level, index) => (
            <li key={level.id}>
              <span className="kpi-latin kpi-train-num">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{thai ? level.titleTh : level.titleEn}</h3>
                <p>{thai ? level.bodyTh : level.bodyEn}</p>
              </div>
            </li>
          ))}
        </ol>
        <figure className="ht-outcome-scorecard">
          <div className="ht-outcome-scorecard-frame">
            <span className="ht-visual-badge">{sample}</span>
            <p className="ht-cycle-kicker kpi-latin">{label}</p>
            <div className="ht-outcome-wrap">
              <table className="ht-outcome-table">
                <caption className="sr-only">{caption}</caption>
                <thead>
                  <tr>
                    <th scope="col">{thai ? fields.metric.th : fields.metric.en}</th>
                    <th scope="col">{thai ? fields.before.th : fields.before.en}</th>
                    <th scope="col">{thai ? fields.after.th : fields.after.en}</th>
                    <th scope="col">{thai ? fields.follow.th : fields.follow.en}</th>
                    <th scope="col">{thai ? fields.definition.th : fields.definition.en}</th>
                    <th scope="col">{thai ? fields.method.th : fields.method.en}</th>
                    <th scope="col">{thai ? fields.reviewer.th : fields.reviewer.en}</th>
                  </tr>
                </thead>
                {grouped.map((group) => (
                  <tbody key={group.level.id}>
                    <tr className="ht-outcome-group">
                      <th scope="colgroup" colSpan={7}>
                        <span>{thai ? group.level.titleTh : group.level.titleEn}</span>
                        <small>{thai ? group.level.bodyTh : group.level.bodyEn}</small>
                      </th>
                    </tr>
                    {group.items.map((item) => (
                      <tr key={item.id}>
                        <th scope="row">
                          <span className="kpi-latin">{pickLocale(thai, item.metricTh, item.metricEn)}</span>
                          {item.sample ? <span className="ht-status is-yellow">{sample}</span> : null}
                        </th>
                        <td data-label={thai ? fields.before.th : fields.before.en}>
                          <OutcomeValue value={pickLocale(thai, item.beforeTh, item.beforeEn)} sampleLabel={sample} empty={empty} sample={item.sample || item.reviewStatus !== "verified"} />
                        </td>
                        <td data-label={thai ? fields.after.th : fields.after.en}>
                          <OutcomeValue value={pickLocale(thai, item.afterTh, item.afterEn)} sampleLabel={sample} empty={empty} sample={item.sample || item.reviewStatus !== "verified"} />
                        </td>
                        <td data-label={thai ? fields.follow.th : fields.follow.en}>
                          <OutcomeValue value={pickLocale(thai, item.followTh, item.followEn)} sampleLabel={sample} empty={empty} sample={item.sample || item.reviewStatus !== "verified"} />
                        </td>
                        <td data-label={thai ? fields.definition.th : fields.definition.en}>{pickLocale(thai, item.definitionTh, item.definitionEn)}</td>
                        <td data-label={thai ? fields.method.th : fields.method.en}>{pickLocale(thai, item.methodTh, item.methodEn)}</td>
                        <td data-label={thai ? fields.reviewer.th : fields.reviewer.en}>{pickLocale(thai, item.ownerTh || item.reviewerTh, item.ownerEn || item.reviewerEn)}</td>
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
          </div>
          <figcaption className="ht-visual-caption">
            <strong>{label}</strong>
            <span>{caption}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
