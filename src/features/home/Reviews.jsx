import { useCallback, useEffect, useState } from "react";
import { Link } from "../../i18n/Link";
import { useLang } from "../../i18n/LangContext";
import toast from "react-hot-toast";
import { FiEdit2, FiMessageCircle, FiStar, FiTrash2 } from "react-icons/fi";
import { getSessionArea, useSession } from "../auth/session";
import { tokenStore } from "../auth/token";
import { apiMessage, statusOf } from "../../lib/api";
import { validateMessage } from "../../lib/security";
import {
  createComment,
  deleteComment,
  getComments,
  getMyComment,
  updateComment,
} from "../../services/commentService";
import Reveal from "../../ui/Reveal";
import SectionHeading from "../../ui/SectionHeading";

const PER_PAGE = 6;
const BODY_MIN = 3;
const BODY_MAX = 1000;

const FIELD =
  "mt-2 block w-full resize-none rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted/70 transition-[border-color,box-shadow] duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-red-500";

const ERROR_CLASS = "mt-1.5 text-xs font-bold text-red-600 dark:text-red-400";

const BODY_ERRORS = {
  required: "متن نظر را وارد کنید.",
  tooShort: "نظر باید حداقل ۳ کاراکتر باشد.",
  tooLong: "نظر نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد.",
  invalid: "متن نظر معتبر نیست.",
  markup: "استفاده از کد یا تگ در نظر مجاز نیست.",
  links: "درج لینک در نظر مجاز نیست.",
};

const formatDate = (iso, locale) =>
  iso ? new Date(iso).toLocaleDateString(locale) : "";

// نظرهای جدید در انتها اضافه می‌شوند و تکراری‌ها حذف می‌شوند
const mergeById = (current, incoming) => {
  const seen = new Set(current.map((item) => item.id));
  return [...current, ...incoming.filter((item) => !seen.has(item.id))];
};

function Stars({ value, size = 16 }) {
  const { n: num, isEn } = useLang();
  const filled = Math.round(value);

  return (
    <span
      role="img"
      aria-label={
        isEn ? `Rating ${num(value)} out of 5` : `امتیاز ${num(value)} از ۵`
      }
      className="inline-flex items-center gap-0.5 text-amber-500"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <FiStar
          key={n}
          size={size}
          aria-hidden="true"
          className={n <= filled ? "" : "opacity-40"}
          style={{ fill: n <= filled ? "currentColor" : "none" }}
        />
      ))}
    </span>
  );
}

