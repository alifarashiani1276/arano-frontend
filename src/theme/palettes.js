// تنها منبع تعریف پالت‌ها.
// مقدارها به فرمت "R G B" هستند تا Tailwind بتواند opacity بدهد (bg-primary/20).
// هم tailwind.config.js و هم ThemeSwitcher از همین فایل استفاده می‌کنند.

// پایه‌ی خنثی (مشکی/خاکستری بدون رنگ) برای حالت تاریک همه‌ی پالت‌ها.
// در حالت تاریک فقط primary / primaryForeground / accent با پالت عوض می‌شوند.
const DARK_NEUTRAL = {
  background: "10 10 10",
  foreground: "236 236 236",
  secondary: "30 30 30",
  muted: "152 152 152",
  border: "40 40 40",
  surface: "18 18 18",
  surface2: "26 26 26",
};

// پالت پیش‌فرض = رنگ لوگوی آرا نو (وقتی کاربر برای اولین بار وارد می‌شود)
export const DEFAULT_THEME = "arano";

export const PALETTES = [
  {
    id: "arano",
    label: "آرا نو",
    // رنگ لوگو: #CCF802 (۲۰۴ ۲۴۸ ۲).
    // در حالت تاریک دقیقاً همین رنگ استفاده می‌شود؛ در حالت روشن، چون لایم روی
    // زمینه‌ی سفید خوانا نیست، همان رنگ کمی تیره‌تر (زیتونی) برای متن و دکمه‌ها
    // به کار می‌رود و رنگ اصلی لایم در پس‌زمینه‌ی آیکون‌ها و لوگو دیده می‌شود.
    light: {
      background: "250 251 244",
      foreground: "20 24 8",
      primary: "82 124 0",
      primaryForeground: "255 255 255",
      secondary: "234 246 186",
      accent: "15 118 110",
      muted: "98 106 78",
      border: "225 230 205",
      surface: "255 255 255",
      surface2: "243 247 226",
    },
    dark: {
      ...DARK_NEUTRAL,
      primary: "204 248 2",
      primaryForeground: "10 12 0",
      accent: "94 234 212",
    },
  },
  {
    id: "indigo",
    label: "نیلی",
    light: {
      background: "248 248 252",
      foreground: "22 24 40",
      primary: "88 90 214",
      primaryForeground: "255 255 255",
      secondary: "232 233 250",
      accent: "30 150 220",
      muted: "104 108 135",
      border: "223 225 240",
      surface: "255 255 255",
      surface2: "240 241 250",
    },
    dark: {
      ...DARK_NEUTRAL,
      primary: "140 143 255",
      primaryForeground: "14 15 30",
      accent: "90 190 250",
    },
  },
  {
    id: "emerald",
    label: "زمرد",
    light: {
      background: "246 250 248",
      foreground: "16 32 28",
      primary: "10 128 92",
      primaryForeground: "255 255 255",
      secondary: "224 243 236",
      accent: "40 150 175",
      muted: "94 118 110",
      border: "216 232 225",
      surface: "255 255 255",
      surface2: "236 246 241",
    },
    dark: {
      ...DARK_NEUTRAL,
      primary: "70 205 158",
      primaryForeground: "6 24 18",
      accent: "80 200 215",
    },
  },
  {
    id: "rose",
    label: "رز",
    light: {
      background: "252 248 249",
      foreground: "38 20 28",
      primary: "200 64 106",
      primaryForeground: "255 255 255",
      secondary: "250 228 236",
      accent: "224 120 70",
      muted: "130 100 112",
      border: "240 222 229",
      surface: "255 255 255",
      surface2: "248 238 242",
    },
    dark: {
      ...DARK_NEUTRAL,
      primary: "244 120 158",
      primaryForeground: "40 8 20",
      accent: "250 160 120",
    },
  },
  {
    id: "amber",
    label: "کهربا",
    light: {
      background: "251 249 244",
      foreground: "40 30 15",
      primary: "168 98 8",
      primaryForeground: "255 255 255",
      secondary: "248 236 208",
      accent: "50 135 110",
      muted: "120 104 80",
      border: "236 226 204",
      surface: "255 253 248",
      surface2: "246 240 226",
    },
    dark: {
      ...DARK_NEUTRAL,
      primary: "240 175 70",
      primaryForeground: "36 22 2",
      accent: "100 190 165",
    },
  },
  {
    id: "ocean",
    label: "اقیانوس",
    light: {
      background: "245 249 251",
      foreground: "12 30 40",
      primary: "10 120 160",
      primaryForeground: "255 255 255",
      secondary: "222 240 247",
      accent: "120 90 215",
      muted: "90 116 130",
      border: "214 231 238",
      surface: "255 255 255",
      surface2: "234 244 249",
    },
    dark: {
      ...DARK_NEUTRAL,
      primary: "80 200 235",
      primaryForeground: "4 22 32",
      accent: "170 140 250",
    },
  },
];

export const THEME_IDS = PALETTES.map((p) => p.id);