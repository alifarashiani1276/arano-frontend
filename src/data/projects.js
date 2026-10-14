// نمونه‌کارها.
// عکس‌ها داخل public/images/projects/ قرار می‌گیرند:
// image = عکس دسکتاپ (۷۶۸ پیکسل به بالا)، mobileImage = عکس موبایل (زیر ۷۶۸ پیکسل)
// url = لینک سایت زنده (با کلیک روی عکس/عنوان باز می‌شود)
// github = لینک ریپوی گیت‌هاب (دکمه‌ی زیر توضیحات)

export const PROJECTS = [
  {
    id: 1,
    title: "پلتفرم فریلنسری ",
    description:
      "وب‌سایت شخصی و نمونه‌کار فریلنسری با معرفی خدمات، پروژه‌ها و مسیر ارتباط مستقیم با کارفرما، همراه با بک‌اند اختصاصی دارای ۳ نقش کاربری (کارفرما، فریلنسر و ادمین) و مدیریت پروژه‌ها، پرداخت‌ها و پیام‌ها.",
    category: "web",
    categoryLabel: "وب‌سایت",
    technologies: [
      "React",
      "Node.js",
      "REST API",
      "MongoDB",
      "Tailwind CSS",
      "Vite",
    ],
    image: "/images/projects/freelance-desktop.webp",
    mobileImage: "/images/projects/freelance-mobile.webp",
    url: "https://alifarashiani.ir/",
    github: "https://github.com/alifarashiani1276/freelance-backend",
    year: "",
    featured: true,
  },
  {
    id: 2,
    title: "سفارش آنلاین غذا «سفره»",
    description:
      "وب‌سایت رستوران با منوی دسته‌بندی‌شده، سبد خرید و فرآیند ساده سفارش آنلاین غذا.",
    category: "restaurant",
    categoryLabel: "رستوران",
    technologies: ["React", "Tailwind", "laravel", "MySQL", "Vite"],
    image: "/images/projects/sofreh-desktop.webp",
    mobileImage: "/images/projects/sofreh-mobile.webp",
    url: "https://sofreh-restaurant.vercel.app/",
    github: "https://github.com/alifarashiani1276/sofreh-restaurant",
    year: "",
    featured: false,
  },
  {
    id: 3,
    title: "اپلیکیشن رزرو هتل",
    description:
      "وب‌اپلیکیشن رزرو هتل با جست‌وجوی اتاق‌ها، نمایش جزئیات و ثبت رزرو در یک تجربه روان روی مپ.",
    category: "booking",
    categoryLabel: "رزرو آنلاین",
    technologies: ["React", "Tailwind", "Vercel", "Node.js", "MongoDB"],
    image: "/images/projects/hotel-booking-desktop.webp",
    mobileImage: "/images/projects/hotel-booking-mobile.webp",
    url: "https://hotel-booking-9bduyu7ky-alifara.vercel.app/",
    github: "https://github.com/alifarashiani1276/hotel-booking-app",
    year: "",
    featured: false,
  },
  {
    id: 4,
    title: "وب‌سایت معرفی غذا",
    description:
      "این وبسایت نسخه ی javaScript خام سایت سفره میباشد که به سفارش کارفرما  بدون استفاده از هیچ کتابخانه و فریمورکی طراحی شده است.",
    category: "restaurant",
    categoryLabel: "رستوران",
    technologies: ["javaScript", "HTML", "CSS"],
    image: "/images/projects/food-website-desktop.webp",
    mobileImage: "/images/projects/food-website-mobile.webp",
    url: "https://food-website-lemon-seven.vercel.app/",
    github: "https://github.com/alifarashiani1276/food-website",
    year: "",
    featured: false,
  },
  {
    id: 5,
    title: "وب‌سایت فروشگاه کتاب",
    description:
      "این وبسایت نسخه ی javaScript  میباشد که به سفارش کارفرما  بدون استفاده از هیچ کتابخانه و فریمورکی طراحی شده است.",
    category: "bookstore",
    categoryLabel: "فروشگاه کتاب",
    technologies: ["javaScript", "HTML", "CSS"],
    image: "/images/projects/book-website-desktop.webp",
    mobileImage: "/images/projects/book-website-mobile.webp",
    url: "https://book-website-omega-two.vercel.app/",
    github: "https://github.com/alifarashiani1276/book-website",
    year: "",
    featured: false,
  },
];
