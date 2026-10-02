import { HomeFaqList } from "@/components/HomeFaqList";
import type { FaqItem } from "@/lib/faqs";
import type { Locale } from "@/lib/seo";

const titles: Record<Locale, string> = {
  th: "คำถามที่พบบ่อย",
  en: "Frequently asked questions",
  ru: "Частые вопросы",
  zh: "常見問題",
};

export function PageFaqs({ items, locale }: { items: FaqItem[]; locale: Locale }) {
  if (!items.length) return null;

  return (
    <section className="kpi-faq-home border-t border-[#E3E8EB] bg-white" aria-labelledby="page-faq">
      <div className="kpi-section">
        <h2 id="page-faq" className="kpi-h2">
          {titles[locale]}
        </h2>
        <HomeFaqList items={items} />
      </div>
    </section>
  );
}
