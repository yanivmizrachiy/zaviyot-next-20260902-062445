import { existsSync, readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const EXPECTED_PACKAGE_NAME = "zaviyot";
const EXPECTED_REPO = "yanivmizrachiy/zaviyot-next-20260902-062445";
const EXPECTED_PROJECT_ID = "prj_vBueQ0MqpZWsK5dZt8hOBleIqnYi";
const EXPECTED_ORG_ID = "team_lvylZaui6gt5QxzzssXTIKma";
const EXPECTED_PROJECT_NAME = "zaviyot";
const EXPECTED_SCOPE = "yanivs-projects-322b2b37";
const PRODUCTION_URL = "https://zaviyot.vercel.app";
const FORBIDDEN_PROJECT_ID = "prj_nNLdB3ec30mUsyYVse6cUT7Ib7Hm";
const LOG_PREFIX = "[deploy:zaviyot]";

function fail(message) {
  console.error(`\n${LOG_PREFIX} STOP: ${message}\n`);
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: options.capture ? "pipe" : "inherit",
    encoding: options.capture ? "utf8" : undefined,
    shell: process.platform === "win32",
  });
  if (result.error) fail(result.error.message);
  if (result.status !== 0) {
    if (options.capture) {
      if (result.stdout) process.stdout.write(result.stdout);
      if (result.stderr) process.stderr.write(result.stderr);
    }
    fail(`הפקודה נכשלה: ${command} ${args.join(" ")}`);
  }
  return options.capture ? String(result.stdout ?? "").trim() : "";
}

function getVerifyPath() {
  const cliArg = process.argv.slice(2).find((arg) => arg.startsWith("--verify-path="));
  const raw = cliArg?.slice("--verify-path=".length) || process.env.ZAVIYOT_VERIFY_PATH || "/";
  if (!raw.startsWith("/") || raw.includes("\\") || /\s/.test(raw)) {
    fail(`נתיב אימות לא תקין: ${raw}`);
  }
  return raw;
}

function getVerifyText() {
  const cliArg = process.argv.slice(2).find((arg) => arg.startsWith("--verify-text="));
  return cliArg?.slice("--verify-text=".length) || process.env.ZAVIYOT_VERIFY_TEXT || "";
}

function assertCanonicalGitState() {
  const origin = run("git", ["remote", "get-url", "origin"], { capture: true });
  if (!origin.toLowerCase().replace(/\.git$/, "").includes(EXPECTED_REPO.toLowerCase())) {
    fail(`ריפו שגוי. expected ${EXPECTED_REPO}, got ${origin}`);
  }

  run("git", ["fetch", "origin", "main"]);
  const branch = run("git", ["branch", "--show-current"], { capture: true });
  if (branch !== "main") fail(`פריסת production מותרת רק מ-main; כרגע: ${branch}`);

  const head = run("git", ["rev-parse", "HEAD"], { capture: true });
  const remote = run("git", ["rev-parse", "origin/main"], { capture: true });
  if (head !== remote) fail(`HEAD המקומי אינו origin/main. local=${head} remote=${remote}`);

  const dirty = run("git", ["status", "--porcelain"], { capture: true });
  if (dirty) fail(`עץ העבודה אינו נקי:\n${dirty}`);

  console.log(`${LOG_PREFIX} source verified: ${EXPECTED_REPO}@${head}`);
}

function readLinkedProject(projectPath) {
  if (!existsSync(projectPath)) return null;
  try {
    return JSON.parse(readFileSync(projectPath, "utf8"));
  } catch {
    return null;
  }
}

