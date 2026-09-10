import assert from "node:assert/strict";
import test from "node:test";
import nextConfig from "../next.config.ts";

test("legacy /matematika/zaviyot URLs remain compatible", async () => {
  assert.equal(typeof nextConfig.redirects, "function");
  const redirects = await nextConfig.redirects!();

  assert.ok(
    redirects.some(
      (rule) =>
        rule.source === "/matematika/zaviyot" &&
        rule.destination === "/" &&
        rule.permanent === true,
    ),
    "the exact legacy Zaviyot URL must permanently redirect to the canonical homepage",
  );

  assert.ok(
    redirects.some(
      (rule) =>
        rule.source === "/matematika/zaviyot/:path*" &&
        rule.destination === "/:path*" &&
        rule.permanent === true,
    ),
    "legacy Zaviyot subpaths must preserve their suffix on the canonical site",
  );
});
