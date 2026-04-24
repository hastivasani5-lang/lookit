# Requirements Document

## Introduction

Yeh feature student ke daily work time goal tracking ko end-to-end complete karta hai. Teen main parts hain:

1. **AutoPopupModal Work Time Options Fix** — Login ke baad popup mein "Work Time" question ke options ko vague ranges se specific numeric hour values mein convert karna, taaki system ek exact `goalHours` number set kar sake.

2. **Calendar Red Dates** — CalendarWidget mein un dates ko red color mein highlight karna jab student ka `workedHours < goalHours` ho (past dates ke liye bhi), taaki student apni progress visually dekh sake.

3. **Navbar Missed-Goal Notification** — Jab student apna daily work goal miss kare (next day login kare ya din khatam ho), toh navbar bell icon mein ek server-side notification push karna jo exact worked vs goal hours bataye.

## Glossary

- **AutoPopupModal**: Login ke baad dikhne wala onboarding popup (`AutoPopupModal.tsx`) jo student se profile questions poochta hai.
- **CalendarWidget**: `StudentProfileDashboard.tsx` ke andar ka calendar component jo work sessions track karta hai.
- **WorkGoal**: Student ka daily work hour target, `localStorage` key `lookit-work-goal-{userId}` mein stored (numeric, e.g. `2`).
- **WorkSession**: Ek din ka work data, `localStorage` key `lookit-work-session-{userId}-{year}-{month}-{day}` mein stored (`{ workedHours: number, timeline: [...] }`).
- **StudentNotificationStore**: Server-side store (`student-notifications-store.ts`) jo `appendStudentNotification(studentId, type, message)` expose karta hai.
- **Navbar**: `Navbar.tsx` component jo `/api/student/notifications` se har 30 seconds mein notifications fetch karta hai.
- **MissedGoalChecker**: Naya server-side API endpoint jo login ke time ya periodic check pe missed goal detect karta hai aur notification push karta hai.
- **studyTime**: `AutoPopupModal` mein "Work Time" question ka `localStorage` answer key (`student_profile_answers_{userId}` object ke andar).

---

## Requirements

### Requirement 1: Work Time Options Specific Numeric Values

**User Story:** As a student, I want to select a specific number of hours as my daily work goal during onboarding, so that the system can set an exact goal and track my progress accurately.

#### Acceptance Criteria

1. THE AutoPopupModal SHALL display the following Work Time options: `["1 hour", "2 hours", "4 hours", "6 hours", "8 hours", "Never"]`.
2. WHEN a student selects a Work Time option (other than "Never"), THE AutoPopupModal SHALL map the selected label to its corresponding numeric hour value and save it as `goalHours` in `localStorage` key `lookit-work-goal-{userId}`.
3. WHEN a student selects "Never", THE AutoPopupModal SHALL save `0` as `goalHours` in `localStorage` key `lookit-work-goal-{userId}`.
4. THE AutoPopupModal SHALL save the selected label string (e.g., "2 hours") in `studyTime` field of `student_profile_answers_{userId}` in `localStorage`, as it does today.
5. WHEN the AutoPopupModal saves profile answers, THE AutoPopupModal SHALL also write the numeric `goalHours` value to `localStorage` key `lookit-work-goal-{userId}` in the same save operation.
6. THE WorkTimeOptions mapping SHALL be: `"1 hour" → 1`, `"2 hours" → 2`, `"4 hours" → 4`, `"6 hours" → 6`, `"8 hours" → 8`, `"Never" → 0`.

---

### Requirement 2: Calendar Red Dates for Missed Work Goal

**User Story:** As a student, I want to see past dates highlighted in red on my calendar when I didn't meet my daily work goal, so that I can visually track which days I fell short.

#### Acceptance Criteria

