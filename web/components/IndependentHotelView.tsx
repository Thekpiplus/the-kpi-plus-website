import Link from "next/link";
import { IndependentHotelEnquiry } from "@/components/IndependentHotelEnquiry";
import { IndependentHotelStickyCta } from "@/components/IndependentHotelStickyCta";
import {
  IndependentAssessmentVisual,
  IndependentDeliverablesVisual,
  IndependentFitVisual,
  IndependentHeroVisual,
  IndependentModelVisual,
  IndependentPlanVisual,
  IndependentRelatedVisual,
  IndependentScopeVisual,
  IndependentServicesVisual,
  IndependentWorkflowVisual,
} from "@/components/independent-hotel/IndependentVisuals";
import "@/components/independent-hotel/independent-visuals.css";
import { PageFaqs } from "@/components/PageFaqs";
import { SiteShell } from "@/components/SiteShell";
import type { CmsIndependentPage } from "@/lib/cms/independent-hotel-page";
import { splitCmsLines } from "@/lib/cms/independent-hotel-page";
import {
  independentHotelFaqsFromCms,
  loadIndependentHotelPage,
} from "@/lib/cms/independent-hotel-page-public";
import {
  INDEPENDENT_ASSESSMENT_ROWS,
  INDEPENDENT_CADENCE,
  INDEPENDENT_DELIVERABLES,
  INDEPENDENT_DELIVERABLES_BOUNDARY,
  INDEPENDENT_DELIVERABLES_COLUMNS,
  INDEPENDENT_FIT_COLUMNS,
  INDEPENDENT_FIT_NOT,
  INDEPENDENT_FIT_SCENARIOS,
  INDEPENDENT_HERO_CAPABILITIES,
  INDEPENDENT_KPIS,
  INDEPENDENT_KPI_SAMPLE,
  INDEPENDENT_MODEL_BOUNDARY,
  INDEPENDENT_MODEL_STEPS,
  INDEPENDENT_PLAN,
  INDEPENDENT_SCOPE_ROWS,
  INDEPENDENT_SERVICE_FIELDS,
  INDEPENDENT_SERVICES,
  INDEPENDENT_SOURCES,
  INDEPENDENT_WORKFLOW,
  INDEPENDENT_WORKFLOW_APPROVALS,
  INDEPENDENT_WORKFLOW_FIELDS,
  INDEPENDENT_WORKSTREAMS,
  independentHotelCopy,
  independentRelatedCards,
} from "@/lib/independent-hotel";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, type Locale } from "@/lib/seo";

