import Link from "next/link";
import { PageFaqs } from "@/components/PageFaqs";
import { PageHero } from "@/components/PageHero";
import { SolutionsConnectVisual } from "@/components/SolutionsConnectVisual";
import { SolutionsProcessFit } from "@/components/SolutionsProcessFit";
import { SolutionsServiceCard } from "@/components/SolutionsServiceCard";
import { SolutionsServiceFinder } from "@/components/SolutionsServiceFinder";
import { SiteShell } from "@/components/SiteShell";
import type { CmsSolutionsIndexPage } from "@/lib/cms/solutions-index-page";
import {
  loadSolutionsIndexPage,
  solutionsIndexFaqsFromCms,
  solutionsIndexPublicHref,
} from "@/lib/cms/solutions-index-page-public";
import { visibleSolutionGroups } from "@/lib/nav";
import { solutionsIndexCopy } from "@/lib/localized-ui";
import { auditHref, barePath, localizePath, type Locale } from "@/lib/seo";
import type { SolutionChallenge } from "@/lib/solutions-challenges";
import {
  MARKETING_CATEGORY_ID,
  MARKETING_CATEGORY_JOURNEY,
  MARKETING_CATEGORY_VISUAL,
} from "@/lib/solutions-marketing-category";
import {
  REVENUE_CATEGORY_FLOW,
  REVENUE_CATEGORY_ID,
  REVENUE_CATEGORY_VISUAL,
} from "@/lib/solutions-revenue-category";
import { standardizeServiceCard, solutionsConnectChain } from "@/lib/solutions-service-cards";
import {
  SYSTEMS_CATEGORY_ID,
  SYSTEMS_CATEGORY_INTRO,
  SYSTEMS_CATEGORY_RELATION,
  SYSTEMS_CATEGORY_VISUAL,
  SYSTEMS_HONEST_LABELS,
} from "@/lib/solutions-systems-category";

const HERO_FLOW = [
  { en: "Revenue & Sales", th: "รายได้และการขาย" },
  { en: "Marketing & Booking", th: "การตลาดและการจอง" },
  { en: "Hotel Website / Booking", th: "เว็บไซต์ / การจอง" },
  { en: "Systems & Data", th: "ระบบและข้อมูล" },
  { en: "Team & Operations", th: "ทีมและการดำเนินงาน" },
  { en: "Measured Review", th: "ทบทวนและวัดผล" },
] as const;

