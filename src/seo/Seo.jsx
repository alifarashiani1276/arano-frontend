import { useEffect } from "react";
import {
  DEFAULT_DESCRIPTION,
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  absUrl,
  getPage,
} from "./registry";
import { getJsonLd } from "./schema";

function upsert(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

function setMeta(attr, key, content) {
  const el = upsert(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement("meta");
    m.setAttribute(attr, key);
    return m;
  });
  el.setAttribute("content", content);
}

// Title، Description، canonical، Open Graph و JSON-LD هر صفحه را از src/seo/registry.js می‌خواند.
// نکته: همین مقدارها هنگام Build داخل HTML ثابت هم نوشته می‌شود (vite/seoPlugin.js)،
// تا ربات‌هایی که جاوااسکریپت اجرا نمی‌کنند هم آن‌ها را ببینند.
// meta (اختیاری): Meta پویا که روی مقدارهای رجیستری می‌نشیند؛ مثلاً صفحه‌ی مقاله، یا
// { noindex: true } برای صفحه‌های بدون محتوا (وبلاگ خالی، دسته‌ی خالی، مقاله‌ی ناموجود).
export default function Seo({ path, meta }) {
  const metaKey = meta ? JSON.stringify(meta) : "";

  useEffect(() => {
    const page = meta ? { ...getPage(path), ...meta } : getPage(path);
    if (!page?.title) return undefined;

    const url = absUrl(path);
    const description = page.description || DEFAULT_DESCRIPTION;

    document.title = page.title;
    setMeta("name", "description", description);
    setMeta("name", "robots", page.noindex ? "noindex, follow" : "index, follow");

    upsert('link[rel="canonical"]', () => {
      const l = document.createElement("link");
      l.rel = "canonical";
      return l;
    }).href = url;

    const isArticle = page.kind === "article";
    const cover = page.article?.cover;
    const ogImage = cover
      ? /^https?:\/\//.test(cover.src || cover.mobileSrc)
        ? cover.src || cover.mobileSrc
        : `${SITE_URL}${cover.src || cover.mobileSrc}`
      : `${SITE_URL}${OG_IMAGE}`;

    setMeta("property", "og:type", isArticle ? "article" : "website");
    setMeta("property", "og:locale", "fa_IR");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:title", page.title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", ogImage);
    setMeta("name", "twitter:card", "summary_large_image");

    // JSON-LD: نسخه‌ی ثابت HTML (Build) با نسخه‌ی همین صفحه جایگزین می‌شود تا تکراری نشود.
    document.head
      .querySelectorAll('script[type="application/ld+json"]')
      .forEach((n) => n.remove());
    getJsonLd(page).forEach((data) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.textContent = JSON.stringify(data);
      document.head.appendChild(s);
    });

    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, metaKey]);

  return null;
}
