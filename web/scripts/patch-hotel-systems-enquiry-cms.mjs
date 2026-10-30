import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const visual = {
  src: "/images/hotel-systems-contact-process-placeholder.webp",
  status: "sample",
  label: "What Happens Next — Sample implementation process",
  altTh:
    "แผนภาพตัวอย่างหลังเริ่มคุย: System Inventory → Data Mapping → Testing → Handover ไม่ใช่รูปบุคคล และไม่ใช่โรงแรมลูกค้าจริง",
  altEn:
    "Sample What Happens Next process: System Inventory → Data Mapping → Testing → Handover. Not a person photo, and not a live client hotel.",
};

const receive = [
  ["inventory", "Current System Inventory review", "ทบทวนรายการระบบที่ใช้จริง โดยไม่ต้องส่งรหัสผ่าน", "A review of the live system inventory. Do not send a password."],
  ["architecture", "Architecture and Data Flow review", "ทบทวนสถาปัตยกรรมและเส้นทางข้อมูลระหว่างระบบ", "A review of architecture and Data Flow between systems."],
  ["mapping", "Data Mapping and Readiness assessment", "ประเมินการจับคู่ข้อมูลและความพร้อมก่อนนำไปใช้", "A Data Mapping and Readiness assessment before implementation."],
  ["provider", "Integration/Provider dependency review", "ทบทวนการเชื่อมระบบและงานที่ขึ้นกับผู้ให้บริการ", "A review of integration work and provider dependencies."],
  ["testing", "Testing and Handover scope", "คุยขอบเขตการทดสอบและการส่งมอบ", "A discussion of Testing and Handover scope."],
  ["next", "Next Action and implementation plan", "กำหนด Next Action และ Implementation Plan ก่อนเริ่มงาน", "A Next Action and Implementation Plan before the work starts."],
].map(([id, title, th, en]) => ({ id, title, th, en }));

const steps = [
  ["step-1", "ส่งรายการระบบและปัญหาที่พบ", "Send the system list and the problem found"],
  ["step-2", "ทีมตรวจ Architecture, Data Flow และ Owner", "The team reviews Architecture, Data Flow, and Owner"],
  ["step-3", "สรุป Readiness, Scope และสิ่งที่ต้องเตรียม", "We summarise Readiness, Scope, and what to prepare"],
  ["step-4", "นัดคุย Implementation Plan และ Next Action", "Book a conversation on the Implementation Plan and Next Action"],
].map(([id, th, en]) => ({ id, th, en }));

const copy = {
  th: {
    kicker: "Hotel Systems",
    title: "คุยเรื่องระบบโรงแรมและข้อมูล",
    body: "ส่งชื่อโรงแรม ระบบที่ใช้อยู่ และปัญหาที่พบ ไม่ต้องส่งรหัสผ่าน คีย์ หรือข้อมูลแขก ทีมจะช่วยดูขอบเขตและสิทธิ์เข้าถึงก่อนเริ่มงาน",
    submit: "ส่งเรื่องให้ทีมดูระบบโรงแรม",
    receiveTitle: "โรงแรมจะได้อะไรจากการเริ่มคุยงานนำไปใช้",
    nextTitle: "What Happens Next",
    note: "ไม่จำเป็นต้องรู้ก่อนว่าต้องเปลี่ยนระบบหรือไม่ การคุยครั้งนี้ยังไม่ใช่สถานะเชื่อมต่อที่ตรวจแล้ว และไม่ใช่ผลที่การันตี ไม่ต้องส่งรหัสผ่าน",
    closerTitle: "คุยเรื่องระบบโรงแรมและข้อมูล",
    closerBody: "คุณไม่จำเป็นต้องรู้ก่อนว่าต้องเปลี่ยนระบบหรือไม่ เพียงส่งรายการระบบและปัญหาที่พบ เราจะช่วยดู Architecture, Data Flow และขอบเขตก่อนเริ่มงาน",
    closerCta: "ส่งเรื่องให้ทีมดูระบบโรงแรม",
    caption: "ลำดับตัวอย่างหลังเริ่มคุย ไม่ต้องส่งรหัสผ่าน คีย์ หรือข้อมูลแขก",
    labels: {
      name: "ชื่อผู้ติดต่อ",
      business: "ชื่อโรงแรม / บริษัท",
      contact: "อีเมลหรือเบอร์โทร",
      rooms: "จำนวนห้อง",
      hotelStatus: "สถานะโรงแรม",
      challenge: "ปัญหาหลัก",
      teamSize: "ขนาดทีมปัจจุบัน",
      website: "เว็บไซต์",
      pms: "PMS ที่ใช้",
      channelManager: "Channel Manager ที่ใช้",
      bookingEngine: "Booking Engine ที่ใช้",
      systems: "ระบบอื่นที่เกี่ยวข้อง",
      providerContact: "ผู้ติดต่อผู้ให้บริการหรือเจ้าของงานเทคนิค",
      goal: "เป้าหมาย",
      message: "ปัญหาหลัก",
      consent: "ข้าพเจ้ายินยอมให้ เดอะ เคพีไอ พลัส ใช้ข้อมูลนี้เพื่อติดต่อกลับเกี่ยวกับคำขอนี้ ตาม",
      privacy: "นโยบายความเป็นส่วนตัว",
    },
  },
  en: {
    kicker: "Hotel Systems",
    title: "Talk about hotel systems and data",
    body: "Send the hotel name, the systems in use, and the problem. Do not send a password, key, or guest data. The team will review scope and access before the work starts.",
    submit: "Send a hotel systems enquiry",
    receiveTitle: "What the hotel receives from starting an implementation conversation",
    nextTitle: "What Happens Next",
    note: "You do not need to know in advance whether the system must change. This conversation is not a verified integration status, and not a guaranteed result. Do not send a password.",
    closerTitle: "Talk about hotel systems and data",
    closerBody: "You do not need to know in advance whether the system must change. Send the system list and the problem. We will review Architecture, Data Flow, and scope before the work starts.",
    closerCta: "Send a hotel systems enquiry",
    caption: "A sample sequence after the conversation starts. Do not send passwords, keys, or guest data.",
    labels: {
      name: "Contact name",
      business: "Hotel / company name",
      contact: "Email / phone",
      rooms: "Number of rooms",
      hotelStatus: "Hotel status",
      challenge: "Main issue",
      teamSize: "Current team size",
      website: "Website URL",
      pms: "PMS used",
      channelManager: "Channel Manager used",
      bookingEngine: "Booking Engine used",
      systems: "Other related systems",
      providerContact: "Provider contact or technical owner",
      goal: "Goal",
      message: "Main issue",
      consent: "I agree that The KPI Plus may use this information to reply about this request, under the",
      privacy: "Privacy Policy",
    },
  },
};

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
  body.related = {
    ...(body.related || {}),
    closerTitle: nextCopy.closerTitle,
    closerBody: nextCopy.closerBody,
    closerCta: nextCopy.closerCta,
    closerHref: "#hotel-systems-enquiry",
  };
  body.form = {
    ...(body.form || {}),
    kicker: nextCopy.kicker,
    title: nextCopy.title,
    body: nextCopy.body,
    submit: nextCopy.submit,
    receiveTitle: nextCopy.receiveTitle,
    receive,
    nextTitle: nextCopy.nextTitle,
    steps,
    note: nextCopy.note,
    labels: {
      ...(body.form?.labels || {}),
      ...nextCopy.labels,
    },
    visual: {
      ...(body.form?.visual || {}),
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
  console.log("patched form", doc.id, doc.locale, doc.slug, doc.status);
}

console.log("docs", docs.length);
await prisma.$disconnect();
