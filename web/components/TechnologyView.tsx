import Link from "next/link";
import { PageFaqs } from "@/components/PageFaqs";
import { SiteShell } from "@/components/SiteShell";
import { TechnologyEnquiry } from "@/components/TechnologyEnquiry";
import { TechnologyStickyCta } from "@/components/TechnologyStickyCta";
import {
  HotelAiHeroVisual,
  HotelAiPainVisual,
  HotelAiPilotVisual,
  HotelAiOwnershipVisual,
  HotelAiRoadmapVisual,
  HotelAiCasesVisual,
  HotelAiEvidenceVisual,
  HotelAiScorecardVisual,
  HotelAiFitVisual,
  HotelAiRelatedVisual,
} from "@/components/hotel-ai/HotelAiVisuals";
import "@/components/hotel-ai/hotel-ai-visuals.css";
import {
  HOTEL_AI_CASE_FIELDS,
  HOTEL_AI_CASES,
  HOTEL_AI_PILOT_CHARTER,
  HOTEL_AI_PILOT_DECISIONS,
  HOTEL_AI_PILOT_STEPS,
  HOTEL_AI_DIAGNOSTIC,
  HOTEL_AI_DIAGNOSTIC_COLUMNS,
  HOTEL_AI_ACCESS_COLUMNS,
  HOTEL_AI_ACCESS_MATRIX,
  HOTEL_AI_DATA_FLOW,
  HOTEL_AI_HUMAN_REVIEW,
  HOTEL_AI_FIT,
  HOTEL_AI_FIT_FIELDS,
  HOTEL_AI_FIT_NOT_READY,
  HOTEL_AI_OWNERSHIP,
  HOTEL_AI_SCORECARD,
  HOTEL_AI_SCORECARD_COLUMNS,
  HOTEL_AI_SCORECARD_EMPTY,
  HOTEL_AI_SCORECARD_META,
  HOTEL_AI_PAINS,
  HOTEL_AI_PROCESS,
  hotelAiCopy,
  hotelAiRelatedCards,
  hotelAiRelatedDateLabel,
  hotelAiSampleLabel,
  type HotelAiRelatedCard,
} from "@/lib/hotel-ai";
import type { CmsHotelAiKpi, CmsHotelAiPage } from "@/lib/cms/hotel-ai-page";
import { publicHotelAiClaimNumber, publicHotelAiKpiValues } from "@/lib/cms/hotel-ai-page";
import { hotelAiFaqsFromCms, hotelAiPublicHref, loadHotelAiPage } from "@/lib/cms/hotel-ai-page-public";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, type Locale } from "@/lib/seo";

