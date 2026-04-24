# nextauth-client-fetch-error Bugfix Design

## Overview

The application emits a `[next-auth][error][CLIENT_FETCH_ERROR]` in the browser console with the message `"Unexpected token '<', "<!DOCTYPE "... is not valid JSON"`. This happens because next-auth's client-side session machinery receives an HTML document instead of JSON from an API endpoint.

Two independent root causes produce this symptom:

1. The route file `src/app/api/professionals/session/route.ts` was missing, so any `POST` or `DELETE` to `/api/professionals/session` returned a Next.js 404 HTML page.
2. Several image hostnames used in the codebase were absent from `next.config.ts` `remotePatterns`, causing the Next.js image-optimization endpoint to return an HTML error page for those images.

The fix is minimal and targeted: add the missing route file (already created) and add the missing hostnames to `remotePatterns`.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug — a request is made to an endpoint that returns HTML instead of JSON, causing next-auth's JSON parser to throw.
- **Property (P)**: The desired behavior — every API endpoint called by next-auth or by professional session tracking returns valid JSON with an appropriate HTTP status code.
- **Preservation**: Existing behavior for all other routes, sessions, and image hostnames that must remain unchanged by the fix.
- **remotePatterns**: The `images.remotePatterns` array in `next.config.ts` that whitelists external image hostnames for Next.js image optimization.
- **CLIENT_FETCH_ERROR**: The next-auth client-side error thrown when `fetch` returns a non-JSON body.
- **`/api/professionals/session`**: The custom route in `src/app/api/professionals/session/route.ts` that records professional login/logout events.

## Bug Details

### Bug Condition

The bug manifests when either of two conditions is true:

1. A `POST` or `DELETE` request is made to `/api/professionals/session` and no route handler exists for that path.
2. A Next.js `<Image>` component renders with a `src` whose hostname is not listed in `next.config.ts` `remotePatterns`, causing the image-optimization endpoint to return an HTML error page.

**Formal Specification:**

```
FUNCTION isBugCondition(input)
  INPUT: input — one of:
           { type: "api-call", method: "POST" | "DELETE", path: "/api/professionals/session" }
           { type: "image-render", hostname: string }
  OUTPUT: boolean

  IF input.type = "api-call" THEN
    RETURN routeFileExists("src/app/api/professionals/session/route.ts") = false
  END IF

  IF input.type = "image-render" THEN
    RETURN input.hostname NOT IN configuredRemotePatternHostnames(next.config.ts)
  END IF

  RETURN false
END FUNCTION
```

### Examples

- `POST /api/professionals/session` when route file is absent → 404 HTML → `CLIENT_FETCH_ERROR` ✗
- `DELETE /api/professionals/session` when route file is absent → 404 HTML → `CLIENT_FETCH_ERROR` ✗
- `<Image src="https://riseuplabs.com/..." />` when `riseuplabs.com` is absent from `remotePatterns` → HTML error page ✗
- `<Image src="https://images.unsplash.com/..." />` when `images.unsplash.com` is present in `remotePatterns` → optimized image ✓ (not a bug)
- `GET /api/auth/session` (standard next-auth route) → JSON response ✓ (not a bug)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Mouse/touch interactions and all non-session-tracking API routes must continue to work exactly as before.
- The next-auth handler at `/api/auth/[...nextauth]` must continue to respond with valid JSON for all standard endpoints (`/api/auth/session`, `/api/auth/csrf`, `/api/auth/providers`, etc.).
- Image hostnames already present in `remotePatterns` must continue to serve optimized images as before.
- Unauthenticated calls to `POST /api/professionals/session` must continue to return `401 Unauthorized` JSON.
- Non-professional authenticated calls to `POST /api/professionals/session` must continue to return `403 Forbidden` JSON.
- Student and admin session flows must remain completely unaffected.

**Scope:**
All inputs that do NOT match the bug condition (i.e., routes that already exist and image hostnames already configured) must be completely unaffected by this fix.

## Hypothesized Root Cause

1. **Missing Route File**: The `src/app/api/professionals/session/route.ts` file was never created (or was deleted). Next.js has no handler for `POST /api/professionals/session` or `DELETE /api/professionals/session`, so it falls through to the 404 page, which returns HTML.

2. **Incomplete `remotePatterns`**: As new image sources were added to components (`CourseGridSection.tsx`, `VideoSlider.tsx`), the corresponding hostnames were not added to `next.config.ts` `remotePatterns`. Next.js image optimization rejects unconfigured hostnames and returns an HTML error response.

3. **No Wildcard Fallback**: The project does not use a wildcard `hostname: "**"` pattern, so every new external image hostname must be explicitly listed. This is correct security practice but requires discipline when adding new image sources.

## Correctness Properties

Property 1: Bug Condition — Session Route and Image Hostnames Return JSON

_For any_ input where the bug condition holds (isBugCondition returns true) — specifically a `POST`/`DELETE` to `/api/professionals/session` or a Next.js Image render with an unconfigured hostname — the fixed system SHALL return a valid JSON response (for the API route) or serve the optimized image successfully (for image hostnames), and SHALL NOT return an HTML document that causes `CLIENT_FETCH_ERROR`.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation — All Other Behavior Unchanged

