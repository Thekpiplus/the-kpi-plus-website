import { cache } from "react";
import { getSetting } from "@/lib/cms/queries";
import { normalizeGa4PropertyId, parseSiteGlobals } from "@/lib/site-globals";

export type Ga4CredentialStatus = {
  propertyId: string;
  hasCredentials: boolean;
  clientEmail: string;
};

function parseServiceAccountJson(): { client_email?: string; private_key?: string } | null {
  const raw = process.env.GA4_SERVICE_ACCOUNT_JSON?.trim() || process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { client_email?: string; private_key?: string };
    if (!parsed?.client_email || !parsed?.private_key) return null;
    return parsed;
  } catch {
    return null;
  }
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
