import { PartnerLoginForm } from "@/components/partners/PartnerLoginForm";
import { currentUser } from "@/lib/crm/auth";
import { crmEnabled } from "@/lib/crm/db";
import { ensureCrmSeed } from "@/lib/crm/seed";
import { firstModulePath } from "@/lib/crm/modules";
import { redirect } from "next/navigation";

export default async function PartnerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; applied?: string }>;
}) {
  if (!crmEnabled()) {
    return (
      <div className="crm-card mx-auto mt-16 max-w-md">
        <h1 className="text-2xl font-extrabold text-[#3B3B3B]">ยังไม่ได้ตั้งค่าฐานข้อมูล</h1>
        <p className="mt-3">ตั้ง `DATABASE_URL` แล้วรีสตาร์ทเซิร์ฟเวอร์</p>
      </div>
    );
  }

  try {
    await ensureCrmSeed();
  } catch {
    // Show the form even if seed is incomplete.
  }
  const user = await currentUser().catch(() => null);
  if (user?.role === "partner") redirect("/partners");
  if (user) redirect(firstModulePath(user));
  const { error, applied } = await searchParams;
  return <PartnerLoginForm error={error} applied={applied === "1"} />;
}
