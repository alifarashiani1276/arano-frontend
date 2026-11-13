// اجرا:  npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { ALL_PAGES, BLOG_PAGES, articleMeta, getPage, resolveInternalLink } from "./registry.js";
import { getJsonLd } from "./schema.js";
import { blogLinksFor, localizePost, localizePosts, normalizePost } from "../lib/blog.js";

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

const faOnly = normalizePost({ id: 2, slug: "fa-only", title: "فقط فارسی", publishedAt: "2026-01-01" });
const posts = [post, faOnly];

test("resolveInternalLink: خدمت و صفحه‌ی ثابت به زبان درخواستی", () => {
  const fa = resolveInternalLink("/services/seo", "fa");
  assert.equal(fa.path, "/services/seo");
  assert.equal(fa.label, getPage("/services/seo", "fa").h1);
  const en = resolveInternalLink("/services/seo", "en");
  assert.equal(en.path, "/en/services/seo");
  assert.equal(en.label, getPage("/services/seo", "en").h1);
  assert.equal(resolveInternalLink("/services", "en").path, "/en/services");
  assert.ok(resolveInternalLink("/services", "fa").label);
});

test("resolveInternalLink: hub وبلاگ و مقاله‌ی fa/en", () => {
  assert.equal(resolveInternalLink("/blog", "fa").label, "وبلاگ آرانو");
  assert.deepEqual(resolveInternalLink("/blog", "en"), { path: "/en/blog", label: "Arano Blog" });
  assert.deepEqual(resolveInternalLink("/blog/x", "fa", posts), { path: "/blog/x", label: "عنوان" });
  assert.deepEqual(resolveInternalLink("/blog/x", "en", localizePosts(posts, "en")), {
    path: "/en/blog/x",
    label: "Title",
  });
});

test("resolveInternalLink: مسیر ناشناخته، admin/dashboard و مقاله‌ی بدون en", () => {
  for (const p of ["/nope", "/admin", "/admin/blog", "/dashboard", "/blog/missing", "/blog/category/seo"]) {
    assert.equal(resolveInternalLink(p, "fa", posts), null, p);
  }
  assert.equal(resolveInternalLink("/blog/fa-only", "fa", posts).label, "فقط فارسی");
  assert.equal(resolveInternalLink("/blog/fa-only", "en", posts), null);
  assert.equal(resolveInternalLink("/blog/fa-only", "en", localizePosts(posts, "en")), null);
});
