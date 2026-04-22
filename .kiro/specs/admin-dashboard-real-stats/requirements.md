# Requirements Document

## Introduction

This feature replaces the hardcoded statistics on the admin dashboard with real data calculated from the application's data sources. Currently, the dashboard displays static values (Students: 15.00K, Teachers: 200, Awards: 5.6K). This feature will fetch and display actual counts from the JSON data files and/or database.

## Glossary

- **Admin_Dashboard**: The main administrative interface located at `/admin` that displays system statistics and management tools
- **Dashboard_Stats_API**: A new API endpoint that aggregates and returns real-time statistics for the dashboard
- **Student**: A user with role "student" in the system
- **Professional**: A user with role "professional" (also referred to as "teacher" in the UI)
- **Transaction**: A completed payment record in the payments data store
- **Stats_Card**: A UI component displaying a single statistic (label and numeric value)

## Requirements

### Requirement 1: Display Real Student Count

**User Story:** As an admin, I want to see the actual number of students in the system, so that I can monitor user growth accurately.

#### Acceptance Criteria

1. WHEN the Admin_Dashboard loads, THE Dashboard_Stats_API SHALL return the count of all users with role "student"
2. THE Admin_Dashboard SHALL display the student count in the first Stats_Card
3. THE student count SHALL be formatted with appropriate thousand separators (e.g., "1,234" or "15.2K")
4. IF the Dashboard_Stats_API fails, THEN THE Admin_Dashboard SHALL display the previous cached value or "N/A"

### Requirement 2: Display Real Professional Count

**User Story:** As an admin, I want to see the actual number of professionals (teachers) in the system, so that I can track instructor availability.

#### Acceptance Criteria

1. WHEN the Admin_Dashboard loads, THE Dashboard_Stats_API SHALL return the count of all users with role "professional"
2. THE Admin_Dashboard SHALL display the professional count in the second Stats_Card labeled "Teachers"
3. THE professional count SHALL be formatted with appropriate thousand separators
4. IF the Dashboard_Stats_API fails, THEN THE Admin_Dashboard SHALL display the previous cached value or "N/A"

### Requirement 3: Display Real Transaction Count

**User Story:** As an admin, I want to see the actual number of completed transactions (awards), so that I can monitor platform activity and revenue.

#### Acceptance Criteria

1. WHEN the Admin_Dashboard loads, THE Dashboard_Stats_API SHALL return the count of all completed payment transactions
2. THE Admin_Dashboard SHALL display the transaction count in the third Stats_Card labeled "Awards"
3. THE transaction count SHALL be formatted with appropriate thousand separators (e.g., "5.6K")
4. IF the Dashboard_Stats_API fails, THEN THE Admin_Dashboard SHALL display the previous cached value or "N/A"

### Requirement 4: Create Dashboard Statistics API Endpoint

**User Story:** As a developer, I want a dedicated API endpoint for dashboard statistics, so that the frontend can efficiently fetch all stats in a single request.

#### Acceptance Criteria

1. THE Dashboard_Stats_API SHALL be accessible at `/api/admin/stats`
2. WHEN a GET request is made, THE Dashboard_Stats_API SHALL return a JSON response containing studentCount, professionalCount, and transactionCount
3. THE Dashboard_Stats_API SHALL verify admin authentication before returning data
4. IF the user is not authenticated as admin, THEN THE Dashboard_Stats_API SHALL return a 401 Unauthorized response
5. THE Dashboard_Stats_API SHALL read data from the existing user store and payment store
6. THE Dashboard_Stats_API SHALL complete the request within 500ms under normal load

### Requirement 5: Handle Loading and Error States

**User Story:** As an admin, I want to see appropriate feedback while stats are loading or if they fail to load, so that I understand the system status.

#### Acceptance Criteria

1. WHILE the Dashboard_Stats_API request is pending, THE Admin_Dashboard SHALL display loading indicators in the Stats_Cards
2. IF the Dashboard_Stats_API request fails, THEN THE Admin_Dashboard SHALL display an error message or fallback values
3. THE Admin_Dashboard SHALL retry failed requests after 5 seconds
4. THE Admin_Dashboard SHALL log errors to the console for debugging purposes

### Requirement 6: Maintain Existing Dashboard Layout

**User Story:** As an admin, I want the dashboard layout to remain unchanged, so that I can continue using the interface without relearning it.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL maintain the existing three-column grid layout for Stats_Cards
2. THE Stats_Cards SHALL preserve their current styling and visual design
3. THE labels "Students", "Teachers", and "Awards" SHALL remain unchanged
4. THE Admin_Dashboard SHALL display stats in the same order: Students, Teachers, Awards
