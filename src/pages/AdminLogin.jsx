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
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiShield,
  FiUser,
} from "react-icons/fi";
import Logo from "../ui/Logo";
import ThemeSwitcher from "../features/home/ThemeSwitcher";
import { getSessionArea, session, useSession } from "../features/auth/session";
import { tokenStore } from "../features/auth/token";
import { apiMessage, statusOf } from "../lib/api";
import {
  MOBILE_REGEX,
  createLimiter,
  formatWait,
  maskPhone,
  normalizeDigits,
  normalizePhone,
  validateEmail,
  validateMessage,
  validateName,
} from "../lib/security";
import {
  adminCompleteProfile,
  adminLogin,
  adminSendOtp,
  adminVerifyOtp,
} from "../services/authService";

// ---------------------------------------------------------------------------
// مراحل ورود مدیر (مطابق AdminAuthController):
//   phone -> otp -> password            (مدیر معمولی که پروفایلش کامل است)
//   phone -> otp -> setup               (مدیر جدید؛ Setup Token می‌گیرد)
// ---------------------------------------------------------------------------

const OTP_LENGTH = 6;
const RESEND_SECONDS = 120;
const MAX_FAILURES = 5;
const LOCK_SECONDS = 300;
const DEFAULT_CHALLENGE_SECONDS = 300; // ۵ دقیقه برای وارد کردن رمز بعد از OTP
const DEFAULT_SETUP_SECONDS = 600; // ۱۰ دقیقه برای تکمیل پروفایل مدیر جدید

// حداکثر ۵ درخواست کد در ۱۵ دقیقه
const sendLimiter = createLimiter({
  key: "admin-otp-request",
  max: 5,
  windowMs: 15 * 60 * 1000,
  lockMs: 15 * 60 * 1000,
});

