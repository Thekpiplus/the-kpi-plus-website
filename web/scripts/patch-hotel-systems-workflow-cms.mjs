import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const visual = {
  src: "/images/hotel-systems-implementation-workflow-placeholder.webp",
  status: "sample",
  label: "Hotel Systems Implementation Workflow — Sample",
  altTh:
    "ไทม์ไลน์ตัวอย่างงานระบบโรงแรม Discover Map Configure Test และ Handover พร้อมแผนที่ส่งต่อ ผลลัพธ์ และเงื่อนไขก่อน Go-live ไม่ใช่รูปทีมประชุม และไม่ใช่ตารางเวลาโรงแรมจริง",
  altEn:
    "Sample hotel systems workflow timeline: Discover, Map, Configure, Test, and Handover, with a handoff map, deliverables, and a Go-live gate. Not a team photograph, and not a live hotel schedule.",
};

const copy = {
  th: {
    title: "เราทำงานอย่างไร?",
    lead: "งานระบบโรงแรมเดินเป็นห้าขั้น Discover, Map, Configure, Test และ Handover แต่ละขั้นมีผู้รับผิดชอบ ข้อมูลเข้า การกระทำ ผลลัพธ์ จุดอนุมัติ ข้อจำกัด และการตัดสินใจถัดไป",
    caption: "ลำดับตัวอย่างห้าขั้น พร้อมผู้รับผิดชอบ ข้อมูลเข้า การกระทำ ผลลัพธ์ จุดอนุมัติ ข้อจำกัด และการตัดสินใจถัดไป ไม่ใช่ตารางเวลาโรงแรมจริง",
    approvalsTitle: "Go-live gate",
    gateTitle: "Go-live gate",
    gate: "การเริ่มใช้จริงต้องมีผลทดสอบที่อนุมัติแล้ว ผู้รับผิดชอบลงนาม ความพร้อมของผู้ให้บริการ และแผน rollback หรือแผนจัดการปัญหาเมื่อใช้ได้",
  },
  en: {
    title: "How we work",
    lead: "Hotel systems implementation runs in five steps: Discover, Map, Configure, Test, and Handover. Each step has an owner, input, action, output, approval point, dependency, and next decision.",
    caption: "A sample five-step sequence with owner, input, action, output, approval point, dependency, and next decision. Not a live hotel schedule.",
    approvalsTitle: "Go-live gate",
    gateTitle: "Go-live gate",
    gate: "Go-live requires approved test results, owner sign-off, provider readiness, and a rollback or issue-handling plan where applicable.",
  },
};

