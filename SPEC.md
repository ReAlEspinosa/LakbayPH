# LakbayPH — engineering spec

Working rules and audit-verified facts for this repo. Structured after the
`lakbay-build` skill's spec: verified facts first, then invariants, then the
open blocker list.

**This repo is not the Lakbay mobile app and not the Lakbay production web
app.** Those are `D:\Lakbay-Mobile_VS` (Expo) and `D:\Lakbay-PH\web`
(Next.js 16, deployed as the Vercel project `lakbay-ph`, linked to the GitHub
repo `ReAlEspinosa/lakbay-ph`). This repo — `realespinosa/lakbayph` — is a
separate Vite SPA and must get its own Vercel project. Do not deploy it into
`lakbay-ph`; that would overwrite the live site.

## Rule zero: verify, never assume

State nothing about this codebase from documentation, filenames, comments, or
memory. Verify with a command and cite the file and line. If you cannot verify
something, write **UNVERIFIED** and say what you would need to check it.

This spec ages. Re-verify anything you are about to depend on.

## Verified architecture

Confirmed against the repo at the commit that introduced this file.

**Stack:** Vite 8.0.16, React 19.2.7, react-router-dom 7.17.0, Tailwind CSS
3.4.19, `lucide-react` icons. JavaScript throughout — every source file is
`.jsx` or `.js`. No backend, no Supabase client, no network calls of any kind
at runtime beyond the Google Fonts stylesheet in `index.html`.

**Two apps share one bundle.** `src/App.jsx:18` reads the pathname and
short-circuits to `<FitnessApp />` before `<Routes>` is ever rendered, so
`/fitness` is *not* a registered route. The other ten `<Route>` entries make up
the travel site (`/`, `/discover`, `/destination/:id`, `/planner`, `/bookings`,
`/community`, `/roadside`, `/profile`, and a `*` catch-all).

**Travel-site data is entirely mock JSON** under `src/data/`: 13 destinations,
6 accommodations, 4 providers, 5 users. Nothing is fetched; nothing is written.

**Fitness storage is local-only.** IndexedDB database `LakbayFitness` v1
(`src/fitness/db.js`) with three object stores — `workouts`, `exercises`,
`bodyWeight`. 28 default exercises are seeded on first open. The in-progress
workout draft lives in `localStorage` under `lakbay-fitness:active-workout`.
There is no sync, no account, and no server copy: **if the user clears site
data, the data is gone.**

**PWA:** `public/manifest.json` (`start_url: /fitness`, standalone, portrait)
plus `public/sw.js`. The service worker is registered from `src/App.jsx` in
production builds only.

**Deployment:** static Vite build to `dist/`. `vercel.json` supplies the SPA
catch-all rewrite that client-side routing requires — Vercel's Vite preset does
not add one, and without it every deep link, `/fitness` included, returns 404.

**Verification gate:** `npm run build`, then `npm run preview` and
`npm run test:e2e` — the latter drives the real fitness flow in Chromium
(seeding, logging a set, the rest timer, draft restore across a reload, the
discard guard, save, stats) and exits non-zero on failure. There is **no linter
and no CI** — no `.github/`, no ESLint config. `tsconfig.json` exists but is
inert: `checkJs` is off and there are zero `.ts` files, so `tsc` certifies
nothing. `screenshot-test.cjs` is a manual screenshot script for the travel
site, not a test.

**Bundle:** one chunk, ~414 kB raw / ~119 kB gzip. No code splitting — the
travel site and the fitness app ship to every visitor of either.

## Invariants — do not violate these

**1. Local storage is the only copy.** Every write path must either succeed or
tell the user it failed. There is no server to reconcile against and no undo.

**2. No silent failure.** A `console.error` alone is a bug, not error handling.
Every mutation surfaces a user-visible error or reverts its optimistic state.
Both, ideally. The IndexedDB open path must never leave the app spinning on
"Loading…" — storage can be unavailable outright in private browsing.

**3. Never lose an in-progress workout.** Mobile browsers evict backgrounded
tabs without warning, and the phone locks mid-set. The active workout is
autosaved on every change and restored on load. Any change to
`ActiveWorkoutView` keeps that property.

**4. Destructive actions are confirmed.** Discarding a workout and deleting a
saved one both cost real user effort. Never wire either to a bare tap.

**5. Assume a bad network, then assume none at all.** Offline is the designed
state, not the edge case. The service worker serves navigations network-first
with a 3s timeout and falls back to the cached shell; assets are cache-first on
Vite's content hashes. Never cache-first an HTML document — that strands users
on a stale `index.html` pointing at asset hashes the next deploy deleted.

**6. Timers are derived from wall-clock deadlines, never from tick counts.**
Browsers throttle `setInterval` hard once the screen locks. A workout timer
that silently loses ten minutes is worse than no timer.

**7. Do not deploy this repo into the `lakbay-ph` Vercel project.** See the note
at the top.

## Open items

Raised once, then the user's call. None of these block the current deploy.

- **No code splitting.** A visitor to `/` downloads the entire fitness app and
  vice versa. `React.lazy` on the `/fitness` branch is the obvious fix.
- **No analytics and no error reporting.** Unlike the mobile repo, Sentry is not
  wired here. Any production JS error is invisible.
- **No export or backup path.** Invariant 1 says local storage is the only copy;
  there is currently no way for a user to get their data out. A JSON export is
  cheap insurance.
- **`tsconfig.json` is inert** (see above). Either enable `checkJs` or delete it
  rather than leaving a gate that certifies nothing.
- **Test coverage is end-to-end only** (`fitness-e2e.cjs`) and needs a running
  preview server. There are no unit tests around `db.js`, and the travel site is
  uncovered.
- **No CI.** Nothing runs the build or the e2e suite on push.
- **Travel site is a mock throughout.** Every page reads static JSON. Treat it
  as a design prototype, not a product surface, until told otherwise.

## How to work on this

**Scope tightly.** One concern per change; the user is solo and needs reviewable
diffs. Do not refactor adjacent code while fixing a bug.

**Wire the error branch in the same edit** as any storage call. Not as a
follow-up.

**Verify in a browser, not just in the build.** `npm run build` passing proves
nothing about behaviour. Drive the real flow — start a workout, log a set,
reload mid-workout, finish — before claiming a fix works.

**Prefer the smallest fix that holds.** Ship, then improve.
