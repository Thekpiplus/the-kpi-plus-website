import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { IP_ATTEMPT_LIMIT, IP_ATTEMPT_WINDOW_MS, SESSION_HOURS } from "./constants";
import { prisma } from "./db";
import { sendMail } from "./mail";
import { ensureCrmSeed } from "./seed";
import {
  hashSecret,
  hashToken,
  isFourDigitPin,
  lockoutMs,
  normalizePhone,
  randomToken,
  verifySecret,
} from "./security";

const SESSION_COOKIE = "crm_session";
const DEVICE_COOKIE = "crm_device";

function clientIp(headerList: Headers) {
  return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "local";
}

async function bumpRateLimit(key: string) {
  const db = prisma();
  const now = new Date();
  const row = await db.rateLimit.findUnique({ where: { id: key } });
  if (!row || row.resetAt < now) {
    await db.rateLimit.upsert({
      where: { id: key },
      create: { id: key, count: 1, resetAt: new Date(now.getTime() + IP_ATTEMPT_WINDOW_MS) },
      update: { count: 1, resetAt: new Date(now.getTime() + IP_ATTEMPT_WINDOW_MS) },
    });
    return { blocked: false };
  }
  const next = row.count + 1;
  await db.rateLimit.update({ where: { id: key }, data: { count: next } });
  return { blocked: next > IP_ATTEMPT_LIMIT };
}

export async function requestContext() {
  const headerList = await headers();
  return {
    ip: clientIp(headerList),
    userAgent: headerList.get("user-agent") ?? "",
  };
}

export function authRequired() {
  return true;
}

async function shopForUser(user: { id: string; email: string; role: string } | null | undefined) {
  if (!user) return "";
  if (user.role === "partner") {
    const partner = await prisma().partner.findFirst({
      where: { OR: [{ userId: user.id }, { email: user.email }] },
      select: { displayName: true },
    }).catch(() => null);
    return partner?.displayName || "Partner Portal";
  }
  return "The KPI Plus";
}

async function recordLogin(input: {
  email: string;
  ip: string;
  userAgent: string;
  success: boolean;
  reason: string;
  user?: { id: string; name: string; email: string; role: string; phone: string } | null;
}) {
  const email = input.email.trim().toLowerCase();
  const shop = await shopForUser(input.user);
  const id = randomToken(12);
  try {
    await prisma().$executeRaw`
      INSERT INTO "LoginAttempt" ("id", "phone", "email", "userId", "userName", "role", "shop", "ip", "userAgent", "success", "reason", "createdAt")
      VALUES (
        ${id},
        ${input.user?.phone || email},
        ${email},
        ${input.user?.id ?? ""},
        ${input.user?.name ?? ""},
        ${input.user?.role ?? ""},
        ${shop},
        ${input.ip},
        ${input.userAgent},
        ${input.success ? 1 : 0},
        ${input.reason},
        ${new Date().toISOString()}
      )
    `;
  } catch {
    await prisma().loginAttempt.create({
      data: { phone: email, ip: input.ip, success: input.success, reason: input.reason },
    });
  }
}

export async function currentUser() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = prisma();
  const session = await db.session.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!session || session.expiresAt < new Date()) return null;
  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) return null;
  const extra = await db
    .$queryRawUnsafe<{ modules: string | null }[]>(`SELECT "modules" FROM "User" WHERE "id" = ?`, user.id)
    .catch(() => [] as { modules: string | null }[]);
  return { ...user, modules: extra[0]?.modules ?? (user as { modules?: string }).modules ?? "" };
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/admin");
  return user;
}

export async function requirePartner() {
  const user = await currentUser();
  if (!user) redirect("/partners/login");
  if (user.role !== "partner") redirect("/crm");
  return user;
}

export async function startPartnerLogin(emailRaw: string, pin: string) {
  if (!isFourDigitPin(pin)) {
    return { ok: false as const, error: "invalid" };
  }
  return startLogin(emailRaw, pin, "partner");
}

export async function startLogin(emailRaw: string, password: string, expectedRole?: string) {
  const { ip, userAgent } = await requestContext();
  const email = emailRaw.trim().toLowerCase();
  const db = prisma();

  const ipLimit = await bumpRateLimit(`login-ip:${ip}`);
  if (ipLimit.blocked) {
    await recordLogin({ email, ip, userAgent, success: false, reason: "ip_rate_limit" });
    return { ok: false as const, error: "rate_limited" };
  }

  if (!email.includes("@") || !password) {
    await recordLogin({ email, ip, userAgent, success: false, reason: "invalid_input" });
    return { ok: false as const, error: "invalid" };
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    await recordLogin({ email, ip, userAgent, success: false, reason: "unknown_user" });
    return { ok: false as const, error: "invalid" };
  }
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    await recordLogin({ email, ip, userAgent, success: false, reason: "locked", user });
    return { ok: false as const, error: "locked" };
  }
  if (expectedRole && user.role !== expectedRole) {
    await recordLogin({ email, ip, userAgent, success: false, reason: "wrong_portal", user });
    return { ok: false as const, error: "invalid" };
  }

  if (!verifySecret(password, user.pinSalt, user.pinHash)) {
    const failedAttempts = user.failedAttempts + 1;
    const lock = lockoutMs(failedAttempts);
    await db.user.update({
      where: { id: user.id },
      data: { failedAttempts, lockedUntil: lock ? new Date(Date.now() + lock) : null },
    });
    await recordLogin({ email, ip, userAgent, success: false, reason: "bad_password", user });
    return { ok: false as const, error: lock ? "locked" : "invalid" };
  }

  await db.user.update({ where: { id: user.id }, data: { failedAttempts: 0, lockedUntil: null } });
  const sessionToken = await createSession(user.id, ip, userAgent);
  await recordLogin({ email, ip, userAgent, success: true, reason: "ok", user });
  return { ok: true as const, next: user.role === "partner" ? "/partners" : "/crm", sessionToken };
}

