import type { Metadata } from "next";
import { WORKSHEETS, WS_PAGES, WS_TOTAL } from "@/components/worksheets/registry";
import { PrintAutoTrigger } from "@/components/worksheets/PrintAutoTrigger";
import { worksheetContentNode } from "@/components/worksheets/WorksheetPageRenderer";
import "./print.css";

export const metadata: Metadata = {
  title: "הוראת זוויות בכיתה ז׳ — החוברת המלאה (הדפסה / PDF)",
  robots: { index: false },
};

function parsePages(raw?: string) {
  if (!raw) return [];
  return [...new Set(
    raw
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value) && value >= 1 && value <= WS_TOTAL),
  )].sort((a, b) => a - b);
}

export default async function BookletPrintPage({
  searchParams,
}: {
  searchParams: Promise<{ print?: string; pages?: string; tone?: string; scope?: string }>;
}) {
  const sp = await searchParams;
  const requested = parsePages(sp.pages);
  const slots = requested.length
    ? requested
    : sp.scope === "worksheets"
      ? WORKSHEETS.map((item) => item.slot)
      : WS_PAGES.map((_, index) => index + 1);
  const bw = sp.tone === "bw";

  return (
    <div className={`bkprint${bw ? " bkprint--bw" : ""}`}>
      {sp.print === "1" && <PrintAutoTrigger />}
      {slots.map((n) => {
        const page = WS_PAGES[n - 1];
        const node = worksheetContentNode(page, {
          slot: n,
          presentation: "link",
          tocHrefFor: (target) => `#bk-page-${target}`,
        });
        return (
          <section className="bkprint__page" id={`bk-page-${n}`} key={n} data-source-page={n}>
            {page.kind === "cover" ? (
              <div style={{ width: "100%", height: "100%", overflow: "hidden", background: "#fff" }}>{node}</div>
            ) : (
              node
            )}
          </section>
        );
      })}
    </div>
  );
}
