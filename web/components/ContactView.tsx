import { ClickToLoadMap } from "@/components/ClickToLoadMap";
import { EnquiryForm } from "@/components/EnquiryForm";
import { HeroCta } from "@/components/HeroCta";
import { SiteShell } from "@/components/SiteShell";
import { companyAddress, companyHours, type CompanyContact } from "@/lib/company";
import { getPublicCompany } from "@/lib/company-public";
import { legalName, localizePath, type Locale } from "@/lib/seo";

const copy = {
  th: {
    eyebrow: "เริ่มต้นบทสนทนา",
    titleLead: "เห็นข้อมูลให้ชัด",
    titleRest: "แล้วเลือกสิ่งที่ควรทำต่อ",
    lead: "พูดคุยกับ เดอะ เคพีไอ พลัส เรื่องรายได้ Demand การจองตรง การมองเห็นบนออนไลน์ เทคโนโลยี และการลงมือทำเพื่อเพิ่มรายได้และการเติบโตของโรงแรม",
    officeEyebrow: "สำนักงานภูเก็ต",
    locationEyebrow: "ที่ตั้งสำนักงาน",
    office: "เดอะ เคพีไอ พลัส, ภูเก็ต",
    hoursLabel: "เวลาติดต่อ",
    directLabel: "ติดต่อโดยตรง",
    mapTitle: "แผนที่สำนักงาน เดอะ เคพีไอ พลัส",
    openMap: "เปิดใน Google Maps",
    officePhotoAlt: "สำนักงาน เดอะ เคพีไอ พลัส",
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
    hoursLabel: "When to reach us",
    directLabel: "Direct contact",
    mapTitle: "Map of The KPI Plus office",
    openMap: "Open in Google Maps",
    officePhotoAlt: "The KPI Plus office",
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
    hoursLabel: "When to reach us",
    directLabel: "Прямой контакт",
    mapTitle: "Карта офиса The KPI Plus",
    openMap: "Открыть в Google Maps",
    officePhotoAlt: "Офис The KPI Plus",
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
    hoursLabel: "When to reach us",
    directLabel: "直接聯絡",
    mapTitle: "The KPI Plus 辦公室地圖",
    openMap: "在 Google Maps 開啟",
    officePhotoAlt: "The KPI Plus 辦公室",
    formTitle: "傳送訊息給團隊",
    formBody: "先填啟動所需資料即可，若有需要團隊稍後再補問細節。",
  },
} as const;

function DirectLinks({
  company,
  className,
}: {
  company: CompanyContact;
  className: string;
}) {
  return (
    <div className={className}>
      {company.phones.map((item) => (
        <a key={item.href} href={item.href}>
          {item.display}
        </a>
      ))}
      {company.email ? <a href={`mailto:${company.email}`}>{company.email}</a> : null}
      {company.whatsappHref ? <a href={company.whatsappHref}>WhatsApp</a> : null}
      {company.lineHref ? <a href={company.lineHref}>LINE</a> : null}
    </div>
  );
}

export async function ContactView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const company = await getPublicCompany();
  const isTh = locale === "th";
  const address = companyAddress(company, locale);
  const addressOther = locale === "th" ? company.addressEn : "";
  const hours = companyHours(company, locale);
  const companyLine = `${legalName(locale)} · Tax ID ${company.taxId}`;
  const primaryPhone = company.phones[0];

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
                {primaryPhone ? (
                  <a href={primaryPhone.href} className="kpi-button-ghost">
                    {primaryPhone.display}
                  </a>
                ) : null}
                {company.email ? (
                  <a href={`mailto:${company.email}`} className="kpi-button-ghost">
                    {company.email}
                  </a>
                ) : null}
              </div>
            </div>

            <aside className="kpi-contact-hero-card" aria-label={t.office}>
              <p className={`kpi-contact-hero-card-eyebrow${isTh ? "" : " kpi-latin"}`}>{t.officeEyebrow}</p>
              <h2 className="kpi-contact-hero-card-title">{t.office}</h2>
              {address ? <p className="kpi-contact-hero-card-address">{address}</p> : null}
              {address && addressOther && address !== addressOther ? (
                <p className="kpi-contact-hero-card-address-en kpi-latin">{addressOther}</p>
              ) : null}
              <DirectLinks company={company} className="kpi-contact-hero-card-links" />
              {hours ? <p className="kpi-contact-hero-card-company">{t.hoursLabel}: {hours}</p> : null}
              <p className="kpi-contact-hero-card-company">{companyLine}</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="kpi-contact-main">
        <div className="kpi-section kpi-contact-main-grid">
          <div className="kpi-contact-location">
            <p className={`kpi-contact-eyebrow${isTh ? "" : " kpi-latin"}`}>{t.locationEyebrow}</p>
            <h2 className="kpi-h2 kpi-contact-h2">{t.office}</h2>
            {company.officePhoto ? (
              <figure className="kpi-contact-photo">
                <img
                  src={company.officePhoto}
                  alt={t.officePhotoAlt}
                  width={1600}
                  height={1067}
                  loading="lazy"
                />
              </figure>
            ) : null}
            {company.mapsEmbed ? (
              <div className="kpi-contact-map-panel">
                <ClickToLoadMap locale={locale === "th" ? "th" : "en"} title={t.mapTitle} embedSrc={company.mapsEmbed} />
                {company.mapsShare ? (
                  <p className="kpi-contact-map-cta">
                    <a href={company.mapsShare} rel="noopener noreferrer">
                      {t.openMap} <span aria-hidden="true">↗</span>
                    </a>
                  </p>
                ) : null}
              </div>
            ) : null}
            {address ? <p className="kpi-contact-location-address">{address}</p> : null}
            {address && addressOther && address !== addressOther ? (
              <p className="kpi-contact-location-address-en kpi-latin">{addressOther}</p>
            ) : null}
            {hours ? <p className="kpi-contact-location-address">{t.hoursLabel}: {hours}</p> : null}
            <div className="kpi-contact-direct">
              <p className="kpi-contact-direct-label">{t.directLabel}</p>
              <DirectLinks company={company} className="kpi-contact-direct-links" />
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
