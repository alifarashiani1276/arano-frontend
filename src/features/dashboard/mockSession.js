import { useSyncExternalStore } from "react";
import { ROLES } from "../../data/dashboard";

// نقش فعلی فقط برای پیش‌نمایش UI است (بدون احراز هویت واقعی).
// بعد از اتصال بک‌اند، این فایل با نقش واقعی کاربر (از Token/پروفایل) جایگزین می‌شود.
let adminRole = ROLES.SUPER_ADMIN;
const listeners = new Set();

export const mockSession = {
  getAdminRole: () => adminRole,
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  setAdminRole(role) {
    if (role === adminRole) return;
    adminRole = role;
    listeners.forEach((fn) => fn());
  },
};

export function useAdminRole() {
  return useSyncExternalStore(
    mockSession.subscribe,
    mockSession.getAdminRole,
    mockSession.getAdminRole,
  );
}
