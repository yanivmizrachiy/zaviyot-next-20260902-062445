"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SitePrintDialog.module.css";

export type PrintTone = "color" | "bw";

export function SitePrintDialog({
  open,
  title,
  pageCount,
  initialTone = "color",
  previewUrl,
  onPrint,
  onClose,
}: {
  open: boolean;
  title: string;
  pageCount: number;
  initialTone?: PrintTone;
  previewUrl: (tone: PrintTone) => string;
  onPrint: (tone: PrintTone) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [tone, setTone] = useState<PrintTone>(() => initialTone);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      dir="rtl"
      data-noprint
      aria-labelledby="site-print-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <div>
            <h2 id="site-print-title" className={styles.title}>הדפסה / שמירה כ־PDF</h2>
            <p className={styles.document}>{title}</p>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="סגירה">×</button>
        </header>

        <figure className={`${styles.preview}${tone === "bw" ? ` ${styles.previewBw}` : ""}`}>
          <div className={styles.paper}>
            <iframe
              key={previewUrl(tone)}
              src={previewUrl(tone)}
              title="תצוגה מקדימה להדפסה"
              loading="eager"
            />
          </div>
          <figcaption>
            {pageCount > 1 ? `תצוגה מקדימה · עמוד ראשון מתוך ${pageCount}` : "תצוגה מקדימה · עמוד אחד"}
          </figcaption>
        </figure>

        <fieldset className={styles.group}>
          <legend>צבע</legend>
          <label className={styles.option}>
            <input
              type="radio"
              name="site-print-tone"
              value="color"
              checked={tone === "color"}
              onChange={() => setTone("color")}
            />
            <span>צבע מלא</span>
          </label>
          <label className={styles.option}>
            <input
              type="radio"
              name="site-print-tone"
              value="bw"
              checked={tone === "bw"}
              onChange={() => setTone("bw")}
            />
            <span>שחור־לבן</span>
          </label>
        </fieldset>

        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={() => onPrint(tone)}>
            הדפסה / שמירה כ־PDF
          </button>
          <button type="button" className={styles.secondary} onClick={onClose}>ביטול</button>
        </div>
      </div>
    </dialog>
  );
}
