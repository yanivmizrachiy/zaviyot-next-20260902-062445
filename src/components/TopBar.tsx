import Image from "next/image";
import styles from "./TopBar.module.css";

export function TopBar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.inner}>
        <span className={styles.logoBox}>
          <Image
            className={styles.logo}
            src="/logo.png"
            alt="יחידת מתמטיקה — מחוז ירושלים והעיר ירושלים"
            width={104}
            height={104}
            sizes="(max-width: 760px) 44px, 52px"
            quality={92}
            priority
          />
        </span>
        <div className={styles.text}>
          <span className={styles.title}>הדרכה במחוז ירושלים והעיר ירושלים – מנח״י</span>
          <span className={styles.subtitle}>הוראת זוויות בכיתה ז׳ · בהובלת איילת קריספין</span>
          <span className={styles.meta}>שנה״ל התשפ״ז · האתר מנוהל ע״י יניב רז, מדריך מחוזי חט״ב בעיר ירושלים</span>
        </div>
      </div>
    </header>
  );
}
