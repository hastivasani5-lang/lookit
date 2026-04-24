# Design Document: Banner Advertising

## Overview

The Banner Advertising feature lets professionals submit banner ads through their dashboard. Submitted banners are reviewed by the admin, who can approve or reject them. Approved banners are fetched and displayed as rotating slides in the `CategoryDiscountBanner` component. Rejected banners trigger a notification to the professional via the existing notifications system.

The implementation follows the established patterns in this codebase: file-based JSON persistence (mirroring `data/reviews.json`, `data/notifications.json`), a dedicated store module in `src/lib/`, Next.js App Router API routes, and React client components for UI.

## Architecture

```mermaid
flowchart TD
    A[Professional Dashboard\nAddSection tab bar] -->|POST multipart/form-data| B[POST /api/banners]
    B --> C[banners-store.ts]
    C --> D[data/banners.json]

    E[Admin Panel\nAdminBannersPanel] -->|GET| F[GET /api/admin/banners]
    E -->|PATCH status| G[PATCH /api/admin/banners/[id]]
    F --> C
    G --> C
    G -->|on reject| H[notifications-store.ts]
    H --> I[data/notifications.json]

    J[CategoryDiscountBanner] -->|GET| K[GET /api/banners/approved]
    K --> C

    L[Professional Dashboard] -->|GET| M[GET /api/banners]
    M --> C
```

**Data flow summary:**
1. Professional submits banner via `AddSection` (new "Add Banner" tab) → `POST /api/banners` → `data/banners.json`
2. Admin reviews via `AdminBannersPanel` → `PATCH /api/admin/banners/[id]` → updates status in `data/banners.json`; on rejection, appends to `data/notifications.json`
3. `CategoryDiscountBanner` fetches `GET /api/banners/approved` and renders approved banners as slides

## Components and Interfaces

### New Files

