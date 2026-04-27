# Bugfix Requirements Document

## Introduction

The book shop's "View Details" page has a Reviews tab that is non-functional in three ways: students cannot submit reviews (no submission form exists), existing reviews are not scoped to the specific book being viewed (they show all reviews for the professional), and the professional whose book was reviewed receives no notification when a new review is submitted. These issues break the end-to-end review flow for both students and professionals.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a student visits the "View Details" page for a book and opens the Reviews tab THEN the system displays existing reviews but provides no form or UI for the student to submit a new review

1.2 WHEN the Reviews tab loads for a specific book THEN the system fetches and displays all reviews for the professional (filtered only by `professionalId`), not just reviews for that specific book (ignoring `contentId`)

1.3 WHEN a student submits a review via the `/api/profile/reviews` POST endpoint THEN the system saves the review but does not send any notification to the professional whose book was reviewed

### Expected Behavior (Correct)

2.1 WHEN a logged-in student visits the "View Details" page for a book and opens the Reviews tab THEN the system SHALL display a review submission form (star rating + text input + submit button) allowing the student to post a review

2.2 WHEN the Reviews tab loads for a specific book that has a `contentId` THEN the system SHALL fetch and display only reviews whose `contentId` matches that book's `contentId`, not all reviews for the professional

2.3 WHEN a student successfully submits a review THEN the system SHALL create a notification entry for the professional (in the professional's notification feed) indicating a new review was received, including the student name, rating, and review text

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a professional opens their dashboard notification drawer THEN the system SHALL CONTINUE TO display existing follow and purchase notifications alongside any new review notifications

3.2 WHEN a student who is not logged in visits the "View Details" page THEN the system SHALL CONTINUE TO show existing reviews in read-only mode without a submission form

3.3 WHEN the `/api/profile/reviews` GET endpoint is called by a professional THEN the system SHALL CONTINUE TO return all reviews for that professional (used for the dashboard overview stats)

3.4 WHEN a review is submitted for a professional who has no `contentId`-scoped reviews THEN the system SHALL CONTINUE TO save the review with the `professionalId` and optional `contentId` fields as before

3.5 WHEN the shop ratings endpoint (`/api/shop/ratings`) is called THEN the system SHALL CONTINUE TO calculate average ratings grouped by `contentId` for display on shop listing pages
