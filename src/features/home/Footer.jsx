import { FiLock } from "react-icons/fi";
import { Link } from "../../i18n/Link";
import { useLang } from "../../i18n/LangContext";
import { useSite } from "../../i18n/useData";
import Icon from "../../ui/Icon";
import Logo from "../../ui/Logo";
import FloatingContact from "./FloatingContact";
import SmartLink from "../../ui/SmartLink";

export default function Footer() {
  const site = useSite();
  const { t } = useLang();
  return (
    <footer className="relative overflow-hidden border-t border-border pb-16">
      <div className="mx-auto max-w-6xl px-5 pt-16">
        <p className="max-w-xl text-3xl font-black leading-[1.5] md:text-5xl">
          {site.footer.slogan}
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-8">
          <Logo />

          <nav aria-label={t("منوی پایین سایت")}>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <SmartLink
                    href={item.href}
                    className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
                  >
                    {item.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex items-center gap-2">
            {site.socials.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted transition-[color,border-color] duration-200 hover:border-primary hover:text-primary"
                >
                  <Icon name={social.icon} size={17} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border py-6 text-xs text-muted">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p>{site.footer.copyright}</p>
            <Link
              to="/terms"
              className="transition-colors duration-200 hover:text-foreground"
            >
              {t("قوانین و مقررات")}
            </Link>
          </div>

          {/* نماد اعتماد الکترونیکی (اینماد): کد را بدون تغییر نگه دارید */}
          <div className="rounded-lg bg-white p-1.5">
            {/* eslint-disable-next-line react/jsx-no-target-blank -- کد اینماد بدون تغییر؛ referrerPolicy لازم است */}
            <a
              referrerPolicy="origin"
              target="_blank"
              href={
                "https://trustseal.enamad.ir/?id=8145429&Code=abiQkKGbrvskYy3SnKqYmlQXxUWDcj8M"
              }
            >
              <img
                referrerPolicy="origin"
                src={
                  "https://trustseal.enamad.ir/logo.aspx?id=8145429&Code=abiQkKGbrvskYy3SnKqYmlQXxUWDcj8M"
                }
                alt=""
                style={{ cursor: "pointer" }}
                code="abiQkKGbrvskYy3SnKqYmlQXxUWDcj8M"
              />
            </a>
          </div>

          {/* ورود مدیران: عمداً کم‌رنگ و در پایین‌ترین بخش سایت */}
          <Link
            to="/auth/admin"
            className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-foreground"
          >
            <FiLock size={13} aria-hidden="true" />
            {t("ورود مدیران")}
          </Link>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none select-none text-center text-[clamp(4.5rem,20vw,15rem)] font-black leading-[0.8] text-foreground/5"
      >
        {site.name}
      </p>
      {/* نوار تماس ثابت؛ در همه‌ی صفحه‌هایی که فوتر دارند (خانه، خدمات، وبلاگ، ...) نمایش داده می‌شود */}
      <FloatingContact />
    </footer>
  );
}
