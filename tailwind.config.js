/** @type {import('tailwindcss').Config} */

import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";
import tailwindFormPlugin from "@tailwindcss/forms";
import { DEFAULT_THEME, PALETTES } from "./src/theme/palettes.js";

// رنگ‌ها فقط از CSS Variable خوانده می‌شوند (فرمت "r g b" برای پشتیبانی از opacity)
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

const toVars = (tokens) =>
  Object.fromEntries(
    Object.entries(tokens).map(([key, value]) => [
      `--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`,
      value,
    ]),
  );

// ساخت CSS Variable تمام پالت‌ها از روی src/theme/palettes.js
const themePlugin = plugin(({ addBase }) => {
  const base = {
    ":root": toVars(PALETTES.find((p) => p.id === DEFAULT_THEME).light),
  };

  for (const palette of PALETTES) {
    for (const mode of ["light", "dark"]) {
      // بدون :root تا هر المانی (مثل نمونه رنگ در ThemeSwitcher) بتواند پالت خودش را داشته باشد
      base[`[data-theme="${palette.id}"][data-mode="${mode}"]`] = toVars(
        palette[mode],
      );
    }
  }
  addBase(base);

  addBase({
    html: {
      scrollBehavior: "smooth",
      scrollPaddingTop: "6rem",
      WebkitTextSizeAdjust: "100%",
    },
    body: {
      backgroundColor: "rgb(var(--background))",
      color: "rgb(var(--foreground))",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
    ":focus-visible": {
      outline: "2px solid rgb(var(--primary))",
      outlineOffset: "2px",
    },
    "::selection": {
      backgroundColor: "rgb(var(--primary) / 0.28)",
    },
    "@media (prefers-reduced-motion: reduce)": {
      "*, *::before, *::after": {
        animationDuration: "0.01ms !important",
        animationIterationCount: "1 !important",
        transitionDuration: "0.01ms !important",
        scrollBehavior: "auto !important",
      },
    },
  });
});

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        background: token("background"),
        foreground: token("foreground"),
        primary: {
          DEFAULT: token("primary"),
          foreground: token("primary-foreground"),
        },
        secondary: token("secondary"),
        accent: token("accent"),
        muted: token("muted"),
        border: token("border"),
        surface: {
          DEFAULT: token("surface"),
          2: token("surface2"),
        },
      },
      borderColor: {
        DEFAULT: token("border"),
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgb(var(--border) / 0.7) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--border) / 0.7) 1px, transparent 1px)",
      },
      container: {
        center: true,
        padding: "1rem",
      },
      fontSize: {
        // مقیاس مینیمال (کوچک‌تر از پیش‌فرض Tailwind) + line-height مناسب فونت فارسی
        xs: ["0.6875rem", { lineHeight: "1.1rem" }], // 11px
        sm: ["0.8125rem", { lineHeight: "1.25rem" }], // 13px
        base: ["0.9375rem", { lineHeight: "1.5rem" }], // 15px
        lg: ["1rem", { lineHeight: "1.5rem" }], // 16px
        xl: ["1.0625rem", { lineHeight: "1.6rem" }], // 17px
        "2xl": ["1.25rem", { lineHeight: "1.9rem" }], // 20px
        "3xl": ["1.375rem", { lineHeight: "1.9" }], // 22px
        "4xl": ["1.75rem", { lineHeight: "1.4" }], // 28px
        "5xl": ["2.25rem", { lineHeight: "1.4" }], // 36px
        "6xl": ["2.75rem", { lineHeight: "1.4" }], // 44px
      },
      fontFamily: {
        sans: ["Vazir", ...fontFamily.sans],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      keyframes: {
        "line-up": {
          from: { transform: "translateY(110%)" },
          to: { transform: "translateY(0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          from: { opacity: "0", transform: "translateY(-6px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "line-up": "line-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-up": "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pop-in": "pop-in 0.16s ease-out both",
        marquee: "marquee 45s linear infinite",
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [
    themePlugin,
    tailwindFormPlugin({
      strategy: "class",
    }),
  ],
};
