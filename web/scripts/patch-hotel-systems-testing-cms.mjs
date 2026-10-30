import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const visual = {
  src: "/images/hotel-systems-testing-qa-placeholder.webp",
  status: "sample",
  label: "Hotel Systems Test Cases and QA — Sample",
  altTh:
    "ตารางตัวอย่างเคสทดสอบระบบโรงแรมและการจัดการข้อผิดพลาด Detect Log Assign Owner Notify Correct Retest Close ไม่มีข้อมูลแขกหรือข้อมูลชำระเงิน และไม่ใช่ผลทดสอบโรงแรมจริง",
  altEn:
    "Sample hotel systems test-case and QA table with Detect, Log, Assign Owner, Notify, Correct, Retest, and Close. No guest or payment data, and not a live hotel test result.",
};

const copy = {
  th: {
    title: "การทดสอบและ QA",
    lead: "นี่เป็นตารางเคสทดสอบตัวอย่างสำหรับงานนำไปใช้ระบบโรงแรม ต้องแทนที่ด้วยผลทดสอบที่อนุมัติ ไม่ทำเครื่องหมาย Passed ถ้าไม่ติดป้าย Sample และไม่มีข้อมูลแขกหรือข้อมูลชำระเงินในหลักฐาน",
    casesTitle: "Test Cases",
    errorTitle: "Error Handling",
    caption: "เคสตัวอย่าง แทนที่ด้วยผลทดสอบที่อนุมัติ ไม่มีข้อมูลแขกหรือข้อมูลชำระเงิน",
  },
  en: {
    title: "Testing and QA",
    lead: "This is a sample test-case table for hotel systems implementation. Replace with approved test results. Do not mark Passed unless the row is clearly labelled Sample. Evidence must not include guest or payment data.",
    casesTitle: "Test Cases",
    errorTitle: "Error Handling",
    caption: "Sample cases. Replace with approved test results. No guest or payment data.",
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
  body.testing = {
    ...(body.testing || {}),
    title: nextCopy.title,
    lead: nextCopy.lead,
    casesTitle: nextCopy.casesTitle,
    errorTitle: nextCopy.errorTitle,
    visual: {
      ...(body.testing?.visual || {}),
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
  console.log("patched testing", doc.id, doc.locale, doc.slug, doc.status);
}

console.log("docs", docs.length);
await prisma.$disconnect();
