import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "חוברת דפי העבודה — הוראת זוויות בכיתה ז׳",
  robots: { index: false },
};

// תאימות לאחור בלבד. אין כאן יותר קורא/מנוע הדפסה נוסף:
// כל הבקשות עוברות למסלול ההדפסה הקנוני שמבוסס על registry.ts.
export default async function LegacyWorksheetsBookletPage({
  searchParams,
}: {
  searchParams: Promise<{ bw?: string; print?: string }>;
}) {
  const sp = await searchParams;
  const tone = sp.bw === "1" ? "bw" : "color";
  const print = sp.print === "1" ? "&print=1" : "";
  redirect(`/worksheets/print?scope=worksheets&tone=${tone}${print}`);
}
