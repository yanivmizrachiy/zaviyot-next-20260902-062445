// מצב קריאה לדף בודד בחוברת — A4 אמיתי, ממורכז.
// ?reader=1 משמש את מנוע הספר המאוחד ומסיר את סרגל העמוד הפנימי כדי שלא יהיו כפתורים כפולים.
// ?print=1 נשמר לתאימות עם מסלולי ההדפסה הישנים.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WsReaderBar } from "@/components/worksheets/WsReaderBar";
import { WORKSHEETS, WORKSHEETS_TOTAL, WS_TOTAL, WS_PAGES } from "@/components/worksheets/registry";
import { worksheetContentNode, isPrintablePage } from "@/components/worksheets/WorksheetPageRenderer";

export const metadata: Metadata = {
  title: "חוברת הוראת הזוויות לכיתה ז׳",
  robots: { index: false },
};

export default async function WsReadPage({
  params,
  searchParams,
}: {
  params: Promise<{ n: string }>;
  searchParams: Promise<{ print?: string; reader?: string }>;
}) {
  const { n: nRaw } = await params;
  const sp = await searchParams;
  const n = Number(nRaw);
  if (!Number.isInteger(n) || n < 1 || n > WS_TOTAL) notFound();

  const page = WS_PAGES[n - 1];
  const worksheet = WORKSHEETS.find((entry) => entry.slot === n);
  const embedded = sp.reader === "1";
  const node = worksheetContentNode(page, {
    slot: n,
    tocHrefFor: (p) => `/worksheets/${p}`,
  });

  return (
    <div
      className={`ws-page${embedded ? " ws-page--reader" : ""}`}
      style={embedded ? { minHeight: "297mm", padding: 0, background: "#fff" } : undefined}
    >
      {!embedded && (
        <WsReaderBar
          n={n}
          total={WS_TOTAL}
          worksheetNumber={worksheet?.num}
          worksheetTotal={worksheet ? WORKSHEETS_TOTAL : undefined}
          autoPrint={isPrintablePage(page) && sp.print === "1"}
        />
      )}
      <div
        className="ws-page__sheets"
        style={embedded ? { margin: 0, padding: 0, width: "100%", minHeight: "297mm" } : undefined}
      >
        {page.kind === "image" ? (
          <div
            className="ws-imgsheet"
            style={{ width: "210mm", height: "297mm", background: "#fff", boxShadow: embedded ? "none" : "0 10px 40px rgba(15,23,42,.14)" }}
          >
            {node}
          </div>
        ) : page.kind === "cover" ? (
          <div
            style={{ width: "210mm", height: "297mm", overflow: "hidden", background: "#fff", boxShadow: embedded ? "none" : "0 10px 40px rgba(15,23,42,.14)" }}
          >
            {node}
          </div>
        ) : (
          node
        )}
      </div>
    </div>
  );
}
