"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./SiteReturnNav.module.css";

export function SiteReturnNav() {
  const pathname = usePathname();
  const [embedded, setEmbedded] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextEmbedded = window.self !== window.top || params.get("reader") === "1";
    queueMicrotask(() => setEmbedded(nextEmbedded));
  }, [pathname]);

  if (pathname === "/" || embedded || pathname.startsWith("/worksheets/print")) {
    return null;
  }

  return (
    <nav className={styles.nav} aria-label="חזרה">
      <Link className={styles.home} href="/">עמוד הבית</Link>
      <Link className={styles.book} href="/#worksheets">החוברת הדיגיטלית</Link>
    </nav>
  );
}
