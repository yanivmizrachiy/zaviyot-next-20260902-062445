"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  WORKSHEETS,
  WS_GROUPS,
  WS_PAGES,
  WS_TOTAL,
  wsGroupOf,
} from "@/components/worksheets/registry";
import "./unified-book-reader.css";

type ReaderMode = "single" | "spread" | "scroll";
type PrintTone = "color" | "bw";

type PrintRequest = {
  pages: number[];
  title: string;
};

const MODE_KEY = "zaviyot-next:reader-mode";
const PAGE_KEY = "zaviyot-next:last-page";
const SELECTED_KEY = "zaviyot-next:selected-pages";
const OPEN_GROUPS_KEY = "zaviyot-next:open-groups";

function clampPage(n: number) {
  return Math.max(1, Math.min(WS_TOTAL, Math.trunc(n || 1)));
}

function pageHref(page: number) {
  return `/worksheets/${page}?reader=1`;
}

function workbookPdfHref(tone: PrintTone) {
  return tone === "bw"
    ? "/booklet-worksheets/zaviyot-worksheets-bw.pdf"
    : "/booklet-worksheets/zaviyot-worksheets.pdf";
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

function Sheet({ page, lazy = false }: { page: number; lazy?: boolean }) {
  const item = WS_PAGES[page - 1];
  return (
    <div className="zreader__sheet" data-book-page={page}>
      <iframe
        src={pageHref(page)}
        title={`${item.title} — עמוד ${page}`}
        loading={lazy ? "lazy" : "eager"}
      />
    </div>
  );
}

export function UnifiedBookReader() {
  const [page, setPage] = useState(1);
  const [mode, setModeState] = useState<ReaderMode>("single");
  const [ready, setReady] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const [counterOpen, setCounterOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(WS_GROUPS.map((group) => group.title)),
  );
  const [search, setSearch] = useState("");
  const [printRequest, setPrintRequest] = useState<PrintRequest | null>(null);
  const [printTone, setPrintTone] = useState<PrintTone>("color");
  const viewportRef = useRef<HTMLDivElement>(null);
  const suppressHistoryRef = useRef(false);

  const worksheetSlots = useMemo(() => WORKSHEETS.map((item) => item.slot), []);
  const firstWorksheetPage = worksheetSlots[0] ?? 1;

  const groupPages = useMemo(
    () =>
      WS_GROUPS.map((group) => ({
        ...group,
        pages: Array.from({ length: group.to - group.from + 1 }, (_, index) => group.from + index),
      })),
    [],
  );

  const searchResults = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("he");
    if (!query) return [];
    return WS_PAGES.map((item, index) => ({ item, page: index + 1, group: wsGroupOf(index + 1).title }))
      .filter(({ item, group }) => `${item.title} ${group}`.toLocaleLowerCase("he").includes(query))
      .slice(0, 16);
  }, [search]);

  const currentGroup = wsGroupOf(page);

  const writeUrl = useCallback((nextPage: number, nextMode: ReaderMode, push: boolean) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("bookPage", String(nextPage));
    url.searchParams.set("bookMode", nextMode);
    url.searchParams.delete("group");
    url.hash = "worksheets";
    window.history[push ? "pushState" : "replaceState"]({}, "", url);
  }, []);

  const persistSelected = useCallback((next: Set<number>) => {
    localStorage.setItem(SELECTED_KEY, JSON.stringify([...next].sort((a, b) => a - b)));
  }, []);

  const navigateTo = useCallback(
    (nextPage: number, push = true, scrollIntoView = mode === "scroll") => {
      const safe = clampPage(nextPage);
      setPage(safe);
      localStorage.setItem(PAGE_KEY, String(safe));
      writeUrl(safe, mode, push);
      if (isNarrow) setTocOpen(false);
      if (scrollIntoView) {
        requestAnimationFrame(() => {
          const node = viewportRef.current?.querySelector<HTMLElement>(`[data-book-page="${safe}"]`);
          node?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
    },
    [isNarrow, mode, writeUrl],
  );

  const setMode = useCallback(
    (requested: ReaderMode) => {
      const next: ReaderMode = isNarrow && requested === "spread" ? "single" : requested;
      setModeState(next);
      localStorage.setItem(MODE_KEY, next);
      writeUrl(page, next, true);
      setMobileActionsOpen(false);
    },
    [isNarrow, page, writeUrl],
  );

  const step = useCallback(
    (direction: -1 | 1) => {
      const amount = mode === "spread" && !isNarrow ? 2 : 1;
      navigateTo(page + direction * amount, true, mode === "scroll");
    },
    [isNarrow, mode, navigateTo, page],
  );

  const toggleSelection = useCallback(
    (targetPage: number) => {
      setSelected((previous) => {
        const next = new Set(previous);
        if (next.has(targetPage)) next.delete(targetPage);
        else next.add(targetPage);
        persistSelected(next);
        return next;
      });
    },
    [persistSelected],
  );

  const toggleGroup = useCallback((title: string) => {
    setOpenGroups((previous) => {
      const next = new Set(previous);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      localStorage.setItem(OPEN_GROUPS_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const openPrint = useCallback((pages: number[], title: string) => {
    setPrintTone("color");
    setPrintRequest({ pages: [...new Set(pages)].sort((a, b) => a - b), title });
    setMobileActionsOpen(false);
  }, []);

  const runPrint = useCallback(() => {
    if (!printRequest) return;
    const params = new URLSearchParams({
      pages: printRequest.pages.join(","),
      tone: printTone,
      print: "1",
    });
    window.open(`/worksheets/print?${params.toString()}`, "_blank", "noopener,noreferrer");
    setPrintRequest(null);
  }, [printRequest, printTone]);

  const downloadHtml = useCallback(async () => {
    const response = await fetch(pageHref(page), { credentials: "same-origin" });
    if (!response.ok) return;
    const html = await response.text();
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `זוויות-עמוד-${page}.html`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }, [page]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const applyWidth = () => {
      const narrow = media.matches;
      setIsNarrow(narrow);
      if (narrow) {
        setModeState((current) => {
          if (current !== "spread") return current;
          localStorage.setItem(MODE_KEY, "single");
          const params = new URLSearchParams(window.location.search);
          const currentPage = clampPage(Number(params.get("bookPage")) || Number(localStorage.getItem(PAGE_KEY)) || 1);
          writeUrl(currentPage, "single", false);
          return "single";
        });
      }
    };
    applyWidth();
    media.addEventListener("change", applyWidth);

    const params = new URLSearchParams(window.location.search);
    const storedPage = Number(localStorage.getItem(PAGE_KEY));
    const requestedPage = Number(params.get("bookPage"));
    const requestedGroup = params.get("group");
    const initialPage = requestedGroup === "worksheets"
      ? firstWorksheetPage
      : clampPage(requestedPage || storedPage || 1);

    const requestedMode = params.get("bookMode") as ReaderMode | null;
    const storedMode = localStorage.getItem(MODE_KEY) as ReaderMode | null;
    const candidate = requestedMode || storedMode || (media.matches ? "single" : "spread");
    const initialMode: ReaderMode = media.matches && candidate === "spread" ? "single" : candidate;

    let active = true;
    const hydrateReader = () => {
      if (!active) return;
      try {
        const storedSelected = JSON.parse(localStorage.getItem(SELECTED_KEY) || "[]") as number[];
        setSelected(new Set(storedSelected.filter((n) => n >= 1 && n <= WS_TOTAL)));
        const groups = JSON.parse(localStorage.getItem(OPEN_GROUPS_KEY) || "[]") as string[];
        if (groups.length) setOpenGroups(new Set(groups));
      } catch {
        // Corrupt local state is ignored; canonical content stays untouched.
      }

      setPage(initialPage);
      setModeState(initialMode);
      localStorage.setItem(PAGE_KEY, String(initialPage));
      localStorage.setItem(MODE_KEY, initialMode);
      writeUrl(initialPage, initialMode, false);
      setReady(true);
    };
    queueMicrotask(hydrateReader);

    const onPopState = () => {
      suppressHistoryRef.current = true;
      const nextParams = new URLSearchParams(window.location.search);
      const nextPage = clampPage(Number(nextParams.get("bookPage")) || 1);
      const requested = nextParams.get("bookMode") as ReaderMode | null;
      const nextMode: ReaderMode = requested === "spread" || requested === "scroll" ? requested : "single";
      setPage(nextPage);
      setModeState(media.matches && nextMode === "spread" ? "single" : nextMode);
      suppressHistoryRef.current = false;
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      active = false;
      media.removeEventListener("change", applyWidth);
      window.removeEventListener("popstate", onPopState);
    };
  }, [firstWorksheetPage, writeUrl]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || isEditableTarget(event.target)) return;
      if (event.key === "ArrowRight" || event.key === "PageUp") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "ArrowLeft" || event.key === "PageDown") {
        event.preventDefault();
        step(1);
      } else if (event.key === "/") {
        event.preventDefault();
        document.getElementById("zreader-search")?.focus();
      } else if (event.key === "Escape") {
        setTocOpen(false);
        setMobileActionsOpen(false);
        setPrintRequest(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [step]);

  useEffect(() => {
    if (!ready || mode !== "scroll" || !viewportRef.current) return;
    const root = viewportRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best || best.intersectionRatio < 0.45) return;
        const nextPage = Number((best.target as HTMLElement).dataset.bookPage);
        if (!nextPage || nextPage === page) return;
        setPage(nextPage);
        localStorage.setItem(PAGE_KEY, String(nextPage));
        writeUrl(nextPage, "scroll", false);
      },
      { root, threshold: [0.2, 0.45, 0.65], rootMargin: "240px 0px" },
    );
    root.querySelectorAll("[data-book-page]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [mode, page, ready, writeUrl]);

  useEffect(() => {
    if (!ready) return;
    [page - 1, page + 1]
      .filter((target) => target >= 1 && target <= WS_TOTAL)
      .forEach((target) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = pageHref(target);
        link.dataset.zreaderPrefetch = String(target);
        document.head.appendChild(link);
        window.setTimeout(() => link.remove(), 8000);
      });
  }, [page, ready]);

  if (!ready) {
    return <div className="zreader zreader--loading" aria-label="החוברת הדיגיטלית" />;
  }

  const spreadStart = page % 2 === 0 ? Math.max(1, page - 1) : page;
  const selectedPages = [...selected].sort((a, b) => a - b);

  return (
    <div className={`zreader ${selectionMode ? "zreader--selecting" : ""}`} dir="rtl">
      <header className="zreader__header">
        <button
          className="zreader__hamburger"
          type="button"
          aria-label="תוכן העניינים"
          aria-expanded={tocOpen}
          onClick={() => setTocOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="zreader__brand" aria-label="החוברת הדיגיטלית">
          <span className="zreader__brand-icon" aria-hidden="true">📖</span>
          <span>
            <strong>הוראת זוויות בכיתה ז׳</strong>
            <small>החוברת הדיגיטלית</small>
          </span>
        </div>

        <div className="zreader__search-wrap">
          <span className="zreader__search-icon" aria-hidden="true">⌕</span>
          <input
            id="zreader-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="חיפוש"
            aria-label="חיפוש בחוברת"
          />
          {search && (
            <button type="button" className="zreader__search-clear" onClick={() => setSearch("")} aria-label="ניקוי חיפוש">×</button>
          )}
          {search && (
            <div className="zreader__search-results" role="listbox">
              {searchResults.length ? searchResults.map((result) => (
                <button
                  key={result.page}
                  type="button"
                  onClick={() => {
                    setSearch("");
                    navigateTo(result.page, true);
                  }}
                >
                  <strong>{result.item.title}</strong>
                  <span>{result.group} · עמוד {result.page}</span>
                </button>
              )) : <p>לא נמצאו תוצאות</p>}
            </div>
          )}
        </div>

        <div className="zreader__mode-switch" aria-label="מצב קריאה">
          <button type="button" className={mode === "single" ? "is-active" : ""} onClick={() => setMode("single")}>עמוד</button>
          <button type="button" className={mode === "spread" ? "is-active" : ""} onClick={() => setMode("spread")} disabled={isNarrow}>כפולה</button>
          <button type="button" className={mode === "scroll" ? "is-active" : ""} onClick={() => setMode("scroll")}>גלילה</button>
        </div>

        <button type="button" className="zreader__counter-btn" onClick={() => setCounterOpen((value) => !value)} aria-expanded={counterOpen}>לוח מונים</button>
        <span className="zreader__stat">{WS_TOTAL} עמודים · {WORKSHEETS.length} דפי עבודה</span>

        {counterOpen && (
          <div className="zreader__counter-popover">
            <strong>לוח מונים</strong>
            <span>עמוד {page} מתוך {WS_TOTAL}</span>
            <span>{WORKSHEETS.length} דפי עבודה</span>
            <span>{selected.size} עמודים נבחרו</span>
          </div>
        )}
      </header>

      <div className="zreader__layout">
        {isNarrow && tocOpen && <button className="zreader__scrim" type="button" aria-label="סגירת תוכן העניינים" onClick={() => setTocOpen(false)} />}
        <aside className={`zreader__toc ${tocOpen ? "is-open" : ""}`} aria-label="תוכן העניינים">
          <div className="zreader__toc-head">
            <h3>תוכן העניינים</h3>
            <button
              type="button"
              className={selectionMode ? "is-active" : ""}
              aria-pressed={selectionMode}
              onClick={() => setSelectionMode((value) => !value)}
            >
              ☑ בחירה
            </button>
          </div>
          <div className="zreader__toc-list">
            {groupPages.map((group) => (
              <div className={`zreader__toc-group ${page >= group.from && page <= group.to ? "is-current" : ""}`} key={group.title}>
                <button type="button" className="zreader__toc-group-head" onClick={() => toggleGroup(group.title)}>
                  <span className="zreader__caret" aria-hidden="true">‹</span>
                  <span>{group.title}</span>
                  <span className="zreader__count">{group.pages.length}</span>
                </button>
                {openGroups.has(group.title) && (
                  <div className="zreader__toc-pages">
                    {group.pages.map((targetPage) => {
                      const item = WS_PAGES[targetPage - 1];
                      return (
                        <button
                          type="button"
                          className={`zreader__toc-page ${targetPage === page ? "is-active" : ""}`}
                          key={targetPage}
                          onClick={() => selectionMode ? toggleSelection(targetPage) : navigateTo(targetPage, true)}
                        >
                          <span className="zreader__page-num">{targetPage}</span>
                          <span className="zreader__page-title">{item.title}</span>
                          {selectionMode && (
                            <input
                              type="checkbox"
                              checked={selected.has(targetPage)}
                              onChange={() => toggleSelection(targetPage)}
                              onClick={(event) => event.stopPropagation()}
                              aria-label={`בחירת עמוד ${targetPage}`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <section className="zreader__reader">
          <div className="zreader__bar">
            <div className="zreader__copy">
              <strong>{WS_PAGES[page - 1].title}</strong>
              <span>{currentGroup.title} · עמוד {page} מתוך {WS_TOTAL}</span>
            </div>
            <div className="zreader__actions zreader__actions--desktop">
              <button type="button" className="primary" onClick={() => openPrint([page], WS_PAGES[page - 1].title)}>🖨 הדפסה</button>
              <button type="button" onClick={() => openPrint([page], WS_PAGES[page - 1].title)}>⬇ PDF</button>
              <button type="button" onClick={downloadHtml}>HTML</button>
              <button type="button" onClick={() => window.open(`/worksheets/${page}`, "_blank", "noopener,noreferrer")}>↗ פתח</button>
              <button type="button" onClick={() => openPrint(Array.from({ length: currentGroup.to - currentGroup.from + 1 }, (_, index) => currentGroup.from + index), currentGroup.title)}>🖨 פרק</button>
            </div>
          </div>

          <div className="zreader__download-strip">
            <a href={workbookPdfHref("color")} download>⬇ כל דפי העבודה — צבע</a>
            <a href={workbookPdfHref("bw")} download>⬇ כל דפי העבודה — שחור־לבן</a>
          </div>

          {selectionMode && (
            <div className="zreader__selection-bar">
              <strong>{selected.size} נבחרו</strong>
              <button type="button" disabled={!selected.size} onClick={() => openPrint(selectedPages, "העמודים שנבחרו")}>הדפסת הנבחרים</button>
              <button type="button" disabled={!selected.size} onClick={() => openPrint(selectedPages, "העמודים שנבחרו")}>PDF לנבחרים</button>
              <button type="button" onClick={() => {
                const next = new Set<number>();
                setSelected(next);
                persistSelected(next);
              }}>נקה בחירה</button>
            </div>
          )}

          <div className={`zreader__viewport zreader__viewport--${mode}`} ref={viewportRef}>
            {mode === "single" && (
              <div className="zreader__single"><Sheet page={page} /></div>
            )}
            {mode === "spread" && (
              <div className="zreader__spread">
                <Sheet page={spreadStart} />
                {spreadStart + 1 <= WS_TOTAL && <Sheet page={spreadStart + 1} />}
              </div>
            )}
            {mode === "scroll" && (
              <div className="zreader__scroll-stack">
                {WS_PAGES.map((_, index) => <Sheet key={index + 1} page={index + 1} lazy />)}
              </div>
            )}
          </div>

          <div className="zreader__bottom-nav zreader__bottom-nav--desktop">
            <button type="button" onClick={() => step(-1)} disabled={page <= 1}>הקודם</button>
            <span>עמוד {page} מתוך {WS_TOTAL}</span>
            <button type="button" onClick={() => step(1)} disabled={page >= WS_TOTAL}>הבא</button>
          </div>

          <nav className="zreader__mobile-nav" aria-label="פעולות קורא בנייד">
            <button type="button" onClick={() => step(-1)} disabled={page <= 1}>הקודם</button>
            <button type="button" onClick={() => setMobileActionsOpen(true)}>⚙ פעולות</button>
            <button type="button" onClick={() => window.open(`/worksheets/${page}`, "_blank", "noopener,noreferrer")}>פתח מלא</button>
            <button type="button" onClick={() => step(1)} disabled={page >= WS_TOTAL}>הבא</button>
          </nav>
        </section>
      </div>

      {mobileActionsOpen && (
        <div className="zreader__mobile-sheet-wrap" role="presentation">
          <button className="zreader__mobile-sheet-scrim" type="button" aria-label="סגירת פעולות" onClick={() => setMobileActionsOpen(false)} />
          <section className="zreader__mobile-sheet" aria-label="פעולות">
            <div className="zreader__mobile-sheet-handle" />
            <h3>פעולות</h3>
            <div className="zreader__mobile-mode-row">
              <button type="button" className={mode === "single" ? "is-active" : ""} onClick={() => setMode("single")}>עמוד</button>
              <button type="button" className={mode === "scroll" ? "is-active" : ""} onClick={() => setMode("scroll")}>גלילה</button>
            </div>
            <button type="button" onClick={() => openPrint([page], WS_PAGES[page - 1].title)}>🖨 הדפסה / PDF</button>
            <button type="button" onClick={downloadHtml}>HTML</button>
            <button type="button" onClick={() => window.open(`/worksheets/${page}`, "_blank", "noopener,noreferrer")}>↗ פתח</button>
            <button type="button" onClick={() => openPrint(Array.from({ length: currentGroup.to - currentGroup.from + 1 }, (_, index) => currentGroup.from + index), currentGroup.title)}>🖨 פרק</button>
            <a href={workbookPdfHref("color")} download>⬇ כל דפי העבודה — צבע</a>
            <a href={workbookPdfHref("bw")} download>⬇ כל דפי העבודה — שחור־לבן</a>
          </section>
        </div>
      )}

      {printRequest && (
        <div className="zreader__print-modal" role="dialog" aria-modal="true" aria-labelledby="zreader-print-title">
          <button className="zreader__print-scrim" type="button" aria-label="ביטול" onClick={() => setPrintRequest(null)} />
          <section className="zreader__print-card">
            <div className="zreader__print-copy">
              <h3 id="zreader-print-title">הדפסה</h3>
              <p>{printRequest.title}</p>
            </div>
            <div className={`zreader__print-preview ${printTone === "bw" ? "is-bw" : ""}`}>
              <iframe src={pageHref(printRequest.pages[0])} title="תצוגה מקדימה" />
            </div>
            <fieldset>
              <legend>צבע</legend>
              <label><input type="radio" name="zreader-tone" checked={printTone === "color"} onChange={() => setPrintTone("color")} /> צבע מלא</label>
              <label><input type="radio" name="zreader-tone" checked={printTone === "bw"} onChange={() => setPrintTone("bw")} /> שחור־לבן</label>
            </fieldset>
            <div className="zreader__print-actions">
              <button type="button" className="primary" onClick={runPrint}>הדפסה</button>
              <button type="button" onClick={() => setPrintRequest(null)}>ביטול</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
