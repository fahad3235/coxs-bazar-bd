# Cox's Bazar BD — Travel Guide & Trip Planner

Offline bilingual (English / বাংলা) travel guide and trip planner for **Cox's Bazar, Bangladesh** — home of the world's longest natural sea beach (~120 km). Plan the trip, know the cost, pack right. No internet needed, no account, no tracking.

Built by the Muse Project Factory (run #345, 15:00 slot, 2026-11-15).

## Features

- **Places guide** — 10 places (Laboni, Sugandha, Kolatoli, Himchari, Inani, Marine Drive, Moheshkhali, Sonadia, Saint Martin's, Burmese Market) with distance from town, best time to visit, and a short description in both languages. Live EN+BN search and category filters (Beaches / Nature / Drive / Islands / Market).
- **Trip cost estimator** — transport mode (non-AC / AC / AC sleeper bus / flight, with late-2026 fare ranges), people, nights, hotel per room, food, local travel and activities. Round trip included; rooms calculated as 1 per 2 people. Shows per-person total, group total, and a full breakdown.
- **Day-by-day plans** — ready 2-day and 3-day itineraries with checkable steps and a progress bar (checks saved on your device; switching plans clears checks).
- **Packing checklist** — 16 items in 5 groups (Documents, Clothes, Beach, Health & safety, Money & tech), plus your own custom items, with progress.
- **Know before you go** — best season (Nov–Feb), safety tips (rip currents, no swimming after dark), and a live Saint Martin's ship-season banner (ships run 1 Nov – 15 Mar).
- **EN / বাংলা toggle** — persisted, with Bengali digits throughout in BN mode.
- **Your data stays yours** — everything in localStorage; JSON export / import with strict validation and a typed-DELETE erase-all.

## Stack

- Plain HTML + CSS + JavaScript, zero dependencies, zero network requests.
- `js/data.js` — places, itineraries, packing list, seasons, tips (EN+BN).
- `js/core.js` — pure logic (cost maths, filtering, progress, season check) — Node-testable.
- `js/i18n.js` — UI strings (EN+BN).
- `js/app.js` — UI wiring and localStorage persistence.

## Prerequisites

Any modern browser. For tests: Node.js 20+ and the cached headless-Chrome shell used by the smoke test (see Testing).

## Install & run

```bash
# just open it — no build step
open index.html
# or serve locally
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Dev commands

```bash
node tests/unit.test.js   # Node unit tests (core logic + data integrity)
node tests/smoke.mjs      # headless-Chrome smoke test (loads file://, drives the UI)
```

## Environment

No environment variables, no API keys, no backend. All data is static and local.

## Testing

- **Unit:** 63/63 passed — cost maths (hand-computed totals), filtering (EN+BN), progress, Saint Martin's season dates, input validation, data integrity, i18n key parity.
- **Smoke (headless Chrome, 1280px + 390px):** 60/60 passed — load, search (EN+BN), category filters, cost estimator (defaults Tk 11,200/person, Tk 22,400 group; 3 people Tk 12,367/person; flight totals), 2-day/3-day plans with progress, packing (16 items + custom add, 1-char rejection), seasons/tips, BN toggle with Bengali digits, export → erase → import round-trip, bad-import rejection, reload persistence, screenshots at both sizes, 0 console/page errors, 0 non-file network requests.

## Facts & sources

- Beach ~120 km, world's longest natural sea beach; Dhaka → Cox's Bazar ~394 km via N1, 9–12 h by bus.
- Bus one-way (late 2026): non-AC Tk 800–1,200; AC Tk 1,400–2,500; sleeper Tk 2,500–3,500.
- Marine Drive ~80 km (Cox's Bazar → Teknaf); Himchari ~12 km from Kolatoli; Inani ~13 km further.
- Saint Martin's ship season 1 Nov 2026 – 15 Mar 2027 (ships from Nuniyarchhara ghat).

Sources checked 2026-11-15: unseenbangladesh.com (3-day trip plan, updated 2026-10-25), gojatra.com (bus schedule & fares), thetravelerbd.com, masterasish.com (2026–27 guide).

## Limitations

- **Prices are planning ranges, not live rates.** Bus, hotel and ship prices change — confirm with the operator before booking. The app says so on the cost tab, in the tips, and in the footer.
- Offline by design: it cannot check live bus/flight/ship availability or weather.
- Saint Martin's banner is date-based (season window), not a live sailing status — check the ship operator on the day.
- Distances are approximate road distances, not GPS.

## Status

Complete MVP. No known issues.
