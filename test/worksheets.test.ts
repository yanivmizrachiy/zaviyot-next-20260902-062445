import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  WS_PAGES,
  WS_TOTAL,
  TOC_ENTRIES,
  WS_GROUPS,
  TOC_GROUPS,
  wsGroupOf,
  WORKSHEETS,
  WORKSHEETS_TOTAL,
} from "../src/components/worksheets/registry.ts";
import {
  worksheetComponentKey,
  isPrintableKind,
  type WsComponentKey,
} from "../src/components/worksheets/worksheetKind.ts";

const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public");

test("canonical book has exactly 44 pages", () => {
  assert.equal(WS_TOTAL, 44);
  assert.equal(WS_PAGES.length, 44);
});

test("canonical worksheet set is exactly book pages 13-43", () => {
  assert.equal(WORKSHEETS_TOTAL, 31);
  assert.equal(WORKSHEETS.length, 31);
  assert.deepEqual(
    WORKSHEETS.map((worksheet) => worksheet.slot),
    Array.from({ length: 31 }, (_, index) => index + 13),
  );

  WS_PAGES.forEach((page, index) => {
    const slot = index + 1;
    assert.equal(Boolean(page.worksheet), slot >= 13 && slot <= 43, `wrong worksheet classification at page ${slot}`);
  });
});

test("page 44 is the final poster and not a worksheet", () => {
  const finalPage = WS_PAGES[43];
  assert.ok(finalPage, "page 44 missing");
  assert.equal(Boolean(finalPage.worksheet), false);
});

test("every page maps to one canonical component key", () => {
  for (const page of WS_PAGES) {
    const key = worksheetComponentKey(page);
    assert.ok(typeof key === "string" && key.length > 0, `bad key for ${page.title}`);
  }
});

test("content pages map to their exact renderer", () => {
  const expected: Record<string, WsComponentKey> = {
    "intro-a": "intro-a",
    "intro-b": "intro-b",
    "what-we-teach": "what-we-teach",
    "why-models": "why-models",
    "clock-angles": "clock-angles",
    "applet": "applet",
    "protractor-poster": "protractor-poster",
    "right-angle-estimate": "right-angle-estimate",
    "applet-maker": "applet-maker",
    "around-us": "around-us",
    "angles-types": "angles-types",
    "measurement": "measurement",
    "draw-measure": "draw-measure",
    "angle7-1": "angle7-1",
    "angle7-2": "angle7-2",
    "angle7-3": "angle7-3",
    "angle7-4": "angle7-4",
  };

  for (const page of WS_PAGES) {
    if (page.kind !== "content") continue;
    assert.equal(
      worksheetComponentKey(page),
      expected[page.content],
      `content "${page.content}" mapped to the wrong component`,
    );
  }
});

test("cover, toc and image pages map correctly", () => {
  const cover = WS_PAGES.find((page) => page.kind === "cover");
  const toc = WS_PAGES.find((page) => page.kind === "toc");
  const image = WS_PAGES.find((page) => page.kind === "image");
  assert.ok(cover && worksheetComponentKey(cover) === "cover", "cover page missing/mismapped");
  assert.ok(toc && worksheetComponentKey(toc) === "toc", "toc page missing/mismapped");
  assert.ok(image && worksheetComponentKey(image) === "image", "image page missing/mismapped");
});

test("every image page points to a real unique source asset", () => {
  const imageNumbers: number[] = [];
  for (const page of WS_PAGES) {
    if (page.kind !== "image") continue;
    imageNumbers.push(page.img);
    const file = path.join(publicDir, "booklet-worksheets", `page-${String(page.img).padStart(2, "0")}.webp`);
    assert.ok(fs.existsSync(file), `missing image asset: ${file}`);
  }
  assert.equal(new Set(imageNumbers).size, imageNumbers.length, "duplicate img numbers in registry");
});

test("booklet image directory contains no orphaned page assets", () => {
  const referenced = WS_PAGES
    .filter((page): page is Extract<(typeof WS_PAGES)[number], { kind: "image" }> => page.kind === "image")
    .map((page) => `page-${String(page.img).padStart(2, "0")}.webp`)
    .sort();
  const actual = fs
    .readdirSync(path.join(publicDir, "booklet-worksheets"))
    .filter((name) => /^page-\d{2}\.webp$/.test(name))
    .sort();
  assert.deepEqual(actual, referenced, "orphaned or missing booklet page image assets");
});

