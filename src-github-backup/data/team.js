// اعضای تیم آرانو.
// avatar: مسیر تصویر یا null (نمایش حرف اول نام).
// عکس‌ها را داخل public/images/team/ بگذارید (دایره‌ای و حدود ۲۵۶×۲۵۶ پیکسل).
// اگر فرمت عکس‌ها webp نیست، فقط پسوند همین مسیرها را عوض کنید.

export const TEAM = [
  {
    id: "frontend",
    name: "علی فراشیانی",
    role: "فرانت‌اند و فول‌استک",
    bio: "توسعه رابط‌های مدرن و تعاملی و اتصال بخش‌های مختلف محصول؛ با تمرکز بر تجربه کاربری، ساختار تمیز و اجرای کامل سمت وب.",
    avatar: "/images/team/ali.webp",
    skills: ["React", "JavaScript", "Express", "Node.js"],
    links: [
      { label: "گیت‌هاب", icon: "github", href: "https://github.com/alifarashiani1276" },
    ],
  },
  {
    id: "backend",
    name: "رضا نویدیان",
    role: "بک‌اند، دیتابیس و امنیت",
    bio: "پیاده‌سازی منطق سمت سرور، API و ساختار دیتابیس؛ با هدف ایجاد زیرساختی منظم، قابل اتکا و متناسب با نیاز پروژه.",
    avatar: "/images/team/reza.webp",
    skills: ["Backend", "API", "Database", "Security"],
    links: [], // فعلاً لینکی نمایش داده نمی‌شود
  },
  {
    id: "design",
    name: "اشکان آراد",
    role: "Figma، طراحی پوستر و گرافیک",
    bio: "طراحی رابط‌های بصری، صفحات Figma، پوستر و المان‌های گرافیکی برای اینکه پروژه فقط درست کار نکند، بلکه ظاهر حرفه‌ای و متمایز هم داشته باشد.",
    avatar: "/images/team/ashkan.webp",
    skills: ["Figma", "UI Design", "Poster", "Graphic"],
    links: [], // فعلاً لینکی نمایش داده نمی‌شود
  },
];