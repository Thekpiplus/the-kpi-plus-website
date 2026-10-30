import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const visual = {
  src: "/images/hotel-systems-handover-placeholder.webp",
  status: "sample",
  label: "Hotel Systems Handover and Ownership — Sample",
  altTh:
    "ตารางตัวอย่างการส่งมอบระบบโรงแรม รายการเอกสารที่ส่ง และตารางเจ้าของระบบ ไม่เก็บรหัสผ่านหรือคีย์ API และไม่ทำเครื่องหมาย Live หรือ Handed Over จนกว่าโรงแรมจะอนุมัติและเอกสารถูกต้องครบ",
  altEn:
    "Sample hotel systems handover checklist and ownership table. No passwords or API keys are stored. A system is not marked Live or Handed Over until hotel approval and required documentation are complete.",
};

const copy = {
  th: {
    title: "การส่งมอบและความเป็นเจ้าของ",
    lead: "นี่เป็นรายการส่งมอบและตารางเจ้าของตัวอย่าง เก็บเฉพาะชื่อบทบาท ระดับสิทธิ์ และผู้รับผิดชอบต่ออายุ ไม่เก็บรหัสผ่าน คีย์ API หรือข้อมูลรับรอง ระบบจะไม่ถูกทำเครื่องหมาย Live หรือ Handed Over จนกว่าโรงแรมจะอนุมัติและเอกสารที่ต้องมีครบ",
    checklistTitle: "Handover Checklist",
    ownershipTitle: "Ownership",
    caption: "ตัวอย่างการส่งมอบ เก็บเฉพาะเจ้าของ บทบาท และระดับสิทธิ์ ไม่เก็บรหัสผ่าน และไม่ทำเครื่องหมาย Live หรือ Handed Over จนกว่าจะอนุมัติครบ",
    close: "เดอะ เคพีไอ พลัสไม่เก็บรหัสผ่านของระบบที่ใช้งานจริง ความเป็นเจ้าของงานปฏิบัติการหลังส่งมอบยังเป็นของโรงแรม",
    sampleLabel: "Hotel Systems Handover and Ownership — Sample",
  },
  en: {
    title: "Handover and Ownership",
    lead: "This is a sample handover checklist and ownership table. It stores role names, access levels, and renewal responsibility only. It does not store passwords, API keys, or credentials. A system is not marked Live or Handed Over until hotel approval and the required documentation are complete.",
    checklistTitle: "Handover Checklist",
    ownershipTitle: "Ownership",
    caption: "Sample handover. Stores named owners, roles, and access levels only. No passwords. A system is not marked Live or Handed Over until approvals and documentation are complete.",
    close: "The KPI Plus does not keep production credentials. Operational ownership after handover stays with the hotel.",
    sampleLabel: "Hotel Systems Handover and Ownership — Sample",
  },
};

const owner = {
  th: "ยังไม่ระบุ — แทนที่ด้วยเจ้าของโรงแรมที่อนุมัติ",
  en: "Unassigned — replace with the approved hotel owner",
};
const evidence = {
  th: "แฟ้มตัวอย่าง — ไม่ใช่ไฟล์ลูกค้าจริง และไม่มีรหัสผ่าน",
  en: "Sample pack — not a live client file, and no password",
};
const contact = {
  th: "บทบาทติดต่อตัวอย่าง ไม่ใช่รหัสผ่านหรือคีย์ API",
  en: "Sample contact role. Not a password or API key",
};
const reviewed = "Sample — not a live review date";

