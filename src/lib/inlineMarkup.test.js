import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyHref, parseInline, stripInline } from "./inlineMarkup.js";

const SITE = "https://aranogroup.ir";

test("متن ساده بدون تغییر", () => {
  assert.deepEqual(parseInline("سلام دنیا"), [{ type: "text", text: "سلام دنیا" }]);
});

test("پررنگ", () => {
  assert.deepEqual(parseInline("الف **ب** ج"), [
    { type: "text", text: "الف " },
    { type: "bold", children: [{ type: "text", text: "ب" }] },
    { type: "text", text: " ج" },
  ]);
});

test("لینک", () => {
  assert.deepEqual(parseInline("[متن](/blog)"), [
    { type: "link", href: "/blog", children: [{ type: "text", text: "متن" }] },
  ]);
});

test("پررنگِ دارای لینک و لینکِ دارای پررنگ", () => {
  const a = parseInline("**[x](/a)**");
  assert.equal(a[0].type, "bold");
  assert.equal(a[0].children[0].type, "link");
  const b = parseInline("[**x**](/a)");
  assert.equal(b[0].type, "link");
  assert.equal(b[0].children[0].type, "bold");
});

test("نشانه‌ی ناقص به‌صورت متن می‌ماند", () => {
  assert.equal(stripInline("a ** b"), "a ** b");
  assert.equal(stripInline("[x]( y"), "[x]( y");
});

test("stripInline نشانه‌ها را برمی‌دارد", () => {
  assert.equal(stripInline("**الف** و [ب](/c)"), "الف و ب");
});

test("classifyHref: داخلی، بیرونی، نامعتبر", () => {
  assert.deepEqual(classifyHref("/services/seo", SITE), { kind: "internal", to: "/services/seo" });
  assert.deepEqual(classifyHref("https://example.com/a", SITE), {
    kind: "external",
    href: "https://example.com/a",
  });
  assert.equal(classifyHref("javascript:alert(1)", SITE).kind, "none");
  assert.equal(classifyHref("data:text/html,x", SITE).kind, "none");
  assert.equal(classifyHref("//evil.com", SITE).kind, "none");
  assert.equal(classifyHref("http://example.com", SITE).kind, "none");
});

test("classifyHref: لینک مطلق به همین سایت داخلی می‌شود", () => {
  assert.deepEqual(classifyHref("https://aranogroup.ir/blog", SITE), { kind: "internal", to: "/blog" });
  assert.deepEqual(classifyHref("https://www.aranogroup.ir/en/blog/x#a", SITE), {
    kind: "internal",
    to: "/blog/x#a",
  });
  assert.deepEqual(classifyHref("https://aranogroup.ir", SITE), { kind: "internal", to: "/" });
});
