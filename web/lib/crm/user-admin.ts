"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canManageUsers, modulesFromForm, parseModules } from "./modules";
import { requireUser } from "./auth";
import { prisma } from "./db";
import { hashSecret, normalizePhone } from "./security";
import {
  assignableInternalRoles,
  isFullAccessRole,
  isPartnerRoleValue,
  isSuperadminRole,
  normalizeRole,
  type InternalRole,
} from "./roles";

async function requireUsersAdmin() {
  const user = await requireUser();
  if (!canManageUsers(user)) redirect("/crm/users?error=forbidden");
  return user;
}

function revalidateUsers(id?: string) {
  revalidatePath("/crm");
  revalidatePath("/crm/users");
  if (id) revalidatePath(`/crm/users/${id}`);
}

function normalizeUsername(raw: string, email: string) {
  const value = raw.trim().toLowerCase().replace(/\s+/g, "");
  if (value) return value;
  const fromEmail = email.split("@")[0]?.trim().toLowerCase() ?? "";
  return fromEmail || null;
}

function isValidUsername(username: string) {
  return /^[a-z0-9._-]{3,32}$/.test(username);
}

function staffPayload(formData: FormData) {
  const modules = modulesFromForm(formData);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  return {
    name: String(formData.get("name") ?? "").trim(),
    email,
    username: normalizeUsername(String(formData.get("username") ?? ""), email),
    phone: normalizePhone(String(formData.get("phone") ?? "").trim()),
    roleRaw: String(formData.get("role") ?? "").trim().toLowerCase(),
    modules,
    selected: parseModules(modules),
  };
}

function resolveAssignableRole(actorRole: string, requested: string, fallback: InternalRole = "user"): InternalRole {
  const allowed = assignableInternalRoles(actorRole);
  const normalized = normalizeRole(requested);
  if (normalized === "partner") return fallback;
  if (allowed.includes(normalized as InternalRole)) return normalized as InternalRole;
  return allowed.includes(fallback) ? fallback : allowed[0] ?? "user";
}

export async function createStaffUser(formData: FormData) {
  const actor = await requireUsersAdmin();
  const { name, email, username, phone, roleRaw, modules, selected } = staffPayload(formData);
  const password = String(formData.get("password") ?? "");
  const role = resolveAssignableRole(actor.role, roleRaw, "user");

  if (!name || !email.includes("@") || !username || !isValidUsername(username) || !phone || password.length < 4) {
    redirect("/crm/users?new=1&error=invalid");
  }
  if (!isFullAccessRole(role) && !selected.length) {
    redirect("/crm/users?new=1&error=invalid");
  }

  const db = prisma();
  const taken = await db.user.findFirst({
    where: { OR: [{ email }, { phone }] },
  });
  const usernameTaken = await db
    .$queryRawUnsafe<{ id: string }[]>(`SELECT "id" FROM "User" WHERE lower("username") = ? LIMIT 1`, username)
    .catch(() => [] as { id: string }[]);
  if (taken || usernameTaken[0]) redirect("/crm/users?new=1&error=exists");

  const hashed = hashSecret(password);
  const created = await db.user.create({
    data: { name, email, phone, role, pinHash: hashed.hash, pinSalt: hashed.salt },
  });
  const modulePayload = isFullAccessRole(role) ? JSON.stringify(["leads", "partners", "users", "cms"]) : modules;
  await db.$executeRawUnsafe(`UPDATE "User" SET "modules" = ? WHERE "id" = ?`, modulePayload, created.id).catch(() => undefined);
  await db.$executeRawUnsafe(`UPDATE "User" SET "username" = ? WHERE "id" = ?`, username, created.id).catch(() => undefined);
  revalidateUsers(created.id);
  redirect(`/crm/users?created=1`);
}

