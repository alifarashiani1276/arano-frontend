import { FiArrowRight, FiShield, FiCheckCircle } from "react-icons/fi";
import Logo from "../../ui/Logo";
import ThemeSwitcher from "../home/ThemeSwitcher";

export default function AuthLayout({
  children,
  step = 1,
  title,
  subtitle,
  onBack,
}) {
  const steps = ["شماره موبایل", "تأیید کد", "تکمیل اطلاعات"];

  return (
    <main dir="rtl" className="min-h-screen bg-background text-foreground">
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

        <header className="relative z-[100] mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
          <Logo />
          <ThemeSwitcher />
        </header>

        <section className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] max-w-6xl grid-cols-1 items-center gap-12 px-4 pb-12 pt-4 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden lg:block">
            <div className="max-w-md">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-bold text-muted">
                <FiShield className="text-primary" />
                ورود امن به آرا نو
              </span>
              <h1 className="mt-6 text-4xl font-black leading-[1.2] tracking-tight xl:text-5xl">
                پروژه‌ات را شروع کن؛
                <span className="block text-primary">
                  ما بقیه مسیر را می‌سازیم.
                </span>
              </h1>
              <p className="mt-5 max-w-sm text-base leading-8 text-muted">
                با شماره موبایل وارد شو و اطلاعات پروژه‌ات را با تیم آرا نو در
                میان بگذار.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "مشاوره اولیه و بررسی نیاز پروژه",
                  "اجرای طراحی و توسعه از صفر تا صد",
                  "پیگیری امن درخواست و ارتباط با تیم",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-bold"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <FiCheckCircle />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full min-w-0 max-w-xl">
            <div className="rounded-3xl border border-border bg-surface/90 p-4 shadow-lg backdrop-blur-xl sm:rounded-[28px] sm:p-8">
              <div className="mb-7 flex items-center justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    {onBack && (
                      <button
                        type="button"
                        onClick={onBack}
                        className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted transition hover:bg-surface-2 hover:text-foreground"
                        aria-label="بازگشت"
                      >
                        <FiArrowRight />
                      </button>
                    )}
                    <span className="text-xs font-bold text-primary">
                      مرحله {step} از ۳
                    </span>
                  </div>
                  <h2 className="text-2xl font-black sm:text-3xl">{title}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {subtitle}
                  </p>
                </div>
              </div>

              <div className="mb-8 flex gap-2" aria-label="مراحل احراز هویت">
                {steps.map((item, index) => (
                  <div
                    key={item}
                    className="flex min-w-0 flex-1 items-center gap-2"
                  >
                    <div
                      className={`h-1.5 flex-1 rounded-full ${index < step ? "bg-primary" : "bg-surface-2"}`}
                    />
                  </div>
                ))}
              </div>

              {children}
            </div>

            <p className="mt-5 text-center text-xs leading-6 text-muted">
              ورود به آرا نو به معنی پذیرش قوانین و شرایط استفاده از خدمات است.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
