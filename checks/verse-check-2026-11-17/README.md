# Word-for-word verse check, 2026-11-17

Every passage in `src/verses.js` (394 passages, 996 different texts across NKJV, ESV and NIV) was compared with the
published translations on BibleHub's side-by-side chapter pages.

- `verses-before.js`: the verse file before the corrections.
- `first-pass.json`: every text compared before the corrections (verdict and differences per text).
- `final-pass.json`: the re-check of every Old Testament text and every changed or relabeled New Testament text
  after the corrections (594 texts). Remaining DIFF entries there were single-translation-page artifacts or were
  fixed and confirmed by hand the same day (see the project note `claude/verse-check.md`).
- `helper-instructions-*.md`: the instructions the checking helpers followed (reusable for new verses).
- `saved-verses-test.cjs`: browser test that saved verses pick up corrected labels and wording
  (`npm run build`, then `node checks/verse-check-2026-11-17/saved-verses-test.cjs`; needs Playwright).

Result: no wrong, missing or extra words inside any passage. Corrected: LORD capitals for the divine name,
the NKJV's capital at the start of each poetic line, a few passages that stopped a line short, and one comma.
Passages that quote part of a verse are labeled a or b. Stand-alone quotes may still begin with a capital and end
with a period where the verse runs on.
