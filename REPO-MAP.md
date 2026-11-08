# REPO-MAP

## 1. Folder Map

This is the official Next.js Learn "invoices dashboard" (Next.js 16, App Router, React 19, Tailwind 3), connected to a Postgres database on Neon, with Auth.js sign-in. Every folder below is explained by what it is for and by who talks to whom.

```
task3/
├─ app/                          the whole application (App Router: folders = URLs)
│  ├─ layout.tsx                 root layout: <html>/<body>, Inter and Space Grotesk fonts, global CSS, site metadata (title template "%s | VIRUS")
│  ├─ page.tsx                   "/" landing page: VIRUS logo, headline, "Log in" links, hero images
│  ├─ favicon.ico                file-based metadata: tab icon
│  ├─ opengraph-image.png        file-based metadata: link-preview image (VIRUS branded)
│  ├─ not-found.tsx              branded 404 page for any URL that does not exist
│  ├─ login/page.tsx             "/login": page shell; the form itself is app/ui/login-form.tsx
│  ├─ seed/route.ts              "GET /seed": creates and fills the four tables (header token, one-time lock)
│  ├─ dashboard/                 everything behind the login
│  │  ├─ layout.tsx              shared shell: sidebar on the left, page content on the right
│  │  ├─ template.tsx            wraps every dashboard page in a short fade-in on each navigation
│  │  ├─ error.tsx               error boundary for the dashboard pages that have no nearer one
│  │  ├─ (overview)/             route group (folder name not in the URL): "/dashboard"
│  │  │  ├─ page.tsx             overview page: three Suspense boundaries
│  │  │  └─ loading.tsx          skeleton shown while the overview streams
│  │  ├─ invoices/               "/dashboard/invoices": search, table, pagination
│  │  │  ├─ page.tsx             reads ?query= and ?page= from the URL
│  │  │  ├─ error.tsx            error boundary for this whole subtree
│  │  │  ├─ create/page.tsx      "/dashboard/invoices/create"
│  │  │  └─ [id]/edit/           "/dashboard/invoices/<uuid>/edit" (dynamic segment)
│  │  │     ├─ page.tsx          loads one invoice, shows 404 if it does not exist
│  │  │     └─ not-found.tsx     the 404 screen for a missing invoice
│  │  └─ customers/
│  │     ├─ page.tsx          "/dashboard/customers": real list from the database, with search (fetchFilteredCustomers); each row links to the detail page
│  │     └─ [id]/             "/dashboard/customers/<uuid>": customer details, their invoices, edit form (page.tsx, not-found.tsx)
│  ├─ lib/                       server-side logic, no UI
│  │  ├─ data.ts                 every database READ (one function per screen), each checks the session
│  │  ├─ actions.ts              every database WRITE (Server Actions) plus the login action
│  │  ├─ definitions.ts          TypeScript types for rows (Invoice, Customer, ...)
│  │  ├─ utils.ts                formatCurrency, formatDateToLocal, chart axis and pagination helpers
│  │  └─ placeholder-data.ts     the course's sample users, customers, invoices, revenue (used by /seed)
│  └─ ui/                        React components
│     ├─ dashboard/              sidenav (and phone bottom bar), nav-links (active link), cards, count-up, revenue-chart, latest-invoices
│     ├─ invoices/               table, create-form, edit-form, pagination, status badge and status-filter chips, buttons, delete-button (confirmation dialog), breadcrumbs
│     ├─ customers/table.tsx     customers table (desktop table, phone cards, empty state), edit-form.tsx (edit name/email, calls updateCustomer), copy-email.tsx
│     ├─ login-form.tsx, search.tsx, button.tsx, skeletons.tsx, virus-logo.tsx, empty-state.tsx, error-state.tsx
│     └─ fonts.ts, global.css    next/font definitions and the Tailwind entry file
├─ public/                       static files served as-is: customers/ avatars, hero-desktop.png, hero-mobile.png (VIRUS dashboard renderings)
├─ proxy.ts                      Next 16 proxy (formerly middleware): first gate, redirects signed-out visitors
├─ auth.config.ts                Auth.js settings that are safe for the proxy (login page URL, the "authorized" rule)
├─ auth.ts                       Auth.js with the Credentials provider and bcrypt (the course keeps it apart from auth.config.ts so the proxy loads only the small config)
├─ package.json, pnpm-lock.yaml, pnpm-workspace.yaml, .npmrc      dependencies and pnpm settings (next and react pinned)
├─ tailwind.config.ts            the VIRUS design tokens: colours, display font, glow shadows and the animation keyframes
├─ tsconfig.json, next.config.ts, postcss.config.js, eslint.config.mjs      tool configuration
├─ .env                          LOCAL secrets (POSTGRES_URL, AUTH_SECRET, AUTH_URL): git-ignored, never committed
├─ .env.example                  the variable names the app needs (plus SEED_TOKEN), no values
├─ README.md                     the course starter's README
├─ AGENTS.md                     written by next dev; tells coding agents to read the docs bundled in node_modules
└─ VERIFICATION.md               log of every check that was run and its real result
```

