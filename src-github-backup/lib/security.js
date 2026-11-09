// ابزارهای امنیتی مشترک فرم‌ها (فقط سمت کلاینت).
// نکته‌ی مهم: این‌ها فقط «سد اول» هستند و جایگزین اعتبارسنجی، Rate Limit و
// Escape کردن خروجی در بک‌اند نیستند. بک‌اند باید همین قواعد را دوباره اعمال کند.

// ---------- تبدیل و پاک‌سازی متن ----------

// اعداد فارسی و عربی را به انگلیسی تبدیل می‌کند
export function normalizeDigits(value) {
  return String(value ?? "")
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

// کاراکترهای نامرئی و کنترل جهت متن (بدون نیم‌فاصله‌ی \u200c که در فارسی لازم است)
const INVISIBLE =
  /[\u200B\u200E\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF]/g;

// کاراکترهای کنترلی (به‌جز Tab و Enter) را حذف می‌کند
function stripControls(text) {
  let out = "";
  for (const ch of text) {
    const code = ch.codePointAt(0);
    const isControl =
      (code < 32 && code !== 9 && code !== 10 && code !== 13) ||
      (code >= 127 && code <= 159);
    if (!isControl) out += ch;
  }
  return out;
}

// متن ورودی را تمیز می‌کند: یکسان‌سازی یونیکد، حذف کاراکترهای نامرئی/کنترلی
// (مثل RLO که برای فریب نمایش متن استفاده می‌شود) و فاصله‌های اضافه.
export function sanitizeText(value, { multiline = false } = {}) {
  let text = stripControls(String(value ?? "").normalize("NFC")).replace(
    INVISIBLE,
    "",
  );
  text = text.replace(/\r\n?/g, "\n");

  if (multiline) {
    text = text
      .replace(/[ \t]+/g, " ")
      .replace(/ ?\n ?/g, "\n")
      .replace(/\n{3,}/g, "\n\n");
  } else {
    text = text.replace(/\s+/g, " ");
  }
  return text.trim();
}

// ---------- شماره تلفن ----------

// فاصله و خط‌تیره را حذف و پیش‌شماره ایران را به 0 تبدیل می‌کند
export function normalizePhone(raw) {
  let value = normalizeDigits(sanitizeText(raw)).replace(/[\s\-()]/g, "");
  if (value.startsWith("+98")) value = `0${value.slice(3)}`;
  else if (value.startsWith("0098")) value = `0${value.slice(4)}`;
  else if (value.startsWith("98") && value.length === 12)
    value = `0${value.slice(2)}`;
  return value;
}

// فقط موبایل (برای ورود)  |  موبایل یا ثابت (برای فرم تماس)
export const MOBILE_REGEX = /^09\d{9}$/;
export const PHONE_REGEX = /^(09\d{9}|0[1-8]\d{9})$/;

// 09123456789 -> 0912***6789
export function maskPhone(phone) {
  return MOBILE_REGEX.test(phone)
    ? `${phone.slice(0, 4)}***${phone.slice(7)}`
    : "شماره‌ی شما";
}

// ---------- اعتبارسنجی فیلدها ----------
// هر تابع { value, error } برمی‌گرداند. error یک «کد» است (نه متن) تا هر فرم
// پیام فارسی خودش را نشان بدهد: required | tooLong | tooShort | invalid | markup | links

const NAME_CHARS = /^[\p{Script=Arabic}A-Za-z\s\u200c]+$/u;

export function validateName(raw, { min = 2, max = 60 } = {}) {
  const value = sanitizeText(raw);
  if (!value) return { value, error: "required" };
  if (value.length > max) return { value, error: "tooLong" };
  const letters = (value.match(/\p{L}/gu) || []).length;
  if (value.length < min || letters < 2 || !NAME_CHARS.test(value))
    return { value, error: "invalid" };
  return { value, error: "" };
}

export function validateEmail(raw, { required = true } = {}) {
  const value = sanitizeText(raw).toLowerCase();
  if (!value) return { value, error: required ? "required" : "" };
  if (value.length > 254) return { value, error: "tooLong" };

  const parts = value.split("@");
  if (parts.length !== 2) return { value, error: "invalid" };
  const [local, domain] = parts;

  const localOk =
    local.length > 0 &&
    local.length <= 64 &&
    /^[a-z0-9.!#$%&'*+=?^_{|}~-]+$/.test(local) &&
    !local.startsWith(".") &&
    !local.endsWith(".") &&
    !local.includes("..");
  const domainOk =
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/.test(domain);

  return { value, error: localOk && domainOk ? "" : "invalid" };
}

// تگ HTML، اسکریپت و الگوهای تزریق ساده
const MARKUP =
  /<\s*\/?\s*[a-z!?][^>]*>|javascript\s*:|data\s*:\s*text\/html|\bon[a-z]+\s*=\s*["']/i;
const LINK = /(?:https?:\/\/|www\.)\S+/gi;

export function validateMessage(
  raw,
  { min = 10, max = 1000, maxLinks = 2, required = true } = {},
) {
  const value = sanitizeText(raw, { multiline: true });
  if (!value) return { value, error: required ? "required" : "" };
  if (value.length < min) return { value, error: "tooShort" };
  if (value.length > max) return { value, error: "tooLong" };
  if (MARKUP.test(value)) return { value, error: "markup" };
  if ((value.match(LINK) || []).length > maxLinks)
    return { value, error: "links" };
  if (/(.)\1{14,}/u.test(value)) return { value, error: "invalid" };
  return { value, error: "" };
}

// ---------- محدودیت تعداد تلاش (Rate Limit سمت کلاینت) ----------
// در localStorage نگه داشته می‌شود تا با رفرش صفحه صفر نشود. کاربر مسلط
// می‌تواند آن را دور بزند؛ پس فقط جلوی اسپم ساده و کلیک‌های پشت‌سرهم را می‌گیرد.

const PREFIX = "arano:rl:";
const memory = new Map();

function loadState(key) {
  const fresh = { hits: [], lockedUntil: 0 };
  try {
    const raw = localStorage.getItem(PREFIX + key);
    const parsed = raw ? JSON.parse(raw) : memory.get(key);
    if (!parsed || typeof parsed !== "object") return fresh;
    return {
      hits: Array.isArray(parsed.hits)
        ? parsed.hits.filter((t) => typeof t === "number")
        : [],
      lockedUntil: Number(parsed.lockedUntil) || 0,
    };
  } catch {
    return memory.get(key) ?? fresh;
  }
}

function saveState(key, state) {
  memory.set(key, state);
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function createLimiter({
  key,
  max,
  windowMs,
  lockMs = windowMs,
  minIntervalMs = 0,
}) {
  return {
    // یک تلاش را ثبت می‌کند. { ok, retryAfter(ثانیه) }
    attempt() {
      const now = Date.now();
      const state = loadState(key);
      state.hits = state.hits.filter((t) => now - t < windowMs);

      if (state.lockedUntil > now) {
        return {
          ok: false,
          retryAfter: Math.ceil((state.lockedUntil - now) / 1000),
        };
      }

      const last = state.hits[state.hits.length - 1];
      if (minIntervalMs && last && now - last < minIntervalMs) {
        return {
          ok: false,
          retryAfter: Math.ceil((minIntervalMs - (now - last)) / 1000),
        };
      }

      if (state.hits.length >= max) {
        state.lockedUntil = now + lockMs;
        saveState(key, state);
        return { ok: false, retryAfter: Math.ceil(lockMs / 1000) };
      }

      state.hits.push(now);
      saveState(key, state);
      return { ok: true, retryAfter: 0 };
    },
    reset() {
      saveState(key, { hits: [], lockedUntil: 0 });
    },
  };
}

// 75 -> «۲ دقیقه» | 20 -> «۲۰ ثانیه»
export function formatWait(seconds) {
  const s = Math.max(1, Math.ceil(seconds));
  if (s < 60) return `${s.toLocaleString("fa-IR")} ثانیه`;
  return `${Math.ceil(s / 60).toLocaleString("fa-IR")} دقیقه`;
}
