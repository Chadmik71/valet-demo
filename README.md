# Grandview Valet — standalone pitch demo

A self-contained, **can't-fail** demo version of the Valet app, built for pitching to
shopping-centre management. White-labelled as *Grandview Valet* and fully offline — no
Supabase, no SMS, no card reader, no internet required. Derived from the production app
in `C:\Users\Sakkh\Valet` (reference only — this repo is separate and never pushed back).

## Run it

- **Locally:** open `index.html` in a browser (it redirects to the app). Works on
  airplane mode.
- **Served:** any static server, e.g. `python -m http.server`, then open the URL.

## Using it in a meeting

On load you get a branded **hero screen** with three choices:

- **▶ Start guided demo** — walks the 7 pitch beats with on-screen narration and a
  spotlight. Back/Next (or ← →), Exit anytime. You can drop out and free-drive.
- **Auto-play** — hands-free; advances on a timer, lingers on the ticket, and **loops**.
  Good for a reception screen or a leave-behind link.
- **Explore freely** — go straight into the dashboard.

The **▶ Demo** button (bottom-right) reopens the hero at any point.

The 7 beats: check-in + SMS ticket → the guest ticket (live QR) → hands-free bags →
pickup on an SLA → live dashboard → demand intelligence (volume vs weather/holidays) →
risk handled (check-in photos + logged/acknowledged damage).

All on-screen data is **sample data** (badged), sized to a realistic flagship-centre
pattern. Revenue is shown at a **$20/car** valet fee plus time-based parking.

## White-label swap (≈30 seconds per prospect)

Everything centre-specific is in one place — open `index_v2.html`, find `const CENTRE =`:

```js
const CENTRE = {
  name: 'Grandview',           // used everywhere as "<name> Valet"
  address: '…', phone: '…', geo: { lat, lon },
  valetFee: 20,                // drives the revenue figures
  logoMaroon: 'logo-demo.svg', // swap this SVG for the prospect's wordmark
  …
};
```

Replace `logo-demo.svg` with a prospect wordmark and change `name` — the title, hero,
ticket, key tags, reports and the guided narration all follow.

## Collateral (print → Save as PDF)

- `pitch-cheatsheet.html` — one-page talk track + anticipated Q&A.
- `pitch-deck.html` — management deck (one slide per page).
- `pitch-report.html` — sample monthly report. (In the app, **Reports → Monthly
  Calendar → PDF** exports the exact month you just showed.)

## Deploy to GitHub Pages (own URL, for the leave-behind link + booth loop)

1. Create a **new, empty** GitHub repo (its own, separate from the production repos).
2. From this folder:
   ```bash
   git add -A
   git commit -m "Grandview Valet standalone demo"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
3. Repo → **Settings → Pages → Source: Deploy from a branch → `main` / root**.
4. Wait ~30–60s; open the Pages URL. The root `index.html` redirects into the app.

`.nojekyll` is included so all assets publish. Nothing here contains live credentials.

## What's NOT in here (by design)

No backend, no Supabase keys, no SMS/Square integration, no service worker, no real
customer data — so it cannot call out, cannot break on stage, and cannot leak anything.
