import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { LangSync } from "@/components/LangSync";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { PageFaqs } from "@/components/PageFaqs";
import { cmsFooterLinks, cmsHeaderLinks } from "@/lib/cms/files";
import { isCmsPageLive, storedPageByPath } from "@/lib/cms/public";
import { faqsForRoute, howToStepsForRoute } from "@/lib/faqs";
import { hasOwnBreadcrumbs, pageKind } from "@/lib/page-types";
import {
  breadcrumbSchema,
  crumbsFor,
  faqSchema,
  howToSchema,
  localBusinessSchema,
  organizationSchema,
  serviceSchema,
  webPageSchema,
  webSiteSchema,
} from "@/lib/schema";
import { brandName, htmlLang, pageByRoute, type Locale } from "@/lib/seo";

export async function SiteShell({
  locale,
  route,
  children,
  title: titleOverride,
  description: descriptionOverride,
}: {
  locale: Locale;
  route: string;
  children: ReactNode;
  title?: string;
  description?: string;
}) {
  const stored = await storedPageByPath(route);
  if (stored && !isCmsPageLive(stored)) notFound();

  const page = pageByRoute.get(route);
  const cmsLive = stored && isCmsPageLive(stored) ? stored : null;
  const title = titleOverride || cmsLive?.seoTitle || cmsLive?.title || page?.title || brandName(locale);
  const description =
    descriptionOverride || cmsLive?.metaDescription || cmsLive?.excerpt || page?.description || "";
  const canonical =
    cmsLive?.canonical || page?.canonical || `https://thekpiplus.com${route === "/" ? "" : route}`;
  const kind = pageKind(route);
  // Article FAQs belong in the article itself when written for that post — not via shared SiteShell append.
  const faqs = kind === "article" ? [] : faqsForRoute(route);
  const faqJson = faqSchema(faqs);
  const crumbs = crumbsFor(route, locale, title);
  const howToSteps = howToStepsForRoute(route);
  const extraHeader = cmsHeaderLinks(locale);
  const extraFooter = cmsFooterLinks(locale);

  return (
    <div lang={htmlLang(locale)} className="contents kpi-public">
      <LangSync locale={locale} />
      <JsonLd data={organizationSchema(locale)} />
      <JsonLd data={webSiteSchema(locale)} />
      {kind === "home" || kind === "contact" ? <JsonLd data={localBusinessSchema(locale)} /> : null}
      {page || titleOverride ? <JsonLd data={webPageSchema({ route, title, description, canonical, locale })} /> : null}
      {crumbs.length > 1 ? <JsonLd data={breadcrumbSchema(crumbs)} /> : null}
      {faqJson ? <JsonLd data={faqJson} /> : null}
      {kind === "solution" && page ? (
        <JsonLd data={serviceSchema({ name: title.split("|")[0].trim(), description, canonical })} />
      ) : null}
      {kind === "tool" && howToSteps.length ? (
        <JsonLd data={howToSchema({ name: title.split("|")[0].trim(), description, steps: howToSteps })} />
      ) : null}
      <div className={`kpi-shell ${locale === "th" ? "kpi-locale-th" : "kpi-locale-latin"}`}>
        <Header extraLinks={extraHeader} />
        <main>
          {!hasOwnBreadcrumbs(route) && crumbs.length > 1 ? <PageBreadcrumbs items={crumbs} /> : null}
          {children}
          <PageFaqs items={faqs} locale={locale} />
        </main>
        <Footer extraLinks={extraFooter} />
        <CookieConsent />
      </div>
    </div>
  );
}
