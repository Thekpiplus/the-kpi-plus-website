import Link from "next/link";
import { ClientLogoMarquee } from "@/components/ClientLogoMarquee";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import {
  caseStudies,
  caseStudyDisclaimer,
  caseStudyHeroStats,
} from "@/lib/case-studies";
import { auditHref, localizePath, type Locale } from "@/lib/seo";

const chrome = {
  th: {
    pageTitle: "ผลงานลูกค้า",
    heroEyebrow: "Real Hotel Performance",
    heroHeadline: "Results Measured in Revenue, Not Vanity Metrics.",
    heroDescription:
      "From pricing and distribution to direct-booking campaigns, we focus on measurable commercial performance — including Room Revenue, ADR, Occupancy, RevPAR, Direct Booking Revenue and ROAS.",
    viewGrid: "ดู Case Studies",
    viewStudy: "ดู Case Study",
    clientsLabel: "โรงแรมและธุรกิจที่เราได้ร่วมงานด้วย",
    gridEyebrow: "Case Studies",
    gridTitle: "Measurable commercial results",
    closerEyebrow: "Hotel Performance Review",
    closerTitle: "What Could Your Hotel Be Leaving on the Table?",
    closerBody:
      "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
    primaryCta: "ขอวิเคราะห์ Performance โรงแรม",
    secondaryCta: "คุยกับทีม เดอะ เคพีไอ พลัส",
  },
  en: {
    pageTitle: "Case Studies",
    heroEyebrow: "Real Hotel Performance",
    heroHeadline: "Results Measured in Revenue, Not Vanity Metrics.",
    heroDescription:
      "From pricing and distribution to direct-booking campaigns, we focus on measurable commercial performance — including Room Revenue, ADR, Occupancy, RevPAR, Direct Booking Revenue and ROAS.",
    viewGrid: "View Case Studies",
    viewStudy: "View Case Study",
    clientsLabel: "Hotels and businesses we've worked with",
    gridEyebrow: "Case Studies",
    gridTitle: "Measurable commercial results",
    closerEyebrow: "Hotel Performance Review",
    closerTitle: "What Could Your Hotel Be Leaving on the Table?",
    closerBody:
      "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
    primaryCta: "Request a Hotel Performance Review",
    secondaryCta: "Talk to Our Team",
  },
  ru: {
    pageTitle: "Кейсы",
    heroEyebrow: "Real Hotel Performance",
    heroHeadline: "Results Measured in Revenue, Not Vanity Metrics.",
    heroDescription:
      "From pricing and distribution to direct-booking campaigns, we focus on measurable commercial performance — including Room Revenue, ADR, Occupancy, RevPAR, Direct Booking Revenue and ROAS.",
    viewGrid: "View Case Studies",
    viewStudy: "View Case Study",
    clientsLabel: "Hotels and businesses we've worked with",
    gridEyebrow: "Case Studies",
    gridTitle: "Measurable commercial results",
    closerEyebrow: "Hotel Performance Review",
    closerTitle: "What Could Your Hotel Be Leaving on the Table?",
    closerBody:
      "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
    primaryCta: "Запросить аудит Performance отеля",
    secondaryCta: "Поговорить с командой The KPI Plus",
  },
  zh: {
    pageTitle: "客戶案例",
    heroEyebrow: "Real Hotel Performance",
    heroHeadline: "Results Measured in Revenue, Not Vanity Metrics.",
    heroDescription:
      "From pricing and distribution to direct-booking campaigns, we focus on measurable commercial performance — including Room Revenue, ADR, Occupancy, RevPAR, Direct Booking Revenue and ROAS.",
    viewGrid: "View Case Studies",
    viewStudy: "View Case Study",
    clientsLabel: "Hotels and businesses we've worked with",
    gridEyebrow: "Case Studies",
    gridTitle: "Measurable commercial results",
    closerEyebrow: "Hotel Performance Review",
    closerTitle: "What Could Your Hotel Be Leaving on the Table?",
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

export function CaseStudiesView({ locale }: { locale: Locale }) {
  const t = chrome[locale];
  const audit = auditHref(locale);
  const contact = localizePath("/contact", locale);
  const indexHref = localizePath("/case-studies", locale);

  return (
    <SiteShell locale={locale} route={indexHref}>
      <PageHero>
        <p className="kpi-kicker text-[#F2F8E2]">{t.heroEyebrow}</p>
        <h1 className="kpi-h1 mt-4">{t.heroHeadline}</h1>
        <p className="kpi-lead mt-5 max-w-3xl text-white">{t.heroDescription}</p>
        <div className="kpi-cs-hero-stats kpi-latin mt-10">
          {caseStudyHeroStats.map((stat) => (
            <div key={stat.label} className="kpi-cs-hero-stat">
              <p className="kpi-cs-stat-value text-[#E6E81F]">{stat.value}</p>
              <p className="mt-2 text-sm font-semibold text-white">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="kpi-actions">
          <a href="#case-studies" className="kpi-button">
            {t.viewGrid}
          </a>
          <Link href={audit} className="kpi-button-ghost">
            {t.primaryCta}
          </Link>
        </div>
      </PageHero>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section pb-0">
          <p className="kpi-kicker text-[#0B6660]">{t.clientsLabel}</p>
        </div>
        <ClientLogoMarquee label={t.clientsLabel} className="mt-6 mb-10" />
      </section>

      <section id="case-studies" className="kpi-section scroll-mt-28">
        <p className="kpi-kicker text-[#0B6660]">{t.gridEyebrow}</p>
        <h2 className="kpi-h2 mt-4">{t.gridTitle}</h2>
        <div className="kpi-grid-2 mt-10">
          {caseStudies.map((study) => (
            <article key={study.slug} className="kpi-cs-card flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <span className="kpi-latin text-sm font-black tracking-[.16em] text-[#0B6660]">{study.number}</span>
                <span className="text-right text-xs font-bold uppercase tracking-[.08em] text-[#0B6660]">
                  {study.category}
                </span>
              </div>
              <p className="mt-6 text-sm font-semibold text-[#3B3B3B]">
                {study.location}
                <span className="mx-2 text-[#0B6660]">·</span>
                {study.propertyType}
              </p>
              <p className="kpi-latin mt-5 text-3xl font-extrabold tracking-[-.04em] text-[#0B1F33] sm:text-4xl">
                {study.mainResult}
              </p>
              <p className="mt-3 text-sm font-semibold text-[#0B6660]">{study.supportingResult}</p>
              <p className="mt-5 flex-1 text-base leading-7 text-[#555555]">{study.cardDescription}</p>
              <Link
                href={localizePath(`/case-studies/${study.slug}`, locale)}
                className="mt-8 inline-flex text-sm font-semibold text-[#0B6660]"
              >
                {t.viewStudy}
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-sm leading-7 text-[#555555]">{caseStudyDisclaimer}</p>
      </section>

      <section className="bg-[#0B1F33] text-white">
        <div className="kpi-section">
          <p className="kpi-kicker text-[#F2F8E2]">{t.closerEyebrow}</p>
          <h2 className="kpi-h2 mt-4 text-white">{t.closerTitle}</h2>
          <p className="kpi-lead mt-5 max-w-3xl text-white">{t.closerBody}</p>
          <div className="kpi-actions">
            <Link href={audit} className="kpi-button">
              {t.primaryCta}
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
