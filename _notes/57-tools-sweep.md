# Turn 57 — Tools consistency sweep (hold push)

Caroline locked Case Study. Swept `1301/tools/` (index, thesis, outline, MLA, source log, peer-review checklist, keyword generator) vs locked home/resources/weeks/case-study.

## Findings
- All 7 pages already load `../styles.css` → locked `_design/section-charcoal.css` (charcoal chrome, page-level soft green floats, ~1240px main / ~1.1rem body).
- Tool cards (index) + `.tool-panel` + claim/outline/source/peer/keyword rows already in the lighter ombré family.
- Copy: no grades / Canvas / late / submission / scoring language (only "point to a sentence" in peer review — fine).
- Soft purpose: thesis-helper hint already reads one clear claim + packet evidence + 3–4 outside sources. No change.

## Fix (only clear mismatch)
- `.tool-card` was still pre-bump (padding 1.1rem, title 1.2rem). Bumped to padding 1.25rem 1.3rem, gap 0.45rem, title 1.3rem, small 0.98rem to match studio launch / resource cards.

## Files touched
- `_design/section-charcoal.css` — `.tool-card` scale
- `_notes/57-tools-sweep.md`

Shot: http://127.0.0.1:8877/1301/tools/ at true 100% zoom.
