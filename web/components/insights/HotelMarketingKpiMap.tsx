import type { CmsHmMetric } from "@/lib/cms/hotel-marketing-insight";
import { existingPublicSrc } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const COVER_BG = "/images/insights/hotel-marketing-kpi-map-placeholder.webp";
const MAP_LABEL = "Hotel Marketing KPI Map — Sample Data";

const BLANK = "—";
const STATUS_TEMPLATE = {
  th: "Template · ยังไม่มีค่าที่ verified",
  en: "Template · no verified value",
} as const;

type QuestionId = "discover" | "booking" | "revenue" | "experience" | "unassigned";

const QUESTIONS: Array<{
  id: Exclude<QuestionId, "unassigned">;
  question: { th: string; en: string };
  metrics: readonly string[];
}> = [
  {
    id: "discover",
    question: {
      th: "ผู้เข้าพักค้นพบโรงแรมจากที่ใด",
      en: "Where do potential guests discover the property?",
    },
    metrics: ["Website Traffic", "Google Maps", "OTA Production"],
  },
  {
    id: "booking",
    question: {
      th: "ผู้สนใจไปต่อถึงการจองหรือไม่",
      en: "Do interested guests continue to booking?",
    },
    metrics: ["Booking Engine Conversion", "Direct Booking", "Cancellation Rate"],
  },
  {
    id: "revenue",
    question: {
      th: "รายได้มาจากช่องทางใด และต้นทุนเท่าใด",
      en: "Where does revenue come from and at what cost?",
    },
    metrics: ["Revenue by Channel", "ADR", "RevPAR", "Cost of Acquisition", "Advertising ROAS"],
  },
  {
    id: "experience",
    question: {
      th: "สัญญาณประสบการณ์ผู้เข้าพักที่ควรทบทวน",
      en: "What guest experience signals should be reviewed?",
    },
    metrics: ["Review Score", "Qualitative feedback (with context)"],
  },
];

const METRIC_DETAILS: Array<{
  metric: string;
  questionId: QuestionId;
  definition: { th: string; en: string };
}> = [
  {
    metric: "Website Traffic",
    questionId: "discover",
    definition: {
      th: "ปริมาณการเข้าชมเว็บไซต์โรงแรม (นิยามตามแหล่งข้อมูลที่โรงแรมใช้)",
      en: "Visits or sessions to the hotel website (per the hotel’s chosen analytics definition)",
    },
  },
  {
    metric: "Google Maps",
    questionId: "discover",
    definition: {
      th: "สัญญาณการค้นพบผ่าน Google Maps / Business Profile ตามข้อมูลที่ตรวจสอบได้",
      en: "Discovery signals from Google Maps / Business Profile when a verified source is available",
    },
  },
  {
    metric: "OTA Production",
    questionId: "discover",
    definition: {
      th: "ผลผลิตหรือการจองจากช่องทาง OTA ตามรายงานที่โรงแรมตรวจสอบได้",
      en: "Production or bookings from OTA channels per hotel-verified reports",
    },
  },
  {
    metric: "Booking Engine Conversion",
    questionId: "booking",
    definition: {
      th: "สัดส่วนผู้เข้าชมที่ไปถึงการจองผ่าน Booking Engine ตามนิยามที่กำหนด",
      en: "Share of visitors who complete a booking via the booking engine, under a defined conversion rule",
    },
  },
  {
    metric: "Direct Booking",
    questionId: "booking",
    definition: {
      th: "การจองตรงกับโรงแรมตามนิยามช่องทางที่ทีมตกลงกัน",
      en: "Bookings attributed as direct under the hotel’s agreed channel definition",
    },
  },
  {
    metric: "Cancellation Rate",
    questionId: "booking",
    definition: {
      th: "สัดส่วนการยกเลิกในช่วงเวลาที่กำหนด ตามแหล่งข้อมูลการจอง",
      en: "Share of cancellations in a defined period from the booking source of record",
    },
  },
  {
    metric: "Revenue by Channel",
    questionId: "revenue",
    definition: {
      th: "รายได้แยกตามช่องทางขาย ตามรายงานที่ตรวจสอบได้",
      en: "Revenue split by sales channel from verified reporting",
    },
  },
  {
    metric: "ADR",
    questionId: "revenue",
    definition: {
      th: "Average Daily Rate ตามนิยามและช่วงเวลาที่โรงแรมใช้",
      en: "Average Daily Rate under the hotel’s definition and period",
    },
  },
  {
    metric: "RevPAR",
    questionId: "revenue",
    definition: {
      th: "Revenue per Available Room ตามนิยามและช่วงเวลาที่โรงแรมใช้",
      en: "Revenue per Available Room under the hotel’s definition and period",
    },
  },
  {
    metric: "Cost of Acquisition",
    questionId: "revenue",
    definition: {
      th: "ต้นทุนการได้มาซึ่งการจองหรือลูกค้า ตามนิยามต้นทุนที่ทีมกำหนด",
      en: "Cost to acquire a booking or guest under an agreed cost definition",
    },
  },
  {
    metric: "Advertising ROAS",
    questionId: "revenue",
    definition: {
      th: "ผลตอบแทนจากโฆษณาเทียบกับรายได้ที่เชื่อมโยงได้ — ต้องมีนิยาม attribution",
      en: "Advertising return relative to attributable revenue — requires an attribution definition",
    },
  },
  {
    metric: "Review Score",
    questionId: "experience",
    definition: {
      th: "คะแนนรีวิวจากแหล่งที่ระบุ ควรอ่านคู่กับบริบทและ feedback เชิงคุณภาพ",
      en: "Review score from a named source; read with context and qualitative feedback",
    },
  },
  {
    metric: "Occupancy",
    questionId: "unassigned",
    definition: {
      th: "อัตราการเข้าพัก — อย่าสรุปว่าเกิดจาก Marketing เพียงอย่างเดียวหากไม่มีหลักฐาน",
      en: "Occupancy rate — do not attribute to marketing alone without suitable evidence",
    },
  },
  {
    metric: "Length of Stay",
    questionId: "unassigned",
    definition: {
      th: "ระยะเวลาเข้าพักเฉลี่ย ตามนิยามและช่วงเวลาที่โรงแรมใช้",
      en: "Average length of stay under the hotel’s definition and period",
    },
  },
];

