"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ACCESSORIES_INDEX_HREF } from "@/lib/accessoriesItems";

const VIDEO_URL = "/video/zaviyot-race-lamillion.mp4";
const POSTER_URL = "/video/zaviyot-race-poster.jpg";

export function HomeResourceDock() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <aside className="home-resource-dock">
      <button
        type="button"
        className="home-resource-dock__video"
        aria-label="הפעלת הסרטון"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Image
          src={POSTER_URL}
          alt=""
          width={320}
          height={180}
          sizes="(max-width: 1180px) 180px, 210px"
          priority
        />
        <span className="home-resource-dock__play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M9 7.5v9l7-4.5-7-4.5Z" fill="currentColor" />
          </svg>
        </span>
      </button>

      <nav className="home-resource-dock__links">
        <a href="#presentation">מצגת</a>
        <Link href="/?group=worksheets#worksheets">דפי עבודה</Link>
        <Link href={ACCESSORIES_INDEX_HREF}>אביזרים נלווים להמחשה</Link>
      </nav>

      <a className="home-resource-dock__continue" href="#video" aria-label="המשך">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      <dialog ref={dialogRef} className="home-resource-dialog">
        <button
          type="button"
          className="home-resource-dialog__close"
          aria-label="סגירה"
          onClick={() => dialogRef.current?.close()}
        >
          ×
        </button>
        <video controls playsInline preload="none" poster={POSTER_URL}>
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
      </dialog>
    </aside>
  );
}
