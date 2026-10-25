import { existsSync } from "fs";
import { join } from "path";
import { cache } from "react";
import { clientLogos, type ClientLogo } from "@/lib/clients";
import { canPublishClientLogo, CLIENT_LOGO_PLACEHOLDER, publicClientAlt, publicClientLabel } from "./client-logos";
import { listPublishedClientLogoRows } from "./client-logo-store";

/** Assets on disk that are not usable as logos (for example a solid black file). */
const UNUSABLE_LOGO_SRC = new Set(["/brand/clients/casa-solana.webp"]);

function publicFileExists(src: string) {
  const next = src.trim();
  if (!next || next === CLIENT_LOGO_PLACEHOLDER || UNUSABLE_LOGO_SRC.has(next)) return false;
  try {
    return existsSync(join(process.cwd(), "public", next.replace(/^\//, "")));
  } catch {
    return false;
  }
}

export const loadPublishedClientLogos = cache(async (): Promise<ClientLogo[]> => {
  try {
    const rows = await listPublishedClientLogoRows();
    return rows
      .filter((row) => canPublishClientLogo(row) && publicFileExists(row.filePath))
      .map((row) => ({
        name: publicClientLabel(row),
        src: row.filePath,
        alt: publicClientAlt(row),
        canPublish: true,
      }));
  } catch {
    return [];
  }
});

/** Approved CMS logos first; otherwise official brand-pack files that exist on disk. */
export const loadVisibleClientLogos = cache(async (): Promise<ClientLogo[]> => {
  const published = await loadPublishedClientLogos();
  if (published.length) return published;
  return clientLogos.filter((logo) => publicFileExists(logo.src));
});
