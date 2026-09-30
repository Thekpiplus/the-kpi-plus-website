import { currentUser } from "@/lib/crm/auth";
import { formatThaiDateTime } from "@/lib/crm/queries";
import { portalSubmitBank, portalUploadDocument, updatePartnerProfile } from "@/lib/partners/actions";
import { partnerPortalData, statusLabel } from "@/lib/partners/queries";
import { redirect } from "next/navigation";

const DOC_KIND: Record<string, string> = {
  id_card: "บัตรประชาชน",
  tax: "เอกสารภาษี",
  book_bank: "หน้าบัญชีธนาคาร",
  other: "เอกสารอื่น",
};

export default async function PartnerProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/partners/login");
  const partner = await partnerPortalData(user.id);
  if (!partner) redirect("/partners");
  const { saved, error } = await searchParams;

  return (
    <div className="crm-grid">
      <h1 className="text-3xl font-extrabold text-[#3B3B3B]">โปรไฟล์และเอกสาร</h1>
      <p>
        สถานะโปรแกรม {statusLabel(partner.status)} · เอกสาร {statusLabel(partner.kycStatus)}
        {partner.taxIdLast4 ? ` · เลขท้าย ${partner.taxIdLast4}` : ""}
      </p>
      {saved === "1" ? <p className="crm-card font-semibold text-[#063F3B]">บันทึกแล้ว ข้อมูลส่วนตัวรอทีมตรวจก่อนแทนที่ของเดิม</p> : null}
      {error === "file" ? (
        <p className="crm-card font-semibold text-[#063F3B]">อัปโหลดได้เฉพาะ PDF หรือรูป JPEG/PNG ขนาดไม่เกิน 8MB</p>
      ) : null}

      <form action={updatePartnerProfile} className="crm-card mx-auto w-full max-w-xl">
        <h2 className="text-lg font-extrabold">ข้อมูลติดต่อ</h2>
        <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
          ชื่อที่แสดง
          <input className="crm-field" name="displayName" defaultValue={partner.displayName} required />
        </label>
        <label className="mt-3 block text-sm font-bold text-[#3B3B3B]">
          ชื่อตามบัตรหรือเอกสาร
          <input className="crm-field" name="legalName" defaultValue={partner.legalName} />
        </label>
        <label className="mt-3 block text-sm font-bold text-[#3B3B3B]">
          เบอร์โทร
          <input className="crm-field" name="phone" defaultValue={partner.phone} required />
        </label>
        <label className="mt-3 block text-sm font-bold text-[#3B3B3B]">
          อีเมล
          <input className="crm-field" type="email" name="email" defaultValue={partner.email} required />
        </label>
        <label className="mt-3 block text-sm font-bold text-[#3B3B3B]">
          ที่อยู่
          <input className="crm-field" name="address" defaultValue={partner.address} />
        </label>
        <label className="mt-3 block text-sm font-bold text-[#3B3B3B]">
          เลขบัตรประชาชน หรือเลขผู้เสียภาษี
          <input className="crm-field" name="taxId" inputMode="numeric" placeholder={partner.taxIdLast4 ? `ลงท้าย ${partner.taxIdLast4}` : ""} />
        </label>
        <p className="mt-2 text-sm">ตัวเลขเต็มถูกเข้ารหัส ทีมเห็นเฉพาะหลังตรวจแล้ว</p>
        <button className="kpi-button mt-5" type="submit">
          บันทึกโปรไฟล์
        </button>
      </form>

      <form action={portalUploadDocument} className="crm-card mx-auto w-full max-w-xl" encType="multipart/form-data">
        <h2 className="text-lg font-extrabold">บัตรประชาชนและเอกสาร</h2>
        <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
          ประเภท
          <select className="crm-select" name="kind" defaultValue="id_card">
            <option value="id_card">บัตรประชาชน</option>
            <option value="book_bank">หน้าบัญชีธนาคาร</option>
            <option value="tax">เอกสารภาษี</option>
            <option value="other">อื่น ๆ</option>
          </select>
        </label>
        <label className="mt-3 block text-sm font-bold text-[#3B3B3B]">
          ไฟล์ PDF หรือรูป
          <input className="crm-field" type="file" name="file" accept="application/pdf,image/jpeg,image/png" required />
        </label>
        <button className="kpi-button mt-5" type="submit">
          อัปโหลด
        </button>
        {partner.documents.length ? (
          <ul className="mt-5 grid gap-2 text-sm">
            {partner.documents.map((doc) => (
              <li key={doc.id}>
                {DOC_KIND[doc.kind] ?? doc.kind} · {formatThaiDateTime(doc.createdAt)}
              </li>
            ))}
          </ul>
        ) : null}
      </form>

      <form action={portalSubmitBank} className="crm-card mx-auto w-full max-w-xl">
        <h2 className="text-lg font-extrabold">บัญชีธนาคารสำหรับรับเงิน</h2>
        <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
          ธนาคาร
          <input className="crm-field" name="bankName" required />
        </label>
        <label className="mt-3 block text-sm font-bold text-[#3B3B3B]">
          ชื่อบัญชี
          <input className="crm-field" name="accountName" required />
        </label>
        <label className="mt-3 block text-sm font-bold text-[#3B3B3B]">
          เลขบัญชี
          <input className="crm-field" name="accountNumber" inputMode="numeric" required />
        </label>
        <button className="kpi-button mt-5" type="submit">
          ส่งบัญชีธนาคาร
        </button>
        {partner.banks.length ? (
          <ul className="mt-5 grid gap-2 text-sm">
            {partner.banks.map((bank) => (
              <li key={bank.id}>
                {bank.bankName} · {bank.accountName} · ****{bank.accountLast4} · {statusLabel(bank.status)}
              </li>
            ))}
          </ul>
        ) : null}
      </form>
    </div>
  );
}
