import axios from "axios";
import { tokenStore } from "../features/auth/token";
import { getSessionArea, session } from "../features/auth/session";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Accept: "application/json",
  },
  timeout: 15000,
});

// درخواست‌های ورود/OTP/تکمیل پروفایل: ۴۰۱ آن‌ها یعنی «اطلاعات اشتباه است»
// و به معنی منقضی شدن نشست نیست.
const AUTH_ATTEMPT =
  /^\/(admin\/)?auth\/(send-otp|verify-otp|login|complete-profile)$/;

const isAuthAttempt = (config) => AUTH_ATTEMPT.test(config?.url ?? "");

const hasExplicitAuth = (headers) =>
  Boolean(headers?.get ? headers.get("Authorization") : headers?.Authorization);

// اضافه کردن Token به درخواست‌های احراز هویت‌شده
api.interceptors.request.use(
  (config) => {
    const token = tokenStore.get();

    // اگر Authorization صریحاً داده شده (مثل Setup Token مدیر) دست‌نخورده می‌ماند
    if (token && !hasExplicitAuth(config.headers)) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// مدیریت پاسخ‌های Backend
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const hasToken = Boolean(tokenStore.get());

    if (status === 401 && hasToken && !isAuthAttempt(error.config)) {
      // مدیر باید به صفحه‌ی ورود مدیر برگردد، نه ورود کاربران
      const loginPath =
        getSessionArea(session.get()) === "admin"
          ? "/auth/admin"
          : "/auth/login";

      tokenStore.clear();
      session.signOut();

      // اگر کاربر در یکی از صفحات Authentication است،
      // Redirect مجدد ایجاد نمی‌کنیم.
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/auth/")
      ) {
        window.location.assign(loginPath);
      }
    }

    return Promise.reject(error);
  },
);

export const statusOf = (error) => error.response?.status ?? 0;

// پیام مناسب برای نمایش به کاربر
export function apiMessage(
  error,
  fallback = "خطایی رخ داد. دوباره تلاش کنید.",
) {
  const response = error.response;

  // Backend اصلاً پاسخ نداده
  if (!response) {
    // خطای خود برنامه (نه شبکه) نباید به‌عنوان «قطع ارتباط» نمایش داده شود
    return error?.isAxiosError
      ? "ارتباط با سرور برقرار نشد."
      : "خطای غیرمنتظره‌ای در برنامه رخ داد. صفحه را رفرش کنید.";
  }

  // Rate Limit
  if (response.status === 429) {
    return "تعداد درخواست‌ها زیاد است. چند دقیقه دیگر دوباره تلاش کنید.";
  }

  // Server Error
  if (response.status >= 500) {
    return fallback;
  }

  // Validation Error
  // پیام‌های Laravel را مستقیماً به کاربر نمایش نمی‌دهیم.
  if (response.status === 422 && response.data?.errors) {
    return fallback;
  }

  return response.data?.message ?? fallback;
}
