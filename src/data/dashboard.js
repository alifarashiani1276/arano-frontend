// داده‌های آزمایشی (Mock) داشبوردها — فقط برای ساخت UI.
// وقتی بک‌اند آماده شد، هر export اینجا با پاسخ API جایگزین می‌شود.
// ساختار فیلدها عمداً مطابق مستندات بک‌اند (Laravel) نام‌گذاری شده است.

export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
};

export const ROLE_LABELS = {
  USER: "کاربر",
  ADMIN: "مدیر",
  SUPER_ADMIN: "مدیر ارشد",
};

// تُن رنگی هر وضعیت برای StatusBadge
export const STATUS_META = {
  project: {
    PENDING: { label: "در انتظار", tone: "warning" },
    IN_PROGRESS: { label: "در حال انجام", tone: "info" },
    COMPLETED: { label: "تکمیل‌شده", tone: "success" },
    CANCELLED: { label: "لغوشده", tone: "danger" },
  },
  account: {
    PENDING: { label: "در انتظار تأیید", tone: "warning" },
    APPROVED: { label: "تأییدشده", tone: "success" },
    REJECTED: { label: "ردشده", tone: "danger" },
  },
  active: {
    true: { label: "فعال", tone: "success" },
    false: { label: "غیرفعال", tone: "neutral" },
  },
  conversation: {
    OPEN: { label: "باز", tone: "info" },
    CLOSED: { label: "بسته", tone: "neutral" },
  },
  consultation: {
    UNANSWERED: { label: "پاسخ‌داده‌نشده", tone: "warning" },
    ANSWERED: { label: "پاسخ‌داده‌شده", tone: "success" },
  },
  role: {
    USER: { label: "کاربر", tone: "neutral" },
    ADMIN: { label: "مدیر", tone: "info" },
    SUPER_ADMIN: { label: "مدیر ارشد", tone: "success" },
  },
};

export const formatMoney = (n) => `${Number(n).toLocaleString("fa-IR")} تومان`;
export const formatNumber = (n) => Number(n).toLocaleString("fa-IR");

export const CATEGORIES = [
  { id: 1, name: "طراحی سایت شخصی" },
  { id: 2, name: "طراحی سایت سازمانی" },
];

export const TAGS = ["WordPress", "PHP", "Laravel", "فروشگاهی", "شرکتی"];

// کاربر وارد‌شده (فقط نمایشی)
export const MOCK_PROFILES = {
  USER: {
    first_name: "سارا",
    last_name: "احمدی",
    phone: "09121234567",
    email: "sara@example.com",
    bio: "مدیر یک فروشگاه آنلاین لوازم خانگی.",
    status: "APPROVED",
    is_active: true,
    role: "USER",
  },
  ADMIN: {
    first_name: "رضا",
    last_name: "کریمی",
    phone: "09127654321",
    email: "reza@arano.dev",
    bio: "مدیر پشتیبانی و بررسی درخواست‌ها.",
    status: "APPROVED",
    is_active: true,
    role: "ADMIN",
  },
  SUPER_ADMIN: {
    first_name: "علی",
    last_name: "رضایی",
    phone: "09120000000",
    email: "ali@arano.dev",
    bio: "مدیر ارشد آرا نو.",
    status: "APPROVED",
    is_active: true,
    role: "SUPER_ADMIN",
  },
};