function pick(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

export async function TechnologyView({
  locale,
  previewContent,
  embedded = false,
}: {
  locale: Locale;
  previewContent?: CmsHotelAiPage;
  embedded?: boolean;
}) {
  const cms = previewContent ? { ...previewContent, fromCms: true } : await loadHotelAiPage(locale);
  const fromCms = cms.fromCms;
  const thai = locale === "th";
  const t = thai ? hotelAiCopy.th : hotelAiCopy.en;
  const solutions = localizePath("/solutions", locale);
  const systemsHref = hotelAiPublicHref(fromCms ? cms.hero.secondaryCta.href : "", locale, existingHref("/solutions/hotel-systems-implementation", locale) || "/solutions/hotel-systems-implementation");
  const primaryHref = hotelAiPublicHref(fromCms ? cms.hero.primaryCta.href : "", locale, "#technology-enquiry");
  const closerHref = hotelAiPublicHref(fromCms ? cms.related.closerHref : "", locale, "#technology-enquiry");
  const related = fromCms && cms.related.cards.length
    ? cms.related.cards.map((card) => ({
        id: card.id,
        href: hotelAiPublicHref(card.href, locale, "/solutions"),
        featured: card.featured,
        external: card.external,
        categoryTh: card.categoryTh,
        categoryEn: card.categoryEn,
        titleTh: card.titleTh,
        titleEn: card.titleEn,
        descriptionTh: card.descriptionTh,
        descriptionEn: card.descriptionEn,
        publishedAt: card.publishedAt,
        contentTypeTh: card.contentTypeTh,
        contentTypeEn: card.contentTypeEn,
        ctaTh: card.ctaTh,
        ctaEn: card.ctaEn,
      }))
    : hotelAiRelatedCards(locale);
  const featuredRelated = related.find((card) => card.featured) ?? related[0];
  const supportingRelated = related.filter((card) => card.id !== featuredRelated?.id);
  const sample = hotelAiSampleLabel(locale);
  const pains = fromCms && cms.pains.items.length ? cms.pains.items : HOTEL_AI_PAINS;
  const diagnostic = fromCms && cms.pains.diagnostic.length ? cms.pains.diagnostic : HOTEL_AI_DIAGNOSTIC;
  const processSteps = fromCms && cms.process.steps.length ? cms.process.steps : HOTEL_AI_PROCESS;
  const cases = fromCms && cms.cases.items.length ? cms.cases.items : HOTEL_AI_CASES;
  const pilotSteps = fromCms && cms.pilot.steps.length ? cms.pilot.steps : HOTEL_AI_PILOT_STEPS;
  const charter = fromCms && cms.pilot.charter.length ? cms.pilot.charter : HOTEL_AI_PILOT_CHARTER;
  const decisions = fromCms && cms.pilot.decisions.length ? cms.pilot.decisions : HOTEL_AI_PILOT_DECISIONS;
  const kpis = fromCms && cms.measure.kpis.length ? cms.measure.kpis : HOTEL_AI_SCORECARD;
  const flow = fromCms && cms.ownership.flow.length ? cms.ownership.flow : HOTEL_AI_DATA_FLOW;
  const reviewItems = fromCms && cms.ownership.reviewItems.length ? cms.ownership.reviewItems : HOTEL_AI_HUMAN_REVIEW;
  const principles = fromCms && cms.ownership.principles.length ? cms.ownership.principles : HOTEL_AI_OWNERSHIP;
  const access = fromCms && cms.ownership.matrix.length ? cms.ownership.matrix : HOTEL_AI_ACCESS_MATRIX;
  const fit = fromCms && cms.fit.items.length ? cms.fit.items : HOTEL_AI_FIT;
  const notReady = fromCms && cms.fit.notItems.length ? cms.fit.notItems : HOTEL_AI_FIT_NOT_READY;
  const faqItems = hotelAiFaqsFromCms(fromCms ? cms : null, locale);
  const faqLead = pick(thai ? cms.faqLead : cms.faqLeadEn, t.faqLead);
  const heroTitleLead = pick(cms.hero.titleLead, t.titleLead);
  const heroTitleAccent = pick(cms.hero.titleAccent, t.titleAccent);
  const heroTitleRest = pick(cms.hero.titleRest, t.titleRest);
  const trust = fromCms && cms.hero.trust.length ? cms.hero.trust.map((item) => (thai ? item.th : item.en)).filter(Boolean) : t.trust;
  const bilingual = Boolean(cms.bilingualPublish);
  const publishedClaim = cms.evidence.claims.find((claim) => publicHotelAiClaimNumber(claim, bilingual)) || null;
  const inner = (
      <div className="kpi-tech">
        <section className="kpi-hero kpi-home-hero-section kpi-tech-hero">
          <div className="kpi-wrap">
            <nav aria-label="Breadcrumb" className="kpi-tech-hero-crumb">
              <ol>
                <li>
                  <Link href={solutions}>{t.crumb}</Link>
                </li>
                <li>
                  <span aria-hidden="true">/</span>
                  <span>{solutionNavLabel("/solutions/hotel-ai-automation", locale)}</span>
                </li>
              </ol>
            </nav>
            <div className="kpi-home-hero">
              <div className="kpi-home-hero-copy">
                <p className="kpi-home-eyebrow kpi-latin">{pick(cms.hero.eyebrow, t.eyebrow)}</p>
                <h1 className="kpi-h1 kpi-home-h1">
                  <span className="kpi-home-h1-lead">
                    {thai && !fromCms ? (
                      <>
                        นำ <span className="kpi-latin">AI</span> และ <span className="kpi-latin">Automation</span>
                      </>
                    ) : (
                      heroTitleLead
                    )}
                  </span>
                  <span className="kpi-home-h1-rest">
                    <span className="kpi-home-accent">{heroTitleAccent}</span> {heroTitleRest}
                  </span>
                </h1>
                <p className="kpi-lead kpi-home-lead">{pick(cms.hero.description, t.lead)}</p>
                <p className="kpi-tech-lead-close">{pick(cms.hero.close, t.leadClose)}</p>
                <div className="kpi-actions">
                  <a href={primaryHref} className="kpi-button bg-[#a2dc25] text-[#1a3a02]">
                    {pick(cms.hero.primaryCta.label, t.cta)} <span aria-hidden="true">↗</span>
                  </a>
                  {systemsHref ? (
                    <Link href={systemsHref} className="kpi-button-ghost">
                      {pick(cms.hero.secondaryCta.label, t.secondary)}
                    </Link>
                  ) : null}
                </div>
                <p className="kpi-tech-hero-note">{pick(cms.hero.underCta, t.underCta)}</p>
                <p className="kpi-tech-hero-trust">
                  {trust.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </p>
              </div>
              <div className="kpi-hero-visual kpi-home-photo">
                <HotelAiHeroVisual locale={locale} visual={cms.hero.visual} />
              </div>
            </div>
          </div>
        </section>

        <section className="kpi-tech-problems">
          <div className="kpi-section">
            <h2 className="kpi-h2">{pick(cms.pains.title, t.problemsTitle)}</h2>
            <p className="kpi-tech-problems-lead">{pick(cms.pains.lead, t.problemsLead)}</p>
            <div className="kpi-tech-need-grid">
              <ol className="kpi-tech-problems-list">
                {pains.map((item, index) => (
                  <li key={item.id} className="kpi-tech-problems-item">
                    <span className="kpi-latin kpi-tech-num">{String(index + 1).padStart(2, "0")}</span>
                    <p>{thai ? item.th : item.en}</p>
                  </li>
                ))}
              </ol>
              <HotelAiPainVisual locale={locale} visual={cms.pains.visual} />
            </div>
            <div className="hai-diagnostic">
              <h3>{pick(cms.pains.checkTitle, t.problemsCheckTitle)}</h3>
              <p>{pick(cms.pains.checkLead, t.problemsCheckLead)}</p>
              <div className="hai-diagnostic-wrap">
                <table className="hai-diagnostic-table">
                  <caption className="sr-only">{pick(cms.pains.caption, t.problemsCheckCaption)}</caption>
                  <thead>
                    <tr>
                      <th scope="col">{thai ? HOTEL_AI_DIAGNOSTIC_COLUMNS.symptom.th : HOTEL_AI_DIAGNOSTIC_COLUMNS.symptom.en}</th>
                      <th scope="col">{thai ? HOTEL_AI_DIAGNOSTIC_COLUMNS.question.th : HOTEL_AI_DIAGNOSTIC_COLUMNS.question.en}</th>
                      <th scope="col">{thai ? HOTEL_AI_DIAGNOSTIC_COLUMNS.evidence.th : HOTEL_AI_DIAGNOSTIC_COLUMNS.evidence.en}</th>
                      <th scope="col">{thai ? HOTEL_AI_DIAGNOSTIC_COLUMNS.owner.th : HOTEL_AI_DIAGNOSTIC_COLUMNS.owner.en}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diagnostic.map((row) => (
                      <tr key={row.id}>
                        <th scope="row" data-label={thai ? HOTEL_AI_DIAGNOSTIC_COLUMNS.symptom.th : HOTEL_AI_DIAGNOSTIC_COLUMNS.symptom.en}>
                          {thai ? row.symptomTh : row.symptomEn}
                        </th>
                        <td data-label={thai ? HOTEL_AI_DIAGNOSTIC_COLUMNS.question.th : HOTEL_AI_DIAGNOSTIC_COLUMNS.question.en}>
                          {thai ? row.questionTh : row.questionEn}
                        </td>
                        <td data-label={thai ? HOTEL_AI_DIAGNOSTIC_COLUMNS.evidence.th : HOTEL_AI_DIAGNOSTIC_COLUMNS.evidence.en}>
                          {thai ? row.evidenceTh : row.evidenceEn}
                        </td>
                        <td data-label={thai ? HOTEL_AI_DIAGNOSTIC_COLUMNS.owner.th : HOTEL_AI_DIAGNOSTIC_COLUMNS.owner.en}>
                          {thai ? row.ownerTh : row.ownerEn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section id="method" className="kpi-tech-method border-y border-[#E3E8EB] bg-white">
          <div className="kpi-section">
            <h2 className="kpi-h2">{pick(cms.process.title, t.methodTitle)}</h2>
            <p className="kpi-tech-problems-lead">{pick(cms.process.lead, t.methodLead)}</p>
            <HotelAiRoadmapVisual locale={locale} />
            <ol className="kpi-tech-method-list">
              {processSteps.map((step, index) => (
                <li key={step.id} className="kpi-tech-method-item">
                  <div className="kpi-tech-method-meta">
                    <span className="kpi-latin kpi-tech-method-num">{"num" in step && step.num ? step.num : String(index + 1).padStart(2, "0")}</span>
                    <span className="kpi-latin kpi-tech-method-label">{step.label}</span>
                  </div>
                  <div className="kpi-tech-method-copy">
                    <h3>{thai ? step.titleTh : step.titleEn}</h3>
                    <p>{thai ? step.bodyTh : step.bodyEn}</p>
                    <dl className="hai-method-io">
                      <div>
                        <dt className="kpi-latin">{pick(cms.process.outputLabel, t.methodOutput)}</dt>
                        <dd>{thai ? step.outputTh : step.outputEn}</dd>
                      </div>
                      {"ownerTh" in step && (step.ownerTh || step.ownerEn) ? (
                        <div>
                          <dt>{thai ? "เจ้าของ" : "Owner"}</dt>
                          <dd>{thai ? step.ownerTh : step.ownerEn}</dd>
                        </div>
                      ) : null}
                      <div>
                        <dt>{pick(cms.process.gateLabel, t.methodGate)}</dt>
                        <dd>{thai ? step.gateTh : step.gateEn}</dd>
                      </div>
                    </dl>
                  </div>
                </li>
              ))}
            </ol>
            <a href={primaryHref} className="kpi-button kpi-tech-method-cta bg-[#a2dc25] text-[#1a3a02]">
              {pick(cms.process.cta, t.methodCta)} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="kpi-tech-cases">
          <div className="kpi-section">
            <h2 className="kpi-h2">{pick(cms.cases.title, t.casesTitle)}</h2>
            <p className="kpi-tech-problems-lead">{pick(cms.cases.lead, t.casesLead)}</p>
            <HotelAiCasesVisual locale={locale} />
            <div className="kpi-tech-cases-grid">
              {cases.map((item, index) => {
                const fallback = "fallbackTh" in item ? (thai ? item.fallbackTh : item.fallbackEn) : "";
                const rows = [
                  { key: "task", label: HOTEL_AI_CASE_FIELDS.task, value: thai ? item.taskTh : item.taskEn },
                  { key: "input", label: HOTEL_AI_CASE_FIELDS.input, value: thai ? item.inputTh : item.inputEn },
                  { key: "simplify", label: HOTEL_AI_CASE_FIELDS.simplify, value: thai ? item.simplifyTh : item.simplifyEn },
                  { key: "automate", label: HOTEL_AI_CASE_FIELDS.automate, value: thai ? item.automateTh : item.automateEn },
                  { key: "review", label: HOTEL_AI_CASE_FIELDS.review, value: thai ? item.reviewTh : item.reviewEn },
                  { key: "output", label: HOTEL_AI_CASE_FIELDS.output, value: thai ? item.outputTh : item.outputEn },
                  { key: "dependency", label: HOTEL_AI_CASE_FIELDS.dependency, value: thai ? item.dependencyTh : item.dependencyEn },
                  { key: "caution", label: HOTEL_AI_CASE_FIELDS.caution, value: thai ? item.cautionTh : item.cautionEn },
                  ...(fallback
                    ? [{ key: "fallback", label: { th: "ทางเลือกเมื่อระบบใช้ไม่ได้", en: "Manual fallback" }, value: fallback }]
                    : []),
                ];
                return (
                  <article key={item.id} className="kpi-tech-card hai-case-card">
                    <span className="kpi-latin kpi-tech-num">{String(index + 1).padStart(2, "0")}</span>
                    {!("sample" in item) || item.sample ? <p className="hai-status is-yellow">{sample}</p> : null}
                    <h3>{thai ? item.titleTh : item.titleEn}</h3>
                    <dl className="hai-case-flow">
                      {rows.map((row) => (
                        <div key={row.key} className={row.key === "review" || row.key === "output" || row.key === "caution" || row.key === "dependency" || row.key === "fallback" ? `is-${row.key === "fallback" ? "caution" : row.key}` : undefined}>
                          <dt>{thai ? row.label.th : row.label.en}</dt>
                          <dd>
                            {row.key === "review" ? (
                              <span className="hai-status is-amber">{thai ? "ต้องมีคนตรวจ" : "Human review"}</span>
                            ) : null}
                            <span>{row.value}</span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                );
              })}
            </div>
            <p className="kpi-tech-cases-note">{pick(cms.cases.note, t.casesNote)}</p>
          </div>
        </section>

        <section className="kpi-tech-study border-y border-[#E3E8EB] bg-white">
          <div className="kpi-section">
            <h2 className="kpi-h2">{pick(cms.pilot.title, t.pilotTitle)}</h2>
            <p className="kpi-tech-problems-lead">{pick(cms.pilot.lead, t.pilotLead)}</p>
            <HotelAiPilotVisual locale={locale} />
            <ol className="hai-pilot-steps">
              {pilotSteps.map((step, index) => (
                <li key={step.id}>
                  <span className="kpi-latin kpi-tech-num">{String(index + 1).padStart(2, "0")}</span>
                  <p>{thai ? step.th : step.en}</p>
                </li>
              ))}
            </ol>
            <div className="hai-pilot-charter">
              <h3>{pick(cms.pilot.charterTitle, t.pilotCharterTitle)}</h3>
              <p>{pick(cms.pilot.charterLead, t.pilotCharterLead)}</p>
              <p className="hai-status is-yellow hai-pilot-sample">{sample}</p>
              <div className="hai-pilot-charter-wrap">
                <table className="hai-pilot-charter-table">
                  <caption className="sr-only">{pick(cms.pilot.charterCaption, t.pilotCharterCaption)}</caption>
                  <thead>
                    <tr>
                      <th scope="col">{thai ? "ฟิลด์" : "Field"}</th>
                      <th scope="col">{thai ? "ค่าตัวอย่าง" : "Sample value"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charter.map((row) => (
                      <tr key={row.id}>
                        <th scope="row">{thai ? row.labelTh : row.labelEn}</th>
                        <td>{thai ? row.valueTh : row.valueEn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="hai-pilot-decisions">
              <h3>{pick(cms.pilot.decisionTitle, t.pilotDecisionTitle)}</h3>
              <p>{pick(cms.pilot.decisionLead, t.pilotDecisionLead)}</p>
              <ul>
                {decisions.map((item) => (
                  <li key={item.id}>
                    <strong className="kpi-latin">{item.label}</strong>
                    <p>{thai ? item.th : item.en}</p>
                  </li>
                ))}
              </ul>
            </div>
            <p className="kpi-tech-study-body">{pick(cms.pilot.close, t.pilotClose)}</p>
          </div>
        </section>

        <section className="kpi-tech-evidence border-y border-[#E3E8EB]">
          <div className="kpi-section">
            <h2 className="kpi-h2">{pick(cms.evidence.title, t.studyTitle)}</h2>
            <p className="kpi-tech-study-takeaway">
              {pick(cms.evidence.takeawayLead, t.studyTakeawayLead)}
              <span className="kpi-tech-study-takeaway-close">{pick(cms.evidence.takeawayClose, t.studyTakeawayClose)}</span>
            </p>
            <p className="kpi-tech-study-body">{pick(cms.evidence.body, t.studyBody)}</p>
            <div className="kpi-tech-need-grid hai-evidence-grid">
              <article className="hai-evidence-card">
                <p className={`hai-status ${publishedClaim ? "is-lime" : "is-yellow"}`}>{publishedClaim ? (thai ? "หลักฐานที่ตรวจแล้ว" : "Verified evidence") : sample}</p>
                {publishedClaim ? (
                  <p className="kpi-latin">{publicHotelAiClaimNumber(publishedClaim, bilingual)}{publishedClaim.unit ? ` ${publishedClaim.unit}` : ""}</p>
                ) : null}
                <dl>
                  <div>
                    <dt>{pick(cms.evidence.sourceLabel, t.evidenceSourceLabel)}</dt>
                    <dd>{publishedClaim?.sourceTitle || pick(cms.evidence.source, t.evidenceSource)}</dd>
                  </div>
                  <div>
                    <dt>{pick(cms.evidence.contextLabel, t.evidenceContextLabel)}</dt>
                    <dd>{publishedClaim ? (thai ? publishedClaim.contextTh : publishedClaim.contextEn) || pick(cms.evidence.context, t.evidenceContext) : pick(cms.evidence.context, t.evidenceContext)}</dd>
                  </div>
                  <div>
                    <dt>{pick(cms.evidence.measureLabel, t.evidenceMeasureLabel)}</dt>
                    <dd>{publishedClaim ? (thai ? publishedClaim.methodTh : publishedClaim.methodEn) || pick(cms.evidence.measure, t.evidenceMeasure) : pick(cms.evidence.measure, t.evidenceMeasure)}</dd>
                  </div>
                  <div>
                    <dt>{pick(cms.evidence.noteLabel, t.evidenceNoteLabel)}</dt>
                    <dd>{publishedClaim ? (thai ? publishedClaim.limitationsTh : publishedClaim.limitationsEn) || pick(cms.evidence.note, t.evidenceNote) : pick(cms.evidence.note, t.evidenceNote)}</dd>
                  </div>
                </dl>
              </article>
              <HotelAiEvidenceVisual locale={locale} />
            </div>
          </div>
        </section>

        <section className="kpi-tech-measure">
          <div className="kpi-section">
            <h2 className="kpi-h2">{pick(cms.measure.title, t.measureTitle)}</h2>
            <p className="kpi-tech-measure-lead">{pick(cms.measure.lead, t.measureLead)}</p>
            <p className="hai-status is-yellow hai-scorecard-sample">{sample}</p>
            <dl className="hai-scorecard-meta">
              <div>
                <dt>{pick(cms.measure.updatedLabel, t.measureUpdatedLabel)}</dt>
                <dd>{pick(cms.measure.updatedValue, HOTEL_AI_SCORECARD_META.lastUpdated ?? t.measureUpdatedValue)}</dd>
              </div>
              <div>
                <dt>{pick(cms.measure.ownerLabel, t.measureOwnerLabel)}</dt>
                <dd>{pick(cms.measure.ownerValue, HOTEL_AI_SCORECARD_META.owner ?? t.measureOwnerValue)}</dd>
              </div>
            </dl>
            <HotelAiScorecardVisual locale={locale} />
            <div className="hai-scorecard-wrap">
              <table className="hai-scorecard-table">
                <caption className="sr-only">{pick(cms.measure.caption, t.measureCaption)}</caption>
                <thead>
                  <tr>
                    {HOTEL_AI_SCORECARD_COLUMNS.map((column) => (
                      <th key={column.id} scope="col">
                        {thai ? column.th : column.en}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {kpis.map((row) => {
                    const gated =
                      "dataStatus" in row
                        ? publicHotelAiKpiValues(row as CmsHotelAiKpi, bilingual)
                        : { baseline: "baseline" in row ? String(row.baseline || "") : "", pilot: "pilot" in row ? String(row.pilot || "") : "" };
                    const baseline = gated.baseline;
                    const pilot = gated.pilot;
                    const dataStatus = "dataStatus" in row ? String(row.dataStatus) : "";
                    const statusLabel =
                      dataStatus === "sample"
                        ? sample
                        : dataStatus === "approved" && (baseline || pilot)
                          ? thai
                            ? "อนุมัติแล้ว"
                            : "Approved"
                          : pick(cms.measure.empty, t.measureStatusEmpty);
                    return (
                    <tr key={row.id} className={row.tone === "review" ? "is-review" : undefined}>
                      <th scope="row" data-label={thai ? "ตัวชี้วัด" : "Metric"}>
                        <span className="kpi-latin">{row.label}</span>
                      </th>
                      <td data-label={thai ? "เส้นฐาน" : "Baseline"}>
                        {baseline ? (
                          <span>{baseline}</span>
                        ) : (
                        <span className="hai-scorecard-empty" aria-label={pick(cms.measure.empty, t.measureEmpty)}>
                          {HOTEL_AI_SCORECARD_EMPTY}
                        </span>
                        )}
                      </td>
                      <td data-label={thai ? "ทดลอง" : "Pilot"}>
                        {pilot ? (
                          <span>{pilot}</span>
                        ) : (
                        <span className="hai-scorecard-empty" aria-label={pick(cms.measure.empty, t.measureEmpty)}>
                          {HOTEL_AI_SCORECARD_EMPTY}
                        </span>
                        )}
                      </td>
                      <td data-label={thai ? "นิยาม" : "Definition"}>{thai ? row.definitionTh : row.definitionEn}</td>
                      <td data-label={thai ? "ช่วงวัด" : "Period"}>{thai ? row.periodTh : row.periodEn}</td>
                      <td data-label={thai ? "แหล่งข้อมูล" : "Source"}>{thai ? row.sourceTh : row.sourceEn}</td>
                      <td data-label={thai ? "ผู้ทบทวน" : "Review owner"}>{thai ? row.ownerTh : row.ownerEn}</td>
                      <td data-label={thai ? "สถานะข้อมูล" : "Data status"}>
                        <span className={`hai-status ${row.tone === "review" ? "is-amber" : dataStatus === "approved" ? "is-lime" : "is-yellow"}`}>
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <ul className="hai-scorecard-legend">
              <li>
                <span className="hai-status is-lime">{t.measureLegendPositive}</span>
              </li>
              <li>
                <span className="hai-status is-yellow">{t.measureLegendCompare}</span>
              </li>
              <li>
                <span className="hai-status is-amber">{t.measureLegendReview}</span>
              </li>
            </ul>
            <p className="kpi-tech-measure-close">{pick(cms.measure.emptyNote, t.measureEmptyNote)}</p>
            <p className="kpi-tech-measure-close">{pick(cms.measure.reviewNote, t.measureReviewNote)}</p>
            <p className="kpi-tech-measure-close">{pick(cms.measure.close, t.measureClose)}</p>
          </div>
        </section>

        <section className="kpi-tech-ownership border-y border-[#E3E8EB] bg-white">
          <div className="kpi-section">
            <h2 className="kpi-h2">{pick(cms.ownership.title, t.ownershipTitle)}</h2>
            <p className="kpi-tech-ownership-close">{pick(cms.ownership.lead, t.ownershipLead)}</p>
            <p className="hai-status is-yellow hai-ownership-sample">{sample}</p>
            <h3 className="kpi-tech-subhead kpi-latin">{pick(cms.ownership.flowTitle, t.ownershipFlowTitle)}</h3>
            <HotelAiOwnershipVisual locale={locale} />
            <ol className="hai-ownership-steps">
              {flow.map((step, index) => {
                const library = HOTEL_AI_DATA_FLOW.find((item) => item.id === step.id);
                return (
                <li key={step.id}>
                  <span className="kpi-latin kpi-tech-num">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{thai ? library?.shortTh || step.th : library?.shortEn || step.en}</strong>
                    <p>{thai ? step.th : step.en}</p>
                  </div>
                </li>
                );
              })}
            </ol>
            <p className="hai-ownership-review-lead">{pick(cms.ownership.reviewLead, t.ownershipReviewLead)}</p>
            <ul className="hai-ownership-gates">
              {reviewItems.map((item) => (
                <li key={item.id}>
                  <span className="hai-status is-amber">{thai ? "ต้องมีคนตรวจ" : "Needs review"}</span>
                  <span>{thai ? item.th : item.en}</span>
                </li>
              ))}
            </ul>
            <div className="hai-ownership-principles">
              <h3>{pick(cms.ownership.principlesTitle, t.ownershipPrinciplesTitle)}</h3>
              <ol>
                {principles.map((item, index) => (
                  <li key={item.id}>
                    <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                    <p>{thai ? item.th : item.en}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="hai-ownership-matrix">
              <h3>{pick(cms.ownership.matrixTitle, t.ownershipMatrixTitle)}</h3>
              <p className="hai-status is-yellow hai-ownership-sample">{sample}</p>
              <div className="hai-ownership-matrix-wrap">
                <table className="hai-ownership-table">
                  <caption className="sr-only">{pick(cms.ownership.caption, t.ownershipCaption)}</caption>
                  <thead>
                    <tr>
                      {HOTEL_AI_ACCESS_COLUMNS.map((column) => (
                        <th key={column.id} scope="col">
                          {thai ? column.th : column.en}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {access.map((row) => (
                      <tr key={row.id} className={row.reviewTone === "review" ? "is-review" : undefined}>
                        <th scope="row" data-label={thai ? "หมวดข้อมูล" : "Data category"}>
                          {thai ? row.categoryTh : row.categoryEn}
                        </th>
                        <td data-label={thai ? "เจ้าของ" : "Owner"}>{thai ? row.ownerTh : row.ownerEn}</td>
                        <td data-label={thai ? "บทบาท / เครื่องมือที่อนุญาต" : "Allowed role / tool"}>
                          {thai ? row.allowedTh : row.allowedEn}
                        </td>
                        <td data-label={thai ? "ต้องมีคนตรวจ" : "Review required"}>
                          <span className={`hai-status ${row.reviewTone === "review" ? "is-amber" : "is-yellow"}`}>
                            {thai ? row.reviewTh : row.reviewEn}
                          </span>
                        </td>
                        <td data-label={thai ? "กติกาเก็บรักษา" : "Retention rule"}>
                          {thai ? row.retentionTh : row.retentionEn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="kpi-tech-ownership-close">{pick(cms.ownership.close, t.ownershipClose)}</p>
          </div>
        </section>

        <section className="kpi-tech-audience">
          <div className="kpi-section">
            <h2 className="kpi-h2">{pick(cms.fit.title, t.fitTitle)}</h2>
            <p className="kpi-tech-audience-body">{pick(cms.fit.lead, t.fitLead)}</p>
            <p className="hai-status is-yellow hai-fit-sample">{sample}</p>
            <HotelAiFitVisual locale={locale} />
            <p className="sr-only">{pick(cms.fit.caption, t.fitCaption)}</p>
            <div className="hai-fit-grid">
              {fit.map((item, index) => (
                <article key={item.id} className="kpi-tech-card hai-fit-card">
                  <span className="kpi-latin kpi-tech-num">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="kpi-latin">{item.label}</h3>
                  <p className="hai-fit-team">{thai ? item.titleTh : item.titleEn}</p>
                  <dl>
                    <div>
                      <dt>{thai ? HOTEL_AI_FIT_FIELDS.example.th : HOTEL_AI_FIT_FIELDS.example.en}</dt>
                      <dd>{thai ? item.exampleTh : item.exampleEn}</dd>
                    </div>
                    <div>
                      <dt>{thai ? HOTEL_AI_FIT_FIELDS.start.th : HOTEL_AI_FIT_FIELDS.start.en}</dt>
                      <dd>{thai ? item.startTh : item.startEn}</dd>
                    </div>
                    <div>
                      <dt>{thai ? HOTEL_AI_FIT_FIELDS.guard.th : HOTEL_AI_FIT_FIELDS.guard.en}</dt>
                      <dd>
                        <span className="hai-status is-amber">{thai ? "ต้องมีคนตรวจ" : "Human review"}</span>
                        <span>{thai ? item.guardTh : item.guardEn}</span>
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
            <aside className="hai-fit-not-ready">
              <h3>{pick(cms.fit.notTitle, t.fitNotReadyTitle)}</h3>
              <p>{pick(cms.fit.notLead, t.fitNotReadyLead)}</p>
              <ul>
                {notReady.map((item) => (
                  <li key={item.id}>
                    <span className="hai-status is-amber">{thai ? "ยังไม่เริ่ม" : "Not yet"}</span>
                    <span>{thai ? item.th : item.en}</span>
                  </li>
                ))}
              </ul>
            </aside>
            <p className="kpi-tech-audience-body">{pick(cms.fit.note, t.fitNote)}</p>
            <aside className="kpi-tech-closer">
              <h3>{pick(cms.related.closerTitle, t.closerTitle)}</h3>
              <p>{pick(cms.related.closerBody, t.closerBody)}</p>
              <div className="kpi-tech-closer-actions">
                <a href={closerHref} className="kpi-button bg-[#a2dc25] text-[#1a3a02]">
                  {pick(cms.related.closerCta, t.closerCta)} <span aria-hidden="true">↗</span>
                </a>
                {systemsHref ? (
                  <Link href={systemsHref} className="kpi-tech-closer-link">
                    {pick(cms.hero.secondaryCta.label, t.secondary)}
                  </Link>
                ) : null}
              </div>
            </aside>
          </div>
        </section>

        {related.length ? (
          <section className="kpi-tech-related border-t border-[#E3E8EB] bg-white">
            <div className="kpi-section">
              <h2 className="kpi-h2">{pick(cms.related.title, t.relatedTitle)}</h2>
              <p className="hai-related-lead">{pick(cms.related.lead, t.relatedLead)}</p>
              <div className="hai-related-layout">
                <HotelAiRelatedVisual locale={locale} />
                <div className="hai-related-cards">
                  {featuredRelated ? <HotelAiRelatedCardLink card={featuredRelated} locale={locale} featured /> : null}
                  {supportingRelated.length ? (
                    <div className="hai-related-stack">
                      {supportingRelated.map((card) => (
                        <HotelAiRelatedCardLink key={card.id} card={card} locale={locale} />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <TechnologyEnquiry locale={locale} helper={fromCms ? cms.form : undefined} />
        <PageFaqs items={faqItems} locale={locale} intro={faqLead} sectionId="hotel-ai-faq" />
        <TechnologyStickyCta label={pick(cms.hero.primaryCta.label, t.cta)} />
      </div>
  );

  if (embedded) return inner;
  return (
    <SiteShell locale={locale} route={localizePath("/solutions/hotel-ai-automation", locale)} hideFaqs>
      {inner}
    </SiteShell>
  );
}

function HotelAiRelatedCardLink({
  card,
  locale,
  featured = false,
}: {
  card: HotelAiRelatedCard;
  locale: Locale;
  featured?: boolean;
}) {
  const thai = locale === "th";
  const dateLabel = hotelAiRelatedDateLabel(card, thai ? "th" : "en");
  const typeLabel = thai ? card.contentTypeTh : card.contentTypeEn;
  const datetime = card.dateKind === "updated" ? card.updatedAt || card.publishedAt : card.publishedAt;
  const className = `hai-related-item${featured ? " is-featured" : ""}`;
  const body = (
    <>
      {featured ? <span className="hai-related-accent" aria-hidden="true" /> : null}
      <p className="hai-related-kicker kpi-latin">{thai ? card.categoryTh : card.categoryEn}</p>
      <h3>{thai ? card.titleTh : card.titleEn}</h3>
      <p className="hai-related-desc">{thai ? card.descriptionTh : card.descriptionEn}</p>
      {dateLabel || typeLabel ? (
        <p className="hai-related-meta">
          {typeLabel ? <span>{typeLabel}</span> : null}
          {typeLabel && dateLabel ? <span aria-hidden="true"> · </span> : null}
          {dateLabel ? datetime ? <time dateTime={datetime}>{dateLabel}</time> : <span>{dateLabel}</span> : null}
        </p>
      ) : null}
      <span className="hai-related-cta">
        {thai ? card.ctaTh : card.ctaEn} <span aria-hidden="true">↗</span>
      </span>
    </>
  );

  if (card.external) {
    return (
      <a className={className} href={card.href} rel="noreferrer">
        {body}
      </a>
    );
  }

  return (
    <Link className={className} href={card.href}>
      {body}
    </Link>
  );
}
