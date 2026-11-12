// داده‌ی اولیه‌ی وبلاگ: لاراول بیرون از #root یک تگ <script type="application/json" id="blog-boot">
// می‌نویسد ({ lang, route, path, post?, posts }). همین‌جا خوانده می‌شود تا اولین رندر React
// همزمان و بدون لودینگ و چشمک باشد (initialData در React Query).
// فقط JS ساده؛ هیچ وابستگی‌ای به React ندارد.

import { localizePost, normalizePost, getPublishedPosts } from "./blog.js";

export const BLOG_BOOT_ID = "blog-boot";

// "/blog/x/?a=1#b" → "/blog/x"
export function normalizeBootPath(path) {
  const clean = String(path ?? "").split(/[?#]/)[0];
  return clean.length > 1 ? clean.replace(/\/+$/, "") : clean || "/";
}

// متن JSON → شیء، یا null اگر نامعتبر بود (هرگز خطا نمی‌دهد)
export function parseBlogBoot(text) {
  try {
    const data = JSON.parse(text);
    return data && typeof data === "object" && !Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

let cached; // undefined = هنوز خوانده نشده
let valid = true;

function readBoot() {
  if (cached !== undefined) return cached;
  cached = null;
  if (typeof document !== "undefined") {
    const el = document.getElementById(BLOG_BOOT_ID);
    if (el) cached = parseBlogBoot(el.textContent);
  }
  return cached;
}

// بعد از اولین ناوبری کلاینتی داده‌ی اولیه دیگر معتبر نیست (ممکن است قدیمی شده باشد)
export const invalidateBlogBoot = () => {
  valid = false;
};

// داده‌ی اولیه فقط وقتی برمی‌گردد که path ثبت‌شده با مسیر فعلی مرورگر یکی باشد.
export function getBlogBoot(pathname) {
  if (!valid || typeof window === "undefined") return null;
  const boot = readBoot();
  if (!boot) return null;

  const current = normalizeBootPath(pathname ?? window.location.pathname);
  return normalizeBootPath(boot.path) === current ? boot : null;
}

// خلاصه‌های نرمال‌شده برای initialData لیست؛ undefined یعنی داده‌ی اولیه‌ای نیست
export function getBootPosts() {
  const boot = getBlogBoot();
  return Array.isArray(boot?.posts) ? getPublishedPosts(boot.posts) : undefined;
}

// مقاله‌ی کامل (به زبان خواسته‌شده) برای initialData صفحه‌ی مقاله؛ undefined یعنی داده‌ی اولیه‌ای نیست
export function getBootPost(slug, lang = "fa") {
  const boot = getBlogBoot();
  if (boot?.route !== "article" || !boot.post || boot.post.slug !== slug) return undefined;
  return localizePost(normalizePost(boot.post), lang) ?? undefined;
}
