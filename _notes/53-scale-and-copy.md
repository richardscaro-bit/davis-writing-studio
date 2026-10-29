# Turn 53 — scale + copy pass (hold push)

## Why home looked tiny
- Shot `52-1301-home.png` was a short 1280×800 capture with browser chrome; content sat in empty dark space (likely reduced zoom and/or short page in a tall window).
- Shared rail was also a bit tight: `main` max-width 1100px, body ~1.02rem.

## Scale fixes (hub untouched)
In `_design/section-charcoal.css` + `1301/styles.css`:
- `main` max-width **1100 → 1240px**, more padding
- body font **1.02 → 1.1rem** (~17.6px)
- welcome h1 **up to ~3.25rem**
- lead, buttons, path/dashboard cards roomier
- home grids minmax ~300px, taller cards
- resource/tool grids slightly wider minmax
- locked look kept: charcoal ombré + soft green hub dragon floats

Measured at 100% (Puppeteer 1440×900, DPR 1): mainMax=1240px, bodyFont=17.6px, h1≈52px.
Shot: `_shots/53-1301-home-full.png` (viewport at 100%, not zoomed-out fullPage).
Also: `_shots/53b-resources-100.png`

**Parent:** please re-capture with computerUse at **100% browser zoom** (no full-page zoom-out) if showing Caroline in the desktop browser.

## Copy rewrite (every 1301 course page + studio JS)
Instructional copy now only explains how to use that page / what each resource or tool is for.
Stripped: Canvas LMS mentions, grades, late penalties, submission, scoring, due 11:59 CT language.
Kept: soft purpose as claim + packet + 3–4 outside sources + MLA length framing (no Canvas).
Touched: home, resources, weeks, tools index + each tool, case-study studio (`app.js`), comparison/exposition stubs, AI guide, `tools.js` status/export strings.

Hold push still.
