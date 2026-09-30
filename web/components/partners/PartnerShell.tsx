import Link from "next/link";
import { logoutPartnerAction } from "@/lib/crm/actions";

const links = [
  { href: "/partners", label: "แดชบอร์ด" },
  { href: "/partners/referrals", label: "Referral" },
  { href: "/partners/earnings", label: "รายได้" },
  { href: "/partners/payouts", label: "การจ่าย" },
  { href: "/partners/profile", label: "โปรไฟล์" },
];

export function PartnerShell({
  pathname,
  userName,
  children,
}: {
  pathname: string;
  userName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="crm-shell kpi-locale-th">
      <header className="crm-top">
        <div className="crm-top-inner">
          <div>
            <p className="text-xs font-extrabold tracking-[.12em] text-[#0B6660]">THE KPI PLUS PARTNER PORTAL</p>
            <p className="text-sm text-[#555555]">{userName}</p>
          </div>
          <nav className="crm-nav" aria-label="Partner Portal">
            {links.map((item) => (
              <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
            <form action={logoutPartnerAction}>
              <button type="submit">ออกจากระบบ</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="crm-main">{children}</main>
    </div>
  );
}
