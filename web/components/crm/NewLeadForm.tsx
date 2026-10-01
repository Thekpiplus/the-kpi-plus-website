import { createLeadAndOpen } from "@/lib/crm/actions";
import { SERVICES, SOURCES } from "@/lib/crm/constants";
import { sourceLabel } from "@/lib/crm/sources";

const KEY_SOURCES = SOURCES.filter((source) => source !== "website_form");

export function NewLeadForm({
  partners,
  owners,
  currentUserId,
  duplicateId,
  error,
}: {
  partners: { id: string; displayName: string; tier: string }[];
  owners: { id: string; name: string }[];
  currentUserId?: string;
  duplicateId?: string;
  error?: string;
}) {
  return (
    <form action={createLeadAndOpen} method="post" className="crm-card mx-auto max-w-xl">
      <h1 className="text-2xl font-extrabold text-[#3B3B3B]">คีย์ลีด</h1>
      <p className="mt-2 text-sm">บันทึกลีดจากโทร LINE WhatsApp งานอีเวนต์ คนรู้จัก หรือแหล่งอื่น แล้วตั้งติดตามต่อได้ทันที</p>
      {duplicateId ? (
        <p className="mt-4 font-semibold text-[#0B1F33]">
          พบบันทึกที่อาจซ้ำ{" "}
          <a className="underline" href={`/crm/leads/${duplicateId}`}>
            เปิดลีดเดิม
          </a>{" "}
          หรือกดบันทึกอีกครั้งเพื่อสร้างต่อ
        </p>
      ) : null}
      {error && !duplicateId ? <p className="mt-4 font-semibold text-[#0B1F33]">บันทึกลีดไม่สำเร็จ ตรวจชื่อผู้ติดต่อแล้วลองใหม่</p> : null}
      {duplicateId ? <input type="hidden" name="confirmDuplicate" value="1" /> : null}

      <label className="mt-5 block text-sm font-bold text-[#3B3B3B]">
        ชื่อผู้ติดต่อ *
        <input className="crm-field" name="contactName" required />
      </label>
      <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
        กิจการ
        <input className="crm-field" name="businessName" />
      </label>
      <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
        ประเภทกิจการ
        <input className="crm-field" name="businessType" />
      </label>
      <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
        เบอร์โทร
        <input className="crm-field" name="phone" />
      </label>
      <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
        อีเมล
        <input className="crm-field" name="email" type="email" />
      </label>
      <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
        ที่ตั้ง
        <input className="crm-field" name="location" />
      </label>
      <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
        เว็บไซต์
        <input className="crm-field" name="website" />
      </label>
      <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
        มอบหมายให้
        <select className="crm-select" name="ownerId" defaultValue={currentUserId ?? ""}>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
        แหล่งที่มา
        <select className="crm-select" name="source" defaultValue="manual">
          {KEY_SOURCES.map((source) => (
            <option key={source} value={source}>
              {sourceLabel(source)}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
        พาร์ตเนอร์ที่ได้รับเครดิต
        <select className="crm-select" name="partnerId" defaultValue="">
          <option value="">ไม่มี</option>
          {partners.map((partner) => (
            <option key={partner.id} value={partner.id}>
              {partner.displayName}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="mt-4">
        <legend className="text-sm font-bold text-[#3B3B3B]">บริการที่สนใจ</legend>
        {SERVICES.map((service) => (
          <label key={service} className="mt-2 block text-sm">
            <input type="checkbox" name="services" value={service} className="mr-2" />
            {service}
          </label>
        ))}
      </fieldset>
      <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
        มูลค่าโดยประมาณ
        <input className="crm-field" name="estimatedValue" type="number" min="0" />
      </label>
      <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
        บันทึกการคุยครั้งนี้
        <textarea className="crm-field" name="notes" rows={4} placeholder="คุยอะไรไปแล้ว ต้องติดตามเรื่องอะไร" />
      </label>
      <button className="kpi-button mt-6" type="submit">
        บันทึกลีดแล้วไปติดตาม
      </button>
    </form>
  );
}
