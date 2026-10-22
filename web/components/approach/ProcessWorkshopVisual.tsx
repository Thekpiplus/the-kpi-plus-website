import { ApproachMediaFrame } from "@/components/approach/ApproachMediaFrame";

const DISPLAY = { width: 480, height: 320 } as const;
const SOURCE = { width: 1200, height: 800 } as const;

export function ProcessWorkshopVisual({
  src = "",
  alt = "Replace with real workshop / report review photo",
  label = "Replace with real workshop / report review photo",
  className = "",
}: {
  src?: string;
  alt?: string;
  label?: string;
  className?: string;
}) {
  // TODO: Insert a real 1200×800 workshop or report-review photo (3:2). Do not generate people, hotel rooms, or stock substitutes.
  return (
    <ApproachMediaFrame
      src={src}
      alt={alt}
      label={label}
      displayWidth={DISPLAY.width}
      displayHeight={DISPLAY.height}
      recommendedWidth={SOURCE.width}
      recommendedHeight={SOURCE.height}
      fit="cover"
      className={className}
    />
  );
}
