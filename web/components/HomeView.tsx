import Link from "next/link";
import { ArrowUpRight, InsightIcon, OpportunityIcon, OptimizeIcon, PlanIcon } from "@/components/Icons";
import { AuditSectionHost } from "@/components/AuditSection";
import { SiteShell } from "@/components/SiteShell";
import { getStoredInsightOrder, resolveInsightOrder, sortByInsightOrder } from "@/lib/cms/insight-order";
import { cmsInsightPosts } from "@/lib/cms/public";
import { hiddenInsightSlugs } from "@/lib/cms/queries";
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
const pillarOutputs = {
  th: [
    "ปฏิทินรายได้ Occupancy forecast และคำแนะนำราคา",
    "รายงานช่องทางจอง แคมเปญ และผลการจองตรง",
    "รายงานระบบ งานหลังบ้าน และแผนพัฒนาทีม",
  ],
  en: [
    "Revenue calendar and pricing recommendations",
    "Campaign and direct booking performance report",
    "Systems, operations, and team development report",
  ],
} as const;

function PillarPreview({ index, sampleLabel }: { index: number; sampleLabel: string }) {
  if (index === 0) {
    return (
      <div className="kpi-home-pillar-preview">
        <span className="kpi-home-pillar-sample">{sampleLabel}</span>
        <div className="kpi-home-pillar-cal" aria-hidden="true">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, dayIndex) => (
            <span
              key={`${day}-${dayIndex}`}
              className={`kpi-home-pillar-cal-cell${dayIndex === 3 ? " is-accent" : ""}`}
              style={{ ["--kpi-cal-fill" as string]: `${[42, 55, 63, 78, 70, 48, 36][dayIndex]}%` }}
            >
              {day}
            </span>
          ))}
        </div>
        <div className="kpi-home-pillar-kpis" aria-hidden="true">
          <div>
            <span>Occ. forecast</span>
            <strong className="kpi-latin">72%</strong>
          </div>
          <div className="is-up">
            <span>RevPAR trend</span>
            <strong className="kpi-latin">Up</strong>
          </div>
          <div>
            <span>Pricing</span>
            <strong>Review</strong>
          </div>
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="kpi-home-pillar-preview">
        <span className="kpi-home-pillar-sample">{sampleLabel}</span>
        <div className="kpi-home-pillar-funnel" aria-hidden="true">
          <span style={{ width: "100%" }}>Visit</span>
          <span style={{ width: "68%" }}>Enquiry</span>
          <span className="is-accent" style={{ width: "34%" }}>
            Direct book
          </span>
        </div>
        <div className="kpi-home-pillar-kpis" aria-hidden="true">
          <div>
            <span>Direct</span>
            <strong className="kpi-latin">31%</strong>
          </div>
          <div>
            <span>OTA mix</span>
            <strong className="kpi-latin">54%</strong>
          </div>
          <div className="is-up">
            <span>Conv.</span>
            <strong className="kpi-latin">Up</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kpi-home-pillar-preview">
      <span className="kpi-home-pillar-sample">{sampleLabel}</span>
      <div className="kpi-home-pillar-ops" aria-hidden="true">
        {[
          ["Systems", 72],
          ["Workflow", 58],
          ["Team", 64],
        ].map(([label, value]) => (
          <div key={label} className="kpi-home-pillar-ops-row">
            <span>{label}</span>
            <span className="kpi-home-pillar-ops-track">
              <span className="kpi-home-pillar-ops-fill" style={{ width: `${value}%` }} />
            </span>
          </div>
        ))}
      </div>
      <div className="kpi-home-pillar-kpis" aria-hidden="true">
        <div>
          <span>Manual work</span>
          <strong>Review</strong>
        </div>
        <div className="is-up">
          <span>Reporting</span>
          <strong>Ready</strong>
        </div>
        <div>
          <span>Training</span>
          <strong>Plan</strong>
        </div>
      </div>
    </div>
  );
}
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

const heroTrust = [
  "100+ Hotels Managed",
  "Revenue · OTA · Digital",
  "Hospitality Focused Team",
  "Based in Phuket",
] as const;

