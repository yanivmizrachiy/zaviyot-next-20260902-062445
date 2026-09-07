import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { resolve } from "node:path";

const deployScript = readFileSync(resolve(process.cwd(), "scripts/deploy-production.mjs"), "utf8");
const truth = readFileSync(resolve(process.cwd(), "SOURCE_OF_TRUTH.md"), "utf8");

const CANONICAL_PROJECT = "prj_vBueQ0MqpZWsK5dZt8hOBleIqnYi";
const CANONICAL_URL = "https://zaviyot.vercel.app";
const CANONICAL_REPO = "yanivmizrachiy/zaviyot-next-20260902-062445";
const STAGING_PROJECT = "prj_nNLdB3ec30mUsyYVse6cUT7Ib7Hm";
const STAGING_URL = "https://zaviyot-next-20260902-062445.vercel.app";

test("production deploy is hard-locked to the existing teacher-facing Vercel project", () => {
  assert.match(deployScript, new RegExp(CANONICAL_PROJECT));
  assert.match(deployScript, /EXPECTED_PROJECT_NAME = "zaviyot"/);
  assert.match(deployScript, new RegExp(CANONICAL_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(deployScript, new RegExp(CANONICAL_REPO.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("temporary NEXT project is explicitly forbidden as a production target", () => {
  assert.match(deployScript, new RegExp(`FORBIDDEN_PROJECT_ID = "${STAGING_PROJECT}"`));
  assert.doesNotMatch(deployScript, new RegExp(`PRODUCTION_URL = "${STAGING_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
});

test("production verification positively identifies the new app and rejects legacy assets", () => {
  assert.match(deployScript, /NEW_SITE_MARKER = "HomeBookStage"/);
  assert.match(deployScript, /verifyUrl\(verifyPath, verifyText\)/);
  assert.match(deployScript, /LEGACY_ASSETS_MUST_BE_ABSENT/);
  assert.match(deployScript, /\/video\/zaviyot-angles-loop\.mp4/);
  assert.match(deployScript, /\/video\/zaviyot-angles-poster\.jpg/);
  assert.match(deployScript, /verifyAbsentAsset/);
  assert.match(deployScript, /response\.status !== 404/);
});

test("source of truth keeps the teacher-facing URL unchanged", () => {
  assert.match(truth, new RegExp(CANONICAL_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(truth, new RegExp(CANONICAL_PROJECT));
  assert.match(truth, /Old links already distributed to teachers MUST continue working at the same address/);
});
