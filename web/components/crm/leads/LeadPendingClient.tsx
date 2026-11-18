"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { LeadPendingRail } from "@/components/crm/leads/LeadPendingRail";
import type {
  PendingReason,
  PendingReasonStat,
  PendingScope,
  PendingScopeStat,
} from "@/components/crm/leads/lead-pending-types";

function pendingHref(
  patch: { scope?: PendingScope; reason?: PendingReason | "" },
  searchParams: URLSearchParams,
) {
  const next = new URLSearchParams();
  next.set("view", "pending");
  const scope = patch.scope ?? (searchParams.get("scope") as PendingScope | null) ?? "all";
  const reason =
    patch.reason !== undefined ? patch.reason : (searchParams.get("reason") ?? "");
  if (scope && scope !== "all") next.set("scope", scope);
  if (reason) next.set("reason", reason);
  const q = searchParams.get("q");
  const stageId = searchParams.get("stageId");
  const ownerId = searchParams.get("ownerId");
  const sort = searchParams.get("sort");
  if (q) next.set("q", q);
  if (stageId) next.set("stageId", stageId);
  if (ownerId) next.set("ownerId", ownerId);
  if (sort) next.set("sort", sort);
  return `/crm/leads?${next.toString()}`;
}

export function LeadPendingClient({
  scopes,
  reasons,
  scope,
  reason,
  children,
}: {
  scopes: PendingScopeStat[];
  reasons: PendingReasonStat[];
  scope: PendingScope;
  reason: PendingReason | "";
  children: ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div style={{ display: "grid", gap: "clamp(0.9rem, 1.6vw, 1.25rem)", width: "100%", minWidth: 0 }}>
      <LeadPendingRail
        scopes={scopes}
        reasons={reasons}
        scope={scope}
        reason={reason}
        onScope={(next) => {
          router.push(pendingHref({ scope: next, reason }, new URLSearchParams(searchParams.toString())));
        }}
        onReason={(next) => {
          router.push(pendingHref({ scope, reason: next }, new URLSearchParams(searchParams.toString())));
        }}
      />
      {children}
    </div>
  );
}
