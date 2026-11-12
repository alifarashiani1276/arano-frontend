import { useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { FiTrash2, FiUploadCloud } from "react-icons/fi";
import { apiMessage } from "../../../lib/api";
import { uploadAdminBlogImage } from "../../../services/adminBlogService";
import { COVER_RATIO, COVER_RATIO_TOLERANCE } from "./postForm";
import { Field } from "./PostFormParts";

const MAX_MB = 8;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

// کاور: آپلود، پیش‌نمایش با نسبت ۱۶۹۰×۹۰۰، هشدار نسبت اشتباه و alt اجباری (برای انتشار)
export default function CoverField() {
  const { control, register, setValue, clearErrors, formState } = useFormContext();
  const cover = useWatch({ control, name: "cover" });
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dims, setDims] = useState(null);

  const src = cover?.src ?? "";
  const errors = formState.errors.cover;

  // ابعاد واقعی تصویر (هم برای کاور تازه‌آپلودشده، هم برای مقاله‌ی ذخیره‌شده)
  useEffect(() => {
    if (!src) {
      setDims(null);
      return undefined;
    }
    let cancelled = false;
    const image = new Image();
    image.onload = () => !cancelled && setDims({ w: image.naturalWidth, h: image.naturalHeight });
    image.onerror = () => !cancelled && setDims(null);
    image.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  const ratioOff =
    dims && Math.abs(dims.w / dims.h - COVER_RATIO) / COVER_RATIO > COVER_RATIO_TOLERANCE;

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError("");
    if (!TYPES.includes(file.type)) return setUploadError("فقط JPG، PNG یا WebP پذیرفته می‌شود.");
    if (file.size > MAX_MB * 1024 * 1024) {
      return setUploadError(`حجم تصویر باید کمتر از ${MAX_MB} مگابایت باشد.`);
    }

    setUploading(true);
    try {
      const { url } = await uploadAdminBlogImage(file);
      setValue("cover.src", url, { shouldDirty: true });
      // نسخه‌ی موبایل قبلی مال تصویر قبلی بود
      setValue("cover.mobileSrc", "", { shouldDirty: true });
      clearErrors("cover.src");
    } catch (error) {
      const first = Object.values(error.response?.data?.errors ?? {})[0];
      const message = (Array.isArray(first) ? first[0] : first) || apiMessage(error, "آپلود کاور انجام نشد.");
      setUploadError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const remove = () => {
    setValue("cover.src", "", { shouldDirty: true });
    setValue("cover.mobileSrc", "", { shouldDirty: true });
  };

  return (
    <div className="grid gap-3">
      <span className="dashboard-label">
        کاور مقاله <span className="blog-required">*</span>
      </span>

      {src ? (
        <div className="blog-cover-frame">
          <img src={src} alt={cover?.alt || "پیش‌نمایش کاور"} />
        </div>
      ) : (
        <div className="blog-cover-frame grid place-items-center text-sm text-muted">
          هنوز کاوری انتخاب نشده است
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept={TYPES.join(",")}
          className="sr-only"
          onChange={onFile}
          tabIndex={-1}
          aria-hidden="true"
        />
        <button
          type="button"
          className="secondary-button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          <FiUploadCloud size={16} aria-hidden="true" />
          {uploading ? "در حال آپلود…" : src ? "تعویض کاور" : "آپلود کاور"}
        </button>
        {src && (
          <button type="button" className="secondary-button" onClick={remove}>
            <FiTrash2 size={16} aria-hidden="true" />
            حذف کاور
          </button>
        )}
        {dims && (
          <span className="dashboard-hint" dir="ltr">
            {dims.w}×{dims.h}
          </span>
        )}
      </div>

      <p className="dashboard-hint">
        اندازه‌ی پیشنهادی ۱۶۹۰×۹۰۰ پیکسل (WebP، JPG یا PNG، حداکثر {MAX_MB} مگابایت).
      </p>
      {ratioOff && (
        <p className="blog-counter blog-counter--warn" role="status">
          نسبت این تصویر با ۱۶۹۰×۹۰۰ فرق دارد و در کارت و صفحه‌ی مقاله برش می‌خورد.
        </p>
      )}
      {(uploadError || errors?.src?.message) && (
        <p className="dashboard-error" role="alert">
          {uploadError || errors.src.message}
        </p>
      )}

      <Field
        id="cover-alt"
        label="متن جایگزین کاور (alt)"
        required
        error={errors?.alt?.message}
        hint="تصویر را برای کسی که نمی‌بیند و برای موتور جست‌وجو توصیف کنید."
      >
        <input id="cover-alt" className="dashboard-input" {...register("cover.alt")} />
      </Field>
    </div>
  );
}
