"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { randomToken } from "@/lib/crm/security";
import { readImageSize } from "./case-studies";
import {
  CLIENT_LOGO_IMAGE_TYPES,
  CLIENT_LOGO_MAX_SIZE,
  CLIENT_LOGO_MIN_SIZE,
  MAX_CLIENT_LOGO_BYTES,
  inputFromForm,
  validateClientLogoInput,
  type ClientLogoSaveResult,
} from "./client-logos";
import {
  clientLogoCount,
  deleteClientLogoRow,
  findClientLogo,
  insertClientLogo,
  moveClientLogoRow,
  rowFromInput,
  updateClientLogoRow,
} from "./client-logo-store";
import { cmsDb } from "./queries";

function validateClientLogoBuffer(buffer: Buffer) {
  const size = readImageSize(buffer);
  if (!size) return "";
  if (size.width > CLIENT_LOGO_MAX_SIZE.width || size.height > CLIENT_LOGO_MAX_SIZE.height) return "image_dimensions";
  if (size.width < CLIENT_LOGO_MIN_SIZE.width || size.height < CLIENT_LOGO_MIN_SIZE.height) return "image_dimensions";
  return "";
}

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

function revalidateClientLogos() {
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/client-logos");
  revalidatePath("/case-studies");
  revalidatePath("/en/case-studies");
  revalidatePath("/ru/case-studies");
  revalidatePath("/zh/case-studies");
  revalidatePath("/about-us");
  revalidatePath("/en/about-us");
  revalidatePath("/ru/about-us");
  revalidatePath("/zh/about-us");
}

async function storeClientLogoFile(file: File): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const original = file.name || "";
  const dot = original.lastIndexOf(".");
  const ext = dot >= 0 ? original.slice(dot).toLowerCase() : "";
  if (!CLIENT_LOGO_IMAGE_TYPES.has(ext) || file.size > MAX_CLIENT_LOGO_BYTES) {
    return { ok: false, error: "invalid_image" };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const dimensionError = validateClientLogoBuffer(buffer);
  if (dimensionError) return { ok: false, error: dimensionError };
  const [{ mkdirSync, writeFileSync }, { join }] = await Promise.all([import("node:fs"), import("node:path")]);
  const name = `${randomToken(8)}${ext || ".jpg"}`;
  const dir = join(process.cwd(), "public", "media", "cms");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, name), buffer);
  const path = `/media/cms/${name}`;
  try {
    const db = await cmsDb();
    await db.cmsMedia.create({
      data: {
        filename: file.name,
        path,
        alt: "",
        caption: "",
        mime: file.type || "image/jpeg",
        size: file.size,
      },
    });
  } catch {
    // File is on disk even if the media library row cannot be written.
  }
  return { ok: true, path };
}

export async function saveClientLogo(formData: FormData): Promise<ClientLogoSaveResult> {
  const user = await requireCms();
  const input = inputFromForm(formData);
  const file = formData.get("logoFile");
  const hasFile = file instanceof File && file.size > 0;
  if (hasFile) {
    const stored = await storeClientLogoFile(file);
    if (!stored.ok) return stored;
    input.filePath = stored.path;
  }
  if (formData.get("clearLogoFile") === "1" && !hasFile) input.filePath = "";

  const invalid = validateClientLogoInput(input);
  if (invalid) return { ok: false, error: invalid };

  const existing = input.id ? await findClientLogo(input.id) : null;
  if (input.id && !existing) return { ok: false, error: "missing" };

  const data = rowFromInput(input, existing, user.id);
  if (existing) {
    await updateClientLogoRow(existing.id, data);
    revalidateClientLogos();
    return { ok: true, id: existing.id };
  }

  const count = await clientLogoCount();
  const created = await insertClientLogo({
    ...data,
    sortOrder: input.sortOrder || count,
  });
  revalidateClientLogos();
  return { ok: true, id: created.id };
}

export async function setClientLogoActive(formData: FormData) {
  await requireCms();
  const id = String(formData.get("id") ?? "").trim();
  const isActive = formData.get("isActive") === "1";
  if (!id) redirect("/crm/cms/client-logos?error=missing");
  const existing = await findClientLogo(id);
  if (!existing) redirect("/crm/cms/client-logos?error=missing");
  await updateClientLogoRow(id, { isActive });
  revalidateClientLogos();
  redirect(`/crm/cms/client-logos?id=${id}&saved=1`);
}

export async function moveClientLogo(formData: FormData) {
  await requireCms();
  const id = String(formData.get("id") ?? "").trim();
  const direction = String(formData.get("direction") ?? "") === "up" ? "up" : "down";
  if (!id) redirect("/crm/cms/client-logos?error=missing");
  await moveClientLogoRow(id, direction);
  revalidateClientLogos();
  redirect(`/crm/cms/client-logos?id=${id}`);
}

export async function deleteClientLogo(formData: FormData) {
  await requireCms();
  const id = String(formData.get("id") ?? "").trim();
  const existing = await findClientLogo(id);
  if (!existing) redirect("/crm/cms/client-logos?error=missing");
  await deleteClientLogoRow(id);
  revalidateClientLogos();
  redirect("/crm/cms/client-logos?deleted=1");
}
