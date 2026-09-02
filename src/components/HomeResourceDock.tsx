import Link from "next/link";
import { ACCESSORIES_INDEX_HREF } from "@/lib/accessoriesItems";
import styles from "./HomeResourceDock.module.css";

const VIDEO_URL = "/video/zaviyot-race-lamillion.mp4";
const POSTER_URL = "/video/zaviyot-race-poster.jpg";

export function HomeResourceDock() {
  return (
    <aside className={styles.dock} aria-label="קטע מתוך התוכנית „המירוץ למיליון”, קשת 12">
      <div className={styles.videoCard} id="video">
        <video controls playsInline preload="none" poster={POSTER_URL}>
          <source src={VIDEO_URL} type="video/mp4" />
          הדפדפן שלך אינו תומך בניגון וידאו.{" "}
          <a href={VIDEO_URL} download="זוויות - המירוץ למיליון.mp4">
            להורדת הסרטון
          </a>
        </video>
        <div className={styles.videoMeta}>
          <span>קטע מתוך התוכנית „המירוץ למיליון”, קשת 12</span>
          <a href={VIDEO_URL} download="זוויות - המירוץ למיליון.mp4">
            הורדת הסרטון (MP4)
          </a>
        </div>
      </div>

      <nav className={styles.links} aria-label="ניווט למשאבים">
        <a href="#presentation">מצגת</a>
        <Link href="/?group=worksheets#worksheets">דפי עבודה</Link>
        <Link href={ACCESSORIES_INDEX_HREF}>אביזרים נלווים להמחשה</Link>
      </nav>
    </aside>
  );
}
