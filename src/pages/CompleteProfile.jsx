import { useState } from "react";
import { FiArrowLeft, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../features/auth/AuthLayout";

const initial = { first_name: "", last_name: "", email: "", bio: "" };

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  const change = (event) =>
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim()
    ) {
      setError("نام، نام خانوادگی و ایمیل را تکمیل کنید.");
      return;
    }
    // UI-only: later this form will POST to the Laravel profile endpoint.
    sessionStorage.setItem("arano_profile_draft", JSON.stringify(form));
    navigate("/auth/pending");
  };

  return (
    <AuthLayout
      step={3}
      title="اطلاعاتت را تکمیل کن"
      subtitle="چند اطلاعات ساده وارد کن تا حساب کاربری‌ات برای بررسی تیم آماده شود."
      onBack={() => navigate("/auth/otp")}
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["first_name", "نام", "مثلاً علی"],
            ["last_name", "نام خانوادگی", "مثلاً فراشیانی"],
          ].map(([name, label, placeholder]) => (
            <label key={name} className="block">
              <span className="mb-2 block text-sm font-bold">{label}</span>
              <div className="flex items-center rounded-2xl border border-border bg-surface-2 px-4 focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10">
                <FiUser className="text-muted" />
                <input
                  name={name}
                  value={form[name]}
                  onChange={change}
                  placeholder={placeholder}
                  className="h-14 w-full bg-transparent px-3 text-sm font-bold outline-none placeholder:text-muted/50"
                />
              </div>
            </label>
          ))}
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-bold">ایمیل</span>
          <input
            dir="ltr"
            type="email"
            name="email"
            value={form.email}
            onChange={change}
            placeholder="you@example.com"
            className="h-14 w-full rounded-2xl border border-border bg-surface-2 px-4 text-left text-sm font-bold outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold">
            درباره شما <span className="font-normal text-muted">(اختیاری)</span>
          </span>
          <textarea
            name="bio"
            value={form.bio}
            onChange={change}
            rows={4}
            placeholder="اگر دوست داری کمی درباره خودت بنویس..."
            className="w-full resize-none rounded-2xl border border-border bg-surface-2 p-4 text-sm leading-7 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
          />
        </label>

        {error && <p className="text-xs font-bold text-error">{error}</p>}

        <button
          type="submit"
          className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-black text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
        >
          ثبت اطلاعات و ارسال برای بررسی
          <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
        </button>

        <p className="text-center text-xs leading-6 text-muted">
          بعد از ثبت اطلاعات، حساب شما در وضعیت «در انتظار تأیید» قرار می‌گیرد.
        </p>
      </form>
    </AuthLayout>
  );
}
