import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  ALL_PAGES,
  BLOG_PAGES,
  DEFAULT_DESCRIPTION,
  LABELS,
  OG_IMAGE,
  SITE_URL,
  absUrl,
  siteName,
} from "../src/seo/registry.js";
import { LANGS, LANG_META, localePath, stripLang } from "../src/i18n/config.js";
import { getJsonLd, organizationLd } from "../src/seo/schema.js";
import { getBlogCategories, getServicePages } from "../src/i18n/text.js";

// فقط در Build اجرا می‌شود و بعد از ساخت dist، این کارها را می‌کند:
// ۱) برای هر صفحه‌ی سایت (غیر وبلاگ) یک index.html جدا (مثلاً dist/services/seo/index.html) می‌نویسد
//    که Title، Description، canonical، Open Graph و JSON-LD همان صفحه را مستقیم داخل HTML دارد
//    (ربات‌هایی که جاوااسکریپت اجرا نمی‌کنند و پیش‌نمایش شبکه‌های اجتماعی هم آن‌ها را می‌بینند).
// ۲) sitemap.xml (ایندکس) و sitemap-pages.xml (همه‌ی صفحه‌های غیر وبلاگ با hreflang) می‌سازد.
//    sitemap-blog.xml را بک‌اند (لاراول) می‌نویسد.
// ۳) برای صفحه‌های وبلاگ که لاراول به‌صورت HTML ثابت می‌نویسد، دو فایل قرارداد را می‌سازد:
//    blog-template.html (قالب با جاینگهدارهای %%...%%) و blog-config.json (دسته‌ها، برند، Schema سازمان و...).
//    خود صفحه‌های وبلاگ این‌جا ساخته نمی‌شوند.
// ۴) هیچ‌چیز در dev تغییر نمی‌کند.
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

// ───────── lastmod واقعی ─────────
// تاریخ آخرین commit فایل‌های منبع هر صفحه (git). اگر git یا تاریخچه نبود، lastmod نوشته نمی‌شود
// (نبودنِ lastmod بهتر از تاریخ ساختگی «امروز» است).
const EN_SRC = "src/i18n/en";
const SOURCES = {
  home: ["src/pages/Home.jsx", "src/features/home", "src/config/site.js", "src/data/services.js"],
  hub: ["src/pages/ServicesPage.jsx", "src/data/servicePages.js", "src/data/services.js"],
  service: ["src/data/servicePages.js"],
  "/portfolio": ["src/pages/PortfolioPage.jsx", "src/data/projects.js"],
  "/about": ["src/pages/AboutPage.jsx"],
  "/team": ["src/pages/TeamPage.jsx", "src/data/team.js"],
  "/contact": ["src/pages/ContactPage.jsx"],
  "/terms": ["src/pages/TermsPage.jsx", "src/data/terms.js"],
};

function makeLastmod(root) {
  const cache = new Map();
  const gitDate = (files) => {
    const key = files.join("|");
    if (!cache.has(key)) {
      let out = "";
      try {
        out = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...files], {
          cwd: root,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        }).trim();
      } catch {
        out = "";
      }
      cache.set(key, /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : "");
    }
    return cache.get(key);
  };

  return (page) => {
    const key =
      page.kind === "home" || page.kind === "hub" || page.kind === "service"
        ? page.kind
        : stripLang(page.path);
    const files = SOURCES[key];
    if (!files) return "";
    return gitDate(page.lang === "en" ? [...files, EN_SRC] : files);
  };
}