const steps = [
  {
    id: "discover",
    num: "01",
    label: "DISCOVER",
    titleTh: "สำรวจ",
    titleEn: "Discover",
    bodyTh: "รวบรวมรายการระบบ เป้าหมาย ผู้รับผิดชอบ ข้อกำหนด ข้อจำกัด และผู้ติดต่อของผู้ให้บริการ",
    bodyEn: "Collect System Inventory, goals, owners, requirements, constraints, and provider contacts.",
    ownerTh: "ที่ปรึกษา + โรงแรม",
    ownerEn: "Advisor + hotel",
    inputTh: "ชื่อระบบที่ใช้ ปัญหาที่พบ และผู้ติดต่อของผู้ให้บริการ",
    inputEn: "Current system names, known problems, and provider contacts",
    actionTh: "รวบรวมรายการระบบ เป้าหมาย ผู้รับผิดชอบ ข้อกำหนด ข้อจำกัด และผู้ติดต่อของผู้ให้บริการ",
    actionEn: "Collect System Inventory, goals, owners, requirements, constraints, and provider contacts",
    output: "System Inventory and Requirements Brief",
    approvalTh: "โรงแรมยืนยันรายการระบบและผู้รับผิดชอบ",
    approvalEn: "The hotel confirms the system inventory and named owners",
    dependencyTh: "โรงแรมระบุระบบ ผู้รับผิดชอบ และผู้ติดต่อของผู้ให้บริการ",
    dependencyEn: "The hotel names systems, owners, and provider contacts",
    nextTh: "ไปจับคู่ข้อมูล หรือหยุดถ้ายังสำรวจไม่ครบ",
    nextEn: "Proceed to mapping, or stop if the inventory is incomplete",
  },
  {
    id: "map",
    num: "02",
    label: "MAP",
    titleTh: "จับคู่",
    titleEn: "Map",
    bodyTh: "กำหนดสถาปัตยกรรมระบบ Source of Truth การจับคู่ฟิลด์ เส้นทางข้อมูล และสิ่งที่ต้องพึ่งพา",
    bodyEn: "Define System Architecture, Source of Truth, field mapping, data flow, and dependencies.",
    ownerTh: "ที่ปรึกษาร่าง / โรงแรมอนุมัติ",
    ownerEn: "Advisor drafts / hotel approves",
    inputTh: "System Inventory and Requirements Brief",
    inputEn: "System Inventory and Requirements Brief",
    actionTh: "กำหนดสถาปัตยกรรมระบบ Source of Truth การจับคู่ฟิลด์ เส้นทางข้อมูล และสิ่งที่ต้องพึ่งพา",
    actionEn: "Define System Architecture, Source of Truth, field mapping, data flow, and dependencies",
    output: "Architecture Diagram and Data Mapping",
    approvalTh: "โรงแรมอนุมัติ Source of Truth และการจับคู่ฟิลด์",
    approvalEn: "The hotel approves the Source of Truth and field mapping",
    dependencyTh: "เอกสารฟิลด์จากผู้ให้บริการ และโครงสร้างห้อง/ราคาที่ใช้จริง",
    dependencyEn: "Provider field documentation and the live room/rate structure",
    nextTh: "ตั้งค่าในระบบเดิม หรือระบุ Requires Provider Support",
    nextEn: "Configure in the current systems, or mark Requires Provider Support",
  },
  {
    id: "configure",
    num: "03",
    label: "CONFIGURE",
    titleTh: "ตั้งค่า",
    titleEn: "Configure",
    bodyTh: "ตั้งค่าตามที่อนุมัติ และประสานงานกับผู้ให้บริการภายในสิทธิ์เข้าถึงและขอบเขตงาน",
    bodyEn: "Configure approved settings and coordinate with providers within access and scope.",
    ownerTh: "ที่ปรึกษาในสิทธิ์ที่มี / ผู้ให้บริการถ้านอกสิทธิ์",
    ownerEn: "Advisor within access / provider if outside access",
    inputTh: "Architecture Diagram and Data Mapping ที่อนุมัติแล้ว",
    inputEn: "Approved Architecture Diagram and Data Mapping",
    actionTh: "ตั้งค่าตามที่อนุมัติ และประสานงานกับผู้ให้บริการภายในสิทธิ์เข้าถึงและขอบเขตงาน",
    actionEn: "Configure approved settings and coordinate with providers within access and scope",
    output: "Configuration/Integration Checklist",
    approvalTh: "งานที่อยู่นอกสิทธิ์ระบุเป็น Requires Provider Support",
    approvalEn: "Work outside current access is marked Requires Provider Support",
    dependencyTh: "สิทธิ์ที่อนุมัติ ไลเซนส์ และการยืนยันจากผู้ให้บริการ",
    dependencyEn: "Approved access, licence, and provider confirmation",
    nextTh: "เริ่มทดสอบ หรือรอ Pending Access / งานผู้ให้บริการ",
    nextEn: "Start testing, or wait for Pending Access or provider work",
  },
  {
    id: "test",
    num: "04",
    label: "TEST",
    titleTh: "ทดสอบ",
    titleEn: "Test",
    bodyTh: "ทดสอบงานปกติ การแก้ไข การยกเลิก ฟิลด์ที่ขาด ข้อผิดพลาด สิทธิ์ และการส่งต่อผู้ใช้",
    bodyEn: "Test normal flow, modifications, cancellations, missing fields, errors, permissions, and user handoff.",
    ownerTh: "ที่ปรึกษา + ทีมโรงแรม",
    ownerEn: "Advisor + hotel team",
    inputTh: "Configuration/Integration Checklist และช่องทางที่ตกลงทดสอบ",
    inputEn: "Configuration/Integration Checklist and the agreed test channels",
    actionTh: "ทดสอบงานปกติ การแก้ไข การยกเลิก ฟิลด์ที่ขาด ข้อผิดพลาด สิทธิ์ และการส่งต่อผู้ใช้",
    actionEn: "Test normal flow, modifications, cancellations, missing fields, errors, permissions, and user handoff",
    output: "Test Cases and QA Report",
    approvalTh: "โรงแรมยืนยันผลทดสอบในเคสที่ตกลง",
    approvalEn: "The hotel confirms the test result on the agreed cases",
    dependencyTh: "สิทธิ์เข้าถึง ฟิลด์ที่จับคู่แล้ว และพฤติกรรมตัวเชื่อมของผู้ให้บริการ",
    dependencyEn: "Access, mapped fields, and provider connector behaviour",
    nextTh: "ไปส่งมอบ หรือยังถูก Blocked จนกว่าเคสที่ล้มจะแก้",
    nextEn: "Proceed to handover, or remain Blocked until failed cases are resolved",
  },
  {
    id: "handover",
    num: "05",
    label: "HANDOVER",
    titleTh: "ส่งมอบ",
    titleEn: "Handover",
    bodyTh: "ส่งมอบเอกสาร SOP รายชื่อผู้รับผิดชอบ เส้นทางแก้ปัญหา และบันทึกการอนุมัติ",
    bodyEn: "Deliver documentation, SOP, owner list, troubleshooting path, and approval record.",
    ownerTh: "หัวหน้าแผนกโรงแรม",
    ownerEn: "Hotel department heads",
    inputTh: "Test Cases and QA Report",
    inputEn: "Test Cases and QA Report",
    actionTh: "ส่งมอบเอกสาร SOP รายชื่อผู้รับผิดชอบ เส้นทางแก้ปัญหา และบันทึกการอนุมัติ",
    actionEn: "Deliver documentation, SOP, owner list, troubleshooting path, and approval record",
    output: "Documentation, SOP, and Ownership Matrix",
    approvalTh: "โรงแรมรับมอบผู้รับผิดชอบและเส้นทางแจ้งปัญหา",
    approvalEn: "The hotel accepts named owners and the issue path",
    dependencyTh: "ผลทดสอบที่อนุมัติแล้ว และผู้รับผิดชอบที่ระบุชื่อได้",
    dependencyEn: "Approved test results and named owners",
    nextTh: "เริ่มใช้จริงได้เมื่อผ่าน Go-live gate เท่านั้น",
    nextEn: "Go-live only if the gate is met; otherwise keep the work in review",
  },
];

const approvals = [
  { id: "test-results", th: "ผลทดสอบที่อนุมัติแล้ว", en: "Approved test results" },
  { id: "owner-signoff", th: "ผู้รับผิดชอบลงนาม", en: "Owner sign-off" },
  { id: "provider-ready", th: "ความพร้อมของผู้ให้บริการ", en: "Provider readiness" },
  { id: "rollback", th: "แผน rollback หรือแผนจัดการปัญหาเมื่อใช้ได้", en: "Rollback or issue-handling plan where applicable" },
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
  if (!body?.workflow) continue;
  body.workflow.title = nextCopy.title;
  body.workflow.lead = nextCopy.lead;
  body.workflow.steps = steps;
  body.workflow.approvalsTitle = nextCopy.approvalsTitle;
  body.workflow.approvals = approvals;
  body.workflow.gateTitle = nextCopy.gateTitle;
  body.workflow.gate = nextCopy.gate;
  body.workflow.visual = {
    ...(body.workflow.visual || {}),
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
  console.log("patched workflow", doc.id, doc.locale, doc.slug, doc.status);
}

console.log("docs", docs.length);
await prisma.$disconnect();
