import { headers } from "next/headers";
import { Suspense } from "react";
import { CrmShell } from "@/components/crm/CrmShell";
import { requireUser } from "@/lib/crm/auth";
import { isPartnerRole, isStaff } from "@/lib/partners/access";
import { redirect } from "next/navigation";
import { crmEnabled } from "@/lib/crm/db";
import { allowedModules, firstModulePath, hasModule, moduleForPath } from "@/lib/crm/modules";
import { ensureCrmSeed } from "@/lib/crm/seed";
import "./crm.css";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Admin | The KPI Plus",
};

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get("x-crm-path") || "/crm";
  const publicPath = ["/crm/login", "/crm/forgot", "/crm/reset"].some((path) => pathname.startsWith(path));

  if (publicPath) {
    return <div className="crm-shell kpi-locale-th">{children}</div>;
  }

  if (!crmEnabled()) {
    return (
      <div className="crm-shell">
        <main className="crm-main">
          <div className="crm-card">
            <h1 className="text-2xl font-extrabold text-[#3B3B3B]">ยังไม่ได้ตั้งค่าฐานข้อมูล</h1>
            <p className="mt-3">ตั้ง `DATABASE_URL` แล้วรัน `npm run crm:setup` ก่อนเข้าใช้งาน</p>
          </div>
        </main>
      </div>
    );
  }

  try {
    await ensureCrmSeed();
  } catch {
    // Keep the admin shell available while optional partner tables catch up.
  }
  const user = await requireUser();
  if (isPartnerRole(user)) redirect("/partners");
  if (!isStaff(user)) redirect("/admin");
  const modules = allowedModules(user);
  const needed = moduleForPath(pathname);
  if (needed && !hasModule(user, needed)) redirect(firstModulePath(user));
  return (
    <Suspense fallback={<div className="crm-shell kpi-locale-th">{children}</div>}>
      <CrmShell userName={user.name} modules={modules} showLogout>
        {children}
      </CrmShell>
    </Suspense>
  );
}