_For any_ input where the bug condition does NOT hold (isBugCondition returns false) — including all standard next-auth endpoints, already-configured image hostnames, student/admin sessions, and unauthenticated/non-professional calls to the session route — the fixed system SHALL produce exactly the same behavior as the original system, preserving all existing functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

## Fix Implementation

### Changes Required

**Fix 1 — Missing Route**

File: `src/app/api/professionals/session/route.ts`

Status: Already created as part of this fix.

The file exports `POST` and `DELETE` handlers that:
- Retrieve the server session via `getServerSession(authOptions)`
- Return `401` JSON if no session exists
- Return `403` JSON if the user role is not `"professional"`
- Call `markProfessionalLoggedIn` / `markProfessionalLoggedOut` and return `{ ok: true }` with status `200`

No further changes needed for Fix 1.

---

**Fix 2 — Missing Image Hostnames**

File: `next.config.ts`

Function: `nextConfig.images.remotePatterns` array

Specific Changes: Add any hostname used in the codebase that is not yet present in `remotePatterns`. Based on the exploration test in `src/__tests__/bug-exploration.ts`, the hostnames used in the codebase are already present in `next.config.ts` (the route file was the primary missing piece). If the exploration test surfaces additional missing hostnames, add an entry of the form:

```ts
{
  protocol: "https",
  hostname: "<missing-hostname>",
}
```

for each missing hostname.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bugs on unfixed code, then verify the fix works correctly and preserves existing behavior.

The existing file `src/__tests__/bug-exploration.ts` already implements the exploratory phase. It checks:
- That `src/app/api/professionals/session/route.ts` exists and exports a `DELETE` handler.
- That every hostname used in the codebase is present in `next.config.ts` `remotePatterns`.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bugs BEFORE implementing the fix. Confirm or refute the root cause analysis.

**Test Plan**: Run `src/__tests__/bug-exploration.ts` on the unfixed codebase (route file absent, hostnames missing) to observe failures and confirm root causes.

**Test Cases**:
1. **Session Route Existence Test**: Assert that `src/app/api/professionals/session/route.ts` exists — will fail on unfixed code.
2. **DELETE Handler Export Test**: Assert that the route file exports a `DELETE` function — will fail on unfixed code.
3. **Per-Hostname Tests**: For each hostname used in the codebase, assert it is present in `remotePatterns` — will fail for any missing hostname.
4. **Aggregate Missing Hostnames Test**: Assert that the list of missing hostnames is empty — will fail if any are missing.

**Expected Counterexamples**:
- Route file does not exist → `routeExists` is `false`
- One or more hostnames are absent from `remotePatterns` → array does not contain the hostname

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed system produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := fixedSystem(input)
  ASSERT expectedBehavior(result)
    -- For api-call inputs: result.contentType = "application/json" AND result.body is valid JSON
    -- For image-render inputs: result is an optimized image, NOT an HTML error page
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed system produces the same result as the original system.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT originalSystem(input) = fixedSystem(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because it generates many test cases automatically and catches edge cases that manual unit tests might miss.

**Test Plan**: Observe behavior on unfixed code first for standard next-auth endpoints and already-configured image hostnames, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Standard next-auth Endpoints Preservation**: Verify `/api/auth/session`, `/api/auth/csrf`, `/api/auth/providers` continue to return JSON after the fix.
2. **Existing Image Hostnames Preservation**: Verify hostnames already in `remotePatterns` continue to serve images correctly.
3. **Unauthenticated Session Route Preservation**: Verify `POST /api/professionals/session` without a session still returns `401` JSON.
4. **Non-Professional Session Route Preservation**: Verify `POST /api/professionals/session` with a non-professional session still returns `403` JSON.

### Unit Tests

- Test that `POST /api/professionals/session` returns `{ ok: true }` with status `200` for an authenticated professional.
- Test that `DELETE /api/professionals/session` returns `{ ok: true }` with status `200` for an authenticated professional.
- Test that both handlers return `401` for unauthenticated requests.
- Test that both handlers return `403` for non-professional authenticated requests.
- Test that all hostnames in the codebase are present in `remotePatterns` (static analysis test, already in `bug-exploration.ts`).

### Property-Based Tests

- Generate random authenticated professional sessions and verify both `POST` and `DELETE` always return valid JSON with status `200`.
- Generate random sets of image hostnames and verify that any hostname present in `remotePatterns` never triggers an HTML error response from the image-optimization endpoint.
- Generate random non-professional user roles and verify the session route always returns `403` JSON, never HTML.

### Integration Tests

- Test the full professional login flow: authenticate → `POST /api/professionals/session` → verify JSON response → no `CLIENT_FETCH_ERROR` in console.
- Test the full professional logout flow: `DELETE /api/professionals/session` → verify JSON response.
- Test that pages rendering `<Image>` components with all codebase hostnames load without image-optimization errors.
- Test that switching between student and professional accounts does not produce `CLIENT_FETCH_ERROR`.
