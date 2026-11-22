import { mkdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import sharp from "sharp";
import { randomToken } from "@/lib/crm/security";

const RASTER_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".tif", ".tiff", ".bmp"]);
const PASS_THROUGH_EXT = new Set([".svg", ".pdf", ".mp4", ".webm"]);

export type StoredUpload = {
  /** Public URL path, e.g. `/media/cms/ab12cd.webp` */
  path: string;
  /** Original client filename */
  originalName: string;
  mime: string;
  size: number;
  /** Filename written on disk */
  diskName: string;
};

function fileExt(name: string) {
  const ext = extname(name || "").toLowerCase();
  return ext || "";
}

/** Convert raster bytes to WebP. Returns null when sharp cannot decode the input. */
export async function encodeRasterToWebp(input: Buffer): Promise<Buffer | null> {
  try {
    const image = sharp(input, { animated: false, failOn: "none" });
    const meta = await image.metadata();
    const pipeline =
      meta.hasAlpha || meta.format === "png" || meta.format === "webp"
        ? image.webp({ quality: 82, alphaQuality: 90, effort: 4 })
        : image.webp({ quality: 82, effort: 4 });
    return await pipeline.toBuffer();
  } catch {
    return null;
  }
}

function extAllowed(ext: string, rule: Set<string> | ((ext: string) => boolean)) {
  return typeof rule === "function" ? rule(ext) : rule.has(ext);
}

/**
 * Save an upload under `public/<subdir>/` or `private/<subdir>/`.
 * Raster images (jpg/png/gif/webp/…) are re-encoded to `.webp`.
 * SVG / PDF / video / office docs are stored as-is.
 */
export async function storePublicUpload(
  file: File,
  options: {
    /** Storage root. Default `public` (URL path `/…`). Use `private` for ops attachments. */
    root?: "public" | "private";
    subdir?: string;
    allowedExt: Set<string> | ((ext: string) => boolean);
    maxBytes?: number;
    /** Filename prefix, e.g. user id for avatars */
    prefix?: string;
    /** When false, skip WebP conversion (rare). Default true. */
    convertRaster?: boolean;
  },
): Promise<{ ok: true; upload: StoredUpload } | { ok: false; error: string }> {
  const originalName = file.name || "upload";
  const ext = fileExt(originalName);
  if (!extAllowed(ext, options.allowedExt)) return { ok: false, error: "type" };
  if (options.maxBytes && file.size > options.maxBytes) return { ok: false, error: "size" };

  const root = options.root ?? "public";
  const subdir = (options.subdir ?? "media/cms").replace(/^\/+|\/+$/g, "");
  const convertRaster = options.convertRaster !== false;
  const raw = Buffer.from(await file.arrayBuffer());

  let outBuffer: Buffer = raw;
  let outExt = ext || ".bin";
  let mime = file.type || "application/octet-stream";

  if (convertRaster && RASTER_EXT.has(ext)) {
    const webp = await encodeRasterToWebp(raw);
    if (!webp) return { ok: false, error: "convert" };
    outBuffer = Buffer.from(webp);
    outExt = ".webp";
    mime = "image/webp";
  } else if (!PASS_THROUGH_EXT.has(ext) && !RASTER_EXT.has(ext)) {
    // Unknown but allowed (e.g. docx/xlsx) — keep bytes/ext.
  }

  const token = randomToken(8);
  const diskName = `${options.prefix ? `${options.prefix}-` : ""}${token}${outExt}`;
  const dir = join(process.cwd(), root, ...subdir.split("/").filter(Boolean));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, diskName), outBuffer);

  const relative = `${root}/${subdir}/${diskName}`;
  return {
    ok: true,
    upload: {
      // Public URLs keep a leading slash; private paths stay relative to cwd.
      path: root === "public" ? `/${subdir}/${diskName}` : relative,
      originalName,
      mime,
      size: outBuffer.byteLength,
      diskName,
    },
  };
}

/** Persist a CmsMedia library row for a stored CMS upload (best-effort). */
export async function registerCmsMedia(
  upload: StoredUpload,
  extra?: { alt?: string; caption?: string },
) {
  try {
    const { cmsDb } = await import("@/lib/cms/queries");
    const db = await cmsDb();
    await db.cmsMedia.create({
      data: {
        filename: upload.originalName,
        path: upload.path,
        alt: extra?.alt ?? "",
        caption: extra?.caption ?? "",
        mime: upload.mime,
        size: upload.size,
      },
    });
  } catch {
    // File is on disk even if the media library row cannot be written.
  }
}

/**
 * Standard CMS image save: validate → WebP encode → disk → CmsMedia row.
 * Used by page editors and media library uploads.
 */
export async function storeCmsImageUpload(
  file: File,
  options: {
    allowedExt: Set<string>;
    maxBytes: number;
    errorKey?: string;
  },
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const stored = await storePublicUpload(file, {
    subdir: "media/cms",
    allowedExt: options.allowedExt,
    maxBytes: options.maxBytes,
  });
  if (!stored.ok) return { ok: false, error: options.errorKey ?? "invalid_image" };
  await registerCmsMedia(stored.upload);
  return { ok: true, path: stored.upload.path };
}
