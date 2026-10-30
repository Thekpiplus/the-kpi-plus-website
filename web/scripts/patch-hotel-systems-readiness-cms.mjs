import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const visual = {
  src: "/images/hotel-systems-readiness-matrix-placeholder.webp",
  status: "sample",
  label: "Hotel Systems Implementation Readiness — Sample",
  altTh:
    "ตารางตัวอย่าง Hotel Systems Implementation Readiness แสดง Current Systems Data Mapping Access Integration Testing และ Ownership พร้อมสถานะ Needs Review Pending Access Requires Provider Support Blocked และ Not Configured ไม่ใช่สถานะโรงแรมจริง และไม่ได้ทำเครื่องหมาย Ready ทั้งตาราง",
  altEn:
    "Sample Hotel Systems Implementation Readiness matrix showing Current Systems, Data Mapping, Access, Integration, Testing, and Ownership, with Needs Review, Pending Access, Requires Provider Support, Blocked, and Not Configured statuses. Not a live hotel status, and not every row is marked Ready.",
};

const copy = {
  th: {
    title: "โรงแรมต้องเตรียมอะไรก่อนเริ่มงานนำไปใช้",
    lead: "ความพร้อมไม่ได้ดูจากสถานะว่าเชื่อมแล้ว แต่ดูว่าระบบที่มีอยู่ การจับคู่ข้อมูล สิทธิ์เข้าถึง ข้อจำกัดของผู้ให้บริการ เคสทดสอบ และผู้รับผิดชอบพร้อมก่อนเริ่มงานหรือยัง",
    caption: "กรอบความพร้อมตัวอย่าง โรงแรมต้องเตรียมระบบ การจับคู่ สิทธิ์เข้าถึง ข้อจำกัดผู้ให้บริการ เคสทดสอบ และผู้รับผิดชอบก่อนเริ่มงาน ไม่ใช่สถานะ Ready ของโรงแรมจริง",
  },
  en: {
    title: "What the hotel must prepare before implementation",
    lead: "Readiness is not a status that says connected. It is whether current systems, data mapping, access, provider limits, test cases, and owners are in place before the work starts.",
    caption: "Sample readiness framework. The hotel must prepare systems, mapping, access, provider limits, test cases, and owners before implementation. Not a live hotel Ready status.",
  },
};

