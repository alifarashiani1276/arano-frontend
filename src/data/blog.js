// داده‌ی وبلاگ: دسته‌بندی‌ها + فهرست مقاله‌ها.
// فقط JS ساده (بدون JSX) چون هم در مرورگر و هم هنگام Build (vite/seoPlugin.js) خوانده می‌شود.
//
// ── دسته‌بندی‌ها ──
// slug آدرس نهایی دسته است: /blog/category/<slug>  (بعد از انتشار تغییرش ندهید؛ بدون ریدایرکت ۳۰۱ رتبه می‌سوزد)
// name / short / description را آزادانه ویرایش کنید؛ UI و سئو خودکار هماهنگ می‌شوند.
//
// ── مقاله‌ها ──
// هر مقاله یک فایل جدا در src/data/blogArticles/ است (۱۰ مقاله‌ی بسته‌ی سئوکاری‌شده‌ی فارسی + English).
// برای افزودن مقاله‌ی جدید: یک فایل مثل بقیه بسازید و پایین همین فایل به BLOG_POSTS اضافه‌اش کنید.
// اگر BLOG_POSTS خالی شود، وبلاگ «Empty State» نشان می‌دهد (و Noindex است).
// کاور مقاله‌ها: تصویر ۱۶۹۰×۹۰۰ (WebP) با عنوان روی تصویر؛ قاب کارت و صفحه با همین نسبت است تا هیچ‌جا برش نخورد.
// ساختار هر مقاله:
//
//   {
//     slug: "article-slug",                 // آدرس: /blog/article-slug  (فقط حروف کوچک انگلیسی، عدد و -)
//     title: "...",
//     excerpt: "خلاصه‌ی ۱ تا ۲ جمله‌ای (Meta Description هم از همین می‌آید)",
//     category: "frontend",                  // یکی از slugهای پایین
//     tags: ["..."],
//     cover: { src: "/images/blog/x.webp", mobileSrc: "/images/blog/x-m.webp", alt: "..." },  // اختیاری
//     author: "نام نویسنده",                  // اختیاری
//     publishedAt: "2026-11-07",             // تاریخ انتشار (میلادی ISO)؛ تاریخ آینده = منتشر نمی‌شود
//     updatedAt: "2026-11-08",               // اختیاری
//     featured: false,                       // اختیاری
//     status: "published",                   // یا "draft" برای پنهان کردن
//     content: [                             // بلوک‌های متن:
//       { type: "p", text: "..." },          //   p | h2 | h3 | ul | ol | quote | image | code
//       { type: "h2", text: "..." },
//       { type: "ul", items: ["...", "..."] },
//       { type: "quote", text: "...", cite: "..." },
//       { type: "image", src: "/images/blog/y.webp", alt: "...", caption: "..." },
//       { type: "code", lang: "js", code: "..." },
//       { type: "table", head: ["..", ".."], rows: [["..", ".."]] },
//       { type: "checklist", items: ["..."] },   // ☐ چک‌لیست
//     ],                                      // ol هم می‌تواند start: 5 داشته باشد
//
//     // ── فیلدهای سئو (اختیاری) ──
//     seoTitle: "...| آرانو",                // Title صفحه (حداکثر ۶۰ کاراکتر)؛ اگر نباشد از title ساخته می‌شود
//     faq: [{ q: "...", a: "..." }],         // بخش سوالات متداول + Schema نوع FAQPage
//     links: ["/services/seo", "/blog/x"],   // لینک‌های داخلی؛ زیر مقاله نمایش داده می‌شوند
//     en: { title, seoTitle, excerpt, tags, coverAlt, content, faq },   // نسخه‌ی انگلیسی: /en/blog/<slug> + hreflang
//   }
//
// داخل متن بلوک‌ها: [متن لینک](/مسیر) برای لینک داخلی و **متن** برای پررنگ.

