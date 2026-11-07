// منطق مشترک وبلاگ (بدون JSX؛ هم مرورگر و هم Build از آن استفاده می‌کنند):
// آدرس‌ها، نرمال‌سازی مقاله، انتشار، مرتب‌سازی، جست‌وجو و فیلتر، تاریخ و زمان مطالعه.

import { BLOG_CATEGORIES } from "../data/blog.js";

export const BLOG_PATH = "/blog";
export const categoryPath = (slug) => `${BLOG_PATH}/category/${slug}`;
export const articlePath = (slug) => `${BLOG_PATH}/${slug}`;

export const getCategory = (slug) =>
  BLOG_CATEGORIES.find((c) => c.slug === slug);

// ───────── متن و تاریخ ─────────

// برای جست‌وجوی فارسی: ی/ک عربی، اعراب، کشیده، نیم‌فاصله و ارقام فارسی/عربی یکسان می‌شوند.
export function normalizeSearch(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[‌​‍ـ]/g, "")
    .replace(/[ً-ٰٟ]/g, "")
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Tehran",
});

// ISO → «۱۶ آبان ۱۴۰۵» (تاریخ شمسی)
export function formatDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : dateFormatter.format(d);
}

export const formatNumber = (n) => Number(n).toLocaleString("fa-IR");

function blockText(block) {
  if (!block) return "";
  if (Array.isArray(block.items)) return block.items.join(" ");
  return block.text ?? "";
}

export function estimateReadingMinutes(content = []) {
  const words = content
    .filter((b) => b.type !== "code")
    .map(blockText)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

// ───────── مقاله ─────────

// نگاشت داده‌ی خام (فایل data/blog.js یا پاسخ API با snake_case) به شکل موردنیاز UI.
// اگر نام فیلدهای API فرق کرد، فقط همین تابع را تغییر دهید.
export function normalizePost(raw) {
  const content = (Array.isArray(raw.content) ? raw.content : []).map((b, i) =>
    b.type === "h2" || b.type === "h3" ? { ...b, id: b.id ?? `h-${i}` } : b,
  );
  const cover =
    raw.cover ??
    (raw.image || raw.image_url
      ? {
          src: raw.image ?? raw.image_url,
          mobileSrc: raw.mobile_image ?? raw.mobile_image_url ?? null,
          alt: raw.image_alt ?? "",
        }
      : null);
  const author = raw.author?.name ?? raw.author ?? "";

  return {
    id: raw.id ?? raw.slug,
    slug: raw.slug,
    title: raw.title ?? "",
    excerpt: raw.excerpt ?? raw.summary ?? "",
    category: raw.category ?? raw.category_slug ?? "",
    tags: raw.tags ?? [],
    cover: cover?.src || cover?.mobileSrc ? cover : null,
    author: typeof author === "string" ? author : "",
    publishedAt: raw.publishedAt ?? raw.published_at ?? null,
    updatedAt: raw.updatedAt ?? raw.updated_at ?? null,
    readingMinutes:
      raw.readingMinutes ??
      raw.reading_minutes ??
      estimateReadingMinutes(content),
    featured: Boolean(raw.featured),
    status: raw.status ?? "published",
    content,
  };
}

export function isPublished(post, now = Date.now()) {
  if (!post?.slug || !post.title) return false;
  if (post.status && post.status !== "published") return false;
  const t = new Date(post.publishedAt).getTime();
  return !Number.isNaN(t) && t <= now;
}

export const sortNewest = (a, b) =>
  new Date(b.publishedAt) - new Date(a.publishedAt);

// فهرست خام → فقط مقاله‌های منتشرشده، نرمال و جدیدترین اول
export function getPublishedPosts(rawList = []) {
  return rawList.map(normalizePost).filter((p) => isPublished(p)).sort(sortNewest);
}

// ───────── جست‌وجو و فیلتر ─────────

export function filterPosts(posts, { query = "", category = "all" } = {}) {
  const tokens = normalizeSearch(query).split(" ").filter(Boolean);

  return posts.filter((post) => {
    if (category !== "all" && post.category !== category) return false;
    if (tokens.length === 0) return true;

    const haystack = normalizeSearch(
      [
        post.title,
        post.excerpt,
        post.tags.join(" "),
        post.author,
        getCategory(post.category)?.name,
      ].join(" "),
    );
    return tokens.every((t) => haystack.includes(t));
  });
}
