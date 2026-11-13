import { useEffect, useRef, useState } from "react";
import { FiGrid, FiLogIn, FiMenu, FiX } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { dashboardPath, useSession } from "../auth/session";
import { stripLang } from "../../i18n/config";
import { Link } from "../../i18n/Link";
import { useLang } from "../../i18n/LangContext";
import { useSite } from "../../i18n/useData";
import Logo from "../../ui/Logo";
import SmartLink from "../../ui/SmartLink";
import LangSwitch from "./LangSwitch";
import ThemeSwitcher from "./ThemeSwitcher";

const AUTH_LOGIN = "/auth/login";

// «خدمات» در صفحه‌ی هاب و همه‌ی صفحه‌های خدمت (/services/... و /web-design/...) فعال است.
const inServices = (pathname) =>
  pathname.startsWith("/services/") || pathname.startsWith("/web-design/");

// «وبلاگ‌ها» در صفحه‌ی اصلی وبلاگ، دسته‌ها و مقاله‌ها (/blog/...) فعال است.
const inBlog = (pathname) => pathname.startsWith("/blog/");

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const area = useSession(); // null = وارد نشده
  const headerRef = useRef(null);
  const { pathname: rawPath } = useLocation();
  const pathname = stripLang(rawPath);
  const site = useSite();
  const { t, to } = useLang();
  const isActive = (href) =>
    href === pathname ||
    (href === "/services" && inServices(pathname)) ||
    (href === "/web-design" && pathname.startsWith("/web-design")) ||
    (href === "/blog" && inBlog(pathname));

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

    // کلیک یا لمس بیرون از منو و دکمه‌ی همبرگری، منو را می‌بندد.
    const onPointerDown = (e) => {
      if (e.target.closest('#mobile-menu, [aria-controls="mobile-menu"]')) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
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
            aria-label={t("منوی اصلی")}
            className="hidden items-center gap-1 md:flex"
          >
            {site.nav.map((item) => {
              if (item.items) {
                return (
                  <div key={item.href} className="group relative">
                    <SmartLink
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`relative inline-flex items-center gap-1 rounded-full px-2 py-2 text-sm font-bold transition-colors duration-200 after:absolute after:inset-x-2 lg:px-3 lg:after:inset-x-3 after:bottom-1 after:h-px after:origin-right after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100 ${
                        isActive(item.href)
                          ? "text-foreground after:scale-x-100"
                          : "text-muted after:scale-x-0"
                      }`}
                    >
                      {item.label}
                      <span aria-hidden="true" className="text-[10px]">▾</span>
                    </SmartLink>

                    <div className="pointer-events-none absolute left-0 top-full z-30 w-72 translate-y-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <ul className="mt-2 overflow-hidden rounded-2xl border border-border bg-surface/95 p-2 shadow-xl backdrop-blur-sm">
                        {item.items.map((subItem) => (
                          <li key={subItem.href}>
                            <SmartLink
                              href={subItem.href}
                              className="block rounded-xl px-3 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-foreground"
                            >
                              {subItem.label}
                            </SmartLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              }

              return (
                <SmartLink
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative rounded-full px-2 py-2 text-sm font-bold transition-colors duration-200 after:absolute after:inset-x-2 lg:px-3 lg:after:inset-x-3 after:bottom-1 after:h-px after:origin-right after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100 ${
                    isActive(item.href)
                      ? "text-foreground after:scale-x-100"
                      : "text-muted after:scale-x-0"
                  }`}
                >
                  {item.label}
                </SmartLink>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {area ? (
              <Link
                to={dashboardPath(area)}
                aria-label={t("ورود به داشبورد")}
                title={t("ورود به داشبورد")}
                className="inline-flex h-9 w-9 items-center justify-center gap-1.5 rounded-full bg-primary text-xs font-bold text-primary-foreground transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97] sm:h-10 sm:w-auto sm:px-4 sm:text-sm"
              >
                <FiGrid size={15} aria-hidden="true" />
                <span className="hidden sm:inline">{t("ورود به داشبورد")}</span>
              </Link>
            ) : (
              <a
                href={to(AUTH_LOGIN)}
                aria-label={t("ورود / ثبت‌نام")}
                title={t("ورود / ثبت‌نام")}
                className="inline-flex h-9 w-9 items-center justify-center gap-1.5 rounded-full bg-primary text-xs font-bold text-primary-foreground transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97] sm:h-10 sm:w-auto sm:px-4 sm:text-sm"
              >
                <FiLogIn size={15} aria-hidden="true" />
                <span className="hidden sm:inline">{t("ورود / ثبت‌نام")}</span>
              </a>
            )}

            <LangSwitch />
            <ThemeSwitcher />

            <button
              type="button"
              aria-label={open ? t("بستن منو") : t("باز کردن منو")}
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
            <nav aria-label={t("منوی موبایل")} className="flex flex-col">
              {site.nav.map((item) => {
                if (item.items) {
                  return (
                    <div key={item.href} className="rounded-2xl border border-border/70 bg-surface-2/70 p-2">
                      <SmartLink
                        href={item.href}
                        onClick={closeMenu}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={`block rounded-xl px-4 py-3 text-base font-bold transition-colors duration-200 hover:bg-surface ${
                          isActive(item.href) ? "bg-surface" : ""
                        }`}
                      >
                        {item.label}
                      </SmartLink>
                    </div>
                  );
                }

                return (
                  <SmartLink
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`rounded-2xl px-4 py-3 text-base font-bold transition-colors duration-200 hover:bg-surface-2 ${
                      isActive(item.href) ? "bg-surface-2" : ""
                    }`}
                  >
                    {item.label}
                  </SmartLink>
                );
              })}

              <SmartLink
                href={site.cta.href}
                onClick={closeMenu}
                className="mt-2 rounded-2xl bg-surface-2 px-4 py-3 text-center text-base font-bold transition-colors hover:bg-primary/10"
              >
                {site.cta.label}
              </SmartLink>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
