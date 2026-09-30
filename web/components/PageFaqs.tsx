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
    <section className="border-t border-[#E3E8EB] bg-white" aria-labelledby="page-faq">
      <div className="kpi-section">
        <h2 id="page-faq" className="kpi-h2">
          {titles[locale]}
        </h2>
        <dl className="mx-auto mt-10 grid max-w-4xl gap-4">
          {items.map((item) => (
            <div key={item.q} className="kpi-card p-6 sm:p-7">
              <dt className="text-lg font-extrabold tracking-[-.03em] text-[#3B3B3B]">{item.q}</dt>
              <dd className="mt-3 text-base leading-8 text-[#555555]">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
