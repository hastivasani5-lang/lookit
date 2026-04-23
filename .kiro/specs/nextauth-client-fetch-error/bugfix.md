# Bugfix Requirements Document

## Introduction

The NextAuth client throws a `CLIENT_FETCH_ERROR` because the `/api/auth/*` route is returning an HTML page (likely a 404 or error page) instead of JSON. This causes the client-side NextAuth session fetch to fail with `"Unexpected token '<', "<!DOCTYPE "... is not valid JSON"`. The bug affects all NextAuth client operations — session retrieval, sign-in, and sign-out — in this Next.js 16.2.2 (Turbopack) project.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the NextAuth client fetches `/api/auth/session` THEN the system returns an HTML document instead of a JSON response, causing a JSON parse error

1.2 WHEN the NextAuth client fetches any `/api/auth/*` endpoint THEN the system returns a non-JSON response (HTML error or 404 page), making all auth operations fail

1.3 WHEN `NEXTAUTH_URL` is set to `http://localhost:3000` but the app is accessed on a different port or host THEN the system misroutes internal NextAuth API calls and returns HTML instead of JSON

### Expected Behavior (Correct)

2.1 WHEN the NextAuth client fetches `/api/auth/session` THEN the system SHALL return a valid JSON response with the session data or an empty object `{}`

2.2 WHEN the NextAuth client fetches any `/api/auth/*` endpoint THEN the system SHALL return a valid JSON response appropriate to the requested operation

2.3 WHEN `NEXTAUTH_URL` is correctly configured for the running environment THEN the system SHALL route all internal NextAuth API calls to the catch-all route handler at `src/app/api/auth/[...nextauth]/route.ts` and return JSON

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user submits valid credentials via the credentials provider THEN the system SHALL CONTINUE TO authenticate the user and establish a session

3.2 WHEN a user is already authenticated THEN the system SHALL CONTINUE TO return their session data including `id`, `role`, `name`, `email`, `image`, `location`, `profileBoostedUntil`, and `approvalStatus`

3.3 WHEN a professional user with a rejected approval status attempts to sign in THEN the system SHALL CONTINUE TO block login and redirect to `/login?error=approval-rejected`

3.4 WHEN a Google OAuth user who is not registered attempts to sign in THEN the system SHALL CONTINUE TO redirect to `/signup?email=<their_email>`

3.5 WHEN a user signs out THEN the system SHALL CONTINUE TO clear the session and redirect appropriately