const rows = [
  {
    id: "current-systems",
    areaTh: "ระบบที่มีอยู่",
    areaEn: "Current Systems",
    inspectTh: "รายการระบบ ผู้ให้บริการ วัตถุประสงค์ และผู้รับผิดชอบ",
    inspectEn: "System inventory, provider, purpose, and owner",
    evidenceTh: "รายการระบบและเจ้าของบัญชี",
    evidenceEn: "System list and account owner",
    status: "needs_review",
    ownerTh: "โรงแรม / งานปฏิบัติการ",
    ownerEn: "Hotel / operations",
    actionTh: "ลิสต์ระบบที่ใช้จริง ผู้ให้บริการ วัตถุประสงค์ และผู้รับผิดชอบ",
    actionEn: "List live systems, providers, purpose, and owners",
    output: "System Map",
    supportTh: "รายการระบบ ผู้ให้บริการ วัตถุประสงค์ และผู้รับผิดชอบ",
    supportEn: "System inventory, provider, purpose, and owner",
    deliverable: "System Map",
    approvalTh: "ลิสต์ระบบที่ใช้จริง ผู้ให้บริการ วัตถุประสงค์ และผู้รับผิดชอบ",
    approvalEn: "List live systems, providers, purpose, and owners",
  },
  {
    id: "data-mapping",
    areaTh: "การจับคู่ข้อมูล",
    areaEn: "Data Mapping",
    inspectTh: "ฟิลด์ห้อง ราคา ห้องว่าง การจอง การยกเลิก และช่องทาง",
    inspectEn: "Room, rate, availability, reservation, cancellation, and channel fields",
    evidenceTh: "แผ่นจับคู่หรือเอกสารผู้ให้บริการ",
    evidenceEn: "Mapping sheet or provider documentation",
    status: "not_configured",
    ownerTh: "โรงแรม / งานนำไปใช้",
    ownerEn: "Hotel / implementation",
    actionTh: "ร่างแผ่นจับคู่จากเอกสารผู้ให้บริการและฟิลด์ที่ใช้จริง",
    actionEn: "Draft the mapping sheet from provider docs and live fields",
    output: "Data Dictionary and Mapping Plan",
    supportTh: "ฟิลด์ห้อง ราคา ห้องว่าง การจอง การยกเลิก และช่องทาง",
    supportEn: "Room, rate, availability, reservation, cancellation, and channel fields",
    deliverable: "Data Dictionary and Mapping Plan",
    approvalTh: "ร่างแผ่นจับคู่จากเอกสารผู้ให้บริการและฟิลด์ที่ใช้จริง",
    approvalEn: "Draft the mapping sheet from provider docs and live fields",
  },
  {
    id: "access",
    areaTh: "สิทธิ์เข้าถึง",
    areaEn: "Access",
    inspectTh: "ผู้ดูแลระบบ ผู้ติดต่อด้านเทคนิค และสิทธิ์ API หรือตัวเชื่อม",
    inspectEn: "Administrator, technical contact, and API or connector permission",
    evidenceTh: "รายการสิทธิ์ที่อนุมัติแล้ว",
    evidenceEn: "Approved access list",
    status: "pending_access",
    ownerTh: "โรงแรม / ผู้ให้บริการ",
    ownerEn: "Hotel / provider",
    actionTh: "ขอสิทธิ์ที่อนุมัติ โดยไม่ส่งรหัสผ่าน",
    actionEn: "Request approved access. Do not send a password",
    output: "Access Plan",
    supportTh: "ผู้ดูแลระบบ ผู้ติดต่อด้านเทคนิค และสิทธิ์ API หรือตัวเชื่อม",
    supportEn: "Administrator, technical contact, and API or connector permission",
    deliverable: "Access Plan",
    approvalTh: "ขอสิทธิ์ที่อนุมัติ โดยไม่ส่งรหัสผ่าน",
    approvalEn: "Request approved access. Do not send a password",
  },
  {
    id: "integration",
    areaTh: "การเชื่อมระบบ",
    areaEn: "Integration",
    inspectTh: "การรองรับ API หรือตัวเชื่อม ข้อจำกัด ไลเซนส์ และการพึ่งพาผู้ให้บริการ",
    inspectEn: "API or connector support, limitations, licence, and provider dependency",
    evidenceTh: "เอกสารผู้ให้บริการและการยืนยัน",
    evidenceEn: "Provider documentation and confirmation",
    status: "requires_provider_support",
    ownerTh: "โรงแรม / ผู้ให้บริการระบบ",
    ownerEn: "Hotel / system provider",
    actionTh: "ยืนยันตัวเชื่อม ไลเซนส์ และข้อจำกัดกับผู้ให้บริการ",
    actionEn: "Confirm connector support, licence, and limits with the provider",
    output: "Integration Plan",
    supportTh: "การรองรับ API หรือตัวเชื่อม ข้อจำกัด ไลเซนส์ และการพึ่งพาผู้ให้บริการ",
    supportEn: "API or connector support, limitations, licence, and provider dependency",
    deliverable: "Integration Plan",
    approvalTh: "ยืนยันตัวเชื่อม ไลเซนส์ และข้อจำกัดกับผู้ให้บริการ",
    approvalEn: "Confirm connector support, licence, and limits with the provider",
  },
  {
    id: "testing",
    areaTh: "การทดสอบ",
    areaEn: "Testing",
    inspectTh: "เคสปกติ ข้อผิดพลาด ฟิลด์ขาด รายการซ้ำ และการยกเลิก",
    inspectEn: "Normal cases, errors, missing fields, duplicate records, and cancellations",
    evidenceTh: "เคสทดสอบและผลที่คาดหวัง",
    evidenceEn: "Test cases and expected results",
    status: "not_configured",
    ownerTh: "โรงแรม / งานนำไปใช้",
    ownerEn: "Hotel / implementation",
    actionTh: "เขียนเคสทดสอบก่อน Go-live",
    actionEn: "Write test cases before go-live",
    output: "QA Report",
    supportTh: "เคสปกติ ข้อผิดพลาด ฟิลด์ขาด รายการซ้ำ และการยกเลิก",
    supportEn: "Normal cases, errors, missing fields, duplicate records, and cancellations",
    deliverable: "QA Report",
    approvalTh: "เขียนเคสทดสอบก่อน Go-live",
    approvalEn: "Write test cases before go-live",
  },
  {
    id: "ownership",
    areaTh: "ความเป็นเจ้าของ",
    areaEn: "Ownership",
    inspectTh: "ผู้รับผิดชอบเมื่อข้อมูลผิดหรือการซิงค์ล้ม",
    inspectEn: "Owner when data is wrong or sync fails",
    evidenceTh: "RACI / รายชื่อผู้รับผิดชอบ",
    evidenceEn: "RACI / Owner List",
    status: "blocked",
    ownerTh: "ยังไม่ระบุ",
    ownerEn: "Unassigned",
    actionTh: "ระบุผู้รับผิดชอบเมื่อข้อมูลผิดหรือการซิงค์ล้ม",
    actionEn: "Name the owner for data errors and failed syncs",
    output: "Handover Plan",
    supportTh: "ผู้รับผิดชอบเมื่อข้อมูลผิดหรือการซิงค์ล้ม",
    supportEn: "Owner when data is wrong or sync fails",
    deliverable: "Handover Plan",
    approvalTh: "ระบุผู้รับผิดชอบเมื่อข้อมูลผิดหรือการซิงค์ล้ม",
    approvalEn: "Name the owner for data errors and failed syncs",
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
  if (!body?.deliverables) continue;
  body.deliverables.title = nextCopy.title;
  body.deliverables.lead = nextCopy.lead;
  body.deliverables.rows = rows;
  body.deliverables.visual = {
    ...(body.deliverables.visual || {}),
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
  console.log("patched readiness", doc.id, doc.locale, doc.slug, doc.status);
}

console.log("docs", docs.length);
await prisma.$disconnect();
