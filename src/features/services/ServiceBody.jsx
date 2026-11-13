import { Link } from "../../i18n/Link";

// رندر بدنه‌ی سئوشده‌ی صفحه‌های «طراحی انواع سایت» (src/data/webDesignContent.js و نسخه‌ی انگلیسی).
// بلوک‌ها: short | p | h2 | ul | ol | table. لینک داخلی داخل متن: {{متن لینک|/مسیر}}
// فقط متن ساده رندر می‌شود (بدون dangerouslySetInnerHTML).

const LINK_RE = /\{\{(.+?)\|(\/[^}]*)\}\}/g;
const LINK_CLASS =
  "font-bold text-primary underline decoration-primary/40 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-primary";

// متن با لینک‌های داخلی → آرایه‌ای از متن و <Link>
export function Inline({ text }) {
  const out = [];
  let last = 0;
  let m;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <Link key={`${m.index}-${m[2]}`} to={m[2]} className={LINK_CLASS}>
        {m[1]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function ShortAnswer({ text }) {
  // «جواب کوتاه:» / «Short answer:» پررنگ؛ بقیه‌ی متن عادی
  const i = text.indexOf(":");
  const hasLabel = i > 0 && i < 24;
  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/10 px-6 py-5">
      <p className="text-base leading-9 md:text-lg">
        {hasLabel && <strong className="font-black">{text.slice(0, i + 1)} </strong>}
        <Inline text={hasLabel ? text.slice(i + 1).trim() : text} />
      </p>
    </div>
  );
}

function Table({ rows }) {
  const [head, ...rest] = rows;
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[32rem] border-collapse text-start text-sm leading-8 md:text-base">
        <thead className="bg-surface-2">
          <tr>
            {head.map((cell, i) => (
              <th key={i} scope="col" className="px-4 py-3 text-start font-black">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rest.map((row, r) => (
            <tr key={r}>
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="px-4 py-3 text-start font-bold">
                    {cell}
                  </th>
                ) : (
                  <td key={i} className="px-4 py-3 text-muted">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ServiceBody({ blocks }) {
  return (
    <div className="space-y-6 text-base leading-[2.2] md:text-lg">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "short":
            return <ShortAnswer key={i} text={b.text} />;
          case "h2":
            return (
              <h2 key={i} className="pt-6 text-2xl font-black leading-[1.6] md:text-3xl">
                {b.text}
              </h2>
            );
          case "ul":
          case "ol": {
            const List = b.type;
            return (
              <List
                key={i}
                className={`space-y-2 ps-6 marker:text-primary ${b.type === "ul" ? "list-disc" : "list-decimal"}`}
              >
                {b.items.map((item, j) => (
                  <li key={j}>
                    <Inline text={item} />
                  </li>
                ))}
              </List>
            );
          }
          case "table":
            return <Table key={i} rows={b.rows} />;
          default:
            return (
              <p key={i}>
                <Inline text={b.text} />
              </p>
            );
        }
      })}
    </div>
  );
}
