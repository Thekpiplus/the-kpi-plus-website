import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const visual = {
  src: "/images/hotel-systems-platform-landscape-placeholder.webp",
  status: "sample",
  label: "Hotel Technology Landscape — Example Categories",
  altTh:
    "แผนที่หมวดเทคโนโลยีโรงแรมตัวอย่าง PMS Channel Manager Booking Engine Revenue Analytics และ Communication ไม่ใช่โลโก้วอลล์ ไม่ใช่หลักฐานว่าเชื่อมต่อแล้ว และไม่ได้หมายถึงความร่วมมือ การรับรอง หรือการรับรองอย่างเป็นทางการ",
  altEn:
    "Sample hotel technology landscape of PMS, Channel Manager, Booking Engine, Revenue, Analytics, and Communication categories. Not a logo wall, not proof of integration, and not a partnership, sponsorship, certification, or official endorsement.",
};

const copy = {
  th: {
    title: "ระบบและแพลตฟอร์มที่เกี่ยวข้อง",
    lead: "ชื่อแพลตฟอร์มใช้ระบุหมวดที่อาจเกี่ยวข้องกับงานเท่านั้น ไม่ใช่โลโก้วอลล์ ไม่ใช่หลักฐานว่าเชื่อมต่อแล้ว และไม่ได้หมายถึงความร่วมมือ สปอนเซอร์ การรับรอง หรือการรับรองอย่างเป็นทางการ",
    caption: "หมวดตัวอย่าง / ต้องตรวจทางเทคนิคก่อน ชื่อแพลตฟอร์มใช้ระบุหมวด ไม่ใช่โลโก้วอลล์ และไม่ใช่สถานะเชื่อมต่อที่ตรวจแล้ว",
    notTitle: "หน้านี้ไม่ได้หมายความว่า…",
  },
  en: {
    title: "Related systems and platforms",
    lead: "Platform names identify categories that may be in scope. This is not a logo wall, not proof of integration, and not a partnership, sponsorship, certification, or official endorsement.",
    caption: "Examples / Subject to technical verification. Names identify categories. This is not a logo wall, and not a verified integration status.",
    notTitle: "This page does not mean…",
  },
};

