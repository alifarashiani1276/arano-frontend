import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, THEME_IDS } from "./palettes";

// Store بیرون از React: تغییر Theme فقط attribute روی <html> را عوض می‌کند
// و فقط Componentهایی که useTheme صدا زده‌اند (ThemeSwitcher) Re-render می‌شوند.

// کلید v2: انتخاب‌های قدیمی ذخیره‌شده در مرورگرها نادیده گرفته می‌شود تا
// پالت پیش‌فرض (رنگ لوگو) برای همه اعمال شود.
const STORAGE_KEY = "arano:appearance:v2";
const MODES = ["light", "dark"];
const DEFAULT_MODE = "dark";
const listeners = new Set();

function readInitial() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    saved = {};
  }

  // پیش‌فرض: پالت «آرا نو» + حالت تاریک (رنگ لایم لوگو در حالت تاریک دقیقاً دیده می‌شود).
  // اگر کاربر خودش چیزی انتخاب کرده باشد همان نگه داشته می‌شود.
  return {
    theme: THEME_IDS.includes(saved.theme) ? saved.theme : DEFAULT_THEME,
    mode: MODES.includes(saved.mode) ? saved.mode : DEFAULT_MODE,
  };
}

function applyToDom({ theme, mode }) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.mode = mode;
  root.style.colorScheme = mode;
}

let state =
  typeof document === "undefined"
    ? { theme: DEFAULT_THEME, mode: DEFAULT_MODE }
    : readInitial();

if (typeof document !== "undefined") applyToDom(state);

function commit(next) {
  state = next;
  applyToDom(state);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((listener) => listener());
}

export const themeStore = {
  getSnapshot: () => state,
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setTheme(theme) {
    if (THEME_IDS.includes(theme) && theme !== state.theme) {
      commit({ ...state, theme });
    }
  },
  setMode(mode) {
    if (MODES.includes(mode) && mode !== state.mode) {
      commit({ ...state, mode });
    }
  },
};

export function useTheme() {
  return useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getSnapshot,
  );
}
