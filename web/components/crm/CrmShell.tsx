"use client";

import Link from "next/link";
import { useEffect, useId, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logoutAction } from "@/lib/crm/actions";
import { ADMIN_MODULES, MODULE_LABEL, MODULE_PATH, type AdminModule } from "@/lib/crm/modules";
import { CrmThemeToggle } from "@/components/crm/CrmThemeToggle";
import { NewLeadModalProvider } from "@/components/crm/ui/NewLeadModal";
import { NewPartnerModalProvider } from "@/components/crm/ui/NewPartnerModal";
import { ProfileMenu } from "@/components/crm/ui/ProfileMenu";

type Workspace = "home" | AdminModule;
type NavKey = "home" | AdminModule | "settings";
type ContextLink = { href: string; label: string };

const leadLinks: ContextLink[] = [
  { href: "/crm/sales", label: "วันนี้" },
  { href: "/crm/pipeline", label: "Pipeline" },
  { href: "/crm/leads", label: "ลีดทั้งหมด" },
  { href: "/crm/leads?origin=web", label: "จากเว็บ" },
  { href: "/crm/leads?origin=manual", label: "คีย์เอง" },
  { href: "/crm/activities", label: "กิจกรรม" },
];

const partnerLinks: ContextLink[] = [
  { href: "/crm/partners", label: "คิวงาน" },
  { href: "/crm/partners/list", label: "อนุมัติพาร์ตเนอร์" },
  { href: "/crm/partners/referrals", label: "Referral" },
  { href: "/crm/partners/commissions", label: "ค่าคอม" },
  { href: "/crm/partners/payouts", label: "Payouts" },
  { href: "/crm/partners/settings", label: "กติกา" },
];

const reservationLinks: ContextLink[] = [
  { href: "/crm/reservations", label: "คิวงาน" },
  { href: "/crm/reservations?status=new", label: "New" },
  { href: "/crm/reservations?status=in_progress", label: "In Progress" },
  { href: "/crm/reservations?status=escalated", label: "Escalated" },
];

const userLinks: { href: string; label: string }[] = [];

const b2bLinks: ContextLink[] = [
  { href: "/crm/b2b", label: "Partner Pipeline" },
  { href: "/crm/b2b/directory", label: "Partner Directory" },
  { href: "/crm/b2b/rates", label: "Rate & Commission" },
  { href: "/crm/b2b/materials", label: "Sales Materials" },
  { href: "/crm/b2b/activities", label: "Activities / Follow-up" },
  { href: "/crm/b2b/bookings", label: "Booking Outcomes" },
  { href: "/crm/b2b/reports", label: "Reports / KPI" },
  { href: "/crm/b2b/settings", label: "Settings" },
];

const adsLinks: ContextLink[] = [
  { href: "/crm/ads", label: "Campaigns" },
  { href: "/crm/ads/search", label: "Search Ads" },
  { href: "/crm/ads/hotel", label: "Hotel Ads" },
  { href: "/crm/ads/free-links", label: "Free Booking Links" },
  { href: "/crm/ads/landing-pages", label: "Landing Pages" },
  { href: "/crm/ads/tracking", label: "Tracking & Conversions" },
  { href: "/crm/ads/optimization", label: "Optimization Log" },
  { href: "/crm/ads/reports", label: "Reports / KPI" },
  { href: "/crm/ads/approvals", label: "Approvals" },
  { href: "/crm/ads/settings", label: "Settings" },
];

const cmsLinks = [
  { href: "/crm/cms", label: "หน้าเพจทั้งหมด" },
  { href: "/crm/cms/insights", label: "บทความ" },
  { href: "/crm/cms/case-studies", label: "ผลงานลูกค้า" },
  { href: "/crm/cms/client-logos", label: "โลโก้ลูกค้า" },
  { href: "/crm/cms/trash", label: "ถังขยะ" },
  { href: "/crm/cms/media", label: "สื่อ/ไฟล์รูปภาพ" },
  { href: "/crm/cms/redirects", label: "Redirect" },
  { href: "/crm/cms/globals", label: "ตั้งค่าเว็บ" },
  { href: "/crm/cms/reservations", label: "เส้นแบ่งงาน Reservations" },
  { href: "/crm/cms/b2b", label: "หน้า B2B Agent Sales" },
  { href: "/crm/cms/google-ads", label: "หน้า Google Ads Management" },
  { href: "/crm/cms/contacts", label: "ข้อมูลติดต่อ" },
];

