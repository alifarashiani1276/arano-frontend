import { useState } from "react";
import toast from "react-hot-toast";
import { FiSend } from "react-icons/fi";
import { site } from "../../config/site";
import Icon from "../../ui/Icon";
import Reveal from "../../ui/Reveal";
import SectionHeading from "../../ui/SectionHeading";

const FIELD =
  "mt-2 block w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted/70 transition-[border-color,box-shadow] duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-red-500";

const ERROR_CLASS = "mt-1.5 text-xs font-bold text-red-600 dark:text-red-400";

// اعداد فارسی و عربی را به انگلیسی تبدیل می‌کند
function normalizeDigits(value) {
  return value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

// فاصله و خط‌تیره را حذف و پیش‌شماره ایران را به 0 تبدیل می‌کند
export function normalizePhone(raw) {
  let value = normalizeDigits(raw).replace(/[\s\-()]/g, "");
  if (value.startsWith("+98")) value = `0${value.slice(3)}`;
  else if (value.startsWith("0098")) value = `0${value.slice(4)}`;
  else if (value.startsWith("98") && value.length === 12)
    value = `0${value.slice(2)}`;
  return value;
}

// موبایل: 09xxxxxxxxx  |  ثابت: 0 + پیش‌شماره + شماره (جمعاً ۱۱ رقم)
const PHONE_REGEX = /^(09\d{9}|0[1-8]\d{9})$/;

function validateField(name, rawValue, messages) {
  const value = rawValue.trim();

  if (name === "name") {
    if (!value) return messages.nameRequired;
    if (value.length > 60) return messages.nameTooLong;
    if (value.length < 3 || !/\p{L}/u.test(value)) return messages.nameInvalid;
    return "";
  }

  if (name === "phone") {
    if (!value) return messages.phoneRequired;
    return PHONE_REGEX.test(normalizePhone(value)) ? "" : messages.phoneInvalid;
  }

  if (name === "message") {
    if (!value) return messages.messageRequired;
    if (value.length < 10) return messages.messageShort;
    if (value.length > 1000) return messages.messageLong;
    return "";
  }

  return "";
}

const FIELD_ORDER = ["name", "phone", "message"];

export default function Contact() {
  const { contact } = site;
  const { form } = contact;
  const [errors, setErrors] = useState({});

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value, form.errors);
    setErrors((prev) =>
      prev[name] === error ? prev : { ...prev, [name]: error },
    );
  };

  const handleChange = (e) => {
    const { name } = e.target;
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = Object.fromEntries(new FormData(formEl));

    const nextErrors = {};
    FIELD_ORDER.forEach((name) => {
      nextErrors[name] = validateField(
        name,
        String(data[name] ?? ""),
        form.errors,
      );
    });
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((name) => nextErrors[name]);
    if (firstInvalid) {
      formEl.elements[firstInvalid]?.focus();
      return;
    }

    const payload = {
      name: String(data.name).trim(),
      phone: normalizePhone(String(data.phone)),
      message: String(data.message).trim(),
    };

    // TODO: اتصال به endpoint ریلز، مثلاً POST /contacts با همین payload
    // بک‌اند باید همین قواعد را دوباره اعتبارسنجی کند.
    void payload;

    toast.success(contact.successMessage);
    formEl.reset();
    setErrors({});
  };

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
                className="flex flex-col gap-4"
              >
                <div>
                  <label htmlFor="contact-name" className="text-sm font-bold">
                    {form.nameLabel}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    maxLength={80}
                    autoComplete="name"
                    placeholder={form.namePlaceholder}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                      errors.name ? "contact-name-error" : undefined
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className={FIELD}
                  />
                  {errors.name && (
                    <p
                      id="contact-name-error"
                      role="alert"
                      className={ERROR_CLASS}
                    >
                      {errors.name}
                    </p>
                  )}
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
                    maxLength={1200}
                    placeholder={form.messagePlaceholder}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? "contact-message-error" : undefined
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className={`${FIELD} resize-none`}
                  />
                  {errors.message && (
                    <p
                      id="contact-message-error"
                      role="alert"
                      className={ERROR_CLASS}
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98]"
                >
                  {form.submit}
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
