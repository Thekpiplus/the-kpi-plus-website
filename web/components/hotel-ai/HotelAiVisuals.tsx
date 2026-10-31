import type { ReactNode } from "react";
import {
  HOTEL_AI_FRICTION,
  HOTEL_AI_HANDOFF_STEPS,
  HOTEL_AI_HERO_FLOW,
  HOTEL_AI_HERO_VISUAL,
  HOTEL_AI_DATA_FLOW,
  HOTEL_AI_FIT,
  HOTEL_AI_FIT_VISUAL,
  HOTEL_AI_RELATED_COVER_ITEMS,
  HOTEL_AI_RELATED_VISUAL,
  HOTEL_AI_ENQUIRY_FLOW,
  HOTEL_AI_ENQUIRY_VISUAL,
  HOTEL_AI_OWNERSHIP_VISUAL,
  HOTEL_AI_PAIN_VISUAL,
  HOTEL_AI_PILOT_STEPS,
  HOTEL_AI_PILOT_VISUAL,
  HOTEL_AI_CASES,
  HOTEL_AI_CASES_VISUAL,
  HOTEL_AI_EVIDENCE_PROCESS,
  HOTEL_AI_EVIDENCE_VISUAL,
  HOTEL_AI_PROCESS,
  HOTEL_AI_SCORECARD,
  HOTEL_AI_SCORECARD_EMPTY,
  HOTEL_AI_SCORECARD_VISUAL,
  HOTEL_AI_ROADMAP_VISUAL,
  hotelAiSampleLabel,
} from "@/lib/hotel-ai";
import type { Locale } from "@/lib/seo";

function approvedPublicSrc(visual?: {
  src?: string;
  status?: string;
  publicationApproved?: boolean;
}) {
  const src = visual?.src?.trim() || "";
  if (!src) return "";
  if (String(visual?.status) !== "approved" || !visual?.publicationApproved) return "";
  if (/placeholder/i.test(src)) return "";
  return src;
}

type CmsVisualProps = {
  src?: string;
  altTh?: string;
  altEn?: string;
  status?: string;
  label?: string;
  caption?: string;
  publicationApproved?: boolean;
};

