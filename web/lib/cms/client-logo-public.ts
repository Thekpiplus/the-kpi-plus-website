import { existsSync } from "fs";
import { join } from "path";
import { cache } from "react";
import { clientLogos, type ClientLogo } from "@/lib/clients";
import {
  canPublishClientLogo,
  CLIENT_LOGO_PLACEHOLDER,
  normalizeWebsiteUrl,
  publicClientAlt,
  publicClientLabel,
} from "./client-logos";
import { listPublishedClientLogoRows } from "./client-logo-store";

/** Assets on disk that are not usable as logos (for example a solid black file). */
const UNUSABLE_LOGO_SRC = new Set(["/brand/clients/casa-solana.webp"]);

function publicFileExists(src: string) {
  const next = src.trim();
  if (!next || next === CLIENT_LOGO_PLACEHOLDER || UNUSABLE_LOGO_SRC.has(next)) return false;
  // CMS uploads are authoritative in the database; trust /media/cms paths even when
  // the deploy layout makes a local public/ existsSync check unreliable.
  if (next.startsWith("/media/cms/")) return true;
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
      .map((row) => {
        const website = normalizeWebsiteUrl(row.websiteUrl ?? "");
        return {
          name: publicClientLabel(row),
          src: row.filePath,
          alt: publicClientAlt(row),
          href: website.ok && website.url ? website.url : undefined,
          canPublish: true,
        };
      });
  } catch {
    return [];
  }
});

/** Prefer CMS admin logos; fall back to brand-pack files only when CMS has none. */
export const loadVisibleClientLogos = cache(async (): Promise<ClientLogo[]> => {
  const published = await loadPublishedClientLogos();
  if (published.length) return published;
  return clientLogos.filter((logo) => publicFileExists(logo.src));
});