const checklist = [
  ["inventory", "System inventory delivered", "documented_sample", "ทีมนำไปใช้ ตามขอบเขตที่ตกลง", "Implementation team, within the agreed scope", "ตารางตัวอย่าง System Inventory — ไม่ใช่แฟ้มโรงแรมจริง", "Sample System Inventory table — not a live hotel file"],
  ["architecture", "Architecture diagram delivered", "in_progress", owner.th, owner.en, evidence.th, evidence.en],
  ["mapping", "Data mapping delivered", "in_progress", "ทีมนำไปใช้ ตามขอบเขตที่ตกลง", "Implementation team, within the agreed scope", "ตาราง Data Dictionary ตัวอย่าง ขึ้นกับการตรวจของผู้ให้บริการ", "Sample Data Dictionary. Subject to provider verification"],
  ["tests", "Test cases and QA results delivered", "awaiting_signoff", "เจ้าของงานปฏิบัติการของโรงแรม", "Hotel operations owner", "รอผลทดสอบที่อนุมัติ ไม่ทำเครื่องหมาย Passed ถ้าไม่ติดป้าย Sample", "Awaiting approved test results. Do not mark Passed unless labelled Sample"],
  ["issues", "Known issues listed", "in_progress", "ทีมนำไปใช้", "Implementation team", "รายการปัญหาตัวอย่าง ไม่มีข้อมูลแขกหรือข้อมูลชำระเงิน", "Sample issue list. No guest or payment data"],
  ["contacts", "Provider contacts listed", "not_started", "เจ้าของสัญญาโรงแรม", "Hotel contract owner", "ยังไม่มีรายชื่อที่อนุมัติ ไม่เก็บรหัสผ่าน", "Approved names are not yet filed. No password is stored"],
  ["access", "Access owner listed", "awaiting_signoff", "โรงแรมต้องระบุเจ้าของสิทธิ์", "The hotel must name the access owner", "Pending Access — ไม่เก็บรหัสผ่าน", "Pending Access — no password is stored"],
  ["sop", "SOP delivered", "not_started", owner.th, owner.en, "ยังไม่มี SOP ที่อนุมัติ", "No approved SOP yet"],
  ["error", "Error-handling path documented", "in_progress", "ทีมนำไปใช้ ตามขอบเขตที่ตกลง", "Implementation team, within the agreed scope", "เส้นทาง Detect → Close ตัวอย่าง ยังไม่ใช่ SOP ที่ลงนาม", "Sample Detect → Close path. Not a signed SOP"],
  ["rollback", "Rollback/escalation plan documented where applicable", "not_started", "โรงแรมและผู้ให้บริการ", "Hotel and provider", "ใช้เมื่อขอบเขตงานกำหนด และโรงแรมต้องอนุมัติ", "Used where the scope requires it. Hotel approval is required"],
  ["signoff", "Hotel sign-off recorded", "awaiting_signoff", "เจ้าของโรงแรมหรือ GM", "Hotel owner or GM", "ยังไม่มีลายเซ็น Go-live ของโรงแรม", "Hotel Go-live sign-off is not recorded"],
  ["post-owner", "Post-go-live owner confirmed", "incomplete", "โรงแรมยังรับผิดชอบงานปฏิบัติการหลังส่งมอบ", "The hotel remains responsible for operations after handover", "ยังไม่ยืนยันเจ้าของหลังเริ่มใช้จริง", "Post-go-live owner is not yet confirmed"],
].map(([id, item, status, ownerTh, ownerEn, evidenceTh, evidenceEn]) => ({
  id,
  itemTh: item,
  itemEn: item,
  status,
  ownerTh,
  ownerEn,
  evidenceTh,
  evidenceEn,
}));

