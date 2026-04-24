# Implementation Plan: Professional Certificate Send

## Overview

Implement student grouping in the purchases table and a certificate send feature inside the student drawer. Uses TypeScript throughout, following existing file-based JSON store and NextAuth session patterns.

## Tasks

- [x] 1. Create `src/lib/group-purchases.ts` utility
  - Export a pure `groupPurchases(purchases: PurchaseRow[])` function that reduces `PurchaseRow[]` into `StudentGroup[]` using a `Map`
  - Export the `StudentGroup` type: `{ studentId, studentName, purchaseCount, uniqueItemCount, latestPurchaseTime }`
  - _Requirements: 1.1, 1.2, 1.3, 1.5_

  - [ ]* 1.1 Write property test for groupPurchases — Property 1: one row per unique studentId
    - **Property 1: Grouping produces one row per unique studentId**
    - **Validates: Requirements 1.1**

  - [ ]* 1.2 Write property test for groupPurchases — Property 2: latestPurchaseTime is the max
    - **Property 2: Grouped row shows most recent purchaseTime**
    - **Validates: Requirements 1.2**

  - [ ]* 1.3 Write property test for groupPurchases — Property 3: purchaseCount and studentName are correct
    - **Property 3: Grouped row shows correct purchase count and student name**
    - **Validates: Requirements 1.3, 1.5**

- [x] 2. Create `src/lib/certificate-store.ts`
  - Export `CertificateRecord` type: `{ id, professionalId, studentId, studentName, issuedAt, message }`
  - Export `getCertificates(): Promise<CertificateRecord[]>` — reads `data/certificates.json`, auto-initializes with `{ "certificates": [] }` if missing
  - Export `appendCertificate(cert: CertificateRecord): Promise<CertificateRecord>` — appends and writes back
  - Use the same `fs/promises` + `path.join(process.cwd(), "data", ...)` pattern as `payment-store.ts`
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 3. Create `src/app/api/profile/certificates/route.ts`
  - GET: authenticate via `getServerSession(authOptions)`, return 401 if not professional; filter `getCertificates()` by `professionalId`; support optional `?studentId=` query param
  - POST: authenticate; validate body `{ studentId, studentName, message? }`; check student has a `completed` payment with this professional (403 if not); check no certificate already sent today for same `(professionalId, studentId)` pair (409 if duplicate); create record with `id = cert-{Date.now()}-{randomSuffix}`, call `appendCertificate`, return 201
  - Return 401 if unauthenticated
  - _Requirements: 2.2, 2.3, 2.6, 2.7, 2.8, 3.4, 4.4_

  - [ ]* 3.1 Write property test for certificate POST — Property 5: round-trip persists all fields with unique id
    - **Property 5: Certificate POST round-trip — persists record with all required fields and unique id**
    - **Validates: Requirements 2.2, 2.4, 4.1, 4.4**

  - [ ]* 3.2 Write property test for certificate POST — Property 6: duplicate prevention returns 409
    - **Property 6: Duplicate certificate prevention**
    - **Validates: Requirements 2.3**

  - [ ]* 3.3 Write property test for certificate POST — Property 7: no purchases means 403
    - **Property 7: Authorization guard — no purchases means 403**
    - **Validates: Requirements 2.7, 2.8**

  - [ ]* 3.4 Write property test for certificate GET — Property 8: filter returns only matching certificates
    - **Property 8: GET filter returns only matching certificates**
    - **Validates: Requirements 3.4**

- [x] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Update `purchases/page.tsx` — student grouping in table
  - Import `groupPurchases` and `StudentGroup` from `src/lib/group-purchases.ts`
  - Add `studentGroups` derived state via `useMemo(() => groupPurchases(purchases), [purchases])`
  - Replace `selectedStudent: string | null` with `selectedStudentId: string | null`
  - Replace table rows from `paginated` (raw purchases) to paginated `studentGroups`; update columns to: Student, Purchases, Last Purchase Time, and a "View All" button that sets `selectedStudentId`
  - Update pagination to use `studentGroups.length` instead of `purchases.length`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ]* 5.1 Write property test for drawer filter — Property 4: drawer receives all purchases for selected student
    - **Property 4: Drawer receives all purchases for the selected student**
    - **Validates: Requirements 1.4**

- [x] 6. Update `purchases/page.tsx` — certificate state and drawer UI
  - Add certificate state: `certSent: boolean | null`, `certSending: boolean`, `certError: string`
  - On `selectedStudentId` change, fetch `GET /api/profile/certificates?studentId={selectedStudentId}` and set `certSent = certificates.length > 0`
  - Update drawer header to use `selectedStudentId` to filter purchases (by `studentId` not `studentName`)
  - Add "Send Certificate" button in drawer footer: disabled when `certSending === true`; hidden and replaced by "Certificate Sent ✓" badge when `certSent === true`
  - On button click: set `certSending = true`, POST to `/api/profile/certificates`, handle 409 ("Certificate already sent today"), handle other errors ("Failed to send certificate. Please try again."), on success set `certSent = true` and show "Certificate sent successfully"
  - Reset cert state when drawer closes
  - _Requirements: 2.1, 2.3, 2.5, 3.1, 3.2, 3.3_

  - [ ]* 6.1 Write property test for drawer rendering — Property 9: certSent drives badge vs button
    - **Property 9: Certificate status drives badge vs button rendering**
    - **Validates: Requirements 2.1, 3.2**

  - [ ]* 6.2 Write property test for drawer rendering — Property 10: certSending disables button
    - **Property 10: Loading state disables the send button**
    - **Validates: Requirements 3.3**

- [x] 7. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` (already available in Next.js TypeScript projects)
- Tag format for property tests: `// Feature: professional-certificate-send, Property {N}: {property_text}`
