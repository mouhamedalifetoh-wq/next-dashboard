# VERIFICATION.md

Living log of what was actually run. Status is **PASS** only when the command ran and the result was observed. **NOT RUN** means it has not been attempted yet. Nothing is marked PASS from assumption.

Environment: macOS (Darwin 27.2.0), Node v26.3.1, pnpm 12.18.0. Installed (current): next 16.4.5, react 19.3.1, tailwindcss 3.4.17, next-auth 5.0.0-beta.25, eslint 10.14.0. (Phase 0 originally installed next 16.0.10 / react 19.2.0; see 1.9.)

## Phase 0: Setup

| # | Check | Command | Result | Status |
|---|---|---|---|---|
| 0.1 | Scaffold official starter | `npx create-next-app@latest . --example ".../dashboard/starter-example" --use-pnpm` | Files downloaded; the tool's own install step crashed with `spawn ENOEXEC`. | PARTIAL (files OK, auto-install FAIL) |
| 0.2 | Install dependencies | `pnpm install` | First run stopped with `ERR_PNPM_IGNORED_BUILDS` (bcrypt, sharp). | FAIL |
| 0.3 | Allow the two build scripts the starter already lists | `pnpm approve-builds bcrypt sharp`, then `pnpm install` | bcrypt native binding downloaded, sharp built, lockfile up to date. | PASS |
| 0.4 | Next.js is 16.x (so `proxy.ts`, not `middleware.ts`) | `node -e "require('next/package.json').version"` | `16.0.10`. Newer 16.4.5 exists but the starter's `minimumReleaseAge: 2880` (2 days) held it back. | PASS |
| 0.5 | `.env` is git-ignored | read `.gitignore` | `.env` and `.env*.local` are listed. No `.env` exists yet. | PASS |
| 0.6 | Git state | `git status` | Not a git repository. Nothing committed or pushed. | PASS (as intended) |

## Chapters 1-3

| # | Check | Command | Result | Status |
|---|---|---|---|---|
| 1.1 | Type-check | `pnpm exec tsc --noEmit` | exit 0, no errors | PASS |
| 1.2 | Production build | `pnpm build` | "Compiled successfully", 5 static pages generated, routes: `/`, `/_not-found` static; `/query`, `/seed` dynamic. Exit code was not captured by my command (pipe), but the output finished normally with no errors. Warnings: stale browserslist and baseline-browser-mapping data. | PASS (exit code not captured) |
| 1.3 | Lint (before ESLint was added) | `pnpm run lint` | `Missing script: lint`. The course starter has no ESLint and no lint script. | FAIL (resolved by 1.9) |
| 1.4 | Home page serves | `pnpm start`, `curl /` | HTTP 200 | PASS |
| 1.5 | Inter on body, `antialiased` class | curl HTML and browser computed style | body class includes `antialiased`; computed `font-family: Inter, "Inter Fallback"` | PASS |
| 1.6 | Lusitana on welcome paragraph | browser computed style | `Lusitana, "Lusitana Fallback"` | PASS |
| 1.7 | Hero images swap by width | browser at default width and at 375px | default: desktop image shown, mobile hidden; 375px: desktop hidden, mobile shown | PASS |
| 1.8 | Acme logo renders | screenshot | logo visible in the blue banner | PASS |

### ESLint added (your approval; not part of the official course)