const scenarios = [
  {
    id: "pms",
    categoryTh: "PMS / Property Management",
    categoryEn: "PMS / Property Management",
    example: "Cloudbeds, OPERA Cloud, Yanolja Cloud",
    logoSrc: "",
    roleTh: "แหล่งความจริงของห้อง ราคา และการจอง",
    roleEn: "Source of Truth for rooms, rates, and reservations",
    flowTh: "ห้อง ราคา ห้องว่าง การจอง และการยกเลิก",
    flowEn: "Room, rate, availability, reservation, and cancellation",
    integrationStatus: "example_category",
    verificationStatus: "requires_verification",
    providerTh: "ไลเซนส์ สิทธิ์ API หรือตัวเชื่อม และการอนุมัติผู้ให้บริการ",
    providerEn: "Licence, API or connector permission, and provider approval",
  },
  {
    id: "channel",
    categoryTh: "Channel Manager / Distribution",
    categoryEn: "Channel Manager / Distribution",
    example: "SiteMinder",
    logoSrc: "",
    roleTh: "กระจายห้องและราคาที่จับคู่แล้วไปยัง OTA",
    roleEn: "Distribute mapped rooms and rates to OTAs",
    flowTh: "ห้องว่าง ราคา ข้อจำกัด การจอง และการยกเลิก",
    flowEn: "Availability, rate, restriction, reservation, and cancellation",
    integrationStatus: "supported_via_provider",
    verificationStatus: "not_yet_verified",
    providerTh: "การจับคู่ช่องทางและตัวเชื่อมของผู้ให้บริการ",
    providerEn: "Channel mapping and the provider connector",
  },
  {
    id: "booking",
    categoryTh: "Booking Engine / Direct Booking",
    categoryEn: "Booking Engine / Direct Booking",
    example: "Hotel website booking engine",
    logoSrc: "",
    roleTh: "เส้นทางจองตรงจากเว็บไซต์ไปยังห้องว่าง",
    roleEn: "Direct booking path from the website to inventory",
    flowTh: "ห้องว่าง ราคา และการจอง ไม่รวมรหัสผ่านหรือข้อมูลชำระเงิน",
    flowEn: "Availability, rate, and reservation. Not passwords or payment data",
    integrationStatus: "example_category",
    verificationStatus: "requires_verification",
    providerTh: "ไลเซนส์ Booking Engine และตัวเชื่อมเว็บไซต์",
    providerEn: "Booking engine licence and website connector",
  },
  {
    id: "revenue",
    categoryTh: "Revenue / Rate Management",
    categoryEn: "Revenue / Rate Management",
    example: "Rate tools in the current stack",
    logoSrc: "",
    roleTh: "แผนราคาและเงื่อนไขการขาย",
    roleEn: "Rate plans and selling conditions",
    flowTh: "Rate Plan ข้อจำกัด และราคาตาม Occupancy",
    flowEn: "Rate plan, restriction, and occupancy-based rate",
    integrationStatus: "not_in_scope",
    verificationStatus: "not_yet_verified",
    providerTh: "โครงสร้างราคาของโรงแรม และผู้ให้บริการถ้านอกสิทธิ์",
    providerEn: "Hotel-owned rate structure, and the provider if outside access",
  },
  {
    id: "analytics",
    categoryTh: "Analytics / Reporting",
    categoryEn: "Analytics / Reporting",
    example: "PMS or channel reports",
    logoSrc: "",
    roleTh: "Occupancy ADR และผลงานช่องทาง ตามนิยามที่ตกลง",
    roleEn: "Occupancy, ADR, and channel pickup, using agreed definitions",
    flowTh: "การจอง Occupancy ช่องทาง และฟิลด์รายได้เท่าที่ระบบรองรับ",
    flowEn: "Reservation, occupancy, channel, and revenue fields as supported",
    integrationStatus: "example_category",
    verificationStatus: "not_yet_verified",
    providerTh: "การส่งออกหรือ API และนิยามรายงานที่ตกลง",
    providerEn: "Export or API, and agreed report definitions",
  },
  {
    id: "communication",
    categoryTh: "Communication / Guest Experience",
    categoryEn: "Communication / Guest Experience",
    example: "Guest messaging in the current stack",
    logoSrc: "",
    roleTh: "การสื่อสารกับแขกหลังมีการจอง",
    roleEn: "Guest communication after a booking",
    flowTh: "สถานะการจองและวันที่เข้าพัก ไม่รวมข้อมูลชำระเงิน",
    flowEn: "Reservation status and stay dates. Not payment data",
    integrationStatus: "not_in_scope",
    verificationStatus: "not_yet_verified",
    providerTh: "เครื่องมือของโรงแรมและสิทธิ์จากผู้ให้บริการ",
    providerEn: "Hotel-owned guest tools and provider permission",
  },
].map((row) => ({
  ...row,
  situationTh: row.categoryTh,
  situationEn: row.categoryEn,
  symptomTh: row.roleTh,
  symptomEn: row.roleEn,
  questionTh: row.flowTh,
  questionEn: row.flowEn,
  supportTh: row.providerTh,
  supportEn: row.providerEn,
  output: row.example,
}));

const notItems = [
  { id: "logo-wall", th: "โลโก้ไม่ใช่หลักฐานว่าเชื่อมต่อแล้ว และหน้านี้ไม่ใช่โลโก้วอลล์", en: "A logo wall is not proof of integration, and this page is not a logo wall." },
  { id: "endorsement", th: "ชื่อแพลตฟอร์มไม่ได้หมายถึงความร่วมมือ สปอนเซอร์ การรับรอง หรือการรับรองอย่างเป็นทางการ", en: "Platform names do not mean a partnership, sponsorship, certification, or official endorsement." },
  { id: "every-api", th: "ไม่ใช่ทุกแพลตฟอร์มเชื่อมกับทุกแพลตฟอร์มได้ และตัวอย่างต้องตรวจทางเทคนิคก่อน", en: "Not every platform can connect to every other platform. Examples are subject to technical verification." },
  { id: "secrets", th: "ไม่รับรหัสผ่าน คีย์ โทเคน หรือข้อมูลแขกทางฟอร์มนี้", en: "Do not send passwords, keys, tokens, or guest data through this form." },
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
  if (!body?.fit) continue;
  body.fit.title = nextCopy.title;
  body.fit.lead = nextCopy.lead;
  body.fit.scenarios = scenarios;
  body.fit.notTitle = nextCopy.notTitle;
  body.fit.notItems = notItems;
  body.fit.visual = {
    ...(body.fit.visual || {}),
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
  console.log("patched platforms", doc.id, doc.locale, doc.slug, doc.status);
}

console.log("docs", docs.length);
await prisma.$disconnect();
