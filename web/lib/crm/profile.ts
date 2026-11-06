"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { prisma } from "@/lib/crm/db";
import { hashSecret, normalizePhone, verifySecret } from "@/lib/crm/security";

function isValidUsername(username: string) {
  return /^[a-z0-9._-]{3,32}$/.test(username);
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
