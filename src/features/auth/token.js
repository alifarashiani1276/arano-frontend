// توکن ورود (Sanctum). فقط در localStorage نگه داشته می‌شود تا با رفرش صفحه نپرد.
// امنیت اصلی با CSP و بررسی سمت بک‌اند است؛ توکن را هیچ‌جا لاگ یا نمایش نده.
const KEY = "arano:token";

export const tokenStore = {
  get() {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      localStorage.setItem(KEY, token);
    } catch {
      /* حالت خصوصی مرورگر */
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* حالت خصوصی مرورگر */
    }
  },
};
