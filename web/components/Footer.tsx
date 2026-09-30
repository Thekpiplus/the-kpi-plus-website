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
  return (
    <h2 className="kpi-footer-heading kpi-thai-nav text-xs font-extrabold uppercase leading-5 tracking-[.12em] text-[#0B6660]">
      {children}
    </h2>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="kpi-thai-nav text-sm leading-6 text-[#555555] transition hover:text-[#0B6660]">
      {children}
    </Link>
  );
}

function FooterMore({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="kpi-thai-nav mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B6660]">
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
    <footer lang={htmlLang(locale)} className="kpi-footer border-t border-[#E3E8EB] bg-white text-[#3B3B3B]">
      <div className="kpi-lime-bar h-1" />
      <div className="kpi-section">
        <div className="kpi-footer-top">
          <section className="max-w-md">
            <Link href={homeHref(locale)} aria-label={locale === "th" ? `${brandName(locale)} หน้าแรก` : `${brandName(locale)} home`} className="kpi-footer-brand-mark">
              <img
                src="/brand/KPIPlus_Horizontal_FullColor.svg"
                alt={brandName(locale)}
                className="h-10 w-auto min-w-[120px] object-contain object-left"
              />
            </Link>
            <p className="kpi-footer-statement kpi-thai-nav mt-5 text-lg font-medium leading-7 text-[#063F3B]">
              {t.statement}
            </p>
            <p className="kpi-footer-description mt-3 text-sm leading-7 text-[#555555]">{t.description}</p>
            <Link data-track="footer_audit_cta" href={auditHref(locale)} className="kpi-button kpi-thai-nav mt-6 text-[0.95rem] font-medium">
              {t.footerAudit} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <div className="mt-7">
              <p className="kpi-thai-nav text-xs font-extrabold uppercase tracking-[.12em] text-[#0B6660]">{t.follow}</p>
              <div className="mt-3 flex items-center gap-2">
                <a
                  href="https://www.facebook.com/thekpiplus/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={locale === "th" ? `${brandName(locale)} บน Facebook` : `${brandName(locale)} on Facebook`}
                  data-track="footer_facebook_click"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E3E8EB] text-[#063F3B] transition hover:bg-[#F4F4F4]"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/thekpiplus/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={locale === "th" ? `${brandName(locale)} บน LinkedIn` : `${brandName(locale)} on LinkedIn`}
                  data-track="footer_linkedin_click"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E3E8EB] text-[#063F3B] transition hover:bg-[#F4F4F4]"
                >
                  <LinkedIn className="h-4 w-4" />
                </a>
              </div>
            </div>
          </section>

          <div className="kpi-footer-menus">
          {groups.length ? (
            <section className="kpi-footer-column" aria-label={t.solutions}>
              <FooterHeading>{t.solutions}</FooterHeading>
              <nav className="mt-5 grid gap-2.5" aria-label={t.solutions}>
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
              <nav className="mt-5 grid gap-2.5">
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
                  className="kpi-thai-nav text-sm leading-6 text-[#555555] transition hover:text-[#0B6660]"
                >
                  {t.academy}
                </a>
              </nav>
            </section>
          ) : null}

          {toolLinks.length ? (
            <section className="kpi-footer-column" aria-label={t.tools}>
              <FooterHeading>{t.tools}</FooterHeading>
              <nav className="mt-5 grid gap-2.5">
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
            <div className="kpi-footer-contact mt-5 grid gap-3 text-sm leading-6 text-[#555555]">
              <a
                href="https://www.google.com/maps/search/?api=1&query=58%2F15%20E%20Chaofah%20Rd%2C%20Talat%20Nuea%2C%20Mueang%20Phuket%2C%20Phuket%2083000"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 hover:text-[#0B6660]"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0B6660]" />
                <span>{t.address}</span>
              </a>
              <a href="mailto:info@thekpiplus.com" className="flex items-center gap-3 hover:text-[#0B6660]">
                <Mail className="h-4 w-4 shrink-0 text-[#0B6660]" />
                <span>info@thekpiplus.com</span>
              </a>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#0B6660]" />
                <span>
                  <a href="tel:+66826356266" className="hover:text-[#0B6660]">
                    +66 82 635 6266
                  </a>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs font-semibold text-[#0B6660]">
                    <a
                      href="https://wa.me/66826356266"
                      target="_blank"
                      rel="noreferrer"
                      data-track="footer_whatsapp_click"
                      className="hover:underline"
                    >
                      WhatsApp
                    </a>
                    <span aria-hidden="true">·</span>
                    <a
                      href="https://lin.ee/TQibLMD"
                      target="_blank"
                      rel="noreferrer"
                      data-track="footer_line_click"
                      className="hover:underline"
                    >
                      LINE
                    </a>
                  </span>
                </span>
              </div>
              <a href="tel:+66626356646" className="flex items-center gap-3 hover:text-[#0B6660]">
                <Phone className="h-4 w-4 shrink-0 text-[#0B6660]" />
                <span>+66 62 635 6646</span>
              </a>
              {contactHref ? <FooterMore href={contactHref}>{t.contact}</FooterMore> : null}
            </div>
          </section>
          </div>
        </div>

        <div className="kpi-footer-legal mt-14 flex flex-col gap-4 border-t border-[#E3E8EB] pt-6 text-xs leading-5 text-[#555555] lg:flex-row lg:items-center lg:justify-between">
          <p>
            {`© 2026 ${legalName(locale)} · Tax ID 0835564008629`}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {privacyHref ? (
              <Link href={privacyHref} className="hover:text-[#0B6660]">
                {t.privacy}
              </Link>
            ) : null}
            {cookiesHref ? (
              <Link href={cookiesHref} className="hover:text-[#0B6660]">
                {t.cookies}
              </Link>
            ) : null}
            <button
              type="button"
              className="hover:text-[#0B6660]"
              onClick={() => window.dispatchEvent(new Event("kpi-open-cookie-settings"))}
            >
              {t.cookieSettings}
            </button>
            <span className="kpi-thai-nav inline-flex items-center gap-3 font-medium" aria-label={t.language}>
              <span className="inline-flex items-center gap-1.5 text-[#063F3B]">
                <Earth className="h-3.5 w-3.5" />
                {t.language}
              </span>
              {locales.map((item) => (
                <Link
                  key={item.id}
                  href={switchLocale(pathname, item.id)}
                  className={item.id === locale ? "text-[#0B6660]" : "hover:text-[#0B6660]"}
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
