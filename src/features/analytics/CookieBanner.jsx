import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useLang } from "../../i18n/LangContext";
import { getConsent, setConsent } from "../../lib/analytics";

const TEXT = {
  fa: {
    msg: "برای بهبود تجربه‌ی شما و سنجش آمار بازدید از کوکی‌های تحلیلی استفاده می‌کنیم. هر زمان بخواهید می‌توانید آن را رد کنید.",
    accept: "قبول می‌کنم",
    reject: "رد می‌کنم",
    label: "رضایت کوکی",
  },
  en: {
    msg: "We use analytics cookies to improve your experience and measure site traffic. You can decline at any time.",
    accept: "Accept",
    reject: "Decline",
    label: "Cookie consent",
  },
};

export default function CookieBanner() {
  const { lang } = useLang();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(() => getConsent() === null);

  if (!open || /^\/(admin|dashboard)(\/|$)/.test(pathname)) return null;
  const t = TEXT[lang] ?? TEXT.fa;

  const choose = (granted) => {
    setConsent(granted);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-label={t.label}
      className="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-3"
    >
      <div className="flex w-full max-w-xl animate-pop-in flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-xl shadow-black/20 sm:flex-row sm:items-center">
        <p className="flex-1 text-xs leading-6 text-foreground">{t.msg}</p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose(true)}
            className="h-9 rounded-full bg-primary px-4 text-xs font-black text-primary-foreground transition-opacity duration-200 hover:opacity-90"
          >
            {t.accept}
          </button>
          <button
            type="button"
            onClick={() => choose(false)}
            className="h-9 rounded-full bg-surface-2 px-4 text-xs font-black text-foreground transition-colors duration-200 hover:bg-primary/10"
          >
            {t.reject}
          </button>
        </div>
      </div>
    </div>
  );
}
