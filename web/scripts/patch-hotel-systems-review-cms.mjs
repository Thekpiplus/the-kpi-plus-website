import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const visual = {
  src: "/images/hotel-systems-review-placeholder.webp",
  status: "sample",
  labelTh: "ตัวอย่าง Hotel Systems Review และ Data Consistency Audit",
  labelEn: "Sample Hotel Systems Review and Data Consistency Audit",
  captionTh: "กรอบทบทวนตัวอย่าง สำหรับจัดประเด็นระบบและข้อมูล ไม่ใช่ผลตรวจโรงแรมลูกค้า และต้องตรวจทางเทคนิคก่อนสรุปสถานะ",
  captionEn: "Sample review framework used to locate system and data issues. Not a client hotel diagnosis, and status is subject to technical verification.",
  altTh:
    "ตารางตัวอย่าง Hotel Systems Review และ Data Consistency Audit แสดงการเทียบประเภทห้อง ราคา และห้องว่างแบบปกปิดข้อมูล พร้อมสถานะ Needs Review Pending Access และ Not Configured ไม่ใช่ผลตรวจโรงแรมจริง และไม่ใช่รูปประชุมทีม",
  altEn:
    "Sample Hotel Systems Review and Data Consistency Audit showing a redacted room, rate, and availability comparison with Needs Review, Pending Access, and Not Configured statuses. Not a live hotel diagnosis and not a team-meeting photo.",
};

const copy = {
  th: {
    title: "โรงแรมของคุณกำลังเจอเรื่องนี้หรือไม่?",
    lead: "ข้อมูลห้อง ราคา หรือห้องว่างอาจไม่ตรงกัน พนักงานต้องกรอกซ้ำ ไม่ชัดว่าระบบใดเป็น Source of Truth ข้อมูล PMS, Channel Manager, Booking Engine หรือรายงานไม่ครบ และยังไม่มีผู้รับผิดชอบเมื่อข้อมูลผิดหรือการเชื่อมต่อล้ม",
    close: "นี่เป็นกรอบทบทวนตัวอย่าง ไม่ใช่ผลตรวจโรงแรมจริง และไม่ใช่สถานะเชื่อมต่อที่ตรวจแล้ว",
    label: visual.labelTh,
    caption: visual.captionTh,
  },
  en: {
    title: "Is the hotel facing these system and data problems?",
    lead: "Room, rate, or availability data may not match. Staff may enter the same facts in several places. The Source of Truth may be unclear. PMS, channel manager, booking engine, or reporting data may be incomplete. There may be no owner when information is wrong, reports may use different definitions, and a connected system may still lack error handling, a test process, or a contact path when an integration fails.",
    close: "This is a sample review framework. It is not a live hotel diagnosis, and not a verified integration status.",
    label: visual.labelEn,
    caption: visual.captionEn,
  },
};

