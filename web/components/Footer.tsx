"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ContactCard } from "@/components/ContactCard";
import { ArrowUpRight, Earth } from "@/components/Icons";
import { COMPANY, contactInfoFromCompany, type CompanyContact } from "@/lib/company";
import { enquiryServiceById } from "@/lib/enquiry";
import { locales, uiCopy, visiblePrimaryLinks, visibleSolutionGroups, visibleToolLinks } from "@/lib/nav";
import {
  auditHref,
  barePath,
  existingHref,
  homeHref,
  htmlLang,
  brandName,
  legalName,
  localeFromPath,
  solutionsIndexHref,
  switchLocale,
  type Locale,
} from "@/lib/seo";

const ACADEMY_HREF = "https://thekpiplus.co.th/";

function existingNav(items: readonly { href: string; label: string }[], locale: Locale) {
  return items.flatMap((item) => {
    const href = existingHref(item.href, locale);
    return href ? [{ href, label: item.label }] : [];
  });
}

function isCurrentPath(href: string, path: string) {
  const bare = barePath(href);
  if (bare === path) return true;
  return bare !== "/" && path.startsWith(`${bare}/`);
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="kpi-footer-heading kpi-thai-nav">{children}</h2>;
}

function FooterLink({
  href,
  children,
  current = false,
}: {
  href: string;
  children: React.ReactNode;
  current?: boolean;
}) {
  return (
    <Link href={href} className="kpi-footer-link kpi-thai-nav" aria-current={current ? "page" : undefined}>
      {children}
    </Link>
  );
}

function FooterMore({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="kpi-footer-more kpi-thai-nav">
      {children} <ArrowUpRight className="h-3.5 w-3.5" />
    </Link>
  );
}

