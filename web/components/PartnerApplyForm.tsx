import { FormPrivacyNotice } from "@/components/FormPrivacyNotice";

const BUSINESS_TYPES = [
  "โรงแรม/ที่พัก",
  "ที่ปรึกษาธุรกิจโรงแรม",
  "เทคโนโลยีโรงแรม",
  "การตลาด/เอเจนซี",
  "ท่องเที่ยว",
  "ผู้ดูแลอสังหาริมทรัพย์",
  "ผู้ประกอบอาชีพอิสระ",
  "อื่น ๆ",
];

const EXPERIENCE = ["น้อยกว่า 2 ปี", "2–5 ปี", "6–10 ปี", "มากกว่า 10 ปี"];

const INTERESTS = [
  "แนะนำลูกค้า",
  "ช่วยพูดคุยและนำเสนอบริการ",
  "ร่วมงานด้านการขายและเริ่มให้บริการ",
  "ยังไม่แน่ใจ",
];

const SEGMENTS = ["โรงแรม", "รีสอร์ท", "วิลล่า", "โฮสเทล", "บริษัทบริหารที่พัก", "อื่น ๆ"];

export function PartnerApplyForm({ sent, error }: { sent?: boolean; error?: string }) {
  return (
    <form action="/api/partner-apply" method="post" id="apply" className="kpi-card p-7 sm:p-8">
      <h2 className="kpi-h2">แบบฟอร์มสมัคร Partner</h2>
      <p className="mt-4 text-base leading-8 text-[#555555]">
        กรอกข้อมูลเบื้องต้นและตั้งรหัส 4 หลัก หลังส่งใบสมัครเข้า Partner Portal ได้ทันทีเพื่อคีย์ลีดและแนบบัตรประชาชน
        ค่าคอมมิชชั่นจะแสดงเมื่อโปรแกรมได้รับการอนุมัติ
      </p>

      {sent ? (
        <p className="mt-6 rounded-xl bg-[#F2F8E2] px-4 py-3 font-semibold text-[#0B1F33]">
          ส่งใบสมัครแล้ว เข้า Partner Portal ด้วยอีเมลและรหัส 4 หลักเพื่อคีย์ลีดได้เลย{" "}
          <a href="/partners/login" className="underline">
            เข้าสู่ระบบ
          </a>
        </p>
      ) : null}
      {error === "invalid" ? (
        <p className="mt-6 font-semibold text-[#0B1F33]">กรุณากรอกข้อมูลที่จำเป็นและยอมรับเงื่อนไขให้ครบ</p>
      ) : null}
      {error === "pin" ? (
        <p className="mt-6 font-semibold text-[#0B1F33]">กรุณาตั้งรหัสเข้าใช้งานเป็นตัวเลข 4 หลัก</p>
      ) : null}

      <fieldset className="mt-8 grid gap-4">
        <legend className="text-lg font-extrabold text-[#3B3B3B]">ข้อมูลติดต่อ</legend>
        <label className="block text-sm font-bold text-[#3B3B3B]">
          ชื่อ–นามสกุล *
          <input className="kpi-field" name="fullName" required />
        </label>
        <label className="block text-sm font-bold text-[#3B3B3B]">
          อีเมล *
          <input className="kpi-field" type="email" name="email" autoComplete="email" required />
        </label>
        <label className="block text-sm font-bold text-[#3B3B3B]">
          เบอร์โทรศัพท์ *
          <input className="kpi-field" name="phone" autoComplete="tel" required />
        </label>
        <label className="block text-sm font-bold text-[#3B3B3B]">
          ประเทศและพื้นที่ที่ทำงาน *
          <input className="kpi-field" name="territory" required />
        </label>
        <label className="block text-sm font-bold text-[#3B3B3B]">
          รหัสเข้าใช้งาน 4 หลัก *
          <input
            className="kpi-field"
            name="pin"
            inputMode="numeric"
            autoComplete="new-password"
            maxLength={4}
            pattern="\d{4}"
            required
          />
        </label>
        <p className="text-sm leading-7 text-[#555555]">ใช้ร่วมกับอีเมลเพื่อเข้า Partner Portal คีย์ลีด และแนบบัตรประชาชน</p>
      </fieldset>

      <fieldset className="mt-8 grid gap-4">
        <legend className="text-lg font-extrabold text-[#3B3B3B]">ข้อมูลการทำงาน</legend>
        <label className="block text-sm font-bold text-[#3B3B3B]">
          ชื่อบริษัทหรือธุรกิจ
          <input className="kpi-field" name="company" />
        </label>
        <label className="block text-sm font-bold text-[#3B3B3B]">
          ตำแหน่ง
          <input className="kpi-field" name="jobTitle" />
        </label>
        <label className="block text-sm font-bold text-[#3B3B3B]">
          เว็บไซต์หรือ LinkedIn
          <input className="kpi-field" name="website" />
        </label>
        <label className="block text-sm font-bold text-[#3B3B3B]">
          ประเภทธุรกิจ *
          <select className="kpi-field" name="businessType" required defaultValue="">
            <option value="" disabled>
              เลือกประเภท
            </option>
            {BUSINESS_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset className="mt-8 grid gap-4">
        <legend className="text-lg font-extrabold text-[#3B3B3B]">ประสบการณ์และความสนใจ</legend>
        <label className="block text-sm font-bold text-[#3B3B3B]">
          ประสบการณ์ในธุรกิจโรงแรมหรือธุรกิจที่เกี่ยวข้อง
          <select className="kpi-field" name="experience" defaultValue="">
            <option value="">เลือกช่วงเวลา</option>
            {EXPERIENCE.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-bold text-[#3B3B3B]">
          แนะนำตัวสั้น ๆ และเล่าว่าคุณรู้จักหรือทำงานกับธุรกิจที่พักในลักษณะใด
          <textarea className="kpi-field" name="intro" rows={4} />
        </label>
        <label className="block text-sm font-bold text-[#3B3B3B]">
          รูปแบบที่สนใจ
          <select className="kpi-field" name="interest" defaultValue="">
            <option value="">เลือกได้ถ้ามี</option>
            {INTERESTS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend className="text-sm font-bold text-[#3B3B3B]">กลุ่มธุรกิจที่คุณมีความสัมพันธ์ด้วย</legend>
          {SEGMENTS.map((item) => (
            <label key={item} className="mt-2 block text-sm text-[#555555]">
              <input type="checkbox" name="segments" value={item} className="mr-2" />
              {item}
            </label>
          ))}
        </fieldset>
      </fieldset>

      <label className="sr-only" aria-hidden="true">
        เว็บไซต์บริษัท
        <input name="company_website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="mt-6 block text-sm text-[#555555]">
        <input type="checkbox" name="accuracy" value="1" className="mr-2" required />
        ฉันยืนยันว่าข้อมูลในใบสมัครถูกต้อง
      </label>
      <label className="mt-3 block text-sm text-[#555555]">
        <input type="checkbox" name="terms" value="1" className="mr-2" required />
        ฉันได้อ่านและยอมรับ{" "}
        <a href="#terms" className="font-semibold text-[#0B6660]">
          เงื่อนไข Partner Program
        </a>{" "}
        และ{" "}
        <a href="/privacy" className="font-semibold text-[#0B6660]">
          นโยบายความเป็นส่วนตัว
        </a>{" "}
        ของ The KPI Plus
      </label>

      <FormPrivacyNotice locale="th" variant="partner" />
      <button className="kpi-button mt-7" type="submit">
        ส่งใบสมัคร
      </button>
      <p className="mt-4 text-sm leading-7 text-[#555555]">
        หลังส่งใบสมัครเข้า Partner Portal ได้ทันที ค่าคอมมิชชั่นจะแสดงเมื่อทีมอนุมัติโปรแกรม
      </p>
    </form>
  );
}
