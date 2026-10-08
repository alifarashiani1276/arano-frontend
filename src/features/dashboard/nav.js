import {
  FiClock,
  FiFolder,
  FiGlobe,
  FiHome,
  FiLifeBuoy,
  FiMessageSquare,
  FiShield,
  FiUser,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

export const USER_NAV = [
  { to: "/dashboard", label: "نمای کلی", icon: FiHome, end: true },
  { to: "/dashboard/projects", label: "پروژه‌های من", icon: FiFolder },
  { to: "/dashboard/history", label: "تاریخچه", icon: FiClock },
  { to: "/dashboard/support", label: "پشتیبانی", icon: FiLifeBuoy },
  { to: "/dashboard/profile", label: "پروفایل", icon: FiUser },
];

export const ADMIN_NAV = [
  { to: "/admin", label: "نمای کلی", icon: FiHome, end: true },
  { to: "/admin/requests", label: "درخواست‌های کاربران", icon: FiUserCheck },
  { to: "/admin/users", label: "کاربران", icon: FiUsers },
  { to: "/admin/projects", label: "پروژه‌ها", icon: FiFolder },
  { to: "/admin/support", label: "پشتیبانی", icon: FiMessageSquare },
  { to: "/admin/history", label: "تاریخچه", icon: FiClock },
  { to: "/admin/consultations", label: "درخواست مشاوره", icon: FiGlobe },
  { to: "/admin/profile", label: "پروفایل", icon: FiUser },
  {
    to: "/admin/admins",
    label: "مدیریت مدیران",
    icon: FiShield,
    superOnly: true,
  },
  {
    to: "/admin/roles",
    label: "تغییر نقش کاربران",
    icon: FiUsers,
    superOnly: true,
  },
];
