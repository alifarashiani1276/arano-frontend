import { Controller, useFormContext } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { TagsInput } from "react-tag-input-component";
import { todayDateOnly } from "./postForm";
import "./blogPostForm.css";

const fa = (n) => Number(n).toLocaleString("fa-IR");

// برچسب + کنترل + راهنما + خطا
export function Field({ id, label, hint, error, full, required, children }) {
  return (
    <div className={`dashboard-field ${full ? "dashboard-field--full" : ""}`}>
      <label htmlFor={id} className="dashboard-label">
        {label}
        {required && <span className="blog-required"> *</span>}
      </label>
      {children}
      {hint && <p className="dashboard-hint">{hint}</p>}
      {error && (
        <p className="dashboard-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// شمارنده‌ی کاراکتر. max: هشدار بالای حد | min و max: بازه‌ی توصیه‌شده
export function Counter({ length, min, max, warnText }) {
  const out = (max != null && length > max) || (min != null && length > 0 && length < min);
  return (
    <p className={`blog-counter ${out ? "blog-counter--warn" : ""}`} aria-live="polite">
      {fa(length)}
      {max != null && ` / ${fa(max)}`} کاراکتر
      {out && warnText ? ` — ${warnText}` : ""}
    </p>
  );
}

export function TagsField({ name, placeholder = "برچسب را بنویسید و Enter بزنید", dir }) {
  const { control } = useFormContext();
  return (
    <div className="blog-tags" dir={dir}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <TagsInput
            name={name}
            value={field.value ?? []}
            onChange={field.onChange}
            placeHolder={placeholder}
            separators={["Enter", ","]}
          />
        )}
      />
    </div>
  );
}

// ذخیره: «YYYY-MM-DD» میلادی | نمایش و انتخاب: تقویم شمسی
const pad = (n) => String(n).padStart(2, "0");
const toPickerValue = (iso) => (iso ? new Date(`${iso}T12:00:00`) : null);
const fromPicker = (dateObject) => {
  if (!dateObject) return "";
  const date = dateObject.toDate();
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export function PublishDateField({ id }) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name="publishedAt"
      render={({ field }) => (
        <div className="flex items-center gap-2">
          <DatePicker
            id={id}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            format="YYYY/MM/DD"
            inputClass="dashboard-input"
            containerStyle={{ width: "100%" }}
            placeholder="انتخاب تاریخ"
            value={toPickerValue(field.value)}
            onChange={(value) => field.onChange(fromPicker(value))}
          />
          <button
            type="button"
            className="secondary-button"
            onClick={() => field.onChange(todayDateOnly())}
          >
            امروز
          </button>
          {field.value && (
            <button type="button" className="secondary-button" onClick={() => field.onChange("")}>
              پاک
            </button>
          )}
        </div>
      )}
    />
  );
}
