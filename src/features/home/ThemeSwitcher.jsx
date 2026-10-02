import { useEffect, useRef, useState } from "react";
import { FiDroplet, FiMoon, FiSun } from "react-icons/fi";
import { PALETTES } from "../../theme/palettes";
import { themeStore, useTheme } from "../../theme/themeStore";

export default function ThemeSwitcher() {
  const { theme, mode } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="sm:relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label="تغییر پالت رنگی و حالت نمایش"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-foreground transition-[border-color,background-color] duration-200 hover:border-primary/60 hover:bg-surface-2"
      >
        <FiDroplet size={18} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="تنظیمات ظاهر سایت"
          className="absolute inset-x-0 top-full z-50 mt-3 max-h-[calc(100vh-7rem)] origin-top animate-pop-in overflow-y-auto rounded-2xl border border-border bg-surface p-4 shadow-2xl shadow-primary/10 sm:inset-x-auto sm:left-0 sm:w-72 sm:origin-top-left"
        >
          <p className="pb-3 text-xs font-bold text-muted">پالت رنگی</p>
          <div className="grid grid-cols-3 gap-2">
            {PALETTES.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={theme === p.id}
                aria-label={`پالت ${p.label}`}
                title={p.label}
                onClick={() => themeStore.setTheme(p.id)}
                className={`grid h-11 place-items-center rounded-xl border transition-[border-color,background-color] duration-200 ${
                  theme === p.id
                    ? "border-primary bg-surface-2"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {/* این span پالت خودش را دارد، پس رنگ‌ها مستقل از Theme فعلی نمایش داده می‌شوند */}
                <span
                  data-theme={p.id}
                  data-mode={mode}
                  className="flex gap-0.5"
                >
                  <i className="h-4 w-4 rounded-full bg-primary" />
                  <i className="h-4 w-4 rounded-full bg-accent" />
                </span>
              </button>
            ))}
          </div>

          <p className="pb-3 pt-5 text-xs font-bold text-muted">حالت نمایش</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              aria-pressed={mode === "light"}
              onClick={() => themeStore.setMode("light")}
              className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-bold transition-[border-color,background-color,color] duration-200 ${
                mode === "light"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              <FiSun size={16} aria-hidden="true" />
              روشن
            </button>
            <button
              type="button"
              aria-pressed={mode === "dark"}
              onClick={() => themeStore.setMode("dark")}
              className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-bold transition-[border-color,background-color,color] duration-200 ${
                mode === "dark"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              <FiMoon size={16} aria-hidden="true" />
              تاریک
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