Not in the repository (generated or ignored): `node_modules/` (installed packages), `.next/` (build output), `.vercel/` (deployment link), `next-env.d.ts` and `*.tsbuildinfo` (generated by the tools).

The VIRUS look (a layer on top of the course app, with no change to its logic):

| Piece | Where | What it does |
|---|---|---|
| Colours, fonts, glow, keyframes | `tailwind.config.ts` | One palette (near-black page, neon green `#2bff88` accent, amber for Pending, red for errors only) and the `fade-up`, `fade-in` and `grow-y` animations |
| Page background, focus ring, reusable classes, reduced motion | `app/ui/global.css` | The glow-and-grid backdrop, one visible keyboard focus ring, `.v-glass` panels, `.v-input`, `.v-btn` and friends, and the `prefers-reduced-motion` rule that switches all animation off |
| Brand | `app/ui/virus-logo.tsx` | The hexagon-V mark and the wordmark, pure SVG |
| Fonts | `app/ui/fonts.ts` | Inter for text, Space Grotesk for headings and numbers, both through `next/font` |
| Number count-up | `app/ui/dashboard/count-up.tsx` | The only client-side animation: statistic numbers count up once, end on the exact database value, and do nothing under reduced motion |
| Empty, error and 404 screens | `app/ui/empty-state.tsx`, `app/ui/error-state.tsx` | One look for "nothing here", "something broke" and "not found" |

How the pieces talk to each other:

| Layer | Folder | Runs where | Talks to |
|---|---|---|---|
| Routes (pages, layouts, loading, error) | `app/dashboard/**`, `app/login`, `app/page.tsx` | server (Server Components) | `app/lib/data.ts` for reads, `app/ui` for markup |
| Interactive pieces | `app/ui/search.tsx`, `pagination.tsx`, forms, `nav-links.tsx`, `login-form.tsx`, `error.tsx` | browser (Client Components, marked `'use client'`) | the URL (search, pagination) or Server Actions (forms) |
| Reads | `app/lib/data.ts` | server only | Postgres through the `postgres` library |
| Writes | `app/lib/actions.ts` | server only, called from forms | Postgres, then `revalidatePath` and `redirect` |
| Auth | `proxy.ts`, `auth.config.ts`, `auth.ts` | proxy: before any route renders (Node.js runtime by default in Next 16); `auth.ts`: server | the session cookie and the `users` table |
| Data | Neon Postgres: `users`, `customers`, `invoices`, `revenue` | managed database | created by `app/seed/route.ts` |

## 2. Page Trace

Page traced: **`/dashboard/invoices?query=lee&page=1`**, the invoices list with a search term. It touches every layer: proxy, layouts, a Server Component page, client components, the data layer, SQL, and the database. Each row shows the file and line, the exact code on that line, and what happens there. The line numbers are checked against the files by script (see VERIFICATION.md).

