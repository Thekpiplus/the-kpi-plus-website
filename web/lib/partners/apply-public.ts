import { prisma } from "@/lib/crm/db";
import { intakeWebsiteLead } from "@/lib/crm/intake";
import { hashSecret, isFourDigitPin, normalizePhone } from "@/lib/crm/security";
import { writeAudit } from "./access";
import { DEFAULT_RULE } from "./rules";

export type PartnerApplicationInput = {
  fullName: string;
  email: string;
  phone: string;
  territory: string;
  company: string;
  jobTitle: string;
  website: string;
  businessType: string;
  experience: string;
  intro: string;
  interest: string;
  segments: string[];
  pin?: string;
  pageUrl?: string;
};

async function ensurePartnerLogin(input: { name: string; email: string; phone: string; pin: string }) {
  const db = prisma();
  const existing = await db.user.findUnique({ where: { email: input.email } });
  if (existing) return existing.role === "partner" ? existing.id : null;

  const hashed = hashSecret(input.pin);
  const name = input.name.trim();
  const phones = [normalizePhone(input.phone), `${normalizePhone(input.phone)}${Date.now().toString().slice(-4)}`];
  for (const phone of phones) {
    try {
      const user = await db.user.create({
        data: {
          name,
          phone,
          email: input.email,
          role: "partner",
          pinHash: hashed.hash,
          pinSalt: hashed.salt,
        },
      });
      return user.id;
    } catch {
      // Phone uniqueness; retry with a suffix once.
    }
  }
  return null;
}

function note(input: PartnerApplicationInput) {
  return [
    "ใบสมัครสาธารณะ /partner",
    `พื้นที่: ${input.territory}`,
    input.company ? `บริษัท: ${input.company}` : "",
    input.jobTitle ? `ตำแหน่ง: ${input.jobTitle}` : "",
    input.website ? `เว็บไซต์/LinkedIn: ${input.website}` : "",
    `ประเภทธุรกิจ: ${input.businessType}`,
    input.experience ? `ประสบการณ์: ${input.experience}` : "",
    input.interest ? `รูปแบบที่สนใจ: ${input.interest}` : "",
    input.segments.length ? `กลุ่มธุรกิจ: ${input.segments.join(", ")}` : "",
    input.intro ? `แนะนำตัว: ${input.intro}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function savePublicPartnerApplication(input: PartnerApplicationInput) {
  const db = prisma() as typeof prisma extends () => infer T ? T : never;
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  const reviewNote = note(input);

  try {
    const existing = await db.partner.findFirst({
      where: { email, status: { in: ["pending", "active"] } },
    });
    const pin = input.pin ?? "";
    if (existing) {
      if (!existing.userId && isFourDigitPin(pin)) {
        const userId = await ensurePartnerLogin({ name: input.fullName, email, phone, pin });
        if (userId) await db.partner.update({ where: { id: existing.id }, data: { userId } });
      }
      return { ok: true as const, duplicate: true };
    }

    const userId = isFourDigitPin(pin) ? await ensurePartnerLogin({ name: input.fullName, email, phone, pin }) : null;
    const partner = await db.partner.create({
      data: {
        userId,
        type: "individual",
        legalName: input.fullName,
        displayName: input.fullName,
        email,
        phone,
        phoneNormalized: normalizePhone(phone),
        address: input.territory,
        tier: "referral",
        status: "pending",
        kycStatus: "unverified",
        termsVersion: DEFAULT_RULE.termsVersion,
        termsAcceptedAt: new Date(),
        reviewNote,
      },
    });
    await writeAudit({
      partnerId: partner.id,
      entityType: "partner",
      entityId: partner.id,
      action: "apply",
      detail: "ใบสมัครสาธารณะ /partner",
    }).catch(() => undefined);
    return { ok: true as const, id: partner.id };
  } catch (error) {
    console.error("[partner-apply]", error);
    await intakeWebsiteLead({
      form: "partner_application",
      name: input.fullName,
      businessName: input.company,
      businessType: input.businessType,
      phone,
      email,
      location: input.territory,
      website: input.website,
      message: reviewNote,
      pageUrl: input.pageUrl,
      locale: "th",
      raw: input,
    });
    return { ok: true as const, fallback: true };
  }
}
