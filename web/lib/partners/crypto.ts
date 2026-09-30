import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ALGO = "aes-256-gcm";

function keyBytes() {
  const raw = process.env.PARTNER_DATA_KEY || "local-dev-partner-key-change-me";
  return createHash("sha256").update(raw).digest();
}

export function encryptText(value: string) {
  if (!value) return "";
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, keyBytes(), iv);
  const enc = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${enc.toString("hex")}`;
}

export function decryptText(value: string) {
  if (!value || !value.includes(":")) return "";
  const [ivHex, tagHex, dataHex] = value.split(":");
  const decipher = createDecipheriv(ALGO, keyBytes(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]).toString("utf8");
}

export function last4(value: string) {
  const digits = value.replace(/\s/g, "");
  return digits.slice(-4);
}

export const ALLOWED_DOC_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
export const MAX_DOC_BYTES = 8 * 1024 * 1024;

export function privateDir() {
  return join(process.cwd(), "private", "partner-files");
}

export async function storePrivateFile(partnerId: string, filename: string, buffer: Buffer) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, keyBytes(), iv);
  const enc = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  const dir = join(privateDir(), partnerId);
  await mkdir(dir, { recursive: true });
  const stored = `${Date.now()}-${randomBytes(4).toString("hex")}.bin`;
  await writeFile(join(dir, stored), Buffer.concat([iv, tag, enc]));
  return {
    path: `${partnerId}/${stored}`,
    checksum: createHash("sha256").update(buffer).digest("hex"),
    filename,
  };
}

export async function readPrivateFile(relativePath: string) {
  const raw = await readFile(join(privateDir(), relativePath));
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const data = raw.subarray(28);
  const decipher = createDecipheriv(ALGO, keyBytes(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]);
}
