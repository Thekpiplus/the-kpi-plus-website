"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { prisma } from "@/lib/crm/db";
import { hashSecret, normalizePhone, randomToken, verifySecret } from "@/lib/crm/security";

const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
const AVATAR_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

async function ensureAvatarColumn() {
  try {
    await prisma().$executeRawUnsafe(
      "ALTER TABLE `User` ADD COLUMN `avatarUrl` VARCHAR(500) NOT NULL DEFAULT ''",
    );
  } catch {
    // Column already exists.
  }
}

function isValidUsername(username: string) {
  return /^[a-z0-9._-]{3,32}$/.test(username);
}

function isOwnedAvatarPath(path: string, userId: string) {
  return Boolean(path) && path.startsWith(`/media/avatars/${userId}-`) && !path.includes("..");
}

async function removeAvatarFile(path: string) {
  if (!path.startsWith("/media/avatars/") || path.includes("..")) return;
  try {
    const { unlink } = await import("node:fs/promises");
    const { join } = await import("node:path");
    await unlink(join(process.cwd(), "public", path.replace(/^\//, "")));
  } catch {
    // Missing file is fine — DB path is the source of truth.
  }
}

function normalizeUsername(raw: string, email: string) {
  const value = raw.trim().toLowerCase().replace(/\s+/g, "");
  if (value) return value;
  const fromEmail = email.split("@")[0]?.trim().toLowerCase() ?? "";
  return fromEmail || "";
}

function profileRedirect(query: string) {
  redirect(`/crm/profile?${query}`);
}

/** Current user may update their own contact fields only — not role/modules. */
export async function updateOwnProfile(formData: FormData) {
  const me = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const username = normalizeUsername(String(formData.get("username") ?? ""), email);
  const phone = normalizePhone(String(formData.get("phone") ?? "").trim());

  if (!name || !email.includes("@") || !username || !isValidUsername(username) || !phone) {
    profileRedirect("error=invalid");
  }

  const db = prisma();
  const taken = await db.user.findFirst({
    where: { OR: [{ email }, { phone }], NOT: { id: me.id } },
  });
  const usernameTaken = await db.user.findFirst({
    where: { username, NOT: { id: me.id } },
  });
  if (taken || usernameTaken) profileRedirect("error=exists");

  await db.user.update({
    where: { id: me.id },
    data: { name, email, username, phone },
  });

  revalidatePath("/crm");
  revalidatePath("/crm/profile");
  revalidatePath("/crm/settings");
  profileRedirect("saved=1");
}

/** Current user changes their own password after verifying the current one. */
export async function changeOwnPassword(formData: FormData) {
  const me = await requireUser();
  const current = String(formData.get("currentPassword") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("passwordConfirm") ?? "");

  if (password.length < 4 || password !== confirm) {
    profileRedirect("pwdError=password");
  }

  const db = prisma();
  const user = await db.user.findUnique({ where: { id: me.id } });
  if (!user) {
    profileRedirect("pwdError=missing");
    return;
  }

  if (!verifySecret(current, user.pinSalt, user.pinHash)) {
    profileRedirect("pwdError=current");
    return;
  }

  const hashed = hashSecret(password);
  await db.user.update({
    where: { id: me.id },
    data: {
      pinHash: hashed.hash,
      pinSalt: hashed.salt,
      failedAttempts: 0,
      lockedUntil: null,
    },
  });
  // Keep the current session; drop other devices.
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  const token = jar.get("crm_session")?.value;
  if (token) {
    const { hashToken } = await import("@/lib/crm/security");
    const keep = hashToken(token);
    await db.session.deleteMany({
      where: { userId: me.id, NOT: { tokenHash: keep } },
    });
  } else {
    await db.session.deleteMany({ where: { userId: me.id } });
  }

  revalidatePath("/crm/profile");
  profileRedirect("pwdChanged=1");
}

/** Upload or replace the current user's avatar image (JPEG/PNG/WebP/GIF, max 2MB). */
export async function updateOwnAvatar(formData: FormData) {
  const me = await requireUser();
  await ensureAvatarColumn().catch(() => undefined);

  const raw = formData.get("avatar");
  if (!(raw instanceof File) || raw.size <= 0) {
    profileRedirect("avatarError=missing");
    return;
  }
  const file = raw;
  if (file.size > AVATAR_MAX_BYTES) {
    profileRedirect("avatarError=size");
    return;
  }

  const original = file.name || "";
  const dot = original.lastIndexOf(".");
  const ext = (dot >= 0 ? original.slice(dot) : "").toLowerCase();
  if (!AVATAR_EXT.has(ext)) {
    profileRedirect("avatarError=type");
    return;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const [{ mkdir, writeFile }, { join }] = await Promise.all([
    import("node:fs/promises"),
    import("node:path"),
  ]);
  const dir = join(process.cwd(), "public", "media", "avatars");
  await mkdir(dir, { recursive: true });
  const filename = `${me.id}-${randomToken(8)}${ext}`;
  await writeFile(join(dir, filename), buffer);
  const nextPath = `/media/avatars/${filename}`;

  const db = prisma();
  const current = await db.user.findUnique({ where: { id: me.id }, select: { avatarUrl: true } });
  const previous = current?.avatarUrl?.trim() ?? "";

  await db.user.update({
    where: { id: me.id },
    data: { avatarUrl: nextPath },
  });

  if (isOwnedAvatarPath(previous, me.id) && previous !== nextPath) {
    await removeAvatarFile(previous);
  }

  revalidatePath("/crm");
  revalidatePath("/crm/profile");
  profileRedirect("avatarSaved=1");
}

/** Clear the current user's avatar and delete the stored file when owned. */
export async function removeOwnAvatar() {
  const me = await requireUser();
  await ensureAvatarColumn().catch(() => undefined);

  const db = prisma();
  const current = await db.user.findUnique({ where: { id: me.id }, select: { avatarUrl: true } });
  const previous = current?.avatarUrl?.trim() ?? "";

  await db.user.update({
    where: { id: me.id },
    data: { avatarUrl: "" },
  });

  if (isOwnedAvatarPath(previous, me.id)) {
    await removeAvatarFile(previous);
  }

  revalidatePath("/crm");
  revalidatePath("/crm/profile");
  profileRedirect("avatarRemoved=1");
}
