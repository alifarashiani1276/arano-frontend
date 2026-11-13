// فهرست همه صفحه‌های قابل‌ایندکس سایت + اطلاعات Meta آن‌ها.
// هم در مرورگر (کامپوننت Seo) و هم هنگام Build (vite/seoPlugin.js: سایت‌مپ و Meta ثابت HTML) استفاده می‌شود؛
// پس فقط JS ساده است (بدون JSX).

import { LANGS, localePath, stripLang } from "../i18n/config.js";
import { EN_BLOG_SEO, EN_SEO } from "../i18n/en/seo.js";
import { getBlogCategories, getServicePages } from "../i18n/text.js";
import { BLOG_PATH, articlePath, categoryPath, localizePost } from "../lib/blog.js";

export const SITE_URL = "https://aranogroup.ir";
export const SITE_NAME = "آرانو";
// نام انگلیسی برند (چند شرکت دیگر هم Arano Group نام دارند؛ برای تفکیک: Arano Web Studio)
export const SITE_NAME_EN = "Arano Web Studio";
export const siteName = (lang) =>
  lang === "en" ? SITE_NAME_EN : `${SITE_NAME} | ${SITE_NAME_EN}`;
export const OG_IMAGE = "/images/og-cover.jpg"; // ۱۲۰۰×۶۳۰

export const DEFAULT_DESCRIPTION =
  "آرانو، تیم حرفه‌ای توسعه نرم‌افزار؛ طراحی و ساخت وب‌اپلیکیشن، API و محصولات دیجیتال.";

const STATIC_PAGES = [
  {
    path: "/",
    kind: "home",
    h1: "آرانو؛ تیم توسعه نرم‌افزار",
    title: "آرانو | طراحی سایت و برندینگ | Arano Web Studio",
    description: DEFAULT_DESCRIPTION,
    priority: 1,
  },
  {
    path: "/services",
    kind: "hub",
    h1: "خدمات آرانو",
    title: "خدمات آرانو | طراحی سایت، فرانت‌اند، بک‌اند و UI/UX",
    description:
      "همه خدمات آرانو در یک نگاه: فرانت‌اند، بک‌اند و API، طراحی UI/UX، اجرای پروژه از ۰ تا ۱۰۰، طراحی انواع سایت و خدمات مکمل مثل سئو و پشتیبانی.",
    priority: 0.9,
  },
  {
    path: "/web-design",
    kind: "hub",
    h1: "طراحی سایت",
    title: "طراحی سایت | طراحی حرفه‌ای وب‌سایت و استراتژی رشد | آرانو",
    description:
      "طراحی حرفه‌ای سایت برای فروشگاه‌های آنلاین، سایت‌های شرکتی، لندینگ پیج، سایت‌های آموزشی، چندزبانه و پلتفرم‌های کسب‌وکار.",
    priority: 0.9,
  },
  {
    path: "/portfolio",
    kind: "page",
    h1: "نمونه‌کارهای آرانو",
    title: "نمونه‌کارها | آرانو | Arano Web Studio",
    description:
      "گزیده‌ای از وب‌اپلیکیشن‌ها، سایت‌ها و داشبوردهایی که تیم آرانو طراحی و پیاده‌سازی کرده است.",
    priority: 0.8,
  },
  {
    path: "/about",
    kind: "page",
    h1: "درباره آرانو",
    title: "درباره ما | آرانو | Arano Web Studio",
    description:
      "آرانو تیمی کوچک، متمرکز و حرفه‌ای است؛ با اصولی مثل ساده‌سازی پیش از ساخت، کیفیت قابل اندازه‌گیری و شفافیت در تمام مسیر.",
    priority: 0.7,
  },
  {
    path: "/team",
    kind: "page",
    h1: "تیم آرانو",
    title: "تیم آرانو | فرانت‌اند، بک‌اند و طراحی",
    description:
      "با اعضای تیم آرانو آشنا شوید: توسعه‌دهنده فرانت‌اند و فول‌استک، توسعه‌دهنده بک‌اند و دیتابیس و طراح رابط و گرافیک.",
    priority: 0.7,
  },
  {
    path: "/contact",
    kind: "page",
    h1: "ارتباط با آرانو",
    title: "ارتباط با ما | آرانو | Arano Web Studio",
    description:
      "ایده یا درخواست پروژه‌ات را برای آرانو بنویس؛ معمولاً ظرف یک روز کاری پاسخ می‌دهیم. ایمیل، تلفن و فرم تماس.",
    priority: 0.8,
  },
  {
    path: "/terms",
    kind: "page",
    h1: "قوانین و مقررات",
    title: "قوانین و مقررات | آرانو | Arano Web Studio",
    description: "قوانین و مقررات استفاده از خدمات و وب‌سایت آرانو.",
    priority: 0.3,
  },
];

