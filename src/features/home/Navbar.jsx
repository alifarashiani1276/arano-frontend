import { useEffect, useRef, useState } from "react";
import { FiLogIn, FiMenu, FiUserPlus, FiX } from "react-icons/fi";
import { site } from "../../config/site";
import Logo from "../../ui/Logo";
import ThemeSwitcher from "./ThemeSwitcher";

const AUTH_LOGIN = "/auth/login";
const AUTH_REGISTER = "/auth/login";

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

  const closeMenu = () => setOpen(false);

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
        className="fixed inset-x-0 top-3 z-40 px-2 transition-transform duration-500 ease-out data-[hidden=true]:-translate-y-28 sm:px-3 md:top-5"
      >
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full border border-border bg-surface/80 px-2 py-2 backdrop-blur-md sm:gap-3 sm:px-3">
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

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <a
                href={AUTH_LOGIN}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 text-xs font-bold text-foreground transition-[background-color,transform,border-color] duration-200 hover:border-primary hover:bg-primary/10 active:scale-[0.97] sm:h-10 sm:px-4 sm:text-sm"
              >
                <FiLogIn
                  className="hidden sm:block"
                  size={15}
                  aria-hidden="true"
                />
                ورود
              </a>
              <a
                href={AUTH_REGISTER}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary px-3 text-xs font-bold text-primary-foreground transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97] sm:h-10 sm:px-4 sm:text-sm"
              >
                <FiUserPlus
                  className="hidden sm:block"
                  size={15}
                  aria-hidden="true"
                />
                ثبت‌نام
              </a>
            </div>

            <ThemeSwitcher />

            <button
              type="button"
              aria-label={open ? "بستن منو" : "باز کردن منو"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-surface md:hidden sm:h-10 sm:w-10"
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
            className="mx-auto mt-2 max-w-6xl animate-pop-in rounded-3xl border border-border bg-surface p-3 shadow-lg md:hidden"
          >
            <nav aria-label="منوی موبایل" className="flex flex-col">
              {site.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-2xl px-4 py-3 text-base font-bold transition-colors duration-200 hover:bg-surface-2"
                >
                  {item.label}
                </a>
              ))}

              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
                <a
                  href={AUTH_LOGIN}
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary hover:bg-primary/10"
                >
                  <FiLogIn size={16} aria-hidden="true" />
                  ورود
                </a>
                <a
                  href={AUTH_REGISTER}
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <FiUserPlus size={16} aria-hidden="true" />
                  ثبت‌نام
                </a>
              </div>

              <a
                href={site.cta.href}
                onClick={closeMenu}
                className="mt-2 rounded-2xl bg-surface-2 px-4 py-3 text-center text-base font-bold transition-colors hover:bg-primary/10"
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
