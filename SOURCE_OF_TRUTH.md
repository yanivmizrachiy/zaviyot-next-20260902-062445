# SOURCE OF TRUTH — ZAVIYOT NEXT

This file is authoritative and MUST NOT be contradicted.

## Absolute safety boundary
NEVER write, commit, push, merge, deploy, delete, rename or modify anything in:
- yanivmizrachiy/misparim
- yanivmizrachiy/razpages
- yanivmizrachiy/jerusalem2
- the existing zaviyot.vercel.app project/deployment

Those three repositories are REFERENCES ONLY.
All implementation work happens ONLY in this new project.

Source snapshots used:
- misparim: e577e0cdf2673757997fc61a6dc7ebe0aaa0a879
- razpages: d6ce709db13493ebc51b02a2d0d10e6acd5656d3
- jerusalem2: 89d779b1d5b3b4160f469b4e56079af1fe8a3649

## Content integrity
- Do not invent, rewrite, improve, paraphrase or add educational wording.
- Do not add demo text or placeholder copy.
- Every visible content string must come from the existing Zaviyot source unless it is a generic reader/control label already present in RazPages or the Hebrew print UI reference.
- Preserve the existing Zaviyot homepage and all unrelated sections: TopBar, SiteNav, Hero, Jerusalem panorama, both videos, presentation, Finale/Arena, footer, hamchashot/accessories and existing valid routes.
- Do not redesign unrelated sections.
- Technical improvements outside the reader are allowed only when clearly beneficial and behavior-preserving.

## Main product change
Replace the current custom 3D flipbook experience and the separate worksheet experience with ONE digital-book system.
The book must contain ALL existing digital-booklet pages AND ALL worksheet pages, in their current canonical order and wording.

The top navigation items remain. "החוברת הדיגיטלית" opens the book. "דפי עבודה" remains visible and must jump directly to the worksheet group inside the SAME book, not a second data source.

## One source of truth
Create one canonical typed book manifest derived from/refactoring the existing WS_PAGES semantics.
From that one manifest derive:
- reading order
- hierarchical TOC
- search index
- groups/chapters
- worksheet-only view/filter
- worksheet numbering
- print selections
- PDF build inputs
- direct page routes
No duplicate page registries. No duplicate manually maintained worksheet list.

## RazPages parity — required
Use .references/razpages as the behavior and visual reference.
Desktop reader must be no worse and not materially different in controls/graphics/behavior:
- RTL
- right-side hierarchical TOC
- global search
- single-page mode: "עמוד"
- two-page spread mode: "כפולה"
- continuous scroll mode: "גלילה"
- current-page title/meta
- previous/next
- RTL keyboard semantics
- ignore keyboard shortcuts while typing/in editable controls
- localStorage restoration only for explicit navigation/history behavior; a fresh homepage visit follows the startup iron rule below
- deep links for current page + mode
- browser history/back-forward
- selection mode
- print current
- PDF/current save workflow
- open current page
- print chapter/group
- print/PDF selected
- clear selection
- lazy loading in scroll
- preload adjacent pages
- A4 scaling
- responsive resizing without unnecessary reloads

Do not copy unrelated RazPages content. Copy/port the reader technology and behavior.

## Mobile — first-class, not squeezed desktop
Use the RazPages mobile implementation as a behavioral reference.
On phone:
- dedicated mobile shell/controls
- TOC as drawer/panel
- large touch targets
- single page as default
- continuous scroll available
- spread only when viewport/orientation genuinely supports readable pages
- actions available in a compact Hebrew actions sheet
- fast zoom/fit behavior where useful
- no horizontal accidental page overflow
- tested at 360x800, 390x844, 412x915
Also test laptop and desktop at 1280x720, 1366x768, 1440x900, 1920x1080.

## Hebrew printing UI
Study .references/jerusalem2-print.
Implement a polished in-site Hebrew print dialog, not English site controls.
The print experience is a compact central Print/PDF Center, not many large duplicate buttons.
It MUST support:
- accurate full-A4 live preview that is never narrow, cropped or distorted
- current page
- current chapter/group
- all worksheets
- entire book
- manual page selection from the canonical 44-page manifest
- easy select-all / clear-all and visible selected-page count
- color / black-and-white choice
- print action
- PDF/download action
- selected-page printing and selected-page PDF
- preserve page order exactly as the canonical manifest
- use one shared print/action engine for all scopes

Allowed generic Hebrew print/control labels include:
- "הדפסה"
- "תצוגה מקדימה"
- "עמוד נוכחי"
- "פרק נוכחי"
- "כל דפי העבודה"
- "כל החוברת"
- "בחירת עמודים"
- "צבע מלא"
- "שחור־לבן"
- "PDF"
- "בחר הכל"
- "נקה בחירה"
- "ביטול"

Browser/system print UI may still be OS-controlled after the user presses the Hebrew in-site print button.

## Very fast downloads
Create direct static download buttons.
Build/pre-generate:
1. all worksheets PDF — color
2. all worksheets PDF — black & white
The click must not generate those full worksheet PDFs at request time.
Use the same canonical manifest as the source for those PDFs.
Keep current page/PDF actions consistent with RazPages.