test("presentation is a separate homepage resource, not book-page metadata", () => {
  const presentation = path.join(publicDir, "presentation", "geometria-kdam-hesekit.pdf");
  assert.ok(fs.existsSync(presentation), `missing presentation asset: ${presentation}`);
});

test("table of contents is derived from toc-marked pages", () => {
  const marked = WS_PAGES
    .map((page, index) => (page.toc ? index + 1 : null))
    .filter((page): page is number => page !== null);
  const tocPages = TOC_ENTRIES.map((entry) => entry.page);
  assert.deepEqual(tocPages, marked, "TOC_ENTRIES order/pages differ from toc-marked pages");

  for (const entry of TOC_ENTRIES) {
    assert.ok(entry.page >= 1 && entry.page <= WS_TOTAL, `TOC entry page ${entry.page} out of range`);
    assert.ok(WS_PAGES[entry.page - 1].toc, `TOC entry points to a non-toc page (${entry.page})`);
  }
});

test("book groups cover all 44 pages once and in order", () => {
  assert.ok(WS_GROUPS.length >= 2, "expected at least two groups");
  assert.equal(WS_GROUPS[0].from, 1, "first group must start at page 1");
  assert.equal(WS_GROUPS[WS_GROUPS.length - 1].to, WS_TOTAL, "last group must end at page 44");

  for (let index = 1; index < WS_GROUPS.length; index += 1) {
    assert.equal(
      WS_GROUPS[index].from,
      WS_GROUPS[index - 1].to + 1,
      `gap/overlap between groups ${index - 1} and ${index}`,
    );
  }

  for (let page = 1; page <= WS_TOTAL; page += 1) {
    assert.ok(wsGroupOf(page), `page ${page} belongs to no group`);
  }
});

test("grouped TOC preserves every entry and global order", () => {
  const flat = TOC_GROUPS.flatMap((group) => group.entries);
  assert.equal(flat.length, TOC_ENTRIES.length, "grouped TOC lost/duplicated entries");
  flat.forEach((entry, index) => {
    assert.equal(entry.ordinal, index + 1, `ordinal of "${entry.label}" is not continuous`);
    assert.equal(entry.page, TOC_ENTRIES[index].page, `entry order differs at index ${index}`);
  });
  for (const group of TOC_GROUPS) {
    assert.ok(group.entries.length > 0, `group "${group.title}" has no TOC entries`);
  }
});

test("worksheet numbering is continuous and mirrors canonical order", () => {
  WORKSHEETS.forEach((worksheet, index) => {
    assert.equal(worksheet.num, index + 1, `worksheet #${index + 1} has num ${worksheet.num}`);
    assert.equal(worksheet.slot, index + 13, `worksheet #${index + 1} is at wrong book page`);
    const page = WS_PAGES[worksheet.slot - 1];
    assert.ok(page.worksheet, `slot ${worksheet.slot} is not worksheet-marked`);
    assert.equal(page.title, worksheet.title, `title mismatch at slot ${worksheet.slot}`);
    assert.ok(page.kind === "image" || page.kind === "content", `worksheet ${worksheet.num} has invalid kind`);
    assert.ok(isPrintableKind(page), `worksheet ${worksheet.num} is not printable`);
    if (page.kind === "image") assert.ok(worksheet.thumb, `image worksheet ${worksheet.num} has no thumb`);
  });

  assert.equal(new Set(WORKSHEETS.map((worksheet) => worksheet.id)).size, WORKSHEETS.length, "duplicate worksheet ids");
});

test("the two applet pages share one open spread and are not worksheets", () => {
  const applet = WS_PAGES.findIndex((page) => page.kind === "content" && page.content === "applet") + 1;
  const maker = WS_PAGES.findIndex((page) => page.kind === "content" && page.content === "applet-maker") + 1;
  assert.ok(applet > 0 && maker > 0, "applet pages missing from registry");
  assert.equal(maker, applet + 1, "applet pages must be adjacent");
  assert.equal(applet % 2, 0, `applet page ${applet} must be even`);
  assert.ok(WS_PAGES.slice(applet - 1, maker).every((page) => !page.worksheet), "applet pages must not be worksheets");
});

test("structural pages are never worksheets", () => {
  for (const page of WS_PAGES) {
    if (page.kind === "cover" || page.kind === "toc") {
      assert.equal(Boolean(page.worksheet), false, `structural page "${page.title}" must not be a worksheet`);
    }
  }
});

test("all 44 canonical book pages are printable", () => {
  for (const page of WS_PAGES) {
    assert.equal(isPrintableKind(page), true, `page is unexpectedly non-printable: ${page.title}`);
  }
});
