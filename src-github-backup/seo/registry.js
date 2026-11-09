// فهرست همه صفحه‌های قابل‌ایندکس سایت + اطلاعات Meta آن‌ها.
// هم در مرورگر (کامپوننت Seo) و هم هنگام Build (vite/seoPlugin.js: سایت‌مپ و Meta ثابت HTML) استفاده می‌شود؛
// پس فقط JS ساده است (بدون JSX).

import { SERVICE_PAGES } from "../data/servicePages.js";
import { BLOG_CATEGORIES, BLOG_POSTS } from "../data/blog.js";
import {
  BLOG_PATH,
  articlePath,
  categoryPath,
  getPublishedPosts,
} from "../lib/blog.js";

export const SITE_URL = "https://aranogroup.ir";
export const SITE_NAME = "آرانو";
export const OG_IMAGE = "/images/arano-hero-desktop.webp";

export const DEFAULT_DESCRIPTION =
  "آرانو، تیم حرفه‌ای توسعه نرم‌افزار؛ طراحی و ساخت وب‌اپلیکیشن، API و محصولات دیجیتال.";

const STATIC_PAGES = [
  {
    path: "/",
    kind: "home",
    h1: "آرانو؛ تیم توسعه نرم‌افزار",
    title: "آرانو | تیم توسعه نرم‌افزار",
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
    path: "/portfolio",
    kind: "page",
    h1: "نمونه‌کارهای آرانو",
    title: "نمونه‌کارها | آرانو",
    description:
      "گزیده‌ای از وب‌اپلیکیشن‌ها، سایت‌ها و داشبوردهایی که تیم آرانو طراحی و پیاده‌سازی کرده است.",
    priority: 0.8,
  },
  {
    path: "/about",
    kind: "page",
    h1: "درباره آرانو",
    title: "درباره ما | آرانو",
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
    title: "ارتباط با ما | آرانو",
    description:
      "ایده یا درخواست پروژه‌ات را برای آرانو بنویس؛ معمولاً ظرف یک روز کاری پاسخ می‌دهیم. ایمیل، تلفن و فرم تماس.",
    priority: 0.8,
  },
  {
    path: "/terms",
    kind: "page",
    h1: "قوانین و مقررات",
    title: "قوانین و مقررات | آرانو",
    description: "قوانین و مقررات استفاده از خدمات و وب‌سایت آرانو.",
    priority: 0.3,
  },
];

const SERVICE_ENTRIES = SERVICE_PAGES.map((p) => ({
  path: p.path,
  kind: "service",
  h1: p.name,
  title: `${p.name} | آرانو`,
  description: p.description,
  priority: p.group === "web-design" ? 0.7 : 0.8,
  service: p,
}));

// ───────── وبلاگ ─────────
// صفحه‌ی بدون مقاله (Empty State) یا دسته‌ی خالی => noindex و حذف از سایت‌مپ.
// به‌محض اضافه شدن مقاله به src/data/blog.js، همان صفحه خودکار ایندکس‌پذیر و وارد سایت‌مپ می‌شود.
const PUBLISHED_POSTS = getPublishedPosts(BLOG_POSTS);

const BLOG_CRUMBS = [
  { name: "خانه", path: "/" },
  { name: "وبلاگ‌ها", path: BLOG_PATH },
];

const BLOG_ENTRIES = [
  {
    path: BLOG_PATH,
    kind: "blog",
    h1: "وبلاگ آرانو",
    title: "وبلاگ آرانو | مقالات تخصصی توسعه نرم‌افزار و طراحی سایت",
    description:
      "مقاله‌های تخصصی آرانو درباره‌ی فرانت‌اند، بک‌اند، طراحی UI/UX، طراحی سایت، سئو و اجرای پروژه‌های نرم‌افزاری.",
    priority: 0.7,
    noindex: PUBLISHED_POSTS.length === 0,
    breadcrumbs: BLOG_CRUMBS,
  },
  ...BLOG_CATEGORIES.map((c) => ({
    path: categoryPath(c.slug),
    kind: "blog-category",
    h1: c.name,
    title: `${c.name} | وبلاگ آرانو`,
    description: c.description,
    priority: 0.6,
    noindex: !PUBLISHED_POSTS.some((p) => p.category === c.slug),
    breadcrumbs: [...BLOG_CRUMBS, { name: c.name, path: categoryPath(c.slug) }],
  })),
  ...PUBLISHED_POSTS.map((post) => ({
    ...articleMeta(post),
    priority: 0.6,
    noindex: false,
  })),
];

// Meta یک مقاله (هم برای رجیستری Build و هم برای صفحه‌ی مقاله در مرورگر)
export function articleMeta(post) {
  return {
    path: articlePath(post.slug),
    kind: "article",
    h1: post.title,
    title: `${post.title} | وبلاگ آرانو`,
    description: post.excerpt || DEFAULT_DESCRIPTION,
    article: post,
    breadcrumbs: getBlogBreadcrumbs(post),
  };
}

// مسیر Breadcrumb مقاله: خانه › وبلاگ‌ها › دسته › عنوان
export function getBlogBreadcrumbs(post) {
  const category = BLOG_CATEGORIES.find((c) => c.slug === post.category);
  return [
    ...BLOG_CRUMBS,
    ...(category
      ? [{ name: category.name, path: categoryPath(category.slug) }]
      : []),
    { name: post.title, path: articlePath(post.slug) },
  ];
}

export const ALL_PAGES = [...STATIC_PAGES, ...SERVICE_ENTRIES, ...BLOG_ENTRIES];

export const getPage = (path) => ALL_PAGES.find((p) => p.path === path);

export const absUrl = (path) =>
  path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;

// مسیر Breadcrumb: صفحه‌های وبلاگ مسیر خودشان را دارند؛ صفحه‌های خدمت: خانه › خدمات › نام صفحه
export const getBreadcrumbs = (page) =>
  page.breadcrumbs ?? [
    { name: "خانه", path: "/" },
    { name: "خدمات", path: "/services" },
    { name: page.h1, path: page.path },
  ];
