# Implementation Plan: Banner Advertising

## Overview

Implement the full banner advertising flow: professionals submit banners via their dashboard, admins review them, and approved banners rotate in the `CategoryDiscountBanner` slider. Uses file-based JSON persistence following existing codebase patterns.

## Tasks

- [x] 1. Create data store and seed file
  - [x] 1.1 Create `data/banners.json` with empty banners array
    - Initialize with `{ "banners": [] }` mirroring `data/reviews.json` pattern
    - _Requirements: 3.1_
  - [x] 1.2 Create `src/lib/banners-store.ts` with full CRUD operations
    - Implement `createBanner`, `getBannersByProfessional`, `getAllBanners`, `getApprovedBanners`, `updateBannerStatus`
    - Auto-create `data/banners.json` if missing on first read (mirror `reviews-store.ts` pattern)
    - Validate required fields (non-empty title ≤ 100 chars, imageUrl present, link present) and throw on invalid input
    - Set `reviewedAt` to ISO timestamp on approve/reject, `null` on creation
    - _Requirements: 3.1, 2.3, 2.4, 2.5_
  - [ ]* 1.3 Write property test for submission round-trip (Property 1)
    - **Property 1: Submitted banner appears in professional's list**
    - **Validates: Requirements 2.6, 3.1, 3.2, 3.3**
  - [ ]* 1.4 Write property test for missing required fields rejection (Property 2)
    - **Property 2: Empty/whitespace title or missing image/link is rejected**
    - **Validates: Requirements 2.3, 2.4, 2.5**
  - [ ]* 1.5 Write property test for approve/reject round-trip (Property 3)
    - **Property 3: Approve/reject updates status and sets reviewedAt**
    - **Validates: Requirements 3.5, 4.4, 4.5**
  - [ ]* 1.6 Write property test for approved banners filter (Property 4)
    - **Property 4: Only approved banners returned by getApprovedBanners**
    - **Validates: Requirements 5.1, 5.2, 5.3**
  - [ ]* 1.7 Write property test for banner serialization round-trip (Property 6)
    - **Property 6: JSON serialize/deserialize produces deeply equal BannerRecord**
    - **Validates: Requirements 3.1**

- [x] 2. Implement API routes
  - [x] 2.1 Create `src/app/api/banners/route.ts` — POST and GET
    - `POST`: accept `multipart/form-data`, validate required fields, save image to `/public/banners/`, call `createBanner`, return 201 with new record; return 400 on validation failure, 401 if no session, 500 on disk error
    - `GET`: return all banners for the authenticated professional via `getBannersByProfessional`; return 401 if no session
    - _Requirements: 3.2, 3.3, 2.6, 2.8_
  - [x] 2.2 Create `src/app/api/banners/approved/route.ts` — GET
    - Return all approved banners via `getApprovedBanners`; no auth required (public endpoint)
    - _Requirements: 3.4, 5.1_
  - [x] 2.3 Create `src/app/api/admin/banners/route.ts` — GET
    - Return all banners via `getAllBanners`; require `admin_session` cookie (mirror existing admin route pattern), return 401 if missing
    - _Requirements: 3.4, 4.2_
  - [x] 2.4 Create `src/app/api/admin/banners/[id]/route.ts` — PATCH
    - Accept `{ status: "approved" | "rejected" }`, call `updateBannerStatus`
    - On rejection: append notification to `data/notifications.json` using existing `ProfessionalNotification` shape with `details` containing the banner title
    - Return 404 if banner not found, 400 if invalid status, 401 if no admin session
    - _Requirements: 3.5, 4.4, 4.5, 6.1, 6.2, 6.3_
  - [ ]* 2.5 Write property test for rejection notification contains banner title (Property 5)
    - **Property 5: Rejection notification details field contains the banner title**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [ ] 3. Checkpoint — Ensure all store and API tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Add "Add Banner" tab and BannerForm to professional dashboard
  - [x] 4.1 Add `"banner"` to `AddContentTab` union in `src/components/professional/DashboardTypes.ts`
    - Extend `AddContentTab = "books" | "videos" | "classes" | "banner"`
    - _Requirements: 1.1_
  - [x] 4.2 Add "Add Banner" tab button and `BannerForm` inline to `src/components/professional/AddSection.tsx`
    - Add "Add Banner" tab to the existing tab bar with matching active/inactive styling
    - Render `BannerForm` when `addContentTab === "banner"` — fields: image upload, title (max 100), description (max 300), destination link (URL)
    - Manage banner form state locally within `AddSection` (image file, title, description, link, error, success, submitting)
    - On submit: `POST /api/banners` with `multipart/form-data`; show inline validation errors for missing image/title/link; show success message and reset on 201; retain values and show error on 500
    - Client-side: warn if image file > 5 MB before submitting
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [x] 5. Create AdminBannersPanel and wire into AdminPanelView
  - [x] 5.1 Create `src/components/admin/AdminBannersPanel.tsx`
    - Accept props: `banners`, `loading`, `onApprove`, `onReject`, `currentPage`, `totalPages`, `onPageChange`
    - Display table/list with: professional name, email, banner title, submission date, status pill (amber=pending, green=approved, red=rejected — matching existing approval status styling), image thumbnail
    - Show "Approve" and "Reject" buttons only when `status === "pending"`; show no action buttons for approved/rejected
    - _Requirements: 4.2, 4.3, 4.6, 4.7, 4.8_
  - [ ]* 5.2 Write property test for action button visibility by status (Property 7)
    - **Property 7: Pending shows both buttons; approved/rejected shows neither**
    - **Validates: Requirements 4.7, 4.8**
  - [x] 5.3 Add `"Banners"` to `AdminSection` type and wire `AdminBannersPanel` into `src/components/admin/AdminPanelView.tsx`
    - Add `"Banners"` to `AdminSection` union type
    - Add "Banners" entry to `menuItems` array with an appropriate icon (e.g. `Image` from lucide-react)
    - Add state and fetch logic for banners (`GET /api/admin/banners`) and handlers for approve/reject (`PATCH /api/admin/banners/[id]`)
    - Render `<AdminBannersPanel>` when `activeSection === "Banners"`
    - _Requirements: 4.1, 4.2, 4.4, 4.5_

- [x] 6. Update CategoryDiscountBanner to display approved banners as slides
  - [x] 6.1 Fetch approved banners and implement slide logic in `src/components/CategoryDiscountBanner.tsx`
    - On mount, fetch `GET /api/banners/approved`
    - Build slide array: if approved banners exist, include them alongside (or replacing) the default slide; if none, show only the default slide
    - Auto-rotate slides every 5 seconds using `setInterval`; reset timer on manual navigation
    - Render navigation dots showing current slide index and total count
    - Each professional banner slide renders: banner image (via `next/image`), title, description, and a link to the destination URL
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  - [ ]* 6.2 Write property test for approved banner slide fields (Property 8)
    - **Property 8: Each approved banner slide contains image src, title, description, and destination link**
    - **Validates: Requirements 5.4**

- [ ] 7. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` with a minimum of 100 iterations per property
- The `admin_session` cookie check mirrors the pattern in existing admin routes (e.g. `src/app/api/admin/login/route.ts`)
- Image uploads follow the same `/public/banners/` path already used by the existing `banner-1776860710328-slcqjj.jpg` file
