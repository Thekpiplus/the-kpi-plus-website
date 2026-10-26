import { HomeFaqList } from "@/components/HomeFaqList";
import type { FaqItem } from "@/lib/faqs";
import type { Locale } from "@/lib/seo";

const titles: Record<Locale, string> = {
  th: "คำถามที่พบบ่อย",
  en: "Frequently asked questions",
  ru: "Частые вопросы",
  zh: "常見問題",
};

export function PageFaqs({
  items,
  locale,
  intro,
  sectionId,
}: {
  items: FaqItem[];
  locale: Locale;
  intro?: string;
  sectionId?: string;
}) {
  if (!items.length) return null;

  const headingId = sectionId ? `${sectionId}-heading` : "page-faq";

  return (
    <section
      id={sectionId}
      className="kpi-faq-home border-t border-[#E3E8EB] bg-white"
      aria-labelledby={headingId}
    >
      <div className="kpi-section">
        <h2 id={headingId} className="kpi-h2">
          {titles[locale]}
        </h2>
        {intro ? <p className="kpi-faq-lead">{intro}</p> : null}
        <HomeFaqList items={items} />
      </div>
    </section>
  );
}
