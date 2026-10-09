import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiKey,
  FiLock,
  FiPhone,
  FiRefreshCw,
  FiShield,
} from "react-icons/fi";
import Logo from "../ui/Logo";
import ThemeSwitcher from "../features/home/ThemeSwitcher";
import { getSessionArea, useSession } from "../features/auth/session";
import { tokenStore } from "../features/auth/token";
import {
  Field,
  FormMessage,
  Stepper,
  SubmitButton,
} from "../features/auth/AdminAuthUi";
import {
  INPUT,
  OTP_BOX,
  PASSWORD_RULES,
} from "../features/auth/adminAuthShared";
import { apiMessage, statusOf } from "../lib/api";
import {
  MOBILE_REGEX,
  createLimiter,
  formatWait,
  maskPhone,
  normalizeDigits,
  normalizePhone,
} from "../lib/security";
import {
  adminForgotPasswordSendOtp,
  adminForgotPasswordVerifyOtp,
  adminResetPassword,
} from "../services/authService";

// ---------------------------------------------------------------------------
// مراحل بازیابی رمز مدیر (مطابق AdminAuthController):
//   phone -> otp -> password
//   1) POST /admin/auth/forgot-password/send-otp
//   2) POST /admin/auth/forgot-password/verify-otp   => reset_token (۵ دقیقه)
//   3) POST /admin/auth/forgot-password/reset        (با Bearer reset_token)
// بعد از موفقیت، همه‌ی توکن‌های مدیر در بک‌اند باطل می‌شود و باید دوباره با
// «شماره + کد تأیید + رمز جدید» وارد شود.
// ---------------------------------------------------------------------------

const OTP_LENGTH = 6;
const RESEND_SECONDS = 120;
const MAX_FAILURES = 5;
const LOCK_SECONDS = 600; // بک‌اند: ۵ تلاش در ۱۰ دقیقه
const DEFAULT_RESET_SECONDS = 300; // اعتبار توکن بازیابی: ۵ دقیقه

// بک‌اند: حداکثر ۳ درخواست کد در ۱۰ دقیقه برای هر شماره
const sendLimiter = createLimiter({
  key: "admin-reset-otp-request",
  max: 3,
  windowMs: 10 * 60 * 1000,
  lockMs: 10 * 60 * 1000,
});

