import fs from "node:fs";
import path from "node:path";
import {
  ALL_PAGES,
  DEFAULT_DESCRIPTION,
  OG_IMAGE,
  SITE_URL,
  absUrl,
  siteName,
} from "../src/seo/registry.js";
import { LANG_META, localePath } from "../src/i18n/config.js";
import { getJsonLd } from "../src/seo/schema.js";
import { getBlogCategories, getServicePages } from "../src/i18n/text.js";
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
  const lang = page.lang ?? "fa";
  const { dir } = LANG_META[lang];
  const list = (items) =>
    `<ul>${items
      .map((i) => `<li><a href="${i.href}">${esc(i.name)}</a></li>`)
      .join("")}</ul>`;
  const links =
    page.kind === "hub"
      ? list(
          getServicePages(lang).map((s) => ({
            href: localePath(s.path, lang),
            name: s.name,
          })),
        )
      : page.kind === "blog"
        ? list(
            getBlogCategories(lang).map((c) => ({
              href: localePath(categoryPath(c.slug), lang),
              name: c.name,
            })),
          )
        : `<p><a href="${localePath("/services", lang)}">${lang === "en" ? "Arano Services" : "خدمات آرانو"}</a></p>`;
  return `<noscript><main dir="${dir}" style="font-family:sans-serif;padding:24px"><h1>${esc(
    page.h1,
  )}</h1><p>${esc(page.description || DEFAULT_DESCRIPTION)}</p>${links}</main></noscript>`;
}

// index.html ممکن است خودش canonical / og / twitter / JSON-LD ثابت (مخصوص صفحه اصلی) داشته باشد؛
// چون برای هر صفحه مجموعه‌ی کامل را از نو می‌سازیم، نسخه‌ی ثابتِ قالب را برمی‌داریم تا تگ تکراری یا ناسازگار نماند.
const stripShellSeo = (html) =>
  html
    .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, "")
    .replace(/\s*<meta\s+(?:property|name)="(?:og|twitter):[^"]*"[\s\S]*?\/>/gi, "")
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, "");

function renderPage(shellRaw, page) {
  const shell = stripShellSeo(shellRaw);
  const description = page.description || DEFAULT_DESCRIPTION;
  const lang = page.lang ?? "fa";
  const meta = LANG_META[lang];

  const tags = [
    // صفحه‌های بدون محتوا (وبلاگ خالی، دسته‌ی خالی): هرگز ایندکس نشوند، ولی لینک‌هایشان دنبال شود.
    ...(page.noindex ? [`<meta name="robots" content="noindex, follow" />`] : []),
    `<link rel="canonical" href="${absUrl(page.path)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="${meta.locale}" />`,
    `<meta property="og:site_name" content="${siteName(lang)}" />`,
    // hreflang: نسخه‌های زبانی همین صفحه (+ x-default = فارسی)
    ...(page.alternates ?? []).map(
      (a) =>
        `<link rel="alternate" hreflang="${LANG_META[a.lang].htmlLang}" href="${absUrl(a.path)}" />`,
    ),
    ...(page.alternates?.some((a) => a.lang === "fa")
      ? [
          `<link rel="alternate" hreflang="x-default" href="${absUrl(page.alternates.find((a) => a.lang === "fa").path)}" />`,
        ]
      : []),
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${absUrl(page.path)}" />`,
    `<meta property="og:image" content="${SITE_URL}${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${SITE_URL}${OG_IMAGE}" />`,
    ...getJsonLd(page).map(
      (d) => `<script type="application/ld+json">${jsonSafe(d)}</script>`,
    ),
  ];

  return shell
    .replace(/<html[^>]*>/i, (m) =>
      m.replace(/lang="[^"]*"/, `lang="${meta.htmlLang}"`).replace(/dir="[^"]*"/, `dir="${meta.dir}"`),
    )
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
  const indexable = new Map(
    ALL_PAGES.filter((p) => !p.noindex).map((p) => [p.path, p]),
  );
  // صفحه‌های noindex در سایت‌مپ نمی‌آیند؛ هر آدرس لینک‌های hreflang نسخه‌های ایندکس‌پذیرش را هم دارد.
  const urls = [...indexable.values()]
    .map((p) => {
      const alts = (p.alternates ?? [])
        .filter((a) => indexable.has(a.path))
        .map(
          (a) =>
            `\n    <xhtml:link rel="alternate" hreflang="${LANG_META[a.lang].htmlLang}" href="${absUrl(a.path)}" />`,
        )
        .join("");
      return `  <url>\n    <loc>${absUrl(p.path)}</loc>${alts}\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${p.priority.toFixed(1)}</priority>\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
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
