import { DEFAULT_RULE } from "@/lib/partners/rules";
import { ensureCmsSchema } from "@/lib/cms/ensure";
import { refreshCmsFiles } from "@/lib/cms/queries";
import { ensureLeadArchiveColumn } from "./archive";
import { STAGES } from "./constants";
import { prisma } from "./db";
import { hashSecret, verifySecret } from "./security";

const ADMIN_EMAIL = "isara@thekpiplus.com";
const ADMIN_PASSWORD = "4202";

export async function ensureCrmSeed() {
  const db = prisma();
  const count = await db.stage.count();
  if (count === 0) {
    await db.stage.createMany({ data: STAGES.map((stage) => ({ ...stage })) });
  }
  const partnerDb = db as { commissionRule?: { count: () => Promise<number>; create: (args: { data: object }) => Promise<unknown> } };
  if (typeof partnerDb.commissionRule?.count === "function") {
    try {
      const rules = await partnerDb.commissionRule.count();
      if (rules === 0) {
        await partnerDb.commissionRule.create({
          data: { version: DEFAULT_RULE.version, payload: JSON.stringify(DEFAULT_RULE), active: true },
        });
      }
    } catch {
      // Partner tables are added in a later migration.
    }
  }
  await ensureAdminUser();
  await ensureDemoLeads();
  await ensureLeadArchiveColumn().catch(() => undefined);
  await ensureCmsSchema().catch(() => undefined);
  await refreshCmsFiles().catch(() => undefined);
}

async function ensureDemoLeads() {
  const db = prisma();
  if ((await db.lead.count()) > 0) return;
  const stages = await db.stage.findMany({ orderBy: { sortOrder: "asc" } });
  const owner = await db.user.findFirst({ where: { role: { not: "partner" } } });
  const stage = (order: number) => stages.find((item) => item.sortOrder === order) ?? stages[0];
  if (!stage(1)) return;

  const samples = [
    {
      contactName: "กมลวรรณ ศรีสุข",
      businessName: "Baan Test Resort",
      location: "กะทู้ ภูเก็ต",
      phone: "0760001001",
      email: "gm@baantest.example",
      source: "website_form",
      formName: "hotel_performance_audit",
      services: '["Revenue Management"]',
      message: "Occupancy ช่วงโลว์ซีซั่นต่ำกว่าเป้า อยากให้ช่วยดูราคาและช่องทาง",
      stageOrder: 1,
    },
    {
      contactName: "สมชาย วัฒนา",
      businessName: "Northern Hill Hotel",
      location: "เมือง เชียงใหม่",
      phone: "0530002002",
      email: "owner@northernhill.example",
      source: "phone",
      formName: "manual",
      services: '["OTA / Distribution"]',
      message: "โทรเข้ามาเอง ต้องการให้ช่วยดูแล Booking.com และ Agoda",
      stageOrder: 3,
    },
    {
      contactName: "อริยา พงศ์เพ็ชร",
      businessName: "Coral Bay Villa",
      location: "เกาะสมุย",
      phone: "0770003003",
      email: "stay@coralbay.example",
      source: "line",
      formName: "manual",
      services: '["Marketing","Revenue Management"]',
      message: "ทัก LINE มาจากงานสมาคมโรงแรม อยากเพิ่มการจองตรง",
      stageOrder: 4,
    },
    {
      contactName: "James Carter",
      businessName: "Harbor View Inn",
      location: "เมือง กระบี่",
      phone: "0750004004",
      email: "james@harborview.example",
      source: "website_form",
      formName: "contact_enquiry",
      services: '["Hotel systems"]',
      message: "ต้องการทบทวน Channel Manager และเว็บจองตรง",
      stageOrder: 5,
    },
    {
      contactName: "นภา ตั้งตรง",
      businessName: "Lotus Garden Hostel",
      location: "ธนบุรี กรุงเทพฯ",
      phone: "020005005",
      email: "hello@lotusgarden.example",
      source: "event",
      formName: "manual",
      services: '["Training"]',
      message: "เจอกันที่งานอบรม อยากให้ทีมขายเข้าใจเรื่องราคา",
      stageOrder: 2,
    },
  ];

  for (const item of samples) {
    const chosen = stage(item.stageOrder);
    if (!chosen) continue;
    const due = new Date();
    due.setDate(due.getDate() + item.stageOrder);
    const lead = await db.lead.create({
      data: {
        stageId: chosen.id,
        ownerId: owner?.id,
        contactName: item.contactName,
        businessName: item.businessName,
        location: item.location,
        phone: item.phone,
        phoneNormalized: item.phone,
        email: item.email,
        services: item.services,
        source: item.source,
        formName: item.formName,
        message: item.message,
        nextActivityAt: due,
        estimatedValue: 45000 + item.stageOrder * 8000,
      },
    });
    await db.activity.create({
      data: {
        leadId: lead.id,
        ownerId: owner?.id,
        type: item.source === "website_form" ? "task" : "call",
        title: item.source === "website_form" ? "ตอบลีดจากเว็บ" : "ติดตามต่อ",
        dueAt: due,
        firstResponse: item.stageOrder === 1,
      },
    });
    await db.leadEvent.create({
      data: { leadId: lead.id, userId: owner?.id, type: "created", detail: "ตัวอย่างลีดสำหรับทดลอง CRM" },
    });
  }
}

export async function ensureAdminUser() {
  const db = prisma();
  const hashed = hashSecret(ADMIN_PASSWORD);
  const existing = await db.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    const passwordOk = verifySecret(ADMIN_PASSWORD, existing.pinSalt, existing.pinHash);
    await db.user.update({
      where: { id: existing.id },
      data: {
        name: existing.name || "Isara",
        role: existing.role === "partner" ? "owner" : existing.role || "owner",
        ...(passwordOk ? {} : { pinHash: hashed.hash, pinSalt: hashed.salt }),
        failedAttempts: 0,
        lockedUntil: null,
      },
    });
    return;
  }
  try {
    await db.user.create({
      data: {
        name: "Isara",
        email: ADMIN_EMAIL,
        phone: "66000000001",
        role: "owner",
        pinHash: hashed.hash,
        pinSalt: hashed.salt,
      },
    });
  } catch {
    const fallback = await db.user.findFirst({ where: { role: { not: "partner" } } });
    if (!fallback) throw new Error("admin_seed_failed");
    await db.user.update({
      where: { id: fallback.id },
      data: {
        email: ADMIN_EMAIL,
        name: fallback.name || "Isara",
        role: "owner",
        pinHash: hashed.hash,
        pinSalt: hashed.salt,
        failedAttempts: 0,
        lockedUntil: null,
      },
    });
  }
}
