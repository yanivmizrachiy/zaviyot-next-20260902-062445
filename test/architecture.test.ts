import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const exists = (path: string) => fs.existsSync(path);
const read = (path: string) => fs.readFileSync(path, "utf8");

const NEW_PRODUCTION_URL = "https://zaviyot-next-20260902-062445.vercel.app";
const NEW_PROJECT_ID = "prj_nNLdB3ec30mUsyYVse6cUT7Ib7Hm";
const NEW_PROJECT_NAME = "zaviyot-next-20260902-062445";
const OLD_PRODUCTION_URL = "https://zaviyot.vercel.app";
const OLD_PROJECT_ID = "prj_vBueQ0MqpZWsK5dZt8hOBleIqnYi";

test("repository has one authoritative product truth", () => {
  assert.ok(exists("SOURCE_OF_TRUTH.md"));
  assert.equal(exists("MIGRATION_PROMPT.md"), false);
  assert.equal(exists("claude-implementation.log"), false);
});

test("canonical book data comes only from registry", () => {
  assert.ok(exists("src/components/worksheets/registry.ts"));
  assert.equal(exists("scripts/page-manifest.ts"), false);
  assert.equal(exists("src/components/flipbook"), false);
});

test("retired duplicate product paths stay deleted", () => {
  [
    "src/components/VideoSection.tsx",
    "src/components/worksheets/WorksheetPicker.tsx",
    "src/components/worksheets/WsBookletAllBar.tsx",
    "src/components/worksheets/WsWorksheetBar.tsx",
    "src/app/booklet-design/page-1/page.tsx",
    "scripts/page-manifest.ts",
    "scripts/build-booklet-pdf.mjs",
    "public/booklet/booklet-zaviyot.pdf",
    "src/fonts/GveretLevin-Regular.ttf",
    "public/team/ayelet-krispin.png",
    "public/video/zaviyot-angles-loop.mp4",
    "public/booklet-worksheets/page-01.webp",
    "public/booklet-worksheets/page-02.webp",
    "public/booklet-worksheets/page-03.webp",
  ].forEach((path) => assert.equal(exists(path), false, `${path} must stay retired`));
});

test("legacy worksheet URLs are redirect-only compatibility routes", () => {
  const booklet = read("src/app/worksheets/booklet/page.tsx");
  assert.match(booklet, /redirect\(`\/worksheets\/print\?scope=worksheets/);
  assert.doesNotMatch(booklet, /WsBookletAllBar|worksheetContentNode|WS_PAGES/);

  const single = read("src/app/worksheets/w/[k]/page.tsx");
  assert.match(single, /WORKSHEETS\[k - 1\]\.slot/);
  assert.match(single, /redirect\(`\/worksheets\//);
  assert.doesNotMatch(single, /WsWorksheetBar|worksheetContentNode|WS_PAGES/);
});

test("one canonical PDF builder remains", () => {
  assert.ok(exists("scripts/build-static-print-pdf.mjs"));
  const workflow = read(".github/workflows/build-worksheet-pdfs.yml");
  assert.match(workflow, /scripts\/build-static-print-pdf\.mjs/);
  assert.doesNotMatch(workflow, /build-booklet-pdf/);
});

test("production configuration is locked to the new Zaviyot project", () => {
  const deploy = read("scripts/deploy-production.mjs");
  const sitemap = read("src/app/sitemap.ts");
  const robots = read("src/app/robots.ts");
  const layout = read("src/app/layout.tsx");

  assert.match(deploy, new RegExp(NEW_PROJECT_ID));
  assert.match(deploy, new RegExp(NEW_PROJECT_NAME));
  assert.match(deploy, new RegExp(NEW_PRODUCTION_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(sitemap, new RegExp(NEW_PRODUCTION_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(robots, new RegExp(NEW_PRODUCTION_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(layout, new RegExp(NEW_PRODUCTION_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  for (const file of [deploy, sitemap, robots, layout]) {
    assert.equal(file.includes(OLD_PRODUCTION_URL), false, "old Zaviyot production URL must not be active configuration");
    assert.equal(file.includes(OLD_PROJECT_ID), false, "old Zaviyot project ID must not be active configuration");
  }
});

test("only the approved homepage video asset remains", () => {
  assert.ok(exists("public/video/zaviyot-race-lamillion.mp4"));
  assert.ok(exists("public/video/zaviyot-race-poster.jpg"));
});
