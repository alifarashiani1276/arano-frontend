import { useEffect, useState } from "react";
import { FiArrowLeft, FiPhone } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../features/auth/AuthLayout";
import { authFlow } from "../features/auth/authFlow";
import useBotTrap from "../hooks/useBotTrap";
import { apiMessage } from "../lib/api";
import {
  MOBILE_REGEX,
  createLimiter,
  formatWait,
  normalizeDigits,
  normalizePhone,
} from "../lib/security";
import { sendOtp } from "../services/authService";
import Honeypot from "../ui/Honeypot";

// حداکثر ۵ درخواست کد در ۱۵ دقیقه؛ بعد از آن ۱۵ دقیقه قفل می‌شود
const otpRequestLimiter = createLimiter({
  key: "otp-request",
  max: 5,
  windowMs: 15 * 60 * 1000,
  lockMs: 15 * 60 * 1000,
});

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { onFocus, check } = useBotTrap(1500);

  // هر بار که کاربر به این صفحه می‌آید، فرآیند قبلی پاک می‌شود
  useEffect(() => {
    authFlow.reset();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (check(data.ref_code) === "honeypot") return;

    const value = normalizePhone(phone);
    if (!MOBILE_REGEX.test(value)) {
      setError("شماره موبایل را به‌صورت صحیح وارد کنید (مثلاً 09123456789).");
      return;
    }

    const gate = otpRequestLimiter.attempt();
    if (!gate.ok) {
      setError(
        `تعداد درخواست‌ها زیاد است. ${formatWait(gate.retryAfter)} دیگر دوباره تلاش کنید.`,
      );
      return;
    }

    setSubmitting(true);
    try {
      await sendOtp(value);
      authFlow.start(value);
      navigate("/auth/otp");
    } catch (err) {
      setError(apiMessage(err, "ارسال کد انجام نشد. لطفاً دوباره تلاش کنید."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      step={1}
      title="ورود یا ثبت‌نام"
      subtitle="شماره موبایلت را وارد کن تا کد تأیید برایت ارسال شود."
    >
      <form
        onSubmit={submit}
        onFocus={onFocus}
        noValidate
        aria-busy={submitting}
        className="relative space-y-6"
      >
        <Honeypot />

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
              name="phone"
              dir="ltr"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              spellCheck={false}
              maxLength={14}
              value={phone}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "phone-error" : undefined}
              onChange={(e) => {
                setPhone(
                  normalizeDigits(e.target.value)
                    .replace(/[^0-9+]/g, "")
                    .slice(0, 14),
                );
                setError("");
              }}
              placeholder="0912 345 6789"
              className="h-14 w-full bg-transparent text-left text-base font-bold outline-none placeholder:text-muted/60"
            />
          </div>
          {error && (
            <p
              id="phone-error"
              role="alert"
              className="mt-2 text-xs font-bold text-error"
            >
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-black text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          دریافت کد تأیید
          <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
        </button>

        <div className="rounded-2xl border border-border bg-surface-2 p-4 text-center text-xs leading-6 text-muted">
          کد تأیید فقط برای شماره‌ای که وارد می‌کنی ارسال خواهد شد.
        </div>

        <p className="text-center text-xs text-muted">
          مدیر آرا نو هستی؟{" "}
          <Link
            to="/auth/admin"
            className="font-bold text-primary transition hover:opacity-80"
          >
            ورود مدیران
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
