// خروجی گرفتن از مقاله‌های فایلی (src/data/blogArticles) برای واردکردن در دیتابیس لاراول.
//
//   npm run export:blog                  ← blog-posts.export.json در ریشه‌ی پروژه
//   node scripts/export-blog-json.mjs --out /مسیر/دلخواه.json
//
// خروجی: آرایه‌ای از مقاله‌ها دقیقاً به شکل قرارداد (camelCase، en: null | {...}).
// قبل از نوشتن، هر مقاله با قواعد قرارداد بررسی می‌شود؛ خطا = خروج با کد ۱ و بدون نوشتن فایل.
// این اسکریپت فقط می‌خواند و هیچ فایلی از پروژه را تغییر نمی‌دهد.

import { readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { BLOG_CATEGORIES } from "../src/data/blog.js";
import { estimateReadingMinutes } from "../src/lib/blog.js";

const root = resolve(fileURLToPath(import.meta.url), "../..");
const dir = resolve(root, "src/data/blogArticles");
const outArg = process.argv.indexOf("--out");
const outFile = resolve(root, outArg > -1 ? process.argv[outArg + 1] : "blog-posts.export.json");

const SLUG = /^[a-z0-9-]{1,100}$/;
const RAW_HTML = /<\/?[a-z][^>]*>/i;
const BAD_LINK = /\]\((?!\/|https?:\/\/)[^)]*\)/;
const categories = new Set(BLOG_CATEGORIES.map((c) => c.slug));

const errors = [];
const warnings = [];

const isText = (v) => typeof v === "string" && v.trim() !== "";
const textsOf = (b) => [b.text, b.cite, b.caption, ...(b.items ?? []), ...(b.head ?? []), ...(b.rows ?? []).flat()];

function checkBlocks(tag, blocks) {
  const err = (i, msg) => errors.push(`${tag} بلوک ${i + 1} (${blocks[i]?.type}): ${msg}`);
  if (!Array.isArray(blocks) || blocks.length === 0) return errors.push(`${tag}: content خالی است.`);

  blocks.forEach((b, i) => {
    switch (b.type) {
      case "p":
      case "h2":
      case "h3":
      case "quote":
        if (!isText(b.text)) err(i, "text خالی است.");
        break;
      case "ul":
      case "ol":
      case "checklist":
        if (!Array.isArray(b.items) || !b.items.length || !b.items.every(isText)) err(i, "items نامعتبر است.");
        if (b.type === "ol" && b.start != null && !Number.isInteger(b.start)) err(i, "start باید عدد صحیح باشد.");
        break;
      case "image":
        if (!isText(b.src)) err(i, "src خالی است.");
        if (!isText(b.alt)) err(i, "alt اجباری است.");
        break;
      case "code":
        if (typeof b.code !== "string" || !b.code.length) err(i, "code خالی است.");
        break;
      case "table":
        if (!Array.isArray(b.head) || !Array.isArray(b.rows)) err(i, "head/rows نامعتبر است.");
        else if (b.rows.some((r) => !Array.isArray(r) || r.length !== b.head.length)) err(i, "تعداد ستون ردیف‌ها با head برابر نیست.");
        break;
      default:
        err(i, "نوع بلوک مجاز نیست.");
    }

    if (b.type !== "code") {
      for (const t of textsOf(b).filter((x) => typeof x === "string")) {
        if (RAW_HTML.test(t)) err(i, `HTML خام مجاز نیست: «${t.slice(0, 40)}…»`);
        if (BAD_LINK.test(t)) err(i, `لینک باید با / یا https:// شروع شود: «${t.slice(0, 40)}…»`);
      }
    }
  });
}

function checkFaq(tag, faq) {
  (faq ?? []).forEach((f, i) => {
    if (!isText(f.q) || !isText(f.a)) errors.push(`${tag} faq ${i + 1}: سؤال یا جواب خالی است.`);
  });
}

