import Link from "next/link";
import { ClientLogoMarquee } from "@/components/ClientLogoMarquee";
import { SiteShell } from "@/components/SiteShell";
import {
  caseStudies,
  caseStudyDisclaimerFor,
  caseStudyHeroStatsFor,
  localizeCaseStudy,
} from "@/lib/case-studies";
import { auditHref, localizePath, type Locale } from "@/lib/seo";

/** Soft break between Thai phrases for body copy. */
const br = "\u200B";

const chrome = {
  th: {
    pageTitle: "ผลงานลูกค้า",
    heroEyebrow: "ผลลัพธ์โรงแรมจริง",
    heroHeadlineLines: ["วัดผลจากรายได้", "ไม่ใช่ตัวเลขที่ดูดี", "แต่ไม่สร้างผล"] as const,
    heroDescription: `ตั้งแต่การบริหารราคาและช่องทางการขาย${br} ไปจนถึงแคมเปญจองตรง${br} เราโฟกัสผลลัพธ์เชิงพาณิชย์ที่วัดได้${br} เช่น Room Revenue, ADR, Occupancy, RevPAR และ ROAS`,
    viewGrid: "ดูผลงาน",
    viewStudy: "ดูรายละเอียดผลงาน",
    clientsLabelLines: ["โรงแรมและที่พักที่เราเคยร่วมงานด้วย"] as const,
    clientsEyebrow: "โรงแรมและที่พักที่คัดสรร",
    gridEyebrow: "ผลงาน",
    gridTitleLines: ["ผลลัพธ์เชิงพาณิชย์ที่วัดได้"] as const,
    closerEyebrow: "ทบทวน Performance",
    closerTitleLines: [`โรงแรมของคุณ${br}อาจพลาดรายได้ตรงไหนอยู่?`] as const,
    closerBody: `เราทบทวนราคา Distribution Booking Pace${br} และผลการดำเนินงานเชิงพาณิชย์${br} เพื่อหาจุดที่มีโอกาสสร้างรายได้เพิ่ม`,
    primaryCta: "ประเมิน Performance โรงแรม",
    secondaryCta: "คุยกับทีม เดอะ เคพีไอ พลัส",
  },
  en: {
    pageTitle: "Case Studies",
    heroEyebrow: "Real Hotel Performance",
    heroHeadlineLines: ["Results Measured in Revenue, Not Vanity Metrics."] as const,
    heroDescription:
      "From pricing and distribution to direct-booking campaigns, we focus on measurable commercial performance — including Room Revenue, ADR, Occupancy, RevPAR, Direct Booking Revenue and ROAS.",
    viewGrid: "View Case Studies",
    viewStudy: "View Case Study",
    clientsLabelLines: ["Selected hotels and properties we've worked with"] as const,
    clientsEyebrow: "Selected Hotels & Properties",
    gridEyebrow: "Case Studies",
    gridTitleLines: ["Measurable commercial results"] as const,
    closerEyebrow: "Hotel Performance Review",
    closerTitleLines: ["Where Could Your Hotel Be Leaving Revenue on the Table?"] as const,
    closerBody:
      "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
    primaryCta: "Request a Hotel Performance Review",
    secondaryCta: "Talk to Our Team",
  },
  ru: {
    pageTitle: "Кейсы",
    heroEyebrow: "Real Hotel Performance",
    heroHeadlineLines: ["Results Measured in Revenue, Not Vanity Metrics."] as const,
    heroDescription:
      "From pricing and distribution to direct-booking campaigns, we focus on measurable commercial performance — including Room Revenue, ADR, Occupancy, RevPAR, Direct Booking Revenue and ROAS.",
    viewGrid: "View Case Studies",
    viewStudy: "View Case Study",
    clientsLabelLines: ["Selected hotels and properties we've worked with"] as const,
    clientsEyebrow: "Selected Hotels & Properties",
    gridEyebrow: "Case Studies",
    gridTitleLines: ["Measurable commercial results"] as const,
    closerEyebrow: "Hotel Performance Review",
    closerTitleLines: ["Where Could Your Hotel Be Leaving Revenue on the Table?"] as const,
    closerBody:
      "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
    primaryCta: "Запросить аудит Performance отеля",
    secondaryCta: "Поговорить с командой The KPI Plus",
  },
  zh: {
    pageTitle: "客戶案例",
    heroEyebrow: "Real Hotel Performance",
    heroHeadlineLines: ["Results Measured in Revenue, Not Vanity Metrics."] as const,
    heroDescription:
      "From pricing and distribution to direct-booking campaigns, we focus on measurable commercial performance — including Room Revenue, ADR, Occupancy, RevPAR, Direct Booking Revenue and ROAS.",
    viewGrid: "View Case Studies",
    viewStudy: "View Case Study",
    clientsLabelLines: ["Selected hotels and properties we've worked with"] as const,
    clientsEyebrow: "Selected Hotels & Properties",
    gridEyebrow: "Case Studies",
    gridTitleLines: ["Measurable commercial results"] as const,
    closerEyebrow: "Hotel Performance Review",
    closerTitleLines: ["Where Could Your Hotel Be Leaving Revenue on the Table?"] as const,
    closerBody:
      "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
    primaryCta: "申請飯店 Performance 分析",
    secondaryCta: "與 The KPI Plus 團隊談談",
  },
} as const;

