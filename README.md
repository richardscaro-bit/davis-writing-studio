# Davis Writing Studio — local preview

**Status:** Published on GitHub Pages (richardscaro-bit/davis-writing-studio).

**Proposed repo slug:** `davis-writing-studio` (empty public repo may exist; this folder is the preview root).

**Brand:** Davis Writing Studio  
**Visual:** Charcoal literary Option C across the hub **and all course sections** (charcoal `#2C2A28` / cream / terracotta; Cormorant + Inter). White botanical / forest-green headers are reserved for the **Canvas Case Study pack only**, not this studio site.  
**Path language:** Soft “practice here · submit in Canvas” (not a loud Prepare→Attend→Practice→Submit slogan on section homes).  
**AI doctrine:** Level 2 (support, not composition)

## Hub layout (by course)

| Path | Course | Contents |
|------|--------|----------|
| `/` | Hub | Option C charcoal magazine collage → 1301 / 1302 / 2311 / 2328 |
| `/1301/` | ENGL 1301 | Home · Resources · Weeks · Tools · dedicated studios (Case Study, Field Guide, Monster Comparison, Facing the Unknown) |
| `/1302/` | ENGL 1302 | Eight essay studios and practice path |
| `/2311/` | ENGL 2311 | Technical & Business Writing stages |
| `/2328/` | ENGL 2328 | American Literature stages |
| `/tutor/` | Tutor | Course picker and optional stage, chat saved only in the browser. |

### ENGL 1301 subpages

- `index.html` — short course home / dashboard  
- `resources.html` — Drive packets, handouts, OER, AI Level 2  
- `weeks.html` — Practice path for any essay  
- `tools/` — thesis helper, outline, MLA, source log, peer checklist, keyword generator, and more  
- `case-study-studio.html` — live Case Study Critical Analysis workspace  
- `field-guide-studio.html` — Cultural Place Field Guide  
- `spring-monster-comparison-studio.html` — Monster Comparison (essay-first)  
- `facing-the-unknown-studio.html` — Facing the Unknown  

Shared section chrome: `_design/section-charcoal.css` (hub Option C stays in `_design/hub-charcoal-options.css`).

## Preview locally

```bash
cd /workspace/writing-studio-preview
python3 -m http.server 8765
```

Then open http://127.0.0.1:8765/

## Content shift (Oct 28)

Essay 3 is **Case Study critical analysis**. Final: 1,000–1,500 words MLA, due Sun Dec 6, 2026 11:59 p.m. CT. Outside sources: **exactly 2** beyond the packet. Studio sequence: in-class case demo → **brainstorming** → reading notes → outline/thesis → draft + peer → final. Packet Source Packets / Case Briefs are the unit readings. Student-facing UI uses full assignment titles (no A01–A05 codes). Other essay types are available in dedicated studios or Tools.

## Source

Adapted from the August Writing Studio static architecture (thin HTML shells + shared `app.js` filling `#studioPanel` + shared CSS). Lean rebuild with charcoal literary chrome; `_extracted/` holds slices from the Aug MD export for reference only.
