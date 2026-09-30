import { ClickToLoadMap } from "@/components/ClickToLoadMap";
import { EnquiryForm } from "@/components/EnquiryForm";
import { HeroCta } from "@/components/HeroCta";
import { PageHero } from "@/components/PageHero";
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
    title: "เห็นข้อมูลให้ชัด แล้วเลือกสิ่งที่ควรทำต่อ",
    lead: "พูดคุยกับ เดอะ เคพีไอ พลัส เรื่องรายได้ Demand การจองตรง การมองเห็นบนออนไลน์ เทคโนโลยี และการลงมือทำเพื่อเพิ่มรายได้และการเติบโตของโรงแรม",
    office: "เดอะ เคพีไอ พลัส, ภูเก็ต",
    address: "58/15 ถนนเจ้าฟ้าตะวันออก ตำบลตลาดเหนือ อำเภอเมืองภูเก็ต จังหวัดภูเก็ต 83000 ประเทศไทย",
    addressEn: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    company: "บริษัท เดอะ เคพีไอ พลัส จำกัด · Tax ID 0835564008629",
    mapTitle: "แผนที่สำนักงาน เดอะ เคพีไอ พลัส",
    openMap: "เปิดใน Google Maps",
    formTitle: "ส่งข้อความถึงทีม",
    formBody: "กรอกเฉพาะข้อมูลที่จำเป็น ทีมจะติดต่อกลับเพื่อถามรายละเอียดต่อหากต้องการ",
  },
  en: {
    eyebrow: "Start the conversation",
    title: "Find the signal. Make the move.",
    lead: "Contact The KPI Plus for a focused conversation about hotel revenue, demand, direct booking, local presence, technology, and commercial execution.",
    office: "The KPI Plus, Phuket",
    address: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    addressEn: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    company: "The KPI Plus Co., Ltd. · Tax ID 0835564008629",
    mapTitle: "Map of The KPI Plus office",
    openMap: "Open in Google Maps",
    formTitle: "Send a message to the team",
    formBody: "Share only what is needed to start. The team will ask for more detail later if useful.",
  },
  ru: {
    eyebrow: "Начать разговор",
    title: "Find the signal. Make the move.",
    lead: "Свяжитесь с The KPI Plus, чтобы обсудить доход отеля, спрос, прямые бронирования, локальный поиск, технологии и коммерческое исполнение.",
    office: "The KPI Plus, Пхукет",
    address: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    addressEn: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    company: "The KPI Plus Co., Ltd. · Tax ID 0835564008629",
    mapTitle: "Карта офиса The KPI Plus",
    openMap: "Открыть в Google Maps",
    formTitle: "Написать команде",
    formBody: "Укажите только необходимое для старта. Команда уточнит детали позже, если нужно.",
  },
  zh: {
    eyebrow: "開始對話",
    title: "Find the signal. Make the move.",
    lead: "聯絡 The KPI Plus，討論酒店收益、需求、直訂、在地搜尋、科技與商業執行。",
    office: "The KPI Plus，普吉",
    address: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    addressEn: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    company: "The KPI Plus Co., Ltd. · Tax ID 0835564008629",
    mapTitle: "The KPI Plus 辦公室地圖",
    openMap: "在 Google Maps 開啟",
    formTitle: "傳送訊息給團隊",
    formBody: "先填啟動所需資料即可，若有需要團隊稍後再補問細節。",
  },
} as const;

export function ContactView({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <SiteShell locale={locale} route={locale === "th" ? "/contact" : `/${locale}/contact`}>
      <PageHero>
        <div className="kpi-split kpi-split-contact">
          <div>
            <p className="kpi-kicker text-[#F2F8E2]">{t.eyebrow}</p>
            <h1 className="kpi-h1 mt-5">{t.title}</h1>
            <p className="kpi-lead mt-5 text-white/72">{t.lead}</p>
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

          <div className="flex h-full flex-col justify-center overflow-hidden rounded-[1.25rem] border border-white/12 bg-white/5 p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold text-white">{t.office}</h2>
            <p className="mt-4 text-sm leading-7 text-white/72">{t.address}</p>
            {t.address !== t.addressEn ? <p className="mt-2 text-sm leading-7 text-white/56">{t.addressEn}</p> : null}
            <p className="mt-4 text-sm">
              <a href="tel:+66826356266" className="text-[#F2F8E2]">
                +66 82 635 6266
              </a>
              <span className="px-2 text-white/30" aria-hidden="true">
                ·
              </span>
              <a href="mailto:info@thekpiplus.com" className="text-[#F2F8E2]">
                info@thekpiplus.com
              </a>
            </p>
            <p className="mt-5 text-xs leading-6 text-white/50">{t.company}</p>
          </div>
        </div>
      </PageHero>

      <section className="relative border-t border-[#E3E8EB] bg-[#F4F4F4]">
        <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
        <div className="kpi-section kpi-split-audit kpi-split-audit-fill">
          <div className="kpi-audit-copy">
            <div className="kpi-contact-map-panel">
              <ClickToLoadMap locale={locale === "th" ? "th" : "en"} title={t.mapTitle} embedSrc={OFFICE_MAPS.embed} />
              <p className="border-t border-[#E3E8EB] px-5 py-3">
                <a href={OFFICE_MAPS.share} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#0B6660]">
                  {t.openMap}
                </a>
              </p>
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