## Homepage hierarchy — current required UX
- The digital book is the primary product and MUST remain the dominant content immediately on homepage load.
- The whole current A4 page must be visible whenever the viewport permits; never enlarge by cropping.
- Controls around the book must be compact. Do not let toolbars, print controls, TOC, or secondary actions steal large screen areas.
- TOC is secondary and collapsible; on mobile it is an overlay/drawer.
- The user must understand from the first screen that more site content exists below the book. Use a compact visual cue/peek or existing-resource access without inventing explanatory copy.
- The existing real child/video asset may appear as a small compact preview in the first-screen ecosystem, but it must not compete with or shrink the book materially; no autoplay with sound.
- Existing presentation, video, Jerusalem panorama, aids/accessories, Finale/Arena and footer remain available below/around the reader in a secondary hierarchy.
- Avoid giant cards, giant buttons, duplicate action rows, and unnecessary empty space.

## Iron rules — startup and visible wording
- A plain visit to `/` or `/#worksheets` MUST open the unified reader on the real cover, page 1, in single-page mode.
- A plain visit MUST NOT restore the last-read page or last-read mode from localStorage. Explicit `bookPage`, `bookMode`, browser history, and the explicit `group=worksheets` navigation remain valid.
- No visible demo text, placeholder copy, temporary copy, invented chapter names, invented subtitles, or explanatory wording may be introduced.
- Visible page titles, TOC labels, subtitles, and content metadata must reuse wording already present in the canonical Zaviyot content. Generic reader/print controls are the only exception.
- The cover is identified in the reader using its actual visible title: `חוברת הוראת הזוויות לכיתה ז׳`; do not expose the invented label `מכתב המורה`.
- When screen space is available, the reader must maximize the whole A4 page while keeping the complete page visible; never enlarge by cropping.

## Performance
- minimize initial client bundle
- page routes should be stable, same-origin and reader-friendly
- do not import/render the whole workbook into the initial client bundle
- lazy-load scroll pages
- preload only adjacent pages
- avoid duplicate fonts
- keep large unrelated video from blocking reader startup
- use static/CDN assets appropriately
- no unnecessary re-render/reload on mode switches
- actions must feel immediate
- preserve existing content fidelity

## Repository cleanup — current rule
- The unified reader is the only active digital-book engine.
- Proven-unreferenced legacy flipbook implementation, its CSS, helper files and legacy-only tests should be removed from THIS NEW repo once dependency search confirms they are not used by production code.
- Do not delete canonical page content, worksheets, PDFs, presentation, video, panorama, aids/accessories, active routes, print infrastructure or reference snapshots.
- Do not keep dead demo/draft infrastructure merely for historical reasons when Git history already preserves it.
- Cleanup must reduce duplication without weakening tests for the active unified reader.

## Beneficial cleanup in NEW project only
Apply only improvements that help and do not change intended content:
- isolate reader styles from giant global CSS where practical
- centralize site URL/metadata config
- correct keyboard-event scope problems
- add Hebrew/custom not-found, error and loading states without inventing educational copy
- improve accessible focus states
- preserve reduced-motion behavior
- add video captions only if an actual caption source exists; do not invent captions
- reduce clearly unused font loading if verified safe
- remove old flipbook code/CSS after new reader parity and dependency checks
- remove dead duplicate worksheet-reader infrastructure ONLY when replacements are proven
- no broad aesthetic redesign of the rest of the site

## Tests / CI
Add/maintain real browser and route tests:
- reader loads
- every manifest page route resolves
- TOC links valid
- single/spread/scroll
- fresh homepage starts at page 1
- deep link and popstate
- search
- selection persistence where allowed by the startup iron rule
- keyboard focus filtering
- current/group/selected/all-worksheet/all-book printing flows
- manual page selection
- color/BW print state
- full-A4 preview aspect and no crop
- both prebuilt worksheet PDFs exist and are downloadable
- mobile drawer/actions
- phone/laptop/desktop smoke
- unrelated homepage sections still render
- no console errors on key routes

CI must run on pull requests AND push to main.
Do not weaken tests to make them pass.

## Completion standard
Before declaring complete:
- npm install/ci succeeds
- lint/typecheck/tests succeed when present
- production build succeeds
- old unrelated features remain
- obsolete reader code is cleaned after parity/dependency verification
- repository is clean and maintainable
- print/PDF center works for every required scope
- no reference repo was modified

## Current homepage and print UX — mandatory
- The digital book remains the dominant first-screen product.
- The first screen must visibly expose the existing video, presentation, worksheets and accessories without shrinking or cropping the book unnecessarily.
- Do not add any new visible slogan, promotional sentence, demo label, placeholder, educational wording or explanatory copy.
- The first-screen resource dock may display only existing site labels/assets plus generic icon-only controls.
- Printing/PDF uses one compact action center, not multiple large duplicate action bars.
- The print/PDF center must support current page, current chapter, all worksheets, the whole book, and manual page selection.
- The preview must show a complete A4 page with correct aspect ratio.
- Color and black-white must work for print and PDF.
- Arbitrary selected-page PDF downloads are generated from prebuilt full-book color/BW PDFs; all-workbook and all-worksheet PDFs stay static for speed.
