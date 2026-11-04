import Link from "next/link";
import type { ReactNode } from "react";
import { ArticleReadingProgress } from "@/components/ArticleReadingProgress";
import { ArticleToc } from "@/components/ArticleToc";
import { ArrowUpRight } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import type { HandoffBlock } from "@/lib/handoff";
import { HotelGuestDecisionJourney } from "@/components/insights/HotelGuestDecisionJourney";
import { HotelMarketingAdFunnel } from "@/components/insights/HotelMarketingAdFunnel";
import { HotelMarketingChannelMap } from "@/components/insights/HotelMarketingChannelMap";
import { HotelMarketingDirectBookingJourney } from "@/components/insights/HotelMarketingDirectBookingJourney";
import { HotelMarketingGbpLayout } from "@/components/insights/HotelMarketingGbpLayout";
import { HotelMarketingOtaChecklist } from "@/components/insights/HotelMarketingOtaChecklist";
import { HotelMarketingKpiMap } from "@/components/insights/HotelMarketingKpiMap";
import { HotelMarketingRevenueFlow } from "@/components/insights/HotelMarketingRevenueFlow";
import { HotelMarketingReviewLoop } from "@/components/insights/HotelMarketingReviewLoop";
import { HotelMarketingRoleSwimlane } from "@/components/insights/HotelMarketingRoleSwimlane";
import { HotelMarketingSeoStructure } from "@/components/insights/HotelMarketingSeoStructure";
import { HotelMarketingSocialPillars } from "@/components/insights/HotelMarketingSocialPillars";
import { HotelMarketingStartRoadmap } from "@/components/insights/HotelMarketingStartRoadmap";
import { HotelMarketingSummaryRecap } from "@/components/insights/HotelMarketingSummaryRecap";
import { InsightArticleMeta } from "@/components/insights/InsightArticleMeta";
import { InsightCover } from "@/components/insights/InsightCover";
import { InsightHotelMarketingEnquiry } from "@/components/insights/InsightHotelMarketingEnquiry";
import { InsightRelatedCard } from "@/components/insights/InsightRelatedCard";
import {
  buildInsightHeadingIds,
  estimateInsightReadingMinutes,
  insightBody,
  insightExcerpt,
  insightHeadingId,
  insightSourceLabel,
  insightsIndexCopy,
  relatedInsights,
  type InsightPost,
} from "@/lib/insights";
import { insightSampleLabel } from "@/lib/insights-media";
import { relatedServiceLinks } from "@/lib/insight-links";
import type { CmsHmVisual, CmsHotelMarketingInsight, HmSectionType } from "@/lib/cms/hotel-marketing-insight";
import {
  hmLang,
  hmStrategyHeading,
  hmText,
  hmVisualHasContent,
  hotelMarketingCoverFields,
  hotelMarketingRelatedServices,
  hotelMarketingSectionEntries,
  type HmLang,
  type HmSectionEntry,
} from "@/lib/cms/hotel-marketing-insight-public";
import { articleSchema } from "@/lib/schema";
import { auditHref, homeHref, htmlLang, localizePath, resolvePageHref, SITE, type Locale } from "@/lib/seo";

type HandoffTextBlock = { type: "h1" | "h2" | "h3" | "p"; text: string };

const EMPHASIS_TERMS = [
  "Revenue Management",
  "Google Business Profile",
  "Google Maps",
  "Google Search",
  "Google Ads",
  "Meta Ads",
  "Direct Booking",
  "Booking Engine",
  "Distribution",
  "Social Media",
  "Online Advertising",
  "Trust Signals",
  "Local Search",
  "Guest Experience",
  "Length of Stay",
  "Cancellation Rate",
  "Website Traffic",
  "Review Score",
  "Metasearch",
  "Travel Agents",
  "B2B Partners",
  "Hotel Marketing",
  "Visibility",
  "Interest",
  "Consideration",
  "Booking",
  "Revenue",
  "Occupancy",
  "RevPAR",
  "ROAS",
  "CRM",
  "OTA",
  "SEO",
  "ADR",
  "Meta",
];

