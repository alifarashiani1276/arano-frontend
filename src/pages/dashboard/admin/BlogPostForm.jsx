import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FiArrowRight, FiSave } from "react-icons/fi";
import { apiMessage, statusOf } from "../../../lib/api";
import { useSession } from "../../../features/auth/session";
import { BLOG_CATEGORIES } from "../../../data/blog";
import {
  createAdminBlogPost,
  getAdminBlogPost,
  publishAdminBlogPost,
  unpublishAdminBlogPost,
  updateAdminBlogPost,
} from "../../../services/adminBlogService";
import ConfirmModal from "../../../features/dashboard/ConfirmModal";
import EmptyState from "../../../features/dashboard/EmptyState";
import PageHeader from "../../../features/dashboard/PageHeader";
import BlogContentEditor from "../../../features/dashboard/blog/BlogContentEditor";
import BlogPreview from "../../../features/dashboard/blog/BlogPreview";
import CoverField from "../../../features/dashboard/blog/CoverField";
import FaqEditor from "../../../features/dashboard/blog/FaqEditor";
import LinksEditor from "../../../features/dashboard/blog/LinksEditor";
import {
  Counter,
  Field,
  PublishDateField,
  TagsField,
} from "../../../features/dashboard/blog/PostFormParts";
import {
  EXCERPT_MAX,
  EXCERPT_MIN,
  RESERVED_SLUGS,
  SEO_TITLE_MAX,
  SLUG_MAX,
  SLUG_RE,
  buildPayload,
  emptyValues,
  fieldTab,
  mapServerErrors,
  toFormValues,
  todayDateOnly,
  validateForPublish,
} from "../../../features/dashboard/blog/postForm";
import useUnsavedGuard from "../../../features/dashboard/blog/useUnsavedGuard";

const TABS = [
  { value: "content", label: "محتوا" },
  { value: "seo", label: "سئو" },
  { value: "en", label: "نسخه‌ی انگلیسی" },
  { value: "preview", label: "پیش‌نمایش" },
];

const FIELD_ROOTS = [
  "title", "slug", "category", "author", "publishedAt", "tags",
  "seoTitle", "excerpt", "faq", "links", "en",
];

const slugRule = (value) => {
  const slug = value.trim();
  if (!slug) return true;
  if (slug.length > SLUG_MAX) return `آدرس حداکثر ${SLUG_MAX} کاراکتر است.`;
  if (!SLUG_RE.test(slug)) return "فقط حروف کوچک انگلیسی (a-z)، عدد (0-9) و - مجاز است.";
  if (RESERVED_SLUGS.includes(slug)) return "این کلمه رزرو است؛ آدرس دیگری انتخاب کنید.";
  return true;
};

