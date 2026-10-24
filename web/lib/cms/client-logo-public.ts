import { cache } from "react";
import type { ClientLogo } from "@/lib/clients";
import { canPublishClientLogo, publicClientAlt, publicClientLabel } from "./client-logos";
import { listPublishedClientLogoRows } from "./client-logo-store";

export const loadPublishedClientLogos = cache(async (): Promise<ClientLogo[]> => {
  try {
    const rows = await listPublishedClientLogoRows();
    return rows
      .filter((row) => canPublishClientLogo(row))
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
