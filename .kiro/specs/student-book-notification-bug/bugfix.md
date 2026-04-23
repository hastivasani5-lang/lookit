# Bugfix Requirements Document

## Introduction

When a professional adds a book via the professional dashboard, follower students do not receive a notification in their student dashboard. The notification pipeline exists (`notifyFollowers` → `getFollowerIds` → `appendStudentNotification`) and is called correctly in `POST /api/profile/library`, but students report seeing no notification. The bug affects the `new_content` notification fan-out for book additions, breaking the expected real-time awareness for students who follow a professional.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a professional adds a book via the professional dashboard THEN the system does not deliver a `new_content` notification to the student dashboard of followers

1.2 WHEN a student who follows a professional opens or is already on the student dashboard after a book is added THEN the system shows no new notification badge or entry for that book

1.3 WHEN the `notifyFollowers` function encounters an error (e.g., follower lookup fails or `appendStudentNotification` throws) THEN the system silently swallows the error and no notification is created

### Expected Behavior (Correct)

2.1 WHEN a professional adds a book via the professional dashboard THEN the system SHALL create a `new_content` notification for every student who follows that professional

2.2 WHEN a student who follows a professional opens or is already on the student dashboard after a book is added THEN the system SHALL display the new notification (badge count and notification entry) within the next poll cycle (≤ 30 seconds) or on next page load

2.3 WHEN the `notifyFollowers` function encounters an error during fan-out THEN the system SHALL log the error with enough detail (professionalId, error message) to diagnose the failure

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a professional adds a video (not a book) THEN the system SHALL CONTINUE TO deliver a `new_content` notification to follower students

3.2 WHEN a student does not follow the professional who added a book THEN the system SHALL CONTINUE TO not deliver a notification to that student

3.3 WHEN a student opens the notification panel THEN the system SHALL CONTINUE TO mark all notifications as read and clear the unread badge

3.4 WHEN a professional adds a book and has zero followers THEN the system SHALL CONTINUE TO complete the book-add successfully without error

3.5 WHEN a student polls `/api/student/notifications` THEN the system SHALL CONTINUE TO return only that student's own notifications sorted by most recent first
