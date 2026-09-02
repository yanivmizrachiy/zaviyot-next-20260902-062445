import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "pdf-lib";

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outRel = process.env.PDF_OUT;
const pagePath = process.env.PDF_PATH;
if (!outRel || !pagePath) throw new Error("PDF_OUT and PDF_PATH are required");
const out = path.resolve(appDir, outRel);
const port = Number(process.env.PDF_PORT || 4876);
const targetUrl = `http://127.0.0.1:${port}${pagePath}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function commandPath(command) {
  if (process.platform === "win32") return null;
  const result = spawnSync("which", [command], { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : null;
}

const chromeCandidates = [
  process.env.CHROME_PATH,
  commandPath("google-chrome"),
  commandPath("google-chrome-stable"),
  commandPath("chromium"),
  commandPath("chromium-browser"),
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].filter(Boolean);
const chrome = chromeCandidates.find((candidate) => fs.existsSync(candidate));
if (!chrome) throw new Error("Chrome/Chromium not found; set CHROME_PATH");

async function waitFor(url, timeout = 60000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2500) });
      if (response.ok) return;
    } catch {}
    await sleep(350);
  }
  throw new Error(`server not ready: ${url}`);
}

async function stopProcess(child) {
  if (!child || child.exitCode !== null) return;
  const exited = new Promise((resolve) => child.once("exit", resolve));
  child.kill();
  await Promise.race([exited, sleep(2500)]);
  if (child.exitCode === null) {
    try { child.kill("SIGKILL"); } catch {}
    await Promise.race([exited, sleep(1000)]);
  }
}

async function removeProfile(profile) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      fs.rmSync(profile, { recursive: true, force: true, maxRetries: 2, retryDelay: 150 });
      return;
    } catch (error) {
      if (attempt === 11) {
        console.warn(`[pdf] cleanup warning: ${error instanceof Error ? error.message : String(error)}`);
        return;
      }
      await sleep(250);
    }
  }
}

function makeCdp(ws) {
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const waiter = pending.get(message.id);
      pending.delete(message.id);
      message.error ? waiter.reject(new Error(message.error.message)) : waiter.resolve(message.result);
    } else {
      listeners.forEach((listener) => listener(message));
    }
  });
  return {
    send(method, params = {}, sessionId) {
      return new Promise((resolve, reject) => {
        const message = { id: ++id, method, params };
        if (sessionId) message.sessionId = sessionId;
        pending.set(message.id, { resolve, reject });
        ws.send(JSON.stringify(message));
      });
    },
    on(listener) { listeners.push(listener); },
  };
}

const isWindows = process.platform === "win32";
const server = spawn(isWindows ? "npx.cmd" : "npx", ["next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: appDir,
  stdio: "ignore",
  shell: isWindows,
});
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "zaviyot-static-pdf-"));
let browser;
let browserSocket;
try {
  await waitFor(`http://127.0.0.1:${port}/`);
  const html = await (await fetch(targetUrl)).text();
  const expected = (html.match(/class="bkprint__page"/g) || []).length;
  if (expected < 1) throw new Error(`no printable pages found at ${targetUrl}`);

  browser = spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--no-first-run",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank",
  ], { stdio: "ignore" });

  const portFile = path.join(profile, "DevToolsActivePort");
  const started = Date.now();
  while (!fs.existsSync(portFile)) {
    if (Date.now() - started > 30000) throw new Error("Chrome DevTools port was not created");
    await sleep(150);
  }
  const [debugPort, browserPath] = fs.readFileSync(portFile, "utf8").trim().split("\n");
  browserSocket = new WebSocket(`ws://127.0.0.1:${debugPort}${browserPath}`);
  await new Promise((resolve, reject) => { browserSocket.onopen = resolve; browserSocket.onerror = reject; });
  const cdp = makeCdp(browserSocket);
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  await cdp.send("Page.enable", {}, sessionId);
  const loaded = new Promise((resolve) => cdp.on((message) => {
    if (message.method === "Page.loadEventFired" && message.sessionId === sessionId) resolve();
  }));
  await cdp.send("Page.navigate", { url: targetUrl }, sessionId);
  await loaded;
  await cdp.send("Runtime.enable", {}, sessionId);
  await cdp.send("Runtime.evaluate", {
    expression: "Promise.all([document.fonts.ready,...[...document.images].map(i=>i.complete?true:new Promise(r=>{i.onload=i.onerror=r}))])",
    awaitPromise: true,
  }, sessionId);
  await sleep(500);

  const { data } = await cdp.send("Page.printToPDF", {
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
    transferMode: "ReturnAsBase64",
  }, sessionId);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(data, "base64"));

  const document = await PDFDocument.load(fs.readFileSync(out));
  let count = document.getPageCount();
  if (count === expected + 1) {
    document.removePage(count - 1);
    fs.writeFileSync(out, await document.save());
    count = expected;
  }
  if (count !== expected) throw new Error(`PDF page count ${count} != expected ${expected}`);
  const first = document.getPage(0).getSize();
  if (Math.abs(first.width - 595) > 4 || Math.abs(first.height - 842) > 4) {
    throw new Error(`PDF is not A4: ${first.width}x${first.height}`);
  }
  console.log(JSON.stringify({ out: outRel, pages: count, bytes: fs.statSync(out).size, source: pagePath }));

  try { await cdp.send("Browser.close"); } catch {}
  try { browserSocket.close(); } catch {}
  await stopProcess(browser);
  browser = undefined;
} finally {
  try { browserSocket?.close(); } catch {}
  await stopProcess(browser);
  await stopProcess(server);
  await removeProfile(profile);
}
