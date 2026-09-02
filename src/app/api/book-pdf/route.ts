import { NextRequest } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { WS_TOTAL } from "@/components/worksheets/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parsePages(raw: string | null) {
  if (!raw) return [];
  return [...new Set(
    raw
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value) && value >= 1 && value <= WS_TOTAL),
  )].sort((a, b) => a - b);
}

export async function GET(request: NextRequest) {
  const tone = request.nextUrl.searchParams.get("tone") === "bw" ? "bw" : "color";
  const pages = parsePages(request.nextUrl.searchParams.get("pages"));
  if (!pages.length) return new Response(null, { status: 400 });

  const file = tone === "bw" ? "hoveret-zaviyot-bw.pdf" : "hoveret-zaviyot.pdf";
  const sourceBytes = await fs.readFile(path.join(process.cwd(), "public", "booklet", file));
  const source = await PDFDocument.load(sourceBytes);
  const output = await PDFDocument.create();
  const copied = await output.copyPages(source, pages.map((page) => page - 1));
  copied.forEach((page) => output.addPage(page));

  const bytes = await output.save({ useObjectStreams: true });
  const body = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=zaviyot-selected-pages.pdf",
      "Cache-Control": "private, no-store",
    },
  });
}
