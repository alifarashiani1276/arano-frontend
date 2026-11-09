import { FiCheck } from "react-icons/fi";

// اجزای کوچک رابط کاربری مشترک بین صفحه‌ی ورود مدیر و بازیابی رمز مدیر.

export function Field({
  id,
  label,
  icon: IconComp,
  error,
  hint,
  trailing,
  children,
}) {
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

export function SubmitButton({ busy, busyText, disabled, children }) {
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

export function FormMessage({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-center text-xs font-bold text-error">
      {children}
    </p>
  );
}

export function Stepper({ labels, current, ariaLabel = "مراحل ورود مدیر" }) {
  return (
    <ol className="mb-8 flex items-center" aria-label={ariaLabel}>
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
