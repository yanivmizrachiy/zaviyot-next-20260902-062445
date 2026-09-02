import { SectionHead } from "./SectionHead";
import { UnifiedBookReader } from "./book/UnifiedBookReader";

// החוברת הדיגיטלית וכל דפי העבודה מוצגים במנוע קורא אחד.
// התוכן עצמו אינו משוכפל: הקורא נגזר ישירות מ-WS_PAGES, שהוא מקור התוכן הקיים.
export function WorksheetsBookletBook() {
  return (
    <section className="section" id="worksheets">
      <div className="container container--book">
        <SectionHead eyebrow="החוברת הדיגיטלית" title="הוראת זוויות בכיתה ז׳" />
        <UnifiedBookReader />
      </div>
    </section>
  );
}