function Frame({
  locale,
  variant,
  label,
  caption,
  status,
  alt,
  src,
  width,
  height,
  eager,
  badge,
  children,
}: {
  locale: Locale;
  variant: "hero" | "pain" | "pilot" | "review";
  label: string;
  caption: string;
  status?: string;
  alt: string;
  src?: string;
  width?: number;
  height?: number;
  eager?: boolean;
  badge?: string;
  children: ReactNode;
}) {
  const sample = hotelAiSampleLabel(locale);
  const fileSrc = src?.trim() || "";
  return (
    <figure className={`hai-visual hai-visual--${variant}`}>
      <div className="hai-visual-frame">
        <span className="hai-visual-badge">{badge || sample}</span>
        {fileSrc ? (
          <img
            className="hai-visual-asset"
            src={fileSrc}
            alt={alt}
            width={width}
            height={height}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={eager ? "high" : undefined}
          />
        ) : (
          <div className="hai-visual-fallback" role="img" aria-label={alt}>
            {children}
          </div>
        )}
      </div>
      <figcaption className="hai-visual-caption">
        <strong>{label}</strong>
        {status ? <span className="hai-visual-status kpi-latin">{status}</span> : null}
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}

function HotelAiHeroDiagram({ locale }: { locale: Locale }) {
  const thai = locale === "th";
  return (
    <div className="hai-hero-mock">
      <p className="hai-mock-kicker kpi-latin">Sample workflow</p>
      <p className="hai-mock-title">
        {thai ? "Hotel Workflow → AI / Automation → Human Review → Team / System" : "Hotel Workflow → AI / Automation → Human Review → Team / System"}
      </p>
      <ol className="hai-hero-flow">
        {HOTEL_AI_HERO_FLOW.map((step, index) => (
          <li key={step.id}>
            <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
            <strong className="kpi-latin">{thai ? step.th : step.en}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function HotelAiHeroVisual({ locale, visual }: { locale: Locale; visual?: CmsVisualProps }) {
  const thai = locale === "th";
  const src = approvedPublicSrc(visual);
  return (
    <Frame
      locale={locale}
      variant="hero"
      src={src}
      width={HOTEL_AI_HERO_VISUAL.displayWidth}
      height={HOTEL_AI_HERO_VISUAL.displayHeight}
      label={visual?.label?.trim() || (thai ? HOTEL_AI_HERO_VISUAL.labelTh : HOTEL_AI_HERO_VISUAL.labelEn)}
      status={thai ? HOTEL_AI_HERO_VISUAL.statusTh : HOTEL_AI_HERO_VISUAL.statusEn}
      caption={visual?.caption?.trim() || (thai ? HOTEL_AI_HERO_VISUAL.captionTh : HOTEL_AI_HERO_VISUAL.captionEn)}
      alt={(thai ? visual?.altTh : visual?.altEn)?.trim() || (thai ? HOTEL_AI_HERO_VISUAL.altTh : HOTEL_AI_HERO_VISUAL.altEn)}
      badge={src ? (thai ? "อนุมัติแล้ว" : "Approved") : undefined}
      eager
    >
      <HotelAiHeroDiagram locale={locale} />
    </Frame>
  );
}

export function HotelAiPainVisual({ locale, visual }: { locale: Locale; visual?: CmsVisualProps }) {
  const thai = locale === "th";
  const src = approvedPublicSrc(visual);
  return (
    <Frame
      locale={locale}
      variant="pain"
      src={src}
      width={HOTEL_AI_PAIN_VISUAL.displayWidth}
      height={HOTEL_AI_PAIN_VISUAL.displayHeight}
      label={visual?.label?.trim() || (thai ? HOTEL_AI_PAIN_VISUAL.labelTh : HOTEL_AI_PAIN_VISUAL.labelEn)}
      status={thai ? HOTEL_AI_PAIN_VISUAL.statusTh : HOTEL_AI_PAIN_VISUAL.statusEn}
      caption={visual?.caption?.trim() || (thai ? HOTEL_AI_PAIN_VISUAL.captionTh : HOTEL_AI_PAIN_VISUAL.captionEn)}
      alt={(thai ? visual?.altTh : visual?.altEn)?.trim() || (thai ? HOTEL_AI_PAIN_VISUAL.altTh : HOTEL_AI_PAIN_VISUAL.altEn)}
      badge={src ? (thai ? "อนุมัติแล้ว" : "Approved") : undefined}
    >
      <div className="hai-pain-mock">
        <p className="hai-mock-kicker kpi-latin">Manual Handoff Map</p>
        <p className="hai-mock-title">
          {thai ? "Website / LINE / Email → คัดลอกด้วยมือ → ระบบ → ตรวจ → ตอบ" : "Website / LINE / Email → Copy/Paste → System → Check → Response"}
        </p>
        <ol className="hai-handoff">
          {HOTEL_AI_HANDOFF_STEPS.map((step, index) => {
            const friction = HOTEL_AI_FRICTION[step.friction];
            return (
              <li key={step.id}>
                <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                <strong className="kpi-latin">{thai ? step.th : step.en}</strong>
                <em className={`hai-status is-${friction.tone}`}>{thai ? friction.th : friction.en}</em>
              </li>
            );
          })}
        </ol>
      </div>
    </Frame>
  );
}

export function HotelAiPilotVisual({ locale }: { locale: Locale }) {
  const thai = locale === "th";
  const sample = hotelAiSampleLabel(locale);
  return (
    <figure className="hai-pilot-overview">
      <div
        className="hai-pilot-frame"
        role="img"
        aria-label={thai ? HOTEL_AI_PILOT_VISUAL.altTh : HOTEL_AI_PILOT_VISUAL.altEn}
      >
        <span className="hai-visual-badge">{sample}</span>
        <ol className="hai-pilot-nodes">
          {HOTEL_AI_PILOT_STEPS.map((step, index) => (
            <li key={step.id}>
              <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
              <strong>{thai ? step.shortTh : step.shortEn}</strong>
              <em>{thai ? step.th : step.en}</em>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="hai-visual-caption">
        <strong className="kpi-latin">{thai ? HOTEL_AI_PILOT_VISUAL.labelTh : HOTEL_AI_PILOT_VISUAL.labelEn}</strong>
        <span className="hai-visual-status kpi-latin">{thai ? HOTEL_AI_PILOT_VISUAL.statusTh : HOTEL_AI_PILOT_VISUAL.statusEn}</span>
        <span>{thai ? HOTEL_AI_PILOT_VISUAL.captionTh : HOTEL_AI_PILOT_VISUAL.captionEn}</span>
      </figcaption>
    </figure>
  );
}

export function HotelAiRoadmapVisual({ locale }: { locale: Locale }) {
  const thai = locale === "th";
  const sample = hotelAiSampleLabel(locale);
  return (
    <figure className="hai-roadmap">
      <div
        className="hai-roadmap-frame"
        role="img"
        aria-label={thai ? HOTEL_AI_ROADMAP_VISUAL.altTh : HOTEL_AI_ROADMAP_VISUAL.altEn}
      >
        <span className="hai-visual-badge">{sample}</span>
        <ol className="hai-roadmap-nodes">
          {HOTEL_AI_PROCESS.map((step, index) => (
            <li key={step.id}>
              <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
              <strong className="kpi-latin">{step.label}</strong>
              <em>{thai ? "เกต" : "Gate"}</em>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="hai-visual-caption">
        <strong className="kpi-latin">{thai ? HOTEL_AI_ROADMAP_VISUAL.labelTh : HOTEL_AI_ROADMAP_VISUAL.labelEn}</strong>
        <span className="hai-visual-status kpi-latin">{thai ? HOTEL_AI_ROADMAP_VISUAL.statusTh : HOTEL_AI_ROADMAP_VISUAL.statusEn}</span>
        <span>{thai ? HOTEL_AI_ROADMAP_VISUAL.captionTh : HOTEL_AI_ROADMAP_VISUAL.captionEn}</span>
      </figcaption>
    </figure>
  );
}

export function HotelAiCasesVisual({ locale }: { locale: Locale }) {
  const thai = locale === "th";
  const sample = hotelAiSampleLabel(locale);
  return (
    <figure className="hai-cases-overview">
      <div
        className="hai-cases-frame"
        role="img"
        aria-label={thai ? HOTEL_AI_CASES_VISUAL.altTh : HOTEL_AI_CASES_VISUAL.altEn}
      >
        <span className="hai-visual-badge">{sample}</span>
        <ol className="hai-cases-nodes">
          {HOTEL_AI_CASES.map((item, index) => (
            <li key={item.id}>
              <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
              <strong className="kpi-latin">{thai ? item.shortTh : item.shortEn}</strong>
              <em>{thai ? "มีคนตรวจ" : "Human review"}</em>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="hai-visual-caption">
        <strong className="kpi-latin">{thai ? HOTEL_AI_CASES_VISUAL.labelTh : HOTEL_AI_CASES_VISUAL.labelEn}</strong>
        <span className="hai-visual-status kpi-latin">{thai ? HOTEL_AI_CASES_VISUAL.statusTh : HOTEL_AI_CASES_VISUAL.statusEn}</span>
        <span>{thai ? HOTEL_AI_CASES_VISUAL.captionTh : HOTEL_AI_CASES_VISUAL.captionEn}</span>
      </figcaption>
    </figure>
  );
}

export function HotelAiEvidenceVisual({ locale }: { locale: Locale }) {
  const thai = locale === "th";
  const sample = hotelAiSampleLabel(locale);
  return (
    <figure className="hai-evidence-visual">
      <div
        className="hai-evidence-frame"
        role="img"
        aria-label={thai ? HOTEL_AI_EVIDENCE_VISUAL.altTh : HOTEL_AI_EVIDENCE_VISUAL.altEn}
      >
        <span className="hai-visual-badge">{sample}</span>
        <div className="hai-evidence-compare">
          <div>
            <p className="hai-mock-kicker kpi-latin">{thai ? "ก่อน" : "Before"}</p>
            <ol>
              {HOTEL_AI_EVIDENCE_PROCESS.before.map((step, index) => (
                <li key={step.id}>
                  <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{thai ? step.th : step.en}</strong>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="hai-mock-kicker kpi-latin">{thai ? "หลัง" : "After"}</p>
            <ol>
              {HOTEL_AI_EVIDENCE_PROCESS.after.map((step, index) => (
                <li key={step.id}>
                  <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{thai ? step.th : step.en}</strong>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <figcaption className="hai-visual-caption">
        <strong className="kpi-latin">{thai ? HOTEL_AI_EVIDENCE_VISUAL.labelTh : HOTEL_AI_EVIDENCE_VISUAL.labelEn}</strong>
        <span className="hai-visual-status kpi-latin">{thai ? HOTEL_AI_EVIDENCE_VISUAL.statusTh : HOTEL_AI_EVIDENCE_VISUAL.statusEn}</span>
        <span>{thai ? HOTEL_AI_EVIDENCE_VISUAL.captionTh : HOTEL_AI_EVIDENCE_VISUAL.captionEn}</span>
      </figcaption>
    </figure>
  );
}

export function HotelAiScorecardVisual({ locale }: { locale: Locale }) {
  const thai = locale === "th";
  const sample = hotelAiSampleLabel(locale);
  const empty = thai ? "ยังไม่มีข้อมูล" : "No data";
  return (
    <figure className="hai-scorecard-visual">
      <div
        className="hai-scorecard-frame"
        role="img"
        aria-label={thai ? HOTEL_AI_SCORECARD_VISUAL.altTh : HOTEL_AI_SCORECARD_VISUAL.altEn}
      >
        <span className="hai-visual-badge">{sample}</span>
        <table className="hai-scorecard-mock">
          <caption className="hai-mock-kicker kpi-latin">{thai ? "เส้นฐานเทียบช่วงทดลอง" : "Baseline vs pilot"}</caption>
          <thead>
            <tr>
              <th scope="col">{thai ? "ตัวชี้วัด" : "Metric"}</th>
              <th scope="col" className="is-compare">{thai ? "เส้นฐาน" : "Baseline"}</th>
              <th scope="col" className="is-pilot">{thai ? "ทดลอง" : "Pilot"}</th>
            </tr>
          </thead>
          <tbody>
            {HOTEL_AI_SCORECARD.map((row) => (
              <tr key={row.id}>
                <th scope="row">
                  <strong className="kpi-latin">{row.label}</strong>
                  {row.tone === "review" ? (
                    <em className="hai-status is-amber">{thai ? "ต้องมีคนตรวจ" : "Needs review"}</em>
                  ) : null}
                </th>
                <td>
                  <span className="hai-scorecard-empty" aria-label={empty}>
                    {HOTEL_AI_SCORECARD_EMPTY}
                  </span>
                </td>
                <td>
                  <span className="hai-scorecard-empty" aria-label={empty}>
                    {HOTEL_AI_SCORECARD_EMPTY}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="hai-visual-caption">
        <strong className="kpi-latin">{thai ? HOTEL_AI_SCORECARD_VISUAL.labelTh : HOTEL_AI_SCORECARD_VISUAL.labelEn}</strong>
        <span className="hai-visual-status kpi-latin">{thai ? HOTEL_AI_SCORECARD_VISUAL.statusTh : HOTEL_AI_SCORECARD_VISUAL.statusEn}</span>
        <span>{thai ? HOTEL_AI_SCORECARD_VISUAL.captionTh : HOTEL_AI_SCORECARD_VISUAL.captionEn}</span>
      </figcaption>
    </figure>
  );
}

export function HotelAiOwnershipVisual({ locale }: { locale: Locale }) {
  const thai = locale === "th";
  const sample = hotelAiSampleLabel(locale);
  return (
    <figure className="hai-ownership-visual">
      <div
        className="hai-ownership-frame"
        role="img"
        aria-label={thai ? HOTEL_AI_OWNERSHIP_VISUAL.altTh : HOTEL_AI_OWNERSHIP_VISUAL.altEn}
      >
        <span className="hai-visual-badge">{sample}</span>
        <ol className="hai-ownership-nodes">
          {HOTEL_AI_DATA_FLOW.map((step, index) => (
            <li key={step.id} className={step.id === "review" ? "is-review" : undefined}>
              <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
              <strong>{thai ? step.shortTh : step.shortEn}</strong>
              {step.id === "review" ? (
                <em className="hai-status is-amber">{thai ? "ต้องมีคนตรวจ" : "Needs review"}</em>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="hai-visual-caption">
        <strong className="kpi-latin">{thai ? HOTEL_AI_OWNERSHIP_VISUAL.labelTh : HOTEL_AI_OWNERSHIP_VISUAL.labelEn}</strong>
        <span className="hai-visual-status kpi-latin">{thai ? HOTEL_AI_OWNERSHIP_VISUAL.statusTh : HOTEL_AI_OWNERSHIP_VISUAL.statusEn}</span>
        <span>{thai ? HOTEL_AI_OWNERSHIP_VISUAL.captionTh : HOTEL_AI_OWNERSHIP_VISUAL.captionEn}</span>
      </figcaption>
    </figure>
  );
}

export function HotelAiFitVisual({ locale }: { locale: Locale }) {
  const thai = locale === "th";
  const sample = hotelAiSampleLabel(locale);
  return (
    <figure className="hai-fit-visual">
      <div
        className="hai-fit-frame"
        role="img"
        aria-label={thai ? HOTEL_AI_FIT_VISUAL.altTh : HOTEL_AI_FIT_VISUAL.altEn}
      >
        <span className="hai-visual-badge">{sample}</span>
        <ol className="hai-fit-nodes">
          {HOTEL_AI_FIT.map((item, index) => (
            <li key={item.id}>
              <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
              <strong className="kpi-latin">{item.label}</strong>
              <em>{thai ? "มีเงื่อนไขเริ่มต้น" : "Start condition"}</em>
            </li>
          ))}
        </ol>
        <p className="hai-fit-stop kpi-latin">
          <span className="hai-status is-amber">{thai ? "ยังไม่พร้อม" : "Not ready"}</span>
          <strong>{thai ? "ยังไม่ทำให้อัตโนมัติถ้ายังไม่มีเจ้าของหรือทางเลือกด้วยมือ" : "Do not automate if there is no owner or manual fallback"}</strong>
        </p>
      </div>
      <figcaption className="hai-visual-caption">
        <strong className="kpi-latin">{thai ? HOTEL_AI_FIT_VISUAL.labelTh : HOTEL_AI_FIT_VISUAL.labelEn}</strong>
        <span className="hai-visual-status kpi-latin">{thai ? HOTEL_AI_FIT_VISUAL.statusTh : HOTEL_AI_FIT_VISUAL.statusEn}</span>
        <span>{thai ? HOTEL_AI_FIT_VISUAL.captionTh : HOTEL_AI_FIT_VISUAL.captionEn}</span>
      </figcaption>
    </figure>
  );
}

export function HotelAiRelatedVisual({ locale }: { locale: Locale }) {
  const thai = locale === "th";
  const sample = hotelAiSampleLabel(locale);
  return (
    <figure className="hai-related-visual">
      <div
        className="hai-related-frame"
        role="img"
        aria-label={thai ? HOTEL_AI_RELATED_VISUAL.altTh : HOTEL_AI_RELATED_VISUAL.altEn}
      >
        <span className="hai-visual-badge">{sample}</span>
        <div className="hai-related-cover">
          <p className="hai-related-cover-kicker kpi-latin">Sample cover</p>
          <p className="hai-related-cover-title kpi-latin">Hotel AI &amp; Automation</p>
          <p className="hai-related-cover-sub kpi-latin">Guide</p>
          <ol className="hai-related-cover-list">
            {HOTEL_AI_RELATED_COVER_ITEMS.map((item, index) => (
              <li key={item.id}>
                <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                <strong className="kpi-latin">{item.label}</strong>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <figcaption className="hai-visual-caption">
        <strong className="kpi-latin">{thai ? HOTEL_AI_RELATED_VISUAL.labelTh : HOTEL_AI_RELATED_VISUAL.labelEn}</strong>
        <span className="hai-visual-status kpi-latin">{thai ? HOTEL_AI_RELATED_VISUAL.statusTh : HOTEL_AI_RELATED_VISUAL.statusEn}</span>
        <span>{thai ? HOTEL_AI_RELATED_VISUAL.captionTh : HOTEL_AI_RELATED_VISUAL.captionEn}</span>
      </figcaption>
    </figure>
  );
}

export function HotelAiEnquiryVisual({ locale }: { locale: Locale }) {
  const thai = locale === "th";
  const sample = hotelAiSampleLabel(locale);
  return (
    <figure className="hai-enquiry-visual">
      <div
        className="hai-enquiry-frame"
        role="img"
        aria-label={thai ? HOTEL_AI_ENQUIRY_VISUAL.altTh : HOTEL_AI_ENQUIRY_VISUAL.altEn}
      >
        <span className="hai-visual-badge">{sample}</span>
        <div className="hai-enquiry-process">
          <p className="hai-enquiry-path kpi-latin">Workflow Intake → Simplify → Pilot → Review</p>
          <ol className="hai-enquiry-flow">
            {HOTEL_AI_ENQUIRY_FLOW.map((step, index) => (
              <li key={step.id}>
                <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                <strong className="kpi-latin">{step.label}</strong>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <figcaption className="hai-visual-caption">
        <strong className="kpi-latin">{thai ? HOTEL_AI_ENQUIRY_VISUAL.labelTh : HOTEL_AI_ENQUIRY_VISUAL.labelEn}</strong>
        <span className="hai-visual-status kpi-latin">{thai ? HOTEL_AI_ENQUIRY_VISUAL.statusTh : HOTEL_AI_ENQUIRY_VISUAL.statusEn}</span>
        <span>{thai ? HOTEL_AI_ENQUIRY_VISUAL.captionTh : HOTEL_AI_ENQUIRY_VISUAL.captionEn}</span>
      </figcaption>
    </figure>
  );
}

