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
            width={88}
            height={88}
            sizes="(max-width: 760px) 38px, 44px"
            quality={90}
            priority
          />
        </span>
        <div className={styles.text}>
          <span className={styles.title}>הוראת זוויות בכיתה ז׳</span>
          <span className={styles.subtitle}>הדרכה במחוז ירושלים והעיר ירושלים · בהובלת איילת קריספין</span>
          <span className={styles.meta}>שנה״ל התשפ״ז · האתר מנוהל ע״י יניב רז, מדריך מחוזי חט״ב בעיר ירושלים</span>
        </div>
      </div>
    </header>
  );
}
