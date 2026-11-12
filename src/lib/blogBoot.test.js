// اجرا:  npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeBootPath, parseBlogBoot } from "./blogBoot.js";
import { localizePost, localizePosts, normalizePost } from "./blog.js";

const summaryFa = {
  id: 1,
  slug: "x",
  title: "عنوان",
  excerpt: "خلاصه",
  category: "seo",
  tags: ["الف"],
  cover: { src: "/uploads/blog/a.webp", alt: "تصویر" },
  publishedAt: "2026-01-01",
  readingMinutes: 7,
  hasEn: true,
  en: { title: "Title", seoTitle: "Title | Arano", excerpt: "Summary", tags: ["a"], coverAlt: "Image" },
};

test("مسیر داده‌ی اولیه: اسلش آخر، query و hash نادیده گرفته می‌شود", () => {
  assert.equal(normalizeBootPath("/blog/x/"), "/blog/x");
  assert.equal(normalizeBootPath("/blog/x?q=1#a"), "/blog/x");
  assert.equal(normalizeBootPath("/"), "/");
  assert.equal(normalizeBootPath("/en/blog"), "/en/blog");
});

test("JSON نامعتبر یا غیرشیء → null (بدون خطا)", () => {
  assert.equal(parseBlogBoot("{bad"), null);
  assert.equal(parseBlogBoot("[]"), null);
  assert.equal(parseBlogBoot(""), null);
  assert.deepEqual(parseBlogBoot('{"a":"\\u003c"}'), { a: "<" });
});

test("خلاصه‌ی بدون content: readingMinutes از API می‌آید و hasEn حفظ می‌شود", () => {
  const post = normalizePost(summaryFa);
  assert.equal(post.readingMinutes, 7);
  assert.deepEqual(post.content, []);
  assert.deepEqual(post.faq, []);
  assert.equal(post.hasEn, true);
});

test("localizePost: en فقط با hasEn، alt و عنوان انگلیسی", () => {
  const post = normalizePost(summaryFa);
  const en = localizePost(post, "en");
  assert.equal(en.title, "Title");
  assert.equal(en.seoTitle, "Title | Arano");
  assert.equal(en.cover.alt, "Image");
  assert.equal(en.readingMinutes, 7);
  assert.equal(localizePost(post, "fa"), post);

  const faOnly = normalizePost({ ...summaryFa, hasEn: false, en: null });
  assert.equal(localizePost(faOnly, "en"), null);
  assert.deepEqual(localizePosts([post, faOnly], "en").map((p) => p.slug), ["x"]);
  assert.equal(localizePosts([post, faOnly], "fa").length, 2);
});

test("مقاله‌ی کامل: شناسه‌ی سرتیتر و FAQ", () => {
  const post = normalizePost({
    ...summaryFa,
    content: [{ type: "h2", text: "الف" }, { type: "p", text: "ب" }],
    faq: [{ q: "س", a: "ج" }, { q: "", a: "" }],
    en: { ...summaryFa.en, content: [{ type: "h3", text: "A" }], faq: [{ q: "Q", a: "A" }] },
  });
  assert.equal(post.content[0].id, "h-0");
  assert.equal(post.faq.length, 1);
  const en = localizePost(post, "en");
  assert.equal(en.content[0].id, "h-0");
  assert.equal(en.faq[0].q, "Q");
});
