# Verse check: instructions for each helper

You are checking Bible quotations stored in an app against the published text. Your batch file lists chapters. For
every chapter it gives candidate lines in three translations (NKJV, ESV, NIV). Your job is to find out, for every
candidate line, whether it matches the published translation word for word, and to write the results to a JSON file.
This is read-only research: do not edit any file except your own results file, do not run git, do not change the app.

## Per chapter

1. **Find pages you are allowed to open.** The page reader (WebFetch) only opens addresses that a WebSearch in your own
   session has returned. So first run WebSearch (mode "standard", allowed_domains ["biblehub.com"]) with the query
   `biblehub.com/p/nkjv/esv/<path>.shtml` where `<path>` is the "BibleHub path" shown for the chapter
   (example: `biblehub.com/p/nkjv/esv/psalms/34.shtml`).
2. **Pick pages from the results** that together show NKJV, ESV and NIV for that chapter. Useful shapes, on
   biblehub.com, www.biblehub.com or mail.biblehub.com:
   - side by side: `/p/nkjv/esv/<path>.shtml`, `/p/nkjv/niv/<path>.shtml`, `/p/esv/niv/<path>.shtml`, `/p/niv/esv/…`,
     `/p/kjv/esv/…` (any pair that contains the translation you need)
   - single translation: `/nkjv/<path>.htm`, `/esv/<path>.htm`, `/niv/<path>.htm`
   If a translation is not covered by the results, search once more with `biblehub.com/niv/<path>.htm` (or `/esv/`,
   `/nkjv/`). Never fetch an address that did not appear in your search results: it will be refused. If a fetch is
   refused or a page is not the right chapter, try another result; after two failed tries for a translation, mark
   those lines UNCHECKED and move on.
3. **Fetch each page with the comparison prompt below**, pasting the candidate lines for the translation(s) that page
   shows, copied exactly from the batch file (every character). Usually that is two fetches per chapter: one page for
   NKJV + ESV, one for NIV. You may send several fetches in one turn.

### Comparison prompt (use this wording; fill in the brackets)

```
This page shows [BOOK CHAPTER] in [TRANSLATIONS ON THE PAGE]. Compare the page's [TRANSLATION(S) BEING CHECKED] text, word for word and punctuation mark for punctuation mark, with each candidate below. Ignore verse numbers, footnote marks, headings, line breaks, and straight vs curly or single vs double quote marks. DO report differences in wording, punctuation and capitalization. A candidate may begin or end partway through a verse; if so say "starts mid-verse" or "ends mid-verse" (and which words were left out, under 12 words) and still compare the words it does contain. For each candidate reply "MATCH" or list each difference as: candidate has "..." / page has "..." (a few words each).

[candidate lines, one per line, exactly as in the batch file]
```

The page reader has a quote limit, so never ask it to print whole verses; the "few words each" form is what works.
If an answer is vague for a line (no MATCH and no clear difference), fetch again asking about that line only.

## Verdict for each candidate line

- `MATCH`: identical.
- `EDGE`: the only differences are at the very start or very end of the candidate: capital vs lowercase first letter,
  a different final punctuation mark, or words of the verse left out at the start or the end (starts or ends mid-verse).
- `DIFF`: anything else: a different, missing or extra word inside the text, different punctuation or capitalization
  inside the text, words left out in the middle.
- `UNCHECKED`: you could not load a page for that translation and chapter.

Do not "fix" or second-guess from your own memory of the Bible. Report what the page comparison said. If the page
reader's answer contradicts itself, re-fetch that one line and report the second answer.

## Results file

Write one JSON file (path given in your task) containing an array with one object per candidate line:

```json
{"chapter": "Psalm 34", "ref": "34:4", "translation": "NKJV", "verdict": "MATCH", "differences": [], "url": "https://biblehub.com/p/nkjv/esv/psalms/34.shtml"}
```

For EDGE and DIFF, `differences` is a list of objects:
`{"type": "wording" | "punctuation" | "capitalization" | "omission", "app": "<few words from the candidate>", "published": "<few words from the page>"}`
(for an omission at the start or end, put the left-out words in "published" and "" in "app").
Keep quoted fragments short (under 12 words). Every candidate line in your batch file must appear exactly once.
Write the file with the Write tool as valid JSON (double quotes inside strings escaped). Save progress as you go:
rewrite the file after roughly every five chapters so partial work is not lost.

## Final reply

Reply with: how many lines were MATCH, EDGE, DIFF and UNCHECKED, then a short list of every DIFF (chapter, ref,
translation, what differs). Nothing else.
