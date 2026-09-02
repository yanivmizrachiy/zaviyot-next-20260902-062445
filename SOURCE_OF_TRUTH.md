# SOURCE OF TRUTH — ZAVIYOT NEXT

This file is authoritative and MUST NOT be contradicted.

## 0. Single-source rule — iron rule
This is the ONLY authoritative product/architecture/requirements document in this repository.

Authority chain:
1. `SOURCE_OF_TRUTH.md` — product behavior, architecture, repository boundaries and non-negotiable decisions.
2. `src/components/worksheets/registry.ts` — the ONLY canonical data source for book/page/worksheet order and metadata.
3. Tests and CI — enforcement only. They must verify the truth above and must never become a competing specification.
4. Git history — archive only. Old files, deleted code and old commits are NOT current requirements.

Forbidden competing sources:
- no migration prompt;
- no implementation-agent prompt;
- no implementation log used as requirements;
- no second page/worksheet registry;
- no second PDF build system;
- no legacy reader kept as an alternative production engine.

If any code, comment, old commit, generated artifact or external reference contradicts this file, this file wins unless the user explicitly changes the requirement.

### Active architecture map
The production architecture is intentionally small and explicit:
- Homepage composition: `src/app/page.tsx`
- Digital-book entry: `src/components/WorksheetsBookletBook.tsx`
- First-screen actions + single media modal: `src/components/HomeQuickActions.tsx`
- Active reader: `src/components/book/UnifiedBookReader.tsx`
- Reader styling: `src/components/book/unified-book-reader.css`
- Lightweight physical-book visual layer: `src/app/book-realism.css`
- Canonical book/page/worksheet data: `src/components/worksheets/registry.ts`
- Canonical page rendering: `src/components/worksheets/WorksheetPageRenderer.tsx`
- Canonical print route: `src/app/worksheets/print/page.tsx`
- Selected-page PDF API: `src/app/api/book-pdf/route.ts`
- ONLY canonical static-PDF builder: `scripts/build-static-print-pdf.mjs`
- PDF automation: `.github/workflows/build-worksheet-pdfs.yml`
- Architecture regression guard: `test/architecture.test.ts`

Canonical downloadable artifacts:
- worksheet workbook color: `public/booklet-worksheets/zaviyot-worksheets.pdf`
- worksheet workbook black/white: `public/booklet-worksheets/zaviyot-worksheets-bw.pdf`
- full book color: `public/booklet/hoveret-zaviyot.pdf`
- full book black/white: `public/booklet/hoveret-zaviyot-bw.pdf`
- active video: `public/video/zaviyot-race-lamillion.mp4`
- active video poster: `public/video/zaviyot-race-poster.jpg`
- active presentation source: `public/presentation/geometria-kdam-hesekit.pdf`

Retired items MUST NOT be restored unless the user explicitly asks for them:
- `MIGRATION_PROMPT.md`
- `claude-implementation.log`
- legacy `src/components/flipbook/**`
- legacy flipbook tests
- `src/components/VideoSection.tsx`
- decorative angle-loop video/poster/Hero
- draft route `src/app/booklet-design/page-1/page.tsx`
- old duplicate `public/booklet/booklet-zaviyot.pdf`
- old duplicate `scripts/build-booklet-pdf.mjs`
- retired GveretLevin video font
- unused duplicate portrait `public/team/ayelet-krispin.png`

## 1. Absolute safety boundary
All implementation work happens ONLY in this project:
- `yanivmizrachiy/zaviyot-next-20260902-062445`
- Vercel project `prj_nNLdB3ec30mUsyYVse6cUT7Ib7Hm`
- production `https://zaviyot-next-20260902-062445.vercel.app`

NEVER write, commit, push, merge, deploy, delete, rename or modify anything in:
- `yanivmizrachiy/misparim`
- the original `misparim/zaviyot`
- `yanivmizrachiy/razpages`
- `yanivmizrachiy/jerusalem2`
- the existing `https://zaviyot.vercel.app` project/deployment

Those repositories/projects are REFERENCES ONLY.

Reference snapshots used:
- misparim: `e577e0cdf2673757997fc61a6dc7ebe0aaa0a879`
- razpages: `d6ce709db13493ebc51b02a2d0d10e6acd5656d3`
- jerusalem2: `89d779b1d5b3b4160f469b4e56079af1fe8a3649`

## 2. Content integrity — iron rule
- Do not invent, rewrite, improve, paraphrase or add educational wording.
- Do not add demo text, placeholder copy, temporary copy, slogans or explanatory marketing text.
- Visible content strings must come from existing Zaviyot content unless they are generic reader/print/navigation controls already established in the site/reference UI.
- The cover is identified by its real visible title: `חוברת הוראת הזוויות לכיתה ז׳`.
- Do not expose the invented label `מכתב המורה`.
- Preserve existing real content and valid routes unless the user explicitly removes something.

### Current video rule — explicit user decision
The original Zaviyot `public/video` folder contained exactly two MP4 assets:
1. `zaviyot-race-lamillion.mp4` — the real embedded `המירוץ למיליון` video.
2. `zaviyot-angles-loop.mp4` — the decorative angle-loop animation.

