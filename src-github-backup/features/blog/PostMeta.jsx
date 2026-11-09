import { FiCalendar, FiClock, FiUser } from "react-icons/fi";
import { formatDate, formatNumber } from "../../lib/blog";

// تاریخ انتشار، زمان مطالعه و نویسنده؛ هر کدام فقط در صورت وجود نمایش داده می‌شود.
export default function PostMeta({ post, className = "" }) {
  const { publishedAt, readingMinutes, author } = post;

  return (
    <ul
      className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted ${className}`}
    >
      {publishedAt && (
        <li className="inline-flex items-center gap-1.5">
          <FiCalendar size={14} aria-hidden="true" />
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
        </li>
      )}
      {readingMinutes > 0 && (
        <li className="inline-flex items-center gap-1.5">
          <FiClock size={14} aria-hidden="true" />
          {formatNumber(readingMinutes)} دقیقه مطالعه
        </li>
      )}
      {author && (
        <li className="inline-flex items-center gap-1.5">
          <FiUser size={14} aria-hidden="true" />
          {author}
        </li>
      )}
    </ul>
  );
}
