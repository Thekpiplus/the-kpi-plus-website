import {
  DIRECT_BOOKING_DECISION_CONSTRAINTS,
  DIRECT_BOOKING_DECISION_NOTE,
  DIRECT_BOOKING_DECISION_PATHS,
  DIRECT_BOOKING_DECISION_STAGES,
  DIRECT_BOOKING_DECISION_VISUAL,
  directBookingSampleLabel,
} from "@/lib/direct-bookings";
import type { Locale } from "@/lib/seo";
import { ConversionVisualFrame } from "./ConversionVisualFrame";

const FIELDS = {
  situation: { th: "สถานการณ์", en: "Situation" },
  evidence: { th: "หลักฐานที่ควรตรวจ", en: "Evidence to inspect" },
  route: { th: "เส้นทางที่แนะนำ", en: "Recommended route" },
  risk: { th: "ความเสี่ยงและสิ่งที่ขึ้นกับโรงแรม", en: "Risk/dependency" },
  next: { th: "ขั้นถัดไป", en: "Next action" },
} as const;

export type ConversionDecisionPathView = {
  id: string;
  title: string;
  situation: string[];
  evidence: string;
  route: string;
  risk: string;
  next: string;
};

export function ConversionDecision({
  locale,
  src,
  lead,
  note,
  paths,
  visual,
}: {
  locale: Locale;
  src?: string;
  lead: string;
  note?: string;
  paths?: ConversionDecisionPathView[];
  visual?: { alt?: string; label?: string; caption?: string; status?: string };
}) {
  const thai = locale === "th";
  const label = visual?.label?.trim() || (thai ? DIRECT_BOOKING_DECISION_VISUAL.labelTh : DIRECT_BOOKING_DECISION_VISUAL.labelEn);
  const caption = visual?.caption?.trim() || (thai ? DIRECT_BOOKING_DECISION_VISUAL.captionTh : DIRECT_BOOKING_DECISION_VISUAL.captionEn);
  const alt = visual?.alt?.trim() || (thai ? DIRECT_BOOKING_DECISION_VISUAL.altTh : DIRECT_BOOKING_DECISION_VISUAL.altEn);
  const status = visual?.status || DIRECT_BOOKING_DECISION_VISUAL.status;
  const cards =
    paths?.length
      ? paths
      : DIRECT_BOOKING_DECISION_PATHS.map((path) => ({
          id: path.id,
          title: thai ? path.titleTh : path.titleEn,
          situation: [...(thai ? path.situationTh : path.situationEn)],
          evidence: thai ? path.evidenceTh : path.evidenceEn,
          route: thai ? path.routeTh : path.routeEn,
          risk: thai ? path.riskTh : path.riskEn,
          next: thai ? path.nextTh : path.nextEn,
        }));
  return (
    <div className="db-decision">
      <p className="kpi-lead">{lead}</p>
      <p className="db-friction-kicker">
        <span className="db-visual-badge">{directBookingSampleLabel(locale)}</span>
        <span className="kpi-latin">{label}</span>
      </p>
      <ConversionVisualFrame
        locale={locale}
        src={src}
        alt={alt}
        label={label}
        caption={caption}
        meta={thai ? DIRECT_BOOKING_DECISION_VISUAL.metaTh : DIRECT_BOOKING_DECISION_VISUAL.metaEn}
        status={status}
        width={DIRECT_BOOKING_DECISION_VISUAL.displayWidth}
        height={DIRECT_BOOKING_DECISION_VISUAL.displayHeight}
        variant="decision"
      >
        <div className="db-decision-mock" role="img" aria-label={alt}>
          <span className="db-visual-badge">{directBookingSampleLabel(locale)}</span>
          <p className="db-decision-mock-kicker kpi-latin">Sample decision</p>
          <p className="db-decision-mock-title kpi-latin">{DIRECT_BOOKING_DECISION_VISUAL.labelEn}</p>
          <ol className="db-decision-mock-flow">
            {DIRECT_BOOKING_DECISION_STAGES.map((stage, index) => (
              <li key={stage.id}>
                <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                <strong className="kpi-latin">{stage.en}</strong>
              </li>
            ))}
          </ol>
          <p className="db-decision-mock-note kpi-latin">Improve Existing Website · Consider Rebuild · not always a rebuild</p>
        </div>
      </ConversionVisualFrame>
      <ol className="db-decision-path" aria-label={thai ? "เส้นทางตัดสินใจปรับหรือสร้างใหม่" : "Improve or rebuild decision path"}>
        {DIRECT_BOOKING_DECISION_STAGES.map((stage, index) => (
          <li key={stage.id}>
            <span className="kpi-latin db-path-num">{String(index + 1).padStart(2, "0")}</span>
            <span className={thai ? undefined : "kpi-latin"}>{thai ? stage.th : stage.en}</span>
          </li>
        ))}
      </ol>
      <div className="db-decision-grid" role="list" aria-label={thai ? "เส้นทางตัดสินใจปรับหรือสร้างใหม่" : "Improve or rebuild decision matrix"}>
        {cards.map((path) => (
          <article key={path.id} className={`db-decision-card is-${path.id}`} role="listitem">
            <h3 className={thai ? undefined : "kpi-latin"}>{path.title}</h3>
            <dl>
              <div>
                <dt>{thai ? FIELDS.situation.th : FIELDS.situation.en}</dt>
                <dd>
                  <ul>
                    {path.situation.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt>{thai ? FIELDS.evidence.th : FIELDS.evidence.en}</dt>
                <dd>{path.evidence}</dd>
              </div>
              <div>
                <dt>{thai ? FIELDS.route.th : FIELDS.route.en}</dt>
                <dd>
                  <span className="kpi-latin db-output">{path.route}</span>
                </dd>
              </div>
              <div>
                <dt>{thai ? FIELDS.risk.th : FIELDS.risk.en}</dt>
                <dd>{path.risk}</dd>
              </div>
              <div>
                <dt>{thai ? FIELDS.next.th : FIELDS.next.en}</dt>
                <dd>{path.next}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <ul className="db-decision-constraints" aria-label={thai ? "ข้อจำกัดที่ใช้ประกอบการตัดสินใจ" : "Constraints used in the decision"}>
        {DIRECT_BOOKING_DECISION_CONSTRAINTS.map((item) => (
          <li key={item.en} className={thai ? "db-framework-chip" : "kpi-latin db-framework-chip"}>
            {thai ? item.th : item.en}
          </li>
        ))}
      </ul>
      <p className="db-decision-note">{note?.trim() || (thai ? DIRECT_BOOKING_DECISION_NOTE.th : DIRECT_BOOKING_DECISION_NOTE.en)}</p>
    </div>
  );
}