const rows = [
  { id: "data-mismatch", num: "01", titleTh: "ข้อมูลห้อง ราคา ห้องว่าง", titleEn: "Room, rate, availability", questionTh: "ข้อมูลห้อง ราคา หรือห้องว่างในแต่ละระบบไม่ตรงกันหรือไม่?", questionEn: "Is room, rate, or availability data inconsistent across systems?", symptomTh: "", symptomEn: "", supportTh: "เทียบประเภทห้อง Rate Plan และห้องว่างข้ามระบบ", supportEn: "Compare room types, rate plans, and availability across systems", output: "Redacted room / rate / availability comparison", status: "needs_review", evidenceTh: "เทียบห้อง / ราคา / ห้องว่างแบบปกปิด", evidenceEn: "Redacted room / rate / availability comparison", ownerTh: "ยังไม่ระบุ", ownerEn: "Unassigned", actionTh: "เทียบประเภทห้อง Rate Plan และห้องว่างข้ามระบบ", actionEn: "Compare room types, rate plans, and availability across systems" },
  { id: "duplicate-entry", num: "02", titleTh: "กรอกข้อมูลซ้ำ", titleEn: "Repeated data entry", questionTh: "พนักงานต้องกรอกข้อมูลชุดเดียวกันในหลายที่หรือไม่?", questionEn: "Must staff enter the same data in several places?", symptomTh: "", symptomEn: "", supportTh: "ลิสต์จุดที่ต้องกรอกข้อมูลชุดเดียวกันซ้ำ", supportEn: "List where the same fact is entered more than once", output: "System inventory", status: "needs_review", evidenceTh: "System inventory", evidenceEn: "System inventory", ownerTh: "งานปฏิบัติการ", ownerEn: "Operations", actionTh: "ลิสต์จุดที่ต้องกรอกข้อมูลชุดเดียวกันซ้ำ", actionEn: "List where the same fact is entered more than once" },
  { id: "source-of-truth", num: "03", titleTh: "Source of Truth", titleEn: "Source of Truth", questionTh: "ยังไม่ชัดว่าระบบใดเป็น Source of Truth หรือไม่?", questionEn: "Is it unclear which system is the Source of Truth?", symptomTh: "", symptomEn: "", supportTh: "ระบุ Source of Truth ของห้อง ราคา และห้องว่าง", supportEn: "Name the Source of Truth for rooms, rates, and availability", output: "Sample system map", status: "needs_review", evidenceTh: "แผนที่ระบบตัวอย่าง", evidenceEn: "Sample system map", ownerTh: "ยังไม่ระบุ", ownerEn: "Unassigned", actionTh: "ระบุ Source of Truth ของห้อง ราคา และห้องว่าง", actionEn: "Name the Source of Truth for rooms, rates, and availability" },
  { id: "incomplete-data", num: "04", titleTh: "ข้อมูลไม่ครบ", titleEn: "Incomplete data", questionTh: "ข้อมูล PMS, Channel Manager, Booking Engine หรือรายงานยังไม่ครบหรือไม่?", questionEn: "Is PMS, channel manager, booking engine, or reporting data incomplete?", symptomTh: "", symptomEn: "", supportTh: "ขอสิทธิ์เข้าถึงแล้วทำให้รายการระบบครบ", supportEn: "Request access and complete the system inventory", output: "System inventory", status: "pending_access", evidenceTh: "System inventory", evidenceEn: "System inventory", ownerTh: "โรงแรม / ผู้ให้บริการ", ownerEn: "Hotel / provider", actionTh: "ขอสิทธิ์เข้าถึงแล้วทำให้รายการระบบครบ", actionEn: "Request access and complete the system inventory" },
  { id: "no-owner", num: "05", titleTh: "ไม่มีผู้รับผิดชอบ", titleEn: "No owner", questionTh: "เมื่อข้อมูลผิด ยังไม่มีผู้รับผิดชอบที่ชัดหรือไม่?", questionEn: "Is there no clear owner when information is wrong?", symptomTh: "", symptomEn: "", supportTh: "กำหนดผู้รับผิดชอบแต่ละชุดข้อมูล", supportEn: "Assign an owner for each data set", output: "Owner field blank", status: "needs_review", evidenceTh: "ช่อง Owner ว่าง", evidenceEn: "Owner field blank", ownerTh: "ยังไม่ระบุ", ownerEn: "Unassigned", actionTh: "กำหนดผู้รับผิดชอบแต่ละชุดข้อมูล", actionEn: "Assign an owner for each data set" },
  { id: "report-definitions", num: "06", titleTh: "นิยามรายงาน", titleEn: "Report definitions", questionTh: "รายงานมาจากหลายแหล่งและใช้นิยามไม่เหมือนกันหรือไม่?", questionEn: "Do reports come from multiple sources with different definitions?", symptomTh: "", symptomEn: "", supportTh: "บันทึกนิยามและแหล่งของแต่ละรายงาน", supportEn: "Record the definition and source of each report", output: "Redacted report sources", status: "needs_review", evidenceTh: "แหล่งรายงานแบบปกปิด", evidenceEn: "Redacted report sources", ownerTh: "รายได้ / การเงิน", ownerEn: "Revenue / finance", actionTh: "บันทึกนิยามและแหล่งของแต่ละรายงาน", actionEn: "Record the definition and source of each report" },
  { id: "no-test-process", num: "07", titleTh: "ไม่มีขั้นตอนทดสอบ", titleEn: "No test process", questionTh: "ระบบเชื่อมแล้ว แต่ยังไม่มี error handling หรือขั้นตอนทดสอบหรือไม่?", questionEn: "Is the system connected but missing error handling or a test process?", symptomTh: "", symptomEn: "", supportTh: "เพิ่มการจัดการข้อผิดพลาดและเคสทดสอบก่อน Go-live", supportEn: "Add error handling and a test case before go-live", output: "Integration checklist", status: "not_configured", evidenceTh: "Integration checklist", evidenceEn: "Integration checklist", ownerTh: "IT / ผู้ให้บริการ", ownerEn: "IT / provider", actionTh: "เพิ่มการจัดการข้อผิดพลาดและเคสทดสอบก่อน Go-live", actionEn: "Add error handling and a test case before go-live" },
  { id: "fail-contact", num: "08", titleTh: "ไม่รู้จะติดต่อใคร", titleEn: "No failure contact", questionTh: "เมื่อการเชื่อมต่อล้ม ทีมไม่รู้จะติดต่อใครหรือไม่?", questionEn: "Is it unclear who to contact when an integration fails?", symptomTh: "", symptomEn: "", supportTh: "ระบุผู้ติดต่อของโรงแรมและผู้ให้บริการเมื่อการเชื่อมต่อล้ม", supportEn: "Name the hotel and provider contacts for a failed integration", output: "Contact path missing", status: "blocked", evidenceTh: "ยังไม่มีเส้นทางติดต่อ", evidenceEn: "Contact path missing", ownerTh: "ยังไม่ระบุ", ownerEn: "Unassigned", actionTh: "ระบุผู้ติดต่อของโรงแรมและผู้ให้บริการเมื่อการเชื่อมต่อล้ม", actionEn: "Name the hotel and provider contacts for a failed integration" },
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
  if (!body?.assessment) continue;
  body.assessment.title = nextCopy.title;
  body.assessment.lead = nextCopy.lead;
  body.assessment.close = nextCopy.close;
  body.assessment.rows = rows;
  body.assessment.visual = {
    ...(body.assessment.visual || {}),
    src: visual.src,
    status: visual.status,
    label: nextCopy.label,
    caption: nextCopy.caption,
    altTh: visual.altTh,
    altEn: visual.altEn,
  };
  await prisma.cmsDocument.update({
    where: { id: doc.id },
    data: { body: JSON.stringify(body) },
  });
  console.log("patched review", doc.id, doc.locale, doc.slug, doc.status);
}

console.log("docs", docs.length);
await prisma.$disconnect();
