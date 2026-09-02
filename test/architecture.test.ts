import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const exists = (path: string) => fs.existsSync(path);
const read = (path: string) => fs.readFileSync(path, "utf8");

test("repository has one authoritative product truth", () => {
  assert.ok(exists("SOURCE_OF_TRUTH.md"));
  assert.equal(exists("MIGRATION_PROMPT.md"), false);
  assert.equal(exists("claude-implementation.log"), false);
});

test("canonical book data comes from registry", () => {
  assert.ok(exists("src/components/worksheets/registry.ts"));
  const manifest = read("scripts/page-manifest.ts");
  assert.match(manifest, /from ["']\.\.\/src\/components\/worksheets\/registry\.ts["']/);
  assert.equal(exists("src/components/flipbook"), false);
});

test("retired duplicate product paths stay deleted", () => {
  [
    "src/components/VideoSection.tsx",
    "src/app/booklet-design/page-1/page.tsx",
    "scripts/build-booklet-pdf.mjs",
    "public/booklet/booklet-zaviyot.pdf",
    "src/fonts/GveretLevin-Regular.ttf",
    "public/team/ayelet-krispin.png",
    "public/video/zaviyot-angles-loop.mp4",
  ].forEach((path) => assert.equal(exists(path), false, `${path} must stay retired`));
});

test("one canonical PDF builder remains", () => {
  assert.ok(exists("scripts/build-static-print-pdf.mjs"));
  const workflow = read(".github/workflows/build-worksheet-pdfs.yml");
  assert.match(workflow, /scripts\/build-static-print-pdf\.mjs/);
  assert.doesNotMatch(workflow, /build-booklet-pdf/);
});

test("only the approved homepage video asset remains", () => {
  assert.ok(exists("public/video/zaviyot-race-lamillion.mp4"));
  assert.ok(exists("public/video/zaviyot-race-poster.jpg"));
});