function toContract(a, index) {
  const tag = a.slug ?? `#${index + 1}`;

  if (!SLUG.test(a.slug ?? "") || a.slug === "category") errors.push(`${tag}: slug نامعتبر یا رزرو است.`);
  if (!categories.has(a.category)) errors.push(`${tag}: دسته‌ی «${a.category}» در BLOG_CATEGORIES نیست.`);
  for (const f of ["title", "excerpt", "publishedAt"]) if (!isText(a[f])) errors.push(`${tag}: ${f} خالی است.`);
  if (!isText(a.cover?.src) || !isText(a.cover?.alt)) errors.push(`${tag}: کاور و alt آن اجباری است.`);
  if (Number.isNaN(Date.parse(a.publishedAt))) errors.push(`${tag}: publishedAt معتبر نیست.`);
  (a.links ?? []).forEach((l) => !String(l).startsWith("/") && errors.push(`${tag}: لینک داخلی «${l}» باید با / شروع شود.`));

  const len = a.excerpt?.length ?? 0;
  if (len < 120 || len > 160) warnings.push(`${tag}: excerpt ${len} کاراکتر است (بازه‌ی توصیه‌شده ۱۲۰ تا ۱۶۰).`);
  if ((a.seoTitle?.length ?? 0) > 60) warnings.push(`${tag}: seoTitle بیش از ۶۰ کاراکتر است.`);

  checkBlocks(tag, a.content);
  checkFaq(tag, a.faq);

  let en = null;
  if (a.en) {
    const etag = `${tag} (en)`;
    for (const f of ["title", "excerpt"]) if (!isText(a.en[f])) errors.push(`${etag}: ${f} خالی است.`);
    checkBlocks(etag, a.en.content);
    checkFaq(etag, a.en.faq);
    en = {
      title: a.en.title ?? "",
      seoTitle: a.en.seoTitle ?? "",
      excerpt: a.en.excerpt ?? "",
      tags: a.en.tags ?? [],
      coverAlt: a.en.coverAlt ?? "",
      content: a.en.content ?? [],
      faq: a.en.faq ?? [],
    };
  }

  return {
    id: index + 1,
    slug: a.slug,
    category: a.category,
    status: a.status === "draft" ? "draft" : "published",
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt ?? a.publishedAt,
    author: a.author ?? "",
    featured: Boolean(a.featured),
    title: a.title,
    seoTitle: a.seoTitle ?? "",
    excerpt: a.excerpt,
    tags: a.tags ?? [],
    cover: {
      src: a.cover?.src ?? "",
      ...(a.cover?.mobileSrc ? { mobileSrc: a.cover.mobileSrc } : {}),
      alt: a.cover?.alt ?? "",
    },
    content: a.content ?? [],
    faq: a.faq ?? [],
    links: a.links ?? [],
    readingMinutes: estimateReadingMinutes(a.content ?? []),
    // این مقاله‌ها قبلاً روی سایت منتشر شده‌اند؛ آدرسشان نباید تغییر کند.
    slugLocked: a.status !== "draft",
    en,
  };
}

const files = readdirSync(dir).filter((f) => f.endsWith(".js")).sort();
const articles = [];
for (const file of files) articles.push((await import(pathToFileURL(resolve(dir, file)).href)).default);

// جدیدترین اول؛ هم‌تاریخ‌ها به ترتیب slug (خروجی ثابت و قابل مقایسه)
articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug));

const slugs = new Set();
articles.forEach((a) => {
  if (slugs.has(a.slug)) errors.push(`${a.slug}: slug تکراری است.`);
  slugs.add(a.slug);
});

const posts = articles.map(toContract);

warnings.forEach((w) => console.warn(`هشدار: ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`خطا: ${e}`));
  console.error(`\n${errors.length} خطا؛ فایلی نوشته نشد.`);
  process.exit(1);
}

writeFileSync(outFile, `${JSON.stringify(posts, null, 2)}\n`);
const withEn = posts.filter((p) => p.en).length;
console.log(`${posts.length} مقاله (${withEn} مورد با نسخه‌ی en) نوشته شد: ${outFile}`);
