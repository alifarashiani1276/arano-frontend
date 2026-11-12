// extensionهای ویرایشگر محتوا. فقط nodeها/markهایی که در «بلوک‌های مقاله» وجود دارند.
// italic، strike، underline، inline-code، H1، خط افقی و hardBreak عمداً خاموش‌اند
// چون در قالب بلوک‌ها جا ندارند و هنگام ذخیره از بین می‌رفتند.
// فایل JS ساده است تا تست‌ها (node:test) هم بتوانند schema را بسازند.
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Blockquote from "@tiptap/extension-blockquote";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { ListItem, TaskList, TaskItem } from "@tiptap/extension-list";

// نقل‌قول: فقط یک پاراگراف + cite اختیاری
const Quote = Blockquote.extend({
  content: "paragraph",
  addAttributes() {
    return { ...this.parent?.(), cite: { default: null } };
  },
});

// تصویر: alt و caption اجباری (در UI)، mobileSrc فقط برای حفظ داده‌ی قدیمی
const BlogImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: { default: null },
      mobileSrc: { default: null },
    };
  },
});

// آیتم لیست و سلول جدول فقط متن inline دارند (در قالب بلوک‌ها ساختار تودرتو نداریم)
const BlogListItem = ListItem.extend({ content: "paragraph" });
const BlogTaskItem = TaskItem.extend({ content: "paragraph" });
const BlogCell = TableCell.extend({ content: "paragraph" });
const BlogHeaderCell = TableHeader.extend({ content: "paragraph" });

export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    blockquote: false,
    listItem: false,
    italic: false,
    strike: false,
    underline: false,
    code: false,
    horizontalRule: false,
    hardBreak: false,
    link: { openOnClick: false, autolink: false, linkOnPaste: false },
  }),
  Quote,
  BlogListItem,
  BlogImage.configure({ inline: false, allowBase64: false }),
  Table.configure({ resizable: false }),
  TableRow,
  BlogHeaderCell,
  BlogCell,
  TaskList,
  BlogTaskItem.configure({ nested: false }),
];
