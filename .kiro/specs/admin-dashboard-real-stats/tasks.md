# Implementation Plan: admin-dashboard-real-stats

## Overview

Implement the stats API route and update `AdminPanelView` to fetch and display real counts. Two files are touched: one new (`route.ts`), one modified (`AdminPanelView.tsx`).

## Tasks

- [ ] 1. Create the stats API route
  - Create `src/app/api/admin/stats/route.ts` with `export const runtime = "nodejs"`
  - Read the existing `/api/admin/payments` route for the auth pattern (admin_session cookie check via `await cookies()`)
  - Call `getAllUsers()` and `getPayments()` concurrently with `Promise.all`
  - Count `studentCount` = users filtered by `role === "student"`, `professionalCount` = users filtered by `role === "professional"`, `transactionCount` = payments array length
  - Return `Response.json({ studentCount, professionalCount, transactionCount })` on success, `Response.json({ message: "Unauthorized" }, { status: 401 })` if no valid session
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 1.1, 2.1, 3.1_

  - [ ]* 1.1 Write property test for role counts partitioning (Property 1)
    - **Property 1: Role counts partition the user list**
    - Generate random arrays of users with random role distributions; assert `studentCount + professionalCount === users.length` and each count matches filtered length
    - Tag: `// Feature: admin-dashboard-real-stats, Property 1: role counts partition the user list`
    - **Validates: Requirements 1.1, 2.1**

  - [ ]* 1.2 Write property test for transaction count (Property 2)
    - **Property 2: Transaction count equals payment record count**
    - Generate random arrays of payment records; assert `transactionCount === payments.length`
    - Tag: `// Feature: admin-dashboard-real-stats, Property 2: transaction count equals payment record count`
    - **Validates: Requirements 3.1**

  - [ ]* 1.3 Write property test for response shape (Property 3)
    - **Property 3: Stats response shape is always complete**
    - Generate random valid user and payment arrays; call the counting logic directly; assert response has all three fields as non-negative integers
    - Tag: `// Feature: admin-dashboard-real-stats, Property 3: stats response shape is always complete`
    - **Validates: Requirements 4.2**

  - [ ]* 1.4 Write property test for unauthenticated rejection (Property 4)
    - **Property 4: Unauthenticated requests are always rejected**
    - Generate random/absent cookie values that are not valid; call the route handler; assert status 401 is always returned
    - Tag: `// Feature: admin-dashboard-real-stats, Property 4: unauthenticated requests are always rejected`
    - **Validates: Requirements 4.3, 4.4**

- [ ] 2. Checkpoint — verify the API route works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Update `AdminPanelView.tsx` with `formatStat` and state
  - Add pure helper `formatStat(n: number): string` — returns `String(n)` if `n < 1000`, otherwise `(n / 1000).toFixed(1).replace(/\.0$/, "") + "K"`
  - Add `DashboardStats` type and `dashboardStats` state with initial value `{ studentCount: "...", professionalCount: "...", transactionCount: "..." }`
  - _Requirements: 1.3, 2.3, 3.3, 5.1_

  - [ ]* 3.1 Write property test for formatStat (Property 5)
    - **Property 5: Number formatting is correct for all non-negative integers**
    - Generate random non-negative integers; assert plain string below 1000, "K"-suffixed string above with correct numeric prefix
    - Tag: `// Feature: admin-dashboard-real-stats, Property 5: number formatting is correct for all non-negative integers`
    - **Validates: Requirements 1.3, 2.3, 3.3**

- [ ] 4. Add `useEffect` fetch logic to `AdminPanelView.tsx`
  - Add `useEffect` that fires when `activeSection === "Dashboard"`
  - Fetch `/api/admin/stats`; on success call `formatStat` on each count and update state
  - On failure (non-OK response or thrown error): set all three values to `"N/A"`, log to `console.error`, schedule retry via `setTimeout` after 5 seconds
  - Use an `isMounted` flag and clear the retry timeout in the cleanup function to avoid state updates after unmount
  - Replace the three hardcoded JSX values (`15.00K`, `200`, `5.6K`) with `{dashboardStats.studentCount}`, `{dashboardStats.professionalCount}`, `{dashboardStats.transactionCount}`
  - _Requirements: 1.2, 2.2, 3.2, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4_

- [ ] 5. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use **fast-check** and run a minimum of 100 iterations each
- The route handler follows the same auth pattern as `/api/admin/payments` — check that route before implementing
- Read `node_modules/next/dist/docs/` for current Next.js 15 API conventions before writing route code (`cookies()` is async, `Response.json` is the correct return method)
