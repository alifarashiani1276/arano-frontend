import { FiMessageCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

// دکمه ثابت «مشاوره رایگان» در همه صفحه‌های خدمت.
export default function StickyConsult() {
  return (
    <Link
      to="/contact"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
    >
      <FiMessageCircle size={17} aria-hidden="true" />
      مشاوره رایگان
    </Link>
  );
}