const T = {
  fa: {
    home: "خانه",
    services: "خدمات",
    webDesign: "طراحی سایت",
    blog: "وبلاگ‌ها",
    brand: "آرانو | Arano Web Studio",
    blogBrand: "وبلاگ آرانو",
  },
  en: {
    home: "Home",
    services: "Services",
    webDesign: "Web Design",
    blog: "Blog",
    brand: "Arano Web Studio",
    blogBrand: "Arano Blog",
  },
};

const STATIC_BY_LANG = LANGS.flatMap((lang) =>
  STATIC_PAGES.map((p) => ({
    ...p,
    ...(lang === "en" ? EN_SEO[p.path] : {}),
    path: localePath(p.path, lang),
    lang,
    breadcrumbs:
      p.path === "/web-design"
        ? [
            { name: T[lang].home, path: localePath("/", lang) },
            { name: T[lang].webDesign, path: localePath("/web-design", lang) },
          ]
        : p.breadcrumbs,
  })),
);

const SERVICE_ENTRIES = LANGS.flatMap((lang) =>
  getServicePages(lang).map((p) => {
    const path = localePath(p.path, lang);
    return {
      path,
      lang,
      kind: "service",
      h1: p.name,
      // Title سئوکار (اگر در webDesignContent باشد) وگرنه «نام | برند»
      title: p.seoTitle || `${p.name} | ${T[lang].brand}`,
      description: p.description,
      priority: p.group === "web-design" ? 0.7 : 0.8,
      service: p,
      breadcrumbs: [
        { name: T[lang].home, path: localePath("/", lang) },
        { name: T[lang].services, path: localePath("/services", lang) },
        { name: p.name, path },
      ],
    };
  }),
);

// ───────── وبلاگ ─────────
// مقاله‌ها در دیتابیس لاراول‌اند و HTML ثابت صفحه‌های وبلاگ را لاراول می‌نویسد (نه این Build).
// پس صفحه‌های وبلاگ در ALL_PAGES (سایت‌مپ و HTML ثابت Build) نیستند؛ فقط برای مرورگر
// (Seo، Breadcrumb) و blog-config.json (BLOG_PAGES) لازم‌اند. noindex را صفحه خودش می‌دهد
// (BlogPage: وقتی مقاله‌ای نیست).
const blogCrumbs = (lang) => [
  { name: T[lang].home, path: localePath("/", lang) },
  { name: T[lang].blog, path: localePath(BLOG_PATH, lang) },
];

// مسیر Breadcrumb مقاله: خانه › وبلاگ‌ها › دسته › عنوان
export function getBlogBreadcrumbs(post, lang = "fa") {
  const category = getBlogCategories(lang).find((c) => c.slug === post.category);
  return [
    ...blogCrumbs(lang),
    ...(category
      ? [{ name: category.name, path: localePath(categoryPath(category.slug), lang) }]
      : []),
    { name: post.title, path: localePath(articlePath(post.slug), lang) },
  ];
}

// Meta یک مقاله (در مرورگر). قاعده‌ی عنوان قرارداد با بک‌اند: seoTitle اگر بود، وگرنه «{title} | {برند وبلاگ}».
// hreflang فقط وقتی نسخه‌ی انگلیسی دارد؛ بدون en هیچ hreflang ساخته نمی‌شود.
// article فقط فیلدهای لازم JSON-LD و OG را دارد (متن مقاله داخل meta نمی‌آید).
export function articleMeta(post, lang = "fa") {
  const base = articlePath(post.slug);
  return {
    path: localePath(base, lang),
    lang,
    kind: "article",
    h1: post.title,
    title: post.seoTitle?.trim() || `${post.title} | ${T[lang].blogBrand}`,
    description: post.excerpt || DEFAULT_DESCRIPTION,
    article: {
      slug: post.slug,
      title: post.title,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      author: post.author,
      cover: post.cover,
      faq: post.faq ?? [],
    },
    breadcrumbs: getBlogBreadcrumbs(post, lang),
    alternates: post.hasEn
      ? LANGS.map((l) => ({ lang: l, path: localePath(base, l) }))
      : [],
  };
}

