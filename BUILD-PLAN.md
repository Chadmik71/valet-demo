# Valet Demo — Build Plan

A self-contained, can't-fail **demo/pitch** build of the Valet app. Derived from the
production app at `C:\Users\Sakkh\Valet` (reference only — never pushed back there).

## Decisions (from the grill)

1. **What:** a demo/pitch instance of the Valet app (not a go-live centre).
2. **Goal:** better on all four axes — can't-fail, richer data, flashier, better collateral.
3. **Vehicle:** one self-contained standalone HTML app. `DEMO_MODE` hard-wired ON; all
   network (Supabase, ClickSend SMS, Square) stripped/short-circuited. Runs on airplane mode.
   Fully decoupled from the live `index_v2.html`.
4. **Brand:** white-label by default (neutral premium wordmark); 30-second per-prospect swap
   via the `CENTRE = {…}` block. Nothing hardcoded to Chatswood.
5. **Guided walkthrough:** coach-marks + scripted narration + Next, over the 7 pitch beats.
6. **Auto-play:** lightweight — auto-advances the guided steps with captions and loops.
7. **Hero screen:** logo, value prop, 3 counting stats (cars parked / avg pickup / monthly
   revenue), buttons: Guided / Auto-play / Explore.
8. **Data story:** peak-snapshot + true demand pattern. Live board modelled on a real busy
   Saturday (~42–55 cars); monthly report keeps the true weekday/weekend/weather-holiday
   shape; revenue shown "at $[valetFee]/car" (real recorded revenue was $0).
9. **Data scale:** grounded on real Chatswood averages (288 cars/mo, 9.3/day, wk 4.5 / wknd 19.4).
10. **Collateral:** full rebuild — one-page cheat sheet, report matching the demo data,
    Q&A refresh, management deck.
11. **Location/hosting:** `C:\Users\Sakkh\Valet-Demo`, own git repo + own GitHub Pages URL.

## Open inputs needed

- Real per-car **valet fee** (drives revenue figures).
- **White-label logo** (else generate a neutral SVG wordmark).
- **GitHub repo/org + Pages** (needs the owner's GitHub account).
- Incident photos must be non-real (neutral placeholder car images).
- Deck format (default HTML print-to-PDF).
- Optional "at your scale" projection toggle.

## Build order

1. Scaffold folder + git, copy app + assets, save plan.  ← done
2. Hard-wire DEMO_MODE; strip all network (drop Supabase CDN, vendor QR lib); verify offline.
3. White-label CENTRE + neutral logo; purge hardcoded Chatswood refs.
4. Rebuild seed: real-grounded peak-day live board + 90-day history; revenue at valetFee.
5. Hero landing screen (counting stats + 3 entry buttons).
6. Guided-walkthrough engine (coach-marks, narration, Next).
7. Auto-play layer (auto-advance + loop + captions).
8. Polish pass (transitions, counting animations).
9. Collateral: cheat sheet, matching report, Q&A refresh, deck.
10. Package for GitHub Pages + offline smoke test.

## Network strip notes (from scaffolding)

- `index_v2.html` loads `@supabase/supabase-js` from jsDelivr CDN → **drop entirely** (demo never uses Supabase).
- `ticket.html` loads `qrcode-generator` from jsDelivr CDN → **vendor locally** so the QR renders offline.
- `sw.js` cache list references the Supabase CDN + `outage.html` → simplify to local files only.
