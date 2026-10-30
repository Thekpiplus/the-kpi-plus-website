import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const faqs = [
  [
    "ต้องเปลี่ยนระบบเดิมทั้งหมดหรือไม่",
    "ไม่จำเป็นเสมอไป งานเริ่มจากสำรวจระบบที่มีอยู่ เส้นทางข้อมูล และการจับคู่ฟิลด์ก่อน หากระบบเดิมรองรับขอบเขตที่ตกลงได้ ก็ใช้ต่อได้ ความเป็นไปได้ทางเทคนิคขึ้นกับผู้ให้บริการ API หรือตัวเชื่อม ไลเซนส์ สิทธิ์ โครงสร้างข้อมูล ความปลอดภัย และขอบเขตที่อนุมัติ",
    "Do we have to replace every current system?",
    "Not always. The work starts with the current inventory, data flow, and field mapping. If the current systems can support the agreed scope, they can stay. Technical feasibility depends on the provider, API or connector, licence, permission, data structure, security, and approved scope.",
  ],
  [
    "ทำงานร่วมกับ PMS, Channel Manager และ Booking Engine เดิมได้หรือไม่",
    "ทำร่วมได้เมื่อผู้ให้บริการ ไลเซนส์ สิทธิ์ และตัวเชื่อมรองรับ ทีมจะตรวจว่าระบบเดิมส่งและรับข้อมูลอะไรได้จริง ไม่สมมติว่าเชื่อมแล้วใช้ได้ทุกฟิลด์",
    "Can this work with the current PMS, Channel Manager, and Booking Engine?",
    "Yes, when the provider, licence, permission, and connector support it. The team checks what the current systems can actually send and receive. A connection is not assumed to cover every field.",
  ],
  [
    "ทุกระบบสามารถเชื่อมต่อกันได้หรือไม่",
    "ไม่ได้ทุกกรณี บางระบบมี API บางระบบมีตัวเชื่อมจำกัด และบางระบบต้องทำงานกึ่งแมนนวล ความเป็นไปได้ขึ้นกับผู้ให้บริการ API หรือตัวเชื่อม ไลเซนส์ สิทธิ์ โครงสร้างข้อมูล ความปลอดภัย และขอบเขตที่ตกลง",
    "Can every system connect to every other system?",
    "No. Some systems have an API, some have a limited connector, and some still need a manual step. Feasibility depends on the provider, API or connector, licence, permission, data structure, security, and agreed scope.",
  ],
  [
    "ใครต้องให้ API Access หรือ Account Permission",
    "โรงแรมหรือเจ้าของบัญชีระบบเป็นผู้ให้สิทธิ์ ผู้ให้บริการระบบอาจต้องอนุมัติ API หรือตัวเชื่อม เดอะ เคพีไอ พลัสไม่เก็บรหัสผ่านของระบบที่ใช้งานจริง และไม่ขอข้อมูลแขกหรือข้อมูลชำระเงินในแบบฟอร์มติดต่อ",
    "Who has to grant API access or account permission?",
    "The hotel or account owner grants access. The system provider may also have to approve an API or connector. The KPI Plus does not store live production passwords, and the contact form should not include guest or payment data.",
  ],
  [
    "หาก Provider ไม่เปิด API จะทำอย่างไร",
    "จะบันทึกข้อจำกัดนั้น แล้วดูตัวเชื่อมที่มีอยู่ ขอบเขตที่ทำได้โดยไม่ใช้ API หรือขั้นตอนที่ทีมต้องทำเอง ไม่สามารถบังคับผู้ให้บริการให้เปิด API และไม่สัญญาว่าทุกระบบจะเชื่อมอัตโนมัติ",
    "What happens if the provider does not open an API?",
    "The limit is recorded. The team then reviews any available connector, the work that can be done without an API, or a manual step. A provider cannot be forced to open an API, and not every system can connect automatically.",
  ],
  [
    "ใครรับผิดชอบเมื่อข้อมูลไม่ตรงกัน",
    "ขึ้นกับว่าชุดข้อมูลนั้นใครเป็น Source of Truth โรงแรมรับผิดชอบข้อมูลปฏิบัติการและการอนุมัติ ผู้ให้บริการรับผิดชอบพฤติกรรมของระบบตนเอง ทีมนำไปใช้อาจช่วยไล่เส้นทางข้อมูลและการจับคู่ตามขอบเขตที่ตกลง แต่ไม่ได้เป็นเจ้าของทุกระบบภายนอก",
    "Who is responsible when data does not match?",
    "It depends on who owns that Source of Truth. The hotel owns operational data and approvals. The provider owns the behaviour of its own system. The implementation team may trace the flow and mapping within the agreed scope, but it does not own every external system.",
  ],
  [
    "ใช้เวลาทำ Implementation เท่าไร",
    "ไม่มีระยะเวลาตายตัว ขึ้นกับรายการระบบ การจับคู่ข้อมูล สิทธิ์เข้าถึง ความเร็วของผู้ให้บริการ เคสทดสอบ และการอนุมัติของโรงแรม หน้านี้ไม่ใช่ไทม์ไลน์ลูกค้าจริง และไม่กำหนดวันได้ผล",
    "How long does implementation take?",
    "There is no fixed duration. It depends on the system inventory, mapping, access, provider response, test cases, and hotel approval. This page is not a live client timeline, and it does not set a time-to-result.",
  ],
  [
    "มี Test Environment หรือ Sandbox หรือไม่",
    "ใช้ได้เมื่อโรงแรมหรือผู้ให้บริการมีสภาพแวดล้อมทดสอบ หากไม่มี ต้องตกลงขอบเขตความเสี่ยงก่อนแตะข้อมูลจริง ไม่ใช่ทุกผู้ให้บริการที่มี sandbox",
    "Is there a test environment or sandbox?",
    "A test environment is used when the hotel or provider has one. If none exists, the risk and test scope must be agreed before live data is touched. Not every provider offers a sandbox.",
  ],
  [
    "รองรับ Data Mapping และ Documentation หรือไม่",
    "รองรับตามขอบเขตที่ตกลง เช่น กรอบการจับคู่ข้อมูล พจนานุกรมฟิลด์ เคสทดสอบ และเอกสารส่งมอบ เอกสารตัวอย่างบนหน้านี้ต้องแทนที่ด้วยข้อเท็จจริงที่โรงแรมอนุมัติ",
    "Does this include Data Mapping and documentation?",
    "Yes, within the agreed scope. That may include a mapping framework, a field dictionary, test cases, and handover documents. Sample documents on this page must be replaced with hotel-approved facts.",
  ],
  [
    "หลังส่งมอบทีมโรงแรมดูแลต่อได้หรือไม่",
    "เป้าหมายของการส่งมอบคือให้มีเจ้าของสิทธิ์ ขั้นตอน และเอกสารที่ทีมโรงแรมใช้ต่อได้ ความเป็นเจ้าของงานปฏิบัติการหลังส่งมอบยังเป็นของโรงแรม เดอะ เคพีไอ พลัสไม่ได้เป็นผู้ปฏิบัติการแทน เว้นแต่จะตกลงขอบเขตใหม่",
    "Can the hotel team operate the systems after handover?",
    "Handover aims to leave owners, permissions, steps, and documents the hotel team can use. Operational ownership after handover stays with the hotel. The KPI Plus does not remain the live operator unless a later scope is agreed.",
  ],
  [
    "ดูแล Security และข้อมูลส่วนบุคคลอย่างไร",
    "ไม่ส่งรหัสผ่าน คีย์ API ข้อมูลแขก หรือข้อมูลชำระเงินในแบบฟอร์มติดต่อ โรงแรมและผู้ให้บริการยังรับผิดชอบนโยบายความปลอดภัย ข้อตกลงข้อมูล และบัญชีที่ใช้งานจริง งานใช้สิทธิ์ที่ได้รับตามขอบเขต และเป็นไปตามนโยบายความเป็นส่วนตัว",
    "How are security and personal data handled?",
    "Do not send passwords, API keys, guest data, or payment data in the contact form. The hotel and provider remain responsible for security policy, data agreements, and live accounts. The work uses granted access within scope and follows the Privacy Policy.",
  ],
  [
    "รองรับโรงแรมเปิดใหม่หรือเปลี่ยนระบบกลางคันหรือไม่",
    "รองรับได้ทั้งโรงแรมก่อนเปิดและโรงแรมที่กำลังเปลี่ยนระบบ งานเริ่มจากระบบ ข้อจำกัด และสิทธิ์ที่มีอยู่จริง ไม่ใช่แพ็กเกจเดียวกันทุกแห่ง",
    "Does this support a new opening or a mid-change of systems?",
    "Yes. The work can support a hotel before opening and a hotel changing systems. It starts from the systems, limits, and access that exist. It is not one package for every hotel.",
  ],
  [
    "การเชื่อมระบบทำให้รายได้เพิ่มขึ้นทันทีหรือไม่",
    "ไม่ การเชื่อมระบบไม่ได้ทำให้รายได้เพิ่มขึ้นเอง ไม่ลดภาระงานเป็นเปอร์เซ็นต์คงที่ และไม่กำจัดข้อผิดพลาดทั้งหมด รายได้ยังขึ้นกับราคา ช่องทางขาย สินค้า และการดำเนินงาน",
    "Does connecting systems increase revenue immediately?",
    "No. Connecting systems does not automatically increase revenue, reduce workload by a fixed percentage, or remove every error. Revenue still depends on rates, channels, product, and operations.",
  ],
  [
    "ใครเป็นผู้อนุมัติ Go-live",
    "โรงแรมเป็นผู้อนุมัติ Go-live เดอะ เคพีไอ พลัสอาจส่งผลทดสอบ รายการที่ยังเปิดอยู่ และข้อจำกัดของผู้ให้บริการ แต่ไม่ได้อนุมัติเริ่มใช้จริงแทนโรงแรม",
    "Who approves Go-live?",
    "The hotel approves Go-live. The KPI Plus may present test results, open items, and provider limits. It does not approve going live on the hotel’s behalf.",
  ],
].map(([q, a, qEn, aEn], index) => ({
  id: `faq-${index + 1}`,
  q,
  a,
  qEn,
  aEn,
}));

const docs = await prisma.cmsDocument.findMany({
  where: {
    OR: [{ template: "hotel-systems-implementation" }, { slug: { contains: "hotel-systems-implementation" } }],
  },
});

for (const doc of docs) {
  const body = typeof doc.body === "string" ? JSON.parse(doc.body) : doc.body;
  if (!body) continue;
  body.faqs = faqs;
  await prisma.cmsDocument.update({
    where: { id: doc.id },
    data: { body: JSON.stringify(body) },
  });
  console.log("patched faqs", doc.id, doc.locale, doc.slug, doc.status, faqs.length);
}

console.log("docs", docs.length);
await prisma.$disconnect();
