import fs from "node:fs";
import path from "node:path";
import {
  ALL_PAGES,
  DEFAULT_DESCRIPTION,
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  absUrl,
} from "../src/seo/registry.js";
import { getJsonLd } from "../src/seo/schema.js";
import { SERVICE_PAGES } from "../src/data/servicePages.js";
import { BLOG_CATEGORIES } from "../src/data/blog.js";
import { categoryPath } from "../src/lib/blog.js";

// فقط در Build اجرا می‌شود و بعد از ساخت dist، سه کار می‌کند:
// ۱) برای هر صفحه‌ی سایت یک index.html جدا (مثلاً dist/services/seo/index.html) می‌نویسد
//    که Title، Description، canonical، Open Graph و JSON-LD همان صفحه را مستقیم داخل HTML دارد
//    (ربات‌هایی که جاوااسکریپت اجرا نمی‌کنند و پیش‌نمایش شبکه‌های اجتماعی هم آن‌ها را می‌بینند).
// ۲) sitemap.xml شامل همه صفحه‌های ایندکس‌پذیر می‌سازد (صفحه‌های noindex مثل وبلاگ خالی نمی‌آیند).
// ۳) هیچ‌چیز در dev تغییر نمی‌کند.
// خود برنامه (React) مثل قبل همه چیز را رندر می‌کند؛ این فقط «HTML اولیه» را کامل‌تر می‌کند.

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const jsonSafe = (o) => JSON.stringify(o).replace(/</g, "\\u003c");

function fallbackHtml(page) {
  const links =
    page.kind === "hub"
      ? `<ul>${SERVICE_PAGES.map(
          (s) => `<li><a href="${s.path}">${esc(s.name)}</a></li>`,
        ).join("")}</ul>`
      : page.kind === "blog"
        ? `<ul>${BLOG_CATEGORIES.map(
            (c) => `<li><a href="${categoryPath(c.slug)}">${esc(c.name)}</a></li>`,
          ).join("")}</ul>`
        : `<p><a href="/services">خدمات آرانو</a></p>`;
  return `<noscript><main dir="rtl" style="font-family:sans-serif;padding:24px"><h1>${esc(
    page.h1,
  )}</h1><p>${esc(page.description || DEFAULT_DESCRIPTION)}</p>${links}</main></noscript>`;
}

function renderPage(shell, page) {
  const description = page.description || DEFAULT_DESCRIPTION;
  const isHome = page.path === "/";

  const tags = [
    // صفحه‌های بدون محتوا (وبلاگ خالی، دسته‌ی خالی): هرگز ایندکس نشوند، ولی لینک‌هایشان دنبال شود.
    ...(page.noindex ? [`<meta name="robots" content="noindex, follow" />`] : []),
    // صفحه اصلی همان index.html است که برای مسیرهای دیگر (ورود، داشبورد) هم fallback می‌شود؛
    // پس canonical و og:url را برایش نمی‌نویسیم و کامپوننت Seo در مرورگر می‌گذارد.
    ...(isHome ? [] : [`<link rel="canonical" href="${absUrl(page.path)}" />`]),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="fa_IR" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    ...(isHome ? [] : [`<meta property="og:url" content="${absUrl(page.path)}" />`]),
    `<meta property="og:image" content="${SITE_URL}${OG_IMAGE}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    ...getJsonLd(page).map(
      (d) => `<script type="application/ld+json">${jsonSafe(d)}</script>`,
    ),
  ];

  return shell
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(page.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/i,
      `<meta name="description" content="${esc(description)}" />`,
    )
    .replace("</head>", `    ${tags.join("\n    ")}\n  </head>`)
    .replace(/<body[^>]*>/i, (m) => `${m}\n    ${fallbackHtml(page)}`);
}

function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  // صفحه‌های noindex در سایت‌مپ نمی‌آیند.
  const urls = ALL_PAGES.filter((p) => !p.noindex).map(
    (p) =>
      `  <url>\n    <loc>${absUrl(p.path)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${p.priority.toFixed(1)}</priority>\n  </url>`,
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export default function seoPlugin() {
  let outDir = "dist";

  return {
    name: "arano-seo",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const shellPath = path.join(outDir, "index.html");
      if (!fs.existsSync(shellPath)) return;
      const shell = fs.readFileSync(shellPath, "utf8");

      for (const page of ALL_PAGES) {
        const html = renderPage(shell, page);
        const target =
          page.path === "/"
            ? shellPath
            : path.join(outDir, page.path, "index.html");
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, html);
      }

      fs.writeFileSync(path.join(outDir, "sitemap.xml"), buildSitemap());
    },
  };
}
