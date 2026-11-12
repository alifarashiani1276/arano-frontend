// منطق مشترک وبلاگ (بدون JSX؛ هم مرورگر و هم Build از آن استفاده می‌کنند):
// آدرس‌ها، نرمال‌سازی مقاله، انتشار، مرتب‌سازی، جست‌وجو و فیلتر، تاریخ و زمان مطالعه.

import { getBlogCategories } from "../i18n/text.js";

export const BLOG_PATH = "/blog";
export const categoryPath = (slug) => `${BLOG_PATH}/category/${slug}`;
export const articlePath = (slug) => `${BLOG_PATH}/${slug}`;

export const getCategory = (slug, lang = "fa") =>
  getBlogCategories(lang).find((c) => c.slug === slug);

// ───────── متن و تاریخ ─────────

// برای جست‌وجوی فارسی: ی/ک عربی، اعراب، کشیده، نیم‌فاصله و ارقام فارسی/عربی یکسان می‌شوند.
export function normalizeSearch(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200b|\u200c|\u200d|\u0640/g, "")
    .replace(/[ً-ٰٟ]/g, "")
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const DATE_OPTS = { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Tehran" };
const dateFormatters = {
  fa: new Intl.DateTimeFormat("fa-IR", DATE_OPTS),
  en: new Intl.DateTimeFormat("en-US", DATE_OPTS),
};

// ISO → «۱۶ آبان ۱۴۰۵» (شمسی، فارسی) | "November 7, 2026" (میلادی، انگلیسی)
export function formatDate(iso, lang = "fa") {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : dateFormatters[lang === "en" ? "en" : "fa"].format(d);
}

export const formatNumber = (n, lang = "fa") =>
  Number(n).toLocaleString(lang === "en" ? "en-US" : "fa-IR");

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

const headingIds = (content) =>
  (Array.isArray(content) ? content : []).map((b, i) =>
    b.type === "h2" || b.type === "h3" ? { ...b, id: b.id ?? `h-${i}` } : b,
  );

const normalizeFaq = (faq) =>
  (Array.isArray(faq) ? faq : [])
    .map((item) => ({ q: item?.q ?? "", a: item?.a ?? "" }))
    .filter((item) => item.q && item.a);

// نسخه‌ی انگلیسی: در «خلاصه»‌های لیست content و faq نیست؛ همان خالی می‌ماند.
function normalizeEn(en) {
  if (!en || typeof en !== "object") return null;
  return {
    title: en.title ?? "",
    seoTitle: en.seoTitle ?? en.seo_title ?? "",
    excerpt: en.excerpt ?? "",
    tags: Array.isArray(en.tags) ? en.tags : [],
    coverAlt: en.coverAlt ?? en.cover_alt ?? "",
    content: headingIds(en.content),
    faq: normalizeFaq(en.faq),
  };
}

// نگاشت داده‌ی خام (پاسخ API لاراول، یا فایل‌های data/blogArticles) به شکل موردنیاز UI.
// «خلاصه»‌ی لیست (بدون content و faq) هم پذیرفته می‌شود؛ readingMinutes از API می‌آید.
// اگر نام فیلدهای API فرق کرد، فقط همین تابع را تغییر دهید.
export function normalizePost(raw) {
  const content = headingIds(raw.content);
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
  const en = normalizeEn(raw.en);

  return {
    id: raw.id ?? raw.slug,
    slug: raw.slug,
    title: raw.title ?? "",
    seoTitle: raw.seoTitle ?? raw.seo_title ?? "",
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
    faq: normalizeFaq(raw.faq),
    links: Array.isArray(raw.links) ? raw.links : [],
    hasEn: Boolean(raw.hasEn ?? raw.has_en ?? en),
    en,
  };
}

// مقاله‌ی نرمال‌شده ← نسخه‌ی همان زبان.
// fa: همان مقاله. en: اگر نسخه‌ی انگلیسی ندارد null (صفحه‌ی /en/blog/<slug> وجود ندارد).
export function localizePost(post, lang = "fa") {
  if (!post || lang !== "en") return post ?? null;
  if (!post.hasEn) return null;

  const en = post.en;
  if (!en) return post;

  return {
    ...post,
    title: en.title || post.title,
    seoTitle: en.seoTitle,
    excerpt: en.excerpt || post.excerpt,
    tags: en.tags,
    cover: post.cover ? { ...post.cover, alt: en.coverAlt || post.cover.alt } : null,
    content: en.content,
    faq: en.faq,
    readingMinutes:
      en.content.length > 0 ? estimateReadingMinutes(en.content) : post.readingMinutes,
  };
}

// فهرست: در /en فقط مقاله‌هایی که نسخه‌ی انگلیسی دارند
export const localizePosts = (posts = [], lang = "fa") =>
  lang === "en" ? posts.map((p) => localizePost(p, "en")).filter(Boolean) : posts;

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

export function filterPosts(posts, { query = "", category = "all", lang = "fa" } = {}) {
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
        getCategory(post.category, lang)?.name,
      ].join(" "),
    );
    return tokens.every((t) => haystack.includes(t));
  });
}

// ───────── مقاله‌های مرتبط با یک صفحه‌ی خدمت ─────────
// از فیلد links هر مقاله؛ posts باید نرمال‌شده (و برای زبان صفحه localize شده) باشد.
const BRAND_SUFFIX = /\s*\|\s*(?:آرانو|Arano(?: Blog| Web Studio)?)$/;

export const blogLinksFor = (posts = [], path, limit = 3) =>
  posts
    .filter((p) => p.links?.includes(path))
    .slice(0, limit)
    .map((p) => ({
      title: (p.seoTitle || p.title).replace(BRAND_SUFFIX, ""),
      href: articlePath(p.slug),
    }));
