"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { logoutAction } from "@/lib/crm/actions";
import { ADMIN_MODULES, MODULE_LABEL, MODULE_PATH, type AdminModule } from "@/lib/crm/modules";

type Workspace = "home" | AdminModule;

const leadLinks = [
  { href: "/crm/sales", label: "วันนี้" },
  { href: "/crm/leads/new", label: "คีย์ลีด" },
  { href: "/crm/pipeline", label: "Pipeline" },
  { href: "/crm/leads", label: "ลีดทั้งหมด" },
  { href: "/crm/leads?origin=web", label: "จากเว็บ" },
  { href: "/crm/leads?origin=manual", label: "คีย์เอง" },
  { href: "/crm/activities", label: "กิจกรรม" },
];

const partnerLinks = [
  { href: "/crm/partners", label: "คิวงาน" },
  { href: "/crm/partners/list", label: "อนุมัติพาร์ตเนอร์" },
  { href: "/crm/partners/new", label: "เพิ่มพาร์ตเนอร์" },
  { href: "/crm/partners/referrals", label: "Referral" },
  { href: "/crm/partners/commissions", label: "ค่าคอม" },
  { href: "/crm/partners/payouts", label: "Payouts" },
  { href: "/crm/partners/settings", label: "กติกา" },
];

const userLinks = [
  { href: "/crm/users", label: "รายชื่อผู้ใช้" },
  { href: "/crm/users/new", label: "เพิ่มผู้ใช้" },
  { href: "/crm/users/logs", label: "Login Log" },
];

const cmsLinks = [
  { href: "/crm/cms", label: "ภาพรวม" },
  { href: "/crm/cms/pages", label: "หน้า" },
  { href: "/crm/cms/insights", label: "บทความ" },
  { href: "/crm/cms/media", label: "สื่อ" },
  { href: "/crm/cms/redirects", label: "Redirect" },
  { href: "/crm/cms/globals", label: "ตั้งค่าเว็บ" },
];

const contextByWorkspace: Record<Exclude<Workspace, "home">, { href: string; label: string }[]> = {
  leads: leadLinks,
  partners: partnerLinks,
  users: userLinks,
  cms: cmsLinks,
};

const SHORT_LABEL: Record<AdminModule, string> = {
  leads: "Lead Management",
  partners: "Partner Management",
  users: "Users Management",
  cms: "CMS",
};

function workspaceOf(pathname: string): Workspace {
  if (pathname.startsWith("/crm/cms")) return "cms";
  if (pathname.startsWith("/crm/users")) return "users";
  if (pathname.startsWith("/crm/partners")) return "partners";
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
  if (path === "/crm/leads/new") return pathname === "/crm/leads/new";
  if (path === "/crm/leads") return pathname === "/crm/leads" && !currentQuery;
  if (path === "/crm/users/new") return pathname === "/crm/users/new";
  if (path === "/crm/users") return pathname === "/crm/users";
  if (path === "/crm/cms") return pathname === "/crm/cms";
  if (path === "/crm/partners") return pathname === "/crm/partners";
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function CrmShell({
  userName,
  modules,
  showLogout = false,
  children,
}: {
  userName: string;
  modules: AdminModule[];
  showLogout?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/crm";
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const workspace = workspaceOf(pathname);
  const contextLinks = workspace === "home" ? [] : contextByWorkspace[workspace];
  const allowed = ADMIN_MODULES.filter((module) => modules.includes(module));

  return (
    <div className="crm-shell kpi-locale-th">
      <header className="crm-top">
        <div className="crm-top-brand">
          <Link href="/crm" className="crm-brand">
            <img
              src="/brand/KPIPlus_Horizontal_FullColor.svg"
              alt="The KPI Plus"
              width={180}
              height={40}
              style={{ height: 40, width: "auto" }}
            />
            <span>
              <p className="crm-brand-kicker">Admin</p>
              <p className="crm-brand-user">{userName}</p>
            </span>
          </Link>
          <div className="crm-top-tools">
            <Link href="/crm/settings" aria-current={pathname.startsWith("/crm/settings") ? "page" : undefined}>
              ตั้งค่า
            </Link>
            {showLogout ? (
              <form action={logoutAction}>
                <button type="submit">ออกจากระบบ</button>
              </form>
            ) : null}
          </div>
        </div>

        <nav className="crm-nav-tree" aria-label="Admin">
          <div className="crm-nav-primary" aria-label="ฟังก์ชันหลัก">
            {allowed.map((module) => (
              <Link
                key={module}
                href={MODULE_PATH[module]}
                className="crm-nav-parent-link"
                aria-current={workspace === module ? "page" : undefined}
              >
                {SHORT_LABEL[module]}
              </Link>
            ))}
          </div>

          {workspace !== "home" && contextLinks.length ? (
            <div className="crm-nav-sub" aria-label={`${MODULE_LABEL[workspace]} submenu`}>
              <div className="crm-nav-sub-inner">
                <p className="crm-nav-crumb">
                  <span>{SHORT_LABEL[workspace]}</span>
                  <span aria-hidden="true">›</span>
                </p>
                <div className="crm-nav-children">
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
            </div>
          ) : null}
        </nav>
      </header>
      <main className="crm-main">{children}</main>
    </div>
  );
}
