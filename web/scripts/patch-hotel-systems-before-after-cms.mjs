import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const visual = {
  src: "/images/hotel-systems-before-after-placeholder.webp",
  status: "sample",
  label: "Disconnected Systems to Managed Data Flow — Sample",
  altTh:
    "แผนภาพตัวอย่าง Before และ After ฝั่ง Before แสดง PMS สเปรดชีต OTA Booking Engine และรายงานที่ยังแยกกัน พร้อมปัญหาการกรอกซ้ำ ข้อมูลไม่ตรง ไม่มี Source of Truth ไม่มีผู้รับผิดชอบเมื่อผิด และรายงานคนละนิยาม ฝั่ง After แสดง Source of Truth ไป Mapped Data Flow ไป Tested Integration ไป Clear Owner ไป Operating Procedure ไป Review ในขอบเขตที่ตกลง ไม่ได้หมายความว่าระบบทุกตัวทำงานอัตโนมัติ และไม่ใช่ผลโรงแรมจริง",
  altEn:
    "Sample Before and After diagram. Before shows a PMS, spreadsheet, OTA, booking engine, and reports running apart, with duplicate entry, inconsistent room, rate, and availability data, no Source of Truth, no error owner, and reports with different definitions. After shows Source of Truth, Mapped Data Flow, Tested Integration, Clear Owner, Operating Procedure, and Review, managed and verified within the agreed scope. It does not mean every system is fully automated, and it is not a live hotel result.",
};

const copy = {
  th: {
    title: "ทำไมมีหลายระบบแล้วงานยังไม่ไหลเป็นเส้นทางเดียวกัน",
    lead: "โรงแรมอาจใช้ PMS สเปรดชีต OTA Booking Engine และรายงานพร้อมกัน แต่ยังกรอกซ้ำ ข้อมูลห้อง ราคา ห้องว่างไม่ตรง ไม่ชัดว่าใครเป็น Source of Truth และรายงานใช้นิยามต่างกัน",
    note: "การเชื่อมระบบไม่ได้หมายความว่าข้อมูลทุกชนิดจะไหลได้เอง สิ่งสำคัญคือ Data Mapping, Owner, Error Handling และขั้นตอนทำงานหลังการเชื่อมต่อ",
    caption: "After ในหน้านี้หมายถึงเส้นทางที่จัดการและตรวจแล้วในขอบเขตที่ตกลง ไม่ได้หมายความว่าระบบทุกตัวทำงานอัตโนมัติครบ",
  },
  en: {
    title: "Why a hotel can have several systems and still not run one connected workflow",
    lead: "A hotel may use a PMS, spreadsheet, OTAs, a booking engine, and reports at the same time, and still re-enter data, see mismatched room, rate, or availability facts, lack a Source of Truth, and read reports that use different definitions.",
    note: "Connecting systems does not mean every kind of data will flow by itself. What matters is Data Mapping, Owner, Error Handling, and the operating steps after the connection.",
    caption: "After here means a managed and verified path within the agreed scope. It does not mean every system is fully automated.",
  },
};

const steps = [
  { id: "source-of-truth", num: "01", label: "Source of Truth", titleTh: "แหล่งความจริง", titleEn: "Source of Truth", output: "Named candidate, confirmed per hotel" },
  { id: "mapped-data-flow", num: "02", label: "Mapped Data Flow", titleTh: "เส้นทางข้อมูลที่จับคู่แล้ว", titleEn: "Mapped Data Flow", output: "Room, rate, and availability map" },
  { id: "tested-integration", num: "03", label: "Tested Integration", titleTh: "การเชื่อมที่ทดสอบแล้ว", titleEn: "Tested Integration", output: "Tested behaviour in agreed scope" },
  { id: "clear-owner", num: "04", label: "Clear Owner", titleTh: "ผู้รับผิดชอบที่ชัด", titleEn: "Clear Owner", output: "Named owner for errors and next action" },
  { id: "operating-procedure", num: "05", label: "Operating Procedure", titleTh: "ขั้นตอนทำงาน", titleEn: "Operating Procedure", output: "Steps the team follows after go-live" },
  { id: "review", num: "06", label: "Review", titleTh: "ทบทวน", titleEn: "Review", output: "Scheduled review, not a one-time connect" },
];