function RatingInput({ value, onChange, invalid }) {
  const { t, n: num, isEn } = useLang();

  return (
    <div
      role="radiogroup"
      aria-label={t("امتیاز شما")}
      aria-invalid={invalid}
      className="mt-2 flex items-center gap-1 text-amber-500"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={isEn ? `${n} out of 5` : `${num(n)} از ۵`}
          onClick={() => onChange(n)}
          className="rounded-md p-1 transition-transform duration-150 hover:scale-110 active:scale-95"
        >
          <FiStar
            size={24}
            aria-hidden="true"
            className={n <= value ? "" : "opacity-40"}
            style={{ fill: n <= value ? "currentColor" : "none" }}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ comment, isMine = false }) {
  const { t, locale } = useLang();
  const initial = Array.from(comment.author_name || "؟")[0];

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border bg-surface p-5 ${
        isMine ? "border-primary/60" : "border-border"
      }`}
    >
      <header className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-black text-primary"
        >
          {initial}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-black">{comment.author_name}</p>
          <p className="text-xs text-muted">
            {formatDate(comment.created_at, locale)}
            {comment.edited_at ? ` · ${t("ویرایش‌شده")}` : ""}
          </p>
        </div>
      </header>

      <div className="mt-4">
        <Stars value={comment.rating} />
      </div>

      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-muted">
        {comment.body}
      </p>

      {isMine && (
        <p className="mt-auto pt-4 text-xs font-bold text-primary">
          {t("نظر شما")}
        </p>
      )}
    </article>
  );
}

function ReviewForm({ initial, onDone, onCancel }) {
  const { t } = useLang();
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [body, setBody] = useState(initial?.body ?? "");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const checked = validateMessage(body, {
      min: BODY_MIN,
      max: BODY_MAX,
      maxLinks: 0,
    });

    const nextErrors = {};
    if (!rating) nextErrors.rating = t("امتیاز خود را انتخاب کنید.");
    if (checked.error) {
      nextErrors.body = t(
        BODY_ERRORS[checked.error] ?? BODY_ERRORS.invalid,
      );
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload = { body: checked.value, rating };

    setSubmitting(true);
    try {
      if (initial) {
        await updateComment(initial.id, payload);
        toast.success(t("نظر شما به‌روزرسانی شد."));
      } else {
        await createComment(payload);
        toast.success(t("نظر شما ثبت شد. سپاسگزاریم!"));
      }
      onDone();
    } catch (error) {
      toast.error(t(apiMessage(error, "ثبت نظر انجام نشد. دوباره تلاش کنید.")));
      // «قبلاً نظر ثبت کرده‌اید» (۴۲۲ بدون errors): وضعیت را از سرور بخوان
      if (statusOf(error) === 422 && !error.response?.data?.errors) {
        onDone();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate aria-busy={submitting}>
      <p className="text-sm font-bold">{t("امتیاز شما")}</p>
      <RatingInput
        value={rating}
        invalid={Boolean(errors.rating)}
        onChange={(value) => {
          setRating(value);
          if (errors.rating) setErrors((prev) => ({ ...prev, rating: "" }));
        }}
      />
      {errors.rating && (
        <p role="alert" className={ERROR_CLASS}>
          {errors.rating}
        </p>
      )}

      <label htmlFor="review-body" className="mt-5 block text-sm font-bold">
        {t("نظر شما")}
      </label>
      <textarea
        id="review-body"
        rows={4}
        maxLength={BODY_MAX}
        value={body}
        placeholder={t("تجربه‌ی خود را از همکاری با آرانو بنویسید…")}
        aria-invalid={Boolean(errors.body)}
        aria-describedby={errors.body ? "review-body-error" : undefined}
        onChange={(event) => {
          setBody(event.target.value);
          if (errors.body) setErrors((prev) => ({ ...prev, body: "" }));
        }}
        className={FIELD}
      />
      <div className="mt-1.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {errors.body && (
            <p
              id="review-body-error"
              role="alert"
              className={`${ERROR_CLASS} mt-0`}
            >
              {errors.body}
            </p>
          )}
        </div>
        <span dir="ltr" className="shrink-0 text-xs text-muted">
          {body.length}/{BODY_MAX}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? t("در حال ارسال…")
            : initial
              ? t("ذخیره‌ی تغییرات")
              : t("ثبت نظر")}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-full border border-border px-6 py-3 text-sm font-bold text-muted transition-colors duration-200 hover:text-foreground disabled:opacity-60"
          >
            {t("انصراف")}
          </button>
        )}
      </div>
    </form>
  );
}

export default function Reviews() {
  const { t, n: num, isEn } = useLang();
  const user = useSession();
  const area = getSessionArea(user);

  const canWrite = Boolean(
    user &&
      tokenStore.get() &&
      area === "user" &&
      user.profile_completed &&
      user.status === "APPROVED" &&
      user.is_active !== false,
  );

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [summary, setSummary] = useState({ average: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [failed, setFailed] = useState(false);

  // undefined: در حال بارگذاری | null: نظری ثبت نکرده
  const [mine, setMine] = useState(undefined);
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadFirstPage = useCallback(async () => {
    try {
      const result = await getComments({ page: 1, per_page: PER_PAGE });
      setItems(result.comments ?? []);
      setMeta(result.meta ?? null);
      setSummary(result.summary ?? { average: 0, count: 0 });
      setFailed(false);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMine = useCallback(async () => {
    try {
      setMine((await getMyComment()) ?? null);
    } catch {
      setMine(null);
    }
  }, []);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  useEffect(() => {
    if (canWrite) {
      loadMine();
    } else {
      setMine(undefined);
      setEditing(false);
      setConfirming(false);
    }
  }, [canWrite, loadMine]);

  const loadMore = async () => {
    if (loadingMore || !meta || meta.current_page >= meta.last_page) return;

    setLoadingMore(true);
    try {
      const result = await getComments({
        page: meta.current_page + 1,
        per_page: PER_PAGE,
      });
      setItems((current) => mergeById(current, result.comments ?? []));
      setMeta(result.meta ?? meta);
    } catch (error) {
      toast.error(t(apiMessage(error, "دریافت نظرهای بیشتر انجام نشد.")));
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSaved = () => {
    setEditing(false);
    loadMine();
    loadFirstPage();
  };

  const handleDelete = async () => {
    if (!mine || deleting) return;

    setDeleting(true);
    try {
      await deleteComment(mine.id);
      toast.success(t("نظر شما حذف شد."));
      setConfirming(false);
      setMine(null);
      loadFirstPage();
    } catch (error) {
      toast.error(t(apiMessage(error, "حذف نظر انجام نشد.")));
    } finally {
      setDeleting(false);
    }
  };

  const hasMore = meta ? meta.current_page < meta.last_page : false;

  const renderWriteArea = () => {
    if (area === "admin") {
      return (
        <p className="text-sm leading-7 text-muted">
          {isEn ? (
            <>
              You are signed in as an admin. To view and delete comments, go
              to the{" "}
              <Link to="/admin/comments" className="font-bold text-primary">
                comments section of the admin panel
              </Link>
              .
            </>
          ) : (
            <>
              شما با حساب مدیر وارد شده‌اید. برای مشاهده و حذف نظرها به{" "}
              <Link to="/admin/comments" className="font-bold text-primary">
                بخش نظرات پنل مدیریت
              </Link>{" "}
              بروید.
            </>
          )}
        </p>
      );
    }

    if (!user || !tokenStore.get()) {
      return (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm leading-7 text-muted">
            {t("برای ثبت نظر ابتدا وارد حساب کاربری خود شوید.")}
          </p>
          <Link
            to="/auth/login"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-opacity duration-200 hover:opacity-90"
          >
            {t("ورود و ثبت نظر")}
          </Link>
        </div>
      );
    }

    if (!canWrite) {
      return (
        <p className="text-sm leading-7 text-muted">
          {t(
            "پس از تکمیل پروفایل و تأیید حساب توسط مدیریت، می‌توانید نظر خود را ثبت کنید.",
          )}
        </p>
      );
    }

    if (mine === undefined) {
      return <p className="text-sm text-muted">{t("در حال بررسی…")}</p>;
    }

    if (mine && !editing) {
      return (
        <div>
          <p className="mb-4 text-sm font-black">
            {t("نظر شما ثبت شده است")}
          </p>
          <div className="max-w-xl">
            <ReviewCard comment={mine} isMine />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold transition-colors duration-200 hover:border-primary hover:text-primary"
            >
              <FiEdit2 size={14} aria-hidden="true" />
              {t("ویرایش نظر")}
            </button>

            {confirming ? (
              <span className="inline-flex flex-wrap items-center gap-2 text-sm">
                <span className="font-bold">{t("نظر حذف شود؟")}</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-60"
                >
                  {deleting ? t("در حال حذف…") : t("بله، حذف شود")}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={deleting}
                  className="rounded-full border border-border px-4 py-2 text-xs font-bold text-muted transition-colors duration-200 hover:text-foreground"
                >
                  {t("انصراف")}
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold text-muted transition-colors duration-200 hover:border-red-500 hover:text-red-600"
              >
                <FiTrash2 size={14} aria-hidden="true" />
                {t("حذف نظر")}
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-xl">
        <p className="mb-4 text-sm font-black">
          {mine
            ? t("ویرایش نظر شما")
            : t("نظر خود را با ما در میان بگذارید")}
        </p>
        <ReviewForm
          initial={mine}
          onDone={handleSaved}
          onCancel={mine ? () => setEditing(false) : undefined}
        />
      </div>
    );
  };

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="scroll-mt-24 py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="reviews-title"
            eyebrow={t("نظرات کاربران")}
            title={t("تجربه‌ی همراهان آرانو")}
          />

          {summary.count > 0 && (
            <Reveal delay={1}>
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-4">
                <span className="text-4xl font-black leading-none">
                  {num(summary.average)}
                </span>
                <div>
                  <Stars value={summary.average} size={18} />
                  <p className="mt-1 text-xs text-muted">
                    {isEn
                      ? `from ${num(summary.count)} ${summary.count === 1 ? "review" : "reviews"}`
                      : `از ${num(summary.count)} نظر`}
                  </p>
                </div>
              </div>
            </Reveal>
          )}
        </div>

        <div className="mt-10">
          {loading ? (
            <p className="text-sm text-muted">{t("در حال بارگذاری نظرها…")}</p>
          ) : failed ? (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">
                {t("دریافت نظرها انجام نشد.")}
              </p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  loadFirstPage();
                }}
                className="rounded-full border border-border px-4 py-2 text-xs font-bold transition-colors duration-200 hover:border-primary hover:text-primary"
              >
                {t("تلاش دوباره")}
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-4 py-12 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-primary">
                <FiMessageCircle size={20} aria-hidden="true" />
              </span>
              <p className="font-black">{t("هنوز نظری ثبت نشده است")}</p>
              <p className="text-sm text-muted">
                {t("اولین نفری باشید که نظر می‌دهد.")}
              </p>
            </div>
          ) : (
            <>
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((comment) => (
                  <li key={comment.id}>
                    <ReviewCard
                      comment={comment}
                      isMine={Boolean(mine && mine.id === comment.id)}
                    />
                  </li>
                ))}
              </ul>

              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="rounded-full border border-border px-6 py-3 text-sm font-bold transition-colors duration-200 hover:border-primary hover:text-primary disabled:opacity-60"
                  >
                    {loadingMore
                      ? t("در حال بارگذاری…")
                      : t("نمایش نظرهای بیشتر")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-surface-2 p-5 sm:p-8">
          {renderWriteArea()}
        </div>
      </div>
    </section>
  );
}