function buildPagesSitemap(lastmodOf) {
  const indexable = new Map(
    ALL_PAGES.filter((p) => !p.noindex).map((p) => [p.path, p]),
  );
  // هر آدرس لینک‌های hreflang نسخه‌های ایندکس‌پذیرش را هم دارد.
  const dates = [];
  const urls = [...indexable.values()]
    .map((p) => {
      const alts = (p.alternates ?? [])
        .filter((a) => indexable.has(a.path))
        .map(
          (a) =>
            `\n    <xhtml:link rel="alternate" hreflang="${LANG_META[a.lang].htmlLang}" href="${absUrl(a.path)}" />`,
        )
        .join("");
      const date = lastmodOf(p);
      if (date) dates.push(date);
      const lastmod = date ? `\n    <lastmod>${date}</lastmod>` : "";
      return `  <url>\n    <loc>${absUrl(p.path)}</loc>${alts}${lastmod}\n    <changefreq>monthly</changefreq>\n    <priority>${p.priority.toFixed(1)}</priority>\n  </url>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
  return { xml, lastmod: dates.sort().at(-1) ?? "" };
}

// ایندکس ثابت: sitemap-pages.xml را همین Build و sitemap-blog.xml را بک‌اند می‌نویسد.
function buildSitemapIndex(pagesLastmod) {
  const entry = (file, lastmod) =>
    `  <sitemap>\n    <loc>${SITE_URL}/${file}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n  </sitemap>`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entry("sitemap-pages.xml", pagesLastmod)}\n${entry("sitemap-blog.xml", "")}\n</sitemapindex>\n`;
}

// ───────── قرارداد با بک‌اند (صفحه‌های ثابت وبلاگ) ─────────

const HIDE_STYLE = "<style>#root > .seo-static { visibility: hidden; }</style>";
const SHOW_NOSCRIPT =
  "<noscript><style>#root > .seo-static { visibility: visible; }</style></noscript>";

// index.html خام (بدون canonical و og و twitter و ld+json) با جاینگهدار؛ لاراول جاینگهدارها را پر می‌کند.
function buildBlogTemplate(shellRaw) {
  return stripShellSeo(shellRaw)
    .replace(/<html[^>]*>/i, (m) =>
      m
        .replace(/lang="[^"]*"/, 'lang="%%HTML_LANG%%"')
        .replace(/dir="[^"]*"/, 'dir="%%HTML_DIR%%"'),
    )
    .replace(/<title>[\s\S]*?<\/title>/i, "<title>%%TITLE%%</title>")
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/i,
      '<meta name="description" content="%%DESCRIPTION%%" />',
    )
    .replace(
      "</head>",
      `    ${HIDE_STYLE}\n    ${SHOW_NOSCRIPT}\n    <!--%%HEAD_EXTRA%%-->\n  </head>`,
    )
    .replace(
      /<div id="root">[\s\S]*?<\/div>/i,
      '<div id="root"><!--%%ROOT_HTML%%--></div><!--%%BOOT_JSON%%-->',
    );
}

function buildBlogConfig() {
  const perLang = (fn) => Object.fromEntries(LANGS.map((l) => [l, fn(l)]));
  const pick = ({ name, short, description }) => ({ name, short, description });
  const hubOf = (lang) =>
    BLOG_PAGES.find((p) => p.kind === "blog" && p.lang === lang);

  // نام صفحه‌های غیر وبلاگ (ثابت، hub خدمات و خدمت‌ها) برای متن لینک‌های مرتبط در HTML ثابت لاراول
  const pages = {};
  for (const p of ALL_PAGES) {
    const key = stripLang(p.path);
    pages[key] ??= {};
    pages[key][p.lang] = p.h1 || p.service?.name || p.name;
  }

  return {
    siteUrl: SITE_URL,
    siteName: perLang((l) => siteName(l)),
    blogBrand: perLang((l) => LABELS[l].blogBrand),
    breadcrumbs: perLang((l) => ({ home: LABELS[l].home, blog: LABELS[l].blog })),
    // عنوان صفحه‌ی دسته = «{name} | {blogBrand}»؛ عنوان لیست و دسته‌ها از hub و categories
    hub: perLang((l) => {
      const { h1, title, description } = hubOf(l);
      return { h1, title, description };
    }),
    categories: getBlogCategories("fa").map((fa) => ({
      slug: fa.slug,
      fa: pick(fa),
      en: pick(getBlogCategories("en").find((c) => c.slug === fa.slug)),
    })),
    pages,
    defaultDescription: DEFAULT_DESCRIPTION,
    organization: organizationLd(),
    ogImage: { url: `${SITE_URL}${OG_IMAGE}`, width: 1200, height: 630 },
    langs: perLang((l) => ({
      htmlLang: LANG_META[l].htmlLang,
      dir: LANG_META[l].dir,
      ogLocale: LANG_META[l].locale,
      ldLang: LANG_META[l].ldLang,
    })),
  };
}

export default function seoPlugin() {
  let outDir = "dist";
  let root = ".";

  return {
    name: "arano-seo",
    apply: "build",
    configResolved(config) {
      root = config.root;
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

      const pages = buildPagesSitemap(makeLastmod(root));
      fs.writeFileSync(path.join(outDir, "sitemap-pages.xml"), pages.xml);
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), buildSitemapIndex(pages.lastmod));

      fs.writeFileSync(path.join(outDir, "blog-template.html"), buildBlogTemplate(shell));
      fs.writeFileSync(
        path.join(outDir, "blog-config.json"),
        `${JSON.stringify(buildBlogConfig(), null, 2)}\n`,
      );

      // صفحه‌های ثابت وبلاگ که لاراول قبلاً ساخته به فایل‌های index-<hash> بیلد قبلی اشاره می‌کنند.
      // این قاعده‌ها (برای public_html/.htaccess) فایل گم‌شده را به بیلد فعلی می‌فرستند تا صفحه سفید نشود.
      const entry = (ext) => shell.match(new RegExp(`/assets/(index-[\\w-]+\\.${ext})`))?.[1];
      const [js, css] = [entry("js"), entry("css")];
      if (js) {
        const rules = [
          "# بالای قاعده‌های SPA در public_html/.htaccess بگذار",
          "<IfModule mod_rewrite.c>",
          "RewriteEngine On",
          "RewriteCond %{REQUEST_FILENAME} !-f",
          `RewriteRule ^assets/index-[^/]+\\.js$ /assets/${js} [L]`,
          ...(css
            ? ["RewriteCond %{REQUEST_FILENAME} !-f", `RewriteRule ^assets/index-[^/]+\\.css$ /assets/${css} [L]`]
            : []),
          "</IfModule>",
        ];
        fs.writeFileSync(path.join(outDir, "htaccess-assets-fallback.txt"), `${rules.join("\n")}\n`);
      }
    },
  };
}
