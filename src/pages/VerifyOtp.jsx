import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import AuthLayout from "../features/auth/AuthLayout";
import { authFlow } from "../features/auth/authFlow";
import { session } from "../features/auth/session";
import { tokenStore } from "../features/auth/token";
import { apiMessage, statusOf } from "../lib/api";
import {
  createLimiter,
  formatWait,
  maskPhone,
  normalizeDigits,
} from "../lib/security";
import { sendOtp, verifyOtp } from "../services/authService";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 120;
const MAX_ATTEMPTS = 5;
const LOCK_SECONDS = 300;

// حداکثر ۳ بار ارسال مجدد در ۱۵ دقیقه، با حداقل ۶۰ ثانیه فاصله
const resendLimiter = createLimiter({
  key: "otp-resend",
  max: 3,
  windowMs: 15 * 60 * 1000,
  lockMs: 15 * 60 * 1000,
  minIntervalMs: 60 * 1000,
});

const otpInput =
  "h-12 min-w-0 flex-1 rounded-xl border border-border bg-surface-2 text-center text-lg font-black text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 sm:h-14 sm:rounded-2xl sm:text-xl";

// نتیجه:
// { ok: true, user }          => ورود موفق
// { ok: false }               => کد اشتباه/منقضی
// { ok: false, tooMany }      => تعداد تلاش زیاد
// { ok: false, fatal: "..." } => حساب غیرمجاز
async function verifyOtpRequest(phone, code) {
  try {
    // authService.verifyOtp خودش `response.data` را برمی‌گرداند:
    // { success, message, data: { user, token } }
    const res = await verifyOtp(phone, code);
    const { token, user } = res.data ?? {};

    if (!token || !user) {
      throw new Error("پاسخ احراز هویت از سرور ناقص است.");
    }

    // Token واقعی Sanctum
    tokenStore.set(token);

    // User واقعی دریافت‌شده از Backend
    session.setUser(user);

    return { ok: true, user };
  } catch (err) {
    const status = statusOf(err);

    if (status === 422) {
      return { ok: false };
    }

    if (status === 429) {
      return { ok: false, tooMany: true };
    }

    if (status === 403) {
      return {
        ok: false,
        fatal:
          err.response?.data?.message ?? "امکان ورود با این حساب وجود ندارد.",
      };
    }

    throw err;
  }
}

