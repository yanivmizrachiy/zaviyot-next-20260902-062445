// תאימות לאחור בלבד: המסלול הישן אינו מרנדר עוד עותק נוסף של תוכן הספר.
// מיקומו הקנוני של "סוגי זוויות" נגזר מה-registry ומפנה לקורא המאוחד.
import { redirect } from "next/navigation";
import { WS_PAGES } from "@/components/worksheets/registry";

export default function SugeiZaviyotRedirect() {
  const slot = WS_PAGES.findIndex((page) => page.kind === "content" && page.content === "angles-types") + 1;
  if (slot < 1) redirect("/worksheets");
  redirect(`/worksheets/${slot}`);
}
