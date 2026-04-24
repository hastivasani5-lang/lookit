# Requirements Document

## Introduction

The Banner Advertising feature allows professionals (teachers) to purchase and submit banner ad slots through their dashboard. Submitted banners go to the admin for review. Approved banners appear as slides in the `CategoryDiscountBanner` slider shown to all users. Rejected banners trigger a notification to the professional.

## Glossary

- **Professional**: A registered user with role `professional` who has been approved by the admin.
- **Banner_Request**: A banner submission created by a Professional, containing an image, title, description, link, and payment status.
- **Banner_Slider**: The `CategoryDiscountBanner` component that displays approved banners as rotating slides to all users.
- **Admin**: The administrator who reviews, approves, or rejects Banner_Requests via the Admin Panel.
- **Admin_Panel**: The admin-facing UI at `src/app/admin/page.tsx` and its sub-components.
- **Professional_Dashboard**: The professional-facing UI at `src/app/dashboard/teachers/page.tsx` rendered via `ProfessionalDashboard`.
- **Add_Banner_Tab**: The new tab added to the Books/Videos/Upcoming Class tab bar in the Professional_Dashboard.
- **Banner_Form**: The form shown when the Add_Banner_Tab is active, used to submit a Banner_Request.
- **Banners_Section**: The new section in the Admin_Panel where the Admin manages Banner_Requests.
- **Banner_Notification**: A notification sent to a Professional when their Banner_Request is approved or rejected.

---

## Requirements

### Requirement 1: Add Banner Tab in Professional Dashboard

**User Story:** As a professional, I want an "Add Banner" tab in my dashboard alongside Books, Videos, and Upcoming Class, so that I can access the banner submission form easily.

#### Acceptance Criteria

1. THE Professional_Dashboard SHALL display an "Add Banner" tab in the tab bar that currently contains "Books", "Videos", and "Upcoming Class".
2. WHEN the Professional clicks the "Add Banner" tab, THE Professional_Dashboard SHALL display the Banner_Form and hide the content of other tabs.
3. THE Add_Banner_Tab SHALL use the same visual styling (active/inactive states) as the existing tabs in the tab bar.

---

### Requirement 2: Banner Submission Form

**User Story:** As a professional, I want to fill in banner details and submit a purchase request, so that my banner can be reviewed and displayed to users.

#### Acceptance Criteria

1. THE Banner_Form SHALL include the following fields: banner image upload, title (text, max 100 characters), description (text, max 300 characters), and destination link (URL).
2. THE Banner_Form SHALL include a "Buy Now" button that submits the Banner_Request.
3. WHEN the Professional clicks "Buy Now" without providing a banner image, THEN THE Banner_Form SHALL display a validation error indicating the image is required.
4. WHEN the Professional clicks "Buy Now" without providing a title, THEN THE Banner_Form SHALL display a validation error indicating the title is required.
5. WHEN the Professional clicks "Buy Now" without providing a destination link, THEN THE Banner_Form SHALL display a validation error indicating the link is required.
6. WHEN the Professional submits a valid Banner_Form, THE System SHALL create a Banner_Request with status `pending`, store the uploaded image in `/public/banners/`, and persist the request to `data/banners.json`.
7. WHEN the Banner_Request is successfully submitted, THE Banner_Form SHALL display a success message and reset the form fields.
8. IF the banner image upload fails, THEN THE Banner_Form SHALL display an error message and retain the form field values.

---

### Requirement 3: Banner Request Persistence

**User Story:** As a system, I want banner requests stored persistently, so that the admin can review them and approved banners can be served to users.

#### Acceptance Criteria

1. THE System SHALL persist Banner_Requests to `data/banners.json` with the following fields: `id`, `professionalId`, `professionalName`, `professionalEmail`, `title`, `description`, `link`, `imageUrl`, `status` (`pending` | `approved` | `rejected`), `createdAt`, and `reviewedAt`.
2. THE System SHALL expose a `POST /api/banners` endpoint that accepts a multipart form submission and creates a new Banner_Request with status `pending`.
3. THE System SHALL expose a `GET /api/banners` endpoint that returns all Banner_Requests for the authenticated Professional.
4. THE System SHALL expose a `GET /api/admin/banners` endpoint that returns all Banner_Requests for the Admin.
5. THE System SHALL expose a `PATCH /api/admin/banners/[id]` endpoint that allows the Admin to update the `status` of a Banner_Request to `approved` or `rejected`.

---

### Requirement 4: Admin Banners Section

**User Story:** As an admin, I want a dedicated Banners section in the Admin Panel, so that I can review, approve, or reject pending banner requests.

#### Acceptance Criteria

1. THE Admin_Panel SHALL include a "Banners" entry in the sidebar navigation alongside the existing sections (Dashboard, Users, Approvals, Reviews, Categories, Uploads, Payouts, Alerts).
2. WHEN the Admin navigates to the Banners_Section, THE Admin_Panel SHALL display a list of all Banner_Requests showing: professional name, professional email, banner title, submission date, and current status.
3. THE Banners_Section SHALL display each Banner_Request's status using a visual pill: amber for `pending`, green for `approved`, red for `rejected`, consistent with the existing approval status styling.
4. WHEN the Admin clicks "Approve" on a pending Banner_Request, THE System SHALL update the Banner_Request status to `approved` and update `reviewedAt`.
5. WHEN the Admin clicks "Reject" on a pending Banner_Request, THE System SHALL update the Banner_Request status to `rejected` and update `reviewedAt`.
6. THE Banners_Section SHALL show a preview thumbnail of the banner image for each Banner_Request.
7. WHILE a Banner_Request has status `pending`, THE Banners_Section SHALL display both "Approve" and "Reject" action buttons for that request.
8. WHILE a Banner_Request has status `approved` or `rejected`, THE Banners_Section SHALL display the reviewed status without action buttons.

---

### Requirement 5: Approved Banners in the Banner Slider

**User Story:** As a user, I want to see professionally submitted banners in the banner slider, so that I am exposed to relevant promoted content.

#### Acceptance Criteria

1. THE Banner_Slider SHALL fetch approved Banner_Requests from `data/banners.json` via a `GET /api/banners/approved` endpoint.
2. WHEN at least one Banner_Request has status `approved`, THE Banner_Slider SHALL render each approved banner as a slide alongside or replacing the default promotional slide.
3. WHEN no Banner_Requests have status `approved`, THE Banner_Slider SHALL display the existing default promotional slide.
4. THE Banner_Slider SHALL display each approved banner's image, title, description, and a clickable link pointing to the banner's destination URL.
5. WHEN the Banner_Slider contains more than one slide, THE Banner_Slider SHALL auto-rotate slides with a 5-second interval.
6. THE Banner_Slider SHALL display navigation dots indicating the current slide and total slide count.

---

### Requirement 6: Professional Rejection Notification

**User Story:** As a professional, I want to be notified when my banner is rejected, so that I can take corrective action or resubmit.

#### Acceptance Criteria

1. WHEN the Admin rejects a Banner_Request, THE System SHALL create a notification entry in `data/notifications.json` for the Professional with a message indicating the banner was rejected.
2. THE System SHALL expose the rejection notification via the existing professional notifications API so it appears in the Professional's notification drawer.
3. THE notification message SHALL include the banner title so the Professional can identify which banner was rejected.
