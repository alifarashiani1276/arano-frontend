import { Link } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { site } from "../../config/site";
import Icon from "../../ui/Icon";
import Logo from "../../ui/Logo";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div className="mx-auto max-w-6xl px-5 pt-16">
        <p className="max-w-xl text-3xl font-black leading-[1.5] md:text-5xl">
          {site.footer.slogan}
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-8">
          <Logo />

          <nav aria-label="منوی پایین سایت">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex items-center gap-2">
            {site.socials.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
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
          <p>{site.footer.copyright}</p>

          {/* ورود مدیران: عمداً کم‌رنگ و در پایین‌ترین بخش سایت */}
          <Link
            to="/auth/admin"
            className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-foreground"
          >
            <FiLock size={13} aria-hidden="true" />
            ورود مدیران
          </Link>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none select-none text-center text-[clamp(4.5rem,20vw,15rem)] font-black leading-[0.8] text-foreground/5"
      >
        {site.name}
      </p>
    </footer>
  );
}
