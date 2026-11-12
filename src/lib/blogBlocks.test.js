// اجرا:  npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { getSchema } from "@tiptap/core";
import { blocksToDoc, docToBlocks } from "./blogBlocks.js";
import { editorExtensions } from "../features/dashboard/blog/editorExtensions.js";

const schema = getSchema(editorExtensions);
const dir = new URL("../data/blogArticles/", import.meta.url);
const files = readdirSync(dir).filter((name) => name.endsWith(".js"));

const roundTrip = (blocks) => docToBlocks(blocksToDoc(blocks));
// doc باید با schema واقعی ویرایشگر معتبر باشد (وگرنه TipTap در مرورگر خطا می‌دهد)
const validate = (doc) => schema.nodeFromJSON(doc).check();

test("تعداد مقاله‌ها", () => {
  assert.equal(files.length, 10);
});

for (const file of files) {
  const article = (await import(new URL(file, dir))).default;
  const variants = [["fa", article.content]];
  if (article.en?.content) variants.push(["en", article.en.content]);

  for (const [lang, blocks] of variants) {
    test(`${article.slug} (${lang}): رفت‌وبرگشت بدون از دست رفتن داده`, () => {
      assert.deepEqual(roundTrip(blocks), blocks);
    });

    test(`${article.slug} (${lang}): سند با schema ویرایشگر معتبر است`, () => {
      validate(blocksToDoc(blocks));
    });
  }
}

test("بلوک‌های مثال: همه‌ی نوع‌ها با همه‌ی فیلدها", () => {
  const blocks = [
    { type: "h2", text: "عنوان" },
    { type: "h3", text: "زیرعنوان" },
    { type: "p", text: "متن **پررنگ** و [لینک](/services/seo) و [بیرونی](https://example.com/a?b=1)" },
    { type: "ul", items: ["**الف:** یک", "[ب](/b)"] },
    { type: "ol", items: ["یک", "دو"], start: 5 },
    { type: "quote", text: "نقل", cite: "منبع" },
    { type: "image", src: "/uploads/blog/a.webp", alt: "توضیح", caption: "زیرنویس", mobileSrc: "/uploads/blog/a-m.webp" },
    { type: "code", lang: "js", code: "const a = 1;\n\nconsole.log(a);" },
    { type: "table", head: ["الف", "ب"], rows: [["۱", "**۲**"], ["[ج](/c)", "۴"]] },
    { type: "checklist", items: ["الف", "ب"] },
  ];
  assert.deepEqual(roundTrip(blocks), blocks);
  validate(blocksToDoc(blocks));
});

test("بدون start و quote بدون cite و تصویر بدون caption", () => {
  const blocks = [
    { type: "ol", items: ["یک"] },
    { type: "quote", text: "نقل" },
    { type: "image", src: "/a.webp", alt: "الف" },
  ];
  assert.deepEqual(roundTrip(blocks), blocks);
});

test("پررنگ و لینک تودرتو به شکل استاندارد برمی‌گردد و بعد از آن پایدار است", () => {
  const once = roundTrip([{ type: "p", text: "[**متن**](/a) و **[دیگر](/b)**" }]);
  assert.equal(once[0].text, "**[متن](/a)** و **[دیگر](/b)**");
  assert.deepEqual(roundTrip(once), once);
});

test("سینتکس ناقص همان‌طور متن ساده می‌ماند", () => {
  const blocks = [{ type: "p", text: "یک ** باز و [براکت] و [x]( بدون پایان" }];
  assert.deepEqual(roundTrip(blocks), blocks);
});

test("پاراگراف‌های خالی حذف می‌شوند و سند خالی معتبر است", () => {
  assert.deepEqual(docToBlocks(blocksToDoc([])), []);
  validate(blocksToDoc([]));
});

test("نوع ناشناخته خطا می‌دهد (نه حذف بی‌صدا)", () => {
  assert.throws(() => blocksToDoc([{ type: "video" }]), TypeError);
});
