# Final verse check: instructions for each helper

An app's Bible quotations were just corrected. You are re-checking the corrected text against the published
translations (NKJV, ESV, NIV) on BibleHub. Your list gives chapters; for every chapter it gives candidate lines in
three translations. For every candidate line, find out whether it now matches the published text exactly, and whether
it covers its verse(s) from first word to last. Write the results to a JSON file.
This is read-only research: do not edit any file except your own results file, do not run git, do not change the app.

## Per chapter

1. **One web search.** The page reader (WebFetch) only opens addresses that a WebSearch in your own session returned.
   Searches are capped and shared with six other helpers, so use ONE search per chapter:
   WebSearch (mode "standard", allowed_domains ["biblehub.com"]) with the query
   `biblehub.com/p/nkjv/esv/<path>.shtml`, where `<path>` is the "BibleHub path" shown for the chapter.
2. **Pick side-by-side pages from the results** (addresses containing `/p/`, on biblehub.com, www.biblehub.com or
   mail.biblehub.com) that together cover NKJV, ESV and NIV: for example `/p/nkjv/esv/<path>.shtml` plus
   `/p/nkjv/niv/<path>.shtml`, or `/p/esv/niv/…`, `/p/niv/esv/…`, `/p/kjv/esv/…`, `/p/nkjv/bsb/…` (use only the
   translation you need from a pair). Side-by-side pages matter because they print the divine name in capitals
   (LORD); the single-translation pages (`/nkjv/<path>.htm` etc.) may not. Use a single-translation page only if no
   side-by-side page for that translation came back, and then say so in a `note` field.
   A second search for a chapter is allowed only when a translation has no page at all
   (`biblehub.com/p/nkjv/niv/<path>.shtml` or `biblehub.com/p/esv/niv/<path>.shtml`). Never a third.
   Never fetch an address that did not appear in your search results: it will be refused.
3. **Fetch each page with the comparison prompt below**, pasting the candidate lines for the translation(s) that page
   shows, copied exactly from your list (every character, including capitals). Usually two fetches per chapter.
   You may send several fetches in one turn.

### Comparison prompt (use this wording; fill in the brackets)

```
This page shows [BOOK CHAPTER] in [TRANSLATIONS ON THE PAGE]. Compare the page's [TRANSLATION(S) BEING CHECKED] text with each candidate below, word for word, punctuation mark for punctuation mark and capital letter for capital letter. Ignore verse numbers, footnote marks, headings, line breaks, straight vs curly or single vs double quote marks, and a long dash shown as two hyphens. Two things matter especially: (1) the divine name: where the page prints LORD or GOD in all capitals the candidate must too, and where the page prints Lord or God in ordinary letters so must the candidate; (2) capital letters at the start of poetic lines in the middle of a sentence. A candidate containing "..." deliberately skips words at that point; do not report that. For each candidate reply on one line: either MATCH, or each difference as: candidate has "..." / page has "..." (a few words each). Then add START: yes or no (does the candidate begin with the first word of its first verse?) and END: yes or no (does the candidate end with the last word of its last verse?).

[candidate lines, one per line, exactly as in your list]
```

The page reader has a quote limit, so never ask it to print whole verses. If an answer is vague or contradicts
itself for a line, fetch again asking about that line only and report the second answer.

## Verdict for each candidate line

- `MATCH`: identical.
- `EDGE`: the only differences are at the very start or very end of the candidate: capital vs lowercase first
  letter, or a different final punctuation mark.
- `DIFF`: anything else: a different, missing or extra word; different punctuation or capitalization inside the
  text (including Lord vs LORD, God vs GOD, and poetic-line capitals).
- `UNCHECKED`: you could not load a page for that translation and chapter.

Do not correct anything from your own memory of the Bible. Report what the page comparison said.

## Results file

One JSON array with one object per candidate line:

```json
{"chapter": "Psalm 34", "ref": "34:4", "translation": "NKJV", "verdict": "MATCH", "differences": [], "start": true, "end": true, "url": "https://biblehub.com/p/nkjv/esv/psalms/34.shtml"}
```

- `ref` is the label exactly as in your list (keep any a or b).
- `start` / `end`: true if the candidate begins with the first word of its first verse / ends with the last word of
  its last verse, false if not, null if the page reader did not say.
- `differences` for EDGE and DIFF: a list of
  `{"type": "wording" | "punctuation" | "capitalization" | "omission", "app": "<few words from the candidate>", "published": "<the same few words as the page prints them>"}`.
  Give enough neighbouring words (three to six) that the place can be found in the candidate, and write "published"
  exactly as the page prints it, with nothing added in brackets. Keep fragments under 12 words.
- Every candidate line in your list must appear exactly once. Write the file with the Write tool as valid JSON.
  Rewrite it after roughly every five chapters so partial work is not lost.

## Final reply

Counts of MATCH, EDGE, DIFF and UNCHECKED lines; then every DIFF (chapter, label, translation, what differs); then
every line whose `start` or `end` is false (chapter, label, translation). Nothing else.