export const LABELS = T;

const BLOG_ENTRIES = LANGS.flatMap((lang) => [
  {
    path: localePath(BLOG_PATH, lang),
    lang,
    kind: "blog",
    h1: lang === "en" ? "Arano Blog" : "وبلاگ آرانو",
    title:
      lang === "en"
        ? EN_BLOG_SEO.hubTitle
        : "وبلاگ آرانو | مقالات تخصصی توسعه نرم‌افزار و طراحی سایت",
    description:
      lang === "en"
        ? EN_BLOG_SEO.hubDescription
        : "مقاله‌های تخصصی آرانو درباره‌ی فرانت‌اند، بک‌اند، طراحی UI/UX، طراحی سایت، سئو و اجرای پروژه‌های نرم‌افزاری.",
    priority: 0.7,
    breadcrumbs: blogCrumbs(lang),
  },
  ...getBlogCategories(lang).map((c) => ({
    path: localePath(categoryPath(c.slug), lang),
    lang,
    kind: "blog-category",
    h1: c.name,
    title: `${c.name} | ${T[lang].blogBrand}`,
    description: c.description,
    priority: 0.6,
    breadcrumbs: [
      ...blogCrumbs(lang),
      { name: c.name, path: localePath(categoryPath(c.slug), lang) },
    ],
  })),
]);

// هر صفحه‌ی فارسی یک نسخه‌ی انگلیسی (/en/...) هم دارد؛ alternates برای hreflang است.
const withAlternates = (p) => ({
  ...p,
  alternates:
    p.alternates ??
    LANGS.map((l) => ({ lang: l, path: localePath(stripLang(p.path), l) })),
});

export const ALL_PAGES = [...STATIC_BY_LANG, ...SERVICE_ENTRIES].map(withAlternates);

// فقط برای مرورگر و blog-config.json؛ در سایت‌مپ و HTML ثابت Build نیست.
export const BLOG_PAGES = BLOG_ENTRIES.map(withAlternates);

export const getPage = (path, lang = "fa") => {
  const key = localePath(path, lang);
  return ALL_PAGES.find((p) => p.path === key) ?? BLOG_PAGES.find((p) => p.path === key);
};

// لینک داخلی مقاله (فیلد links) ← { path محلی‌شده, label نام صفحه } یا null.
// posts: خلاصه‌های مقاله (ترجیحاً localizeشده)؛ برای /blog/<slug> لازم است.
export function resolveInternalLink(path, lang = "fa", posts = []) {
  if (typeof path !== "string" || !path.startsWith("/")) return null;
  const base = stripLang(path.split(/[?#]/)[0]).replace(/(.)\/+$/, "$1");
  if (/^\/(admin|dashboard)(\/|$)/.test(base)) return null;

  const localized = localePath(base, lang);
  if (base === BLOG_PATH) {
    const hub = BLOG_PAGES.find((p) => p.kind === "blog" && p.lang === lang);
    return hub ? { path: localized, label: hub.h1 } : null;
  }
  const [, root, slug, extra] = base.split("/");
  if (root === BLOG_PATH.slice(1)) {
    if (!slug || extra !== undefined || slug === "category") return null;
    const post = localizePost(posts.find((p) => p.slug === slug), lang);
    return post?.title ? { path: localized, label: post.title } : null;
  }
  const page = ALL_PAGES.find((p) => p.path === localized);
  const label = page && (page.h1 || page.service?.name || page.name);
  return label ? { path: localized, label } : null;
}

export const absUrl = (path) =>
  path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;

// مسیر Breadcrumb: صفحه‌های وبلاگ مسیر خودشان را دارند؛ صفحه‌های خدمت: خانه › خدمات › نام صفحه
export const getBreadcrumbs = (page) =>
  page.breadcrumbs ?? [
    { name: "خانه", path: "/" },
    { name: "خدمات", path: "/services" },
    { name: page.h1, path: page.path },
  ];
