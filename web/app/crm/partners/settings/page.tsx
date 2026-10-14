import Link from "next/link";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { prisma } from "@/lib/crm/db";
import { saveRule } from "@/lib/partners/actions";
import { DEFAULT_RULE, parseRule } from "@/lib/partners/rules";

export default async function PartnerSettingsPage() {
  const row = await prisma().commissionRule.findFirst({ where: { active: true }, orderBy: { version: "desc" } });
  const rule = row ? parseRule(row.payload) : DEFAULT_RULE;

  return (
    <div className="crm-partners">
      <PageHeader
        eyebrow="Partner Management"
        title="กติกาค่าคอมมิชชัน"
        description="เผยแพร่เวอร์ชันกติกาใหม่โดยไม่ย้อนแก้ยอดที่อนุมัติแล้ว"
        actions={
          <div className="crm-partners-actions">
            <Link href="/crm/partners" className="crm-users-secondary">
              คิวงาน
            </Link>
            <Link href="/crm/partners/commissions" className="crm-users-secondary">
              ค่าคอม
            </Link>
          </div>
        }
      />

      <section className="crm-partners-panel crm-partners-form-panel">
        <div className="crm-partners-panel-head">
          <div>
            <h2>กติกาปัจจุบัน</h2>
            <p>เวอร์ชัน {rule.version} · การเปลี่ยนจะสร้างเวอร์ชันใหม่</p>
          </div>
        </div>

        <form action={saveRule} className="crm-partners-form">
          <label>
            สัญญาขั้นต่ำ (เดือน)
            <input className="crm-field" name="minContractMonths" defaultValue={rule.minContractMonths} />
          </label>
          <label>
            ระยะคุ้มครอง (วัน)
            <input className="crm-field" name="protectionDays" defaultValue={rule.protectionDays} />
          </label>
          <label>
            ยอดจ่ายขั้นต่ำ (บาท)
            <input className="crm-field" name="payoutMin" defaultValue={rule.payoutMinSatang / 100} />
          </label>
          <label>
            จ่ายภายในวันที่ของเดือนถัดไป
            <input className="crm-field" name="payoutDay" defaultValue={rule.payoutDay} />
          </label>

          <div className="crm-partners-rule-note">
            <p>รายการที่ไม่เข้าเงื่อนไข</p>
            <ul>
              {rule.ineligibleLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>

          <div className="crm-partners-form-actions">
            <button className="kpi-button" type="submit">
              เผยแพร่กติกาเวอร์ชันใหม่
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