import seoFriendly from "./blogArticles/seo-friendly-website-design.js";
import seoForAi from "./blogArticles/seo-for-ai-overviews.js";
import wpVsCustom from "./blogArticles/wordpress-vs-custom-website.js";
import designCost from "./blogArticles/website-design-cost.js";
import onlineStore from "./blogArticles/online-store-website-guide.js";
import speedCwv from "./blogArticles/website-speed-core-web-vitals.js";
import corporateSeo from "./blogArticles/corporate-website-seo.js";
import designMistakes from "./blogArticles/web-design-mistakes.js";
import multilingualSeo from "./blogArticles/multilingual-website-seo.js";
import whatIsEeat from "./blogArticles/what-is-eeat.js";

export const BLOG_CATEGORIES = [
  {
    slug: "frontend",
    name: "توسعه فرانت‌اند",
    short: "React، رابط کاربری، عملکرد و تجربه‌ی مرورگر",
    description:
      "مقاله‌های تخصصی توسعه فرانت‌اند: ساخت رابط کاربری با React، معماری کامپوننت‌ها، بهینه‌سازی عملکرد و تجربه‌ی کاربری در مرورگر.",
  },
  {
    slug: "backend",
    name: "بک‌اند، API و دیتابیس",
    short: "Laravel، طراحی API، امنیت و پایگاه داده",
    description:
      "مقاله‌های تخصصی بک‌اند: طراحی API، احراز هویت و امنیت، معماری سرور و کار با پایگاه داده در پروژه‌های واقعی.",
  },
  {
    slug: "ui-ux",
    name: "طراحی UI/UX",
    short: "طراحی رابط، تجربه کاربری و هویت بصری",
    description:
      "مقاله‌های طراحی رابط و تجربه‌ی کاربری: اصول طراحی، سیستم طراحی، هویت بصری و تصمیم‌های طراحی در محصولات دیجیتال.",
  },
  {
    slug: "website-design",
    name: "طراحی سایت",
    short: "انتخاب، طراحی و راه‌اندازی انواع وب‌سایت",
    description:
      "مقاله‌هایی درباره‌ی طراحی و راه‌اندازی انواع وب‌سایت: شرکتی، فروشگاهی، شخصی، لندینگ و پورتال؛ از انتخاب مسیر تا اجرا.",
  },
  {
    slug: "seo",
    name: "سئو و بهینه‌سازی",
    short: "دیده‌شدن در گوگل و سئوی فنی سایت",
    description:
      "مقاله‌های سئو و بهینه‌سازی سایت: سئوی فنی، ساختار محتوا، دیده‌شدن در موتورهای جست‌وجو و اندازه‌گیری نتیجه.",
  },
  {
    slug: "performance",
    name: "سرعت و عملکرد",
    short: "سرعت بارگذاری، Core Web Vitals و پایداری",
    description:
      "مقاله‌های سرعت و عملکرد وب‌سایت: بهینه‌سازی بارگذاری، Core Web Vitals، کش و پایداری سرویس.",
  },
  {
    slug: "project-management",
    name: "مدیریت و اجرای پروژه",
    short: "از ایده تا استقرار، نگهداری و پشتیبانی",
    description:
      "مقاله‌های مدیریت و اجرای پروژه‌ی نرم‌افزاری: برآورد، فرایند همکاری، تحویل مرحله‌ای، استقرار و نگهداری.",
  },
];

export const BLOG_POSTS = [
  seoFriendly,
  seoForAi,
  wpVsCustom,
  designCost,
  onlineStore,
  speedCwv,
  corporateSeo,
  designMistakes,
  multilingualSeo,
  whatIsEeat,
];

// مقاله‌های بلاگ مرتبط با یک صفحه‌ی خدمت (برای بخش «مقاله‌های مرتبط» همان صفحه).
// از فیلد links هر مقاله ساخته می‌شود؛ پس لینک‌دهی مقاله ← خدمت و خدمت ← مقاله خودکار دوطرفه است.
export function blogLinksFor(path, now = Date.now()) {
  return BLOG_POSTS.filter(
    (p) =>
      p.links?.includes(path) &&
      (!p.status || p.status === "published") &&
      new Date(p.publishedAt).getTime() <= now,
  )
    .slice(0, 3)
    .map((p) => ({
      title: (p.seoTitle ?? p.title).replace(/\s*\|\s*آرانو$/, ""),
      href: `/blog/${p.slug}`,
    }));
}
