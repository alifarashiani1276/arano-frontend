import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession, session } from "../auth/session";
import StatusBadge from "./StatusBadge";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileForm({ update, onUpdated, onError }) {
  const user = useSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    defaultValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      bio: user?.bio ?? "",
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      bio: user.bio ?? "",
    });
  }, [user, reset]);

  const onSubmit = async (values) => {
    try {
      const updated = await update({
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        email: values.email.trim(),
        bio: values.bio.trim(),
      });

      session.setUser(updated);
      reset({
        first_name: updated.first_name ?? "",
        last_name: updated.last_name ?? "",
        email: updated.email ?? "",
        phone: updated.phone ?? "",
        bio: updated.bio ?? "",
      });
      onUpdated?.(updated);
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <div className="dashboard-grid-2">
      <form
        className="dashboard-panel dashboard-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="dashboard-field">
          <label htmlFor="profile-first-name" className="dashboard-label">
            نام
          </label>
          <input
            id="profile-first-name"
            className="dashboard-input"
            {...register("first_name", {
              required: "نام را وارد کنید.",
              minLength: { value: 2, message: "نام خیلی کوتاه است." },
            })}
          />
          {errors.first_name && (
            <p className="dashboard-error">{errors.first_name.message}</p>
          )}
        </div>

        <div className="dashboard-field">
          <label htmlFor="profile-last-name" className="dashboard-label">
            نام خانوادگی
          </label>
          <input
            id="profile-last-name"
            className="dashboard-input"
            {...register("last_name", {
              required: "نام خانوادگی را وارد کنید.",
              minLength: { value: 2, message: "نام خانوادگی خیلی کوتاه است." },
            })}
          />
          {errors.last_name && (
            <p className="dashboard-error">{errors.last_name.message}</p>
          )}
        </div>

        <div className="dashboard-field">
          <label htmlFor="profile-email" className="dashboard-label">
            ایمیل
          </label>
          <input
            id="profile-email"
            dir="ltr"
            className="dashboard-input text-left"
            {...register("email", {
              required: "ایمیل را وارد کنید.",
              pattern: {
                value: EMAIL_REGEX,
                message: "ایمیل معتبر نیست.",
              },
            })}
          />
          {errors.email && (
            <p className="dashboard-error">{errors.email.message}</p>
          )}
        </div>

        <div className="dashboard-field">
          <label htmlFor="profile-phone" className="dashboard-label">
            شماره موبایل
          </label>
          <input
            id="profile-phone"
            dir="ltr"
            disabled
            className="dashboard-input text-left"
            {...register("phone")}
          />
        </div>

        <div className="dashboard-field dashboard-field--full">
          <label htmlFor="profile-bio" className="dashboard-label">
            درباره من
          </label>
          <textarea
            id="profile-bio"
            rows={4}
            maxLength={1000}
            className="dashboard-input"
            {...register("bio")}
          />
        </div>

        <div className="dashboard-form-actions">
          <button
            type="submit"
            className="primary-button"
            disabled={!isDirty || isSubmitting}
          >
            {isSubmitting ? "در حال ذخیره…" : "ذخیره تغییرات"}
          </button>
        </div>
      </form>

      <aside className="dashboard-panel h-fit">
        <h2 className="dashboard-panel-title mb-4">وضعیت حساب</h2>
        <dl className="dashboard-kv">
          <dt>نقش</dt>
          <dd>
            <StatusBadge kind="role" value={user?.role} />
          </dd>
          <dt>تأیید حساب</dt>
          <dd>
            <StatusBadge kind="account" value={user?.status} />
          </dd>
          <dt>فعال بودن</dt>
          <dd>
            <StatusBadge kind="active" value={user?.is_active} />
          </dd>
        </dl>
      </aside>
    </div>
  );
}
