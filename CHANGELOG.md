# Changelog
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