export default function VerifyOtp() {
  const navigate = useNavigate();
  const phone = authFlow.getPhone() ?? "";

  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [attempts, setAttempts] = useState(0);
  const [lockLeft, setLockLeft] = useState(0);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const lockUntil = useRef(0);

  // بعد از ورود موفق، authFlow پاک می‌شود و `phone` خالی می‌شود.
  // این Ref جلوی Redirect اشتباه به صفحه‌ی ورود را در همان لحظه می‌گیرد.
  const finished = useRef(false);

  useEffect(() => {
    if (!phone) {
      if (!finished.current) {
        navigate("/auth/login", { replace: true });
      }
      return undefined;
    }

    const timer = setInterval(() => {
      setSeconds((value) => (value > 0 ? value - 1 : 0));

      if (lockUntil.current) {
        const left = Math.ceil((lockUntil.current - Date.now()) / 1000);

        if (left <= 0) {
          lockUntil.current = 0;
          setLockLeft(0);
          setAttempts(0);
          setMessage("");
        } else {
          setLockLeft(left);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [phone, navigate]);

  const locked = lockLeft > 0;

  const lock = (text) => {
    lockUntil.current = Date.now() + LOCK_SECONDS * 1000;
    setLockLeft(LOCK_SECONDS);
    setMessage(text);
  };

  const submit = async (event) => {
    event.preventDefault();

    if (busy || locked || otp.length !== OTP_LENGTH || !phone) {
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const result = await verifyOtpRequest(phone, otp);

      if (result.ok) {
        const { user } = result;

        // پروفایل ناقص است؛ باید اطلاعات شخصی تکمیل شود.
        if (!user.profile_completed) {
          authFlow.markVerified();

          navigate("/auth/complete-profile", {
            replace: true,
          });

          return;
        }

        // پروفایل کامل است؛ مرحله احراز هویت تمام شده.
        finished.current = true;
        authFlow.reset();

        if (user.status === "APPROVED") {
          navigate("/dashboard", {
            replace: true,
          });
        } else {
          navigate("/auth/pending", {
            replace: true,
          });
        }

        return;
      }

      setOtp("");

      if (result.fatal) {
        setMessage(result.fatal);
        return;
      }

      if (result.tooMany) {
        lock("تعداد تلاش‌ها زیاد بود. ورود کد موقتاً قفل شد.");
        return;
      }

      const next = attempts + 1;
      setAttempts(next);

      if (next >= MAX_ATTEMPTS) {
        lock("تعداد تلاش‌های اشتباه زیاد بود. ورود کد موقتاً قفل شد.");
      } else {
        setMessage(
          `کد واردشده صحیح نیست یا منقضی شده است. ${(MAX_ATTEMPTS - next).toLocaleString("fa-IR")} تلاش باقی مانده است.`,
        );
      }
    } catch (err) {
      setMessage(apiMessage(err, "خطای سرور. لطفاً دوباره تلاش کنید."));
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (!phone || busy || locked || seconds > 0) {
      return;
    }

    const gate = resendLimiter.attempt();

    if (!gate.ok) {
      setMessage(
        `تعداد ارسال مجدد زیاد است. ${formatWait(
          gate.retryAfter,
        )} دیگر دوباره تلاش کنید.`,
      );
      return;
    }

    setMessage("");

    try {
      await sendOtp(phone);

      setSeconds(RESEND_SECONDS);
      setOtp("");
      setAttempts(0);
    } catch (err) {
      setMessage(apiMessage(err, "ارسال مجدد کد انجام نشد."));
    }
  };

  const goBack = () => {
    authFlow.reset();
    navigate("/auth/login");
  };

  return (
    <AuthLayout
      step={2}
      title="کد تأیید را وارد کن"
      subtitle={
        <>
          کد ۶ رقمی ارسال‌شده به{" "}
          <bdi dir="ltr" className="font-bold text-foreground">
            {maskPhone(phone)}
          </bdi>{" "}
          را وارد کن.
        </>
      }
      onBack={goBack}
    >
      <form
        onSubmit={submit}
        noValidate
        aria-busy={busy}
        className="space-y-6 sm:space-y-7"
      >
        <div dir="ltr">
          <OtpInput
            value={otp}
            onChange={(value) =>
              setOtp(
                normalizeDigits(value).replace(/\D/g, "").slice(0, OTP_LENGTH),
              )
            }
            numInputs={OTP_LENGTH}
            shouldAutoFocus
            inputType="tel"
            containerStyle="flex w-full gap-1.5 sm:gap-2.5"
            renderInput={(props) => (
              <input
                {...props}
                className={otpInput}
                inputMode="numeric"
                autoComplete="one-time-code"
                disabled={locked || busy}
              />
            )}
          />
        </div>

        {message && (
          <p role="alert" className="text-center text-xs font-bold text-error">
            {message}
            {locked && ` (${formatWait(lockLeft)})`}
          </p>
        )}

        <button
          type="submit"
          disabled={otp.length !== OTP_LENGTH || busy || locked || !phone}
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-black text-primary-foreground transition hover:opacity-90 disabled:opacity-50 sm:h-14"
        >
          {busy ? "در حال بررسی..." : "تأیید و ادامه"}

          {!busy && (
            <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
          )}
        </button>

        <div className="text-center">
          {seconds > 0 ? (
            <p className="text-sm text-muted">
              ارسال مجدد کد تا {Math.floor(seconds / 60)}:
              {String(seconds % 60).padStart(2, "0")}
            </p>
          ) : (
            <button
              type="button"
              onClick={resend}
              disabled={busy || locked}
              className="inline-flex items-center gap-2 text-sm font-black text-primary transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiRefreshCw />
              ارسال مجدد کد
            </button>
          )}
        </div>
      </form>
    </AuthLayout>
  );
}
