import { ClickToLoadMap } from "@/components/ClickToLoadMap";
import { EnquiryForm } from "@/components/EnquiryForm";
import { HeroCta } from "@/components/HeroCta";
import { SiteShell } from "@/components/SiteShell";
import { type Locale } from "@/lib/seo";

export const OFFICE_MAPS = {
  share: "https://maps.app.goo.gl/NH9nL4gnbEPNDrKHA",
  embed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.1730606366514!2d98.37976420000001!3d7.876953599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30502f58d4421b81%3A0xe198314f812e6886!2sThe%20KPI%20Plus%20Co.%2C%20Ltd.!5e0!3m2!1sen!2sth!4v1790311990658!5m2!1sen!2sth",
} as const;

const copy = {
  th: {
    eyebrow: "เริ่มต้นบทสนทนา",
    titleLead: "เห็นข้อมูลให้ชัด",
    titleRest: "แล้วเลือกสิ่งที่ควรทำต่อ",
    title: "เห็นข้อมูลให้ชัด แล้วเลือกสิ่งที่ควรทำต่อ",
    lead: "พูดคุยกับ เดอะ เคพีไอ พลัส เรื่องรายได้ Demand การจองตรง การมองเห็นบนออนไลน์ เทคโนโลยี และการลงมือทำเพื่อเพิ่มรายได้และการเติบโตของโรงแรม",
    officeEyebrow: "สำนักงานภูเก็ต",
    locationEyebrow: "ที่ตั้งสำนักงาน",
    office: "เดอะ เคพีไอ พลัส, ภูเก็ต",
    address: "58/15 ถนนเจ้าฟ้าตะวันออก ตำบลตลาดเหนือ อำเภอเมืองภูเก็ต จังหวัดภูเก็ต 83000 ประเทศไทย",
    addressEn: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    company: "บริษัท เดอะ เคพีไอ พลัส จำกัด · Tax ID 0835564008629",
    directLabel: "ติดต่อโดยตรง",
    mapTitle: "แผนที่สำนักงาน เดอะ เคพีไอ พลัส",
    openMap: "เปิดใน Google Maps",
    formTitle: "ส่งข้อความถึงทีม",
    formBody: "กรอกเฉพาะข้อมูลที่จำเป็น ทีมจะติดต่อกลับเพื่อถามรายละเอียดต่อหากต้องการ",
  },
  en: {
    eyebrow: "Start the conversation",
    titleLead: "Find the signal.",
    titleRest: "Make the move.",
    title: "Find the signal. Make the move.",
    lead: "Contact The KPI Plus for a focused conversation about hotel revenue, demand, direct booking, local presence, technology, and commercial execution.",
    officeEyebrow: "Phuket Office",
    locationEyebrow: "Location",
    office: "The KPI Plus, Phuket",
    address: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    addressEn: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    company: "The KPI Plus Co., Ltd. · Tax ID 0835564008629",
    directLabel: "Direct contact",
    mapTitle: "Map of The KPI Plus office",
    openMap: "Open in Google Maps",
    formTitle: "Send a message to the team",
    formBody: "Share only what is needed to start. The team will ask for more detail later if useful.",
  },
  ru: {
    eyebrow: "Начать разговор",
    titleLead: "Find the signal.",
    titleRest: "Make the move.",
    title: "Find the signal. Make the move.",
    lead: "Свяжитесь с The KPI Plus, чтобы обсудить доход отеля, спрос, прямые бронирования, локальный поиск, технологии и коммерческое исполнение.",
    officeEyebrow: "Phuket Office",
    locationEyebrow: "Location",
    office: "The KPI Plus, Пхукет",
    address: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    addressEn: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    company: "The KPI Plus Co., Ltd. · Tax ID 0835564008629",
    directLabel: "Прямой контакт",
    mapTitle: "Карта офиса The KPI Plus",
    openMap: "Открыть в Google Maps",
    formTitle: "Написать команде",
    formBody: "Укажите только необходимое для старта. Команда уточнит детали позже, если нужно.",
  },
  zh: {
    eyebrow: "開始對話",
    titleLead: "Find the signal.",
    titleRest: "Make the move.",
    title: "Find the signal. Make the move.",
    lead: "聯絡 The KPI Plus，討論酒店收益、需求、直訂、在地搜尋、科技與商業執行。",
    officeEyebrow: "Phuket Office",
    locationEyebrow: "Location",
    office: "The KPI Plus，普吉",
    address: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    addressEn: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    company: "The KPI Plus Co., Ltd. · Tax ID 0835564008629",
    directLabel: "直接聯絡",
    mapTitle: "The KPI Plus 辦公室地圖",
    openMap: "在 Google Maps 開啟",
    formTitle: "傳送訊息給團隊",
    formBody: "先填啟動所需資料即可，若有需要團隊稍後再補問細節。",
  },
} as const;

