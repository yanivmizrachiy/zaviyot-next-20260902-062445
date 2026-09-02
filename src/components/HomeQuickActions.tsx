"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ACCESSORIES_INDEX_HREF } from "@/lib/accessoriesItems";
import { PresentationViewer } from "./PresentationViewer";
import styles from "./HomeBookStage.module.css";

const WORKSHEETS_PDF = "/booklet-worksheets/zaviyot-worksheets.pdf";
const VIDEO_URL = "/video/zaviyot-race-lamillion.mp4";
const POSTER_URL = "/video/zaviyot-race-poster.jpg";

type Media = "video" | "presentation" | null;

export function HomeQuickActions() {
  const [media, setMedia] = useState<Media>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!media) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMedia(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [media]);

  return (
    <>
      <nav className={styles.actions} aria-label="פעולות">
        <button className={styles.actionVideo} type="button" onClick={() => setMedia("video")}>סרטון</button>
        <button className={styles.actionPresentation} type="button" onClick={() => setMedia("presentation")}>מצגת</button>
        <Link className={styles.actionWorksheets} href="/?group=worksheets#worksheets">דפי עבודה</Link>
        <Link className={styles.actionAccessories} href={ACCESSORIES_INDEX_HREF}>אביזרים נלווים להמחשה</Link>
        <a className={`${styles.actionDownload} ${styles.actionPrimary}`} href={WORKSHEETS_PDF} download="חוברת העבודה - זוויות.pdf">הורדת חוברת העבודה</a>
      </nav>

      {media ? (
        <div className={styles.mediaOverlay} role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setMedia(null);
        }}>
          <section className={styles.mediaDialog} role="dialog" aria-modal="true" aria-label={media === "video" ? "סרטון" : "מצגת"}>
            <div className={styles.mediaBar}>
              <strong>{media === "video" ? "סרטון" : "מצגת"}</strong>
              <button ref={closeRef} type="button" onClick={() => setMedia(null)} aria-label="סגירה">סגירה</button>
            </div>
            <div className={styles.mediaBody}>
              {media === "video" ? (
                <video className={styles.modalVideo} controls autoPlay playsInline preload="metadata" poster={POSTER_URL}>
                  <source src={VIDEO_URL} type="video/mp4" />
                  <a href={VIDEO_URL} download="זוויות - המירוץ למיליון.mp4">הורדת הסרטון</a>
                </video>
              ) : (
                <div className={styles.modalPresentation}>
                  <PresentationViewer embed />
                </div>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
