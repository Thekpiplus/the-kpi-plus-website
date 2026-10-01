"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Earth,
  Facebook,
  LinkedIn,
  Mail,
  MapPin,
  Phone,
} from "@/components/Icons";
import {
  locales,
  uiCopy,
  visibleKnowLinks,
  visibleSolutionGroups,
  visibleToolLinks,
} from "@/lib/nav";
import {
  auditHref,
  existingHref,
  homeHref,
  htmlLang,
  brandName,
  legalName,
  localeFromPath,
  solutionsIndexHref,
  switchLocale,
} from "@/lib/seo";

const ACADEMY_HREF = "https://thekpiplus.co.th/";

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
  const currentLang = locales.find((item) => item.id === locale)?.label ?? "ไทย";
  const groups = visibleSolutionGroups(locale);
  const knowLinks = visibleKnowLinks(locale);
  const toolLinks = visibleToolLinks(locale);
  const solutionsHref = solutionsIndexHref(locale);
  const privacyHref = existingHref("/privacy", locale);
  const cookiesHref = existingHref("/cookies", locale);
  const toolsIndexHref = existingHref("/tools", locale);
  const contactHref = existingHref("/contact", locale);

  return (
    <footer lang={htmlLang(locale)} className="kpi-footer">
      <div className="kpi-section">
        <div className="kpi-footer-top">
          <section className="kpi-footer-brand">
            <Link href={homeHref(locale)} aria-label={locale === "th" ? `${brandName(locale)} หน้าแรก` : `${brandName(locale)} home`} className="kpi-footer-brand-mark">
              <img
                src="/brand/KPIPlus_Horizontal_FullColor.png"
                alt={brandName(locale)}
                className="object-contain object-left"
              />
            </Link>
            <p className="kpi-footer-statement kpi-thai-nav">{t.statement}</p>
            <p className="kpi-footer-description kpi-thai-nav">{t.description}</p>
            <Link data-track="footer_audit_cta" href={auditHref(locale)} className="kpi-button kpi-thai-nav">
              {t.footerAudit} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <div>
              <p className="kpi-footer-follow kpi-thai-nav">{t.follow}</p>
              <div className="kpi-footer-socials">
                <a
                  href="https://www.facebook.com/thekpiplus/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={locale === "th" ? `${brandName(locale)} บน Facebook` : `${brandName(locale)} on Facebook`}
                  data-track="footer_facebook_click"
                  className="kpi-footer-social kpi-footer-social-facebook"
                >
                  <Facebook />
                </a>
                <a
                  href="https://www.linkedin.com/company/thekpiplus/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={locale === "th" ? `${brandName(locale)} บน LinkedIn` : `${brandName(locale)} on LinkedIn`}
                  data-track="footer_linkedin_click"
                  className="kpi-footer-social kpi-footer-social-linkedin"
                >
                  <LinkedIn />
                </a>
              </div>
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

          {knowLinks.length ? (
            <section className="kpi-footer-column" aria-label={t.knowUs}>
              <FooterHeading>{t.knowUs}</FooterHeading>
              <nav className="kpi-footer-links">
                {knowLinks.map((item) => (
                  <FooterLink key={item.href} href={item.href}>
                    {item.label}
                  </FooterLink>
                ))}
                {extraLinks.map((item) => (
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

          {toolLinks.length ? (
            <section className="kpi-footer-column" aria-label={t.tools}>
              <FooterHeading>{t.tools}</FooterHeading>
              <nav className="kpi-footer-links">
                {toolLinks.map((item) => (
                  <FooterLink key={item.href} href={item.href}>
                    {item.label}
                  </FooterLink>
                ))}
              </nav>
              {toolsIndexHref ? <FooterMore href={toolsIndexHref}>{t.allTools}</FooterMore> : null}
            </section>
          ) : null}

          <section className="kpi-footer-column" aria-label={t.contactTitle}>
            <FooterHeading>{t.contactTitle}</FooterHeading>
            <div className="kpi-footer-contact">
              <a
                href="https://www.google.com/maps/search/?api=1&query=58%2F15%20E%20Chaofah%20Rd%2C%20Talat%20Nuea%2C%20Mueang%20Phuket%2C%20Phuket%2083000"
                target="_blank"
                rel="noreferrer"
                className="kpi-footer-contact-row"
              >
                <MapPin />
                <span>
                  <span className="kpi-footer-contact-label">{t.officeLabel}</span>
                  <span className="kpi-footer-address">{t.address}</span>
                </span>
              </a>
              <a href="mailto:info@thekpiplus.com" className="kpi-footer-contact-row">
                <Mail />
                <span className="kpi-latin">info@thekpiplus.com</span>
              </a>
              <div className="kpi-footer-contact-row">
                <Phone />
                <span>
                  <a href="tel:+66826356266" className="kpi-latin kpi-footer-link">
                    +66 82 635 6266
                  </a>
                  <span className="kpi-footer-contact-label kpi-footer-contact-channels">
                    <a href="https://wa.me/66826356266" target="_blank" rel="noreferrer" data-track="footer_whatsapp_click">
                      WhatsApp
                    </a>
                    <span aria-hidden="true">·</span>
                    <a href="https://lin.ee/TQibLMD" target="_blank" rel="noreferrer" data-track="footer_line_click">
                      LINE
                    </a>
                  </span>
                </span>
              </div>
              <a href="tel:+66626356646" className="kpi-footer-contact-row kpi-footer-phone-alt">
                <Phone />
                <span className="kpi-latin">+66 62 635 6646</span>
              </a>
              {contactHref ? <FooterMore href={contactHref}>{t.contact}</FooterMore> : null}
            </div>
          </section>
          </div>
        </div>

        <div className="kpi-footer-legal">
          <p>{`© 2026 ${legalName(locale)} · Tax ID 0835564008629`}</p>
          <div className="kpi-footer-legal-links">
            {privacyHref ? <Link href={privacyHref}>{t.privacy}</Link> : null}
            {cookiesHref ? <Link href={cookiesHref}>{t.cookies}</Link> : null}
            <button type="button" onClick={() => window.dispatchEvent(new Event("kpi-open-cookie-settings"))}>
              {t.cookieSettings}
            </button>
            <span className="kpi-footer-lang kpi-thai-nav" aria-label={t.language}>
              <span className="kpi-footer-lang-label">
                <Earth className="h-3.5 w-3.5" />
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
