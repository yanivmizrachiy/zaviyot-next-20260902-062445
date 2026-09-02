"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SitePrintDialog, type PrintTone } from "@/components/print/SitePrintDialog";
import styles from "./AidReaderBar.module.css";

// סרגל ההמחשות מפריד בין ניווט לפעולות: הקשר מימין, קודם/הבא סביב הכותרת,
// והדפסה/PDF כפעולה ראשית אחת. בחירת צבע ושחור־לבן חיה בתוך מרכז ההדפסה
// המשותף, כדי שהסרגל עצמו יישאר קצר וברור בכל רוחב מסך.
export function AidReaderBar({
  n,
  title,
  topicTitle,
  topicHref,
  prevN,
  nextN,
  bw,
  pageCount,
  autoPrint = false,
}: {
  n: number;
  title: string;
  topicTitle: string;
  topicHref: string;
  prevN: number | null;
  nextN: number | null;
  bw: boolean;
  pageCount: number;
  autoPrint?: boolean;
}) {
  const [printOpen, setPrintOpen] = useState(false);

  useEffect(() => {
    if (!autoPrint) return;
    const t = setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.delete("print");
      window.history.replaceState(window.history.state, "", url);
      window.print();
    }, 600);
    return () => clearTimeout(t);
  }, [autoPrint]);

  const hrefFor = (target: number) => `/hamchashot/${target}${bw ? "?bw=1" : ""}`;
  const previewUrl = (tone: PrintTone) => `/hamchashot/${n}?preview=1${tone === "bw" ? "&bw=1" : ""}`;

  const printWithTone = (tone: PrintTone) => {
    setPrintOpen(false);
    const sheets = document.querySelector(".ws-page__sheets");
    if (!(sheets instanceof HTMLElement)) {
      window.print();
      return;
    }

    const wasBw = sheets.classList.contains("ws-bw");
    sheets.classList.toggle("ws-bw", tone === "bw");

    window.setTimeout(() => {
      window.print();
      sheets.classList.toggle("ws-bw", wasBw);
    }, 60);
  };

  return (
    <>
      <div className={styles.bar} data-noprint>
        <nav className={styles.context} aria-label="חזרה וניווט לנושא">
          <Link className={styles.link} href={topicHref} title={topicTitle} aria-label={`חזרה לנושא: ${topicTitle}`}>
            חזרה לנושא
          </Link>
          <Link className={styles.link} href="/hamchashot">כל הנושאים</Link>
        </nav>

        <div className={styles.center} aria-label="ניווט בין המחשות">
          <Link
            className={`${styles.navButton}${prevN == null ? ` ${styles.disabled}` : ""}`}
            href={prevN != null ? hrefFor(prevN) : "#"}
            aria-disabled={prevN == null}
            tabIndex={prevN == null ? -1 : undefined}
          >
            הקודם
          </Link>
          <span className={styles.title} title={title}>{title}</span>
          <Link
            className={`${styles.navButton}${nextN == null ? ` ${styles.disabled}` : ""}`}
            href={nextN != null ? hrefFor(nextN) : "#"}
            aria-disabled={nextN == null}
            tabIndex={nextN == null ? -1 : undefined}
          >
            הבא
          </Link>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.printButton} onClick={() => setPrintOpen(true)}>
            הדפסה / PDF
          </button>
        </div>
      </div>

      <SitePrintDialog
        open={printOpen}
        title={title}
        pageCount={pageCount}
        initialTone={bw ? "bw" : "color"}
        previewUrl={previewUrl}
        onPrint={printWithTone}
        onClose={() => setPrintOpen(false)}
      />
    </>
  );
}
