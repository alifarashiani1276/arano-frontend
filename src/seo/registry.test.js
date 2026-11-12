// اجرا:  npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { ALL_PAGES, BLOG_PAGES, articleMeta, getPage } from "./registry.js";
import { getJsonLd } from "./schema.js";
import { blogLinksFor, localizePost, normalizePost } from "../lib/blog.js";

const post = normalizePost({
  id: 1,
  slug: "x",
  title: "عنوان",
  excerpt: "خلاصه",
  category: "seo",
  publishedAt: "2026-01-01",
  hasEn: true,
  links: ["/services/seo"],
  faq: [{ q: "س", a: "ج" }],
  en: { title: "Title", excerpt: "Sum", seoTitle: "Custom | Arano", content: [], faq: [] },
});

test("ALL_PAGES شامل صفحه‌های وبلاگ نیست، ولی getPage آن‌ها را برای مرورگر دارد", () => {
  const kinds = new Set(ALL_PAGES.map((p) => p.kind));
  for (const k of ["blog", "blog-category", "article"]) assert.equal(kinds.has(k), false);
  assert.ok(BLOG_PAGES.length > 0);
  assert.equal(getPage("/blog", "fa").kind, "blog");
  assert.equal(getPage("/blog/category/frontend", "en").kind, "blog-category");
});

test("عنوان مقاله: seoTitle اولویت دارد، وگرنه «عنوان | برند وبلاگ»", () => {
  assert.equal(articleMeta(post, "fa").title, "عنوان | وبلاگ آرانو");
  assert.equal(articleMeta(localizePost(post, "en"), "en").title, "Custom | Arano");
  const noSeo = { ...localizePost(post, "en"), seoTitle: "" };
  assert.equal(articleMeta(noSeo, "en").title, "Title | Arano Blog");
});

test("hreflang فقط وقتی نسخه‌ی انگلیسی هست", () => {
  assert.equal(articleMeta(post, "fa").alternates.length, 2);
  assert.deepEqual(articleMeta({ ...post, hasEn: false, en: null }, "fa").alternates, []);
});

test("JSON-LD مقاله: BlogPosting + Breadcrumb، و FAQPage فقط با faq", () => {
  const types = (p) => getJsonLd(articleMeta(p, "fa")).map((d) => d["@type"]);
  assert.deepEqual(types(post), ["Organization", "BreadcrumbList", "BlogPosting", "FAQPage"]);
  assert.deepEqual(types({ ...post, faq: [] }), ["Organization", "BreadcrumbList", "BlogPosting"]);
});

test("blogLinksFor: برند از عنوان حذف می‌شود و سقف ۳ تا", () => {
  const posts = [post, { ...post, slug: "y" }, { ...post, slug: "z" }, { ...post, slug: "w" }];
  const links = blogLinksFor(posts, "/services/seo");
  assert.equal(links.length, 3);
  assert.deepEqual(links[0], { title: "عنوان", href: "/blog/x" });
  assert.deepEqual(blogLinksFor(posts, "/other"), []);
  const en = localizePost({ ...post, en: { ...post.en, seoTitle: "Custom | Arano" } }, "en");
  assert.equal(blogLinksFor([en], "/services/seo")[0].title, "Custom");
});
