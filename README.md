# آرا نو | Arano — Frontend

وب‌سایت معرفی «آرا نو»، تیم توسعه نرم‌افزار. فارسی و راست‌به‌چپ، ساخته‌شده با React، Vite و Tailwind CSS.

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
