"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Earth, MenuIcon } from "@/components/Icons";
import {
  locales,
  uiCopy,
  visiblePrimaryLinks,
  visibleSolutionGroups,
} from "@/lib/nav";
import { auditHref, brandName, homeHref, htmlLang, localeFromPath, solutionsIndexHref, switchLocale } from "@/lib/seo";

function eventElement(event: Event) {
  const target = event.target;
  if (target instanceof Element) return target;
  if (target instanceof Node) return target.parentElement;
  return null;
}

export function Header({ extraLinks = [] }: { extraLinks?: { href: string; label: string }[] }) {
  const pathname = usePathname() || "/";
  const locale = localeFromPath(pathname);
  const t = uiCopy(locale);
  const groups = visibleSolutionGroups(locale);
  const primaryLinks = visiblePrimaryLinks(locale);
  const [openSolutions, setOpenSolutions] = useState(false);
  const [pinnedSolutions, setPinnedSolutions] = useState(false);
  const [openLang, setOpenLang] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const skipScrollReset = useRef(true);
  const fromHistory = useRef(false);
  const currentLang = locales.find((item) => item.id === locale)?.label ?? "ไทย";
  const isHome = pathname === homeHref(locale);

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const closeSolutionsMenu = () => {
    clearCloseTimer();
    setPinnedSolutions(false);
    setOpenSolutions(false);
  };

  const openSolutionsMenu = () => {
    clearCloseTimer();
    setOpenSolutions(true);
    setOpenLang(false);
  };

  const scheduleCloseSolutions = () => {
    if (pinnedSolutions) return;
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpenSolutions(false), 160);
  };

  useEffect(() => {
    const onPopState = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    closeSolutionsMenu();
    setOpenLang(false);
    setOpenMenu(false);

    if (skipScrollReset.current) {
      skipScrollReset.current = false;
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    if (window.location.hash) return;

    const scrollToPageTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    scrollToPageTop();
    const frame = window.requestAnimationFrame(scrollToPageTop);
    const timer = window.setTimeout(scrollToPageTop, 0);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const el = eventElement(event);
      if (!el) return;
      if (!solutionsRef.current?.contains(el)) closeSolutionsMenu();
      if (!langRef.current?.contains(el)) setOpenLang(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSolutionsMenu();
        setOpenLang(false);
        setOpenMenu(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      clearCloseTimer();
    };
  }, []);

  return (
    <header
      lang={htmlLang(locale)}
      suppressHydrationWarning
      className={`kpi-header sticky top-0 z-50 overflow-visible border-b border-[#E3E8EB] bg-white text-[#3B3B3B] shadow-[0_2px_16px_rgba(11,31,58,.04)]${isHome ? " kpi-header-home" : ""}`}
    >
      <div className="kpi-header-bar overflow-visible">
        <Link
          href={homeHref(locale)}
          aria-label={locale === "th" ? `${brandName(locale)} หน้าแรก` : `${brandName(locale)} home`}
          className="kpi-header-brand"
        >
          <img
            src="/brand/KPIPlus_Horizontal_FullColor.png"
            alt={brandName(locale)}
            className="kpi-header-logo"
          />
        </Link>

        <nav aria-label="Primary navigation" className="kpi-thai-nav kpi-nav-desktop">
          {groups.length ? (
            <div
              ref={solutionsRef}
              className="kpi-solutions-root"
              onMouseEnter={openSolutionsMenu}
              onMouseLeave={scheduleCloseSolutions}
            >
              <div className={`kpi-solutions-trigger ${openSolutions ? "is-open" : ""}`}>
                <Link href={solutionsIndexHref(locale)} className="kpi-solutions-label">
                  {t.solutions}
                </Link>
                <button
                  type="button"
                  aria-expanded={openSolutions}
                  aria-haspopup="menu"
                  aria-controls="solutions-menu"
                  aria-label={t.openSolutions}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => {
                    setOpenLang(false);
                    if (openSolutions && pinnedSolutions) {
                      closeSolutionsMenu();
                      return;
                    }
                    setPinnedSolutions(true);
                    setOpenSolutions(true);
                  }}
                  className="kpi-solutions-chevron"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform duration-150 ${openSolutions ? "rotate-180" : ""}`} />
                </button>
              </div>
              <div
                id="solutions-menu"
                role="menu"
                className="kpi-solutions-menu"
                style={{
                  display: openSolutions ? "block" : "none",
                  zIndex: 80,
                  width: "min(48rem, calc(100vw - 2.5rem))",
                }}
              >
                <div className="kpi-solutions-panel">
                  <div className="kpi-solutions-grid">
                    {groups.map((group) => (
                      <div key={group.id}>
                        <p className="kpi-solutions-heading">{group.title}</p>
                        <div className="kpi-solutions-links">
                          {group.items.map((item) => (
                            <Link key={item.href} href={item.href} role="menuitem" className="kpi-solutions-link">
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href={solutionsIndexHref(locale)} role="menuitem" className="kpi-solutions-all">
                    {t.allSolutions}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
          {primaryLinks.map((item) => (
            <Link key={item.href} href={item.href} className="kpi-nav-link">
              {item.label}
            </Link>
          ))}
          {extraLinks.map((item) => (
            <Link key={item.href} href={item.href} className="kpi-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="kpi-header-actions">
          <button
            type="button"
            aria-label={t.openMenu}
            className="kpi-nav-toggle"
            onClick={() => setOpenMenu((value) => !value)}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <div ref={langRef} className="kpi-header-lang">
            <button
              type="button"
              aria-expanded={openLang}
              aria-haspopup="menu"
              className="kpi-thai-nav kpi-header-lang-btn"
              onClick={() => {
                setOpenSolutions(false);
                setOpenLang((value) => !value);
              }}
            >
              <Earth className="h-4 w-4" />
              <span>{currentLang}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openLang ? "rotate-180" : ""}`} />
            </button>
            <div className="kpi-header-lang-menu" style={{ display: openLang ? "block" : "none", zIndex: 80 }}>
              <div className="kpi-header-lang-panel">
                {locales.map((item) => (
                  <Link
                    key={item.id}
                    href={switchLocale(pathname, item.id)}
                    className="kpi-header-lang-option"
                    onClick={() => setOpenLang(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link
            data-track="public_header_audit_cta"
            href={auditHref(locale)}
            className="kpi-cta kpi-header-cta kpi-thai-nav"
          >
            <span className="kpi-header-cta-full">
              {locale === "th" ? (
                <>
                  ขอวิเคราะห์ <span className="kpi-latin">Performance</span>
                </>
              ) : (
                t.audit
              )}
            </span>
            <span className="kpi-header-cta-short">{t.auditShort}</span>
          </Link>
        </div>
      </div>

      {openMenu ? (
        <div className="kpi-mobile-drawer border-t border-[#E3E8EB] bg-white px-5 py-4">
          <div className="kpi-mobile-nav text-sm text-[#555555]">
            {groups.length ? (
              <div className="grid gap-2">
                <Link
                  href={solutionsIndexHref(locale)}
                  className="font-semibold text-[#0B6660]"
                  onClick={() => setOpenMenu(false)}
                >
                  {t.solutions}
                </Link>
                <Link href={solutionsIndexHref(locale)} onClick={() => setOpenMenu(false)}>
                  {t.allSolutions}
                </Link>
              </div>
            ) : null}
            {groups.map((group) => (
              <div key={group.id}>
                <p className={`text-xs font-extrabold text-[#0B6660] ${locale === "en" ? "uppercase tracking-[.12em]" : "tracking-[.06em]"}`}>{group.title}</p>
                <div className="mt-2 grid gap-2">
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setOpenMenu(false)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="grid gap-2">
              {primaryLinks.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpenMenu(false)}>
                  {item.label}
                </Link>
              ))}
              {extraLinks.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpenMenu(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 border-t border-[#E3E8EB] pt-3">
              {locales.map((item) => (
                <Link
                  key={item.id}
                  href={switchLocale(pathname, item.id)}
                  className={item.id === locale ? "font-semibold text-[#0B6660]" : ""}
                  onClick={() => setOpenMenu(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
