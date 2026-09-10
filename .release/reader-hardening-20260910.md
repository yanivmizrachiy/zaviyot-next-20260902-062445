# Zaviyot 2 reader release hardening

Implement these release fixes without removing existing reader capabilities:

1. In `src/components/book/UnifiedBookReader.tsx`, make each `/worksheets/{page}?reader=1` iframe render a full 210mm × 297mm A4 page scaled to fit the visible `.zreader__sheet` on desktop, tablet, phone, and orientation changes. Do not crop A4 content or introduce nested scrollbars. Preserve single/spread/scroll modes, print selection, search, groups, and current navigation logic.
2. While the homepage media dialog (video or presentation) is open, suspend book-level keyboard shortcuts so ArrowLeft/ArrowRight/PageUp/PageDown do not change hidden reader pages. Escape must still close the media dialog. Use an explicit shared state signal such as a body data attribute; do not rely on focus alone.
3. On a bare homepage visit with no explicit `bookPage`, no `group`, and no explicit `bookMode`, restore the last valid page and reader mode from the existing `zaviyot-next:last-page` / `zaviyot-next:reader-mode-fit-v3` storage keys. Explicit deep links and `group=worksheets` must continue to override storage. On narrow screens, spread must still degrade safely to single.
4. Verify that `reader=1` pages do not render `WsReaderBar` or outer standalone reader chrome, and that embedded A4 wrappers use a deterministic 210mm × 297mm canvas suitable for scaling.
5. Do not change the canonical URL, source-of-truth rules, deployment project IDs, PDFs, worksheet ordering, or teacher-facing content.
6. Run the repo's normal checks/build. Remove this `.release/reader-hardening-20260910.md` task file before the PR is merged.

Lockfile repair completed with npm 11.6.2; rerun the full release gate on the synchronized lockfile.
