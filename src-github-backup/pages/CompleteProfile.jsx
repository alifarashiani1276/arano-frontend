import { useState } from "react";
import { FiArrowLeft, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../features/auth/AuthLayout";
import { authFlow } from "../features/auth/authFlow";
import { session } from "../features/auth/session";
import useBotTrap from "../hooks/useBotTrap";
import { apiMessage, statusOf } from "../lib/api";
import {
  createLimiter,
  formatWait,
  validateEmail,
  validateMessage,
  validateName,
} from "../lib/security";
import { updateProfile } from "../services/authService";
import Honeypot from "../ui/Honeypot";

const initial = {
  first_name: "",
  last_name: "",
  email: "",
  bio: "",
};

const FIELD_ORDER = ["first_name", "last_name", "email", "bio"];

const BIO_MAX = 300;

// حداکثر ۵ بار ارسال در ۱۰ دقیقه
const profileLimiter = createLimiter({
  key: "profile-submit",
  max: 5,
  windowMs: 10 * 60 * 1000,
  lockMs: 10 * 60 * 1000,
});

const MESSAGES = {
  first_name: {
    required: "نام را وارد کنید.",
    tooLong: "نام نباید بیشتر از ۴۰ کاراکتر باشد.",
    invalid: "نام را فقط با حروف فارسی یا انگلیسی وارد کنید.",
  },

  last_name: {
    required: "نام خانوادگی را وارد کنید.",
    tooLong: "نام خانوادگی نباید بیشتر از ۴۰ کاراکتر باشد.",
    invalid: "نام خانوادگی را فقط با حروف فارسی یا انگلیسی وارد کنید.",
  },

  email: {
    required: "ایمیل را وارد کنید.",
    tooLong: "ایمیل خیلی طولانی است.",
    invalid: "ایمیل واردشده معتبر نیست.",
  },

  bio: {
    tooShort: "متن خیلی کوتاه است.",
    tooLong: `حداکثر ${BIO_MAX.toLocaleString("fa-IR")} کاراکتر مجاز است.`,
    markup: "لطفاً از تگ‌های HTML یا کد استفاده نکنید.",
    links: "حداکثر ۲ لینک مجاز است.",
    invalid: "متن واردشده معتبر نیست.",
  },
};

// مقدار تمیزشده و پیام خطای یک فیلد
function checkField(name, raw) {
  let result;

  if (name === "first_name" || name === "last_name") {
    result = validateName(raw, {
      min: 2,
      max: 40,
    });
  } else if (name === "email") {
    result = validateEmail(raw);
  } else {
    result = validateMessage(raw, {
      min: 0,
      max: BIO_MAX,
      maxLinks: 2,
      required: false,
    });
  }

  const map = MESSAGES[name];

  return {
    value: result.value,
    error: result.error ? (map[result.error] ?? map.invalid) : "",
  };
}

// خطاهای اعتبارسنجی Backend
function serverFieldErrors(err) {
  const raw = err.response?.data?.errors;

  if (statusOf(err) !== 422 || !raw) {
    return {};
  }

  const out = {};

  FIELD_ORDER.forEach((name) => {
    const first = raw[name]?.[0];

    if (!first) {
      return;
    }

    out[name] =
      name === "email" && /taken/i.test(first)
        ? "این ایمیل قبلاً ثبت شده است."
        : MESSAGES[name].invalid;
  });

  return out;
}

const INPUT_BOX =
  "rounded-2xl border bg-surface-2 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10";

export default function CompleteProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { onFocus, check } = useBotTrap(2500);

  const change = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setFormError("");
  };

  const blur = (event) => {
    const { name, value } = event.target;
    const { error } = checkField(name, value);

    setErrors((prev) =>
      prev[name] === error
        ? prev
        : {
            ...prev,
            [name]: error,
          },
    );
  };

  const submit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const formEl = event.currentTarget;
    const data = Object.fromEntries(new FormData(formEl));

    const nextErrors = {};
    const clean = {};

    FIELD_ORDER.forEach((name) => {
      const result = checkField(name, form[name]);

      nextErrors[name] = result.error;
      clean[name] = result.value;
    });

    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((name) => nextErrors[name]);

    if (firstInvalid) {
      formEl.elements[firstInvalid]?.focus();
      return;
    }

    const trap = check(data.ref_code);

    if (trap === "honeypot") {
      return;
    }

    if (trap === "fast") {
      setFormError("لطفاً چند ثانیه صبر کنید و دوباره ارسال کنید.");
      return;
    }

    const gate = profileLimiter.attempt();

    if (!gate.ok) {
      setFormError(
        `تعداد ارسال‌ها زیاد است. ${formatWait(
          gate.retryAfter,
        )} دیگر دوباره تلاش کنید.`,
      );
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      // Backend User جدید را برمی‌گرداند.
      const user = await updateProfile(clean);

      // Session را با اطلاعات جدید Backend به‌روزرسانی می‌کنیم.
      session.setUser(user);

      // مراحل موقت Login را پاک می‌کنیم.
      authFlow.reset();

      navigate("/auth/pending", {
        replace: true,
      });
    } catch (err) {
      if (statusOf(err) === 401) {
        navigate("/auth/login", {
          replace: true,
        });
        return;
      }

      const fieldErrs = serverFieldErrors(err);

      if (Object.keys(fieldErrs).length) {
        setErrors((prev) => ({
          ...prev,
          ...fieldErrs,
        }));

        formEl.elements[Object.keys(fieldErrs)[0]]?.focus();
      } else {
        setFormError(
          apiMessage(err, "ثبت اطلاعات انجام نشد. لطفاً دوباره تلاش کنید."),
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    authFlow.reset();

    navigate("/auth/login");
  };

  const fieldProps = (name) => ({
    name,
    value: form[name],
    onChange: change,
    onBlur: blur,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  const fieldError = (name) =>
    errors[name] ? (
      <p
        id={`${name}-error`}
        role="alert"
        className="mt-2 text-xs font-bold text-error"
      >
        {errors[name]}
      </p>
    ) : null;

  return (
    <AuthLayout
      step={3}
      title="اطلاعاتت را تکمیل کن"
      subtitle="چند اطلاعات ساده وارد کن تا حساب کاربری‌ات برای بررسی تیم آماده شود."
      onBack={goBack}
    >
      <form
        onSubmit={submit}
        onFocus={onFocus}
        noValidate
        aria-busy={submitting}
        className="relative space-y-5"
      >
        <Honeypot />

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["first_name", "نام", "مثلاً علی", "given-name"],
            ["last_name", "نام خانوادگی", "مثلاً فراشیانی", "family-name"],
          ].map(([name, label, placeholder, autoComplete]) => (
            <div key={name}>
              <label htmlFor={name} className="mb-2 block text-sm font-bold">
                {label}
              </label>

              <div
                className={`flex items-center px-4 ${INPUT_BOX} ${
                  errors[name] ? "border-error" : "border-border"
                }`}
              >
                <FiUser className="text-muted" />

                <input
                  id={name}
                  {...fieldProps(name)}
                  type="text"
                  maxLength={50}
                  autoComplete={autoComplete}
                  spellCheck={false}
                  placeholder={placeholder}
                  className="h-14 w-full bg-transparent px-3 text-sm font-bold outline-none placeholder:text-muted/50"
                />
              </div>

              {fieldError(name)}
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-bold">
            ایمیل
          </label>

          <input
            id="email"
            {...fieldProps("email")}
            dir="ltr"
            type="email"
            inputMode="email"
            maxLength={254}
            autoComplete="email"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="you@example.com"
            className={`h-14 w-full px-4 text-left text-sm font-bold ${INPUT_BOX} ${
              errors.email ? "border-error" : "border-border"
            }`}
          />

          {fieldError("email")}
        </div>

        <div>
          <label htmlFor="bio" className="mb-2 block text-sm font-bold">
            درباره شما <span className="font-normal text-muted">(اختیاری)</span>
          </label>

          <textarea
            id="bio"
            {...fieldProps("bio")}
            rows={4}
            maxLength={BIO_MAX}
            placeholder="اگر دوست داری کمی درباره خودت بنویس..."
            className={`w-full resize-none p-4 text-sm leading-7 ${INPUT_BOX} ${
              errors.bio ? "border-error" : "border-border"
            }`}
          />

          <div className="mt-1.5 flex items-start justify-between gap-3">
            <div className="min-w-0">{fieldError("bio")}</div>

            <span dir="ltr" className="shrink-0 text-xs text-muted">
              {form.bio.length}/{BIO_MAX}
            </span>
          </div>
        </div>

        {formError && (
          <p role="alert" className="text-xs font-bold text-error">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-black text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "در حال ثبت اطلاعات..."
            : "ثبت اطلاعات و ارسال برای بررسی"}

          {!submitting && (
            <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
          )}
        </button>

        <p className="text-center text-xs leading-6 text-muted">
          بعد از ثبت اطلاعات، حساب شما در وضعیت «در انتظار تأیید» قرار می‌گیرد.
        </p>
      </form>
    </AuthLayout>
  );
}
