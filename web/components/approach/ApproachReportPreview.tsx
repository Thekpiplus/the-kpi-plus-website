import { ApproachMediaFrame } from "@/components/approach/ApproachMediaFrame";

const DISPLAY = { width: 360, height: 240 } as const;
const SOURCE = { width: 1200, height: 800 } as const;

export function ApproachReportPreview({
  src = "",
  alt = "ตัวอย่าง Report",
  label = "ตัวอย่าง Report",
  className = "",
}: {
  src?: string;
  alt?: string;
  label?: string;
  className?: string;
}) {
  // TODO: Insert a verified 1200×800 report screenshot (3:2, object-fit contain). Blur or omit any client name, hotel name, or unpublished metric before use.
  return (
    <ApproachMediaFrame
      src={src}
      alt={alt}
      label={label}
      displayWidth={DISPLAY.width}
      displayHeight={DISPLAY.height}
      recommendedWidth={SOURCE.width}
      recommendedHeight={SOURCE.height}
      fit="contain"
      className={className}
    >
      <svg viewBox="0 0 360 240" width={DISPLAY.width} height={DISPLAY.height} aria-hidden="true">
        <rect width="360" height="240" fill="#F4F4F4" />
        <rect x="28" y="20" width="304" height="200" fill="#FFFFFF" stroke="#E3E8EB" />
        <rect x="28" y="20" width="8" height="200" fill="#0B6660" />
        <rect x="52" y="40" width="120" height="8" fill="#0B1F33" />
        <rect x="52" y="58" width="88" height="6" fill="#E3E8EB" />
        <rect x="52" y="88" width="256" height="5" fill="#F4F4F4" />
        <rect x="52" y="102" width="232" height="5" fill="#F4F4F4" />
        <rect x="52" y="116" width="248" height="5" fill="#F4F4F4" />
        <rect x="52" y="140" width="72" height="48" fill="#F4F4F4" stroke="#E3E8EB" />
        <rect x="136" y="140" width="72" height="48" fill="#F4F4F4" stroke="#E3E8EB" />
        <rect x="220" y="140" width="88" height="48" fill="#F2F8E2" stroke="#E3E8EB" />
      </svg>
    </ApproachMediaFrame>
  );
}
