import { redirect } from "next/navigation";

// תאימות לאחור בלבד: דפי העבודה הם קבוצה בתוך הספר הדיגיטלי המאוחד,
// ולכן אין כאן metadata או עמוד תוכן עצמאי.
export default function WorksheetsIndexRedirect() {
  redirect("/?group=worksheets#worksheets");
}
