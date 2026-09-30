import { prisma } from "@/lib/crm/db";
import { saveRule } from "@/lib/partners/actions";
import { DEFAULT_RULE, parseRule } from "@/lib/partners/rules";

export default async function PartnerSettingsPage() {
  const row = await prisma().commissionRule.findFirst({ where: { active: true }, orderBy: { version: "desc" } });
  const rule = row ? parseRule(row.payload) : DEFAULT_RULE;
  return (
    <div className="crm-grid">
      <h1 className="text-3xl font-extrabold text-[#3B3B3B]">กติกาค่าคอมมิชชัน</h1>
      <form action={saveRule} className="crm-card max-w-xl">
        <p className="text-sm">เวอร์ชันปัจจุบัน {rule.version} — การเปลี่ยนกติกาไม่ย้อนแก้ยอดที่อนุมัติแล้ว</p>
        <label className="mt-4 block text-sm font-bold">
          สัญญาขั้นต่ำ (เดือน)
          <input className="crm-field" name="minContractMonths" defaultValue={rule.minContractMonths} />
        </label>
        <label className="mt-4 block text-sm font-bold">
          ระยะคุ้มครอง (วัน)
          <input className="crm-field" name="protectionDays" defaultValue={rule.protectionDays} />
        </label>
        <label className="mt-4 block text-sm font-bold">
          ยอดจ่ายขั้นต่ำ (บาท)
          <input className="crm-field" name="payoutMin" defaultValue={rule.payoutMinSatang / 100} />
        </label>
        <label className="mt-4 block text-sm font-bold">
          จ่ายภายในวันที่ของเดือนถัดไป
          <input className="crm-field" name="payoutDay" defaultValue={rule.payoutDay} />
        </label>
        <p className="mt-4 text-sm">รายการที่ไม่เข้าเงื่อนไข: {rule.ineligibleLabels.join(", ")}</p>
        <button className="kpi-button mt-5" type="submit">
          เผยแพร่กติกาเวอร์ชันใหม่
        </button>
      </form>
    </div>
  );
}
