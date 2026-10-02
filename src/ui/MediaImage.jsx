// نمایش تصویر قابل‌جایگزین. اگر src نبود، Placeholder تمِ‌دار (با رنگ‌های Theme) نمایش داده می‌شود.
const ART = [
  "from-primary/30 via-secondary to-accent/20",
  "from-accent/30 via-secondary to-primary/20",
  "from-secondary via-primary/20 to-accent/30",
  "from-primary/20 via-accent/20 to-secondary",
];

export default function MediaImage({
  src,
  alt = "",
  label,
  variant = 0,
  priority = false,
  className = "",
  imgClassName = "",
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <div
          className={`relative h-full w-full bg-gradient-to-br ${ART[variant % ART.length]}`}
          role="img"
          aria-label={alt || label || "تصویر"}
        >
          <div className="absolute inset-0 bg-grid bg-[length:32px_32px] opacity-60" />
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <span className="rounded-2xl border border-border bg-surface/70 px-4 py-2 text-sm font-bold text-muted">
              {label || "تصویر"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
