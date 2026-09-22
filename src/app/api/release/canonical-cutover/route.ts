import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TEAM_ID = "team_lvylZaui6gt5QxzzssXTIKma";
const CANONICAL_PROJECT_ID = "prj_vBueQ0MqpZWsK5dZt8hOBleIqnYi";
const SOURCE_REPO = "zaviyot-next-20260902-062445";
const SOURCE_ORG = "yanivmizrachiy";
const SOURCE_SHA = "c9bdcfd1c6012601e579addea08a9a879bf2eb08";
const ONE_TIME_KEY = "f9TSo4ugGqF4ddrvA7iCp0LWMZz_dLxp";

async function api(path: string, token: string, init?: RequestInit) {
  return fetch(`https://api.vercel.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
}

export async function GET(request: Request) {
  const token = process.env.VERCEL_OIDC_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, stage: "token", reason: "VERCEL_OIDC_TOKEN unavailable" }, { status: 503 });
  }

  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") || "probe";

  const projectResponse = await api(`/v9/projects/${CANONICAL_PROJECT_ID}?teamId=${TEAM_ID}`, token);
  let projectBody: any = null;
  try { projectBody = await projectResponse.json(); } catch { projectBody = null; }

  if (mode === "probe") {
    return NextResponse.json({
      ok: projectResponse.ok,
      mode,
      projectStatus: projectResponse.status,
      project: projectBody ? {
        id: projectBody.id ?? null,
        name: projectBody.name ?? null,
        rootDirectory: projectBody.rootDirectory ?? null,
        link: projectBody.link ? {
          type: projectBody.link.type ?? null,
          org: projectBody.link.org ?? null,
          repo: projectBody.link.repo ?? null,
          productionBranch: projectBody.link.productionBranch ?? null,
        } : null,
      } : null,
    });
  }

  if (mode !== "deploy" || url.searchParams.get("key") !== ONE_TIME_KEY) {
    return NextResponse.json({ ok: false, reason: "not found" }, { status: 404 });
  }

  if (!projectResponse.ok) {
    return NextResponse.json({ ok: false, stage: "project-read", status: projectResponse.status }, { status: 502 });
  }

  const originalRoot = projectBody?.rootDirectory ?? null;
  let rootChanged = false;

  if (originalRoot !== null && originalRoot !== "") {
    const patch = await api(`/v9/projects/${CANONICAL_PROJECT_ID}?teamId=${TEAM_ID}`, token, {
      method: "PATCH",
      body: JSON.stringify({ rootDirectory: null }),
    });
    if (!patch.ok) {
      let body: unknown = null;
      try { body = await patch.json(); } catch {}
      return NextResponse.json({ ok: false, stage: "project-root", status: patch.status, body }, { status: 502 });
    }
    rootChanged = true;
  }

  const deployment = await api(`/v13/deployments?teamId=${TEAM_ID}&forceNew=1`, token, {
    method: "POST",
    body: JSON.stringify({
      name: "zaviyot",
      project: CANONICAL_PROJECT_ID,
      target: "production",
      gitSource: {
        type: "github",
        org: SOURCE_ORG,
        repo: SOURCE_REPO,
        ref: "main",
        sha: SOURCE_SHA,
      },
      projectSettings: {
        framework: "nextjs",
        nodeVersion: "22.x",
        rootDirectory: null,
      },
      meta: {
        canonicalCutover: "2026-09-22",
        sourceRepo: `${SOURCE_ORG}/${SOURCE_REPO}`,
        sourceSha: SOURCE_SHA,
      },
    }),
  });

  let deploymentBody: any = null;
  try { deploymentBody = await deployment.json(); } catch {}

  if (!deployment.ok) {
    if (rootChanged) {
      await api(`/v9/projects/${CANONICAL_PROJECT_ID}?teamId=${TEAM_ID}`, token, {
        method: "PATCH",
        body: JSON.stringify({ rootDirectory: originalRoot }),
      });
    }
    return NextResponse.json({
      ok: false,
      stage: "create-deployment",
      status: deployment.status,
      body: deploymentBody,
      rootRestored: rootChanged,
    }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    stage: "deployment-created",
    deployment: {
      id: deploymentBody?.id ?? null,
      url: deploymentBody?.url ?? null,
      readyState: deploymentBody?.readyState ?? deploymentBody?.status ?? null,
    },
    sourceSha: SOURCE_SHA,
    canonicalProjectId: CANONICAL_PROJECT_ID,
  });
}
