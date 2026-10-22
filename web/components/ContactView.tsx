import { ContactCard } from "@/components/ContactCard";
import { ContactChannels } from "@/components/ContactChannels";
import { ContactEnquiryForm } from "@/components/ContactEnquiryForm";
import { ContactLocationMap } from "@/components/ContactLocationMap";
import { ContactNextSteps } from "@/components/ContactNextSteps";
import { HeroCta } from "@/components/HeroCta";
import { SiteShell } from "@/components/SiteShell";
import { contactInfoFromCompany } from "@/lib/company";
import { getPublicCompany } from "@/lib/company-public";
import { localizePath, type Locale } from "@/lib/seo";

const copy = {
  th: {
    eyebrow: "เริ่มต้นบทสนทนา",
    titleLead: "เห็นข้อมูลให้ชัด",
    titleRest: "แล้วเลือกสิ่งที่ควรทำต่อ",
    lead: "พูดคุยกับ เดอะ เคพีไอ พลัส เรื่องรายได้ Demand การจองตรง การมองเห็นบนออนไลน์ เทคโนโลยี และการลงมือทำเพื่อเพิ่มรายได้และการเติบโตของโรงแรม",
    officeEyebrow: "สำนักงานภูเก็ต",
    locationEyebrow: "ที่ตั้งสำนักงาน",
    office: "เดอะ เคพีไอ พลัส, ภูเก็ต",
    mapTitle: "แผนที่สำนักงาน เดอะ เคพีไอ พลัส",
    openMap: "เปิดใน Google Maps",
    officePhotoAlt: "สำนักงาน เดอะ เคพีไอ พลัส",
    photoCaption: "สถานที่นัดหมายของ The KPI Plus — Phuket",
    photoPlaceholder: "Replace with verified office / meeting location photo",
    formTitle: "ส่งข้อความถึงทีม",
    formBody: "กรอกเฉพาะข้อมูลที่จำเป็น ทีมจะติดต่อกลับเพื่อถามรายละเอียดต่อหากต้องการ",
  },
  en: {
    eyebrow: "Start the conversation",
    titleLead: "Find the signal.",
    titleRest: "Make the move.",
    lead: "Contact The KPI Plus for a focused conversation about hotel revenue, demand, direct booking, local presence, technology, and commercial execution.",
    officeEyebrow: "Phuket Office",
    locationEyebrow: "Location",
    office: "The KPI Plus, Phuket",
    mapTitle: "Map of The KPI Plus office",
    openMap: "Open in Google Maps",
    officePhotoAlt: "The KPI Plus office",
    photoCaption: "The KPI Plus meeting location — Phuket",
    photoPlaceholder: "Replace with verified office / meeting location photo",
    formTitle: "Send a message to the team",
    formBody: "Share only what is needed to start. The team will ask for more detail later if useful.",
  },
  ru: {
    eyebrow: "Начать разговор",
    titleLead: "Find the signal.",
    titleRest: "Make the move.",
    lead: "Свяжитесь с The KPI Plus, чтобы обсудить доход отеля, спрос, прямые бронирования, локальный поиск, технологии и коммерческое исполнение.",
    officeEyebrow: "Phuket Office",
    locationEyebrow: "Location",
    office: "The KPI Plus, Пхукет",
    mapTitle: "Карта офиса The KPI Plus",
    openMap: "Открыть в Google Maps",
    officePhotoAlt: "Офис The KPI Plus",
    photoCaption: "The KPI Plus meeting location — Phuket",
    photoPlaceholder: "Replace with verified office / meeting location photo",
    formTitle: "Написать команде",
    formBody: "Укажите только необходимое для старта. Команда уточнит детали позже, если нужно.",
  },
  zh: {
    eyebrow: "開始對話",
    titleLead: "Find the signal.",
    titleRest: "Make the move.",
    lead: "聯絡 The KPI Plus，討論酒店收益、需求、直訂、在地搜尋、科技與商業執行。",
    officeEyebrow: "Phuket Office",
    locationEyebrow: "Location",
    office: "The KPI Plus，普吉",
    mapTitle: "The KPI Plus 辦公室地圖",
    openMap: "在 Google Maps 開啟",
    officePhotoAlt: "The KPI Plus 辦公室",
    photoCaption: "The KPI Plus meeting location — Phuket",
    photoPlaceholder: "Replace with verified office / meeting location photo",
    formTitle: "傳送訊息給團隊",
    formBody: "先填啟動所需資料即可，若有需要團隊稍後再補問細節。",
  },
} as const;

export async function ContactView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const company = await getPublicCompany();
  const contact = contactInfoFromCompany(company, locale);
  const isTh = locale === "th";

  return (
    <SiteShell locale={locale} route={localizePath("/contact-us", locale)}>
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
              </div>
            </div>

            <div className="kpi-contact-hero-aside">
              <figure className="kpi-contact-hero-media">
                {company.officePhoto ? (
                  <>
                    <img
                      src={company.officePhoto}
                      alt={company.officePhotoAlt || t.officePhotoAlt}
                      width={1200}
                      height={900}
                    />
                    <figcaption className="kpi-contact-hero-caption">{t.photoCaption}</figcaption>
                  </>
                ) : (
                  <div className="kpi-contact-hero-placeholder" role="img" aria-label={t.photoPlaceholder}>
                    <span>{t.photoPlaceholder}</span>
                  </div>
                )}
              </figure>
              <ContactCard locale={locale} contact={contact} variant="hero" eyebrow={t.officeEyebrow} />
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-contact-main">
        <div className="kpi-section kpi-contact-main-stack">
          <ContactChannels locale={locale} contact={contact} />
          <div className="kpi-contact-main-grid">
            <div className="kpi-contact-location">
              <p className={`kpi-contact-eyebrow${isTh ? "" : " kpi-latin"}`}>{t.locationEyebrow}</p>
              {company.officePhoto ? (
                <figure className="kpi-contact-photo">
                  <img
                    src={company.officePhoto}
                    alt={company.officePhotoAlt || t.officePhotoAlt}
                    width={1600}
                    height={1067}
                    loading="lazy"
                  />
                </figure>
              ) : null}
              {company.consultantPhoto ? (
                <figure className="kpi-contact-photo kpi-contact-consultant">
                  <img
                    src={company.consultantPhoto}
                    alt={company.consultantPhotoAlt || t.officePhotoAlt}
                    width={800}
                    height={1000}
                    loading="lazy"
                  />
                </figure>
              ) : null}
              <ContactLocationMap
                locale={locale}
                title={t.mapTitle}
                address={contact.address}
                mapsUrl={contact.googleMapsUrl}
                embedSrc={company.mapsEmbed}
                openMapLabel={t.openMap}
              />
              <ContactCard locale={locale} contact={contact} variant="section" />
            </div>

            <ContactEnquiryForm
              locale={locale}
              title={t.formTitle}
              body={t.formBody}
              email={contact.email}
              phone={contact.phone}
              sectionId="contact-enquiry"
            />
          </div>
        </div>
      </section>

      <ContactNextSteps locale={locale} contact={contact} />
    </SiteShell>
  );
}
