import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

test("homepage booklet is wired to the unified reader, not the legacy flipbook", () => {
  const booklet = read("src/components/WorksheetsBookletBook.tsx");
  assert.match(booklet, /UnifiedBookReader/);
  assert.doesNotMatch(booklet, /FlipbookViewer/);
});

test("unified reader derives content from the canonical worksheet registry", () => {
  const reader = read("src/components/book/UnifiedBookReader.tsx");
  assert.match(reader, /WS_PAGES/);
  assert.match(reader, /WS_GROUPS/);
  assert.match(reader, /WORKSHEETS/);
  assert.match(reader, /עמוד/);
  assert.match(reader, /כפולה/);
  assert.match(reader, /גלילה/);
  assert.match(reader, /תוכן העניינים/);
  assert.doesNotMatch(reader, /לוח מונים/);
  assert.match(reader, /צבע מלא/);
  assert.match(reader, /שחור־לבן/);
  assert.match(reader, /zaviyot-worksheets-bw\.pdf/);
});

test("book opens as a single cover and then as real inside spreads on wide screens", () => {
  const reader = read("src/components/book/UnifiedBookReader.tsx");
  const layout = read("src/app/layout.tsx");
  assert.match(reader, /direction === 1 && page === 1 && mode === "single" && !isNarrow/);
  assert.match(reader, /direction === -1 && mode === "spread" && !isNarrow && page <= 3/);
  assert.match(reader, /const spreadStart = page <= 1 \? 1 : page % 2 === 0 \? page : page - 1/);
  assert.match(reader, /initialPage === 1\s*\? "single"/);
  assert.doesNotMatch(layout, /zaviyot-responsive-reader-default/);
});

test("worksheet route points to the worksheet group inside the same book", () => {
  const page = read("src/app/worksheets/page.tsx");
  assert.match(page, /group=worksheets#worksheets/);
});

test("print route supports selected pages, worksheet scope and black-white output", () => {
  const page = read("src/app/worksheets/print/page.tsx");
  assert.match(page, /sp\.pages/);
  assert.match(page, /scope === "worksheets"/);
  assert.match(page, /tone === "bw"/);
  assert.match(page, /WORKSHEETS\.map/);
});

test("embedded page mode removes duplicate per-page controls", () => {
  const page = read("src/app/worksheets/[n]/page.tsx");
  assert.match(page, /reader\?: string/);
  assert.match(page, /sp\.reader === "1"/);
  assert.match(page, /!embedded/);
});