The user explicitly removed the decorative angle-loop animation on 2026-09-02.
Therefore:
- `zaviyot-race-lamillion.mp4` and its real poster remain the ONLY homepage video experience.
- `zaviyot-angles-loop.mp4`, its poster, `HeroAngleVideo`, and the angle-loop Hero must NOT be restored.
- Do not create a second copy of the race video elsewhere on the homepage.

## 3. Main product architecture
The site is a DIGITAL BOOK site with teaching resources around it.
The custom legacy 3D flipbook is retired.
The active book engine is `UnifiedBookReader`.

The book contains ALL canonical digital-booklet and worksheet pages in one reading order.
The top navigation remains.
- `החוברת הדיגיטלית` opens/jumps to the unified book.
- `דפי עבודה` jumps directly to the worksheet group inside the SAME reader/data source.
- There is no second worksheet registry.

## 4. One canonical book source
`src/components/worksheets/registry.ts` is the single data source for:
- reading order
- hierarchical TOC
- search index
- groups/chapters
- worksheet-only access
- worksheet numbering
- print selections
- PDF build inputs
- direct page routes

`scripts/page-manifest.ts` is only a derived health-check helper. It imports the registry and MUST NOT contain an independent page order or page registry.

Canonical current counts:
- 44 total book pages
- 31 worksheet pages

Never regress to stale totals.

## 5. Reader behavior — RazPages parity
Use RazPages as a READ-ONLY behavior/visual reference.
The reader must support:
- RTL
- hierarchical TOC
- global search
- `עמוד`
- `כפולה`
- `גלילה`
- current-page title/meta
- previous/next
- RTL keyboard navigation
- ignoring keyboard shortcuts while typing/editing
- deep links for page + mode
- browser history/back-forward
- selection mode
- print current/group/selected
- PDF current/group/selected
- open current page
- clear selection
- lazy loading in scroll
- adjacent-page preload/prefetch only
- whole-A4 fit without cropping
- responsive resizing without unnecessary reloads

## 6. Startup and real-book opening behavior
A normal fresh homepage visit ALWAYS starts on the REAL cover, page 1, as ONE single page on every device.
It must NOT restore the last-read page or last-read mode from localStorage for that fresh visit.

The cover is not half of a spread.
On a sufficiently wide viewport (>900px):
- the first `הבא` from page 1 opens the booklet naturally to pages 2–3 in `spread` mode;
- subsequent spreads are 4–5, 6–7, and so on;
- `הקודם` from the first inside spread closes back to page 1 in `single` mode;
- explicitly choosing `כפולה` while on the cover also opens pages 2–3.

On iPhone/Android/narrow viewports (<=900px):
- the cover starts single;
- `הבא` continues page-by-page in single mode so pages stay readable and complete;
- spread is not forced into a viewport where two A4 pages would become impractically small.

Explicit `bookPage`, `bookMode`, browser history and explicit `group=worksheets` navigation remain valid, but page 1 itself must never render as half of a spread.

## 7. Mobile is first-class
Phone UI must not be squeezed desktop UI.
On iPhone/Android/narrow screens:
- default single page
- complete A4 visible whenever possible
- TOC as drawer/panel
- large touch targets
- compact Hebrew actions sheet
- continuous scroll available
- no accidental horizontal page overflow
- use safe-area aware controls

Required phone QA:
- 360x800
- 390x844
- 412x915

Required laptop/desktop QA:
- 1280x720
- 1366x768
- 1440x900
- 1920x1080

## 8. Homepage hierarchy and media actions
- The digital book is the dominant first-screen product.
- The whole A4 page/spread must be maximized without cropping.
- Reader chrome must remain compact.
- TOC is secondary/collapsible; mobile TOC is an overlay/drawer.
- A compact colored action rail sits immediately below the reader so users do not need to guess that more content exists.
- Action rail labels use only existing site labels/generic controls:
  - `סרטון`
  - `מצגת`
  - `דפי עבודה`
  - `אביזרים נלווים להמחשה`
  - `הורדת חוברת העבודה`
- Buttons must be compact, consistent, accessible and professional; avoid giant pills, excessive roundness, cartoon styling and unnecessary empty space.
- `סרטון` opens the real `המירוץ למיליון` video IMMEDIATELY in one compact modal above the current page.
- `מצגת` opens the existing presentation IMMEDIATELY in the same compact modal system.
- There is NO countdown, no timer board, no splash screen, no interstitial, no 1.5-second waiting state and no decorative pre-animation.
- The media modal must have an obvious `סגירה` control, close on Escape and return the user to the same book position.
- The media modal must be responsive and must not become an oversized full-page media block on desktop or phone.
- Do NOT keep a second inline copy of the race video below the action rail.
- Do NOT keep a second giant standalone presentation embed below the book. The modal is the single homepage destination for the presentation.
- The top navigation `מצגת` action opens the same presentation modal; on internal routes it returns to the homepage and opens that modal.
- Jerusalem panorama, aids/accessories, Finale/Arena and footer may remain as secondary content below the book.

