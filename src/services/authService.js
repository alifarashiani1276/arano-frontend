import { api } from "../lib/api";
import { getSessionArea, session } from "../features/auth/session";
import { tokenStore } from "../features/auth/token";

// ---------------------------------------------------------------------------
// کاربران عادی (OTP)
// ---------------------------------------------------------------------------

export const sendOtp = (phone) =>
  api.post("/auth/send-otp", { phone }).then((response) => response.data);

export const verifyOtp = (phone, code) =>
  api
    .post("/auth/verify-otp", { phone, code })
    .then((response) => response.data);

// Backend برای کاربر `/me` و برای مدیر `/admin/me` دارد و شکل پاسخ‌ها فرق می‌کند:
// data.user  |  data.admin
export const getMe = () => {
  const isAdmin = getSessionArea(session.get()) === "admin";

  return isAdmin
    ? api.get("/admin/me").then((response) => response.data.data.admin)
    : api.get("/me").then((response) => response.data.data.user);
};

export const updateProfile = (payload) =>
  api.put("/profile", payload).then((response) => response.data.data.user);

// ---------------------------------------------------------------------------
// مدیران (OTP + رمز عبور)
// توابع زیر مستقیماً بخش `data` پاسخ Backend را برمی‌گردانند.
// ---------------------------------------------------------------------------

export const adminSendOtp = (phone) =>
  api.post("/admin/auth/send-otp", { phone }).then((response) => response.data);

// پاسخ: { setup_required, token?, token_expires_in? } یا
//        { setup_required: false, password_required, challenge_expires_in }
export const adminVerifyOtp = (phone, code) =>
  api
    .post("/admin/auth/verify-otp", { phone, code })
    .then((response) => response.data.data ?? {});

// پاسخ: { admin, token, token_expires_in }
export const adminLogin = (phone, password) =>
  api
    .post("/admin/auth/login", { phone, password })
    .then((response) => response.data.data ?? {});

// Setup Token فقط برای همین یک درخواست و به‌صورت صریح ارسال می‌شود.
// پاسخ: { admin, token, token_expires_in }
export const adminCompleteProfile = (payload, setupToken) =>
  api
    .post("/admin/auth/complete-profile", payload, {
      headers: { Authorization: `Bearer ${setupToken}` },
    })
    .then((response) => response.data.data ?? {});

// ---------------------------------------------------------------------------
// خروج (برای هر دو بخش)
// ---------------------------------------------------------------------------

export const logout = async () => {
  const current = session.get();
  const endpoint =
    current?.role === "ADMIN" || current?.role === "SUPER_ADMIN"
      ? "/admin/auth/logout"
      : "/auth/logout";

  try {
    const response = await api.post(endpoint);
    return response.data;
  } finally {
    tokenStore.clear();
    session.signOut();
  }
};
