import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const OLD_TITLES = [
  "ระบบเชื่อมกันได้ แต่ทีมและข้อมูลต้องทำงานไปด้วยกัน",
  "Systems can connect. The team and the data still have to work together.",
];

const PATCH = {
  th: {
    title: "ระบบเชื่อมต่อได้ แต่ข้อมูลและการทำงานยังไม่ไปทางเดียวกัน",
    description:
      "โรงแรมอาจใช้ PMS, Channel Manager, OTA, Booking Engine และรายงานหลายระบบ แต่ข้อมูลยังไม่สอดคล้อง และยังไม่ชัดว่าใครเป็นเจ้าของชุดข้อมูลใด",
    close:
      "งานเริ่มจากสำรวจระบบ ดูเส้นทางข้อมูล จับคู่ข้อมูล และประเมินความพร้อมก่อนตั้งค่า เป้าหมายไม่ใช่การเชื่อมเครื่องมือให้ครบ แต่ให้มีเส้นทางที่ตามได้ พฤติกรรมที่ทดสอบแล้ว และการส่งมอบที่ชัดเจน ความเป็นไปได้ทางเทคนิคขึ้นกับสิทธิ์จากผู้ให้บริการ API หรือตัวเชื่อม ไลเซนส์ ความปลอดภัย และขอบเขตที่อนุมัติ",
    cta: "ขอประเมินระบบโรงแรม",
    secondary: "ดูแนวทางการทำงาน",
    label: "ตัวอย่าง Hotel Systems และ Data Flow",
    caption: "ช่วยให้ระบบโรงแรม ข้อมูล ผู้รับผิดชอบ และขั้นตอนหลัง Go-live เชื่อมกันอย่างตรวจสอบได้",
    altTh:
      "แผนภาพตัวอย่าง Hotel Systems และ Data Flow แสดง PMS ไปยัง Channel Manager ไปยัง OTA หรือ Booking Engine และรายงาน พร้อมสถานะ Needs Mapping Pending Access Requires Provider Support และ Not Configured ไม่ใช่รูปโน้ตบุ๊กทั่วไป และไม่ใช่โรงแรมลูกค้าจริง",
    altEn:
      "Sample Hotel Systems and Data Flow diagram showing PMS to Channel Manager to OTA or Booking Engine and reporting, with Needs Mapping, Pending Access, Requires Provider Support, and Not Configured statuses. Not a generic laptop photo and not a live client hotel.",
  },
  en: {
    title: "Systems can connect. Data and operations still do not run the same way.",
    description:
      "A hotel may use a PMS, channel manager, OTA, booking engine, and reporting at the same time, and still have inconsistent information and unclear ownership.",
    close:
      "The work starts with system inventory, data flow, mapping, and implementation readiness. The goal is not simply to connect tools. It is a traceable flow, tested behaviour, and a clear handover. Technical feasibility depends on provider access, API or connector support, licence, security, and the approved scope.",
    cta: "Request a hotel systems assessment",
    secondary: "View the implementation approach",
    label: "Sample Hotel Systems and Data Flow",
    caption: "Help hotel systems, data, owners, and post go-live steps connect in a way that can be verified.",
    altTh:
      "แผนภาพตัวอย่าง Hotel Systems และ Data Flow แสดง PMS ไปยัง Channel Manager ไปยัง OTA หรือ Booking Engine และรายงาน พร้อมสถานะ Needs Mapping Pending Access Requires Provider Support และ Not Configured ไม่ใช่รูปโน้ตบุ๊กทั่วไป และไม่ใช่โรงแรมลูกค้าจริง",
    altEn:
      "Sample Hotel Systems and Data Flow diagram showing PMS to Channel Manager to OTA or Booking Engine and reporting, with Needs Mapping, Pending Access, Requires Provider Support, and Not Configured statuses. Not a generic laptop photo and not a live client hotel.",
  },
};

function patchHero(body, locale) {
  const copy = PATCH[locale];
  if (!copy) return { changed: false, body };
  const next = typeof body === "string" ? JSON.parse(body) : body;
  if (!next?.hero) return { changed: false, body: next };
  next.hero.title = copy.title;
  next.hero.description = copy.description;
  next.hero.close = copy.close;
  next.hero.primaryCta = { ...(next.hero.primaryCta || {}), label: copy.cta, href: "#hotel-systems-enquiry" };
  next.hero.secondaryCta = { ...(next.hero.secondaryCta || {}), label: copy.secondary, href: "/approach" };
  next.hero.visual = {
    ...(next.hero.visual || {}),
    src: "/images/hotel-systems-implementation-hero-placeholder.webp",
    status: "sample",
    label: copy.label,
    caption: copy.caption,
    altTh: copy.altTh,
    altEn: copy.altEn,
  };
  return { changed: true, body: next, oldTitle: true };
}

const docs = await prisma.cmsDocument.findMany({
  where: {
    OR: [{ template: "hotel-systems-implementation" }, { slug: { contains: "hotel-systems-implementation" } }],
  },
});

for (const doc of docs) {
  const { changed, body } = patchHero(doc.body, doc.locale);
  if (!changed) continue;
  await prisma.cmsDocument.update({
    where: { id: doc.id },
    data: {
      title: body.hero.title,
      excerpt: body.hero.description,
      seoTitle: body.hero.title,
      metaDescription: body.hero.description,
      featuredImage: body.hero.visual.src,
      imageAlt: body.hero.visual.altTh || body.hero.visual.altEn,
      body: JSON.stringify(body),
    },
  });
  console.log("patched", doc.id, doc.locale, doc.slug, doc.status, OLD_TITLES.includes(doc.title) ? "old-title" : "title-updated");
}

console.log("docs", docs.length);
await prisma.$disconnect();
