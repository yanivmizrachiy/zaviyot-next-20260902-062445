# SOURCE OF TRUTH — ZAVIYOT NEXT

This file is authoritative and MUST NOT be contradicted.

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
`src/components/worksheets/registry.ts` / the canonical typed manifest is the single data source for:
- reading order
- hierarchical TOC
- search index
- groups/chapters
- worksheet-only access
- worksheet numbering
- print selections
- PDF build inputs
- direct page routes

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

## 6. Startup behavior
A normal fresh homepage visit always starts on the REAL cover, page 1.
It must NOT restore the last-read page from localStorage.

Responsive default mode:
- width > 900px: `spread` (two-page book opening)
- width <= 900px: `single`

Explicit `bookPage`, `bookMode`, browser history and explicit `group=worksheets` navigation remain valid.

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

## 8. Homepage hierarchy
- The digital book is the dominant first-screen product.
- The whole A4 page/spread must be maximized without cropping.
- Reader chrome must remain compact.
- TOC is secondary/collapsible; mobile TOC is an overlay/drawer.
- Users must understand from the first viewport that additional resources exist; they must not need to guess that scrolling is possible.
- A compact colored action rail sits immediately below the reader in the first-screen ecosystem.
- Action rail labels use only existing site labels/generic controls:
  - `סרטון`
  - `מצגת`
  - `דפי עבודה`
  - `אביזרים נלווים להמחשה`
  - `הורדת חוברת העבודה`
- Buttons must be compact, consistent, accessible and professional; avoid giant pills, excessive roundness, cartoon styling and unnecessary empty space.
- The embedded race video remains a compact destination below the action rail and must not shrink the book materially.
- Presentation, Jerusalem panorama, aids/accessories, Finale/Arena and footer remain secondary content below.

## 9. Return navigation — iron rule
Every action that moves the user away from the main book experience must leave an obvious route back.

On the homepage:
- the sticky site navigation remains available while scrolling to video/presentation and includes the path back to `החוברת הדיגיטלית` / `עמוד הבית`.

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

## 11. Fast workbook downloads
Prebuilt direct PDFs remain the fast path:
- worksheet workbook color
- worksheet workbook black-and-white
- full book color
- full book black-and-white

`הורדת חוברת העבודה` downloads ONLY the student worksheet workbook, not summaries or other book pages.
The click must not generate the full worksheet workbook at request time.

## 12. Performance
- minimize initial client bundle
- do not render/import the entire workbook into the first client bundle
- keep the 69MB race video from blocking reader startup (`preload=none`/lazy behavior)
- lazy-load scroll pages
- preload/prefetch only adjacent pages
- use static/CDN assets where appropriate
- no unnecessary page reloads on mode changes
- no duplicate video rendering
- actions must feel immediate

## 13. Repository cleanup
- The unified reader is the only active digital-book engine.
- Legacy flipbook-only code/tests may be removed after dependency verification.
- Dead code/assets explicitly retired by the user should not remain merely to be accidentally restored.
- Do NOT delete canonical pages, worksheets, PDFs, presentation, panorama, aids/accessories, active print infrastructure or unrelated real content.
- Git history is the archive; production code should remain maintainable and non-duplicated.

## 14. Tests / CI
Maintain real checks for:
- reader load
- all canonical page routes
- TOC links
- single/spread/scroll
- fresh homepage starts page 1
- responsive spread desktop / single mobile
- deep links + popstate
- search
- selection
- keyboard focus filtering
- current/group/selected/all-worksheet/all-book print/PDF
- manual page selection
- color/BW
- full-A4 preview/no crop
- prebuilt PDFs downloadable
- action rail links valid
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
