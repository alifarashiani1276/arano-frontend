import { useSyncExternalStore } from "react";

const KEY = "arano:auth-user";
const listeners = new Set();

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;

    const user = JSON.parse(raw);
    return user && typeof user === "object" ? user : null;
  } catch {
    return null;
  }
};

let currentUser = typeof window === "undefined" ? null : read();

const emit = () => listeners.forEach((listener) => listener());

const persist = (user) => {
  try {
    if (user) {
      localStorage.setItem(KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEY);
    }
  } catch {
    // Storage may be unavailable in private browsing.
  }
};

const normalizeUser = (user) => {
  if (!user || typeof user !== "object") return null;

  const profileCompleted =
    user.profile_completed ??
    Boolean(user.first_name && user.last_name && user.email);

  return {
    id: user.id ?? null,
    phone: user.phone ?? "",
    first_name: user.first_name ?? "",
    last_name: user.last_name ?? "",
    email: user.email ?? "",
    bio: user.bio ?? "",
    role: user.role ?? "USER",
    status: user.status ?? "PENDING",
    is_active: user.is_active ?? true,
    profile_completed: Boolean(profileCompleted),
  };
};

export const session = {
  get: () => currentUser,

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setUser(user) {
    const next = normalizeUser(user);
    currentUser = next;
    persist(next);
    emit();
  },

  updateUser(patch) {
    if (!currentUser) return;
    session.setUser({ ...currentUser, ...patch });
  },

  signIn(area) {
    if (currentUser) return;

    session.setUser({
      id: null,
      role: area === "admin" ? "ADMIN" : "USER",
      status: "APPROVED",
      is_active: true,
      profile_completed: true,
    });
  },

  signOut() {
    currentUser = null;
    persist(null);
    emit();
  },
};

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === KEY) {
      currentUser = read();
      emit();
    }
  });
}

export const useSession = () =>
  useSyncExternalStore(session.subscribe, session.get, () => null);

export const getSessionArea = (user) => {
  if (!user) return null;

  return user.role === "ADMIN" || user.role === "SUPER_ADMIN"
    ? "admin"
    : "user";
};

export const dashboardPath = (userOrArea) => {
  const area =
    typeof userOrArea === "string" ? userOrArea : getSessionArea(userOrArea);

  return area === "admin" ? "/admin" : "/dashboard";
};
