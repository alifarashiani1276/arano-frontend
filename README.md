# آرانو | Arano — Frontend

وب‌سایت معرفی «آرانو»، تیم توسعه نرم‌افزار. فارسی و راست‌به‌چپ، ساخته‌شده با React، Vite و Tailwind CSS.

## راه‌اندازی

```bash
git clone https://github.com/alifarashiani1276/arano-frontend.git
cd arano-frontend
npm install
cp .env.example .env.development.local
npm run dev
```

سرور توسعه روی `http://localhost:3000` اجرا می‌شود.

## متغیرهای محیطی

| متغیر           | توضیح                                                         |
| --------------- | ------------------------------------------------------------- |
| `VITE_BASE_URL` | آدرس API بک‌اند                                               |
| `VITE_USE_MOCK` | اگر `true` باشد نمونه‌کارها از داده‌های آزمایشی خوانده می‌شود |

## اسکریپت‌ها

- `npm run dev` اجرای سرور توسعه
- `npm run build` ساخت نسخهٔ نهایی
- `npm run preview` پیش‌نمایش نسخهٔ ساخته‌شده
- `npm run lint` بررسی کد با ESLint

## ساختار پروژه

- `src/features/home` بخش‌های صفحهٔ اصلی
- `src/config/site.js` متن‌ها و تنظیمات سایت
- `src/data` داده‌های خدمات، تیم و نمونه‌کارها
- `src/theme` پالت رنگ و تم
- `src/ui` کامپوننت‌های عمومی

## سئو و ساختار صفحه‌ها

- هر خدمت و هر نوع سایت یک صفحه مستقل دارد (`/services/...` و `/web-design/...`)؛ همه از یک قالب (`src/features/services/ServiceView.jsx`) ساخته می‌شوند.
- **تنها منبع داده‌ی صفحه‌های خدمت:** `src/data/servicePages.js` (نام/H1، توضیح، متن، FAQ، تکنولوژی، لینک‌های مرتبط). متن‌های فعلی نمونه (placeholder) هستند؛ متن نهایی فقط در همین فایل جایگزین می‌شود.
- Title، Description، canonical و Schema همه صفحه‌ها: `src/seo/registry.js` و `src/seo/schema.js`.
- هنگام `npm run build` پلاگین `vite/seoPlugin.js` برای هر صفحه یک `index.html` جدا با Meta/Schema اختصاصی و فایل `sitemap.xml` می‌سازد. **کل پوشه‌ی dist را آپلود کنید** (فایل‌های داخل زیرپوشه‌ها هم لازم‌اند) و `.htaccess` جدید را هم جایگزین کنید.
- آدرس‌ها بعد از انتشار نباید تغییر کنند؛ هر تغییر باید ریدایرکت ۳۰۱ داشته باشد.
- بعد از انتشار: `https://aranogroup.ir/sitemap.xml` را در Google Search Console ثبت کنید.

## بسته‌ی ۱۰ مقاله‌ی وبلاگ (فارسی + English)

- هر مقاله یک فایل در `src/data/blogArticles/` است و در `src/data/blog.js` (آرایه‌ی `BLOG_POSTS`) ثبت شده. نسخه‌ی انگلیسی داخل فیلد `en` همان فایل است و در `/en/blog/<slug>` با hreflang منتشر می‌شود.
- Title/Meta/Schema (Article + FAQPage + BreadcrumbList)، hreflang و سایت‌مپ خودکار ساخته می‌شوند.
- لینک‌دهی داخلی دوطرفه است: فیلد `links` هر مقاله هم زیر مقاله و هم در «مقاله‌های مرتبط» صفحه‌ی خدمت مربوط نمایش داده می‌شود.
- عکس‌های شاخص فعلی موقت‌اند (`public/images/blog/<slug>-arano-16x9.webp`)؛ با عکس واقعی و **همان نام فایل** جایگزین کنید.
- جاهایی که در PDF علامت `[...]` داشت (نمونه‌کار/عدد واقعی آرانو) حذف شده و با کامنت `TODO(E-E-A-T)` یا `TODO(قیمت)` داخل فایل هر مقاله مشخص شده است.
