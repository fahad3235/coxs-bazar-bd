# TEST RESULTS — coxs-bazar-bd (factory run #345, 15:00 slot, 2026-11-15)

## Unit tests — `node tests/unit.test.js`
63/63 passed, 0 failed (first run, no repairs).
- Cost maths hand-computed: defaults (2 people, 2 nights, non-AC) → group Tk 22,400, per person Tk 11,200; 3 people → group Tk 37,100, per person Tk 12,367; solo flight 1 night → Tk 21,000; invalid inputs clamp/fall back.
- Filtering: all 10 places; islands 3; beaches 4; "coral" → Inani + Saint Martin's; Bengali query "ইনানী" → 1; no-match → 0.
- Progress: 3/10 = 30%; 0-total safe; over-done clamps to 100%.
- Packing total 16 items; itineraries 10 (2-day) / 15 (3-day) items.
- Saint Martin's season: open 15 Nov 2026, 10 Jan 2027, 15 Mar 2027 (last day); closed 16 Mar 2027, 15 Jun 2026, 31 Oct 2026.
- Data integrity: 10 unique places, 4 transport modes with fares [1100, 2000, 3000, 7000], 3 seasons (exactly 1 best), 6 tips, 5 packing groups; beach 120 km; Dhaka 394 km.
- i18n: EN/BN key sets identical, all strings non-empty.

## Headless-Chrome smoke — `node tests/smoke.mjs` (headless_shell-1187, file://?asof=2026-11-15)
60/60 passed after 1 repair round (7 failures in run 1 were all test-side: case-sensitive tagline match, stale-node multi-click, and wrong expectations for the export/import round-trip state — the app was correct in each case; fixed the test, re-ran green).
- Load: title, tagline, hero facts (120 km / 394 km), Saint Martin's "running now" on 2026-11-15, 10 place cards, Himchari 12 km, Saint Martin's season note.
- Search + filters: "coral" → 2, Bengali "ইনানী" → 1, Islands → 3, All → 10, no-match empty message.
- Cost: defaults Tk 11,200 / Tk 22,400; 3 people Tk 12,367 / Tk 37,100, 2 rooms; flight for 3 Tk 24,167 / Tk 72,500; reset restores defaults; nights 0 clamps to 1 (group Tk 14,900).
- Plan: 2-day 10 items, 3 checks → "3/10 · 30%"; switch to 3-day → 15 items, checks cleared (0/15).
- Packing: 16 items, custom "Umbrella" → 17, 2 checks → "2/17", 1-char item rejected.
- Tips: 3 seasons, Nov–Feb marked best, 6 tips, rip-current warning present.
- BN toggle: Bengali tagline/tab labels, per-person ৳১১,২০০, language persisted, back to EN restores Tk 11,200.
- Export → erase → import round-trip: erase wipes custom item (16), import restores backup (EN lang, "Umbrella" custom item); garbage import rejected with message, data intact.
- Reload persistence: language EN and 17 packing items survive reload.
- Screenshots: tests/smoke-desktop.png (1280px) + tests/smoke-mobile.png (390px) — visually verified: clean layout, Bengali renders, no horizontal overflow at either size, 10 cards on mobile.
- 0 console errors, 0 page exceptions, 0 non-file network requests.

## Repairs
- 0 app repairs. 1 test-side repair round (7 expectations corrected; see above).
