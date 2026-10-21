"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Earth, Mail, MapPin, Phone } from "@/components/Icons";
import { AUDIT_CONTACTS } from "@/lib/audit";
import { locales, uiCopy, visibleSolutionGroups } from "@/lib/nav";
import { PRIVACY_CONTACT } from "@/lib/privacy";
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
const OFFICE_MAPS_HREF =
  "https://www.google.com/maps/search/?api=1&query=58%2F15%20E%20Chaofah%20Rd%2C%20Talat%20Nuea%2C%20Mueang%20Phuket%2C%20Phuket%2083000";
const SECOND_PHONE_DISPLAY = "+66 62 635 6646";
const SECOND_PHONE_HREF = "tel:+66626356646";
const FACEBOOK_HREF = "https://www.facebook.com/thekpiplus/";
const INSTAGRAM_HREF = "https://www.instagram.com/thekpiplus/";
const LINKEDIN_HREF = "https://www.linkedin.com/company/thekpiplus/";
const TIKTOK_HREF = "https://www.tiktok.com/@thekpiplus";

function existingNav(items: readonly { href: string; label: string }[], locale: Locale) {
  return items.flatMap((item) => {
    const href = existingHref(item.href, locale);
    return href ? [{ href, label: item.label }] : [];
  });
}

function channelLabel(network: string, locale: Locale) {
  const brand = brandName(locale);
  if (locale === "th") return `${network} ของ ${brand}`;
  if (locale === "zh") return `${brand} 的 ${network}`;
  if (locale === "ru") return `${network}: ${brand}`;
  return `${brand} on ${network}`;
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="kpi-footer-heading kpi-thai-nav">{children}</h2>;
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="kpi-footer-link kpi-thai-nav">
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

export function Footer({ extraLinks = [] }: { extraLinks?: { href: string; label: string }[] }) {
  const pathname = usePathname() || "/";
  const locale = localeFromPath(pathname);
  const t = uiCopy(locale);
  const year = new Date().getFullYear();
  const groups = visibleSolutionGroups(locale);
  const solutionsHref = solutionsIndexHref(locale);
  const privacyHref = existingHref("/privacy", locale);
  const cookiesHref = existingHref("/cookies", locale);
  const contactHref = existingHref("/contact", locale);
  const isAbout = barePath(pathname) === "/about-us";
  const primaryPaths = new Set(["/approach", "/insights", "/case-studies", "/about-us", "/contact"]);
  const mainLinks = existingNav(
    [
      { href: "/approach", label: t.approach },
      { href: "/insights", label: t.insights },
      { href: "/case-studies", label: t.caseStudies },
      { href: "/about-us", label: t.about },
      { href: "/contact", label: t.contact },
    ],
    locale,
  );
  const extraKnow = existingNav(
    t.knowLinks.filter((item) => !primaryPaths.has(item.href)),
    locale,
  );
  const companyLinks = [...mainLinks, ...extraKnow, ...extraLinks];

  return (
    <footer lang={htmlLang(locale)} className={isAbout ? "kpi-footer kpi-footer--about" : "kpi-footer"}>
      <div className="kpi-section">
        <div className="kpi-footer-top">
          <section className="kpi-footer-brand">
            <Link
              href={homeHref(locale)}
              aria-label={locale === "th" ? `${brandName(locale)} หน้าแรก` : `${brandName(locale)} home`}
              className="kpi-footer-brand-mark"
            >
              <img
                src="/brand/KPIPlus_Horizontal_FullColor-Reverse.svg"
                alt={brandName(locale)}
                className="object-contain object-left"
              />
            </Link>
            <p className="kpi-footer-statement kpi-thai-nav">{t.statement}</p>
            <Link data-track="footer_audit_cta" href={auditHref(locale)} className="kpi-button kpi-thai-nav">
              {t.audit} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <nav className="kpi-footer-socials" aria-label={t.follow}>
              <a
                href={FACEBOOK_HREF}
                target="_blank"
                rel="noreferrer"
                data-track="footer_facebook_click"
                className="kpi-footer-channel"
                aria-label={channelLabel("Facebook", locale)}
              >
                <img src="/brand/meta/facebook.svg" alt="" width={26} height={26} />
              </a>
              <a
                href={INSTAGRAM_HREF}
                target="_blank"
                rel="noreferrer"
                data-track="footer_instagram_click"
                className="kpi-footer-channel"
                aria-label={channelLabel("Instagram", locale)}
              >
                <img src="/brand/meta/instagram.svg" alt="" width={26} height={26} />
              </a>
              <a
                href={LINKEDIN_HREF}
                target="_blank"
                rel="noreferrer"
                data-track="footer_linkedin_click"
                className="kpi-footer-channel"
                aria-label={channelLabel("LinkedIn", locale)}
              >
                <img src="/brand/linkedin/linkedin.svg" alt="" width={26} height={26} />
              </a>
              <a
                href={TIKTOK_HREF}
                target="_blank"
                rel="noreferrer"
                data-track="footer_tiktok_click"
                className="kpi-footer-channel"
                aria-label={channelLabel("TikTok", locale)}
              >
                <img src="/brand/tiktok/tiktok.svg" alt="" width={26} height={26} />
              </a>
            </nav>
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
                    <FooterLink key={item.href} href={item.href}>
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

            <section className="kpi-footer-column" aria-label={t.contactTitle}>
              <FooterHeading>{t.contactTitle}</FooterHeading>
              <div className="kpi-footer-contact">
                <a
                  href={OFFICE_MAPS_HREF}
                  target="_blank"
                  rel="noreferrer"
                  className="kpi-footer-contact-row"
                  aria-label={`${t.officeLabel}: ${t.address}`}
                >
                  <MapPin aria-hidden="true" />
                  <span>
                    <span className="kpi-footer-contact-label">{t.officeLabel}</span>
                    <span className="kpi-footer-address">{t.address}</span>
                  </span>
                </a>
                <a
                  href={`mailto:${AUDIT_CONTACTS.email}`}
                  className="kpi-footer-contact-row"
                  aria-label={`Email ${AUDIT_CONTACTS.email}`}
                >
                  <Mail aria-hidden="true" />
                  <span className="kpi-latin">{AUDIT_CONTACTS.email}</span>
                </a>
                <a
                  href={AUDIT_CONTACTS.phoneHref}
                  className="kpi-footer-contact-row"
                  aria-label={`${locale === "th" ? "โทร" : "Phone"} ${AUDIT_CONTACTS.phoneDisplay}`}
                >
                  <Phone aria-hidden="true" />
                  <span className="kpi-latin">{AUDIT_CONTACTS.phoneDisplay}</span>
                </a>
                <a
                  href={SECOND_PHONE_HREF}
                  className="kpi-footer-contact-row"
                  aria-label={`${locale === "th" ? "โทร" : "Phone"} ${SECOND_PHONE_DISPLAY}`}
                >
                  <Phone aria-hidden="true" />
                  <span className="kpi-latin">{SECOND_PHONE_DISPLAY}</span>
                </a>
                <p className="kpi-footer-contact-channels">
                  <a
                    href={PRIVACY_CONTACT.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    data-track="footer_whatsapp_click"
                    className="kpi-footer-channel"
                    aria-label={channelLabel("WhatsApp", locale)}
                  >
                    <img src="/brand/meta/whatsapp.svg" alt="" width={26} height={26} />
                  </a>
                  <a
                    href={PRIVACY_CONTACT.line}
                    target="_blank"
                    rel="noreferrer"
                    data-track="footer_line_click"
                    className="kpi-footer-channel"
                    aria-label={channelLabel("LINE", locale)}
                  >
                    <img src="/brand/line/line.svg" alt="" width={26} height={26} />
                  </a>
                </p>
                {contactHref ? <FooterMore href={contactHref}>{t.contact}</FooterMore> : null}
              </div>
            </section>
          </div>
        </div>

        <div className="kpi-footer-legal">
          <p className="kpi-footer-copy">
            <span>{`© ${year} ${legalName(locale)}`}</span>
            <span className="kpi-footer-copy-sep" aria-hidden="true">
              ·
            </span>
            <span className="kpi-latin">Tax ID 0835564008629</span>
          </p>
          <div className="kpi-footer-legal-links">
            {privacyHref ? <Link href={privacyHref}>{t.privacy}</Link> : null}
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
