import { FiEdit3, FiPhoneCall } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { stripLang } from "../../i18n/config";
import { Link } from "../../i18n/Link";
import { useLang } from "../../i18n/LangContext";
import { useSite } from "../../i18n/useData";

// نوار تماس ثابت پایین صفحه (position: fixed): هنگام اسکرول همیشه همان‌جا می‌ماند.
// دسکتاپ: «ثبت درخواست مشاوره» + شماره‌ی تماس. موبایل: یک قرص کوچک مینیمال با جمله‌ی ترغیبی که به صفحه‌ی ارتباط با ما می‌رود.
// شماره از src/config/site.js (آیتم phone در contact.items) خوانده می‌شود.

// شماره‌ای که در نوار نمایش داده می‌شود (باید یکی از شماره‌های contact.items در site.js باشد)
const PREFERRED_PHONE = "09105008864";

// 09105008864 -> 0910 500 8864
const pretty = (value = "") =>
  /^\d{11}$/.test(value)
    ? `${value.slice(0, 4)} ${value.slice(4, 7)} ${value.slice(7)}`
    : value;

export default function FloatingContact() {
  const site = useSite();
  const { t } = useLang();
  const { pathname } = useLocation();

  const phoneValues =
    site.contact.items.find((item) => item.icon === "phone")?.values ?? [];
  const phone =
    phoneValues.find((item) => item.value === PREFERRED_PHONE) ??
    phoneValues[0];
  // در صفحه‌ی «ارتباط با ما» لازم نیست (خود صفحه فرم و شماره دارد)
  if (!phone || stripLang(pathname) === "/contact") return null;

  return (
    <aside
      aria-label={t("تماس سریع با ما")}
      className="pointer-events-none fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 flex justify-center px-3"
    >
      {/* دسکتاپ و تبلت */}
      <div className="pointer-events-auto hidden animate-pop-in items-center gap-1.5 rounded-full border border-border bg-surface/90 p-1.5 shadow-xl shadow-black/20 backdrop-blur-md sm:flex">
        <Link
          to="/contact"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
        >
          <FiEdit3 size={16} aria-hidden="true" />
          {t("ثبت درخواست مشاوره")}
        </Link>
        <a
          href={phone.href}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-surface-2 px-4 text-sm font-black text-foreground transition-colors duration-200 hover:bg-primary/10"
        >
          <FiPhoneCall size={16} aria-hidden="true" className="text-primary" />
          <span dir="ltr">{pretty(phone.value)}</span>
        </a>
      </div>

      {/* موبایل: مینیمال و کوچک؛ آیکون + یک جمله‌ی ترغیبی. با لمس، به صفحه‌ی «ارتباط با ما» می‌رود */}
      <Link
        to="/contact"
        aria-label={t("نیاز به راهنمایی دارید؟")}
        className="pointer-events-auto inline-flex h-10 max-w-full animate-pop-in items-center gap-2 rounded-full border border-border bg-surface/90 p-1 pe-4 shadow-lg shadow-black/20 backdrop-blur-md transition-transform duration-200 active:scale-[0.97] sm:hidden"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <FiPhoneCall size={14} aria-hidden="true" />
        </span>
        <span className="min-w-0 truncate text-xs font-bold">
          {t("نیاز به راهنمایی دارید؟")}
        </span>
      </Link>
    </aside>
  );
}
