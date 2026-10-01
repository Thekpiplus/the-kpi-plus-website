import Link from "next/link";
import { ArrowUpRight, InsightIcon, OpportunityIcon, OptimizeIcon, PlanIcon } from "@/components/Icons";
import { AuditSectionHost } from "@/components/AuditSection";
import { SiteShell } from "@/components/SiteShell";
import { insightPosts, insightsIndexCopy } from "@/lib/insights";
import { homeCopy } from "@/lib/localized-ui";
import { auditHref, existingHref, localizePath, type Locale } from "@/lib/seo";

const metrics = [
  ["Revenue", "รายได้รวม"],
  ["ADR", "ราคาขายเฉลี่ย"],
  ["Occupancy", "อัตราการเข้าพัก"],
  ["RevPAR", "รายได้ต่อห้องที่มีขาย"],
  ["ROAS", "ผลตอบแทนจากโฆษณา"],
  ["Direct Booking", "ยอดจองตรง"],
] as const;

const problemTags = [
  "Revenue Growth",
  "OTA Dependency",
  "Demand & Visibility",
  "Marketing ROI",
  "Operational Efficiency",
  "Team Performance",
] as const;

const problemAnchors = [
  "grow-revenue",
  "grow-revenue",
  "grow-demand",
  "grow-demand",
  "grow-capability",
  "grow-capability",
] as const;

const pillarAnchors = ["grow-revenue", "grow-demand", "grow-capability"] as const;
const pillarCats = ["Revenue", "Marketing", "Operations"] as const;
const stepIcons = [InsightIcon, OpportunityIcon, PlanIcon, OptimizeIcon] as const;

const homeInsightCopy = {
  "hotel-revenue-meetings-that-lead-to-decisions": {
    category: "การบริหารรายได้",
    title: "ประชุม Revenue อย่างไร ให้จบด้วย Action ที่ชัดเจน",
  },
  "hotel-marketing": {
    category: "การตลาดโรงแรม",
    title: "8 กลยุทธ์ Hotel Marketing ที่ช่วยเพิ่มยอดจองและรายได้",
  },
  "hotel-technology-adoption-commercial-project": {
    category: "Technology & AI",
    title: "ใช้ Technology และ AI อย่างไร ให้ทีมโรงแรมทำงานดีขึ้นจริง",
  },
} as const;

function insightTitle(title: string) {
  const mark = ["Hotel Marketing", "Technology และ AI", "Revenue"].find((phrase) => title.includes(phrase));
  if (!mark) return title;
  const [before, after] = title.split(mark);
  return (
    <>
      {before}
      <span className="kpi-home-note-em">{mark}</span>
      {after}
    </>
  );
}

const heroTrust = ["100+ Hotels Managed", "Revenue · OTA · Digital", "Hospitality Focused Team"];

