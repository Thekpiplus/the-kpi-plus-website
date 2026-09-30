"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasModule, modulesFromForm, parseModules } from "./modules";
import { requireUser } from "./auth";
import { prisma } from "./db";
import { hashSecret, normalizePhone } from "./security";

async function requireUsersAdmin() {
  const user = await requireUser();
  if (user.role !== "owner" && !hasModule(user, "users")) redirect("/crm/users?error=forbidden");
  return user;
}

function revalidateUsers(id?: string) {
  revalidatePath("/crm");
  revalidatePath("/crm/users");
  if (id) revalidatePath(`/crm/users/${id}`);
}

function staffPayload(formData: FormData) {
  const modules = modulesFromForm(formData);
  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    phone: normalizePhone(String(formData.get("phone") ?? "").trim()),
    modules,
    selected: parseModules(modules),
  };
}

export async function createStaffUser(formData: FormData) {
  await requireUsersAdmin();
  const { name, email, phone, modules, selected } = staffPayload(formData);
  const password = String(formData.get("password") ?? "");

  if (!name || !email.includes("@") || !phone || password.length < 4 || !selected.length) {
    redirect("/crm/users/new?error=invalid");
  }

  const db = prisma();
  const taken = await db.user.findFirst({
    where: { OR: [{ email }, { phone }] },
  });
  if (taken) redirect("/crm/users/new?error=exists");

  const hashed = hashSecret(password);
  const created = await db.user.create({
    data: { name, email, phone, role: "staff", pinHash: hashed.hash, pinSalt: hashed.salt },
  });
  await db.$executeRawUnsafe(`UPDATE "User" SET "modules" = ? WHERE "id" = ?`, modules, created.id).catch(() => undefined);
  revalidateUsers(created.id);
  redirect(`/crm/users/${created.id}`);
}

export async function updateStaffUser(formData: FormData) {
  await requireUsersAdmin();
  const id = String(formData.get("userId") ?? "");
  const { name, email, phone, modules, selected } = staffPayload(formData);
  const password = String(formData.get("password") ?? "");
  if (!id || !name || !email.includes("@") || !phone) redirect(`/crm/users/${id}?error=invalid`);

  const db = prisma();
  const target = await db.user.findUnique({ where: { id } });
  if (!target) redirect("/crm/users?error=missing");

  if (target.role === "partner") {
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
    revalidateUsers(id);
    redirect(`/crm/users/${id}?saved=1`);
  }

  if (target.role !== "owner" && !selected.length) redirect(`/crm/users/${id}?error=invalid`);
  const hashed = password.length >= 4 ? hashSecret(password) : null;
  await db.user.update({
    where: { id },
    data: {
      name,
      email,
      phone,
      ...(target.role === "owner" ? {} : { role: "staff" }),
      ...(hashed ? { pinHash: hashed.hash, pinSalt: hashed.salt, failedAttempts: 0, lockedUntil: null } : {}),
    },
  });
  if (target.role !== "owner") {
    await db.$executeRawUnsafe(`UPDATE "User" SET "modules" = ? WHERE "id" = ?`, modules, id).catch(() => undefined);
  }
  revalidateUsers(id);
  redirect(`/crm/users/${id}?saved=1`);
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

export async function deleteStaffUser(formData: FormData) {
  const actor = await requireUsersAdmin();
  const id = String(formData.get("userId") ?? "");
  if (!id || id === actor.id) redirect(`/crm/users/${id}?error=self`);
  const db = prisma();
  const target = await db.user.findUnique({ where: { id } });
  if (!target) redirect("/crm/users?error=missing");
  if (target.role === "owner") {
    const owners = await db.user.count({ where: { role: "owner" } });
    if (owners <= 1) redirect(`/crm/users/${id}?error=last_owner`);
  }
  if (target.role === "partner") redirect(`/crm/users/${id}?error=partner`);
  await db.session.deleteMany({ where: { userId: id } });
  await db.trustedDevice.deleteMany({ where: { userId: id } });
  await db.deviceChallenge.deleteMany({ where: { userId: id } });
  await db.pinReset.deleteMany({ where: { userId: id } });
  await db.user.delete({ where: { id } });
  revalidateUsers();
  redirect("/crm/users?deleted=1");
}
