import { LoginForm } from "@/components/crm/LoginForm";
import { currentUser } from "@/lib/crm/auth";
import { crmEnabled } from "@/lib/crm/db";
import { ensureCrmSeed } from "@/lib/crm/seed";
import { redirect } from "next/navigation";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!crmEnabled()) {
    return (
      <div className="crm-auth">
        <aside className="crm-auth-brand" aria-hidden="true">
          <div className="crm-auth-brand-inner">
            <p className="crm-auth-kicker">The KPI Plus</p>
            <h2 className="crm-auth-headline">Admin Workspace</h2>
            <p className="crm-auth-copy">ต้องตั้งค่าฐานข้อมูลก่อนเข้าใช้งานระบบแอดมิน</p>
          </div>
        </aside>
        <div className="crm-auth-panel">
          <div className="crm-auth-card">
            <h1 className="crm-auth-title">ยังไม่ได้ตั้งค่าฐานข้อมูล</h1>
            <p className="crm-auth-lead">ตั้ง `DATABASE_URL` แล้วรีสตาร์ทเซิร์ฟเวอร์</p>
          </div>
        </div>
      </div>
    );
  }

  try {
    await ensureCrmSeed();
  } catch {
    // Show the form even if seed is incomplete; login action will retry.
  }
  const user = await currentUser().catch(() => null);
  if (user) redirect(user.role === "partner" || user.role === "partners" ? "/partners" : "/crm");
  const { error } = await searchParams;
  return <LoginForm error={error} />;
}
