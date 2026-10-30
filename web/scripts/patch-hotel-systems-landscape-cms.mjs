import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const visual = {
  src: "/images/hotel-systems-landscape-placeholder.webp",
  status: "sample",
  label: "Hotel Systems Landscape — Sample",
  altTh:
    "แผนภาพตัวอย่าง Hotel Systems Landscape แสดงเส้นทาง Guest ไป Website หรือ Booking Engine ไป PMS ไป Channel Manager แล้วแยกไป OTA และ Reporting ก่อนถึงทีมโรงแรม พร้อมสถานะ Needs Mapping Pending Access Requires Provider Support Testing และ Not Configured ไม่ใช่โลโก้วอลล์ และไม่ใช่สถานะเชื่อมต่อที่ตรวจแล้ว",
  altEn:
    "Sample Hotel Systems Landscape showing Guest to Website or Booking Engine to PMS to Channel Manager, then to OTA and Reporting, then to the hotel team, with Needs Mapping, Pending Access, Requires Provider Support, Testing, and Not Configured statuses. Not a logo wall and not a verified integration status.",
};

const copy = {
  th: {
    title: "ระบบและข้อมูลที่อาจต้องทำงานร่วมกัน",
    lead: "โรงแรมอาจใช้ Website, Booking Engine, PMS, Channel Manager, OTA และรายงานร่วมกัน แต่ข้อมูลประเภทห้อง Rate Plan ห้องว่าง การจอง และรายงานไม่ได้ไหลครบทุกจุดโดยอัตโนมัติ",
    boundary: "Data Flow depends on the provider, API/connector, field mapping, permission, and agreed scope.",
    caption: "เส้นทางตัวอย่าง ข้อมูลไม่ได้ไหลครบทุกระบบโดยอัตโนมัติ และต้องตรวจผู้ให้บริการ API การจับคู่สิทธิ์ และขอบเขตที่ตกลง",
  },
  en: {
    title: "Systems and areas that may need to work together",
    lead: "A hotel may use a website, booking engine, PMS, channel manager, OTAs, and reporting together. Room type, rate plan, availability, reservations, and reports still do not move across every system automatically.",
    boundary: "Data Flow depends on the provider, API/connector, field mapping, permission, and agreed scope.",
    caption: "A sample path. Data does not flow across every system automatically. Provider, API or connector, mapping, permission, and agreed scope must be verified.",
  },
};