export const caseStudiesHeading = {
  th: chrome.th.pageTitle,
  en: chrome.en.pageTitle,
  ru: chrome.ru.pageTitle,
  zh: chrome.zh.pageTitle,
} as const;

function PrimaryCtaLabel({ locale, fallback }: { locale: Locale; fallback: string }) {
  if (locale !== "th") return <>{fallback}</>;
  return (
    <>
      ประเมิน <span className="kpi-latin">Performance</span> โรงแรม
    </>
  );
}

function StackedLines({
  lines,
  stacked,
}: {
  lines: readonly string[];
  stacked: boolean;
}) {
  if (!stacked || lines.length === 1) return <>{lines.join(" ")}</>;
  return (
    <>
      {lines.map((line) => (
        <span key={line} className="kpi-cs-line">
          {line}
        </span>
      ))}
    </>
  );
}

export function CaseStudiesView({ locale }: { locale: Locale }) {
  const t = chrome[locale];
  const audit = auditHref(locale);
  const contact = localizePath("/contact-us", locale);
  const indexHref = localizePath("/case-studies", locale);
  const localizedStudies = caseStudies.map((study) => localizeCaseStudy(study, locale));
  const [featured, ...supporting] = localizedStudies;
  const heroStats = caseStudyHeroStatsFor(locale);
  const disclaimer = caseStudyDisclaimerFor(locale);
  const stackTh = locale === "th";
  const clientsLabel = t.clientsLabelLines.join(" ");

  return (
    <SiteShell locale={locale} route={indexHref}>
      <section className="kpi-hero kpi-home-hero-section kpi-cs-hero">
        <div className="kpi-wrap">
          <p className={`kpi-home-eyebrow${locale === "th" ? "" : " kpi-latin"}`}>{t.heroEyebrow}</p>
          <h1 className="kpi-h1 kpi-home-h1 kpi-cs-hero-title">
            <StackedLines lines={t.heroHeadlineLines} stacked={stackTh} />
          </h1>
          <p className="kpi-lead kpi-home-lead kpi-cs-hero-lead">{t.heroDescription}</p>
          <div className="kpi-cs-hero-stats" aria-label={locale === "th" ? "ไฮไลต์ผลลัพธ์" : "Performance highlights"}>
            {heroStats.map((stat, index) => (
              <div
                key={`${stat.value}-${stat.label}`}
                className={`kpi-cs-hero-stat${index === 0 ? " is-primary" : ""}`}
              >
                <p className="kpi-cs-stat-value kpi-latin">{stat.value}</p>
                <p className={`kpi-cs-stat-label${/[A-Za-z]/.test(stat.label) ? " kpi-latin" : ""}`}>{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="kpi-actions kpi-cs-hero-actions">
            <a href="#case-studies" className="kpi-button">
              {t.viewGrid} <span aria-hidden="true">↗</span>
            </a>
            <Link href={audit} className="kpi-button-ghost">
              <PrimaryCtaLabel locale={locale} fallback={t.primaryCta} />
            </Link>
          </div>
        </div>
      </section>

      <section className="kpi-cs-logos border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section pb-0">
          <p className={`kpi-cs-logos-eyebrow${locale === "th" ? "" : " kpi-latin"}`}>{t.clientsEyebrow}</p>
          <h2 className="kpi-cs-logos-title">
            <StackedLines lines={t.clientsLabelLines} stacked={stackTh} />
          </h2>
        </div>
        <ClientLogoMarquee label={clientsLabel} className="kpi-cs-marquee mt-5 mb-10" />
      </section>

      <section id="case-studies" className="kpi-section kpi-cs-grid scroll-mt-28">
        <p className={`kpi-cs-grid-eyebrow${locale === "th" ? "" : " kpi-latin"}`}>{t.gridEyebrow}</p>
        <h2 className="kpi-h2">
          <StackedLines lines={t.gridTitleLines} stacked={stackTh} />
        </h2>
        <div className="kpi-cs-layout">
          {featured ? (
            <article className="kpi-cs-featured">
              <div className="kpi-cs-meta">
                <span className="kpi-latin kpi-cs-num">{featured.number}</span>
                <span className="kpi-latin kpi-cs-category">{featured.category}</span>
              </div>
              <p className="kpi-cs-place">
                {featured.location}
                <span aria-hidden="true"> · </span>
                {featured.propertyType}
              </p>
              <div className="kpi-cs-featured-metric">
                <p className="kpi-latin kpi-cs-result is-featured">{featured.mainResult}</p>
                <p className="kpi-cs-support">{featured.supportingResult}</p>
              </div>
              <div className="kpi-cs-featured-copy">
                <p className="kpi-cs-desc">{featured.cardDescription}</p>
                <Link
                  href={localizePath(`/case-studies/${featured.slug}`, locale)}
                  className="kpi-cs-study-cta"
                >
                  {t.viewStudy}
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ) : null}
          <div className="kpi-cs-support-stack">
            {supporting.map((study) => (
              <article key={study.slug} className="kpi-cs-support-item">
                <div className="kpi-cs-meta">
                  <span className="kpi-latin kpi-cs-num">{study.number}</span>
                  <span className="kpi-latin kpi-cs-category">{study.category}</span>
                </div>
                <p className="kpi-cs-place">
                  {study.location}
                  <span aria-hidden="true"> · </span>
                  {study.propertyType}
                </p>
                <p className="kpi-latin kpi-cs-result">{study.mainResult}</p>
                <p className="kpi-cs-support">{study.supportingResult}</p>
                <p className="kpi-cs-desc">{study.cardDescription}</p>
                <Link
                  href={localizePath(`/case-studies/${study.slug}`, locale)}
                  className="kpi-cs-study-cta"
                >
                  {t.viewStudy}
                  <span aria-hidden="true">↗</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
        <p className="kpi-cs-disclaimer">{disclaimer}</p>
      </section>

      <section className="kpi-cs-closer">
        <div className="kpi-section">
          <p className={`kpi-cs-closer-eyebrow${locale === "th" ? "" : " kpi-latin"}`}>{t.closerEyebrow}</p>
          <h2 className="kpi-h2 kpi-cs-closer-title">
            <StackedLines lines={t.closerTitleLines} stacked={stackTh} />
          </h2>
          <p className="kpi-cs-closer-body">{t.closerBody}</p>
          <div className="kpi-actions kpi-cs-closer-actions">
            <Link href={audit} className="kpi-button">
              <PrimaryCtaLabel locale={locale} fallback={t.primaryCta} />
              <span aria-hidden="true">↗</span>
            </Link>
            <Link href={contact} className="kpi-button-ghost">
              {t.secondaryCta}
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
