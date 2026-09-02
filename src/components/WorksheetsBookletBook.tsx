import Link from "next/link";
import { ACCESSORIES_INDEX_HREF } from "@/lib/accessoriesItems";
import { UnifiedBookReader } from "./book/UnifiedBookReader";
import { HomeResourceDock } from "./HomeResourceDock";
import styles from "./HomeBookStage.module.css";

const WORKSHEETS_PDF = "/booklet-worksheets/zaviyot-worksheets.pdf";

export function WorksheetsBookletBook() {
  return (
    <section className="book-home" id="worksheets" aria-label="החוברת הדיגיטלית — הוראת זוויות בכיתה ז׳">
      <div className="container container--book">
        <div className={styles.stage}>
          <div className={styles.reader}>
            <UnifiedBookReader />
          </div>

          <nav className={styles.actions} aria-label="פעולות">
            <a className={styles.actionVideo} href="#video">סרטון</a>
            <a className={styles.actionPresentation} href="#presentation">מצגת</a>
            <Link className={styles.actionWorksheets} href="/?group=worksheets#worksheets">דפי עבודה</Link>
            <Link className={styles.actionAccessories} href={ACCESSORIES_INDEX_HREF}>אביזרים נלווים להמחשה</Link>
            <a className={styles.actionDownload} href={WORKSHEETS_PDF} download="חוברת העבודה - זוויות.pdf">הורדת חוברת העבודה</a>
          </nav>

          <div className={styles.dock}>
            <HomeResourceDock />
          </div>
        </div>
      </div>
    </section>
  );
}
