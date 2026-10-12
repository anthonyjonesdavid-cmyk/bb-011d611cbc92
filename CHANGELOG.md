# Changelog
## v3.6 — 2026-10-12
- Status bar: switched to black-translucent; the header now paints one flat solid band from the very top of the screen (through the clock area) to its bottom border, same color as <html> background and theme-color.
- Header colors per theme so white iOS status text stays readable: Light = deep brown (#5b2b26) with cream title/gold icons; Sepia = dark umber (#4d3926); Night = near-black (#171412). Content area themes unchanged.
- Header title: plain solid color, no font-smoothing override, no shadows/filters. Manifest theme_color updated.
- SW cache yb-v10. NOTE: delete and re-add the Home Screen icon to pick up the new status-bar style.
## v3.5 — 2026-10-12
- Top of screen: status-bar area now paints the same solid bar color as the header in every theme (page background + theme-color follow theme; theme class on <html>), no blur/opacity/shadows on header; title in full-strength ink with crisp font smoothing.
- Home cover: removed the large repeated title; compact stars + dedication + "The Holy Bible · King James Version".
- Night toggle: emoji replaced by line-drawn sun/moon SVG icons in bar color.
- SW cache yb-v9.
## v3.4 — 2026-10-12
- Fix: tab bar no longer covered when the Text panel (or any card) opens. Sheets now sit above the tab bar; A stays gold while open; tapping A again closes it; tapping another tab closes it and navigates.
- Tab bar stays visible on every screen (reading with stacked reading bar, chapter grid, egg card). On iPhone it hides only while typing in Search (keyboard up) and returns on dismiss.
- SW cache yb-v8.
## v3.3 — 2026-10-12
- Bottom bar: text labels replaced by original inline-SVG line icons (house, open book, magnifier, heart, letter A) with aria-labels; 56px tall.
- Active tab shown in Easter-egg gold with a soft gold tint, in all themes; reading/chapter screens mark Books; Text tab lights while the Text panel is open.
- SW cache yb-v7.
## v3.2 — 2026-10-12
- Play button is now a plain icon in the bar's text color (like Prev/Next), no outline or tint; 56px invisible tap area. Playing shows the pause icon in the soft red accent.
- SW cache yb-v6.
## v3.1 — 2026-10-12
- Play button restyled to blend into the reading bar: transparent with thin outline in theme color (52px); playing state = pause icon + soft accent tint. Text-style play glyph (no emoji rendering).
- Text panel: gentle one-time hint (dismiss with "Got it") with the iPhone Settings path when no Enhanced/Premium voice is installed; no popups.
- SW cache yb-v5.
## v3 — 2026-10-12
- Read aloud (Web Speech API, on-device voices): big play/pause button in the reading bar; verse-by-verse with highlight + auto-scroll; tap a verse while playing to jump; optional continue into next chapter.
- Speeds Slow 0.75 / Gentle 0.9 (default) / Normal 1 / Quick 1.25; voice picker preferring Premium/Enhanced en-US/en-GB; sample button; how-to for downloading better iOS voices.
- iOS handling: starts from a tap, one utterance per verse, pause = cancel + restart from current verse, stops on navigation/backgrounding, Screen Wake Lock while playing. LORD read as "Lord"; verse numbers, markup skipped.
- SW cache yb-v4.
## v2 — 2026-10-12
- Night theme (near-black, warm dim text, softened red letters, dimmed gold hearts, photos dimmed) replaces Dark; one-tap moon/sun toggle in the top bar on every screen; Auto option follows iPhone dark mode. Bars and theme-color match.
- Home: Begin/Continue buttons removed; book list (Old/New Testament) shown under Today's Verse; subtle "Continue: Book N ›" link when there's a saved spot.
- SW cache yb-v3.
## v1 — 2026-10-12
- Yvonne's Bible: KJV (eBible.org eng-kjv USFM, public domain) with red-letter words of Jesus (\wj), italics for translator-added words, LORD styling, Psalm titles. 66 books, 31,102 verses, per-book JSON lazy-loaded.
- iPhone-first: opaque top bar, bottom tab bar (Home, Books, Search, Saved, Text), Prev/Next bar while reading, swipe to turn chapters, 44px+ tap targets.
- Cover "Yvonne's Bible" with dedication placeholder, Continue reading, daily verse.
- Text size 16–44px (default 24), Light/Sepia/Dark.
- Search by words or reference ("John 3:16"); tap a verse to highlight/save.
- Easter eggs from eggs.json (gold heart marker, photo + note card); option to hide hearts. 3 placeholder eggs.
- PWA: installable, service worker precaches all text for offline; noindex + robots disallow.