| # | Check | Command | Result | Status |
|---|---|---|---|---|
| 1.9 | Add ESLint | `pnpm add -D eslint eslint-config-next`; new `eslint.config.mjs`; script `"lint": "eslint ."` | eslint 10.14.0, eslint-config-next 16.4.5 (peer range `eslint >=9` allows it). Side effect: the starter's `"next": "latest"` and `"react": "latest"` re-resolved, so **next is now 16.4.5 and react 19.3.1** (was 16.0.10 / 19.2.0). Still Next 16, so `proxy.ts` applies. | PASS |
| 1.10 | Lint, first run | `pnpm run lint` | 1 error (`require()` in the course's `tailwind.config.ts`), 17 warnings | FAIL |
| 1.11 | Lint, after exempting `tailwind.config.ts` from `no-require-imports` in the ESLint config (course file untouched) | `pnpm run lint; echo $?` | exit 0, **0 errors, 17 warnings**. All warnings are unused names in course stub files (`revenue-chart.tsx`, `buttons.tsx`, `pagination.tsx`, `login-form.tsx`) that later chapters fill in. | PASS (warnings expected to fall as chapters land) |
| 1.12 | Type-check on new versions | `pnpm exec tsc --noEmit; echo $?` | exit 0 | PASS |
| 1.13 | Production build on new versions | `pnpm build; echo $?` | exit 0, "Compiled successfully", same route table (`/` and `/_not-found` static; `/query`, `/seed` dynamic) | PASS |

| 1.14 | Pin `next`, `react`, `react-dom` to exact versions | edit `package.json` (16.4.5 / 19.3.1 / 19.3.1), `pnpm install`, then `pnpm run lint; pnpm exec tsc --noEmit; pnpm build` | Lockfile already matched. lint exit 0, tsc exit 0, build exit 0. | PASS |

Browser checks 1.4-1.8 were repeated on the new versions in checks 2.7 below (fonts, antialiased, hero swap at default width and 375px: all as before).

## Chapters 4-5

| # | Check | Command | Result | Status |
|---|---|---|---|---|
| 2.1 | Lint | `pnpm run lint; echo $?` | exit 0, 0 errors, 17 warnings (same unused-name warnings from later-chapter stubs; no new ones) | PASS |
| 2.2 | Type-check | `pnpm exec tsc --noEmit; echo $?` | exit 0 | PASS |
| 2.3 | Production build | `pnpm build; echo $?` | exit 0. Routes now include static `/dashboard`, `/dashboard/customers`, `/dashboard/invoices` | PASS |
| 2.4 | Routes respond | `curl` against `pnpm start` | `/`, `/dashboard`, `/dashboard/invoices`, `/dashboard/customers` all HTTP 200 | PASS |
| 2.5 | Client-side navigation (no full reload) | browser: set `window.__marker`, click sidenav links, re-read marker | Marker survived Home to Invoices to Customers, so the page did not reload; content changed to "Invoices Page" / "Customers Page" | PASS |
| 2.6 | Active link highlight | browser: find links with `bg-sky-100 text-blue-600` per route | Exactly one active link, matching the URL, on each of the three routes; screenshot shows Customers highlighted | PASS |
| 2.7 | Re-run of 1.4-1.8 on Next 16.4.5 | browser computed styles | body `Inter`, paragraph `Lusitana`, `antialiased` present; desktop hero shown / mobile hidden at default width; reversed at 375px | PASS |

Note: `/dashboard` is reachable without logging in. That is expected until chapter 14; the route-protection checks stay **NOT RUN** until then.

## Chapter 6 (database connected)

| # | Check | Command | Result | Status |
|---|---|---|---|---|
| 3.1 | Lint, type-check, build after seed hardening | `pnpm run lint; pnpm exec tsc --noEmit; pnpm build` (exit codes captured) | lint 0 (0 errors, 16 warnings), tsc 0, build 0 | PASS |
| 3.2 | Production, `SEED_TOKEN` set, no header | `curl /seed` against `pnpm start` | 404 | PASS |
| 3.3 | Production, wrong header value | `curl -H 'x-seed-token: wrong' /seed` | 404 | PASS |
| 3.4 | Production, correct token sent in the URL query | `curl "/seed?token=<token>"` | 404 (query strings are ignored, header only) | PASS |
| 3.5 | Production, correct header, database unreachable (fake URL) | `curl -H "x-seed-token: <token>" /seed` | 500 with body `{"error":"Seeding failed"}` | PASS |
| 3.6 | No secret leaks on failure | grep response body and server log for the token, the fake DB password and the fake DB host | 0 matches in both. Log line is only `Seed failed: Error` | PASS |
| 3.7 | Production, `SEED_TOKEN` not set | `curl /seed` with and without a header | 404 both times (endpoint disabled) | PASS |
| 3.8 | Development, `SEED_TOKEN` not set (course behaviour) | `pnpm dev`, `curl /seed` with fake DB URL | Reaches the database layer, 500 `{"error":"Seeding failed"}`, no password in dev log | PASS |
| 3.9 | `.env` is ignored by git | read `.gitignore` | `.env` listed. **Not tested with `git check-ignore`: no git repository exists yet.** Re-test when git is initialised, before any commit | PARTIAL |
| 3.10 | Successful seed against the real Neon database | `pnpm dev`, `curl /seed` | 200 `{"message":"Database seeded successfully"}` | PASS |
| 3.11 | Seed runs only once | second `curl /seed` | 410 `{"message":"Database already initialized"}`. Row counts afterwards (direct SQL via `node --env-file=.env`): users 1, customers 6, invoices 13, revenue 12; 0 duplicate invoice groups. Sample user password is a 60-char `$2b$` bcrypt hash, not plaintext | PASS |
| 3.12 | Course `/query` check | uncommented per chapter 6, `curl /query` | 200 `[{"amount":666,"name":"Evil Rabbit"}]` (the join works) | PASS |
| 3.13 | Remove the open `/query` endpoint | `rm -r app/query`, `curl /query` | route gone; production build route table no longer lists it; `/query` returns 404 | PASS |
| 3.14 | Seed guard in production against the real database (throwaway token, never printed) | `pnpm start`, curl: no header / token in URL / correct header | 404 / 404 / 410 (correct token reaches the lock and is refused as already initialized) | PASS |
| 3.15 | No token or DB URL in logs | grep dev log and server log for the token, `neon.tech`, `postgres://` | 0 matches | PASS |
| 3.16 | Final checks after deleting `/query` | `pnpm run lint; pnpm exec tsc --noEmit; pnpm build` | lint 0 (0 errors, 16 warnings), build 0. **tsc first returned 2** because stale generated types in `.next/types/validator.ts` still referenced the deleted route; after the build regenerated them, tsc returned 0. Cause was a stale cache, not a source error | PASS (after build) |

Notes: the test token was a throwaway generated in the shell, never printed or stored. The test database URL was fake.

## Chapter 7

| # | Check | Command | Result | Status |
|---|---|---|---|---|
| 4.1 | Lint | `pnpm run lint; echo $?` | exit 0, 0 errors, 9 warnings (down from 16; remaining are later-chapter stubs) | PASS |
| 4.2 | Type-check | `pnpm exec tsc --noEmit; echo $?` | exit 0 | PASS |
| 4.3 | Production build against the real database | `pnpm build; echo $?` | exit 0; `/dashboard` prerendered as static; `/seed` dynamic | PASS |
| 4.4 | Dashboard numbers equal the database | direct SQL via `node --env-file=.env` vs text read from the rendered page | Collected $1,006.26, Pending $1,256.32, 13 invoices, 6 customers: identical. Latest 5 invoices (Michael Novotny, Delba de Oliveira, Balazs Orban, Lee Robinson, Evil Rabbit) in the same order | PASS |
| 4.5 | Chart and images | browser DOM | 12 revenue bars, y-axis $0K-$5K, 5 customer avatars loaded (`naturalWidth > 0`) | PASS |
| 4.6 | Page is statically prerendered (the course's warning) | `curl -I /dashboard` | `x-nextjs-prerender: 1`, `x-nextjs-cache: HIT`, `Cache-Control: s-maxage=31536000`. So the dashboard shows build-time data. Chapter 8 addresses this | PASS (confirms known behaviour) |
| 4.7 | Request waterfall vs parallel | same 3 read-only queries, 5 runs, `performance.now()` | Sequential 557, 554, 562, 557, 560 ms. Parallel 186, 193, 188, 188 ms after one cold first run of 1707 ms (extra connections opening). About 3x faster once warm | PASS |
| 4.8 | Database failure | `pnpm dev` with a fake URL and fake password, `curl /dashboard` | HTTP 500; fake password in HTML 0 times and in server log 0 times; log shows `Database Error: ECONNREFUSED 127.0.0.1:1` | PASS |

Visual note: in the browser pane the page background rendered dark with low-contrast headings. The course sets no page background or `color-scheme`, so this is probably the pane's dark theme. Not investigated further; to be re-checked in a light-themed browser before final sign-off.

## Pre-chapter-8 checks

| # | Check | Command | Result | Status |
|---|---|---|---|---|
| 5.1 | Database connection works with the rotated credentials | `node --env-file=.env` script: connect, `SELECT 1`, row counts. No env values printed | connected; counts unchanged: users 1, customers 6, invoices 13, revenue 12. Round trip 2559 ms (includes TLS handshake and cold start) | PASS |
| 5.2 | `.env` is git-ignored | `git check-ignore -v` using a throwaway bare repo outside the project with `--work-tree` pointed at the project (so no `.git` was created here) | `.gitignore:29:.env  .env`. `.env.example` and source files are not ignored. `.env` file mode is 600 | PASS |
| 5.3 | Env values never printed | only variable names, lengths-free boolean checks and counts were output | no value appeared in any output this session | PASS |
| 5.4 | Chapters 1-7 files intact | listed `app/` tree | `app/dashboard/*`, `app/lib/*`, `app/ui/*`, `app/seed` all present | PASS |

## Chapter 8

Official material: explanation of static vs dynamic rendering, plus one code change: uncomment the artificial 3-second delay and logs in `fetchRevenue` (`app/lib/data.ts`, now lines 19-24). Nothing else changed.

| # | Check | Command | Result | Status |
|---|---|---|---|---|
| 6.1 | Lint | `pnpm run lint; echo $?` | exit 0, 0 errors, 9 warnings (unchanged) | PASS |
| 6.2 | Type-check | `pnpm exec tsc --noEmit; echo $?` | exit 0 | PASS |
| 6.3 | Production build | `pnpm build; echo $?` | exit 0, took 11 s (includes one 3 s delay). Route table unchanged: `/dashboard` is `○ (Static)` | PASS |
| 6.4 | Course experiment in development | `pnpm dev`, `curl -w %{time_total} /dashboard` x3 | 3.70 s, 3.63 s, 3.71 s. Server log shows "Fetching revenue data..." and "Data fetch completed after 3 seconds." (4 of each, including the warm-up request). Whole page blocked by the slowest fetch | PASS |
| 6.5 | Other pages not slowed | `curl /dashboard/invoices` in dev | 0.15 s | PASS |
| 6.6 | Same experiment in a production build | `pnpm start`, `curl /dashboard` x3 | 0.023 s, 0.002 s, 0.001 s; **zero** "Fetching revenue data" lines in the server log. The 3 s delay was paid once during `pnpm build`; requests get frozen HTML | PASS (**finding**) |

**Finding from 6.6:** the course says "the dashboard application we're building is dynamic", but in this app, in production, `/dashboard` is static and shows build-time data. It is dynamic only under `pnpm dev`. It will become dynamic when chapter 14 adds `auth()` checks in the data layer (reading the session cookie opts the page into dynamic rendering). That must be re-verified then: the build table must show `/dashboard` as `ƒ` and a data change must appear without a rebuild. I did not add `force-dynamic` now because the course does not.

## Chapter 9

Official material followed: `loading.tsx` with `DashboardSkeleton`, route group `(overview)`, Suspense around the revenue chart and latest invoices (fetches moved into the components), cards grouped in `CardWrapper` inside one Suspense.

| # | Check | Command | Result | Status |
|---|---|---|---|---|
| 7.1 | Lint | `pnpm run lint; echo $?` | exit 0, 0 errors, 9 warnings | PASS |
| 7.2 | Type-check, first attempt | `pnpm exec tsc --noEmit` | **exit 2**: stale generated types in `.next/types` and `.next/dev/types` still pointed at the old `app/dashboard/page.tsx` | FAIL (cause: stale cache) |
| 7.3 | Production build, first attempt | `pnpm build` | **exit 1**, same stale `.next/dev/types/validator.ts` error (tsconfig includes `.next/dev/types`, written earlier by `next dev`). Not a source error | FAIL (cause: stale cache) |
| 7.4 | After `rm -rf .next` (git-ignored build cache) | `pnpm build; pnpm exec tsc --noEmit; pnpm run lint` | build 0, tsc 0, lint 0. Route table unchanged: `/dashboard` `○`, `/seed` `ƒ`. No `(overview)` in any URL | PASS |
| 7.5 | Time to first byte (dev, 3 s delay still on) | `curl -w %{time_starttransfer}` x3 | ttfb 0.033, 0.040, 0.031 s (was about 3.7 s for the whole page in chapter 8). Total about 3.2 s, since the chart still waits for its 3 s fetch | PASS |
| 7.6 | First chunk contains shell, not data | `curl --max-time 1.2` then grep | 74,785 bytes already received: sidebar present, shimmer skeleton present, 0 chart bars | PASS |
| 7.7 | Finished stream is complete | full `curl` | 85,129 bytes; chart bars present (matches appear twice in the HTML because streamed content is also embedded in the RSC payload); latest invoices and cards present | PASS |
| 7.8 | Route group isolates `loading.tsx` | `curl /dashboard/invoices`, `/dashboard/customers`, `/dashboard/(overview)` | invoices page shows "Invoices Page" and has 0 dashboard shimmer skeletons; customers 200; `/dashboard/(overview)` 404 | PASS |
| 7.9 | Production output unchanged | `pnpm start`; `curl -I`; browser DOM | still prerendered (`x-nextjs-prerender: 1`, `s-maxage=31536000`), 2 ms response. Page shows Collected $1,006.26, Pending $1,256.32, 13 invoices, 6 customers, 12 bars, the same 5 latest invoices, 0 skeletons left | PASS |

Note on 7.9: streaming's visible benefit appears only when rendering is dynamic. In the current production build the page is static, so users see no skeleton at all. This is the same open finding as chapter 8 (00b).

## Chapter 10

Official material followed: invoices page with `searchParams`, `<Search>` using `useSearchParams` / `usePathname` / `useRouter` and `useDebouncedCallback` (300 ms), page reset to 1 on search, `fetchInvoicesPages` + `<Pagination>` with `createPageURL`. `use-debounce` was already in `package.json`, so no dependency was added.
One addition not in the course: input sanitising in `app/dashboard/invoices/page.tsx` (see 8.7-8.9).

| # | Check | Command | Result | Status |
|---|---|---|---|---|
| 8.1 | Lint, type-check, build (final code) | `pnpm run lint; pnpm exec tsc --noEmit; rm -rf .next; pnpm build` (exit codes captured) | lint 0 (0 errors, **5 warnings**, down from 9: unused `sql` param in seed route, `CustomersTableType`, two `id` params in `invoices/buttons.tsx`, `ExclamationCircleIcon` in login form; all belong to later chapters), tsc 0, build 0 | PASS |
| 8.2 | Route is now dynamic | build route table | `/dashboard/invoices` is `ƒ`; `/dashboard` is still `○` (known, see 00b) | PASS |
| 8.3 | Search results equal the database | 10 (query, page) combinations against `pnpm start`; expected rows computed by direct SQL with the same `ILIKE` conditions | all 10 identical, same rows in the same order: `""` pages 1-3 (6, 6, 1 rows), `lee` 2, `paid` 6, `pending` 5, `2022` 4, `666` 1, `evil` 2, no-match 0 | PASS |
| 8.4 | Total page count equals SQL | page links in HTML vs `ceil(count/6)` | matches (3 pages unfiltered, 2 for `paid`, 1 for the rest) | PASS |
| 8.5 | Debounce, URL sync, page reset (browser) | start at `?page=2`, type "lee" | exactly **1** URL replace for 3 keystrokes: `?page=1&query=lee`; no full reload (window marker survived); only Lee's 2 invoices shown | PASS |
| 8.6 | Pagination clicks and URL to input sync (browser) | click page 3; load `?query=paid&page=2` fresh | URL becomes `?page=3`, no reload, 1 visible row (6 before); fresh load fills the input with "paid" and shows 2 rows with page 2 active; right arrow disabled on the last page | PASS |
| 8.7 | **Malformed input, course code as written** | 17 hostile URLs against the first build | `page=-1`, `page=-5`, `page=99999999999999999999` each logged a database error (invalid OFFSET) and rendered no rows; `?query=a%00b` (NUL byte) returned **HTTP 500** | FAIL |
| 8.8 | After my sanitising fix (first version) | same 17 URLs | the three page cases and the NUL case fixed, but `?query=lee&query=evil` now returned **HTTP 500**: repeated parameters arrive as arrays at runtime and my `.replaceAll` threw. I introduced this regression | FAIL (my bug) |
| 8.9 | After accepting only strings for `query` | same 17 URLs | all 17 URLs HTTP 200; 0 database errors logged in any case; negative, fractional, text and oversized pages fall back to page 1; NUL stripped; repeated params give the unfiltered list | PASS |
| 8.10 | SQL injection and XSS probes | `?query='; DROP TABLE invoices;--`, `o'brien`, `<script>alert(1)</script>`, unicode, 5000-char string | all HTTP 200, 0 rows, no raw `<script>` reflected, `invoices` row count 13 before and 13 after | PASS |

Known behaviours left as in the course (not defects, noted): `%` and `_` typed in the search act as SQL wildcards and match everything; `page=999` shows an empty table with a pagination bar; the `<Pagination>` client component reads its own `page` param, so for `?page=-1` it highlights nothing while the server shows page 1.

**New accessibility finding:** the search `<label htmlFor="search">` has no matching `id` on the `<input>` (browser check: `input.id === ""`, `input.labels.length === 0`). The label is not associated with the input, so the field has only its placeholder as an accessible name. The course code has this bug; the course's accessibility chapter (13) is the natural place to fix it. Tracked.

## Chapter 11

Official material followed: `create` and `[id]/edit` routes, `app/lib/actions.ts` with `'use server'`, Zod schema, `amount * 100` cents conversion, `INSERT`/`UPDATE`/`DELETE` through the `postgres` tagged template (parameterised), `revalidatePath`, `redirect`, `bind` for the id, `UpdateInvoice` link and `DeleteInvoice` form in `buttons.tsx`.
Additions beyond the course text (all marked in code): a `requireUser()` check using `auth()` at the top of every action; `auth.config.ts` and `auth.ts` created early (course chapter 14 files, needed so `auth()` exists; the rest of chapter 14 is not done); tighter Zod rules; `Math.round` on cents; customer-exists and invoice-exists checks; `revalidatePath('/dashboard')`.
Test script: `scratchpad/t11.js` (outside the project; reads `.env` through `node --env-file`, prints no secrets). It submits the real forms' own hidden fields as multipart POSTs (the no-JavaScript path of Server Actions) with session cookies minted by `next-auth/jwt`.

| # | Check | Result | Status |
|---|---|---|---|
| 9.1 | Lint / type-check / build on final code (exit codes captured) | lint 0 (0 errors, **3 warnings**: unused `sql` param in seed route, `CustomersTableType`, `ExclamationCircleIcon`), tsc 0, build 0. Route table: `/dashboard/invoices/create` `○`, `/dashboard/invoices/[id]/edit` `ƒ`, `/dashboard/invoices` `ƒ` | PASS |
| 9.2 | `next-auth@5.0.0-beta.25` on Next 16.4.5 (its peer range lists Next 14 and 15 only) | `auth()` decoded a valid session cookie inside a Server Action and rejected forged ones; no runtime error | PASS |
| 9.3 | **Test run 1** | Script crashed at step 2 (my bug: passed JSON to Postgres in a way it rejects). The valid-session create had already inserted one test invoice (19.99, dated today). I found it by date, deleted it by id (`DELETE ... RETURNING` returned 1), count back to 13 | FAIL (test bug), cleaned up |
| 9.4 | **Test run 2** (script fixed) | 53 passed, **2 failed**: `/dashboard` kept showing the old totals after a create and after an update (dashboard $1,256.32 pending / 13 invoices, database $1,276.31 / 14; then collected $1,006.26 vs $1,031.76). Cause: in production `/dashboard` is statically cached and the course's actions only revalidate `/dashboard/invoices`. The final "PASS" in that run was only because the data had returned to the frozen build-time values | FAIL (real defect) |
| 9.5 | Fix: `revalidatePath('/dashboard')` in all three actions, rebuild | done | - |
| 9.6 | **Test run 3** (final code, production build) | **55 passed, 0 failed.** Details below | PASS |

Run 3 breakdown (against the real Neon database; baseline users/customers/invoices/revenue 1/6/13/12, paid $1,006.26, pending $1,256.32):
- **Auth guard (nothing may change):** create with no cookie, forged cookie (wrong secret) and garbage cookie: all rejected (HTTP 500), database snapshot identical. Update with no cookie and delete with no cookie or forged cookie: rejected, rows intact.
- **Create:** valid session gives HTTP 303 and exactly one new row; 19.99 stored as 1999 cents; customer, status and today's date correct; SQL totals move by exactly 1999 pending and +1 invoice; the invoice shows on `/dashboard/invoices`.
- **Update:** valid session changes customer, amount (25.50 stored as 2550) and status; no rows added or removed; paid total +2550, pending back to baseline.
- **Delete:** valid session removes exactly that row; count and totals back to 13 / baseline.
- **Dashboard totals:** after create, after update and after delete, the text on `/dashboard` equals the database (`$1,276.31 / 14`, then `$1,031.76 / 14`, then `$1,006.26 / $1,256.32 / 13`).
- **Invalid input, create (19 cases, valid session):** amount 0, -5, "abc", empty, blank, Infinity, NaN, 1e10, 21474837 (over INT in cents), 0.001 (rounds to 0 cents), missing; status unknown, empty, missing, SQL-injection string; customer missing, "not-a-uuid", well-formed but non-existent UUID, SQL-injection string. Every one rejected, database snapshot identical.
- **Invalid input, update (7 cases):** negative and non-numeric amounts, bad status, unknown customer, non-UUID customer, tampered non-UUID id, non-existent invoice id. Every one rejected, row unchanged.
- **Rounding:** 0.07 gives 7, 1.1 gives 110, 0.01 gives 1, 10.555 gives 1056, 21474836 gives 2147483600, 1e2 gives 10000 cents; each created then removed.
- **Delete tampering:** non-UUID id in the form's hidden field rejected.
- **End state:** invoices table identical to the pre-test snapshot (every row and column), counts 1/6/13/12, totals equal baseline.

| # | Check | Result | Status |
|---|---|---|---|
| 9.7 | Database unreachable during an action (fake URL with fake password, valid session; form fields captured from the working build first) | HTTP 500 with a 21-byte generic body; fake password, `AUTH_SECRET` and the session token absent from response and server log; no stack paths in the response; real database still 13 invoices | PASS |
| 9.8 | Edit link and pre-filled form (browser) | pencil goes to `/dashboard/invoices/<uuid>/edit`; form shows Evil Rabbit, 6.66, Pending selected; breadcrumb "Invoices / Edit Invoice" | PASS |
| 9.9 | Unauthenticated submit through the real UI (browser: change amount to 9.99, click "Edit Invoice") | no redirect, page stays on the form; database row still 666 / pending; server log shows one `Unauthorized`; browser shows HTTP 500 and React error #441 (unhandled action error, chapter 12 territory) | PASS (rejection) |
| 9.10 | **Happy-path click-through in the browser while signed in** | not possible yet: there is no login page until chapter 14. The server-action path itself was exercised by run 3 with real form posts | NOT RUN |

Findings to carry forward:
- The invoice id passed with `.bind` appears in the page HTML as a plain hidden field (`$ACTION_0:1`), so a client can change it. The actions therefore validate it (UUID) themselves. Verified in run 3.
- Rejected input currently surfaces as an HTTP 500 and an unhandled client error. The course fixes this in chapter 12 (error handling) and chapter 13 (validation messages). Not started.
- `fetchInvoiceById` has no not-found handling: visiting `/dashboard/invoices/<unknown-uuid>/edit` or `/dashboard/invoices/abc/edit` will error. Chapter 12 (`notFound()`). Not tested yet.
- Data reads (`fetchInvoiceById`, `fetchCustomers`, the dashboard fetchers) still have no auth check and `/dashboard/*` is still publicly viewable. Chapter 14 (`proxy.ts`) plus the planned data-layer checks.

## Chapter 12

Official material followed: `try/catch` around the SQL in the Server Actions (with `redirect()` kept outside), `app/dashboard/invoices/error.tsx`, `notFound()` plus `app/dashboard/invoices/[id]/edit/not-found.tsx`.
Additions beyond the course text (all commented in code): `failDatabase()` helper that logs only error type and code and throws one generic message; `unstable_rethrow` inside it; `notFound()` also used by `updateInvoice` when the invoice is missing; UUID check on the edit page id so malformed ids give 404 instead of a Postgres error; `retry()` instead of `reset()` in `error.tsx` (see 10.9).
Test scripts (outside the project, print no secrets): `scratchpad/t12.js` (phases `good`, `capture`, `bad`), plus the Chapter 11 suite `t11.js` re-run as a regression.

| # | Check | Result | Status |
|---|---|---|---|
| 10.1 | Lint / type-check / build on final code (exit codes captured) | lint 0 (0 errors, 3 warnings, all pre-existing later-chapter stubs), tsc 0, build 0. Routes: `/dashboard/invoices/[id]/edit` `ƒ` | PASS |
| 10.2 | Missing or malformed invoice ids, working database | well-formed unknown UUID, uppercase unknown UUID, `abc`, `123`, `not-a-uuid`, SQL-injection string, `../../etc/passwd`, UUID plus a stray character, 3000-character string, NUL byte: every one gives **HTTP 404**, shows the not-found UI, contains no technical text, and caused **0** database-error log lines. A real id still gives HTTP 200 | PASS |
| 10.3 | `notFound()` inside a Server Action is not swallowed | update with a tampered, non-existent invoice id returns HTTP 404, no database change. On this no-JavaScript POST path Next shows its generic root 404 page, not my `edit/not-found.tsx` (that one is shown on normal page loads, see 10.7) | PASS |
| 10.4 | `redirect()` inside a Server Action is not swallowed | successful create still returns HTTP 303 and inserts exactly one row; Chapter 11's full suite re-run on the new action code: **55 passed, 0 failed** (create/update 303, rounding cases, auth guard, 26 invalid-input cases) | PASS |
| 10.5 | Action failures show nothing technical | unknown customer, invalid amount (Zod), unauthenticated create: each HTTP 500 with the body `Internal Server Error` only; no "Customer not found", "Unauthorized" or Zod text | PASS |
| 10.6 | **Database unreachable** (wrong URL with fake password, valid session) | list, list with search and edit pages: HTTP 500 with an empty shell and an error digest, no database or technical text in the response; create, update, delete actions: HTTP 500 `Internal Server Error`; server log has exactly three action lines of the form `Database Error (Create Invoice): Error ECONNREFUSED`; the fake password, `AUTH_SECRET` and any `postgres://` URL never appear in the log. Real database untouched afterwards (1/6/13/12 rows) | PASS |
| 10.7 | Browser: 404 page for the course's own fake UUID (`2e94d1ed-d220-449f-9f11-f0bbceed9645`) | HTTP 404, "404 Not Found / Could not find the requested invoice. / Go Back" inside the dashboard layout; Go Back links to `/dashboard/invoices` | PASS |
| 10.8 | Browser: `error.tsx` with the database down | sidebar stays, visible text is only "Something went wrong! Try again"; no database details in visible text or page HTML; console shows only React's generic minified error #441 | PASS |
| 10.9 | Browser: "Try again" recovery | **FAIL with the course's `reset()`**: with the database restored, the button did nothing (error stayed); a hard reload worked. Cause (version-matched docs in `node_modules/next/dist/docs`): `reset()` re-renders without re-fetching; the docs recommend `retry()`. After switching to `retry()` and rebuilding: error cleared in place, Lee's invoices returned, no full reload, search box kept | FAIL, then PASS after fix |
| 10.10 | Browser: uncaught exception in an action (the course's own `error.tsx` test; unauthenticated click on the trash icon) | `error.tsx` shown, no leaked text, database still 13 invoices and the 666 invoice present | PASS |
| 10.11 | Final suites on the final build | `t12 good`: 23 passed, 0 failed; Chapter 11 suite: 55 passed, 0 failed; `t12 bad`: 13 passed, 0 failed; database ends at 1/6/13/12 rows, paid $1,006.26, pending $1,256.32 (baseline) | PASS |

Mistakes in my own tests, fixed and recorded:
- First `t12 good` run had one FAIL: I expected my `edit/not-found.tsx` text in the action's 404 response; Next returns its generic 404 there (10.3). Assertion corrected.
- First `t12 bad` run had 3 FAILs: I expected the text "Something went wrong!" in the server HTML. `error.tsx` is a Client Component, so a failed server render returns an empty shell plus digest and the browser draws the UI (10.6, 10.8). Assertion corrected, UI checked in the browser instead.
- A later `t12 bad` run got HTTP 409 "Server Action unavailable": I had rebuilt after editing `error.tsx`, which changes action ids, so my captured form fields were stale. Re-captured on the final build.
- `grep` printed nothing for two runs because the output contains a NUL character from the `%00` test (grep treats it as binary). Results were read from the files directly; use `grep -a`.

## UNRESOLVED SECURITY REQUIREMENT (carried until Chapter 14)
**Dashboard data-reading routes are still unauthenticated.** There is no `proxy.ts` and no login page, so anyone can open `/dashboard`, `/dashboard/invoices`, `/dashboard/invoices/create` and `/dashboard/invoices/<id>/edit` and read invoice and customer data. The data fetchers in `app/lib/data.ts` have no `auth()` check. Only the three mutating Server Actions are guarded. Chapter 14 must add `proxy.ts` with the `authorized` callback, the login flow, data-layer `auth()` checks, and then re-test that every protected route redirects when signed out. Until then this is NOT acceptable for deployment.

Other open items from this chapter:
- No `error.tsx` exists above `/dashboard/invoices`, so an error inside `/dashboard` overview or customers would fall back to Next's built-in error page. Not tested (those routes are statically cached and make no database call at request time in production). The course does not add one.
- Server logs for page and data-fetch errors still print the whole error object (`console.error('Database Error:', error)` in `data.ts`, course code). Verified in 10.6 that no password reached the log; this is server-side only.
- The raw server log of a failing action contains a stack trace of the thrown error. It never reaches the response (10.5).

## Chapter 13 (Improving Accessibility)

Run in the "deliverables first" order (redesign deferred). Official material followed: ESLint accessibility plugin demo, server-side validation with Zod `safeParse`, the `State` type, `useActionState` in both forms, `aria-describedby` plus `aria-live` error regions, a form-level message, and the edit form as the chapter's challenge.
Beyond the course text: friendlier schema messages kept stricter than the course (UUID customer, amount between $0.01 and the INT limit, which also rejects `Infinity`); "customer not found" returned as a customer field error; database errors returned as the generic message `Database Error: Failed to <Create|Update> Invoice.` (logged by type and code only); `deleteInvoice` still throws to `error.tsx` because the delete button has no form state; the search `<input>` got `id="search"` and the edit link got a visually hidden "Edit" name (fixes the Chapter 10 finding and an unnamed link).
Test scripts (outside the project, no secrets printed): `scratchpad/t13.js` (new), `t11.js`, `t12.js` (updated for the new behaviour).

| # | Check | Result | Status |
|---|---|---|---|
| 11.1 | Lint / type-check / clean build (exit codes captured) | lint 0 (0 errors, 3 warnings, same unrelated stubs), tsc 0, build 0; routes unchanged (`/dashboard/invoices/create` `○`, `[id]/edit` `ƒ`) | PASS |
| 11.2 | Chapter's lint demo: remove `alt` from an `<Image>` in `app/ui/invoices/table.tsx` | `jsx-a11y/alt-text` warning reported at the right line; file restored and compared byte for byte with the baseline copy | PASS |
| 11.3 | ARIA wiring, create and edit forms (server-rendered HTML) | select has `aria-describedby="customer-error"`, amount input `amount-error`, status fieldset `status-error`; all three live regions exist with `aria-live="polite"` and `aria-atomic="true"`; every `<label for>` matches an existing id | PASS |
| 11.4 | Accessible names | search input has `id="search"` and exactly 1 label ("Search", checked with `input.labels`); edit link text "Edit"; delete button "Delete"; customer image alt text present | PASS |
| 11.5 | Create form, 18 bad inputs with a valid session | each case returns HTTP 200 with the exact expected message in the right region and the summary "Missing Fields. Failed to Create Invoice.": empty form (3 messages at once), missing/invalid/unknown customer (and a SQL-injection string), amount empty/0/-5/0.001 ("at least $0.01"), abc/NaN ("valid amount"), Infinity/1e10/21474837 ("smaller amount"), status missing/unknown/empty/injection; database unchanged after every one | PASS |
| 11.6 | Edit form, same 18 inputs | every one rejected with the row unchanged. The **messages themselves are not verified for the edit form** (see finding 11.10) | PASS (rejection only) |
| 11.7 | No technical text in validation responses | a request with garbage in all three fields shows no Zod internals, SQL or stack text | PASS |
| 11.8 | Valid input end to end | valid create returns HTTP 303 and inserts exactly one 3137-cent row; valid update returns 303 and changes it; test row deleted; table identical to the start | PASS |
| 11.9 | Guard unchanged | create with a bad session cookie returns HTTP 500 `Internal Server Error`, no row | PASS |
| 11.10 | **Finding: edit form re-render hangs without JavaScript** | Replaying the edit form's own hidden fields with invalid input hung until the client gave up (server log: `POST ... 200 in 20.0s`). Isolated by variants: with React's `$ACTION_KEY` field present the request never completes; without it the same request returns 200 in 226 ms; valid input (redirect) and the unbound create form are not affected. Cause is in the no-JavaScript re-render of a **bound** action wrapped in `useActionState` (the field exists so the page can show the returned state). Impact: only a submit before hydration or with JS disabled. **Not yet verified in a real signed-in browser with JavaScript**, which needs the Chapter 14 login. To re-test then; if the JS path also misbehaves, switch the edit form to the course's documented alternative (hidden `id` input instead of `bind`) | OPEN |
| 11.11 | Regression: Chapter 11 suite | 55 passed, 0 failed | PASS |
| 11.12 | Regression: Chapter 12 suite, good database | 23 passed, 0 failed (updated: invalid input and unknown customer now come back as form state, HTTP 200) | PASS |
| 11.13 | Regression: Chapter 12 suite, database down | 13 passed, 0 failed. A create against an unreachable database shows only the generic form message (checked: no host, password, ECONN or stack text); logs hold one `Error ECONNREFUSED` line per action; delete returns the generic 500 | PASS |
| 11.14 | Browser, signed out | create form submitted empty goes to `error.tsx` ("Something went wrong! Try again", no leaked text): the session check runs before validation, so a signed-out user never gets field messages. Database still 13 invoices | PASS |
| 11.15 | **Field messages shown in a real browser (JS enabled), including the edit form, and whether typed values survive an error** | not testable now: needs a signed-in session. React 19 resets uncontrolled fields after a form action, so the user may lose what they typed; unverified | NOT RUN |

Mistakes and surprises along the way (all recorded):
- A first test run sat for 5 minutes because of the hang in 11.10. I added a 15 s timeout to every request in all suites.
- **My own probe modified real data**: a single valid edit probe against the 666 invoice changed it to 1234 / paid. I restored it from the seed values (`customer_id`, 666, `pending`), then verified 13 invoices, paid $1,006.26, pending $1,256.32 (the baseline) and the final counts 1/6/13/12. Later probes were either invalid input (cannot write) or self-cleaning test rows.
- An old `next dev` of mine from Chapter 12 was still running on port 3001; I confirmed it was this project's process and stopped it.
- My first test tamper step replaced the whole bound-argument array, which with `useActionState` is `[invoiceId, initialState]`; dropping the state shifted the arguments and the action saw `formData` as undefined (HTTP 500 with a `TypeError` in the log). Test bug, not an app bug; the tamper now changes only the id. Side note: the bound id **and** the previous state are visible, client-controlled values in the page HTML; the action validates the id and ignores `prevState`.
- Expected messages for `Infinity` changed after I removed the redundant `.finite()` check (it produced two messages at once).

## UNRESOLVED SECURITY REQUIREMENT (still open after Chapter 13)
Dashboard data-reading routes and fetchers are still unauthenticated (no `proxy.ts`, no login). Chapter 14 must fix it, and nothing may be deployed before that is verified. Chapter 14 must also re-run 11.10 and 11.15 in a signed-in browser.

## Chapter 14 (Adding Authentication)

Official material followed: `authorized` callback in `auth.config.ts`, `proxy.ts` (Next 16's replacement for `middleware.ts`) with the course matcher, `auth.ts` (already created in Chapter 11, unchanged), the `authenticate` action with `AuthError` handling, `app/login/page.tsx`, the `useActionState` login form with `callbackUrl` and `isPending`, and sign out in the sidebar via `signOut({ redirectTo: '/' })`.
Beyond the course text: **data-layer session check**. `app/lib/data.ts` now has `requireSession()` (an `auth()` call wrapped in React `cache()` so it runs once per request) and every exported fetcher awaits it first. Reason: the proxy only redirects; the bundled Next docs say proxy is for optimistic checks and should not be the only protection.
Test scripts (outside the project, no passwords printed): `scratchpad/t14.js` (new), plus `t11.js`, `t12.js`, `t13.js` updated (page GETs now carry a session; they select the invoice form by its `customerId` field, because the sidebar now has its own action form).

| # | Check | Result | Status |
|---|---|---|---|
| 12.1 | Lint / type-check / clean build (exit codes captured) | lint 0 (0 errors, **2 warnings**, down from 3: the unused-icon warning went away with the login form), tsc 0, build 0. Route table: `/dashboard`, `/dashboard/invoices`, `/dashboard/invoices/[id]/edit`, `/dashboard/invoices/create` are `ƒ` (dynamic), `/login` `○`, and `ƒ Proxy (Middleware)` is registered | PASS |
| 12.2 | Signed out, 9 protected URLs (`/dashboard`, `/dashboard/invoices` with and without a query, `/create`, `/customers`, an existing and a non-existent invoice edit page, an unknown `/dashboard/nope`, `/dashboard/` with a trailing slash) | every one redirects to `/login?callbackUrl=...` (the trailing-slash one first gets Next's 308 to `/dashboard`), and no response body contains customer or invoice data | PASS |
| 12.3 | Bad credentials presented as a session | forged cookie (signed with the wrong secret), garbage cookie, empty cookie: all treated as signed out (redirect) | PASS |
| 12.4 | `x-middleware-subrequest` header tricks (the CVE-2025-29927 style bypass) with 4 values | none bypasses the guard | PASS |
| 12.5 | Path tricks (`/%64ashboard/invoices`, `/dashboard%2Finvoices`, `//dashboard`, `/dashboard/../dashboard/invoices`, `/dashboard;x/invoices`, `/Dashboard/invoices`, `/dashboard/invoices%00`, `/dashboard/%2e%2e/dashboard`, `/%64ashboard`) | none returns customer or invoice data | PASS |
| 12.6 | What stays public on purpose | `/`, `/login`, `/hero-desktop.png`, `/customers/lee-robinson.png` return 200. Note: the **customer avatar images in `public/` are readable without logging in** (the proxy matcher excludes `.png`, as in the course) | PASS (by design, noted) |
| 12.7 | `/seed` | not reachable without the token header: HTTP 404 (the proxy lets it through; its own guard answers) | PASS |
| 12.8 | Signed-out Server Action POSTs (no cookie, forged cookie, garbage cookie) against the create form | each redirected to `/login`, no row written, table identical | PASS |
| 12.9 | Signed in (session cookie minted in the format the app issues, which a real browser login also produced) | the 5 protected pages return 200 with data; `/login` and `/` redirect to `/dashboard`; a create with that cookie returns 303 and one row; row removed; table identical; dashboard shows the live invoice count (dynamic) | PASS |
| 12.10 | **Data layer alone**: `proxy.ts` temporarily moved aside, clean rebuild, signed-out requests | none of the 6 URLs returns customer or invoice data; the data pages answer HTTP 500; a signed-in session still works. `proxy.ts` then restored; sha256 identical to before; clean rebuild again | PASS |
| 12.11 | Real browser, signed out | visiting `/dashboard/invoices` lands on `/login?callbackUrl=...invoices` | PASS |
| 12.12 | Real browser, valid login (the seeded demo user) | redirected to the page that was asked for (`/dashboard/invoices`) with the data shown | PASS |
| 12.13 | Real browser, wrong password | stays on `/login`, shows "Invalid credentials." in the `aria-live` region; email and password inputs each have exactly 1 label | PASS |
| 12.14 | Real browser, open redirect attempt: `/login?callbackUrl=https://evil.example.com/steal` then a successful login | ended on this site (`http://localhost:3000/`), never on the other host | PASS |
| 12.15 | Real browser, sign out | lands on `/`; `/dashboard` then redirects to login; signed in, `/login` and `/` bounce to `/dashboard` | PASS |
| 12.16 | Real browser, full UI cycle with before/after database checks | create (Lee Robinson, $77.77) appears first on the list; `/dashboard` immediately shows Pending **$1,334.09** (was $1,256.32) and 14 invoices with no rebuild, latest invoice Lee Robinson; edit to $88.88 / paid changes the row (verified in the database); delete removes it. Database back to 13 invoices, $1,006.26 paid, $1,256.32 pending | PASS |
| 12.17 | **Closes Chapter 13 item 11.15 (create form)** in a real signed-in browser | submitting the empty form shows all three field messages and "Missing Fields. Failed to Create Invoice." in the same document (no reload) | PASS |
| 12.18 | **Closes Chapter 13 item 11.15 (edit form) and refines 11.10** | edit with amount -5: message "Please enter an amount of at least $0.01." plus "Missing Fields. Failed to Update Invoice." in **254 ms**, no hang. So the hang found in 11.10 does **not** happen on the JavaScript path; it remains only for the no-JavaScript re-render of the bound edit form | PASS (JS path); no-JS hang stays OPEN as a documented edge case |
| 12.19 | **New finding: typed values are lost after a validation error** | create: amount `-5` typed, error shown, field is empty again; edit: field reverts to the saved value; login: the email field is cleared after "Invalid credentials." React 19 resets uncontrolled form fields after an action. This is how the course code behaves. Fix would be returning the submitted values in the state and using them as `defaultValue` (small change, not made) | FINDING (not fixed) |
| 12.20 | Overview streaming in production (it is dynamic now) | first byte about 20 ms, complete about 3.2 s (the artificial chart delay), 3 runs. Earlier chapters could not show this because the page was static | PASS |
| 12.21 | Regression on final code | Chapter 11 suite **55/55**, Chapter 12 good-database **23/23**, Chapter 13 **59/59**, Chapter 14 route protection **44/44** | PASS |

Mistakes and surprises along the way (recorded):
- Three attempts to script the login failed because of how I built the requests, not because of the app: a progressive form post (the login form is not in the server HTML at all, see below), then a hand-built `Next-Action` request that the action treated as bad credentials even for the correct password. The real browser login worked first time, so login was verified in the browser (12.11-12.16) and the route-protection suite uses minted cookies.
- One "create with the real cookie" check was actually invoking **Sign Out**: the sidebar's new action form comes first in the HTML and my scripts took "the first form with an action". All four suites now select the form that has a `customerId` field.
- Two assertions changed by design: a signed-out or bad-cookie POST used to reach the action (HTTP 500); the proxy now redirects it first.

Limitations and things not proven (so nothing is overstated):
- **The login form only exists after JavaScript loads** (it uses `useSearchParams` inside `Suspense`, as the course prescribes), so a visitor without JavaScript cannot log in.
- **No rate limiting or lockout on login**: confirmed by reading `auth.ts` (no limiter). My scripted burst test was invalid, so it is not an observed result.
- **Sessions are stateless JWTs**: sign out clears the browser's cookie but the server keeps no session list, so a copied cookie stays valid until it expires. I could not demonstrate it on the real cookie (it is HttpOnly and not readable); this follows from the JWT strategy.
- The `Secure` cookie flag, HTTPS behaviour, and a production `AUTH_SECRET` can only be checked on the deployed site.
- Whether login timing reveals which emails exist was not measured reliably.
- `/dashboard/customers` is still a static stub with no data; it is protected only by the proxy (nothing to leak).
- `requireSession()` running once per request (React `cache`) is by design; I did not count calls.

## AUTHENTICATION ISSUE: RESOLVED LOCALLY (Chapter 14), to be re-verified on the live site
The unresolved requirement carried since Chapter 11 ("dashboard data-reading routes and fetchers are unauthenticated") is closed by checks 12.2-12.10 and 12.11-12.16: every dashboard route redirects signed-out visitors; the data layer refuses signed-out reads even with the proxy removed; Server Actions are guarded twice. **Before any deployment still to do:** remove the 3 s artificial delay in `fetchRevenue`; set a fresh `AUTH_SECRET`, `POSTGRES_URL` and `SEED_TOKEN` in Vercel; then repeat the signed-out redirect checks, a real login, and the seed refusal on the live URL.

## Chapter 15 (Adding Metadata)

Official material followed: moved `favicon.ico` and `opengraph-image.png` from `public/` to the root of `app/`; root `metadata` with `title.template` (`%s | Acme Dashboard`), `default`, `description` and `metadataBase`; per-page titles on `/login`, `/dashboard`, `/dashboard/customers`, `/dashboard/invoices`, `/dashboard/invoices/create` and `/dashboard/invoices/[id]/edit`.
Differences from the course text (all commented in the code):
- `metadataBase` is built from Vercel's `VERCEL_PROJECT_PRODUCTION_URL` (falls back to `http://localhost:3000`) instead of the course's hard-coded `https://next-learn-dashboard.vercel.sh`, which is the course's own demo site and would make share-image URLs point at somebody else's domain.
- `proxy.ts` matcher now also excludes `favicon.ico` (finding 13.8).
- **Name:** the title template uses the current UI name "Acme", to match the interface as it is today. The VIRUS redesign phase renames it in the root layout in one place (the per-page titles do not repeat the name).
- The Open Graph image and favicon are the course's own assets (the image is the Acme marketing picture with the course's sample figures, not this app's data). They belong to the redesign phase to be replaced.
Test script: `scratchpad/t15.js` (new). Nothing else in the project changed.

| # | Check | Result | Status |
|---|---|---|---|
| 13.1 | Lint / type-check / clean build (exit codes captured) | lint 0 (0 errors, 2 warnings, unchanged unrelated stubs), tsc 0, build 0. The route table now lists `/opengraph-image.png` as static | PASS |
| 13.2 | Titles on every page | `/login` "Login \| Acme Dashboard"; `/` (no title of its own) falls back to "Acme Dashboard"; `/dashboard` "Dashboard \| Acme Dashboard"; `/dashboard/invoices` (also with a query and page) "Invoices \| Acme Dashboard"; create "Create Invoice \| Acme Dashboard"; edit "Edit Invoice \| Acme Dashboard"; customers "Customers \| Acme Dashboard" | PASS |
| 13.3 | Head tags a link-preview crawler sees (public page) | `description` present; `og:title` equals the page title; `og:description` present; `og:image` is an absolute URL on `metadataBase` (`http://localhost:3000/opengraph-image.png?...` here); width 1686, height 882 and type `image/png` declared; favicon `<link rel="icon">` present; the course demo domain appears nowhere in the HTML | PASS |
| 13.4 | Assets load signed out | favicon `image/x-icon` 15086 bytes, share image `image/png` 243189 bytes | PASS |
| 13.5 | **Finding: favicon broken for signed-in users (first run)** | signed in, `/favicon.ico` returned **302 to `/dashboard`** instead of the icon. Cause: the Chapter 14 `authorized` callback redirects every non-dashboard URL for a signed-in user, and the course matcher excludes `.png` but not `.ico` (the share image URL ends in `.png`, so it was fine) | FAIL (real defect) |
| 13.6 | Fix: `favicon\.ico` added to the proxy matcher, clean rebuild | signed in and signed out the favicon returns the icon; re-run: **19 passed, 0 failed** | PASS |
| 13.7 | The matcher change did not weaken protection | Chapter 14 suite **44/44**; probes signed out: `/favicon.ico` 200 (public, no data), `/dashboard/favicon.ico` and `/dashboard/invoices/favicon.ico` still 307 to login, `/FAVICON.ICO` and `/favicon.icox` 404, `/favicon.ico/` 308; none returns customer or invoice data | PASS |
| 13.8 | Real browser | tab title "Login \| Acme Dashboard"; the favicon loads (48x48); `og:title`, `og:image` (1686x882) and description present in the live DOM | PASS |
| 13.9 | Regression on the final code | Chapter 11 suite **55/55**, Chapter 12 good-database **23/23**, Chapter 13 **59/59**, Chapter 14 **44/44**, Chapter 15 **19/19**; database unchanged (1/6/13/12, $1,006.26 paid, $1,256.32 pending) | PASS |

Not verified: how a real social network renders the preview (needs the public URL); the `Secure` cookie flag and `VERCEL_PROJECT_PRODUCTION_URL` behaviour (only exist on Vercel); that variable's value on the live site must be checked after deployment (`og:image` must point at the deployed domain).

## All 15 course chapters are now implemented and verified locally
Open items before hand-in (none is a course chapter): remove the 3 s artificial delay in `fetchRevenue`; REPO-MAP.md with verified `file:line` references; git, GitHub and Vercel (each needs separate approval); re-verify authentication and the share-image URL on the live site; the VIRUS redesign (separate phase, after the deliverables).

## REPO-MAP.md (the hand-in document)

Pre-deployment cleanup done first: the 3-second artificial delay in `fetchRevenue` (`app/lib/data.ts`) was removed, because it shifts every later line number. After the removal: lint 0, tsc 0, clean build 0, the dashboard completes in about 0.2 s once warm (first request about 1.9 s, a database cold start; it was about 3.2 s with the delay), Chapter 11 suite 55/55 and Chapter 14 suite 44/44 on that build.

How the document is produced and checked (scripts live outside the project, in the session scratchpad):
- `gen_repomap.py` + `repomap.tpl.md`: the text is written once; every code reference is an anchor (a piece of text to find in a file), and the generator looks up the real line number and the exact line of code and writes `file:line → code`. A reference fails loudly if its anchor is missing, ambiguous, or not at the expected place.
- `check_repomap.py`: a separate checker that shares no code with the generator. It re-reads the finished `REPO-MAP.md` and the project.

| # | Check | Result | Status |
|---|---|---|---|
| 14.1 | Structure | one title (`# REPO-MAP`) and exactly four `##` sections in order: "1. Folder Map", "2. Page Trace", "3. Eight Patterns", "4. Three Improvements"; no text between the title and section 1 | PASS |
| 14.2 | Every `file:line → code` reference | **84 of 84** match: the file exists, the line number is in range, and the code shown is what the line contains | PASS |
| 14.3 | No bare references | 0 `file:line` mentions without their code | PASS |
| 14.4 | Folder map | all 55 named files and folders exist in the project | PASS |
| 14.5 | Secret scan of the document | no database URL, secret assignment, Neon host or token prefix | PASS |
| 14.6 | Can the checker actually fail? (mutation test) | wrong line number: caught; wrong code claimed for a correct line: caught; a folder-map entry that does not exist: caught; an extra fifth section: caught. The clean document was restored and compared byte for byte | PASS |
| 14.7 | Page Trace coverage | 44 steps for `/dashboard/invoices?query=lee&page=1`: proxy and matcher, the `authorized` rule (signed in and signed out), root layout and title template, dashboard layout, the page, input cleaning, both data calls, the session check and where `auth()` comes from, the database connection, the query lines (join, search, limit and offset), the `CREATE TABLE` statements, the table rows, status badge, edit and delete buttons, pagination, the search box, the skeleton, and the error boundary | PASS |

Wording corrections made while reviewing the draft (claims I could not support were removed or rewritten): the proxy is not "edge-style" (the bundled Next docs say it runs on Node.js by default in Next 16); the `auth.ts` / `auth.config.ts` split is described as the course's choice, not a necessity; the connection-limit reasoning in Improvement 1 no longer asserts Neon's limits (not measured) and is labelled as reasoning; Improvement 2 says the missing rate limit was confirmed by reading the code and the session point follows from the JWT design (a real-cookie replay was not demonstrated); a test-harness bug was removed from the list of "bugs caught by tests" and replaced by a real one (the no-JavaScript edit-form hang).

Limits: the line numbers are exact for the code as it is today. Any later edit to a referenced file (for example the VIRUS redesign) can shift them; the generator and checker re-create and re-verify the document in seconds, and the checker must pass again right before the commit.

## VIRUS redesign (separate phase after the 15 chapters)

What it is: a new product name (VIRUS) and a dark, neon-green, glass-style interface laid over the finished course app. It changes how things look and move, not what they do. Nothing was committed or pushed for this phase.
Guardrails and how they were checked:
- 19 protected files must not change (`app/lib/actions.ts`, `data.ts`, `definitions.ts`, `placeholder-data.ts`, `utils.ts`, `auth.ts`, `auth.config.ts`, `proxy.ts`, `app/seed/route.ts`, `package.json`, the lockfile and workspace file, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.js`, `.env`, `.env.example`): SHA-256 taken before and compared after.
- 31 course-learning artifacts (clsx, `next/font`, `next/image`, layouts, `Link` + `usePathname`, Suspense and `loading.tsx`, debounced search, `bind`, `useActionState`, `error.tsx`, `notFound()`, metadata ...) must still exist: grep checker run before and after.
- No new dependency: `package.json` and the lockfile are unchanged. Fonts come through `next/font`. Animations are CSS.

| # | Check | Result | Status |
|---|---|---|---|
| 15.1 | Protected files | all 19 byte-identical to before | PASS |
| 15.2 | Course artifacts | 31 of 31 still present | PASS |
| 15.3 | Lint / type-check / clean build (exit codes captured) | lint 0 (0 errors, the same 2 old warnings), tsc 0, build 0. Route table identical to before the redesign (same routes, same static/dynamic split, `ƒ Proxy`) | PASS |
| 15.4 | Lint caught a real problem during the work | the first count-up called `setState` inside an effect (a cascading-render risk). Rewritten to write to the element through a ref | FIXED |
| 15.5 | Chapter 11 suite (create/update/delete, validation, auth guard) | **55/55** (one selector updated: the card markup changed) | PASS |
| 15.6 | Chapter 12 suites | good database **23/23**, database unreachable **13/13** (one assertion updated: the missing-invoice 404 is now the branded VIRUS 404 instead of Next's generic one; HTTP 404 and "no technical details" unchanged) | PASS |
| 15.7 | Chapter 13 suite (validation messages, ARIA wiring) | **59/59**, unchanged | PASS |
| 15.8 | Chapter 14 suite (route protection, bypass attempts) | **44/44**, unchanged | PASS |
| 15.9 | Chapter 15 suite (titles, share tags, favicon) | **19/19** after updating the expected name ("VIRUS"), description, and share image size (1200x630) | PASS |
| 15.10 | Contrast (WCAG), computed | 16 of 16 pairings pass AA, e.g. body text 16-17:1, secondary text 6.6-7.4:1, neon button label 14.2:1, Pending amber on its pill 8.5:1, errors 6.4-6.8:1, focus ring 15:1 | PASS |
| 15.11 | Reduced motion, in real Chrome with the system setting emulated | with "reduce": every animation duration is 0.00001 s with no delay, no infinite animation exists (the skeleton shimmer is capped at one pass), cards are fully opaque and the 12 chart bars are at full height immediately, the statistic numbers are final from the first frame, nothing is animating a moment after load. With "no preference": entrance animations run and the Collected number counts through 20 distinct values and ends on exactly `$1,006.26` | PASS |
| 15.12 | Responsive, real Chrome at exact widths | phone 375, tablet 768, desktop 1280, on dashboard, invoices, create form, customers: no horizontal overflow in any of the 12 combinations. Phone: fixed bottom navigation with Home, Invoices, Customers, Sign Out and `aria-current` on the active tab. Tablet: sidebar plus card list. Desktop: sidebar plus table that fits its panel | PASS |
| 15.13 | Signed-out screens in real Chrome (desktop and phone) | landing, login and the global 404: titles "VIRUS" and "Login \| VIRUS", no "Acme" text anywhere, the right hero image shown and loaded at each width, labelled login fields, 404 offers a way back | PASS (12/12) |
| 15.14 | Real-browser walk-through (local app) | login, dashboard, invoices, create form with its errors, 404 and phone layout all reviewed on screen | PASS |
| 15.15 | Count-up flash (measured frame by frame, 3 runs) | the final number is on screen for **one frame at opacity 0.00** (card still fading in), then the count restarts from $0.00 and climbs; no visible flash locally | PASS (local) |

Visible changes: VIRUS name and mark everywhere (sidebar, landing, login, page titles, 404); dark glass surfaces with neon accent; Space Grotesk headings and numbers; active-nav indicator (also now lit on the nested create and edit pages, and `aria-current` is set); phone bottom navigation; count-up statistic cards with staggered entrance; neon chart bars that grow in with hover values; amber/neon status badges; searchable table with empty-state ("No invoices found", "Clear search"); restyled forms, pagination and skeletons; branded error, dashboard-error and 404 screens; the table switches to cards below 1024 px (was 768 px) because six columns do not fit beside the sidebar.
Assets: hero images, share image and favicon were rendered with Chrome from static pages styled like the app. **They show the figures at the time ($1,266.32 pending, 14 invoices) and will not update.**

Limitations and things not verified:
- The count-up flash was measured on localhost only. On a slow connection where JavaScript arrives after the 0.6 s entrance has finished, the final number could be seen once before the count restarts.
- Not verified: Safari and Firefox (only Chrome was driven); a screen-reader pass (only automated ARIA and contrast checks); the redesign on the deployed site (nothing is deployed).
- The database now holds one extra invoice that I did not create (Delba de Oliveira, $10.00, pending, dated 8 Nov 2026), so the live totals are 14 invoices and $1,266.32 pending rather than 13 and $1,256.32. My suites compute their baselines from live data, so they are unaffected.
- `REPO-MAP.md` was regenerated for the new code: 84 of 84 references match, 60 folder-map entries exist, secret scan clean.
- Uncommitted: 35 modified files, 7 new UI files, 1 deleted (`acme-logo.tsx`). Needs approval before any commit; the REPO-MAP checker must pass again right before it.

## Customers page (real data, added after the redesign)
Before: `/dashboard/customers` was a placeholder. Now it lists the customers in the database (name, email, invoice count, pending, paid) with search, using the existing `fetchFilteredCustomers` (no change to `data.ts`, which still requires a session).
Final run on a clean build WITH `proxy.ts`, lint 0 errors, `tsc` 0, 19 protected files unchanged, 31 course artifacts present:
| Suite | Result |
|---|---|
| t19 customers (rows and totals compared with SQL, search, hostile input, signed out) | PASS 20/20 |
| t11 (Chapter 11 CRUD) | PASS 55/55 |
| t12 good paths | PASS 23/23 |
| t13 (forms/accessibility) | PASS 59/59 |
| t14 full (authentication) | PASS 44/44 |
| t15 (metadata) | PASS 19/19 |
| t16 reduced motion | PASS 27/27 |
| t17 signed-out screens | PASS 12/12 |
Data layer alone (proxy.ts temporarily moved aside, then restored byte-identical): signed-out request to the customers page gives HTTP 500 with no data, 8/8 PASS.
Note: a first run showed many failures because an old no-proxy server was still holding port 3000; I stopped it by its exact PID, rebuilt and re-ran everything. The numbers above are from that clean run.

## Customer detail and editing (added after the customers list)
Click a customer in the list to open `/dashboard/customers/<id>`: profile, totals, that customer's invoices (each links to its invoice edit page) and a form to edit name and email.
Code: `fetchCustomerById` and `fetchInvoicesByCustomer` (added to `data.ts`, both call `requireSession()`), `updateCustomer` (added to `actions.ts`: `requireUser()`, UUID check, Zod name 1-100 / email valid max 254, duplicate-email check, SQL in try/catch, `notFound()` outside it, revalidates the customers, invoices and dashboard pages). Both files were only extended: no existing line changed. The protected-file baseline was refreshed for these two files on purpose; the other 17 are still byte-identical.
Result on a clean build with `proxy.ts`, real Chrome against the real database (t20, 20/20 PASS): detail page matches SQL, 404 for a malformed and an unknown id, signed out redirected to /login, clicking a list row opens the page, empty name and bad email show field errors and change nothing, typed values are kept after an error, another customer's email is refused, a hostile name is stored as text and rendered escaped, a valid edit is saved and shows in the list, search and the invoices page, no horizontal overflow at 375px, row counts unchanged, the test customer restored.
Regression on the same build: t11 55/55, t12 23/23, t13 59/59, t14 44/44, t15 19/19, t16 27/27, t17 12/12, t19 20/20.
Not tested: a signed-out POST straight to the `updateCustomer` action (the proxy and `requireUser()` both guard it, same pattern as the invoice actions, but no dedicated probe was run). No delete-customer or add-customer feature exists (not requested). The photo cannot be changed.

## Interactive extras (clickable cards, filters, shortcut, confirm-delete)
Six small additions, UI only (no change to `data.ts`, `actions.ts` or any other protected file; the 19 hashes still match):
1. Overview cards are links: Collected -> invoices filtered to paid, Pending -> pending, Total Invoices -> invoices, Total Customers -> customers. Latest-invoice rows open that invoice's edit page.
2. Status chips (All / Paid / Pending) on the invoices page. They only set `?query=`; the existing search already matches the status column. Side effect to know: the word "paid" also matches a customer name or email that contains it.
3. Press `/` to focus the search box (ignored while typing in a field). The box now follows the URL when a chip changes it, but never overwrites text while you type.
4. "New invoice for <name>" on the customer page opens the create form with that customer selected. `?customerId=` is only accepted if it is a real customer id; anything else is ignored.
5. Delete asks first: a native `<dialog>` (Escape or Cancel keeps the invoice). The `.bind(null, id)` course pattern moved from `buttons.tsx` to `delete-button.tsx`; the artifact checker and REPO-MAP were updated to match. The dialog id uses `useId()` because the list renders each button twice (cards and table).
6. Copy-email button on the customer page.
Results on a clean build with proxy.ts, real Chrome, real database (t21, 23/23 PASS): cards filter correctly, row link opens edit form, chips filter and sync the search box, `/` focuses without typing a slash and still types one inside the box, preselect works and a bogus id is ignored, copy puts the email on the clipboard, Delete: dialog opens, Escape and Cancel keep the invoice, Confirm removes it from the database and list, no overflow at 375px, invoice count back to 14. Regression on the same build: t11 55/55, t12 23/23, t13 59/59, t14 44/44, t15 19/19, t16 27/27, t17 12/12, t19 20/20, t20 20/20; lint 0 errors, tsc 0.
Not tested: keyboard-only and screen-reader use of the dialog (only Escape and clicks), Safari/Firefox (`<dialog>` is supported there but was not driven).
Data note: the database now holds a customer named "Lee Robinsons" (seed value is "Lee Robinson"). I did not make that edit (my tests restore the original values), so it was probably done through the new edit form; I left it alone.

## Not yet run (planned)
Auth and authorization, route protection, CRUD, invalid input, database failure handling, seed-endpoint hardening, `pnpm build` after each later chapter, shadcn pass (build, accessibility, before/after look), production deployment checks. All **NOT RUN**.

## Unresolved issues
0000000. **Authentication (ex-top issue): resolved locally in Chapter 14, re-verify on the live URL.** Still open: no-JavaScript edit-form hang (11.10 residual), typed values lost after an error (12.19), no login rate limit, JWT sessions cannot be revoked, (the 3 s delay in `fetchRevenue` was removed while preparing REPO-MAP.md.)
000000. **Chapter 13 open items:** 11.10 (edit form no-JS hang, to re-test with a real login in Chapter 14) and 11.15 (field messages and value retention in a real browser).
00000. **SECURITY: dashboard data-reading routes and fetchers are unauthenticated** until Chapter 14 (see the Chapter 12 section). Do not deploy before this is fixed and re-tested.
0000. **Search input has no `id`** (label not associated). Fix in chapter 13. See Chapter 10 notes.
0001. **Input sanitising in `invoices/page.tsx` is an addition to the course**, made because the course code errors on negative/huge `page` values and NUL bytes. Easy to revert if you prefer pure course code.
000. **Stale `.next` cache can fail `tsc` and `pnpm build`** after files move (happened in chapter 9). Fix is `rm -rf .next`. Do the same after any route move.
00. **The 3-second artificial delay in `fetchRevenue` is still enabled** (chapter 8; the course uses it to demonstrate streaming in chapter 9). It must be removed before any deployment. Tracked.
00b. **Production `/dashboard` is static (stale data) until chapter 14**, see the chapter 8 finding. Re-verify at chapter 14.
0. **Data access is not authenticated yet.** `fetchRevenue`, `fetchLatestInvoices` and `fetchCardData` have no session check, and `/dashboard` is open. Both are chapter 14 work; the data-layer `auth()` checks are still planned. `data.ts` also logs the whole error object (`console.error('Database Error:', error)`); 4.8 showed no password in it, but it is server-side logging of driver errors and worth reviewing.
1. **Lint tooling is an addition to the course.** ESLint was added with your approval (1.9). 17 warnings remain from unfinished course stubs; they must be 0 or explained by the final verification.
1b. **Dependency drift: resolved.** The course's `package.json` had `next`/`react`/`react-dom` at `latest`, which changed them when I ran `pnpm add`. They are now pinned to 16.4.5 / 19.3.1 / 19.3.1 (see 1.14). This is a deviation from the course file, made at your request.
2. **`/query` route: resolved.** Used for the chapter 6 test, then deleted (3.12, 3.13).
2b. **Course seed script is not atomic.** `sql.begin((sql) => [...])` runs the four seed functions on the outer connection, not the transaction, so a failure part-way can leave some tables filled. My one-time lock requires all four tables to have rows, so a half-seeded database is not locked and can be retried (invoices could duplicate in that case; drop the tables first).
3. `pnpm` was installed globally by my first scaffold command (`npm i -g pnpm`, covered by your approved plan). It is the only change outside `the project folder`.
4. Build exit code for 1.2 was not captured at the time; 1.13 captured exit 0 on the new versions.
