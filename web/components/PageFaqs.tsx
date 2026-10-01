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
  editorial = false,
}: {
  items: FaqItem[];
  locale: Locale;
  editorial?: boolean;
}) {
  if (!items.length) return null;

  return (
    <section className={`${editorial ? "kpi-faq-home " : ""}border-t border-[#E3E8EB] bg-white`} aria-labelledby="page-faq">
      <div className="kpi-section">
        <h2 id="page-faq" className="kpi-h2">
          {titles[locale]}
        </h2>
        {editorial ? (
          <HomeFaqList items={items} />
        ) : (
          <dl className="kpi-faq-list">
            {items.map((item) => (
              <div key={item.q}>
                <dt className="text-lg font-semibold leading-7 text-[#3B3B3B]">{item.q}</dt>
                <dd className="mt-3 text-base leading-8 text-[#555555]">{item.a}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