const contextByWorkspace: Record<Exclude<Workspace, "home">, ContextLink[]> = {
  leads: leadLinks,
  partners: partnerLinks,
  reservations: reservationLinks,
  b2b: b2bLinks,
  ads: adsLinks,
  users: userLinks,
  cms: cmsLinks,
};

const NAV_LABEL: Record<NavKey, string> = {
  home: "หน้าหลัก",
  leads: "Lead Management",
  partners: "Partner Management",
  reservations: "Reservation Operations",
  b2b: "B2B Sales Operations",
  ads: "Google Ads Operations",
  users: "Users Management",
  cms: "Content Management",
  settings: "ตั้งค่า",
};

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function IconLeads() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16" cy="9" r="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4.5 18c.5-2.4 2.5-3.8 4.5-3.8s4 1.4 4.5 3.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M13.5 17.5c.4-1.6 1.7-2.6 3.2-2.6 1.1 0 2 .5 2.6 1.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconPartners() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 13.5c-1.8-.2-3.5.7-4.2 2.2M16 13.5c1.8-.2 3.5.7 4.2 2.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="8" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9.2 14.2c1 .9 2.1 1.3 2.8 1.3s1.8-.4 2.8-1.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M6.5 18.5c.7-2.8 2.8-4.2 5.5-4.2s4.8 1.4 5.5 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconReservations() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 5.5h12A1.5 1.5 0 0 1 19.5 7v12A1.5 1.5 0 0 1 18 20.5H6A1.5 1.5 0 0 1 4.5 19V7A1.5 1.5 0 0 1 6 5.5Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 3.5v4M16 3.5v4M8 12h8M8 15.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconB2b() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 8.5h14v11H5V8.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 8.5V6.8A4 4 0 0 1 12 4a4 4 0 0 1 4 2.8v1.7M9 13h6M9 16.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconCms() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4.5h7l3 3V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 4.5V8h3.5M9 12h6M9 15.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 4.5v1.4M12 18.1v1.4M4.5 12h1.4M18.1 12h1.4M6.4 6.4l1 1M16.6 16.6l1 1M17.6 6.4l-1 1M7.4 16.6l-1 1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg className="crm-rail-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconHeadset() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13V11a7 7 0 0 1 14 0v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M5 13v3.5A1.5 1.5 0 0 0 6.5 18H8v-5H5Zm14 0v3.5A1.5 1.5 0 0 1 17.5 18H16v-5h3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function IconExternal() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 6H6.5A1.5 1.5 0 0 0 5 7.5v10A1.5 1.5 0 0 0 6.5 19h10a1.5 1.5 0 0 0 1.5-1.5V14M14 5h5v5M12 12 19 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NAV_ICON: Record<NavKey, () => ReactNode> = {
  home: IconHome,
  leads: IconLeads,
  partners: IconPartners,
  reservations: IconReservations,
  b2b: IconB2b,
  ads: IconB2b,
  users: IconUsers,
  cms: IconCms,
  settings: IconSettings,
};

function workspaceOf(pathname: string): Workspace {
  if (pathname.startsWith("/crm/cms")) return "cms";
  if (pathname.startsWith("/crm/users")) return "users";
  if (pathname.startsWith("/crm/partners")) return "partners";
  if (pathname.startsWith("/crm/reservations")) return "reservations";
  if (pathname.startsWith("/crm/b2b")) return "b2b";
  if (pathname.startsWith("/crm/ads")) return "ads";
  if (
    pathname.startsWith("/crm/sales") ||
    pathname.startsWith("/crm/pipeline") ||
    pathname.startsWith("/crm/leads") ||
    pathname.startsWith("/crm/activities")
  ) {
    return "leads";
  }
  return "home";
}

