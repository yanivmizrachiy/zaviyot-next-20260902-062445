import test from "node:test";
import assert from "node:assert/strict";
import { WS_PAGES, WS_TOTAL, WORKSHEETS, WORKSHEETS_TOTAL } from "../src/components/worksheets/registry.ts";

test("book has 44 pages but only 31 real worksheets", () => {
  assert.equal(WS_TOTAL, 44, "canonical book page count changed");
  assert.equal(WORKSHEETS_TOTAL, 31, "canonical worksheet count changed");
  assert.equal(WORKSHEETS.length, 31, "worksheet registry count differs from WORKSHEETS_TOTAL");
});

test("only book slots 13 through 43 are worksheets", () => {
  const worksheetSlots = WORKSHEETS.map((entry) => entry.slot);
  const expectedSlots = Array.from({ length: 31 }, (_, index) => index + 13);
  assert.deepEqual(worksheetSlots, expectedSlots, "worksheet slots must be exactly 13..43");

  for (let slot = 1; slot <= WS_TOTAL; slot += 1) {
    const page = WS_PAGES[slot - 1];
    const expectedWorksheet = slot >= 13 && slot <= 43;
    assert.equal(Boolean(page.worksheet), expectedWorksheet, `wrong worksheet classification at book page ${slot}: ${page.title}`);
  }
});

test("cover, intro pages and final poster are never worksheets", () => {
  for (const slot of [...Array.from({ length: 12 }, (_, index) => index + 1), 44]) {
    const page = WS_PAGES[slot - 1];
    assert.ok(page, `missing canonical book page ${slot}`);
    assert.equal(page.worksheet, undefined, `book page ${slot} must not be labeled as a worksheet: ${page.title}`);
  }
});