// ───────── فرم اصلی (بعد از آماده شدن داده ساخته می‌شود تا defaultValues درست باشد)
function PostEditor({ initialPost }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSession();
  const defaultAuthor = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  const isNew = !initialPost;

  // فقط یک بار ساخته می‌شود؛ ویرایشگرهای محتوا هم فقط مقدار اولیه را می‌خوانند
  const [initialValues] = useState(() =>
    initialPost ? toFormValues(initialPost, defaultAuthor) : emptyValues(defaultAuthor),
  );

  // اطلاعات سمت سرور که جزو فیلد فرم نیستند. بعد از اولین ذخیره‌ی موفق مقاله‌ی جدید، id هم همین‌جا می‌آید.
  const [meta, setMeta] = useState({
    id: initialPost?.id ?? null,
    status: initialPost?.status ?? "draft",
    slugLocked: Boolean(initialPost?.slugLocked),
  });
  const [tab, setTab] = useState("content");
  const [saving, setSaving] = useState(false);
  const [general, setGeneral] = useState([]);

  const methods = useForm({ defaultValues: initialValues });
  const { register, control, formState, getValues, getFieldState, setValue, setError, clearErrors, reset, trigger } = methods;
  const { errors, isDirty } = formState;

  const guard = useUnsavedGuard(isDirty && !saving);
  const wantedStatus = useWatch({ control, name: "status" });
  const title = useWatch({ control, name: "title" });
  const seoTitle = useWatch({ control, name: "seoTitle" });
  const excerpt = useWatch({ control, name: "excerpt" });
  const enSeoTitle = useWatch({ control, name: "en.seoTitle" });
  const enExcerpt = useWatch({ control, name: "en.excerpt" });
  const slug = useWatch({ control, name: "slug" });

  const tabsWithErrors = new Set(Object.keys(errors).map(fieldTab));

  const showErrors = (fields) => {
    Object.entries(fields).forEach(([name, message]) => setError(name, { type: "server", message }));
    const first = Object.keys(fields)[0];
    if (first) setTab(fieldTab(first));
  };

  const handleError = (error) => {
    if (statusOf(error) === 422) {
      const { fields, general: others } = mapServerErrors(error.response?.data?.errors);
      showErrors(fields);
      const message = error.response?.data?.message;
      const hasFieldErrors = Object.keys(fields).length > 0;
      if (others.length) setGeneral(others);
      else if (!hasFieldErrors && message) setGeneral([message]);
      toast.error("چند فیلد نیاز به اصلاح دارد.");
      return;
    }
    toast.error(apiMessage(error, "ذخیره‌ی مقاله انجام نشد."));
  };

  const adopt = (post) =>
    setMeta({ id: post.id, status: post.status, slugLocked: Boolean(post.slugLocked) });

  const save = async () => {
    setGeneral([]);
    clearErrors();

    // قاعده‌های خود فیلدها (عنوان، slug، لینک‌ها، FAQ)
    if (!(await trigger())) {
      const firstInvalid = FIELD_ROOTS.find((name) => getFieldState(name).error);
      if (firstInvalid) setTab(fieldTab(firstInvalid));
      toast.error("چند فیلد نیاز به اصلاح دارد.");
      return;
    }

    const values = getValues();

    if (values.status === "published") {
      if (!values.publishedAt) {
        values.publishedAt = todayDateOnly();
        setValue("publishedAt", values.publishedAt, { shouldDirty: true });
      }
      const problems = validateForPublish(values);
      if (Object.keys(problems).length) {
        showErrors(problems);
        toast.error("برای انتشار، موارد علامت‌خورده را کامل کنید.");
        return;
      }
    }

    setSaving(true);
    try {
      // ۱) ذخیره‌ی محتوا با وضعیت فعلی سرور (جدید = پیش‌نویس)
      let post = meta.id
        ? await updateAdminBlogPost(meta.id, buildPayload(values, meta))
        : await createAdminBlogPost(buildPayload(values, { status: "draft", slugLocked: false }));
      adopt(post);

      // ۲) تغییر وضعیت فقط با endpointهای انتشار/لغو انتشار
      if (values.status === "published" && post.status !== "published") {
        post = await publishAdminBlogPost(post.id);
      } else if (values.status === "draft" && post.status === "published") {
        post = await unpublishAdminBlogPost(post.id);
      }
      adopt(post);

      reset(toFormValues(post, defaultAuthor));
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success(post.status === "published" ? "مقاله ذخیره و منتشر شد." : "پیش‌نویس ذخیره شد.");

      if (isNew) navigate(`/admin/blog/${post.id}/edit`, { replace: true });
    } catch (error) {
      handleError(error);
    } finally {
      setSaving(false);
    }
  };

  const saveLabel = saving
    ? "در حال ذخیره…"
    : wantedStatus === "published"
      ? "ذخیره و انتشار"
      : "ذخیره پیش‌نویس";

  const panel = (name) => (tab === name ? "" : "hidden");

  return (
    <FormProvider {...methods}>
      <form
        className="grid gap-4"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <PageHeader
          title={isNew && !meta.id ? "مقاله‌ی جدید" : "ویرایش مقاله"}
          subtitle={title || "بدون عنوان"}
        >
          <Link to="/admin/blog" className="secondary-button">
            <FiArrowRight size={16} aria-hidden="true" />
            بازگشت به لیست
          </Link>
          <button type="submit" className="primary-button" disabled={saving}>
            <FiSave size={16} aria-hidden="true" />
            {saveLabel}
          </button>
        </PageHeader>

        {general.length > 0 && (
          <div className="blog-general-error" role="alert">
            {general.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        )}

        <div className="dashboard-tabs" role="tablist" aria-label="بخش‌های مقاله">
          {TABS.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={`blog-tab-${item.value}`}
              aria-selected={tab === item.value}
              aria-controls={`blog-panel-${item.value}`}
              className={tab === item.value ? "dashboard-chip is-on" : "dashboard-chip"}
              onClick={() => setTab(item.value)}
            >
              {item.label}
              {tabsWithErrors.has(item.value) && (
                <span className="blog-tab-dot" role="img" aria-label="دارای خطا" />
              )}
            </button>
          ))}
        </div>

        {/* ───────── محتوا ───────── */}
        <section
          id="blog-panel-content"
          role="tabpanel"
          aria-labelledby="blog-tab-content"
          className={`dashboard-panel dashboard-form ${panel("content")}`}
        >
          <Field id="post-title" label="عنوان" required full error={errors.title?.message}>
            <input
              id="post-title"
              className="dashboard-input"
              {...register("title", { required: "عنوان را وارد کنید." })}
            />
          </Field>

          <Field
            id="post-slug"
            label="آدرس (slug)"
            error={errors.slug?.message}
            hint={
              meta.slugLocked
                ? "این مقاله قبلاً منتشر شده و آدرسش قفل است."
                : `فقط a-z، 0-9 و - (حداکثر ${SLUG_MAX} کاراکتر). آدرس نهایی: /blog/${slug || "..."}`
            }
          >
            <input
              id="post-slug"
              dir="ltr"
              className={`dashboard-input text-left ${meta.slugLocked ? "cursor-not-allowed opacity-60" : ""}`}
              readOnly={meta.slugLocked}
              {...register("slug", {
                validate: slugRule,
                // حروف بزرگ و فاصله هنگام تایپ اصلاح می‌شوند
                onChange: (event) => {
                  const raw = event.target.value;
                  const clean = raw.toLowerCase().replace(/\s+/g, "-");
                  if (clean !== raw) setValue("slug", clean, { shouldDirty: true });
                },
              })}
            />
          </Field>

          <Field id="post-category" label="دسته" required error={errors.category?.message}>
            <select id="post-category" className="dashboard-input" {...register("category")}>
              <option value="">انتخاب کنید…</option>
              {BLOG_CATEGORIES.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <Field id="post-author" label="نویسنده" error={errors.author?.message}>
            <input id="post-author" className="dashboard-input" {...register("author")} />
          </Field>

          <Field id="post-date" label="تاریخ انتشار (شمسی)" error={errors.publishedAt?.message} hint="اگر هنگام انتشار خالی باشد، امروز ثبت می‌شود.">
            <PublishDateField id="post-date" />
          </Field>

          <Field id="post-status" label="وضعیت">
            <select id="post-status" className="dashboard-input" {...register("status")}>
              <option value="draft">پیش‌نویس</option>
              <option value="published">منتشرشده</option>
            </select>
          </Field>

          <div className="dashboard-field dashboard-field--full">
            <label className="flex items-center gap-2 text-sm font-bold">
              <input type="checkbox" {...register("featured")} />
              مقاله‌ی ویژه (featured)
            </label>
          </div>

          <Field id="post-tags" label="برچسب‌ها" full error={errors.tags?.message}>
            <TagsField name="tags" />
          </Field>

          <div className="dashboard-field--full">
            <CoverField />
          </div>

          <div className="dashboard-field dashboard-field--full">
            <span className="dashboard-label">
              متن مقاله <span className="blog-required">*</span>
            </span>
            <BlogContentEditor
              value={initialValues.content}
              onChange={(blocks) => {
                setValue("content", blocks, { shouldDirty: true });
                if (errors.content) clearErrors("content");
              }}
            />
            {errors.content?.message && (
              <p className="dashboard-error" role="alert">
                {errors.content.message}
              </p>
            )}
          </div>
        </section>

        {/* ───────── سئو ───────── */}
        <section
          id="blog-panel-seo"
          role="tabpanel"
          aria-labelledby="blog-tab-seo"
          className={`dashboard-panel dashboard-form ${panel("seo")}`}
        >
          <Field
            id="post-seo-title"
            label="عنوان سئو (Title)"
            full
            error={errors.seoTitle?.message}
            hint="اگر خالی بماند، Title صفحه «عنوان مقاله | نام برند وبلاگ» می‌شود."
          >
            <input id="post-seo-title" className="dashboard-input" {...register("seoTitle")} />
            <Counter
              length={(seoTitle ?? "").length}
              max={SEO_TITLE_MAX}
              warnText="در نتایج گوگل بریده می‌شود"
            />
          </Field>

          <Field
            id="post-excerpt"
            label="خلاصه (Meta Description)"
            required
            full
            error={errors.excerpt?.message}
            hint={`بازه‌ی توصیه‌شده ${EXCERPT_MIN.toLocaleString("fa-IR")} تا ${EXCERPT_MAX.toLocaleString("fa-IR")} کاراکتر. همین متن زیر عنوان مقاله هم نمایش داده می‌شود.`}
          >
            <textarea id="post-excerpt" rows={3} className="dashboard-input" {...register("excerpt")} />
            <Counter
              length={(excerpt ?? "").length}
              min={EXCERPT_MIN}
              max={EXCERPT_MAX}
              warnText="خارج از بازه‌ی توصیه‌شده"
            />
          </Field>

          <div className="dashboard-field--full">
            <FaqEditor name="faq" />
          </div>
          <div className="dashboard-field--full">
            <LinksEditor />
          </div>
        </section>

        {/* ───────── نسخه‌ی انگلیسی ───────── */}
        <section
          id="blog-panel-en"
          role="tabpanel"
          aria-labelledby="blog-tab-en"
          className={`dashboard-panel dashboard-form ${panel("en")}`}
        >
          <p className="dashboard-hint dashboard-field--full">
            این بخش اختیاری است. اگر کاملاً خالی بماند، نسخه‌ی انگلیسی و hreflang ساخته نمی‌شود.
            اگر چیزی بنویسید، برای انتشار عنوان، خلاصه و متن انگلیسی هم الزامی است.
          </p>

          <Field id="en-title" label="Title" full error={errors.en?.title?.message}>
            <input id="en-title" dir="ltr" className="dashboard-input text-left" {...register("en.title")} />
          </Field>

          <Field id="en-seo-title" label="SEO title" full error={errors.en?.seoTitle?.message}>
            <input id="en-seo-title" dir="ltr" className="dashboard-input text-left" {...register("en.seoTitle")} />
            <Counter
              length={(enSeoTitle ?? "").length}
              max={SEO_TITLE_MAX}
              warnText="در نتایج گوگل بریده می‌شود"
            />
          </Field>

          <Field id="en-excerpt" label="Excerpt (Meta Description)" full error={errors.en?.excerpt?.message}>
            <textarea id="en-excerpt" dir="ltr" rows={3} className="dashboard-input text-left" {...register("en.excerpt")} />
            <Counter
              length={(enExcerpt ?? "").length}
              min={EXCERPT_MIN}
              max={EXCERPT_MAX}
              warnText="خارج از بازه‌ی توصیه‌شده"
            />
          </Field>

          <Field id="en-tags" label="Tags" error={errors.en?.tags?.message}>
            <TagsField name="en.tags" placeholder="Type a tag and press Enter" dir="ltr" />
          </Field>

          <Field id="en-cover-alt" label="Cover alt text" error={errors.en?.coverAlt?.message}>
            <input id="en-cover-alt" dir="ltr" className="dashboard-input text-left" {...register("en.coverAlt")} />
          </Field>

          <div className="dashboard-field dashboard-field--full">
            <span className="dashboard-label">Content</span>
            <BlogContentEditor
              dir="ltr"
              value={initialValues.en.content}
              onChange={(blocks) => {
                setValue("en.content", blocks, { shouldDirty: true });
                if (errors.en?.content) clearErrors("en.content");
              }}
            />
            {errors.en?.content?.message && (
              <p className="dashboard-error" role="alert">
                {errors.en.content.message}
              </p>
            )}
          </div>

          <div className="dashboard-field--full" dir="ltr">
            <FaqEditor name="en.faq" dir="ltr" />
          </div>
        </section>

        {/* ───────── پیش‌نمایش ───────── */}
        <section
          id="blog-panel-preview"
          role="tabpanel"
          aria-labelledby="blog-tab-preview"
          className={`dashboard-panel ${panel("preview")}`}
        >
          {tab === "preview" && <BlogPreview values={getValues()} />}
        </section>

        <div className="dashboard-form-actions">
          <button type="submit" className="primary-button" disabled={saving}>
            <FiSave size={16} aria-hidden="true" />
            {saveLabel}
          </button>
        </div>
      </form>

      {guard.blocked && (
        <ConfirmModal
          title="تغییرات ذخیره‌نشده"
          text="تغییراتی که ذخیره نکرده‌اید از بین می‌رود. از این صفحه خارج می‌شوید؟"
          confirmLabel="خروج بدون ذخیره"
          danger
          onConfirm={guard.confirm}
          onClose={guard.cancel}
        />
      )}
    </FormProvider>
  );
}

// ───────── لود مقاله (حالت ویرایش) ─────────
export default function AdminBlogPostForm() {
  const { id } = useParams();

  const query = useQuery({
    queryKey: ["admin-blog-post", id],
    queryFn: () => getAdminBlogPost(id),
    enabled: Boolean(id),
    // هر بار باز کردن صفحه، نسخه‌ی تازه از سرور (فرم از روی کش قدیمی ساخته نشود)
    gcTime: 0,
    retry: false,
  });

  if (!id) return <PostEditor key="new" />;

  if (query.isPending) return <EmptyState title="در حال بارگذاری مقاله…" />;

  if (query.isError) {
    const notFound = statusOf(query.error) === 404;
    return (
      <EmptyState
        title={notFound ? "مقاله پیدا نشد" : "دریافت مقاله انجام نشد"}
        text={notFound ? "ممکن است حذف شده باشد یا به شما تعلق نداشته باشد." : apiMessage(query.error)}
      >
        <Link to="/admin/blog" className="secondary-button">
          بازگشت به لیست
        </Link>
      </EmptyState>
    );
  }

  return <PostEditor key={query.data.id} initialPost={query.data} />;
}
