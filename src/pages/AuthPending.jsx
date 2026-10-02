import { FiClock, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";
import Logo from "../ui/Logo";

export default function AuthPending() {
  return (
    <main dir="rtl" className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-5 py-12">
        <div className="w-full rounded-[28px] border border-border bg-surface p-8 text-center shadow-lg sm:p-10">
          <Logo className="mx-auto justify-center" />
          <div className="mx-auto mt-10 grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary">
            <FiClock size={34} />
          </div>
          <h1 className="mt-7 text-2xl font-black sm:text-3xl">
            درخواستت با موفقیت ثبت شد
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-8 text-muted">
            اطلاعاتت برای بررسی تیم آرا نو ارسال شد. بعد از تأیید حساب، امکان
            ورود به داشبورد و مدیریت پروژه‌ها برایت فعال می‌شود.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 font-black text-primary-foreground hover:opacity-90"
          >
            <FiHome /> بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </main>
  );
}
