import Link from "next/link";
import { HeroCta } from "@/components/HeroCta";
import { PageHero } from "@/components/PageHero";
import type { HandoffBlock } from "@/lib/handoff";
import { resolvePageHref, type Locale } from "@/lib/seo";

function looksLikeNavNoise(text: string) {
  return [
    "โซลูชัน",
    "ไทย",
    "แนวทางการทำงาน",
    "บทความและมุมมอง",
    "ผลงานลูกค้า",
    "เกี่ยวกับเรา",
    "ติดต่อเรา",
    "Solutions",
    "Approach",
    "Insights",
    "Case Studies",
    "About",
    "Contact",
    "English",
    "Русский",
    "繁體中文",
    "/",
    "0",
    "1",
    "2",
    "3",
    "SECTION",
    "HEADER",
    "FOOTER",
    "All solutions",
    "Related solutions",
    "Related Insights",
    "Free Hotel Tools",
    "Common questions",
    "คำถามที่พบบ่อย",
    "คำถามก่อนเริ่มงาน",
    "คำถามที่โรงแรมมักถามเกี่ยวกับเรื่องนี้",
    "A clearer starting point for the next conversation.",
    "หากบริบทของโรงแรมต่างจากตัวอย่างเหล่านี้ สามารถเริ่มจากการวิเคราะห์ภาพรวมก่อนเลือกแนวทางทำงาน",
    "These questions explain the practical scope of this service. If your hotel context needs a more specific answer, request an audit and the team can begin with the relevant commercial question.",
    "Request an audit",
    "01",
    "02",
    "03",
    "Revenue · Direct Booking · Commercial Growth",
  ].includes(text);
}

export function HandoffArticle({ blocks, locale }: { blocks: HandoffBlock[]; locale: Locale }) {
  const firstHeading = blocks.find((block) => block.type === "h1");
  const intro = blocks
    .filter((block) => block.type === "p" && !looksLikeNavNoise(block.text) && block.text.length > 60)
    .slice(0, 2);
  const heroIntro = intro[0];
  const rest = blocks.filter((block) => block !== firstHeading && block !== heroIntro);

  return (
    <>
      <PageHero>
        {firstHeading?.type === "h1" ? <h1 className="kpi-h1">{firstHeading.text}</h1> : null}
        {intro.slice(0, 1).map((block) =>
          block.type === "p" ? (
            <p key={block.text} className="kpi-lead mt-5 text-white/72">
              {block.text}
            </p>
          ) : null,
        )}
        <HeroCta locale={locale} className="mt-8" />
      </PageHero>
      <section className="kpi-section">
        <article className="mx-auto grid max-w-4xl gap-5">
          {rest.map((block, index) => {
            if (block.type === "h1" || block.type === "h2") {
              if (looksLikeNavNoise(block.text)) return null;
              return (
                <h2 key={`${block.text}-${index}`} className="mt-6 text-3xl font-extrabold tracking-[-.04em] text-[#3B3B3B]">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "h3") {
              const unanswered = /[?？]$/.test(block.text) && rest[index + 1]?.type !== "p";
              if (unanswered) return null;
              return (
                <h3 key={`${block.text}-${index}`} className="mt-4 text-xl font-bold text-[#3B3B3B]">
                  {block.text}
                </h3>
              );
            }
            if (block.type === "p") {
              if (looksLikeNavNoise(block.text)) return null;
              return (
                <p key={`${block.text}-${index}`} className="text-base leading-8 text-[#555555]">
                  {block.text}
                </p>
              );
            }
            if (block.type === "image") {
              return (
                <img
                  key={block.src}
                  src={block.src}
                  alt={block.alt}
                  className="mt-4 w-full rounded-[1.25rem] object-cover"
                />
              );
            }
            if (block.type === "link") {
              const href = resolvePageHref(block.href, locale);
              if (!href) return null;
              const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
              const className = "inline-flex text-base font-extrabold text-[#0B6660]";
              return external ? (
                <a key={`${href}-${index}`} href={href} className={className}>
                  {block.text}
                </a>
              ) : (
                <Link key={`${href}-${index}`} href={href} className={className}>
                  {block.text}
                </Link>
              );
            }
            if (block.type === "list") {
              return (
                <ul key={`list-${index}`} className="grid gap-2 pl-5 text-[#555555]">
                  {block.items.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            return null;
          })}
        </article>
      </section>
    </>
  );
}
