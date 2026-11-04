import { existingPublicSrc } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const COVER_BG = "/images/insights/hotel-marketing-ota-listing-placeholder.webp";
const MAP_LABEL = "OTA Listing Quality Checklist — Sample";

const CHECKLIST = [
  {
    id: "photos",
    title: { th: "รูปโรงแรม/ห้องพักที่ได้รับอนุญาต", en: "Approved hotel / room photos" },
    detail: {
      th: "ใช้รูปจริงที่อนุมัติแล้ว — ไม่ใช้ภาพสมมติแทนห้องที่จองได้",
      en: "Use approved real photos — not invented imagery as bookable rooms",
    },
  },
  {
    id: "descriptions",
    title: { th: "คำอธิบายโรงแรมและห้องพัก", en: "Property and room descriptions" },
    detail: {
      th: "อธิบายจุดเด่นและข้อมูลหลักให้เข้าใจง่าย ไม่คลุมเครือ",
      en: "Clear description of strengths and key facts, without ambiguity",
    },
  },
  {
    id: "rooms",
    title: { th: "ประเภทห้องและจำนวนผู้เข้าพัก", en: "Room types and occupancy details" },
    detail: {
      th: "ชื่อห้อง ขนาดผู้เข้าพัก และสิ่งที่รวมในห้องชัดเจน",
      en: "Room names, occupancy, and what is included in the room",
    },
  },
  {
    id: "rates",
    title: { th: "Rate Plans สิ่งที่รวม และเงื่อนไข", en: "Rate plans, inclusions, and conditions" },
    detail: {
      th: "ราคา สิ่งที่รวม และเงื่อนไขตรงกับสิ่งที่ขายจริง",
      en: "Rates, inclusions, and conditions match what is actually sold",
    },
  },
  {
    id: "facilities",
    title: { th: "สิ่งอำนวยความสะดวกและที่ตั้ง", en: "Facilities and location information" },
    detail: {
      th: "สิ่งอำนวยความสะดวก ทำเล และการเดินทางที่ผู้เข้าพักควรรู้",
      en: "Facilities, location, and access details guests need to know",
    },
  },
  {
    id: "terms",
    title: { th: "เงื่อนไขยกเลิก/ชำระเงิน (ถ้ามี)", en: "Cancellation / payment terms, where relevant" },
    detail: {
      th: "แสดงเงื่อนไขที่สำคัญก่อนผู้เข้าพักตัดสินใจ",
      en: "Surface important terms before the guest decides",
    },
  },
  {
    id: "consistency",
    title: { th: "ความสอดคล้องข้ามช่องทาง", en: "Consistency across available channels" },
    detail: {
      th: "ข้อมูลหลักสอดคล้องกับเว็บไซต์และช่องทางอื่นที่มี",
      en: "Core facts stay aligned with the website and other active channels",
    },
  },
] as const;

const copy = {
  th: {
    label: MAP_LABEL,
    heading: "ตัวอย่างรายการตรวจสอบคุณภาพ Listing บน OTA",
    explain:
      "Conversion บน OTA ไม่ได้ขึ้นกับการลดราคาเพียงอย่างเดียว ความชัดของข้อมูล ความพร้อมขาย เงื่อนไข อัตรา และการเหมาะกับผู้เข้าพักล้วนมีผล",
    note: "ตัวอย่าง checklist · ไม่ใช่รายการลูกค้า · ไม่ใช่การรับรองจาก OTA",
    alt: "แผนภาพตัวอย่างรายการตรวจสอบคุณภาพ OTA Listing สำหรับโรงแรม ไม่ใช่ผลงานลูกค้า",
  },
  en: {
    label: MAP_LABEL,
    heading: "Sample OTA listing quality checklist",
    explain:
      "OTA conversion is not only about discounts. Clarity, availability, terms, rate, and guest fit all matter.",
    note: "Sample checklist · Not a client listing · Not an OTA endorsement",
    alt: "Sample OTA listing quality checklist for hotels. Not a client result.",
  },
} as const;

export function HotelMarketingOtaChecklist({ locale }: { locale: Locale }) {
  const ui = copy[locale === "th" ? "th" : "en"];
  const lang = locale === "th" ? "th" : "en";
  const backgroundSrc = existingPublicSrc(COVER_BG);

  return (
    <figure className="kpi-article-ota-checklist">
      <div className="kpi-article-ota-checklist-frame" role="img" aria-label={ui.alt}>
        {backgroundSrc ? (
          <img
            className="kpi-article-ota-checklist-bg"
            src={backgroundSrc}
            alt=""
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
        ) : null}

        <div className="kpi-article-ota-checklist-body">
          <p className="kpi-article-ota-checklist-kicker kpi-latin">{ui.label}</p>
          <p className={`kpi-article-ota-checklist-heading${locale === "th" ? "" : " kpi-latin"}`}>{ui.heading}</p>

          <ol className="kpi-article-ota-checklist-list">
            {CHECKLIST.map((item, index) => (
              <li key={item.id}>
                <span className="kpi-article-ota-checklist-num kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className={`kpi-article-ota-checklist-title${locale === "th" ? "" : " kpi-latin"}`}>{item.title[lang]}</p>
                  <p className={`kpi-article-ota-checklist-detail${locale === "th" ? "" : " kpi-latin"}`}>{item.detail[lang]}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className={`kpi-article-ota-checklist-explain${locale === "th" ? "" : " kpi-latin"}`}>{ui.explain}</p>
          <p className={`kpi-article-ota-checklist-note${locale === "th" ? "" : " kpi-latin"}`}>{ui.note}</p>
        </div>
      </div>
      <figcaption className="sr-only">{ui.alt}</figcaption>
    </figure>
  );
}
