# Student Book Notification Bug — Bugfix Design

## Overview

When a professional adds a book, `notifyFollowers` is called with the correct `professionalId`
and fan-out logic exists, but follower students never see a notification. The root cause is a
**write-queue race condition** in `appendStudentNotification`: the function reads the full
notification array, appends one entry, and writes it back — with no serialization. When
`Promise.all` fires multiple concurrent calls (one per follower), every call reads the same
stale snapshot and each write overwrites the previous, leaving only the last notification
persisted. A secondary issue is that the `try/catch` in `notifyFollowers` logs errors without
including the `professionalId`, making silent failures hard to diagnose.

The fix serializes writes in `appendStudentNotification` using a module-level write queue
(matching the pattern already used in `content-library-store.ts`) and improves the error log.

---

## Glossary

- **Bug_Condition (C)**: A `notifyFollowers` call where the professional has ≥ 2 followers,
  causing concurrent `appendStudentNotification` writes that race and overwrite each other.
- **Property (P)**: After `notifyFollowers` resolves, every follower student has exactly one
  new `new_content` notification in the store for that event.
- **Preservation**: All behaviors unrelated to the concurrent-write path — video fan-out,
  non-follower isolation, mark-all-read, zero-follower no-op — must remain unchanged.
- **`appendStudentNotification`**: The function in `src/lib/student-notifications-store.ts`
  that reads the full notification array, prepends a new entry, and writes it back.
- **`notifyFollowers`**: The inline async function in `src/app/api/profile/library/route.ts`
  that resolves follower IDs and fans out via `Promise.all`.
- **write queue**: A module-level `Promise` chain that serializes async writes to prevent
  read-modify-write races, as used in `content-library-store.ts`.

---

## Bug Details

### Bug Condition

The bug manifests when `notifyFollowers` is called for a professional with two or more
followers. `Promise.all` launches all `appendStudentNotification` calls concurrently. Each
call independently reads the current notification array (all see the same snapshot), appends
its own entry, and writes back — so every write except the last is silently discarded.

**Formal Specification:**
```
FUNCTION isBugCondition(professionalId)
  INPUT: professionalId of type string
  OUTPUT: boolean

  followerCount := LENGTH(getFollowerIds(professionalId))
  RETURN followerCount >= 2
         AND notifyFollowers is called with Promise.all (concurrent writes)
         AND appendStudentNotification has no write serialization
END FUNCTION
```

### Examples

- Professional `060fe115` has 3 followers (`42d3d5d9`, `8914df09`, `e6c13fda`). After adding
  a book, only 1 of the 3 notifications is persisted — the other 2 are overwritten.
  **Expected**: 3 notifications created. **Actual**: 1 notification created.

- Professional with exactly 1 follower: no race occurs, notification is always created.
  **Expected**: 1 notification. **Actual**: 1 notification (works by accident).

- Professional with 0 followers: `Promise.all([])` resolves immediately, no writes occur.
  **Expected**: no notifications, no error. **Actual**: correct (no bug).

- Professional with 5 followers: 5 concurrent reads all see the same array; 5 writes race;
  only the last write survives. **Expected**: 5 notifications. **Actual**: 1 notification.

---

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Video fan-out (`notifyFollowers` called from the video branch) must continue to work
  exactly as before — the fix must not alter the call site or the video path.
- Students who do not follow the professional must not receive any notification.
- `markAllStudentNotificationsRead` must continue to mark only the requesting student's
  notifications as read and leave others untouched.
- Adding a book when the professional has zero followers must complete without error and
  leave the notification store unchanged.
- `getStudentNotifications(studentId)` must continue to return only that student's
  notifications, sorted by `createdAt` descending.

**Scope:**
All inputs where `isBugCondition` does NOT hold — single-follower fan-out, video fan-out,
non-follower queries, mark-read operations — must be completely unaffected by this fix.

---

## Hypothesized Root Cause

1. **Concurrent read-modify-write with no serialization**: `appendStudentNotification` does
   `readAll()` → append → `writeAll()` with no locking. `Promise.all` in `notifyFollowers`
   launches all calls simultaneously. All reads return the same snapshot; all writes race;
   only the last write survives. This is the primary cause.

2. **Silent error swallowing with insufficient context**: The `try/catch` in `notifyFollowers`
   calls `console.error("[notifyFollowers] fan-out error:", err)` but does not include
   `professionalId`, making it impossible to correlate a log line to a specific professional
   when diagnosing failures in production.

3. **`/api/notifications/followers` stub**: The GET handler returns `{ data: [] }` always.
   This is not the cause of the bug but is a misleading dead-end during investigation.

---

## Correctness Properties

Property 1: Bug Condition — All Follower Notifications Persisted

_For any_ `professionalId` where `isBugCondition` holds (≥ 2 followers), after
`notifyFollowers(professionalId, "new_content", message)` resolves, the fixed
`appendStudentNotification` SHALL have created exactly one new `new_content` notification
for **every** follower student, with all notifications present in the store simultaneously.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation — Non-Follower and Single-Follower Behavior Unchanged