export default function AdminForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionUser = useSession();

  const [step, setStep] = useState("phone"); // phone | otp | password
  const [phone, setPhone] = useState(() => {
    const given = location.state?.phone;
    return typeof given === "string" && MOBILE_REGEX.test(given) ? given : "";
  });
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // توکن بازیابی فقط در حافظه‌ی همین صفحه می‌ماند (نه Storage)
  const [resetToken, setResetToken] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [failures, setFailures] = useState(0);

  const [now, setNow] = useState(() => Date.now());
  const [resendAt, setResendAt] = useState(0);
  const [resetEnds, setResetEnds] = useState(0);
  const [lockUntil, setLockUntil] = useState(0);

  const secondsLeft = (ts) => Math.max(0, Math.ceil((ts - now) / 1000));
  const resendLeft = secondsLeft(resendAt);
  const resetLeft = secondsLeft(resetEnds);
  const lockLeft = secondsLeft(lockUntil);
  const locked = lockLeft > 0;

  const resetExpired = step === "password" && resetEnds > 0 && now >= resetEnds;

  // شروع دوباره از مرحله‌ی شماره
  const restart = useCallback((message = "") => {
    setStep("phone");
    setOtp("");
    setPassword("");
    setConfirmation("");
    setShowPassword(false);
    setFieldErrors({});
    setResetToken("");
    setResetEnds(0);
    setFailures(0);
    setError(message);
  }, []);

  useEffect(() => {
    if (step === "phone") return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (resetExpired) {
      restart("مهلت ثبت رمز جدید تمام شد. دوباره کد تأیید دریافت کنید.");
    }
  }, [resetExpired, restart]);

  // مدیری که از قبل وارد شده، مستقیم به پنل می‌رود
  if (
    sessionUser &&
    getSessionArea(sessionUser) === "admin" &&
    tokenStore.get()
  ) {
    return <Navigate to="/admin" replace />;
  }

  const registerFailure = (message) => {
    const next = failures + 1;
    if (next >= MAX_FAILURES) {
      lockForTooMany();
    } else {
      setFailures(next);
      setError(
        `${message} ${(MAX_FAILURES - next).toLocaleString("fa-IR")} تلاش باقی مانده است.`,
      );
    }
  };

  function lockForTooMany() {
    setFailures(0);
    setLockUntil(Date.now() + LOCK_SECONDS * 1000);
    setNow(Date.now());
    setError("");
    setOtp("");
  }

  // ---------- مرحله ۱: شماره ----------
  const requestCode = async (target) => {
    const gate = sendLimiter.attempt();
    if (!gate.ok) {
      setError(
        `تعداد درخواست‌ها زیاد است. ${formatWait(gate.retryAfter)} دیگر دوباره تلاش کنید.`,
      );
      return false;
    }

    try {
      await adminForgotPasswordSendOtp(target);
      setResendAt(Date.now() + RESEND_SECONDS * 1000);
      setNow(Date.now());
      return true;
    } catch (err) {
      setError(apiMessage(err, "ارسال کد انجام نشد. دوباره تلاش کنید."));
      return false;
    }
  };

  const submitPhone = async (event) => {
    event.preventDefault();
    if (busy) return;

    const value = normalizePhone(phone);
    if (!MOBILE_REGEX.test(value)) {
      setError("شماره موبایل را به‌صورت صحیح وارد کنید (مثلاً 09123456789).");
      return;
    }

    setBusy(true);
    setError("");

    const ok = await requestCode(value);
    setBusy(false);

    // بک‌اند برای همه‌ی شماره‌ها پاسخ یکسان می‌دهد (افشا نشدن وجود حساب)
    if (ok) {
      setPhone(value);
      setOtp("");
      setFailures(0);
      setStep("otp");
    }
  };

  // ---------- مرحله ۲: کد تأیید ----------
  const submitOtp = async (event) => {
    event.preventDefault();
    if (busy || locked || otp.length !== OTP_LENGTH) return;

    setBusy(true);
    setError("");

    try {
      const data = await adminForgotPasswordVerifyOtp(phone, otp);

      if (!data.reset_token) throw new Error("reset token missing");

      setResetToken(data.reset_token);
      setResetEnds(
        Date.now() + (data.expires_in ?? DEFAULT_RESET_SECONDS) * 1000,
      );
      setNow(Date.now());
      setFailures(0);
      setOtp("");
      setStep("password");
    } catch (err) {
      const code = statusOf(err);
      setOtp("");

      if (code === 422) {
        registerFailure("کد واردشده صحیح نیست یا منقضی شده است.");
      } else if (code === 429) {
        lockForTooMany();
      } else {
        setError(apiMessage(err, "تأیید کد انجام نشد. دوباره تلاش کنید."));
      }
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (busy || locked || resendLeft > 0) return;

    setBusy(true);
    setError("");
    const ok = await requestCode(phone);
    setBusy(false);

    if (ok) {
      setOtp("");
      setFailures(0);
    }
  };

  // ---------- مرحله ۳: رمز جدید ----------
  const submitPassword = async (event) => {
    event.preventDefault();
    if (busy) return;

    const errors = {};
    if (!PASSWORD_RULES.every((rule) => rule.test(password))) {
      errors.password = "رمز عبور همه‌ی شرایط را ندارد.";
    }
    if (password !== confirmation) {
      errors.password_confirmation = "تکرار رمز عبور یکسان نیست.";
    }

    setFieldErrors(errors);
    const firstInvalid = Object.keys(errors)[0];
    if (firstInvalid) {
      event.currentTarget.elements[firstInvalid]?.focus();
      return;
    }

    setBusy(true);
    setError("");

    try {
      await adminResetPassword(
        { password, password_confirmation: confirmation },
        resetToken,
      );

      // همه‌ی توکن‌های مدیر در بک‌اند باطل شده؛ مدیر باید دوباره وارد شود
      navigate("/auth/admin", {
        replace: true,
        state: {
          notice:
            "رمز عبور با موفقیت تغییر کرد. با شماره‌ی خود و رمز جدید وارد شوید.",
        },
      });
    } catch (err) {
      const code = statusOf(err);

      if (code === 401 || code === 403) {
        restart(
          "مهلت ثبت رمز جدید تمام شده یا توکن بازیابی معتبر نیست. دوباره کد تأیید دریافت کنید.",
        );
      } else if (code === 422 && err.response?.data?.errors) {
        const raw = err.response.data.errors;
        const next = {};

        if (raw.password?.[0]) {
          next.password =
            "رمز عبور شرایط لازم را ندارد یا با تکرار آن یکسان نیست.";
        }
        if (raw.password_confirmation?.[0]) {
          next.password_confirmation = "تکرار رمز عبور معتبر نیست.";
        }

        if (Object.keys(next).length) {
          setFieldErrors(next);
        } else {
          setError("اطلاعات واردشده معتبر نیست.");
        }
      } else {
        // شامل 409 (درخواست هم‌زمان) و 429 (Rate Limit)
        setError(apiMessage(err, "تغییر رمز انجام نشد. دوباره تلاش کنید."));
      }
    } finally {
      setBusy(false);
    }
  };

  // ---------- ظاهر ----------
  const stepIndex = step === "phone" ? 0 : step === "otp" ? 1 : 2;
  const stepLabels = ["شماره مدیر", "کد تأیید", "رمز جدید"];

  const titles = {
    phone: {
      title: "بازیابی رمز عبور مدیر",
      subtitle:
        "شماره‌ی ثبت‌شده‌ی مدیر را وارد کن تا اگر حساب واجد شرایط باشد، کد تأیید ارسال شود.",
    },
    otp: {
      title: "تأیید شماره‌ی مدیر",
      subtitle: (
        <>
          کد ۶ رقمی مربوط به{" "}
          <bdi dir="ltr" className="font-bold text-foreground">
            {maskPhone(phone)}
          </bdi>{" "}
          را وارد کن.
        </>
      ),
    },
    password: {
      title: "رمز عبور جدید",
      subtitle: `کد تأیید شد. رمز جدید را مشخص کن. (${formatWait(resetLeft || 1)} مهلت باقی مانده)`,
    },
  }[step];

  const lockBanner = locked && (
    <p
      role="alert"
      className="rounded-2xl border border-error/40 bg-error/5 p-3 text-center text-xs font-bold leading-6 text-error"
    >
      تلاش‌های ناموفق زیاد بود. برای امنیت، تا {formatWait(lockLeft)} دیگر امکان
      تلاش نیست.
    </p>
  );

  const toggleButton = (
    <button
      type="button"
      onClick={() => setShowPassword((value) => !value)}
      aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition hover:bg-surface hover:text-foreground"
    >
      {showPassword ? <FiEyeOff /> : <FiEye />}
    </button>
  );

  return (
    <main dir="rtl" className="min-h-screen bg-background text-foreground">
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

        <header className="relative z-[100] mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-bold text-muted sm:inline-flex">
              <FiLock className="text-primary" aria-hidden="true" />
              پنل مدیریت
            </span>
            <ThemeSwitcher />
          </div>
        </header>

        <section className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] max-w-6xl grid-cols-1 items-center gap-12 px-4 pb-12 pt-4 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden lg:block">
            <div className="max-w-md">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-bold text-muted">
                <FiShield className="text-primary" aria-hidden="true" />
                فقط برای مدیران آرا نو
              </span>
              <h1 className="mt-6 text-4xl font-black leading-[1.2] tracking-tight xl:text-5xl">
                رمزت را فراموش کردی؟
                <span className="block text-primary">امن بازیابی کن.</span>
              </h1>
              <p className="mt-5 max-w-sm text-base leading-8 text-muted">
                با تأیید شماره‌ی مدیر، رمز جدیدی برای حساب خودت تعیین کن.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  [FiPhone, "تأیید شماره با کد یک‌بارمصرف"],
                  [FiKey, "ثبت رمز جدید با مهلت ۵ دقیقه‌ای"],
                  [FiLock, "خروج از همه‌ی نشست‌های قبلی بعد از تغییر رمز"],
                ].map(([IconComp, text]) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 text-sm font-bold"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <IconComp aria-hidden="true" />
                    </span>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full min-w-0 max-w-xl">
            <div className="rounded-3xl border border-border bg-surface/90 p-4 shadow-lg backdrop-blur-xl sm:rounded-[28px] sm:p-8">
              <Stepper
                labels={stepLabels}
                current={stepIndex}
                ariaLabel="مراحل بازیابی رمز مدیر"
              />

              <div className="mb-7">
                {step !== "phone" && (
                  <button
                    type="button"
                    onClick={() => restart()}
                    className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-muted transition hover:text-foreground"
                  >
                    <FiArrowRight aria-hidden="true" />
                    شروع دوباره
                  </button>
                )}
                <h2 className="text-2xl font-black sm:text-3xl">
                  {titles.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted">
                  {titles.subtitle}
                </p>
              </div>

              {step === "phone" && (
                <form
                  onSubmit={submitPhone}
                  noValidate
                  aria-busy={busy}
                  className="space-y-6"
                >
                  <Field
                    id="reset-phone"
                    label="شماره موبایل مدیر"
                    icon={FiPhone}
                    error={error}
                  >
                    <input
                      id="reset-phone"
                      name="phone"
                      dir="ltr"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      autoFocus
                      spellCheck={false}
                      maxLength={14}
                      value={phone}
                      onChange={(event) => {
                        setPhone(
                          normalizeDigits(event.target.value)
                            .replace(/[^0-9+]/g, "")
                            .slice(0, 14),
                        );
                        setError("");
                      }}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "reset-phone-error" : undefined}
                      placeholder="0912 345 6789"
                      className={`${INPUT} text-left`}
                    />
                  </Field>

                  <SubmitButton busy={busy} busyText="در حال ارسال...">
                    دریافت کد تأیید
                    <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
                  </SubmitButton>

                  <div className="rounded-2xl border border-border bg-surface-2 p-4 text-center text-xs leading-6 text-muted">
                    رمزت یادت آمد؟{" "}
                    <Link
                      to="/auth/admin"
                      className="font-bold text-primary hover:opacity-80"
                    >
                      بازگشت به ورود مدیران
                    </Link>
                  </div>
                </form>
              )}

              {step === "otp" && (
                <form
                  onSubmit={submitOtp}
                  noValidate
                  aria-busy={busy}
                  className="space-y-6 sm:space-y-7"
                >
                  <div dir="ltr">
                    <OtpInput
                      value={otp}
                      onChange={(value) =>
                        setOtp(
                          normalizeDigits(value)
                            .replace(/\D/g, "")
                            .slice(0, OTP_LENGTH),
                        )
                      }
                      numInputs={OTP_LENGTH}
                      shouldAutoFocus
                      inputType="tel"
                      containerStyle="flex w-full gap-1.5 sm:gap-2.5"
                      renderInput={(props) => (
                        <input
                          {...props}
                          className={OTP_BOX}
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          disabled={locked || busy}
                        />
                      )}
                    />
                  </div>

                  {lockBanner}
                  <FormMessage>{error}</FormMessage>

                  <SubmitButton
                    busy={busy}
                    busyText="در حال بررسی..."
                    disabled={otp.length !== OTP_LENGTH || locked}
                  >
                    تأیید و ادامه
                    <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
                  </SubmitButton>

                  <div className="text-center">
                    {resendLeft > 0 ? (
                      <p className="text-sm text-muted">
                        ارسال مجدد کد تا {Math.floor(resendLeft / 60)}:
                        {String(resendLeft % 60).padStart(2, "0")}
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={resend}
                        disabled={busy || locked}
                        className="inline-flex items-center gap-2 text-sm font-black text-primary transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FiRefreshCw aria-hidden="true" />
                        ارسال مجدد کد
                      </button>
                    )}
                  </div>
                </form>
              )}

              {step === "password" && (
                <form
                  onSubmit={submitPassword}
                  noValidate
                  aria-busy={busy}
                  className="space-y-5"
                >
                  <Field
                    id="reset-password"
                    label="رمز عبور جدید"
                    icon={FiLock}
                    error={fieldErrors.password}
                    trailing={toggleButton}
                  >
                    <input
                      id="reset-password"
                      name="password"
                      dir="ltr"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      autoFocus
                      maxLength={128}
                      spellCheck={false}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setFieldErrors((prev) => ({ ...prev, password: "" }));
                        setError("");
                      }}
                      aria-invalid={Boolean(fieldErrors.password)}
                      aria-describedby={
                        fieldErrors.password
                          ? "reset-password-error"
                          : undefined
                      }
                      className={`${INPUT} text-left`}
                    />
                  </Field>

                  <ul className="grid gap-2 rounded-2xl border border-border bg-surface-2 p-4 text-xs sm:grid-cols-2">
                    {PASSWORD_RULES.map((rule) => {
                      const ok = rule.test(password);
                      return (
                        <li
                          key={rule.id}
                          className={`flex items-center gap-2 font-bold ${
                            ok ? "text-primary" : "text-muted"
                          }`}
                        >
                          <FiCheck
                            className={ok ? "opacity-100" : "opacity-30"}
                            aria-hidden="true"
                          />
                          {rule.label}
                        </li>
                      );
                    })}
                  </ul>

                  <Field
                    id="reset-password-confirmation"
                    label="تکرار رمز عبور جدید"
                    icon={FiLock}
                    error={fieldErrors.password_confirmation}
                  >
                    <input
                      id="reset-password-confirmation"
                      name="password_confirmation"
                      dir="ltr"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      maxLength={128}
                      spellCheck={false}
                      value={confirmation}
                      onChange={(event) => {
                        setConfirmation(event.target.value);
                        setFieldErrors((prev) => ({
                          ...prev,
                          password_confirmation: "",
                        }));
                        setError("");
                      }}
                      aria-invalid={Boolean(fieldErrors.password_confirmation)}
                      aria-describedby={
                        fieldErrors.password_confirmation
                          ? "reset-password-confirmation-error"
                          : undefined
                      }
                      className={`${INPUT} text-left`}
                    />
                  </Field>

                  <FormMessage>{error}</FormMessage>

                  <SubmitButton busy={busy} busyText="در حال ثبت رمز...">
                    ثبت رمز جدید
                    <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
                  </SubmitButton>
                </form>
              )}
            </div>

            <p className="mt-5 text-center text-xs leading-6 text-muted">
              هر تلاش بازیابی رمز مدیر ثبت و محدود می‌شود.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
