// تمام متن‌ها، لینک‌ها و تنظیمات ثابت سایت اینجاست.
// برای تغییر لوگو فقط logo.src را مقدار بدهید، مثلاً: "/images/logo.svg"
// (فایل را داخل public/images بگذارید). Layout نیازی به تغییر ندارد.

export const site = {
  name: "آرا نو",
  slogan: "تیم توسعه نرم‌افزار",

  logo: {
    src: "/images/logo.svg",
    alt: "لوگوی آرا نو",
  },

  nav: [
    { label: "خدمات", href: "#services" },
    { label: "نمونه‌کارها", href: "#portfolio" },
    { label: "درباره ما", href: "#about" },
    { label: "تیم", href: "#team" },
    { label: "ارتباط با ما", href: "#contact" },
  ],

  cta: { label: "شروع پروژه", href: "#contact" },

  hero: {
    status: "پذیرای پروژه‌های جدید",
    titleLines: ["ایده‌ات را به", "محصول دیجیتال", "تبدیل می‌کنیم"],
    highlightLine: 1,
    description:
      "آرا نو تیمی سه‌نفره از توسعه‌دهنده فرانت‌اند، توسعه‌دهنده بک‌اند و طراح رابط و تجربه کاربری است. از طراحی تا استقرار، وب‌اپلیکیشن‌هایی سریع، پایدار و قابل‌رشد می‌سازیم.",
    primaryCta: { label: "مشاهده نمونه‌کارها", href: "#portfolio" },
    secondaryCta: { label: "گفتگو با تیم", href: "#contact" },
    // تصویر بالای صفحه: desktop برای عرض ۷۶۸ پیکسل به بالا، mobile برای گوشی
    // فایل‌ها را داخل public/images بگذارید.
    banner: {
      desktop: "/images/hero-desktop.webp",
      mobile: "/images/hero-mobile.webp",
      alt: "توسعه‌دهنده‌ی آرا نو در حال کدنویسی",
    },
    codeFile: "arano.config.js",
    // هر توکن: [متن, نوع]  |  k=کلمه کلیدی، s=رشته، f=تابع/نام، c=کامنت، p=ساده
    // این خط‌ها در Hero به‌صورت تایپ‌شونده نمایش داده می‌شوند.
    codeLines: [
      [["// آرا نو", "c"]],
      [
        ["const ", "k"],
        ["team ", "f"],
        ["= {", "p"],
      ],
      [
        ["  name: ", "p"],
        ['"Ara No"', "s"],
        [",", "p"],
      ],
      [
        ["  frontend: ", "p"],
        ['"React"', "s"],
        [",", "p"],
      ],
      [
        ["  backend: [", "p"],
        ['"Laravel"', "s"],
        [", ", "p"],
        ['"Node.js"', "s"],
        ["],", "p"],
      ],
      [
        ["  database: [", "p"],
        ['"MySQL"', "s"],
        [", ", "p"],
        ['"MongoDB"', "s"],
        ["],", "p"],
      ],
      [
        ["  design: ", "p"],
        ['"UI/UX"', "s"],
        [",", "p"],
      ],
      [["};", "p"]],
      [["", "p"]],
      [
        ["await ", "k"],
        ["ship", "f"],
        ["(", "p"],
        ["idea", "f"],
        ["); ", "p"],
        ["// ✓ deployed", "c"],
      ],
    ],
    chips: [
      { icon: "layers", label: "طراحی UI/UX", hint: "آماده تحویل" },
      { icon: "server", label: "API لاراول", hint: "۲۰۰ OK" },
    ],
  },

  marquee: [
    "React",
    "Tailwind CSS",
    "Laravel",
    "Node.js",
    "MySQL",
    "MongoDB",
    "TypeScript",
    "Figma",
    "Docker",
    "REST API",
    "Redis",
    "Vite",
  ],

  stats: [
    { value: "۳۰+", label: "پروژه تحویل‌شده" },
    { value: "۳", label: "متخصص هم‌افزا" },
    { value: "۴+", label: "سال تجربه تیمی" },
    { value: "۹۸٪", label: "رضایت مشتریان" },
  ],

  sections: {
    services: {
      eyebrow: "خدمات",
      title: "هر چه برای ساخت یک محصول دیجیتال لازم است",
      description:
        "از اولین طرح تا انتشار نسخه نهایی، هر مرحله را با استاندارد مهندسی و دقت طراحی پیش می‌بریم.",
    },
    portfolio: {
      eyebrow: "نمونه‌کارها",
      title: "پروژه‌هایی که با افتخار ساخته‌ایم",
      description:
        "گزیده‌ای از وب‌اپلیکیشن‌ها، داشبوردها و محصولات دیجیتالی که تیم آرا نو طراحی و پیاده‌سازی کرده است.",
    },
    about: {
      eyebrow: "درباره ما",
      title: "کوچک، متمرکز و حرفه‌ای",
    },
    team: {
      eyebrow: "تیم",
      title: "سه تخصص، یک هدف مشترک",
      description:
        "فرانت‌اند، بک‌اند و طراحی کنار هم کار می‌کنند تا هیچ شکافی بین ایده و محصول نهایی نماند.",
    },
    contact: {
      eyebrow: "ارتباط با ما",
      title: "پروژه بعدی‌ات را با هم بسازیم",
      description:
        "ایده‌ات را برایمان بنویس. معمولاً ظرف یک روز کاری پاسخ می‌دهیم.",
    },
  },

  about: {
    statement: [
      { text: "ما " },
      { text: "کد تمیز", strong: true },
      { text: "، " },
      { text: "طراحی دقیق", strong: true },
      { text: " و " },
      { text: "تحویل به‌موقع", strong: true },
      {
        text: " را کنار هم می‌گذاریم تا محصولی بسازیم که امروز درست کار کند و فردا هم ",
      },
      { text: "قابل رشد", strong: true },
      { text: " باشد." },
    ],
    principles: [
      {
        title: "ساده‌سازی پیش از ساخت",
        text: "قبل از نوشتن اولین خط کد، مسئله را شفاف می‌کنیم تا فقط چیزی بسازیم که واقعاً لازم است.",
      },
      {
        title: "کیفیت قابل اندازه‌گیری",
        text: "سرعت بارگذاری، دسترس‌پذیری و پایداری، معیارهایی هستند که برایشان عدد و هدف مشخص داریم.",
      },
      {
        title: "شفافیت در تمام مسیر",
        text: "گزارش منظم، دمو در هر مرحله و ارتباط مستقیم با تیم؛ بدون واسطه و بدون غافلگیری.",
      },
      {
        title: "ساخته‌شده برای رشد",
        text: "معماری تمیز و مستندسازی درست یعنی محصول شما با رشد کسب‌وکارتان، بدون بازنویسی بزرگ، بزرگ می‌شود.",
      },
    ],
  },

  contact: {
    items: [
      {
        icon: "mail",
        label: "ایمیل",
        value: "hello@example.com",
        href: "mailto:hello@example.com",
        ltr: true,
      },
      {
        icon: "phone",
        label: "تلفن",
        value: "۰۲۱-۰۰۰۰۰۰۰۰",
        href: "tel:+982100000000",
        ltr: true,
      },
      {
        icon: "pin",
        label: "موقعیت",
        value: "تهران، ایران",
        href: null,
        ltr: false,
      },
    ],
    form: {
      nameLabel: "نام و نام‌خانوادگی",
      namePlaceholder: "مثلاً علی احمدی",
      emailLabel: "ایمیل",
      emailPlaceholder: "you@example.com",
      messageLabel: "درباره پروژه",
      messagePlaceholder: "ایده یا نیازت را کوتاه توضیح بده...",
      submit: "ارسال پیام",
    },
    successMessage: "پیام شما ثبت شد. به‌زودی با شما تماس می‌گیریم.",
  },

  socials: [
    { id: "github", label: "گیت‌هاب", icon: "github", href: "#" },
    { id: "linkedin", label: "لینکدین", icon: "linkedin", href: "#" },
    { id: "instagram", label: "اینستاگرام", icon: "instagram", href: "#" },
    { id: "telegram", label: "تلگرام", icon: "send", href: "#" },
  ],

  footer: {
    slogan: "همیشه یک قدم جلوتر.",
    copyright: "© ۱۴۰۵ آرا نو. تمامی حقوق محفوظ است.",
  },
};