export function Footer({
  extraLinks = [],
  company = COMPANY,
}: {
  extraLinks?: { href: string; label: string }[];
  company?: CompanyContact;
}) {
  const pathname = usePathname() || "/";
  const locale = localeFromPath(pathname);
  const t = uiCopy(locale);
  const year = new Date().getFullYear();
  const groups = visibleSolutionGroups(locale);
  const solutionsHref = solutionsIndexHref(locale);
  const privacyHref = existingHref("/privacy", locale);
  const cookiesHref = existingHref("/cookies", locale);
  const termsHref = existingHref("/terms", locale);
  const contactHref = existingHref("/contact-us", locale);
  const path = barePath(pathname);
  const isContact = path === "/contact-us";
  const isMetaAds = path === "/solutions/meta-ads-management";
  const isHotelSeo = path === "/solutions/hotel-seo-google-maps-ai-search";
  const isHotelWebsite = path === "/solutions/hotel-website-design";
  const isDirectBooking = path === "/solutions/hotel-direct-bookings";
  const footerCtaHref = isMetaAds
    ? `${pathname.split("#")[0]}#meta-ads-enquiry`
    : isHotelSeo
      ? `${pathname.split("#")[0]}#search-enquiry`
      : isHotelWebsite
        ? `${pathname.split("#")[0]}#website-enquiry`
        : isDirectBooking
          ? `${pathname.split("#")[0]}#conversion-enquiry`
          : auditHref(locale);
  const footerCtaLabel = isHotelWebsite
    ? enquiryServiceById("website")?.submit[locale] ?? t.audit
    : isDirectBooking
      ? enquiryServiceById("conversion")?.submit[locale] ?? t.audit
      : t.audit;
  const contact = contactInfoFromCompany(company, locale);
  const primaryPaths = new Set(["/approach", "/insights", "/case-studies", "/about-us", "/contact-us"]);
  const mainLinks = visiblePrimaryLinks(locale);
  const extraKnow = existingNav(
    t.knowLinks.filter((item) => !primaryPaths.has(item.href)),
    locale,
  );
  const companyLinks = [...mainLinks, ...extraKnow, ...extraLinks];
  const toolLinks = visibleToolLinks(locale);
  const toolsIndexHref = existingHref("/tools", locale);

  return (
    <footer lang={htmlLang(locale)} className={`kpi-footer${isDirectBooking ? " kpi-footer--conversion" : ""}`}>
      <div className="kpi-section">
        <div className="kpi-footer-top">
          <section className="kpi-footer-brand">
            <div className="kpi-footer-brand-copy">
              <Link
                href={homeHref(locale)}
                aria-label={locale === "th" ? `${brandName(locale)} หน้าแรก` : `${brandName(locale)} home`}
                className="kpi-footer-brand-mark"
              >
                <img
                  src="/brand/KPIPlus_Horizontal_FullColor-Reverse.svg"
                  alt={brandName(locale)}
                  width={2232}
                  height={768}
                  className="object-contain object-left"
                />
              </Link>
              <p className="kpi-footer-statement kpi-thai-nav">{t.statement}</p>
            </div>
            <div className="kpi-footer-brand-actions">
              <Link
                data-track={isDirectBooking ? "footer_conversion_cta" : "footer_audit_cta"}
                href={footerCtaHref}
                className="kpi-button kpi-thai-nav"
              >
                {footerCtaLabel} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <div className="kpi-footer-menus">
            {groups.length ? (
              <section className="kpi-footer-column" aria-label={t.solutions}>
                <FooterHeading>{t.solutions}</FooterHeading>
                <nav className="kpi-footer-links" aria-label={t.solutions}>
                  {groups.map((group) => (
                    <FooterLink key={group.id} href={`${solutionsHref}#${group.id}`}>
                      {group.title}
                    </FooterLink>
                  ))}
                </nav>
                <FooterMore href={solutionsHref}>{t.allSolutions}</FooterMore>
              </section>
            ) : null}

            {companyLinks.length ? (
              <section className="kpi-footer-column" aria-label={t.knowUs}>
                <FooterHeading>{t.knowUs}</FooterHeading>
                <nav className="kpi-footer-links" aria-label={t.knowUs}>
                  {companyLinks.map((item) => (
                    <FooterLink key={item.href} href={item.href} current={isCurrentPath(item.href, path)}>
                      {item.label}
                    </FooterLink>
                  ))}
                  <a
                    href={ACADEMY_HREF}
                    target="_blank"
                    rel="noreferrer"
                    data-track="footer_academy_click"
                    className="kpi-footer-link kpi-thai-nav"
                  >
                    {t.academy}
                  </a>
                </nav>
              </section>
            ) : null}

            {toolLinks.length ? (
              <section className="kpi-footer-column" aria-label={t.tools}>
                <FooterHeading>{t.tools}</FooterHeading>
                <nav className="kpi-footer-links" aria-label={t.tools}>
                  {toolLinks.map((item) => (
                    <FooterLink key={item.href} href={item.href} current={isCurrentPath(item.href, path)}>
                      {item.label}
                    </FooterLink>
                  ))}
                </nav>
                {toolsIndexHref ? <FooterMore href={toolsIndexHref}>{t.allTools}</FooterMore> : null}
              </section>
            ) : null}

            <section className="kpi-footer-column" aria-label={t.contactTitle}>
              <FooterHeading>{t.contactTitle}</FooterHeading>
              <ContactCard locale={locale} variant="footer" contact={contact} showSocials />
              {!isContact && contactHref ? <FooterMore href={contactHref}>{t.contact}</FooterMore> : null}
            </section>
          </div>
        </div>

        <div className="kpi-footer-legal">
          <p className="kpi-footer-copy">
            <span>{`© ${year} ${legalName(locale)}`}</span>
            <span className="kpi-footer-copy-sep" aria-hidden="true">
              ·
            </span>
            <span className="kpi-latin">Tax ID {company.taxId}</span>
          </p>
          <div className="kpi-footer-legal-links">
            {privacyHref ? <Link href={privacyHref}>{t.privacy}</Link> : null}
            {termsHref ? <Link href={termsHref}>{t.terms}</Link> : null}
            {cookiesHref ? <Link href={cookiesHref}>{t.cookies}</Link> : null}
            <button type="button" onClick={() => window.dispatchEvent(new Event("kpi-open-cookie-settings"))}>
              {t.cookieSettings}
            </button>
            <span className="kpi-footer-lang kpi-thai-nav" aria-label={t.language}>
              <span className="kpi-footer-lang-label">
                <Earth className="h-3.5 w-3.5" aria-hidden="true" />
                {t.language}
              </span>
              {locales.map((item) => (
                <Link
                  key={item.id}
                  href={switchLocale(pathname, item.id)}
                  aria-current={item.id === locale ? "true" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
