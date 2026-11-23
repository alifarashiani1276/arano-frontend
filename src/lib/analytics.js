// Google Analytics 4 (gtag) + Consent Mode v2.
// - فقط در build تولید و فقط وقتی VITE_GA_ID تنظیم باشد فعال است (در dev هیچ چیزی ارسال نمی‌شود).
// - ذخیره‌ها (کوکی) تا قبل از رضایت کاربر «denied» هستند؛ بعد از «قبول» به «granted» تغییر می‌کنند.
// - اسکریپت gtag.js بعد از load صفحه و در زمان بیکاری مرورگر لود می‌شود تا LCP را کند نکند.

const GA_ID = import.meta.env.VITE_GA_ID;
const ENABLED = Boolean(import.meta.env.PROD && GA_ID);
const CONSENT_KEY = "arano_consent";

let started = false;

function readConsent() {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

const consentState = (value) => ({
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: value,
});

function gtag() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments); // eslint-disable-line prefer-rest-params
}

export const getConsent = readConsent;

export function startAnalytics() {
  if (!ENABLED || started || typeof window === "undefined") return;
  started = true;

  window.dataLayer = window.dataLayer || [];
  gtag("consent", "default", {
    ...consentState(readConsent() ?? "denied"),
    wait_for_update: 500,
  });
  gtag("js", new Date());
  gtag("config", GA_ID, {
    send_page_view: false, // page_view را خودمان در تغییر مسیر SPA می‌فرستیم
    ...(location.search.includes("ga_debug=1") ? { debug_mode: true } : {}),
  });

  const load = () => {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
  };
  const defer = () =>
    "requestIdleCallback" in window
      ? window.requestIdleCallback(load, { timeout: 3000 })
      : setTimeout(load, 1500);
  if (document.readyState === "complete") defer();
  else window.addEventListener("load", defer, { once: true });
}

export function setConsent(granted) {
  const value = granted ? "granted" : "denied";
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* ignore */
  }
  if (!ENABLED) return;
  startAnalytics();
  gtag("consent", "update", consentState(value));
}

export function trackPageView() {
  if (!ENABLED || !started) return;
  gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.search,
  });
}

export function trackEvent(name, params = {}) {
  if (!ENABLED || !started) return;
  gtag("event", name, params);
}
