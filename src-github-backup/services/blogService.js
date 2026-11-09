import axios from "axios";
import { BLOG_POSTS } from "../data/blog";
import { getPublishedPosts } from "../lib/blog";

// VITE_BLOG_USE_API=true  ->  GET {VITE_BASE_URL}/blog/posts (Laravel)
// پیش‌فرض (false): مقاله‌ها از فایل src/data/blog.js خوانده می‌شود.
const USE_API = import.meta.env.VITE_BLOG_USE_API === "true";
const BASE_URL = import.meta.env.VITE_BASE_URL;

// حالت فایل: همگام و بدون لودینگ (React Query با initialData شروع می‌کند)
export const getInitialPosts = () =>
  USE_API ? undefined : getPublishedPosts(BLOG_POSTS);

export async function getPosts() {
  if (!USE_API) return getPublishedPosts(BLOG_POSTS);

  const { data } = await axios.get(`${BASE_URL}/blog/posts`);
  const list = Array.isArray(data) ? data : (data.data ?? data.posts ?? []);
  return getPublishedPosts(list);
}