### Physical-book feel — visual only
- The reader may use subtle paper depth, restrained page-edge shadows and a quiet center gutter in spread mode.
- The visual treatment must remain lightweight and must not change page geometry, canonical content, printing, accessibility or fit-to-page behavior.
- Do NOT reintroduce the retired fake 3D flipbook.
- Do NOT use heavy page-turn animation that harms performance or readability.
- Respect `prefers-reduced-motion`.

## 9. Return navigation — iron rule
Every action that moves the user away from the main book experience must leave an obvious route back.

Homepage media actions use a modal, so closing the modal returns directly to the same book position.
On separate internal routes:
- expose a compact persistent return control for `עמוד הבית` and `החוברת הדיגיטלית`.
- the return control must be responsive and safe-area aware.
- NEVER render the return control inside reader iframes (`reader=1`).
- NEVER render it in the print route/output.

## 10. Printing / PDF — Hebrew Print Center
Use one compact central Hebrew Print/PDF Center, not many large duplicate action bars.
It MUST support:
- accurate complete A4 preview, never narrow/cropped/distorted
- current page
- current chapter/group
- all worksheets
- entire 44-page book
- manual page selection
- selected-page count
- select all / clear selection
- color
- black-and-white
- print
- PDF/download
- selected-page PDF
- canonical page order

Allowed generic controls include:
- `הדפסה`
- `תצוגה מקדימה`
- `עמוד נוכחי`
- `פרק נוכחי`
- `כל דפי העבודה`
- `כל החוברת`
- `בחירת עמודים`
- `צבע מלא`
- `שחור־לבן`
- `PDF`
- `בחר הכל`
- `נקה בחירה`
- `ביטול`

The final OS/browser print dialog may be system-controlled after the in-site Hebrew action.

### Single PDF pipeline
There is ONE static-PDF build engine: `scripts/build-static-print-pdf.mjs`.
It is parameterized by `PDF_PATH`, `PDF_OUT` and `PDF_PORT` and produces the four canonical downloadable PDFs through `.github/workflows/build-worksheet-pdfs.yml`.
Do not add a second full-book builder or a second worksheet builder.

## 11. Fast workbook downloads
Prebuilt direct PDFs remain the fast path:
- worksheet workbook color
- worksheet workbook black-and-white
- full book color
- full book black-and-white

`הורדת חוברת העבודה` is a primary first-screen action and downloads ONLY the student worksheet workbook, not summaries or other book pages.
It must be one click to a prebuilt printable PDF; do not generate the full workbook at request time and do not introduce an app installer/wizard flow.

## 12. Performance
- minimize initial client bundle
- do not render/import the entire workbook into the first client bundle
- do not load the 69MB race video until the user opens the video modal
- lazy-load scroll pages
- preload/prefetch only adjacent pages
- use static/CDN assets where appropriate
- no unnecessary page reloads on mode changes
- no duplicate video rendering
- no duplicate presentation rendering
- do not load fonts/assets that are only referenced by retired components
- actions must feel immediate

## 13. Repository cleanup
- Root-level product requirements live ONLY in `SOURCE_OF_TRUTH.md`.
- The unified reader is the only active digital-book engine.
- `registry.ts` is the only page/worksheet registry.
- `build-static-print-pdf.mjs` is the only static-PDF build engine.
- Dead code/assets explicitly retired by the user must be deleted after dependency verification rather than kept as dormant alternatives.
- Local run output, logs, backups and temporary artifacts must be ignored by Git and never committed as product state.
- Do NOT delete canonical pages, worksheets, the four canonical PDFs, presentation, panorama, aids/accessories, active print infrastructure or unrelated real content.
- Git history is the archive; production source must remain maintainable and non-duplicated.
- Do not create new planning/specification Markdown documents that compete with this file. A future README, if ever needed, may only point to this file and may not contain independent requirements.

## 14. Tests / CI
Maintain real checks for:
- single-source architecture and retired-path absence
- one canonical PDF builder
- reader load
- all canonical page routes
- TOC links
- single/spread/scroll
- fresh homepage starts page 1 in single mode on every viewport
- first next opens pages 2–3 as a spread on wide screens
- first spread previous returns to single cover
- narrow screens remain single after next
- deep links + popstate
- search
- selection
- keyboard focus filtering
- current/group/selected/all-worksheet/all-book print/PDF
- manual page selection
- color/BW
- full-A4 preview/no crop
- prebuilt PDFs downloadable
- action rail links/actions valid
- video modal opens immediately and closes cleanly
- presentation modal opens immediately from action rail and top navigation
- no countdown/interstitial media UI
- no duplicate inline video/presentation blocks
- internal-page return navigation
- return navigation hidden in reader iframe and print
- mobile drawer/actions
- phone/laptop/desktop smoke
- no console errors on key routes

CI must run on pull requests and push to main.
Do not weaken tests to make them pass.

## 15. Completion standard
Do not claim 100% complete until:
- install/CI succeeds
- lint/typecheck/tests pass when present
- production build succeeds
- required live routes return successfully
- critical UI is checked at the required phone/laptop/desktop viewport matrix
- no reference repo/project was modified
- production points to the intended new Zaviyot project
