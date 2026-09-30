import { createPayoutBatch, markPayoutPaid } from "@/lib/partners/actions";
import { maskAccount } from "@/lib/partners/access";
import { formatBaht } from "@/lib/partners/money";
import { partnerList, payoutQueue, statusLabel } from "@/lib/partners/queries";

export default async function PayoutsPage() {
  const [payouts, partners] = await Promise.all([payoutQueue(), partnerList()]);
  return (
    <div className="crm-grid">
      <h1 className="text-3xl font-extrabold text-[#3B3B3B]">Payouts</h1>
      <form action={createPayoutBatch} className="crm-card max-w-lg">
        <h2 className="text-xl font-extrabold">สร้างรอบจ่ายจากรายการที่อนุมัติแล้ว</h2>
        <select className="crm-select mt-3" name="partnerId" required>
          {partners.map((partner) => (
            <option key={partner.id} value={partner.id}>
              {partner.displayName} · ค้าง {partner.outstandingLabel}
            </option>
          ))}
        </select>
        <input className="crm-field mt-3" type="date" name="dueDate" />
        <input className="crm-field mt-3" name="withholding" placeholder="หัก ณ ที่จ่าย (บาท) — ให้การเงินระบุเอง" />
        <button className="kpi-button mt-4" type="submit">
          รวมรอบจ่าย
        </button>
      </form>
      {payouts.map((payout) => {
        const bank = JSON.parse(payout.bankSnapshot || "{}") as { bankName?: string; accountLast4?: string };
        return (
          <section key={payout.id} className="crm-card">
            <h2 className="text-xl font-extrabold">{payout.partner.displayName}</h2>
            <p className="text-sm">
              {statusLabel(payout.status)} · สุทธิ {formatBaht(payout.netSatang)} ·{" "}
              {bank.bankName} {maskAccount(bank.accountLast4 ?? "")}
            </p>
            {payout.status === "carried" ? <p className="mt-2 font-bold">ยังไม่ถึงขั้นต่ำ 1,000 บาท ยกไปเดือนถัดไป</p> : null}
            {payout.status === "ready" ? (
              <form action={markPayoutPaid} className="mt-3 grid gap-2 max-w-lg">
                <input type="hidden" name="payoutId" value={payout.id} />
                <input className="crm-field" name="method" placeholder="วิธีจ่าย" defaultValue="bank_transfer" />
                <input className="crm-field" name="reference" placeholder="เลขอ้างอิง" />
                <button className="kpi-button" type="submit">
                  บันทึกว่าจ่ายแล้วหลังโอนจริง
                </button>
              </form>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