export const MOCK_USER_PROJECTS = [
  {
    id: 1,
    title: "فروشگاه آنلاین لوازم خانگی",
    category_id: 2,
    budget: 45000000,
    deadline: "۱۴۰۵/۰۸/۱۵",
    status: "IN_PROGRESS",
    tags: ["Laravel", "فروشگاهی"],
    description: "فروشگاه با پنل مدیریت و درگاه پرداخت.",
  },
  {
    id: 2,
    title: "وب‌سایت شخصی و رزومه",
    category_id: 1,
    budget: 8000000,
    deadline: "۱۴۰۵/۰۷/۳۰",
    status: "COMPLETED",
    tags: ["WordPress"],
    description: "سایت شخصی با بخش نمونه‌کار.",
  },
  {
    id: 3,
    title: "سایت معرفی شرکت",
    category_id: 2,
    budget: 22000000,
    deadline: "۱۴۰۵/۰۹/۱۰",
    status: "PENDING",
    tags: ["شرکتی", "PHP"],
    description: "سایت معرفی خدمات و تیم شرکت.",
  },
  {
    id: 4,
    title: "بلاگ تخصصی",
    category_id: 1,
    budget: 6000000,
    deadline: "۱۴۰۵/۰۶/۲۰",
    status: "CANCELLED",
    tags: ["WordPress"],
    description: "بلاگ با سیستم نظرات.",
  },
];

export const MOCK_ADMIN_PROJECTS = [
  {
    id: 11,
    user: "سارا احمدی",
    title: "فروشگاه آنلاین لوازم خانگی",
    category: "طراحی سایت سازمانی",
    budget: 45000000,
    deadline: "۱۴۰۵/۰۸/۱۵",
    status: "IN_PROGRESS",
    tags: ["Laravel", "فروشگاهی"],
  },
  {
    id: 12,
    user: "محمد حسینی",
    title: "سایت معرفی کلینیک",
    category: "طراحی سایت سازمانی",
    budget: 30000000,
    deadline: "۱۴۰۵/۰۹/۰۱",
    status: "PENDING",
    tags: ["شرکتی"],
  },
  {
    id: 13,
    user: "نگار موسوی",
    title: "پورتفولیوی عکاسی",
    category: "طراحی سایت شخصی",
    budget: 9000000,
    deadline: "۱۴۰۵/۰۷/۲۵",
    status: "COMPLETED",
    tags: ["WordPress"],
  },
  {
    id: 14,
    user: "امیر صادقی",
    title: "سامانه رزرو آنلاین",
    category: "طراحی سایت سازمانی",
    budget: 60000000,
    deadline: "۱۴۰۵/۱۰/۱۰",
    status: "PENDING",
    tags: ["Laravel", "PHP"],
  },
  {
    id: 15,
    user: "لیلا نوری",
    title: "وب‌سایت مشاور املاک",
    category: "طراحی سایت شخصی",
    budget: 12000000,
    deadline: "۱۴۰۵/۰۶/۱۵",
    status: "CANCELLED",
    tags: ["PHP"],
  },
];

export const MOCK_REQUESTS = [
  {
    id: 101,
    first_name: "محمد",
    last_name: "حسینی",
    phone: "09131112233",
    email: "m.hosseini@example.com",
    created_at: "۱۴۰۵/۰۷/۱۰",
    status: "PENDING",
  },
  {
    id: 102,
    first_name: "نگار",
    last_name: "موسوی",
    phone: "09352223344",
    email: "negar@example.com",
    created_at: "۱۴۰۵/۰۷/۰۹",
    status: "PENDING",
  },
  {
    id: 103,
    first_name: "امیر",
    last_name: "صادقی",
    phone: "09193334455",
    email: "amir.s@example.com",
    created_at: "۱۴۰۵/۰۷/۰۸",
    status: "PENDING",
  },
  {
    id: 104,
    first_name: "لیلا",
    last_name: "نوری",
    phone: "09124445566",
    email: "leila@example.com",
    created_at: "۱۴۰۵/۰۷/۰۵",
    status: "APPROVED",
  },
  {
    id: 105,
    first_name: "پویا",
    last_name: "کاظمی",
    phone: "09105556677",
    email: "pouya@example.com",
    created_at: "۱۴۰۵/۰۷/۰۱",
    status: "REJECTED",
  },
];

