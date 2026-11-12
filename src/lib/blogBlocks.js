// تبدیل دوطرفه‌ی «بلوک‌های مقاله» (قرارداد بک‌اند) ⇄ سند TipTap (ProseMirror JSON).
// فقط JS ساده است تا هم در ویرایشگر و هم در تست‌ها (node:test) کار کند.
//
// داخل متن‌ها فقط دو سینتکس مجاز است:  **پررنگ**  و  [متن لینک](/مسیر یا https://...)
// شکل استاندارد (canonical) هنگام ساخت متن: پررنگ بیرونی و لینک درونی است
// یعنی  **[متن](/a)**  ؛ ورودی‌ی  [**متن**](/a)  هم خوانده می‌شود ولی به شکل استاندارد برمی‌گردد.

const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/y;

const hasMark = (marks, type) => marks.some((mark) => mark.type === type);

const textNode = (text, marks) =>
  marks.length ? { type: "text", text, marks } : { type: "text", text };

// ───────── متن ساده (با ** و لینک) ← گره‌های inline
function parseInline(text, marks = []) {
  const out = [];
  let buffer = "";
  let i = 0;

  const flush = () => {
    if (buffer) out.push(textNode(buffer, marks));
    buffer = "";
  };

  while (i < text.length) {
    if (text.startsWith("**", i) && !hasMark(marks, "bold")) {
      const end = text.indexOf("**", i + 2);
      if (end > i + 2) {
        flush();
        out.push(...parseInline(text.slice(i + 2, end), [...marks, { type: "bold" }]));
        i = end + 2;
        continue;
      }
    }

    if (text[i] === "[" && !hasMark(marks, "link")) {
      LINK_RE.lastIndex = i;
      const match = LINK_RE.exec(text);
      if (match) {
        flush();
        out.push(
          ...parseInline(match[1], [...marks, { type: "link", attrs: { href: match[2] } }]),
        );
        i += match[0].length;
        continue;
      }
    }

    buffer += text[i];
    i += 1;
  }

  flush();
  return out;
}

const inline = (text) => (text ? parseInline(String(text)) : undefined);

const paragraph = (text) => {
  const content = inline(text);
  return content ? { type: "paragraph", content } : { type: "paragraph" };
};

// ───────── گره‌های inline ← متن ساده
const linkOf = (node) => node.marks?.find((mark) => mark.type === "link");

function serializeLinks(nodes) {
  let out = "";
  let i = 0;

  while (i < nodes.length) {
    const link = linkOf(nodes[i]);
    if (!link) {
      out += nodes[i].text ?? "";
      i += 1;
      continue;
    }

    const href = link.attrs?.href ?? "";
    let label = "";
    while (i < nodes.length && linkOf(nodes[i])?.attrs?.href === href) {
      label += nodes[i].text ?? "";
      i += 1;
    }
    out += `[${label}](${href})`;
  }

  return out;
}

const isBold = (node) => hasMark(node.marks ?? [], "bold");

function serializeInline(nodes = []) {
  let out = "";
  let i = 0;

  while (i < nodes.length) {
    if (!isBold(nodes[i])) {
      const start = i;
      while (i < nodes.length && !isBold(nodes[i])) i += 1;
      out += serializeLinks(nodes.slice(start, i));
      continue;
    }

    const start = i;
    while (i < nodes.length && isBold(nodes[i])) i += 1;
    out += `**${serializeLinks(nodes.slice(start, i))}**`;
  }

  return out;
}

const textOf = (node) => serializeInline(node?.content ?? []);

// ───────── بلوک‌ها ← سند TipTap
const listItems = (items = [], itemType) =>
  items.map((item) => ({ type: itemType, content: [paragraph(item)] }));