const copy = {
  th: {
    label: MAP_LABEL,
    heading: "จัดกลุ่มตัวชี้วัดตามคำถามทางธุรกิจ",
    mapNote:
      "แผนภาพนี้เป็น Template / Sample Data — ไม่มีค่าตัวเลขสมมติ และไม่สรุปว่า Marketing เพียงอย่างเดียวทำให้ Occupancy หรือรายได้เปลี่ยน",
    overviewTitle: "คำถาม → ตัวชี้วัด (ภาพรวม)",
    detailTitle: "แม่แบบตัวชี้วัด — นิยาม / ช่วงเวลา / แหล่งข้อมูล / ผู้ทบทวน",
    detailLead:
      "ช่อง Period, Data source และ Owner ว่างไว้จนกว่าโรงแรมจะใส่ข้อมูลที่ verified ได้ Status แสดง Template เมื่อยังไม่มีค่า",
    colQuestion: "สิ่งที่ต้องการเข้าใจ",
    colMetrics: "ตัวชี้วัดที่เกี่ยวข้อง",
    colMetric: "ตัวชี้วัด",
    colDefinition: "Metric definition",
    colPeriod: "Period",
    colSource: "Data source",
    colOwner: "Owner / reviewer",
    colStatus: "Sample vs verified",
    unassigned: "ยังไม่ผูกกับคำถามเฉพาะ — ตั้งเมื่อมีบริบทที่ verified",
    alt: "แผนภาพตัวอย่าง Hotel Marketing KPI Map จัดกลุ่มตัวชี้วัดตามคำถามทางธุรกิจ ไม่มีค่าตัวเลขสมมติ",
    caption: "Sample Data / Template — ไม่ใช่ผลงานลูกค้า และไม่มีค่าที่ถูกสร้างขึ้น",
    chartDesc:
      "แผนภาพสี่กลุ่มคำถาม: การค้นพบ การไปต่อถึงการจอง รายได้และต้นทุน และสัญญาณประสบการณ์ผู้เข้าพัก แต่ละกลุ่มแสดงชื่อตัวชี้วัดเท่านั้น ไม่มีค่าตัวเลข",
  },
  en: {
    label: MAP_LABEL,
    heading: "Organize metrics by business question",
    mapNote:
      "This diagram is Template / Sample Data — no invented values, and it does not imply marketing alone caused occupancy or revenue changes.",
    overviewTitle: "Question → metrics (overview)",
    detailTitle: "Metric template — definition / period / source / owner",
    detailLead:
      "Period, Data source, and Owner stay blank until the hotel can supply verified inputs. Status stays Template when no verified value exists.",
    colQuestion: "Business question",
    colMetrics: "Related metrics",
    colMetric: "Metric",
    colDefinition: "Metric definition",
    colPeriod: "Period",
    colSource: "Data source",
    colOwner: "Owner / reviewer",
    colStatus: "Sample vs verified",
    unassigned: "Not tied to a specific question yet — assign when verified context exists",
    alt: "Sample Hotel Marketing KPI Map grouping metrics by business question with no invented values",
    caption: "Sample Data / Template — not a client result and no fabricated values",
    chartDesc:
      "Four business-question groups: discovery, path to booking, revenue and cost, and guest experience signals. Each group lists metric names only, with no numeric values.",
  },
} as const;