const items = [
  {
    id: "guest",
    stream: "guest",
    titleTh: "Guest / Booking Source",
    titleEn: "Guest / Booking Source",
    inputTh: "วันที่เข้าพัก ประเภทห้องที่สนใจ และคำขอจอง ไม่แสดงข้อมูลส่วนตัวของแขก",
    inputEn: "Stay dates, the room type requested, and booking intent. No guest personal data is shown",
    actionTh: "จุดเริ่มคำขอจอง จากเว็บไซต์ OTA หรือช่องทางอื่น",
    actionEn: "Where a booking request can start, from the website, an OTA, or another channel",
    output: "A booking request to the website or a selling channel",
    approvalTh: "ขึ้นกับช่องทางที่โรงแรมเปิดขาย",
    approvalEn: "Depends on the channel the hotel has opened",
    ownerTh: "แขก / ช่องทางขาย",
    ownerEn: "Guest / selling channel",
    roleTh: "จุดเริ่มคำขอจอง จากเว็บไซต์ OTA หรือช่องทางอื่น",
    roleEn: "Where a booking request can start, from the website, an OTA, or another channel",
    dataOutTh: "คำขอจองไปยังเว็บไซต์ หรือช่องทางขาย",
    dataOutEn: "A booking request to the website or a selling channel",
    sourceOfTruthTh: "ไม่ใช่ระบบโรงแรม และไม่ใช่ Source of Truth",
    sourceOfTruthEn: "Not a hotel system, and not a Source of Truth",
    status: "not_configured",
    providerTh: "ขึ้นกับช่องทางที่โรงแรมเปิดขาย",
    providerEn: "Depends on the channel the hotel has opened",
  },
  {
    id: "website",
    stream: "web",
    titleTh: "Website / Booking Engine",
    titleEn: "Website / Booking Engine",
    inputTh: "ประเภทห้อง Rate Plan ห้องว่าง และเงื่อนไขที่จับคู่แล้ว",
    inputEn: "Room type, rate plan, availability, and conditions, if mapped",
    actionTh: "เส้นทางจองตรงที่แขกเห็นราคาและเงื่อนไข",
    actionEn: "The direct booking path where the guest sees rates and conditions",
    output: "Reservation requests, booking status, and cancellations as far as the engine supports",
    approvalTh: "ผู้ให้บริการ Booking Engine และสิทธิ์ API หรือตัวเชื่อม",
    approvalEn: "Booking-engine provider, plus API or connector access",
    ownerTh: "โรงแรม / เจ้าของเว็บไซต์",
    ownerEn: "Hotel / website owner",
    roleTh: "เส้นทางจองตรงที่แขกเห็นราคาและเงื่อนไข",
    roleEn: "The direct booking path where the guest sees rates and conditions",
    dataOutTh: "คำขอจอง สถานะการจอง และการยกเลิกตามที่ระบบรองรับ",
    dataOutEn: "Reservation requests, booking status, and cancellations as far as the engine supports",
    sourceOfTruthTh: "ไม่ใช่ Source of Truth ของห้องและราคา เว้นแต่โรงแรมกำหนด",
    sourceOfTruthEn: "Not the Source of Truth for rooms and rates unless the hotel agrees it is",
    status: "needs_mapping",
    providerTh: "ผู้ให้บริการ Booking Engine และสิทธิ์ API หรือตัวเชื่อม",
    providerEn: "Booking-engine provider, plus API or connector access",
  },
  {
    id: "pms",
    stream: "pms",
    titleTh: "PMS / Reservation System",
    titleEn: "PMS / Reservation System",
    inputTh: "การจอง การยกเลิก และการเปลี่ยนวันเข้าพัก",
    inputEn: "Reservations, cancellations, and stay changes",
    actionTh: "มักเป็นผู้สมัคร Source of Truth ของห้อง ราคา และการจอง",
    actionEn: "Often the candidate Source of Truth for rooms, rates, and reservations",
    output: "Room type, rate plan, availability, and booking status",
    approvalTh: "ผู้ให้บริการ PMS ไลเซนส์ และสิทธิ์เข้าถึง",
    approvalEn: "PMS vendor, licence, and access",
    ownerTh: "โรงแรม / ผู้ให้บริการ PMS",
    ownerEn: "Hotel / PMS provider",
    roleTh: "มักเป็นผู้สมัคร Source of Truth ของห้อง ราคา และการจอง",
    roleEn: "Often the candidate Source of Truth for rooms, rates, and reservations",
    dataOutTh: "ประเภทห้อง Rate Plan ห้องว่าง และสถานะการจอง",
    dataOutEn: "Room type, rate plan, availability, and booking status",
    sourceOfTruthTh: "ผู้สมัคร — ต้องยืนยันทีละโรงแรม ไม่สรุปอัตโนมัติ",
    sourceOfTruthEn: "A candidate only. It must be confirmed per hotel, not assumed",
    status: "needs_mapping",
    providerTh: "ผู้ให้บริการ PMS ไลเซนส์ และสิทธิ์เข้าถึง",
    providerEn: "PMS vendor, licence, and access",
  },
  {
    id: "cm",
    stream: "cm",
    titleTh: "Channel Manager",
    titleEn: "Channel Manager",
    inputTh: "ห้อง ราคา และห้องว่างจาก PMS หากจับคู่และมีสิทธิ์",
    inputEn: "Rooms, rates, and availability from the PMS, if mapped and access exists",
    actionTh: "กระจายห้อง ราคา และห้องว่างไปยังช่องทางที่จับคู่แล้ว",
    actionEn: "Distributes mapped rooms, rates, and availability to selling channels",
    output: "Updates to OTAs and booking returns, as far as the connector supports",
    approvalTh: "ผู้ให้บริการ CM ต้องอนุมัติตัวเชื่อมหรือ API",
    approvalEn: "The CM provider must approve the connector or API",
    ownerTh: "โรงแรม / ผู้ให้บริการ Channel Manager",
    ownerEn: "Hotel / channel-manager provider",
    roleTh: "กระจายห้อง ราคา และห้องว่างไปยังช่องทางที่จับคู่แล้ว",
    roleEn: "Distributes mapped rooms, rates, and availability to selling channels",
    dataOutTh: "อัปเดตไป OTA และการจองกลับ ตามที่ตัวเชื่อมรองรับ",
    dataOutEn: "Updates to OTAs and booking returns, as far as the connector supports",
    sourceOfTruthTh: "ไม่ใช่ Source of Truth ขึ้นกับการจับคู่",
    sourceOfTruthEn: "Not the Source of Truth. It depends on mapping",
    status: "pending_access",
    providerTh: "ผู้ให้บริการ CM ต้องอนุมัติตัวเชื่อมหรือ API",
    providerEn: "The CM provider must approve the connector or API",
  },
  {
    id: "ota",
    stream: "ota",
    titleTh: "OTA / Distribution",
    titleEn: "OTA / Distribution",
    inputTh: "ประเภทห้อง Rate Plan และห้องว่างที่จับคู่แล้ว",
    inputEn: "Mapped room type, rate plan, and availability",
    actionTh: "ช่องทางขายภายนอก ไม่ใช่ระบบหลักของโรงแรม",
    actionEn: "External selling channels. Not the hotel’s core system",
    output: "Reservations, cancellations, and source/channel",
    approvalTh: "แต่ละ OTA แยกกัน โรงแรมเชื่อมได้ไม่ครบทุกช่องทางเสมอ",
    approvalEn: "Each OTA is separate. Not every channel can connect",
    ownerTh: "ผู้ให้บริการช่องทาง",
    ownerEn: "Channel provider",
    roleTh: "ช่องทางขายภายนอก ไม่ใช่ระบบหลักของโรงแรม",
    roleEn: "External selling channels. Not the hotel’s core system",
    dataOutTh: "การจอง การยกเลิก และแหล่ง/ช่องทาง",
    dataOutEn: "Reservations, cancellations, and source/channel",
    sourceOfTruthTh: "รายการบน OTA ไม่ใช่ Source of Truth ของโรงแรม",
    sourceOfTruthEn: "The OTA listing is not the hotel Source of Truth",
    status: "requires_provider_support",
    providerTh: "แต่ละ OTA แยกกัน โรงแรมเชื่อมได้ไม่ครบทุกช่องทางเสมอ",
    providerEn: "Each OTA is separate. Not every channel can connect",
  },
  {
    id: "reporting",
    stream: "reporting",
    titleTh: "Reporting / Dashboard",
    titleEn: "Reporting / Dashboard",
    inputTh: "การจอง แหล่ง/ช่องทาง และข้อมูลผลงานตามที่ระบบรองรับ ไม่แสดงยอดจริง",
    inputEn: "Reservations, source/channel, and performance data the systems can expose. No live totals are shown",
    actionTh: "มุมมองให้ทีมตัดสินใจ จากข้อมูลที่ระบบเปิดให้ใช้",
    actionEn: "A view for team decisions, from data the systems can expose",
    output: "Reports for the team. Definitions may differ by source",
    approvalTh: "PMS, Channel Manager หรือผู้ให้บริการรายงาน",
    approvalEn: "PMS, channel manager, or reporting vendor",
    ownerTh: "รายได้ / การเงินของโรงแรม",
    ownerEn: "Hotel revenue / finance",
    roleTh: "มุมมองให้ทีมตัดสินใจ จากข้อมูลที่ระบบเปิดให้ใช้",
    roleEn: "A view for team decisions, from data the systems can expose",
    dataOutTh: "รายงานสำหรับทีม นิยามอาจต่างกันในแต่ละแหล่ง",
    dataOutEn: "Reports for the team. Definitions may differ by source",
    sourceOfTruthTh: "ใช้ได้เท่าที่ระบบต้นทางและนิยามที่ตกลงรองรับ",
    sourceOfTruthEn: "Only as far as the source systems and agreed definitions allow",
    status: "not_configured",
    providerTh: "PMS, Channel Manager หรือผู้ให้บริการรายงาน",
    providerEn: "PMS, channel manager, or reporting vendor",
  },
  {
    id: "team",
    stream: "team",
    titleTh: "Hotel Team / Decisions",
    titleEn: "Hotel Team / Decisions",
    inputTh: "รายงาน สถานะการจอง และข้อผิดพลาดที่ทีมเห็น",
    inputEn: "Reports, booking status, and errors the team can see",
    actionTh: "คนที่เปลี่ยนราคา ตรวจการจอง และแก้เมื่อข้อมูลผิด",
    actionEn: "The people who change rates, check bookings, and fix facts when something is wrong",
    output: "Decisions on rates, mapping, and ownership",
    approvalTh: "โรงแรม และผู้ให้บริการเมื่อการเชื่อมต่อล้ม",
    approvalEn: "The hotel, and the provider when an integration fails",
    ownerTh: "ตำแหน่งในโรงแรมที่ระบุชื่อได้",
    ownerEn: "Named hotel roles",
    roleTh: "คนที่เปลี่ยนราคา ตรวจการจอง และแก้เมื่อข้อมูลผิด",
    roleEn: "The people who change rates, check bookings, and fix facts when something is wrong",
    dataOutTh: "การตัดสินใจเรื่องราคา การจับคู่ และผู้รับผิดชอบ",
    dataOutEn: "Decisions on rates, mapping, and ownership",
    sourceOfTruthTh: "ความเป็นเจ้าของขั้นตอน ไม่ใช่ระบบ",
    sourceOfTruthEn: "Process ownership, not a system",
    status: "testing",
    providerTh: "โรงแรม และผู้ให้บริการเมื่อการเชื่อมต่อล้ม",
    providerEn: "The hotel, and the provider when an integration fails",
  },
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
  if (!body?.services) continue;
  body.services.title = nextCopy.title;
  body.services.lead = nextCopy.lead;
  body.services.boundary = nextCopy.boundary;
  body.services.items = items;
  body.services.visual = {
    ...(body.services.visual || {}),
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
  console.log("patched landscape", doc.id, doc.locale, doc.slug, doc.status);
}

console.log("docs", docs.length);
await prisma.$disconnect();