const PASSWORD_RULES = [
  { id: "len", label: "حداقل ۸ کاراکتر", test: (v) => v.length >= 8 },
  { id: "upper", label: "یک حرف بزرگ انگلیسی", test: (v) => /[A-Z]/.test(v) },
  { id: "lower", label: "یک حرف کوچک انگلیسی", test: (v) => /[a-z]/.test(v) },
  { id: "digit", label: "یک عدد انگلیسی", test: (v) => /[0-9]/.test(v) },
  {
    id: "symbol",
    label: "یک نماد (مثل ! @ #)",
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

const EMPTY_PROFILE = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  password_confirmation: "",
  bio: "",
};

const INPUT =
  "h-14 w-full min-w-0 bg-transparent text-sm font-bold outline-none placeholder:text-muted/60";

const OTP_BOX =
  "h-12 min-w-0 flex-1 rounded-xl border border-border bg-surface-2 text-center text-lg font-black text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 sm:h-14 sm:rounded-2xl sm:text-xl";

const nameMessage = (code) =>
  code === "required"
    ? "این فیلد را وارد کنید."
    : code === "tooLong"
      ? "مقدار واردشده خیلی طولانی است."
      : "فقط از حروف فارسی یا انگلیسی استفاده کنید.";

// اعتبارسنجی فرم تکمیل پروفایل مدیر جدید (قواعد رمز مطابق بک‌اند)
function checkProfile(values) {
  const errors = {};

  const first = validateName(values.first_name, { min: 2, max: 100 });
  const last = validateName(values.last_name, { min: 2, max: 100 });
  const email = validateEmail(values.email);
  const bio = validateMessage(values.bio, {
    min: 0,
    max: 1000,
    maxLinks: 2,
    required: false,
  });

  if (first.error) errors.first_name = nameMessage(first.error);
  if (last.error) errors.last_name = nameMessage(last.error);
  if (email.error) {
    errors.email =
      email.error === "required"
        ? "ایمیل را وارد کنید."
        : "ایمیل واردشده معتبر نیست.";
  }
  if (bio.error) errors.bio = "متن درباره‌ی من معتبر نیست.";

  if (!PASSWORD_RULES.every((rule) => rule.test(values.password))) {
    errors.password = "رمز عبور همه‌ی شرایط را ندارد.";
  }
  if (values.password !== values.password_confirmation) {
    errors.password_confirmation = "تکرار رمز عبور یکسان نیست.";
  }

  return {
    errors,
    clean: {
      first_name: first.value,
      last_name: last.value,
      email: email.value,
      password: values.password,
      password_confirmation: values.password_confirmation,
      ...(bio.value ? { bio: bio.value } : {}),
    },
  };
}

// ---------------------------------------------------------------------------
// اجزای کوچک رابط کاربری
// ---------------------------------------------------------------------------

function Field({ id, label, icon: IconComp, error, hint, trailing, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold">
        {label}
      </label>
      <div
        className={`flex items-center gap-3 rounded-2xl border bg-surface-2 px-4 transition focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10 ${
          error ? "border-error" : "border-border"
        }`}
      >
        {IconComp && (
          <IconComp className="shrink-0 text-muted" aria-hidden="true" />
        )}
        {children}
        {trailing}
      </div>
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-xs font-bold text-error"
        >
          {error}
        </p>
      ) : hint ? (
        <p className="mt-2 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

function SubmitButton({ busy, busyText, disabled, children }) {
  return (
    <button
      type="submit"
      disabled={busy || disabled}
      className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-black text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {busy ? busyText : children}
    </button>
  );
}

function FormMessage({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-center text-xs font-bold text-error">
      {children}
    </p>
  );
}

function Stepper({ labels, current }) {
  return (
    <ol className="mb-8 flex items-center" aria-label="مراحل ورود مدیر">
      {labels.map((label, index) => {
        const done = index < current;
        const active = index === current;

        return (
          <li
            key={label}
            aria-current={active ? "step" : undefined}
            className="flex flex-1 items-center last:flex-none"
          >
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black transition ${
                done || active
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-2 text-muted"
              }`}
            >
              {done ? (
                <FiCheck aria-hidden="true" />
              ) : (
                (index + 1).toLocaleString("fa-IR")
              )}
            </span>
            <span
              className={`ms-2 hidden text-xs font-bold sm:block ${
                active ? "text-foreground" : "text-muted"
              }`}
            >
              {label}
            </span>
            {index < labels.length - 1 && (
              <span
                className={`mx-3 h-px flex-1 ${done ? "bg-primary" : "bg-border"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// صفحه
// ---------------------------------------------------------------------------

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionUser = useSession();

  const [step, setStep] = useState("phone"); // phone | otp | password | setup
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [profileErrors, setProfileErrors] = useState({});

  // Setup Token فقط در حافظه‌ی همین صفحه می‌ماند (نه Storage)
  const [setupToken, setSetupToken] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [failures, setFailures] = useState(0);

  // زمان‌ها به‌صورت timestamp نگه داشته می‌شوند تا شمارنده با بسته بودن تب جابه‌جا نشود
  const [now, setNow] = useState(() => Date.now());
  const [resendAt, setResendAt] = useState(0);
  const [challengeEnds, setChallengeEnds] = useState(0);
  const [setupEnds, setSetupEnds] = useState(0);
  const [lockUntil, setLockUntil] = useState(0);

  const secondsLeft = (ts) => Math.max(0, Math.ceil((ts - now) / 1000));
  const resendLeft = secondsLeft(resendAt);
  const challengeLeft = secondsLeft(challengeEnds);
  const lockLeft = secondsLeft(lockUntil);
  const locked = lockLeft > 0;

  const challengeExpired =
    step === "password" && challengeEnds > 0 && now >= challengeEnds;
  const setupExpired = step === "setup" && setupEnds > 0 && now >= setupEnds;

  // شروع دوباره از مرحله‌ی شماره (مثلاً بعد از انقضای مهلت‌ها)
  const restart = useCallback((message = "") => {
    setStep("phone");
    setOtp("");
    setPassword("");
    setShowPassword(false);
    setProfile(EMPTY_PROFILE);
    setProfileErrors({});
    setSetupToken("");
    setChallengeEnds(0);
    setSetupEnds(0);
    setFailures(0);
    setError(message);
  }, []);

  useEffect(() => {
    if (step === "phone") return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (challengeExpired) {
      restart("مهلت وارد کردن رمز تمام شد. دوباره کد تأیید دریافت کنید.");
    }
  }, [challengeExpired, restart]);

  useEffect(() => {
    if (setupExpired) {
      restart("مهلت تکمیل حساب تمام شد. دوباره کد تأیید دریافت کنید.");
    }
  }, [setupExpired, restart]);

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
      setFailures(0);
      setLockUntil(Date.now() + LOCK_SECONDS * 1000);
      setNow(Date.now());
      setError("");
      setOtp("");
      setPassword("");
    } else {
      setFailures(next);
      setError(
        `${message} ${(MAX_FAILURES - next).toLocaleString("fa-IR")} تلاش باقی مانده است.`,
      );
    }
  };

  const lockForTooMany = () => {
    setFailures(0);
    setLockUntil(Date.now() + LOCK_SECONDS * 1000);
    setNow(Date.now());
    setError("");
    setOtp("");
    setPassword("");
  };

  // ورود موفق: Token واقعی + اطلاعات مدیر را ذخیره و وارد پنل می‌شویم
  const finish = ({ token, admin }) => {
    if (!token || !admin) {
      setError("پاسخ احراز هویت از سرور ناقص است.");
      return;
    }

    tokenStore.set(token);
    session.setUser(admin);

    const from = location.state?.from?.pathname;
    navigate(
      typeof from === "string" && from.startsWith("/admin") ? from : "/admin",
      { replace: true },
    );
  };

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
      await adminSendOtp(target);
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
      const data = await adminVerifyOtp(phone, otp);

      if (data.setup_required) {
        if (!data.token) throw new Error("setup token missing");
        setSetupToken(data.token);
        setSetupEnds(
          Date.now() + (data.token_expires_in ?? DEFAULT_SETUP_SECONDS) * 1000,
        );
        setNow(Date.now());
        setFailures(0);
        setStep("setup");
      } else {
        setChallengeEnds(
          Date.now() +
            (data.challenge_expires_in ?? DEFAULT_CHALLENGE_SECONDS) * 1000,
        );
        setNow(Date.now());
        setFailures(0);
        setStep("password");
      }
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

  // ---------- مرحله ۳ (الف): رمز عبور ----------
  const submitPassword = async (event) => {
    event.preventDefault();
    if (busy || locked) return;

    if (!password) {
      setError("رمز عبور را وارد کنید.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      finish(await adminLogin(phone, password));
    } catch (err) {
      const code = statusOf(err);
      const body = err.response?.data;

      if (code === 401) {
        registerFailure("رمز عبور صحیح نیست.");
        setPassword("");
      } else if (code === 403 && body?.data?.otp_required) {
        restart("مهلت تأیید کد تمام شده است. دوباره کد تأیید دریافت کنید.");
      } else if (code === 429) {
        lockForTooMany();
      } else {
        setError(apiMessage(err, "ورود انجام نشد. دوباره تلاش کنید."));
      }
    } finally {
      setBusy(false);
    }
  };

  // ---------- مرحله ۳ (ب): تکمیل حساب مدیر جدید ----------
  const changeProfile = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setProfileErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
    setError("");
  };

  const submitSetup = async (event) => {
    event.preventDefault();
    if (busy) return;

    const { errors, clean } = checkProfile(profile);
    setProfileErrors(errors);

    const firstInvalid = Object.keys(errors)[0];
    if (firstInvalid) {
      event.currentTarget.elements[firstInvalid]?.focus();
      return;
    }

    setBusy(true);
    setError("");

    try {
      finish(await adminCompleteProfile(clean, setupToken));
    } catch (err) {
      const code = statusOf(err);

      if (code === 401 || code === 403) {
        restart(
          err.response?.data?.message ??
            "مهلت تکمیل حساب تمام شده است. دوباره وارد شوید.",
        );
      } else if (code === 422 && err.response?.data?.errors) {
        const raw = err.response.data.errors;
        const next = {};

        if (raw.email?.[0])
          next.email = "این ایمیل قبلاً ثبت شده یا معتبر نیست.";
        if (raw.first_name?.[0]) next.first_name = "نام معتبر نیست.";
        if (raw.last_name?.[0]) next.last_name = "نام خانوادگی معتبر نیست.";
        if (raw.password?.[0]) next.password = "رمز عبور شرایط لازم را ندارد.";
        if (raw.bio?.[0]) next.bio = "متن درباره‌ی من معتبر نیست.";

        if (Object.keys(next).length) {
          setProfileErrors(next);
        } else {
          setError("اطلاعات واردشده معتبر نیست.");
        }
      } else if (code === 429) {
        setError("تعداد درخواست‌ها زیاد است. چند دقیقه دیگر تلاش کنید.");
      } else {
        setError(apiMessage(err, "ثبت اطلاعات انجام نشد. دوباره تلاش کنید."));
      }
    } finally {
      setBusy(false);
    }
  };

  // ---------- ظاهر ----------
  const isSetupFlow = step === "setup";
  const stepIndex = step === "phone" ? 0 : step === "otp" ? 1 : 2;
  const stepLabels = [
    "شماره مدیر",
    "کد تأیید",
    isSetupFlow ? "تکمیل حساب" : "رمز عبور",
  ];

  const titles = {
    phone: {
      title: "ورود مدیران",
      subtitle: "شماره‌ی ثبت‌شده‌ی مدیر را وارد کن تا کد تأیید ساخته شود.",
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
      title: "رمز عبور مدیر",
      subtitle: `کد تأیید شد. برای تکمیل ورود، رمز عبور را وارد کن. (${formatWait(challengeLeft || 1)} مهلت باقی مانده)`,
    },
    setup: {
      title: "تکمیل حساب مدیر",
      subtitle: "این اولین ورود توست. اطلاعات شخصی و رمز عبور حساب را مشخص کن.",
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

  const profileField = (name, label, props = {}) => ({
    id: `admin-${name}`,
    label,
    error: profileErrors[name],
    ...props,
  });

  const profileInput = (name) => ({
    id: `admin-${name}`,
    name,
    value: profile[name],
    onChange: changeProfile,
    "aria-invalid": Boolean(profileErrors[name]),
    "aria-describedby": profileErrors[name] ? `admin-${name}-error` : undefined,
  });

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
                ورود به پنل مدیریت
                <span className="block text-primary">امن و دومرحله‌ای.</span>
              </h1>
              <p className="mt-5 max-w-sm text-base leading-8 text-muted">
                مدیریت کاربران، درخواست‌ها، پروژه‌ها و گفتگوها از همین‌جا شروع
                می‌شود.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  [FiPhone, "تأیید شماره با کد یک‌بارمصرف"],
                  [FiKey, "رمز عبور به‌عنوان مرحله‌ی دوم ورود"],
                  [FiLock, "نشست محدود و خروج خودکار بعد از ۸ ساعت"],
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
              <Stepper labels={stepLabels} current={stepIndex} />

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
                    id="admin-phone"
                    label="شماره موبایل مدیر"
                    icon={FiPhone}
                    error={error}
                  >
                    <input
                      id="admin-phone"
                      name="phone"
                      dir="ltr"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
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
                      aria-describedby={error ? "admin-phone-error" : undefined}
                      placeholder="0912 345 6789"
                      className={`${INPUT} text-left`}
                    />
                  </Field>

                  <SubmitButton busy={busy} busyText="در حال ارسال...">
                    دریافت کد تأیید
                    <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
                  </SubmitButton>

                  <div className="rounded-2xl border border-border bg-surface-2 p-4 text-center text-xs leading-6 text-muted">
                    این صفحه فقط برای مدیران است. اگر کاربر عادی هستی از{" "}
                    <Link
                      to="/auth/login"
                      className="font-bold text-primary hover:opacity-80"
                    >
                      صفحه‌ی ورود کاربران
                    </Link>{" "}
                    وارد شو.
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
                  className="space-y-6"
                >
                  <Field
                    id="admin-password"
                    label="رمز عبور"
                    icon={FiLock}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={
                          showPassword ? "پنهان کردن رمز" : "نمایش رمز"
                        }
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition hover:bg-surface hover:text-foreground"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    }
                  >
                    <input
                      id="admin-password"
                      name="password"
                      dir="ltr"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      autoFocus
                      spellCheck={false}
                      maxLength={128}
                      value={password}
                      disabled={locked}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      className={`${INPUT} text-left`}
                    />
                  </Field>

                  {lockBanner}
                  <FormMessage>{error}</FormMessage>

                  <SubmitButton
                    busy={busy}
                    busyText="در حال ورود..."
                    disabled={!password || locked}
                  >
                    ورود به پنل مدیریت
                    <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
                  </SubmitButton>
                </form>
              )}

              {step === "setup" && (
                <form
                  onSubmit={submitSetup}
                  noValidate
                  aria-busy={busy}
                  className="space-y-5"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field {...profileField("first_name", "نام")} icon={FiUser}>
                      <input
                        {...profileInput("first_name")}
                        type="text"
                        maxLength={100}
                        autoComplete="given-name"
                        className={INPUT}
                      />
                    </Field>
                    <Field
                      {...profileField("last_name", "نام خانوادگی")}
                      icon={FiUser}
                    >
                      <input
                        {...profileInput("last_name")}
                        type="text"
                        maxLength={100}
                        autoComplete="family-name"
                        className={INPUT}
                      />
                    </Field>
                  </div>

                  <Field {...profileField("email", "ایمیل")} icon={FiMail}>
                    <input
                      {...profileInput("email")}
                      dir="ltr"
                      type="email"
                      inputMode="email"
                      maxLength={254}
                      autoComplete="email"
                      autoCapitalize="off"
                      spellCheck={false}
                      placeholder="you@example.com"
                      className={`${INPUT} text-left`}
                    />
                  </Field>

                  <Field
                    {...profileField("password", "رمز عبور جدید")}
                    icon={FiLock}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={
                          showPassword ? "پنهان کردن رمز" : "نمایش رمز"
                        }
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition hover:bg-surface hover:text-foreground"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    }
                  >
                    <input
                      {...profileInput("password")}
                      dir="ltr"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      maxLength={128}
                      spellCheck={false}
                      className={`${INPUT} text-left`}
                    />
                  </Field>

                  <ul className="grid gap-2 rounded-2xl border border-border bg-surface-2 p-4 text-xs sm:grid-cols-2">
                    {PASSWORD_RULES.map((rule) => {
                      const ok = rule.test(profile.password);
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
                    {...profileField("password_confirmation", "تکرار رمز عبور")}
                    icon={FiLock}
                  >
                    <input
                      {...profileInput("password_confirmation")}
                      dir="ltr"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      maxLength={128}
                      spellCheck={false}
                      className={`${INPUT} text-left`}
                    />
                  </Field>

                  <div>
                    <label
                      htmlFor="admin-bio"
                      className="mb-2 block text-sm font-bold"
                    >
                      درباره من{" "}
                      <span className="font-normal text-muted">(اختیاری)</span>
                    </label>
                    <textarea
                      {...profileInput("bio")}
                      rows={3}
                      maxLength={1000}
                      className={`w-full resize-none rounded-2xl border bg-surface-2 p-4 text-sm leading-7 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10 ${
                        profileErrors.bio ? "border-error" : "border-border"
                      }`}
                    />
                    {profileErrors.bio && (
                      <p
                        id="admin-bio-error"
                        role="alert"
                        className="mt-2 text-xs font-bold text-error"
                      >
                        {profileErrors.bio}
                      </p>
                    )}
                  </div>

                  <FormMessage>{error}</FormMessage>

                  <SubmitButton busy={busy} busyText="در حال ثبت اطلاعات...">
                    تکمیل حساب و ورود
                    <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
                  </SubmitButton>
                </form>
              )}
            </div>

            <p className="mt-5 text-center text-xs leading-6 text-muted">
              هر تلاش ورود به پنل مدیریت ثبت و محدود می‌شود.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