function questionLabel(questionId: QuestionId, lang: "th" | "en", unassigned: string) {
  if (questionId === "unassigned") return unassigned;
  return QUESTIONS.find((item) => item.id === questionId)?.question[lang] ?? unassigned;
}

type MapGroup = { id: string; question: string; metrics: string[] };
type MapDetail = {
  key: string;
  metric: string;
  question: string;
  definition: string;
  period: string;
  source: string;
  owner: string;
  value: string;
  status: string;
  isSample: boolean;
};

const CMS_STATUS_LABEL: Record<CmsHmMetric["status"], { th: string; en: string }> = {
  sample: { th: "Sample · ตัวอย่าง", en: "Sample" },
  draft: { th: "Draft · ฉบับร่าง", en: "Draft" },
  requires_review: { th: "Requires review · รอตรวจทาน", en: "Requires review" },
  verified: { th: "Verified · ตรวจสอบแล้ว", en: "Verified" },
};

function buildFromCms(metrics: CmsHmMetric[], lang: "th" | "en", unassigned: string): { groups: MapGroup[]; details: MapDetail[] } {
  const pick = (text: { th: string; en: string }) => (lang === "en" && text.en.trim() ? text.en.trim() : text.th.trim());
  const groups: MapGroup[] = [];
  for (const metric of metrics) {
    const question = pick(metric.question);
    if (!question) continue;
    let group = groups.find((item) => item.question === question);
    if (!group) {
      group = { id: `q-${groups.length + 1}`, question, metrics: [] };
      groups.push(group);
    }
    if (metric.name.trim()) group.metrics.push(metric.name.trim());
  }
  const details = metrics.map((metric, index): MapDetail => {
    const blank = (value: string) => value.trim() || BLANK;
    return {
      key: `${metric.id}-${index}`,
      metric: metric.name.trim() || BLANK,
      question: pick(metric.question) || unassigned,
      definition: pick(metric.definition) || BLANK,
      period: blank(metric.period),
      source: blank(metric.source),
      owner: blank(metric.owner),
      value: metric.value.trim(),
      status: CMS_STATUS_LABEL[metric.status][lang],
      isSample: metric.status === "sample",
    };
  });
  return { groups, details };
}

