import { FiBookOpen } from "react-icons/fi";
import { Link } from "react-router-dom";
import Reveal from "../../ui/Reveal";

// وضعیت خالی وبلاگ/دسته/جست‌وجو. actions: [{ label, to? , onClick?, primary? }]
export default function BlogEmptyState({
  title,
  description,
  actions = [],
  icon: Icon = FiBookOpen,
}) {
  return (
    <Reveal>
      <div
        role="status"
        className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-16 text-center md:py-24"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-grid bg-[length:32px_32px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-xl">
          <span
            aria-hidden="true"
            className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-border bg-surface-2 text-primary"
          >
            <Icon size={28} />
          </span>
          <h2 className="mt-6 text-xl font-black leading-[1.8] md:text-2xl">
            {title}
          </h2>
          {description && (
            <p className="mt-3 text-sm leading-8 text-muted md:text-base">
              {description}
            </p>
          )}
          {actions.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {actions.map(({ label, to, onClick, primary }) => {
                const cls = `rounded-full px-6 py-3 text-sm font-bold transition-[opacity,transform,background-color,border-color] duration-200 active:scale-[0.97] ${
                  primary
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border bg-surface-2 hover:border-primary hover:bg-primary/10"
                }`;
                return to ? (
                  <Link key={label} to={to} className={cls}>
                    {label}
                  </Link>
                ) : (
                  <button key={label} type="button" onClick={onClick} className={cls}>
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}
