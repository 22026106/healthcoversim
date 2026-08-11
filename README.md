# HealthCoverSim — Private Health Insurance Quote Simulator

A learning simulator (not real financial advice) for creating, viewing, editing
and deleting private health insurance quotes, with a full premium breakdown.

## Tech stack

- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: SQLite (via `better-sqlite3`)

## How to install and run locally

You need Node.js 18+ installed.

### 1. Database
The database is created automatically the first time the server starts, by
running `init.sql` (see `server/db.js`). No manual step is required, but if
you want to inspect the schema it's in `/init.sql` at the project root.

### 2. Backend
```bash
cd server
npm install
npm start
```
This starts the API on `http://localhost:4000`. On first run it creates
`server/healthcoversim.db` and the `quotes` table.

### 3. Frontend
In a second terminal:
```bash
cd client
npm install
npm run dev
```
This starts the app on `http://localhost:5173`. The Vite dev server proxies
`/api/*` requests to the backend on port 4000 (see `client/vite.config.js`),
so just open `http://localhost:5173` in your browser.

## How the database is used

Only the **raw inputs** for each quote are stored (customer name, cover type,
each applicant's age and cover history, hospital/extras levels, payment
frequency, annual discount, notes). The premium itself is never stored —
`server/calc.js` recalculates the full breakdown every time a quote is
fetched (list, detail, after create/edit). This keeps all pricing logic in
one place, so the stored data and the displayed price can never drift apart.

## How the quote calculation works

For each applicant, on **hospital cover only**:
1. Look up the hospital tier price (e.g. Silver = $160/adult/month).
2. Work out that applicant's Lifetime Health Cover (LHC) loading:
   - Had cover before ("Yes") → 0% loading.
   - Never had cover ("No") → loading = `(age − 30) × 2%`, but only if
     age > 30 and a hospital tier other than "None" is selected. Age ≤ 30 →
     0%.
   - "Not sure" → 0% loading is applied (we don't guess), but the quote is
     flagged with a warning that it may be inaccurate.
   - Hospital cover = "None" → no loading applies to anyone (nothing to load).
3. That applicant's hospital premium = tier price × (1 + loading).

These per-applicant hospital premiums are summed for the **hospital total**.
Extras cover is priced per adult at the extras tier price with **no LHC
loading** — extras total = extras tier price × number of adults (1 for
Single, 2 for Couple/Family). Family cover adds a flat **$30/month** upgrade
fee automatically (dependants aren't priced individually).

monthly premium = hospital total + extras total + family fee
yearly before disc. = monthly premium × 12
yearly after disc. = yearly before discount × (1 − annual discount%) [Yearly payers only]

Monthly payers never receive the annual-payment discount — it's only applied
when `paymentFrequency === 'Yearly'`.

This was verified against the assignment's worked example (Family, Applicant
1: age 40/no prior cover, Applicant 2: age 35/prior cover, Silver hospital,
Standard extras, Yearly with 5% discount) and produces exactly $472/month,
$5,664/year before discount, $5,380.80/year after discount.

## Validation

Both the frontend (`client/src/components/QuoteForm.jsx`) and the backend
(`server/validate.js`) independently check: customer name and all cover
selections present; ages between 18–100; Applicant 2 age/history required for
Couple/Family; annual discount between 0–10% when paying yearly. The backend
never trusts the frontend — invalid API requests return a `400` with a clear
error message rather than crashing or silently computing a bad quote. This
was manually tested: missing Applicant 2 fields, ages outside 18–100,
Hospital = None with "No" history (confirms no loading), "Not sure" history
(confirms the warning is shown), and a discount above 10% were all correctly
rejected or handled.

## What AI helped with

This project's code (React components, Express routes, the SQLite schema,
and the pricing/validation logic) was generated with the help of Claude
(Anthropic), based on this assignment's specification, including the pricing
tables and the Section 7 worked example used to verify the calculation. I
reviewed, ran, and tested every file myself — including manually testing the
CRUD flow and the required edge cases through the running app — and can
explain how the quote calculation and CRUD flow work end-to-end.

## Known limitation

The app does not support authentication or multiple users — all quotes are
visible to anyone who opens the app. It's a single-user local simulator, in
line with the assignment's scope.