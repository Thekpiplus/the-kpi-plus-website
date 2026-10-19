"use client";

import { useState } from "react";

export function CopyPathButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(path);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className="crm-cms-media-copy" onClick={copy} title={path}>
      <span className="crm-cms-media-copy-path">{path}</span>
      <span className="crm-cms-media-copy-action">{copied ? "คัดลอกแล้ว" : "คัดลอก"}</span>
    </button>
  );
}
