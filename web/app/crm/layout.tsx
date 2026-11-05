import { headers } from "next/headers";
import { Suspense } from "react";
import { CrmShell } from "@/components/crm/CrmShell";
import { CrmThemeScript } from "@/components/crm/CrmThemeScript";
import { requireUser } from "@/lib/crm/auth";
import { isPartnerRole, isStaff } from "@/lib/partners/access";
import { redirect } from "next/navigation";
import { crmEnabled, prisma } from "@/lib/crm/db";
import { allowedModules, firstModulePath, hasModule, moduleForPath } from "@/lib/crm/modules";
import { staffDirectory } from "@/lib/crm/queries";
import { roleLabel } from "@/lib/crm/roles";
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
    return (
      <>
        <CrmThemeScript />
        <div className="crm-shell kpi-locale-th">{children}</div>
      </>
    );
  }

  if (!crmEnabled()) {
    return (
      <>
        <CrmThemeScript />
        <div className="crm-shell">
          <main className="crm-main">
            <div className="crm-card">
              <h1 className="text-2xl font-extrabold text-[#3B3B3B]">ยังไม่ได้ตั้งค่าฐานข้อมูล</h1>
              <p className="mt-3">ตั้ง `DATABASE_URL` แล้วรัน `npm run crm:setup` ก่อนเข้าใช้งาน</p>
            </div>
          </main>
        </div>
      </>
    );
  }

  try {
    await ensureCrmSeed();
  } catch {
    // Keep the admin shell available while optional partner tables catch up.
  }

  let user: Awaited<ReturnType<typeof requireUser>>;
  try {
    user = await requireUser();
  } catch (error) {
    const digest = typeof error === "object" && error && "digest" in error ? String((error as { digest: unknown }).digest) : "";
    if (digest.includes("NEXT_REDIRECT")) throw error;
    return (
      <>
        <CrmThemeScript />
        <div className="crm-shell kpi-locale-th">
          <main className="crm-main">
            <div className="crm-card">
              <h1 className="text-2xl font-extrabold text-[#3B3B3B]">เชื่อมต่อฐานข้อมูลไม่ได้ชั่วคราว</h1>
              <p className="mt-3">
                MySQL ถึงขีดจำกัดการเชื่อมต่อรายชั่วโมงแล้ว หรือเซิร์ฟเวอร์ฐานข้อมูลยังไม่พร้อม ลองใหม่อีกครั้งในอีกสักครู่
                หรือออกจากระบบแล้วเข้าใหม่ผ่าน /admin
              </p>
            </div>
          </main>
        </div>
      </>
    );
  }
  if (isPartnerRole(user)) redirect("/partners");
  if (!isStaff(user)) redirect("/admin");
  const modules = allowedModules(user);
  const needed = moduleForPath(pathname);
  if (needed && !hasModule(user, needed)) redirect(firstModulePath(user));

  const leadForm = hasModule(user, "leads")
    ? await Promise.all([
        prisma()
          .partner.findMany({
            where: { status: { in: ["active", "pending"] } },
            orderBy: { displayName: "asc" },
            select: { id: true, displayName: true, tier: true },
          })
          .catch(() => [] as { id: string; displayName: string; tier: string }[]),
        staffDirectory().catch(() => [] as Awaited<ReturnType<typeof staffDirectory>>),
      ]).then(([partners, owners]) => ({
        partners,
        owners: owners.map((owner) => ({ id: owner.id, name: owner.name })),
        currentUserId: user.id,
      }))
    : undefined;

  return (
    <>
      <CrmThemeScript />
      <Suspense fallback={<div className="crm-shell kpi-locale-th">{children}</div>}>
        <CrmShell
          userName={user.name}
          userRole={roleLabel(user.role)}
          modules={modules}
          showLogout
          leadForm={leadForm}
          partnerModal={hasModule(user, "partners")}
        >
          {children}
        </CrmShell>
      </Suspense>
    </>
  );
}
