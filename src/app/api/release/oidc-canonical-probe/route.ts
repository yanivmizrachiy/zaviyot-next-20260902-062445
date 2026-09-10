import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CANONICAL_PROJECT_ID = "prj_vBueQ0MqpZWsK5dZt8hOBleIqnYi";
const TEAM_ID = "team_lvylZaui6gt5QxzzssXTIKma";

export async function GET() {
  const token = process.env.VERCEL_OIDC_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, oidcPresent: false, reason: "VERCEL_OIDC_TOKEN is not available" }, { status: 200 });
  }

  const response = await fetch(
    `https://api.vercel.com/v9/projects/${CANONICAL_PROJECT_ID}?teamId=${TEAM_ID}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = await response.text();
  }

  const safeBody =
    body && typeof body === "object"
      ? {
          id: (body as Record<string, unknown>).id ?? null,
          name: (body as Record<string, unknown>).name ?? null,
          error: (body as Record<string, unknown>).error ?? null,
        }
      : body;

  return NextResponse.json({
    ok: response.ok,
    oidcPresent: true,
    upstreamStatus: response.status,
    canonicalProjectId: CANONICAL_PROJECT_ID,
    body: safeBody,
  });
}
