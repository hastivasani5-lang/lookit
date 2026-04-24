# Bugfix Requirements Document

## Introduction

The application produces a `CLIENT_FETCH_ERROR` in the browser console from next-auth. The error message is:

```
[next-auth][error][CLIENT_FETCH_ERROR]
"Unexpected token '<', "<!DOCTYPE "... is not valid JSON"
```

This means next-auth's client-side session fetching is receiving an HTML response (typically a 404 or error page) instead of the expected JSON from a next-auth API route. The bug manifests in two related areas: a missing API route for professional session tracking (`/api/professionals/session`), and image hostnames used in the codebase that are absent from `next.config.ts` `remotePatterns`, causing Next.js Image optimization to fail and return error HTML.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a professional user logs in or out and the client calls `POST /api/professionals/session` or `DELETE /api/professionals/session` THEN the system returns a 404 HTML page instead of a JSON response, triggering `CLIENT_FETCH_ERROR`

1.2 WHEN next-auth's client attempts to parse the response from `/api/professionals/session` THEN the system throws `"Unexpected token '<', "<!DOCTYPE "... is not valid JSON"` because the 404 response body is an HTML document

1.3 WHEN a Next.js `<Image>` component renders with a `src` hostname that is not listed in `next.config.ts` `remotePatterns` THEN the system returns an HTML error page from the image optimization endpoint instead of the optimized image

1.4 WHEN the image optimization endpoint returns an HTML error page for an unconfigured hostname THEN the system may cause downstream fetch errors as components attempt to handle the unexpected response

### Expected Behavior (Correct)

2.1 WHEN a professional user logs in or out and the client calls `POST /api/professionals/session` or `DELETE /api/professionals/session` THEN the system SHALL respond with a valid JSON response (e.g., `{ "ok": true }`) and an appropriate HTTP status code

2.2 WHEN next-auth's client receives the response from `/api/professionals/session` THEN the system SHALL parse it as valid JSON without throwing a `CLIENT_FETCH_ERROR`

2.3 WHEN a Next.js `<Image>` component renders with any hostname used in the codebase THEN the system SHALL serve the optimized image successfully because all required hostnames are present in `next.config.ts` `remotePatterns`

2.4 WHEN all image hostnames are configured in `remotePatterns` THEN the system SHALL NOT return HTML error pages from the image optimization endpoint for those hostnames

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a non-professional user (student or admin) accesses the application THEN the system SHALL CONTINUE TO handle their session via next-auth without errors

3.2 WHEN a professional user authenticates via credentials or Google OAuth THEN the system SHALL CONTINUE TO create a valid JWT session and redirect correctly

3.3 WHEN the next-auth handler at `/api/auth/[...nextauth]` receives GET or POST requests THEN the system SHALL CONTINUE TO respond with valid JSON for all standard next-auth endpoints (`/api/auth/session`, `/api/auth/csrf`, `/api/auth/providers`, etc.)

3.4 WHEN a Next.js `<Image>` component renders with a hostname already present in `remotePatterns` THEN the system SHALL CONTINUE TO serve the optimized image as before

3.5 WHEN an unauthenticated user calls `POST /api/professionals/session` or `DELETE /api/professionals/session` THEN the system SHALL CONTINUE TO return a `401 Unauthorized` JSON response

3.6 WHEN a non-professional authenticated user calls `POST /api/professionals/session` or `DELETE /api/professionals/session` THEN the system SHALL CONTINUE TO return a `403 Forbidden` JSON response
