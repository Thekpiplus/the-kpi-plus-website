import Link from "next/link";
import { formatThaiDateTime } from "@/lib/crm/queries";
import { findReferralMatches, reviewReferral } from "@/lib/partners/actions";
import { referralQueue, statusLabel, usersForAssign } from "@/lib/partners/queries";

export default async function ReferralReviewPage() {
  const [rows, users] = await Promise.all([referralQueue(), usersForAssign()]);
  const decorated = await Promise.all(
    rows.map(async (row) => ({
      row,
      matches: await findReferralMatches(row.businessName, row.phone, row.email),
    })),
  );
  return (
    <div className="crm-grid">
      <h1 className="text-3xl font-extrabold text-[#3B3B3B]">ตรวจ Referral</h1>
      {decorated.map(({ row, matches }) => (
        <section key={row.id} className="crm-card">
          <h2 className="text-xl font-extrabold">{row.businessName}</h2>
          <p className="text-sm">
            {row.partner.displayName} · {row.contactName} · {statusLabel(row.status)}
          </p>
          <p className="mt-2">{row.need}</p>
          {row.acceptedAt ? <p className="text-sm">คุ้มครองถึง {formatThaiDateTime(row.protectionEndsAt)}</p> : null}
          {matches.length ? (
            <div className="mt-3">
              <p className="font-bold">พบข้อมูลคล้ายใน CRM — ให้คนตรวจ ไม่ตัดสินอัตโนมัติ</p>
              <ul className="mt-1">
                {matches.slice(0, 5).map((match) => (
                  <li key={match.lead.id}>
                    <Link href={`/crm/leads/${match.lead.id}`} className="text-[#0B6660]">
                      {match.lead.businessName || match.lead.contactName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {row.status === "submitted" || row.status === "under_review" ? (
            <form action={reviewReferral} className="mt-4 grid gap-2 max-w-lg">
              <input type="hidden" name="referralId" value={row.id} />
              <select className="crm-select" name="ownerId" defaultValue={users[0]?.id}>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <textarea className="crm-field" name="creditNote" placeholder="หมายเหตุเครดิต" />
              <textarea className="crm-field" name="reason" placeholder="เหตุผลถ้าปฏิเสธ" />
              <button className="kpi-button" name="decision" value="accepted" type="submit">
                รับ Referral และคุ้มครอง 180 วัน
              </button>
              <button className="kpi-button" name="decision" value="rejected" type="submit">
                ปฏิเสธ
              </button>
            </form>
          ) : row.leadId ? (
            <Link href={`/crm/leads/${row.leadId}`} className="kpi-button mt-3 inline-flex">
              เปิดลีดใน CRM
            </Link>
          ) : null}
        </section>
      ))}
    </div>
  );
}
