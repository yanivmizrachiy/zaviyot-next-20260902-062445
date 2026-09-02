import { UnifiedBookReader } from "./book/UnifiedBookReader";
import { HomeResourceDock } from "./HomeResourceDock";

export function WorksheetsBookletBook() {
  return (
    <section className="book-home" id="worksheets" aria-label="החוברת הדיגיטלית — הוראת זוויות בכיתה ז׳">
      <div className="container container--book">
        <div className="book-home__stage">
          <div className="book-home__reader">
            <UnifiedBookReader />
          </div>
          <HomeResourceDock />
        </div>
      </div>
    </section>
  );
}
