import { useState } from "react";
import { FiArrowLeft, FiPhone } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../features/auth/AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const value = phone.replace(/\s/g, "");
    if (!/^09\d{9}$/.test(value) && !/^\+989\d{9}$/.test(value)) {
      setError("شماره موبایل را به‌صورت صحیح وارد کنید.");
      return;
    }
    sessionStorage.setItem("arano_auth_phone", value);
    navigate("/auth/otp");
  };

  return (
    <AuthLayout
      step={1}
      title="ورود یا ثبت‌نام"
      subtitle="شماره موبایلت را وارد کن تا کد تأیید برایت ارسال شود."
    >
      <form onSubmit={submit} className="space-y-6">
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-bold">
            شماره موبایل
          </label>
          <div
            className={`flex items-center gap-3 rounded-2xl border bg-surface-2 px-4 transition focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10 ${error ? "border-error" : "border-border"}`}
          >
            <FiPhone className="shrink-0 text-muted" />
            <input
              id="phone"
              dir="ltr"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/[^0-9+]/g, ""));
                setError("");
              }}
              placeholder="0912 345 6789"
              className="h-14 w-full bg-transparent text-left text-base font-bold outline-none placeholder:text-muted/60"
            />
          </div>
          {error && (
            <p className="mt-2 text-xs font-bold text-error">{error}</p>
          )}
        </div>

        <button
          type="submit"
          className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-black text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0"
        >
          دریافت کد تأیید
          <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
        </button>

        <div className="rounded-2xl border border-border bg-surface-2 p-4 text-center text-xs leading-6 text-muted">
          کد تأیید فقط برای شماره‌ای که وارد می‌کنی ارسال خواهد شد.
        </div>
      </form>
    </AuthLayout>
  );
}