function blockToNode(block) {
  switch (block.type) {
    case "p":
      return paragraph(block.text);

    case "h2":
    case "h3":
      return {
        type: "heading",
        attrs: { level: block.type === "h2" ? 2 : 3 },
        ...(block.text ? { content: inline(block.text) } : {}),
      };

    case "ul":
      return { type: "bulletList", content: listItems(block.items, "listItem") };

    case "ol":
      return {
        type: "orderedList",
        attrs: { start: Number.isInteger(block.start) && block.start > 1 ? block.start : 1 },
        content: listItems(block.items, "listItem"),
      };

    case "quote":
      return {
        type: "blockquote",
        attrs: { cite: block.cite ?? null },
        content: [paragraph(block.text)],
      };

    case "image":
      return {
        type: "image",
        attrs: {
          src: block.src ?? "",
          alt: block.alt ?? "",
          caption: block.caption ?? null,
          mobileSrc: block.mobileSrc ?? null,
        },
      };

    case "code":
      return {
        type: "codeBlock",
        attrs: { language: block.lang ? block.lang : null },
        ...(block.code ? { content: [{ type: "text", text: block.code }] } : {}),
      };

    case "table": {
      const cell = (type) => (text) => ({ type, content: [paragraph(text)] });
      const rows = [];
      if (block.head?.length) {
        rows.push({ type: "tableRow", content: block.head.map(cell("tableHeader")) });
      }
      (block.rows ?? []).forEach((row) =>
        rows.push({ type: "tableRow", content: row.map(cell("tableCell")) }),
      );
      return { type: "table", content: rows };
    }

    case "checklist":
      return {
        type: "taskList",
        content: (block.items ?? []).map((item) => ({
          type: "taskItem",
          attrs: { checked: false },
          content: [paragraph(item)],
        })),
      };

    default:
      throw new TypeError(`نوع بلوک پشتیبانی‌نشده: ${block.type}`);
  }
}

export function blocksToDoc(blocks = []) {
  const content = (blocks ?? []).map(blockToNode);
  return { type: "doc", content: content.length ? content : [{ type: "paragraph" }] };
}

// ───────── سند TipTap ← بلوک‌ها
const itemsOf = (list) =>
  (list.content ?? []).map((item) => textOf(item.content?.[0])).filter((text) => text !== "");

export function docToBlocks(doc) {
  const blocks = [];

  (doc?.content ?? []).forEach((node) => {
    switch (node.type) {
      case "paragraph": {
        const text = textOf(node);
        if (text !== "") blocks.push({ type: "p", text });
        break;
      }

      case "heading": {
        const text = textOf(node);
        if (text !== "") blocks.push({ type: node.attrs?.level === 3 ? "h3" : "h2", text });
        break;
      }

      case "bulletList": {
        const items = itemsOf(node);
        if (items.length) blocks.push({ type: "ul", items });
        break;
      }

      case "orderedList": {
        const items = itemsOf(node);
        if (!items.length) break;
        const start = Number(node.attrs?.start);
        blocks.push({
          type: "ol",
          items,
          ...(Number.isInteger(start) && start > 1 ? { start } : {}),
        });
        break;
      }

      case "blockquote": {
        const text = (node.content ?? []).map(textOf).filter(Boolean).join("\n");
        if (text === "") break;
        const cite = node.attrs?.cite;
        blocks.push({ type: "quote", text, ...(cite ? { cite } : {}) });
        break;
      }

      case "image": {
        const { src, alt, caption, mobileSrc } = node.attrs ?? {};
        if (!src) break;
        blocks.push({
          type: "image",
          src,
          alt: alt ?? "",
          ...(caption ? { caption } : {}),
          ...(mobileSrc ? { mobileSrc } : {}),
        });
        break;
      }

      case "codeBlock":
        blocks.push({
          type: "code",
          lang: node.attrs?.language ?? "",
          code: (node.content ?? []).map((child) => child.text ?? "").join(""),
        });
        break;

      case "table": {
        const rows = (node.content ?? []).map((row) => ({
          header: (row.content ?? []).every((cell) => cell.type === "tableHeader"),
          cells: (row.content ?? []).map((cell) => textOf(cell.content?.[0])),
        }));
        const hasHead = rows[0]?.header && rows[0].cells.length > 0;
        blocks.push({
          type: "table",
          head: hasHead ? rows[0].cells : [],
          rows: (hasHead ? rows.slice(1) : rows).map((row) => row.cells),
        });
        break;
      }

      case "taskList": {
        const items = itemsOf(node);
        if (items.length) blocks.push({ type: "checklist", items });
        break;
      }

      default:
        break;
    }
  });

  return blocks;
}
