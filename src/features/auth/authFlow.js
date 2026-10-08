// وضعیت مراحل ورود/ثبت‌نام فقط در «حافظه‌ی صفحه» نگه داشته می‌شود
// (نه sessionStorage/localStorage)، تا با دست‌کاری Storage در DevTools
// نتوان مرحله‌ها را رد کرد و اطلاعات شخصی هم روی دستگاه باقی نماند.
//
// توجه: این فقط یک محافظ UI است. امنیت واقعی با Token و بررسی سمت بک‌اند
// (مثلاً Setup Token بعد از تأیید OTP) انجام می‌شود.

const TTL_MS = 15 * 60 * 1000;

let state = { phone: null, verified: false, expiresAt: 0 };

const alive = () => state.expiresAt > Date.now();

export const authFlow = {
  start(phone) {
    state = { phone, verified: false, expiresAt: Date.now() + TTL_MS };
  },
  getPhone() {
    return alive() ? state.phone : null;
  },
  hasPhone() {
    return alive() && Boolean(state.phone);
  },
  markVerified() {
    if (this.hasPhone()) {
      state.verified = true;
      state.expiresAt = Date.now() + TTL_MS;
    }
  },
  isVerified() {
    return this.hasPhone() && state.verified;
  },
  reset() {
    state = { phone: null, verified: false, expiresAt: 0 };
  },
};
