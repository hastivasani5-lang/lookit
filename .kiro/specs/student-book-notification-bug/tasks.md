# Implementation Plan

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Concurrent Fan-Out Drops Notifications
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the race condition
  - **Scoped PBT Approach**: Scope the property to concrete failing cases: 2-follower and 5-follower concurrent writes
  - Call `appendStudentNotification` concurrently via `Promise.all` for 2 students; assert both notifications exist in the store
  - Call `appendStudentNotification` concurrently via `Promise.all` for 5 students; assert all 5 notifications exist
  - The test assertions check that `readAll` (via `getStudentNotifications`) returns a notification for every student
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (proves the race condition exists — only 1 notification survives instead of N)
  - Document counterexamples found (e.g., "after 5 concurrent writes, only 1 notification persisted")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Buggy Behaviors Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: sequential `appendStudentNotification` calls on unfixed code all persist correctly
  - Observe: `getStudentNotifications(studentId)` returns only that student's notifications, sorted descending
  - Observe: `markAllStudentNotificationsRead` marks only the target student's notifications as read
  - Observe: zero-follower `notifyFollowers` call completes without error and leaves store unchanged
  - Write property-based tests: for all non-concurrent (sequential) writes, all notifications are persisted
  - Write property-based tests: for any studentId, `getStudentNotifications` returns only that student's entries sorted by `createdAt` desc
  - Write property-based tests: `markAllStudentNotificationsRead` only mutates the target student's records
  - Verify all tests PASS on UNFIXED code (confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [-] 3. Fix concurrent write race in appendStudentNotification

  - [x] 3.1 Implement the fix
    - Add `let writeQueue: Promise<void> = Promise.resolve();` at module scope in `src/lib/student-notifications-store.ts`
    - Wrap the read-append-write body of `appendStudentNotification` in a queued closure: `writeQueue = writeQueue.then(async () => { ... }); await writeQueue;`
    - Move `readAll()` inside the queued closure so each write sees the latest committed state
    - Update `console.error` in `notifyFollowers` (`src/app/api/profile/library/route.ts`) to include `professionalId`: `console.error("[notifyFollowers] fan-out error for professional", professionalId, err);`
    - _Bug_Condition: isBugCondition(professionalId) where followerCount >= 2 AND Promise.all fires concurrent appendStudentNotification calls_
    - _Expected_Behavior: after notifyFollowers resolves, every follower has exactly one new_content notification in the store_
    - _Preservation: video fan-out, non-follower isolation, mark-all-read, zero-follower no-op, and per-student sort order must remain unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Concurrent Fan-Out Drops Notifications
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior (all N notifications persisted)
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms the write queue serializes concurrent writes correctly)
    - _Requirements: 2.1, 2.2_

  - [ ] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Buggy Behaviors Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions in sequential writes, isolation, sort order, mark-read, zero-follower)
    - Confirm all tests still pass after fix (no regressions)

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
