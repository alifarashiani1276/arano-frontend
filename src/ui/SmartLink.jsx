import { Link } from "react-router-dom";

// لینک داخلی (مسیر یا مسیر+هش مثل "/#contact") با Link رد می‌شود تا صفحه Reload نشود؛
// بقیه (مثل "#contact" یا آدرس بیرونی) همان <a> ساده‌اند.
export default function SmartLink({ href, children, ...rest }) {
  if (typeof href === "string" && href.startsWith("/")) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
