import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const EXPECTED_PROJECT_ID = "prj_vBueQ0MqpZWsK5dZt8hOBleIqnYi";
const EXPECTED_ORG_ID = "team_lvylZaui6gt5QxzzssXTIKma";
const EXPECTED_PROJECT_NAME = "zaviyot";
const PRODUCTION_URL = "https://zaviyot.vercel.app";

function fail(message) {
  console.error(`\n[deploy:zaviyot] STOP: ${message}\n`);
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) fail(result.error.message);
  if (result.status !== 0) process.exit(result.status ?? 1);
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

async function verifyProduction(path, expectedText) {
  const url = new URL(path, PRODUCTION_URL).toString();
  let lastStatus = null;
  let lastError = null;
  let lastMissingText = false;

  for (let attempt = 1; attempt <= 8; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: { "cache-control": "no-cache" },
      });
      lastStatus = response.status;
      if (response.status === 200) {
        if (!expectedText) {
          console.log(`[deploy:zaviyot] אימות חי עבר: 200 ${url}`);
          return;
        }

        const body = await response.text();
        lastMissingText = !body.includes(expectedText);
        if (!lastMissingText) {
          console.log(`[deploy:zaviyot] אימות חי עבר: 200 ${url} + טקסט צפוי`);
          return;
        }
      }
    } catch (error) {
      lastError = error;
    }

    if (attempt < 8) {
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 1500));
    }
  }

  if (lastStatus === 200 && lastMissingText) {
    fail(`הפריסה זמינה אך הטקסט הצפוי לא נמצא ב-${url}: ${expectedText}`);
  }

  const detail = lastStatus !== null ? `HTTP ${lastStatus}` : String(lastError ?? "unknown error");
  fail(`הפריסה הסתיימה אך האימות החי נכשל עבור ${url}: ${detail}`);
}

const cwd = process.cwd();
const pkgPath = resolve(cwd, "package.json");
if (!existsSync(pkgPath)) fail("package.json לא נמצא. יש להריץ את הפקודה מתוך zaviyot/ בלבד.");

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
if (pkg.name !== EXPECTED_PROJECT_NAME || !pkg.dependencies?.next) {
  fail("זה אינו שורש אפליקציית zaviyot או ש-Next.js חסר. הפריסה בוטלה לפני פנייה ל-Vercel.");
}

const major = Number(process.versions.node.split(".")[0]);
if (major !== 22) {
  fail(`נדרש Node 22 לפריסה; כרגע פעיל Node ${process.versions.node}.`);
}

const vercelProjectPath = resolve(cwd, ".vercel", "project.json");
if (!existsSync(vercelProjectPath)) {
  console.log("[deploy:zaviyot] קישור Vercel מקומי חסר — מקשר לפרויקט הקיים...");
  run("npx", ["vercel", "link", "--yes", "--project", EXPECTED_PROJECT_NAME, "--scope", "yanivs-projects-322b2b37"]);
}

if (!existsSync(vercelProjectPath)) fail("Vercel link לא יצר .vercel/project.json.");
const linked = JSON.parse(readFileSync(vercelProjectPath, "utf8"));
if (linked.projectId !== EXPECTED_PROJECT_ID || linked.orgId !== EXPECTED_ORG_ID) {
  fail(`קישור Vercel שגוי. expected ${EXPECTED_ORG_ID}/${EXPECTED_PROJECT_ID}, got ${linked.orgId}/${linked.projectId}`);
}

const verifyPath = getVerifyPath();
const verifyText = getVerifyText();
console.log(`[deploy:zaviyot] נתיב אימות לאחר הפריסה: ${verifyPath}`);
if (verifyText) console.log(`[deploy:zaviyot] נדרש גם טקסט אימות: ${verifyText}`);

console.log("[deploy:zaviyot] 1/3 בדיקות מלאות...");
run("npm", ["run", "check"]);

console.log("[deploy:zaviyot] 2/3 פריסת Production מלאה מהשורש הנכון...");
run("npx", ["vercel", "--prod", "--yes"]);

console.log("[deploy:zaviyot] 3/3 אימות Production alias...");
await verifyProduction(verifyPath, verifyText);

console.log(`[deploy:zaviyot] הושלם ואומת: ${new URL(verifyPath, PRODUCTION_URL)}`);
