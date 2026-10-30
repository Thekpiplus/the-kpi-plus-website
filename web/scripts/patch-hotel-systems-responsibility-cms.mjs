import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const visual = {
  src: "/images/hotel-systems-implementation-responsibility-placeholder.webp",
  status: "sample",
  label: "Implementation Responsibility Matrix — Sample",
  altTh:
    "ตารางตัวอย่างขอบเขตงานระบบโรงแรม สิ่งที่เดอะ เคพีไอ พลัสอาจช่วยตามขอบเขตที่ตกลง และสิ่งที่โรงแรมหรือผู้ให้บริการยังรับผิดชอบ ไม่ได้หมายความว่าเดอะ เคพีไอ พลัสเป็นเจ้าของทุกระบบภายนอก หรือการันตีพฤติกรรมของผู้ให้บริการ",
  altEn:
    "Sample hotel systems responsibility matrix of what The KPI Plus may support within the agreed scope, and what the hotel or provider remains responsible for. This does not mean The KPI Plus owns every external system or guarantees an external provider's behaviour.",
};

const copy = {
  th: {
    title: "ขอบเขตการเชื่อมระบบและตารางความรับผิดชอบ",
    lead: "เดอะ เคพีไอ พลัสอาจช่วยงานสำรวจ สถาปัตยกรรม การจับคู่ข้อมูล แผนนำไปใช้ การประสานงานผู้ให้บริการ รายการตั้งค่า เคสทดสอบ เอกสาร QA และการส่งมอบ และการออกแบบความเป็นเจ้าของตามขอบเขตที่ตกลง โรงแรมหรือผู้ให้บริการภายนอกยังรับผิดชอบไลเซนส์ สิทธิ์ API ความปลอดภัย การชำระเงิน ข้อมูลห้องว่างและราคา ข้อตกลงข้อมูล การแก้ไขของผู้ให้บริการ การอนุมัติเริ่มใช้จริง และงานปฏิบัติการหลังส่งมอบ เดอะ เคพีไอ พลัสไม่ได้เป็นเจ้าของทุกระบบภายนอก และไม่การันตีพฤติกรรมของผู้ให้บริการ",
    supportTitle: "เดอะ เคพีไอ พลัสอาจช่วย ตามขอบเขตที่ตกลง",
    hotelTitle: "โรงแรมหรือผู้ให้บริการภายนอกยังรับผิดชอบ",
    matrixTitle: "Responsibility Matrix",
    caption: "ตัวอย่างขอบเขตงาน ขึ้นกับขอบเขตที่ตกลง ไม่ได้เป็นเจ้าของระบบภายนอก และไม่การันตีพฤติกรรมของผู้ให้บริการ",
    boundary:
      "เดอะ เคพีไอ พลัสไม่ได้เป็นเจ้าของ PMS, Channel Manager, Booking Engine หรือบัญชี OTA และไม่การันตีพฤติกรรมของผู้ให้บริการภายนอก งานสนับสนุนขึ้นกับขอบเขตที่ตกลง",
  },
  en: {
    title: "Integration Boundary and Responsibility Matrix",
    lead: "The KPI Plus may support current-system discovery, System Architecture, a Data Mapping framework, an Implementation Plan, provider coordination, a configuration checklist, Test Cases, QA and handover documentation, and ownership and SOP design, subject to the agreed scope. The hotel or external provider remains responsible for licences, API access, security, payments, provider-owned availability and rate data, data processing agreements, external provider fixes, final Go-live approval, and operational ownership after handover. The KPI Plus does not own every external system and does not guarantee an external provider's behaviour.",
    supportTitle: "The KPI Plus may support, subject to agreed scope",
    hotelTitle: "The hotel or external provider remains responsible",
    matrixTitle: "Responsibility Matrix",
    caption: "Sample boundary. Subject to the agreed scope. The KPI Plus does not own external systems and does not guarantee provider behaviour.",
    boundary:
      "The KPI Plus does not own the PMS, channel manager, booking engine, or OTA accounts, and does not guarantee an external provider's behaviour. Support is subject to the agreed scope.",
  },
};