function ensureCanonicalVercelLink() {
  const projectPath = resolve(process.cwd(), ".vercel", "project.json");
  let linked = readLinkedProject(projectPath);

  if (linked?.projectId === FORBIDDEN_PROJECT_ID) {
    console.log(`${LOG_PREFIX} מסיר קישור מקומי לפרויקט NEXT הזמני לפני פריסת production...`);
    rmSync(resolve(process.cwd(), ".vercel"), { recursive: true, force: true });
    linked = null;
  }

  if (!linked || linked.projectId !== EXPECTED_PROJECT_ID || linked.orgId !== EXPECTED_ORG_ID) {
    console.log(`${LOG_PREFIX} מקשר לפרויקט production הקיים והיחיד: ${EXPECTED_PROJECT_NAME}`);
    run("npx", ["vercel", "link", "--yes", "--project", EXPECTED_PROJECT_NAME, "--scope", EXPECTED_SCOPE]);
    linked = readLinkedProject(projectPath);
  }

  if (!linked) fail("Vercel link לא יצר .vercel/project.json.");
  if (linked.projectId !== EXPECTED_PROJECT_ID || linked.orgId !== EXPECTED_ORG_ID) {
    fail(`קישור Vercel שגוי. expected ${EXPECTED_ORG_ID}/${EXPECTED_PROJECT_ID}, got ${linked.orgId}/${linked.projectId}`);
  }
  if (linked.projectId === FORBIDDEN_PROJECT_ID) {
    fail("הפריסה נעצרה: אסור לפרוס production לפרויקט Zaviyot NEXT הזמני.");
  }

  console.log(`${LOG_PREFIX} Vercel target verified: ${EXPECTED_PROJECT_ID} -> ${PRODUCTION_URL}`);
}

async function verifyUrl(path, expectedText = "") {
  const url = new URL(path, PRODUCTION_URL).toString();
  let detail = "unknown error";

  for (let attempt = 1; attempt <= 10; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: { "cache-control": "no-cache" },
      });
      detail = `HTTP ${response.status}`;
      if (response.status === 200) {
        if (!expectedText) return;
        const body = await response.text();
        if (body.includes(expectedText)) return;
        detail = `HTTP 200 but missing text: ${expectedText}`;
      }
    } catch (error) {
      detail = String(error);
    }
    if (attempt < 10) await new Promise((resolveDelay) => setTimeout(resolveDelay, 1500));
  }

  fail(`אימות חי נכשל עבור ${url}: ${detail}`);
}

async function verifyAsset(path) {
  const url = new URL(path, PRODUCTION_URL).toString();
  const response = await fetch(url, {
    method: "HEAD",
    redirect: "follow",
    headers: { "cache-control": "no-cache" },
  });
  if (!response.ok) fail(`נכס production חסר: ${response.status} ${url}`);
  console.log(`${LOG_PREFIX} asset verified: ${response.status} ${path}`);
}

const cwd = process.cwd();
const pkgPath = resolve(cwd, "package.json");
if (!existsSync(pkgPath)) fail("package.json לא נמצא. יש להריץ מתוך שורש הריפו הקנוני של זוויות.");

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
if (pkg.name !== EXPECTED_PACKAGE_NAME || !pkg.dependencies?.next) {
  fail("זה אינו שורש אפליקציית Zaviyot הקנונית או ש-Next.js חסר.");
}

const major = Number(process.versions.node.split(".")[0]);
if (major !== 22) fail(`נדרש Node 22 לפריסה; כרגע פעיל Node ${process.versions.node}.`);

assertCanonicalGitState();
ensureCanonicalVercelLink();

const verifyPath = getVerifyPath();
const verifyText = getVerifyText();
console.log(`${LOG_PREFIX} canonical URL: ${PRODUCTION_URL}`);
console.log(`${LOG_PREFIX} verify path: ${verifyPath}`);

console.log(`${LOG_PREFIX} 1/4 בדיקות מלאות...`);
run("npm", ["run", "check"]);

console.log(`${LOG_PREFIX} 2/4 פריסת Production לפרויקט הקיים בלבד...`);
run("npx", ["vercel", "--prod", "--yes"]);

console.log(`${LOG_PREFIX} 3/4 אימות האתר החי...`);
await verifyUrl(verifyPath, verifyText);

console.log(`${LOG_PREFIX} 4/4 אימות נכסים קנוניים...`);
for (const asset of [
  "/booklet-worksheets/zaviyot-worksheets.pdf",
  "/booklet-worksheets/zaviyot-worksheets-bw.pdf",
  "/booklet/hoveret-zaviyot.pdf",
  "/booklet/hoveret-zaviyot-bw.pdf",
  "/video/zaviyot-race-lamillion.mp4",
  "/video/zaviyot-race-poster.jpg",
  "/presentation/geometria-kdam-hesekit.pdf",
]) {
  await verifyAsset(asset);
}

console.log(`${LOG_PREFIX} PRODUCTION VERIFIED: ${new URL(verifyPath, PRODUCTION_URL)}`);
