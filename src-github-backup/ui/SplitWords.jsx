import { Fragment } from "react";

// متن را کلمه‌به‌کلمه می‌شکند (نه حرف‌به‌حرف؛ چون حروف فارسی به هم وصل‌اند).
// هر کلمه از یک ماسک بالا می‌آید. start: شماره‌ی شروع برای تأخیر پله‌ای.
export default function SplitWords({ text, start = 0 }) {
  const words = text.split(" ").filter(Boolean);
  return words.map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span className="mw">
        <span className="mw-i" style={{ "--i": start + i }}>
          {word}
        </span>
      </span>
      {i < words.length - 1 ? " " : null}
    </Fragment>
  ));
}