const supportItems = [
  "Current-system discovery",
  "System Architecture",
  "Data Mapping framework",
  "Implementation Plan",
  "Provider coordination",
  "Configuration checklist",
  "Test Cases",
  "QA and handover documentation",
  "Ownership and SOP design",
];

const hotelItems = [
  "License and subscription fees",
  "API access and technical permissions",
  "Security policy and compliance",
  "Payment and transaction processing",
  "Availability and rate data owned by the provider",
  "Data processing agreements",
  "External provider fixes",
  "Final Go-live approval",
  "Operational ownership after handover",
];

const rows = [
  {
    id: "support",
    titleTh: copy.th.supportTitle,
    titleEn: copy.en.supportTitle,
    itemsTh: supportItems.join("\n"),
    itemsEn: supportItems.join("\n"),
  },
  {
    id: "hotel",
    titleTh: copy.th.hotelTitle,
    titleEn: copy.en.hotelTitle,
    itemsTh: hotelItems.join("\n"),
    itemsEn: hotelItems.join("\n"),
  },
];

const matrix = [
  {
    id: "rate-mismatch",
    eventTh: "Rate mismatch",
    eventEn: "Rate mismatch",
    hotelTh: "ยืนยันราคาขายและ Sample Rate Plan ที่อนุมัติ",
    hotelEn: "Confirm the selling rate and the approved Sample Rate Plan",
    providerTh: "แก้ราคาในช่องทางถ้าอยู่นอกสิทธิ์ของทีมนำไปใช้",
    providerEn: "Correct the channel rate if it is outside implementation access",
    implTh: "เทียบ Sample Rate Plan ที่จับคู่แล้ว และบันทึกช่องว่าง ตามขอบเขตที่ตกลง",
    implEn: "Compare the mapped Sample Rate Plan and log the gap, within the agreed scope",
    approvalTh: "เจ้าของงานเชิงพาณิชย์ของโรงแรม",
    approvalEn: "Hotel commercial owner",
    escalationTh: "โรงแรม → ทีมนำไปใช้ → ผู้ให้บริการ",
    escalationEn: "Hotel → Implementation team → Provider",
  },
  {
    id: "booking-missing",
    eventTh: "Booking not arriving in PMS",
    eventEn: "Booking not arriving in PMS",
    hotelTh: "ยืนยันว่ามีการจองตัวอย่างเกิดขึ้น",
    hotelEn: "Confirm that the sample booking was created",
    providerTh: "สถานะตัวเชื่อมหรือ API",
    providerEn: "Connector or API status",
    implTh: "ติดตาม Sample Reservation Status ตามการจับคู่ ไม่ได้เป็นเจ้าของ PMS",
    implEn: "Trace Sample Reservation Status against the mapping. The KPI Plus does not own the PMS",
    approvalTh: "เจ้าของงานปฏิบัติการของโรงแรม ถ้ากระทบ Go-live",
    approvalEn: "Hotel operations owner if Go-live is affected",
    escalationTh: "ทีมนำไปใช้ → ผู้ให้บริการ",
    escalationEn: "Implementation team → Provider",
  },
  {
    id: "api-expired",
    eventTh: "API permission expired",
    eventEn: "API permission expired",
    hotelTh: "ขอสิทธิ์ใหม่ที่อนุมัติ ไม่ส่งรหัสผ่าน",
    hotelEn: "Request renewed approved access. Do not send a password",
    providerTh: "ให้สิทธิ์ API ตามสัญญา",
    providerEn: "Grant API permission under the hotel contract",
    implTh: "ทำเครื่องหมาย Pending Access หรือ Requires Provider Support",
    implEn: "Mark Pending Access or Requires Provider Support",
    approvalTh: "โรงแรมและผู้ให้บริการ",
    approvalEn: "Hotel and provider",
    escalationTh: "เจ้าของสัญญาโรงแรม → ผู้ให้บริการ",
    escalationEn: "Hotel contract owner → Provider",
  },
  {
    id: "duplicate",
    eventTh: "Duplicate reservation",
    eventEn: "Duplicate reservation",
    hotelTh: "ยืนยันว่ารายการใดเป็นรายการที่ใช้",
    hotelEn: "Confirm which record should be kept",
    providerTh: "กฎการจับคู่ถ้าเป็นของระบบผู้ให้บริการ",
    providerEn: "Matching rule if it is owned by the provider system",
    implTh: "บันทึกรายการซ้ำ และทดสอบซ้ำหลังมีการแก้ไข",
    implEn: "Log the duplicate and retest after a correction",
    approvalTh: "เจ้าของงานปฏิบัติการของโรงแรม",
    approvalEn: "Hotel operations owner",
    escalationTh: "ทีมนำไปใช้ → ผู้ให้บริการ",
    escalationEn: "Implementation team → Provider",
  },
  {
    id: "report-mismatch",
    eventTh: "Report definition mismatch",
    eventEn: "Report definition mismatch",
    hotelTh: "อนุมัตินิยาม Occupancy หรือช่องทางที่ใช้ทบทวน",
    hotelEn: "Approve the Occupancy or channel definition used in review",
    providerTh: "ฟิลด์รายงานหรือการส่งออกตามที่ระบบรองรับ",
    providerEn: "Report fields or export as the system supports",
    implTh: "บันทึกนิยามที่ตกลง ไม่ใช่ผลรายได้ที่การันตี",
    implEn: "Document the agreed definition. Not a guaranteed revenue result",
    approvalTh: "เจ้าของงานเชิงพาณิชย์ของโรงแรม",
    approvalEn: "Hotel commercial owner",
    escalationTh: "โรงแรม → ทีมนำไปใช้",
    escalationEn: "Hotel → Implementation team",
  },
  {
    id: "provider-outage",
    eventTh: "Provider outage",
    eventEn: "Provider outage",
    hotelTh: "ใช้แนวทางปฏิบัติการสำรองของโรงแรม",
    hotelEn: "Use the hotel operational workaround",
    providerTh: "กู้คืนบริการ โรงแรมเป็นผู้ถือสัญญา",
    providerEn: "Restore the service. The hotel holds the provider contract",
    implTh: "บันทึกเหตุการณ์ ไม่การันตีเวลาทำงานของผู้ให้บริการ",
    implEn: "Log the outage. The KPI Plus does not guarantee provider uptime",
    approvalTh: "ไม่ใช้แทนการกู้คืนของผู้ให้บริการ",
    approvalEn: "Not a substitute for provider restoration",
    escalationTh: "โรงแรม → ฝ่ายสนับสนุนผู้ให้บริการ",
    escalationEn: "Hotel → Provider support",
  },
  {
    id: "go-live",
    eventTh: "Go-live approval",
    eventEn: "Go-live approval",
    hotelTh: "อนุมัติเริ่มใช้จริงครั้งสุดท้าย",
    hotelEn: "Give final Go-live approval",
    providerTh: "ยืนยันความพร้อมของตัวเชื่อมตามสัญญา",
    providerEn: "Confirm connector readiness under the hotel contract",
    implTh: "ส่งผลทดสอบและรายการที่ยังเปิดอยู่ ไม่ได้อนุมัติ Go-live แทนโรงแรม",
    implEn: "Present test results and open items. Does not approve Go-live for the hotel",
    approvalTh: "โรงแรมต้องอนุมัติ",
    approvalEn: "Hotel approval is required",
    escalationTh: "เจ้าของโรงแรมหรือ GM",
    escalationEn: "Hotel owner or GM",
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
  if (!body) continue;
  body.scope = {
    ...(body.scope || {}),
    title: nextCopy.title,
    lead: nextCopy.lead,
    supportTitle: nextCopy.supportTitle,
    hotelTitle: nextCopy.hotelTitle,
    matrixTitle: nextCopy.matrixTitle,
    rows,
    matrix,
    boundary: nextCopy.boundary,
    visual: {
      ...(body.scope?.visual || {}),
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
  console.log("patched scope", doc.id, doc.locale, doc.slug, doc.status);
}

console.log("docs", docs.length);
await prisma.$disconnect();
