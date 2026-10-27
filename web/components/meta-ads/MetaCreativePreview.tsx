export function MetaCreativePreview({
  format,
  formatLabel,
  src,
  kind,
  alt,
}: {
  format: string;
  formatLabel: string;
  src?: string;
  kind?: string;
  alt?: string;
}) {
  const story = format === "story" || format === "reels";
  const ratio = story ? "9 / 16" : format === "carousel" ? "1 / 1" : "4 / 5";
  const media = src?.trim() || "";
  const isVideo = kind === "video" || /\.(mp4|webm|mov)(?:$|\?)/i.test(media);
  const width = story ? 59 : 72;
  const height = story ? 105 : format === "carousel" ? 72 : 90;

  return (
    <figure
      className={`ads-creative-preview is-${format || "image"}`}
      style={{
        position: "relative",
        width,
        minWidth: width,
        maxWidth: width,
        aspectRatio: ratio,
        overflow: "hidden",
        borderRadius: 10,
        background: "#0B1F33",
      }}
    >
      {media && isVideo ? (
        <video src={media} muted playsInline preload="metadata" aria-label={alt || formatLabel} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : media ? (
        <img
          src={media}
          alt={alt || formatLabel}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div className="ads-creative-preview__empty" aria-hidden="true" style={{ width: "100%", height: "100%", minHeight: 90, padding: 6, color: "#A2DC25", fontSize: 10, fontWeight: 800 }}>
          <span>{formatLabel || format || "Creative"}</span>
        </div>
      )}
      <figcaption>{formatLabel || format}</figcaption>
    </figure>
  );
}
