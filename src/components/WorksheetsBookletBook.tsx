import { UnifiedBookReader } from "./book/UnifiedBookReader";
import { HomeQuickActions } from "./HomeQuickActions";
import styles from "./HomeBookStage.module.css";

export function WorksheetsBookletBook() {
  return (
    <section className="book-home" id="worksheets" aria-label="החוברת הדיגיטלית — הוראת זוויות בכיתה ז׳">
      <div className="container container--book">
        <div className={styles.stage}>
          <div className={styles.reader}>
            <UnifiedBookReader />
          </div>
          <HomeQuickActions />
        </div>
      </div>
    </section>
  );
}