_For any_ input where `isBugCondition` does NOT hold (0 or 1 follower, video fan-out,
mark-read, or non-follower query), the fixed code SHALL produce exactly the same observable
result as the original code, preserving notification isolation, sort order, and zero-follower
no-op behavior.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

---

## Fix Implementation

### Changes Required

**File**: `src/lib/student-notifications-store.ts`

**Function**: `appendStudentNotification`

**Specific Changes:**

1. **Add a module-level write queue**: Declare `let writeQueue: Promise<void> = Promise.resolve();`
   at module scope, mirroring the pattern in `content-library-store.ts`.

2. **Serialize writes through the queue**: Wrap the read-append-write body of
   `appendStudentNotification` so each invocation chains onto `writeQueue` before executing,
   ensuring sequential execution regardless of how many concurrent callers exist.

3. **Re-read inside the queue callback**: Move `readAll()` inside the queued closure so each
   write sees the latest committed state, not a stale snapshot captured before the queue slot.

4. **Improve error logging in `notifyFollowers`**: Update the `console.error` call to include
   `professionalId` so failures are diagnosable:
   `console.error("[notifyFollowers] fan-out error for professional", professionalId, err);`

No changes are needed to the call sites in `route.ts` — `notifyFollowers` already passes the
correct `professionalId` from the session.

---

## Testing Strategy

### Validation Approach

Two-phase: first run exploratory tests on **unfixed** code to surface the race condition and
confirm the root cause; then verify the fix satisfies Property 1 and Property 2.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples demonstrating the race on unfixed code. Confirm that
concurrent `appendStudentNotification` calls drop notifications.

**Test Plan**: Call `appendStudentNotification` concurrently for multiple students (simulating
`Promise.all` fan-out) and assert that all notifications are present in the store afterward.
Run on **unfixed** code to observe failures.

**Test Cases:**
1. **Two-follower concurrent write**: Call `appendStudentNotification` for 2 students
   simultaneously via `Promise.all`; assert both notifications exist. (fails on unfixed code)
2. **Five-follower concurrent write**: Call for 5 students simultaneously; assert all 5
   notifications exist. (fails on unfixed code — only 1 survives)
3. **Sequential writes still work**: Call for 2 students sequentially (await each); assert
   both exist. (passes on unfixed code — confirms the race is the cause)
4. **Single follower**: Call for 1 student; assert notification exists. (passes on unfixed
   code — confirms single-follower case is unaffected)

**Expected Counterexamples:**
- After concurrent writes, `readAll()` returns fewer notifications than the number of callers.
- Possible causes: no write queue, all reads see the same stale snapshot before any write
  commits, last write wins.

### Fix Checking

**Goal**: Verify Property 1 — all follower notifications are persisted after the fix.

**Pseudocode:**
```
FOR ALL professionalId WHERE isBugCondition(professionalId) DO
  followerIds := getFollowerIds(professionalId)
  AWAIT notifyFollowers(professionalId, "new_content", "Test book")
  FOR EACH studentId IN followerIds DO
    notifications := getStudentNotifications(studentId)
    ASSERT EXISTS n IN notifications WHERE n.type = "new_content"
  END FOR
END FOR
```

### Preservation Checking

**Goal**: Verify Property 2 — all non-buggy-condition behaviors are unchanged.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT fixedBehavior(input) = originalBehavior(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because
it generates many random student/professional ID combinations and verifies isolation and sort
order hold across all of them.

**Test Cases:**
1. **Non-follower isolation**: After fan-out for professional P, assert no notification exists
   for any student not in P's follower list.
2. **Sort order preservation**: After appending multiple notifications for one student, assert
   `getStudentNotifications` returns them sorted by `createdAt` descending.
3. **Mark-all-read preservation**: After fan-out creates notifications, call
   `markAllStudentNotificationsRead` for one student and assert only that student's
   notifications are marked read; others remain unread.
4. **Zero-follower no-op**: Call `notifyFollowers` for a professional with no followers;
   assert store is unchanged and no error is thrown.
5. **Video fan-out unchanged**: Call `notifyFollowers` with type `"new_content"` for a video
   message; assert behavior is identical to the book path.

### Unit Tests

- Test `appendStudentNotification` with concurrent calls (2, 5, 10 students) and assert all
  notifications are persisted.
- Test sequential calls still work after the queue is introduced.
- Test `notifyFollowers` error path: mock `appendStudentNotification` to throw, assert
  `console.error` is called with `professionalId` in the message.

### Property-Based Tests

- Generate random sets of follower IDs (size 2–20) and verify that after concurrent fan-out,
  every follower has exactly one new notification.
- Generate random notification arrays and verify `getStudentNotifications` always returns
  only the target student's entries, sorted descending.
- Generate random mixed-student notification stores and verify `markAllStudentNotificationsRead`
  only mutates the target student's records.

### Integration Tests

- Full flow: create a professional with followers in the test store, POST to
  `/api/profile/library` with a book payload, then GET `/api/student/notifications` for each
  follower and assert the notification appears.
- Verify the video path (`kind: "video"`) also fans out correctly after the fix.
- Verify a professional with zero followers can add a book without error.