export const MOCK_ADMINS = [
  {
    id: 1,
    first_name: "علی",
    last_name: "رضایی",
    phone: "09120000000",
    email: "ali@arano.dev",
    role: "SUPER_ADMIN",
    is_active: true,
  },
  {
    id: 2,
    first_name: "رضا",
    last_name: "کریمی",
    phone: "09127654321",
    email: "reza@arano.dev",
    role: "ADMIN",
    is_active: true,
  },
  {
    id: 3,
    first_name: "مریم",
    last_name: "یوسفی",
    phone: "09136665544",
    email: "maryam@arano.dev",
    role: "ADMIN",
    is_active: false,
  },
];

export const MOCK_USERS = [
  {
    id: 201,
    first_name: "سارا",
    last_name: "احمدی",
    phone: "09121234567",
    role: "USER",
    status: "APPROVED",
  },
  {
    id: 202,
    first_name: "نگار",
    last_name: "موسوی",
    phone: "09352223344",
    role: "USER",
    status: "APPROVED",
  },
  {
    id: 203,
    first_name: "رضا",
    last_name: "کریمی",
    phone: "09127654321",
    role: "ADMIN",
    status: "APPROVED",
  },
  {
    id: 204,
    first_name: "علی",
    last_name: "رضایی",
    phone: "09120000000",
    role: "SUPER_ADMIN",
    status: "APPROVED",
  },
];

export const MOCK_CONVERSATIONS = [
  {
    id: 1,
    subject: "زمان تحویل مرحله اول",
    user: "سارا احمدی",
    status: "OPEN",
    updated_at: "امروز ۱۰:۲۰",
    messages: [
      {
        id: 1,
        from: "USER",
        text: "سلام، زمان تحویل مرحله اول پروژه فروشگاه مشخص شده؟",
        time: "۰۹:۵۰",
      },
      {
        id: 2,
        from: "ADMIN",
        text: "سلام؛ مرحله اول تا پایان هفته آینده تحویل داده می‌شود.",
        time: "۱۰:۲۰",
      },
    ],
  },
  {
    id: 2,
    subject: "تغییر در بودجه پروژه",
    user: "امیر صادقی",
    status: "OPEN",
    updated_at: "دیروز",
    messages: [
      {
        id: 1,
        from: "USER",
        text: "امکان افزودن بخش رزرو آنلاین به همین بودجه هست؟",
        time: "۱۶:۰۵",
      },
    ],
  },
  {
    id: 3,
    subject: "مشکل در ورود",
    user: "لیلا نوری",
    status: "CLOSED",
    updated_at: "۳ روز پیش",
    messages: [
      { id: 1, from: "USER", text: "کد تأیید دیر می‌رسد.", time: "۱۱:۰۰" },
      {
        id: 2,
        from: "ADMIN",
        text: "مشکل برطرف شد؛ لطفاً دوباره تلاش کنید.",
        time: "۱۱:۳۰",
      },
    ],
  },
];

export const MOCK_HISTORY = [
  {
    id: 1,
    icon: "project",
    text: "پروژه «فروشگاه آنلاین لوازم خانگی» به وضعیت «در حال انجام» تغییر کرد.",
    time: "امروز ۱۰:۰۰",
  },
  {
    id: 2,
    icon: "chat",
    text: "پیام جدیدی در گفتگوی «زمان تحویل مرحله اول» دریافت شد.",
    time: "امروز ۰۹:۵۰",
  },
  {
    id: 3,
    icon: "project",
    text: "پروژه «سایت معرفی شرکت» ثبت شد.",
    time: "۲ روز پیش",
  },
  {
    id: 4,
    icon: "profile",
    text: "اطلاعات پروفایل ویرایش شد.",
    time: "۵ روز پیش",
  },
  {
    id: 5,
    icon: "account",
    text: "حساب شما توسط مدیر تأیید شد.",
    time: "۱ هفته پیش",
  },
];

export const MOCK_ADMIN_STATS = {
  users: { total: 128, pending: 3, approved: 119, rejected: 6 },
  projects: {
    total: 54,
    pending: 9,
    in_progress: 17,
    completed: 24,
    cancelled: 4,
  },
  open_conversations: 5,
};
