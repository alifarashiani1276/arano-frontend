import { useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { site } from "../../config/site";
import Logo from "../../ui/Logo";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const el = headerRef.current;
    if (el) {
      el.dataset.menu = open ? "open" : "closed";
      if (open) el.dataset.hidden = "false";
    }
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <div
        aria-hidden="true"
        data-scroll-progress
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-right scale-x-0 bg-primary will-change-transform"
      />

      <header
        ref={headerRef}
        data-nav
        className="fixed inset-x-0 top-3 z-40 px-3 transition-transform duration-500 ease-out data-[hidden=true]:-translate-y-28 md:top-5"
      >
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-border bg-surface/80 px-3 py-2 backdrop-blur-md">
          <Logo />

          <nav
            aria-label="منوی اصلی"
            className="hidden items-center gap-1 md:flex"
          >
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative rounded-full px-3 py-2 text-sm font-bold text-muted transition-colors duration-200 after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <a
              href={site.cta.href}
              className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97] sm:inline-flex"
            >
              {site.cta.label}
            </a>
            <button
              type="button"
              aria-label={open ? "بستن منو" : "باز کردن منو"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface md:hidden"
            >
              {open ? (
                <FiX size={18} aria-hidden="true" />
              ) : (
                <FiMenu size={18} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {open && (
          <div
            id="mobile-menu"
            className="mx-auto mt-2 max-w-6xl animate-pop-in rounded-3xl border border-border bg-surface p-3 md:hidden"
          >
            <nav aria-label="منوی موبایل" className="flex flex-col">
              {site.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base font-bold transition-colors duration-200 hover:bg-surface-2"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={site.cta.href}
                onClick={() => setOpen(false)}
                className="mt-2 rounded-2xl bg-primary px-4 py-3 text-center text-base font-bold text-primary-foreground"
              >
                {site.cta.label}
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