function emphasizeTerms(text: string) {
  const pattern = new RegExp(`\\b(${EMPHASIS_TERMS.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "g");
  const parts: Array<string | { term: string }> = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push({ term: match[0] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  if (parts.length <= 1 && typeof parts[0] === "string") return text;
  return parts.map((part, index) =>
    typeof part === "string" ? (
      <span key={`t-${index}`}>{part}</span>
    ) : (
      <strong key={`e-${index}`} className="kpi-article-term">
        {part.term}
      </strong>
    ),
  );
}

function isJourneyLine(text: string) {
  return text.includes("→") && text.split("→").length >= 3 && text.length < 120;
}

function journeySteps(text: string) {
  return text
    .split(/\s*→\s*/)
    .map((step) => step.trim())
    .filter(Boolean);
}

function JourneyFlow({ text }: { text: string }) {
  const steps = journeySteps(text);
  if (steps.length < 3) {
    return <p className="kpi-article-path">{text}</p>;
  }

  return (
    <ol className="kpi-article-journey" aria-label={text}>
      {steps.map((step, index) => (
        <li key={`${step}-${index}`}>
          <span className="kpi-article-journey-step kpi-latin">{step}</span>
          {index < steps.length - 1 ? (
            <span className="kpi-article-journey-sep" aria-hidden="true">
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function isCompareHeading(text: string) {
  return /Revenue Management|ต่างกัน|versus|vs\.?/i.test(text);
}

function isStartHeading(text: string) {
  return /ควรเริ่ม|เริ่มทำการตลาด|where (should|to) (a )?hotel|where to begin|getting started checklist/i.test(text);
}

function isSummaryHeading(text: string) {
  return /สรุป:\s*การตลาดโรงแรม|hotel marketing is not just|สรุป:.*ระบบ|conclusion:/i.test(text);
}

function isHotelMarketingDefinitionHeading(text: string) {
  return /การตลาดโรงแรม\s*คืออะไร|what is hotel marketing/i.test(text);
}

function isHotelMarketingWhyHeading(text: string) {
  return /ทำไมการตลาดโรงแรมจึงสำคัญ|why (hotel )?marketing matters|why (is )?hotel marketing/i.test(text);
}

function isHotelMarketingMetricsHeading(text: string) {
  return /ตัวเลขอะไรที่โรงแรมควรวัด|what (numbers|metrics).*(hotel|measure)|metrics (to )?track/i.test(text);
}

function strategyParts(text: string) {
  const match = text.match(/^(\d+)\.\s+(.+)$/);
  if (!match) return null;
  return { num: match[1].padStart(2, "0"), title: match[2] };
}

function isSeoStrategy(parts: { num: string; title: string }) {
  return parts.num === "01" && /Google Search|SEO/i.test(parts.title);
}

function isGbpStrategy(parts: { num: string; title: string }) {
  return parts.num === "02" && /Google Business Profile|Google Maps/i.test(parts.title);
}

function isOtaStrategy(parts: { num: string; title: string }) {
  return parts.num === "03" && /OTA/i.test(parts.title);
}

function isWebsiteStrategy(parts: { num: string; title: string }) {
  return parts.num === "04" && /Website|Conversion/i.test(parts.title);
}

function isSocialStrategy(parts: { num: string; title: string }) {
  return parts.num === "05" && /Social Media|Content Marketing/i.test(parts.title);
}

function isAdsStrategy(parts: { num: string; title: string }) {
  return parts.num === "06" && /Online Advertising|Google Ads|Meta Ads/i.test(parts.title);
}

function isReputationStrategy(parts: { num: string; title: string }) {
  return parts.num === "07" && /Reputation Management|Review/i.test(parts.title);
}

function isMarketingRevenueStrategy(parts: { num: string; title: string }) {
  return parts.num === "08" && /Revenue Management|Marketing/i.test(parts.title);
}

function strategyVisual(parts: { num: string; title: string }, locale: Locale, key: string) {
  if (isSeoStrategy(parts)) return <HotelMarketingSeoStructure key={key} locale={locale} />;
  if (isGbpStrategy(parts)) return <HotelMarketingGbpLayout key={key} locale={locale} />;
  if (isOtaStrategy(parts)) return <HotelMarketingOtaChecklist key={key} locale={locale} />;
  if (isWebsiteStrategy(parts)) return <HotelMarketingDirectBookingJourney key={key} locale={locale} />;
  if (isSocialStrategy(parts)) return <HotelMarketingSocialPillars key={key} locale={locale} />;
  if (isAdsStrategy(parts)) return <HotelMarketingAdFunnel key={key} locale={locale} />;
  if (isReputationStrategy(parts)) return <HotelMarketingReviewLoop key={key} locale={locale} />;
  if (isMarketingRevenueStrategy(parts)) return <HotelMarketingRevenueFlow key={key} locale={locale} />;
  return null;
}

/** CMS-driven rendering context (structured Hotel Marketing documents). */
type CmsRender = {
  content: CmsHotelMarketingInsight;
  lang: HmLang;
  entries: HmSectionEntry[];
};

function CmsVisualImage({ visual, lang, locale }: { visual: CmsHmVisual; lang: HmLang; locale: Locale }) {
  const alt = hmText(lang, visual.alt);
  const caption = hmText(lang, visual.caption);
  const showBadge = visual.status === "sample" || visual.status === "placeholder";
  return (
    <figure className="kpi-article-figure kpi-article-cms-figure">
      <div className="kpi-article-figure-frame">
        <img
          src={visual.src.trim()}
          alt={alt}
          width={1200}
          height={750}
          sizes="(max-width: 48rem) 100vw, min(45rem, 100vw)"
          loading="lazy"
          decoding="async"
        />
        {showBadge ? (
          <span className={`kpi-insight-sample-label${locale === "th" ? "" : " kpi-latin"}`}>
            {insightSampleLabel(locale)}
          </span>
        ) : null}
      </div>
      {caption ? <figcaption className="kpi-article-figure-caption">{caption}</figcaption> : null}
    </figure>
  );
}

/**
 * One CMS visual. An uploaded image (mode "image" + src) replaces the diagram and carries a Sample badge when its
 * status is sample. Otherwise `diagramId` picks one of the existing native diagrams; empty `diagramId` = no visual.
 */
function renderCmsVisual(visual: CmsHmVisual | undefined, key: string, locale: Locale, cms: CmsRender): ReactNode {
  if (!visual || !hmVisualHasContent(visual)) return null;
  if (visual.mode === "image" && visual.src.trim()) {
    return <CmsVisualImage key={key} visual={visual} lang={cms.lang} locale={locale} />;
  }
  switch (visual.diagramId.trim()) {
    case "seo":
      return <HotelMarketingSeoStructure key={key} locale={locale} />;
    case "gbp":
      return <HotelMarketingGbpLayout key={key} locale={locale} />;
    case "ota":
      return <HotelMarketingOtaChecklist key={key} locale={locale} />;
    case "direct":
      return <HotelMarketingDirectBookingJourney key={key} locale={locale} />;
    case "social":
      return <HotelMarketingSocialPillars key={key} locale={locale} />;
    case "ads":
      return <HotelMarketingAdFunnel key={key} locale={locale} />;
    case "review":
      return <HotelMarketingReviewLoop key={key} locale={locale} />;
    case "revenue":
      return <HotelMarketingRevenueFlow key={key} locale={locale} />;
    case "channel":
      return <HotelMarketingChannelMap key={key} locale={locale} />;
    case "journey":
      return <HotelGuestDecisionJourney key={key} locale={locale} />;
    case "swimlane":
      return <HotelMarketingRoleSwimlane key={key} locale={locale} />;
    case "roadmap":
      return <HotelMarketingStartRoadmap key={key} locale={locale} />;
    case "kpi": {
      if (!cms.content.metrics.length) return null;
      const note = cms.entries.find((entry) => entry.type === "metrics")?.note;
      return <HotelMarketingKpiMap key={key} locale={locale} cmsMetrics={cms.content.metrics} note={note} />;
    }
    default:
      // "cover" and unknown ids render nothing in the article body.
      return null;
  }
}

function Paragraph({ text, className }: { text: string; className?: string }) {
  return <p className={className}>{emphasizeTerms(text)}</p>;
}

function ArticleBlocks({
  blocks,
  locale,
  takeawayLabel,
  leadText,
  headingIds = [],
  cms,
}: {
  blocks: HandoffBlock[];
  locale: Locale;
  takeawayLabel: string;
  leadText?: string;
  headingIds?: string[];
  cms?: CmsRender;
}) {
  const entryByHeading = new Map<string, HmSectionEntry>();
  const strategyByHeading = new Map<string, HmSectionEntry["strategies"][number]>();
  if (cms) {
    for (const entry of cms.entries) {
      if (entry.heading && !entryByHeading.has(entry.heading)) entryByHeading.set(entry.heading, entry);
      for (const strategy of entry.strategies) strategyByHeading.set(hmStrategyHeading(strategy, cms.lang), strategy);
    }
  }
  /** In CMS mode a heading's role comes from its section type, never from heading wording. */
  const isRole = (text: string, type: HmSectionType, heuristic: (value: string) => boolean) =>
    cms ? entryByHeading.get(text)?.type === type : heuristic(text);
  const cmsVisual = (entry: HmSectionEntry | undefined, key: string): ReactNode =>
    cms ? renderCmsVisual(entry?.visual, key, locale, cms) : null;
  let pendingVisual: ReactNode = null;
  const firstH2 = blocks.findIndex((block) => block.type === "h2");
  const preface = firstH2 === -1 ? blocks : blocks.slice(0, firstH2);
  const rest = firstH2 === -1 ? [] : blocks.slice(firstH2);
  const nodes: ReactNode[] = [];
  let h2Index = 0;

  if (preface.length) {
    const prefaceParagraphs = preface.filter(
      (block): block is HandoffTextBlock & { type: "p" } =>
        block.type === "p" && (!leadText || block.text.trim() !== leadText.trim()),
    );
    if (prefaceParagraphs.length) {
      nodes.push(
        <aside key="takeaway" className="kpi-article-takeaway">
          <p className="kpi-article-takeaway-label">{takeawayLabel}</p>
          {prefaceParagraphs.map((block, index) =>
            isJourneyLine(block.text) ? (
              <JourneyFlow key={`path-${index}`} text={block.text} />
            ) : (
              <Paragraph key={`pre-p-${index}`} text={block.text} />
            ),
          )}
        </aside>,
      );
    }

    preface.forEach((block, index) => {
      if (block.type === "list") {
        const signature = block.items.join("|");
        const duplicatedLater = rest.some(
          (later) => later.type === "list" && later.items.join("|") === signature,
        );
        if (duplicatedLater) return;
        const headingTexts = new Set(
          rest.filter((later): later is HandoffTextBlock & { type: "h2" } => later.type === "h2").map((later) => later.text),
        );
        const looksLikeMiniToc = block.items.every((item) => headingTexts.has(item));
        if (looksLikeMiniToc) return;
        nodes.push(
          <ul key={`pre-list-${index}`}>
            {block.items.map((item) => (
              <li key={item}>{emphasizeTerms(item)}</li>
            ))}
          </ul>,
        );
        return;
      }
      if (block.type !== "table") return;
      nodes.push(
        <div
          key={`pre-table-${index}`}
          className="kpi-article-table-wrap"
          role="region"
          aria-label={block.headers.join(" / ")}
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                {block.headers.map((header) => (
                  <th key={header} scope="col">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${cell}-${cellIndex}`} data-label={block.headers[cellIndex] || undefined}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
    });
  }

  for (let index = 0; index < rest.length; index += 1) {
    const block = rest[index];
    if (block.type === "h2") {
      if (pendingVisual) {
        nodes.push(pendingVisual);
        pendingVisual = null;
      }
      const id = headingIds[h2Index] || insightHeadingId(block.text) || `section-${h2Index + 1}`;
      h2Index += 1;
      const entry = cms ? entryByHeading.get(block.text) : undefined;
      nodes.push(
        <h2 key={`h2-${id}-${index}`} id={id}>
          {block.text}
        </h2>,
      );

      // Sections without a dedicated layout below (custom, strategies intro, ...) get their visual after their copy.
      if (entry && !["definition", "why", "metrics", "compare", "start", "conclusion"].includes(entry.type)) {
        pendingVisual = cmsVisual(entry, `cms-visual-${index}`);
      }

      if (isRole(block.text, "compare", isCompareHeading)) {
        const paragraphs: Array<HandoffTextBlock & { type: "p" }> = [];
        let cursor = index + 1;
        while (cursor < rest.length && rest[cursor].type === "p" && (cms || paragraphs.length < 2)) {
          paragraphs.push(rest[cursor] as HandoffTextBlock & { type: "p" });
          cursor += 1;
        }
        if (paragraphs.length) {
          nodes.push(
            <div key={`compare-${index}`} className="kpi-article-compare">
              {paragraphs.map((paragraph, paragraphIndex) => (
                <Paragraph
                  key={`compare-p-${paragraphIndex}`}
                  text={paragraph.text}
                  className={paragraphIndex === paragraphs.length - 1 ? "kpi-article-compare-join" : undefined}
                />
              ))}
            </div>,
          );
          nodes.push(cms ? cmsVisual(entry, `cms-compare-${index}`) : <HotelMarketingRoleSwimlane key={`role-swim-${index}`} locale={locale} />);
          index = cursor - 1;
          continue;
        }
        if (cms) pendingVisual = cmsVisual(entry, `cms-compare-${index}`);
      }

      if (isRole(block.text, "start", isStartHeading)) {
        let cursor = index + 1;
        while (rest[cursor]?.type === "p" && (cms || cursor === index + 1)) {
          nodes.push(<Paragraph key={`start-intro-${index}-${cursor}`} text={(rest[cursor] as HandoffTextBlock & { type: "p" }).text} />);
          cursor += 1;
        }
        const list = rest[cursor];
        if (list?.type === "list") {
          nodes.push(
            <ul key={`start-list-${index}`} className="kpi-article-checklist">
              {list.items.map((item, itemIndex) => (
                <li key={item}>
                  <span className="kpi-article-checklist-num">{String(itemIndex + 1).padStart(2, "0")}</span>
                  <span>{emphasizeTerms(item)}</span>
                </li>
              ))}
            </ul>,
          );
          nodes.push(cms ? cmsVisual(entry, `cms-start-${index}`) : <HotelMarketingStartRoadmap key={`start-roadmap-${index}`} locale={locale} />);
          index = cursor;
          continue;
        }
        if (cms) {
          pendingVisual = cmsVisual(entry, `cms-start-${index}`);
          index = cursor - 1;
          continue;
        }
      }

      if (isRole(block.text, "conclusion", isSummaryHeading)) {
        const paragraphs: Array<HandoffTextBlock & { type: "p" }> = [];
        let cursor = index + 1;
        while (cursor < rest.length && rest[cursor].type === "p") {
          paragraphs.push(rest[cursor] as HandoffTextBlock & { type: "p" });
          cursor += 1;
        }
        paragraphs.forEach((paragraph, paragraphIndex) => {
          nodes.push(
            <Paragraph
              key={`summary-p-${index}-${paragraphIndex}`}
              text={paragraph.text}
              className={paragraphIndex === 0 ? "kpi-article-summary-lead" : undefined}
            />,
          );
        });
        // CMS: bullets from the conclusion section become the recap points.
        let recapPoints: string[] | undefined;
        if (cms && rest[cursor]?.type === "list") {
          recapPoints = (rest[cursor] as { type: "list"; items: string[] }).items;
          cursor += 1;
        }
        if (cms) nodes.push(cmsVisual(entry, `cms-conclusion-${index}`));
        nodes.push(<HotelMarketingSummaryRecap key={`summary-recap-${index}`} locale={locale} points={recapPoints} />);
        index = cursor - 1;
        continue;
      }

      if (isRole(block.text, "definition", isHotelMarketingDefinitionHeading)) {
        const paragraphs: Array<HandoffTextBlock & { type: "p" }> = [];
        let cursor = index + 1;
        while (cursor < rest.length && rest[cursor].type === "p") {
          paragraphs.push(rest[cursor] as HandoffTextBlock & { type: "p" });
          cursor += 1;
        }
        paragraphs.forEach((paragraph, paragraphIndex) => {
          nodes.push(<Paragraph key={`define-p-${index}-${paragraphIndex}`} text={paragraph.text} />);
        });
        nodes.push(cms ? cmsVisual(entry, `cms-definition-${index}`) : <HotelMarketingChannelMap key={`channel-map-${index}`} locale={locale} />);
        index = cursor - 1;
        continue;
      }

      if (isRole(block.text, "why", isHotelMarketingWhyHeading)) {
        const paragraphs: Array<HandoffTextBlock & { type: "p" }> = [];
        let cursor = index + 1;
        while (cursor < rest.length && rest[cursor].type === "p") {
          paragraphs.push(rest[cursor] as HandoffTextBlock & { type: "p" });
          cursor += 1;
        }
        paragraphs.forEach((paragraph, paragraphIndex) => {
          nodes.push(<Paragraph key={`why-p-${index}-${paragraphIndex}`} text={paragraph.text} />);
        });
        nodes.push(cms ? cmsVisual(entry, `cms-why-${index}`) : <HotelGuestDecisionJourney key={`decision-journey-${index}`} locale={locale} />);
        index = cursor - 1;
        continue;
      }

      if (isRole(block.text, "metrics", isHotelMarketingMetricsHeading)) {
        const paragraphs: Array<HandoffTextBlock & { type: "p" }> = [];
        let cursor = index + 1;
        while (cursor < rest.length && rest[cursor].type === "p") {
          paragraphs.push(rest[cursor] as HandoffTextBlock & { type: "p" });
          cursor += 1;
        }
        paragraphs.forEach((paragraph, paragraphIndex) => {
          // CMS: the Template / Sample Data note is shown inside the KPI map, not as a loose paragraph.
          if (entry?.note && paragraph.text === entry.note) return;
          nodes.push(<Paragraph key={`metrics-p-${index}-${paragraphIndex}`} text={paragraph.text} />);
        });
        // Enhanced KPI map + tables replace the markdown overview table.
        if (rest[cursor]?.type === "table") {
          cursor += 1;
        }
        nodes.push(cms ? cmsVisual(entry, `cms-metrics-${index}`) : <HotelMarketingKpiMap key={`kpi-map-${index}`} locale={locale} />);
        index = cursor - 1;
        continue;
      }
      continue;
    }

    if (block.type === "h3") {
      const cmsStrategy = cms ? strategyByHeading.get(block.text) : undefined;
      const parts = cmsStrategy
        ? { num: cmsStrategy.num, title: hmText(cms?.lang ?? "th", cmsStrategy.title) }
        : strategyParts(block.text);
      const baseId = insightHeadingId(block.text) || `strategy-${index + 1}`;
      const id = parts ? `strategy-${parts.num}-${baseId}`.slice(0, 96) : `${baseId}-${index + 1}`.slice(0, 96);
      if (parts) {
        nodes.push(
          <div key={`strategy-${id}-${index}`} className="kpi-article-strategy" id={id}>
            <p className="kpi-article-strategy-num">{parts.num}</p>
            <h3>{parts.title}</h3>
          </div>,
        );
        const visual = cms
          ? cmsStrategy
            ? renderCmsVisual(cmsStrategy.visual, `strategy-visual-${index}`, locale, cms)
            : null
          : strategyVisual(parts, locale, `strategy-visual-${index}`);
        if (visual) {
          const paragraphs: Array<HandoffTextBlock & { type: "p" }> = [];
          let cursor = index + 1;
          while (cursor < rest.length && rest[cursor].type === "p") {
            paragraphs.push(rest[cursor] as HandoffTextBlock & { type: "p" });
            cursor += 1;
          }
          paragraphs.forEach((paragraph, paragraphIndex) => {
            nodes.push(<Paragraph key={`strategy-p-${index}-${paragraphIndex}`} text={paragraph.text} />);
          });
          nodes.push(visual);
          index = cursor - 1;
        }
      } else {
        nodes.push(
          <h3 key={`h3-${id}-${index}`} id={id}>
            {block.text}
          </h3>,
        );
      }
      continue;
    }

    if (block.type === "p") {
      if (isJourneyLine(block.text)) {
        nodes.push(
          <p key={`path-${index}`} className="kpi-article-path">
            {block.text}
          </p>,
        );
      } else {
        nodes.push(<Paragraph key={`p-${index}`} text={block.text} />);
      }
      continue;
    }

    if (block.type === "image") {
      nodes.push(
        <figure key={block.src} className="kpi-article-figure">
          <img
            src={block.src}
            alt={block.alt || ""}
            width={1200}
            height={750}
            sizes="(max-width: 48rem) 100vw, min(45rem, 100vw)"
            loading="lazy"
            decoding="async"
          />
          {block.alt ? <figcaption className="kpi-article-figure-caption">{block.alt}</figcaption> : null}
        </figure>,
      );
      continue;
    }

    if (block.type === "link") {
      const href = resolvePageHref(block.href, locale);
      if (!href) continue;
      const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
      const isHttp = href.startsWith("http");
      nodes.push(
        external ? (
          <a
            key={`${href}-${index}`}
            href={href}
            className="kpi-article-inline-link"
            {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {block.text}
          </a>
        ) : (
          <Link key={`${href}-${index}`} href={href} className="kpi-article-inline-link">
            {block.text}
          </Link>
        ),
      );
      continue;
    }

    if (block.type === "list") {
      nodes.push(
        <ul key={`list-${index}`}>
          {block.items.map((item) => (
            <li key={item}>{emphasizeTerms(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (block.type === "table") {
      nodes.push(
        <div
          key={`table-${index}`}
          className="kpi-article-table-wrap"
          role="region"
          aria-label={block.headers.join(" / ")}
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                {block.headers.map((header) => (
                  <th key={header} scope="col">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${cell}-${cellIndex}`} data-label={block.headers[cellIndex] || undefined}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
    }
  }

  if (pendingVisual) nodes.push(pendingVisual);

  return <div className="kpi-article-prose">{nodes}</div>;
}

export function InsightArticle({
  post,
  blocks,
  locale = "th",
  marketingCms,
}: {
  post: InsightPost;
  blocks: HandoffBlock[];
  locale?: Locale;
  /** Structured Hotel Marketing CMS content. When set, CMS data drives visuals, related services and CTA copy. */
  marketingCms?: CmsHotelMarketingInsight;
}) {
  const t = insightsIndexCopy[locale];
  const body = insightBody(blocks);
  const related = relatedInsights(post, 4);
  const cmsLang = marketingCms ? hmLang(marketingCms, locale) : "th";
  const cmsRender: CmsRender | undefined = marketingCms
    ? { content: marketingCms, lang: cmsLang, entries: hotelMarketingSectionEntries(marketingCms, cmsLang) }
    : undefined;
  const services =
    marketingCms && marketingCms.relatedServices.length
      ? hotelMarketingRelatedServices(marketingCms, locale)
      : relatedServiceLinks(post.slug, locale);
  const insightsHref = localizePath("/insights", locale);
  const title = post.title[locale] || post.title.th;
  const description = insightExcerpt(post, locale);
  const sources = post.sources?.filter((source) => source.label.trim()) ?? [];
  const readingTimeMinutes =
    (marketingCms?.readingTimeMinutes || 0) || estimateInsightReadingMinutes(body) || post.readingTimeMinutes;
  const cmsCover = marketingCms ? hotelMarketingCoverFields(marketingCms) : null;
  const headerPost = {
    ...post,
    readingTimeMinutes,
    ...(cmsCover
      ? {
          coverImage: cmsCover.coverImage,
          coverImageStatus: cmsCover.coverImageStatus,
          ...(cmsCover.coverImageAlt ? { coverImageAlt: cmsCover.coverImageAlt } : {}),
        }
      : {}),
  };
  const crumbs = [
    { name: t.home, href: homeHref(locale) },
    { name: t.insights, href: insightsHref },
    { name: title, href: post.href },
  ];
  const canonical = `${SITE}${post.href}`;
  const headings = body.filter((block): block is HandoffTextBlock & { type: "h2" } => block.type === "h2");
  const headingIds = buildInsightHeadingIds(headings.map((heading) => heading.text));
  const tocHeadings = headings.map((heading, index) => ({
    id: headingIds[index] || insightHeadingId(heading.text) || `section-${index + 1}`,
    text: heading.text,
  }));
  const showToc = readingTimeMinutes >= 8 || headings.length >= 7;

  return (
    <SiteShell locale={locale} route={post.href}>
      <JsonLd data={articleSchema(post, canonical, locale)} />
      <ArticleReadingProgress />

      <article className="kpi-article" lang={htmlLang(locale)}>
        <div className={showToc ? "kpi-article-shell has-toc" : "kpi-article-shell"}>
          <header className="kpi-article-header">
            <nav aria-label="Breadcrumb" className="kpi-article-crumb">
              <ol>
                {crumbs.map((crumb, index) => (
                  <li key={crumb.href}>
                    {index > 0 ? <span aria-hidden="true"> / </span> : null}
                    {index === crumbs.length - 1 ? (
                      <span>{crumb.name}</span>
                    ) : (
                      <Link href={crumb.href}>{crumb.name}</Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            <p className="kpi-insight-category">{post.category[locale]}</p>
            <h1>{title}</h1>
            <p className="kpi-article-lead">{description}</p>
            <InsightArticleMeta post={headerPost} locale={locale} showPublishedLabel />
          </header>

          <figure className="kpi-article-hero">
            <InsightCover post={headerPost} locale={locale} variant="featured" />
          </figure>

          {showToc ? (
            <ArticleToc
              headings={tocHeadings}
              label={t.toc}
              openLabel={t.tocOpen}
              currentLabel={t.tocCurrent}
            />
          ) : null}

          <div className="kpi-article-main">
            <div className="kpi-article-column">
              <ArticleBlocks
                blocks={body}
                locale={locale}
                takeawayLabel={t.takeaway}
                leadText={description}
                headingIds={headingIds}
                cms={cmsRender}
              />

              {sources.length ? (
                <aside className="kpi-article-services kpi-article-sources">
                  <h2>{t.sources}</h2>
                  <p className="kpi-article-sources-note">{t.sourcesNote}</p>
                  <ul>
                    {sources.map((source) => {
                      const label = insightSourceLabel(source, locale);
                      return (
                        <li key={`${label}-${source.url ?? ""}`}>
                          {source.url ? (
                            <a href={source.url} target="_blank" rel="noopener noreferrer">
                              {label}
                            </a>
                          ) : (
                            label
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </aside>
              ) : null}

              {services.length ? (
                <aside className="kpi-article-services">
                  <h2>{t.services}</h2>
                  <ul className={services.some((item) => item.why) ? "kpi-article-service-cards" : undefined}>
                    {services.map((item) => (
                      <li key={item.href} className={item.why ? "kpi-article-service-card" : undefined}>
                        {item.why ? (
                          <Link href={item.href} className="kpi-article-service-card-link">
                            <span className="kpi-article-service-card-label">{item.label}</span>
                            <span className="kpi-article-service-card-why">{item.why}</span>
                            <span className="kpi-article-service-card-cta">
                              {locale === "th" ? "ดูบริการ" : "View service"}
                              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                          </Link>
                        ) : (
                          <Link href={item.href}>{item.label}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </aside>
              ) : null}

              {marketingCms || post.slug === "hotel-marketing" ? (
                <InsightHotelMarketingEnquiry
                  locale={locale}
                  overrides={
                    marketingCms
                      ? {
                          title: hmText(cmsLang, marketingCms.cta.title),
                          body: hmText(cmsLang, marketingCms.cta.body),
                          buttonLabel: hmText(cmsLang, marketingCms.cta.buttonLabel),
                        }
                      : undefined
                  }
                />
              ) : (
                <aside className="kpi-article-cta">
                  <h2 className="kpi-insight-cta-title">{t.ctaTitle}</h2>
                  <p className="kpi-insight-cta-body">{t.ctaBody}</p>
                  <Link href={auditHref(locale)} className="kpi-button kpi-article-cta-btn">
                    {t.cta}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </aside>
              )}
            </div>
          </div>
        </div>
      </article>

      <section className="kpi-article-related" aria-labelledby="related-insights">
        <div className="kpi-article-related-inner">
          <div className="kpi-article-related-top">
            <h2 id="related-insights">{t.related}</h2>
            <Link href={insightsHref} className="kpi-article-related-all">
              {t.all}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {related.length ? (
            <div className="kpi-article-related-grid">
              {related.map((item) => (
                <InsightRelatedCard key={item.href} post={item} locale={locale} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </SiteShell>
  );
}