| # | File:line and code | What happens |
|---|---|---|
| 1 | `proxy.ts:4` → `export default NextAuth(authConfig).auth;` | The browser requests the URL. Before any page renders, Next runs the proxy. It is Auth.js's `auth` function used as the proxy. |
| 2 | `proxy.ts:10` → `matcher: ['/((?!api\|_next/static\|_next/image\|favicon\\.ico\|.*\\.png$).*)'],` | The matcher says which URLs the proxy runs on: everything except `api`, static files, images, `favicon.ico` and `.png` files. |
| 3 | `auth.config.ts:14` → `const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');` | The `authorized` rule starts: is this URL under `/dashboard`? Yes. |
| 4 | `auth.config.ts:16` → `if (isLoggedIn) return true;` | Signed in (valid session cookie): the request continues. |
| 5 | `auth.config.ts:17` → `return false; // Redirect unauthenticated users to login page` | Signed out: `false` means "redirect to the sign-in page", here `/login?callbackUrl=...`. The trace stops for a visitor who is not signed in. |
| 6 | `app/layout.tsx:22` → `export default function RootLayout({` | The root layout wraps every page: `<html>`, the Inter and Space Grotesk fonts, global CSS. |
| 7 | `app/layout.tsx:14` → `template: '%s \| VIRUS',` | The metadata title template. The invoices page's own title is inserted here: "Invoices \| VIRUS". |
| 8 | `app/dashboard/layout.tsx:3` → `export default function Layout({ children }: { children: React.ReactNode }) {` | The dashboard layout: sidebar plus content area. It stays mounted while you move between dashboard pages. |
| 9 | `app/dashboard/layout.tsx:7` → `<SideNav />` | The sidebar (links, sign out) is rendered once here. |
| 10 | `app/dashboard/layout.tsx:10` → `{children}` | Our page is rendered into this slot. |
| 11 | `app/dashboard/invoices/page.tsx:16` → `export default async function Page(props: {` | The route's page. It is an async Server Component, so it can `await` data. |
| 12 | `app/dashboard/invoices/page.tsx:22` → `const searchParams = await props.searchParams;` | The URL's `?query=lee&page=1` arrives here as a promise and is awaited. |
| 13 | `app/dashboard/invoices/page.tsx:28` → `const query = (typeof rawQuery === 'string' ? rawQuery : '').replaceAll(` | The search term is cleaned (strings only, NUL bytes removed) before it goes near SQL. |
| 14 | `app/dashboard/invoices/page.tsx:34` → `Number.isSafeInteger(requestedPage) && requestedPage >= 1` | The page number must be a positive whole number, otherwise it becomes 1 (a negative number would make SQL `OFFSET` fail). |
| 15 | `app/dashboard/invoices/page.tsx:38` → `const totalPages = await fetchInvoicesPages(query);` | First data call: how many pages match this search. It is awaited before anything is sent, because the pagination bar needs it. |
| 16 | `app/lib/data.ts:137` → `export async function fetchInvoicesPages(query: string) {` | The function that counts matching invoices. |
| 17 | `app/lib/data.ts:138` → `await requireSession();` | Every read starts by checking the session, even though the proxy already did. This one is for `fetchInvoicesPages`. |
| 18 | `app/lib/data.ts:20` → `const requireSession = cache(async () => {` | `requireSession` calls `auth()` and is wrapped in React `cache`, so it runs once per request even when several reads run together. |
| 19 | `auth.ts:21` → `export const { auth, signIn, signOut } = NextAuth({` | `auth()` is created here: it decodes the signed session cookie. No cookie or a bad one means no user, and the read throws "Unauthorized". |
| 20 | `app/dashboard/invoices/page.tsx:48` → `<Search placeholder="Search invoices..." />` | The search box (a Client Component) is rendered. |
| 21 | `app/dashboard/invoices/page.tsx:52` → `<Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>` | The table is wrapped in Suspense. The `key` changes with the search or page, so the skeleton shows again for each new search. |
| 22 | `app/ui/skeletons.tsx:166` → `export function InvoicesTableSkeleton() {` | The skeleton shown while the table's data loads (this is streaming). |
| 23 | `app/dashboard/invoices/page.tsx:53` → `<Table query={query} currentPage={currentPage} />` | The table component gets the cleaned search term and the page number. |
| 24 | `app/ui/invoices/table.tsx:17` → `const invoices = await fetchFilteredInvoices(query, currentPage);` | The table fetches its own rows. This is the second data call. |
| 25 | `app/lib/data.ts:100` → `export async function fetchFilteredInvoices(` | The read function for the table. |
| 26 | `app/lib/data.ts:104` → `await requireSession();` | Session checked again, in the data layer. Same cached result as row 17 in the same request. |
| 27 | `app/lib/data.ts:106` → `const offset = (currentPage - 1) * ITEMS_PER_PAGE;` | Page 1 means skip 0 rows, page 2 means skip 6, and so on. |
| 28 | `app/lib/data.ts:14` → `const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });` | The database connection: one `postgres` client built from `POSTGRES_URL` (a server-only environment variable, over SSL). |
| 29 | `app/lib/data.ts:109` → `` const invoices = await sql<InvoicesTable[]>` `` | The query is sent as a tagged template: values written as `${...}` are sent as parameters, never pasted into the SQL text, which is what stops SQL injection. |
| 30 | `app/lib/data.ts:119` → `JOIN customers ON invoices.customer_id = customers.id` | The join that pairs each invoice with its customer's name, email and avatar. (`data.ts` has three similar joins, in `fetchLatestInvoices`, `fetchFilteredInvoices` and `fetchInvoicesPages`; this is the one in `fetchFilteredInvoices`.) |
| 31 | `app/lib/data.ts:121` → `` customers.name ILIKE ${`%${query}%`} OR `` | The search: case-insensitive match of the term against name, email, amount, date and status. |
| 32 | `app/lib/data.ts:127` → `LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}` | Only 6 rows come back, starting at `offset`. |
| 33 | `app/seed/route.ts:37` → `CREATE TABLE IF NOT EXISTS invoices (` | The table being read was created here by `/seed`: id, customer_id, amount (in cents), status, date. |
| 34 | `app/seed/route.ts:63` → `CREATE TABLE IF NOT EXISTS customers (` | The other half of the join: id, name, email, image_url. |
| 35 | `app/ui/invoices/table.tsx:46` → `{invoices?.map((invoice) => (` | Back in the Server Component: the rows are turned into the mobile cards (this map) and the desktop table rows (the second `invoices?.map` further down). |
| 36 | `app/ui/invoices/table.tsx:65` → `<InvoiceStatus status={invoice.status} />` | Each row shows a paid/pending badge (the mobile cards use the first one shown; the desktop table row repeats it further down). |
| 37 | `app/ui/invoices/status.tsx:4` → `export default function InvoiceStatus({ status }: { status: string }) {` | The badge component (green for paid, grey for pending). |
| 38 | `app/ui/invoices/table.tsx:75` → `<UpdateInvoice id={invoice.id} />` | Each row gets the edit button and the delete button (again once for the mobile card and once for the desktop row). |
| 39 | `app/ui/invoices/delete-button.tsx:12` → `const deleteInvoiceWithId = deleteInvoice.bind(null, id);` | The delete button opens a confirmation dialog whose form is bound to the delete Server Action with this row's id. |
| 40 | `app/dashboard/invoices/page.tsx:56` → `<Pagination totalPages={totalPages} />` | The pagination bar (a Client Component) gets the page count from step 15. |
| 41 | `app/ui/invoices/pagination.tsx:14` → `const createPageURL = (pageNumber: number \| string) => {` | Each page link keeps the current `query` and only changes `page`. |
| 42 | `app/ui/search.tsx:38` → `const handleSearch = useDebouncedCallback((term: string) => {` | Typing in the search box (browser side): after 300 ms of no typing, the term goes into the URL. |
| 43 | `app/ui/search.tsx:46` → `` replace(`${pathname}?${params.toString()}`); `` | The URL is replaced without a page reload; Next asks the server for the new render, and the trace starts again at row 1 with the new `?query=`. |
| 44 | `app/dashboard/invoices/error.tsx:7` → `export default function Error({` | If anything above throws (for example the database is down), this boundary shows "Something went wrong" and a "Try again" button instead of a crash. |

## 3. Eight Patterns

| # | Pattern | Where it shows up | How it works |
|---|---|---|---|
| 1 | **Server Component data fetching** | `app/ui/dashboard/cards.tsx:24` → `} = await fetchCardData();` then `app/lib/data.ts:76` → `const data = await Promise.all([` | A component is `async`, awaits a function from `data.ts`, and renders the result. The database client and its URL never reach the browser. `Promise.all` starts the three card queries at the same time. |
| 2 | **Streaming with Suspense and loading files** | `app/dashboard/(overview)/page.tsx:29` → `<Suspense fallback={<CardsSkeleton />}>` and `app/dashboard/(overview)/loading.tsx:4` → `return <DashboardSkeleton />;` | Each slow section sits in its own `<Suspense>` with a skeleton. The page shell arrives first and each section replaces its skeleton when its own query finishes. `loading.tsx` does the same for the whole page. |
| 3 | **State in the URL** (search and pagination) | `app/ui/search.tsx:40` → `params.set('page', '1');` and `app/ui/invoices/pagination.tsx:16` → `params.set('page', pageNumber.toString());` | The search term and page live in `?query=&page=`, not in React state. The server page reads them, so links can be shared and the back button works. Search resets the page to 1. |
| 4 | **Mutations with Server Actions** | `app/lib/actions.ts:76` → `export async function createInvoice(`, then `app/lib/actions.ts:125` → `revalidatePath('/dashboard/invoices');` and `app/lib/actions.ts:127` → `redirect('/dashboard/invoices');` | A form's `action` is a server function. It validates, writes with SQL, clears the cached pages with `revalidatePath`, then `redirect`s. The edit and delete forms use `.bind(null, id)`, for example `app/ui/invoices/edit-form.tsx:23` → `const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);`. |
| 5 | **Validation with Zod and form state** | `app/lib/actions.ts:27` → `const FormSchema = z.object({`, `app/lib/actions.ts:83` → `const validatedFields = CreateInvoice.safeParse({` and `app/ui/invoices/create-form.tsx:23` → `const [state, formAction] = useActionState(createInvoice, initialState);` | One schema is the single source of truth for what is valid. `safeParse` returns field messages as data (the `State` type), `useActionState` hands them to the form, and each message sits in an `aria-live` region linked with `aria-describedby`, for example `app/ui/invoices/create-form.tsx:75` → `aria-describedby="amount-error"`. |
| 6 | **Error handling** | `app/dashboard/invoices/error.tsx:7` → `export default function Error({`, `app/dashboard/invoices/[id]/edit/not-found.tsx:5` → `export default function NotFound() {`, `app/dashboard/invoices/[id]/edit/page.tsx:29` → `notFound();` and `app/lib/actions.ts:63` → `function databaseMessage(action: string, error: unknown): string {` | Three tools. Expected problems (bad input) come back as form messages. A missing record calls `notFound()` for a real 404. Unexpected failures land in `error.tsx`. Database errors are logged by type only and shown as one generic message, never the raw error. `redirect()` and `notFound()` work by throwing, so the SQL `try` blocks are kept narrow and `app/lib/actions.ts:64` → `unstable_rethrow(error);` lets them pass through. |
| 7 | **Authentication guard, in three layers** | `proxy.ts:4` → `export default NextAuth(authConfig).auth;`, `app/lib/data.ts:20` → `const requireSession = cache(async () => {` and `app/lib/actions.ts:16` → `async function requireUser() {` | The proxy redirects signed-out visitors (optimistic, fast). Every database read checks the session again, and every Server Action does too, because a Server Action is a public POST endpoint and a proxy matcher is not a security boundary. Login itself: `auth.ts:34` → `const passwordsMatch = await bcrypt.compare(password, user.password);` behind `app/lib/actions.ts:298` → `await signIn('credentials', formData);`. |
| 8 | **Layouts, route groups and the server/client boundary** | `app/dashboard/layout.tsx:3` → `export default function Layout({ children }: { children: React.ReactNode }) {`, `app/dashboard/(overview)/page.tsx:17` → `export default async function Page() {`, and the `'use client'` files `app/ui/search.tsx:1` → `'use client';`, `app/ui/invoices/pagination.tsx:1` → `'use client';`, `app/ui/dashboard/nav-links.tsx:1` → `'use client';` | Everything is a Server Component unless it needs the browser (hooks, event handlers), and only those few files say `'use client'`. A layout wraps many pages and stays mounted. A folder in parentheses, `(overview)`, groups files without changing the URL, so its `loading.tsx` applies only to `/dashboard`. |

## 4. Three Improvements

### 1. One shared database client instead of four

**What I would change.** The app builds its own `postgres(...)` client in four files: `app/lib/data.ts:14` → `const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });`, `app/lib/actions.ts:10` → `const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });`, `auth.ts:9` → `const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });` and `app/seed/route.ts:6` → `const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });`. I would create `app/lib/db.ts` that exports one `sql` and import it everywhere.

**Why.** Each client is its own connection pool, and the library opens up to 10 connections per pool by default. Four pools in one running instance can therefore open up to 40 connections, and on a serverless host every extra instance multiplies that again. Databases cap connections (the exact cap depends on the plan and on whether the pooled endpoint is used), and hitting the cap shows up as "too many connections" errors under load. I did not measure this on the live database; it is the reasoning behind the change. Four copies of `{ ssl: 'require' }` and the environment variable also mean four places to change when the connection setup changes (a pooled URL, a timeout, logging).

**How, and the risk.** A new `db.ts`, four one-line import changes, no behaviour change. Keep one client per server process (in development, store it on `globalThis` so hot reloads do not leak pools). Low risk, and every existing check can be re-run unchanged.

### 2. Per-user ownership, and hardening the login

**What I would change.** Today there is a single level of access: any signed-in person can see, edit and delete every invoice. The `invoices` table has no owner column (`app/seed/route.ts:37` → `CREATE TABLE IF NOT EXISTS invoices (`), reads filter only by search text (for example the `WHERE` at `app/lib/data.ts:121` → `` customers.name ILIKE ${`%${query}%`} OR ``), and the update and delete statements match on the invoice id alone. I would add `user_id` to `invoices` (with a foreign key), put the signed-in user's id into the session, and add `AND invoices.user_id = ${userId}` to every read and every write. At the same time I would add a login rate limit and shorter, revocable sessions.

**Why.** With one user this is invisible; with two users it is a data leak. It is a common gap in tutorial apps, and the guards are already in the right places (the session check in `app/lib/data.ts:20` → `const requireSession = cache(async () => {` and `app/lib/actions.ts:16` → `async function requireUser() {`), so the work is giving them an identity to filter on. The login has no throttling (`auth.ts:25` → `async authorize(credentials) {` accepts unlimited attempts), and sessions are stateless tokens, so signing out only deletes the browser's copy; a stolen cookie keeps working until it expires. Both limits are recorded in VERIFICATION.md: the missing rate limit I confirmed by reading the code, and the stateless-session point follows from how the token sessions work (I could not demonstrate a cookie replay, because the real cookie is HttpOnly).

**How, and the risk.** A migration for the new column (and a decision for the existing rows), then query changes in one place per function. The cost is moderate and touches every query, so it needs the automated tests from improvement 3 first. Rate limiting needs a small store (a table or a hosted key-value service); database-backed sessions trade a little speed for the ability to revoke.

### 3. Automated tests and a CI check inside the repository

**What I would change.** Every check this project passed was run by throwaway scripts kept outside the repository, and the results are written down by hand in VERIFICATION.md. I would move that into the repo: Playwright tests that sign in and exercise search, pagination, create, edit and delete against `next start`; small Vitest unit tests for the pure helpers such as the pagination function in `app/lib/utils.ts:38` → `export const generatePagination = (currentPage: number, totalPages: number) => {` and the Zod schema at `app/lib/actions.ts:27` → `const FormSchema = z.object({`; and a GitHub Actions workflow that runs lint, `tsc`, the build and the tests on every push, against a separate Neon branch so the real data is never touched.

**Why.** These scripts caught real bugs that lint, TypeScript and the build all passed: a dashboard that stayed frozen at build-time numbers after edits, a favicon that redirected signed-in users to the dashboard, a negative page number that made the database error, and an edit form that hangs when submitted without JavaScript. Without tests in the repo, each of those can come back unnoticed the next time someone edits a file, and the redesign planned for this app is exactly that kind of broad change.

**How, and the risk.** The first tests are the checks already written; the main work is a repeatable test database (a Neon branch seeded by the existing `/seed` route) and a sign-in helper. Low risk to the app itself; the cost is the time to keep the suite fast and stable.