export function HotelMarketingKpiMap({
  locale,
  cmsMetrics,
  note,
}: {
  locale: Locale;
  /** Optional CMS metric rows (definition / period / source / owner / status). Falls back to the built-in template. */
  cmsMetrics?: CmsHmMetric[];
  /** Optional CMS note shown under the map instead of the built-in Template / Sample Data note. */
  note?: string;
}) {
  const lang = locale === "th" ? "th" : "en";
  const ui = copy[lang];
  const backgroundSrc = existingPublicSrc(COVER_BG);
  const descId = "hotel-marketing-kpi-map-desc";
  const fromCms = Boolean(cmsMetrics && cmsMetrics.length);
  const view = fromCms
    ? buildFromCms(cmsMetrics ?? [], lang, ui.unassigned)
    : {
        groups: QUESTIONS.map(
          (group): MapGroup => ({ id: group.id, question: group.question[lang], metrics: [...group.metrics] }),
        ),
        details: METRIC_DETAILS.map(
          (row): MapDetail => ({
            key: row.metric,
            metric: row.metric,
            question: questionLabel(row.questionId, lang, ui.unassigned),
            definition: row.definition[lang],
            period: BLANK,
            source: BLANK,
            owner: BLANK,
            value: "",
            status: STATUS_TEMPLATE[lang],
            isSample: true,
          }),
        ),
      };
  const anySample = !fromCms || view.details.some((row) => row.isSample);
  const mapNote = note?.trim() || (anySample ? ui.mapNote : "");
  const mapLabel = anySample ? ui.label : "Hotel Marketing KPI Map";

  return (
    <div className="kpi-article-kpi-map">
      <figure className="kpi-article-kpi-map-figure" aria-labelledby="hotel-marketing-kpi-map-heading" aria-describedby={descId}>
        <div className="kpi-article-kpi-map-frame">
          {backgroundSrc ? (
            <img
              className="kpi-article-kpi-map-bg"
              src={backgroundSrc}
              alt=""
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
          ) : null}

          <div className="kpi-article-kpi-map-body">
            <p className="kpi-article-kpi-map-kicker kpi-latin">{mapLabel}</p>
            <p
              id="hotel-marketing-kpi-map-heading"
              className={`kpi-article-kpi-map-heading${locale === "th" ? "" : " kpi-latin"}`}
            >
              {ui.heading}
            </p>
            <p className="sr-only">{ui.alt}</p>

            <ol className="kpi-article-kpi-map-groups">
              {view.groups.map((group, index) => (
                <li key={group.id}>
                  <p className="kpi-article-kpi-map-group-num kpi-latin">{String(index + 1).padStart(2, "0")}</p>
                  <p className={`kpi-article-kpi-map-group-q${locale === "th" ? "" : " kpi-latin"}`}>
                    {group.question}
                  </p>
                  <ul className="kpi-article-kpi-map-metrics kpi-latin">
                    {group.metrics.map((metric) => (
                      <li key={metric}>{metric}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>

            {mapNote ? (
              <p className={`kpi-article-kpi-map-note${locale === "th" ? "" : " kpi-latin"}`}>{mapNote}</p>
            ) : null}
            <p id={descId} className="sr-only">
              {ui.chartDesc}
            </p>
          </div>
        </div>
        {anySample ? (
          <figcaption className={`kpi-article-kpi-map-caption${locale === "th" ? "" : " kpi-latin"}`}>{ui.caption}</figcaption>
        ) : null}
      </figure>

      <div className="kpi-article-kpi-tables">
        <h3 className={`kpi-article-kpi-table-title${locale === "th" ? "" : " kpi-latin"}`}>{ui.overviewTitle}</h3>
        <div className="kpi-article-kpi-table-wrap" role="region" aria-label={ui.overviewTitle} tabIndex={0}>
          <table className="kpi-article-kpi-table is-overview">
            <thead>
              <tr>
                <th scope="col">{ui.colQuestion}</th>
                <th scope="col">{ui.colMetrics}</th>
              </tr>
            </thead>
            <tbody>
              {view.groups.map((group) => (
                <tr key={group.id}>
                  <th scope="row" data-label={ui.colQuestion}>
                    {group.question}
                  </th>
                  <td data-label={ui.colMetrics} className="kpi-latin">
                    {group.metrics.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className={`kpi-article-kpi-table-title${locale === "th" ? "" : " kpi-latin"}`}>{ui.detailTitle}</h3>
        {fromCms ? null : (
          <p className={`kpi-article-kpi-table-lead${locale === "th" ? "" : " kpi-latin"}`}>{ui.detailLead}</p>
        )}
        <div className="kpi-article-kpi-table-wrap" role="region" aria-label={ui.detailTitle} tabIndex={0}>
          <table className="kpi-article-kpi-table is-detail">
            <thead>
              <tr>
                <th scope="col">{ui.colMetric}</th>
                <th scope="col">{ui.colQuestion}</th>
                <th scope="col">{ui.colDefinition}</th>
                <th scope="col">{ui.colPeriod}</th>
                <th scope="col">{ui.colSource}</th>
                <th scope="col">{ui.colOwner}</th>
                <th scope="col">{ui.colStatus}</th>
              </tr>
            </thead>
            <tbody>
              {view.details.map((row) => (
                <tr key={row.key}>
                  <th scope="row" data-label={ui.colMetric} className="kpi-latin">
                    {row.metric}
                  </th>
                  <td data-label={ui.colQuestion}>{row.question}</td>
                  <td data-label={ui.colDefinition}>{row.definition}</td>
                  <td data-label={ui.colPeriod} className={row.period === BLANK ? "kpi-article-kpi-blank" : undefined}>
                    {row.period}
                  </td>
                  <td data-label={ui.colSource} className={row.source === BLANK ? "kpi-article-kpi-blank" : undefined}>
                    {row.source}
                  </td>
                  <td data-label={ui.colOwner} className={row.owner === BLANK ? "kpi-article-kpi-blank" : undefined}>
                    {row.owner}
                  </td>
                  <td data-label={ui.colStatus}>
                    {row.value ? <strong className="kpi-latin">{row.value} </strong> : null}
                    {row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
