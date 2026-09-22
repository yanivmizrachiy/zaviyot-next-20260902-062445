"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ACCESSORIES_INDEX_HREF } from "@/lib/accessoriesItems";
import { PresentationViewer } from "./PresentationViewer";
import { PUBLIC_ASSETS } from "@/config/site";
import styles from "./HomeBookStage.module.css";

type Media = "video" | "presentation" | null;
type MediaEvent = CustomEvent<{ media?: Exclude<Media, null> }>;

export function HomeQuickActions() {
  const [media, setMedia] = useState<Media>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("media");
    if (requested === "video" || requested === "presentation") {
      queueMicrotask(() => setMedia(requested));
      params.delete("media");
      const query = params.toString();
      history.replaceState(history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
    }

    const onOpen = (event: Event) => {
      const requestedMedia = (event as MediaEvent).detail?.media;
      if (requestedMedia === "video" || requestedMedia === "presentation") setMedia(requestedMedia);
    };
    window.addEventListener("zaviyot:open-media", onOpen);
    return () => window.removeEventListener("zaviyot:open-media", onOpen);
  }, []);

  useEffect(() => {
    if (!media) {
      delete document.body.dataset.zaviyotMediaOpen;
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.zaviyotMediaOpen = "1";
    requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMedia(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      delete document.body.dataset.zaviyotMediaOpen;
    };
  }, [media]);

  return (
    <>
      <nav className={styles.actions} aria-label="פעולות">
        <button className={styles.actionVideo} type="button" onClick={() => setMedia("video")}>סרטון</button>
        <button className={styles.actionPresentation} type="button" onClick={() => setMedia("presentation")}>מצגת</button>
        <Link className={styles.actionWorksheets} href="/?group=worksheets#worksheets">דפי עבודה</Link>
        <Link className={styles.actionAccessories} href={ACCESSORIES_INDEX_HREF}>אביזרים נלווים להמחשה</Link>
        <a className={`${styles.actionDownload} ${styles.actionPrimary}`} href={PUBLIC_ASSETS.worksheetsPdf} download={PUBLIC_ASSETS.worksheetDownloadName}>הורדת חוברת העבודה</a>
      </nav>

      {media ? (
        <div
          className={styles.mediaOverlay}
          role="presentation"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setMedia(null);
          }}
        >
          <section
            className={`${styles.mediaDialog} ${media === "presentation" ? styles.mediaDialogPresentation : styles.mediaDialogVideo}`}
            role="dialog"
            aria-modal="true"
            aria-label={media === "video" ? "סרטון" : "מצגת"}
          >
            <div className={styles.mediaBar}>
              <strong>{media === "video" ? "סרטון" : "מצגת"}</strong>
              <div className={styles.mediaBarActions}>
                {media === "video" ? (
                  <a href={PUBLIC_ASSETS.video} download={PUBLIC_ASSETS.videoDownloadName}>הורדה</a>
                ) : null}
                <button ref={closeRef} type="button" onClick={() => setMedia(null)} aria-label="סגירה">סגירה</button>
              </div>
            </div>
            <div className={`${styles.mediaBody} ${media === "presentation" ? styles.mediaBodyPresentation : styles.mediaBodyVideo}`}>
              {media === "video" ? (
                <video className={styles.modalVideo} controls autoPlay playsInline preload="metadata" poster={PUBLIC_ASSETS.videoPoster}>
                  <source src={PUBLIC_ASSETS.video} type="video/mp4" />
                  <a href={PUBLIC_ASSETS.video} download={PUBLIC_ASSETS.videoDownloadName}>הורדת הסרטון</a>
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
