import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const manifestPath = join("content", "seo-manifest.json");
const pages = JSON.parse(readFileSync(manifestPath, "utf8"));

const entries = [
  {
    slug: "hotel-revenue-meetings-that-lead-to-decisions",
    thTitle: "ประชุม Revenue ให้จบด้วยการตัดสินใจที่ใช้ได้จริง | เดอะ เคพีไอ พลัส",
    enTitle: "Hotel Revenue Meetings That Lead to Decisions | The KPI Plus",
    thDesc:
      "กรอบการประชุมรายได้โรงแรมที่ช่วยให้ทีมเปลี่ยนสัญญาณด้านรายได้และการเติบโตเป็นการตัดสินใจ เจ้าของงาน และจุดทบทวนที่ชัดเจน",
    enDesc:
      "A hotel revenue-meeting frame that turns revenue and growth signals into a decision, an owner, and a review point.",
  },
  {
    slug: "hotel-technology-adoption-commercial-project",
    thTitle: "ทำอย่างไรให้ Technology และ AI ช่วยทีมโรงแรมได้จริง | เดอะ เคพีไอ พลัส",
    enTitle: "Hotel Technology Adoption as a Commercial Project | The KPI Plus",
    thDesc:
      "เหตุใดระบบโรงแรม ระบบอัตโนมัติ และ AI จึงต้องมีเจ้าของเวิร์กโฟลว์ แผนการปรับใช้ และบริบทด้านรายได้และการเติบโต ไม่ใช่เพียงการเปิดใช้งานทางเทคนิค",
    enDesc:
      "Hotel systems, automation, and AI need a workflow owner, an adoption plan, and a revenue context — not only a technical switch-on.",
  },
  {
    slug: "direct-booking-journey-audit",
    thTitle: "วิเคราะห์เส้นทาง Direct Booking ของโรงแรม | เดอะ เคพีไอ พลัส",
    enTitle: "Hotel Direct Booking Journey Audit | The KPI Plus",
    thDesc:
      "แนวทางตรวจสอบเส้นทางผู้เข้าพักตั้งแต่เริ่มสนใจจนถึงการจองตรงอย่างมั่นใจ โดยไม่ตั้งสมมติฐานว่าปัญหาเกิดจากจำนวนทราฟฟิกเพียงอย่างเดียว",
    enDesc:
      "A way to review the guest path from interest to a confident direct booking, without assuming the only problem is traffic volume.",
  },
  {
    slug: "seo-vs-sem-for-hotels-which-one-should-you-focus-on",
    thTitle: "SEO vs SEM สำหรับโรงแรม: ควรเริ่มจากอะไร | เดอะ เคพีไอ พลัส",
    enTitle: "SEO vs SEM for Hotels: Where to Start | The KPI Plus",
    thDesc:
      "SEO และ SEM มีบทบาทต่างกันในการสร้าง Demand ของโรงแรม เลือกจุดเริ่มต้นจากคำถามทางธุรกิจ Search Intent และเส้นทางสู่ Direct Booking ที่มีอยู่จริง",
    enDesc:
      "SEO and SEM play different roles in hotel demand. Choose a start from the business question, search intent, and the real path to direct booking.",
  },
];

function upsert(entry) {
  const idx = pages.findIndex((p) => p.route === entry.route);
  if (idx >= 0) pages[idx] = { ...pages[idx], ...entry };
  else pages.push(entry);
}

for (const e of entries) {
  const thRoute = `/insights/${e.slug}`;
  const enRoute = `/en/insights/${e.slug}`;
  const alternates = [
    { hreflang: "th", href: `https://thekpiplus.com${thRoute}` },
    { hreflang: "en", href: `https://thekpiplus.com${enRoute}` },
  ];
  upsert({
    route: thRoute,
    language: "th",
    title: e.thTitle,
    description: e.thDesc,
    canonical: `https://thekpiplus.com${thRoute}`,
    alternates,
    ogImage: `https://thekpiplus.com/images/blog/${e.slug}/th/og.webp`,
    ogUrl: `https://thekpiplus.com${thRoute}`,
  });
  upsert({
    route: enRoute,
    language: "en",
    title: e.enTitle,
    description: e.enDesc,
    canonical: `https://thekpiplus.com${enRoute}`,
    alternates,
    ogImage: `https://thekpiplus.com/images/blog/${e.slug}/en/og.webp`,
    ogUrl: `https://thekpiplus.com${enRoute}`,
  });
}

writeFileSync(manifestPath, `${JSON.stringify(pages, null, 2)}\n`, "utf8");
console.log("seo-manifest routes", pages.length);
