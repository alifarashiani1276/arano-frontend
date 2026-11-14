import { Link } from "../../i18n/Link";
import { SITE_URL } from "../../seo/registry";
import { classifyHref, parseInline } from "../../lib/inlineMarkup";

const LINK_CLASS =
  "font-bold text-primary underline decoration-primary/40 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-primary";

function renderNodes(nodes, keyPrefix) {
  return nodes.map((node, i) => {
    const key = `${keyPrefix}-${i}`;

    if (node.type === "text") return node.text;

    if (node.type === "bold") {
      return (
        <strong key={key} className="font-black">
          {renderNodes(node.children, key)}
        </strong>
      );
    }

    const target = classifyHref(node.href, SITE_URL);
    const label = renderNodes(node.children, key);

    if (target.kind === "internal") {
      return (
        <Link key={key} to={target.to} className={LINK_CLASS}>
          {label}
        </Link>
      );
    }

    if (target.kind === "external") {
      return (
        <a key={key} href={target.href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          {label}
        </a>
      );
    }

    // لینک نامعتبر: فقط متن نشان داده می‌شود
    return label;
  });
}

// متن مقاله با پشتیبانی از **پررنگ** و [لینک](...) (بدون dangerouslySetInnerHTML)
export default function InlineText({ text }) {
  return <>{renderNodes(parseInline(text), "t")}</>;
}
