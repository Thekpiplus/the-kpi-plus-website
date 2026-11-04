import { existingPublicSrc } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const COVER_BG = "/images/insights/hotel-marketing-seo-serp-placeholder.webp";
const MAP_LABEL = "Search Result / SEO Structure — Sample";

const PAGE_BLOCKS = [
  {
    id: "intent",
    title: { th: "ตอบคำถามการค้นหา", en: "Answer the search question" },
    detail: {
      th: "หัวข้อและย่อหน้าเปิดที่สอดคล้องกับคำถามของผู้เข้าพัก",
      en: "Headline and opening copy that match the guest’s question",
    },
  },
  {
    id: "property",
    title: { th: "อธิบายโรงแรม", en: "Explain the property" },
    detail: {
      th: "ทำเล กลุ่มผู้เข้าพัก ประเภทห้อง และจุดเด่นที่เกี่ยวข้อง",
      en: "Location, guest fit, room types, and relevant strengths",
    },
  },
  {
    id: "next",
    title: { th: "ชี้ทางไปจองต่อ", en: "Help the visitor continue" },
    detail: {
      th: "ลิงก์ไปห้องพัก ราคา/เงื่อนไข หรือเส้นทาง Booking ที่ชัด",
      en: "Clear path to rooms, rates/terms, or the booking flow",
    },
  },
] as const;

const copy = {
  th: {
    label: MAP_LABEL,
    queryLabel: "ตัวอย่างคำค้น (ไม่ใช่ผลลัพธ์จริง)",
    queryExample: "family hotel near beach",
    structureLabel: "โครงสร้างหน้าเว็บที่ช่วยตอบคำถาม",
    note: "ตัวอย่างโครงสร้าง · ไม่รับประกันอันดับ ทราฟฟิก หรือตำแหน่งบน AI Search",
    alt: "แผนภาพตัวอย่างโครงสร้าง SEO ที่หน้าเว็บตอบคำค้น อธิบายโรงแรม และชี้ทางไปจอง ไม่ใช่ผลงานลูกค้า",
  },
  en: {
    label: MAP_LABEL,
    queryLabel: "Sample search question (not a live result)",
    queryExample: "family hotel near beach",
    structureLabel: "Page structure that can answer the question",
    note: "Sample structure · Does not guarantee ranking, traffic, or AI Search placement",
    alt: "Sample SEO structure diagram: a hotel page answers a search question, explains the property, and points toward booking. Not a client result.",
  },
} as const;

export function HotelMarketingSeoStructure({ locale }: { locale: Locale }) {
  const ui = copy[locale === "th" ? "th" : "en"];
  const lang = locale === "th" ? "th" : "en";
  const backgroundSrc = existingPublicSrc(COVER_BG);

  return (
    <figure className="kpi-article-seo-structure">
      <div className="kpi-article-seo-structure-frame" role="img" aria-label={ui.alt}>
        {backgroundSrc ? (
          <img
            className="kpi-article-seo-structure-bg"
            src={backgroundSrc}
            alt=""
            width={1200}
            height={675}
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
        ) : null}

        <div className="kpi-article-seo-structure-body">
          <p className="kpi-article-seo-structure-kicker kpi-latin">{ui.label}</p>

          <div className="kpi-article-seo-structure-query">
            <p className={`kpi-article-seo-structure-query-label${locale === "th" ? "" : " kpi-latin"}`}>{ui.queryLabel}</p>
            <p className="kpi-article-seo-structure-query-example kpi-latin">
              <span aria-hidden="true">⌕</span> {ui.queryExample}
            </p>
          </div>

          <div className="kpi-article-seo-structure-page">
            <p className={`kpi-article-seo-structure-page-label${locale === "th" ? "" : " kpi-latin"}`}>{ui.structureLabel}</p>
            <ol className="kpi-article-seo-structure-blocks">
              {PAGE_BLOCKS.map((block, index) => (
                <li key={block.id}>
                  <span className="kpi-article-seo-structure-num kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className={`kpi-article-seo-structure-block-title${locale === "th" ? "" : " kpi-latin"}`}>
                      {block.title[lang]}
                    </p>
                    <p className={`kpi-article-seo-structure-block-detail${locale === "th" ? "" : " kpi-latin"}`}>
                      {block.detail[lang]}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <p className={`kpi-article-seo-structure-note${locale === "th" ? "" : " kpi-latin"}`}>{ui.note}</p>
        </div>
      </div>
      <figcaption className="sr-only">{ui.alt}</figcaption>
    </figure>
  );
}
