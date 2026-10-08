import { useState } from "react";
import toast from "react-hot-toast";
import { FiSend } from "react-icons/fi";
import { site } from "../../config/site";
import { apiMessage, statusOf } from "../../lib/api";
import { MOBILE_REGEX, normalizePhone, sanitizeText } from "../../lib/security";
import { sendConsultation } from "../../services/consultationService";
import Icon from "../../ui/Icon";
import Reveal from "../../ui/Reveal";
import SectionHeading from "../../ui/SectionHeading";

const FIELD =
  "mt-2 block w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted/70 transition-[border-color,box-shadow] duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-red-500";

const ERROR_CLASS = "mt-1.5 text-xs font-bold text-red-600 dark:text-red-400";

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1000;

// همان قاعده‌ی بک‌اند: حروف فارسی/عربی، انگلیسی، فاصله و نیم‌فاصله
const NAME_RE = /^[\p{Script=Arabic}A-Za-z\s\u200c]+$/u;

const FIELD_ORDER = ["first_name", "last_name", "phone", "message"];

// مقدار تمیزشده و پیام خطای هر فیلد
function checkField(name, raw, m) {
  if (name === "first_name" || name === "last_name") {
    const value = sanitizeText(raw);
    if (!value) {
      return {
        value,
        error:
          name === "first_name"
            ? "نام را وارد کنید."
            : "نام خانوادگی را وارد کنید.",
      };
    }
    if (value.length < 2 || value.length > 40 || !NAME_RE.test(value)) {
      return { value, error: m.nameInvalid };
    }
    return { value, error: "" };
  }

  if (name === "phone") {
    const value = normalizePhone(raw);
    if (!value) return { value, error: m.phoneRequired };
    return { value, error: MOBILE_REGEX.test(value) ? "" : m.phoneInvalid };
  }

  // message
  const value = sanitizeText(raw, { multiline: true });
  if (!value) return { value, error: m.messageRequired };
  if (value.length < MESSAGE_MIN) return { value, error: m.messageShort };
  if (value.length > MESSAGE_MAX) return { value, error: m.messageLong };
  return { value, error: "" };
}

export default function Contact() {
  const { contact } = site;
  const { form } = contact;
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [messageLength, setMessageLength] = useState(0);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const { error } = checkField(name, value, form.errors);
    setErrors((prev) =>
      prev[name] === error ? prev : { ...prev, [name]: error },
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "message") setMessageLength(value.length);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const resetForm = (formEl) => {
    formEl.reset();
    setErrors({});
    setMessageLength(0);
  };

  // خطاهای ۴۲۲ بک‌اند را به پیام فارسی همان فیلد تبدیل می‌کند
  const serverErrors = (err) => {
    const raw = err.response?.data?.errors;
    if (statusOf(err) !== 422 || !raw) return {};
    const m = form.errors;
    const fallback = {
      first_name: m.nameInvalid,
      last_name: m.nameInvalid,
      phone: m.phoneInvalid,
      message: m.messageInvalid,
    };
    const out = {};
    FIELD_ORDER.forEach((name) => {
      if (raw[name]) out[name] = fallback[name];
    });
    return out;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const formEl = e.currentTarget;
    const data = Object.fromEntries(new FormData(formEl));

    const nextErrors = {};
    const clean = {};
    FIELD_ORDER.forEach((name) => {
      const result = checkField(name, String(data[name] ?? ""), form.errors);
      nextErrors[name] = result.error;
      clean[name] = result.value;
    });
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((name) => nextErrors[name]);
    if (firstInvalid) {
      formEl.elements[firstInvalid]?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await sendConsultation(clean);
      toast.success(contact.successMessage);
      resetForm(formEl);
    } catch (err) {
      const fieldErrs = serverErrors(err);
      if (Object.keys(fieldErrs).length) {
        setErrors((prev) => ({ ...prev, ...fieldErrs }));
        formEl.elements[Object.keys(fieldErrs)[0]]?.focus();
      } else {
        toast.error(apiMessage(err, form.errors.failed));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const textField = ({ name, id, label, placeholder, autoComplete }) => (
    <div>
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="text"
        required
        maxLength={40}
        autoComplete={autoComplete}
        spellCheck={false}
        placeholder={placeholder}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${id}-error` : undefined}
        onBlur={handleBlur}
        onChange={handleChange}
        className={FIELD}
      />
      {errors[name] && (
        <p id={`${id}-error`} role="alert" className={ERROR_CLASS}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-24 py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-5">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface-2 p-5 sm:p-8 md:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
          />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <SectionHeading id="contact-title" {...site.sections.contact} />

              <Reveal delay={1}>
                <ul className="mt-8 flex flex-col gap-4">
                  {contact.items.map((item) => (
                    <li key={item.label} className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                        <Icon name={item.icon} size={17} />
                      </span>
                      <span className="min-w-0 leading-6">
                        <span className="block text-xs text-muted">
                          {item.label}
                        </span>
                        {item.href ? (
                          <a
                            href={item.href}
                            dir={item.ltr ? "ltr" : undefined}
                            className="break-all text-sm font-bold transition-colors duration-200 hover:text-primary"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <span className="text-sm font-bold">
                            {item.value}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={2}>
              <form
                onSubmit={handleSubmit}
                noValidate
                autoComplete="on"
                aria-busy={submitting}
                className="relative flex flex-col gap-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {textField({
                    name: "first_name",
                    id: "contact-first-name",
                    label: "نام",
                    placeholder: "مثلاً علی",
                    autoComplete: "given-name",
                  })}
                  {textField({
                    name: "last_name",
                    id: "contact-last-name",
                    label: "نام خانوادگی",
                    placeholder: "مثلاً رضایی",
                    autoComplete: "family-name",
                  })}
                </div>

                <div>
                  <label htmlFor="contact-phone" className="text-sm font-bold">
                    {form.phoneLabel}
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    required
                    dir="ltr"
                    maxLength={20}
                    autoComplete="tel"
                    spellCheck={false}
                    placeholder={form.phonePlaceholder}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={
                      errors.phone ? "contact-phone-error" : undefined
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className={`${FIELD} text-left`}
                  />
                  {errors.phone && (
                    <p
                      id="contact-phone-error"
                      role="alert"
                      className={ERROR_CLASS}
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="text-sm font-bold"
                  >
                    {form.messageLabel}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    maxLength={MESSAGE_MAX}
                    placeholder={form.messagePlaceholder}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message
                        ? "contact-message-error"
                        : "contact-message-count"
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className={`${FIELD} resize-none`}
                  />
                  <div className="mt-1.5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {errors.message && (
                        <p
                          id="contact-message-error"
                          role="alert"
                          className={`${ERROR_CLASS} mt-0`}
                        >
                          {errors.message}
                        </p>
                      )}
                    </div>
                    <span
                      id="contact-message-count"
                      dir="ltr"
                      className="shrink-0 text-xs text-muted"
                    >
                      {messageLength}/{MESSAGE_MAX}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? form.submitting : form.submit}
                  <FiSend
                    size={15}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:-translate-x-1"
                  />
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
