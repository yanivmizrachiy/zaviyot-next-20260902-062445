import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { WORKSHEETS, WORKSHEETS_TOTAL } from "@/components/worksheets/registry";

export const metadata: Metadata = {
  title: "דף עבודה — הוראת זוויות בכיתה ז׳",
  robots: { index: false },
};

// תאימות לאחור בלבד. דף עבודה ממוספר מפנה לעמוד הקנוני של אותו דף בספר.
// שחור-לבן מופנה למסלול ההדפסה הקנוני כדי שלא יתקיים קורא B/W מקביל.
export default async function LegacyWorksheetByNumberPage({
  params,
  searchParams,
}: {
  params: Promise<{ k: string }>;
  searchParams: Promise<{ bw?: string; print?: string }>;
}) {
  const { k: raw } = await params;
  const sp = await searchParams;
  const k = Number(raw);
  if (!Number.isInteger(k) || k < 1 || k > WORKSHEETS_TOTAL) notFound();

  const slot = WORKSHEETS[k - 1].slot;
  const autoPrint = sp.print === "1";

  if (sp.bw === "1") {
    redirect(`/worksheets/print?pages=${slot}&tone=bw${autoPrint ? "&print=1" : ""}`);
  }

  redirect(`/worksheets/${slot}${autoPrint ? "?print=1" : ""}`);
}
