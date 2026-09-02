import assert from "node:assert/strict";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.TEST_PORT ?? 4873);
const BASE = `http://127.0.0.1:${PORT}`;
let server: ChildProcess | null = null;

async function waitForServer(timeoutMs = 60_000): Promise<void> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(3000) });
      if (response.ok) return;
    } catch {
      // server still starting
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("next start did not become ready in time");
}

test.before(async () => {
  try {
    await fetch(`${BASE}/`, { signal: AbortSignal.timeout(1500) });
    throw new Error(`port ${PORT} is already serving`);
  } catch (error) {
    if (error instanceof Error && error.message.includes("already serving")) throw error;
  }

  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  server = spawn(command, ["next", "start", "--hostname", "127.0.0.1", "--port", String(PORT)], {
    cwd: appDir,
    stdio: "ignore",
    shell: process.platform === "win32",
  });
  await waitForServer();
});

test.after(() => {
  if (server?.pid && process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    server?.kill();
  }
});

async function getHtml(route: string): Promise<string> {
  const response = await fetch(`${BASE}${route}`, { signal: AbortSignal.timeout(15_000) });
  assert.equal(response.status, 200, `${route} should return 200`);
  return response.text();
}

const CASES: { route: string; name: string; must: string[]; mustNot?: string[] }[] = [
  { route: "/worksheets/1", name: "cover", must: ["מורים יקרים"], mustNot: ["דף עבודה מספר"] },
  { route: "/worksheets/2", name: "toc", must: ["תוכן העניינים", "/worksheets/3"] },
  { route: "/worksheets/3", name: "intro-a", must: ["לומדים ומלמדים"], mustNot: ["מטרות הלמידה"] },
  { route: "/worksheets/4", name: "intro-b", must: ["למה ללמוד להבנה"], mustNot: ["מטרות הלמידה"] },
  { route: "/worksheets/5", name: "what-we-teach", must: ["מה אנחנו מלמדים"] },
  { route: "/worksheets/6", name: "why-models", must: ["למה נשתמש בהמחשות", "השורה התחתונה"] },
  { route: "/worksheets/7", name: "angles-types", must: ["זווית חדה"] },
  { route: "/worksheets/9", name: "measurement", must: ["מדידה ואומדן של זוויות"] },
  { route: "/worksheets/10", name: "Matific", must: ["Matific"] },
  { route: "/worksheets/11", name: "StoryboardThat", must: ["StoryboardThat"] },
  { route: "/worksheets/12", name: "protractor poster", must: ["פוסטר — כיצד להשתמש במד זווית", "poster-mad-zavit.pdf"] },
  { route: "/worksheets/13", name: "first worksheet", must: ["דף עבודה מספר 1 מתוך 31", "רשמו האם הזווית"] },
  { route: "/worksheets/14", name: "worksheet image", must: ["דף עבודה מספר 2 מתוך 31", "/booklet-worksheets/page-04.webp"] },
  { route: "/worksheets/21", name: "clock worksheet", must: ["מה גודל הזווית בין מחוגי השעון"] },
  { route: "/worksheets/25", name: "word-bank image", must: ["/booklet-worksheets/page-16.webp"] },
  { route: "/worksheets/26", name: "draw-measure", must: ["שרטוט ומדידת זוויות"] },
  { route: "/worksheets/44", name: "final poster", must: ["/booklet-worksheets/page-14.webp"], mustNot: ["דף עבודה מספר"] },
  { route: "/hamchashot", name: "aid topics", must: ["אביזרים נלווים להמחשה", "/hamchashot/t/coords"] },
  { route: "/hamchashot/t/coords", name: "aid topic", must: ["רביע ראשון עם מספרים", "לרשימת הנושאים"] },
  { route: "/hamchashot/9?bw=1", name: "aid reader BW", must: ["ws-bw", "רביע ראשון עם מספרים"] },
];

for (const item of CASES) {
  test(`route ${item.route} renders ${item.name}`, async () => {
    const html = await getHtml(item.route);
    for (const marker of item.must) assert.ok(html.includes(marker), `${item.route}: missing ${marker}`);
    for (const marker of item.mustNot ?? []) assert.ok(!html.includes(marker), `${item.route}: must not contain ${marker}`);
  });
}

test("/worksheets points to the worksheet group in the unified reader", async () => {
  const response = await fetch(`${BASE}/worksheets`, { signal: AbortSignal.timeout(15_000) });
  assert.equal(response.status, 200);
  const finalUrl = new URL(response.url);
  const html = await response.text();
  assert.ok(
    (finalUrl.pathname === "/" && finalUrl.searchParams.get("group") === "worksheets") ||
      html.includes("group=worksheets"),
    "/worksheets must resolve to the unified reader worksheet group",
  );
});

test("legacy worksheet number route resolves to the canonical book page", async () => {
  const response = await fetch(`${BASE}/worksheets/w/1`, { signal: AbortSignal.timeout(15_000) });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(html.includes("רשמו האם הזווית"));
  assert.equal(new URL(response.url).pathname, "/worksheets/13");
});

test("legacy B/W worksheet route resolves to the canonical print route", async () => {
  const response = await fetch(`${BASE}/worksheets/w/2?bw=1`, { signal: AbortSignal.timeout(15_000) });
  assert.equal(response.status, 200);
  const finalUrl = new URL(response.url);
  const html = await response.text();
  assert.equal(finalUrl.pathname, "/worksheets/print");
  assert.equal(finalUrl.searchParams.get("pages"), "14");
  assert.equal(finalUrl.searchParams.get("tone"), "bw");
  assert.ok(html.includes("bkprint--bw"));
});

test("legacy worksheet booklet route resolves to the canonical worksheet print scope", async () => {
  const response = await fetch(`${BASE}/worksheets/booklet`, { signal: AbortSignal.timeout(15_000) });
  assert.equal(response.status, 200);
  const finalUrl = new URL(response.url);
  const html = await response.text();
  assert.equal(finalUrl.pathname, "/worksheets/print");
  assert.equal(finalUrl.searchParams.get("scope"), "worksheets");
  assert.ok(html.includes("data-source-page=\"13\""));
  assert.ok(!html.includes("data-source-page=\"1\""));
  assert.ok(!html.includes("data-source-page=\"44\""));
});

test("canonical print route renders the full book when no worksheet scope is requested", async () => {
  const html = await getHtml("/worksheets/print");
  for (const marker of ["bkprint", "מורים יקרים", "למה ללמוד להבנה", "Matific", "שרטוט ומדידת זוויות"]) {
    assert.ok(html.includes(marker), `print route missing ${marker}`);
  }
});
