# Davis Writing Studio — Hub Design Brief (revised)
**Prepared:** Wed Oct 28, 2026 (America/Chicago)  
**Revised same day:** Hub is **not** a botanical brand. Botanical CSS stays Fall Case Study unit only (`/1301/` studio + Canvas week pages).  
**Scope:** Root hub (`index.html` + `hub.css`). Local preview. No GitHub push / Pages.  
**Courses:** 1301 · 1302 · 2311 · 2328

---

## 1. Clarification (Caroline)

Botanical / herbarium / forest-gold double-rule is the **Fall Case Study unit look**, not the multi-course hub. The hub must work year-round across composition, tech writing, and literature. It should feel literary, clear, and hers: rooted in Canvas course homes, her writing voice, and Florilegium, not plant plates as the main identity. A light Fall nod may sit **inside the 1301 card only** (text chip), never as hub chrome.

---

## 2. Inspiration sources (year-round)

| Source | What belongs on the hub |
|---|---|
| **Aug Canvas `home-page.html`** | Year-round course door: parchment ground `#F7F3EB`, sage `#5A7356`, terracotta `#9A5C52`, warm ink `#3C342C`, soft sage wash `#E8F0E6`, borders `#D9D2C4`, path callout, unit cards with left accent bars, plain Arial body. Spanned Monster Cards → Field Guide → later units. |
| **Florilegium** | Literary calm: Cormorant / EB Garamond display, Inter body, quiet reading-room pacing, generous space, short clear sentences. Her author-side brand without LMS chrome. |
| **Writing / comment voice baseline** | Warm, concrete, personable. Student-facing pages: literal, no figurative fluff, no dash punctuation, short leads. Path language locked. |
| **Aug Writing Studio architecture** | Hub + thin studio pages + clear weekly path. Keep structure; drop SAC blue/red Inter as the lead skin (too generic institutional). |
| **Case Study botanical (out of scope for hub brand)** | Forest `#354838` / gold `#c4a56a` / white / herbarium / Yeseva decks = unit pages only. Do not clone onto the hub. |
| **Fall 2024 botanical banner / Ghost Fairy** | Course or family side projects. Not hub brand. |

**Kathy / WTI Google Sites:** Student portfolio recoveries only. Not Caroline’s faculty hub skin.

---

## 3. What feels hers vs generic LMS

**Hers:** Warm paper field, sage + terracotta accents from her own Canvas home, literary serif titles, plain path copy, left-bar course cards, Florilegium quiet.  
**Generic:** Alamo blue/red Inter dashboard, crowded button stacks, stock “hero illustration,” plant wallpaper as site identity.

---

## 4. Preferred direction — “Warm Literary Studio”

**Pitch:** A quiet, year-round door to her four courses: parchment and sage from her Canvas home, literary type from Florilegium, clear path language in her voice. Plants stay in Fall 1301 Case Study, not on the hub.

### Palette
| Token | Hex | Why |
|---|---|---|
| Paper | `#F7F3EB` | Aug Canvas home ground |
| Card | `#FFFFFF` | Aug home cards |
| Soft wash | `#E8F0E6` | Aug path / secondary buttons |
| Sage | `#5A7356` | Aug primary actions / year-round green (not Case Study forest) |
| Sage deep | `#3D4F3A` | Eyebrows / strong links |
| Terracotta | `#9A5C52` | Aug accent (ENGL label, Monster Cards bar) |
| Ink | `#3C342C` | Aug home body |
| Muted | `#6B635A` | Aug secondary text |
| Line | `#D9D2C4` | Aug borders |
| Focus | `#5A7356` | Matches primary |
| 1301 bar | `#5A7356` | Composition (sage) |
| 1302 bar | `#4A6B7A` | Cool slate (distinct room) |
| 2311 bar | `#3C4A5C` | Technical navy-gray |
| 2328 bar | `#6B4A5C` | Literature plum (literary, not botanical) |

### Typography
- **Display:** `Cormorant Garamond` (Florilegium) → `Georgia` fallback  
- **Body / UI:** `Inter` (Florilegium + readable Canvas) → system sans  
- **Not on hub:** Yeseva One / Nunito / double-gold Georgia stacks (Case Study slide/unit brand)

### Layout
1. Light topbar (paper or soft wash), wordmark + course links, terracotta hairline  
2. Typographic hero: eyebrow, large serif title, short lead, path strip (no herbarium photo)  
3. Four course cards, 2×2, left accent bars, status chip  
4. 1301 only: optional text chip `Fall · Case Study` (no leaf icons)  
5. Quiet footer: local preview · AI Level 2  

### Copy voice
Warm and concrete. Path: Prepare in Canvas → Attend In Person → Practice in the Studio → Submit in Canvas. No Case File / Classical Argument. No figurative slogans. No dash punctuation in new sentences.

### Do / Don’t
**Do:** Separate `hub.css`. Keep `/1301/` botanical studio intact. Show “Local preview · not published.” Mobile-friendly, skip link, focus rings.  
**Don’t:** Herbarium heroes, magnolia plates, forest/gold double rules as hub chrome, plant SVGs as logo, push/Pages without OK.

---

## 5. Alternate — “Charcoal Literary” (`hub-alt.html`)

Darker charcoal header `#2C2A28`, cream body, terracotta links, same Cormorant + Inter. Closer to Florilegium “stone and quiet” without botanical art. Preferred remains the warm parchment door (closer to her live Canvas home).

---

## 6. Screenshot how-to
```bash
cd /workspace/writing-studio-preview
python3 -m http.server 8765
```
- Preferred: `http://127.0.0.1:8765/index.html`  
- Alternate: `http://127.0.0.1:8765/_design/hub-alt.html`  
- Check `/1301/` still uses Case Study botanical CSS unchanged.

---

## 7. Gaps
- Florilegium `css/styles.css` not in the public repo (fonts/copy only).  
- No dedicated Caroline faculty Google Site skin on disk (Kathy builds are student WTI).  
- 1302 week HTML on disk currently reuses botanical headers; hub still follows her Clarification and Aug home for year-round brand.