export function ContactView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const isTh = locale === "th";

  return (
    <SiteShell locale={locale} route={locale === "th" ? "/contact" : `/${locale}/contact`}>
      <section className="kpi-hero kpi-home-hero-section kpi-contact-hero">
        <div className="kpi-wrap">
          <div className="kpi-home-hero kpi-contact-hero-grid">
            <div className="kpi-home-hero-copy">
              <p className={`kpi-home-eyebrow${isTh ? "" : " kpi-latin"}`}>{t.eyebrow}</p>
              <h1 className="kpi-h1 kpi-home-h1 kpi-contact-hero-title">
                <span className="kpi-home-h1-lead">{t.titleLead}</span>
                <span className="kpi-home-h1-rest kpi-home-accent">{t.titleRest}</span>
              </h1>
              <p className="kpi-lead kpi-home-lead">{t.lead}</p>
              <div className="kpi-actions">
                <HeroCta locale={locale} className="" />
                <a href="tel:+66826356266" className="kpi-button-ghost">
                  +66 82 635 6266
                </a>
                <a href="mailto:info@thekpiplus.com" className="kpi-button-ghost">
                  info@thekpiplus.com
                </a>
              </div>
            </div>

            <aside className="kpi-contact-hero-card" aria-label={t.office}>
              <p className={`kpi-contact-hero-card-eyebrow${isTh ? "" : " kpi-latin"}`}>{t.officeEyebrow}</p>
              <h2 className="kpi-contact-hero-card-title">{t.office}</h2>
              <p className="kpi-contact-hero-card-address">{t.address}</p>
              {t.address !== t.addressEn ? (
                <p className="kpi-contact-hero-card-address-en kpi-latin">{t.addressEn}</p>
              ) : null}
              <div className="kpi-contact-hero-card-links">
                <a href="tel:+66826356266">+66 82 635 6266</a>
                <a href="mailto:info@thekpiplus.com">info@thekpiplus.com</a>
              </div>
              <p className="kpi-contact-hero-card-company">{t.company}</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="kpi-contact-main">
        <div className="kpi-section kpi-contact-main-grid">
          <div className="kpi-contact-location">
            <p className={`kpi-contact-eyebrow${isTh ? "" : " kpi-latin"}`}>{t.locationEyebrow}</p>
            <h2 className="kpi-h2 kpi-contact-h2">{t.office}</h2>
            <div className="kpi-contact-map-panel">
              <ClickToLoadMap locale={locale === "th" ? "th" : "en"} title={t.mapTitle} embedSrc={OFFICE_MAPS.embed} />
              <p className="kpi-contact-map-cta">
                <a href={OFFICE_MAPS.share} target="_blank" rel="noreferrer">
                  {t.openMap} <span aria-hidden="true">↗</span>
                </a>
              </p>
            </div>
            <p className="kpi-contact-location-address">{t.address}</p>
            {t.address !== t.addressEn ? (
              <p className="kpi-contact-location-address-en kpi-latin">{t.addressEn}</p>
            ) : null}
            <div className="kpi-contact-direct">
              <p className="kpi-contact-direct-label">{t.directLabel}</p>
              <a href="mailto:info@thekpiplus.com">info@thekpiplus.com</a>
              <a href="tel:+66826356266">+66 82 635 6266</a>
            </div>
          </div>

          <EnquiryForm
            locale={locale}
            compact
            showAssessmentNote
            title={t.formTitle}
            body={t.formBody}
            sectionId="contact-enquiry"
          />
        </div>
      </section>
    </SiteShell>
  );
}
