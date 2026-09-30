import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PartnerShell } from "@/components/partners/PartnerShell";
import { currentUser } from "@/lib/crm/auth";
import { crmEnabled } from "@/lib/crm/db";
import { ensureCrmSeed } from "@/lib/crm/seed";
import { isPartnerRole, isStaff } from "@/lib/partners/access";
import { firstModulePath } from "@/lib/crm/modules";
import "../crm/crm.css";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Partner Portal | The KPI Plus",
};

export default async function PartnersLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-crm-path") || "/partners";
  if (pathname === "/partners/apply" || pathname === "/partners/login") {
    return <div className="crm-shell kpi-locale-th">{children}</div>;
  }

  if (!crmEnabled()) {
    return (
      <div className="crm-shell">
        <main className="crm-main">
          <div className="crm-card">
            <h1 className="text-2xl font-extrabold text-[#3B3B3B]">ยังไม่ได้ตั้งค่าฐานข้อมูล</h1>
            <p className="mt-3">ตั้ง `DATABASE_URL` แล้วรัน `npx prisma migrate deploy` ก่อนเข้าใช้งาน</p>
          </div>
        </main>
      </div>
    );
  }

  await ensureCrmSeed();
  const user = await currentUser();
  if (!user) redirect("/partners/login");
  if (isStaff(user)) redirect(firstModulePath(user));
  if (!isPartnerRole(user)) redirect("/partners/login");
  return (
    <PartnerShell pathname={pathname} userName={user.name}>
      {children}
    </PartnerShell>
  );
}