function independentPublicHref(href: string, locale: Locale, fallback: string) {
  const next = href.trim() || fallback;
  if (/^(#|https?:\/\/|mailto:|tel:)/i.test(next)) return next;
  return existingHref(next, locale) || localizePath(next, locale) || next;
}

export async function IndependentHotelView({
  locale,
  previewContent,
  embedded = false,
}: {
  locale: Locale;
  previewContent?: CmsIndependentPage;
  embedded?: boolean;
}) {
  const cms = previewContent ? { ...previewContent, fromCms: true } : await loadIndependentHotelPage(locale);
  const fromCms = cms.fromCms;
  const t = locale === "th" ? independentHotelCopy.th : independentHotelCopy.en;
  const solutions = localizePath("/solutions", locale);
  const approach = existingHref("/approach", locale) || localizePath("/approach", locale);
  const thai = locale === "th";
  const faqItems = independentHotelFaqsFromCms(fromCms ? cms : null, locale);
  const related =
    fromCms && cms.related.cards.length
      ? cms.related.cards.map((card) => ({
          id: card.id,
          href: independentPublicHref(card.href, locale, "/solutions"),
          title: thai ? card.titleTh || card.titleEn : card.titleEn || card.titleTh,
          body: thai ? card.bodyTh || card.bodyEn : card.bodyEn || card.bodyTh,
          cta: thai ? card.ctaTh || card.ctaEn : card.ctaEn || card.ctaTh,
        }))
      : independentRelatedCards(locale);
  const assessmentRows =
    fromCms && cms.assessment.rows.length
      ? cms.assessment.rows
      : INDEPENDENT_ASSESSMENT_ROWS.map((row) => ({
          id: row.id,
          num: row.num,
          titleTh: row.titleTh,
          titleEn: row.titleEn,
          questionTh: row.lookTh,
          questionEn: row.lookEn,
          symptomTh: "",
          symptomEn: "",
          supportTh: "",
          supportEn: "",
          output: row.output,
        }));
  const workstreams = fromCms && cms.services.workstreams.length ? cms.services.workstreams : INDEPENDENT_WORKSTREAMS.map((row) => ({ ...row, bulletsTh: row.bulletsTh.join("\n"), bulletsEn: row.bulletsEn.join("\n") }));
  const serviceItems = fromCms && cms.services.items.length ? cms.services.items : INDEPENDENT_SERVICES;
  const modelSteps = fromCms && cms.model.steps.length ? cms.model.steps : INDEPENDENT_MODEL_STEPS;
  const deliverableRows = fromCms && cms.deliverables.rows.length ? cms.deliverables.rows : INDEPENDENT_DELIVERABLES;
  const deliverableSupport = fromCms && cms.deliverables.supportItems.length ? cms.deliverables.supportItems : INDEPENDENT_DELIVERABLES_BOUNDARY.supportItems.map((item, index) => ({ id: `support-${index + 1}`, th: item.th, en: item.en }));
  const deliverableHotel = fromCms && cms.deliverables.hotelItems.length ? cms.deliverables.hotelItems : INDEPENDENT_DELIVERABLES_BOUNDARY.hotelItems.map((item, index) => ({ id: `hotel-${index + 1}`, th: item.th, en: item.en }));
  const workflowSteps = fromCms && cms.workflow.steps.length ? cms.workflow.steps : INDEPENDENT_WORKFLOW;
  const workflowApprovals = fromCms && cms.workflow.approvals.length ? cms.workflow.approvals : INDEPENDENT_WORKFLOW_APPROVALS;
  const fitScenarios = fromCms && cms.fit.scenarios.length ? cms.fit.scenarios : INDEPENDENT_FIT_SCENARIOS;
  const fitNot = fromCms && cms.fit.notItems.length ? cms.fit.notItems : INDEPENDENT_FIT_NOT;
  const scopeRows =
    fromCms && cms.scope.rows.length
      ? cms.scope.rows.map((row) => ({ ...row, itemsTh: splitCmsLines(row.itemsTh), itemsEn: splitCmsLines(row.itemsEn) }))
      : INDEPENDENT_SCOPE_ROWS;
  const planPhases =
    fromCms && cms.plan.phases.length
      ? cms.plan.phases.map((row) => ({ ...row, itemsTh: splitCmsLines(row.itemsTh), itemsEn: splitCmsLines(row.itemsEn) }))
      : INDEPENDENT_PLAN;
  const cadenceRows =
    fromCms && cms.plan.cadence.length
      ? cms.plan.cadence.map((row) => ({ ...row, itemsTh: splitCmsLines(row.itemsTh), itemsEn: splitCmsLines(row.itemsEn) }))
      : INDEPENDENT_CADENCE;
  const kpiRows = (fromCms && cms.measure.kpis.length ? cms.measure.kpis : INDEPENDENT_KPIS).filter(
    (kpi) => !kpi.hideUntilData,
  );
  const sourceRows = fromCms && cms.measure.sources.length ? cms.measure.sources : INDEPENDENT_SOURCES;
  const primaryHref = independentPublicHref(fromCms ? cms.hero.primaryCta.href : "", locale, "#independent-hotel-enquiry");
  const secondaryHref = existingHref(fromCms && cms.hero.secondaryCta.href.trim() ? cms.hero.secondaryCta.href : "/approach", locale) || approach;
  const closerHref = independentPublicHref(fromCms ? cms.related.closerHref : "", locale, "#independent-hotel-enquiry");
  const sampleLabel = (fromCms && cms.plan.sampleLabel.trim() ? cms.plan.sampleLabel : "Sample plan").trim() || "Sample plan";

  const inner = (
    <div className="kpi-independent">
      <section className="kpi-hero kpi-home-hero-section kpi-independent-hero">
        <div className="kpi-wrap">
          <nav aria-label="Breadcrumb" className="kpi-independent-hero-crumb">
            <ol>
              <li>
                <Link href={solutions}>{t.crumb}</Link>
              </li>
              <li>
                <span aria-hidden="true">/</span>
                <span>{solutionNavLabel("/solutions/independent-hotel-management", locale)}</span>
              </li>
            </ol>
          </nav>
          <div className="kpi-home-hero">
            <div className="kpi-home-hero-copy">
              <p className="kpi-home-eyebrow kpi-latin">{fromCms && cms?.hero.eyebrow.trim() ? cms.hero.eyebrow : t.eyebrow}</p>
              <h1 className="kpi-h1 kpi-home-h1">
                {fromCms && cms?.hero.title.trim() ? (
                  cms.hero.title
                ) : locale === "th" ? (
                  <>
                    <span className="kpi-home-h1-lead">
                      บริหารโรงแรมอิสระให้<span className="kpi-home-accent">เดินหน้าได้จริง</span>
                    </span>
                    <span className="kpi-home-h1-rest">และเติบโตอย่างมีทิศทาง</span>
                  </>
                ) : (
                  t.title
                )}
              </h1>
              <p className="kpi-lead kpi-home-lead">{fromCms && cms?.hero.description.trim() ? cms.hero.description : t.lead}</p>
              <p className="kpi-independent-lead-close">{fromCms && cms?.hero.close.trim() ? cms.hero.close : t.leadClose}</p>
              <div className="kpi-actions">
                <a href={primaryHref} className="kpi-button">
                  {fromCms && cms?.hero.primaryCta.label.trim() ? cms.hero.primaryCta.label : t.cta} <span aria-hidden="true">↗</span>
                </a>
                <Link href={secondaryHref} className="kpi-button-ghost">
                  {fromCms && cms?.hero.secondaryCta.label.trim() ? cms.hero.secondaryCta.label : t.secondary}
                </Link>
              </div>
              <p className="kpi-independent-hero-note">{fromCms && cms?.hero.underCta.trim() ? cms.hero.underCta : t.underCta}</p>
              <p className="kpi-independent-hero-trust kpi-latin" aria-label={thai ? "ขอบเขตงานที่อาจช่วยได้" : "Support capabilities"}>
                {INDEPENDENT_HERO_CAPABILITIES.map((item) => (
                  <span key={item.en}>{item.en}</span>
                ))}
              </p>
            </div>
            <div className="kpi-hero-visual kpi-home-photo">
              <IndependentHeroVisual
                locale={locale}
                src={cms.hero.visual.src}
                alt={thai ? cms.hero.visual.altTh : cms.hero.visual.altEn}
                status={cms.hero.visual.status}
                label={cms.hero.visual.label}
                caption={cms.hero.visual.caption}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-independent-need">
        <div className="kpi-independent-need-grid">
          <div className="kpi-independent-need-copy">
            <h2 className="kpi-h2">{fromCms && cms?.assessment.title.trim() ? cms.assessment.title : t.needTitle}</h2>
            <p className="kpi-independent-need-lead">{fromCms && cms?.assessment.lead.trim() ? cms.assessment.lead : t.needLead}</p>
            <p className="kpi-independent-need-close">{fromCms && cms?.assessment.close.trim() ? cms.assessment.close : t.needClose}</p>
            <div className="kpi-independent-board is-2">
              {assessmentRows.map((row) => {
                const question = thai ? row.questionTh : row.questionEn;
                const symptom = thai ? row.symptomTh : row.symptomEn;
                const support = thai ? row.supportTh : row.supportEn;
                return (
                  <article key={row.id} className="kpi-independent-card">
                    <span className="kpi-latin">{row.num}</span>
                    <h3>{thai ? row.titleTh : row.titleEn}</h3>
                    {question.trim() ? <p>{question}</p> : null}
                    {symptom.trim() ? <p>{symptom}</p> : null}
                    {support.trim() ? <p>{support}</p> : null}
                    {row.output.trim() ? <p className="kpi-independent-need-output kpi-latin">{thai ? `ผลลัพธ์: ${row.output}` : `Output: ${row.output}`}</p> : null}
                  </article>
                );
              })}
            </div>
          </div>
          <IndependentAssessmentVisual locale={locale} src={cms.assessment.visual.src} />
        </div>
      </section>

      <section className="kpi-independent-help border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <p className="kpi-independent-help-kicker kpi-latin">Independent Hotel Operating Model</p>
          <h2 className="kpi-h2">{fromCms && cms?.services.title.trim() ? cms.services.title : t.helpTitle}</h2>
          <p className="kpi-independent-help-lead">{fromCms && cms.services.lead.trim() ? cms.services.lead : t.helpLead}</p>
          <IndependentServicesVisual locale={locale} src={cms.services.visual.src} />
          <div className="kpi-independent-workstreams">
            {workstreams.map((stream) => (
              <article key={stream.id} className="kpi-independent-workstream">
                <p className="kpi-latin">{stream.num}</p>
                <h3>{thai ? stream.titleTh : stream.titleEn}</h3>
                <ul>
                  {splitCmsLines(thai ? stream.bulletsTh : stream.bulletsEn).map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <div className="kpi-independent-workstream-items">
                  {serviceItems.filter((item) => item.stream === stream.id).map((item) => (
                    <div key={item.id} className="kpi-independent-service">
                      <h4>{thai ? item.titleTh : item.titleEn}</h4>
                      <dl>
                        <div>
                          <dt>{thai ? INDEPENDENT_SERVICE_FIELDS.input.th : INDEPENDENT_SERVICE_FIELDS.input.en}</dt>
                          <dd>{thai ? item.inputTh : item.inputEn}</dd>
                        </div>
                        <div>
                          <dt>{thai ? INDEPENDENT_SERVICE_FIELDS.action.th : INDEPENDENT_SERVICE_FIELDS.action.en}</dt>
                          <dd>{thai ? item.actionTh : item.actionEn}</dd>
                        </div>
                        <div>
                          <dt>{thai ? INDEPENDENT_SERVICE_FIELDS.output.th : INDEPENDENT_SERVICE_FIELDS.output.en}</dt>
                          <dd className="kpi-latin">{item.output}</dd>
                        </div>
                        <div>
                          <dt>{thai ? INDEPENDENT_SERVICE_FIELDS.approval.th : INDEPENDENT_SERVICE_FIELDS.approval.en}</dt>
                          <dd>{thai ? item.approvalTh : item.approvalEn}</dd>
                        </div>
                        <div>
                          <dt>{thai ? INDEPENDENT_SERVICE_FIELDS.owner.th : INDEPENDENT_SERVICE_FIELDS.owner.en}</dt>
                          <dd>{thai ? item.ownerTh : item.ownerEn}</dd>
                        </div>
                      </dl>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <p className="kpi-independent-help-boundary">{fromCms && cms.services.boundary.trim() ? cms.services.boundary : t.helpBoundary}</p>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{fromCms && cms?.model.title.trim() ? cms.model.title : t.modelTitle}</h2>
        <div className="kpi-independent-split">
          <IndependentModelVisual locale={locale} src={cms.model.visual.src} />
          <div className="kpi-independent-board">
            {modelSteps.map((step) => (
              <article key={step.id} className="kpi-independent-card">
                <p className="kpi-latin">{step.num} {step.label}</p>
                <h3>{thai ? step.titleTh : step.titleEn}</h3>
                <p className="kpi-latin">{step.output}</p>
              </article>
            ))}
            <article className="kpi-independent-card is-green">
              <h3>{fromCms && cms.model.supportTitle.trim() ? cms.model.supportTitle : thai ? INDEPENDENT_MODEL_BOUNDARY.supportTitle.th : INDEPENDENT_MODEL_BOUNDARY.supportTitle.en}</h3>
              <p>{fromCms && cms.model.support.trim() ? cms.model.support : thai ? INDEPENDENT_MODEL_BOUNDARY.support.th : INDEPENDENT_MODEL_BOUNDARY.support.en}</p>
            </article>
            <article className="kpi-independent-card is-amber">
              <h3>{fromCms && cms.model.hotelTitle.trim() ? cms.model.hotelTitle : thai ? INDEPENDENT_MODEL_BOUNDARY.hotelTitle.th : INDEPENDENT_MODEL_BOUNDARY.hotelTitle.en}</h3>
              <p>{fromCms && cms.model.hotel.trim() ? cms.model.hotel : thai ? INDEPENDENT_MODEL_BOUNDARY.hotel.th : INDEPENDENT_MODEL_BOUNDARY.hotel.en}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-independent-deliverables">
        <h2 className="kpi-h2">{fromCms && cms?.deliverables.title.trim() ? cms.deliverables.title : t.deliverablesTitle}</h2>
        <p className="kpi-independent-deliverables-lead">{fromCms && cms.deliverables.lead.trim() ? cms.deliverables.lead : t.deliverablesLead}</p>
        <IndependentDeliverablesVisual locale={locale} src={cms.deliverables.visual.src} />
        <div className="kpi-independent-matrix-wrap">
          <table className="kpi-independent-matrix">
            <caption className="sr-only">
              {thai
                ? "ตารางขอบเขตงานและผลลัพธ์ที่ส่งมอบ แสดงสิ่งที่ทบทวน เอกสารที่ส่งมอบ และจุดที่โรงแรมอนุมัติ"
                : "Scope and deliverables table showing what is reviewed or supported, the named deliverable, and the hotel approval point."}
            </caption>
            <thead>
              <tr>
                <th scope="col">{thai ? INDEPENDENT_DELIVERABLES_COLUMNS.area.th : INDEPENDENT_DELIVERABLES_COLUMNS.area.en}</th>
                <th scope="col">{thai ? INDEPENDENT_DELIVERABLES_COLUMNS.support.th : INDEPENDENT_DELIVERABLES_COLUMNS.support.en}</th>
                <th scope="col">{thai ? INDEPENDENT_DELIVERABLES_COLUMNS.deliverable.th : INDEPENDENT_DELIVERABLES_COLUMNS.deliverable.en}</th>
                <th scope="col">{thai ? INDEPENDENT_DELIVERABLES_COLUMNS.approval.th : INDEPENDENT_DELIVERABLES_COLUMNS.approval.en}</th>
              </tr>
            </thead>
            <tbody>
              {deliverableRows.map((row) => (
                <tr key={row.id}>
                  <th scope="row" data-label={thai ? INDEPENDENT_DELIVERABLES_COLUMNS.area.th : INDEPENDENT_DELIVERABLES_COLUMNS.area.en}>
                    {thai ? row.areaTh : row.areaEn}
                  </th>
                  <td data-label={thai ? INDEPENDENT_DELIVERABLES_COLUMNS.support.th : INDEPENDENT_DELIVERABLES_COLUMNS.support.en}>
                    {thai ? row.supportTh : row.supportEn}
                  </td>
                  <td data-label={thai ? INDEPENDENT_DELIVERABLES_COLUMNS.deliverable.th : INDEPENDENT_DELIVERABLES_COLUMNS.deliverable.en}>
                    <span className="kpi-latin">{row.deliverable}</span>
                  </td>
                  <td data-label={thai ? INDEPENDENT_DELIVERABLES_COLUMNS.approval.th : INDEPENDENT_DELIVERABLES_COLUMNS.approval.en}>
                    {thai ? row.approvalTh : row.approvalEn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="kpi-independent-deliverables-split">
          <article className="kpi-independent-card is-green">
            <h3>{fromCms && cms.deliverables.supportTitle.trim() ? cms.deliverables.supportTitle : thai ? INDEPENDENT_DELIVERABLES_BOUNDARY.supportTitle.th : INDEPENDENT_DELIVERABLES_BOUNDARY.supportTitle.en}</h3>
            <ul>
              {deliverableSupport.map((item) => (
                <li key={item.id}>{thai ? item.th : item.en}</li>
              ))}
            </ul>
          </article>
          <article className="kpi-independent-card is-amber">
            <h3>{fromCms && cms.deliverables.hotelTitle.trim() ? cms.deliverables.hotelTitle : thai ? INDEPENDENT_DELIVERABLES_BOUNDARY.hotelTitle.th : INDEPENDENT_DELIVERABLES_BOUNDARY.hotelTitle.en}</h3>
            <ul>
              {deliverableHotel.map((item) => (
                <li key={item.id}>{thai ? item.th : item.en}</li>
              ))}
            </ul>
          </article>
        </div>
        <p className="kpi-independent-deliverables-boundary">{fromCms && cms.deliverables.boundary.trim() ? cms.deliverables.boundary : t.deliverablesBoundary}</p>
      </section>

      <section className="kpi-section kpi-independent-method">
        <h2 className="kpi-h2">{fromCms && cms?.workflow.title.trim() ? cms.workflow.title : t.methodTitle}</h2>
        <p className="kpi-independent-method-lead">{fromCms && cms.workflow.lead.trim() ? cms.workflow.lead : t.methodLead}</p>
        <IndependentWorkflowVisual locale={locale} src={cms.workflow.visual.src} />
        <ol className="kpi-independent-method-steps">
          {workflowSteps.map((step) => (
            <li key={step.id} className="kpi-independent-method-step">
              <p className="kpi-latin">{step.num} {step.label}</p>
              <h3>{thai ? step.titleTh : step.titleEn}</h3>
              <p>{thai ? step.bodyTh : step.bodyEn}</p>
              <dl>
                <div>
                  <dt>{thai ? INDEPENDENT_WORKFLOW_FIELDS.owner.th : INDEPENDENT_WORKFLOW_FIELDS.owner.en}</dt>
                  <dd>{thai ? step.ownerTh : step.ownerEn}</dd>
                </div>
                <div>
                  <dt>{thai ? INDEPENDENT_WORKFLOW_FIELDS.input.th : INDEPENDENT_WORKFLOW_FIELDS.input.en}</dt>
                  <dd>{thai ? step.inputTh : step.inputEn}</dd>
                </div>
                <div>
                  <dt>{thai ? INDEPENDENT_WORKFLOW_FIELDS.action.th : INDEPENDENT_WORKFLOW_FIELDS.action.en}</dt>
                  <dd>{thai ? step.actionTh : step.actionEn}</dd>
                </div>
                <div>
                  <dt>{thai ? INDEPENDENT_WORKFLOW_FIELDS.output.th : INDEPENDENT_WORKFLOW_FIELDS.output.en}</dt>
                  <dd className="kpi-latin">{step.output}</dd>
                </div>
                <div>
                  <dt>{thai ? INDEPENDENT_WORKFLOW_FIELDS.approval.th : INDEPENDENT_WORKFLOW_FIELDS.approval.en}</dt>
                  <dd>{thai ? step.approvalTh : step.approvalEn}</dd>
                </div>
                <div>
                  <dt>{thai ? INDEPENDENT_WORKFLOW_FIELDS.next.th : INDEPENDENT_WORKFLOW_FIELDS.next.en}</dt>
                  <dd>{thai ? step.nextTh : step.nextEn}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
        <div className="kpi-independent-approvals">
          <h3>{fromCms && cms.workflow.approvalsTitle.trim() ? cms.workflow.approvalsTitle : t.methodApprovals}</h3>
          <ul>
            {workflowApprovals.map((item) => (
              <li key={item.id}>
                {thai ? <span className="kpi-latin">{item.en}</span> : null}
                <strong>{thai ? item.th : item.en}</strong>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="kpi-independent-fit border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{fromCms && cms?.fit.title.trim() ? cms.fit.title : t.fitTitle}</h2>
          <p className="kpi-independent-fit-lead">{fromCms && cms.fit.lead.trim() ? cms.fit.lead : t.fitLead}</p>
          <IndependentFitVisual locale={locale} src={cms.fit.visual.src} />
          <div className="kpi-independent-matrix-wrap">
            <table className="kpi-independent-matrix">
              <caption className="sr-only">
                {thai
                  ? "ตารางตัวอย่างสถานการณ์ที่ Independent Hotel Management อาจเหมาะ ไม่ใช่ผลการวินิจฉัยก่อนประเมิน"
                  : "Sample situations where Independent Hotel Management may be suitable. Not a diagnosis before assessment."}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{thai ? INDEPENDENT_FIT_COLUMNS.situation.th : INDEPENDENT_FIT_COLUMNS.situation.en}</th>
                  <th scope="col">{thai ? INDEPENDENT_FIT_COLUMNS.symptom.th : INDEPENDENT_FIT_COLUMNS.symptom.en}</th>
                  <th scope="col">{thai ? INDEPENDENT_FIT_COLUMNS.question.th : INDEPENDENT_FIT_COLUMNS.question.en}</th>
                  <th scope="col">{thai ? INDEPENDENT_FIT_COLUMNS.support.th : INDEPENDENT_FIT_COLUMNS.support.en}</th>
                  <th scope="col">{thai ? INDEPENDENT_FIT_COLUMNS.output.th : INDEPENDENT_FIT_COLUMNS.output.en}</th>
                </tr>
              </thead>
              <tbody>
                {fitScenarios.map((row) => (
                  <tr key={row.id}>
                    <th scope="row" data-label={thai ? INDEPENDENT_FIT_COLUMNS.situation.th : INDEPENDENT_FIT_COLUMNS.situation.en}>
                      {thai ? row.situationTh : row.situationEn}
                    </th>
                    <td data-label={thai ? INDEPENDENT_FIT_COLUMNS.symptom.th : INDEPENDENT_FIT_COLUMNS.symptom.en}>
                      {thai ? row.symptomTh : row.symptomEn}
                    </td>
                    <td data-label={thai ? INDEPENDENT_FIT_COLUMNS.question.th : INDEPENDENT_FIT_COLUMNS.question.en}>
                      {thai ? row.questionTh : row.questionEn}
                    </td>
                    <td data-label={thai ? INDEPENDENT_FIT_COLUMNS.support.th : INDEPENDENT_FIT_COLUMNS.support.en}>
                      {thai ? row.supportTh : row.supportEn}
                    </td>
                    <td data-label={thai ? INDEPENDENT_FIT_COLUMNS.output.th : INDEPENDENT_FIT_COLUMNS.output.en}>
                      <span className="kpi-latin">{row.output}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside className="kpi-independent-fit-not">
            <h3>{fromCms && cms.fit.notTitle.trim() ? cms.fit.notTitle : t.fitNotTitle}</h3>
            <ul>
              {fitNot.map((item) => (
                <li key={item.id}>{thai ? item.th : item.en}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{fromCms && cms?.scope.title.trim() ? cms.scope.title : t.scopeTitle}</h2>
        <IndependentScopeVisual locale={locale} src={cms.scope.visual.src} />
        <div className="kpi-independent-board is-3">
          {scopeRows.map((row) => (
            <article key={row.id} className="kpi-independent-card">
              <h3>{thai ? row.titleTh : row.titleEn}</h3>
              <ul>
                {(thai ? row.itemsTh : row.itemsEn).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="kpi-independent-deliverables-boundary">{fromCms && cms.scope.boundary.trim() ? cms.scope.boundary : t.deliverablesBoundary}</p>
      </section>

      <section className="kpi-section kpi-independent-plan">
        <p className="kpi-latin kpi-independent-plan-kicker">{sampleLabel}</p>
        <h2 className="kpi-h2">{fromCms && cms?.plan.title.trim() ? cms.plan.title : t.planTitle}</h2>
        <p className="kpi-independent-plan-lead">{fromCms && cms?.plan.lead.trim() ? cms.plan.lead : t.planLead}</p>
        <IndependentPlanVisual locale={locale} src={cms.plan.visual.src} />
        <ol className="kpi-independent-plan-phases">
          {planPhases.map((step) => (
            <li key={step.id} className="kpi-independent-plan-phase">
              {thai ? <p className="kpi-latin">{step.label}</p> : null}
              <h3>{thai ? step.labelTh : step.label}</h3>
              <ul>
                {(thai ? step.itemsTh : step.itemsEn).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="kpi-independent-plan-output">
                <span>{thai ? "ผลลัพธ์" : "Output"}</span>
                <strong className="kpi-latin">{step.output}</strong>
              </p>
            </li>
          ))}
        </ol>
        <div className="kpi-independent-cadence">
          <h3>{fromCms && cms.plan.cadenceTitle.trim() ? cms.plan.cadenceTitle : t.planCadenceTitle}</h3>
          <div className="kpi-independent-cadence-grid">
            {cadenceRows.map((item) => (
              <article key={item.id} className="kpi-independent-cadence-card">
                {thai ? <p className="kpi-latin">{item.label}</p> : null}
                <h4>{thai ? item.labelTh : item.label}</h4>
                <ul>
                  {(thai ? item.itemsTh : item.itemsEn).map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
        <p className="kpi-independent-plan-close">{fromCms && cms.plan.close.trim() ? cms.plan.close : t.planClose}</p>
      </section>

      <section className="kpi-section" aria-labelledby="independent-hotel-measure-heading">
        <h2 id="independent-hotel-measure-heading" className="kpi-h2">
          {fromCms && cms?.measure.title.trim() ? cms.measure.title : t.measureTitle}
        </h2>
        <p id="independent-hotel-measure-desc">
          {thai
            ? "ตัวชี้วัดตัวอย่างสำหรับทบทวนจังหวะงาน ไม่ใช่ผลโรงแรมจริง และไม่ใช่ผลที่การันตี"
            : "Sample review measures for management rhythm. Not a live hotel result, and not a guaranteed outcome."}
        </p>
        <p id="independent-hotel-sources">
          {(sourceRows[0] && (thai ? sourceRows[0].nameTh : sourceRows[0].nameEn)) || (thai ? INDEPENDENT_KPI_SAMPLE.sourceTh : INDEPENDENT_KPI_SAMPLE.source)}
          {" · "}
          {sourceRows[0]?.publishedAt || INDEPENDENT_KPI_SAMPLE.updatedAt}
        </p>
        <p>
          <a href={sourceRows[0]?.url || "#independent-hotel-sources"}>{thai ? sourceRows[0]?.nameTh || INDEPENDENT_SOURCES[0].nameTh : sourceRows[0]?.nameEn || INDEPENDENT_SOURCES[0].nameEn}</a>
        </p>
        <div className="kpi-independent-kpi" role="group" aria-labelledby="independent-hotel-measure-heading" aria-describedby="independent-hotel-measure-desc">
          {kpiRows.map((kpi) => {
            const definition = "definitionEn" in kpi ? (thai ? kpi.definitionTh : kpi.definitionEn || kpi.definitionTh) : thai ? kpi.definitionTh : kpi.definition;
            const period = "period" in kpi && kpi.period ? kpi.period : thai ? INDEPENDENT_KPI_SAMPLE.periodTh : INDEPENDENT_KPI_SAMPLE.period;
            const market = "market" in kpi && kpi.market ? kpi.market : thai ? INDEPENDENT_KPI_SAMPLE.marketTh : INDEPENDENT_KPI_SAMPLE.market;
            const source = "source" in kpi && kpi.source ? kpi.source : thai ? INDEPENDENT_KPI_SAMPLE.sourceTh : INDEPENDENT_KPI_SAMPLE.source;
            const tone = "tone" in kpi ? kpi.tone : kpi.dataStatus === "not-configured" ? "amber" : kpi.dataStatus === "sample" ? "yellow" : "green";
            const unit = "unitTh" in kpi && thai ? kpi.unitTh : kpi.unit;
            return (
              <article key={kpi.id} className={`kpi-independent-card is-${tone}`}>
                <h3 className="kpi-latin">{thai ? kpi.nameTh : kpi.nameEn}</h3>
                <p>{definition}</p>
                <small className="kpi-latin">{unit}</small>
                <small className="kpi-latin">{kpi.dataStatus === "not-configured" ? (thai ? "ยังไม่เชื่อมข้อมูล" : "Not configured") : kpi.dataStatus}</small>
                <small>{period}</small>
                <small>{market}</small>
                <small>{source}</small>
              </article>
            );
          })}
        </div>
      </section>

      <section className="kpi-independent-related">
        <div className="kpi-section">
          <h2 className="kpi-h2">{fromCms && cms?.related.title.trim() ? cms.related.title : t.relatedTitle}</h2>
          <IndependentRelatedVisual locale={locale} src={cms.related.visual.src} />
          <div className="kpi-independent-related-grid">
            {related.map((card) => (
              <Link key={card.id} href={card.href} className="kpi-independent-related-card">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <span className="kpi-latin">{card.cta}</span>
              </Link>
            ))}
          </div>
          <aside className="kpi-independent-closer kpi-independent-card">
            <h3>{fromCms && cms.related.closerTitle.trim() ? cms.related.closerTitle : t.closerTitle}</h3>
            <p>{fromCms && cms.related.closerBody.trim() ? cms.related.closerBody : t.closerBody}</p>
            <a
              href={closerHref}
              className="kpi-button kpi-independent-closer-cta"
              style={{ background: "#a2dc25", color: "#1a3a02" }}
            >
              {fromCms && cms.related.closerCta.trim() ? cms.related.closerCta : t.closerCta} <span aria-hidden="true">↗</span>
            </a>
          </aside>
        </div>
      </section>

      <IndependentHotelEnquiry locale={locale} visualSrc={cms.form.visual.src} helper={fromCms ? cms.form : undefined} />
      <PageFaqs items={faqItems} locale={locale} sectionId="independent-hotel-faq" />
      <IndependentHotelStickyCta label={fromCms && cms?.form.submit.trim() ? cms.form.submit : t.cta} />
    </div>
  );

  if (embedded) return inner;
  return (
    <SiteShell locale={locale} route={localizePath("/solutions/independent-hotel-management", locale)} hideFaqs>
      {inner}
    </SiteShell>
  );
}
