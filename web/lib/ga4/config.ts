import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { getSetting } from "@/lib/cms/queries";
import { normalizeGa4PropertyId, parseSiteGlobals } from "@/lib/site-globals";

export type Ga4CredentialStatus = {
  propertyId: string;
  hasCredentials: boolean;
  clientEmail: string;
};

type ServiceAccountJson = {
  client_email?: string;
  private_key?: string;
};

function tryParseServiceAccount(raw: string): ServiceAccountJson | null {
  const value = raw.trim();
  if (!value) return null;

  const attempts = [
    value,
    value.replace(/\\"/g, '"').replace(/\\\\n/g, "\\n"),
  ];

  // Some .env loaders leave a JSON string double-encoded.
  if (value.startsWith("{") || value.startsWith('"')) {
    attempts.push(value.replace(/^"|"$/g, "").replace(/\\"/g, '"'));
  }

  for (const candidate of attempts) {
    try {
      const parsed = JSON.parse(candidate) as ServiceAccountJson | string;
      if (typeof parsed === "string") {
        const nested = JSON.parse(parsed) as ServiceAccountJson;
        if (nested?.client_email && nested?.private_key) return nested;
        continue;
      }
      if (parsed?.client_email && parsed?.private_key) return parsed;
    } catch {
      // try next
    }
  }
  return null;
}

function readServiceAccountFile(): ServiceAccountJson | null {
  const configured = process.env.GA4_SERVICE_ACCOUNT_FILE?.trim();
  const candidates = [
    configured,
    path.join(process.cwd(), ".ga4-service-account.json"),
    path.join(process.cwd(), "ga4-service-account.json"),
  ].filter(Boolean) as string[];

  for (const filePath of candidates) {
    try {
      if (!existsSync(filePath)) continue;
      const parsed = tryParseServiceAccount(readFileSync(filePath, "utf8"));
      if (parsed) return parsed;
    } catch {
      // try next
    }
  }
  return null;
}

function parseServiceAccountJson(): ServiceAccountJson | null {
  const raw = process.env.GA4_SERVICE_ACCOUNT_JSON?.trim() || process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (raw) {
    const parsed = tryParseServiceAccount(raw);
    if (parsed) return parsed;
  }
  return readServiceAccountFile();
}

export function ga4ServiceAccount() {
  const parsed = parseServiceAccountJson();
  if (!parsed?.client_email || !parsed?.private_key) return null;
  return {
    clientEmail: parsed.client_email,
    privateKey: parsed.private_key.replace(/\\n/g, "\n"),
  };
}

export const getGa4Config = cache(async (): Promise<Ga4CredentialStatus> => {
  let propertyId = "";
  try {
    propertyId = normalizeGa4PropertyId(parseSiteGlobals((await getSetting("site"))?.value).ga4PropertyId);
  } catch {
    propertyId = "";
  }
  if (!propertyId) {
    propertyId = normalizeGa4PropertyId(process.env.GA4_PROPERTY_ID);
  }
  const account = ga4ServiceAccount();
  return {
    propertyId,
    hasCredentials: Boolean(account),
    clientEmail: account?.clientEmail ?? "",
  };
});
