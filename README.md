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

مقاله‌های وبلاگ همیشه از API لاراول (`GET /blog/posts` و `/blog/posts/{slug}`) خوانده می‌شوند؛ حالت فایل و پرچم `VITE_BLOG_USE_API` حذف شده است.

## اسکریپت‌ها

- `npm run dev` اجرای سرور توسعه
- `npm run build` ساخت نسخهٔ نهایی
- `npm run preview` پیش‌نمایش نسخهٔ ساخته‌شده
- `npm run lint` بررسی کد با ESLint
- `npm test` تست‌ها (رفت‌وبرگشت بلوک‌های مقاله با TipTap، داده‌ی اولیه‌ی وبلاگ، قواعد سئوی مقاله)
- `npm run export:blog` خروجی `blog-posts.export.json` از ۱۰ مقاله‌ی فایلی (برای بک‌اند؛ فقط یک‌بار لازم است)

## ساختار پروژه

- `src/features/home` بخش‌های صفحهٔ اصلی
- `src/config/site.js` متن‌ها و تنظیمات سایت
- `src/data` داده‌های خدمات، تیم و نمونه‌کارها
- `src/theme` پالت رنگ و تم
- `src/ui` کامپوننت‌های عمومی
- `src/features/dashboard/blog` و `src/pages/dashboard/admin/Blog*.jsx` پنل مقاله‌ها (فقط در صفحه‌های lazy پنل لود می‌شوند؛ TipTap به بسته‌ی صفحه‌های عمومی اضافه نمی‌شود)
- `src/lib/blogBlocks.js` تبدیل بلوک‌های مقاله ↔ سند TipTap
- `src/lib/blogBoot.js` خواندن داده‌ی اولیه‌ی `#blog-boot` برای رندر بدون چشمک

## سئو و ساختار صفحه‌ها

- هر خدمت و هر نوع سایت یک صفحه مستقل دارد (`/services/...` و `/web-design/...`)؛ همه از یک قالب (`src/features/services/ServiceView.jsx`) ساخته می‌شوند.
- **تنها منبع داده‌ی صفحه‌های خدمت:** `src/data/servicePages.js` (نام/H1، توضیح، متن، FAQ، تکنولوژی، لینک‌های مرتبط). متن‌های فعلی نمونه (placeholder) هستند؛ متن نهایی فقط در همین فایل جایگزین می‌شود.
- Title، Description، canonical و Schema همه صفحه‌ها: `src/seo/registry.js` و `src/seo/schema.js`.
- هنگام `npm run build` پلاگین `vite/seoPlugin.js` برای هر صفحه یک `index.html` جدا با Meta/Schema اختصاصی و فایل `sitemap.xml` می‌سازد. **کل پوشه‌ی dist را آپلود کنید** (فایل‌های داخل زیرپوشه‌ها هم لازم‌اند) و `.htaccess` جدید را هم جایگزین کنید.
- آدرس‌ها بعد از انتشار نباید تغییر کنند؛ هر تغییر باید ریدایرکت ۳۰۱ داشته باشد.
- بعد از انتشار: `https://aranogroup.ir/sitemap.xml` را در Google Search Console ثبت کنید.

## وبلاگ (مدیریت از پنل)

مقاله‌ها در دیتابیس لاراول ذخیره می‌شوند و از `/admin/blog` ساخته و ویرایش می‌شوند؛ ویرایش فایل، build و دیپلوی لازم نیست. هیچ SSR، Node یا Next.js در کار نیست.

- **انتشار:** لاراول برای هر مقاله، لیست و دسته یک HTML ثابت کامل می‌نویسد (Title، Description، canonical، JSON-LD و متن مقاله داخل HTML). React بعد از لود همان صفحه را تعاملی می‌کند و برای اولین رندر از `<script id="blog-boot">` می‌خواند.
- **فایل‌هایی که build برای بک‌اند می‌سازد** (داخل `dist`): `blog-template.html`، `blog-config.json`، `sitemap.xml` (ایندکس) و `sitemap-pages.xml`. فایل `sitemap-blog.xml` و صفحه‌های `blog/` و `en/blog/` را بک‌اند می‌نویسد.
- **slug** بعد از اولین انتشار قفل می‌شود؛ پیش‌نویس هرگز عمومی نیست.
- **۱۰ مقاله‌ی اولیه:** پوشه‌ی `src/data/blogArticles/` فقط برای export و بکاپ نگه داشته شده و در سایت استفاده نمی‌شود. برای وارد کردن آن‌ها در دیتابیس: `npm run export:blog` و تحویل `blog-posts.export.json` به بک‌اند (اسکریپت قبل از نوشتن، قواعد قرارداد را بررسی می‌کند). کاورهای این مقاله‌ها در `public/images/blog/` می‌مانند.

## دیپلوی

۱. `npm run build`
۲. پوشه‌ی `dist` را زیپ کنید.
۳. زیپ را روی ریشه‌ی هاست extract کنید. **هیچ‌چیز را قبل از آن پاک نکنید** و این‌ها را حذف یا خالی نکنید: `uploads/`، `blog/`، `en/blog/` و `sitemap-blog.xml` (محتوای وبلاگ و تصویرهای آپلودشده‌اند). فایل `.htaccess` جدید جایگزین شود.
۴. در پنل، با حساب سوپرادمین روی «بازسازی صفحه‌های وبلاگ» بزنید. هر build نام فایل‌های JS و CSS را عوض می‌کند و صفحه‌های ثابت وبلاگ تا این مرحله به فایل‌های قبلی اشاره می‌کنند؛ پس فایل‌های قدیمی `assets/` را فوراً پاک نکنید و این مرحله را فراموش نکنید.
۵. بعد از دیپلوی: `https://aranogroup.ir/sitemap.xml` را در Google Search Console ثبت کنید (شامل `sitemap-pages.xml` و `sitemap-blog.xml`).

انتشار یا ویرایش مقاله نیاز به دیپلوی ندارد؛ دیپلوی فقط وقتی لازم است که کد فرانت تغییر کند.