| File | Purpose |
|------|---------|
| `src/lib/banners-store.ts` | File-based persistence for `data/banners.json` |
| `src/app/api/banners/route.ts` | `POST` (submit) and `GET` (professional's own banners) |
| `src/app/api/banners/approved/route.ts` | `GET` approved banners (public) |
| `src/app/api/admin/banners/route.ts` | `GET` all banners (admin) |
| `src/app/api/admin/banners/[id]/route.ts` | `PATCH` approve/reject (admin) |
| `src/components/admin/AdminBannersPanel.tsx` | Admin UI panel for reviewing banners |
| `data/banners.json` | Persistent storage for banner requests |

### Modified Files

| File | Change |
|------|--------|
| `src/components/professional/DashboardTypes.ts` | Add `"banner"` to `AddContentTab` union |
| `src/components/professional/AddSection.tsx` | Add "Add Banner" tab and `BannerForm` inline |
| `src/components/admin/AdminPanelView.tsx` | Add `"Banners"` to `AdminSection` type, `menuItems`, state, and render `AdminBannersPanel` |
| `src/components/CategoryDiscountBanner.tsx` | Fetch approved banners and render as slides |

### BannerForm (inside AddSection)

Fields:
- Banner image upload (`<input type="file" accept="image/*">`)
- Title (text, max 100 chars)
- Description (textarea, max 300 chars)
- Destination link (URL input)
- "Buy Now" submit button

State managed locally within `AddSection` when `addContentTab === "banner"`.

### AdminBannersPanel Props

```typescript
type AdminBannersPanelProps = {
  banners: BannerRecord[];
  loading: boolean;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};
```

### CategoryDiscountBanner Slide Interface

```typescript
type BannerSlide =
  | { type: "default" }
  | { type: "professional"; id: string; imageUrl: string; title: string; description: string; link: string };
```

## Data Models

### BannerRecord (`data/banners.json`)

```typescript
type BannerStatus = "pending" | "approved" | "rejected";

type BannerRecord = {
  id: string;                  // "banner-{timestamp}-{random}"
  professionalId: string;
  professionalName: string;
  professionalEmail: string;
  title: string;               // max 100 chars
  description: string;         // max 300 chars
  link: string;                // destination URL
  imageUrl: string;            // "/banners/{filename}"
  status: BannerStatus;
  createdAt: string;           // ISO 8601
  reviewedAt: string | null;   // ISO 8601, set on approve/reject
};
```

Storage format in `data/banners.json`:

```json
{
  "banners": []
}
```

This mirrors the `data/reviews.json` pattern (`{ "reviews": [] }`).

### Notification entry (appended to `data/notifications.json` on rejection)

Uses the existing `ProfessionalNotification` shape from `@/types/notifications`:

```typescript
{
  id: string;
  professionalId: string;
  professionalName: string;
  professionalEmail: string;
  summary: string;             // "Banner rejected"
  details: string;             // "Your banner \"<title>\" was rejected."
  changedFields: string[];     // ["Banner rejected"]
  createdAt: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Submission round-trip

*For any* professional ID and valid banner input (non-empty image URL, non-empty title ≤ 100 chars, non-empty destination link), calling `createBanner` and then `getBannersByProfessional` for that professional should return a list containing a banner with the submitted title and `status: "pending"`.

**Validates: Requirements 2.6, 3.1, 3.2, 3.3**

---

### Property 2: Missing required fields are rejected

*For any* banner submission where the title is composed entirely of whitespace, the image URL is absent, or the destination link is absent, the store's `createBanner` function should throw or return an error, and the total banner count in the store should remain unchanged.

**Validates: Requirements 2.3, 2.4, 2.5**

---

### Property 3: Approve/reject round-trip updates status and reviewedAt

*For any* banner record with `status: "pending"`, after calling `updateBannerStatus(id, "approved")` or `updateBannerStatus(id, "rejected")`, a subsequent `getAllBanners()` should return that banner with the new status and a non-null `reviewedAt` timestamp.

**Validates: Requirements 3.5, 4.4, 4.5**

---

### Property 4: Only approved banners appear in the public endpoint

*For any* mix of `pending`, `approved`, and `rejected` banner records in the store, `getApprovedBanners()` should return only records where `status === "approved"`.

**Validates: Requirements 5.1, 5.2, 5.3**

---

### Property 5: Rejection notification contains the banner title

*For any* banner rejection (calling `updateBannerStatus(id, "rejected")` followed by `appendProfessionalNotification`), the resulting notification entry in `data/notifications.json` for the banner's `professionalId` should have a `details` field that contains the banner's title string.

**Validates: Requirements 6.1, 6.2, 6.3**

---

### Property 6: Banner serialization round-trip

*For any* valid `BannerRecord` object, serializing it to JSON and deserializing it should produce a deeply equal object with all fields preserved and correct types.

**Validates: Requirements 3.1**

---

### Property 7: Action button visibility is determined by status

*For any* `BannerRecord`, when rendered by `AdminBannersPanel`: if `status === "pending"` then both "Approve" and "Reject" buttons should be present; if `status === "approved"` or `status === "rejected"` then neither action button should be present.

**Validates: Requirements 4.7, 4.8**

---

### Property 8: Approved banner slide contains all required fields

*For any* approved `BannerRecord`, the rendered slide in `CategoryDiscountBanner` should contain the banner's image (via `src` attribute), title text, description text, and a link element pointing to the banner's destination URL.

**Validates: Requirements 5.4**

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Image upload fails (disk write error) | `POST /api/banners` returns 500; form retains field values and shows error message (Req 2.8) |
| Missing required fields (image, title, link) | `POST /api/banners` returns 400 with field-specific message; form shows inline validation error (Req 2.3–2.5) |
| `PATCH` on non-existent banner ID | Returns 404 |
| `PATCH` with invalid status value | Returns 400 |
| Admin endpoint called without `admin_session` cookie | Returns 401 (mirrors existing admin route pattern) |
| `GET /api/banners` called without authenticated session | Returns 401 |
| `data/banners.json` missing on first run | `banners-store.ts` creates the file with `{ "banners": [] }` (mirrors `reviews-store.ts` pattern) |
| Image file exceeds reasonable size | Client-side validation warns user; server rejects if > 5 MB |

## Testing Strategy

### Unit Tests

Focus on specific examples and edge cases:

- `banners-store.ts`: test `createBanner`, `getBannersByProfessional`, `getAllBanners`, `getApprovedBanners`, `updateBannerStatus` with concrete fixture data
- Validation logic: empty title, whitespace-only title, missing image, missing link
- Notification creation: verify the notification object shape when a banner is rejected
- `GET /api/banners/approved`: verify it filters out `pending` and `rejected` records

### Property-Based Tests

Use a property-based testing library (e.g., `fast-check` for TypeScript/Jest) with a minimum of 100 iterations per property.

Each test is tagged with the design property it validates:

**Feature: banner-advertising, Property 1: Submitted banner appears in professional's list**
- Generator: random `professionalId` (UUID), random non-empty title (≤100 chars), random URL
- Action: call `createBanner`, then `getBannersByProfessional`
- Assert: result contains a banner with matching title and `status: "pending"`

**Feature: banner-advertising, Property 2: Empty/whitespace title or missing image is rejected**
- Generator: strings composed entirely of whitespace characters
- Action: attempt to create a banner with the whitespace title
- Assert: store rejects the input and banner count is unchanged

**Feature: banner-advertising, Property 3: Approve/reject round-trip updates status**
- Generator: random pending `BannerRecord`
- Action: call `updateBannerStatus(id, "approved")` or `updateBannerStatus(id, "rejected")`
- Assert: `getAllBanners()` returns the record with updated status and non-null `reviewedAt`

**Feature: banner-advertising, Property 4: Only approved banners appear in the public slider endpoint**
- Generator: random mix of `pending`, `approved`, `rejected` banner records
- Action: call `getApprovedBanners()`
- Assert: every returned record has `status === "approved"`

**Feature: banner-advertising, Property 5: Rejection triggers a notification for the professional**
- Generator: random `BannerRecord` with `status: "pending"`, random `professionalId`
- Action: call the reject handler (which calls `updateBannerStatus` + `appendProfessionalNotification`)
- Assert: notifications list contains an entry for `professionalId` whose `details` includes the banner title

**Feature: banner-advertising, Property 6: Banner serialization round-trip**
- Generator: random `BannerRecord` objects with all fields populated
- Action: `JSON.parse(JSON.stringify(record))`
- Assert: all fields are deeply equal to the original