function isCurrent(pathname: string, search: string, href: string) {
  const [path, query] = href.split("?");
  const currentQuery = search.startsWith("?") ? search.slice(1) : search;
  if (query) return pathname === path && currentQuery === query;
  if (path === "/crm/sales") return pathname === "/crm/sales";
  if (path === "/crm/leads") return pathname === "/crm/leads" && !currentQuery;
  if (path === "/crm/users/new") return pathname === "/crm/users/new";
  if (path === "/crm/users") return pathname === "/crm/users";
  if (path === "/crm/cms") return pathname === "/crm/cms";
  if (path === "/crm/partners") return pathname === "/crm/partners";
  if (path === "/crm/b2b") return pathname === "/crm/b2b";
  if (path === "/crm/ads") return pathname === "/crm/ads";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function RailLink({
  href,
  navKey,
  current,
  showChevron = false,
  onNavigate,
}: {
  href: string;
  navKey: NavKey;
  current: boolean;
  showChevron?: boolean;
  onNavigate?: () => void;
}) {
  const Icon = NAV_ICON[navKey];
  return (
    <Link
      href={href}
      className={`crm-rail-link${current ? " is-active" : ""}`}
      aria-current={current ? "page" : undefined}
      title={NAV_LABEL[navKey]}
      onClick={onNavigate}
    >
      <span className="crm-rail-ico" aria-hidden="true">
        <Icon />
      </span>
      <em>{NAV_LABEL[navKey]}</em>
      {showChevron ? <IconChevron /> : null}
    </Link>
  );
}

export function CrmShell({
  userName,
  userRole = "Administrator",
  modules,
  showLogout = false,
  leadForm,
  partnerModal = false,
  children,
}: {
  userName: string;
  userRole?: string;
  modules: AdminModule[];
  showLogout?: boolean;
  leadForm?: {
    partners: { id: string; displayName: string; tier: string }[];
    owners: { id: string; name: string }[];
    currentUserId?: string;
  };
  partnerModal?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/crm";
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const workspace = workspaceOf(pathname);
  const contextLinks = workspace === "home" ? [] : contextByWorkspace[workspace];
  const allowed = ADMIN_MODULES.filter((module) => modules.includes(module));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [railExpanded, setRailExpanded] = useState(true);
  const drawerId = useId();
  const newLeadOpen = searchParams.get("newLead") === "1";
  const newLeadDuplicate = searchParams.get("duplicate") || undefined;
  const newLeadError = searchParams.get("error") || undefined;
  const newPartnerOpen = searchParams.get("newPartner") === "1";
  const newPartnerError = searchParams.get("error") || undefined;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("crm-rail-expanded");
      if (stored === "0") setRailExpanded(false);
      if (stored === "1") setRailExpanded(true);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("crm-rail-expanded", railExpanded ? "1" : "0");
    } catch {
      // ignore
    }
  }, [railExpanded]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname, search]);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const navBody = (onNavigate?: () => void) => (
    <>
      <RailLink href="/crm" navKey="home" current={workspace === "home"} onNavigate={onNavigate} />

      {allowed.length ? (
        <div className="crm-rail-group">
          <p className="crm-rail-section">จัดการข้อมูลหลัก</p>
          {allowed.map((module) => (
            <RailLink
              key={module}
              href={MODULE_PATH[module]}
              navKey={module}
              current={workspace === module}
              showChevron
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : null}

      <div className="crm-rail-divider" role="separator" />

      <div className="crm-rail-group">
        <p className="crm-rail-section">ระบบและการตั้งค่า</p>
        <RailLink
          href="/crm/settings"
          navKey="settings"
          current={pathname.startsWith("/crm/settings")}
          showChevron
          onNavigate={onNavigate}
        />
      </div>
    </>
  );

  const railCards = (
    <div className="crm-rail-cards">
      <a className="crm-rail-support" href="mailto:support@thekpiplus.com" title="ติดต่อทีม Support">
        <span className="crm-rail-support-ico" aria-hidden="true">
          <IconHeadset />
        </span>
        <span className="crm-rail-support-copy">
          <strong>ช่วยเหลือ / แจ้งปัญหา</strong>
          <em>ติดต่อทีม Support</em>
        </span>
        <span className="crm-rail-support-ext" aria-hidden="true">
          <IconExternal />
        </span>
      </a>
      <div className="crm-rail-workspace">
        <span className="crm-rail-workspace-plus" aria-hidden="true">
          +
        </span>
        <strong>KPI PLUS</strong>
        <em>Admin Workspace</em>
        <span>Version 3.0.0</span>
      </div>
      {showLogout ? (
        <div className="crm-rail-tools">
          <form action={logoutAction}>
            <button type="submit" className="crm-rail-logout-btn" title="ออกจากระบบ" aria-label="ออกจากระบบ">
              ออกจากระบบ
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );

  const shell = (
    <div className={`crm-shell crm-shell-app kpi-locale-th${railExpanded ? " is-rail-expanded" : ""}${workspace === "b2b" ? " crm-shell-b2b" : ""}${workspace === "ads" ? " crm-shell-ads" : ""}`}>
      <aside
        className={`crm-rail crm-rail-desktop${railExpanded ? " is-expanded" : ""}`}
        aria-label="เมนูหลัก"
      >
        <div className="crm-rail-head">
          <Link href="/crm" className="crm-rail-brand" title="The KPI Plus">
            <img src="/brand/KPIPlus_Symbol_FullColor.svg" alt="" width={36} height={36} />
            <strong className="crm-rail-brand-text">THE KPI PLUS</strong>
          </Link>
          <button
            type="button"
            className="crm-rail-toggle"
            aria-label={railExpanded ? "ย่อแถบเมนู" : "ขยายแถบเมนู"}
            aria-expanded={railExpanded}
            title={railExpanded ? "ย่อแถบเมนู" : "ขยายแถบเมนู"}
            onClick={() => setRailExpanded((value) => !value)}
          >
            <span aria-hidden="true">{railExpanded ? "‹" : "›"}</span>
          </button>
        </div>
        <nav className="crm-rail-nav">{navBody()}</nav>
        <div className="crm-rail-foot">{railCards}</div>
      </aside>

      {drawerOpen ? (
        <button
          type="button"
          className="crm-drawer-backdrop"
          aria-label="ปิดเมนู"
          onClick={() => setDrawerOpen(false)}
        />
      ) : null}

      <aside
        id={drawerId}
        className={`crm-drawer${drawerOpen ? " is-open" : ""}`}
        aria-label="เมนูมือถือ"
        aria-hidden={!drawerOpen}
      >
        <div className="crm-drawer-head">
          <Link href="/crm" className="crm-rail-brand" onClick={() => setDrawerOpen(false)}>
            <img src="/brand/KPIPlus_Symbol_FullColor.svg" alt="The KPI Plus" width={36} height={36} />
            <strong className="crm-rail-brand-text">THE KPI PLUS</strong>
          </Link>
          <button type="button" className="crm-drawer-close" aria-label="ปิดเมนู" onClick={() => setDrawerOpen(false)}>
            ✕
          </button>
        </div>
        <nav className="crm-drawer-nav">{navBody(() => setDrawerOpen(false))}</nav>
        <div className="crm-drawer-foot">
          {railCards}
          <p className="crm-drawer-user">
            <strong>{userName}</strong>
            <em>{userRole}</em>
          </p>
        </div>
      </aside>

      <div className="crm-app">
        <header className="crm-app-top">
          <button
            type="button"
            className="crm-rail-expand-btn"
            aria-label={railExpanded ? "ย่อแถบเมนู" : "ขยายแถบเมนู"}
            aria-expanded={railExpanded}
            title={railExpanded ? "ย่อแถบเมนู" : "ขยายแถบเมนูเพื่อเห็นชื่อเมนู"}
            onClick={() => setRailExpanded((value) => !value)}
          >
            <span aria-hidden="true">{railExpanded ? "◧" : "☰"}</span>
          </button>
          <button
            type="button"
            className="crm-menu-toggle"
            aria-label="เปิดเมนู"
            aria-expanded={drawerOpen}
            aria-controls={drawerId}
            onClick={() => setDrawerOpen(true)}
          >
            ☰
          </button>
          <label className="crm-app-search" title="การค้นหาทั้งระบบจะเปิดใช้เมื่อพร้อม">
            <span className="sr-only">ค้นหาทั้งระบบ (ยังไม่เปิดใช้)</span>
            <span aria-hidden="true">⌕</span>
            <input type="search" placeholder="ค้นหาข้อมูล เมนู หรือคำสั่ง..." disabled aria-disabled="true" />
            <kbd aria-hidden="true">⌘ K</kbd>
          </label>
          <div className="crm-app-top-right">
            <CrmThemeToggle className="crm-top-theme" />
            <ProfileMenu userName={userName} userRole={userRole} showLogout={showLogout} />
          </div>
        </header>

        {workspace !== "home" && contextLinks.length ? (
          <div className="crm-app-sub" aria-label={`${MODULE_LABEL[workspace]} submenu`}>
            <p className="crm-app-sub-title">{NAV_LABEL[workspace]}</p>
            <div className="crm-app-sub-links">
              {contextLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isCurrent(pathname, search, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <main className="crm-main" id="crm-main">
          {children}
        </main>
      </div>
    </div>
  );

  let content: ReactNode = shell;

  if (partnerModal) {
    content = (
      <NewPartnerModalProvider autoOpen={newPartnerOpen} error={newPartnerError}>
        {content}
      </NewPartnerModalProvider>
    );
  }

  if (leadForm) {
    content = (
      <NewLeadModalProvider
        partners={leadForm.partners}
        owners={leadForm.owners}
        currentUserId={leadForm.currentUserId}
        duplicateId={newLeadDuplicate}
        error={newLeadError}
        autoOpen={newLeadOpen}
      >
        {content}
      </NewLeadModalProvider>
    );
  }

  return content;
}