export async function updateStaffUser(formData: FormData) {
  const actor = await requireUsersAdmin();
  const id = String(formData.get("userId") ?? "");
  const { name, email, username, phone, roleRaw, modules, selected } = staffPayload(formData);
  const password = String(formData.get("password") ?? "");
  if (!id || !name || !email.includes("@") || !username || !isValidUsername(username) || !phone) {
    redirect(`/crm/users/${id}?error=invalid`);
  }

  const db = prisma();
  const target = await db.user.findUnique({ where: { id } });
  if (!target) redirect("/crm/users?error=missing");

  const taken = await db.user.findFirst({
    where: { OR: [{ email }, { phone }], NOT: { id } },
  });
  const usernameTaken = await db
    .$queryRawUnsafe<{ id: string }[]>(
      `SELECT "id" FROM "User" WHERE lower("username") = ? AND "id" != ? LIMIT 1`,
      username,
      id,
    )
    .catch(() => [] as { id: string }[]);
  if (taken || usernameTaken[0]) redirect(`/crm/users/${id}?error=exists`);

  if (isPartnerRoleValue(target.role)) {
    const hashed = password.length >= 4 ? hashSecret(password) : null;
    await db.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        ...(hashed ? { pinHash: hashed.hash, pinSalt: hashed.salt, failedAttempts: 0, lockedUntil: null } : {}),
      },
    });
    await db.$executeRawUnsafe(`UPDATE "User" SET "username" = ? WHERE "id" = ?`, username, id).catch(() => undefined);
    revalidateUsers(id);
    redirect(formData.get("returnTo") === "list" ? "/crm/users?saved=1" : `/crm/users/${id}?saved=1`);
  }

  let nextRole = normalizeRole(target.role) as InternalRole | "partner";
  if (roleRaw) {
    if (id === actor.id && normalizeRole(roleRaw) !== normalizeRole(actor.role)) {
      redirect(`/crm/users/${id}?error=self_role`);
    }
    nextRole = resolveAssignableRole(actor.role, roleRaw, normalizeRole(target.role) as InternalRole);
  }

  if (!isFullAccessRole(nextRole) && !selected.length) redirect(`/crm/users/${id}?error=invalid`);

  // Only superadmin may demote/remove another superadmin.
  if (isSuperadminRole(target.role) && !isSuperadminRole(actor.role) && nextRole !== "superadmin") {
    redirect(`/crm/users/${id}?error=forbidden`);
  }

  const hashed = password.length >= 4 ? hashSecret(password) : null;
  await db.user.update({
    where: { id },
    data: {
      name,
      email,
      phone,
      role: nextRole,
      ...(hashed ? { pinHash: hashed.hash, pinSalt: hashed.salt, failedAttempts: 0, lockedUntil: null } : {}),
    },
  });

  const modulePayload = isFullAccessRole(nextRole) ? JSON.stringify(["leads", "partners", "users", "cms"]) : modules;
  await db.$executeRawUnsafe(`UPDATE "User" SET "modules" = ? WHERE "id" = ?`, modulePayload, id).catch(() => undefined);
  await db.$executeRawUnsafe(`UPDATE "User" SET "username" = ? WHERE "id" = ?`, username, id).catch(() => undefined);

  revalidateUsers(id);
  redirect(formData.get("returnTo") === "list" ? "/crm/users?saved=1" : `/crm/users/${id}?saved=1`);
}

export async function unlockStaffUser(formData: FormData) {
  await requireUsersAdmin();
  const id = String(formData.get("userId") ?? "");
  if (!id) return;
  await prisma().user.update({
    where: { id },
    data: { failedAttempts: 0, lockedUntil: null },
  });
  revalidateUsers(id);
}

export async function changeStaffPassword(formData: FormData) {
  await requireUsersAdmin();
  const id = String(formData.get("userId") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("passwordConfirm") ?? "");
  if (!id || password.length < 4 || password !== confirm) {
    redirect(`/crm/users?pwd=1&user=${encodeURIComponent(id)}&error=password`);
  }
  const target = await prisma().user.findUnique({ where: { id } });
  if (!target) redirect("/crm/users?error=missing");
  const hashed = hashSecret(password);
  await prisma().user.update({
    where: { id },
    data: { pinHash: hashed.hash, pinSalt: hashed.salt, failedAttempts: 0, lockedUntil: null },
  });
  await prisma().session.deleteMany({ where: { userId: id } });
  revalidateUsers(id);
  redirect("/crm/users?pwdChanged=1");
}

export async function deleteStaffUser(formData: FormData) {
  const actor = await requireUsersAdmin();
  const id = String(formData.get("userId") ?? "");
  if (!id || id === actor.id) redirect(`/crm/users/${id}?error=self`);
  const db = prisma();
  const target = await db.user.findUnique({ where: { id } });
  if (!target) redirect("/crm/users?error=missing");
  if (isPartnerRoleValue(target.role)) redirect(`/crm/users/${id}?error=partner`);
  if (isSuperadminRole(target.role) && !isSuperadminRole(actor.role)) {
    redirect(`/crm/users/${id}?error=forbidden`);
  }
  if (isSuperadminRole(target.role)) {
    const owners = await db.user.count({ where: { role: { in: ["superadmin", "owner"] } } });
    if (owners <= 1) redirect(`/crm/users/${id}?error=last_owner`);
  }
  await db.session.deleteMany({ where: { userId: id } });
  await db.trustedDevice.deleteMany({ where: { userId: id } });
  await db.deviceChallenge.deleteMany({ where: { userId: id } });
  await db.pinReset.deleteMany({ where: { userId: id } });
  await db.user.delete({ where: { id } });
  revalidateUsers();
  redirect("/crm/users?deleted=1");
}