export function HomeView({ locale }: { locale: Locale }) {
  const t = homeCopy[locale];
  const insightsUi = insightsIndexCopy[locale];
  const solutionsHref = localizePath("/solutions", locale);
  const insightsHref = localizePath("/insights", locale);
  const audit = auditHref(locale);
  const featuredInsights = insightPosts
    .filter((post) => existingHref(post.href, locale))
    .slice(0, 3);

  return (
    <SiteShell locale={locale} route={locale === "th" ? "/" : `/${locale}`}>
      <section className="kpi-hero kpi-home-hero-section">
        <div className="kpi-wrap kpi-home-hero">
          <div className="kpi-home-hero-copy">
            <p className="kpi-home-eyebrow kpi-latin">{t.kicker}</p>
            <h1 className="kpi-h1 kpi-home-h1">
              <span className="kpi-home-h1-lead">{t.h1a}</span>
              <span className="kpi-home-h1-rest">
                {t.h1b}
                <span className="kpi-home-h1-close kpi-home-accent">{t.h1c}</span>
              </span>
            </h1>
            <p className="kpi-lead kpi-home-lead">{t.lead}</p>
            <div className="kpi-actions">
              <Link href={audit} className="kpi-button">
                {t.audit}
              </Link>
              <Link href={`${solutionsHref}#solutions`} className="kpi-button-ghost">
                {t.allSolutions}
              </Link>
            </div>
            <p className="kpi-home-trust kpi-latin">
              {heroTrust.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </p>
          </div>
          <div className="kpi-hero-visual kpi-home-photo">
            <img src="/media/kpi-plus-thai-hero-performance-corrected_2937c314.jpg" alt={t.heroAlt} />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="kpi-wrap kpi-band-sm">
          <div className="kpi-home-diagnostics">
            {t.cards.map(([title, body], index) => (
              <Link key={title} href={`${solutionsHref}#solutions`} className="kpi-home-diagnostic">
                <span className="kpi-home-diagnostic-num kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                <p className="kpi-home-diagnostic-title">{title}</p>
                <p className="kpi-home-diagnostic-body">{body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="kpi-section kpi-home-problems-section scroll-mt-28">
        <p className="kpi-kicker kpi-home-problem-kicker">{t.problemEyebrow}</p>
        <h2 className="kpi-h2 kpi-home-problem-title">
          {locale === "th" ? (
            <>
              {"เริ่มจากหาสาเหตุที่ทำให้ "}
              <span className="kpi-home-problem-em">รายได้</span>
              <span className="kpi-home-problem-break"> </span>
              {"หรือ "}
              <span className="kpi-home-problem-em">ยอดจอง</span>
              {" ยังไปไม่ถึงเป้าหมาย"}
            </>
          ) : (
            t.problemTitle
          )}
        </h2>
        <p className="kpi-home-problem-lead">{t.problemLead}</p>
        <div className="kpi-home-problems">
          {t.problems.map((problem, index) => (
            <Link
              key={problem}
              href={`${solutionsHref}#${problemAnchors[index]}`}
              className={`kpi-home-problem${index < 2 ? " is-lead" : ""}`}
            >
              <span className="kpi-home-problem-num">{String(index + 1).padStart(2, "0")}</span>
              <span className="kpi-home-problem-copy">
                <span className="kpi-home-problem-q">{problem}</span>
                <span className="kpi-home-problem-tag">{problemTags[index]}</span>
              </span>
            </Link>
          ))}
        </div>
        <Link href={solutionsHref} className="kpi-home-problem-cta">
          {t.allSolutions} <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="bg-white">
        <div className="kpi-section">
          <p className="kpi-home-pillar-kicker">{t.pillarEyebrow}</p>
          <h2 className="kpi-h2 kpi-home-pillar-heading">
            {locale === "th" ? (
              <>
                {"เลือกโฟกัสในจุดที่โรงแรม"}
                <span className="kpi-home-pillar-break"> </span>
                {"ต้องการ"}
                <span className="kpi-home-pillar-em">เติบโต</span>
                {"มากที่สุด"}
              </>
            ) : (
              t.pillarTitle
            )}
          </h2>
          <div className="kpi-home-pillars">
            {t.pillars.map(([num, title, body], index) => (
              <Link
                key={num}
                href={`${solutionsHref}#${pillarAnchors[index]}`}
                className="kpi-home-pillar"
              >
                <span className="kpi-home-pillar-meta kpi-latin">
                  <span>{num}</span>
                  <span className="kpi-home-pillar-sep" aria-hidden="true">
                    /
                  </span>
                  <span>{pillarCats[index]}</span>
                </span>
                <h3>{title}</h3>
                <p className="kpi-home-pillar-body">{body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-[#F4F4F4]">
        <div className="kpi-section">
          <p className="kpi-kicker kpi-home-section-kicker text-[#0B6660]">{t.stepEyebrow}</p>
          <h2 className="kpi-h2 kpi-home-step-heading">
            {locale === "th" ? (
              <>
                {"จากข้อมูล"}
                <span className="kpi-home-step-break"> </span>
                {"สู่การตัดสินใจที่ทีมโรงแรม"}
                <span className="kpi-home-step-em">ลงมือทำได้</span>
              </>
            ) : (
              t.stepTitle
            )}
          </h2>
          <div className="kpi-home-steps">
            {t.steps.map(([num, title, body], index) => {
              const StepIcon = stepIcons[index];
              return (
                <article key={num} className="kpi-home-step">
                  <span className="kpi-home-step-mark">
                    <span className="kpi-home-step-num kpi-latin">{num}</span>
                    <StepIcon className="kpi-home-step-icon" aria-hidden="true" />
                  </span>
                  <h3>{title}</h3>
                  <p className="kpi-home-step-body">{body}</p>
                </article>
              );
            })}
          </div>
          <Link href={audit} className="kpi-button kpi-home-step-cta">
            {t.audit} <ArrowUpRight className="kpi-home-step-arrow" />
          </Link>
        </div>
      </section>

      <section className="kpi-home-performance bg-[#0B1F33] text-white">
        <div className="kpi-section kpi-split">
          <div className="kpi-home-photo kpi-home-frame">
            <img src="/media/the-kpi-plus-revenue-scene_4932d3c7.jpg" alt="Hospitality revenue-management workspace" />
          </div>
          <div className="kpi-home-performance-copy">
            <p className="kpi-home-metric-kicker">{t.metricEyebrow}</p>
            <h2 className="kpi-h2 kpi-home-metric-heading">
              {locale === "th" ? (
                <>
                  {"เราโฟกัสที่ตัวเลข"}
                  <span className="kpi-home-metric-break"> </span>
                  {"ที่มีผลต่อ"}
                  <span className="kpi-home-metric-em">รายได้จริง</span>
                </>
              ) : (
                t.metricTitle
              )}
            </h2>
            <p className="kpi-home-metric-body">{t.metricBody}</p>
            <div className="kpi-home-metrics">
              {metrics.map(([name, label]) => (
                <div key={name} className="kpi-home-metric">
                  <span className="kpi-home-metric-name kpi-latin">{name}</span>
                  {locale === "th" ? <span className="kpi-home-metric-label">{label}</span> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-home-insights">
        <p className="kpi-home-insight-kicker">{t.insightEyebrow}</p>
        <div className="kpi-home-split kpi-home-insight-head">
          <h2 className="kpi-h2 kpi-home-insight-heading">{t.insightTitle}</h2>
          <p className="kpi-home-insight-lead">{t.insightBody}</p>
        </div>
        {featuredInsights.length ? (
          <div className="kpi-home-notes">
            {featuredInsights.map((post, index) => {
              const href = existingHref(post.href, locale) ?? insightsHref;
              const featured = locale === "th" ? homeInsightCopy[post.slug as keyof typeof homeInsightCopy] : undefined;
              const category = featured?.category ?? post.category[locale];
              const title = featured?.title ?? post.title[locale];
              const latinCategory = !/[\u0E00-\u0E7F]/.test(category);
              return (
                <article key={post.slug} className="kpi-home-note">
                  <span className="kpi-home-note-num kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                  <div className="kpi-home-note-copy">
                    <p className={`kpi-home-note-cat${latinCategory ? " kpi-latin" : ""}`}>{category}</p>
                    <h3>
                      <Link href={href}>{insightTitle(title)}</Link>
                    </h3>
                    <Link href={href} className="kpi-home-note-more">
                      {locale === "th" ? "อ่านต่อ" : insightsUi.read}
                      <ArrowUpRight />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="kpi-home-split mt-12">
            <div className="kpi-home-photo kpi-home-frame">
              <img src="/media/the-kpi-plus-insights-scene_8a7e72cb.jpg" alt="Hotel industry research materials" />
            </div>
            <div>
              <Link href={insightsHref} className="kpi-button">
                {t.insightCta} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
        {featuredInsights.length ? (
          <Link href={insightsHref} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#0B6660]">
            {t.insightCta} <ArrowUpRight className="h-4 w-4" />
          </Link>
        ) : null}
      </section>

      <AuditSectionHost locale={locale} />
    </SiteShell>
  );
}
