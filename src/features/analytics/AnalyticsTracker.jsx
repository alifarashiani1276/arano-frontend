import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { stripLang } from "../../i18n/config";
import {
  startAnalytics,
  trackEvent,
  trackPageView,
} from "../../lib/analytics";

// داشبورد و پنل ادمین ردیابی نمی‌شوند (ترافیک داخلی تیم).
const isPrivate = (pathname) =>
  /^\/(admin|dashboard)(\/|$)/.test(pathname);

// رویدادهای lead با یک listener سراسری (بدون دست‌زدن به کامپوننت‌ها):
// تماس، واتساپ، تلگرام و کلیک روی لینک‌های «ارتباط/ثبت درخواست مشاوره».
function onClick(e) {
  const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
  if (!a || isPrivate(window.location.pathname)) return;
  const href = a.getAttribute("href") || "";

  if (href.startsWith("tel:")) {
    trackEvent("phone_click", { contact_method: "phone" });
  } else if (/wa\.me|whatsapp\.com/i.test(href)) {
    trackEvent("whatsapp_click", { contact_method: "whatsapp" });
  } else if (/t\.me|telegram\./i.test(href)) {
    trackEvent("telegram_click", { contact_method: "telegram" });
  } else {
    let url;
    try {
      url = new URL(href, window.location.origin);
    } catch {
      return;
    }
    if (
      url.origin === window.location.origin &&
      stripLang(url.pathname) === "/contact"
    ) {
      trackEvent("consultation_click", {
        link_text: (a.textContent || "").trim().slice(0, 60),
        page_path: window.location.pathname,
      });
    }
  }
}

export default function AnalyticsTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    startAnalytics();
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // یک page_view برای هر تغییر مسیر؛ کمی تأخیر تا Seo.jsx عنوان صفحه را ست کند.
  useEffect(() => {
    if (isPrivate(pathname)) return undefined;
    const id = setTimeout(trackPageView, 250);
    return () => clearTimeout(id);
  }, [pathname, search]);

  return null;
}
