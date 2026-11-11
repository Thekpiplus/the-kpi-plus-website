import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { InternalBacklinks } from "@/components/InternalBacklinks";
import { PageScroll } from "@/components/PageScroll";
import { JsonLd } from "@/components/JsonLd";
import { LangSync } from "@/components/LangSync";
import { PageFaqs } from "@/components/PageFaqs";
import { cmsFooterLinks, cmsHeaderLinks } from "@/lib/cms/files";
import { getPublicCompany } from "@/lib/company-public";
import { isCmsPageLive, storedPageByPath } from "@/lib/cms/public";
import { parseRevenuePageBody, REVENUE_CMS_TEMPLATE } from "@/lib/cms/revenue-page";
import { parseReservationsPageBody, RESERVATIONS_CMS_TEMPLATE } from "@/lib/cms/reservations-page";
import { parseB2bPageBody, B2B_CMS_TEMPLATE } from "@/lib/cms/b2b-page";
import { parseGoogleAdsPageBody, GOOGLE_ADS_CMS_TEMPLATE } from "@/lib/cms/google-ads-page";
import { parseMetaAdsPageBody, META_ADS_CMS_TEMPLATE } from "@/lib/cms/meta-ads-page";
import { parseHotelSeoPageBody, HOTEL_SEO_CMS_TEMPLATE } from "@/lib/cms/hotel-seo-page";
import { hotelSeoFaqs, hotelSeoFaqsAreStale } from "@/lib/hotel-seo";
import { parseHotelWebsitePageBody, HOTEL_WEBSITE_CMS_TEMPLATE } from "@/lib/cms/hotel-website-page";
import { hotelWebsiteFaqs, hotelWebsiteFaqsAreStale } from "@/lib/hotel-website";
import { parseDirectBookingPageBody, HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE } from "@/lib/cms/hotel-direct-bookings-page";
import { hotelDirectBookingFaqsFromCms } from "@/lib/cms/hotel-direct-bookings-page-public";
import { parseIndependentHotelPageBody, INDEPENDENT_HOTEL_CMS_TEMPLATE } from "@/lib/cms/independent-hotel-page";
import { independentHotelFaqsFromCms } from "@/lib/cms/independent-hotel-page-public";
import { parseHotelSystemsPageBody, HOTEL_SYSTEMS_CMS_TEMPLATE } from "@/lib/cms/hotel-systems-page";
import { hotelSystemsFaqsFromCms } from "@/lib/cms/hotel-systems-page-public";
import { parseHotelAiPageBody, HOTEL_AI_CMS_TEMPLATE } from "@/lib/cms/hotel-ai-page";
import { hotelAiFaqsFromCms } from "@/lib/cms/hotel-ai-page-public";
import { HOTEL_TRAINING_CMS_TEMPLATE, parseHotelTrainingPageBody } from "@/lib/cms/hotel-training-page";
import { hotelTrainingFaqsFromCms } from "@/lib/cms/hotel-training-page-public";
import { SOLUTIONS_INDEX_CMS_TEMPLATE, parseSolutionsIndexPageBody } from "@/lib/cms/solutions-index-page";
import { solutionsIndexFaqsFromCms } from "@/lib/cms/solutions-index-page-public";
import {
  ABOUT_CMS_TEMPLATE,
  aboutFaqsForLocale,
  isAboutCmsBody,
  parseAboutPageBody,
} from "@/lib/cms/about-page";
import {
  CONTACT_CMS_TEMPLATE,
  contactFaqsForLocale,
  isContactCmsBody,
  parseContactPageBody,
} from "@/lib/cms/contact-page";
import { loadCmsFaqsForRoute } from "@/lib/cms/faq-store";
import { faqsForRoute, howToStepsForRoute } from "@/lib/faqs";
import { pageKind } from "@/lib/page-types";
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
  hideFaqs = false,
}: {
  locale: Locale;
  route: string;
  children: ReactNode;
  title?: string;
  description?: string;
  hideFaqs?: boolean;
}) {
  const stored = await storedPageByPath(route);
  const specialTemplate =
    stored?.template === REVENUE_CMS_TEMPLATE ||
    stored?.template === RESERVATIONS_CMS_TEMPLATE ||
    stored?.template === B2B_CMS_TEMPLATE ||
    stored?.template === GOOGLE_ADS_CMS_TEMPLATE ||
    stored?.template === META_ADS_CMS_TEMPLATE ||
    stored?.template === HOTEL_SEO_CMS_TEMPLATE ||
    stored?.template === HOTEL_WEBSITE_CMS_TEMPLATE ||
    stored?.template === HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE ||
    stored?.template === INDEPENDENT_HOTEL_CMS_TEMPLATE ||
    stored?.template === HOTEL_SYSTEMS_CMS_TEMPLATE ||
    stored?.template === HOTEL_AI_CMS_TEMPLATE ||
    stored?.template === HOTEL_TRAINING_CMS_TEMPLATE ||
    stored?.template === SOLUTIONS_INDEX_CMS_TEMPLATE ||
    stored?.template === CONTACT_CMS_TEMPLATE ||
    stored?.template === ABOUT_CMS_TEMPLATE;
  if (stored?.trashedAt) notFound();
  if (stored && !isCmsPageLive(stored) && !specialTemplate) notFound();

  const page = pageByRoute.get(route);
  const cmsLive = stored && isCmsPageLive(stored) ? stored : null;
  const title = titleOverride || cmsLive?.seoTitle || cmsLive?.title || page?.title || brandName(locale);
  const description =
    descriptionOverride || cmsLive?.metaDescription || cmsLive?.excerpt || page?.description || "";
  const canonical =
    cmsLive?.canonical || page?.canonical || `https://thekpiplus.com${route === "/" ? "" : route}`;
  const kind = pageKind(route);
  // Article FAQs belong in the article itself when written for that post — not via shared SiteShell append.
  const cmsFaqs =
    cmsLive?.template === REVENUE_CMS_TEMPLATE
      ? parseRevenuePageBody(cmsLive.body, locale)?.faqs.map(({ q, a }) => ({ q, a }))
      : cmsLive?.template === RESERVATIONS_CMS_TEMPLATE
        ? parseReservationsPageBody(cmsLive.body, locale)?.faqs.map(({ q, a }) => ({ q, a }))
        : cmsLive?.template === B2B_CMS_TEMPLATE
          ? parseB2bPageBody(cmsLive.body, locale)?.faqs.map(({ q, a }) => ({ q, a }))
          : cmsLive?.template === GOOGLE_ADS_CMS_TEMPLATE
            ? parseGoogleAdsPageBody(cmsLive.body, locale)?.faqs.map(({ q, a }) => ({ q, a }))
            : cmsLive?.template === META_ADS_CMS_TEMPLATE
              ? parseMetaAdsPageBody(cmsLive.body, locale)?.faqs.map(({ q, a }) => ({ q, a }))
              : cmsLive?.template === HOTEL_SEO_CMS_TEMPLATE
                ? (() => {
                    const mapped = parseHotelSeoPageBody(cmsLive.body, locale)?.faqs.map(({ q, a }) => ({ q, a })) ?? [];
                    return mapped.length && !hotelSeoFaqsAreStale(mapped)
                      ? mapped
                      : hotelSeoFaqs(locale === "th" ? "th" : "en");
                  })()
                : cmsLive?.template === HOTEL_WEBSITE_CMS_TEMPLATE
                  ? (() => {
                      const mapped = parseHotelWebsitePageBody(cmsLive.body, locale)?.faqs.map(({ q, a }) => ({ q, a })) ?? [];
                      return mapped.length && !hotelWebsiteFaqsAreStale(mapped)
                        ? mapped
                        : hotelWebsiteFaqs(locale === "th" ? "th" : "en");
                    })()
                : cmsLive?.template === HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE
                  ? hotelDirectBookingFaqsFromCms(parseDirectBookingPageBody(cmsLive.body, locale), locale)
                : cmsLive?.template === INDEPENDENT_HOTEL_CMS_TEMPLATE
                  ? independentHotelFaqsFromCms(parseIndependentHotelPageBody(cmsLive.body, locale), locale)
                : cmsLive?.template === HOTEL_SYSTEMS_CMS_TEMPLATE
                  ? hotelSystemsFaqsFromCms(parseHotelSystemsPageBody(cmsLive.body, locale), locale)
                : cmsLive?.template === HOTEL_AI_CMS_TEMPLATE
                  ? hotelAiFaqsFromCms(parseHotelAiPageBody(cmsLive.body, locale), locale)
                : cmsLive?.template === HOTEL_TRAINING_CMS_TEMPLATE
                  ? hotelTrainingFaqsFromCms(parseHotelTrainingPageBody(cmsLive.body, locale), locale)
                : cmsLive?.template === SOLUTIONS_INDEX_CMS_TEMPLATE
                  ? solutionsIndexFaqsFromCms(parseSolutionsIndexPageBody(cmsLive.body, locale), locale)
                : cmsLive?.template === CONTACT_CMS_TEMPLATE && isContactCmsBody(cmsLive.body)
                  ? (() => {
                      const parsed = parseContactPageBody(cmsLive.body);
                      return parsed ? contactFaqsForLocale(parsed, locale) : null;
                    })()
                : cmsLive?.template === ABOUT_CMS_TEMPLATE && isAboutCmsBody(cmsLive.body)
                  ? (() => {
                      const parsed = parseAboutPageBody(cmsLive.body);
                      return parsed ? aboutFaqsForLocale(parsed, locale) : null;
                    })()
              : null;
  const storedFaqs = kind === "article" ? null : await loadCmsFaqsForRoute(route);
  // Prefer FAQs saved on the page editor; fall back to central FAQ CMS, then code defaults.
  const faqs =
    kind === "article"
      ? []
      : cmsFaqs?.length
        ? cmsFaqs
        : storedFaqs !== null
          ? storedFaqs
          : faqsForRoute(route);
  const faqJson = faqSchema(faqs);
  const crumbs = crumbsFor(route, locale, title);
  const howToSteps = howToStepsForRoute(route);
  const extraHeader = cmsHeaderLinks(locale);
  const extraFooter = cmsFooterLinks(locale);
  const company = await getPublicCompany();

  return (
    <div lang={htmlLang(locale)} className="contents kpi-public">
      <LangSync locale={locale} />
      <JsonLd data={organizationSchema(locale, company)} />
      <JsonLd data={webSiteSchema(locale)} />
      {kind === "home" || kind === "contact" ? <JsonLd data={localBusinessSchema(locale, company)} /> : null}
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
        <PageScroll />
        <Header extraLinks={extraHeader} />
        <main>
          {children}
          <InternalBacklinks route={route} locale={locale} />
          {hideFaqs ? null : (
            <PageFaqs
              items={faqs}
              locale={locale}
              sectionId={kind === "solutionsIndex" ? "solutions-faq" : undefined}
            />
          )}
        </main>
        <Footer extraLinks={extraFooter} company={company} />
        <CookieConsent />
      </div>
    </div>
  );
}