1. WHEN the CalendarWidget renders a date cell, THE CalendarWidget SHALL read the WorkSession data for that date from `localStorage` key `lookit-work-session-{userId}-{year}-{month}-{day}`.
2. WHEN a date is in the past (strictly before today) AND the WorkGoal (`lookit-work-goal-{userId}`) is greater than `0` AND the `workedHours` for that date is less than the WorkGoal, THE CalendarWidget SHALL render that date cell with a red background color.
3. WHEN a date is today AND the WorkGoal is greater than `0` AND the current `workedHours` is less than the WorkGoal, THE CalendarWidget SHALL render today's date cell with an amber/yellow warning color (not red, since the day is not over).
4. WHEN the WorkGoal is `0` (i.e., student selected "Never"), THE CalendarWidget SHALL NOT apply any red or warning color to any date cell.
5. WHEN a date has `workedHours >= goalHours` AND goalHours > 0, THE CalendarWidget SHALL render that date cell with a green color to indicate goal met.
6. WHEN the CalendarWidget reads a date's WorkSession from localStorage and no data exists for that date, THE CalendarWidget SHALL treat `workedHours` as `0` for that date.
7. THE CalendarWidget SHALL apply red/green/amber coloring only to dates within the currently viewed month that are on or before today (future dates SHALL NOT be colored).

---

### Requirement 3: Navbar Missed-Goal Notification on Next Login

**User Story:** As a student, I want to receive a notification in the navbar when I missed my daily work goal the previous day, so that I am aware of my missed goal and can stay motivated.

#### Acceptance Criteria

1. WHEN a student logs in (session is authenticated), THE MissedGoalChecker SHALL check whether a missed-goal notification for the previous calendar day has already been sent to that student.
2. WHEN the previous day's `workedHours` is less than the student's `goalHours` AND `goalHours > 0` AND no missed-goal notification for that specific date has already been sent, THE MissedGoalChecker SHALL call `appendStudentNotification(studentId, "announcement", message)` with a message in the format: `"You missed your work goal on {date} — you worked {workedHours} hrs but your goal was {goalHours} hrs."`.
3. WHEN the MissedGoalChecker sends a notification, THE MissedGoalChecker SHALL record the date for which the notification was sent, so that duplicate notifications for the same missed day are not created.
4. THE MissedGoalChecker SHALL expose a POST API endpoint at `/api/student/check-missed-goal` that accepts `{ date: string, workedHours: number, goalHours: number }` in the request body.
5. WHEN the `/api/student/check-missed-goal` endpoint is called by an unauthenticated user, THE MissedGoalChecker SHALL return HTTP 401.
6. WHEN the `/api/student/check-missed-goal` endpoint is called by a non-student user, THE MissedGoalChecker SHALL return HTTP 403.
7. WHEN the CalendarWidget mounts and the student has a WorkGoal > 0, THE CalendarWidget SHALL call `/api/student/check-missed-goal` with the previous day's date and `workedHours` from localStorage.
8. THE Navbar SHALL continue to fetch notifications from `/api/student/notifications` every 30 seconds and display missed-goal notifications alongside other notification types.
9. IF the `StudentNotification` type does not include `"work_goal_missed"`, THEN THE StudentNotificationStore SHALL use the existing `"announcement"` type for missed-goal notifications.

---

### Requirement 4: Deduplication of Missed-Goal Notifications

**User Story:** As a student, I want to receive only one missed-goal notification per missed day, so that my notification inbox is not flooded with duplicate alerts.

#### Acceptance Criteria

1. THE MissedGoalChecker SHALL maintain a record of which `(studentId, date)` pairs have already had a missed-goal notification sent, stored server-side.
2. WHEN `/api/student/check-missed-goal` is called for a `(studentId, date)` pair that already has a notification, THE MissedGoalChecker SHALL return HTTP 200 with `{ alreadySent: true }` and SHALL NOT create a duplicate notification.
3. WHEN `/api/student/check-missed-goal` is called for a `(studentId, date)` pair that has NOT yet had a notification AND `workedHours < goalHours` AND `goalHours > 0`, THE MissedGoalChecker SHALL create the notification and return HTTP 201 with `{ notificationId: string }`.
4. WHEN `/api/student/check-missed-goal` is called with `workedHours >= goalHours` OR `goalHours === 0`, THE MissedGoalChecker SHALL return HTTP 200 with `{ skipped: true }` and SHALL NOT create any notification.
