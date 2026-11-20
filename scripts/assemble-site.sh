#!/usr/bin/env bash
# Assemble a student-facing GitHub Pages tree.
# Usage: scripts/assemble-site.sh [destination]
# Default destination is <repo>/_site
#
# _design/ uses an explicit allowlist of runtime files. That is safer than
# an exclude list: a new draft, mockup, or note dropped into _design/ will
# not be published. The rest of the student-facing tree (course folders,
# tutor, visuals, hub files) is copied as a set, because new essays and
# tools should ship without editing this script. _notes/, README, .github,
# _tutor_proxy, and design drafts are never copied.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${1:-$ROOT/_site}"

if [[ -e "$DEST" ]]; then
  rm -rf "$DEST"
fi
mkdir -p "$DEST"

copy_tree() {
  local name="$1"
  local src="$ROOT/$name"
  if [[ ! -d "$src" ]]; then
    echo "Missing required folder: $name" >&2
    exit 1
  fi
  cp -a "$src" "$DEST/$name"
}

for dir in 1301 1302 2311 2328 tutor visuals; do
  copy_tree "$dir"
done

for f in index.html hub.css CNAME .nojekyll; do
  if [[ ! -e "$ROOT/$f" ]]; then
    echo "Missing required file: $f" >&2
    exit 1
  fi
  cp -a "$ROOT/$f" "$DEST/$f"
done

# Runtime _design files referenced by student-facing HTML, CSS, or JS.
# Inventory date: 2026-11-20, from a grep of every HTML/JS/CSS file.
DESIGN_KEEP=(
  tool-theme.css
  site-theme.css
  tool-theme.js
  section-charcoal.css
  hub-charcoal-options.css
  source-integration.js
  thesis-engine.js
  assets/mark-crown-real.jpg
  assets/mark-crown-cutout.png
  assets/dragon-1301.jpg
  assets/dragon-1302.jpg
  assets/dragon-mark-round.svg
  assets/float-dragon-1302-cutout.png
  assets/dragon-mark.svg
  assets/dragon-rule.svg
  assets/elumen-banner.jpg
)

mkdir -p "$DEST/_design/assets"
for rel in "${DESIGN_KEEP[@]}"; do
  src="$ROOT/_design/$rel"
  if [[ ! -f "$src" ]]; then
    echo "Missing runtime file: _design/$rel" >&2
    exit 1
  fi
  mkdir -p "$(dirname "$DEST/_design/$rel")"
  cp -a "$src" "$DEST/_design/$rel"
done

# Hard guards: these must never appear in the published tree.
leaked=0
for banned in _notes _tutor_proxy README.md .github scripts \
  _design/hub-alt.html \
  _design/hub-option-A.html \
  _design/hub-option-B.html \
  _design/hub-option-C.html \
  _design/hub-warm-previous.html \
  _design/icon-options.html \
  _design/icon-options-real.html \
  _design/source-home-page.html \
  _design/CHARCOAL_OPTIONS.md \
  _design/HUB_DESIGN_BRIEF.md \
  _design/SCREENSHOT_NOTES.md
do
  if [[ -e "$DEST/$banned" ]]; then
    echo "Internal path leaked into site: $banned" >&2
    leaked=1
  fi
done
if [[ "$leaked" -ne 0 ]]; then
  exit 1
fi

echo "Assembled student-facing site at $DEST"
file_count="$(find "$DEST" -type f | wc -l | tr -d ' ')"
echo "Files in site: $file_count"