export async function verifyDevice(challengeId: string, code: string) {
  const { ip, userAgent } = await requestContext();
  const db = prisma();
  const challenge = await db.deviceChallenge.findUnique({ where: { id: challengeId } });
  if (!challenge || challenge.expiresAt < new Date() || challenge.attempts >= 5) {
    return { ok: false as const, error: "invalid" };
  }
  const [salt, hash] = challenge.codeHash.split(":");
  if (!salt || !hash || !verifySecret(code, salt, hash)) {
    await db.deviceChallenge.update({ where: { id: challenge.id }, data: { attempts: { increment: 1 } } });
    return { ok: false as const, error: "invalid" };
  }

  const deviceToken = randomToken();
  await db.trustedDevice.create({
    data: {
      userId: challenge.userId,
      deviceTokenHash: hashToken(deviceToken),
      userAgent,
      verifiedAt: new Date(),
      lastSeenAt: new Date(),
    },
  });
  const jar = await cookies();
  jar.set(DEVICE_COOKIE, deviceToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
  await db.deviceChallenge.delete({ where: { id: challenge.id } });
  await createSession(challenge.userId, ip, userAgent);
  const user = await db.user.findUnique({ where: { id: challenge.userId } });
  if (user) {
    await recordLogin({ email: user.email, ip, userAgent, success: true, reason: "device_verified", user });
  }
  return { ok: true as const, next: user?.role === "partner" ? "/partners" : "/crm" };
}

async function createSession(userId: string, ip: string, userAgent: string) {
  const token = randomToken();
  const db = prisma();
  await db.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000),
      ip,
      userAgent,
    },
  });
  try {
    const jar = await cookies();
    jar.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_HOURS * 60 * 60,
    });
  } catch {
    // Route handlers attach the cookie on the redirect response instead.
  }
  return token;
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma().session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  jar.delete(SESSION_COOKIE);
}

export async function requestPinReset(emailRaw: string) {
  const email = emailRaw.trim().toLowerCase();
  const db = prisma();
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return;
  const token = randomToken();
  await db.pinReset.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 20 * 60 * 1000),
    },
  });
  const base = (process.env.CRM_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  await sendMail({
    to: user.email,
    subject: "รีเซ็ต PIN ของ CRM The KPI Plus",
    text: `เปิดลิงก์นี้ภายใน 20 นาทีเพื่อตั้ง PIN ใหม่:\n${base}/admin/reset?token=${token}\n\nหากคุณไม่ได้ขอรีเซ็ต ให้เพิกเฉยอีเมลนี้`,
  });
}

export async function ownerCount() {
  return prisma().user.count();
}

export async function bootstrapOwner(input: { name: string; phone: string; email: string; pin: string }) {
  const db = prisma();
  if ((await db.user.count()) > 0) return { ok: false as const, error: "exists" };

  const phone = normalizePhone(input.phone);
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  if (!name || !phone || !email.includes("@") || !isFourDigitPin(input.pin)) {
    return { ok: false as const, error: "invalid" };
  }

  await ensureCrmSeed();
  const hashed = hashSecret(input.pin);
  const user = await db.user.create({
    data: {
      name,
      phone,
      email,
      pinHash: hashed.hash,
      pinSalt: hashed.salt,
    },
  });

  const { ip, userAgent } = await requestContext();
  const deviceToken = randomToken();
  await db.trustedDevice.create({
    data: {
      userId: user.id,
      deviceTokenHash: hashToken(deviceToken),
      userAgent,
      verifiedAt: new Date(),
      lastSeenAt: new Date(),
    },
  });
  const jar = await cookies();
  jar.set(DEVICE_COOKIE, deviceToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
  await createSession(user.id, ip, userAgent);
  return { ok: true as const };
}

export async function completePinReset(token: string, pin: string) {
  if (!isFourDigitPin(pin)) return { ok: false as const, error: "invalid_pin" };
  const db = prisma();
  const row = await db.pinReset.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!row || row.usedAt || row.expiresAt < new Date()) {
    return { ok: false as const, error: "invalid_token" };
  }
  const hashed = hashSecret(pin);
  await db.user.update({
    where: { id: row.userId },
    data: { pinHash: hashed.hash, pinSalt: hashed.salt, failedAttempts: 0, lockedUntil: null },
  });
  await db.pinReset.update({ where: { id: row.id }, data: { usedAt: new Date() } });
  await db.session.deleteMany({ where: { userId: row.userId } });
  return { ok: true as const };
}
