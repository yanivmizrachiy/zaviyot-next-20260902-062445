"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccessoriesNavMenu } from "./AccessoriesNavMenu";
import "./sitenav.css";

export function SiteNav() {
  const pathname = usePathname() ?? "/";
  const onHome = pathname === "/";
  const inBook = pathname === "/" || pathname.startsWith("/worksheets");

  const openPresentation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onHome) return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent("zaviyot:open-media", { detail: { media: "presentation" } }));
  };

  return (
    <nav className="sitenav" aria-label="ניווט בעמוד">
      <div className="container sitenav__inner">
        <Link className="sitenav__home" href="/" aria-current={onHome ? "page" : undefined}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V21h5v-6h4v6h5V9.5" />
          </svg>
          עמוד הבית
        </Link>
        <a
          className="sitenav__link"
          href={onHome ? "/?media=presentation#worksheets" : "/?media=presentation#worksheets"}
          onClick={openPresentation}
        >
          מצגת
        </a>
        {onHome ? (
          <a className="sitenav__link" href="#worksheets" aria-current={inBook ? "page" : undefined}>
            החוברת הדיגיטלית
          </a>
        ) : (
          <Link className="sitenav__link" href="/#worksheets" aria-current={inBook ? "page" : undefined}>
            החוברת הדיגיטלית
          </Link>
        )}
        <Link className="sitenav__link" href="/?group=worksheets#worksheets">
          דפי עבודה
        </Link>
        <AccessoriesNavMenu />
      </div>
    </nav>
  );
}