const ownership = [
  ["pms", "PMS", "โรงแรม / ผู้ให้บริการ PMS", "Hotel / PMS provider", "เจ้าของโรงแรมหรือ GM", "Hotel owner or GM", "Pending Access", "เจ้าของสัญญาโรงแรม", "Hotel contract owner", "not_handed_over"],
  ["channel", "Channel Manager", "โรงแรม / ผู้ให้บริการ Channel Manager", "Hotel / channel-manager provider", "เจ้าของงานเชิงพาณิชย์ของโรงแรม", "Hotel commercial owner", "Pending Access", "เจ้าของสัญญาโรงแรม", "Hotel contract owner", "pending_approval"],
  ["booking", "Booking Engine", "โรงแรม / เว็บไซต์", "Hotel / website", "เจ้าของงานเชิงพาณิชย์ของโรงแรม", "Hotel commercial owner", "Named hotel owner — Sample", "เจ้าของสัญญาโรงแรม", "Hotel contract owner", "documentation_incomplete"],
  ["analytics", "Analytics", "โรงแรม", "Hotel", "เจ้าของงานเชิงพาณิชย์ของโรงแรม", "Hotel commercial owner", "Not granted", "เจ้าของสัญญาโรงแรม", "Hotel contract owner", "not_handed_over"],
  ["domain", "Domain", "โรงแรม", "Hotel", "เจ้าของโรงแรมหรือ GM", "Hotel owner or GM", "Hotel contract owner", "เจ้าของโดเมนโรงแรม", "Hotel domain owner", "owner_assigned_sample"],
  ["hosting", "Hosting", "โรงแรม / ผู้ให้บริการโฮสต์", "Hotel / hosting provider", "เจ้าของโรงแรมหรือ GM", "Hotel owner or GM", "Hotel contract — provider-held", "เจ้าของสัญญาโรงแรม", "Hotel contract owner", "pending_approval"],
  ["api", "API/Connector", "โรงแรมถือสัญญา ผู้ให้บริการถือสิทธิ์เทคนิค", "Hotel holds the contract. The provider holds technical permission", "โรงแรมและผู้ให้บริการ", "Hotel and provider", "Pending Access", "เจ้าของสัญญาโรงแรม", "Hotel contract owner", "not_handed_over"],
  ["reporting", "Reporting", "โรงแรม", "Hotel", "เจ้าของงานเชิงพาณิชย์ของโรงแรม", "Hotel commercial owner", "Named hotel owner — Sample", "โรงแรม", "Hotel", "documentation_incomplete"],
  ["form-inbox", "Form inbox", "โรงแรม", "Hotel", "เจ้าของงานปฏิบัติการของโรงแรม", "Hotel operations owner", "Named hotel owner — Sample", "โรงแรม", "Hotel", "owner_assigned_sample"],
  ["documentation", "Documentation", "โรงแรมหลังลงนาม ทีมนำไปใช้จนกว่าจะส่งมอบ", "Hotel after sign-off. Implementation team until handover", "เจ้าของโรงแรมหรือ GM", "Hotel owner or GM", "Implementation team until handover — Sample", "โรงแรมหลังลงนาม", "Hotel after sign-off", "not_handed_over"],
].map(([id, asset, ownerTh, ownerEn, approvalTh, approvalEn, access, renewalTh, renewalEn, status]) => ({
  id,
  assetTh: asset,
  assetEn: asset,
  ownerTh,
  ownerEn,
  contactTh: id === "domain" ? "เจ้าของโดเมนโรงแรม — บทบาทตัวอย่าง" : id === "form-inbox" ? "เจ้าของกล่องรับเรื่องโรงแรม — บทบาทตัวอย่าง" : contact.th,
  contactEn: id === "domain" ? "Hotel domain owner — sample role" : id === "form-inbox" ? "Hotel inbox owner — sample role" : contact.en,
  approvalTh,
  approvalEn,
  accessTh: access,
  accessEn: access,
  renewalTh,
  renewalEn,
  reviewed,
  status,
}));

const docs = await prisma.cmsDocument.findMany({
  where: {
    OR: [{ template: "hotel-systems-implementation" }, { slug: { contains: "hotel-systems-implementation" } }],
  },
});

for (const doc of docs) {
  const locale = doc.locale === "en" ? "en" : "th";
  const nextCopy = copy[locale];
  const body = typeof doc.body === "string" ? JSON.parse(doc.body) : doc.body;
  if (!body) continue;
  body.plan = {
    ...(body.plan || {}),
    title: nextCopy.title,
    lead: nextCopy.lead,
    close: nextCopy.close,
    sampleLabel: nextCopy.sampleLabel,
    checklistTitle: nextCopy.checklistTitle,
    ownershipTitle: nextCopy.ownershipTitle,
    checklist,
    ownership,
    visual: {
      ...(body.plan?.visual || {}),
      src: visual.src,
      status: visual.status,
      label: visual.label,
      caption: nextCopy.caption,
      altTh: visual.altTh,
      altEn: visual.altEn,
    },
  };
  await prisma.cmsDocument.update({
    where: { id: doc.id },
    data: { body: JSON.stringify(body) },
  });
  console.log("patched plan", doc.id, doc.locale, doc.slug, doc.status);
}

console.log("docs", docs.length);
await prisma.$disconnect();
