import { createPartner } from "@/lib/partners/actions";

export default function NewPartnerPage() {
  return (
    <div className="crm-grid">
      <h1 className="text-3xl font-extrabold text-[#3B3B3B]">เพิ่มพาร์ตเนอร์</h1>
      <form action={createPartner} className="crm-card mx-auto max-w-xl">
        <select className="crm-select" name="type" defaultValue="individual">
          <option value="individual">บุคคลธรรมดา</option>
          <option value="company">นิติบุคคล</option>
        </select>
        <input className="crm-field mt-3" name="legalName" placeholder="ชื่อตามเอกสาร" required />
        <input className="crm-field mt-3" name="displayName" placeholder="ชื่อที่แสดง" required />
        <input className="crm-field mt-3" name="email" type="email" required />
        <input className="crm-field mt-3" name="phone" placeholder="เบอร์โทร" required />
        <input className="crm-field mt-3" name="address" placeholder="ที่อยู่" />
        <input className="crm-field mt-3" name="taxId" placeholder="เลขผู้เสียภาษี" />
        <select className="crm-select mt-3" name="tier" defaultValue="referral">
          <option value="referral">Referral Partner</option>
          <option value="certified">Certified Partner</option>
          <option value="solution">Solution Partner</option>
        </select>
        <input className="crm-field mt-3" name="pin" inputMode="numeric" placeholder="PIN 4 หลัก" required />
        <button className="kpi-button mt-5" type="submit">
          สร้างพาร์ตเนอร์
        </button>
      </form>
    </div>
  );
}
