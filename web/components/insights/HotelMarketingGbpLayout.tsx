import { existingPublicSrc } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const COVER_BG = "/images/insights/hotel-marketing-google-maps-placeholder.webp";
const MAP_LABEL = "Google Business Profile Example — Sample";

const CHECKLIST = [
  {
    id: "category",
    title: { th: "หมวดธุรกิจและตำแหน่งที่ตั้ง", en: "Business category and location" },
    detail: {
      th: "ประเภทธุรกิจและพิกัดที่สอดคล้องกับโรงแรมจริง",
      en: "Category and map pin that match the real property",
    },
  },
  {
    id: "contact",
    title: { th: "ข้อมูลติดต่อและเว็บไซต์", en: "Hotel contact details and website" },
    detail: {
      th: "เบอร์โทร อีเมล และลิงก์เว็บไซต์ที่ตรวจสอบได้",
      en: "Phone, email, and website link that can be verified",
    },
  },
  {
    id: "photos",
    title: { th: "รูปห้องพัก/โรงแรม", en: "Room / property photos" },
    detail: {
      th: "ใช้เฉพาะรูปจริงที่ได้รับอนุญาต — ไม่ใช้ภาพสมมติเป็นหลักฐาน",
      en: "Use approved real photos only — not invented imagery as evidence",
    },
  },
  {
    id: "consistency",
    title: { th: "ความสอดคล้องของข้อมูลธุรกิจ", en: "Business information consistency" },
    detail: {
      th: "ชื่อ ที่อยู่ เวลาทำการ และรายละเอียดตรงกับช่องทางอื่น",
      en: "Name, address, hours, and details match other channels",
    },
  },
  {
    id: "reviews",
    title: { th: "รีวิวและข้อเสนอแนะจากผู้เข้าพัก", en: "Reviews and guest feedback" },
    detail: {
      th: "แนวทางดูแลรีวิว — ไม่แสดงรีวิวลูกค้าจริงโดยไม่ได้รับอนุญาต",
      en: "Review handling guidance — do not show real guest reviews without permission",
    },
  },
  {
    id: "local",
    title: { th: "บริบท Local Search", en: "Local Search context" },
    detail: {
      th: "ข้อมูลที่ช่วยให้ผู้ค้นหาในพื้นที่เข้าใจโรงแรมก่อนตัดสินใจ",
      en: "Details that help local searchers understand the hotel before deciding",
    },
  },
] as const;

const copy = {
  th: {
    label: MAP_LABEL,
    heading: "ตัวอย่างรายการตรวจสอบ Business Profile",
    note: "ตัวอย่าง mockup · ไม่ใช่รายการลูกค้า · ไม่ใช่การรับรองจาก Google และไม่รับประกันอันดับ",
    policy: "หน้าจอและนโยบายของแพลตฟอร์มอาจเปลี่ยน — ควรตรวจสอบข้อมูลล่าสุดก่อนนำไปใช้",
    alt: "แผนภาพตัวอย่างรายการตรวจสอบ Google Business Profile สำหรับโรงแรม ไม่ใช่ผลงานลูกค้า",
  },
  en: {
    label: MAP_LABEL,
    heading: "Sample Business Profile checklist",
    note: "Sample mockup · Not a client listing · Not a Google endorsement and does not guarantee ranking",
    policy: "Platform interfaces and policies can change — recheck current guidance before acting",
    alt: "Sample Google Business Profile checklist for hotels. Not a client result.",
  },
} as const;

export function HotelMarketingGbpLayout({ locale }: { locale: Locale }) {
  const ui = copy[locale === "th" ? "th" : "en"];
  const lang = locale === "th" ? "th" : "en";
  const backgroundSrc = existingPublicSrc(COVER_BG);

  return (
    <figure className="kpi-article-gbp-layout">
      <div className="kpi-article-gbp-layout-frame" role="img" aria-label={ui.alt}>
        {backgroundSrc ? (
          <img
            className="kpi-article-gbp-layout-bg"
            src={backgroundSrc}
            alt=""
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
        ) : null}

        <div className="kpi-article-gbp-layout-body">
          <p className="kpi-article-gbp-layout-kicker kpi-latin">{ui.label}</p>
          <p className={`kpi-article-gbp-layout-heading${locale === "th" ? "" : " kpi-latin"}`}>{ui.heading}</p>

          <ol className="kpi-article-gbp-layout-list">
            {CHECKLIST.map((item, index) => (
              <li key={item.id}>
                <span className="kpi-article-gbp-layout-num kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className={`kpi-article-gbp-layout-title${locale === "th" ? "" : " kpi-latin"}`}>{item.title[lang]}</p>
                  <p className={`kpi-article-gbp-layout-detail${locale === "th" ? "" : " kpi-latin"}`}>{item.detail[lang]}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className={`kpi-article-gbp-layout-note${locale === "th" ? "" : " kpi-latin"}`}>{ui.note}</p>
          <p className={`kpi-article-gbp-layout-policy${locale === "th" ? "" : " kpi-latin"}`}>{ui.policy}</p>
        </div>
      </div>
      <figcaption className="sr-only">{ui.alt}</figcaption>
    </figure>
  );
}
