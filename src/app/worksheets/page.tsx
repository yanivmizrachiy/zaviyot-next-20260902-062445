import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "דפי עבודה — הוראת זוויות בכיתה ז׳",
};

// דפי העבודה אינם מערכת נפרדת: המסלול הוותיק נשמר כתאימות לאחור,
// ומוביל ישירות לשער "דפי עבודה" בתוך אותו ספר דיגיטלי.
export default function WorksheetsIndexPage() {
  redirect("/?group=worksheets#worksheets");
}