function pick(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function challengesFromCms(content: CmsSolutionsIndexPage): SolutionChallenge[] {
  return content.finder.challenges.map((item) => ({
    id: item.id as SolutionChallenge["id"],
    label: {
      th: item.labelTh,
      en: item.labelEn,
      ru: item.labelEn,
      zh: item.labelEn,
    },
    matches: item.matches.map((match) => ({
      href: match.href,
      reason: {
        th: match.reasonTh,
        en: match.reasonEn,
        ru: match.reasonEn,
        zh: match.reasonEn,
      },
    })),
  }));
}

export async function SolutionsIndexView({
  locale,
  previewContent,
  embedded = false,
}: {
  locale: Locale;
  previewContent?: CmsSolutionsIndexPage;
  embedded?: boolean;
}) {
  const cms = previewContent ? { ...previewContent, fromCms: true } : await loadSolutionsIndexPage(locale);
  const fromCms = cms.fromCms;
  const thai = locale === "th";
  const t = solutionsIndexCopy[locale];
  const audit = auditHref(locale);
  const heroPrimaryHref = solutionsIndexPublicHref(fromCms ? cms.hero.primaryCta.href : "", locale, audit);
  const heroSecondaryHref = solutionsIndexPublicHref(fromCms ? cms.hero.secondaryCta.href : "", locale, "#solutions");
  const unsurePrimaryHref = solutionsIndexPublicHref(fromCms ? cms.cta.primaryCta.href : "", locale, audit);
  const unsureSecondaryHref = solutionsIndexPublicHref(fromCms ? cms.cta.secondaryCta.href : "", locale, "#solutions-all");

  type GroupItem = {
    href: string;
    label: string;
    problem?: string;
    suitable?: string;
    deliverable?: string;
  };
  type GroupView = {
    id: string;
    num: string;
    title: string;
    intro?: string;
    items: GroupItem[];
  };

  const navGroups = visibleSolutionGroups(locale);
  const groups: GroupView[] = fromCms && cms.categories.items.length
    ? cms.categories.items.map((category, index) => {
        const nav = navGroups.find((group) => group.id === category.id) ?? navGroups[index];
        const cmsCards = cms.cards.items.filter((card) => card.visible !== false && card.groupId === category.id);
        const items: GroupItem[] = cmsCards.length
          ? cmsCards.map((card) => ({
              href: card.href,
              label: thai ? pick(card.nameTh, card.nameEn) : pick(card.nameEn, card.nameTh),
              problem: thai ? pick(card.problemTh, card.problemEn) : pick(card.problemEn, card.problemTh),
              suitable: thai ? card.suitableTh : card.suitableEn,
              deliverable: thai ? card.deliverableTh : card.deliverableEn,
            }))
          : (nav?.items ?? []).map((item) => ({
              href: item.href,
              label: item.label,
              problem: t.problems[barePath(item.href) as keyof typeof t.problems],
            }));
        return {
          id: category.id,
          num: `0${index + 1}`,
          title: thai ? pick(category.titleTh, nav?.title ?? category.titleEn) : pick(category.titleEn, nav?.title ?? category.titleTh),
          intro: thai ? category.bodyTh : category.bodyEn,
          items,
        };
      })
    : navGroups.map((group, index) => ({
        id: group.id,
        num: `0${index + 1}`,
        title: t.groups[index]?.title ?? group.title,
        items: group.items.map((item) => ({
          href: item.href,
          label: item.label,
          problem: t.problems[barePath(item.href) as keyof typeof t.problems],
        })),
      }));

  const finderItems: GroupItem[] = groups.flatMap((group) => group.items);
  const cardCopy = {
    suitableForLabel: fromCms ? pick(cms.cards.suitableForLabel, t.suitableForLabel) : t.suitableForLabel,
    deliverableLabel: fromCms ? pick(cms.cards.deliverableLabel, t.deliverableLabel) : t.deliverableLabel,
    boundaryLabel: t.boundaryLabel,
    viewDetails: fromCms ? pick(cms.cards.viewDetails, t.viewDetails) : t.viewDetails,
  };
  const challenges = fromCms && cms.finder.challenges.length ? challengesFromCms(cms) : undefined;
  const heroFlow = fromCms && cms.hero.flow.length ? cms.hero.flow : null;
  const processSteps =
    fromCms && cms.process.steps.length
      ? cms.process.steps.map((step) => ({
          id: step.id,
          title: thai ? pick(step.titleTh, step.titleEn) : pick(step.titleEn, step.titleTh),
          body: thai ? pick(step.bodyTh, step.bodyEn) : pick(step.bodyEn, step.bodyTh),
        }))
      : undefined;
  const proofItems =
    fromCms
      ? cms.proof.items.map((item) => ({
          id: item.id,
          identity: thai ? pick(item.identityTh, item.identityEn) : pick(item.identityEn, item.identityTh),
          challenge: thai ? pick(item.challengeTh, item.challengeEn) : pick(item.challengeEn, item.challengeTh),
          scope: thai ? pick(item.scopeTh, item.scopeEn) : pick(item.scopeEn, item.scopeTh),
          workDone: thai ? pick(item.metricTh, item.metricEn) : pick(item.metricEn, item.metricTh),
          measurement: [
            thai ? item.definitionTh : item.definitionEn,
            thai ? item.periodTh : item.periodEn,
            thai ? item.sourceTh : item.sourceEn,
          ]
            .map((part) => part.trim())
            .filter(Boolean)
            .join(" · "),
          review: item.reviewedAt,
        }))
      : undefined;
  const faqItems = solutionsIndexFaqsFromCms(fromCms ? cms : null, locale);
  const heroVisualSrc = fromCms && cms.hero.visual.src ? cms.hero.visual.src : "/images/hotel-solutions-hero-placeholder.webp";
  const heroVisualAlt = fromCms
    ? thai
      ? pick(cms.hero.visual.altTh, cms.hero.visual.altEn || t.heroVisualAlt)
      : pick(cms.hero.visual.altEn, cms.hero.visual.altTh || t.heroVisualAlt)
    : t.heroVisualAlt;
  const heroVisualLabel = fromCms ? pick(cms.hero.visual.label, t.heroVisualLabel) : t.heroVisualLabel;
  const ctaVisualSrc =
    fromCms && cms.cta.visual.src ? cms.cta.visual.src : "/images/hotel-solutions-consultation-process-placeholder.webp";
  const ctaVisualAlt = fromCms
    ? thai
      ? pick(cms.cta.visual.altTh, cms.cta.visual.altEn || t.unsureVisualAlt)
      : pick(cms.cta.visual.altEn, cms.cta.visual.altTh || t.unsureVisualAlt)
    : t.unsureVisualAlt;
  const ctaVisualLabel = fromCms ? pick(cms.cta.visual.label, t.unsureVisualLabel) : t.unsureVisualLabel;
  const unsureHelps =
    fromCms && cms.cta.helps.length
      ? cms.cta.helps.map((item) => (thai ? pick(item.th, item.en) : pick(item.en, item.th)))
      : [...t.unsureHelps];

  const inner = (
    <>
      <PageHero className="kpi-solutions-hero">
        <div className="kpi-solutions-hero-grid">
          <div className="kpi-solutions-hero-copy">
            <p className="kpi-kicker kpi-solutions-hero-kicker">{fromCms ? pick(cms.hero.eyebrow, t.eyebrow) : t.eyebrow}</p>
            <h1 className="kpi-h1 mt-5">{fromCms ? pick(cms.hero.title, t.title) : t.title}</h1>
            <p className="kpi-lead mt-6 text-white/72">{fromCms ? pick(cms.hero.body, t.body) : t.body}</p>
            <p className="kpi-solutions-hero-support">{fromCms ? pick(cms.hero.supportLine, t.supportLine) : t.supportLine}</p>
            <div className="kpi-actions kpi-solutions-hero-actions">
              <Link href={heroPrimaryHref} className="kpi-button kpi-solutions-hero-primary">
                {fromCms ? pick(cms.hero.primaryCta.label, t.audit) : t.audit}
              </Link>
              <Link href={heroSecondaryHref} className="kpi-button-ghost kpi-solutions-hero-secondary">
                {fromCms ? pick(cms.hero.secondaryCta.label, t.browse) : t.browse}
              </Link>
            </div>
          </div>
          <figure className="kpi-solutions-hero-figure">
            <span className="kpi-solutions-hero-sample">{heroVisualLabel}</span>
            <img
              src={heroVisualSrc}
              alt={heroVisualAlt}
              width={1600}
              height={1000}
              className="kpi-solutions-hero-photo"
              decoding="async"
              fetchPriority="high"
            />
            <ol className="kpi-solutions-hero-flow" aria-label={heroVisualAlt}>
              {heroFlow
                ? heroFlow.map((step) => (
                    <li key={step.id}>
                      <span className="kpi-latin">{step.en}</span>
                      {locale === "th" && step.th ? <span>{step.th}</span> : null}
                    </li>
                  ))
                : HERO_FLOW.map((step) => (
                    <li key={step.en}>
                      <span className="kpi-latin">{step.en}</span>
                      {locale === "th" ? <span>{step.th}</span> : null}
                    </li>
                  ))}
            </ol>
          </figure>
        </div>
      </PageHero>

      <SolutionsServiceFinder
        locale={locale}
        items={finderItems}
        auditHref={unsurePrimaryHref}
        challenges={challenges}
        copy={{
          sectionEyebrow: fromCms ? pick(cms.finder.eyebrow, t.sectionEyebrow) : t.sectionEyebrow,
          sectionTitle: fromCms ? pick(cms.finder.title, t.sectionTitle) : t.sectionTitle,
          startNote: fromCms ? pick(cms.finder.startNote, t.startNote) : t.startNote,
          challengeLegend: fromCms ? pick(cms.finder.challengeLegend, t.challengeLegend) : t.challengeLegend,
          emptyTitle: fromCms ? pick(cms.finder.emptyTitle, t.emptyTitle) : t.emptyTitle,
          emptyBody: fromCms ? pick(cms.finder.emptyBody, t.emptyBody) : t.emptyBody,
          resultTitle: fromCms ? pick(cms.finder.resultTitle, t.resultTitle) : t.resultTitle,
          resultLead: fromCms ? pick(cms.finder.resultLead, t.resultLead) : t.resultLead,
          clearSelection: fromCms ? pick(cms.finder.clearSelection, t.clearSelection) : t.clearSelection,
          relatedWhy: fromCms ? pick(cms.finder.relatedWhy, t.relatedWhy) : t.relatedWhy,
          details: fromCms ? pick(cms.finder.details, t.details) : t.details,
          browseAll: fromCms ? pick(cms.finder.browseAll, t.browseAll) : t.browseAll,
          unsureHint: fromCms ? pick(cms.finder.unsureHint, t.unsureHint) : t.unsureHint,
          unsureCta: fromCms ? pick(cms.finder.unsureCta, t.unsureCta) : t.unsureCta,
          mapLabel: t.mapLabel,
          mapSteps: t.mapSteps,
        }}
      />

      <div id="solutions-all" className="scroll-mt-28">
        <div className="kpi-section pb-2 lg:pb-4">
          <h2 className="kpi-h2">{fromCms ? pick(cms.categories.title, t.allGroupsTitle) : t.allGroupsTitle}</h2>
        </div>
        {groups.map((group, index) => {
          const isRevenue = group.id === REVENUE_CATEGORY_ID;
          const isMarketing = group.id === MARKETING_CATEGORY_ID;
          const isSystems = group.id === SYSTEMS_CATEGORY_ID;
          const cmsChain = fromCms ? cms.relationships.chains.find((chain) => chain.groupId === group.id) : undefined;
          const showConnect = Boolean(cmsChain?.steps.length || solutionsConnectChain(group.id));
          const connectSteps = cmsChain?.steps.length
            ? cmsChain.steps.map((step) => (thai ? pick(step.th, step.en) : pick(step.en, step.th)))
            : undefined;

          return (
            <div key={group.id} className={index % 2 === 1 ? "bg-white" : undefined}>
              <section
                id={group.id}
                className={`kpi-section scroll-mt-28${isRevenue ? " kpi-solutions-revenue" : ""}${isMarketing ? " kpi-solutions-marketing" : ""}${isSystems ? " kpi-solutions-systems" : ""}`}
              >
                <p className="text-sm font-black tracking-[.16em] text-[#0B6660]">{group.num}</p>
                <h3 className="mt-4 max-w-3xl text-2xl font-extrabold leading-[1.2] tracking-[-.02em] text-[#3B3B3B] sm:text-3xl">
                  {group.title}
                </h3>
                {isSystems ? (
                  <p className="kpi-solutions-systems-intro">
                    {pick(group.intro, SYSTEMS_CATEGORY_INTRO[locale] ?? SYSTEMS_CATEGORY_INTRO.en)}
                  </p>
                ) : group.intro ? (
                  <p className="kpi-lead mt-4 max-w-3xl">{group.intro}</p>
                ) : null}

                {isRevenue ? (
                  <figure className="kpi-solutions-revenue-visual">
                    <span className="kpi-solutions-revenue-visual-badge">{REVENUE_CATEGORY_VISUAL.label}</span>
                    <img
                      src={REVENUE_CATEGORY_VISUAL.src}
                      alt={REVENUE_CATEGORY_VISUAL.alt[locale] ?? REVENUE_CATEGORY_VISUAL.alt.en}
                      width={REVENUE_CATEGORY_VISUAL.displayWidth}
                      height={REVENUE_CATEGORY_VISUAL.displayHeight}
                      className="kpi-solutions-revenue-visual-img"
                      decoding="async"
                      loading="lazy"
                    />
                    <ol className="kpi-solutions-revenue-flow-list sr-only">
                      {REVENUE_CATEGORY_FLOW.map((step, stepIndex) => (
                        <li key={step.id}>
                          <span className="kpi-solutions-revenue-flow-num">0{stepIndex + 1}</span>
                          <span className="kpi-latin">{step.en}</span>
                          {locale !== "en" ? <span>{step[locale]}</span> : null}
                        </li>
                      ))}
                    </ol>
                    <figcaption className="kpi-solutions-revenue-visual-caption">
                      {REVENUE_CATEGORY_VISUAL.note[locale] ?? REVENUE_CATEGORY_VISUAL.note.en}
                    </figcaption>
                  </figure>
                ) : null}

                {isMarketing ? (
                  <figure className="kpi-solutions-marketing-visual">
                    <span className="kpi-solutions-marketing-visual-badge">{MARKETING_CATEGORY_VISUAL.label}</span>
                    <div
                      className="kpi-solutions-marketing-journey"
                      role="img"
                      aria-label={MARKETING_CATEGORY_VISUAL.alt[locale] ?? MARKETING_CATEGORY_VISUAL.alt.en}
                    >
                      <ol className="kpi-solutions-marketing-journey-list">
                        {MARKETING_CATEGORY_JOURNEY.map((step, stepIndex) => (
                          <li key={step.id}>
                            <span className="kpi-solutions-marketing-journey-num" aria-hidden="true">
                              0{stepIndex + 1}
                            </span>
                            <span className="kpi-latin">{step.en}</span>
                            {locale !== "en" ? (
                              <span className="kpi-solutions-marketing-journey-local">{step[locale]}</span>
                            ) : null}
                            {stepIndex < MARKETING_CATEGORY_JOURNEY.length - 1 ? (
                              <span className="kpi-solutions-marketing-journey-arrow" aria-hidden="true">
                                <svg viewBox="0 0 24 12" width="24" height="12" focusable="false">
                                  <path d="M0 6h18M14 1l8 5-8 5" fill="none" stroke="currentColor" strokeWidth="2" />
                                </svg>
                              </span>
                            ) : null}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <figcaption className="kpi-solutions-marketing-visual-caption">
                      {MARKETING_CATEGORY_VISUAL.note[locale] ?? MARKETING_CATEGORY_VISUAL.note.en}
                    </figcaption>
                  </figure>
                ) : null}

                {isSystems ? (
                  <figure className="kpi-solutions-systems-visual">
                    <span className="kpi-solutions-systems-visual-badge">{SYSTEMS_CATEGORY_VISUAL.label}</span>
                    <div
                      className="kpi-solutions-systems-relation"
                      role="img"
                      aria-label={SYSTEMS_CATEGORY_VISUAL.alt[locale] ?? SYSTEMS_CATEGORY_VISUAL.alt.en}
                    >
                      <ol className="kpi-solutions-systems-relation-list">
                        {SYSTEMS_CATEGORY_RELATION.map((node, nodeIndex) => (
                          <li key={node.id}>
                            <span className="kpi-solutions-systems-relation-num" aria-hidden="true">
                              0{nodeIndex + 1}
                            </span>
                            <span className="kpi-latin">{node.en}</span>
                            {locale !== "en" ? <span className="kpi-solutions-systems-relation-local">{node[locale]}</span> : null}
                            <ul className="kpi-solutions-systems-relation-tags">
                              {node.labels.map((labelId) => (
                                <li key={labelId}>{SYSTEMS_HONEST_LABELS[labelId]?.[locale] ?? labelId}</li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <figcaption className="kpi-solutions-systems-visual-caption">
                      {SYSTEMS_CATEGORY_VISUAL.note[locale] ?? SYSTEMS_CATEGORY_VISUAL.note.en}
                    </figcaption>
                  </figure>
                ) : null}

                {showConnect ? (
                  <SolutionsConnectVisual
                    groupId={group.id}
                    locale={locale}
                    steps={connectSteps}
                    copy={{
                      title: fromCms ? pick(cms.relationships.title, t.connectTitle) : t.connectTitle,
                      note: fromCms ? pick(cms.relationships.note, t.connectNote) : t.connectNote,
                    }}
                  />
                ) : null}

                <div className="kpi-solutions-service-grid">
                  {group.items.map((item) => {
                    const base = standardizeServiceCard({
                      groupId: group.id,
                      category: group.title,
                      href: item.href,
                      name: item.label,
                      problem: item.problem,
                      locale,
                    });
                    return (
                      <SolutionsServiceCard
                        key={item.href}
                        card={{
                          ...base,
                          suitable: item.suitable || base.suitable,
                          deliverable: item.deliverable || base.deliverable,
                        }}
                        copy={cardCopy}
                      />
                    );
                  })}
                </div>
              </section>
            </div>
          );
        })}
      </div>

      <SolutionsProcessFit
        locale={locale}
        steps={processSteps}
        proofItems={proofItems}
        copy={{
          eyebrow: fromCms ? pick(cms.process.eyebrow, t.processEyebrow) : t.processEyebrow,
          title: fromCms ? pick(cms.process.title, t.processTitle) : t.processTitle,
          lead: fromCms ? pick(cms.process.lead, t.processLead) : t.processLead,
          proofTitle: fromCms ? pick(cms.proof.title, t.processProofTitle) : t.processProofTitle,
          noProofNote: fromCms ? pick(cms.proof.noProofNote, t.processNoProofNote) : t.processNoProofNote,
        }}
      />

      <section className="kpi-section" aria-labelledby="solutions-unsure-title">
        <div className="kpi-solutions-unsure">
          <div className="kpi-solutions-unsure-copy">
            <h2 id="solutions-unsure-title" className="kpi-h2 text-[#0B1F33]">
              {fromCms ? pick(cms.cta.title, t.unsureTitle) : t.unsureTitle}
            </h2>
            <p className="kpi-lead mt-5">{fromCms ? pick(cms.cta.body, t.unsureBody) : t.unsureBody}</p>
            <ol className="kpi-solutions-unsure-helps">
              {unsureHelps.map((help, index) => (
                <li key={`${help}-${index}`}>
                  <span className="kpi-solutions-unsure-helps-num" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span>{help}</span>
                </li>
              ))}
            </ol>
            <div className="kpi-actions kpi-solutions-unsure-actions">
              <Link href={unsurePrimaryHref} className="kpi-button kpi-solutions-unsure-primary bg-[#a2dc25] text-[#1a3a02]">
                {fromCms ? pick(cms.cta.primaryCta.label, t.unsurePrimary) : t.unsurePrimary}
              </Link>
              <Link href={unsureSecondaryHref} className="kpi-button-ghost">
                {fromCms ? pick(cms.cta.secondaryCta.label, t.unsureSecondary) : t.unsureSecondary}
              </Link>
            </div>
          </div>
          <figure className="kpi-solutions-unsure-figure">
            <span className="kpi-solutions-unsure-sample">{ctaVisualLabel}</span>
            <img
              src={ctaVisualSrc}
              alt={ctaVisualAlt}
              width={1200}
              height={600}
              className="kpi-solutions-unsure-photo"
              decoding="async"
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <PageFaqs items={faqItems} locale={locale} sectionId="solutions-faq" />
    </>
  );

  if (embedded) return inner;

  return (
    <SiteShell locale={locale} route={localizePath("/solutions", locale)} hideFaqs>
      {inner}
    </SiteShell>
  );
}
