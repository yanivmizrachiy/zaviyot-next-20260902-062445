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
    "src/components/HeroAngleVideo.tsx",
    "src/components/HeroSection.tsx",
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
    "public/video/zaviyot-angles-poster.jpg",
    "public/booklet-worksheets/page-01.webp",
    "public/booklet-worksheets/page-02.webp",
    "public/booklet-worksheets/page-03.webp",
  ].forEach((path) => assert.equal(exists(path), false, `${path} must stay retired`));
});

test("presentation cannot return as a book-page variant", () => {
  const registry = read("src/components/worksheets/registry.ts");
  const kinds = read("src/components/worksheets/worksheetKind.ts");
  const renderer = read("src/components/worksheets/WorksheetPageRenderer.tsx");

  assert.doesNotMatch(registry, /kind:\s*["']presentation["']|presentationSrc|downloadName/);
  assert.doesNotMatch(kinds, /case\s+["']presentation["']|\|\s*["']presentation["']/);
  assert.doesNotMatch(renderer, /PresentationLinkSheet|presentationSrc|case\s+["']presentation["']/);
});

test("legacy worksheet URLs are redirect-only compatibility routes", () => {
  const index = read("src/app/worksheets/page.tsx");
  assert.ok(index.includes('redirect("/?group=worksheets#worksheets")'));
  assert.doesNotMatch(index, /WS_PAGES|WORKSHEETS|worksheetContentNode|UnifiedBookReader/);

  const booklet = read("src/app/worksheets/booklet/page.tsx");
  assert.match(booklet, /redirect\(`\/worksheets\/print\?scope=worksheets/);
  assert.doesNotMatch(booklet, /WsBookletAllBar|worksheetContentNode|WS_PAGES/);

  const single = read("src/app/worksheets/w/[k]/page.tsx");
  assert.match(single, /WORKSHEETS\[k - 1\]\.slot/);
  assert.match(single, /redirect\(`\/worksheets\//);
  assert.doesNotMatch(single, /WsWorksheetBar|worksheetContentNode|WS_PAGES/);
});

test("legacy resource URLs are redirect-only compatibility routes", () => {
  const resources = read("src/app/meshaabim/[n]/page.tsx");
  assert.ok(resources.includes('redirect(`/hamchashot/${n + 9}${sp.print === "1" ? "?print=1" : ""}`)'));
  assert.doesNotMatch(resources, /@\/components\/|export const metadata|<main|<section/);
});

test("legacy angle-types URL redirects to the canonical book page", () => {
  const route = read("src/app/sugei-zaviyot/page.tsx");
  assert.match(route, /WS_PAGES\.findIndex/);
  assert.match(route, /content === "angles-types"/);
  assert.match(route, /redirect\(`\/worksheets\/\$\{slot\}`\)/);
  assert.doesNotMatch(route, /AnglesTypesSheet|ws-sheet|worksheetContentNode/);
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

test("only the approved homepage video assets remain", () => {
  const videoDir = "public/video";
  assert.ok(exists(`${videoDir}/zaviyot-race-lamillion.mp4`));
  assert.ok(exists(`${videoDir}/zaviyot-race-poster.jpg`));
  assert.deepEqual(
    fs.readdirSync(videoDir).sort(),
    ["zaviyot-race-lamillion.mp4", "zaviyot-race-poster.jpg"].sort(),
    "public/video must contain only the approved race video and poster",
  );
});

test("cross-device responsive layer stays last and presentation remains phone-safe", () => {
  const layout = read("src/app/layout.tsx");
  const responsive = read("src/app/responsive-fixes.css");
  const homeActions = read("src/components/HomeQuickActions.tsx");
  const homeStage = read("src/components/HomeBookStage.module.css");

  const globalIndex = layout.indexOf('import "./globals.css"');
  const refinementIndex = layout.indexOf('import "./home-refinement.css"');
  const realismIndex = layout.indexOf('import "./book-realism.css"');
  const responsiveIndex = layout.indexOf('import "./responsive-fixes.css"');
  assert.ok(globalIndex >= 0 && refinementIndex > globalIndex && realismIndex > refinementIndex && responsiveIndex > realismIndex);

  assert.match(homeActions, /mediaDialogPresentation/);
  assert.match(homeActions, /onPointerDown/);
  assert.match(homeStage, /\.mediaDialogPresentation\s*\{[\s\S]*?height:\s*100dvh/);
  assert.match(homeStage, /\.modalPresentation\s+:global\(\.slideshow__stage\)[\s\S]*?aspect-ratio:\s*auto\s*!important/);
  assert.match(homeStage, /orientation:\s*landscape/);
  assert.match(homeStage, /grid-template-columns:\s*repeat\(5,/);

  assert.match(responsive, /\.pdfframe--max\s*\{[\s\S]*?height:\s*100dvh\s*!important/);
  assert.match(responsive, /safe-area-inset-top/);
  assert.match(responsive, /safe-area-inset-bottom/);
  assert.match(responsive, /\.slideshow__stage\s*\{[\s\S]*?overflow:\s*hidden/);
  assert.match(responsive, /\.slidebtn\s*\{[\s\S]*?min-height:\s*40px/);
});
