import { UnifiedBookReader } from "./book/UnifiedBookReader";

// HOME V2: אין כותרת-סקשן גדולה לפני הספר. הקורא עצמו הוא זהות המוצר.
export function WorksheetsBookletBook() {
  return (
    <section className="book-home" id="worksheets" aria-label="החוברת הדיגיטלית — הוראת זוויות בכיתה ז׳">
      <div className="container container--book">
        <UnifiedBookReader />
      </div>
    </section>
  );
}
