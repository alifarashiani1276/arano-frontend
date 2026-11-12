import axios from "axios";
import { getPublishedPosts, localizePost, normalizePost } from "../lib/blog";

// فقط از API لاراول می‌خواند (عمومی؛ بدون توکن، پس از نمونه‌ی api ادمین استفاده نمی‌شود):
//   GET /blog/posts?per_page=200   ← خلاصه‌ها (بدون content و faq)
//   GET /blog/posts/{slug}         ← مقاله‌ی کامل
const BASE_URL = import.meta.env.VITE_BASE_URL;

// پاسخ‌ها { data: ... } هستند؛ لیست هم ممکن است { data: { posts } } باشد.
const unwrap = (body) => body?.data ?? body;

// خلاصه‌ها (نرمال‌شده، فقط منتشرشده، جدیدترین اول). زبان در useBlogPosts اعمال می‌شود.
export async function getPosts() {
  const { data } = await axios.get(`${BASE_URL}/blog/posts`, {
    params: { per_page: 200 },
  });
  const body = unwrap(data);
  const list = Array.isArray(body) ? body : (body?.posts ?? []);
  return getPublishedPosts(list);
}

// مقاله‌ی کامل به زبان lang. اگر پیدا نشد (۴۰۴)، پیش‌نویس بود، یا برای en نسخه‌ی انگلیسی نداشت: null
export async function getPost(slug, lang = "fa") {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/blog/posts/${encodeURIComponent(slug)}`,
    );
    const raw = unwrap(data);
    if (!raw?.slug || (raw.status && raw.status !== "published")) return null;

    return localizePost(normalizePost(raw), lang);
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}