export async function HomeView({ locale }: { locale: Locale }) {
  const t = homeCopy[locale];
  const insightsUi = insightsIndexCopy[locale];
  const solutionsHref = localizePath("/solutions", locale);
  const insightsHref = localizePath("/insights", locale);
  const audit = auditHref(locale);
  const hidden = new Set(await hiddenInsightSlugs());
  const extraPosts = await cmsInsightPosts().catch(() => []);
  const bySlug = new Map(insightPosts.map((post) => [post.slug, post]));
  for (const post of extraPosts) bySlug.set(post.slug, post);
  const visible = [...bySlug.values()].filter(
    (post) => existingHref(post.href, locale) && !hidden.has(post.slug),
  );
  const storedOrder = await getStoredInsightOrder();
  const ordered =
    storedOrder.length > 0
      ? sortByInsightOrder(visible, await resolveInsightOrder(visible.map((post) => post.slug)))
      : [...visible].sort((a, b) => b.published.localeCompare(a.published));
  const featuredInsights = ordered.slice(0, 3);

  return (
    <SiteShell locale={locale} route={locale === "th" ? "/" : `/${locale}`}>
      <section className="kpi-hero kpi-home-hero-section kpi-home-landing-hero" aria-label={t.heroAlt}>
        <div className="kpi-wrap kpi-home-hero">
          <div className="kpi-home-hero-copy">
            <p className="kpi-home-eyebrow kpi-latin">{t.kicker}</p>
            <h1 className="kpi-h1 kpi-home-h1">
              <span className="kpi-home-h1-line">{t.h1a}</span>
              <span className="kpi-home-h1-line">{t.h1b}</span>
              <span className="kpi-home-h1-line kpi-home-accent">{t.h1c}</span>
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
          </div>
          <figure className="kpi-home-hero-visual">
            {/* TODO: replace with a real hotel photograph of a team reviewing rates or a performance report. Current file is a styled placeholder, not a client shoot. */}
            <div className="kpi-home-photo kpi-home-frame">
              <img
                src="/media/kpi-plus-hero-header-homepage_e8b808be.jpg"
                alt={t.heroAlt}
                width={1600}
                height={1200}
              />
            </div>
            <figcaption className="kpi-home-hero-caption">
              {locale === "th" ? "ตัวอย่างข้อมูล · Performance Review: Jan–Jun 2026" : "Sample data · Performance Review: Jan–Jun 2026"}
            </figcaption>
            <ul className="kpi-home-hero-samples" aria-label={locale === "th" ? "ตัวอย่างข้อมูล" : "Sample data"}>
              <li className="kpi-home-hero-sample">
                <span className="kpi-home-hero-sample-name kpi-latin">Occupancy</span>
                <strong className="kpi-home-hero-sample-value kpi-latin">82.4%</strong>
              </li>
              <li className="kpi-home-hero-sample">
                <span className="kpi-home-hero-sample-name kpi-latin">RevPAR</span>
                <strong className="kpi-home-hero-sample-value kpi-latin">+18.6%</strong>
              </li>
            </ul>
          </figure>
        </div>
      </section>

      <section className="kpi-home-trustbar" aria-label={locale === "th" ? "จุดยืนของ The KPI Plus" : "The KPI Plus at a glance"}>
        <div className="kpi-wrap">
          <ul className="kpi-home-trustbar-list">
            {heroTrust.map((item) => (
              <li key={item} className="kpi-home-trustbar-item">
                <span className="kpi-home-trustbar-mark" aria-hidden="true" />
                <span className="kpi-home-trustbar-label kpi-latin">{item}</span>
              </li>
            ))}
          </ul>
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
        <div className="kpi-home-problems-layout">
          <div className="kpi-home-problems-intro">
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
          </div>

          <aside className="kpi-home-opportunity" aria-label={locale === "th" ? "ตัวอย่างรูปแบบการวิเคราะห์" : "Sample analysis format"}>
            <p className="kpi-home-opportunity-badge">{locale === "th" ? "ตัวอย่างข้อมูล" : "Sample data"}</p>
            <h3 className="kpi-home-opportunity-title">
              {locale === "th" ? "ตัวอย่าง Revenue Opportunity" : "Sample Revenue Opportunity"}
            </h3>
            <p className="kpi-home-opportunity-period kpi-latin">Occupancy forecast · Jan–Jun 2026</p>
            <dl className="kpi-home-opportunity-kpis">
              <div>
                <dt>{locale === "th" ? "Occupancy forecast" : "Occupancy forecast"}</dt>
                <dd className="kpi-latin">72%</dd>
              </div>
              <div className="is-accent">
                <dt>{locale === "th" ? "ราคาเทียบคู่แข่ง" : "Rate vs competitor"}</dt>
                <dd className="kpi-latin">−8%</dd>
              </div>
              <div>
                <dt>{locale === "th" ? "สัดส่วน OTA" : "OTA mix"}</dt>
                <dd className="kpi-latin">61%</dd>
              </div>
            </dl>
            <div
              className="kpi-home-opportunity-chart"
              role="img"
              aria-label={locale === "th" ? "กราฟแนวโน้ม Occupancy เดือนมกราคมถึงมิถุนายน 2026 ข้อมูลตัวอย่าง" : "Sample occupancy trend from January to June 2026"}
            >
              {(
                [
                  ["Jan", 52],
                  ["Feb", 58],
                  ["Mar", 64],
                  ["Apr", 70],
                  ["May", 76],
                  ["Jun", 72],
                ] as const
              ).map(([month, value], index) => (
                <div key={month} className={`kpi-home-opportunity-col${index === 4 ? " is-accent" : ""}`}>
                  <span className="kpi-home-opportunity-bar" style={{ height: `${value}%` }} />
                  <span className="kpi-home-opportunity-month kpi-latin">{month}</span>
                </div>
              ))}
            </div>
            <p className="kpi-home-opportunity-note">
              {locale === "th"
                ? "ก่อนปรับราคาหรือช่องทางขาย ทีมดู Occupancy forecast เทียบราคาคู่แข่งแล้วจึงตัดสินใจว่าควรยกราคาในเดือนที่ Demand สูง หรือลดพึ่งพา OTA"
                : "Before changing a rate or channel, the team reviews the occupancy forecast against competitor rates, then decides whether to lift price in stronger demand months or reduce OTA mix."}
            </p>
          </aside>

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
        </div>
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
                <PillarPreview index={index} sampleLabel={locale === "th" ? "ตัวอย่าง" : "Sample"} />
                <p className="kpi-home-pillar-output">
                  {locale === "th" ? pillarOutputs.th[index] : pillarOutputs.en[index]}
                </p>
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
          <figure className="kpi-home-performance-visual">
            <div className="kpi-home-photo kpi-home-frame">
              <img
                src="/media/kpi-plus-hotel-revenue-tablet_16ce8ace.jpg"
                alt={
                  locale === "th"
                    ? "ผู้บริหารโรงแรมกำลังดูแดชบอร์ดรายได้บนแท็บเล็ตในล็อบบี้"
                    : "Hotel manager reviewing a revenue dashboard on a tablet in a lobby"
                }
                width={1600}
                height={1000}
                loading="lazy"
              />
            </div>
            <figcaption className="kpi-home-performance-caption">
              {locale === "th" ? "ตัวอย่างรูปแบบการวิเคราะห์" : "Sample dashboard"}
            </figcaption>
          </figure>
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