const fields = [
  { id: "connected", titleTh: "สิ่งที่เชื่อมแล้ว", titleEn: "What is connected", bodyTh: "ตัวอย่างนี้ยังไม่สรุปว่าระบบใด Connected การเชื่อมต่อยืนยันได้เมื่อมีสิทธิ์ จับคู่ข้อมูล และทดสอบในขอบเขตที่ตกลง", bodyEn: "This sample does not mark any system as Connected. A connection is confirmed only after access, mapping, and a test in the agreed scope.", ownerTh: "ยังไม่ระบุ", ownerEn: "Unassigned", status: "not_configured" },
  { id: "mapping", titleTh: "สิ่งที่ต้องจับคู่ข้อมูล", titleEn: "What requires mapping", bodyTh: "ประเภทห้อง Rate Plan ราคา ห้องว่าง และเงื่อนไขข้าม PMS สเปรดชีต OTA Booking Engine และรายงาน", bodyEn: "Room type, rate plan, rate, availability, and conditions across the PMS, spreadsheet, OTA, booking engine, and reports", ownerTh: "โรงแรม / งานนำไปใช้", ownerEn: "Hotel / implementation", status: "needs_mapping" },
  { id: "provider", titleTh: "สิ่งที่ต้องให้ผู้ให้บริการสนับสนุน", titleEn: "What requires provider support", bodyTh: "สิทธิ์ API หรือตัวเชื่อม การจองกลับจาก OTA และข้อจำกัดไลเซนส์ที่ผู้ให้บริการต้องอนุมัติ", bodyEn: "API or connector access, OTA booking returns, and licence limits that the vendor must approve", ownerTh: "โรงแรม / ผู้ให้บริการระบบ", ownerEn: "Hotel / system provider", status: "requires_provider_support" },
  { id: "manual", titleTh: "สิ่งที่ยังทำด้วยคน", titleEn: "What is still manual", bodyTh: "การตรวจข้อผิดพลาด การอนุมัติราคาพิเศษ การแก้เมื่อข้อมูลไม่ตรง และการทบทวนหลัง Go-live ยังเป็นงานของคน", bodyEn: "Error checks, special-rate approval, fixing mismatched facts, and the review after go-live stay with people", ownerTh: "ตำแหน่งในโรงแรมที่ระบุชื่อได้", ownerEn: "Named hotel roles", status: "testing" },
  { id: "next-owner", titleTh: "ใครรับงานถัดไป", titleEn: "Who owns the next action", bodyTh: "ตัวอย่างนี้ยังไม่ระบุชื่อตำแหน่งในโรงแรม ไม่ควรเริ่มจับคู่ข้อมูลถ้ายังไม่มีผู้รับผิดชอบ", bodyEn: "A named hotel role is not assigned in this sample. Mapping should not start without an owner.", ownerTh: "ยังไม่ระบุ", ownerEn: "Unassigned", status: "pending_access" },
];

const docs = await prisma.cmsDocument.findMany({
  where: {
    OR: [{ template: "hotel-systems-implementation" }, { slug: { contains: "hotel-systems-implementation" } }],
  },
});

for (const doc of docs) {
  const locale = doc.locale === "en" ? "en" : "th";
  const nextCopy = copy[locale];
  const body = typeof doc.body === "string" ? JSON.parse(doc.body) : doc.body;
  if (!body?.model) continue;
  body.model.title = nextCopy.title;
  body.model.lead = nextCopy.lead;
  body.model.note = nextCopy.note;
  body.model.steps = steps;
  body.model.fields = fields;
  body.model.visual = {
    ...(body.model.visual || {}),
    src: visual.src,
    status: visual.status,
    label: visual.label,
    caption: nextCopy.caption,
    altTh: visual.altTh,
    altEn: visual.altEn,
  };
  await prisma.cmsDocument.update({
    where: { id: doc.id },
    data: { body: JSON.stringify(body) },
  });
  console.log("patched before-after", doc.id, doc.locale, doc.slug, doc.status);
}

console.log("docs", docs.length);
await prisma.$disconnect();
